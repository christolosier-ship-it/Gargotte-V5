import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import * as db from '../src/data/repository.js';
test('existing V5 database survives CRUD, failed transaction rolls back', async () => {
 await db.initDatabase({ dungeons:[{id:'legacy',name:'Avant',custom:{nested:['conservé']}}] });
 assert.equal((await db.getById('dungeons','legacy')).name,'Avant');
 await db.putOne('creatures',{id:'one',dungeon_id:'legacy',lore:'Texte long'});
 await db.putOne('creatures',{id:'one',dungeon_id:'legacy',lore:'Modifié'});
 assert.equal((await db.getById('creatures','one')).lore,'Modifié');
 await assert.rejects(db.transaction(['creatures'],'readwrite', async ({creatures})=>{
  creatures.put({id:'rollback'}); throw new Error('interrupt');
 }));
 assert.equal(await db.getById('creatures','rollback'),undefined);
 await db.deleteOne('creatures','one');
 assert.equal(await db.getById('creatures','one'),undefined);
 assert.deepEqual((await db.getById('dungeons','legacy')).custom,{nested:['conservé']});
});

test('absence of dungeons never overwrites another existing category', async () => {
 await db.putOne('heroes',{id:'hero-only',name:'À conserver'});
 await db.clearStore('dungeons');
 await db.initDatabase({dungeons:[{id:'unexpected'}], heroes:[{id:'hero-only',name:'Écrasé'}]});
 assert.equal((await db.getById('heroes','hero-only')).name,'À conserver');
 assert.equal((await db.getAll('dungeons')).length,0);
});
