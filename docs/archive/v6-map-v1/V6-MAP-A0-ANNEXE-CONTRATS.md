# V6-Map A0 — Annexe contractuelle et registre de traçabilité

Statut : LIVRABLE A0 documentaire. Autorité de conception : V6-MAP-MAITRE.md ; règles transversales : AGENTS.md. Cette annexe formalise les éléments existants et des interfaces **conceptuelles**, pas une décision d'implémentation, de géolocalisation finale ou de schéma D1. Le maître reste inchangé.

## 1. Constat d'état avant contrat (branche V5.3, 27/09/2026)

- Base applicative observée : version 5.6.5 et cache gargottex-v6-whaou-final-v1. V6-WHAOU clos ; référence locale IndexedDB gargottex-v5-offline, DB_VERSION=2, sans table Atlas ni campagne dans STORE_DEFS ; charge métier et médias séparés, MediaRepository à lectures ciblées.
- Le dépôt contient le maître V7 et les neuf cahiers Lot 0..8, mais ni implémentation Cloudflare V7, ni Worker/D1/R2 dans l'arbre examiné ; aucune PR V7 d'implémentation identifiée dans la recherche GitHub. Cela ne prouve pas l'état des services externes ni celui des IndexedDB sur les appareils. **Ne présumer aucune API, campagne, session ou rôle opérationnel** avant contrôle à C2.
- Le Codex représente les familles d'entités par ID, avec état local codexType/codexSelectedId et navigation de fiche ; aucune coordonnée Atlas dans les champs des donjons ou les stores actuels. Le lien carte→Codex doit donc être une surcouche, sans modification des IDs métier.
- Le seed de dépôt contient seulement deux donjons : Le Cabaret des Joyeuses (id dungeon_le-cabaret-des-joyeuses) et Le Château de Bastognac (id dungeon_le-ch-teau-de-bastognac). Ce seed **n'est pas l'inventaire de la production**. Son libellé Château diffère de « Le Château Bastognac » du maître : correspondance D1 candidate, jamais auto-résolue.
- Le Service Worker actuel applique caches.match(request, { ignoreSearch: true }) à la PWA ; politique impropre aux futures variantes de tuiles Atlas. Il n'est pas modifié en A0 : correction/partitionnement seulement après POC et validation.

## 2. Règles de registre et statuts

Identifiant Atlas stable, déclaré ici explicitement, indépendant du nom affiché et de sa traduction : map:, continent:, region:, ocean:, sea:, wonder:, placement:. Ce sont des **identifiants contractuels de conception**, pas des clés créées en production. Ne jamais fabriquer un entity_id métier depuis un libellé/slug/numéro D1..D15. Une désignation VALIDÉE n'entraîne pas validation de ses contours ou coordonnées. « RÉSERVÉ » signifie absence de décision et non invitation à compléter implicitement.

### 2.1 Quatre cartes
| ID Atlas | Nom | Nature | Statut nom/géographie | Référentiel |
|---|---|---|---|---|
| map:ardera | Ardéra | Monde matériel | VALIDÉ | 2:1, nord en haut |
| map:trame-astrale | Trame astrale | Réalité intermédiaire | VALIDÉ | sans nord physique |
| map:hautes-fermentations | Hautes Fermentations | Dimension divine, nom géographique de travail | VALIDÉ (nom de travail) | repère propre |
| map:royaume-soifs-eteintes | Royaume des Soifs Éteintes | Dimension infernale, nom géographique de travail | VALIDÉ (nom de travail) | repère propre |

Quatre cartes visibles dès l'ouverture ne signifient pas quatre dimensions physiquement accessibles. « Hautes Fermentations » et « Royaume des Soifs Éteintes » ne sont pas des noms cosmologiques définitifs. L'Entrevers est l'univers, pas une cinquième carte. Familles « Plans divins/infernaux », futurs Plans élémentaires/dimensions inconnues : RÉSERVÉES, pas des cartes uniques.

### 2.2 Continents et 42 régions d'Ardéra
Noms et rattachements : **VALIDÉS**. Boîtes X/Y : **V1 PROVISOIRES**, ni tracés des côtes ni unités kilométriques.

