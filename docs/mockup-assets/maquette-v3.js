const ICON_BASE='./mockup-assets/icons/';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const isPhone=()=>matchMedia('(max-width:767px)').matches;
const isBestiarySequential=()=>isPhone() || (navigator.maxTouchPoints>0 && matchMedia('(max-width:1366px)').matches);

const catMeta={
  basique:{label:'Basique',sigil:'Sigil_Basique.webp'},
  tactique:{label:'Tactique',sigil:'Sigil_Tactique.webp'},
  speciale:{label:'Spéciale',sigil:'Sigil_Speciale.webp'},
  brute:{label:'Brute',sigil:'Sigil_Brute.webp'},
  mini_boss:{label:'Mini-boss',sigil:'Sigil_MiniBoss.webp'},
  boss:{label:'Boss',sigil:'Sigil_Boss.webp'}
};
const tierMeta={
  basique:{loot:'Mauvais',quest:'Très facile'},
  tactique:{loot:'Commun',quest:'Facile'},
  speciale:{loot:'Inhabituel',quest:'Normale'},
  brute:{loot:'Rare',quest:'Difficile'},
  mini_boss:{loot:'Épique',quest:'Très difficile'},
  boss:{loot:'Légendaire',quest:'Extrême'}
};
const creatures=[
  {id:'rainette',name:'Rainette Voltigeuse',cat:'speciale',img:'../assets/images/rainette.jpeg',displayImg:'./mockup-assets/creatures-transparent/rainette.png',dungeon:'Les Marécages Infectés',threat:2,base:'32',pv:7,atk:3,def:2,range:3,actions:2,ability:'Bond électrique',copy:'Bondit par-dessus un obstacle puis décharge une impulsion sur la première cible rencontrée.',ai:'Harcele les flancs, cherche les cases libres et évite les engagements prolongés.',loot:['Glande conductrice','2 or'],lore:'Une rainette élevée dans les cuves de cuivre finit toujours par développer une opinion très ferme sur la foudre.',tags:['amphibie','mobile','électrique']},
  {id:'trixie',name:'Gobeline Turbo-Coude',cat:'tactique',img:'../assets/images/trixie.jpeg',displayImg:'./mockup-assets/creatures-transparent/trixie.png',dungeon:'Le Cabaret des Joyeuses',threat:2,base:'32',pv:8,atk:3,def:4,range:1,actions:2,ability:'Turbo-Coude',copy:'Une percée courte, brutale et précise qui repousse la cible.',ai:'Cherche un angle, protège les unités plus fragiles et punit les passages étroits.',loot:['Coude renforcé','1 or'],lore:'Elle a appris très tôt qu’un comptoir est surtout une ligne droite qui mérite d’être traversée vite.',tags:['gobeline','charge','support']},
  {id:'berthold',name:'Videur du Cellier',cat:'brute',img:'../assets/images/berthold.png',displayImg:'./mockup-assets/creatures-transparent/berthold.png',dungeon:'Le Cabaret des Joyeuses',threat:4,base:'40',pv:12,atk:5,def:3,range:1,actions:2,ability:'Pas de velours',copy:'Avance sans détour et verrouille la zone devant lui.',ai:'Avance vers la cible la plus résistante et frappe ce qui bloque le passage.',loot:['Clef du cellier','3 or'],lore:'Il n’a jamais perdu une bagarre de taverne. Il n’a jamais compris qu’elles pouvaient être évitées.',tags:['brute','blocage','cabaret']},
  {id:'bard',name:'Maître du Comptoir',cat:'mini_boss',img:'../assets/images/bard.png',displayImg:'./mockup-assets/creatures-transparent/bard.png',dungeon:'Le Cabaret des Joyeuses',threat:5,base:'60',pv:16,atk:5,def:4,range:2,actions:3,ability:'Dernière tournée',copy:'Accélère le rythme et transforme le comptoir en zone dangereuse.',ai:'Protège la zone centrale, change de cible rapidement et punit les regroupements.',loot:['Chope du patron','5 or'],lore:'On ne sait pas s’il tient le bar ou si le bar le tient. Dans les deux cas, personne ne discute l’addition.',tags:['élite','zone','cabaret']},
  {id:'demon',name:'Démon de la Réserve',cat:'boss',img:'../assets/images/demon.png',displayImg:'./mockup-assets/creatures-transparent/demon.png',dungeon:'Enfer de la Sobriété',threat:6,base:'80',pv:24,atk:6,def:5,range:3,actions:3,ability:'Cave infernale',copy:'À haut Brouhaha, ses attaques gagnent en zone et ignorent une partie de la défense.',ai:'Alterne pression de zone, poursuite et attaque massive sur les cibles vulnérables.',loot:['Corne calcinée','8 or'],lore:'On dit qu’il n’a jamais payé son addition. Personne n’a encore osé vérifier.',tags:['boss','démon','zone']},
  {id:'gundrade',name:'Gundrade la Tenace',cat:'basique',img:'../assets/images/gundrade.jpeg',displayImg:'./mockup-assets/creatures-transparent/gundrade.png',dungeon:'Le Château de Bastognac',threat:1,base:'32',pv:6,atk:2,def:3,range:1,actions:2,ability:'Tenir la ligne',copy:'Gagne +1 DEF tant qu’un allié est adjacent.',ai:'Bloque les passages et protège les unités tactiques.',loot:['Boucle de ceinture','1 or'],lore:'Elle a reçu l’ordre de tenir le couloir. Elle prend les ordres au pied de la lettre.',tags:['garde','blocage','bastognac']}
];
const sessionQuests=[
  {name:'Le tonneau qui savait trop',difficulty:'Moyenne',npc:'Mirette la Serveuse',desc:'Un tonneau a entendu une conversation qu’il n’aurait jamais dû entendre.',objective:'Retrouver le tonneau avant que les gobelins du cellier ne le mettent en perce.',reward:'3 or · faveur du Cabaret'},
  {name:'La clé sous la mousse',difficulty:'Facile',npc:'Bibi le Brasseur',desc:'Une clé de réserve a disparu entre deux fûts et trois versions contradictoires.',objective:'Fouiller deux zones du donjon puis rapporter la clé au comptoir.',reward:'2 or · chope gratuite'},
  {name:'La grenouille de trop',difficulty:'Difficile',npc:'Rainette',desc:'Une cousine de Rainette s’est installée dans le mauvais alambic.',objective:'Évacuer la créature sans briser la cuve.',reward:'5 or · composant alchimique'}
];

let selectedCreature=localStorage.getItem('mockup:selectedCreature')||'rainette';
let bestiaryMode=localStorage.getItem('mockup:bestiaryMode')||(isPhone()?'list':'gallery');
let currentView='home', currentCodex='creatures', dirty=false, mobileDetailOpen=false;
let encounter={rainette:2,trixie:1}, encounterVictoryShown=false, bhLevel=7, questIndex=0;

