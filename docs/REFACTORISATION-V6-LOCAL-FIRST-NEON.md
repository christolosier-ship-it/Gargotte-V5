# Gargottex V6 — Refactorisation Local-First + Neon + Vercel

## 0. Objet du document

Ce document est la **source de vérité unique** pour la refactorisation technique de Gargottex vers une architecture :

- **GitHub** : code source, migrations SQL, documentation et historique du projet ;
- **Neon / Lakebase Postgres** : sauvegarde distante et synchronisation des données structurées du Codex ;
- **Neon Managed Better Auth** : authentification privée ;
- **Neon Data API** : accès client sécurisé aux données via PostgreSQL, `GRANT` et RLS ;
- **Vercel** : hébergement de la PWA ;
- **IndexedDB** : copie locale de travail, fonctionnement hors ligne et file d’attente de synchronisation.

La refactorisation doit préserver la vocation de Gargottex : **codex personnel de consultation, d’édition, de réglage et d’équilibrage du jeu Gargotte & Va-Nu-Pieds**.

Le but n’est pas de transformer Gargottex en application cloud dépendante du réseau. Le but est de sécuriser les données éditées dans l’application sans perdre son fonctionnement local-first.

Neon remplace InsForge et Supabase dans cette architecture. Pour les tâches backend, privilégier les outils Neon disponibles dans ChatGPT / MCP et les outils officiels Neon. Ne pas introduire un second backend en parallèle sans décision explicitement documentée.

---

# 1. État actuel à préserver

Branche de référence au démarrage du chantier : `V5.3`.

Architecture actuelle principale :

- PWA statique en HTML/CSS/JavaScript ES Modules ;
- pas de framework applicatif ;
- données persistées dans IndexedDB via `src/storage/idb.js` ;
- logique applicative principalement dans `src/app.js` ;
- données initiales dans `seed-data.js` ;
- service worker dans `service-worker.js` ;
- imports/exports XLSX existants ;
- fonctions JSON à conserver/compléter selon l’état réel du code ;
- médias stockés localement, notamment sous forme de `Blob` / `thumb_blob` dans `media_assets` ;
- fonctionnement hors ligne après installation de la PWA.

Stores métier IndexedDB existants :

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

Les formes de données réelles du code existant, les relations, les champs d’import et les comportements actuels restent la référence. Ne pas inventer un nouveau modèle métier si le modèle existant peut être repris proprement.

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
outbox de synchronisation
      ↓
