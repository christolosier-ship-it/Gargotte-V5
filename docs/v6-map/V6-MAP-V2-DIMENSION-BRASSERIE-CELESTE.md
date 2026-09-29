# V6-Map V2 — Dimension / donjon D7 : La Brasserie Céleste

**STATUT : PITCH, QUINZE ARBITRAGES, COMPOSITION GÉNÉRALE HYBRIDE D, SEPT REPÈRES MONUMENTAUX, SEIZE TOPONYMES, CARACTÈRE INFINI DE LA DIMENSION ET SIX ARBITRAGES DE PLACEMENT RELATIF ET CATALOGUE DE 36 GARGOTTERIES VALIDÉS PAR LE PROPRIÉTAIRE LE 29/09/2026 ; PLACEMENT VISUEL DÉFINITIF, IMAGE NATIVE, RENDU FINAL ET IMPLÉMENTATION NON RÉALISÉS.** Fiche de conception artistique et cartographique seulement. Une décision sur une image ne crée pas de donnée métier, de coordonnées, de carte physique praticable ou de règle de visibilité.

Références : `AGENTS.md`, [cadrage V2 commun](V6-MAP-V2-SIX-CONTINENTS-CADRAGE.md), [pivot V2](V6-MAP-PIVOT-V2-FEUILLE-DE-ROUTE.md), [registre V2 des donjons](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md), [Entrevers](V6-MAP-V2-ENTREVERS.md). Sources d'inspiration visuelles inspectées en lecture seule sur Google Drive : `Projet Gargotte / Donjon 7 - La Brasserie Céleste` (y compris `Ordre du Houblon Pur` et `Culte de la Fermentation Sacrée`) ; `Projet Gargotte / Archive / Brasserie`, `Brasserie 2` et `Brasserie 3`. Les images d'archives sont des références de style, **pas des positions ou des salles cartographiques déjà approuvées**. Les deux classeurs historiques de `Brasserie 2` ne sont pas déclarés vérifiés pour le présent arbitrage artistique.

## 1. Pitch narratif directement validé

La Brasserie Céleste est un **plan divin infini habité par les anges brassicoles**. La carte 2:3 n'en représente **qu'un fragment**, sans prétendre cadrer l'ensemble de ce monde ni en figer un bord cosmologique. Après un temps infini passé à brasser et à espérer créer **la bière parfaite**, deux ordres religieux se sont formés et sont **en guerre** :

- **Ordre du Houblon Pur** : la perfection vient de la matière première, de la **culture**, de la pureté et qualité du **houblon**, de sa sélection et de la **récolte**.
- **Ordre de la Fermentation Sacrée** : la perfection vient de la **qualité de transformation**, de la fermentation, de l'élevage, des **cuves** et **tonneaux**.

**Précision explicite VALIDÉE : les anges brassicoles sont exclusivement FÉMININS.** Cette règle concerne les anges brassicoles, sans transformer automatiquement tout le bestiaire D7 en personnages féminins ni introduire de nouvelles espèces. Population choisie : **uniquement les anges brassicoles et les créatures déjà présentes au bestiaire D7** ; consulter les fiches métier réelles avant d'ajouter une silhouette ou de présenter une entité d'archive comme canon actif.

**Règle spatiale fondamentale : les deux ordres ne possèdent PAS chacun une moitié de la carte.** Leur guerre traverse le même plan divin, et leurs ouvrages s'entremêlent gracieusement partout. Ne dessiner **aucune frontière, division Est/Ouest, vaste territoire factionnel exclusif, zone militaire ou ligne de front structurante**. Les divergences doctrinales se lisent dans le personnel, les équipements, emblèmes, rituels et détails de confrontation locale au milieu d'une architecture commune.

## 2. Spécificité de D7 : coïncidence d'étendue, sans second point

**CHOIX 14.A VALIDÉ ET PRÉCISÉ LE 29/09 : toute la portion de La Brasserie Céleste REPRESENTÉE SUR LA CARTE appartient au donjon D7 ; la dimension elle-même est INFINIE et le cadre peint n'en montre qu'une PARTIE.** Aucun petit donjon D7 distinct n'est localisé dans ce fragment ; **aucun marqueur supplémentaire D7, aucune pastille de placement et aucune seconde illustration d'un bâtiment censé représenter à lui seul D7**. L'entrée depuis le hub Entrevers ouvre cette **vue-fragment**, et non une représentation exhaustive de toute la dimension. Ne pas inférer la frontière, l'étendue finie ni la cartographie de D7 au-delà du fragment montré.