| ID continent | Continent | Boîte indicative X/Y | Statut |
|---|---|---|---|
| continent:valdorie | Valdorie | X12–43 / Y26–57 | nom VALIDÉ / boîte V1 PROVISOIRE |
| continent:boreclat | Boréclat | X25–59 / Y4–20 | nom VALIDÉ / boîte V1 PROVISOIRE |
| continent:sahaldune | Sahaldune | X11–36 / Y61–82 | nom VALIDÉ / boîte V1 PROVISOIRE |
| continent:sylvaronde | Sylvaronde | X45–67 / Y54–77 | nom VALIDÉ / boîte V1 PROVISOIRE |
| continent:ferrecime | Ferrécime | X56–76 / Y22–52 | nom VALIDÉ / boîte V1 PROVISOIRE |
| continent:pelagreve | Pelagrève | X81–95 / Y34–66 | nom VALIDÉ / boîte V1 PROVISOIRE |
| continent:austrebrume | Austrébrume | X43–75 / Y84–96 | nom VALIDÉ / boîte V1 PROVISOIRE |

| ID région | Région | Continent | Statut |
|---|---|---|---|
| region:valdorie:cotes-grises | Les Côtes Grises | continent:valdorie | VALIDÉ |
| region:valdorie:hautes-marches | Les Hautes Marches | continent:valdorie | VALIDÉ |
| region:valdorie:sylve-anciens | La Sylve des Anciens | continent:valdorie | VALIDÉ |
| region:valdorie:plaines-valdor | Les Plaines de Valdor | continent:valdorie | VALIDÉ |
| region:valdorie:bassins-est | Les Bassins de l'Est | continent:valdorie | VALIDÉ |
| region:valdorie:terres-cendre | Les Terres de Cendre | continent:valdorie | VALIDÉ |
| region:boreclat:fjords-brisants | Les Fjords des Brisants | continent:boreclat | VALIDÉ |
| region:boreclat:grande-taiga | La Grande Taïga | continent:boreclat | VALIDÉ |
| region:boreclat:cretes-haut-givre | Les Crêtes du Haut-Givre | continent:boreclat | VALIDÉ |
| region:boreclat:plateau-blancs-silences | Le Plateau des Blancs Silences | continent:boreclat | VALIDÉ |
| region:boreclat:pays-sept-lacs | Le Pays des Sept Lacs | continent:boreclat | VALIDÉ |
| region:boreclat:marches-ecume | Les Marches d'Écume | continent:boreclat | VALIDÉ |
| region:sahaldune:cotes-ambre | Les Côtes d'Ambre | continent:sahaldune | VALIDÉ |
| region:sahaldune:monts-fendus | Les Monts Fendus | continent:sahaldune | VALIDÉ |
| region:sahaldune:grande-depression | La Grande Dépression | continent:sahaldune | VALIDÉ |
| region:sahaldune:vallees-deux-fleuves | Les Vallées des Deux Fleuves | continent:sahaldune | VALIDÉ |
| region:sahaldune:savanes-olvara | Les Savanes d'Olvara | continent:sahaldune | VALIDÉ |
| region:sahaldune:littoral-moussons | Le Littoral des Moussons | continent:sahaldune | VALIDÉ |
| region:sylvaronde:delta-mille-bras | Le Delta des Mille Bras | continent:sylvaronde | VALIDÉ |
| region:sylvaronde:bassin-grandes-eaux | Le Bassin des Grandes Eaux | continent:sylvaronde | VALIDÉ |
| region:sylvaronde:foret-hautes-couronnes | La Forêt des Hautes Couronnes | continent:sylvaronde | VALIDÉ |
| region:sylvaronde:monts-orages | Les Monts des Orages | continent:sylvaronde | VALIDÉ |
| region:sylvaronde:hautes-brumes | Les Hautes Brumes | continent:sylvaronde | VALIDÉ |
| region:sylvaronde:marches-sud | Les Marches du Sud | continent:sylvaronde | VALIDÉ |
| region:ferrecime:portes-givre | Les Portes du Givre | continent:ferrecime | VALIDÉ |
| region:ferrecime:echine-ardera | L'Échine d'Ardéra | continent:ferrecime | VALIDÉ |
| region:ferrecime:hauts-plateaux-silex | Les Hauts Plateaux de Silex | continent:ferrecime | VALIDÉ |
| region:ferrecime:vallees-mille-cascades | Les Vallées des Mille Cascades | continent:ferrecime | VALIDÉ |
| region:ferrecime:hautes-voutes | Les Hautes Voûtes | continent:ferrecime | VALIDÉ |
| region:ferrecime:marches-braise | Les Marches de Braise | continent:ferrecime | VALIDÉ |
| region:pelagreve:cotes-eclats | Les Côtes des Éclats | continent:pelagreve | VALIDÉ |
| region:pelagreve:mers-encloses | Les Mers Encloses | continent:pelagreve | VALIDÉ |
| region:pelagreve:dorsale-fournaises | La Dorsale des Fournaises | continent:pelagreve | VALIDÉ |
| region:pelagreve:cotes-alizes | Les Côtes des Alizés | continent:pelagreve | VALIDÉ |
| region:pelagreve:ceinture-lagons | La Ceinture des Lagons | continent:pelagreve | VALIDÉ |
| region:pelagreve:marches-marees | Les Marches des Marées | continent:pelagreve | VALIDÉ |
| region:austrebrume:fjords-nacrelune | Les Fjords de Nacrelune | continent:austrebrume | VALIDÉ |
| region:austrebrume:bois-dernieres-feuilles | Les Bois des Dernières Feuilles | continent:austrebrume | VALIDÉ |
| region:austrebrume:monts-voile | Les Monts du Voile | continent:austrebrume | VALIDÉ |
| region:austrebrume:bassin-lacs-sombres | Le Bassin des Lacs Sombres | continent:austrebrume | VALIDÉ |
| region:austrebrume:landes-grand-hiver | Les Landes du Grand Hiver | continent:austrebrume | VALIDÉ |
| region:austrebrume:couronne-blanche | La Couronne Blanche | continent:austrebrume | VALIDÉ |

