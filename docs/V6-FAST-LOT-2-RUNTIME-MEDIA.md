# V6-Fast Lot 2 — Runtime média lazy

## Objectif
Supprimer le chargement global des médias et mettre en place une couche d'accès média à la demande, compatible avec le futur backend V7.

## Préconditions
- Lire docs/V6-FAST.md.
- Lot 1 validé.
- Inspecter src/storage/idb.js et src/app.js dans leur état réel.

## Contraintes
- Aucun nouveau store IndexedDB uniquement pour cette optimisation.
- Aucun reset de base.
- Aucun Blob existant supprimé ou réécrit.
- Exploiter les index déjà présents sur media_assets : entity_type, entity_id et path.
- Les détourages validés restent prioritaires.
- Les Donjons utilisent leur image non détourée.
- Les anciens originaux blancs/thumbnails ne redeviennent jamais un fallback visuel normal.

## Travaux

### 1. Sortir media_assets de loadAllData
Le bootstrap métier ne doit plus faire getAll sur media_assets.

state.data ne doit plus exiger la présence de tous les enregistrements média complets pour fonctionner.

Adapter les index/relations applicatifs qui supposent aujourd'hui cette présence.

### 2. Ajouter des lectures IndexedDB ciblées
Étendre la couche storage avec des primitives adaptées, par exemple :
- lecture par index path ;
- lecture par entity_type / entity_id ;
- lecture paginée ou par curseur pour la bibliothèque Média ;
- count sans getAll ;
- lecture récente des logs via l'index created_at avec limite.

Les signatures exactes sont libres, mais aucune fonction ne doit charger toute la bibliothèque quand une seule image ou une page est demandée.

### 3. Introduire un MediaRepository
Créer une abstraction claire entre les vues et IndexedDB.

Responsabilités :
- résoudre le média actif d'une entité ;
- charger les métadonnées nécessaires à une vue ;
- charger le Blob visuel uniquement à la demande ;
- appliquer la règle de choix du visuel ;
- exposer une API suffisamment neutre pour que V7 puisse remplacer IndexedDB par D1/R2.

Éviter que les vues continuent à lire directement asset.blob ou asset.transparent_blob partout dans app.js.

### 4. Règle de visuel actif
Ordre obligatoire :
1. dérivé transparent validé quand il existe ;
2. pour un Donjon, image non détourée correspondante ;
3. sinon aucun visuel actif et fallback UI neutre.

Ne pas revenir automatiquement à l'ancien original blanc.

Conserver les anciennes données en stockage local, mais les sortir du chemin de rendu.

### 5. Supprimer rebuildMediaCache global
Aucune boucle au bootstrap ne doit créer les Object URLs des médias.

Créer les Object URLs uniquement quand un consommateur en a besoin.

À ce stade, une petite cache à la demande est acceptable si :
- elle ne se remplit pas avec toute la base au démarrage ;
- elle est vidée lors de changements de contexte pertinents ;
- chaque URL peut être révoquée proprement ;
- elle n'oblige pas encore le Lot 3 à utiliser une URL révoquée.

Le bornage fin par cycle de vie DOM sera finalisé au Lot 3.

### 6. Remplacer refreshData pour les petites écritures
Une modification d'un seul média ne doit plus :
- relire tous les stores ;
- reconstruire tous les index ;
- recréer toutes les URLs ;
- rerendre toute l'application.

Mettre à jour localement l'enregistrement ou le cache concerné.

Conserver un refresh complet uniquement pour les opérations qui le nécessitent réellement, avec justification.

### 7. Préparer les tests V6-Fast
Ajouter des invariants déterministes :
- aucun getAll media_assets au bootstrap ;
- aucune Object URL média créée pendant un démarrage sans image demandée ;
- charger une image d'entité ne lit pas toute la bibliothèque ;
- rattacher ou modifier un média ne relit pas toute la base ;
- transparent prioritaire ;
- Donjon non détouré autorisé ;
- original blanc non utilisé comme fallback normal.

## Mesures
Avant/après, documenter au minimum :
- nombre de lectures media_assets au bootstrap ;
- nombre d'Object URLs immédiatement après démarrage ;
- comportement après une petite écriture média.

Éviter d'inventer un seuil de RAM précis si le navigateur ne permet pas une mesure fiable.

## Gate
Le lot est validé si :
- le démarrage n'a plus besoin de charger tous les Blobs médias ;
- rebuildMediaCache global a disparu ;
- les lectures sont ciblées ;
- la priorité des détourages est préservée ;
- les Donjons restent correctement illustrés ;
- les petits writes ne déclenchent plus refreshData global ;
- IndexedDB et ses données sont intacts ;
- la Fast CI passe ;
- la couche d'accès média peut raisonnablement être remplacée par D1/R2 en V7.