Conserver néanmoins en conception l'**identité de vue/dimension** et l'**identité métier du donjon D7** comme objets distincts (pour les données du Codex et la rétrocompatibilité) : leur **emprise représentée coïncide sur le fragment peint seulement** : cette coïncidence d'affichage ne signifie ni que la dimension a une étendue finie, ni que les limites de D7 hors champ sont connues. Ne pas supprimer automatiquement `placement:d07` ni renommer les `map_id` historiques dans le runtime par ce document. L'ancien repère V1 « D7 dans les Terrasses des Brasseurs, point indicatif 74/57 » est **SUPPLANTÉ pour la V2** : aucun géopoint local à résoudre pour D7. Réviser explicitement le registre central au moment de l'intégration des documents V2 issus de PR #59, **sans fabriquer une seconde implantation sur la branche documentaire non synchronisée**. Les règles d'autorisation/fiches Codex restent à spécifier avant intégration, sans supposer que consultation publique équivaut à découverte du donjon.

Les anciennes subdivisions V1 « Les Hauts Plateaux », « La Mer des Nuages », « Les Jardins Suspendus », « Les Terrasses des Brasseurs » et leurs X/Y provisoires sont **ABANDONNÉES COMME DÉCOUPAGE CARTOGRAPHIQUE V2 (choix 15.C)**. Elles sont à conserver seulement comme *historique daté* dans les anciens documents, pas comme noms, polygones, coordonnées ni régions opérationnelles à placer. **Nouvelle toponymie V2 : seize appellations VALIDÉES le 29/09/2026**, inventoriées à la section 5, sans reconduire les anciennes régions V1. Les noms ne déterminent ni polygone, ni coordonnées, ni autorisation de consultation.

## 3. Les quinze arbitrages validés

| # | Choix | Consigne artistique opérationnelle |
|---|---|---|
| 01 | **C — portrait 2:3** | Composition verticale de travail pour la carte ; vérifier que le moteur produit ce rapport avec pixels réellement natifs, sans prétendre à une résolution prédéfinie. |
| 02 | **B — constructions flottantes enchevêtrées** | Multitude de constructions monumentales, reliées et superposées, formant un ensemble gracieux et continu, sans faire deux royaumes. |
| 03 | **B — vue isométrique fantasy** | Lecture claire des volumes et terrasses à différents niveaux ; conserver l'étrangeté divine sans sacrifier la lisibilité cartographique. |
| 04 | **A — nuages porteurs** | Les nuages constituent le support principal, non de nouvelles masses continentales rocheuses par défaut. |
| 05 | **C — échelles mixtes** | Équipements à taille praticable et installations titanesques cohabitent, cuves/colonnes/tonneaux monumentaux parmi les constructions ordinaires. |
| 06 | **B — cultures abondantes** | Vastes plantations de houblon traversant **toute** la dimension ; elles côtoient partout bâtiments et machines, plutôt que décorer un seul jardin isolé. |
| 07 | **B — hydrologie brassicole démesurée** | Torrents ambrés, chutes de bière, débordements de mousse, bassins ou océans mousseux : grands motifs structurants et non détails ponctuels. |
| 08 | **C — guerre spectaculaire et absurde** | Affrontements divins locaux, jets de bière sous pression, canons à mousse, tonneaux détournés, chahut jusque dans les jardins. Pas de frontière militaire. |
| 09 | **B — deux langages mêlés** | Anges, équipements, symboles et détails décoratifs permettent de lire les deux ordres au sein de **chaque environnement**, sans aplats territoriaux. |
| 10 | **C — équipements communs et détournés** | Héritage brassicole commun, nouvelles constructions par doctrine et installations parfois réaffectées au gré de la rivalité. |
| 11 | **A + précision : exclusivement féminin pour les anges brassicoles** | Population : anges brassicoles exclusivement féminins et créatures du bestiaire D7 réellement confirmées. Pas de figurants d'espèce inventée. |
| 12 | **C — 30 à 40 gargotteries** | Scènes de vie et gags disséminés dans toute la peinture, sans rendre invisibles les formes principales de la carte. |
| 13 | **A+B+C+D ensemble** | Blanc/ivoire/or/turquoise et vert lumineux, ambre/cuivre chaud et crépuscules rosés, détails chromatiques locaux, majesté sacrée contredite par un humour loufoque. Pas une seule dominante uniforme obligatoire. |
| 14 | **A — D7 couvre toute la carte** | **La totalité du fragment peint appartient à D7**, pas la dimension infinie intégralement reproduite ; aucun marqueur géographique D7 intérieur supplémentaire. |
| 15 | **C — refaire la toponymie** | Ne pas reconduire les quatre zones historiques V1 ni leurs coordonnées ; les noms et lieux nouveaux sont à arbitrer séparément. |

