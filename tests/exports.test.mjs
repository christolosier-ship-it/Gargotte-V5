import test from 'node:test';
import assert from 'node:assert/strict';
import 'fake-indexeddb/auto';
import { buildXlsxWorkbookBlob,readXlsxFile } from '../src/utils/xlsx.js';
import { exportStructuredBackup,importStructuredBackup } from '../src/data/backup.js';
import * as db from '../src/storage/idb.js';
import '../seed-data.js';
test('all seed fields, counts and relationships survive portable JSON round trip',async()=>{
 await db.initDatabase(globalThis.GARGOTTEX_SEED);
 const original=await exportStructuredBackup();
 for(const type of Object.keys(original.data)) await db.transaction([type],'readwrite',async stores=>stores[type].clear());
 await importStructuredBackup(original);
 assert.deepEqual((await exportStructuredBackup()).data,original.data);
 const restored=await db.loadAllData();
 const dungeons=new Set(restored.dungeons.map(r=>r.id));
 for(const c of restored.creatures) if(c.dungeon_id) assert.ok(dungeons.has(c.dungeon_id));
 const creatures=new Set(restored.creatures.map(r=>r.id));
 for(const l of restored.loot_items) if(l.creature_id) assert.ok(creatures.has(l.creature_id));
});
test('XLSX writer and reader retain accents, long text and business columns',async()=>{
 const headers=['name','lore','dungeon_name','pv'];
 const rows=[{name:'Créature & <test>',lore:'Texte long éà'.repeat(100),dungeon_name:'Donjon',pv:42}];
 const blob=buildXlsxWorkbookBlob([{sheetName:'Créatures',headers,rows}]);
 const parsed=await readXlsxFile(await blob.arrayBuffer());
 assert.equal(parsed.sheets[0].sheetName,'Créatures');
 assert.equal(parsed.sheets[0].rows[0].name,rows[0].name);
 assert.equal(parsed.sheets[0].rows[0].lore,rows[0].lore);
 assert.equal(Number(parsed.sheets[0].rows[0].pv),42);
});