Les civilisations sont présentes sur les sept continents, avec de grandes zones sauvages préservées. Pas de normalisation des six régions en polygones avant fonds géographiques validés.

### 2.3 Hydronymie majeure : quatre océans, cinq mers
| ID | Nom | Relation géographique décidée | Statut |
|---|---|---|---|
| ocean:longs-silences | Océan des Longs Silences | Grand bassin extérieur, visible de part et d'autre du cadre, bords communicants | VALIDÉ |
| ocean:outrebrume | Océan d'Outrebrume | Nord-ouest | VALIDÉ |
| ocean:mille-voiles | Océan des Mille Voiles | Bassin oriental entre continents centraux | VALIDÉ |
| ocean:austral | Océan Austral | Sud | VALIDÉ |
| sea:boreale | Mer Boréale | Boréclat / Valdorie / Ferrécime | VALIDÉ (tracé précis RÉSERVÉ) |
| sea:trois-couronnes | Mer des Trois Couronnes | Valdorie / Sahaldune / Sylvaronde ; semi-fermée, deux passages océaniques, O entre Valdorie et Sahaldune, SE vers détroit Sahaldune / Sylvaronde | VALIDÉ (tracé précis RÉSERVÉ) |
| sea:eclats | Mer des Éclats | Ferrécime / Pelagrève | VALIDÉ (tracé précis RÉSERVÉ) |
| sea:lanternes | Mer des Lanternes | Pelagrève ; grande et profonde, intérieure, liée à l'autre mer et à l'océan par détroits | VALIDÉ (tracé précis RÉSERVÉ) |
| sea:cent-passes | Mer aux Cent Passes | Pelagrève ; ramifiée et insulaire, intérieure, liée à l'autre mer et à l'océan par détroits | VALIDÉ (tracé précis RÉSERVÉ) |

Pas de frontières tracées entre bassins naturellement communicants ; continuité de l'Océan des Longs Silences aux deux bords. La Mer des Trois Couronnes a exactement **deux sorties** ; le détail de leurs contours reste à contrôler. Les deux mers intérieures de Pelagrève communiquent entre elles et avec l'océan via des détroits ; **aucun pont terrestre inventé**.