Neon dès que possible
```

Une coupure réseau ne doit pas empêcher :

- la consultation des données déjà locales ;
- la modification d’une fiche ;
- l’ajout d’une entrée ;
- la suppression d’une entrée ;
- l’utilisation normale du Codex hors fonctions nécessitant explicitement le réseau.

## 2.2 Aucune perte de données

La migration ne doit jamais écraser aveuglément les données existantes de l’iPad.

Tant que la migration et la synchronisation Neon ne sont pas validées, IndexedDB reste une source de récupération valide.

Aucune étape ne doit nécessiter d’effacer les données du navigateur pour « repartir proprement ».

## 2.3 Neon ne remplace pas IndexedDB

Neon devient la sauvegarde distante et la source partagée de référence entre installations, mais **IndexedDB reste la base de travail locale de la PWA**.

L’interface ne doit pas faire dépendre chaque lecture ou chaque saisie d’un aller-retour réseau.

## 2.4 Application privée

Gargottex est une application personnelle.

Prévoir :

- Neon Managed Better Auth ;
- un usage privé ;
- aucune inscription publique nécessaire dans l’application ;
- Neon Data API uniquement pour les accès client nécessaires ;
- RLS active sur toutes les tables métier exposées ;
- privilèges SQL `GRANT` limités aux opérations nécessaires ;
- aucun accès métier accordé au rôle `anonymous` ;
- aucune chaîne de connexion PostgreSQL, aucun mot de passe de rôle et aucune clé d’administration dans le navigateur, le dépôt, le service worker ou une variable Vercel publique ;
- la sécurité des données doit reposer sur Auth + privilèges PostgreSQL + RLS.

Avec Neon Data API, l’identité applicative est extraite du JWT via `auth.user_id()`. Ne pas réutiliser les patterns Supabase/InsForge `auth.uid()`.

## 2.5 Pas de refonte UI/UX dans ce chantier

La refonte visuelle du Codex fera l’objet d’un chantier séparé.

Sont autorisées ici uniquement les modifications UI indispensables au fonctionnement technique, par exemple :

- écran/état de connexion ;
- indication discrète de synchronisation ;
- message d’erreur de synchronisation ;
- éventuelle action de reprise/import nécessaire à la migration.

Ne pas redessiner le Codex, l’Atelier, la navigation, les cartes, les formulaires ou le design global.

## 2.6 Images hors synchronisation cloud

Les images ne doivent **pas** être migrées vers Neon Object Storage dans cette refactorisation.

Conserver leur fonctionnement local actuel autant que possible.

Les métadonnées nécessaires au Codex peuvent être synchronisées, mais les champs binaires suivants ne doivent jamais être envoyés dans Postgres :

- `blob`
- `thumb_blob`

Les références comme `image_path`, noms de fichiers, labels, dimensions et autres métadonnées utiles peuvent être conservées/synchronisées.

L’archivage des images est géré manuellement par l’utilisateur hors de ce chantier.

## 2.7 Exports indépendants du cloud

À conserver impérativement :

- export XLSX existant ;
- export XLSX global et/ou par catégorie selon les capacités actuelles ;
- export JSON complet des **données structurées** du Codex ;
- imports correspondants lorsqu’ils existent ou sont nécessaires à la restauration/migration.

Les exports ne doivent pas nécessiter Neon lorsqu’une copie locale des données est disponible.

L’export JSON complet ne doit pas contenir :

- les `Blob` d’images ;
- les miniatures binaires ;
- les tokens d’authentification ;
- les chaînes de connexion ;
- les secrets ;
- les stores techniques de synchronisation, sauf justification explicite et documentée.

Le système ZIP lourd existant n’est **pas** un objectif de cette refactorisation.

---

# 3. Architecture cible

```text
                         GitHub
             code / docs / migrations SQL
                           │
                           ▼
                         Vercel
                           │
                           ▼
                   ┌── Gargottex ──┐
                   │               │
              IndexedDB          Neon
              local-first     Lakebase Postgres
                   │               │
                   │         Auth + Data API
                   │               │
                   └──── sync ─────┘

                     ↕
                  XLSX / JSON

Images : conservation locale + sauvegarde manuelle externe
```

Responsabilités :

| Composant | Responsabilité |
|---|---|
| GitHub | code, migrations, documentation, historique technique |
| Vercel | distribution de la PWA |
| IndexedDB | données locales immédiatement disponibles, offline, outbox |
| Neon Lakebase Postgres | sauvegarde distante, synchronisation, historique d’équilibrage |
| Neon Managed Better Auth | contrôle d’accès personnel |
| Neon Data API | accès REST/PostgREST aux données depuis la PWA, avec JWT et RLS |
| `@neondatabase/neon-js` | client navigateur combinant Auth et Data API |
| Outils Neon / MCP | projets, branches, migrations, SQL, Auth, Data API, diagnostics |
| XLSX / JSON | exports portables et restauration manuelle |
| Images locales | affichage et usage actuel, sans cloud média dans cette V6 |

## 3.1 Intégration Neon dans la PWA

Le projet actuel est une PWA JavaScript ES Modules sans framework. Cette simplicité doit être conservée autant que possible.

Pour Auth + Data API, utiliser le SDK officiel :

```bash
npm install @neondatabase/neon-js
```

Le client doit utiliser une **URL HTTPS Neon sans identifiants PostgreSQL** prévue pour `@neondatabase/neon-js`. Le SDK dérive les endpoints Auth et Data API lorsque la configuration Neon le permet.

Exemple conceptuel :

```js
import { createClient } from '@neondatabase/neon-js';

