const MAP_CACHE = "map-v2-active-v1";
// Dungeon visibility defaults to shown and remains an in-memory preference for this app session.
const MAPS = {
  entrevers: { title: "L’Entrevers", image: "assets/maps/Entrevers - Le n’importe quoi primordiale.webp", type: "hub", parent: null, toponyms: [] },
  ardera: { title: "Ardéra", image: "assets/maps/Ardera.webp", type: "world", parent: "entrevers", toponyms: [
    ["Océan des Longs Silences",50,5,"water"],["Océan d’Outrebrume",18,20,"water"],["Océan des Mille Voiles",70,34,"water"],["Océan Austral",51,94,"water"],
    ["Mer Boréale",49,26,"water"],["Mer des Trois Couronnes",52,68,"water"],["Mer des Éclats",71,49,"water"],["Mer des Lanternes",83,75,"water"],["Mer aux Cent Passes",90,83,"water"]
  ] },
  austrebrume: { title:"Austrébrume", image:"assets/maps/Austrebrume.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Fjords de Nacrelune",17,14],["Les Bois des Dernières Feuilles",48,14],["Les Monts du Voile",48,42],["Le Bassin des Lacs Sombres",77,24],["Les Landes du Grand Hiver",49,69],["La Couronne Blanche",50,91],["Cascades de Brume",76,60,"secondary"],["Falaises de Nacrelune",14,30,"secondary"],["Plateaux du Dernier Vent",60,81,"secondary"]
  ] },
  boreclat: { title:"Boréclat", image:"assets/maps/Boreclat.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Fjords des Brisants",50,88],["La Grande Taïga",24,67],["Les Crêtes du Haut-Givre",51,48],["Aiguilles Boréales",58,41,"secondary"],["Le Plateau des Blancs Silences",50,17],["Le Pays des Sept Lacs",47,67],["Les Marches d’Écume",81,49]
  ] },
  ferrecime: { title:"Ferrécime", image:"assets/maps/Ferrecime.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Portes du Givre",50,12],["L’Échine d’Ardéra",50,44],["Les Hauts Plateaux de Silex",22,55],["Les Vallées des Mille Cascades",77,48],["Les Hautes Voûtes",61,65],["Cimes Suspendues",61,43,"secondary"],["Les Marches de Braise",76,85]
  ] },
  pelagreve: { title:"Pélagrève", image:"assets/maps/Pelagreve.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Côtes des Éclats",20,23],["Les Mers Encloses",48,49],["La Dorsale des Fournaises",72,24],["Le Labyrinthe Corallien",56,57,"secondary"],["Les Côtes des Alizés",83,51],["La Ceinture des Lagons",70,80],["Les Marches des Marées",24,79]
  ] },
  sahaldune: { title:"Sahaldune", image:"assets/maps/Sahaldune.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Côtes d’Ambre",49,12],["Les Monts Fendus",16,50],["La Grande Dépression",49,52],["La Couronne de Sel",47,56,"secondary"],["Les Vallées des Deux Fleuves",67,26],["Les Savanes d’Olvara",83,55],["Le Littoral des Moussons",50,88]
  ] },
  sylvaronde: { title:"Sylvaronde", image:"assets/maps/Sylvaronde.webp", type:"continent", parent:"ardera", toponyms:[
    ["Le Delta des Mille Bras",17,20],["Le Bassin des Grandes Eaux",39,53],["La Forêt des Hautes Couronnes",59,30],["La Canopée-Monde",64,35,"secondary"],["Les Monts des Orages",83,49],["Les Hautes Brumes",77,19],["Les Marches du Sud",51,87]
  ] },
  valdorie: { title:"Valdorie", image:"assets/maps/Valdorie.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Côtes Grises",13,39],["Les Hautes Marches",49,19],["La Sylve des Anciens",80,34],["Les Plaines de Valdor",50,59],["Les Bassins de l’Est",78,68],["Les Terres de Cendre",25,79],
    ["Arbres-Colosses",82,24,"secondary"],["Saint-Fût-le-Petit",39,54,"secondary"],["La Chope Qui Colle",43,58,"secondary"],["L’Avelorne",67,58,"secondary"],["La Rivombre",24,48,"secondary"],["Ruisseau des Saules",41,51,"secondary"],["Lac d’Ysambre",82,59,"secondary"],["Collines de la Vieille Lande",33,57,"secondary"],["Monts d’Escarbelle",25,85,"secondary"]
  ] },
  brasserie: { title:"La Brasserie Céleste", image:"assets/maps/La Brasserie Céleste.webp", type:"dimension", parent:"entrevers", toponyms:[
    ["Le Grand Cœur Brassicole",52,53,"major"],["L’Axe des Fermentations",49,30,"major"],["Les Treilles Hautes",31,41,"major"],["La Coulée Ambrée",18,56,"major"],["Les Voûtes du Vieillissement",70,55,"major"],["La Haute Ivresse",80,72,"major"],["Le Grand Nid",84,66,"secondary"],
    ["Les Liaisons Hautes",39,21,"secondary"],["Les Aqueducs de Mousse",58,19,"secondary"],["Les Clos du Cône",23,32,"secondary"],["Les Forges de Cuisson",65,38,"secondary"],["Les Cuves Hautes",57,65,"secondary"],["Les Foudres Anciens",37,75,"secondary"],["La Salle du Goût Dernier",68,81,"secondary"],["Le Déversoir Joyeux",16,76,"secondary"],["Le Pont des Mauvaises Humeurs",53,88,"secondary"]
  ] },
  enfer: { title:"L’Enfer de la Sobriété Éternelle", image:"assets/maps/L’Enfer de la Sobriété Eternelle.webp", type:"dimension", parent:"entrevers", toponyms:[
    ["La Citadelle de la Mesure",52,47,"major"],["La Tour du Rappel",55,21,"major"],["Le Canal de la Juste Goutte",40,65,"major"],["Les Bassins du Miroir Froid",64,57,"major"],["Le Promontoire des Eaux",20,48,"major"],["Le Parvis du Monolithe",82,46,"major"],
    ["Les Cloîtres de l’Équilibre",37,39,"secondary"],["La Cour des Rangs",68,34,"secondary"],["Les Halles de Distribution",32,59,"secondary"],["Le Tribunal de la Mesure",65,70,"secondary"],["Les Écluses de Purification",48,77,"secondary"],["Les Galeries de Régulation",78,61,"secondary"],["Les Portiques du Contrôle",28,27,"secondary"],["La File de l’Infini",17,83,"secondary"],["Le Guichet des Dernières Gouttes",75,83,"secondary"],["Le Banc de la Pause Autorisée",42,89,"secondary"]
  ] },
  cite_sous_marine: { title:"Cité sous-marine de Pélagrève", image:"assets/maps/Pelagreve_Carte_Cite_Sous_Marine.webp", type:"child", parent:"pelagreve", toponyms:[] }
};
const CONTINENTS = [
  ["austrebrume","Austrébrume",19,30],["boreclat","Boréclat",52,20],["ferrecime","Ferrécime",72,37],
  ["pelagreve","Pélagrève",84,68],["sahaldune","Sahaldune",22,67],["sylvaronde","Sylvaronde",60,71],["valdorie","Valdorie",45,49]
];
const DUNGEONS = {
  valdorie: [
    ["D01","Le Château Bastognac","Valdorie_D01_Chateau_Bastognac.webp",32,53],
    ["D02","La Forêt en Chantier","Valdorie_D02_Foret_en_Chantier.webp",40,43],
    ["D03","Hôtel Zombifornia","Valdorie_D03_Hotel_Zombifornia.webp",49,61],
    ["D04","Le Cabaret des Joyeuses","Valdorie_D04_Cabaret_des_Joyeuses.webp",54,65],
    ["D05","Le Sanctuaire du Houblon Noir","Valdorie_D05_Sanctuaire_Houblon_Noir.webp",58,24],
    ["D06","Le Panthéon des Fermentations Interdites","Valdorie_D06_Pantheon_Fermentations_Interdites.webp",58,24],
    ["D09","Le Bastion du Sauciflard","Valdorie_D09_Bastion_Sauciflard_Q95.webp",82,29],
    ["D10","Les Thermes de la Bonne Trempette","Valdorie_D10_Thermes_Bonne_Trempette_Q95.webp",12,44],
    ["D11","La Ruche Royale","Valdorie_D11_Ruche_Royale_Q95.webp",73,55]
  ],
  ferrecime:[
    ["D12","Le Monastère des Dénaturées","Ferrecime_D12_Monastere_des_Denaturees.webp",28,56],
    ["D14","La Citadelle des Tonneaux Perchés","Ferrecime_D14_Citadelle_des_Tonneaux_Perches.webp",61,64],
    ["D15","Le Gynécotron du Gnome Tordu","Ferrecime_D15_Gynecotron_du_Gnome_Tordu.webp",77,84]
  ],
  sylvaronde:[
    ["D13","Les Marécages Infectés","Sylvaronde_D13_Marecages_Infectes.webp",18,22]
  ]
};
let currentMap = "entrevers";
let showDungeons = true;
let showToponyms = true;
const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[char]);
const button = (label, action, attrs="", icon="") => '<button type="button" class="map-action-button" data-map-action="'+action+'" '+attrs+'>'+icon+'<span>'+esc(label)+'</span></button>';
function renderMapView(){
  const map = MAPS[currentMap] || MAPS.entrevers;
  const isHub = map.type === "hub";
  const parent = map.parent && MAPS[map.parent];
  const nav = isHub
    ? '<button class="map-hotspot map-hotspot-dimension" style="--x:27%;--y:55%" data-map-action="open" data-map-id="brasserie" aria-label="Ouvrir la carte La Brasserie Céleste"><span>La Brasserie Céleste</span></button><button class="map-hotspot map-hotspot-dimension" style="--x:71%;--y:50%" data-map-action="open" data-map-id="enfer" aria-label="Ouvrir la carte L’Enfer de la Sobriété Éternelle"><span>L’Enfer de la Sobriété Éternelle</span></button><button class="map-hotspot map-hotspot-world" style="--x:51%;--y:48%" data-map-action="open" data-map-id="ardera" aria-label="Ouvrir la mappemonde d’Ardéra"><span>Ardéra</span></button>'
    : currentMap === "ardera"
      ? CONTINENTS.map(([id,name,x,y]) => '<button class="map-hotspot map-hotspot-continent" style="--x:'+x+'%;--y:'+y+'%" data-map-action="open" data-map-id="'+id+'" aria-label="Ouvrir le continent '+esc(name)+'"><span>'+esc(name)+'</span></button>').join("")
      : currentMap === "pelagreve"
        ? '<button class="map-hotspot map-hotspot-child" style="--x:54%;--y:59%" data-map-action="open" data-map-id="cite_sous_marine" aria-label="Ouvrir la carte de la cité sous-marine"><span>Cité sous-marine</span></button>'
        : "";
  const toponyms = showToponyms ? map.toponyms.map(([name,x,y,kind="region"]) => '<span class="map-toponym map-toponym-'+kind+'" style="--x:'+x+'%;--y:'+y+'%" title="'+esc(name)+'">'+esc(name)+'</span>').join("") : "";
  const dungeonList = DUNGEONS[currentMap] || [];
  const dungeonPins = dungeonList.filter(([id]) => id !== "D05" && id !== "D06").map(([id,name,file,x,y]) => '<div class="map-dungeon-pin" style="--x:'+x+'%;--y:'+y+'%" role="img" aria-label="'+esc(id+" — "+name+" (placement provisoire à annoter)")+'"><img src="assets/sprites/'+file+'" alt="" loading="eager" decoding="async"><span class="map-dungeon-label">'+esc(name)+'</span></div>').join("") + (currentMap === "valdorie" ? '<div class="map-dungeon-pair" style="--x:58%;--y:24%" role="img" aria-label="D05 — Le Sanctuaire du Houblon Noir et D06 — Le Panthéon des Fermentations Interdites partagent une ancre planimétrique provisoire à annoter"><div class="map-dungeon-pair-icons"><img src="assets/sprites/Valdorie_D05_Sanctuaire_Houblon_Noir.webp" alt="" loading="eager" decoding="async"><img src="assets/sprites/Valdorie_D06_Pantheon_Fermentations_Interdites.webp" alt="" loading="eager" decoding="async"></div><span class="map-dungeon-label">D05 · Le Sanctuaire du Houblon Noir<br>D06 · Le Panthéon des Fermentations Interdites</span></div>' : "");
  const markup = '<section class="map-v2-page" aria-labelledby="map-page-title"><header class="map-v2-header"><div><p class="map-eyebrow">Atlas · consultation</p><h1 id="map-page-title">'+esc(map.title)+'</h1><p class="map-status-note">Les ancres de toponymie et de donjons marquées dans cette première intégration sont des propositions visuelles à annoter.</p></div><div class="map-toolbar">'+(parent?button("Retour à "+parent.title,"map-back",'aria-label="Retour à '+esc(parent.title)+'"'):"")+(map.toponyms.length?'<button type="button" class="map-action-button '+(showToponyms?"is-on":"")+'" data-map-action="toggle-toponyms" aria-pressed="'+showToponyms+'"><span>Toponymes</span><span class="map-toggle-state">'+(showToponyms?"affichés":"masqués")+'</span></button>':"")+(DUNGEONS[currentMap]?'<button type="button" class="map-action-button '+(showDungeons?"is-on":"")+'" data-map-action="toggle-dungeons" aria-label="'+(showDungeons?"Masquer les donjons":"Afficher les donjons")+'" aria-pressed="'+showDungeons+'"><span>'+(showDungeons?"Masquer les donjons":"Afficher les donjons")+'</span><span class="map-toggle-state">'+(showDungeons?"visibles":"masqués")+'</span></button>':"")+'</div></header><div class="map-v2-frame '+(isHub?"is-entrevers":"")+' '+(showDungeons?"":"is-dungeons-hidden")+'"><img class="map-v2-image" src="'+esc(map.image)+'" alt="Carte illustrée : '+esc(map.title)+'" loading="eager" decoding="async">'+toponyms+'<div class="map-hotspots" aria-label="Destinations cartographiques">'+nav+'</div>'+dungeonPins+'</div><footer class="map-v2-footer"><span>'+esc(map.title)+'</span><span>Les repères de donjon ne sont pas encore ouvrants.</span></footer></section>';
  queueMicrotask(() => {
    const image = document.querySelector(".map-v2-image");
    if (!image) return;
    const frame = image.closest(".map-v2-frame");
    if (!frame) return;
    const markReady = () => frame.classList.add("is-image-ready");
    if (image.complete && image.naturalWidth > 0) markReady();
    else image.addEventListener("load", markReady, { once: true });

  });
  return markup;
}
function bindMapViewActions(root = document) {
  const frame = root.querySelector(".map-v2-frame");
  if (!frame) return;
  frame.dataset.mapActionsBound = "true";
  frame.addEventListener("click", event => {
    frame.dataset.mapActionClick = event.target?.closest?.("[data-map-action]")?.dataset?.mapId || "frame";
    let buttonElement = event.target?.closest?.("[data-map-action]");
    if (!buttonElement) {
      let nearestDistance = Infinity;
      for (const candidate of frame.querySelectorAll(".map-hotspot[data-map-action]")) {
        const rect = candidate.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        const distance = dx * dx + dy * dy;
        if (distance < nearestDistance) {
          nearestDistance = distance;
          buttonElement = candidate;
        }
      }
      if (nearestDistance > 44 * 44) buttonElement = null;
    }
    if (!buttonElement || !handleMapAction(buttonElement)) return;
    const action = buttonElement.dataset.mapAction;
    if (action === "open" || action === "back" || action === "map-back") void evictMapAssetCache();
    const page = document.querySelector("#main-content");
    if (page?.querySelector(".map-v2-page")) {
      page.innerHTML = renderMapView();
      bindMapViewActions(page);
    }
  }, true);
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
function handleMapAction(buttonElement){
  const action=buttonElement?.dataset?.mapAction;
  if(action==="open") return openMap(buttonElement.dataset.mapId);
  if(action==="back" || action==="map-back") return openMap(MAPS[currentMap]?.parent || "entrevers");
  if(action==="toggle-dungeons"){ showDungeons=!showDungeons; return true; }
  if(action==="toggle-toponyms"){ showToponyms=!showToponyms; return true; }
  return false;
}


window.addEventListener("pagehide", () => {
  if (document.querySelector(".map-v2-page")) void evictMapAssetCache();
});

export { renderMapView, handleMapAction, bindMapViewActions, evictMapAssetCache, openMap };
