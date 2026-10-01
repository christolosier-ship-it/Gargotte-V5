// Image-local percentages, not canonical geodata. See the correction register.
// Labels, click contours and sprite feet are deliberately independent.
const source = file => `docs/v6-map/V6-MAP-V2-${file}.md`;
export const CARTOGRAPHY = {
  entrevers: { size:[3548,1774], source:source('ENTREVERS'), landmark:'Taverne Ardéra ; jardin brassicole à droite ; cité froide en bas à droite', labels:[] },
  ardera: { size:[4000,2000], source:source('SOCLE-GEOGRAPHIQUE-ARDERA'), landmark:'Sept silhouettes terrestres de la mappemonde', labels:[[24,7],[10,23],[71,21],[78,93],[49,28],[37,49],[72,64],[87,83],[94,65]] },
  austrebrume: { size:[3548,1774], source:source('CONTINENT-AUSTREBRUME'), landmark:'Fjords ouest, bois nord, montagnes médianes, lacs est, calotte sud', labels:[[19,35],[37,30],[49,47],[76,31],[68,57],[43,67],[57,39],[18,44],[70,67]] },
  boreclat: { size:[3072,2048], source:source('CONTINENT-BORECLAT'), landmark:'Plateau polaire nord ; lacs centraux ; fjords sud ; îles orientales', labels:[[48,73],[25,49],[52,29],[60,20],[49,8],[51,45],[87,54]] },
  ferrecime: { size:[3072,2048], source:source('CONTINENT-FERRECIME'), landmark:'Plateaux ochres ouest ; montagne axiale ; îles flottantes ; roches est ; volcans sud-est', labels:[[38,10],[43,28],[22,33],[80,32],[70,49],[54,41],[64,90]] },
  pelagreve: { size:[2048,3072], source:source('CONTINENT-PELAGREVE'), landmark:'Côtes rocheuses nord-ouest ; mer sombre centrale ; volcan nord-est ; récifs sud-est', labels:[[21,18],[45,28],[79,13],[87,76],[85,37],[55,57],[28,69]] },
  sahaldune: { size:[3072,2048], source:source('CONTINENT-SAHALDUNE'), landmark:'Côte nord ; montagne ouest ; bassin salin ; deux fleuves nord-est ; savane est', labels:[[42,10],[21,44],[49,40],[49,50],[61,22],[82,48],[56,78]] },
  sylvaronde: { size:[3072,2048], source:source('CONTINENT-SYLVARONDE'), landmark:'Delta nord-ouest ; grands arbres nord ; montagne est ; routes méridionales', labels:[[21,14],[33,52],[54,34],[47,12],[83,43],[78,13],[49,79]] },
  // Owner's annotated MJ plate: text centres near the depicted features, not marker tips.
  // See the artistic correction register for feature anchors and the deferred sprite pass.
  valdorie: { size:[3072,2048], source:source('CONTINENT-VALDORIE'), landmark:'Port ouest ; hautes montagnes ; arbres géants nord-est ; cité fortifiée centrale ; bassins est', labels:[[18,17],[46.5,13],[83,14],[53,46],[84,62],[18,65],[79,19],[77,39],[83,47],[55,29],[12,39],[87,38],[88,70],[36,42],[22,73]] },
  brasserie: { size:[2048,3072], source:source('DIMENSION-BRASSERIE-CELESTE'), landmark:'Treilles en haut ; axe médian ; cuves centrales ; vieux foudres en bas à gauche ; statue et poule à droite', labels:[[55,57],[53,28],[47,12],[22,44],[22,77],[85,38],[86,24],[35,20],[69,18],[40,16],[29,63],[53,46],[17,67],[68,62],[78,67],[53,89]] },
  enfer: { size:[2048,3072], source:source('DIMENSION-ENFER-SOBRIETE-ETERNELLE'), landmark:'Citadelle haute ; canal médian ; bassins à gauche ; colosse à droite (ne pas confondre avec le guichet sous verre)', labels:[[72,12],[71,5],[48,44],[26,51],[53,59],[91,23],[62,18],[83,17],[39,32],[61,20],[48,69],[80,46],[29,22],[28,83],[82,71],[44,90]] },
  cite_sous_marine: { size:[2048,3072], source:source('CONTINENT-PELAGREVE'), landmark:'Carte enfant ; aucun nom intérieur validé', labels:[] }
};