### 2.4 Sept merveilles
| ID Atlas | Merveille | Continent | Localisation indicative | Nature / réserve | Statut |
|---|---|---|---|---|---|
| wonder:arbres-colosses | Arbres-Colosses | continent:valdorie | Sylve des Anciens | Origine RÉSERVÉE | nom/nature VALIDÉS ; point indicatif PROVISOIRE |
| wonder:aiguilles-boreales | Aiguilles Boréales | continent:boreclat | Crêtes du Haut-Givre ; X43/Y11 indicatif | Origine mystérieuse | nom/nature VALIDÉS ; point indicatif PROVISOIRE |
| wonder:couronne-sel | Couronne de Sel | continent:sahaldune | X23/Y71 indicatif | Ancienne anomalie ; retrait de la mer intérieure | nom/nature VALIDÉS ; point indicatif PROVISOIRE |
| wonder:canopee-monde | Canopée-Monde | continent:sylvaronde | X54/Y60 indicatif | Merveille biologique et magique ; forêt verticale | nom/nature VALIDÉS ; point indicatif PROVISOIRE |
| wonder:cimes-suspendues | Cimes Suspendues | continent:ferrecime | Hautes Voûtes ; X68/Y37 indicatif | Ancienne anomalie liée à la Trame ; PAS un passage avéré | nom/nature VALIDÉS ; point indicatif PROVISOIRE |
| wonder:labyrinthe-corallien | Labyrinthe Corallien | continent:pelagreve | X91/Y60 indicatif | Merveille biologique et magique | nom/nature VALIDÉS ; point indicatif PROVISOIRE |
| wonder:cascades-brume | Cascades de Brume | continent:austrebrume | X59/Y89 indicatif | Phénomène atmosphérique ; origine RÉSERVÉE | nom/nature VALIDÉS ; point indicatif PROVISOIRE |

Aucune merveille ne vaut preuve de portail ; aucune merveille secrète ne doit être encodée en clair dans une tuile publique.

### 2.5 Repères de dimensions et toponymie secondaire
Territoires des trois cartes dimensionnelles : **noms/géographie VALIDÉS ; coordonnées X/Y V1 PROVISOIRES**, indépendantes entre cartes :
- map:trame-astrale : Archipels d'Éther 24/34 ; Courants de Filaments (parcours non forcément praticable) ; Nœud des Convergences 51/47 (PAS portail universel) ; Voiles Sans Rive 76/29 ; Déchirure Immobile 77/73 (PAS portail automatique).
- map:hautes-fermentations : Les Hauts Plateaux 29/32 ; La Mer des Nuages 49/50 ; Les Jardins Suspendus 25/69 ; Les Terrasses des Brasseurs 72/55.
- map:royaume-soifs-eteintes : Les Plaines de Cendre 30/30 ; Les Fosses du Silence 27/67 ; Les Fleuves Tarissables 49/49 ; La Citadelle de l'Abstinence 73/51.

Valdorie, toponymes secondaires VALIDÉS : l'Avelorne (Hautes Marches → Bassins de l'Est → Mer des Trois Couronnes), la Rivombre (vers Côtes Grises), ruisseau des Saules (près de Saint-Fût ; affluent du bassin Avelorne), lac d'Ysambre (est), Collines de la Vieille Lande, Monts d'Escarbelle. Ne pas ressusciter Argenne, Ornebrune, Petite Aulne, Lac des Miroirs, Collines de Valdor ou Monts de Cendre. Austrébrume : Falaises de Nacrelune et Plateaux du Dernier Vent sont **PROPOSÉS seulement**, non canoniques. Les autres labels secondaires non arrêtés sont **RÉSERVÉS**.

Repères fonctionnels : Saint-Fût-le-Petit, hameau ordinaire (centre X30/Y44 indicatif, statut lieu VALIDÉ / position PROVISOIRE) ; Chope Qui Colle, auberge de Berthold « Deux-Doigts », repère prioritaire de consultation, pas nexus cosmologique. Les identifiants de conception place:saint-fut-le-petit et landmark:chope-qui-colle ne sont pas des IDs Codex constatés.

### 2.6 Table de traçabilité des quinze placements V1
**Tous les emplacements ci-dessous sont V1 PROVISOIRES APPROUVÉS**, pas des faits canoniques vérifiés au lore ; noms des donjons repris du maître. Un placement porte placement:dXX, lié ultérieurement à entity_type=dungeons et à **l'ID exact de l'enregistrement du Codex correspondant**, après contrôle d'identité/lore. ID métier de production : **NON VÉRIFIÉ pour les quinze**, même si le seed donne deux candidats.

