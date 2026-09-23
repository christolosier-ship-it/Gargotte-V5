# Gargottex V7 — Backend Cloudflare

## Statut
DOCUMENT MAÎTRE — architecture cible et contrat de chantier V7.

## Objectif
Faire évoluer Gargotte d'une PWA local-first reposant sur IndexedDB vers une application backend-first dont la source de vérité est Cloudflare.

Architecture cible :

```text
Gargotte PWA
    |
Cloudflare Access
    |
Worker API Gargotte
    |-- D1 : données structurées
    `-- R2 : médias
```

IndexedDB n'est plus la source de vérité à l'issue de la migration. Les fonctions de migration sont temporaires et doivent être supprimées une fois la bascule validée.

## Principes non négociables
- Les données IndexedDB de production existantes sont irremplaçables tant que la migration n'est pas vérifiée.
- Aucun lot ne doit supprimer, vider ou réinitialiser IndexedDB avant la fin validée de V7.
- Les IDs existants doivent être conservés lors de la migration.
- Les propriétés historiques ou inconnues doivent être préservées.
- Les originaux médias sont prioritaires et ne doivent jamais être remplacés par un dérivé.
- La migration média se fait fichier par fichier, avec reprise après interruption et contrôle d'intégrité.
- La sauvegarde ZIP V6 n'est pas une voie de migration fiable et ne doit pas être utilisée comme prérequis.
- Le backend Cloudflare ne devient source de vérité qu'après validation complète des données structurées et des médias.
- Les écrans, états et fonctions de migration sont provisoires et doivent être retirés au lot final.

## Périmètre fonctionnel
Données métier à migrer :
- dungeons
- creatures
- heroes
- npcs
- quests
- loot_items
- interactables
- brouhaha_effects
- media_assets

Stores techniques locaux :
- meta
- logs

Ils ne doivent pas être transposés mécaniquement dans D1. Leur utilité doit être réévaluée.

## Relations existantes à préserver
- creatures.dungeon_id
- quests.dungeon_id
- quests.npc_id
- loot_items.creature_id
- interactables.dungeon_id
- brouhaha_effects.dungeon_id
- media_assets.entity_type + entity_id

## Cible données
D1 devient la source de vérité des données structurées et des métadonnées médias.

Le modèle cible doit être documenté précisément au Lot 1 avant toute création de ressource Cloudflare.

## Cible médias
R2 stocke les fichiers binaires.

Le modèle média cible doit privilégier :
- original_key
- thumbnail_key
- preview_key
- transparent_key lorsqu'un dérivé transparent existe
- mime_type
- size
- width
- height
- sha256
- entity_type
- entity_id

Le moteur rembg n'existe plus dans l'application, mais ses résultats font partie des médias de production. Les `transparent_blob` et métadonnées `transparent_*` existants doivent être préservés et migrés comme variantes média lorsque présents. Ils ne doivent jamais être supprimés ou ignorés au seul motif que le moteur de génération a été retiré.

## Authentification et autorisation
Cloudflare Access assure l'authentification.
Le Worker vérifie l'identité.
D1 gère les rôles applicatifs si nécessaire, par exemple :
- admin
- editor
- reader

Aucune clé D1/R2 ne doit être exposée au navigateur.

## Migration
La migration est une phase temporaire.

Données structurées :
- migration contrôlée vers D1 ;
- conservation stricte des IDs ;
- vérification des comptes, relations et champs.

Médias :
- lecture Blob IndexedDB ;
- calcul SHA-256 local ;
- upload R2 ;
- vérification côté cible ;
- métadonnées D1 ;
- statut de migration ;
- reprise après fermeture/interruption ;
- aucune suppression locale automatique.

## Bascule
Avant bascule :
- données structurées vérifiées ;
- médias attendus migrés ou explicitement qualifiés ;
- aucun échec silencieux ;
- API complète et testée ;
- Access validé ;
- D1/R2 validés.

Après bascule :
- Cloudflare devient la source de vérité ;
- IndexedDB reste intact provisoirement comme filet de sécurité ;
- aucun write métier normal ne doit continuer dans IndexedDB.

## Découpage
- Lot 0 : baseline V6
- Lot 1 : architecture et contrat V7
- Lot 2 : infrastructure Cloudflare
- Lot 3 : API Worker et auth
- Lot 4 : migration données structurées
- Lot 5 : migrateur médias
- Lot 6 : migration réelle des médias
- Lot 7 : bascule backend-first
- Lot 8 : nettoyage de la migration

Chaque lot doit tenir dans une session de travail autant que possible et se terminer avec une Gate claire.

## Règle de reprise de session
Au début de chaque lot :
1. lire ce document maître ;
2. lire uniquement le document du lot à exécuter ;
3. vérifier l'état réel du repo et des services ;
4. vérifier les livrables du lot précédent ;
5. ne pas anticiper les lots suivants sauf si nécessaire pour éviter une dette ou un blocage.

En fin de lot :
1. exécuter les tests du périmètre ;
2. vérifier la Gate ;
3. mettre à jour le statut du document du lot ;
4. documenter les écarts et décisions ;
5. laisser le système dans un état stable.

## STOP obligatoires
STOP sécurité données si :
- risque de perte IndexedDB ;
- divergence de comptage inexpliquée ;
- collision d'ID ;
- hash média incohérent ;
- upload non vérifié ;
- suppression locale avant validation distante.

STOP validation si :
- le lot précédent n'est pas réellement validé ;
- une dépendance Cloudflare essentielle n'est pas opérationnelle ;
- une anomalie majeure rend la suite dangereuse.

## Hors périmètre V7
- refonte visuelle ;
- amélioration de la qualité d'affichage ;
- fonctionnalités gameplay sans rapport avec le backend.

Ces sujets appartiennent à la fin V6 ou à des chantiers futurs distincts.
