/** A1 isolated, neutral tile navigator. No imports from Gargottex, IndexedDB or media repository. */
const viewport = document.querySelector("#viewport");
const stage = document.querySelector("#stage");
const names = document.querySelector("#names");
const diagnostics = document.querySelector("#diagnostics");
const loading = document.querySelector("#loading");
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const WIDTH = 1024;
const HEIGHT = 512;
const state = {
  zoom: 1, fit: 1, scale: 1, ox: 0, oy: 0, center: {x: 512,y:256},
  manifest: null, tiles: new Map(), pointers: new Map(), pinch: null,
  namesVisible: true, counts: {requested:0,loaded:0,failed:0,evicted:0,peak:0}
};
const previewData = {
  village:["Saint-Fût-le-Petit","Hameau rural de Valdorie. Situation provisoire X30/Y44 sur Ardéra."],
  collines:["Collines de la Vieille Lande","Relief connu à proximité du hameau. Tracé schématique de démonstration."],
  ruisseau:["Ruisseau des Saules","Affluent du bassin de l'Avelorne. Géométrie graphique provisoire."],
  sylve:["Sylve des Anciens","Lisière schématique, non géographie finale."],
  chope:["La Chope Qui Colle","Auberge de Berthold « Deux-Doigts ». Repère public prioritaire, sans statut cosmologique."],
  bridge:["Vieux pont","Exemple de lieu public non sensible, sans liaison Codex ni découverte enregistrée."]
};
function clamp(v, min, max){return Math.min(max,Math.max(min,v));}
function dimensions(){return {w:viewport.clientWidth,h:viewport.clientHeight};}
function clampOffsets(){
  const {w,h}=dimensions();
  const sw=WIDTH*state.scale, sh=HEIGHT*state.scale;
  state.ox=sw<=w?(w-sw)/2:clamp(state.ox,w-sw,0);
  state.oy=sh<=h?(h-sh)/2:clamp(state.oy,h-sh,0);
}
function centerFromOffsets(){
  const {w,h}=dimensions();
  state.center.x=clamp((w/2-state.ox)/state.scale,0,WIDTH);
  state.center.y=clamp((h/2-state.oy)/state.scale,0,HEIGHT);
}
function positionFromCenter(){
  const {w,h}=dimensions();
  state.scale=state.fit*state.zoom;
  state.ox=w/2-state.center.x*state.scale;
  state.oy=h/2-state.center.y*state.scale;
  clampOffsets();centerFromOffsets();renderCamera();
}
function renderCamera(){
  stage.style.transform="translate("+state.ox+"px,"+state.oy+"px) scale("+state.scale+")";
  viewport.dataset.detail=String(state.zoom>=2);
  document.querySelector("#zoom-value").textContent=Math.round(state.zoom*100)+" %";
  renderTiles();renderDiagnostics();
}
function recalcFit(){
  const {w,h}=dimensions();
  state.fit=Math.max(0.05,Math.min(w/WIDTH,h/HEIGHT));
  positionFromCenter();
}
function zoomAt(next, cx, cy){
  const oldScale=state.scale;
  const wx=(cx-state.ox)/oldScale, wy=(cy-state.oy)/oldScale;
  state.zoom=clamp(next,ZOOM_MIN,ZOOM_MAX);
  state.scale=state.fit*state.zoom;
  state.ox=cx-wx*state.scale;state.oy=cy-wy*state.scale;
  clampOffsets();centerFromOffsets();renderCamera();
}
function panBy(dx,dy){
  state.ox+=dx;state.oy+=dy;
  clampOffsets();centerFromOffsets();renderCamera();
}
function localPoint(event){
  const b=viewport.getBoundingClientRect();
  return {x:event.clientX-b.left,y:event.clientY-b.top};
}
function pair(){
  const points=Array.from(state.pointers.values());
  if(points.length<2)return null;
  return {mid:{x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2},
  distance:Math.max(1,Math.hypot(points[0].x-points[1].x,points[0].y-points[1].y))};
}
function beginPinch(){
  const p=pair();if(!p){state.pinch=null;return;}
  state.pinch={distance:p.distance,zoom:state.zoom,
    world:{x:(p.mid.x-state.ox)/state.scale,y:(p.mid.y-state.oy)/state.scale}};
}
viewport.addEventListener("pointerdown",event=>{
  if(event.target.closest("button"))return;
  state.pointers.set(event.pointerId,localPoint(event));
  try{viewport.setPointerCapture(event.pointerId);}catch{}
  if(state.pointers.size===2)beginPinch();
});
viewport.addEventListener("pointermove",event=>{
  if(!state.pointers.has(event.pointerId))return;
  const previous=state.pointers.get(event.pointerId),p=localPoint(event);
  state.pointers.set(event.pointerId,p);
  if(state.pointers.size>=2){
    if(!state.pinch)beginPinch();
    const active=pair();
    if(active && state.pinch){
      state.zoom=clamp(state.pinch.zoom*active.distance/state.pinch.distance,ZOOM_MIN,ZOOM_MAX);
      state.scale=state.fit*state.zoom;
      state.ox=active.mid.x-state.pinch.world.x*state.scale;
      state.oy=active.mid.y-state.pinch.world.y*state.scale;
      clampOffsets();centerFromOffsets();renderCamera();
    }
  }else{panBy(p.x-previous.x,p.y-previous.y);}
});
function finishPointer(event){
  state.pointers.delete(event.pointerId);state.pinch=null;
  if(state.pointers.size>=2)beginPinch();
}
viewport.addEventListener("pointerup",finishPointer);
viewport.addEventListener("pointercancel",finishPointer);
viewport.addEventListener("lostpointercapture",finishPointer);
viewport.addEventListener("wheel",event=>{
  event.preventDefault();
  const p=localPoint(event);
  zoomAt(state.zoom*(event.deltaY<0?1.16:1/1.16),p.x,p.y);
},{passive:false});
viewport.addEventListener("keydown",event=>{
  const p=dimensions();
  if(event.key==="+"){zoomAt(state.zoom*1.2,p.w/2,p.h/2);}
  else if(event.key==="-"){zoomAt(state.zoom/1.2,p.w/2,p.h/2);}
  else if(event.key==="ArrowLeft")panBy(40,0);
  else if(event.key==="ArrowRight")panBy(-40,0);
  else if(event.key==="ArrowUp")panBy(0,40);
  else if(event.key==="ArrowDown")panBy(0,-40);
  else return;
  event.preventDefault();
});
document.querySelector("#zoom-in").addEventListener("click",()=>{const {w,h}=dimensions();zoomAt(state.zoom*1.35,w/2,h/2);});
document.querySelector("#zoom-out").addEventListener("click",()=>{const {w,h}=dimensions();zoomAt(state.zoom/1.35,w/2,h/2);});
document.querySelector("#reset").addEventListener("click",()=>{state.zoom=1;state.center={x:512,y:256};positionFromCenter();});
document.querySelector("#toggle-names").addEventListener("click",()=>{
  state.namesVisible=!state.namesVisible;
  names.hidden=!state.namesVisible;names.inert=!state.namesVisible;
  document.querySelector("#toggle-names").textContent=state.namesVisible?"Masquer les noms":"Afficher les noms";
  document.querySelector("#toggle-names").setAttribute("aria-pressed",String(!state.namesVisible));
});
document.querySelectorAll("[data-preview]").forEach(button=>button.addEventListener("click",event=>{
  event.stopPropagation();
  const item=previewData[button.dataset.preview];if(!item)return;
  const node=document.querySelector("#preview");node.replaceChildren();
  const strong=document.createElement("strong"),p=document.createElement("p");
  strong.textContent=item[0];p.textContent=item[1];node.append(strong,p);
}));
function wanted(level){
  if(level.z===0)return level.tiles;
  const {w,h}=dimensions();
  const minX=Math.max(0,(-state.ox/state.scale));
  const maxX=Math.min(WIDTH,(w-state.ox)/state.scale);
  const minY=Math.max(0,(-state.oy/state.scale));
  const maxY=Math.min(HEIGHT,(h-state.oy)/state.scale);
  const margin=level.tile_world_width;
  return level.tiles.filter(t=>{
    const x=t.x*level.tile_world_width,y=t.y*level.tile_world_height;
    return x+level.tile_world_width>=minX-margin&&x<=maxX+margin&&
      y+level.tile_world_height>=minY-margin&&y<=maxY+margin;
  });
}
function tileKey(z,x,y){return z+"-"+x+"-"+y;}
function release(key,record){
  record.image.onload=null;record.image.onerror=null;
  record.image.removeAttribute("src");record.image.remove();
  state.tiles.delete(key);state.counts.evicted++;
}
function requestTile(level,tile){
  const key=tileKey(level.z,tile.x,tile.y);
  if(state.tiles.has(key))return;
  const image=new Image();
  image.alt="";image.decoding="async";image.loading="eager";
  image.dataset.tile=key;image.id="tile-"+key;
  image.style.left=(tile.x*level.tile_world_width)+"px";
  image.style.top=(tile.y*level.tile_world_height)+"px";
  image.style.width=level.tile_world_width+"px";
  image.style.height=level.tile_world_height+"px";
  const record={image,loaded:false,failed:false};
  state.tiles.set(key,record);state.counts.requested++;
  state.counts.peak=Math.max(state.counts.peak,state.tiles.size);
  image.onload=()=>{
    if(state.tiles.get(key)!==record)return;
    record.loaded=true;state.counts.loaded++;
    if(level.z===0){loading.textContent="Fond de secours prêt · POC neutre";viewport.dataset.ready="true";}
    renderDiagnostics();
  };
  image.onerror=()=>{
    if(state.tiles.get(key)!==record)return;
    record.failed=true;state.counts.failed++;
    if(level.z===0){loading.textContent="Erreur du fond de secours";viewport.dataset.ready="false";}
    else loading.textContent="Tuile indisponible : fond de niveau inférieur conservé";
    release(key,record);renderDiagnostics();
  };
  document.querySelector("#tile-z"+level.z).append(image);
  image.src=tile.src;
}
function renderTiles(){
  if(!state.manifest)return;
  const active=new Set();
  for(const level of state.manifest.levels){
    if(level.z===1 && state.zoom<1.45)continue;
    if(level.z===2 && state.zoom<2.55)continue;
    for(const tile of wanted(level)){
      const key=tileKey(level.z,tile.x,tile.y);active.add(key);
      requestTile(level,tile);
    }
  }
  for(const [key,record] of state.tiles)if(!active.has(key))release(key,record);
}
function renderDiagnostics(){
  const c=state.counts;
  diagnostics.replaceChildren();
  const entries=[
    ["Zoom",Math.round(state.zoom*100)+" %"],
    ["Centre Ardéra",((20+state.center.x/1024*20).toFixed(2))+" / "+((34+state.center.y/512*20).toFixed(2))],
    ["Chargées",String(c.loaded)],["Erreurs",String(c.failed)],
    ["Tuiles actives",String(state.tiles.size)],["Pic actif",String(c.peak)],
    ["Libérées",String(c.evicted)]
  ];
  for(const [key,val] of entries){
    const dt=document.createElement("dt"),dd=document.createElement("dd");
    dt.textContent=key;dd.textContent=val;diagnostics.append(dt,dd);
  }
}
globalThis.__ATLAS_A1_DIAGNOSTICS__=()=>{
  const c=state.counts;
  return Object.freeze({
    poc:true,ready:viewport.dataset.ready==="true",zoom:state.zoom,
    center:{x:state.center.x,y:state.center.y},namesVisible:state.namesVisible,
    manifest:state.manifest?.asset_revision||null,
    requested:c.requested,loaded:c.loaded,failed:c.failed,evicted:c.evicted,
    active:state.tiles.size,peak:c.peak,
    keys:Array.from(state.tiles.keys()),lowerFallbackReady:state.tiles.get("0-0-0")?.loaded===true
  });
};
try{
  const response=await fetch("./manifest.json",{cache:"no-cache"});
  if(!response.ok)throw Error("Manifest "+response.status);
  const manifest=await response.json();
  if(manifest.map_id!=="ardera"||manifest.poc!==true||manifest.levels.length!==3||
    manifest.coordinate_system.local_width!==WIDTH||manifest.coordinate_system.local_height!==HEIGHT)throw Error("Manifest A1 invalide");
  for(const level of manifest.levels){
    if(!Number.isInteger(level.z)||!Array.isArray(level.tiles))throw Error("Niveau invalide");
    for(const tile of level.tiles)if(!/^\.\/tiles\/z[012]\/[0-9]+-[0-9]+\.svg$/.test(tile.src))throw Error("Chemin tuile invalide");
  }
  state.manifest=manifest;recalcFit();
  new ResizeObserver(recalcFit).observe(viewport);
}catch(error){
  loading.textContent="POC indisponible : "+error.message;
  viewport.dataset.ready="false";renderDiagnostics();
}
