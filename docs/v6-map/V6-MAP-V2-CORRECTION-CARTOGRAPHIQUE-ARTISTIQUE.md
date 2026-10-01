# V6-Map V2 — correction cartographique et artistique

Statut au 01/10/2026 : implémentation sur branche dédiée après fusion de la PR #65 ; revue propriétaire encore attendue. Ce document complète les cinq lots, sans relancer le chantier des fonds. Il décrit la séquence de correction et distingue les décisions approuvées des placements proposés.

## Décisions inchangées

- Les douze fonds et treize sprites sont conservés octet pour octet ; aucune génération, retouche ou réoptimisation.
- **Afficher/masquer les donjons est verrouillé**, simple préférence visuelle, sans permission campagne.
- **Éviction à la sortie de la carte est verrouillée** : seul le cache Map dédié est concerné ; aucun changement IndexedDB, Blob, ID métier ou cache général.
- Donjons non ouvrants ; D7/D8 = fragments dimensionnels entiers, sans point intérieur.
- Entrevers sans texte cartographique visible, y compris les anciens boutons nommés sur la fresque. Les noms accessibles et la liste de destinations sont hors peinture.
- Trame supprimée de la navigation. La bulle violette existante reste un décor de l'image validée, pas une destination.
- L'entrée Ardéra sur l'Entrevers correspond au **grand comptoir/taverne ambré** : choix artistique du rendu Entrevers n°4 déjà acté dans les échanges, différent du globe littéral envisagé dans les briefs préparatoires. Aucune nouvelle carte ou cosmologie n'est déduite de cette représentation.

## Séquence de correction et réalisation

| Séquence | Correction | Implémentation / preuve |
|---|---|---|
| 1. Sources et repères | Relire socle, registre, cahiers continentaux, dimensions et concepts de sprites ; confronter chaque contrainte à la peinture réelle | `src/map-v2-data.js` conserve les noms et médias ; `src/map-v2-cartography.js` centralise dimensions, coordonnées et repères. Annexe ci-dessous |
| 2. Navigation | Corriger l'association des scènes Entrevers et des sept continents ; supprimer le clic « destination la plus proche » à 100 px | Polygones SVG locaux, sans cartouche ; zones vides inertes ; clavier Entrée/Espace ; alternative « Destinations accessibles » hors fresque. Cité sous-marine uniquement depuis Pélagrève |
| 3. Toponymie | Supprimer fonds, bordures et boîtes ; réduire le poids et la taille ; replacer régions, merveilles et textes de donjons indépendamment des sprites | Serif classique Georgia/Palatino, graisse 400, hiérarchie discrète, halo de contraste très fin ; unités liées à la largeur réelle du fond ; aucune écriture dans les WebP |
| 4. Sprites | Calibrer individuellement leur emprise et leur pied ; préserver le ratio ; éviter une deuxième implantation de surface pour D6 | Largeur en % du fond et point d'appui u/v propre à chaque sprite ; contour ivoire inférieur à 1 px, pas de glow massif ; D6 en coupe informative **sous la fresque**, même planimétrie que D5 |
| 5. Lecture responsive | Ne pas grossir toute la typographie sur les petites cartes, ni rendre le texte illisible faute de place | Vue d'ensemble ; sur téléphone, noms secondaires et noms de donjons consultables dans « Détails » et l'index externe. Détails agrandit le même DOM dans un cadre défilant borné, sans nouvelle requête d'asset. Tous les noms restent disponibles, aucun nom validé supprimé du catalogue |
| 6. Contrôles et traçabilité | Tester interactions, cache et géométrie, puis revoir les compositions à taille réelle | Tests Map dans Fast ; script reproductible de captures ; workflow Map séparé, sans allonger le job Fast ni comparer des pixels à une maquette |

## Méthode de placement, sans invention