## 4. Composition artistique d'ensemble, sans géopoints inventés

**Intention :** panorama vertical isométrique d'un monde-ateliers céleste, aérien, foisonnant et théâtral. Des cathédrales brassicoles, tours de distillation, cuves, forges et tonneaux gigantesques émergent d'épais nuages porteurs ; des terrasses agricoles suspendues, champs de houblon, passerelles et jardins prolifèrent **entre** les ouvrages et à différents étages. Les écoulements de bière et de mousse descendent, jaillissent et relient visuellement les hauteurs en cascades démesurées. Ciel et lumière divins, détails de production, humour gargottien.

**Fusion des doctrines :** une plateforme de récolte jouxte une cuve ; une colonne de transformation traverse plusieurs terrasses de cultures ; les mêmes passerelles transportent ingrédients, tonneaux et anges des deux ordres. Utiliser les références visuelles de l'Ordre du Houblon Pur pour les plantes, le geste de récolte et les costumes, celles de la Fermentation Sacrée pour la machinerie, les cuves et les outils, **sans faire correspondre chacun à une zone géographique exclusive**.

**Conflit partout mais hiérarchie lisible :** saynètes de sabotages et duels burlesques, petits groupes en désaccord, appareils récupérés, mousse projectile. L'univers reste beau et majestueux malgré la guerre : pas de carte de tranchées, pas de destructions généralisées qui effaceraient l'architecture ou la production. Les gags proposés sont motifs de décor **non canoniques individuellement** tant que des scènes précises n'ont pas été approuvées.

**Règle de cadrage VALIDÉE : le monde représenté est un prélèvement visuel d'une dimension divine infinie.** Aucune silhouette fermée de royaume/continent/île représentant la totalité du plan ; les treilles, ponts, canalisations, bâtiments, masses nuageuses, niveaux architecturaux et écoulements doivent suggérer une continuité au-delà des quatre côtés de l'image. Certaines formes peuvent être volontairement coupées par le cadre comme en photographie d'un site immense ; conserver néanmoins une lecture cohérente du fragment et des monuments approuvés. Le ciel et les nuages ne sont pas une barrière du monde. Pas d'horizon terminal, de mur périphérique, de limite d'exploration ou de portail inventé pour justifier les bords de l'illustration.

**Composition de travail VALIDÉE (option D) :** hybride d'un archipel céleste de nombreuses constructions flottantes reliées et d'une cathédrale/mégastructure monumentale : plusieurs édifices titanesques structurent une constellation organique de plateformes, terrasses et jardins, avec une ascension visuelle souple et non une spirale mécanique imposée. Hautes silhouettes dans l'axe vertical, étagement de niveaux à lecture isométrique, respirations de nuages pour séparer les grandes formes, entremêlement dense et maîtrisé de vert végétal et métal cuivré, cascades et nappes mousseuses pour guider le regard. Pas de secteur réservé politiquement à un ordre ; aucun géopoint ni chemin de mission annoncé sans décision ultérieure.

## 5. Sept repères structurants et seize toponymes VALIDÉS

Le propriétaire a retenu le **29/09/2026** la composition générale **D (hybride)** et les **sept repères visuels** ci-dessous, après les quinze arbitrages initiaux. Ils doivent **s'entremêler** au sein d'une seule dimension, sans limites, quartiers factionnels exclusifs ni séparation militaire. Les intitulés de ce catalogue ont ensuite été **tous validés sans correction** par « Je prends toutes tes recommandations ». Les six premiers repères monumentaux et l'ensemble de circulation constituent la charpente, non un ordre vertical ni une localisation chiffrée.

### 5.1 Architecture et repères monumentaux

