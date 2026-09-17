> Archive historique Neon, figée lors du changement de cible du 17 septembre 2026. Les instructions de lancement, promotion et étapes restantes ci-dessous ne sont plus actives. Référence actuelle : [plan Google Drive](../../REFACTORISATION-V6-LOCAL-FIRST-GOOGLE-DRIVE.md).

# Gargottex V6 — Refactorisation Local-First + Neon + Vercel

## 0. Objet du document

Ce document est la **source de vérité technique** pour la refactorisation V6 de Gargottex vers une architecture :

- **GitHub** : code source, migrations SQL, documentation et historique ;
- **Vercel** : distribution de la PWA ;
- **IndexedDB** : base de travail locale, offline et immédiate ;
- **Neon / Lakebase Postgres** : sauvegarde distante et synchronisation des données structurées **et des originaux médias** ;
- **Neon Managed Better Auth** : authentification privée ;
- **Neon Data API** : accès client sécurisé aux données structurées via PostgreSQL, `GRANT` et RLS.

La V6 doit préserver la vocation de Gargottex : **codex personnel de consultation, d’édition, de réglage et d’équilibrage de Gargotte & Va-Nu-Pieds**, utilisable sans réseau.

Le cloud n’est pas le moteur de l’application. Il protège et synchronise ce qui existe localement.

Principe directeur :

> **Local d’abord, sauvegarde distante ensuite, aucune perte de qualité des médias.**

Neon remplace InsForge et Supabase dans cette architecture. Aucun second backend de données ou de médias ne doit être ajouté sans décision explicitement documentée.

---

# 1. État actuel à préserver

Branche de référence du chantier : `V5.3`.

Architecture actuelle principale :

- PWA HTML/CSS/JavaScript ES Modules ;
- pas de framework applicatif ;
- données persistées dans IndexedDB via `src/storage/idb.js` ;
- logique applicative principalement dans `src/app.js` ;
- données initiales dans `seed-data.js` ;
- service worker dans `service-worker.js` ;
- imports/exports XLSX existants ;
- fonctions JSON à conserver/compléter ;
- médias actuellement stockés localement, notamment sous forme de `Blob` / `thumb_blob` dans `media_assets` ;
- fonctionnement hors ligne après installation.

Stores existants :

- `dungeons`
- `creatures`
- `heroes`
- `npcs`
- `quests`
- `loot_items`
- `interactables`
- `brouhaha_effects`
- `media_assets`
- `meta`
- `logs`

Les formes de données réelles du code, les relations, les champs d’import et les comportements existants restent la référence. Ne pas inventer un nouveau modèle métier lorsque le modèle actuel peut être repris proprement.

---

# 2. Principes non négociables

## 2.1 Local-first

Une édition doit être enregistrée **localement immédiatement**, sans attendre Neon.

Parcours nominal :

```text
édition utilisateur
      ↓
IndexedDB immédiatement
      ↓
interface mise à jour
      ↓
outbox
      ↓
Neon dès que possible
```

Une coupure réseau ne doit pas empêcher :

- consultation des données locales ;
- création ;
- modification ;
- suppression ;
- utilisation du Codex ;
- utilisation des outils de partie ;
- ajout ou consultation d’un média déjà présent localement.

## 2.2 Aucune perte de données

La migration ne doit jamais écraser aveuglément les données existantes de l’iPad.

Tant que la migration et la synchronisation Neon ne sont pas entièrement validées, l’ancienne copie IndexedDB reste une source de récupération valide.

Aucune étape ne doit nécessiter d’effacer les données du navigateur pour « repartir proprement ».

## 2.3 Neon ne remplace pas IndexedDB

Neon devient la sauvegarde distante et la référence partagée entre installations.

**IndexedDB reste la base de travail locale de la PWA.**

Les lectures ordinaires et les saisies ne doivent pas dépendre d’un aller-retour réseau.

## 2.4 Application privée

Gargottex est une application personnelle.

Prévoir :

- Neon Managed Better Auth ;
- usage privé ;
- aucune inscription publique nécessaire ;
- RLS active sur toutes les tables exposées ;
- privilèges SQL `GRANT` limités ;
- aucun accès métier au rôle `anonymous` ;
- aucune chaîne de connexion PostgreSQL, mot de passe de rôle ou clé d’administration dans le navigateur, le dépôt, le service worker ou une variable Vercel publique ;
- sécurité basée sur Auth + PostgreSQL + RLS.