const neon = createClient(PUBLIC_NEON_DATABASE_URL);
```

Ne jamais transmettre au navigateur `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, un mot de passe Postgres ou une clé d’administration.

Si l’utilisation propre du package npm nécessite l’ajout d’un outillage de build minimal, cet ajout est autorisé à condition :

- de ne pas introduire de framework applicatif ;
- de ne pas réécrire l’UI existante ;
- de rester compatible avec Vercel et la PWA ;
- de conserver le service worker et l’offline ;
- de documenter clairement la commande de build et les fichiers ajoutés.

---

# 4. Modèle de données Neon

## 4.1 Tables métier

Créer dans Lakebase Postgres des tables correspondant aux entités métier IndexedDB existantes :

- `dungeons`
- `creatures`
- `heroes`
- `npcs`
- `quests`
- `loot_items`
- `interactables`
- `brouhaha_effects`
- `media_assets` pour les **métadonnées uniquement**

Le schéma exact doit être dérivé du code réel (`src/app.js`, `src/storage/idb.js`, `seed-data.js`, imports XLSX/JSON), afin d’éviter toute perte ou transformation silencieuse d’un champ existant.

Chaque table synchronisée doit disposer au minimum de métadonnées techniques adaptées, par exemple :

- `user_id`
- `created_at`
- `updated_at`
- `deleted_at` si la stratégie de suppression douce est retenue

Pour les données accessibles via la Data API, `user_id` doit être compatible avec la valeur retournée par `auth.user_id()`.

Conserver les identifiants métier existants lorsque c’est possible afin de préserver les relations et les imports/exports.

Les relations existantes (`dungeon_id`, `creature_id`, `npc_id`, etc.) doivent rester cohérentes.

Les tables applicatives restent dans `public` sauf raison technique documentée. Ne pas modifier manuellement le schéma géré `neon_auth`.

## 4.2 Data API, privilèges SQL et RLS

Le Neon Data API délègue la sécurité à PostgreSQL :

1. `GRANT` définit les tables/opérations accessibles au rôle ;
2. RLS définit les lignes accessibles à l’utilisateur.

Le rôle principal pour Gargottex est `authenticated`.

Ne pas accorder les tables métier au rôle `anonymous`.

Modèle de politique attendu :

```sql
ALTER TABLE public.example ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.example TO authenticated;

CREATE POLICY "owner_select" ON public.example
  FOR SELECT TO authenticated
  USING ((SELECT auth.user_id()) = user_id);

CREATE POLICY "owner_insert" ON public.example
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.user_id()) = user_id);

CREATE POLICY "owner_update" ON public.example
  FOR UPDATE TO authenticated
  USING ((SELECT auth.user_id()) = user_id)
  WITH CHECK ((SELECT auth.user_id()) = user_id);

CREATE POLICY "owner_delete" ON public.example
  FOR DELETE TO authenticated
  USING ((SELECT auth.user_id()) = user_id);
```

Si le schéma utilise des séquences/identity, vérifier également les privilèges nécessaires sur les séquences.

État attendu :

- RLS désactivée : **interdit** sur une table métier exposée ;
- RLS activée sans policy : accès bloqué, acceptable temporairement pendant construction ;
- RLS activée + policies propriétaire : cible finale.

Le projet étant personnel, ne pas construire une couche multi-tenant complexe au-delà de l’isolation correcte par `user_id`.

## 4.3 Historique d’équilibrage

Ajouter un mécanisme d’historique permettant de conserver les versions successives des données métier.

Une table générique `entity_revisions` est recommandée, contenant au minimum :

- propriétaire (`user_id`) ;
- type d’entité ;
- identifiant de l’entité ;
- type d’opération (`insert`, `update`, `delete`) ;
- snapshot JSON de l’état concerné ;
- date de création ;
- éventuellement numéro de révision.