// Contours conservative to the painted scenes, not a nearest-point radius.
const destination = (id, kind, points, label) => ({id,kind,points,label,status:'proposal'});
export const DESTINATIONS = {
  entrevers:[
    destination('ardera','world','20,33 26,24 39,19 48,28 53,41 54,60 49,70 38,74 27,68 20,56',[37,48]),
    destination('brasserie','dimension','69,41 74,34 86,32 93,39 93,55 85,61 76,58 69,50',[82,47]),
    destination('enfer','dimension','60,69 65,62 73,60 81,65 85,75 83,89 74,94 65,87 60,77',[73,78])
  ],
  ardera:[
    destination('valdorie','continent','17,28 21,20 30,14 36,20 42,25 46,34 41,41 35,47 29,42 24,37',[30,31]),
    destination('boreclat','continent','32,11 41,4 52,3 59,9 68,9 73,17 69,23 59,25 50,25 42,21 36,18',[51,14]),
    destination('sahaldune','continent','5,51 12,44 21,43 29,50 32,62 33,70 26,80 20,83 11,74 4,64',[20,62]),
    destination('sylvaronde','continent','34,58 40,48 49,43 53,52 60,57 65,64 68,72 59,76 48,76 39,69',[51,64]),
    destination('ferrecime','continent','53,32 60,25 66,22 69,31 71,45 73,54 71,59 65,55 59,48 54,41',[63,38]),
    destination('pelagreve','continent','74,28 80,17 87,14 93,24 97,39 95,51 96,64 89,76 80,80 76,66 77,51 74,41',[86,48]),
    destination('austrebrume','continent','29,84 35,78 44,79 53,80 63,82 70,84 73,90 67,94 54,95 40,96 33,92',[50,88])
  ],
  pelagreve:[destination('cite_sous_marine','child','65,61 69,59 72,61 71,65 67,66 64,64',[68,63])]
};

// [foot x, foot y, width % of map, foot u %, foot v %, label x, label y]
// D06 shares D05's planimetry and is shown below the map, never as a second surface site.
export const SPRITE_PLACEMENTS = {
  D01:[40,37,4.8,50,93,35,36], D02:[54,34,4.8,50,93,60,32],
  D03:[46.5,54,2.5,49,97,40,56], D04:[51.8,54.5,3.5,55,92,59,57],
  D05:[54.5,26,4.5,50,94,61,26], D06:[54.5,26,4.5,50,94,61,26],
  D09:[86,27,5,50,93,86,32], D10:[25,33,4.8,50,93,19,36],
  D11:[68,47,4.5,50,94,73,49],
  D12:[27,39,5.2,50,94,27,43], D14:[70,55,4.6,50,94,77,56],
  D15:[68,82,5.5,50,94,77,84], D13:[10,13,5.5,50,94,11,8]
};
export const SPRITE_EVIDENCE = {
  D01:'Chope : colline voisine, distincte du côté forêt D02',
  D02:'Chope : lisière boisée, distincte de la colline D01',
  D03:'Bâtiment miniature dans les remparts ouest de la grande cité',
  D04:'Autre quartier à l’intérieur des mêmes remparts',
  D05:'Pied des montagnes au nord de la plaine', D06:'Directement sous D05 ; coupe hors fresque',
  D09:'Forêt profonde à droite, hors du groupe d’arbres géants',
  D10:'Roche littorale à l’est du port, pas dans la mer ni dans la ville portuaire',
  D11:'Prairie/boisement oriental, hors de la cité',
  D12:'Plateau de Silex occidental, pas sur la chaîne axiale',
  D14:'Plateau rocheux oriental ; aucun ancrage sur une île flottante',
  D15:'Flanc volcanique sud-est, représentation semi-enterrée du sprite validé',
  D13:'Îlot périphérique du delta, à distance du quai commercial peint'
};

export function applyCartography(maps, dungeons) {
  for (const [id,map] of Object.entries(maps)) {
    const spec=CARTOGRAPHY[id];
    if (!spec || map.toponyms.length !== spec.labels.length) throw new Error(`Incomplete cartography: ${id}`);
    map.toponyms=map.toponyms.map(([name,kind='region'],i)=>[name,...spec.labels[i],kind]);
  }
  for (const list of Object.values(dungeons)) for (const dungeon of list) {
    const p=SPRITE_PLACEMENTS[dungeon[0]];
    if (!p) throw new Error(`Missing sprite placement: ${dungeon[0]}`);
    dungeon[3]=p[0]; dungeon[4]=p[1];
  }
}
