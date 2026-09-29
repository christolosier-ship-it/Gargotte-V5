# V6-Map V2 — Dimension / donjon D7 : La Brasserie Céleste

**STATUT : PITCH ET QUINZE ARBITRAGES ARTISTIQUES VALIDÉS PAR LE PROPRIÉTAIRE LE 29/09/2026 ; PREMIÈRE COMPOSITION, TOPONYMIE NOUVELLE, IMAGE NATIVE, RENDU FINAL ET IMPLÉMENTATION NON RÉALISÉS.** Fiche de conception artistique et cartographique seulement. Une décision sur une image ne crée pas de donnée métier, de coordonnées, de carte physique praticable ou de règle de visibilité.

Références : `AGENTS.md`, [cadrage V2 commun](V6-MAP-V2-SIX-CONTINENTS-CADRAGE.md), [pivot V2](V6-MAP-PIVOT-V2-FEUILLE-DE-ROUTE.md), [registre V2 des donjons](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md), [Entrevers](V6-MAP-V2-ENTREVERS.md). Sources d'inspiration visuelles inspectées en lecture seule sur Google Drive : `Projet Gargotte / Donjon 7 - La Brasserie Céleste` (y compris `Ordre du Houblon Pur` et `Culte de la Fermentation Sacrée`) ; `Projet Gargotte / Archive / Brasserie`, `Brasserie 2` et `Brasserie 3`. Les images d'archives sont des références de style, **pas des positions ou des salles cartographiques déjà approuvées**. Les deux classeurs historiques de `Brasserie 2` ne sont pas déclarés vérifiés pour le présent arbitrage artistique.

## 1. Pitch narratif directement validé

La Brasserie Céleste est un **plan divin habité par les anges brassicoles**. Après un temps infini passé à brasser et à espérer créer **la bière parfaite**, deux ordres religieux se sont formés et sont **en guerre** :

- **Ordre du Houblon Pur** : la perfection vient de la matière première, de la **culture**, de la pureté et qualité du **houblon**, de sa sélection et de la **récolte**.
- **Ordre de la Fermentation Sacrée** : la perfection vient de la **qualité de transformation**, de la fermentation, de l'élevage, des **cuves** et **tonneaux**.

**Précision explicite VALIDÉE : les anges brassicoles sont exclusivement FÉMININS.** Cette règle concerne les anges brassicoles, sans transformer automatiquement tout le bestiaire D7 en personnages féminins ni introduire de nouvelles espèces. Population choisie : **uniquement les anges brassicoles et les créatures déjà présentes au bestiaire D7** ; consulter les fiches métier réelles avant d'ajouter une silhouette ou de présenter une entité d'archive comme canon actif.

**Règle spatiale fondamentale : les deux ordres ne possèdent PAS chacun une moitié de la carte.** Leur guerre traverse le même plan divin, et leurs ouvrages s'entremêlent gracieusement partout. Ne dessiner **aucune frontière, division Est/Ouest, vaste territoire factionnel exclusif, zone militaire ou ligne de front structurante**. Les divergences doctrinales se lisent dans le personnel, les équipements, emblèmes, rituels et détails de confrontation locale au milieu d'une architecture commune.

## 2. Spécificité de D7 : coïncidence d'étendue, sans second point

**CHOIX 14.A VALIDÉ : l'intégralité de la carte de La Brasserie Céleste est le donjon D7.** Aucun petit donjon D7 distinct n'est localisé au sein de la dimension ; **aucun marqueur supplémentaire D7, aucune pastille de placement et aucune seconde illustration d'un bâtiment censé représenter à lui seul D7**. L'entrée depuis le hub Entrevers ouvre directement cette vue complète.

Conserver néanmoins en conception l'**identité de vue/dimension** et l'**identité métier du donjon D7** comme objets distincts (pour les données du Codex et la rétrocompatibilité) : leur **emprise représentée coïncide**. Ne pas supprimer automatiquement `placement:d07` ni renommer les `map_id` historiques dans le runtime par ce document. L'ancien repère V1 « D7 dans les Terrasses des Brasseurs, point indicatif 74/57 » est **SUPPLANTÉ pour la V2** : aucun géopoint local à résoudre pour D7. Réviser explicitement le registre central au moment de l'intégration des documents V2 issus de PR #59, **sans fabriquer une seconde implantation sur la branche documentaire non synchronisée**. Les règles d'autorisation/fiches Codex restent à spécifier avant intégration, sans supposer que consultation publique équivaut à découverte du donjon.

Les anciennes subdivisions V1 « Les Hauts Plateaux », « La Mer des Nuages », « Les Jardins Suspendus », « Les Terrasses des Brasseurs » et leurs X/Y provisoires sont **ABANDONNÉES COMME DÉCOUPAGE CARTOGRAPHIQUE V2 (choix 15.C)**. Elles sont à conserver seulement comme *historique daté* dans les anciens documents, pas comme noms, polygones, coordonnées ni régions opérationnelles à placer. **Nouvelle toponymie entièrement à construire et à valider ultérieurement** : aucun nom neuf inventé ou officialisé dans ce cahier.

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
| 14 | **A — D7 couvre toute la carte** | Une carte de dimension-donjon, aucun marqueur géographique D7 intérieur supplémentaire. |
| 15 | **C — refaire la toponymie** | Ne pas reconduire les quatre zones historiques V1 ni leurs coordonnées ; les noms et lieux nouveaux sont à arbitrer séparément. |

