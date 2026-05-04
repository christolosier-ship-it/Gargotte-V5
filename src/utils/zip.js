
export function toBytes(str){ return new TextEncoder().encode(str); }
export function fromBytes(bytes){ return new TextDecoder('utf-8').decode(bytes); }
function u32(n){ const b=new Uint8Array(4); const v=new DataView(b.buffer); v.setUint32(0,n,true); return b; }
function u16(n){ const b=new Uint8Array(2); const v=new DataView(b.buffer); v.setUint16(0,n,true); return b; }
function concat(arrs){
  const total = arrs.reduce((s,a)=>s+a.length,0);
  const out=new Uint8Array(total); let off=0;
  for(const a of arrs){ out.set(a,off); off+=a.length; }
  return out;
}
export function crc32(bytes){
  let crc = ~0;
  for (let i=0;i<bytes.length;i++){
    crc ^= bytes[i];
    for(let k=0;k<8;k++) crc = (crc>>>1) ^ (0xEDB88320 & -(crc&1));
  }
  return (~crc)>>>0;
}
function dosTimeDate(date=new Date()){
  const y=date.getFullYear();
  const m=date.getMonth()+1;
  const d=date.getDate();
  const hh=date.getHours();
  const mm=date.getMinutes();
  const ss=Math.floor(date.getSeconds()/2);
  return {time:(hh<<11)|(mm<<5)|ss, date:((y-1980)<<9)|(m<<5)|d};
}
export function makeZip(entries){
  // entries: [{name, data:Uint8Array}]
  const locals=[]; const central=[]; let offset=0;
  const {time,date}=dosTimeDate(new Date());
  for(const e of entries){
    const nameBytes = toBytes(e.name);
    const data = e.data instanceof Uint8Array ? e.data : toBytes(String(e.data??''));
    const crc = crc32(data);
    const local = concat([
      u32(0x04034b50), u16(20), u16(0), u16(0), u16(time), u16(date), u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), nameBytes, data
    ]);
    locals.push(local);
    const centralHdr = concat([
      u32(0x02014b50), u16(20), u16(20), u16(0), u16(0), u16(time), u16(date), u32(crc), u32(data.length), u32(data.length), u16(nameBytes.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), nameBytes
    ]);
    central.push(centralHdr);
    offset += local.length;
  }
  const centralDir = concat(central);
  const eocd = concat([
    u32(0x06054b50), u16(0), u16(0), u16(entries.length), u16(entries.length), u32(centralDir.length), u32(offset), u16(0)
  ]);
  return concat([...locals, centralDir, eocd]);
}
export async function readZip(bytes){
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  // find EOCD
  let eocd = -1;
  for(let i=u8.length-22; i>=0; i--){
    if(u8[i]===0x50 && u8[i+1]===0x4b && u8[i+2]===0x05 && u8[i+3]===0x06){ eocd=i; break; }
  }
  if(eocd<0) throw new Error('EOCD not found');
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const count = dv.getUint16(eocd+10, true);
  const cdSize = dv.getUint32(eocd+12, true);
  const cdOffset = dv.getUint32(eocd+16, true);
  const files = {};
  let ptr = cdOffset;
  for(let i=0;i<count;i++){
    if(dv.getUint32(ptr,true)!==0x02014b50) throw new Error('central header');
    const method = dv.getUint16(ptr+10,true);
    const compSize = dv.getUint32(ptr+20,true);
    const uncompSize = dv.getUint32(ptr+24,true);
    const nameLen = dv.getUint16(ptr+28,true);
    const extraLen = dv.getUint16(ptr+30,true);
    const commentLen = dv.getUint16(ptr+32,true);
    const lhOffset = dv.getUint32(ptr+42,true);
    const name = fromBytes(u8.slice(ptr+46, ptr+46+nameLen));
    const lhdv = new DataView(u8.buffer, u8.byteOffset+lhOffset, u8.byteLength-lhOffset);
    if(lhdv.getUint32(0,true)!==0x04034b50) throw new Error('local header');
    const lNameLen = lhdv.getUint16(26,true);
    const lExtraLen = lhdv.getUint16(28,true);
    const start = lhOffset + 30 + lNameLen + lExtraLen;
    const data = u8.slice(start, start+compSize);
    let out = data;
    if(method===8){
      const ds = new DecompressionStream('deflate-raw');
      out = new Uint8Array(await new Response(new Blob([data]).stream().pipeThrough(ds)).arrayBuffer());
    }
    files[name] = out;
    ptr += 46 + nameLen + extraLen + commentLen;
  }
  return files;
}
