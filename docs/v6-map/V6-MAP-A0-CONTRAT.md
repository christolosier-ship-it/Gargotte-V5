# V6-Map A0 — Contrat technique, géographique et sécurité
Statut initial : À FAIRE. Lot documentaire autonome. Référence impérative : V6-MAP-MAITRE.md et AGENTS.md.

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