1. Partir du **fichier validé réel**, pas du cadrage prévu dans un prompt. Les formats mesurés ci-dessous priment : Boréclat est 3:2, Pélagrève et les dimensions sont en portrait.
2. Associer une contrainte documentaire à un motif peint reconnaissable : montagne, forêt, remparts, roche littorale, îlot, cuve, statue, canal. Les noms approuvés ne suffisent pas à identifier tous les micro-lieux.
3. Séparer trois données : **contour cliquable**, **ancre géographique du pied**, **ancre de présentation du libellé**. Déplacer le texte ne déplace pas le site.
4. Enregistrer les coordonnées en pourcentage de **toute l'image**, cadre compris, origine en haut à gauche. Aucune projection, distance réelle ni géopoint métier n'est créé.
5. Composer et inspecter le rendu avec les transparences originales, puis mesurer collisions de libellés et débordements aux trois tailles. Une absence de collision géométrique n'est pas une validation artistique automatique.
6. Garder l'ancre **PROPOSITION À ANNOTER**. Identification de Saint-Fût/la Chope, petits sites/salles dimensionnels et proximité fine de D1/D2 restent des déductions de présentation, pas de nouvelles certitudes de lore. Une annotation propriétaire peut les corriger.

La documentation V1 ne sert que d'archive et de source des éléments explicitement conservés par le socle V2. Les anciens XY D7/D8, l'Échine pour D12, les anciens noms de dimensions et la Trame ne sont pas réintroduits. Les secteurs des cahiers V2 spécifiques approuvés priment sur une ancienne réserve générique non synchronisée : D12/Silex, D14/Hautes Voûtes sur roche ordinaire, D15/flanc volcanique semi-enterré. Le registre des donjons est réconcilié avec ces validations existantes.

## Réglage des sprites

Tous les points numériques ci-dessous sont proposés, non canoniques. La largeur est relative au fond ; u/v indiquent le pied dans le canevas du sprite. Le ratio est celui du fichier original, sans hauteur forcée. D6 reste représenté dans une coupe externe, pas avec un deuxième bâtiment adjacent à D5.

| Sprite | Carte | Pied x ; y % | Largeur | Pied u ; v | Justification |
|---|---|---|---|---|---|
| D01 | Valdorie | 40 ; 37 | 4.8 % | 50 ; 93 % | Chope : colline voisine, distincte du côté forêt D02 |
| D02 | Valdorie | 54 ; 34 | 4.8 % | 50 ; 93 % | Chope : lisière boisée, distincte de la colline D01 |
| D03 | Valdorie | 46.5 ; 54 | 2.5 % | 49 ; 97 % | Bâtiment miniature dans les remparts ouest de la grande cité |
| D04 | Valdorie | 51.8 ; 54.5 | 3.5 % | 55 ; 92 % | Autre quartier à l’intérieur des mêmes remparts |
| D05 | Valdorie | 54.5 ; 26 | 4.5 % | 50 ; 94 % | Pied des montagnes au nord de la plaine |
| D06 | Valdorie | 54.5 ; 26 | 4.5 % | 50 ; 94 % | Directement sous D05 ; coupe hors fresque |
| D09 | Valdorie | 86 ; 27 | 5 % | 50 ; 93 % | Forêt profonde à droite, hors du groupe d’arbres géants |
| D10 | Valdorie | 25 ; 33 | 4.8 % | 50 ; 93 % | Roche littorale à l’est du port, pas dans la mer ni dans la ville portuaire |
| D11 | Valdorie | 68 ; 47 | 4.5 % | 50 ; 94 % | Prairie/boisement oriental, hors de la cité |
| D12 | Ferrécime | 27 ; 39 | 5.2 % | 50 ; 94 % | Plateau de Silex occidental, pas sur la chaîne axiale |
| D14 | Ferrécime | 70 ; 55 | 4.6 % | 50 ; 94 % | Plateau rocheux oriental ; aucun ancrage sur une île flottante |
| D15 | Ferrécime | 68 ; 82 | 5.5 % | 50 ; 94 % | Flanc volcanique sud-est, représentation semi-enterrée du sprite validé |
| D13 | Sylvaronde | 10 ; 13 | 5.5 % | 50 ; 94 % | Îlot périphérique du delta, à distance du quai commercial peint |

Sources : [registre](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md), [Valdorie](V6-MAP-V2-VALDORIE-ILLUSTRATIONS-DONJONS.md), [Ferrécime](V6-MAP-V2-FERRECIME-ILLUSTRATIONS-DONJONS.md), [D13](V6-MAP-V2-SYLVARONDE-ILLUSTRATION-D13.md). Le contour suit l'alpha existant ; les aperçus sur fond noir/blanc ne prouvent pas un fond opaque. Aucun masque destructif ou recoloriage n'est appliqué.

## Navigation : motifs retenus

