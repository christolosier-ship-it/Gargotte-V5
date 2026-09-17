import {getAll,mediaSnapshot,bootstrapMedia,updateMediaProgress,installVerifiedMedia} from '../storage/idb.js';
import {structuredData} from '../data/structured.js';
export const CHUNK_SIZE=262144, MAX_ORIGINAL_SIZE=67108864;
export async function sha256(blob) {
 const digest=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer());
 return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
const hex=bytes=>'\\x'+[...bytes].map(x=>x.toString(16).padStart(2,'0')).join('');
function decode(value) {
 if(typeof value!=='string'||!/^\\x(?:[0-9a-f]{2})*$/i.test(value)) throw new Error('Octets distants invalides');
 return Uint8Array.from(value.slice(2).match(/../g)||[],x=>parseInt(x,16));
}
export function neonMediaTransport(client,userId) {
 const check=({data,error})=>{if(error)throw new Error(error.message);return data;};
 return {
  manifest:async id=>check(await client.from('media_originals').select('*').eq('media_id',id).maybeSingle()),
  create:async manifest=>check(await client.from('media_originals').insert({...manifest,user_id:userId})),
  chunk:async(id,index)=>{const row=check(await client.from('media_blob_chunks').select('data').eq('media_id',id).eq('chunk_index',index).maybeSingle());return row?decode(row.data):null;},
  putChunk:async(id,index,bytes)=>check(await client.from('media_blob_chunks').insert({user_id:userId,media_id:id,chunk_index:index,data:hex(bytes)})),
  verify:async id=>check(await client.rpc('verify_media_original',{p_media_id:id}))
 };
}
export function createMediaEngine({userId,transport,onChange=()=>{},isStopped=()=>false,storageEstimate=()=>globalThis.navigator?.storage?.estimate?.()}) {
 function active(){if(isStopped())throw new Error('Transfert interrompu ; copie locale conservée');}
 async function progress(id,token,patch,confirmed=false){active();const changed=await updateMediaProgress(userId,id,token,patch,confirmed);if(!changed)throw new Error('Média modifié pendant le transfert');await onChange();}
 async function upload(id) {
  const {asset,operation,owner}=await mediaSnapshot(id);
  if(!asset||!operation)return;
  if(owner!==userId)throw new Error('Compte média incohérent');
  const token=operation.token;
  try {
   active();
   if(!(asset.blob instanceof Blob))throw new Error('Original local manquant');
   if(!asset.blob.size||asset.blob.size>MAX_ORIGINAL_SIZE)throw new Error('Original hors limite de sauvegarde (1 octet à 64 Mio) ; conservé localement');
   const hash=await sha256(asset.blob);
   await progress(id,token,{status:'uploading',sha256:hash,byte_size:asset.blob.size,chunk_index:0});
   let manifest=await transport.manifest(id);active();
   if(!manifest) {
    try {await transport.create({media_id:id,byte_size:asset.blob.size,sha256:hash,mime_type:asset.blob.type||asset.mime_type||'application/octet-stream',chunk_size:CHUNK_SIZE});}
    catch(error){manifest=await transport.manifest(id);if(!manifest)throw error;}
    manifest ||= await transport.manifest(id);
   }
   if(manifest.sha256!==hash||Number(manifest.byte_size)!==asset.blob.size||manifest.chunk_size!==CHUNK_SIZE)throw new Error('Original distant différent ; fichier local conservé. Réimportez sous un nouvel identifiant.');
   if(!manifest.verified_at) for(let offset=0,index=0;offset<asset.blob.size;offset+=CHUNK_SIZE,index++) {
    active();
    const bytes=new Uint8Array(await asset.blob.slice(offset,offset+CHUNK_SIZE).arrayBuffer());
    let remote=await transport.chunk(id,index);active();
    if(!remote) {
     try {await transport.putChunk(id,index,bytes);}
     catch(error){remote=await transport.chunk(id,index);if(!remote)throw error;}
    }
    if(remote && (remote.length!==bytes.length||remote.some((v,i)=>v!==bytes[i])))throw new Error('Morceau distant différent ; original local conservé');
    await progress(id,token,{status:'uploading',sha256:hash,byte_size:asset.blob.size,chunk_index:index+1});
   }
   active();const verified=await transport.verify(id);active();
   if(!verified?.verified||verified.sha256!==hash||Number(verified.byte_size)!==asset.blob.size)throw new Error('Intégrité distante non confirmée');
   await progress(id,token,{status:'local_remote_verified',sha256:hash,byte_size:asset.blob.size},true);
  } catch(error) {
   if(!isStopped())await updateMediaProgress(userId,id,token,{status:'sync_error',last_error:error.message});
   await onChange();return {error};
  }
 }
 async function run() {
  active();await bootstrapMedia(userId);
  for(const op of (await getAll('sync_media_outbox')).sort((a,b)=>a.attempts-b.attempts).slice(0,3)) {active();await upload(op.id);}
  // Discover availability without downloading originals; no eager binary bootstrap.
  for(const asset of await getAll('media_assets')) if(!asset.blob) {
   active();
   try {const remote=await transport.manifest(asset.id);await progress(asset.id,null,{status:remote?.verified_at?'remote_only':'missing'});}
   catch(error){if(!isStopped())await updateMediaProgress(userId,asset.id,null,{status:'sync_error',last_error:error.message});}
  }
 }
 async function download(id) {
  const {asset,operation,owner}=await mediaSnapshot(id);
  if(owner!==userId)throw new Error('Compte média incohérent');
  if(!asset||operation||asset.blob)throw new Error('Téléchargement impossible : média absent ou copie locale déjà présente');
  try {
   active();await progress(id,null,{status:'downloading'});
   const manifest=await transport.manifest(id);active();
   if(!manifest?.verified_at)throw new Error('Original distant absent ou non vérifié');
   const size=Number(manifest.byte_size);
   if(!Number.isSafeInteger(size)||size<1||size>MAX_ORIGINAL_SIZE||manifest.chunk_size!==CHUNK_SIZE||manifest.chunk_count!==Math.ceil(size/CHUNK_SIZE))throw new Error('Manifeste distant invalide');
   const estimate=await storageEstimate();
   if(estimate?.quota && estimate.quota-(estimate.usage||0)<size)throw new Error('Quota local insuffisant ; original distant conservé');
   const chunks=[];
   for(let i=0;i<manifest.chunk_count;i++) {
    active();const bytes=await transport.chunk(id,i);
    if(!bytes||bytes.length!==Math.min(CHUNK_SIZE,size-i*CHUNK_SIZE))throw new Error('Morceau distant manquant ou incomplet');
    chunks.push(bytes);await progress(id,null,{status:'downloading',chunk_index:i+1});
   }
   const blob=new Blob(chunks,{type:manifest.mime_type});
   if(await sha256(blob)!==manifest.sha256)throw new Error('SHA-256 invalide ; copie reçue non installée');
   active();await installVerifiedMedia(userId,id,structuredData(asset),blob,manifest.sha256);await onChange();
   return blob;
  } catch(error) {if(!isStopped())await updateMediaProgress(userId,id,null,{status:'sync_error',last_error:error.message});await onChange();throw error;}
 }
 return {run,upload,download};
}
