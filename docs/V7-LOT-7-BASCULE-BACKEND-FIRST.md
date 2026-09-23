# V7 Lot 7 — Bascule backend-first

## Objectif
Faire de Cloudflare la source de vérité de Gargotte sans détruire l'IndexedDB historique.

## Préconditions
- Lire le maître V7.
- Lot 4 validé.
- Lot 6 validé.
- API du Lot 3 stable.
- Access, D1 et R2 opérationnels.

## Travaux
Introduire la couche d'accès distante prévue au Lot 1 et remplacer progressivement les accès métier IndexedDB.

La cible fonctionnelle est :
```text
UI Gargotte
   |
API Worker
   |-- D1
   `-- R2
```

Exigences :
- toutes les lectures métier normales viennent du backend ;
- toutes les créations/modifications/suppressions normales vont au backend ;
- aucun write métier normal ne doit continuer dans IndexedDB ;
- les IDs et relations restent stables ;
- l'UI conserve ses comportements métier existants ;
- les médias sont servis depuis la cible prévue ;
- l'auth est appliquée partout où nécessaire.

IndexedDB :
- ne pas le supprimer ;
- ne pas le vider ;
- ne pas le migrer destructivement ;
- le considérer comme sauvegarde historique temporaire tant que V7 n'est pas consolidée.

Tester :
- démarrage ;
- navigation Codex ;
- Atelier ;
- création ;
- modification ;
- suppression ;
- relations ;
- médias ;
- rechargement ;
- fermeture/réouverture ;
- iPad ;
- autre appareil si possible ;
- perte temporaire du réseau selon le comportement défini au Lot 1.

## Interdictions
- Ne pas nettoyer encore le code de migration.
- Ne pas supprimer IndexedDB.
- Ne pas faire plusieurs refontes UI simultanées.

## Gate
Cloudflare est la source de vérité réelle et Gargotte fonctionne sans dépendre d'IndexedDB pour les opérations métier normales.

## Livrable
V7 backend-first fonctionnelle, ancien stockage local encore intact.
