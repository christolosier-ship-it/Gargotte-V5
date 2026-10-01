import { MAPS, DUNGEONS } from "./map-v2-data.js";
import { CARTOGRAPHY, DESTINATIONS, SPRITE_PLACEMENTS } from "./map-v2-cartography.js";
const MAP_CACHE = "map-v2-active-v1";
// Display preferences are session-only. No database writes or campaign permissions.
let currentMap = "entrevers";
let showDungeons = true;
let showToponyms = true;
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[char]);
const button = (label, action, attrs="") => '<button type="button" class="map-action-button" data-map-action="'+action+'" '+attrs+'>'+esc(label)+'</button>';
function labelsMarkup(id) {
  if (!showToponyms || id === "entrevers") return "";
  const labels = MAPS[id].toponyms.map(([name,x,y,kind]) =>
    '<span class="map-toponym map-toponym-'+kind+'" style="--x:'+x+'%;--y:'+y+'%" title="'+esc(name)+'">'+esc(name)+'</span>').join("");
  const destinations=(DESTINATIONS[id]||[]).map(d =>
    '<span class="map-toponym map-toponym-destination" style="--x:'+d.label[0]+'%;--y:'+d.label[1]+'%">'+esc(MAPS[d.id].title)+'</span>').join("");
  const dungeonLabels=(DUNGEONS[id]||[]).filter(([d])=>d!=="D06").map(([d,name])=>{
    const p=SPRITE_PLACEMENTS[d];
    return '<span class="map-toponym map-dungeon-label" style="--x:'+p[5]+'%;--y:'+p[6]+'%">'+esc(name)+'</span>';
  }).join("");
  return labels+destinations+dungeonLabels;
}
function renderMapView() {
  const id=currentMap, map=MAPS[id], spec=CARTOGRAPHY[id], parent=MAPS[map.parent];
  const destinations=DESTINATIONS[id]||[], dungeonList=DUNGEONS[id]||[];
  const hasLabels=id!=="entrevers" && (map.toponyms.length || destinations.length || dungeonList.length);
  const paths=destinations.map(d=>'<polygon class="map-hotspot map-hotspot-'+d.kind+'" points="'+d.points+'" role="button" tabindex="0" data-map-action="open" data-map-id="'+d.id+'" aria-label="Ouvrir '+esc(MAPS[d.id].title)+'"><title>'+esc(MAPS[d.id].title)+'</title></polygon>').join("");
  const pins=dungeonList.filter(([d])=>d!=="D06").map(([d,name,file])=>{
    const p=SPRITE_PLACEMENTS[d];
    return '<div class="map-dungeon-pin" data-placement-id="'+d+'" style="--x:'+p[0]+'%;--y:'+p[1]+'%;--sprite-width:'+p[2]+'%;--foot-x:'+p[3]+'%;--foot-y:'+p[4]+'%" role="img" aria-label="'+esc(d+" — "+name+" (placement proposé, non canonique)")+'"><img src="assets/sprites/'+file+'" alt="" loading="eager" decoding="async"></div>';
  }).join("");
  const underground=dungeonList.find(([d])=>d==="D06");
  const cutaway=underground?'<aside class="map-underground" aria-label="Niveau souterrain sous D05"><img src="assets/sprites/'+underground[2]+'" alt="D06 — '+esc(underground[1])+'" loading="eager" decoding="async"><p>D06 · '+esc(underground[1])+'<br><small>Coupe souterraine · directement sous D05, même emplacement.</small></p></aside>':"";
  const links=destinations.length?'<details class="map-destinations"><summary>Destinations accessibles ('+destinations.length+')</summary><nav aria-label="Destinations de '+esc(map.title)+'">'+destinations.map(d=>button(MAPS[d.id].title,"destination",'data-map-id="'+d.id+'"')).join("")+'</nav></details>':"";
  const names=hasLabels?'<details class="map-name-index"><summary>Noms et repères de la carte</summary><ul>'+[...map.toponyms.map(([name])=>name),...destinations.map(d=>MAPS[d.id].title)].map(name=>'<li>'+esc(name)+'</li>').join('')+dungeonList.map(([d,name])=>'<li class="map-dungeon-index">'+esc(d+' · '+name)+'</li>').join('')+'</ul></details>':'';
  const detailControl=button('Détails de la carte','toggle-detail','aria-pressed="false"');
  return '<section class="map-v2-page '+(showDungeons?"":"is-dungeons-hidden")+'" data-map-current="'+id+'" aria-labelledby="map-page-title"><header class="map-v2-header"><div><p class="map-eyebrow">Atlas · consultation</p><h1 id="map-page-title">'+esc(map.title)+'</h1><p class="map-status-note">Placements proposés sur les fonds validés, à annoter ; coordonnées non canoniques.</p></div><div class="map-toolbar">'+(parent?button("Retour à "+parent.title,"back"):"")+(hasLabels?button("Toponymes : "+(showToponyms?"affichés":"masqués"),"toggle-toponyms",'aria-pressed="'+showToponyms+'"'):"")+detailControl+(dungeonList.length?button(showDungeons?"Masquer les donjons":"Afficher les donjons","toggle-dungeons",'aria-pressed="'+showDungeons+'"'):"")+'</div></header><p class="map-reading-hint">Vue d’ensemble ; sur petit écran, les repères secondaires se lisent dans « Détails ». La carte agrandie se parcourt par défilement.</p><div class="map-v2-viewport" tabindex="0" role="region" aria-label="Carte défilante"><div class="map-v2-frame '+(id==="entrevers"?"is-entrevers":"")+'" style="--map-ratio:'+spec.size[0]/spec.size[1]+'"><img class="map-v2-image" src="'+esc(map.image)+'" width="'+spec.size[0]+'" height="'+spec.size[1]+'" alt="Carte illustrée : '+esc(map.title)+'" loading="eager" decoding="async">'+pins+'<div class="map-labels">'+labelsMarkup(id)+'</div><svg class="map-hotspots" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Zones cliquables de '+esc(map.title)+'">'+paths+'</svg></div></div>'+cutaway+links+names+'<footer class="map-v2-footer"><span>'+esc(map.title)+'</span><span>Les repères de donjon ne sont pas encore ouvrants.</span></footer></section>';
}
function bindMapViewActions(root = document) {
  const pageView=root.querySelector(".map-v2-page");
  if (!pageView) return;
  const image=pageView.querySelector(".map-v2-image"), frame=image.closest(".map-v2-frame");
  const ready=()=>frame.classList.add("is-image-ready");
  if (image.complete && image.naturalWidth>0) ready();
  else image.addEventListener("load",ready,{once:true});
  let navigating=false;
  const activate=async element=>{
    if (!element || navigating) return;
    const action=element.dataset.mapAction;
    if (action==="toggle-detail") {
      const detail=pageView.classList.toggle("is-detail-view");
      element.setAttribute("aria-pressed",detail);
      element.textContent=detail?"Vue d’ensemble":"Détails de la carte";
      const viewport=pageView.querySelector('.map-v2-viewport');
      viewport.scrollTo({left:0,top:0});
      return;
    }
    if (action==="toggle-dungeons" || action==="toggle-toponyms") {
      handleMapAction(element);
      pageView.classList.toggle("is-dungeons-hidden",!showDungeons);
      pageView.querySelector(".map-labels").innerHTML=labelsMarkup(currentMap);
      element.setAttribute("aria-pressed",action==="toggle-dungeons"?showDungeons:showToponyms);
      element.textContent=action==="toggle-dungeons"?(showDungeons?"Masquer les donjons":"Afficher les donjons"):("Toponymes : "+(showToponyms?"affichés":"masqués"));
      return;
    }
    const next=(action==="back" || action==="map-back")?MAPS[currentMap].parent:element.dataset.mapId;
    if (!["open","destination","back","map-back"].includes(action) || !MAPS[next]) return;
    navigating=true;
    pageView.setAttribute("aria-busy","true");
    // Evict the old map before requesting the next, including in-flight SW fetches.
    await evictMapAssetCache();
    const main=pageView.closest("#main-content");
    if (!pageView.isConnected || !main) return;
    openMap(next);
    main.innerHTML=renderMapView();
    bindMapViewActions(main);
    const heading=main.querySelector("#map-page-title");
    heading.tabIndex=-1;
    heading.focus({preventScroll:true});
  };
  pageView.addEventListener("click",event=>{
    const element=event.target.closest?.("[data-map-action]");
    if (element && pageView.contains(element)) void activate(element);
  });
  pageView.addEventListener("keydown",event=>{
    const element=event.target.closest?.(".map-hotspot");
    if (element && ["Enter"," "].includes(event.key)) {
      event.preventDefault(); void activate(element);
    }
  });
}
async function evictMapAssetCache(){
  const controlled = navigator.serviceWorker?.controller;
  if (controlled && typeof MessageChannel !== "undefined") {
    const acknowledged = await new Promise(resolve => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); resolve(false); }, 900);
      channel.port1.onmessage = () => { clearTimeout(timer); channel.port1.close(); resolve(true); };
      try {
        controlled.postMessage({ type:"MAP_V2_EVICT" }, [channel.port2]);
      } catch (_) {
        clearTimeout(timer);
        channel.port1.close();
        resolve(false);
      }
    });
    if (!acknowledged && "caches" in window) await caches.delete(MAP_CACHE).catch(() => {});
  } else if ("caches" in window) {
    await caches.delete(MAP_CACHE).catch(() => {});
  }
}

function openMap(id){ if(!MAPS[id]) return false; currentMap=id; return true; }
function handleMapAction(element){
  const action=element?.dataset?.mapAction;
  if(action==="open" || action==="destination") return openMap(element.dataset.mapId);
  if(action==="back" || action==="map-back") return openMap(MAPS[currentMap]?.parent || "entrevers");
  if(action==="toggle-dungeons"){ showDungeons=!showDungeons; return true; }
  if(action==="toggle-toponyms"){ showToponyms=!showToponyms; return true; }
  return false;
}
window.addEventListener("pagehide", () => {
  if (document.querySelector(".map-v2-page")) void evictMapAssetCache();
});
export { renderMapView, handleMapAction, bindMapViewActions, evictMapAssetCache, openMap };