| Placement Atlas | Donjon | Carte / placement de travail | Historique | Codex |
|---|---|---|---|---|
| placement:d01 | D1 : Le Château Bastognac | Ardéra / Valdorie / Collines de la Vieille Lande, NO de Saint-Fût | Ancien accord provisoire | dungeons / entity_id à résoudre |
| placement:d02 | D2 : La Forêt en Chantier | Ardéra / Valdorie / lisière Sylve des Anciens | Ancien accord provisoire | dungeons / entity_id à résoudre |
| placement:d03 | D3 : Hôtel Zombifornia | Ardéra / Pelagrève / Côtes des Alizés | Nouvelle piste V1 | dungeons / entity_id à résoudre |
| placement:d04 | D4 : Le Cabaret des Joyeuses | Ardéra / Valdorie / grande ville des Plaines de Valdor | Ancien accord provisoire | dungeons / entity_id à résoudre |
| placement:d05 | D5 : Le Sanctuaire du Houblon Noir | Ardéra / Valdorie / contreforts des Hautes Marches | Ancien accord provisoire | dungeons / entity_id à résoudre |
| placement:d06 | D6 : Le Panthéon des Fermentations Interdites | Ardéra / Valdorie / ancien site religieux des Hautes Marches | Nouvelle piste V1 | dungeons / entity_id à résoudre |
| placement:d07 | D7 : La Brasserie Céleste | Hautes Fermentations / Terrasses des Brasseurs ; X74/Y57 indicatif | Dimension envisagée V1 | dungeons / entity_id à résoudre |
| placement:d08 | D8 : L'Enfer de la Sobriété Éternelle | Royaume des Soifs Éteintes / Citadelle de l'Abstinence ; X75/Y53 indicatif | Dimension envisagée V1 | dungeons / entity_id à résoudre |
| placement:d09 | D9 : Le Bastion du Sauciflard | Ardéra / Valdorie / région frontalière des Hautes Marches | Ancien accord provisoire | dungeons / entity_id à résoudre |
| placement:d10 | D10 : Les Thermes de la Bonne Trempette | Ardéra / Pelagrève / Dorsale des Fournaises | Nouvelle piste V1 | dungeons / entity_id à résoudre |
| placement:d11 | D11 : La Ruche Royale | Ardéra / Valdorie / zone boisée/fleurie est des Plaines | Ancien accord provisoire | dungeons / entity_id à résoudre |
| placement:d12 | D12 : Le Monastère des Dénaturées | Ardéra / Ferrécime / vallée reculée de l'Échine d'Ardéra | Nouvelle piste V1 | dungeons / entity_id à résoudre |
| placement:d13 | D13 : Les Marécages Infectés | Ardéra / Sylvaronde / Delta des Mille Bras | Nouvelle piste V1 | dungeons / entity_id à résoudre |
| placement:d14 | D14 : La Citadelle des Tonneaux Perchés | Ardéra / Ferrécime / Hautes Voûtes | Nouvelle piste V1 | dungeons / entity_id à résoudre |
| placement:d15 | D15 : Le Gynécotron du Gnome Tordu | Ardéra / Valdorie / complexe souterrain des Hautes Marches ; lien éventuel D5 à vérifier | Nouvelle piste V1 | dungeons / entity_id à résoudre |

Total : 8 Valdorie ; 2 Pelagrève ; 2 Ferrécime ; 1 Sylvaronde ; 1 carte divine ; 1 carte infernale. Aucun D1..D15 placé à Boréclat, Sahaldune ou Austrébrume en V1. D5 et D15 : **deux marqueurs**, lien narratif éventuel RÉSERVÉ. Aucun marqueur de portail n'est autorisé à A0 : toutes extrémités, accès et coordonnées sont RÉSERVÉS. Le seed propose seulement D4 avec correspondance de libellé et D1 avec divergence de libellé ; aucune liaison automatique tant que le catalogue réel et le lore ne les ont pas confirmés.

## 3. Contrat spatial et surcouches

Chaque map_id possède son repère normalisé local (x,y) dans [0,100]², origine en haut à gauche (X droite, Y bas) comme convention technique de **composition** à valider avec les fonds ; les X et Y sont des proportions indépendantes largeur/hauteur, non des longueurs égales, ni coordonnées entre dimensions, ni distances géodésiques. Nord en haut sur Ardéra ; aucun nord physique imposé à la Trame. Ratio visuel d'Ardéra 2:1 ; les proportions finales des autres fonds et les géométries détaillées restent RÉSERVÉES. Une transformation normalisée→pixels utilise x/100×largeur native, y/100×hauteur native pour **chaque niveau dérivé d'une même géographie mère** ; fonds, labels, marqueurs, zones et hitboxes sont co-enregistrés. Panning/zoom ne recalculent jamais le point géographique. Conserver orientation, silhouette des côtes, embouchures et détroits à tous niveaux ; une boîte indicative ne produit jamais un polygone canonique.