## 4. Composition artistique d'ensemble, sans géopoints inventés

**Intention :** panorama vertical isométrique d'un monde-ateliers céleste, aérien, foisonnant et théâtral. Des cathédrales brassicoles, tours de distillation, cuves, forges et tonneaux gigantesques émergent d'épais nuages porteurs ; des terrasses agricoles suspendues, champs de houblon, passerelles et jardins prolifèrent **entre** les ouvrages et à différents étages. Les écoulements de bière et de mousse descendent, jaillissent et relient visuellement les hauteurs en cascades démesurées. Ciel et lumière divins, détails de production, humour gargottien.

**Fusion des doctrines :** une plateforme de récolte jouxte une cuve ; une colonne de transformation traverse plusieurs terrasses de cultures ; les mêmes passerelles transportent ingrédients, tonneaux et anges des deux ordres. Utiliser les références visuelles de l'Ordre du Houblon Pur pour les plantes, le geste de récolte et les costumes, celles de la Fermentation Sacrée pour la machinerie, les cuves et les outils, **sans faire correspondre chacun à une zone géographique exclusive**.

**Conflit partout mais hiérarchie lisible :** saynètes de sabotages et duels burlesques, petits groupes en désaccord, appareils récupérés, mousse projectile. L'univers reste beau et majestueux malgré la guerre : pas de carte de tranchées, pas de destructions généralisées qui effaceraient l'architecture ou la production. Les gags proposés sont motifs de décor **non canoniques individuellement** tant que des scènes précises n'ont pas été approuvées.

**Composition de travail :** hautes silhouettes architecturales dans l'axe vertical, étagement de niveaux à lecture isométrique, respirations de nuages pour séparer les grandes formes, entremêlement dense et maîtrisé de vert végétal et métal cuivré, cascades et nappes mousseuses pour guider le regard. Pas de secteur réservé politiquement à un ordre ; pas de géopoint, nom ou chemin de mission annoncé sans décision ultérieure.

## 5. Visibilité publique, surcouches et limites lore

- Le fond de carte est une **peinture sans texte, sans toponymie, sans lettres ni marques de fiche Codex**. Les labels et éventuels lieux autorisés sont gérés en calques indépendants et seulement après validation du fond réel.
- D7 représente **l'étendue complète de la vue** ; les lieux internes éventuellement consultables ne sont **pas encore définis**, et ne deviennent ni des donjons D16+, ni des lieux secrets connus publiquement par défaut. Ne pas inventer de coordonnées, de marqueurs, de séquences de salles, de boss ou d'entrées.
- La présence de guerre en fond public est validée comme **ambiance générale** ; une information secrète de campagne ne doit pas être cachée à moitié dans des formes distinctives, une légende, une URL publique ou le cache.
- La **Poule Divine**, Aline la Paumée, Mireille la Désorientée et les représentations d'archive peuvent informer l'humour et les formes, mais **aucun rôle, placement exact ou apparition obligatoire sur la carte n'est déduit des seules images**. Consulter le bestiaire réel avant d'écrire qu'une présence ou un rôle est canonique.
- La différence entre les ordres porte sur une doctrine de brassage **et ne constitue pas** une séparation géographique des populations.
- Entrevers est la vue de navigation de l'univers ; il ouvre la **carte entière de la Brasserie Céleste**, pas un point D7 ajouté dans un autre fond. Consultation dans l'Atlas ≠ voyage narratif ni découverte automatique de campagne.

## 6. Gates restantes et contrat technique

| Gate | Critère | État |
|---|---|---|
| **BC-0, pitch et arbitrages** | Pitch des deux ordres, genre des anges, carte entière D7, quinze choix et mélange sans frontières | **VALIDÉ 29/09/2026** |
| **BC-1, composition préparatoire** | Proposition graphique complète 2:3/isométrique, confrontation visuelle aux références Drive, hiérarchie des volumes, éléments publics et lisibilité iPad | **À PRODUIRE ET SOUMETTRE** |
| **BC-2, nouvelle toponymie** | Propositions éventuelles de lieux internes et noms, sans reprendre automatiquement le découpage V1 | **RÉSERVÉ, décision utilisateur requise** |
| **BC-3, capacité native / asset** | Sortie native réelle mesurée, format exact, dimensions de fichier, version, contrôle de l'image, **zéro upscaling**, pas de faux assemblage haute définition | **EN ATTENTE** |
| **BC-4, consultation et données** | Traitement de D7 à emprise égale à sa dimension, contrat map_id stable, résolution entity_id Codex, labels indépendants, règles d'accès testées | **EN ATTENTE ; AUCUNE MODIFICATION RUNTIME ICI** |
| **BC-5, audit documentaire** | Propagation du remplacement du point V1 D7 et des quatre territoires V1 dans le maître V2 et le registre central lors de leur réconciliation sur base synchronisée | **EN ATTENTE DE SYNCHRONISATION / REVUE** |

**Interdictions absolues :** zéro upscaling ; ne pas déclarer 4K, 8K, 16K, ni une taille exacte sans preuve matérielle ; pas de nouveaux donjons, de frontières entre ordres, de région V1 ressuscitée, de sexe masculin pour les anges brassicoles, de points D7 internes, de migration `map_id`/IndexedDB/Blobs/V7, de mutation des données/permissions applicatives ou d'image générée dans ce lot documentaire.
