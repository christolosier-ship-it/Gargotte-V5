# V7 Lot 1 — Architecture et contrat backend

## Objectif
Définir complètement l'architecture V7 avant toute création de ressources Cloudflare.

## Préconditions
- Lire docs/V7-CLOUDFLARE-BACKEND.md.
- Lot 0 validé.
- Prendre en compte la couche média issue de V6-Fast si elle est déjà en production.

## Analyse obligatoire
Inspecter au minimum :
- AGENTS.md
- src/storage/idb.js
- la couche d'accès média V6-Fast
- src/app.js
- service-worker.js
- le modèle réel de media_assets
- les tests IndexedDB existants

## À définir

### D1
Établir le schéma cible pour les entités métier et les media_assets réellement utiles au catalogue actif.

Définir :
- types ;
- clés primaires ;
- index ;
- contraintes ;
- relations ;
- stratégie pour propriétés inconnues/historiques ;
- timestamps ;
- suppression ;
- compatibilité avec les IDs actuels.

### R2
Définir le modèle pour un seul patrimoine binaire actif :
- dérivés transparents actifs ;
- images de Donjons non détourées.

Ne pas modéliser comme obligations de migration :
- originaux blancs ;
- thumbnails historiques ;
- previews historiques.

Définir :
- nommage des objets ;
- clé de stockage ;
- visual_kind transparent ou dungeon_original ;
- métadonnées ;
- SHA-256 ;
- doublons ;
- médias orphelins ;
- règles d'éligibilité exactes.

### Worker API
Définir endpoints, méthodes, payloads, erreurs, CRUD, upload, vérification et lecture média.

### Access et rôles
Définir authentification, durée de session, contrôle côté Worker, rôles et droits.

### Migration
Définir précisément :
- données structurées ;
- sélection des médias actifs ;
- statuts ;
- reprise ;
- idempotence ;
- contrôle d'intégrité ;
- éléments volontairement ignorés ;
- critères de bascule.

### IndexedDB après bascule
Décider :
- cache local ou aucun cache métier ;
- données conservées provisoirement ;
- moment où les anciens Blobs exclus de V7 deviennent supprimables ;
- moment où le code IndexedDB devient supprimable.

## Interdictions
- Ne pas créer D1/R2/Worker/Access.
- Ne pas modifier la persistance applicative.
- Ne pas commencer la migration.
- Ne pas réintroduire la migration des originaux blancs ou de leurs dérivés historiques.

## Gate
Le lot est validé si aucun lot suivant n'a besoin d'inventer une décision majeure d'architecture et si le périmètre R2 reste limité aux visuels actifs définis par le maître.

## Livrable
Mettre à jour ce document avec les décisions finales et ajouter un schéma technique si nécessaire.
