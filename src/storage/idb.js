import { ENTITY_TYPES, structuredData } from '../data/structured.js';

const DB_NAME = "gargottex-v5-offline";
const DB_VERSION = 3;

const STORE_DEFS = [
  { name: "sync_outbox", keyPath: "seq", autoIncrement: true },
  { name: "sync_meta", keyPath: "key" },
  { name: "meta", keyPath: "key" },
  { name: "dungeons", keyPath: "id", indexes: ["slug", "name"] },
  { name: "creatures", keyPath: "id", indexes: ["slug", "name", "dungeon_id", "category"] },
  { name: "heroes", keyPath: "id", indexes: ["hero_base_name", "level", "name"] },
  { name: "npcs", keyPath: "id", indexes: ["slug", "name"] },
  { name: "quests", keyPath: "id", indexes: ["slug", "name", "dungeon_id", "npc_id"] },
  { name: "loot_items", keyPath: "id", indexes: ["slug", "name", "creature_id"] },
  { name: "interactables", keyPath: "id", indexes: ["slug", "name", "dungeon_id", "type"] },
  { name: "brouhaha_effects", keyPath: "id", indexes: ["level", "dungeon_id"] },
  { name: "media_assets", keyPath: "id", indexes: ["entity_type", "entity_id", "path"] },
  { name: "logs", keyPath: "id", indexes: ["created_at", "level"] },
];

let dbPromise = null;

function reqToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("IndexedDB request failed"));
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error("IndexedDB transaction failed"));
    tx.onabort = () => reject(tx.error || new Error("IndexedDB transaction aborted"));
  });
}

function openDatabase() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      for (const def of STORE_DEFS) {
        if (db.objectStoreNames.contains(def.name)) continue;
        const store = db.createObjectStore(def.name, { keyPath: def.keyPath, autoIncrement: !!def.autoIncrement });
        for (const idx of def.indexes || []) {
          if (Array.isArray(idx)) {
            store.createIndex(idx[0], idx[1], { unique: !!idx[2] });
          } else {
            store.createIndex(idx, idx, { unique: false });
          }
        }
      }
    };

    req.onblocked = () => {
      const host = typeof document !== 'undefined' && document.getElementById('app');
      if (host) host.textContent = 'Mise à jour locale : fermez les autres onglets Gargottex, puis revenez ici. Vos données sont conservées.';
    };
    req.onsuccess = () => {
      const db=req.result;
      db.onversionchange=()=>{db.close();dbPromise=null;};
      resolve(db);
    };
    req.onerror = () => reject(req.error || new Error("Unable to open IndexedDB"));
  });
  return dbPromise;
}

async function withTx(storeNames, mode, fn) {
  const db = await openDatabase();
  const tx = db.transaction(storeNames, mode);
  const stores = Object.fromEntries(storeNames.map(name => [name, tx.objectStore(name)]));
  const done = txDone(tx);
  try {
    const result = await fn(stores, tx);
    await done;
    return result;
  } catch (error) {
    try { tx.abort(); } catch {}
    await done.catch(() => {});
    throw error;
  }
}

export async function initDatabase(seed) {
  await openDatabase();

  const business = ENTITY_TYPES;
  await withTx([...business, 'meta'], 'readwrite', async stores => {
    const marker = await reqToPromise(stores.meta.get('initialized'));
    let count = 0;
    for (const name of business) count += await reqToPromise(stores[name].count());
    // Never use "no dungeons" as proof that an existing database is empty.
    if (!marker && count === 0 && !globalThis.GARGOTTEX_CONFIG?.neonUrl) {
      for (const name of business) {
        for (const row of seed?.[name] || []) stores[name].put(structuredClone(row));
      }
    }
    stores.meta.put({ key:'initialized', value:true });
    if (!await reqToPromise(stores.meta.get('app_version'))) stores.meta.put({key:'app_version',value:'6.0.0'});
    if (!await reqToPromise(stores.meta.get('ui_state'))) stores.meta.put({key:'ui_state',value:null});
  });
}

export async function getAll(storeName) {
  return await withTx([storeName], "readonly", async ({ [storeName]: store }) => reqToPromise(store.getAll()));
}

export async function getById(storeName, id) {
  return await withTx([storeName], "readonly", async ({ [storeName]: store }) => reqToPromise(store.get(id)));
}

