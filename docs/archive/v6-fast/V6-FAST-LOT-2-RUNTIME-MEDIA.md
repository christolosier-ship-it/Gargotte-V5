> **ARCHIVE — chantier V6-Fast clos et fusionné dans V5.3 le 25/09/2026.**
>
> Historique technique uniquement. Ce document n'est plus normatif pour les travaux courants.

# V6-Fast Lot 2 — Runtime média lazy

## Statut

**CLOS — Gate validée le 24/09/2026.**

## Objectif
Supprimer le chargement global des médias et mettre en place une couche d'accès média à la demande, compatible avec le futur backend V7.

## Préconditions
- Lire docs/archive/v6-fast/V6-FAST.md.
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


## Bilan d'exécution — 24/09/2026

### Architecture mise en place
- `loadAllData()` exclut désormais `media_assets`.
- Aucun changement de `DB_VERSION` et aucun nouveau store IndexedDB.
- Ajout de `src/storage/media-repository.js`.
- Le repository conserve uniquement des métadonnées légères dans le runtime.
- Les lectures complètes de records média sont réservées aux besoins explicites : visuel actif, téléchargement original ou backup complet.
- Les index existants `entity_id` et `path` sont utilisés pour les lectures ciblées.
- Le catalogue Média est parcouru uniquement lorsque la vue Média/Codex Média en a besoin, puis les Blobs ne sont pas conservés dans le catalogue runtime.

### Cycle de vie des visuels
- dérivé transparent approuvé : actif ;
- original Donjon : actif ;
- ancien original blanc / thumb / preview : stockage historique uniquement, sans fallback visuel normal ;
- Object URL : création à la demande ;
- changement de vue ou de famille Codex : révocation des Object URLs et remise à zéro du contexte média ;
- retour ultérieur : nouvelle URL éphémère créée à partir du Blob toujours intact.

Le runtime ne dépend donc plus de la persistance d'une URL `blob:` entre deux écrans.

### Écritures ciblées
Les opérations Média suivantes ne déclenchent plus `refreshData()` :
- upload d'un média ;
- rattachement/changement de famille-entité ;
- rafraîchissement de la bibliothèque Média.

Une instrumentation de test expose temporairement les compteurs runtime via `__GARGOTTEX_MEDIA_DEBUG__`.

### Correctif découvert pendant la validation
La première Fast CI a mis en évidence qu'un chargement média asynchrone pouvait déclencher un `render()` pendant la saisie d'un champ Bestiaire et remplacer l'input actif.

Correction :
- un rendu provoqué uniquement par l'arrivée d'un média est différé tant qu'un `input`, `textarea`, `select` ou `contenteditable` de l'application est actif ;
- la saisie et sa persistance restent prioritaires.

Le test historique de persistance Bestiaire repasse sans assouplissement.

### PWA
- version application : **5.6.2** ;
- cache : `gargottex-v6-fast-media-runtime-v1` ;
- `media-repository.js` fait partie du cœur offline ;
- la Full CI est déclenchée quand ce module change.

### Mesures validées
Fast CI finale :
- **12/12 tests** ;
- **37,2 s Playwright** ;
- nouveau test d'invariants runtime média : OK.

Full CI finale :
- **22/22 tests** ;
- **1,1 min Playwright** ;
- 48 vrais Blobs PNG transparents 768×768 : OK ;
- ouvertures plein écran répétées : OK ;
- migration IndexedDB historique : OK ;
- Service Worker / offline : OK ;
- WebKit iPad : OK.

### Invariants vérifiés automatiquement
Au bootstrap standard :
- `catalogScans = 0` ;
- `fullRecordReads = 0` ;
- `objectUrlsCreated = 0` ;
- `liveObjectUrls = 0`.

Après consultation ciblée :
- lecture par entité sans scan du catalogue complet ;
- création d'Object URL seulement lorsque le visuel actif est demandé.

Après changement de contexte vers l'Accueil :
- `liveObjectUrls = 0`.

Après rattachement d'un média :
- compteur `refreshDataCalls` inchangé ;
- Blob original présent et taille non nulle ;
- relation persistée.

### Écart volontaire vers le Lot 3
Le Lot 2 ne virtualise pas encore les grilles Média.

Le catalogue peut donc contenir plusieurs centaines de métadonnées et le DOM peut encore monter toutes les cartes. Le chargement binaire est désormais lazy, mais le bornage du nombre de cartes DOM et le cycle de vie par carte appartiennent au Lot 3.

## Gate — résultat
- aucun Blob média global au démarrage : **OK**
- `rebuildMediaCache()` supprimé : **OK**
- lectures ciblées : **OK**
- priorité des détourages : **OK**
- Donjons non détourés conservés : **OK**
- anciens originaux blancs hors chemin d'affichage normal : **OK**
- petites écritures sans `refreshData()` global : **OK**
- Object URLs révocables et libérées entre contextes : **OK**
- IndexedDB et Blobs existants intacts : **OK**
- PWA/offline : **OK**
- Fast CI : **OK**
- Full CI ciblée : **OK**
- couche compatible avec futur D1/R2 : **OK**

**Lot 2 validé.**