const codexFamilyMeta={
  dungeons:{label:'Donjons',singular:'Donjon',defaultMode:'gallery',color:'#c98d4e',premium:'Icone_Gameplay_DONJON.webp'},
  heroes:{label:'Héros',singular:'Héros',defaultMode:'gallery',color:'#a85e46',premium:'Icone_Entite_HEROS.webp'},
  npcs:{label:'PNJ',singular:'PNJ',defaultMode:'gallery',color:'#739178',premium:'Icone_Entite_PNJ.webp'},
  quests:{label:'Quêtes',singular:'Quête',defaultMode:'list',color:'#9d7449',premium:'Icone_Entite_QUETE.webp'},
  loot:{label:'Loot',singular:'Loot',defaultMode:'gallery',color:'#c39439',premium:'Icone_Gameplay_BUTIN.webp'},
  interactables:{label:'Objets du décor',singular:'Objet du décor',defaultMode:'list',color:'#6d8f9f',premium:'Icone_Entite_OBJET_INTERACTIF.webp'},
  brouhaha:{label:'Brouhaha',singular:'Brouhaha',defaultMode:'gallery',color:'#a34d45',premium:'Icone_Entite_OBJET_BROUHAHA.webp'}
};
const dungeonVisuals=[
  {name:'Le Château de Bastognac',accent:'#b57a43',glow:'#d4a45f',atmosphere:'Vieille pierre, bannières violettes et chaos royal très mal tenu.',description:'Donjon importé depuis le bestiaire Le Château de Bastognac.',floorBudgets:[3,5,7,9,11],image:'./mockup-assets/donjon/D871AE54-E99A-4CE5-B7FA-2753A24FC1A2.PNG',boss:'Baron Pas-Très-Terrifiant',bossThreat:5,bossImage:null,bossSource:'Export Gargottex'},
  {name:'La Forêt en Chantier',accent:'#6e915f',glow:'#9aba70',atmosphere:'Bois vivant, mousse, racines et chantier qui a manifestement perdu son chef de sécurité.',description:'Donjon importé depuis le bestiaire La Forêt en Chantier.',floorBudgets:[3,5,7,9,11],image:null,boss:'Maître Chantierius',bossThreat:5,bossImage:null,bossSource:'Export Gargottex'},
  {name:'Hôtel Zombifornia',accent:'#8d6f62',glow:'#c39a83',atmosphere:'Velours fatigué, service éternel et luxe qui refuse de mourir proprement.',description:'Donjon importé depuis le bestiaire Hôtel Zombifornia.',floorBudgets:[3,5,7,9,11],image:null,boss:'Directrice Éternelle',bossThreat:5,bossImage:null,bossSource:'Export Gargottex'},
  {name:'Le Cabaret des Joyeuses',accent:'#b85e6d',glow:'#e69a75',atmosphere:'Rideaux rouges, bougies, paillettes de comptoir et catastrophe scénique permanente.',description:'Donjon importé depuis le bestiaire Le Cabaret des Joyeuses.',floorBudgets:[3,5,7,9,11],image:'./mockup-assets/donjon/AC294837-DDA4-42D9-968E-39A2EF00D1DE.PNG',boss:'Madame Carminia',bossThreat:5,bossImage:null,bossSource:'Export Gargottex'},
  {name:'Le Sanctuaire du Houblon Noir',accent:'#77634b',glow:'#b28b55',atmosphere:'Cuves sombres, cuivre, houblon noir et ferveur brassicole vaguement inquiétante.',description:'Données disponibles dans le Gargottex export.',floorBudgets:[3,5,7,9,11],image:null,boss:'Archi-Brasseuse du Houblon Noir',bossThreat:5,bossImage:null,bossSource:'Export Gargottex'},
  {name:'Le Panthéon des Fermentations Interdites',accent:'#8e7bbb',glow:'#c4b3e3',atmosphere:'Pierre rituelle, recettes impossibles et divinités qui ont lu la notice à l’envers.',description:'Données disponibles dans le Gargottex export.',floorBudgets:[3,5,7,9,11],image:'./mockup-assets/donjon/476B3B53-E12A-4788-9492-55918D05515B.PNG',boss:'Entité Brassicole Primordiale',bossThreat:5,bossImage:null,bossSource:'Export Gargottex'},
  {name:'La Brasserie Céleste',accent:'#d6b66b',glow:'#f2df9f',atmosphere:'Ivoire, lumière fermentée et mousse sacrée qui déborde des marges.',description:'Données disponibles dans le Gargottex export.',floorBudgets:[3,5,7,9,11],image:null,boss:'Plusieurs boss référencés dans l’export',bossThreat:null,bossImage:null,bossSource:'Export Gargottex · arbitrage canonique restant'},
  {name:'L’enfer de la Sobriété Éternelle',accent:'#b14d3f',glow:'#ef775c',atmosphere:'Noir brûlé, eau punitive et chaleur infernale sans une seule bonne pinte.',description:'Données disponibles dans le Gargottex export.',floorBudgets:[3,5,7,9,11],image:null,boss:'Séraphine de la Sobriété Éternelle',bossThreat:8,bossImage:null,bossSource:'Export Gargottex'},
  {name:'Le Bastion du Sauciflard',accent:'#a85e46',glow:'#d69067',atmosphere:'Pierre froide, boyaux cérémoniels et discipline charcutière inutilement majestueuse.',description:'Données disponibles dans le Gargottex export.',floorBudgets:[3,5,7,9,11],image:null,boss:'Grande Matrone Saucissophère',bossThreat:5,bossImage:null,bossSource:'Export Gargottex'},
  {name:'Les Thermes de la Bonne Trempette',accent:'#5896a8',glow:'#8bd0d8',atmosphere:'Carrelage humide, vapeur, bassins et dignité qui glisse très vite.',description:'Données disponibles dans le Gargottex export.',floorBudgets:[3,5,7,9,11],image:null,boss:'Reine Néréide',bossThreat:5,bossImage:null,bossSource:'Export Gargottex'},
  {name:'La Ruche Royale',accent:'#c69635',glow:'#f0c75e',atmosphere:'Cire, miel, alvéoles et monarchie bourdonnante à haute densité.',description:'Données disponibles dans le Gargottex export.',floorBudgets:[3,5,7,9,11],image:null,boss:'Reine des Mille Dards',bossThreat:5,bossImage:null,bossSource:'Export Gargottex'},
  {name:'Le Monastère des Dénaturées',accent:'#8268a2',glow:'#b69ad1',atmosphere:'Pierre pâle, silence trop poli et caprines qui ont manifestement pris le règlement au sérieux.',description:'Données disponibles dans le Gargottex export.',floorBudgets:[3,5,7,9,11],image:null,boss:'Deux fiches boss présentes dans l’export',bossThreat:5,bossImage:null,bossSource:'Caprine Absolue / Nymphe Absolue · arbitrage restant'},
  {name:'Les Marécages Infectés',accent:'#667747',glow:'#9aa55d',atmosphere:'Vase, spores, racines mouillées et fermentation qui a clairement quitté le laboratoire.',description:'Données disponibles dans le Gargottex export.',floorBudgets:[3,5,7,9,11],image:null,boss:'Plusieurs boss référencés dans l’export',bossThreat:null,bossImage:null,bossSource:'Export Gargottex · arbitrage canonique restant'},
  {name:'La Citadelle des Tonneaux Perchés',accent:'#8b6b55',glow:'#c39061',atmosphere:'Hauteur, cordages, tonneaux suspendus et oiseaux qui ont pris possession du plancher.',description:'Ressources visuelles présentes dans le dossier Drive du donjon.',floorBudgets:[],image:null,boss:'Sa Grasduchesse Écarlate',bossThreat:null,bossImage:null,bossSource:'Nom de ressource Drive · statut gameplay à confirmer'},
  {name:'Le Gynécotron du Gnome Tordu',accent:'#b94ea4',glow:'#e06bd0',atmosphere:'Cuivre, verre, câbles, cristaux et mauvaise idée gnome arrivée au stade industriel.',description:'Donjon 15 en cours d’intégration au corpus Gargottex.',floorBudgets:[],image:null,boss:'Professeur Grindelbur Rivetroux',bossThreat:5,bossImage:null,bossSource:'Ressources Drive du Donjon 15'}
];
const dungeonNames=dungeonVisuals.map(d=>d.name);
const codexDungeons=dungeonVisuals.map((d,i)=>({id:'dungeon-'+(i+1),number:i+1,tags:[],...d}));
const brunhildaLevels=[
  {level:1,name:'Brünhilda la Torgnole - Mur en slip',title:'Mur en slip',role:'Tank',pv:12,atk:3,def:4,zone:1,actions:3,ability:'Ivresse Héroïque',effect:"Gagne +2 DEF pendant 1 tour et repousse les ennemis adjacents d'une case.",brouhaha:'',image:'./mockup-assets/heros/Brünhilda la Torgnole - Level 1.PNG'},
  {level:2,name:'Brünhilda la Torgnole - Pare-Baffes',title:'Pare-Baffes',role:'Tank',pv:14,atk:3,def:4,zone:1,actions:3,ability:'-',effect:'',brouhaha:'',image:'./mockup-assets/heros/Brünhilda la Torgnole - Level 2.PNG'},
  {level:3,name:'Brünhilda la Torgnole - Rempart à Mandales',title:'Rempart à Mandales',role:'Tank',pv:16,atk:3,def:4,zone:1,actions:3,ability:'Torgnole Monumentale',effect:"Baffe circulaire qui repousse les créatures adjacentes de 2 cases et leur fait perdre 1 PV, la baffe ignore la DEF et touche les ennemis, les alliés et les objets.",brouhaha:'+1',image:'./mockup-assets/heros/Brünhilda la Torgnole - Level 3.PNG'},
  {level:4,name:'Brünhilda la Torgnole - Forteresse à Torgnoles',title:'Forteresse à Torgnoles',role:'Tank',pv:18,atk:3,def:5,zone:1,actions:3,ability:'Rugissement de la Gargote',effect:'Bloque tout les déplacements ennemis et alliés au prochain tour',brouhaha:'+1',image:'./mockup-assets/heros/Brünhilda la Torgnole - Level 4.PNG'}
];
const familySlug=text=>String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const heroSkeleton=name=>({id:familySlug(name),name,image:null,levels:[1,2,3,4].map(level=>({level,name:name+' - Level '+level}))});
const codexHeroes=[
  {id:'brunhilda',name:'Brünhilda la Torgnole',image:'./mockup-assets/heros/Brünhilda la Torgnole - Level 1.PNG',levels:brunhildaLevels},
  heroSkeleton('Hector Coeurdacier'),heroSkeleton('Firmin Tronçebois'),heroSkeleton('Dolorès Boumbardine'),
  heroSkeleton('Géraldine Pintelance'),heroSkeleton('Clara Ferlipette')
];
const codexNpcs=[
  {id:'sylviane',name:'Sylviane Racinebouteille',race:'Demi-Ant',tone:'Placide, maternelle, très lente',role:'Gardienne du tonneau éternel',lore:"Ancien chêne millénaire autour duquel la taverne a été construite. Ses racines traversent la cave et alimentent certains tonneaux en sève fermentée. Quand les clients deviennent trop bruyants, elle fait pousser des racines pour les faire trébucher.",image:null,tags:['demi-ant']},
  {id:'mirelda',name:'Mirelda Trois-Tentacules',race:'Demi-Kraken',tone:'Sarcastique, blasée',role:'Plongeuse officielle',lore:'Mirelda peut laver douze chopes à la fois grâce à ses tentacules. Personne ne sait exactement combien de bras elle possède sous le comptoir et personne ne pose la question.',image:null,tags:['demi-kraken']},
  {id:'giselle',name:'Giselle Cliquetron',race:'Demi-Mécanique',tone:'Enthousiaste, bricoleuse, légèrement dangereuse',role:'Réparatrice d’objets et inventrice',lore:"Ancienne expérience d’un atelier gnome. Une partie de son corps est faite d’engrenages, de pistons et de plaques de cuivre.",image:null,tags:['technologie-gnome']},
  {id:'veloria',name:'Veloria Triplemousse',race:'',tone:'',role:'',lore:'',image:'../assets/images/veloria.jpeg',tags:[]},
  {id:'sigrune',name:'Sigrune Fendeblouse',race:'',tone:'',role:'',lore:'',image:'../assets/images/sigrune.jpeg',tags:[]},
  {id:'centoria',name:'Centoria Millebras',race:'',tone:'',role:'',lore:'',image:'../assets/images/centoria.jpeg',tags:[]},
  {id:'trixie-pnj',name:'Trixie Casse-Noisette',race:'',tone:'',role:'',lore:'',image:'../assets/images/trixie.jpeg',tags:[]}
];
const codexQuests=[
  {id:'q1',name:'Le Bricoleur qui avait trop bu',npc:'Gaston Pince-Doigt, menuisier alcoolique',description:"Hier soir j’ai voulu réparer la grande table de la Chope Qui Colle… mais après la sixième pinte j’ai confondu la caisse à outils avec la caisse de bois pour le feu.",objective:'Ramener 3 sacs de vis rouillées',reward:'',difficulty:'Très facile',difficultyTier:'basique',dungeon:'',image:null,tags:[]},
  {id:'q2',name:'Concours officiel de lancer de caillou',npc:'Mireille Trois-Dents, organisatrice sportive',description:"Ce soir c’est le Grand Championnat de Lancer de Caillou de la Vallée. Malheureusement les participants ont déjà lancé tous les cailloux… sur l’arbitre.",objective:'Ramener 3 cailloux bien équilibrés',reward:'',difficulty:'Facile',difficultyTier:'tactique',dungeon:'',image:null,tags:[]},
  {id:'q3',name:'Le médecin du pauvre',npc:'Docteur Archibald Rafistol',description:"Je soigne les aventuriers cassés depuis des années. Le problème c’est qu’ils arrivent souvent avec moins de morceaux qu’au départ.",objective:'Ramener 2 os détachables',reward:'',difficulty:'Normale',difficultyTier:'speciale',dungeon:'',image:null,tags:[]},
  {id:'q4',name:'La machine à bière automatique',npc:'Berthold Ventrepin',description:"J’invente une machine qui sert la bière toute seule. Comme ça je pourrai enfin me concentrer sur mon activité principale : boire avec les clients.",objective:'Ramener 2 ressorts mystérieux',reward:'',difficulty:'Difficile',difficultyTier:'brute',dungeon:'',image:null,tags:[]},
  {id:'q5',name:'La Couronne qui Traîne',npc:'Brünhilda la Torgnole',description:"Hier j’ai discuté avec un gobelin qui prétendait être roi. Après trois chopes j’ai réglé la discussion avec un tabouret.",objective:'Ramener la couronne cabossée',reward:'',difficulty:'Très difficile',difficultyTier:'mini_boss',dungeon:'',image:null,tags:[]},
  {id:'q6',name:'Le musée du ridicule',npc:'Professeur Cornelius Bric-À-Brac',description:"Je prépare une exposition sur les objets les plus stupides jamais trouvés dans un donjon. Pour l’instant j’ai une cuillère trouée et une pierre molle.",objective:'Ramener 4 objets ridicules',reward:'',difficulty:'Extrême',difficultyTier:'boss',dungeon:'',image:null,tags:[]}
];
const codexLoot=[
  {id:'l1',name:'Sac de vis rouillées',source:'Gobelin Bricoleur',type:'Vendable',effect:'Objet utile',value:1,rarity:'Mauvais',rarityTier:'basique',image:null,tags:['loot']},
  {id:'l2',name:'Ressort mystérieux',source:'Gobelin Bricoleur',type:'Vendable',effect:'Objet bizarre',value:1,rarity:'Commun',rarityTier:'tactique',image:null,tags:['loot']},
  {id:'l3',name:'Caillou bien équilibré',source:'Gobelin Lance-Tout',type:'Projectile',effect:'ATK 1 portée 3',value:0,rarity:'Inhabituel',rarityTier:'speciale',image:null,tags:['loot']},
  {id:'l4',name:'Touffe de poils magiques',source:'Balai Hanté',type:'Utilitaire',effect:'+1 déplacement gratuit',value:0,rarity:'Rare',rarityTier:'brute',image:null,tags:['loot']},
  {id:'l5',name:'Formulaire spectral',source:'Fantôme Bureaucrate',type:'Utilitaire',effect:'Ouvre un coffre gratuitement',value:0,rarity:'Épique',rarityTier:'mini_boss',image:null,tags:['loot']},
  {id:'l6',name:'Œuf d’or',source:'Poule Démoniaque',type:'Projectile',effect:'ATK 2 ignore DEF portée 3 ou vendu',value:5,rarity:'Légendaire',rarityTier:'boss',image:null,tags:['loot']}
];
const codexInteractables=[
  {id:'i1',name:'Tonneau',dungeon:'Le Château de Bastognac',type:'Conteneur',hp:3,actions:['Pousser','Casser','Lancer'],effect:'Objet physique utilisable pendant la rencontre.',image:null,tags:['exemple-maquette']},
  {id:'i2',name:'Bibliothèque',dungeon:'Le Château de Bastognac',type:'Obstacle',hp:5,actions:['Pousser','Casser'],effect:'Peut bloquer ou modifier un passage.',image:null,tags:['exemple-maquette']},
  {id:'i3',name:'Torche murale',dungeon:'Le Château de Bastognac',type:'Décor actif',hp:1,actions:['Activer','Casser'],effect:'Peut produire un effet contextuel selon la scène.',image:null,tags:['exemple-maquette']},
  {id:'i4',name:'Porte grinçante',dungeon:'Le Cabaret des Joyeuses',type:'Porte',hp:4,actions:['Ouvrir','Fermer'],effect:'Contrôle un accès et la ligne de vue.',image:null,tags:['exemple-maquette']}
];
const codexBrouhaha=[
  {id:'b1a',name:'Décor tremblant',level:1,dungeon:'Universel',effect:"Un objet interactif proche des héros se met à trembler comme s’il avait entendu son nom complet. Pousse-le d’1 case dans une direction libre. S’il percute une figurine, elle est repoussée d’1 case.",image:null},
  {id:'b2a',name:'Arrivée basique',level:2,dungeon:'Universel',effect:"Spawn : 1 créature basique apparaît sur une case libre au bord de la salle actuelle, de préférence près d’un mur, d’une porte ou d’un objet.",image:null},
  {id:'b4a',name:'Renforts brouillons',level:4,dungeon:'Universel',effect:"Spawn : 2 créatures basiques apparaissent sur des cases libres au bord de la salle actuelle. Elles doivent être placées séparées si possible.",image:null},
  {id:'b7a',name:'Décor dangereux',level:7,dungeon:'Universel',effect:"Un objet interactif dangereux s’active si possible : feu, fumée, chute, verrouillage, ouverture ou mouvement selon sa nature.",image:null},
  {id:'b10a',name:'Tactiques au comptoir',level:10,dungeon:'Universel',effect:"Spawn : 2 créatures tactiques apparaissent dans la salle actuelle sur des cases libres au bord de la pièce.",image:null},
  {id:'b12a',name:'Le donjon rote',level:12,dungeon:'Universel',effect:"L’objet interactif le plus proche des héros explose, éclate ou s’effondre violemment. Toutes les figurines adjacentes subissent 1 dégât.",image:null}
];
const codexFamilyData={dungeons:codexDungeons,heroes:codexHeroes,npcs:codexNpcs,quests:codexQuests,loot:codexLoot,interactables:codexInteractables,brouhaha:codexBrouhaha};
const familyMode=Object.fromEntries(Object.entries(codexFamilyMeta).map(([k,m])=>[k,localStorage.getItem('mockup:familyMode:'+k)||m.defaultMode]));
const familySelected=Object.fromEntries(Object.entries(codexFamilyData).map(([k,v])=>[k,localStorage.getItem('mockup:familySelected:'+k)||v[0]?.id]));
const familyDetailOpen=Object.fromEntries(Object.keys(codexFamilyMeta).map(k=>[k,false]));
const heroLevelState={brunhilda:Number(localStorage.getItem('mockup:heroLevel:brunhilda')||1)};