Avec Neon Data API, l’identité applicative est extraite du JWT via `auth.user_id()`.

## 2.5 Pas de refonte UI/UX dans le chantier technique

La refonte UI/UX est documentée séparément dans `docs/REFONTE-UI-UX-V6.md` et les étapes `UI-*`.

Sont autorisées dans le chantier technique uniquement les modifications UI indispensables au fonctionnement :

- connexion ;
- statut local/synchronisation ;
- erreur de synchronisation ;
- progression de transfert média ;
- migration/restauration nécessaire à la V6.

## 2.6 Médias originaux : aucune perte de qualité

La V6 **sauvegarde les originaux médias dans Postgres**.

Règle absolue :

> **Le fichier original distant doit être identique octet pour octet au fichier original local.**

Interdictions sur l’original :

- aucun resize ;
- aucune recompression ;
- aucune conversion automatique JPEG/WebP/AVIF ;
- aucune réduction de qualité ;
- aucune substitution de l’original par une miniature.

L’intégrité est vérifiée par **SHA-256**.

Une miniature est un dérivé d’affichage : elle peut être générée, supprimée ou régénérée sans modifier l’original.

## 2.7 Pas de second stockage média

La cible V6 n’utilise pas un bucket séparé comme source de vérité média.

Les originaux sont sauvegardés dans **Neon Postgres**, avec une représentation binaire `BYTEA` directe ou chunkée selon les contraintes techniques réelles du chemin d’upload.

Neon Object Storage n’est pas requis par cette architecture.

## 2.8 Exports indépendants du cloud

À conserver :

- XLSX existant ;
- XLSX global/par catégorie selon les capacités réelles ;
- JSON complet des **données structurées** ;
- imports correspondants.

L’export JSON structuré ne contient pas :

- originaux binaires ;
- miniatures binaires ;
- tokens ;
- secrets ;
- connexions ;
- stores techniques de synchronisation.

Cette séparation n’empêche pas les originaux d’être sauvegardés dans Neon. JSON et sauvegarde média sont deux mécanismes distincts.

---

# 3. Architecture cible

```text
                         GitHub
                code / docs / migrations
                           │
                           ▼
                         Vercel
                           │
                           ▼
                   ┌── Gargottex ──┐
                   │               │
              IndexedDB          Neon
              local-first     Postgres
                   │          ┌────┴───────────┐
                   │          │ données métier │
                   │          │ médias originaux│
                   │          └────┬───────────┘
                   └──── sync ─────┘

                   ↕ XLSX / JSON structuré
```

Responsabilités :

| Composant | Responsabilité |
|---|---|
| GitHub | code, migrations, documentation, historique |
| Vercel | distribution de la PWA |
| IndexedDB | données et médias locaux, offline, outbox |
| Neon Postgres | sauvegarde distante données + originaux médias |
| Better Auth | contrôle d’accès personnel |
| Data API / chemin média sécurisé | accès distant depuis la PWA |
| XLSX / JSON | exports structurés portables |

## 3.1 Intégration Neon

Le projet reste une PWA JavaScript ES Modules sans framework applicatif.

SDK cible pour Auth + Data API :

```bash
npm install @neondatabase/neon-js
```

Le navigateur ne reçoit jamais :

- `DATABASE_URL` ;
- `DATABASE_URL_UNPOOLED` ;
- mot de passe PostgreSQL ;
- clé d’administration Neon.

Si un chemin serveur Vercel minimal est nécessaire pour transférer proprement les binaires tout en gardant les secrets hors navigateur, il est autorisé à condition :

- de rester strictement limité au besoin média ;
- d’exiger l’identité authentifiée ;
- de respecter RLS / propriété utilisateur ;
- de ne pas créer un second stockage ;
- de stocker au final l’original dans Postgres ;
- de ne jamais réencoder l’original.

---

# 4. Modèle de données Neon

## 4.1 Tables métier

Créer les tables correspondant aux entités existantes :

- `dungeons`
- `creatures`
- `heroes`
- `npcs`
- `quests`
- `loot_items`
- `interactables`
- `brouhaha_effects`
- `media_assets`

Conserver les identifiants métier existants autant que possible.

Chaque table synchronisée dispose au minimum de métadonnées adaptées :

- `user_id`
- `created_at`
- `updated_at`
- `deleted_at` si suppression douce

Les relations existantes (`dungeon_id`, `creature_id`, `npc_id`, etc.) doivent rester cohérentes.