Le mécanisme doit éviter les révisions inutiles lors d’écritures strictement identiques.

La restauration visuelle d’une ancienne version n’est pas obligatoire dans cette V6, mais les données doivent être exploitables ultérieurement.

## 4.4 Migrations et branche-first Neon

Les changements de schéma, indexes, triggers, fonctions, grants et policies RLS doivent être versionnés dans GitHub.

Le workflow cible est **branch-first** : ne pas tester une migration directement sur la branche Neon de production.

Pour les opérations exécutées depuis ChatGPT avec `@Neon` :

1. résoudre le projet `Gargottex` et sa branche par défaut ;
2. préparer le SQL versionné ;
3. utiliser `prepare_database_migration` pour appliquer le changement sur une branche temporaire ;
4. inspecter le schéma et exécuter les tests sur cette branche ;
5. présenter le résultat ;
6. demander confirmation avant `complete_database_migration` avec application sur la branche parent ;
7. supprimer/abandonner proprement la branche temporaire si la migration est refusée.

Pour un workflow CLI/CI, une branche Neon dédiée peut être créée et les migrations doivent utiliser une connexion **directe non poolée**. La connexion poolée est réservée au trafic applicatif serveur.

Les fichiers de migration restent dans le dépôt, par exemple :

```text
migrations/
  20260916090000_create-gargottex-schema.sql
  20260916093000_add-entity-revisions.sql
```

Une migration déjà appliquée devient de l’historique : ne pas la réécrire silencieusement.

---

# 5. Couche locale et synchronisation

## 5.1 Isoler l’accès aux données

Ne pas éparpiller les appels Neon dans les composants/rendus de l’application.

Créer une couche claire entre :

- l’UI / logique métier ;
- le stockage local IndexedDB ;
- le moteur de synchronisation distante.

Réutiliser `src/storage/idb.js` au lieu de le contourner ou de le remplacer brutalement.

Les opérations métier principales doivent pouvoir passer par une API cohérente de repository/service :

- lecture ;
- création ;
- mise à jour ;
- suppression ;
- import en volume.

La couche distante utilise `@neondatabase/neon-js` et vérifie systématiquement les retours `{ data, error }`.

## 5.2 Outbox IndexedDB

Ajouter les stores techniques nécessaires, par exemple :

- `sync_outbox`
- `sync_meta`
- éventuellement un store de conflits/erreurs si l’implémentation le justifie

Une modification locale et son événement d’outbox doivent être enregistrés de façon aussi atomique que possible.

Une entrée d’outbox doit permettre de connaître au minimum :

- entité concernée ;
- identifiant ;
- opération ;
- payload structuré si nécessaire ;
- date locale ;
- état/retry ;
- dernière erreur éventuelle.

Ne jamais placer les blobs d’images dans l’outbox distante.

## 5.3 Ordre de synchronisation

À la reconnexion ou au démarrage authentifié :

1. traiter les écritures locales en attente ;
2. confirmer leur écriture distante Neon ;
3. retirer de l’outbox uniquement les opérations effectivement confirmées ;
4. récupérer ensuite les changements distants utiles ;
5. mettre à jour IndexedDB sans créer artificiellement une nouvelle opération d’outbox pour un changement provenant du serveur.

Une erreur réseau ne doit pas faire perdre une opération locale.

Prévoir un retry raisonnable et éviter les boucles infinies.

Pour les imports massifs, regrouper les opérations plutôt que d’envoyer une requête par champ ou par cellule.

## 5.4 Suppressions

Les suppressions doivent se propager entre installations.

Une stratégie de suppression douce (`deleted_at`) côté Neon est recommandée afin que :

- une suppression hors ligne puisse être synchronisée ;
- une nouvelle installation puisse connaître l’état supprimé ;
- l’historique reste récupérable.

Les éléments marqués supprimés ne doivent pas réapparaître dans le Codex normal.

## 5.5 Pull incrémental

Éviter de recharger l’intégralité du Codex à chaque synchronisation.