| Fond | Destination | Motif / secteur |
|---|---|---|
| Entrevers | Ardéra | Grande taverne ambrée centrale-gauche |
| Entrevers | Brasserie Céleste | Jardin brassicole cuivre/vert à droite |
| Entrevers | Enfer | Cité grise/glacée en bas à droite |
| Ardéra | Valdorie | Masse forestière et montagneuse au nord-ouest |
| Ardéra | Boréclat | Masse polaire septentrionale |
| Ardéra | Sahaldune | Masse désertique au sud-ouest |
| Ardéra | Sylvaronde | Delta et forêt verticale au sud du centre |
| Ardéra | Ferrécime | Chaîne axiale et volcans au centre-est |
| Ardéra | Pélagrève | Archipel oriental |
| Ardéra | Austrébrume | Masse polaire australe |
| Pélagrève | Cité sous-marine | Secteur de lagons offshore, hors de la masse corallienne ; point proposé 68/63, pas une île ou un portail inventé |

Les contours exacts sont dans `DESTINATIONS` ; ils correspondent à des zones de navigation proposées et non à des frontières canoniques. La désignation « Cité sous-marine de Pélagrève » est descriptive : son nom propre reste réservé. Aucun nom intérieur n'est ajouté.

## Vérification et preuve reproductible

- `npm run test:v6fast:fast` : suite courte existante, avec deux tests Map supplémentaires (contours réels/clavier/zone vide, ancrage indépendant, absence de cartouches, D6, stabilité du DOM, détails mobile et absence de recharge au toggle).
- `node scripts/verify-map-art.mjs` : profil navigateur jetable, serveur local 4175, douze fonds × trois tailles (1440×900, 834×1112, 390×844) × deux modes = **72 captures** dans `map-review-results/`, plus `review.json`. Mesure collisions des libellés réellement affichés, débordement horizontal, décodage des images, erreurs de page et HTTP. Ces résultats ne valident pas les noms/positions canoniques.
- Workflow `V6-Map artistic review` : exécute ce contrôle sur les modifications Map et publie l'artefact `v6-map-art-review` pendant 14 jours. Fast garde son job indépendant.
- Les douze compositions desktop ont été inspectées visuellement ; téléphone/tablette et détails sont contrôlés par captures et mesures, avec inspection ciblée. Ne pas confondre revue visuelle ciblée et inspection humaine exhaustive des 72 images.
- Limite : WebKit local non vérifié, car dépendances système manquantes et installation refusée par l'environnement. Chromium en format tablette **n'est pas** une preuve Safari/iPad réel.
- Le scénario Map mobile porte aussi le tag `@webkit` : il est exécuté par le moteur WebKit dans la CI Full existante, en complément de Chromium Fast. Son résultat CI doit être lu séparément ; même réussi, il ne remplace pas un Safari/iPad physique.

### Revue propriétaire attendue

Bilan local : **26 tests Fast réussis (dont 5 Map)** ; **72 captures produites**, aucun chevauchement de libellés affichés ni débordement horizontal détecté ; aucune erreur de page ou HTTP dans le parcours des captures. Ces contrôles restent distincts de l'approbation artistique et de Safari/iPad réel.

1. Vérifier les trois associations sur Entrevers et les silhouettes cliquables d'Ardéra.
2. Annoter les placements discutables, en priorité Saint-Fût/la Chope, D1/D2, D10 et les petits lieux dimensionnels.
3. Juger l'harmonie de la police, du contraste, des tailles individuelles et du contour sur votre écran.
4. Vérifier toucher/défilement dans Détails sur téléphone et Safari/iPad réel.
5. Confirmer ou corriger les ancres ; le statut Ready du code ne rend pas les coordonnées canoniques.

## Annexe : registre complet des libellés

Les noms ci-dessous sont conservés du catalogue V2 intégré ; leur **statut de nom** est distinct de leur **statut d'ancre**. Le catalogue navigable et les noms de donjons sont référencés dans les tableaux précédents. Les coordonnées sont des ancres de texte, pas des centres de régions ou des positions de sites.

### L’Entrevers

Fond : `assets/maps/Entrevers - Le n’importe quoi primordiale.webp`, 3548 × 1774 px. Source : [cahier](V6-MAP-V2-ENTREVERS.md).

Repère visuel : Taverne Ardéra ; jardin brassicole à droite ; cité froide en bas à droite.

Aucun libellé intérieur : exclusion explicite de toute toponymie sur la fresque.

### Ardéra