## 4.2 Métadonnées média

`media_assets` conserve les métadonnées métier du média, par exemple :

- `id`
- `user_id`
- `label`
- `file_name`
- `mime_type`
- `entity_type`
- `entity_id`
- `width`
- `height`
- `byte_size`
- `sha256`
- `created_at`
- `updated_at`
- `deleted_at`

Les champs exacts doivent être adaptés au code réel et aux migrations existantes.

## 4.3 Originaux médias

Stocker le binaire séparément des métadonnées afin que la synchronisation ordinaire du Codex ne transporte pas les images lourdes.

Architecture recommandée :

```text
media_assets
  1 ─── 1 media_originals
            1 ─── n media_blob_chunks
```

`media_originals` peut contenir :

- `media_id`
- `user_id`
- `byte_size`
- `sha256`
- `chunk_size`
- `chunk_count`
- état de sauvegarde / date de vérification si utile.

`media_blob_chunks` peut contenir :

- `media_id`
- `chunk_index`
- `data BYTEA`
- hash de chunk optionnel ;
- contrainte unique `(media_id, chunk_index)`.

Si les limites réelles du chemin réseau permettent un unique `BYTEA`, l’implémentation peut être simplifiée. Le découpage en chunks est préféré dès qu’il améliore :

- reprise après interruption ;
- limites de payload ;
- mémoire navigateur ;
- progression de transfert.

Le chunking ne change **aucun octet** du fichier original.

## 4.4 Miniatures

Les miniatures sont des dérivés.

Elles peuvent :

- rester uniquement dans IndexedDB ;
- être sauvegardées séparément pour accélérer un nouvel appareil ;
- être régénérées depuis l’original.

Elles ne remplacent jamais `media_originals`.

## 4.5 Intégrité

À l’ajout d’un média :

1. calculer le SHA-256 de l’original ;
2. conserver taille/MIME/dimensions ;
3. enregistrer localement ;
4. transférer l’original ;
5. reconstituer/vérifier côté distant selon l’implémentation ;
6. considérer le média « sauvegardé » uniquement lorsque le SHA-256 distant correspond à l’original local.

Sur restauration :

1. télécharger l’original ;
2. reconstituer les chunks dans l’ordre ;
3. calculer SHA-256 ;
4. comparer au hash enregistré ;
5. écrire dans IndexedDB seulement comme copie vérifiée ou signaler explicitement l’erreur.

## 4.6 Data API, privilèges et RLS

Le rôle applicatif principal est `authenticated`.

Ne pas accorder de données métier ou média au rôle `anonymous`.

Modèle de politique :

```sql
ALTER TABLE public.example ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.example TO authenticated;

CREATE POLICY "owner_select" ON public.example
  FOR SELECT TO authenticated
  USING ((SELECT auth.user_id()) = user_id);
```

Les policies équivalentes INSERT/UPDATE/DELETE doivent garantir la propriété utilisateur.

Les tables média et chunks sont soumises aux mêmes exigences de sécurité.

## 4.7 Historique d’équilibrage

Conserver une table `entity_revisions` pour les données métier structurées.

Ne pas dupliquer les binaires dans chaque révision. Les originaux médias sont versionnés uniquement si une future exigence l’impose explicitement.

## 4.8 Migrations branch-first

Tout changement de schéma, index, trigger, fonction, grant ou RLS est versionné dans GitHub et testé sur une branche Neon temporaire avant promotion.

Une migration déjà appliquée devient historique et n’est pas réécrite silencieusement.

---

# 5. Couche locale et synchronisation

## 5.1 Séparation des responsabilités

Ne pas éparpiller les appels Neon dans les rendus.

Créer une couche claire entre :

- UI / logique métier ;
- IndexedDB ;
- synchronisation structurée ;
- synchronisation média.

## 5.2 Outbox structurée

Stores techniques possibles :

- `sync_outbox`
- `sync_meta`
- store de conflits/erreurs si nécessaire.

Une entrée contient au minimum : entité, id, opération, payload utile, date, retry, erreur.

## 5.3 Outbox média

Les originaux ne doivent pas être sérialisés dans une grosse entrée JSON d’outbox.

L’outbox média référence le média local :

```text
media_id
operation
sha256
byte_size
progress / chunk_index
retry
last_error
```

Le binaire reste dans IndexedDB et est lu par portions lors du transfert.