Utiliser `updated_at` et/ou un curseur de synchronisation dans `sync_meta` afin de récupérer les changements distants depuis la dernière synchronisation validée.

Le premier bootstrap d’un nouvel appareil peut naturellement charger l’ensemble des données nécessaires.

## 5.6 Conflits

Gargottex est une application personnelle, principalement utilisée par un seul utilisateur. Ne pas introduire un système collaboratif disproportionné.

Politique cible simple :

- les modifications locales sont toujours conservées jusqu’à confirmation distante ;
- en cas de concurrence entre appareils, appliquer une politique déterministe et documentée ;
- l’état remplacé doit rester récupérable via l’historique de révisions.

Une stratégie « dernière synchronisation validée » peut être retenue si elle est testée et documentée.

---

# 6. Authentification

Utiliser Neon Managed Better Auth avec le minimum d’interface nécessaire.

Cible :

- compte personnel ;
- session persistante ;
- pas de création de compte publique dans l’application ;
- accès aux données distantes uniquement après authentification ;
- fonctionnement local existant protégé pendant la migration.

L’activation Auth est faite sur la branche Neon cible. Les données et la configuration Auth sont branch-aware : les environnements de test ne doivent pas contaminer la production.

Le code client peut utiliser le client combiné `@neondatabase/neon-js` :

```js
const result = await neon.auth.signIn.email({ email, password });
const session = await neon.auth.getSession();
await neon.auth.signOut();
```

Ne pas exposer de bouton d’inscription publique si ce n’est pas nécessaire. Le compte Gargottex peut être créé/administré directement via Neon.

Au démarrage, distinguer :

- session en cours de chargement ;
- session active ;
- utilisateur réellement déconnecté.

Ne jamais stocker de mot de passe, token permanent ou secret Postgres dans IndexedDB.

**Note de maturité :** Managed Better Auth évolue rapidement. Au moment d’exécuter la Phase 1, vérifier sa disponibilité et sa configuration sur la région du projet créée par l’utilisateur avant de figer l’implémentation.

---

# 7. Migration des données actuelles de l’iPad

## 7.1 Point critique : changement d’origine

IndexedDB est lié à l’origine web.

Si Gargottex passe d’une URL actuelle à une nouvelle URL Vercel, la nouvelle PWA **ne pourra pas lire directement l’IndexedDB de l’ancienne origine**.

Ne jamais considérer qu’un changement d’hébergement transfère automatiquement les données locales.

## 7.2 Stratégie de migration

Avant la bascule définitive :

1. conserver l’ancienne version accessible ;
2. produire depuis l’ancienne installation un **export JSON complet des données structurées**, sans blobs d’images ;
3. vérifier que l’export contient toutes les entités métier attendues ;
4. importer ce JSON dans la version V6 ou fournir un chemin de bootstrap équivalent ;
5. écrire ces données dans IndexedDB V6 ;
6. synchroniser vers Neon ;
7. vérifier les comptages par type d’entité et un échantillon de relations/champs ;
8. seulement après validation, considérer la nouvelle installation comme référence.

Ne pas détruire l’ancienne IndexedDB avant cette validation.

## 7.3 Cas de bootstrap

### Local rempli + Neon vide

Cas typique de migration initiale : les données locales deviennent la base initiale distante sans être écrasées par un dataset vide.

### Local vide + Neon rempli

Cas d’un nouvel appareil : récupérer les données Neon après authentification et reconstruire la copie locale.

### Local rempli + Neon rempli

Ne jamais faire un `clear()` destructif par défaut. Appliquer la stratégie de synchronisation définie et préserver l’historique.

---

# 8. Imports / exports XLSX et JSON

## 8.1 XLSX

Conserver les fonctionnalités XLSX existantes et leurs colonnes métier.

Un import validé doit :

1. normaliser/valider comme aujourd’hui ;
2. écrire dans IndexedDB ;
3. créer les opérations de synchronisation correspondantes ;
4. être envoyé ensuite vers Neon ;
5. ne pas casser les relations existantes.

