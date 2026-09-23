# V7 Lot 4 — Migration des données structurées

## Objectif
Copier et vérifier les données structurées IndexedDB vers D1 tout en laissant V6 comme source de vérité.

## Préconditions
- Lire le maître V7.
- Lot 3 validé.
- IndexedDB de production intact.

## Travaux
Construire un migrateur structuré capable de lire les stores métier existants et d'envoyer les données vers l'API V7.

Exigences :
- conserver exactement les IDs ;
- préserver les propriétés inconnues ou historiques selon la stratégie du Lot 1 ;
- ne pas reconstruire les objets depuis un sous-ensemble de champs visibles ;
- ne pas supprimer les données source ;
- rendre les opérations idempotentes ;
- journaliser les erreurs de façon exploitable.

Contrôles :
- nombre source/cible par famille ;
- liste des IDs manquants ;
- liste des IDs inattendus ;
- relations invalides ;
- collisions ;
- erreurs de sérialisation ;
- métadonnées médias sans transfert binaire à ce lot.

La source IndexedDB reste active après la migration.

## Interdictions
- Aucun média binaire R2 dans ce lot.
- Aucun passage backend-first.
- Aucun nettoyage IndexedDB.

## Gate
- Comptages cohérents.
- IDs cohérents.
- Relations cohérentes.
- Aucun échec silencieux.
- D1 contient une copie vérifiée des données structurées.

## Livrable
Copie D1 vérifiée et rapport de migration.
