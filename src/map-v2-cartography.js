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
  valdorie: { size:[3072,2048], source:source('CONTINENT-VALDORIE'), landmark:'Port ouest ; hautes montagnes ; arbres géants nord-est ; cité fortifiée centrale ; bassins est', labels:[[18,17],[46.5,13],[83,14],[53,46],[84,62],[18,65],[79,19],[77,39],[83,47],[55,29],[12,39],[87,38],[88,70],[36,42],[22,73],[50,93],[54,53],[22,26]] },
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

// Approved MJ plates, 2026-10-02: point coordinates, not lettering centres.
// D06 is underground at D05's point. Sprite metadata above is retained as archive.
export const DUNGEON_MARKERS = {
  D01:{anchor:[74.5,45.7],label:[66,41],color:0},
  D02:{anchor:[80.9,41.4],label:[85,34],color:1},
  D03:{anchor:[46.2,55.7],label:[39,51],color:2},
  D04:{anchor:[52.7,59.3],label:[60,61],color:3},
  D05:{anchor:[48.9,20.8],label:[41,23],color:4},
  D06:{anchor:[48.9,20.8],label:[58,24],color:4,group:'D05'},
  D09:{anchor:[89.5,26.7],label:[86,21],color:5},
  D10:{anchor:[6.7,19.3],label:[10,12],color:6},
  D11:{anchor:[75.2,48.5],label:[72,55],color:7},
  D12:{anchor:[34.5,20],label:[42.2,20.9],color:0},
  D14:{anchor:[39.8,44.9],label:[40.6,49.7],color:1},
  D15:{anchor:[59.4,86.8],label:[73.6,93.2],color:4},
  D13:{anchor:[68,15.8],label:[71,9.8],color:8}
};
// Arbitrary decorative colours: stable across navigation, with no gameplay meaning.
export const DUNGEON_COLORS = [
  ['#a10c20','#48040d','#ff6571'],['#075ba8','#032e62','#52c8ff'],
  ['#287447','#103822','#8dd699'],['#b05218','#54230a','#ffb76d'],
  ['#87149e','#3d0550','#fa79ff'],['#186e76','#083a40','#80e1df'],
  ['#9d345f','#51182f','#ff9bc4'],['#827013','#403606','#f3da6c'],
  ['#475ea1','#202d5b','#a3baff']
];