const emblem=(src,cls='chip-logo',alt='')=>`<img class="emblem-img ${cls}" src="${ICON_BASE+src}" alt="${alt}">`;
const utilIcon=(id,cls='icon')=>`<svg class="${cls}" aria-hidden="true"><use href="#${id}"/></svg>`;
const catChip=cat=>{const m=catMeta[cat];return `<span class="chip cat ${cat}">${emblem(m.sigil,'chip-logo','')}<span>${m.label}</span></span>`};
const creatureSrc=c=>c.displayImg||c.img;
const codexChapterMeta={
  creatures:{label:'Créatures',eyebrow:'Bestiaire de figurines',icon:'Sigil_Basique.webp',copy:'Reconnaître, arbitrer, comprendre. La figurine reste le premier contenu.'},
  dungeons:{label:'Donjons',eyebrow:'Hubs narratifs',icon:'Icone_Gameplay_DONJON.webp',copy:'Une affiche, une progression, un boss et des tiroirs vers tout ce qui vit dans le lieu.'},
  heroes:{label:'Héros',eyebrow:'Folios de personnages',icon:'Icone_Entite_HEROS.webp',copy:'Une identité continue, quatre niveaux, une compétence mise en scène.'},
  npcs:{label:'PNJ',eyebrow:'Rencontres de comptoir',icon:'Icone_Entite_PNJ.webp',copy:'Des visages, une voix et des relations plutôt que de fausses statistiques.'},
  quests:{label:'Quêtes',eyebrow:'Contrats & objectifs',icon:'Icone_Entite_QUETE.webp',copy:'Des annonces de taverne lisibles vite, avec l’objectif immédiatement repérable.'},
  loot:{label:'Loot',eyebrow:'Cabinet de curiosités',icon:'Icone_Gameplay_BUTIN.webp',copy:'L’objet est exposé, sa valeur et sa provenance restent secondaires mais visibles.'},
  interactables:{label:'Objets interactifs',eyebrow:'Carnet de mécanicien',icon:'Icone_Entite_OBJET_INTERACTIF.webp',copy:'Des objets concrets, actionnables, presque trop tentants pour rester intacts.'},
  brouhaha:{label:'Brouhaha',eyebrow:'Échelle du chaos',icon:'Icone_Entite_OBJET_BROUHAHA.webp',copy:'Chaque niveau est un incident lisible, et le chaos monte sans masquer la règle.'}
};
function renderCodexChapter(type){const host=$('#codex-chapter-banner'),m=codexChapterMeta[type];if(!host||!m)return;host.innerHTML=`<div class="chapter-crest">${emblem(m.icon,'chapter-logo')}</div><div><h2>${m.label}</h2></div><div class="chapter-rule">Codex › ${m.label}</div>`;}

function injectCreatureStageStyles(){
  if($('#creature-stage-v2-styles'))return;
  const style=document.createElement('style');
  style.id='creature-stage-v2-styles';
  style.textContent=`
    .art{background:#0d0907;isolation:isolate}
    .art:before{background:radial-gradient(circle at 66% 24%,color-mix(in srgb,var(--dungeon-accent,#8a5e31) 20%,transparent),transparent 38%),radial-gradient(circle at 50% 43%,color-mix(in srgb,var(--cat) 19%,transparent),transparent 37%),linear-gradient(180deg,rgba(33,23,15,.72) 0%,rgba(18,13,9,.86) 52%,rgba(11,8,6,.94) 100%),var(--dungeon-bg,url('./mockup-assets/textures/grain-dark.svg')) center/cover!important;filter:none!important;opacity:1}
    .art:after{background:radial-gradient(ellipse at 50% 82%,rgba(0,0,0,.08),rgba(0,0,0,.62) 72%),linear-gradient(90deg,#0b08066e,transparent 24%,transparent 76%,#0b080685)}
    .figure{inset:4% 5% 3%}
    .figure img{width:100%;height:100%;object-fit:contain;object-position:center;background:transparent;filter:drop-shadow(0 20px 18px rgba(0,0,0,.48)) saturate(1.06) contrast(1.03)}
    .thumb,.gallery-card{background:radial-gradient(circle at 50% 45%,color-mix(in srgb,var(--cat) 12%,transparent),transparent 48%),#120d09}
    .thumb img{object-fit:contain;padding:3px;background:transparent}
    .gallery-card img{object-fit:contain;padding:8px;background:transparent}
    @media(max-width:1199px) and (min-width:900px){
      .codex-shell{grid-template-columns:220px minmax(0,1fr)}
      .sheet{grid-template-columns:minmax(240px,34%) minmax(0,1fr);min-height:640px}
      .art{min-height:640px}
      .detail{padding:18px}
      .creature-name{font-size:36px}
    }
    @media(max-width:899px) and (min-width:768px){
      .sheet{display:block;min-height:0;margin-top:10px}
      .art{height:clamp(380px,46vh,480px);min-height:0;border-right:0;border-bottom:1px solid var(--b1)}
      .figure{inset:3% 7% 2%}
      .detail{padding:22px}
    }
    @media(max-width:767px){
      .art{height:clamp(300px,42svh,420px)!important;min-height:0!important}
      .figure{inset:3% 5% 2%}
      .fullscreen-btn{right:18px;top:18px}
      .art-frame{inset:10px}
    }
  `;
  document.head.append(style);
}