Pour les imports en masse, privilégier les traitements batch.

## 8.2 JSON

Garantir un export JSON complet et portable de toutes les données structurées du Codex.

Ce format sert notamment :

- à la migration V5 → V6 ;
- aux archives manuelles ;
- à une restauration sans dépendance à Neon ;
- aux échanges techniques futurs.

Prévoir un numéro/version de format dans l’export.

L’import JSON doit valider la structure avant d’écrire et ne doit jamais effacer silencieusement des données existantes en cas de fichier invalide.

---

# 9. Médias / images

Le chantier V6 **ne comprend pas** de backend média.

Règles :

- aucun bucket Neon Object Storage à créer dans cette phase ;
- aucun upload automatique d’image vers Neon ;
- aucun blob stocké dans Postgres ;
- conserver les médias locaux actuels tant que cela ne bloque pas la refactorisation ;
- synchroniser uniquement les métadonnées utiles si nécessaire ;
- conserver `image_path` et les références métier ;
- ne pas inclure les images binaires dans le JSON de sauvegarde structurée.

L’utilisateur gère séparément la sauvegarde manuelle des images.

---

# 10. Vercel et PWA

Déployer Gargottex sur Vercel sans réécrire inutilement l’application dans un framework.

Préserver :

- manifest PWA ;
- installation sur iPad/iPhone/Android/desktop ;
- service worker ;
- fonctionnement offline du shell ;
- stratégie de mise à jour évitant les vieux caches fantômes.

Adapter le service worker si nécessaire pour les nouveaux modules, mais ne pas précharger une quantité excessive de données ou de médias.

Ne jamais mettre un secret serveur dans un fichier servi au navigateur.

Configuration cliente autorisée : uniquement les endpoints/URLs HTTPS publics nécessaires au SDK Neon.

Configuration interdite côté client :

- `DATABASE_URL` ;
- `DATABASE_URL_UNPOOLED` ;
- mot de passe PostgreSQL ;
- API key Neon de gestion ;
- credential serveur ou clé ayant des privilèges d’administration.

---

# 11. Organisation du chantier

Créer une branche de travail dédiée, par exemple :

`refactor/v6-neon-local-first`

Ne pas développer directement sur `V5.3` si une branche de travail est disponible.

La refactorisation reste organisée en **3 phases**.

## Phase 1 — Fondation Neon et abstraction data

Objectifs :

- audit ciblé du code pertinent ;
- résolution du projet Neon `Gargottex` et de sa branche par défaut ;
- activation/configuration de Managed Better Auth ;
- activation/configuration de Neon Data API ;
- migrations SQL versionnées ;
- tables + relations ;
- `GRANT` + RLS ;
- historique de révisions ;
- intégration minimale de `@neondatabase/neon-js` ;
- abstraction repository/service ;
- IndexedDB existante toujours opérationnelle.

Pour chaque changement structurel Neon :

1. préparer la migration sur une branche temporaire ;
2. inspecter/tester ;
3. contrôler Auth/Data API/RLS ;
4. ne promouvoir vers la branche par défaut qu’après validation explicite.

**Gate Phase 1 :** l’application fonctionne toujours localement et le schéma distant est sécurisé avant de poursuivre.

## Phase 2 — Synchronisation local-first

Objectifs :

- outbox locale ;
- push/retry ;
- pull incrémental ;
- suppressions ;
- bootstrap local/distant ;
- imports écrivant via le nouveau chemin ;
- XLSX/JSON sans régression ;
- statut de synchronisation minimal si nécessaire.

**Gate Phase 2 :** édition online et offline testée, aucune opération locale perdue lors d’une panne réseau simulée.

## Phase 3 — Migration, Vercel et validation finale

Objectifs :

- chemin de migration JSON V5 → V6 ;
- validation des données ;
- déploiement Vercel ;
- contrôle PWA/offline ;
- CI/tests ;
- documentation finale ;
- PR propre vers la branche de référence.