Modèle **conceptuel** de localisation Atlas : atlas_id, map_id, kind (toponyme / wonder / settlement / dungeon / landmark / passage / décor non interactif), status (VALIDÉ / V1 PROVISOIRE / RÉSERVÉ), position optionnelle x/y ou géométrie associée à une version de référence, label indépendant du fond, visibilité/sensibilité, miniature optionnelle, extrait public optionnel et lien Codex optionnel { entity_type, entity_id }. Pour les donjons, placement_id distinct de entity_id. Noms en surcouches et niveaux de détail, avec extinction globale de toponymie ; décoration du fond jamais utilisée comme nom ou hotspot caché. Les données RÉSERVÉES restent absentes de l'index public, sans valeurs de positions factices.

Lien au Codex : sélectionner un marqueur autorisé → afficher panneau → ouvrir famille et fiche selon entity_type + entity_id, avec possibilité de retour à la position/zoom. Réutiliser les mécanismes de navigation Codex de la branche réelle au lot concerné, sans renommer ni régénérer un ID. Les champs de coordonnées ne sont pas présents dans les enregistrements métier observés : **pas de putOne/putMany, migration, nouveau store, table, seed ou écriture dans la base en A0**. Toute résolution d'ID doit comparer la vraie source métier V7/production à la table, signaler absents, doublons et écarts de titre, jamais associer par index ordinal.

## 4. Contrat de ressources graphiques et manifest (conceptuel)

Une **géographie mère versionnée par carte** règle les côtes, îles, mers, rivières, lacs, reliefs et emplacements publics ; production du fond général, niveaux continentaux, puis enrichissements régionaux restreints. Peinture/encrage parchemin Gargotte, sans nom ni texte, sans marqueur, sans portail, sans indice secret ni élément de gameplay gravé dans le bitmap. Les ornements publics sont permis. Environ 65 % océans / 35 % terres sur Ardéra, à mesurer sur silhouettes définitives plutôt que boîtes englobantes ; sept continents rapprochés mais séparés par mers et bassins plausibles.

Pyramide de tuiles multi-résolution issue de la même référence géographique ; un manifest de conception contient au minimum map_id, asset_revision immuable, geography_revision, bounds/ratio/orientation, liste des niveaux et coordonnées de tuiles, URL/version/hash/format/tailles selon mesures, et référence de surcouches compatibles. Les ressources versionnées changent de clé à chaque révision ; ne pas réutiliser une URL avec contenu différent, ne pas confondre variants par ignoreSearch. Au remplacement, conserver ancien cache le temps de la transition contrôlée puis éviction bornée, fallback basse résolution si une tuile manque, décharger hors champ, voisins préchargés de manière bornée. **Moteur, WebP/AVIF, hébergement, dimensions, seuils, compression, budget mémoire/cache et stratégie de révision exacte : RÉSERVÉS à A2 sur mesures iPad.** Aucun asset final produit dans A0.

Les fonds de l'Atlas sont des ressources cartographiques distinctes de media_assets métier et de la migration binaire V7 (qui ne concerne que détourages actifs approuvés et images de Donjons). Ne migrer aucune tuile via le migrateur média V7 ; ne supprimer aucun Blob historique, notamment transparent_blob. Aucun chargement global massif au bootstrap.

## 5. Confidentialité, campagnes et API conceptuelle (non implémentée)

Définition globale d'un lieu et état de découverte **par campagne** sont deux concepts séparés. Les quatre fonds sont consultables à tous ; un marqueur sensible, son nom, sa miniature, son index de recherche, ses liens Codex/portails et sa présence dans une URL ou tuile ne sont envoyés aux joueurs que si visibles dans leur campagne. La découverte d'un donjon secret est **une action explicite du MJ**, réversible par correction explicite, et n'est JAMAIS induite par l'ouverture du Codex. La révélation de la campagne A ne modifie pas B. L'Aperçu joueurs est une projection temporaire côté MJ, pas un changement de rôle/campagne.

