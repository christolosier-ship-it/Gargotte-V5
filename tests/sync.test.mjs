import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import * as db from '../src/storage/idb.js';
import { createSyncEngine } from '../src/cloud/sync.js';
import { exportStructuredBackup, importStructuredBackup } from '../src/data/backup.js';
import { ENTITY_TYPES } from '../src/data/structured.js';
globalThis.GARGOTTEX_CONFIG={neonUrl:'configured'};
const remote=new Map(), revisions=[];let offline=true, sequence=0, duringPush=null;
const transport={
 async push(batch){
  if(offline) throw new Error('network unavailable');
  for(const op of batch){
   const snapshot={id:op.id,user_id:'A',data:op.payload,deleted_at:op.operation==='delete'?op.created_at:null};
   remote.set(op.entity+op.id,snapshot);
   revisions.push({revision_id:++sequence,user_id:'A',entity_type:op.entity,entity_id:op.id,snapshot});
  }
  if(duringPush){const fn=duringPush;duringPush=null;await fn();}
 },
 async pull(cursor){return revisions.filter(r=>r.revision_id>Number(cursor)).slice(0,100);}
};
test('offline operations survive, exact ACK, remote tombstones, account isolation and backups',async()=>{
 await db.initDatabase({dungeons:[{id:'demo'}]});
 assert.deepEqual(await db.getAll('dungeons'),[]);
 await db.putOne('dungeons',{id:'d1',name:'Local'});
 await db.putOne('creatures',{id:'c1',dungeon_id:'d1',lore:'one',unknown:{a:['preserved']}});
 await db.putOne('media_assets',{id:'m1',blob:new Blob(['image']),thumb_blob:new Blob(['thumb']),path:'x.webp'});
 await db.putOne('creatures',{id:'deleted',dungeon_id:'d1'});
 await db.deleteOne('creatures','deleted');
 const engine=createSyncEngine({userId:'A',transport});
 const pending=await db.getAll('sync_outbox');
 assert.equal(pending.length,5);
 assert.ok(!JSON.stringify(pending).includes('thumb_blob'));
 await engine.run();
 assert.equal((await db.getAll('sync_outbox')).length,5);
 assert.equal((await db.getById('creatures','c1')).lore,'one');
 assert.equal((await db.getAll('sync_outbox'))[0].attempts,1);
 offline=false;
 duringPush=()=>db.putOne('creatures',{id:'c1',dungeon_id:'d1',lore:'edited while sending',unknown:{a:['preserved']}});
 await engine.run();
 assert.equal((await db.getAll('sync_outbox')).length,0);
 assert.equal(remote.get('creaturesc1').data.lore,'edited while sending');
 assert.equal(await db.getById('creatures','deleted'),undefined);
 assert.ok(remote.get('creaturesdeleted').deleted_at);
 assert.equal(await (await db.getById('media_assets','m1')).blob.text(),'image');
 await assert.rejects(db.bindSyncOwner('B'),/autre compte/);
 const backup=await exportStructuredBackup();
 assert.equal(Object.keys(backup.data).length,9);
 assert.ok(!JSON.stringify(backup).includes('thumb_blob'));
 assert.ok(!JSON.stringify(backup).includes('sync_outbox'));
 await assert.rejects(importStructuredBackup({...backup,data:{dungeons:[]}}));
 assert.equal((await db.getById('creatures','c1')).lore,'edited while sending');
 await importStructuredBackup(backup);
 assert.equal(await (await db.getById('media_assets','m1')).blob.text(),'image');
 // Simulate a new local installation with the same remote user, no demo seed.
 for(const t of ENTITY_TYPES) await db.transaction([t],'readwrite',async stores=>stores[t].clear());
 await db.clearStore('sync_meta');
 await db.clearStore('sync_outbox');
 await engine.run();
 assert.equal((await db.getById('creatures','c1')).lore,'edited while sending');
 assert.equal(await db.getById('creatures','deleted'),undefined);
 assert.equal((await db.getAll('sync_outbox')).length,0);
});
test('invalid local batch rolls back its outbox as well', async()=>{
 const before=(await db.getAll('sync_outbox')).length;
 await assert.rejects(db.putMany('heroes',[{id:'valid'}, {missingId:true}]));
 assert.equal(await db.getById('heroes','valid'),undefined);
 assert.equal((await db.getAll('sync_outbox')).length,before);
});