## 5.4 Ordre de synchronisation

À la reconnexion :

1. conserver toutes les écritures locales ;
2. pousser les données structurées ;
3. pousser/reprendre les médias en attente ;
4. confirmer les écritures distantes ;
5. retirer de l’outbox uniquement ce qui est confirmé ;
6. récupérer les changements distants ;
7. mettre à jour IndexedDB sans recréer artificiellement des événements sortants.

Une erreur média ne bloque pas la synchronisation des données structurées.

## 5.5 Téléchargement sur nouvel appareil

Le bootstrap privilégie :

1. Auth ;
2. métadonnées structurées ;
3. reconstruction immédiate du Codex ;
4. miniatures disponibles ;
5. originaux à la demande ou en arrière-plan.

Un média distant non encore local est un état normal :

```text
Métadonnées disponibles
Original sauvegardé dans Neon
Original pas encore téléchargé sur cet appareil
```

Prévoir une action de téléchargement individuel et, si l’implémentation le permet raisonnablement, une action de récupération en lot pour préparer l’usage offline.

## 5.6 Suppressions

Les suppressions métier et média doivent se propager.

Une suppression hors ligne est conservée dans l’outbox jusqu’à confirmation distante.

La suppression du média ne doit jamais supprimer accidentellement une autre entité partageant un hash identique si une déduplication physique est implémentée.

## 5.7 Pull incrémental

Utiliser `updated_at` et/ou curseur de synchronisation. Ne pas recharger tout le Codex ni tous les originaux à chaque synchronisation.

## 5.8 Conflits

Gargottex est personnel. Utiliser une politique déterministe et documentée sans construire un système collaboratif disproportionné.

Pour les médias, deux fichiers différents ne doivent jamais être fusionnés. Un remplacement de fichier crée une nouvelle version logique du média ou remplace explicitement l’original après confirmation selon l’implémentation retenue.

---

# 6. Authentification

Utiliser Neon Managed Better Auth avec interface minimale :

- compte personnel ;
- session persistante ;
- pas d’inscription publique ;
- accès distant après authentification ;
- fonctionnement local préservé.

Ne jamais stocker mot de passe, secret Postgres ou token permanent dans IndexedDB.

---

# 7. Migration V5 → V6

## 7.1 Changement d’origine

IndexedDB est lié à l’origine web. Une nouvelle URL ne peut pas lire directement l’IndexedDB de l’ancienne origine.

## 7.2 Migration des données structurées

Avant bascule :

1. conserver l’ancienne version accessible ;
2. produire l’export JSON structuré ;
3. vérifier comptages/relations ;
4. importer dans la V6 ;
5. écrire dans IndexedDB V6 ;
6. synchroniser vers Neon.

## 7.3 Migration des médias

La migration V6 doit **également sécuriser les originaux médias**.

Avant de considérer l’ancienne installation comme abandonnable :

1. inventorier tous les médias locaux ;
2. calculer taille + SHA-256 ;
3. transférer chaque original sans réencodage ;
4. vérifier le hash distant ;
5. marquer le média `local + sauvegardé + vérifié` ;
6. produire un bilan : total, sauvegardés, en attente, erreurs ;
7. ne pas considérer la migration terminée tant qu’un média attendu n’est pas soit sauvegardé, soit explicitement documenté comme irrécupérable.

## 7.4 Cas de bootstrap

### Local rempli + Neon vide

Le local initialise Neon sans être écrasé, données et médias compris.

### Local vide + Neon rempli

Reconstruire les données locales puis récupérer les originaux média à la demande / en lot.

### Local rempli + Neon rempli

Aucun `clear()` destructif par défaut. Synchroniser, comparer hashes média et préserver l’état local tant que la sauvegarde distante n’est pas confirmée.

---

# 8. Imports / exports

## 8.1 XLSX

Conserver les colonnes et comportements existants.

Un import validé écrit localement puis génère les opérations de synchronisation correspondantes.

## 8.2 JSON

Le JSON reste le format portable des **données structurées**.

Il sert à :

- migration ;
- archive structurée ;
- restauration sans dépendance à Neon ;
- échanges techniques.

Il ne contient pas les binaires médias.

## 8.3 Médias

La sauvegarde distante des originaux est assurée par Neon/Postgres, indépendamment du JSON.

Un éventuel export manuel des originaux pourra être ajouté séparément, mais il n’est pas nécessaire pour considérer la sauvegarde distante V6 fonctionnelle.

