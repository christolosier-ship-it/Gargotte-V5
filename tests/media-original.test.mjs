import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {originalMediaFields} from '../src/data/media-original.js';

test('new media retains exact original bytes, MIME and dimensions', async () => {
 for (const type of ['image/png','image/jpeg','image/webp','image/gif']) {
  const bytes=Uint8Array.from({length:524301},(_,i)=>i%256);
  const original=new Blob([bytes],{type});
  const record=originalMediaFields(original,{width:4096,height:2048});
  assert.equal(record.blob,original);
  assert.equal(record.mime_type,type);
  assert.equal(record.byte_size,bytes.length);
  assert.equal(record.width,4096);
  assert.equal(record.height,2048);
  assert.equal(createHash('sha256').update(new Uint8Array(await record.blob.arrayBuffer())).digest('hex'),createHash('sha256').update(bytes).digest('hex'));
 }
 assert.throws(()=>originalMediaFields(new Blob(),{}),/vide/);
});