// Revised six MJ plates approved by the owner on 2026-10-02.
// Names are validated. Feature anchors and label centres remain separate, annotatable.
export const PUBLIC_LOCATIONS = {
  "austrebrume": [
    {
      "name": "Escale de Brumegarde",
      "anchor": [
        94,
        49
      ],
      "label": [
        91,
        56
      ],
      "kind": "secondary",
      "type": "escale",
      "evidence": "Maisons et pontons du littoral est.",
      "hook": "On y attend le dégel, un navire ou quelqu’un qui sait dans quel ordre.",
      "referenceLabel": [
        86,
        56
      ]
    },
    {
      "name": "Lac de Sombreverre",
      "anchor": [
        76,
        35
      ],
      "label": [
        78,
        37
      ],
      "kind": "water",
      "type": "lac",
      "evidence": "Bassin sombre du nord-est.",
      "hook": "Les guides y parlent bas. Même les plus mauvais plaisantins.",
      "referenceLabel": [
        78,
        28
      ]
    },
    {
      "name": "Le Géant à la Petite Chope",
      "anchor": [
        28,
        31
      ],
      "label": [
        24,
        18
      ],
      "kind": "secondary",
      "type": "auberge proposée",
      "evidence": "Site boisé proposé pour une halte, au nord-ouest.",
      "hook": "La tenancière géante sert des chopes normales. C’est elle qui est grande.",
      "referenceLabel": [
        24,
        20
      ]
    },
    {
      "name": "Col de Veillebrume",
      "anchor": [
        34,
        39
      ],
      "label": [
        27,
        57
      ],
      "kind": "secondary",
      "type": "col",
      "evidence": "Passage enneigé dans les reliefs du nord-ouest.",
      "hook": "Les cairns guident les voyageurs quand le brouillard efface le chemin.",
      "referenceLabel": [
        31,
        48
      ]
    },
    {
      "name": "Banquise du Retour Tardif",
      "anchor": [
        42,
        66
      ],
      "label": [
        39,
        77
      ],
      "kind": "water",
      "type": "banquise",
      "evidence": "Bordure de glace au sud du continent.",
      "hook": "Un nom laissé par une expédition qui avait oublié la saison du retour.",
      "referenceLabel": [
        39,
        74
      ]
    },
    {
      "name": "Halte du Banc Trop Court",
      "anchor": [
        65,
        27
      ],
      "label": [
        58,
        17
      ],
      "kind": "secondary",
      "type": "halte proposée",
      "evidence": "Terrain dégagé entre les bois et les reliefs du nord.",
      "hook": "Les petits voyageurs s’y serrent ; les géants s’installent à côté.",
      "referenceLabel": [
        58,
        17
      ]
    },
    {
      "name": "Îlot de Nacregivre",
      "anchor": [
        16,
        12
      ],
      "label": [
        19,
        9
      ],
      "kind": "secondary",
      "type": "îlot rocheux",
      "evidence": "Petit groupe de rochers au nord-ouest.",
      "hook": "Une escale naturelle où la glace prend les couleurs de la nacre.",
      "referenceLabel": [
        19,
        9
      ]
    },
    {
      "name": "Passe des Lanternes Éteintes",
      "anchor": [
        86,
        51
      ],
      "label": [
        73,
        78
      ],
      "kind": "water",
      "type": "passage côtier",
      "evidence": "Eaux et rochers entre la côte est et l’escale.",
      "hook": "Les bateliers préfèrent rentrer avant que la brume avale les derniers feux.",
      "referenceLabel": [
        73,
        70
      ]
    }
  ],
  "boreclat": [
    {
      "name": "Port Cuivregivre",
      "anchor": [
        52,
        68
      ],
      "label": [
        53,
        81
      ],
      "kind": "secondary",
      "type": "port",
      "evidence": "Grande agglomération sur pontons du littoral sud.",
      "hook": "On y débarque le poisson, les fûts et les exploits quelque peu embellis.",
      "referenceLabel": [
        53,
        75
      ]
    },
    {
      "name": "Hameau de Clairpin",
      "anchor": [
        19,
        69
      ],
      "label": [
        19,
        78
      ],
      "kind": "secondary",
      "type": "village",
      "evidence": "Maisons du plateau habité au sud-ouest.",
      "hook": "Bois sombre, toits fumants et hospitalité sans grandes déclarations.",
      "referenceLabel": [
        19,
        78
      ]
    },
    {
      "name": "Bains de la Buée Douce",
      "anchor": [
        18,
        54
      ],
      "label": [
        16,
        41
      ],
      "kind": "secondary",
      "type": "bains proposés",
      "evidence": "Zone de bassins fumants à l’ouest.",
      "hook": "On prête des serviettes de toutes tailles ; les regards restent à discrétion.",
      "referenceLabel": [
        16,
        46
      ]
    },
    {
      "name": "Lac de Longueveille",
      "anchor": [
        58,
        43
      ],
      "label": [
        60,
        37
      ],
      "kind": "water",
      "type": "lac",
      "evidence": "Grande étendue d’eau au centre du réseau de lacs.",
      "hook": "Un nom de pêcheurs patients, transmis bien avant les récits de taverne.",
      "referenceLabel": [
        60,
        37
      ]
    },
    {
      "name": "Chutes du Fût Échappé",
      "anchor": [
        41,
        62
      ],
      "label": [
        40,
        57
      ],
      "kind": "water",
      "type": "gorge et chutes",
      "evidence": "Passage d’eau entre falaises, derrière le port central.",
      "hook": "Un équipage cherche encore à qui appartenait la corde.",
      "referenceLabel": [
        40,
        55
      ]
    },
    {
      "name": "Col de Pierre-Sourde",
      "anchor": [
        34,
        23
      ],
      "label": [
        32,
        17
      ],
      "kind": "secondary",
      "type": "col",
      "evidence": "Passage montagneux à l’ouest du massif des Aiguilles.",
      "hook": "Un secteur austère où les voyageurs économisent leur voix.",
      "referenceLabel": [
        32,
        17
      ]
    },
    {
      "name": "Relais du Traîneau Sans Frein",
      "anchor": [
        29,
        71
      ],
      "label": [
        34,
        65
      ],
      "kind": "secondary",
      "type": "relais proposé",
      "evidence": "Jonction de chemins et passerelles du plateau sud-ouest.",
      "hook": "On y répare les patins. Les freins seront disponibles au printemps.",
      "referenceLabel": [
        34,
        65
      ]
    },
    {
      "name": "Île des Trois Feux",
      "anchor": [
        72,
        87
      ],
      "label": [
        79,
        91
      ],
      "kind": "secondary",
      "type": "île",
      "evidence": "Île habitée et enneigée du sud-est.",
      "hook": "Trois feux de veille pour les équipages qui rentrent des Marches d’Écume.",
      "referenceLabel": [
        79,
        91
      ]
    }
  ],
  "ferrecime": [
    {
      "name": "Pont du Pas-de-Panique",
      "anchor": [
        85,
        48
      ],
      "label": [
        84,
        41
      ],
      "kind": "secondary",
      "type": "pont",
      "evidence": "Grand pont de bois sur le plateau est.",
      "hook": "Les convoyeurs le disent toujours avant de regarder les planches.",
      "referenceLabel": [
        84,
        42
      ]
    },
    {
      "name": "Foire de la Belle Étape",
      "anchor": [
        79,
        60
      ],
      "label": [
        82,
        66
      ],
      "kind": "secondary",
      "type": "foire proposée",
      "evidence": "Camp de tentes et scène festive sur le plateau est.",
      "hook": "Une gobeline et une orque tiennent banquet ; les héros paient leur casse.",
      "referenceLabel": [
        82,
        66
      ]
    },
    {
      "name": "Lac d’Émeraude-Froide",
      "anchor": [
        44,
        74
      ],
      "label": [
        42,
        82
      ],
      "kind": "water",
      "type": "lac",
      "evidence": "Lac turquoise au sud-ouest du secteur volcanique.",
      "hook": "Une eau claire entre les plateaux, où les bergers viennent abreuver leurs bêtes.",
      "referenceLabel": [
        42,
        82
      ]
    },
    {
      "name": "Col des Veilleurs",
      "anchor": [
        40,
        19
      ],
      "label": [
        57,
        13
      ],
      "kind": "secondary",
      "type": "col",
      "evidence": "Passage enneigé entre les sommets du nord.",
      "hook": "Les balises témoignent des voyageurs qui entretiennent encore la route.",
      "referenceLabel": [
        43,
        13
      ]
    },
    {
      "name": "Corniche du Héros Assis",
      "anchor": [
        21,
        40
      ],
      "label": [
        21,
        26
      ],
      "kind": "secondary",
      "type": "corniche",
      "evidence": "Sentier en bord de plateau dans l’ouest.",
      "hook": "Un brave y découvre que le courage se pratique très bien à quatre pattes.",
      "referenceLabel": [
        21,
        34
      ]
    },
    {
      "name": "Gué des Bottes Pleines",
      "anchor": [
        35,
        56
      ],
      "label": [
        30,
        62
      ],
      "kind": "secondary",
      "type": "gué proposé",
      "evidence": "Petit cours d’eau et chemin dans les plateaux ouest.",
      "hook": "Le guide promet de garder les pieds au sec. Les siens, surtout.",
      "referenceLabel": [
        30,
        62
      ]
    },
    {
      "name": "Coulées de Rougecendre",
      "anchor": [
        76,
        82
      ],
      "label": [
        73,
        77
      ],
      "kind": "secondary",
      "type": "site volcanique",
      "evidence": "Pentes et coulées de lave au sud-est.",
      "hook": "Les habitants lisent les fumées avant de s’engager sur les sentiers.",
      "referenceLabel": [
        73,
        89
      ]
    },
    {
      "name": "Îlot du Tonneau Couronné",
      "anchor": [
        9,
        88
      ],
      "label": [
        15,
        93
      ],
      "kind": "secondary",
      "type": "îlot",
      "evidence": "Petit îlot boisé au large du sud-ouest.",
      "hook": "Un fût échoué y fut proclamé roi par trois naufragés encore très optimistes.",
      "referenceLabel": [
        15,
        93
      ]
    }
  ],
  "pelagreve": [
    {
      "name": "Port des Lanternes d’Écume",
      "anchor": [
        81,
        34
      ],
      "label": [
        71,
        30
      ],
      "kind": "secondary",
      "type": "port",
      "evidence": "Grande cité portuaire sur pilotis à l’est.",
      "hook": "Pavillons, quais et maisons de thé ; les tavernes ferment beaucoup plus tard.",
      "referenceLabel": [
        71,
        30
      ]
    },
    {
      "name": "Fort de la Voile Noire",
      "anchor": [
        34,
        81
      ],
      "label": [
        46,
        85
      ],
      "kind": "secondary",
      "type": "fort pirate",
      "evidence": "Bastion aux pavillons pirates du sud-ouest.",
      "hook": "Un nom que les marchands lisent de loin avant de changer de cap.",
      "referenceLabel": [
        46,
        85
      ]
    },
    {
      "name": "Crique du Dernier Toast",
      "anchor": [
        32,
        41
      ],
      "label": [
        30,
        45
      ],
      "kind": "water",
      "type": "crique",
      "evidence": "Plage et baie abritée sur la côte ouest centrale.",
      "hook": "La petite escale sert le verre du départ. Puis celui des adieux. Puis un autre.",
      "referenceLabel": [
        30,
        45
      ]
    },
    {
      "name": "Phare de Jadebrume",
      "anchor": [
        20,
        5
      ],
      "label": [
        34,
        8
      ],
      "kind": "secondary",
      "type": "phare",
      "evidence": "Tour à feu sur le promontoire rocheux du nord-ouest.",
      "hook": "Un feu de veille pour les jonques qui reviennent dans les brumes.",
      "referenceLabel": [
        34,
        8
      ]
    },
    {
      "name": "Bassin de Perlebleue",
      "anchor": [
        79,
        69
      ],
      "label": [
        66,
        66
      ],
      "kind": "water",
      "type": "trou récifal",
      "evidence": "Eau plus profonde entre les récifs du sud-est.",
      "hook": "Les pilotes reconnaissent cette eau sombre au milieu des hauts-fonds.",
      "referenceLabel": [
        66,
        66
      ]
    },
    {
      "name": "Îlots des Sept Rubans",
      "anchor": [
        71,
        88
      ],
      "label": [
        66,
        94
      ],
      "kind": "secondary",
      "type": "îlots",
      "evidence": "Petites îles sableuses et coralliennes au sud-est.",
      "hook": "Les équipages y nouent des rubans pour quelqu’un qui les attend à terre.",
      "referenceLabel": [
        66,
        94
      ]
    },
    {
      "name": "Passe du Capitaine Perdu",
      "anchor": [
        51,
        48
      ],
      "label": [
        54,
        52
      ],
      "kind": "water",
      "type": "passe maritime",
      "evidence": "Couloir navigable au centre des lagons.",
      "hook": "Il s’était fié à une carte dessinée de mémoire, après le banquet.",
      "referenceLabel": [
        54,
        52
      ]
    },
    {
      "name": "Dent de Cendrelune",
      "anchor": [
        84,
        13
      ],
      "label": [
        73,
        17
      ],
      "kind": "secondary",
      "type": "relief volcanique",
      "evidence": "Pointe rocheuse dans le secteur volcanique nord-est.",
      "hook": "Un amer sombre que les navigateurs surveillent sous la lumière du soir.",
      "referenceLabel": [
        73,
        17
      ]
    }
  ],
  "sahaldune": [
    {
      "name": "Ambrefleuve",
      "anchor": [
        42,
        10
      ],
      "label": [
        42,
        18
      ],
      "kind": "secondary",
      "type": "cité fluviale",
      "evidence": "Grande ville fortifiée du réseau fluvial nord-ouest.",
      "hook": "Ses quais prospèrent ; ses négociants ont aussi d’excellentes mémoires.",
      "referenceLabel": [
        43,
        6
      ]
    },
    {
      "name": "Olvarane",
      "anchor": [
        68,
        12
      ],
      "label": [
        74,
        8
      ],
      "kind": "secondary",
      "type": "cité fluviale",
      "evidence": "Seconde grande ville, sur le réseau fluvial du nord-est.",
      "hook": "Une capitaine léonine y négocie un fût avec autant de soin qu’une cargaison.",
      "referenceLabel": [
        74,
        8
      ]
    },
    {
      "name": "Port de la Pluie Tiède",
      "anchor": [
        64,
        74
      ],
      "label": [
        68,
        86
      ],
      "kind": "secondary",
      "type": "port",
      "evidence": "Grande agglomération à quais du littoral sud.",
      "hook": "Sous les auvents, on répare les voiles et on raconte la dernière traversée.",
      "referenceLabel": [
        68,
        81
      ]
    },
    {
      "name": "Pont des Comptes Ronds",
      "anchor": [
        68,
        24
      ],
      "label": [
        73,
        15
      ],
      "kind": "secondary",
      "type": "pont",
      "evidence": "Pont de bois sur les eaux du nord-est.",
      "hook": "Le péage est impeccable. Le compte des fûts, nettement moins.",
      "referenceLabel": [
        73,
        19
      ]
    },
    {
      "name": "Oasis de la Chope Miraculeuse",
      "anchor": [
        47,
        68
      ],
      "label": [
        46,
        70
      ],
      "kind": "secondary",
      "type": "oasis",
      "evidence": "Eaux, palmiers et habitations du sud-ouest central.",
      "hook": "Le miracle est d’en trouver une fraîche avant que la caravane arrive.",
      "referenceLabel": [
        46,
        74
      ]
    },
    {
      "name": "Défilé des Longues Ombres",
      "anchor": [
        27,
        38
      ],
      "label": [
        23,
        32
      ],
      "kind": "secondary",
      "type": "défilé",
      "evidence": "Passage dans le massif rocheux de l’ouest.",
      "hook": "Les caravanes y avancent tôt, à l’abri des parois et de la chaleur.",
      "referenceLabel": [
        23,
        32
      ]
    },
    {
      "name": "Phare des Moussons",
      "anchor": [
        78,
        86
      ],
      "label": [
        83,
        93
      ],
      "kind": "secondary",
      "type": "tour côtière",
      "evidence": "Tour isolée près de la côte sud-est.",
      "hook": "Les veilleurs y gardent le feu quand la pluie brouille la côte.",
      "referenceLabel": [
        83,
        91
      ]
    },
    {
      "name": "Chutes du Banquet Retardé",
      "anchor": [
        36,
        69
      ],
      "label": [
        26,
        64
      ],
      "kind": "water",
      "type": "cascades",
      "evidence": "Front de cascades parmi les palmiers au sud-ouest.",
      "hook": "Le vin de palme est arrivé ; les tables sont toujours sur l’autre rive.",
      "referenceLabel": [
        26,
        64
      ]
    }
  ],
  "sylvaronde": [
    {
      "name": "La Chope sous la Souche",
      "anchor": [
        59,
        76
      ],
      "label": [
        59,
        87
      ],
      "kind": "secondary",
      "type": "guinguette proposée",
      "evidence": "Tente rayée et rassemblement festif au sud.",
      "hook": "On y sert les grandes tablées ; le mobilier est taillé pour durer.",
      "referenceLabel": [
        59,
        84
      ]
    },
    {
      "name": "Hameau de Liseronce",
      "anchor": [
        64,
        34
      ],
      "label": [
        65,
        27
      ],
      "kind": "secondary",
      "type": "village forestier",
      "evidence": "Maisons nichées dans la forêt au centre-est.",
      "hook": "Des maisons de lisière, des sentiers entretenus et une forêt laissée libre.",
      "referenceLabel": [
        65,
        28
      ]
    },
    {
      "name": "Gué du Tonneau Têtu",
      "anchor": [
        40,
        54
      ],
      "label": [
        41,
        61
      ],
      "kind": "secondary",
      "type": "gué proposé",
      "evidence": "Cours d’eau entre les racines, au centre-ouest.",
      "hook": "Il refuse de passer. Les convoyeurs ont commencé à lui expliquer poliment.",
      "referenceLabel": [
        41,
        61
      ]
    },
    {
      "name": "Jetée des Rameurs du Dimanche",
      "anchor": [
        27,
        24
      ],
      "label": [
        26,
        22
      ],
      "kind": "secondary",
      "type": "jetée",
      "evidence": "Ponton de bois dans les chenaux du nord-ouest.",
      "hook": "Les équipages partent très fiers et reviennent généralement par le même quai.",
      "referenceLabel": [
        26,
        18
      ]
    },
    {
      "name": "Îlot de Brumefeuille",
      "anchor": [
        16,
        35
      ],
      "label": [
        14,
        41
      ],
      "kind": "secondary",
      "type": "îlot",
      "evidence": "Petit îlot végétalisé et habité dans le delta ouest.",
      "hook": "Un repère discret de feuilles et de toits au milieu des chenaux.",
      "referenceLabel": [
        14,
        41
      ]
    },
    {
      "name": "Clairière de la Belle Rencontre",
      "anchor": [
        28,
        63
      ],
      "label": [
        23,
        68
      ],
      "kind": "secondary",
      "type": "clairière",
      "evidence": "Prairies ouvertes près des maisons de l’ouest.",
      "hook": "On s’y croise pour le marché. Certains reviennent même quand il n’a pas lieu.",
      "referenceLabel": [
        23,
        68
      ]
    },
    {
      "name": "Dent de Pierreveille",
      "anchor": [
        92,
        46
      ],
      "label": [
        87,
        53
      ],
      "kind": "secondary",
      "type": "pointe rocheuse",
      "evidence": "Relief rocheux au pied de la grande statue de l’est.",
      "hook": "Un point de repère de pierre pour les voyageurs qui quittent les eaux.",
      "referenceLabel": [
        87,
        53
      ]
    },
    {
      "name": "Col du Tonnerre Distrait",
      "anchor": [
        77,
        44
      ],
      "label": [
        78,
        35
      ],
      "kind": "secondary",
      "type": "col",
      "evidence": "Passage entre les reliefs du massif est.",
      "hook": "L’orage annonce sa venue, puis semble oublier de quel côté il devait passer.",
      "referenceLabel": [
        78,
        38
      ]
    }
  ]
};

export function applyCartography(maps, dungeons) {
  for (const [id,map] of Object.entries(maps)) {
    const spec=CARTOGRAPHY[id];
    if (!spec || map.toponyms.length !== spec.labels.length) throw new Error(`Incomplete cartography: ${id}`);
    map.toponyms=map.toponyms.map(([name,kind='region'],i)=>[name,...spec.labels[i],kind]);
    for (const location of PUBLIC_LOCATIONS[id]||[]) {
      map.toponyms.push([location.name,...location.anchor,location.kind]);
    }
  }
  for (const list of Object.values(dungeons)) for (const dungeon of list) {
    const p=DUNGEON_MARKERS[dungeon[0]];
    if (!p) throw new Error(`Missing dungeon marker: ${dungeon[0]}`);
    dungeon[3]=p.anchor[0]; dungeon[4]=p.anchor[1];
  }
}
