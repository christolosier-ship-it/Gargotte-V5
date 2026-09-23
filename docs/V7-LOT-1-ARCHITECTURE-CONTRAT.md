# V7 Lot 1 — Architecture et contrat backend

## Objectif
Définir complètement l'architecture V7 avant toute création de ressources Cloudflare.

## Préconditions
- Lire `docs/V7-CLOUDFLARE-BACKEND.md`.
- Lot 0 validé.

## Analyse obligatoire
Inspecter au minimum :
- `AGENTS.md`
- `src/storage/idb.js`
- `src/app.js`
- `service-worker.js`
- le modèle réel de `media_assets`
- les tests IndexedDB existants
- la documentation V6 encore utile comme historique

## À définir
### D1
Établir le schéma cible pour :
- dungeons
- creatures
- heroes
- npcs
- quests
- loot_items
- interactables
- brouhaha_effects
- media_assets
- users si nécessaire
- éventuelles tables techniques strictement justifiées

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
Définir :
- nommage des objets ;
- arborescence logique ;
- règles original/thumbnail/preview ;
- métadonnées ;
- contrôle SHA-256 ;
- comportement en cas de doublon ;
- gestion des médias orphelins.

### Worker API
Définir :
- endpoints ;
- méthodes ;
- payloads ;
- statuts HTTP ;
- validation ;
- erreurs ;
- règles CRUD ;
- upload média ;
- vérification média ;
- lecture média.

### Access et rôles
Définir :
- méthode d'authentification ;
- durée de session ;
- contrôle d'identité côté Worker ;
- rôles applicatifs ;
- droits par rôle.

### Migration
Définir précisément :
- données structurées ;
- médias ;
- statuts de migration ;
- reprise ;
- idempotence ;
- contrôle d'intégrité ;
- critères de bascule.

### IndexedDB après bascule
Décider :
- cache local ou aucun cache métier ;
- données éventuellement conservées localement ;
- moment où le code IndexedDB devient supprimable.

## Interdictions
- Ne pas créer D1/R2/Worker/Access.
- Ne pas modifier la persistance applicative.
- Ne pas commencer la migration.

## Gate
Le lot est validé si aucun lot suivant n'a besoin d'inventer une décision majeure d'architecture.

## Livrable
Mettre à jour ce document avec les décisions finales et, si utile, ajouter un schéma technique dédié référencé depuis le maître.