function loadImage(src){
  return new Promise((resolve,reject)=>{const img=new Image();img.decoding='async';img.onload=()=>resolve(img);img.onerror=reject;img.src=src});
}
async function makeTransparentDisplay(src){
  const img=await loadImage(src);
  const maxDim=1400,scale=Math.min(1,maxDim/Math.max(img.naturalWidth,img.naturalHeight));
  const w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale));
  const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,0,0,w,h);
  const frame=ctx.getImageData(0,0,w,h),d=frame.data,n=w*h,seen=new Uint8Array(n),queue=new Int32Array(n);let head=0,tail=0;
  const candidate=i=>{const o=i*4,a=d[o+3];if(a===0)return true;const r=d[o],g=d[o+1],b=d[o+2],min=Math.min(r,g,b),max=Math.max(r,g,b);return min>=210&&(max-min)<=24};
  const push=i=>{if(i<0||i>=n||seen[i]||!candidate(i))return;seen[i]=1;queue[tail++]=i};
  for(let x=0;x<w;x++){push(x);push((h-1)*w+x)}
  for(let y=1;y<h-1;y++){push(y*w);push(y*w+w-1)}
  while(head<tail){const i=queue[head++],x=i%w,y=(i/w)|0;if(x>0)push(i-1);if(x<w-1)push(i+1);if(y>0)push(i-w);if(y<h-1)push(i+w)}
  for(let i=0;i<n;i++)if(seen[i]){const o=i*4,lum=(d[o]+d[o+1]+d[o+2])/3;d[o+3]=lum>=240?0:Math.max(0,Math.min(255,Math.round((240-lum)/30*255)))}
  ctx.putImageData(frame,0,0);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.92));
  if(!blob)throw new Error('WebP indisponible');
  return URL.createObjectURL(blob);
}
async function prepareCreatureImage(c){
  if(c.displayImg)return;
  try{c.displayImg=await makeTransparentDisplay(c.img)}catch(err){console.warn('Dérivé transparent indisponible pour',c.id,err);c.displayImg=c.img}
}
async function prepareCreatureImages(){
  const selected=creatures.find(c=>c.id===selectedCreature)||creatures[0];
  await prepareCreatureImage(selected);
  renderBestiary();renderCreature();applyBestiaryResponsive();
  for(const c of creatures){
    if(c===selected)continue;
    await prepareCreatureImage(c);
    renderBestiary();
    if(c.id===selectedCreature)renderCreature();
  }
}