Fond : `assets/maps/Ardera.webp`, 4000 × 2000 px. Source : [cahier](V6-MAP-V2-SOCLE-GEOGRAPHIQUE-ARDERA.md).

Repère visuel : Sept silhouettes terrestres de la mappemonde.

| Libellé (nom validé) | Catégorie | x % | y % | Ancre |
|---|---|---:|---:|---|
| Océan des Longs Silences | water | 24 | 7 | Proposition à annoter |
| Océan d’Outrebrume | water | 10 | 23 | Proposition à annoter |
| Océan des Mille Voiles | water | 71 | 21 | Proposition à annoter |
| Océan Austral | water | 78 | 93 | Proposition à annoter |
| Mer Boréale | water | 49 | 28 | Proposition à annoter |
| Mer des Trois Couronnes | water | 37 | 49 | Proposition à annoter |
| Mer des Éclats | water | 72 | 64 | Proposition à annoter |
| Mer des Lanternes | water | 87 | 83 | Proposition à annoter |
| Mer aux Cent Passes | water | 94 | 65 | Proposition à annoter |

### Austrébrume

Fond : `assets/maps/Austrebrume.webp`, 3548 × 1774 px. Source : [cahier](V6-MAP-V2-CONTINENT-AUSTREBRUME.md).

Repère visuel : Fjords ouest, bois nord, montagnes médianes, lacs est, calotte sud.

| Libellé (nom validé) | Catégorie | x % | y % | Ancre |
|---|---|---:|---:|---|
| Les Fjords de Nacrelune | region | 19 | 35 | Proposition à annoter |
| Les Bois des Dernières Feuilles | region | 37 | 30 | Proposition à annoter |
| Les Monts du Voile | region | 49 | 47 | Proposition à annoter |
| Le Bassin des Lacs Sombres | region | 76 | 31 | Proposition à annoter |
| Les Landes du Grand Hiver | region | 68 | 57 | Proposition à annoter |
| La Couronne Blanche | region | 43 | 67 | Proposition à annoter |
| Cascades de Brume | secondary | 57 | 39 | Proposition à annoter |
| Falaises de Nacrelune | secondary | 18 | 44 | Proposition à annoter |
| Plateaux du Dernier Vent | secondary | 70 | 67 | Proposition à annoter |

### Boréclat

Fond : `assets/maps/Boreclat.webp`, 3072 × 2048 px. Source : [cahier](V6-MAP-V2-CONTINENT-BORECLAT.md).

Repère visuel : Plateau polaire nord ; lacs centraux ; fjords sud ; îles orientales.

| Libellé (nom validé) | Catégorie | x % | y % | Ancre |
|---|---|---:|---:|---|
| Les Fjords des Brisants | region | 48 | 73 | Proposition à annoter |
| La Grande Taïga | region | 25 | 49 | Proposition à annoter |
| Les Crêtes du Haut-Givre | region | 52 | 29 | Proposition à annoter |
| Aiguilles Boréales | secondary | 60 | 20 | Proposition à annoter |
| Le Plateau des Blancs Silences | region | 49 | 8 | Proposition à annoter |
| Le Pays des Sept Lacs | region | 51 | 45 | Proposition à annoter |
| Les Marches d’Écume | region | 87 | 54 | Proposition à annoter |

### Ferrécime

Fond : `assets/maps/Ferrecime.webp`, 3072 × 2048 px. Source : [cahier](V6-MAP-V2-CONTINENT-FERRECIME.md).

Repère visuel : Plateaux ochres ouest ; montagne axiale ; îles flottantes ; roches est ; volcans sud-est.

| Libellé (nom validé) | Catégorie | x % | y % | Ancre |
|---|---|---:|---:|---|
| Les Portes du Givre | region | 38 | 10 | Proposition à annoter |
| L’Échine d’Ardéra | region | 43 | 28 | Proposition à annoter |
| Les Hauts Plateaux de Silex | region | 22 | 33 | Proposition à annoter |
| Les Vallées des Mille Cascades | region | 80 | 32 | Proposition à annoter |
| Les Hautes Voûtes | region | 70 | 49 | Proposition à annoter |
| Cimes Suspendues | secondary | 54 | 41 | Proposition à annoter |
| Les Marches de Braise | region | 64 | 90 | Proposition à annoter |

### Pélagrève

Fond : `assets/maps/Pelagreve.webp`, 2048 × 3072 px. Source : [cahier](V6-MAP-V2-CONTINENT-PELAGREVE.md).