**Gate Phase 3 :** validation complète avant de considérer la refactorisation terminée.

---

# 12. Tests et critères d’acceptation

## 12.1 Données locales

- ouverture avec IndexedDB existante ;
- lecture des entités ;
- création ;
- édition ;
- suppression ;
- rechargement sans perte.

## 12.2 Synchronisation online

- modification locale visible immédiatement ;
- synchronisation Neon confirmée ;
- rechargement sans perte ;
- données distantes cohérentes.

## 12.3 Synchronisation offline

- couper le réseau ;
- effectuer plusieurs créations/modifications/suppressions ;
- vérifier leur présence locale ;
- rétablir le réseau ;
- vérifier la vidange correcte de l’outbox ;
- vérifier les données Neon ;
- aucune opération perdue ou dupliquée anormalement.

## 12.4 Nouvel appareil / navigateur vierge

- IndexedDB vide ;
- connexion au compte Neon Auth ;
- récupération des données via Data API ;
- reconstruction du Codex local ;
- fonctionnement ensuite hors ligne.

Les images locales non synchronisées peuvent être absentes sur ce nouvel appareil : ce point est accepté dans cette V6.

## 12.5 Suppression

- supprimer une entité ;
- synchroniser ;
- vérifier qu’elle ne réapparaît pas après pull/rechargement ;
- vérifier l’historique nécessaire.

## 12.6 Exports

- export XLSX valide ;
- export JSON complet valide ;
- absence de blobs/secrets dans JSON ;
- import d’un export de test ;
- relations et comptages conservés.

## 12.7 Migration V5 → V6

Comparer au minimum les comptages avant/après pour :

- donjons ;
- créatures ;
- héros ;
- PNJ ;
- quêtes ;
- loot ;
- interactables ;
- Brouhaha ;
- métadonnées médias si migrées.

Contrôler plusieurs fiches représentatives contenant :

- stats ;
- lore long ;
- relations ;
- tags ;
- champs optionnels ;
- chemins d’images.

## 12.8 PWA

- installation ;
- lancement depuis l’écran d’accueil ;
- shell disponible hors ligne ;
- absence de régression critique du service worker ;
- mise à jour de version sans rester bloqué sur d’anciens assets.

## 12.9 Sécurité

- RLS active sur toutes les tables métier exposées ;
- `GRANT` limités aux opérations nécessaires ;
- aucune table métier accessible au rôle `anonymous` ;
- accès propriétaire basé sur `auth.user_id()` ;
- aucune connexion PostgreSQL ou clé d’administration exposée ;
- aucun secret commité dans GitHub ;
- test négatif avec client non authentifié ;
- test positif avec le compte Gargottex autorisé.

## 12.10 Backend Neon

- projet `Gargottex` clairement identifié ;
- branche par défaut clairement identifiée ;
- Managed Better Auth opérationnel ;
- Data API opérationnelle ;
- migrations versionnées et testées sur branches temporaires ;
- schéma distant conforme ;
- diagnostics sans erreur bloquante pertinente.

---

# 13. Hors périmètre explicite

Ne pas profiter de cette refactorisation pour :

- refaire l’UI/UX du Codex ;
- modifier la direction artistique ;
- changer les règles du jeu ;
- rééquilibrer les statistiques métier ;
- réécrire le lore ;
- renommer les créatures ou donjons ;
- migrer les images vers Neon Object Storage ;
- réparer en profondeur l’ancien système ZIP lourd ;
- introduire un framework frontend sans nécessité démontrée ;
- réécrire entièrement l’application ;
- modifier des workflows GitHub sans rapport avec Gargottex ;
- transformer Gargottex en produit multi-utilisateur/collaboratif ;
- ajouter Neon Functions, Object Storage ou AI Gateway sans besoin direct de cette V6.

Les données métier doivent être migrées, pas « améliorées » silencieusement.

---

# 14. Discipline de modification