| Repère conceptuel | Choix visuel validé | Toponyme VALIDÉ |
|---|---|---|
| Cœur général | **C** : fusion d'une cuve céleste colossale, d'un sanctuaire et d'une distillerie | **Le Grand Cœur Brassicole** |
| Jardins suspendus | **C** : cultures ordonnées et houblon en lianes envahissantes | **Les Treilles Hautes** |
| Distillation verticale | **C** : immense colonne principale et appendices | **L'Axe des Fermentations** |
| Hydrologie | **C** : rivière aérienne impossible, avec grandes cascades de bière | **La Coulée Ambrée** |
| Ensemble de fermentation | **C** : cuves et tonneaux intégrés à l'architecture sacrée | **Les Voûtes du Vieillissement** |
| Circulations | **B+C** : passerelles, tuyaux, rails à tonneaux, escaliers célestes et aqueducs brassicoles | Plusieurs appellations secondaires, ci-dessous |
| Monument iconique Gargotte | **Statue monumentale d'une brassicole divine ivre ; poule géante perchée sur sa tête, tenant une chope disproportionnée** | **La Haute Ivresse** ; **Le Grand Nid** comme repère associé à la poule |

La « poule géante » de ce monument découle du brief utilisateur. **Ne pas l'identifier automatiquement à un personnage précis du bestiaire actif nommé « Poule Divine »** sur le seul fondement d'une archive illustrée ; l'identité métier reste à vérifier.

### 5.2 Catalogue unique des seize appellations

Les noms suivants sont des **repères, installations et micro-lieux d'une seule carte**, pas des territoires distincts. Aucun ne reçoit ici de coordonnées, de géométrie, de régime de secret ni de propriétaire factionnel ; les rapprochements fonctionnels indiquent un motif artistique général, non une géographie fixée.

| N° | Niveau de lecture | Nom VALIDÉ | Référence visuelle ou fonction narrative non localisée |
|---:|---|---|---|
| 01 | Majeur | **Le Grand Cœur Brassicole** | Cuve, sanctuaire et distillerie fusionnés |
| 02 | Majeur | **L'Axe des Fermentations** | Colonne géante avec appendices |
| 03 | Majeur | **Les Treilles Hautes** | Ensemble des vastes cultures et terrasses suspendues |
| 04 | Majeur | **La Coulée Ambrée** | Rivière aérienne et cascades de bière |
| 05 | Majeur | **Les Voûtes du Vieillissement** | Ensemble intégré de cuves et tonneaux monumentaux |
| 06 | Majeur | **La Haute Ivresse** | Statue divine brassicole ivre avec poule géante sur la tête tenant une chope gigantesque |
| 07 | Majeur associé | **Le Grand Nid** | Repère de la poule géante ; son détail architectural et son placement précis restent à concevoir |
| 08 | Secondaire | **Les Liaisons Hautes** | Passerelles, rails à tonneaux, tuyaux, escaliers |
| 09 | Secondaire | **Les Aqueducs de Mousse** | Ouvrages et conduites brassicoles |
| 10 | Secondaire | **Les Clos du Cône** | Culture, sélection et récolte |
| 11 | Secondaire | **Les Forges de Cuisson** | Ateliers et transformation |
| 12 | Secondaire | **Les Cuves Hautes** | Grandes cuves visibles et installations attenantes |
| 13 | Secondaire | **Les Foudres Anciens** | Tonneaux géants et vieillissement |
| 14 | Ambiance | **La Salle du Goût Dernier** | Dégustation et disputes savantes |
| 15 | Ambiance | **Le Déversoir Joyeux** | Lieu de débordements et de trop-plein |
| 16 | Ambiance | **Le Pont des Mauvaises Humeurs** | Point de friction local des doctrines, **pas une frontière** |

**« Le Grand Nid » n'est qu'une seule entrée (n° 07)** : sa mention comme détail du monument ne crée pas un dix-septième lieu. Chaque nom est approuvé ; descriptions artistiques et proportions restent adaptables au rendu réel sans inventer de nouveaux éléments de scénario.

### 5.3 Doctrine toponymique VALIDÉE

**Ton C : mélange de solennité sacrée et d'absurde Gargotte.** Le divin est la réalité quotidienne de tout ce plan : même les gestes les plus ordinaires sont divins par nature. **Ne pas ajouter systématiquement « divin », « céleste » ou « sacré » aux noms des installations, objets et êtres**. Exemple expressément donné par le propriétaire : « un nid de poule divine » est simplement **un nid** dans ce monde. Une appellation comme **Le Grand Nid** naît de son caractère remarquable, pas du besoin de préciser sa nature divine.

Les noms restent hors bitmap, comme **toponymie de surcouche UI** après positionnement/validation du fond graphique. Leur approbation n'autorise pas à exposer des données conditionnelles, à fabriquer des IDs métier, ni à déclarer ces repères tous publics ou fonctionnels sans les contrats de visibilité requis.