Repère visuel : Côtes rocheuses nord-ouest ; mer sombre centrale ; volcan nord-est ; récifs sud-est.

| Libellé (nom validé) | Catégorie | x % | y % | Ancre |
|---|---|---:|---:|---|
| Les Côtes des Éclats | region | 21 | 18 | Proposition à annoter |
| Les Mers Encloses | region | 45 | 28 | Proposition à annoter |
| La Dorsale des Fournaises | region | 79 | 13 | Proposition à annoter |
| Le Labyrinthe Corallien | secondary | 87 | 76 | Proposition à annoter |
| Les Côtes des Alizés | region | 85 | 37 | Proposition à annoter |
| La Ceinture des Lagons | region | 55 | 57 | Proposition à annoter |
| Les Marches des Marées | region | 28 | 69 | Proposition à annoter |

### Sahaldune

Fond : `assets/maps/Sahaldune.webp`, 3072 × 2048 px. Source : [cahier](V6-MAP-V2-CONTINENT-SAHALDUNE.md).

Repère visuel : Côte nord ; montagne ouest ; bassin salin ; deux fleuves nord-est ; savane est.

| Libellé (nom validé) | Catégorie | x % | y % | Ancre |
|---|---|---:|---:|---|
| Les Côtes d’Ambre | region | 42 | 10 | Proposition à annoter |
| Les Monts Fendus | region | 21 | 44 | Proposition à annoter |
| La Grande Dépression | region | 49 | 40 | Proposition à annoter |
| La Couronne de Sel | secondary | 49 | 50 | Proposition à annoter |
| Les Vallées des Deux Fleuves | region | 61 | 22 | Proposition à annoter |
| Les Savanes d’Olvara | region | 82 | 48 | Proposition à annoter |
| Le Littoral des Moussons | region | 56 | 78 | Proposition à annoter |

### Sylvaronde

Fond : `assets/maps/Sylvaronde.webp`, 3072 × 2048 px. Source : [cahier](V6-MAP-V2-CONTINENT-SYLVARONDE.md).

Repère visuel : Delta nord-ouest ; grands arbres nord ; montagne est ; routes méridionales.

| Libellé (nom validé) | Catégorie | x % | y % | Ancre |
|---|---|---:|---:|---|
| Le Delta des Mille Bras | region | 21 | 14 | Proposition à annoter |
| Le Bassin des Grandes Eaux | region | 33 | 52 | Proposition à annoter |
| La Forêt des Hautes Couronnes | region | 54 | 34 | Proposition à annoter |
| La Canopée-Monde | secondary | 47 | 12 | Proposition à annoter |
| Les Monts des Orages | region | 83 | 43 | Proposition à annoter |
| Les Hautes Brumes | region | 78 | 13 | Proposition à annoter |
| Les Marches du Sud | region | 49 | 79 | Proposition à annoter |

### Valdorie

Fond : `assets/maps/Valdorie.webp`, 3072 × 2048 px. Source : [cahier](V6-MAP-V2-CONTINENT-VALDORIE.md).

Repère visuel : Port ouest ; hautes montagnes ; arbres géants nord-est ; cité fortifiée centrale ; bassins est.

| Libellé (nom validé) | Catégorie | x % | y % | Ancre |
|---|---|---:|---:|---|
| Les Côtes Grises | region | 18 | 30 | Proposition à annoter |
| Les Hautes Marches | region | 43 | 13 | Proposition à annoter |
| La Sylve des Anciens | region | 84 | 20 | Proposition à annoter |
| Les Plaines de Valdor | region | 50 | 64 | Proposition à annoter |
| Les Bassins de l’Est | region | 81 | 64 | Proposition à annoter |
| Les Terres de Cendre | region | 28 | 66 | Proposition à annoter |
| Arbres-Colosses | secondary | 68 | 8 | Proposition à annoter |
| Saint-Fût-le-Petit | secondary | 46 | 38 | Proposition à annoter |
| La Chope Qui Colle | secondary | 50 | 34 | Proposition à annoter |
| L’Avelorne | secondary | 60 | 42 | Proposition à annoter |
| La Rivombre | secondary | 30 | 32 | Proposition à annoter |
| Ruisseau des Saules | secondary | 41 | 43 | Proposition à annoter |
| Lac d’Ysambre | secondary | 77 | 60 | Proposition à annoter |
| Collines de la Vieille Lande | secondary | 37 | 46 | Proposition à annoter |
| Monts d’Escarbelle | secondary | 24 | 77 | Proposition à annoter |

