import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import * as db from '../src/data/repository.js';

test('upgrade of a populated V5 schema preserves records, indexes, preferences and local blobs', async () => {
  const old = await new Promise((resolve, reject) => {
    const request = indexedDB.open(db.DB_NAME, 2);
    request.onupgradeneeded = () => {
      for (const def of db.STORE_DEFS.filter(d => !d.name.startsWith('sync_'))) {
        const store = request.result.createObjectStore(def.name, { keyPath: def.keyPath });
        for (const index of def.indexes || []) store.createIndex(index, index);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  const hero = { id:'v5-hero', name:'Héros conservé', tags:['rare'], custom:{ lore:'Ancien lore '.repeat(100) } };
  const tx = old.transaction(['heroes','media_assets','meta'], 'readwrite');
  tx.objectStore('heroes').put(hero);
  tx.objectStore('media_assets').put({id:'v5-image',entity_id:hero.id,blob:new Blob(['original']),thumb_blob:new Blob(['miniature'])});
  tx.objectStore('meta').put({key:'ui_state',value:{tab:'atelier'}});
  await new Promise((resolve,reject) => {tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);});
  old.close();
  await db.initDatabase({heroes:[{id:hero.id,name:'Seed à ne pas appliquer'}],dungeons:[{id:'seed'}]});
  assert.deepEqual(await db.getById('heroes',hero.id),hero);
  assert.deepEqual(await db.loadUiState(),{tab:'atelier'});
  assert.equal((await db.getAll('dungeons')).length,0);
  const media = await db.getById('media_assets','v5-image');
  assert.equal(await media.blob.text(),'original');
  assert.equal(await media.thumb_blob.text(),'miniature');
  await db.transaction(['heroes'],'readonly', ({heroes}, transaction) => {
    assert.equal(transaction.db.version,3);
    assert.ok(heroes.indexNames.contains('name'));
  });
  await db.bindSyncOwner('upgrade-test-owner');
  const queue=await db.getAll('sync_outbox');
  assert.equal(queue.length,2);
  assert.deepEqual(queue.find(row=>row.entity==='heroes').payload,hero);
  assert.equal('blob' in queue.find(row=>row.entity==='media_assets').payload,false);
});
