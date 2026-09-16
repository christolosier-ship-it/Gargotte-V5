import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import * as db from '../src/storage/idb.js';
import {createMediaEngine,CHUNK_SIZE,sha256} from '../src/cloud/media.js';
import {createSyncEngine} from '../src/cloud/sync.js';
globalThis.GARGOTTEX_CONFIG={neonUrl:'test'};
const owner='media-test-owner';
const originals=new Map(),chunks=new Map();let offline=false,cutAfterChunk=false,writes=0;
const online=()=>{if(offline)throw new Error('Offline');};
const transport={
 async manifest(id){online();return originals.get(id)||null;},
 async create(row){online();originals.set(row.media_id,{...row,chunk_count:Math.ceil(row.byte_size/CHUNK_SIZE),verified_at:null});},
 async chunk(id,index){online();return chunks.get(`${id}:${index}`)||null;},
 async putChunk(id,index,bytes){online();chunks.set(`${id}:${index}`,bytes);writes++;if(cutAfterChunk){cutAfterChunk=false;offline=true;throw new Error('Connection lost after server accepted chunk');}},
 async verify(id){online();const m=originals.get(id);const parts=[];for(let i=0;i<m.chunk_count;i++){const part=chunks.get(`${id}:${i}`);if(!part)throw new Error('Missing chunk');parts.push(part);}assert.equal(await sha256(new Blob(parts)),m.sha256);m.verified_at='verified';return {verified:true,sha256:m.sha256,byte_size:m.byte_size};}
};
test('media queue survives interrupted upload, resumes without duplicates and restores only verified bytes',async()=>{
 await db.initDatabase({});await db.bindSyncOwner(owner);
 const blob=new Blob([new Uint8Array(CHUNK_SIZE+31).fill(42)],{type:'image/png'});
 await db.putOne('media_assets',{id:'resume',blob,name:'original'});
 const initial=(await db.getAll('sync_media_outbox'))[0];
 assert.equal('blob' in initial,false);
 const engine=createMediaEngine({userId:owner,transport});
 cutAfterChunk=true;await engine.run();
 assert.equal((await db.getAll('sync_media_outbox')).length,1);
 assert.equal((await db.getById('sync_media_state','resume')).status,'sync_error');
 assert.equal((await db.getById('media_assets','resume')).blob.size,blob.size);
 offline=false;await engine.run();assert.equal(writes,2);
 assert.equal((await db.getAll('sync_media_outbox')).length,0);
 assert.equal((await db.getById('sync_media_state','resume')).status,'local_remote_verified');
 await engine.run();assert.equal(writes,2);
 // Emulate a fresh installation with metadata only, never clearing real browser data.
 await db.transaction(['media_assets'], 'readwrite',s=>s.media_assets.put({id:'resume',name:'original'}));
 await engine.run();assert.equal((await db.getById('sync_media_state','resume')).status,'remote_only');
 const expectedQueue=await db.getAll('sync_outbox');
 const downloaded=await engine.download('resume');
 assert.equal(await sha256(downloaded),await sha256(blob));
 assert.deepEqual(await db.getAll('sync_outbox'),expectedQueue);
});
test('missing chunk, altered hash and insufficient quota cannot install or erase an original',async()=>{
 await db.transaction(['media_assets'],'readwrite',s=>s.media_assets.put({id:'resume',name:'original'}));
 const noSpace=createMediaEngine({userId:owner,transport,storageEstimate:async()=>({quota:10,usage:9})});
 await assert.rejects(noSpace.download('resume'),/Quota/);
 assert.equal((await db.getById('media_assets','resume')).blob,undefined);
 const missing=createMediaEngine({userId:owner,transport:{...transport,chunk:async()=>null}});
 await assert.rejects(missing.download('resume'),/manquant/);
 const corrupt=createMediaEngine({userId:owner,transport:{...transport,chunk:async(id,index)=>{const data=(await transport.chunk(id,index)).slice();data[0]^=1;return data;}}});
 await assert.rejects(corrupt.download('resume'),/SHA-256/);
 assert.equal((await db.getById('media_assets','resume')).blob,undefined);
 assert.ok(originals.get('resume').verified_at);
});
test('new local media event cannot be acknowledged by an older upload; deletion cancels queued media',async()=>{
 await db.putOne('media_assets',{id:'race',blob:new Blob(['old'])});
 let changed=false;
 const race=createMediaEngine({userId:owner,transport:{...transport,putChunk:async(id,index,bytes)=>{await transport.putChunk(id,index,bytes);if(!changed){changed=true;await db.putOne('media_assets',{id:'race',blob:new Blob(['new local'])});}}}});
 await race.upload('race');
 assert.equal(await (await db.getById('media_assets','race')).blob.text(),'new local');
 assert.ok(await db.getById('sync_media_outbox','race'));
 await db.deleteOne('media_assets','race');
 assert.equal(await db.getById('sync_media_outbox','race'),undefined);
});
test('media failure does not stop structured pull; account mismatch blocks media access',async()=>{
 let pulled=false;
 const sync=createSyncEngine({userId:owner,transport:{push:async()=>{},pull:async()=>{pulled=true;return [];}},media:{run:async()=>{throw new Error('media network');}}});
 await sync.run();assert.equal(pulled,true);
 const wrong=createMediaEngine({userId:'other-owner',transport});
 await assert.rejects(wrong.download('resume'),/Compte/);
 await assert.rejects(wrong.run(),/Compte/);
});
test('quota failure during IndexedDB commit rolls back downloaded bytes; oversized local original stays queued',async()=>{
 const originalPut=IDBObjectStore.prototype.put;
 IDBObjectStore.prototype.put=function(value,...args){
  if(this.name==='media_assets' && value.id==='resume' && value.blob)throw new DOMException('Local storage full','QuotaExceededError');
  return originalPut.call(this,value,...args);
 };
 try {
  const engine=createMediaEngine({userId:owner,transport});
  await assert.rejects(engine.download('resume'),/Local storage full/);
  assert.equal((await db.getById('media_assets','resume')).blob,undefined);
  assert.ok(originals.get('resume').verified_at);
 } finally {IDBObjectStore.prototype.put=originalPut;}
 const block=new Blob([new Uint8Array(CHUNK_SIZE)]);
 const oversized=new Blob([...Array(256).fill(block),new Uint8Array([1])]);
 await db.putOne('media_assets',{id:'oversized',blob:oversized});
 const engine=createMediaEngine({userId:owner,transport});
 assert.ok((await engine.upload('oversized')).error);
 assert.equal((await db.getById('media_assets','oversized')).blob.size,67108865);
 assert.ok(await db.getById('sync_media_outbox','oversized'));
 assert.equal(originals.has('oversized'),false);
});
test('remote tombstone and metadata imports preserve an original awaiting backup',async()=>{
 await db.putOne('media_assets',{id:'pending-delete',blob:new Blob(['last healthy copy']),name:'before'});
 await db.putOne('media_assets',{id:'pending-delete',name:'metadata import'});
 assert.equal(await (await db.getById('media_assets','pending-delete')).blob.text(),'last healthy copy');
 await db.confirmOutbox((await db.getAll('sync_outbox')).map(row=>row.seq));
 await db.applyRemoteRevisions([{revision_id:1000,user_id:owner,entity_type:'media_assets',entity_id:'pending-delete',snapshot:{user_id:owner,id:'pending-delete',data:{id:'pending-delete'},deleted_at:new Date().toISOString()}}],owner);
 assert.equal(await (await db.getById('media_assets','pending-delete')).blob.text(),'last healthy copy');
 assert.ok(await db.getById('sync_media_outbox','pending-delete'));
});
