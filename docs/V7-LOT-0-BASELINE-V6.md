# V7 Lot 0 — Baseline V6

## Objectif
Établir une base V6 stable avant toute évolution backend.

## Préconditions
- Lire `docs/V7-CLOUDFLARE-BACKEND.md`.
- Les travaux de fin V6 sont terminés ou explicitement acceptés comme baseline.

## Travaux
- Vérifier l'état du repo et la branche de production.
- Identifier le commit exact qui devient la baseline V7.
- Vérifier que la régression rembg et les optimisations visuelles attendues sont terminées ou hors périmètre.
- Vérifier que l'application démarre correctement.
- Vérifier que l'IndexedDB de production n'a subi aucune migration destructive.
- Vérifier les tests existants pertinents.
- Créer une référence claire de baseline selon la stratégie Git retenue.
- Mettre à jour la documentation V7 avec le commit de référence.

## Interdictions
- Aucun backend.
- Aucune ressource Cloudflare créée pour V7.
- Aucun changement de modèle de données.
- Aucune suppression IndexedDB.

## Gate
Le lot est validé si :
- une baseline V6 stable et identifiable existe ;
- les travaux V6 sont séparés de V7 ;
- aucun chantier backend n'est mélangé à la fin V6.

## Livrable
Baseline Git de départ et statut du lot mis à jour.