function wakeSync() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('gargottex-local-write'));
}
function enqueue(outbox, storeName, item, operation) {
  outbox.add({ entity:storeName, id:item.id, operation, payload:structuredData(item),
    created_at:new Date().toISOString(), attempts:0, last_error:null });
}
export async function putOne(storeName, item) {
  const [clone] = await putMany(storeName,[item]);
  return clone;
}
export async function putMany(storeName, items) {
  const clones = items.map(v=>structuredClone(v));
  const sync = ENTITY_TYPES.includes(storeName);
  await withTx(sync ? [storeName,'sync_outbox'] : [storeName], 'readwrite', async stores => {
    for (const item of clones) {
      const old = await reqToPromise(stores[storeName].get(item.id ?? item.key));
      stores[storeName].put(item);
      if (sync && JSON.stringify(structuredData(old)) !== JSON.stringify(structuredData(item))) enqueue(stores.sync_outbox,storeName,item,'upsert');
    }
  });
  if (sync) wakeSync();
  return clones;
}
export async function deleteOne(storeName,id) {
  return deleteWhere(storeName, row => row.id===id);
}
export async function clearStore(storeName) {
  if (ENTITY_TYPES.includes(storeName)) return deleteWhere(storeName,()=>true);
  await withTx([storeName],'readwrite',async stores=>{stores[storeName].clear();});
}
export async function deleteWhere(storeName,predicate) {
  const sync = ENTITY_TYPES.includes(storeName);
  const count = await withTx(sync ? [storeName,'sync_outbox'] : [storeName],'readwrite',async stores=>{
    const rows = await reqToPromise(stores[storeName].getAll());
    let count=0;
    for(const row of rows) if(predicate(row)) {
      stores[storeName].delete(row.id);
      if(sync) enqueue(stores.sync_outbox,storeName,row,'delete');
      count++;
    }
    return count;
  });
  if(sync) wakeSync();
  return count;
}
// First account binding is atomic with bootstrap; another account must use another browser profile.
export async function bindSyncOwner(userId) {
  return withTx([...ENTITY_TYPES,'sync_meta','sync_outbox'],'readwrite',async stores=>{
    const current = await reqToPromise(stores.sync_meta.get('owner'));
    if(current && current.value!==userId) throw new Error('Cette copie locale appartient à un autre compte. Utilisez un autre profil de navigateur.');
    if(current) return;
    const pending=await reqToPromise(stores.sync_outbox.getAll());
    for(const type of ENTITY_TYPES) {
      for(const row of await reqToPromise(stores[type].getAll())) {
        if(!pending.some(p=>p.entity===type&&p.id===row.id)) enqueue(stores.sync_outbox,type,row,'upsert');
      }
    }
    stores.sync_meta.put({key:'owner',value:userId});
  });
}
export async function confirmOutbox(seqs) {
  await withTx(['sync_outbox'],'readwrite',async stores=>{ for(const seq of seqs) stores.sync_outbox.delete(seq); });
}
export async function recordSyncFailure(seqs,error) {
  await withTx(['sync_outbox'],'readwrite',async stores=>{
    for(const seq of seqs) {
      const row=await reqToPromise(stores.sync_outbox.get(seq));
      if(row) stores.sync_outbox.put({...row,attempts:row.attempts+1,last_error:String(error).slice(0,300)});
    }
  });
}
export async function applyRemoteRevisions(revisions,userId) {
  await withTx([...ENTITY_TYPES,'sync_meta','sync_outbox'],'readwrite',async stores=>{
    const owner=await reqToPromise(stores.sync_meta.get('owner'));
    if(owner?.value!==userId) throw new Error('Compte de synchronisation incohérent');
    const pending=await reqToPromise(stores.sync_outbox.getAll());
    for(const revision of revisions) {
      const {entity_type:type,entity_id:id,snapshot}=revision;
      if(!ENTITY_TYPES.includes(type)||revision.user_id!==userId||snapshot?.user_id!==userId||snapshot?.id!==id||snapshot?.data?.id!==id) throw new Error('Révision distante invalide');
      if(!pending.some(p=>p.entity===type&&p.id===id)) {
        if(snapshot.deleted_at) stores[type].delete(id);
        else {
          const row=structuredData(snapshot.data);
          if(type==='media_assets') {
            const local=await reqToPromise(stores[type].get(id));
            for(const key of ['blob','thumb_blob']) if(local?.[key]) row[key]=local[key];
          }
          stores[type].put(row);
        }
      }
      stores.sync_meta.put({key:'cursor',value:String(revision.revision_id)});
    }
  });
}
export async function mergeStructuredData(data) {
  await withTx([...ENTITY_TYPES,'sync_outbox'],'readwrite',async stores=>{
    for(const type of ENTITY_TYPES) for(const row of data[type]) {
      const old=await reqToPromise(stores[type].get(row.id));
      const next=structuredClone(row);
      if(type==='media_assets') for(const key of ['blob','thumb_blob']) if(old?.[key]) next[key]=old[key];
      stores[type].put(next);
      if(JSON.stringify(structuredData(old))!==JSON.stringify(row)) enqueue(stores.sync_outbox,type,row,'upsert');
    }
  });
  wakeSync();
}

export async function saveUiState(ui) {
  await putOne("meta", { key: "ui_state", value: structuredClone(ui) });
}

export async function loadUiState() {
  const row = await getById("meta", "ui_state");
  return row?.value ?? null;
}

export async function appendLog(entry) {
  const log = {
    id: entry.id || `${entry.level || "log"}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    level: entry.level || "info",
    message: String(entry.message || ""),
    details: entry.details || "",
    created_at: entry.created_at || new Date().toISOString(),
  };
  await putOne("logs", log);
  return log;
}

export async function getLogs(limit = 100) {
  const rows = await getAll("logs");
  return rows.sort((a, b) => String(b.created_at).localeCompare(String(a.created_at))).slice(0, limit);
}

export async function loadAllData() {
  const names = ENTITY_TYPES;
  const data = {};
  await withTx(names, "readonly", async (stores) => {
    for (const name of names) data[name] = await reqToPromise(stores[name].getAll());
  });
  return data;
}

export async function transaction(storeNames, mode, callback) {
  return withTx(Array.isArray(storeNames) ? storeNames : [storeNames], mode, callback);
}

export { DB_NAME, DB_VERSION, STORE_DEFS };
