import { applyCartography } from "./map-v2-cartography.js";
const MAPS = {
  entrevers: { title: "L’Entrevers", image: "assets/maps/Entrevers - Le n’importe quoi primordiale.webp", type: "hub", parent: null, toponyms: [] },
  ardera: { title: "Ardéra", image: "assets/maps/Ardera.webp", type: "world", parent: "entrevers", toponyms: [
    ["Océan des Longs Silences","water"],["Océan d’Outrebrume","water"],["Océan des Mille Voiles","water"],["Océan Austral","water"],
    ["Mer Boréale","water"],["Mer des Trois Couronnes","water"],["Mer des Éclats","water"],["Mer des Lanternes","water"],["Mer aux Cent Passes","water"]
  ] },
  austrebrume: { title:"Austrébrume", image:"assets/maps/Austrebrume.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Fjords de Nacrelune"],["Les Bois des Dernières Feuilles"],["Les Monts du Voile"],["Le Bassin des Lacs Sombres"],["Les Landes du Grand Hiver"],["La Couronne Blanche"],["Cascades de Brume","secondary"],["Falaises de Nacrelune","secondary"],["Plateaux du Dernier Vent","secondary"]
  ] },
  boreclat: { title:"Boréclat", image:"assets/maps/Boreclat.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Fjords des Brisants"],["La Grande Taïga"],["Les Crêtes du Haut-Givre"],["Aiguilles Boréales","secondary"],["Le Plateau des Blancs Silences"],["Le Pays des Sept Lacs"],["Les Marches d’Écume"]
  ] },
  ferrecime: { title:"Ferrécime", image:"assets/maps/Ferrecime.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Portes du Givre"],["L’Échine d’Ardéra"],["Les Hauts Plateaux de Silex"],["Les Vallées des Mille Cascades"],["Les Hautes Voûtes"],["Cimes Suspendues","secondary"],["Les Marches de Braise"]
  ] },
  pelagreve: { title:"Pélagrève", image:"assets/maps/Pelagreve.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Côtes des Éclats"],["Les Mers Encloses"],["La Dorsale des Fournaises"],["Le Labyrinthe Corallien","secondary"],["Les Côtes des Alizés"],["La Ceinture des Lagons"],["Les Marches des Marées"]
  ] },
  sahaldune: { title:"Sahaldune", image:"assets/maps/Sahaldune.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Côtes d’Ambre"],["Les Monts Fendus"],["La Grande Dépression"],["La Couronne de Sel","secondary"],["Les Vallées des Deux Fleuves"],["Les Savanes d’Olvara"],["Le Littoral des Moussons"]
  ] },
  sylvaronde: { title:"Sylvaronde", image:"assets/maps/Sylvaronde.webp", type:"continent", parent:"ardera", toponyms:[
    ["Le Delta des Mille Bras"],["Le Bassin des Grandes Eaux"],["La Forêt des Hautes Couronnes"],["La Canopée-Monde","secondary"],["Les Monts des Orages"],["Les Hautes Brumes"],["Les Marches du Sud"]
  ] },
  valdorie: { title:"Valdorie", image:"assets/maps/Valdorie.webp", type:"continent", parent:"ardera", toponyms:[
    ["Les Côtes Grises"],["Les Hautes Marches"],["La Sylve des Anciens"],["Les Plaines de Valdor"],["Les Bassins de l’Est"],["Les Terres de Cendre"],
    ["Arbres-Colosses","secondary"],["Saint-Fût-le-Petit","secondary"],["La Chope Qui Colle","secondary"],["L’Avelorne","water"],["La Rivombre","water"],["Ruisseau des Saules","water"],["Lac d’Ysambre","water"],["Collines de la Vieille Lande","secondary"],["Monts d’Escarbelle","secondary"],["Mer des Trois Couronnes","water"]
  ] },
  brasserie: { title:"La Brasserie Céleste", image:"assets/maps/La Brasserie Céleste.webp", type:"dimension", parent:"entrevers", toponyms:[
    ["Le Grand Cœur Brassicole","major"],["L’Axe des Fermentations","major"],["Les Treilles Hautes","major"],["La Coulée Ambrée","major"],["Les Voûtes du Vieillissement","major"],["La Haute Ivresse","major"],["Le Grand Nid","secondary"],
    ["Les Liaisons Hautes","secondary"],["Les Aqueducs de Mousse","secondary"],["Les Clos du Cône","secondary"],["Les Forges de Cuisson","secondary"],["Les Cuves Hautes","secondary"],["Les Foudres Anciens","secondary"],["La Salle du Goût Dernier","secondary"],["Le Déversoir Joyeux","secondary"],["Le Pont des Mauvaises Humeurs","secondary"]
  ] },
  enfer: { title:"L’Enfer de la Sobriété Éternelle", image:"assets/maps/L’Enfer de la Sobriété Eternelle.webp", type:"dimension", parent:"entrevers", toponyms:[
    ["La Citadelle de la Mesure","major"],["La Tour du Rappel","major"],["Le Canal de la Juste Goutte","major"],["Les Bassins du Miroir Froid","major"],["Le Promontoire des Eaux","major"],["Le Parvis du Monolithe","major"],
    ["Les Cloîtres de l’Équilibre","secondary"],["La Cour des Rangs","secondary"],["Les Halles de Distribution","secondary"],["Le Tribunal de la Mesure","secondary"],["Les Écluses de Purification","secondary"],["Les Galeries de Régulation","secondary"],["Les Portiques du Contrôle","secondary"],["La File de l’Infini","secondary"],["Le Guichet des Dernières Gouttes","secondary"],["Le Banc de la Pause Autorisée","secondary"]
  ] },
  cite_sous_marine: { title:"Cité sous-marine de Pélagrève", image:"assets/maps/Pelagreve_Carte_Cite_Sous_Marine.webp", type:"child", parent:"pelagreve", toponyms:[] }
};
const DUNGEONS = {
  valdorie: [
    ["D01","Le Château Bastognac","Valdorie_D01_Chateau_Bastognac.webp"],
    ["D02","La Forêt en Chantier","Valdorie_D02_Foret_en_Chantier.webp"],
    ["D03","Hôtel Zombifornia","Valdorie_D03_Hotel_Zombifornia.webp"],
    ["D04","Le Cabaret des Joyeuses","Valdorie_D04_Cabaret_des_Joyeuses.webp"],
    ["D05","Le Sanctuaire du Houblon Noir","Valdorie_D05_Sanctuaire_Houblon_Noir.webp"],
    ["D06","Le Panthéon des Fermentations Interdites","Valdorie_D06_Pantheon_Fermentations_Interdites.webp"],
    ["D09","Le Bastion du Sauciflard","Valdorie_D09_Bastion_Sauciflard_Q95.webp"],
    ["D10","Les Thermes de la Bonne Trempette","Valdorie_D10_Thermes_Bonne_Trempette_Q95.webp"],
    ["D11","La Ruche Royale","Valdorie_D11_Ruche_Royale_Q95.webp"]
  ],
  ferrecime:[
    ["D12","Le Monastère des Dénaturées","Ferrecime_D12_Monastere_des_Denaturees.webp"],
    ["D14","La Citadelle des Tonneaux Perchés","Ferrecime_D14_Citadelle_des_Tonneaux_Perches.webp"],
    ["D15","Le Gynécotron du Gnome Tordu","Ferrecime_D15_Gynecotron_du_Gnome_Tordu.webp"]
  ],
  sylvaronde:[
    ["D13","Les Marécages Infectés","Sylvaronde_D13_Marecages_Infectes.webp"]
  ]
};

applyCartography(MAPS, DUNGEONS);
export { MAPS, DUNGEONS };