function showToast(msg){const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>t.classList.remove('show'),2600)}
const cinematicSeen=new Set();
function ensureCinematicLayer(){let layer=$('#gargotte-cinematic');if(layer)return layer;layer=document.createElement('div');layer.id='gargotte-cinematic';layer.className='gargotte-cinematic';layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-live','polite');document.body.append(layer);return layer}
function hideCinematic(){const layer=$('#gargotte-cinematic');if(!layer)return;layer.classList.remove('show');clearTimeout(showCinematic.timer)}
function showCinematic(kind,payload){payload=payload||{};const layer=ensureCinematicLayer(),image=payload.image||'',accent=payload.accent||'#D4A45F';clearTimeout(showCinematic.timer);const icon=kind==='victory'?'Icone_Gameplay_BUTIN.webp':kind==='boss'?'Sigil_Boss.webp':'Icone_Gameplay_DONJON.webp';const eyebrow=kind==='victory'?'RENCONTRE TERMINÉE':kind==='boss'?'BOSS EN VUE':'NOUVEAU LIEU';const title=payload.title||(kind==='victory'?'Salle nettoyée':'Découverte');const copy=payload.copy||(kind==='victory'?'Le silence revient. C’est presque inquiétant.':'');layer.dataset.kind=kind;layer.style.setProperty('--cinematic-bg',image?"url('"+image+"')":'none');layer.style.setProperty('--cinematic-accent',accent);layer.innerHTML='<div class="cinematic-backdrop"></div><div class="cinematic-curtain left"></div><div class="cinematic-curtain right"></div><div class="cinematic-card"><img class="cinematic-emblem" src="'+ICON_BASE+icon+'" alt=""><div class="cinematic-eyebrow">'+eyebrow+'</div><h2>'+title+'</h2><p>'+copy+'</p><div class="cinematic-sparks" aria-hidden="true">'+Array.from({length:9},(_,i)=>'<i style="--i:'+i+'"></i>').join('')+'</div><button class="btn cinematic-skip" type="button">Continuer</button></div>';layer.onclick=e=>{if(e.target===layer||e.target.closest('.cinematic-skip'))hideCinematic()};requestAnimationFrame(()=>layer.classList.add('show'));showCinematic.timer=setTimeout(hideCinematic,kind==='victory'?3200:2500)}

function normalizeView(view){return view==='plus'?'more':view}
function show(requested){
  const view=normalizeView(requested);
  if(dirty&&currentView==='atelier'&&view!=='atelier')return openUnsaved(view);
  currentView=view;
  $$('.page').forEach(p=>p.classList.toggle('active',p.id===view));
  $$('[data-view]').forEach(b=>b.classList.toggle('active',
    b.dataset.view===view ||
    (b.dataset.view==='game'&&['game','generator','brouhaha'].includes(view)) ||
    (b.dataset.view==='plus'&&['more','atelier','media','importexport','mockup'].includes(view))
  ));
  history.replaceState(null,'','#'+view);
  window.scrollTo({top:0,behavior:'smooth'});
  if(view==='codex'){if(currentCodex==='creatures')applyBestiaryResponsive();else if(codexFamilyMeta[currentCodex])applyFamilyResponsive(currentCodex)}
}
function initNav(){
  $$('[data-view]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));
  const hash=normalizeView(location.hash.replace('#',''));
  show(hash&&$('#'+hash)?hash:'home');
}

function renderBestiary(){
  const host=$('#bestiary-collection');if(!host)return;
  $('#mode-gallery')?.classList.toggle('active',bestiaryMode==='gallery');
  $('#mode-list')?.classList.toggle('active',bestiaryMode==='list');
  host.innerHTML=bestiaryMode==='gallery'
    ? `<div class="gallery-grid">${creatures.map(c=>`<button class="gallery-card ${c.cat}" data-creature="${c.id}"><img src="${creatureSrc(c)}" alt=""><div class="gallery-copy"><div class="row-name">${c.name}</div><div class="row-sub">${c.dungeon}</div><div class="row-meta"><span class="chip cat ${c.cat}"><span>${catMeta[c.cat].label}</span></span><span class="chip neutral">Menace ${c.threat}</span></div></div></button>`).join('')}</div>`
    : `<div class="creature-list">${creatures.map(c=>`<button class="creature-row ${c.cat} ${c.id===selectedCreature?'selected':''}" data-creature="${c.id}"><div class="thumb"><img src="${creatureSrc(c)}" alt=""></div><div><div class="row-name">${c.name}</div><div class="row-sub">${c.dungeon}</div><div class="row-meta">${catChip(c.cat)}<span class="row-stats">PV ${c.pv} · ATK ${c.atk} · DEF ${c.def} · ☠ ${c.threat}</span></div></div></button>`).join('')}</div>`;
  $$('[data-creature]',host).forEach(b=>b.onclick=()=>selectCreature(b.dataset.creature));
}
function selectCreature(id){
  selectedCreature=id;localStorage.setItem('mockup:selectedCreature',id);renderBestiary();renderCreature();
  const c=creatures.find(x=>x.id===id);if(c&&!c.displayImg)prepareCreatureImage(c).then(()=>{renderBestiary();renderCreature()});
  if(isBestiarySequential()){mobileDetailOpen=true;applyBestiaryResponsive();window.scrollTo({top:0,behavior:'smooth'})}
}
function renderCreature(){
  const c=creatures.find(x=>x.id===selectedCreature)||creatures[0],m=catMeta[c.cat],host=$('#creature-detail');if(!host)return;
  const src=creatureSrc(c),dungeon=codexDungeons.find(d=>d.name===c.dungeon);
  const dungeonBg=dungeon?.image?'url("'+dungeon.image+'")':"url('./mockup-assets/textures/grain-dark.svg')";
  host.innerHTML=`<article class="sheet ${c.cat} has-dungeon-bg" style="--dungeon-accent:${dungeon?.accent||'#8a5e31'};--dungeon-bg:${dungeonBg}"><div class="art"><div class="art-frame"></div><div class="figure-plinth" aria-hidden="true"></div><button class="btn iconbtn fullscreen-btn" id="full-image" aria-label="Ouvrir l’image en plein écran">${utilIcon('i-expand')}</button><div class="figure"><img src="${src}" alt="Illustration de ${c.name}"></div></div><div class="detail"><nav class="codex-breadcrumb" aria-label="Fil d’Ariane"><span>Codex</span><i>›</i><span>${c.dungeon}</span><i>›</i><b>${c.name}</b></nav><div class="identity"><div><button class="dungeon btn tertiary" data-codex="dungeons">${emblem('Icone_Gameplay_DONJON.webp','dungeon-logo','')}<span>${c.dungeon}</span></button><h2 class="creature-name">${c.name}</h2><div class="row wrap">${catChip(c.cat)}<span class="chip neutral">${emblem('Icone_Gameplay_MENACE.webp')}Menace ${c.threat}</span><span class="chip neutral">${emblem('Icone_Gameplay_SOCLE.webp')}Socle ${c.base} mm</span></div></div><div class="sigil">${emblem(m.sigil,'sigil-logo','Sigil '+m.label)}</div></div><div class="stats"><div class="stat">${emblem('Icone_Gameplay_PV.webp','stat-logo')}<b>${c.pv}</b><span>PV</span></div><div class="stat">${emblem('Icone_Gameplay_ATK.webp','stat-logo')}<b>${c.atk}</b><span>ATK</span></div><div class="stat">${emblem('Icone_Gameplay_DEF.webp','stat-logo')}<b>${c.def}</b><span>DEF</span></div><div class="stat">${emblem('Icone_Gameplay_ZONE.webp','stat-logo')}<b>${c.range}</b><span>Portée / Zone</span></div><div class="stat">${emblem('Icone_Gameplay_ACTION.webp','stat-logo')}<b>${c.actions}</b><span>Actions</span></div></div><section class="ability"><div class="caps" style="display:flex;align-items:center;gap:8px">${emblem('Icone_Gameplay_COMPETENCE.webp','chip-logo')}<span>Compétence</span></div><h3>${c.ability}</h3><p>${c.copy}</p></section><div class="sections"><section class="section"><h4>${emblem('Icone_Gameplay_COMPORTEMENT.webp','section-logo')}Comportement</h4><p>${c.ai}</p></section><section class="section"><h4>${emblem('Icone_Gameplay_BUTIN.webp','section-logo')}Butin</h4><div class="loot-items">${c.loot.map(x=>`<button class="loot-item" data-codex="loot">${x}</button>`).join('')}</div></section><section class="section lore"><h4>${emblem('Icone_Gameplay_LORE.webp','section-logo')}Lore</h4><p>${c.lore}</p></section></div><div class="tags">${c.tags.map(t=>`<span class="chip neutral">${t}</span>`).join('')}</div><div class="related related-rail"><div class="row" style="justify-content:space-between"><h4 class="serif" style="margin:0">Entités liées</h4><span class="small muted">Même donjon puis relations explicites</span></div><div class="related-grid"><button class="related-card" data-codex="dungeons"><b>${c.dungeon}</b><div class="small muted">Donjon</div></button><button class="related-card" data-codex="loot"><b>${c.loot[0]}</b><div class="small muted">Loot</div></button><button class="related-card" data-codex="quests"><b>Le tonneau qui savait trop</b><div class="small muted">Quête liée</div></button></div></div></div></article>`;
  $('#full-image').onclick=()=>openImage(src,c.name);
  $$('[data-codex]',host).forEach(b=>b.onclick=()=>openCodex(b.dataset.codex));
}

function familyMark(type,cls='family-mark'){
  const m=codexFamilyMeta[type];
  return m.premium?emblem(m.premium,cls,''):utilIcon(m.util,cls);
}
function familyMedia(type,item,cls='family-media'){
  return item.image
    ? '<div class="'+cls+'"><img src="'+item.image+'" alt="Illustration de '+item.name+'"></div>'
    : '<div class="'+cls+' placeholder">'+familyMark(type,'family-mark')+'<span>Image / média</span></div>';
}
function itemTier(type,item){
  if(type==='quests')return item.difficultyTier||null;
  if(type==='loot')return item.rarityTier||null;
  return null;
}
function tierBadge(kind,tier,label){
  if(!tier)return '';
  return '<span class="tier-badge '+tier+'"><i></i><span>'+(kind==='quest'?'Difficulté':'Rareté')+'</span><b>'+label+'</b></span>';
}
function tierLegend(type){return '';}
function familySubtitle(type,item){
  if(type==='dungeons')return 'Donjon '+item.number;
  if(type==='heroes')return (item.levels?.length||0)+' niveaux disponibles';
  if(type==='npcs')return [item.race,item.role].filter(Boolean).join(' · ')||'PNJ';
  if(type==='quests')return [item.difficulty,item.npc].filter(Boolean).join(' · ');
  if(type==='loot')return [item.rarity,item.type,item.source].filter(Boolean).join(' · ');
  if(type==='interactables')return [item.type,item.dungeon].filter(Boolean).join(' · ');
  if(type==='brouhaha')return 'Niveau '+item.level+' · '+(item.dungeon||'Universel');
  return '';
}
function familyCard(type,item,mode){
  const tier=itemTier(type,item);
  const tierStyle=tier?'--tier:var(--'+({basique:'basic',tactique:'tactical',speciale:'special',brute:'brute',mini_boss:'mini',boss:'boss'}[tier])+');':'';
  const dungeonStyle=type==='dungeons'?'--dungeon-accent:'+(item.accent||'#8a5e31')+';--dungeon-glow:'+(item.glow||'#d4a45f')+';':'';
  const badge=type==='quests'?tierBadge('quest',tier,item.difficulty):type==='loot'?tierBadge('loot',tier,item.rarity):'';
  const kicker=mode==='list'?'<div class="family-card-kicker"><span>'+codexFamilyMeta[type].singular+'</span></div>':'';
  return '<button class="family-card '+mode+(tier?' tier-card '+tier:'')+(type==='dungeons'?' dungeon-card':'')+'" data-family-item="'+item.id+'" style="--family:'+codexFamilyMeta[type].color+';'+tierStyle+dungeonStyle+'">'+
    familyMedia(type,item,'family-card-media')+
    '<div class="family-card-copy">'+kicker+'<strong>'+item.name+'</strong>'+badge+'<span>'+familySubtitle(type,item)+'</span></div></button>';
}
function dungeonDetail(d){
  const floors=d.floorBudgets?.length?'<div class="floor-track" aria-label="Étages du donjon">'+d.floorBudgets.map((b,i)=>'<div class="floor-stop"><span class="floor-label">Étage</span><b>'+(i+1)+'</b><span class="floor-budget">Budget '+b+'</span></div>').join('')+'</div>':'<div class="empty-inline">Budgets d’étages non présents dans la source actuellement utilisée.</div>';
  const bossVisual=d.bossImage?'<img src="'+d.bossImage+'" alt="Illustration de '+d.boss+'">':'<div class="boss-sigil-fallback">'+emblem('Sigil_Boss.webp','boss-fallback-logo','')+'</div>';
  const bossMeta=(d.bossThreat?'Menace '+d.bossThreat+' · ':'')+(d.bossSource||'Source à confirmer');
  return '<article class="dungeon-sheet family-detail-card" style="--dungeon-accent:'+d.accent+';--dungeon-glow:'+d.glow+'"><div class="dungeon-cover material-stage">'+familyMedia('dungeons',d,'dungeon-cover-media')+'<div class="dungeon-cover-seal">'+familyMark('dungeons','section-logo')+'<span>'+(d.image?'Couverture Drive':'Ambiance typée')+'</span></div><div class="dungeon-cover-copy"><div class="eyebrow">Donjon '+d.number+'</div><h2>'+d.name+'</h2><p>'+d.atmosphere+'</p></div></div><div class="dungeon-brief material-board"><section class="expedition-route"><div class="eyebrow">Progression · carte d’expédition</div><h3 class="serif">Étages & budgets</h3>'+floors+'</section><button class="dungeon-boss-showcase" type="button" data-boss-reveal="'+d.id+'" aria-label="Révéler le boss '+d.boss+'"><span class="boss-media">'+bossVisual+'</span><span class="boss-copy"><span class="boss-overline">Boss final</span><strong>'+(d.boss||'Non verrouillé')+'</strong><small>'+bossMeta+'</small><em>Lever le rideau</em></span></button></div><div class="dungeon-links cabinet-links"><button class="preview-mini" data-see-all="creatures">'+emblem('Sigil_Basique.webp','section-logo')+'<b>Créatures</b><span>Bestiaire préfiltré</span></button><button class="preview-mini" data-see-all="quests">'+familyMark('quests','section-logo')+'<b>Quêtes</b><span>Références liées</span></button><button class="preview-mini" data-see-all="interactables">'+familyMark('interactables','section-logo')+'<b>Objets interactifs</b><span>Éléments de salle</span></button><button class="preview-mini" data-see-all="brouhaha">'+familyMark('brouhaha','section-logo')+'<b>Brouhaha</b><span>Effets du donjon</span></button></div></article>';
}
function heroDetail(h){
  const wanted=heroLevelState[h.id]||1;
  const level=h.levels.find(x=>x.level===wanted)||h.levels[0]||{};
  const val=x=>x??'—';
  const levelImage=level.image||h.image;
  const unlocked=h.levels.filter(x=>x.level<=level.level&&x.ability&&x.ability!=='-').map(x=>({
    level:x.level,name:x.ability,effect:x.effect||'Effet à renseigner.',brouhaha:x.brouhaha||''
  }));
  const competenceStack=unlocked.length
    ? unlocked.map(skill=>'<section class="hero-competence cumulative-skill"><div class="hero-skill-head"><div class="eyebrow">'+emblem('Icone_Gameplay_COMPETENCE.webp','chip-logo')+'<span>Compétence · N'+skill.level+'</span></div>'+(skill.brouhaha?'<span class="brouhaha-stamp">Brouhaha '+skill.brouhaha+'</span>':'')+'</div><h3>'+skill.name+'</h3><p>'+skill.effect+'</p></section>').join('')
    : '<section class="hero-competence cumulative-skill"><div class="eyebrow">'+emblem('Icone_Gameplay_COMPETENCE.webp','chip-logo')+'<span>Compétence</span></div><h3>À renseigner</h3></section>';
  const portrait=levelImage
    ? '<div class="hero-portrait hero-level-portrait level-'+(level.level||1)+'"><img src="'+levelImage+'" alt="Illustration niveau '+(level.level||1)+' de '+h.name+'"></div>'
    : familyMedia('heroes',h,'hero-portrait');
  return '<article class="hero-sheet-proposal family-detail-card">'+
    '<aside class="hero-identity-card">'+portrait+'<div class="hero-nameplate"><div class="eyebrow" style="display:flex;align-items:center;gap:7px">'+familyMark('heroes','chip-logo')+'<span>Héros</span></div><h2>'+h.name+'</h2><div>'+(level.role||'Rôle à renseigner')+'</div></div><div class="hero-level-rail" aria-label="Niveaux du héros">'+h.levels.map(x=>'<button class="hero-level-proposal '+(x.level===level.level?'active':'')+'" data-hero-level="'+x.level+'" data-hero-id="'+h.id+'" aria-label="Afficher le niveau '+x.level+'">N'+x.level+'</button>').join('')+'</div></aside>'+
    '<div class="hero-playbook"><header><div><div class="eyebrow">Niveau '+(level.level||1)+'</div><h3>'+(level.title||level.name||h.name)+'</h3><div class="hero-motto">« '+(level.role?'Tenir son rôle, puis tenir le comptoir.':'Une légende se construit niveau après niveau.')+' »</div></div></header>'+
    '<div class="hero-stat-ribbon"><div>'+emblem('Icone_Gameplay_PV.webp','stat-logo')+'<b>'+val(level.pv)+'</b><span>PV</span></div><div>'+emblem('Icone_Gameplay_ATK.webp','stat-logo')+'<b>'+val(level.atk)+'</b><span>ATK</span></div><div>'+emblem('Icone_Gameplay_DEF.webp','stat-logo')+'<b>'+val(level.def)+'</b><span>DEF</span></div><div>'+emblem('Icone_Gameplay_ZONE.webp','stat-logo')+'<b>'+val(level.zone)+'</b><span>Zone</span></div><div>'+emblem('Icone_Gameplay_ACTION.webp','stat-logo')+'<b>'+val(level.actions)+'</b><span>Actions</span></div></div>'+
    '<div class="hero-skill-stack">'+competenceStack+'</div>'+
    '<div class="hero-progression-note">Les compétences acquises aux niveaux précédents restent disponibles. L’image affichée dépend du niveau sélectionné.</div></div></article>';
}
function npcDetail(n){
  return '<article class="npc-sheet-proposal family-detail-card">'+
    '<div class="npc-mast">'+familyMedia('npcs',n,'npc-portrait')+'<div class="npc-title"><div class="eyebrow" style="display:flex;align-items:center;gap:7px">'+familyMark('npcs','chip-logo')+'<span>PNJ</span></div><h2>'+n.name+'</h2><p>'+(n.role||'Rôle à renseigner')+'</p></div></div>'+
    '<div class="npc-dossier"><aside class="npc-personality"><div><span>Race</span><b>'+(n.race||'—')+'</b></div><div><span>Rôle</span><b>'+(n.role||'—')+'</b></div><div><span>Ton</span><b>'+(n.tone||'—')+'</b></div></aside>'+
    '<section class="npc-lore"><div class="eyebrow">Portrait narratif</div><h3 class="serif">Lore</h3><div class="npc-voice-note"><span>À l’oreille</span><b>'+(n.tone||'Une voix à découvrir au comptoir')+'</b></div><p>'+(n.lore||'Le lore du PNJ prend ici toute la largeur narrative sans lui inventer de statistiques.')+'</p></section>'+
    '<section class="npc-relations pinned-notes"><div class="eyebrow">Carnet d’adresses</div><button class="relation-note" data-see-all="quests">'+familyMark('quests','chip-logo')+'<span><b>Quêtes associées</b><small>Ouvrir les contrats liés</small></span></button></section></div></article>';
}
function questDetail(q){
  const tier=q.difficultyTier||'basique';
  return '<article class="quest-sheet-proposal family-detail-card tier-detail '+tier+'">'+familyMedia('quests',q,'quest-banner')+
    '<div class="quest-contract notice-board"><div class="quest-stamp">MISSION</div><div class="quest-meta"><span style="display:flex;align-items:center;gap:6px">'+familyMark('quests','chip-logo')+tierBadge('quest',tier,q.difficulty||tierMeta[tier].quest)+'</span><span>'+(q.dungeon||'Donjon non renseigné')+'</span></div><h2>'+q.name+'</h2><div class="quest-attachments"><div class="quest-giver">'+familyMark('npcs','chip-logo')+'<span>Commanditaire / PNJ<br><b>'+(q.npc||'—')+'</b></span></div><div class="quest-attachment-reward">'+emblem('Icone_Gameplay_BUTIN.webp','chip-logo')+'<span>Récompense<br><b>'+(q.reward||'À découvrir')+'</b></span></div></div><p class="quest-story">'+(q.description||'')+'</p>'+
    '<div class="quest-objective"><span>Objectif</span><strong>'+(q.objective||'—')+'</strong></div><div class="quest-reward"><span>Récompense</span><b>'+(q.reward||'Non renseignée dans cet exemple source')+'</b></div></div></article>';
}
function lootDetail(l){
  const tier=l.rarityTier||'basique';
  return '<article class="loot-sheet-proposal family-detail-card tier-detail '+tier+'"><div class="loot-stage">'+familyMedia('loot',l,'loot-object')+'<div class="loot-value"><b>'+(l.value??'—')+'</b><span>or</span></div></div>'+
    '<div class="loot-ledger">'+tierBadge('loot',tier,l.rarity||tierMeta[tier].loot)+'<div class="eyebrow">Cabinet de curiosités · '+(l.type||'Loot')+'</div><h2>'+l.name+'</h2><div class="museum-label"><span>Pièce cataloguée</span><b>Provenance connue</b></div><div class="loot-effect"><span>Effet</span><strong>'+(l.effect||'—')+'</strong></div><div class="loot-source provenance-plaque"><span>Provenance</span><button class="btn tertiary" data-see-all="creatures">'+(l.source||'—')+'</button><small>Créature source · relation explicite</small></div></div></article>';
}
function interactableDetail(o){
  return '<article class="interactable-sheet-proposal family-detail-card"><div class="blueprint-media">'+familyMedia('interactables',o,'blueprint-object')+'<div class="blueprint-label">Zone image / schéma</div></div>'+
    '<div class="blueprint-data"><div class="eyebrow" style="display:flex;align-items:center;gap:7px">'+familyMark('interactables','chip-logo')+'<span>'+(o.type||'Objet du décor')+'</span></div><h2>'+o.name+'</h2><div class="row wrap"><span class="chip neutral">'+emblem('Icone_Gameplay_PV.webp')+'PV '+(o.hp??'—')+'</span><span class="chip neutral">'+emblem('Icone_Gameplay_DONJON.webp')+(o.dungeon||'—')+'</span></div>'+
    '<section class="blueprint-actions"><span>Actions autorisées · jetons</span><div>'+(o.actions||[]).map(a=>'<b>'+emblem('Icone_Gameplay_ACTION.webp','chip-logo')+'<span>'+a+'</span></b>').join('')+'</div></section><section class="blueprint-effect annotated-note"><span>Annotation de terrain</span><p>'+(o.effect||'—')+'</p><small>« Si ça possède une poignée, quelqu’un finira par tirer dessus. »</small></section></div></article>';
}
function brouhahaDetail(b){
  return '<article class="brouhaha-sheet-proposal family-detail-card chaos-'+(b.level>=10?'critical':b.level>=7?'high':b.level>=4?'mid':'low')+'" style="--bh:'+Math.min(12,Math.max(1,b.level||1))+'"><div class="brouhaha-visual">'+familyMedia('brouhaha',b,'brouhaha-media')+'<div class="brouhaha-number">'+b.level+'</div><div class="brouhaha-physical-gauge"><i style="--fill:'+((b.level||0)/12*100)+'%"></i><span>0</span><span>12</span></div><div class="noise-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>'+
    '<div class="brouhaha-copy"><div class="eyebrow" style="display:flex;align-items:center;gap:7px">'+familyMark('brouhaha','chip-logo')+'<span>'+(b.dungeon||'Universel')+'</span></div><h2>'+b.name+'</h2><div class="brouhaha-effect"><span>Effet</span><p>'+b.effect+'</p></div><div class="small muted">L’image est optionnelle et peut provenir d’un média lié, même si le template Brouhaha historique ne possède pas de champ image_path.</div></div></article>';
}
function familyDetail(type,item){
  if(type==='dungeons')return dungeonDetail(item);
  if(type==='heroes')return heroDetail(item);
  if(type==='npcs')return npcDetail(item);
  if(type==='quests')return questDetail(item);
  if(type==='loot')return lootDetail(item);
  if(type==='interactables')return interactableDetail(item);
  return brouhahaDetail(item);
}
function renderFamilyBrowser(type){
  const host=$('#'+type+'-browser'),m=codexFamilyMeta[type],all=codexFamilyData[type];if(!host||!m||!all)return;
  const selected=all.find(x=>x.id===familySelected[type])||all[0];if(selected)familySelected[type]=selected.id;
  const mode=familyMode[type];
  host.style.setProperty('--family',m.color);
  host.innerHTML='<div class="family-toolbar family-toolbar-clean"><input class="field family-search" data-family-search="'+type+'" placeholder="Rechercher dans '+m.label.toLowerCase()+'…"><div class="segmented"><button class="'+(mode==='gallery'?'active':'')+'" data-family-mode="'+type+':gallery">'+utilIcon('i-grid','icon sm')+'</button><button class="'+(mode==='list'?'active':'')+'" data-family-mode="'+type+':list">'+utilIcon('i-list','icon sm')+'</button></div></div>'+
    tierLegend(type)+
    '<div class="family-backbar" data-family-back="'+type+'"></div>'+
    '<div class="family-browser-shell"><aside class="family-collection panel"><div class="family-collection-grid '+mode+'" data-family-list="'+type+'">'+all.map(x=>familyCard(type,x,mode)).join('')+'</div></aside><div class="family-detail-host">'+(selected?familyDetail(type,selected):'')+'</div></div>';
  $$('[data-family-item]',host).forEach(b=>b.onclick=()=>selectFamilyItem(type,b.dataset.familyItem));
  $$('[data-family-mode]',host).forEach(b=>b.onclick=()=>{const next=b.dataset.familyMode.split(':')[1];familyMode[type]=next;localStorage.setItem('mockup:familyMode:'+type,next);renderFamilyBrowser(type);applyFamilyResponsive(type)});
  const search=$('[data-family-search]',host);if(search)search.oninput=()=>{
    const q=search.value.trim().toLowerCase(),list=$('[data-family-list]',host);
    list.innerHTML=all.filter(x=>(x.name+' '+familySubtitle(type,x)).toLowerCase().includes(q)).map(x=>familyCard(type,x,mode)).join('')||'<div class="empty-inline">Aucun résultat.</div>';
    $$('[data-family-item]',list).forEach(b=>b.onclick=()=>selectFamilyItem(type,b.dataset.familyItem));
  };
  $('[data-see-all]',host).forEach(b=>b.onclick=()=>{renderCodexType(b.dataset.seeAll);showToast('Collection liée ouverte')});
  $('[data-boss-reveal]',host).forEach(b=>b.onclick=()=>{const d=codexDungeons.find(x=>x.id===b.dataset.bossReveal);if(d)showCinematic('boss',{title:d.boss||'Boss',copy:(d.bossThreat?'Menace '+d.bossThreat+' · ':'')+(d.atmosphere||''),image:d.bossImage||d.image,accent:d.accent})});
  $$('[data-hero-level]',host).forEach(b=>b.onclick=()=>{heroLevelState[b.dataset.heroId]=Number(b.dataset.heroLevel);localStorage.setItem('mockup:heroLevel:'+b.dataset.heroId,b.dataset.heroLevel);renderFamilyBrowser(type);applyFamilyResponsive(type)});
}
function selectFamilyItem(type,id){
  familySelected[type]=id;localStorage.setItem('mockup:familySelected:'+type,id);familyDetailOpen[type]=true;renderFamilyBrowser(type);applyFamilyResponsive(type);
  if(type==='dungeons'){const d=codexDungeons.find(x=>x.id===id);if(d&&!cinematicSeen.has(id)){cinematicSeen.add(id);setTimeout(()=>showCinematic('discovery',{title:d.name,copy:d.atmosphere,image:d.image,accent:d.accent}),90)}}
  if(isBestiarySequential())window.scrollTo({top:0,behavior:'smooth'});
}
function applyFamilyResponsive(type){
  const host=$('#'+type+'-browser');if(!host)return;
  const shell=$('.family-browser-shell',host),collection=$('.family-collection',host),detail=$('.family-detail-host',host),bar=$('.family-backbar',host);if(!shell||!collection||!detail||!bar)return;
  if(isBestiarySequential()){
    shell.classList.add('sequential');
    collection.style.display=familyDetailOpen[type]?'none':'block';
    detail.style.display=familyDetailOpen[type]?'block':'none';
    bar.style.display=familyDetailOpen[type]?'flex':'none';
    if(familyDetailOpen[type]){
      bar.innerHTML='‹ <b>'+codexFamilyMeta[type].label+'</b><span>· retour à la collection</span>';
      bar.onclick=()=>{familyDetailOpen[type]=false;applyFamilyResponsive(type);window.scrollTo({top:0,behavior:'smooth'})};
    }else{
      bar.innerHTML='';
      bar.onclick=null;
    }
  }else{
    shell.classList.remove('sequential');bar.style.removeProperty('display');collection.style.removeProperty('display');detail.style.removeProperty('display');bar.onclick=null;
  }
}
function setBestiaryMode(mode){bestiaryMode=mode;localStorage.setItem('mockup:bestiaryMode',mode);renderBestiary()}
function applyBestiaryResponsive(){
  const list=$('#codex-creatures .collection'),detail=$('#creature-detail'),bar=$('#codex-creatures .mobile-sheet-bar'),shell=$('#codex-creatures .codex-shell');if(!list||!detail||!bar||!shell)return;
  if(isBestiarySequential()){
    shell.classList.add('sequential');
    list.style.display=mobileDetailOpen?'none':'block';detail.style.display=mobileDetailOpen?'block':'none';
    bar.style.display=mobileDetailOpen?'flex':'none';
    if(mobileDetailOpen){
      bar.innerHTML=`‹ <b>Bestiaire</b><span>· ${creatures.find(c=>c.id===selectedCreature)?.name||''}</span>`;
      bar.tabIndex=0;bar.setAttribute('role','button');
      bar.onclick=()=>{mobileDetailOpen=false;applyBestiaryResponsive();window.scrollTo({top:0,behavior:'smooth'})};
      bar.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();mobileDetailOpen=false;applyBestiaryResponsive();window.scrollTo({top:0,behavior:'smooth'})}};
    }else{
      bar.innerHTML='';bar.removeAttribute('role');bar.removeAttribute('tabindex');bar.onclick=null;bar.onkeydown=null;
    }
  }else{
    shell.classList.remove('sequential');list.style.removeProperty('display');detail.style.removeProperty('display');bar.style.removeProperty('display');
    bar.removeAttribute('role');bar.removeAttribute('tabindex');bar.onclick=null;bar.onkeydown=null;
  }
}
function openCodex(type){show('codex');renderCodexType(type)}
function renderCodexType(type){
  currentCodex=type;renderCodexChapter(type);$$('.codex-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.codex===type));$$('.entity-demo').forEach(x=>x.classList.remove('active'));$('#codex-'+type)?.classList.add('active');
  $('#bestiary-controls')?.classList.toggle('hidden',type!=='creatures');
  if(type==='creatures'){renderBestiary();renderCreature();applyBestiaryResponsive()}
  else if(codexFamilyMeta[type]){renderFamilyBrowser(type);applyFamilyResponsive(type)}
}
function initCodex(){
  $$('.codex-tabs button').forEach(b=>b.onclick=()=>renderCodexType(b.dataset.codex));
  $('#mode-gallery').onclick=()=>setBestiaryMode('gallery');$('#mode-list').onclick=()=>setBestiaryMode('list');
  $$('[data-see-all]').forEach(b=>b.onclick=()=>{renderCodexType(b.dataset.seeAll);showToast('Collection ouverte avec filtre Donjon conservé')});
  $$('.hero-level').forEach(b=>b.onclick=()=>{$$('.hero-level').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#hero-level-label').textContent=b.dataset.level;$('#hero-pv').textContent=Number(b.dataset.level)*2+8;$('#hero-atk').textContent=Math.ceil(Number(b.dataset.level)/2)+2});
  addEventListener('resize',()=>{applyBestiaryResponsive();Object.keys(codexFamilyMeta).forEach(applyFamilyResponsive)});
}

function renderEncounter(){
  const host=$('#encounter-results');if(!host)return;
  host.innerHTML=Object.entries(encounter).map(([id,qty])=>{
    const c=creatures.find(x=>x.id===id);
    return `<div class="result-card ${c.cat} ${qty===0?'done':''}">
      <div class="encounter-row">
        <div class="encounter-miniature"><img src="${creatureSrc(c)}" alt=""><i></i></div>
        <div class="encounter-creature">
          <span class="encounter-type ${c.cat}">${catMeta[c.cat].label}</span>
          <b class="serif encounter-name">${c.name}</b>
          <div class="encounter-stats">
            <span><b>${c.pv}</b><small>PV</small></span>
            <span><b>${c.atk}</b><small>ATK</small></span>
            <span><b>${c.def}</b><small>DEF</small></span>
            <span><b>${c.actions}</b><small>ACTION</small></span>
            <span><b>${c.threat}</b><small>MENACE</small></span>
          </div>
          <div class="encounter-ability">${emblem('Icone_Gameplay_COMPETENCE.webp','chip-logo')}<b>${c.ability}</b></div>
        </div>
        <div class="row encounter-controls"><span class="qty">×${qty}</span><button class="btn smallbtn" data-open-creature="${id}">Fiche</button><button class="btn smallbtn" data-eliminate="${id}" ${qty===0?'disabled':''}>Éliminer</button></div>
      </div>
      ${qty===0?'<div class="loot-reveal">Groupe terminé. Tous les tirages de Butin ont été effectués.</div>':''}
    </div>`;
  }).join('');
  $('[data-eliminate]',host).forEach(b=>b.onclick=()=>{const id=b.dataset.eliminate;if(encounter[id]>0){encounter[id]--;renderEncounter();showToast('1 occurrence éliminée · Butin tiré une seule fois');if(!encounterVictoryShown&&Object.values(encounter).every(q=>q===0)){encounterVictoryShown=true;setTimeout(()=>showCinematic('victory',{title:'Salle nettoyée',copy:'Le butin est tombé. Le silence aussi. Personne ne fait confiance au silence.'}),180)}}});
  $$('[data-open-creature]',host).forEach(b=>b.onclick=()=>{selectedCreature=b.dataset.openCreature;mobileDetailOpen=true;renderCreature();openCodex('creatures')});
}
function initGenerator(){$('.enc-mode').forEach(b=>b.onclick=()=>{$('.enc-mode').forEach(x=>x.classList.remove('active'));b.classList.add('active')});$('#generate').onclick=()=>{encounter={rainette:2,trixie:1};encounterVictoryShown=false;$('#generator')?.classList.add('generated');renderEncounter();showToast('Rencontre générée localement')};renderEncounter()}

function initBrouhaha(){
  const update=()=>{
    const state=bhLevel>=10?'Critique':bhLevel>=7?'Élevé':bhLevel>=4?'Agité':'Calme';
    const tier=bhLevel>=10?'critical':bhLevel>=7?'high':bhLevel>=4?'mid':'low';
    const pct=(bhLevel/12*100).toFixed(2)+'%';
    $('#bh-level').textContent=bhLevel;
    $('#bh-meter').value=bhLevel;
    $('#bh-state').textContent=state;
    const dial=$('#bh-dial');
    dial?.style.setProperty('--level',bhLevel);
    dial?.style.setProperty('--bh-pct',pct);
    const page=$('#brouhaha');
    if(page){page.dataset.chaos=tier;page.style.setProperty('--bh-pct',pct)}
  };
  $('#bh-minus').onclick=()=>{bhLevel=Math.max(0,bhLevel-1);update()};
  $('#bh-plus').onclick=()=>{bhLevel=Math.min(12,bhLevel+1);update()};
  $('#bh-meter').oninput=e=>{bhLevel=Number(e.target.value);update()};
  $('#bh-draw').onclick=()=>{
    const effects=['Une table se renverse au pire endroit.','Les clients chantent faux et couvrent les ordres.','Une chope traverse la salle sans propriétaire apparent.','Le sol devient glissant près du comptoir.'];
    const effect=effects[Math.floor(Math.random()*effects.length)];
    $('#bh-current').textContent=effect;
    const card=$('#bh-event-card');card?.classList.remove('event-pop');requestAnimationFrame(()=>card?.classList.add('event-pop'));
    $('#bh-history').insertAdjacentHTML('afterbegin',`<div class="history-item"><span class="ticket-hole"></span><b>Niveau ${bhLevel}</b><div>${effect}</div></div>`)
  };
  $('#bh-reset').onclick=()=>openConfirm('Réinitialiser le Brouhaha ?','Le niveau et l’historique de session seront remis à zéro. Le Codex ne sera pas modifié.',()=>{bhLevel=0;update();$('#bh-history').innerHTML='';$('#bh-current').textContent='Aucun effet tiré.'});
  update();
}
function renderQuest(){const q=sessionQuests[questIndex];const card=$('#session-quest');card.innerHTML=`<h2>${q.name}</h2><div class="quest-giver-live">${emblem('Icone_Entite_PNJ.webp','section-logo')}<span><small>Commanditaire</small><b>${q.npc}</b></span></div><div class="row wrap"><span class="chip neutral">${q.difficulty}</span></div><p>${q.desc}</p><div class="quest-grid"><div class="objective objective-hero"><b>Objectif</b><div>${q.objective}</div></div><div class="objective"><b>Récompense</b><div class="small">${q.reward}</div></div></div>`;card.classList.remove('quest-flip');requestAnimationFrame(()=>card.classList.add('quest-flip'))}
function initQuests(){renderQuest();$('#reroll-quest').onclick=()=>{questIndex=(questIndex+1)%sessionQuests.length;renderQuest();showToast('Nouvelle quête tirée sans confirmation')};$('#quest-codex').onclick=()=>openCodex('quests')}

const atelierTypes={
  creatures:{label:'Créatures',singular:'Créature',items:['Rainette Voltigeuse','Gobeline Turbo-Coude','Videur du Cellier','Maître du Comptoir','Démon de la Réserve','Gundrade la Tenace']},
  dungeons:{label:'Donjons',singular:'Donjon',items:['Le Château de Bastognac','Le Cabaret des Joyeuses','Les Marécages Infectés']},
  heroes:{label:'Héros',singular:'Héros',items:['Brünhilda la Torgnole','Gundrade la Tenace']},
  npcs:{label:'PNJ',singular:'PNJ',items:['Veloria Triplemousse','Mirette la Serveuse','Le Conservateur']},
  quests:{label:'Quêtes',singular:'Quête',items:['Le tonneau qui savait trop','Concours officiel de lancer de caillou','La machine à bière automatique']},
  loot:{label:'Loot',singular:'Objet de loot',items:['Sac de vis rouillées','Ressort mystérieux','Caillou bien équilibré','Touffe de poils magiques']},
  interactables:{label:'Objets interactifs',singular:'Objet interactif',items:['Levier suspect','Tonneau bavard','Soupape de cuve']},
  brouhaha:{label:'Brouhaha',singular:'Palier de Brouhaha',items:['Niveau 1 · Calme','Niveau 4 · Agité','Niveau 7 · Élevé','Niveau 12 · Critique']}
};
let atelierCurrentType='creatures';

function atelierFormMarkup(type,name){
  const q=v=>String(v||'').replace(/"/g,'&quot;');
  if(type==='creatures')return '<div class="form-section"><div class="eyebrow">Identité</div><div class="form-grid" style="margin-top:12px"><label class="field-label">Nom<input class="field" value="'+q(name)+'"></label><label class="field-label">Catégorie<select class="field"><option>Spéciale</option><option>Basique</option><option>Tactique</option><option>Brute</option><option>Mini-boss</option><option>Boss</option></select></label><label class="field-label">Donjon<select class="field"><option>Les Marécages Infectés</option></select></label><label class="field-label">Menace<input class="field" value="2"></label></div></div><div class="form-section"><div class="eyebrow">Gameplay</div><div class="form-grid" style="margin-top:12px"><label class="field-label">PV<input class="field" value="7"></label><label class="field-label">ATK<input class="field" value="3"></label><label class="field-label">DEF<input class="field" value="2"></label><label class="field-label">Actions<input class="field" value="2"></label></div></div><div class="form-section"><div class="eyebrow">Capacité & IA</div><label class="field-label" style="margin-top:12px">Capacité<textarea class="field">Bond électrique</textarea></label><label class="field-label" style="margin-top:12px">Comportement<textarea class="field">Harcele les flancs et cherche les cases libres.</textarea></label></div>';
  if(type==='dungeons')return '<div class="form-section"><div class="eyebrow">Donjon</div><div class="form-grid" style="margin-top:12px"><label class="field-label">Nom<input class="field" value="'+q(name)+'"></label><label class="field-label">Numéro<input class="field" value="1"></label><label class="field-label">Boss final<input class="field" value="Non renseigné"></label><label class="field-label">Nombre d’étages<input class="field" value="5"></label></div><label class="field-label" style="margin-top:12px">Description<textarea class="field">Description du donjon.</textarea></label></div>';
  if(type==='heroes')return '<div class="form-section"><div class="eyebrow">Héros</div><div class="form-grid" style="margin-top:12px"><label class="field-label">Nom<input class="field" value="'+q(name)+'"></label><label class="field-label">Classe<input class="field" value="Tank"></label><label class="field-label">Niveau<input class="field" value="1"></label><label class="field-label">Brouhaha<input class="field" value="0"></label></div><label class="field-label" style="margin-top:12px">Compétence<textarea class="field">Compétence du niveau sélectionné.</textarea></label></div>';
  if(type==='npcs')return '<div class="form-section"><div class="eyebrow">PNJ</div><div class="form-grid" style="margin-top:12px"><label class="field-label">Nom<input class="field" value="'+q(name)+'"></label><label class="field-label">Rôle<input class="field" value=""></label><label class="field-label">Race<input class="field" value=""></label><label class="field-label">Ton<input class="field" value=""></label></div><label class="field-label" style="margin-top:12px">Lore<textarea class="field"></textarea></label></div>';
  if(type==='quests')return '<div class="form-section"><div class="eyebrow">Quête</div><div class="form-grid" style="margin-top:12px"><label class="field-label">Nom<input class="field" value="'+q(name)+'"></label><label class="field-label">Difficulté<select class="field"><option>Moyenne</option><option>Très facile</option><option>Facile</option><option>Normale</option><option>Difficile</option></select></label><label class="field-label">Commanditaire<input class="field" value="Mirette la Serveuse"></label><label class="field-label">Donjon<input class="field" value="Le Cabaret des Joyeuses"></label></div><label class="field-label" style="margin-top:12px">Objectif<textarea class="field"></textarea></label></div>';
  if(type==='loot')return '<div class="form-section"><div class="eyebrow">Loot</div><div class="form-grid" style="margin-top:12px"><label class="field-label">Nom<input class="field" value="'+q(name)+'"></label><label class="field-label">Rareté<select class="field"><option>Commun</option><option>Mauvais</option><option>Inhabituel</option><option>Rare</option><option>Légendaire</option></select></label><label class="field-label">Valeur<input class="field" value="1"></label><label class="field-label">Source<input class="field" value=""></label></div></div>';
  if(type==='interactables')return '<div class="form-section"><div class="eyebrow">Objet interactif</div><div class="form-grid" style="margin-top:12px"><label class="field-label">Nom<input class="field" value="'+q(name)+'"></label><label class="field-label">Donjon<input class="field" value=""></label></div><label class="field-label" style="margin-top:12px">Actions<textarea class="field">Examiner, actionner</textarea></label><label class="field-label" style="margin-top:12px">Effet<textarea class="field"></textarea></label></div>';
  return '<div class="form-section"><div class="eyebrow">Brouhaha</div><div class="form-grid" style="margin-top:12px"><label class="field-label">Palier<input class="field" value="'+q(name)+'"></label><label class="field-label">Niveau<input class="field" value="7"></label></div><label class="field-label" style="margin-top:12px">Effet<textarea class="field">Une table se renverse au pire endroit.</textarea></label></div>';
}

function bindAtelierInputs(){
  $$('#atelier-form input,#atelier-form select,#atelier-form textarea').forEach(el=>el.addEventListener('input',()=>setDirty(true)));
}
function renderAtelier(type=atelierCurrentType,selectedName){
  atelierCurrentType=type;
  const meta=atelierTypes[type];
  const chosen=selectedName||meta.items[0];
  $$('.atelier-type-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.atelierType===type));
  $('#atelier-kind').textContent=meta.singular;
  $('#atelier-selected').textContent=chosen;
  $('#atelier-new').textContent='+ Nouveau '+meta.singular.toLowerCase();
  $('#delete-entity').textContent='Supprimer '+meta.singular.toLowerCase();
  $('#atelier-list').innerHTML=meta.items.map((name,i)=>'<button class="'+(name===chosen?'active':'')+'" data-atelier-item="'+i+'">'+name+'</button>').join('');
  $('#atelier-form').innerHTML=atelierFormMarkup(type,chosen);
  $$('[data-atelier-item]').forEach(b=>b.onclick=()=>renderAtelier(type,meta.items[Number(b.dataset.atelierItem)]));
  bindAtelierInputs();
  setDirty(false);
}
function setDirty(v){dirty=v;$('#dirty-state')?.classList.toggle('hidden',!v)}
function saveEntity(after){setDirty(false);showToast('Enregistrement local confirmé · synchronisation distante lancée');after?.()}
function initAtelier(){
  renderAtelier('creatures');
  $$('.atelier-type-tabs button').forEach(b=>b.onclick=()=>renderAtelier(b.dataset.atelierType));
  $('#atelier-new').onclick=()=>{const meta=atelierTypes[atelierCurrentType];renderAtelier(atelierCurrentType,'Nouvel élément');setDirty(true);showToast('Nouvelle fiche '+meta.singular.toLowerCase())};
  $('#save-entity').onclick=()=>saveEntity();
  $('#delete-entity').onclick=()=>{const meta=atelierTypes[atelierCurrentType],name=$('#atelier-selected').textContent;openConfirm('Supprimer '+name+' ?','Action destructive volontaire. Les impacts connus seraient listés avant confirmation.',()=>showToast('Démonstration : aucune donnée réellement supprimée'),'Supprimer')};
}

function openUnsaved(target){
  const modal=$('#confirm-modal'),ok=$('#confirm-ok');$('#confirm-title').textContent='Modifications non enregistrées';$('#confirm-copy').textContent='Choisissez Rester, Quitter sans enregistrer ou Enregistrer avant de quitter.';ok.textContent='Quitter sans enregistrer';
  let save=$('#confirm-save');if(!save){save=document.createElement('button');save.id='confirm-save';save.className='btn primary';save.textContent='Enregistrer';ok.before(save)}save.classList.remove('hidden');
  modal.classList.add('open');ok.onclick=()=>{save.classList.add('hidden');closeOverlay('#confirm-modal');dirty=false;setDirty(false);show(target)};save.onclick=()=>{save.classList.add('hidden');closeOverlay('#confirm-modal');saveEntity(()=>show(target))};
}

function initMedia(){
  $$('.media-filter').forEach(b=>b.onclick=()=>{$$('.media-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.mediaFilter;$$('.media-card').forEach(c=>c.classList.toggle('hidden',f!=='all'&&!c.dataset.state.includes(f)))});
  $$('.media-card').forEach(c=>c.onclick=()=>{$('#media-detail-title').textContent=c.dataset.title;$('#media-detail-status').textContent=c.dataset.status;$('#media-detail-image').src=c.querySelector('img').src;$('#media-detail-panel').classList.remove('hidden');$('#media-detail-panel').scrollIntoView({behavior:'smooth'})});
  $('#download-original').onclick=()=>showToast('Téléchargement de l’original, puis contrôle d’intégrité');
  $('#remove-local').onclick=()=>openConfirm('Retirer de cet appareil ?','Disponible seulement si une copie distante saine et vérifiée existe. Le rattachement métier est conservé.',()=>showToast('Le média deviendrait remote_only'));
  $('#delete-media').onclick=()=>openConfirm('Supprimer définitivement le média ?','Suppression forte, distincte de Retirer de cet appareil. Présence locale et distante affichées avant confirmation.',()=>showToast('Démonstration : aucune suppression réelle'));
}
function initImport(){$('#preview-import').onclick=()=>{$('#import-preview').classList.remove('hidden');$('#confirm-import').disabled=false;showToast('Preview calculée, aucune écriture effectuée')};$('#confirm-import').onclick=()=>showToast('12 lignes importables seraient écrites. 2 erreurs resteraient exclues.')}

function openImage(src,alt){$('#image-modal-img').src=src;$('#image-modal-img').alt=alt;$('#image-modal').classList.add('open')}
function closeOverlay(sel){$(sel)?.classList.remove('open')}
function openConfirm(title,copy,onConfirm,confirmLabel='Confirmer'){
  const extra=$('#confirm-save');extra?.classList.add('hidden');$('#confirm-title').textContent=title;$('#confirm-copy').textContent=copy;$('#confirm-ok').textContent=confirmLabel;$('#confirm-modal').classList.add('open');$('#confirm-ok').onclick=()=>{closeOverlay('#confirm-modal');onConfirm?.()};
}
function initOverlays(){
  $$('[data-close]').forEach(b=>b.onclick=()=>closeOverlay(b.dataset.close));
  $$('.drawer-backdrop,.modal-backdrop').forEach(b=>b.addEventListener('click',e=>{if(e.target===b)b.classList.remove('open')}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')$$('.drawer-backdrop.open,.modal-backdrop.open').forEach(x=>x.classList.remove('open'));if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#search-modal').classList.add('open');setTimeout(()=>$('#global-search-input').focus(),0)}});
  $('#open-search').onclick=()=>{$('#search-modal').classList.add('open');setTimeout(()=>$('#global-search-input').focus(),0)};$('#open-sync').onclick=()=>$('#sync-drawer').classList.add('open');
}
function initSearch(){
  const input=$('#global-search-input');input.oninput=()=>{const q=input.value.trim().toLowerCase(),results=creatures.filter(c=>!q||c.name.toLowerCase().includes(q)||c.dungeon.toLowerCase().includes(q)).slice(0,5);$('#search-results').innerHTML=results.map(c=>`<button class="related-card" data-search-creature="${c.id}"><b>${c.name}</b><div class="small muted">Créature · ${c.dungeon}</div></button>`).join('')+`<button class="related-card" data-search-codex="dungeons"><b>Le Cabaret des Joyeuses</b><div class="small muted">Donjon</div></button>`;$$('[data-search-creature]').forEach(b=>b.onclick=()=>{selectedCreature=b.dataset.searchCreature;mobileDetailOpen=true;closeOverlay('#search-modal');renderCreature();openCodex('creatures')});$$('[data-search-codex]').forEach(b=>b.onclick=()=>{closeOverlay('#search-modal');openCodex(b.dataset.searchCodex)})};input.dispatchEvent(new Event('input'));
}
function initMockup(){$$('.mockup-nav button').forEach(b=>b.onclick=()=>$(b.dataset.jump)?.scrollIntoView({behavior:'smooth',block:'start'}));$('#pwa-install-demo')?.addEventListener('click',()=>showToast('iOS : Partager → Ajouter à l’écran d’accueil · autres plateformes : invitation d’installation si disponible'))}

function init(){injectCreatureStageStyles();initNav();initCodex();renderCodexType('creatures');initGenerator();initBrouhaha();initQuests();initAtelier();initMedia();initImport();initOverlays();initSearch();initMockup();prepareCreatureImages()}
document.addEventListener('DOMContentLoaded',init);
