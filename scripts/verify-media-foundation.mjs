// Integration probe, NOT the phase-2 media transfer engine. Disposable branch only.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const api=process.env.NEON_TEST_API_URL;
assert.ok(api && process.env.NEON_TEST_ACCOUNTS,'Explicit disposable branch and credentials required');
const [owner,other]=JSON.parse(await readFile(process.env.NEON_TEST_ACCOUNTS,'utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function request(path,{method='GET',body,account=owner}={}) {
 const response=await fetch(`${api}/${path}`,{method,signal:AbortSignal.timeout(60000),headers:{'Content-Type':'application/json',Prefer:'return=representation',...(account?{Authorization:`Bearer ${account.jwt}`}:{})},body:body===undefined?undefined:JSON.stringify(body)});
 const raw=await response.text();let data;try{data=JSON.parse(raw);}catch{data=raw;}
 return {ok:response.ok,status:response.status,data};
}
function ok(result){assert.ok(result.ok,JSON.stringify(result));return result.data;}
function denied(result){assert.equal(result.ok,false,JSON.stringify(result));}
const prefix=`media-foundation-${Date.now()}`;
const id=`${prefix}-binary`;
const bytes=Buffer.alloc(262144+17);for(let i=0;i<bytes.length;i++)bytes[i]=i%256;
const metadata={user_id:owner.id,id,data:{id,name:'Disposable media integrity probe'}};
ok(await request('media_assets',{method:'POST',body:metadata}));
const original={user_id:owner.id,media_id:id,byte_size:bytes.length,sha256:hash(bytes),mime_type:'application/octet-stream'};
denied(await request('media_originals',{method:'POST',body:{...original,verified_at:new Date().toISOString()}}));
ok(await request('media_originals',{method:'POST',body:original}));
denied(await request('media_blob_chunks',{method:'POST',body:{user_id:owner.id,media_id:id,chunk_index:2,data:'\\x00'}}));
denied(await request('media_blob_chunks',{method:'POST',body:{user_id:owner.id,media_id:id,chunk_index:0,data:'\\x00'}}));
ok(await request('media_blob_chunks',{method:'POST',body:{user_id:owner.id,media_id:id,chunk_index:0,data:'\\x'+bytes.subarray(0,262144).toString('hex')}}));
denied(await request('rpc/verify_media_original',{method:'POST',body:{p_media_id:id}}));
assert.equal(ok(await request(`media_originals?media_id=eq.${id}`))[0].verified_at,null);
ok(await request('media_blob_chunks',{method:'POST',body:{user_id:owner.id,media_id:id,chunk_index:1,data:'\\x'+bytes.subarray(262144).toString('hex')}}));
const verified=ok(await request('rpc/verify_media_original',{method:'POST',body:{p_media_id:id}}));
assert.equal(verified.sha256,hash(bytes));assert.equal(verified.verified,true);
assert.equal(ok(await request('rpc/verify_media_original',{method:'POST',body:{p_media_id:id}})).sha256,hash(bytes));
const chunks=ok(await request(`media_blob_chunks?media_id=eq.${id}&order=chunk_index.asc`));
assert.deepEqual(Buffer.concat(chunks.map(row=>Buffer.from(row.data.slice(2),'hex'))),bytes);
console.log('PASS: BYTEA multi-chunk round trip, exact hash, missing/wrong-size chunks rejected, repeated verification');
for(const table of ['media_originals','media_blob_chunks']) {
 denied(await request(table,{account:null}));
 assert.deepEqual(ok(await request(`${table}?media_id=eq.${id}`,{account:other})),[]);
 denied(await request(`${table}?media_id=eq.${id}`,{method:'DELETE'}));
}
denied(await request('media_originals',{method:'POST',account:other,body:original}));
denied(await request('media_blob_chunks',{method:'POST',account:other,body:{user_id:owner.id,media_id:id,chunk_index:0,data:'\\x00'}}));
denied(await request(`media_originals?media_id=eq.${id}`,{method:'PATCH',body:{sha256:'0'.repeat(64)}}));
denied(await request(`media_blob_chunks?media_id=eq.${id}`,{method:'PATCH',body:{data:'\\x00'}}));
denied(await request('rpc/verify_media_original',{method:'POST',account:other,body:{p_media_id:id}}));
denied(await request('rpc/verify_media_original',{method:'POST',account:null,body:{p_media_id:id}}));
console.log('PASS: owner isolation, anonymous denial, spoofing denial, immutable verified bytes, no client hard delete');
for(const [suffix,path,mime] of [['png','assets/images/logo-192.png','image/png'],['jpeg','assets/images/bruna.jpeg','image/jpeg']]) {
 const image=await readFile(path);const imageId=`${prefix}-${suffix}`;
 ok(await request('media_assets',{method:'POST',body:{user_id:owner.id,id:imageId,data:{id:imageId,path}}}));
 ok(await request('media_originals',{method:'POST',body:{user_id:owner.id,media_id:imageId,byte_size:image.length,sha256:hash(image),mime_type:mime}}));
 for(let offset=0;offset<image.length;offset+=262144) ok(await request('media_blob_chunks',{method:'POST',body:{user_id:owner.id,media_id:imageId,chunk_index:offset/262144,data:'\\x'+image.subarray(offset,offset+262144).toString('hex')}}));
 assert.equal(ok(await request('rpc/verify_media_original',{method:'POST',body:{p_media_id:imageId}})).sha256,hash(image));
 const downloaded=ok(await request(`media_blob_chunks?media_id=eq.${imageId}&order=chunk_index.asc`));
 assert.deepEqual(Buffer.concat(downloaded.map(row=>Buffer.from(row.data.slice(2),'hex'))),image);
 console.log(`PASS: real ${suffix} bytes preserved (${image.length} bytes)`);
}
const badId=`${prefix}-hash`;
ok(await request('media_assets',{method:'POST',body:{user_id:owner.id,id:badId,data:{id:badId}}}));
ok(await request('media_originals',{method:'POST',body:{user_id:owner.id,media_id:badId,byte_size:1,sha256:'0'.repeat(64),mime_type:'application/octet-stream'}}));
ok(await request('media_blob_chunks',{method:'POST',body:{user_id:owner.id,media_id:badId,chunk_index:0,data:'\\x01'}}));
denied(await request('rpc/verify_media_original',{method:'POST',body:{p_media_id:badId}}));
assert.equal(ok(await request(`media_originals?media_id=eq.${badId}`))[0].verified_at,null);
ok(await request(`media_assets?id=eq.${id}`,{method:'PATCH',body:{deleted_at:new Date().toISOString()}}));
assert.deepEqual(ok(await request(`media_originals?media_id=eq.${id}`)),[]);
assert.deepEqual(ok(await request(`media_blob_chunks?media_id=eq.${id}`)),[]);
denied(await request('rpc/verify_media_original',{method:'POST',body:{p_media_id:id}}));
console.log('PASS: hash mismatch never verified; tombstones hide originals and chunks without physical deletion');
