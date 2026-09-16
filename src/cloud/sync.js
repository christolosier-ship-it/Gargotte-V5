import { bindSyncOwner, getAll, getById, confirmOutbox, recordSyncFailure, applyRemoteRevisions } from '../storage/idb.js';
export function neonTransport(client,userId) {
 return {
  async push(batch) {
   const rows=batch.map(op=>({id:op.id,user_id:userId,data:op.payload,
     deleted_at:op.operation==='delete'?op.created_at:null}));
   const {data,error}=await client.from(batch[0].entity).upsert(rows,{onConflict:'user_id,id'}).select('id');
   if(error) throw new Error(error.message);
   if(!data || rows.some(row=>!data.some(d=>d.id===row.id))) throw new Error('Écriture distante non confirmée');
  },
  async pull(cursor) {
   const {data,error}=await client.from('entity_revisions').select('*').gt('revision_id',cursor).order('revision_id',{ascending:true}).limit(100);
   if(error) throw new Error(error.message);
   return data || [];
  }
 };
}
export function createSyncEngine({userId,transport,onStatus=()=>{},onData=()=>{}}) {
 let stopped=false, running=null, timer=null, failures=0;
 async function cycle() {
  await bindSyncOwner(userId);
  let pending=await getAll('sync_outbox');
  onStatus(pending.length ? `Synchronisation : ${pending.length} opération(s)` : 'Vérification distante…');
  while(pending.length && !stopped) {
   const batch=[], ids=new Set(), type=pending[0].entity;
   for(const op of pending) {
    if(op.entity!==type || ids.has(op.id) || batch.length>=50) break;
    ids.add(op.id);batch.push(op);
   }
   try { await transport.push(batch); }
   catch(error) { await recordSyncFailure(batch.map(x=>x.seq),error.message);throw error; }
   // Never acknowledge an operation other than the exact immutable event sent.
   await confirmOutbox(batch.map(x=>x.seq));
   pending=await getAll('sync_outbox');
  }
  while(!stopped) {
   const cursor=(await getById('sync_meta','cursor'))?.value || '0';
   const rows=await transport.pull(cursor);
   if(stopped) return;
   if(!rows.length) break;
   await applyRemoteRevisions(rows,userId);
   await onData();
   if(rows.length<100) break;
  }
  failures=0;
  if(!stopped) onStatus((await getAll('sync_outbox')).length ? 'Modifications locales en attente' : 'Synchronisé');
 }
 async function run() {
  if(stopped) return;
  if(running) return running;
  const work=()=>cycle();
  running=(globalThis.navigator?.locks ? navigator.locks.request('gargottex-sync',work) : work())
    .catch(error=>{failures++;onStatus(`Sauvegarde locale conservée — ${error.message}`);return {error};})
    .finally(()=>{running=null;});
  return running;
 }
 function schedule(delay=300) {
  clearTimeout(timer);
  timer=setTimeout(async()=>{await run();if(!stopped) schedule(Math.min(300000,15000*2**Math.min(failures,5)));},delay);
 }
 function wake(){if(!stopped) schedule();}
 return {run,start(){window.addEventListener('online',wake);window.addEventListener('gargottex-local-write',wake);schedule(0);},
  stop(){stopped=true;clearTimeout(timer);window.removeEventListener('online',wake);window.removeEventListener('gargottex-local-write',wake);}};
}