Avant une modification structurelle, comprendre les chemins de lecture/écriture réellement utilisés par l’application.

Pour les gros fichiers comme `src/app.js`, identifier d’abord les fonctions et dépendances concernées.

Pour Neon :

- utiliser les branches temporaires pour tester les migrations ;
- ne jamais appliquer une migration destructive directement sur la branche par défaut ;
- utiliser une connexion directe/non poolée pour migrations et outils d’administration ;
- ne jamais mettre une chaîne de connexion PostgreSQL dans le client ;
- utiliser Data API + Auth pour les accès navigateur ;
- vérifier systématiquement `{ data, error }` côté SDK ;
- vérifier le projet et la branche avant toute écriture backend.

Après chaque phase :

- relire les diffs ;
- exécuter les tests pertinents ;
- vérifier les effets de bord ;
- maintenir un état clair de ce qui est terminé et de ce qui reste à faire.

La fiabilité et l’absence de perte de données priment sur la vitesse.

---

# 15. Livrables attendus

À la fin du chantier, le dépôt doit contenir au minimum :

- migrations SQL Neon versionnées ;
- policies RLS et grants SQL versionnés ;
- code Neon Auth nécessaire ;
- intégration `@neondatabase/neon-js` documentée ;
- couche repository/data claire ;
- moteur de synchronisation local-first ;
- stores IndexedDB techniques nécessaires ;
- exports XLSX préservés ;
- export/import JSON structuré validé ;
- documentation de migration V5 → V6 ;
- documentation de configuration Neon/Vercel sans secret ;
- fichier d’exemple des variables publiques nécessaires ;
- tests ou scripts de validation adaptés ;
- mise à jour raisonnable du README une fois le comportement final confirmé.

Une PR finale doit expliquer :

- l’architecture retenue ;
- les fichiers principaux modifiés ;
- la stratégie de synchronisation ;
- la stratégie de migration ;
- les migrations Neon appliquées ;
- les tests exécutés ;
- les limites connues.

---

# 16. Définition de « terminé »

La V6 data/cloud est considérée terminée lorsque :

1. Gargottex reste pleinement utilisable localement ;
2. les données structurées sont sauvegardées dans Neon Lakebase Postgres ;
3. les modifications hors ligne sont synchronisées à la reconnexion ;
4. un nouvel appareil peut reconstruire le Codex depuis Neon après authentification ;
5. les suppressions se propagent correctement ;
6. les révisions d’équilibrage sont conservées ;
7. les exports XLSX et JSON fonctionnent ;
8. les images ne sont pas envoyées dans Neon ;
9. la migration des données V5 de l’iPad est documentée et testable sans perte ;
10. la PWA fonctionne sur Vercel et conserve son mode offline ;
11. Auth, privilèges SQL et RLS empêchent l’accès non autorisé ;
12. aucune chaîne de connexion ou clé admin Neon n’est exposée côté client ;
13. aucun contenu métier n’a été modifié involontairement ;
14. les contrôles GitHub/CI pertinents sont verts ;
15. la PR finale est prête à être relue puis fusionnée.

---

# 17. Instruction de lancement pour le prochain chantier

Dans un nouveau fil Work / GPT-6 Astra, l’instruction de départ peut rester courte :

> Tu travailles sur `christolosier-ship-it/Gargotte-V5`. Exécute intégralement `docs/REFACTORISATION-V6-LOCAL-FIRST-NEON.md`. Utilise GitHub, Neon et Vercel selon le document. Respecte les trois phases et leurs gates, préserve les données existantes et ne lance pas la refonte UI/UX. Utilise une approche branch-first pour les changements de base de données. Poursuis jusqu’à validation complète de la refactorisation ou jusqu’à un véritable blocage externe nécessitant une action utilisateur.

Le présent document contient les décisions d’architecture. Ne redéfinir une décision que si l’état réel du code ou les capacités réelles de Neon la rendent techniquement invalide ; dans ce cas, documenter clairement la raison et choisir l’alternative la moins disruptive.