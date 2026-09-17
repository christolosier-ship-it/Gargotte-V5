// Test harness for the actual phase-2 engine, only on an explicit disposable branch.
import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createClient} from '@neondatabase/neon-js';
import * as db from '../src/storage/idb.js';
import {createSyncEngine,neonTransport} from '../src/cloud/sync.js';
import {createMediaEngine,neonMediaTransport,sha256} from '../src/cloud/media.js';
assert.ok(process.env.NEON_TEST_API_URL && process.env.NEON_TEST_ACCOUNTS,'Explicit disposable branch required');
const [account]=JSON.parse(await readFile(process.env.NEON_TEST_ACCOUNTS,'utf8'));
const client=createClient({dataApi:{url:process.env.NEON_TEST_API_URL,getToken:async()=>account.jwt}});
const real=neonMediaTransport(client,account.id);
let offline=false,interrupt=true,puts=0;
const transport={...real,
 chunk:async(...args)=>{if(offline)throw new Error('Simulated offline');return real.chunk(...args);},
 putChunk:async(...args)=>{if(offline)throw new Error('Simulated offline');await real.putChunk(...args);puts++;if(interrupt){interrupt=false;offline=true;throw new Error('Lost response after accepted chunk');}}
};
globalThis.GARGOTTEX_CONFIG={neonUrl:'integration'};
await db.initDatabase({});
const id=`media-engine-${Date.now()}`;
const bytes=await readFile('assets/images/bruna.jpeg');
const blob=new Blob([bytes],{type:'image/jpeg'});
await db.putOne('media_assets',{id,name:'Disposable media sync engine',blob,mime_type:blob.type,byte_size:blob.size});
const media=createMediaEngine({userId:account.id,transport});
const sync=createSyncEngine({userId:account.id,transport:neonTransport(client,account.id),media});
await sync.run();
assert.equal((await db.getAll('sync_outbox')).length,0);
assert.equal((await db.getAll('sync_media_outbox')).length,1);
assert.equal(await sha256((await db.getById('media_assets',id)).blob),await sha256(blob));
console.log('PASS: real accepted chunk + lost connection preserves local original and media queue; structured sync unaffected');
offline=false;
await sync.run();
assert.equal((await db.getAll('sync_media_outbox')).length,0);
assert.equal(puts,Math.ceil(blob.size/262144));
assert.equal((await db.getById('sync_media_state',id)).status,'local_remote_verified');
console.log('PASS: real retry sends only missing chunk; server SHA-256 confirms original');
// Remove binary only inside the isolated fake IDB to emulate another device.
await db.transaction(['media_assets'],'readwrite',s=>s.media_assets.put({id,name:'Disposable media sync engine',mime_type:blob.type,byte_size:blob.size}));
await media.run();
assert.equal((await db.getById('sync_media_state',id)).status,'remote_only');
const recovered=await media.download(id);
assert.deepEqual(new Uint8Array(await recovered.arrayBuffer()),new Uint8Array(bytes));
assert.equal((await db.getAll('sync_media_outbox')).length,0);
assert.equal((await db.getAll('sync_outbox')).length,0);
console.log('PASS: actual SDK download reconstructs identical JPEG, persisted locally without outgoing event');
await db.deleteOne('media_assets',id);await sync.run();
assert.equal(await real.manifest(id),null);
assert.equal(await db.getById('media_assets',id),undefined);
console.log('PASS: deletion propagates and remote pull does not resurrect original');