### 5.4 Composition spatiale relative : six recommandations VALIDÉES

Après le choix **B, composition asymétrique ascendante** pour le fragment, le propriétaire a expressément validé **l'ensemble des six recommandations de placement** le 29/09/2026. Ceci arrête des relations visuelles dans une peinture **portrait 2:3/isométrique**, pas des coordonnées, limites cartographiques ni surfaces exclusives. Haut, bas, droite et gauche désignent exclusivement le **repère de lecture de l'image**, pas des directions physiques ou cardinales dans la dimension infinie.

| Élément | Arbitrage | Placement artistique relatif VALIDÉ |
|---|---|---|
| **Le Grand Cœur Brassicole** | **1.A** | Centre-bas, légèrement décentré ; pôle de lecture principal mais non centre géométrique du monde. |
| **L'Axe des Fermentations** | **2.A + C** | Au-dessus du Grand Cœur, élancé très haut, frôlant le bord supérieur et laissant supposer une continuité hors champ. |
| **La Haute Ivresse** | **3.B** | À droite sur un repère latéral spectaculaire mais connecté ; la poule géante sur sa tête tient toujours la chope disproportionnée. **Le Grand Nid** reste associé à la poule, sans localisation autonome inventée. |
| **Les Voûtes du Vieillissement** | **4.A** | En bas à gauche, masse architecturale dense, imbriquée dans le reste du fragment et non secteur clos. |
| **La Coulée Ambrée** | **5.A** | Trajet sinueux descendant du haut gauche vers le bas droite, passant entre plusieurs installations et cascades ; peut continuer au-delà du cadre. |
| **Les Treilles Hautes** | **6.C** | Végétation et terrasses présentes **partout**, avec concentration plus importante dans la partie haute ; jamais cantonnées à un territoire de l'Ordre du Houblon Pur. |

**Relations indicatives déjà proposées et compatibles avec les choix retenus :** la Salle du Goût Dernier auprès du Grand Cœur ; Les Cuves Hautes dans l'entrelacement Grand Cœur/Voûtes ; Les Foudres Anciens et Les Forges de Cuisson avec les structures de vieillissement/transformation ; Les Clos du Cône au milieu des Treilles ; Les Aqueducs de Mousse et Les Liaisons Hautes relient les différentes altitudes ; Le Déversoir Joyeux à un débordement de la Coulée ; Le Pont des Mauvaises Humeurs comme friction locale entre installations, **jamais comme frontière factionnelle**. Ces voisinages restent descriptifs : l'image pilote établira les ancrages réels avant tout marqueur/UI.

**Invariants de rendu :** ne pas transformer cette composition en carte de six secteurs ; conserver l'entremêlement gracieux des ordres et la présence des jardins/machines à tous niveaux. L'illustration est un **échantillon d'un plan divin infini** : bâtiments, treilles, ponts, réseaux et flux semblent se prolonger hors des quatre bords ; aucun encadrement naturel ne donne l'impression que le monde se termine. L'orientation de la Coulée dans l'image n'impose ni écoulement universel ni géographie exhaustive.

### 5.5 Les 36 Gargotteries : catalogue VALIDÉ et contrat du pilote

Le propriétaire a répondu **« Pour les 36 Gargotteries de la Brasserie Céleste, je choisis A. »**, validant **les 36 scènes telles que proposées, sans correction**. Leur contenu exact, leur numérotation 01–36 et le brief de première génération sont centralisés dans le document exécutable :

**[`V6-MAP-V2-BRASSERIE-CELESTE-BRIEF-PILOTE.md`](V6-MAP-V2-BRASSERIE-CELESTE-BRIEF-PILOTE.md)**.

Groupes validés : 6 scènes de récolte, 6 accidents de fermentation, 6 scènes de guerre entre ordres, 6 scènes d'hydrologie/mousse, 6 situations de quotidien divin et 6 absurdités monumentales. **Total : 36 scènes**. Hiérarchisation proposée pour la production du pilote : **8 principales + 12 secondaires + 16 micro** ; ne jamais présenter cette répartition de priorité graphique comme une garantie de visibilité des 36 scènes à la résolution réelle du moteur. Conserver les scènes au niveau de détails que permet la sortie native, sans upscaling, et évaluer individuellement les manques. Leur validation artistique ne crée pas des personnages/lieux/événements nouveaux du lore.