---

# 9. Médias / images

## 9.1 Source de vérité

Pour un appareil actif, IndexedDB est la copie de travail immédiate.

Pour la sauvegarde inter-appareils, Neon Postgres conserve l’original vérifié.

## 9.2 États média minimum

Chaque média doit pouvoir être qualifié sans ambiguïté :

- `local_only` : original local non encore sauvegardé ;
- `uploading` : transfert en cours ;
- `local_remote_verified` : local et distant identiques, hash vérifié ;
- `remote_only` : original sauvegardé dans Neon, absent localement ;
- `downloading` : restauration en cours ;
- `sync_error` : erreur de transfert ;
- `missing` : original attendu mais indisponible.

Les noms techniques exacts peuvent varier. Le sens UX doit rester celui-ci.

## 9.3 Déduplication

SHA-256 peut servir à détecter des doublons.

La déduplication est autorisée seulement si :

- aucune relation métier n’est perdue ;
- supprimer une référence ne supprime pas un original encore utilisé ;
- l’original restitué reste bit-identique.

Elle n’est pas obligatoire pour la V6.

## 9.4 Qualité

Aucun pipeline d’optimisation ne peut modifier l’original.

Les optimisations concernent uniquement :

- miniatures ;
- cache ;
- ordre de chargement ;
- chunking de transfert ;
- lazy loading.

---

# 10. Vercel et PWA

Préserver :

- manifest ;
- installation iPhone/iPad/Android/desktop ;
- service worker ;
- shell offline ;
- stratégie de mise à jour fiable.

Ne pas précharger tous les originaux médias dans le service worker.

Les originaux restaurés sont conservés dans IndexedDB, pas dans un cache HTTP opaque comme seule copie locale.

---

# 11. Organisation du chantier

Branche technique dédiée recommandée :

`refactor/v6-neon-local-first`

La documentation UI/UX canonique reste sur `V5.3/docs/`.

La refactorisation technique conserve trois phases.

## Phase 1 — Fondation Neon et abstraction data

Objectifs :

- audit code ;
- Auth ;
- Data API ;
- migrations ;
- tables métier ;
- tables média ;
- `GRANT` + RLS ;
- historique structuré ;
- repository/service ;
- IndexedDB toujours opérationnelle.

**Gate Phase 1 :** fonctionnement local intact, schéma distant sécurisé, modèle média original validé sur branche Neon temporaire.

## Phase 2 — Synchronisation local-first

Objectifs :

- outbox structurée ;
- outbox média ;
- push/retry ;
- upload chunké si nécessaire ;
- vérification SHA-256 ;
- pull incrémental ;
- téléchargements à la demande ;
- suppressions ;
- bootstrap local/distant ;
- imports ;
- statuts de synchronisation.

**Gate Phase 2 :** données et médias testés online/offline, aucune opération locale perdue, original distant bit-identique.

## Phase 3 — Migration, Vercel et validation

Objectifs :

- migration données V5 → V6 ;
- migration médias locaux → Postgres ;
- vérification hashes ;
- nouvel appareil ;
- PWA/offline ;
- CI/tests ;
- documentation finale ;
- PR propre.

**Gate Phase 3 :** validation complète des données **et des originaux médias** avant clôture.

---

# 12. Tests et critères d’acceptation

## 12.1 Données locales

- lecture ;
- création ;
- édition ;
- suppression ;
- rechargement sans perte.

## 12.2 Synchronisation structurée online/offline

- modification visible immédiatement localement ;
- panne réseau ;
- opérations conservées ;
- retry ;
- Neon cohérent ;
- aucune duplication anormale.

## 12.3 Média : upload original

Pour plusieurs formats et tailles représentatives :

- ajouter le média localement ;
- calculer SHA-256 ;
- couper/reprendre le réseau pendant upload ;
- terminer le transfert ;
- vérifier taille distante ;
- vérifier SHA-256 distant ;
- confirmer bit-identité.

Aucun test n’est valide si l’image a été recompressée.

## 12.4 Média : nouvel appareil

- IndexedDB vide ;
- authentification ;
- récupération des métadonnées ;
- statut `remote_only` ;
- téléchargement de l’original ;
- vérification SHA-256 ;
- création de miniature éventuelle ;
- fonctionnement hors ligne après récupération.

## 12.5 Média : erreurs

Tester :