Interface abstraite à discuter avec l'architecture V7 réellement déployée, **sans présumer endpoints, tables ou contrats de rôles existants** :
- lecture fonds/maps publics et marqueurs **déjà filtrés côté serveur** selon principal authentifié, campagne active vérifiée et projection joueur/MJ ; ne pas expédier les secrets dans JSON/HTML/JS, assets, CacheStorage ni un catalogue global pour ensuite masquer au DOM ;
- recherche globale sur les quatre cartes appliquant **le même prédicat autorisé avant indexation/résultat, zoom et aperçus** ; un lien de Codex/portail ne bypass pas ce contrôle ;
- lecture MJ complète uniquement après contrôle de rôle/campagne côté backend ; seuls les marqueurs de secret existent dans la réponse autorisée ;
- commande de confirmation/révocation de découverte (campagne_id, placement_id, acteur MJ, horodatage et justification éventuelle), contrôles de rôle, campagne, cible, idempotence/audit ; pas d'inférence par simple lecture ;
- tester négativement compte joueur non autorisé, multi-campagne, cache offline/partagé, recherche/autocomplete, thumbnails, erreurs, URL et navigation croisée. Réponse non autorisée ne doit pas révéler si un emplacement caché existe.

**Pré-requis C2** : vérifier réellement Access/Worker/rôles V7, modèle des campagnes et source d'identité, protocole de cache privé, règles d'autorisation et état de déploiement. A0 ne définit aucun SQL, store, endpoint public effectif ni schéma de tables. Si les campagnes n'existent pas encore, traiter C2 comme dépendance bloquante plutôt que créer silencieusement une colonne ou un rôle.

## 6. Offline / PWA et coexistence

Exigence cible : quatre fonds généraux basiques accessibles après installation/cache effectif, navigation locale sans réseau sur ces fonds ; tuiles de détail mises en cache opportunément et susceptibles d'éviction navigateur, **aucune promesse de conservation complète**. Cache Atlas public de tuiles versionné distinct du cache shell et des données autorisées privées ; éviter ignoreSearch pour les variantes, limiter quotas/éviction ; ne jamais mêler données MJ et joueur dans un cache public ou un stockage local partagé. En situation offline sans autorisation vérifiable, ne pas révéler une donnée privée au titre d'un ancien aperçu MJ. Tester installation/réouverture offline, quatre fonds, dégradations du zoom et mises à jour après A2 puis C3. Règles de médias V6-Fast : lecture ciblée, Object URLs libérées, DOM borné ; aucune régression.

## 7. Arbitrages ouverts, risques et prochaines preuves

| Point | Risque / observation | Traitement sans décision implicite |
|---|---|---|
| Contours, ratio réel X/Y, 65/35 et passages | boîtes provisoires, deux sorties Trois Couronnes et détroits de Pelagrève à dessiner sans contradiction | géographie mère B1 puis mesure sur silhouettes |
| Coordonnées donjons | 15 placements V1 sans ID ni géopoint définitif ; seed de deux entrées seulement ; titre D1 divergent | résolution catalogue réel + validation lore avant B4 |
| Ports/portails | aucune double extrémité validée ; Cimes/Déchirure/Nœud ne suffisent pas | zéro portail créé ; décisions explicites ultérieures |
| Labels secondaires | Valdorie validés, deux propositions Austrébrume, reste réservé | revue toponymie B3, pas d'invention |
| Confidentialité | pas de store campagne ni rôle constaté sur V6 ; réalité externe V7 non vérifiée | contrat serveur obligatoire ; C2 suspendu à backend vérifié |
| Tuile et cache | SW V6 utilise ignoreSearch:true ; fuite et collision de variantes possibles si réutilisé | cache séparé/versionné, tests offline au POC/C3 |
| Volume iPad | faux acquis possibles sur format, mémoire, hébergement, seuils | POC A1/A2 avant visuel final et architecture irréversible |
| Patrimoine local | IndexedDB/Blobs de production irremplaçables | lot documentaire uniquement, aucune action destructive |
| Écart géographique/lore | conflit possible entre placements validés à titre provisoire et fiches | remonter pour décision, jamais corriger en silence |

**Gate de conception A0** : ce document ne déclare ni l'architecture finale V7 ni les détails A2 acquis. Le contrôle d'intégrité du registre et la comparaison de périmètre de la PR sont consignés dans V6-MAP-A0-CONTRAT.md. **STOP A0 : ne pas commencer A1 sans validation explicite de la Gate.**