**Le brief pilote est prêt sur le plan documentaire, non exécuté graphiquement.** Toute première image attend un ordre explicite de lancement ; pas de prévalidation par la seule acceptation du brief.

## 6. Visibilité publique, surcouches et limites lore

- Le fond de carte est une **peinture sans texte, sans toponymie, sans lettres ni marques de fiche Codex**. Les labels et éventuels lieux autorisés sont gérés en calques indépendants et seulement après validation du fond réel.
- D7 **couvre l'intégralité du fragment visible**, sans représenter ni borner toute la dimension infinie ; seize repères internes sont **validés par leur nom et leur principe visuel**, mais leurs emplacements réels, visibilité et éventuelles fiches/liens consultables ne sont **pas encore définis**, et ne deviennent ni des donjons D16+, ni des lieux secrets connus publiquement par défaut. Ne pas inventer de coordonnées, de marqueurs, de séquences de salles, de boss ou d'entrées.
- La présence de guerre en fond public est validée comme **ambiance générale** ; une information secrète de campagne ne doit pas être cachée à moitié dans des formes distinctives, une légende, une URL publique ou le cache.
- La **Poule Divine**, Aline la Paumée, Mireille la Désorientée et les représentations d'archive peuvent informer l'humour et les formes, mais **aucun rôle, placement exact ou apparition obligatoire sur la carte n'est déduit des seules images**. Consulter le bestiaire réel avant d'écrire qu'une présence ou un rôle est canonique.
- La différence entre les ordres porte sur une doctrine de brassage **et ne constitue pas** une séparation géographique des populations.
- Entrevers est la vue de navigation de l'univers ; il ouvre la **carte-fragment de la Brasserie Céleste** (entièrement couverte par D7), pas un point D7 ajouté dans un autre fond. Consultation dans l'Atlas ≠ voyage narratif ni découverte automatique de campagne.

## 7. Gates restantes et contrat technique

| Gate | Critère | État |
|---|---|---|
| **BC-0, pitch et arbitrages** | Pitch des deux ordres, genre des anges, fragment de dimension infinie intégralement couvert par D7, quinze choix et mélange sans frontières | **VALIDÉ 29/09/2026** |
| **BC-1, composition préparatoire** | Silhouette hybride D, organisation **B asymétrique ascendante**, sept motifs structurants, six placements relatifs et **36 Gargotteries** VALIDÉS ; brief pilote complet lié ci-dessus ; **fragment ouvert sans bord cosmologique**, proposition graphique réelle 2:3/isométrique, continuités hors-cadre, confrontation aux références Drive, hiérarchie des volumes, éléments publics et lisibilité iPad | **BRIEF DOCUMENTAIRE PRÊT ; IMAGE PILOTE À PRODUIRE UNIQUEMENT SUR ORDRE EXPRES ET SOUMETTRE** |
| **BC-2, nouvelle toponymie** | Doctrine et catalogue de **seize noms validés**, sans reprendre les régions V1 ; emplacements graphiques, contours éventuels, visibilité et liens métier à établir sur le vrai fond | **NOMS VALIDÉS 29/09/2026 ; PLACEMENTS ET DROITS EN ATTENTE** |
| **BC-3, capacité native / asset** | Sortie native réelle mesurée, format exact, dimensions de fichier, version, contrôle de l'image, **zéro upscaling**, pas de faux assemblage haute définition | **EN ATTENTE** |
| **BC-4, consultation et données** | Traitement de D7 comme couvrant **l'emprise du fragment affiché** sans supposer les limites de la dimension infinie, contrat map_id stable, résolution entity_id Codex, labels indépendants, règles d'accès testées | **EN ATTENTE ; AUCUNE MODIFICATION RUNTIME ICI** |
| **BC-5, audit documentaire** | Propagation du remplacement du point V1 D7 et des quatre territoires V1 dans le maître V2 et le registre central lors de leur réconciliation sur base synchronisée | **EN ATTENTE DE SYNCHRONISATION / REVUE** |

**Interdictions absolues :** zéro upscaling ; ne pas déclarer 4K, 8K, 16K, ni une taille exacte sans preuve matérielle ; pas de nouveaux donjons, de frontières entre ordres, de région V1 ressuscitée, de nouvelle frontière ou toponymie ajoutée sans validation, de sexe masculin pour les anges brassicoles, de point D7 interne, de monde fini ou de clôture géographique du fragment, de migration `map_id`/IndexedDB/Blobs/V7, de mutation des données/permissions applicatives ou d'image générée dans ce lot documentaire.