### La Brasserie Céleste

Fond : `assets/maps/La Brasserie Céleste.webp`, 2048 × 3072 px. Source : [cahier](V6-MAP-V2-DIMENSION-BRASSERIE-CELESTE.md).

Repère visuel : Treilles en haut ; axe médian ; cuves centrales ; vieux foudres en bas à gauche ; statue et poule à droite.

| Libellé (nom validé) | Catégorie | x % | y % | Ancre |
|---|---|---:|---:|---|
| Le Grand Cœur Brassicole | major | 55 | 57 | Proposition à annoter |
| L’Axe des Fermentations | major | 53 | 28 | Proposition à annoter |
| Les Treilles Hautes | major | 47 | 12 | Proposition à annoter |
| La Coulée Ambrée | major | 22 | 44 | Proposition à annoter |
| Les Voûtes du Vieillissement | major | 22 | 77 | Proposition à annoter |
| La Haute Ivresse | major | 85 | 38 | Proposition à annoter |
| Le Grand Nid | secondary | 86 | 24 | Proposition à annoter |
| Les Liaisons Hautes | secondary | 35 | 20 | Proposition à annoter |
| Les Aqueducs de Mousse | secondary | 69 | 18 | Proposition à annoter |
| Les Clos du Cône | secondary | 40 | 16 | Proposition à annoter |
| Les Forges de Cuisson | secondary | 29 | 63 | Proposition à annoter |
| Les Cuves Hautes | secondary | 53 | 46 | Proposition à annoter |
| Les Foudres Anciens | secondary | 17 | 67 | Proposition à annoter |
| La Salle du Goût Dernier | secondary | 68 | 62 | Proposition à annoter |
| Le Déversoir Joyeux | secondary | 78 | 67 | Proposition à annoter |
| Le Pont des Mauvaises Humeurs | secondary | 53 | 89 | Proposition à annoter |

### L’Enfer de la Sobriété Éternelle

Fond : `assets/maps/L’Enfer de la Sobriété Eternelle.webp`, 2048 × 3072 px. Source : [cahier](V6-MAP-V2-DIMENSION-ENFER-SOBRIETE-ETERNELLE.md).

Repère visuel : Citadelle haute ; canal médian ; bassins à gauche ; colosse à droite (ne pas confondre avec le guichet sous verre).

| Libellé (nom validé) | Catégorie | x % | y % | Ancre |
|---|---|---:|---:|---|
| La Citadelle de la Mesure | major | 72 | 12 | Proposition à annoter |
| La Tour du Rappel | major | 71 | 5 | Proposition à annoter |
| Le Canal de la Juste Goutte | major | 48 | 44 | Proposition à annoter |
| Les Bassins du Miroir Froid | major | 26 | 51 | Proposition à annoter |
| Le Promontoire des Eaux | major | 53 | 59 | Proposition à annoter |
| Le Parvis du Monolithe | major | 91 | 23 | Proposition à annoter |
| Les Cloîtres de l’Équilibre | secondary | 62 | 18 | Proposition à annoter |
| La Cour des Rangs | secondary | 83 | 17 | Proposition à annoter |
| Les Halles de Distribution | secondary | 39 | 32 | Proposition à annoter |
| Le Tribunal de la Mesure | secondary | 61 | 20 | Proposition à annoter |
| Les Écluses de Purification | secondary | 48 | 69 | Proposition à annoter |
| Les Galeries de Régulation | secondary | 80 | 46 | Proposition à annoter |
| Les Portiques du Contrôle | secondary | 29 | 22 | Proposition à annoter |
| La File de l’Infini | secondary | 28 | 83 | Proposition à annoter |
| Le Guichet des Dernières Gouttes | secondary | 82 | 71 | Proposition à annoter |
| Le Banc de la Pause Autorisée | secondary | 44 | 90 | Proposition à annoter |

### Cité sous-marine de Pélagrève

Fond : `assets/maps/Pelagreve_Carte_Cite_Sous_Marine.webp`, 2048 × 3072 px. Source : [cahier](V6-MAP-V2-CONTINENT-PELAGREVE.md).

Repère visuel : Carte enfant ; aucun nom intérieur validé.

Aucun libellé intérieur : aucun nom intérieur validé ; aucune invention.
