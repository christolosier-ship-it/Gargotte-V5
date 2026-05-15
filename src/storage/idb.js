
const DB_NAME = "gargottex-v5-offline";
const DB_VERSION = 2;

const STORE_DEFS = [
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
        const store = db.createObjectStore(def.name, { keyPath: def.keyPath });
        for (const idx of def.indexes || []) {
          if (Array.isArray(idx)) {
            store.createIndex(idx[0], idx[1], { unique: !!idx[2] });
          } else {
            store.createIndex(idx, idx, { unique: false });
          }
        }
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error("Unable to open IndexedDB"));
  });
  return dbPromise;
}

async function withTx(storeNames, mode, fn) {
  const db = await openDatabase();
  const tx = db.transaction(storeNames, mode);
  const stores = Object.fromEntries(storeNames.map(name => [name, tx.objectStore(name)]));
  const result = await fn(stores, tx);
  await txDone(tx);
  return result;
}

export async function initDatabase(seed) {
  await openDatabase();

  const dungeonsCount = await withTx(["dungeons"], "readonly", async ({ dungeons }) => reqToPromise(dungeons.count()));
  if (dungeonsCount === 0) {
    await withTx(STORE_DEFS.map(s => s.name), "readwrite", async (stores) => {
      for (const def of STORE_DEFS) {
        if (def.name === "meta" || def.name === "logs") continue;
        const rows = Array.isArray(seed?.[def.name]) ? seed[def.name] : [];
        for (const row of rows) stores[def.name].put(structuredClone(row));
      }
      stores.meta.put({ key: "ui_state", value: null });
      stores.meta.put({ key: "app_version", value: "5.0.0" });
    });
  } else {
    await withTx(["meta"], "readwrite", async ({ meta }) => {
      const current = await reqToPromise(meta.get("app_version"));
      if (!current) meta.put({ key: "app_version", value: "5.0.0" });
      const ui = await reqToPromise(meta.get("ui_state"));
      if (!ui) meta.put({ key: "ui_state", value: null });
    });
  }
}

export async function getAll(storeName) {
  return await withTx([storeName], "readonly", async ({ [storeName]: store }) => reqToPromise(store.getAll()));
}

export async function getById(storeName, id) {
  return await withTx([storeName], "readonly", async ({ [storeName]: store }) => reqToPromise(store.get(id)));
}

export async function putOne(storeName, item) {
  const clone = structuredClone(item);
  await withTx([storeName], "readwrite", async ({ [storeName]: store }) => { store.put(clone); });
  return clone;
}

export async function putMany(storeName, items) {
  const clones = items.map(v => structuredClone(v));
  await withTx([storeName], "readwrite", async ({ [storeName]: store }) => {
    for (const item of clones) store.put(item);
  });
  return clones;
}

export async function deleteOne(storeName, id) {
  await withTx([storeName], "readwrite", async ({ [storeName]: store }) => { store.delete(id); });
}

export async function clearStore(storeName) {
  await withTx([storeName], "readwrite", async ({ [storeName]: store }) => { store.clear(); });
}

export async function deleteWhere(storeName, predicate) {
  return await withTx([storeName], "readwrite", async ({ [storeName]: store }) => {
    const rows = await reqToPromise(store.getAll());
    let count = 0;
    for (const row of rows) {
      if (predicate(row)) {
        store.delete(row.id);
        count++;
      }
    }
    return count;
  });
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
  const names = STORE_DEFS.filter(s => s.name !== "meta" && s.name !== "logs").map(s => s.name);
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
