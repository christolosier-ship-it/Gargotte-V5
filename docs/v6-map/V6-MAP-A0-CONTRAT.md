# V6-Map A0 — Contrat technique, géographique et sécurité
Statut initial : À FAIRE. Lot documentaire autonome.
Statut au 27/09/2026 : A0 EXÉCUTÉ, Gate VERTE documentaire (réserves explicites ci-dessous). Référence impérative : V6-MAP-MAITRE.md et AGENTS.md.

## Objectif
Transformer les décisions du maître en contrats vérifiables avant toute implémentation ou image finale. Ne pas refaire le lore, ne pas déployer de ressource et ne pas créer de table à ce stade.

## Préconditions et lecture ciblée
Lire le maître, AGENTS.md, docs/V7-CLOUDFLARE-BACKEND.md, la progression réelle de V7, src/storage/idb.js, src/app.js, service-worker.js, interfaces Codex et tests existants. Vérifier branche et absence d'implémentation Atlas concurrente. Les stocks/médias locaux restent irremplaçables.

## Travail à réaliser
1. Produire le registre canonique des quatre cartes, des sept continents, des 42 régions, des océans/mers, des sept merveilles et des 15 placements V1. Pour chaque entrée indiquer son statut validé/provisoire/réservé et son identifiant indépendant du libellé.
2. Définir contrat de coordonnées par carte (0..100, ratio réel non équivalent pour X/Y, fonds et surcouches co-enregistrés), modèle de marqueur, de nom, lien entity_type + entity_id du Codex sans changer l'ID métier. Préciser absence de coordonnées dans le modèle existant et ne pas écrire sur les enregistrements de production.
3. Contrat d'images : illustrations sans texte/secret, source géographique maîtresse, pyramide de résolutions et enrichissements locaux, manifest versionné et règles d'invalidation. Taille/fichiers/moteur encore ouverts jusqu'à A2.
4. Décrire API conceptuelle de lecture publique/MJ et découverte par campagne ; analyser l'état V7 réel avant de proposer un schéma. Aucun nouveau store/table/API effectif dans A0.
5. Définir la politique offline : 4 fonds basiques, détails opportunistes, cache des tuiles distinct, aucune garantie indue des caches secondaires. Exclure les tuiles du périmètre binaire migratoire V7 historique.
6. Dresser inventaire des ambiguïtés sans les corriger silencieusement : contours et ratio réel, détails des deux sorties de Mer des Trois Couronnes, labels secondaires restants, portails non localisés, géolocalisation définitive des donjons, campagnes/rôles réels et secrets.

## Livrables
Une annexe de contrats et d'arbitrages techniques sous docs/v6-map/ (nom à choisir sans recopier le maître), table de traçabilité des 15 liens et courte note de risques ; mettre à jour le maître uniquement si une nouvelle décision durable est validée.

## Tests / Gate A0
Vérifier l'existence du registre complet (7 continents, 42 régions, 7 merveilles, 4 cartes, 15 donjons) et exactitude des statuts ; aucun portail inventé ; cohérence coordonnées et identifiants ; plan de protection anti-fuite ; aucun changement de runtime, de V7 ou d'IndexedDB. Gate ROUGE en cas de choix architectural majeur implicite, contradiction non signalée ou perte potentielle de données.

## Reprise et limites
Laisser une conclusion Gate/écarts dans le suivi documentaire ; ne pas lancer A1 sans validation A0. Ne pas modifier AGENTS.md ou un autre document maître sans besoin motivé et borné.
## Compte rendu d'exécution / Gate A0 — 27/09/2026

**Branche dédiée** : docs/v6-map-a0-contrat (cible V5.3). **Livrable** : [V6-MAP-A0-ANNEXE-CONTRATS.md](V6-MAP-A0-ANNEXE-CONTRATS.md). Aucun changement du maître n'était requis : aucune décision durable nouvelle sur format, moteur, stockage, campagnes ou lore n'a été prise.

**Pré-check** : AGENTS.md, maître V6-Map, maître V7, cahiers V7 Lot 0/1 et progression Git, idb.js, app.js, MediaRepository, service-worker.js, tests Fast/Full et seed examinés. Base V6 locale DB_VERSION=2, neuf familles métier dont media_assets, plus meta/logs ; aucun store Atlas/campagne constaté. V7 présent sous forme de documentation dans l'arbre examiné ; aucun backend réel ni rôle de campagne présumé. Comparaison de la PR V6-Map de cadrage #54 et absence d'autre implémentation Atlas dans la branche de départ.

**Contrôle statique du registre en annexe** :
- 4 cartes, 7 continents, 42 régions, 4 océans et 5 mers, 7 merveilles, 15 placements : OK ;
- 84 identifiants Atlas déclarés, 84 distincts : OK ; IDs indépendants des libellés ; géographie et coordonnées provisoires indiquées ;
- 0 portail inscrit ou déduit : OK ; toutes extrémités et positions de portails réservées ;
- les quinze placements restent V1 PROVISOIRES, les IDs dungeons de production non supposés ; D1/seed divergent, seed à deux donjons ≠ base de production : écart tracé ;
- modèle de liens entity_type + entity_id, co-enregistrement du fond/surcouches, géographie mère, manifest et cache séparé : formalisés sans implémentation ;
- politique de lecture et recherche filtrées côté serveur, découverte MJ par campagne, absence de fuite HTML/JSON/JS/URL/cache/tuile : formalisée ; campagne et rôles V7 réels à contrôler avant C2 ;
- aucune décision implicite sur tuiles, moteur, format, hébergement, contour, portail, position finale ou schéma D1 : OK, points réservés listés ;
- aucun test navigateur / iPad / runtime requis ou revendiqué pour ce lot documentaire : les mesures réelles relèvent de A1/A2.

**Gate A0 : VERTE (documentaire)**. Les écarts restants sont explicitement réservés aux lots concernés et ne se transforment pas en données canoniques par cette Gate. Le respect du périmètre est constaté par le diff GitHub : annexe et mise à jour du présent cahier uniquement ; aucune mutation du runtime, service worker, tests, V7, IndexedDB ou Blobs. Pas de déploiement, pas de fusion automatique. **ARRÊT à la Gate A0 : ne pas exécuter A1 dans ce lot.**