- réseau interrompu ;
- chunk manquant ;
- hash invalide ;
- quota local insuffisant ;
- média distant absent ;
- retry sans duplication.

Une erreur média ne doit jamais supprimer l’original local sain.

## 12.6 Suppression

- suppression locale ;
- tombstone/outbox ;
- propagation distante ;
- absence de résurrection après pull ;
- absence d’impact sur un média partagé par hash si déduplication.

## 12.7 Exports

- XLSX valide ;
- JSON structuré valide ;
- aucun binaire/secrets dans JSON ;
- import de restauration ;
- relations conservées.

## 12.8 Migration V5 → V6

Comparer comptages des entités et inventaire média.

Pour les médias, comparer au minimum :

- nombre attendu ;
- nom ;
- taille ;
- MIME ;
- SHA-256 ;
- relation métier.

## 12.9 PWA

- installation ;
- offline ;
- mise à jour ;
- pas de téléchargement massif involontaire ;
- originaux téléchargés accessibles hors ligne.

## 12.10 Sécurité

- RLS sur tables métier et média ;
- rôle anonymous sans accès ;
- propriété via `auth.user_id()` ;
- aucun secret client ;
- test négatif non authentifié ;
- test positif compte Gargottex.

---

# 13. Hors périmètre explicite

Ne pas profiter de cette refactorisation pour :

- refaire l’UI/UX ;
- modifier les règles du jeu ;
- rééquilibrer les statistiques ;
- réécrire le lore ;
- renommer les entités ;
- introduire un framework frontend sans nécessité ;
- transformer Gargottex en produit collaboratif ;
- ajouter un second backend de stockage média ;
- convertir/recompresser automatiquement les originaux ;
- construire un système complet de versions binaires médias sans besoin explicite.

Neon Object Storage n’est pas nécessaire dans la cible actuelle, puisque la décision verrouillée est de conserver les originaux dans Postgres.

---

# 14. Discipline de modification

Avant tout changement structurel :

- comprendre les chemins réels de lecture/écriture ;
- utiliser une branche Neon temporaire ;
- versionner les migrations ;
- tester RLS ;
- vérifier le projet/branche avant écriture ;
- relire les diffs ;
- préserver l’ancienne donnée tant que la nouvelle copie n’est pas validée.

Pour un média original :

> **ne jamais supprimer ou remplacer la dernière copie saine avant confirmation du hash de la nouvelle copie.**

---

# 15. Livrables attendus

À la fin du chantier :

- migrations SQL ;
- grants/RLS ;
- Auth ;
- repository local-first ;
- synchronisation structurée ;
- tables et synchronisation média ;
- upload/reprise des originaux ;
- vérification SHA-256 ;
- téléchargement/restauration nouvel appareil ;
- XLSX ;
- JSON structuré ;
- migration V5 → V6 données + médias ;
- documentation Neon/Vercel ;
- tests ;
- README mis à jour une fois le comportement réellement validé.

---

# 16. Définition de « terminé »

La V6 data/cloud est terminée lorsque :

1. Gargottex reste pleinement utilisable localement ;
2. les données structurées sont sauvegardées dans Neon ;
3. les originaux médias sont sauvegardés dans Postgres **sans aucune perte de qualité** ;
4. le SHA-256 confirme l’identité local/distant ;
5. les modifications offline se synchronisent à la reconnexion ;
6. un nouvel appareil reconstruit le Codex et peut récupérer les originaux ;
7. les suppressions se propagent correctement ;
8. les révisions structurées sont conservées ;
9. XLSX et JSON fonctionnent ;
10. la migration V5 de l’iPad est testable sans perte de données ni d’images ;
11. la PWA fonctionne sur Vercel et offline ;
12. Auth, GRANT et RLS empêchent les accès non autorisés ;
13. aucun secret n’est exposé ;
14. aucun contenu métier n’a été modifié involontairement ;
15. CI/contrôles pertinents sont verts.

---

# 17. Instruction de lancement

> Tu travailles sur `christolosier-ship-it/Gargotte-V5`. Exécute intégralement `docs/REFACTORISATION-V6-LOCAL-FIRST-NEON.md`. Utilise GitHub, Neon et Vercel selon le document. Respecte les trois phases et leurs gates, préserve les données existantes et les médias originaux sans aucune recompression. Utilise une approche branch-first pour les changements de base de données. Poursuis jusqu’à validation complète ou jusqu’à un véritable blocage externe nécessitant une action utilisateur.
