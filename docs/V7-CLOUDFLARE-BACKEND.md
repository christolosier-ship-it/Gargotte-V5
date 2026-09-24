# Gargottex V7 — Backend Cloudflare

## Statut
DOCUMENT MAÎTRE — architecture cible et contrat de chantier V7.

## Objectif
Faire évoluer Gargotte d'une PWA local-first reposant sur IndexedDB vers une application backend-first dont la source de vérité est Cloudflare.

Architecture cible :

    Gargotte PWA
        |
    Cloudflare Access
        |
    Worker API Gargotte
        |-- D1 : données structurées
        '-- R2 : médias actifs

IndexedDB n'est plus la source de vérité à l'issue de la migration. Les fonctions de migration sont temporaires et doivent être supprimées une fois la bascule validée.

## Principes non négociables
- Les données IndexedDB de production existantes sont irremplaçables tant que la migration n'est pas vérifiée.
- Aucun lot ne doit supprimer, vider ou réinitialiser IndexedDB avant la fin validée de V7.
- Les IDs existants doivent être conservés.
- Les propriétés historiques ou inconnues doivent être préservées lorsque leur enregistrement est migré.
- La migration média se fait fichier par fichier, avec reprise et contrôle d'intégrité.
- La sauvegarde ZIP V6 n'est pas un prérequis de migration.
- Le backend Cloudflare ne devient source de vérité qu'après validation des données structurées et des médias attendus.
- Les écrans et états de migration sont provisoires et supprimés au lot final.

## Politique média V7
Le périmètre binaire à migrer est volontairement réduit.

R2 reçoit uniquement :
- les images détourées actives ;
- les images de Donjons, seules images actives non détourées.

Ne pas migrer :
- anciens originaux à fond blanc ;
- anciens thumbnails issus de ces originaux ;
- anciennes previews issues de ces originaux.

Les originaux de sécurité sont conservés hors application sur Google Drive.

Les anciens Blobs peuvent rester provisoirement dans IndexedDB pendant la migration, mais leur présence locale ne les rend pas éligibles à R2.

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
- media_assets utiles au catalogue actif

Stores techniques locaux meta et logs ne doivent pas être transposés mécaniquement.

## Relations existantes à préserver
- creatures.dungeon_id
- quests.dungeon_id
- quests.npc_id
- loot_items.creature_id
- interactables.dungeon_id
- brouhaha_effects.dungeon_id
- relation média active entity_type + entity_id

## Cible données
D1 devient la source de vérité des données structurées et des métadonnées des médias actifs.

Le modèle cible précis est défini au Lot 1. Il ne doit pas reproduire inutilement les variantes historiques exclues de la migration.

## Cible médias
R2 stocke uniquement le binaire visuel actif attendu.

Le modèle doit permettre au minimum :
- une clé de stockage ;
- le type de visuel : transparent ou dungeon_original ;
- mime_type ;
- size ;
- width ;
- height ;
- sha256 ;
- entity_type ;
- entity_id ;
- identifiant média stable lorsque pertinent.

Une image détourée migrée doit rester la source haute qualité. Les variantes d'affichage temporaires de V6-Fast ne font pas partie du patrimoine à migrer sauf décision ultérieure explicite.

## Authentification et autorisation
Cloudflare Access assure l'authentification.
Le Worker vérifie l'identité.
D1 gère les rôles applicatifs si nécessaire : admin, editor, reader.

Aucune clé D1/R2 ne doit être exposée au navigateur.

## Migration
Données structurées :
- migration contrôlée vers D1 ;
- conservation stricte des IDs ;
- vérification des comptes, relations et champs.

Médias actifs :
- sélectionner explicitement la source éligible ;
- calcul SHA-256 local ;
- upload R2 ;
- vérification côté cible ;
- métadonnées D1 ;
- statut de migration ;
- reprise après interruption ;
- aucune suppression locale automatique.

Un ancien original blanc non migré est un élément volontairement hors périmètre, pas une erreur.

## Bascule
Avant bascule :
- données structurées vérifiées ;
- tous les médias actifs attendus migrés ou explicitement qualifiés ;
- aucun échec silencieux ;
- API complète et testée ;
- Access validé ;
- D1/R2 validés.

Après bascule :
- Cloudflare devient la source de vérité ;
- IndexedDB reste intact provisoirement comme filet de sécurité ;
- aucun write métier normal ne continue dans IndexedDB.

## Découpage
- Lot 0 : baseline V6
- Lot 1 : architecture et contrat V7
- Lot 2 : infrastructure Cloudflare
- Lot 3 : API Worker et auth
- Lot 4 : migration données structurées
- Lot 5 : migrateur médias actifs
- Lot 6 : migration réelle des médias actifs
- Lot 7 : bascule backend-first
- Lot 8 : nettoyage de la migration

## Règle de reprise de session
Au début de chaque lot :
1. lire ce document maître ;
2. lire uniquement le document du lot ;
3. vérifier l'état réel du repo et des services ;
4. vérifier les livrables du lot précédent ;
5. ne pas anticiper les lots suivants sauf nécessité.

En fin de lot :
1. exécuter les tests du périmètre ;
2. vérifier la Gate ;
3. mettre à jour le statut du lot ;
4. documenter les écarts et décisions ;
5. laisser le système stable.

## STOP obligatoires
STOP sécurité données si :
- risque de perte IndexedDB ;
- divergence de comptage inexpliquée ;
- collision d'ID ;
- hash d'un média actif incohérent ;
- upload non vérifié ;
- suppression locale avant validation distante.

STOP validation si :
- le lot précédent n'est pas validé ;
- une dépendance Cloudflare essentielle n'est pas opérationnelle ;
- une anomalie majeure rend la suite dangereuse.

## Hors périmètre V7
- refonte visuelle ;
- nouvelle campagne de détourage ;
- migration des anciens originaux blancs/thumbnails/previews ;
- fonctionnalités gameplay sans rapport avec le backend.
