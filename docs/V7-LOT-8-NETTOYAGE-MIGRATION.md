# V7 Lot 8 — Nettoyage de la migration

## Objectif
Supprimer l'échafaudage temporaire de migration après validation de la V7 backend-first.

## Préconditions
- Lire le maître V7.
- Lot 7 validé.
- V7 utilisée et contrôlée suffisamment pour considérer la bascule fiable.
- Aucun besoin de relancer une migration.

## À retirer
Selon l'implémentation réelle :
- écran de migration ;
- boutons de migration ;
- statuts pending/uploading/verifying/migrated/failed propres au chantier ;
- code de lecture IndexedDB uniquement destiné à migrer ;
- code de reprise de migration ;
- diagnostics temporaires de migration ;
- doubles chemins local/remote devenus inutiles ;
- dépendances introduites uniquement pour le chantier.

## IndexedDB
Ne pas effacer automatiquement la base pendant ce lot sauf décision explicitement validée séparément.

L'objectif est d'abord :
- que le code de production n'en dépende plus ;
- que le migrateur disparaisse ;
- que l'architecture cible soit propre.

Un éventuel outil de purge locale doit être un chantier séparé et volontaire.

## Documentation
- marquer les Lots 0 à 8 comme terminés ;
- mettre à jour le maître V7 ;
- archiver les documents de migration si souhaité ;
- documenter l'architecture finale réelle.

## Gate finale
- aucune fonction de migration provisoire encore active ;
- aucune écriture métier IndexedDB ;
- backend Cloudflare seul maître des données ;
- tests V7 verts ;
- documentation finale cohérente.

## Livrable
Architecture V7 propre, sans dette de migration active.
