/* A2 reproducible neutral raster comparison. Does not generate production images.
   Timing is for this session/browser only; canvas memory is theoretical RGBA floor. */
const MIME = [["PNG","image/png",undefined],["WebP (q=0.82)","image/webp",0.82],["JPEG (q=0.82)","image/jpeg",0.82],["AVIF (if encoded)","image/avif",0.82]];
const median = values=>{const s=[...values].sort((a,b)=>a-b);return s[Math.floor(s.length/2)];};
const round=n=>Math.round(n*100)/100;
const encode=(canvas,mime,q)=>new Promise(resolve=>canvas.toBlob(resolve,mime,q));
function imageFrom(url){
 return new Promise((resolve,reject)=>{
  const image=new Image();image.onload=async()=>{try{if(typeof image.decode==="function")await image.decode();resolve(image);}catch(error){reject(error);}};image.onerror=()=>reject(Error("Decode impossible"));
  image.src=url;
 });
}
function sampledDifference(a,b){
 let total=0,components=0;
 for(let i=0;i<a.length;i+=64){ // every 16th RGBA pixel: bounded readback
   for(let c=0;c<3;c++){total+=Math.abs(a[i+c]-b[i+c]);components++;}
 }
 return round(total/Math.max(1,components));
}
export async function compareNeutral({sizes=[256,512,1024],repeats=3}={}){
 const image=await imageFrom(new URL("./tiles/z0/0-0.svg",import.meta.url).href);
 const results=[],started=performance.now();
 for(const size of sizes){
  const source=document.createElement("canvas");source.width=size;source.height=size;
  const ctx=source.getContext("2d",{willReadFrequently:true});
  ctx.fillStyle="#e4e7e5";ctx.fillRect(0,0,size,size); // JPEG is not compared against transparency
  ctx.drawImage(image,256,0,512,512,0,0,size,size);
  const reference=ctx.getImageData(0,0,size,size).data;
  for(const [label,mime,quality] of MIME){
   const writes=[],reads=[],sizesBytes=[],differences=[];
   let supported=true,reason="";
   for(let trial=0;trial<repeats;trial++){
    const t0=performance.now();const blob=await encode(source,mime,quality);
    const t1=performance.now();
    if(!blob||blob.type!==mime){supported=false;reason="Encodeur MIME indisponible (repli refusé)";break;}
    let url;
    try{
      url=URL.createObjectURL(blob);
      const t2=performance.now();const decoded=await imageFrom(url);const t3=performance.now();
      const decodedCanvas=document.createElement("canvas");decodedCanvas.width=size;decodedCanvas.height=size;
      const dc=decodedCanvas.getContext("2d",{willReadFrequently:true});
      dc.drawImage(decoded,0,0);
      const diff=sampledDifference(reference,dc.getImageData(0,0,size,size).data);
      writes.push(t1-t0);reads.push(t3-t2);sizesBytes.push(blob.size);differences.push(diff);
      decodedCanvas.width=0;decodedCanvas.height=0;
    }catch(error){supported=false;reason=String(error?.message||error);break;}
    finally{if(url)URL.revokeObjectURL(url);}
   }
   results.push({size,format:label,mime,supported,reason:supported?"":reason,
    bytes:supported?Math.round(median(sizesBytes)):null,
    encode_ms:supported?round(median(writes)):null,
    decode_ms:supported?round(median(reads)):null,
    sampled_mad_rgb:supported?round(median(differences)):null,
    rgba_floor_bytes:size*size*4});
  }
  source.width=0;source.height=0;
 }
 return {fixture:"A2 public neutral SVG crop from A1 (NOT final map), no quality claim on painted art",
   device:navigator.userAgent,device_memory_api_navigator_deviceMemory:navigator.deviceMemory??null,
   screen:{w:screen.width,h:screen.height,dpr:devicePixelRatio},
   generated_at:new Date().toISOString(),repeats,method:"Canvas toBlob + blob URL image load AND image.decode(), per-size PNG reference, sampled mean absolute RGB difference",
   total_ms:round(performance.now()-started),results};
}
