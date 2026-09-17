# Fondation des originaux médias — gate Phase 1 révisée

Le 16 septembre 2026, l’utilisateur a confirmé la nouvelle spécification de `V5.3` : sauvegarde des originaux dans Postgres, sans recompression. Arrêt demandé à la prochaine gate validée. La prochaine gate est la Phase 1 révisée ; l’outbox média, les transferts applicatifs et la restauration appartiennent à la Phase 2.

## Modèle retenu

- `media_assets` reste la fiche métier structurée. Les blobs restent interdits dans son JSONB et dans les révisions.
- `media_originals` décrit un original : propriétaire, id média, taille, SHA-256 attendu, MIME, taille/nombre de morceaux, date de vérification.
- `media_blob_chunks` contient les octets `BYTEA`, indexés par `(user_id,media_id,chunk_index)` ; aucune conversion de format.
- Morceaux de 256 Kio ; dernier morceau de taille exacte. Les clés étrangères composites empêchent de rattacher les octets au média d’un autre propriétaire.
- Un original est immuable par id média. Un remplacement utilisera un nouvel id logique, comme l’import actuel de fichiers. Pas de déduplication physique entre médias ni d’historique binaire dans `entity_revisions`.
- `verify_media_original(media_id)` vérifie côté serveur le nombre de morceaux, la taille totale et le SHA-256 de la concaténation ordonnée avant de renseigner `verified_at`. L’appel est authentifié, propriétaire et répétable.
- L’insertion de morceaux et la vérification verrouillent le même manifeste pour exclure une finalisation concurrente avec un transfert incomplet.
- Les clients ne peuvent ni déclarer `verified_at` eux-mêmes, ni modifier les octets en place, ni supprimer physiquement les données. Le tombstone de `media_assets` masque aussi originaux et morceaux.

## Limite explicite à traiter dans la Phase 2

La vérification SQL rassemble l’original en mémoire ; la taille distante maximale de ce premier modèle est donc fixée à **64 Mio par original**. Cela limite le travail serveur, sans limiter l’enregistrement local. La Phase 2 doit afficher le refus de transfert au-delà de cette taille, conserver l’original local et ne jamais afficher « sauvegardé ». Si l’inventaire réel exige davantage, une nouvelle migration et une vérification incrémentale seront nécessaires avant sa sauvegarde.

Les morceaux sont immuables : une erreur d’intégrité reste une erreur, jamais un succès. La Phase 2 doit relire/comparer les morceaux existants pour reprendre un upload ; un contenu différent nécessite un nouvel id logique ou une opération contrôlée supplémentaire, jamais l’écrasement d’un original vérifié.

## Préservation locale

L’ancien import redimensionnait/recompressait le fichier principal en WebP. Les nouveaux imports conservent désormais le Blob original, le MIME, la taille, les dimensions et l’extension ; seul le dérivé miniature passe par le canvas. Le MIME de miniature est distinct, y compris pour l’export/import ZIP existant.

Les fichiers déjà recompressés par V5 ne peuvent pas retrouver les octets de leur fichier source perdu. La migration doit préserver les octets effectivement présents et signaler cette provenance, sans prétendre reconstituer l’original antérieur. Aucun média existant n’est réencodé ni remplacé par cette mise à jour.

## Environnement branch-first

Projet `young-bread-85335056`, nouvelle branche `v6-media-foundation-validation` / `br-falling-violet-b4am8hbo`, enfant de `br-wandering-bread-b48avojm`. Elle hérite des deux migrations structurées, Auth et Data API. La migration `20260916121000_media_originals.sql` y est appliquée en transaction. Production et branche utilisée par la preview structurée inchangées.

Le connecteur `prepare_database_migration` ne permet toujours pas de choisir ce parent déjà préparé : branche enfant explicite puis `run_sql_transaction`, comme pour la fondation précédente. Aucune promotion à cette gate.

## Validation reproductible

`npm test` couvre la conservation des octets locaux, l’upgrade V5, les exports et la synchronisation structurée. `npm run build` inclut le nouveau module dans le précache PWA.

Le script `scripts/verify-media-foundation.mjs` attend `NEON_TEST_API_URL` et `NEON_TEST_ACCOUNTS` (fichier privé de deux comptes jetables, hors dépôt). Il teste via Data API et JWT réels : octets multi-chunks, PNG/JPEG réels, hash, morceaux invalides/manquants, vérification répétée, interdiction de falsifier la date de vérification, accès anonyme/autre propriétaire, immutabilité et tombstones. Il est un banc de test du schéma, pas le moteur de transfert de l’application.

## Résultat de gate

**Phase 1 révisée validée le 16 septembre 2026.** Neuf tests locaux réussis, build réussi, douze tables RLS contrôlées. Le script HTTP avec JWT réels a terminé sans erreur : multi-chunks, PNG 58 161 octets, JPEG 352 290 octets, hash invalide, chunks incomplets, isolation et tombstones. Le transfert via Data API transporte donc bien les `BYTEA` sans altération ; le moteur applicatif et ses retries restent à développer. Les checks GitHub et l’état de la preview du commit final sont reportés dans la PR #9.

## Suite, non exécutée à cette gate

Outbox média dédiée, calcul SHA-256 client, upload/reprise, statut et erreurs, restauration vérifiée à la demande, gestion des quotas locaux, puis validation complète Phase 2. Les originaux ne sont pas encore automatiquement sauvegardés par la PWA.
