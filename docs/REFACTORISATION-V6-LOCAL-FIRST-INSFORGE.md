# Gargottex V6 — Refactorisation Local-First + InsForge + Vercel

## 0. Objet du document

Ce document est la **source de vérité unique** pour la refactorisation technique de Gargottex vers une architecture :

- **GitHub** : code source, migrations SQL, documentation et historique du projet ;
- **InsForge Postgres** : sauvegarde distante et synchronisation des données structurées du Codex ;
- **Vercel** : hébergement de la PWA ;
- **IndexedDB** : copie locale de travail, fonctionnement hors ligne et file d’attente de synchronisation.

La refactorisation doit préserver la vocation de Gargottex : **codex personnel de consultation, d’édition, de réglage et d’équilibrage du jeu Gargotte & Va-Nu-Pieds**.

Le but n’est pas de transformer Gargottex en application cloud dépendante du réseau. Le but est de sécuriser les données éditées dans l’application sans perdre son fonctionnement local-first.

InsForge remplace Supabase dans cette architecture. Le backend distant doit être piloté avec les outils officiels InsForge :

- `npx @insforge/cli ...` pour projet, migrations, SQL, RLS, configuration et diagnostics ;
- `@insforge/sdk` pour Auth et accès aux données depuis l’application.

Ne pas introduire un autre backend en parallèle sans décision explicitement documentée.

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

Une édition doit être enregistrée **localement immédiatement**, sans attendre InsForge.

Le parcours nominal est :

```text
édition utilisateur
      ↓
IndexedDB immédiatement
      ↓
interface mise à jour
      ↓
outbox de synchronisation
      ↓
InsForge dès que possible
```

Une coupure réseau ne doit pas empêcher :

- la consultation des données déjà locales ;
- la modification d’une fiche ;
- l’ajout d’une entrée ;
- la suppression d’une entrée ;
- l’utilisation normale du Codex hors fonctions nécessitant explicitement le réseau.

## 2.2 Aucune perte de données

La migration ne doit jamais écraser aveuglément les données existantes de l’iPad.

Tant que la migration et la synchronisation InsForge ne sont pas validées, IndexedDB reste une source de récupération valide.

Aucune étape ne doit nécessiter d’effacer les données du navigateur pour « repartir proprement ».

## 2.3 InsForge ne remplace pas IndexedDB

InsForge devient la sauvegarde distante et la source partagée de référence entre installations, mais **IndexedDB reste la base de travail locale de la PWA**.

L’interface ne doit pas faire dépendre chaque lecture ou chaque saisie d’un aller-retour réseau.

## 2.4 Application privée

Gargottex est une application personnelle.

Prévoir :

- authentification InsForge ;
- un usage privé ;
- aucune inscription publique nécessaire dans l’application ;
- RLS active sur toutes les tables contenant les données Gargottex ;
- accès SQL correctement limité par `GRANT` en complément des policies RLS ;
- aucune `INSFORGE_API_KEY` ni autre clé d’administration complète dans le navigateur, le dépôt, Vercel côté client ou le service worker ;
- seules l’URL publique InsForge et l’`ANON_KEY` prévue pour le client peuvent être exposées côté navigateur ;
- la sécurité des données doit reposer sur Auth + privilèges SQL + RLS, pas sur l’obscurité d’une URL ou d’une clé publique.

Le compte utilisateur applicatif doit être relié aux données via `auth.users(id)` et les policies doivent utiliser `auth.uid()`.

## 2.5 Pas de refonte UI/UX dans ce chantier

La refonte visuelle du Codex fera l’objet d’un chantier séparé.

Sont autorisées ici uniquement les modifications UI indispensables au fonctionnement technique, par exemple :

- écran/état de connexion ;
- indication discrète de synchronisation ;
- message d’erreur de synchronisation ;
- éventuelle action de reprise/import nécessaire à la migration.

Ne pas redessiner le Codex, l’Atelier, la navigation, les cartes, les formulaires ou le design global.

## 2.6 Images hors synchronisation cloud

Les images ne doivent **pas** être migrées vers InsForge Storage dans cette refactorisation.

Conserver leur fonctionnement local actuel autant que possible.

Les métadonnées nécessaires au Codex peuvent être synchronisées, mais les champs binaires suivants ne doivent jamais être envoyés dans Postgres :

- `blob`
- `thumb_blob`

Les références comme `image_path`, noms de fichiers, labels, dimensions et autres métadonnées utiles peuvent être conservées/synchronisées.

L’archivage des images est géré manuellement par l’utilisateur hors de ce chantier.

## 2.7 Exports indépendants du cloud

Les fonctions d’export restent une fonction centrale de Gargottex.

À conserver impérativement :

- export XLSX existant ;
- export XLSX global et/ou par catégorie selon les capacités actuelles ;
- export JSON complet des **données structurées** du Codex ;
- imports correspondants lorsqu’ils existent ou sont nécessaires à la restauration/migration.

Les exports ne doivent pas nécessiter InsForge pour fonctionner lorsqu’une copie locale des données est disponible.

L’export JSON complet ne doit pas contenir :

- les `Blob` d’images ;
- les miniatures binaires ;
- les tokens d’authentification ;
- les secrets ;
- les stores techniques de synchronisation, sauf si une raison explicite et documentée le justifie.

Le système ZIP lourd existant n’est **pas** un objectif de cette refactorisation. Ne pas consacrer le chantier à le réparer sauf nécessité technique directe.

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
              IndexedDB         InsForge
              local-first        Postgres
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
| InsForge Postgres | sauvegarde distante, synchronisation, historique d’équilibrage |
| InsForge Auth | contrôle d’accès personnel |
| `@insforge/sdk` | accès Auth et Data API depuis la PWA |
| `npx @insforge/cli` | gestion backend, migrations, SQL, RLS, configuration, diagnostics |
| XLSX / JSON | exports portables et restauration manuelle |
| Images locales | affichage et usage actuel, sans cloud média dans cette V6 |

## 3.1 Intégration InsForge dans une PWA sans framework

Le projet actuel est une PWA JavaScript ES Modules sans framework et sans outillage applicatif lourd.

La refactorisation doit conserver cette simplicité autant que possible.

L’intégration cliente doit utiliser `@insforge/sdk`. Si son intégration propre nécessite l’ajout d’un outillage npm/build minimal dans ce dépôt, cet ajout est autorisé à condition :

- de ne pas introduire de framework applicatif ;
- de ne pas réécrire l’UI existante ;
- de rester compatible avec Vercel et la PWA ;
- de conserver le service worker et l’offline ;
- de documenter clairement les commandes de build et les fichiers ajoutés.

Ne pas contourner le SDK avec une couche HTTP artisanale simplement pour éviter cet outillage, sauf blocage technique démontré et documenté.

---

# 4. Modèle de données InsForge

## 4.1 Tables métier

Créer des tables InsForge/Postgres correspondant aux entités métier IndexedDB existantes, en conservant leurs champs et relations utiles :

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

Conserver les identifiants métier existants lorsque c’est possible afin de préserver les relations et les imports/exports.

Les relations existantes (`dungeon_id`, `creature_id`, `npc_id`, etc.) doivent rester cohérentes.

Les tables applicatives doivent rester dans le schéma `public`. Ne pas modifier les schémas gérés par InsForge (`auth`, `storage`, `realtime`, `payments`, `system`, etc.).

## 4.2 RLS et privilèges SQL

RLS obligatoire sur toutes les tables métier et d’historique.

Principe :

```text
une ligne appartient à auth.uid()
seul son propriétaire authentifié peut la lire/écrire/supprimer
```

Chaque table doit également recevoir les privilèges SQL nécessaires pour le rôle `authenticated`. Les policies RLS ne remplacent pas les `GRANT`.

Modèle attendu :

```sql
ALTER TABLE public.example ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner_select" ON public.example
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "owner_insert" ON public.example
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "owner_update" ON public.example
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "owner_delete" ON public.example
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.example TO authenticated;
```

Éviter toute policy permissive de type accès public global.

Le projet étant personnel, ne pas construire une couche multi-tenant complexe au-delà de ce qui est nécessaire à une isolation correcte par `user_id`.

Si des fonctions helper sont nécessaires dans des policies RLS et qu’elles interrogent elles-mêmes des tables protégées par RLS, utiliser le pattern InsForge documenté pour éviter la récursion : helper `SECURITY DEFINER`, références qualifiées et `search_path` explicitement fixé.

## 4.3 Historique d’équilibrage

Ajouter un mécanisme d’historique permettant de conserver les versions successives des données métier.

Objectif : pouvoir retrouver l’état précédent d’une créature, d’un héros, d’un donjon, d’une quête, etc. après plusieurs réglages.

Une table générique de type `entity_revisions` est recommandée, contenant au minimum :

- propriétaire (`user_id`) ;
- type d’entité ;
- identifiant de l’entité ;
- type d’opération (`insert`, `update`, `delete`) ;
- snapshot JSON de l’état concerné ;
- date de création ;
- éventuellement numéro de révision.

Le mécanisme doit éviter de créer des révisions inutiles lors d’écritures strictement identiques.

La restauration visuelle d’une ancienne version dans l’UI n’est pas obligatoire dans cette refactorisation si elle exige une refonte d’interface. En revanche, les données de révision doivent être correctement enregistrées et exploitables pour un chantier ultérieur.

## 4.4 Migrations et gestion du backend

Les changements de schéma, indexes, triggers, functions, grants et policies RLS doivent être versionnés dans GitHub via les migrations InsForge.

Workflow cible :

```bash
npx @insforge/cli current
npx @insforge/cli db migrations list
npx @insforge/cli db migrations new <nom-en-kebab-case>
# éditer migrations/<timestamp>_<nom-en-kebab-case>.sql
npx @insforge/cli db migrations up --all
```

Les migrations doivent être conservées dans `migrations/` et respecter le format InsForge :

```text
<timestamp>_<nom-en-kebab-case>.sql
```

Exemple :

```text
20260916090000_create-gargottex-schema.sql
```

Ne pas ajouter `BEGIN`, `COMMIT` ou `ROLLBACK` dans les fichiers de migration : InsForge exécute chaque migration dans sa propre transaction.

Utiliser `npx @insforge/cli db query ...` pour l’inspection ciblée ou les petites corrections de données, pas comme substitut aux migrations de schéma.

Avant toute opération backend non triviale, vérifier le projet lié avec `npx @insforge/cli current`. Ne jamais lancer de création de projet, changement d’organisation ou opération destructive si le contexte de projet n’est pas certain.

Si une branche backend InsForge est disponible et appropriée pour tester une modification risquée, la privilégier avant la production. À défaut, le nouveau projet Gargotte encore vide doit servir de terrain de validation avant l’import des données réelles.

---

# 5. Couche locale et synchronisation

## 5.1 Isoler l’accès aux données

Ne pas éparpiller les appels InsForge dans les composants/rendus de l’application.

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

La couche distante doit utiliser le client `@insforge/sdk` et vérifier systématiquement les retours `{ data, error }`.

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
2. confirmer leur écriture distante InsForge ;
3. retirer de l’outbox uniquement les opérations effectivement confirmées ;
4. récupérer ensuite les changements distants utiles ;
5. mettre à jour IndexedDB sans créer artificiellement une nouvelle opération d’outbox pour un changement qui vient du serveur.

Une erreur réseau ne doit pas faire perdre une opération locale.

Prévoir un retry raisonnable et éviter les boucles de synchronisation infinies.

Les insertions InsForge via le SDK utilisent le format tableau (`insert([{ ... }])`). Pour les imports massifs, regrouper les opérations plutôt que d’envoyer une requête par champ ou par cellule.

## 5.4 Suppressions

Les suppressions doivent se propager entre installations.

Une stratégie de suppression douce (`deleted_at`) côté InsForge est recommandée afin que :

- une suppression hors ligne puisse être synchronisée ;
- une nouvelle installation puisse connaître l’état supprimé ;
- l’historique reste récupérable.

Les éléments marqués supprimés ne doivent pas réapparaître dans le Codex normal.

## 5.5 Conflits

Gargottex est une application personnelle, utilisée principalement par un seul utilisateur. Ne pas introduire un système collaboratif disproportionné.

Politique cible simple :

- les modifications locales sont toujours conservées jusqu’à confirmation distante ;
- en cas de modifications concurrentes sur plusieurs appareils, une politique déterministe et documentée doit s’appliquer ;
- l’état remplacé doit rester récupérable via l’historique de révisions.

Une stratégie « dernière synchronisation validée » peut être retenue si elle est correctement documentée et testée.

Ne pas construire une interface complexe de fusion de conflits dans ce chantier.

---

# 6. Authentification

Ajouter InsForge Auth avec le minimum d’interface nécessaire.

Cible :

- compte personnel ;
- session persistante ;
- pas de création de compte publique dans l’application ;
- accès aux données distantes uniquement après authentification ;
- fonctionnement local existant à protéger pendant la migration.

Le client applicatif doit être initialisé avec l’URL publique du projet et l’`ANON_KEY` InsForge.

Ne jamais stocker de mot de passe en clair dans le code, GitHub, IndexedDB ou les fichiers de configuration.

Ne jamais embarquer d’`INSFORGE_API_KEY` ou autre clé admin complète côté client.

Le code d’authentification doit utiliser `@insforge/sdk`, notamment `signInWithPassword()`, `signOut()` et `getCurrentUser()` selon les besoins retenus.

Au démarrage, l’application doit distinguer l’état « session en cours de réhydratation » de l’état réellement déconnecté afin d’éviter un faux écran de déconnexion pendant le rafraîchissement de session.

Les fichiers `.env` contenant des valeurs locales ne doivent pas être commités. Documenter les variables publiques nécessaires dans un fichier d’exemple sans secret.

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
6. synchroniser vers InsForge ;
7. vérifier les comptages par type d’entité et un échantillon de relations/champs ;
8. seulement après validation, considérer la nouvelle installation comme référence.

Ne pas détruire l’ancienne IndexedDB avant cette validation.

## 7.3 Cas de bootstrap

Le moteur doit gérer proprement au minimum :

### Local rempli + InsForge vide

Cas typique de migration initiale : les données locales doivent pouvoir devenir la base initiale distante sans être écrasées par un dataset vide.

### Local vide + InsForge rempli

Cas d’un nouvel appareil : récupérer les données InsForge et reconstruire la copie locale.

### Local rempli + InsForge rempli

Ne jamais faire un `clear()` destructif par défaut. Appliquer la stratégie de synchronisation définie et préserver l’historique.

---

# 8. Imports / exports XLSX et JSON

## 8.1 XLSX

Conserver les fonctionnalités XLSX existantes et leurs colonnes métier.

Un import validé doit :

1. normaliser/valider comme aujourd’hui ;
2. écrire dans IndexedDB ;
3. créer les opérations de synchronisation correspondantes ;
4. être envoyé ensuite vers InsForge ;
5. ne pas casser les relations existantes.

Pour les imports en masse, privilégier les traitements batch afin d’éviter une requête réseau par cellule ou une explosion inutile du nombre d’opérations.

## 8.2 JSON

Garantir un export JSON complet et portable de toutes les données structurées du Codex.

Ce format sert notamment :

- à la migration V5 → V6 ;
- aux archives manuelles ;
- à une restauration sans dépendance à InsForge ;
- aux échanges techniques futurs.

Prévoir un numéro/version de format dans l’export afin de pouvoir faire évoluer le schéma ultérieurement.

L’import JSON doit valider la structure avant d’écrire et ne doit jamais effacer silencieusement des données existantes en cas de fichier invalide.

---

# 9. Médias / images

Le chantier V6 **ne comprend pas** de backend média.

Règles :

- aucun bucket InsForge Storage à créer pour Gargottex dans cette phase ;
- aucun upload automatique d’image vers InsForge ;
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

La configuration cliente InsForge doit exposer uniquement :

- l’URL publique du projet ;
- l’`ANON_KEY` prévue pour les clients.

Toute `INSFORGE_API_KEY` ou clé équivalente donnant un accès administrateur complet doit rester strictement côté serveur/CLI et ne jamais être préfixée comme variable publique Vercel.

---

# 11. Organisation du chantier

Créer une branche de travail dédiée, par exemple :

`refactor/v6-insforge-local-first`

Ne pas développer directement sur la branche de référence si une branche de travail est disponible.

La refactorisation est organisée en **3 phases**, pas en une multitude de micro-roadmaps.

## Phase 1 — Fondation cloud et abstraction data

Objectifs :

- audit ciblé du code pertinent ;
- connexion/liaison contrôlée au projet InsForge Gargotte ;
- migrations InsForge versionnées ;
- tables + relations ;
- privilèges SQL + RLS ;
- Auth privée ;
- historique de révisions ;
- intégration minimale de `@insforge/sdk` ;
- abstraction repository/service ;
- IndexedDB existante toujours opérationnelle.

Avant les changements backend :

1. vérifier le projet lié avec `npx @insforge/cli current` ;
2. vérifier l’historique avec `npx @insforge/cli db migrations list` ;
3. créer les migrations avec `npx @insforge/cli db migrations new ...` ;
4. appliquer uniquement après relecture du SQL ;
5. valider les tables, grants, RLS et Auth avant de poursuivre.

Gate Phase 1 : l’application doit encore fonctionner localement et le schéma distant InsForge doit être sécurisé avant de poursuivre.

## Phase 2 — Synchronisation local-first

Objectifs :

- outbox locale ;
- push/retry ;
- pull distant ;
- suppressions ;
- bootstrap local/distant ;
- imports écrivant via le nouveau chemin ;
- XLSX/JSON sans régression ;
- statut de synchronisation minimal si nécessaire.

Gate Phase 2 : édition online et offline testée, aucune opération locale perdue lors d’une panne réseau simulée.

## Phase 3 — Migration, Vercel et validation finale

Objectifs :

- chemin de migration JSON V5 → V6 ;
- validation des données ;
- déploiement Vercel ;
- contrôle PWA/offline ;
- CI/tests ;
- documentation finale ;
- PR propre vers la branche de référence.

Gate Phase 3 : validation complète avant de considérer la refactorisation terminée.

---

# 12. Tests et critères d’acceptation

La refactorisation n’est pas terminée tant que les scénarios suivants ne sont pas validés.

## 12.1 Données locales

- ouverture avec IndexedDB existante ;
- lecture des entités ;
- création ;
- édition ;
- suppression ;
- rechargement de page sans perte.

## 12.2 Synchronisation online

- modification locale visible immédiatement ;
- synchronisation InsForge confirmée ;
- rechargement sans perte ;
- données distantes cohérentes.

## 12.3 Synchronisation offline

- couper le réseau ;
- effectuer plusieurs créations/modifications/suppressions ;
- vérifier leur présence locale ;
- rétablir le réseau ;
- vérifier la vidange correcte de l’outbox ;
- vérifier les données InsForge ;
- aucune opération perdue ou dupliquée anormalement.

## 12.4 Nouvel appareil / navigateur vierge

- IndexedDB vide ;
- connexion au compte InsForge ;
- récupération des données InsForge ;
- reconstruction du Codex local ;
- fonctionnement ensuite hors ligne avec les données récupérées.

Les images locales non synchronisées peuvent naturellement être absentes sur ce nouvel appareil : ce point est accepté dans cette V6.

## 12.5 Suppression

- supprimer une entité ;
- synchroniser ;
- vérifier qu’elle ne réapparaît pas après pull/rechargement ;
- vérifier la présence de l’historique nécessaire.

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

Contrôler également plusieurs fiches représentatives contenant :

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

- RLS active ;
- grants SQL limités aux opérations nécessaires ;
- aucune table métier lisible anonymement si cela n’est pas explicitement requis ;
- aucune clé admin InsForge exposée ;
- aucune donnée privée accessible sans le compte autorisé ;
- aucun secret commité dans GitHub ;
- test négatif effectué avec un client non authentifié ;
- test positif effectué avec le compte Gargottex autorisé.

## 12.10 Backend InsForge

- `npx @insforge/cli current` pointe vers le projet Gargotte attendu ;
- migrations distantes et locales cohérentes ;
- aucune migration appliquée hors ordre ;
- diagnostic backend sans erreur bloquante pertinente ;
- erreurs SDK `{ data, error }` correctement gérées dans le moteur de synchronisation.

---

# 13. Hors périmètre explicite

Ne pas profiter de cette refactorisation pour :

- refaire l’UI/UX du Codex ;
- modifier la direction artistique ;
- changer les règles du jeu ;
- rééquilibrer des statistiques métier ;
- réécrire le lore ;
- renommer les créatures ou donjons ;
- migrer les images vers InsForge Storage ;
- réparer en profondeur l’ancien système ZIP lourd ;
- introduire un framework frontend sans nécessité démontrée ;
- réécrire entièrement l’application ;
- modifier des workflows GitHub sans rapport avec Gargottex ;
- transformer Gargottex en produit multi-utilisateur/collaboratif ;
- utiliser les fonctions IA, paiement ou autres modules InsForge sans rapport avec cette V6.

Les données métier doivent être migrées, pas « améliorées » silencieusement.

---

# 14. Discipline de modification

Avant une modification structurelle, comprendre les chemins de lecture/écriture réellement utilisés par l’application.

Pour les gros fichiers comme `src/app.js`, commencer par identifier les fonctions et dépendances concernées, puis élargir l’inspection autant que nécessaire.

Pour InsForge :

- utiliser `npx @insforge/cli current` avant une opération backend non triviale ;
- utiliser les migrations pour tout changement de schéma/RLS/grants/triggers/functions ;
- utiliser `db query` pour inspection ciblée ou correction de données, pas pour contourner l’historique de migrations ;
- vérifier les erreurs SDK au lieu de considérer une requête comme réussie par défaut ;
- ne jamais exposer une API key admin au client.

Après chaque phase :

- relire les diffs concernés ;
- exécuter les tests pertinents ;
- vérifier les effets de bord ;
- maintenir un état clair de ce qui est terminé et de ce qui reste à faire.

La fiabilité et l’absence de perte de données priment sur la vitesse d’exécution.

---

# 15. Livrables attendus

À la fin du chantier, le dépôt doit contenir au minimum :

- migrations InsForge versionnées dans `migrations/` ;
- policies RLS et grants SQL versionnés ;
- code Auth InsForge nécessaire ;
- intégration `@insforge/sdk` documentée ;
- couche repository/data claire ;
- moteur de synchronisation local-first ;
- stores IndexedDB techniques nécessaires ;
- exports XLSX préservés ;
- export/import JSON structuré validé ;
- documentation de migration V5 → V6 ;
- documentation de configuration InsForge/Vercel sans secret ;
- fichier d’exemple des variables d’environnement publiques nécessaires ;
- tests ou scripts de validation adaptés au projet ;
- mise à jour raisonnable du README une fois le comportement final confirmé.

Une PR finale doit expliquer :

- l’architecture retenue ;
- les fichiers principaux modifiés ;
- la stratégie de synchronisation ;
- la stratégie de migration ;
- les migrations InsForge appliquées ;
- les tests exécutés ;
- les éventuelles limites connues.

---

# 16. Définition de « terminé »

La V6 data/cloud est considérée terminée lorsque :

1. Gargottex reste pleinement utilisable localement ;
2. les données structurées sont sauvegardées dans InsForge Postgres ;
3. les modifications hors ligne sont synchronisées à la reconnexion ;
4. un nouvel appareil peut reconstruire le Codex depuis InsForge après authentification ;
5. les suppressions se propagent correctement ;
6. les révisions d’équilibrage sont conservées ;
7. les exports XLSX et JSON fonctionnent ;
8. les images ne sont pas envoyées dans InsForge ;
9. la migration des données V5 de l’iPad est documentée et testable sans perte ;
10. la PWA fonctionne sur Vercel et conserve son mode offline ;
11. Auth, privilèges SQL et RLS empêchent l’accès non autorisé ;
12. aucune clé admin InsForge n’est exposée côté client ;
13. aucun contenu métier n’a été modifié involontairement ;
14. les contrôles GitHub/CI pertinents sont verts ;
15. la PR finale est prête à être relue puis fusionnée.

---

# 17. Instruction de lancement pour le prochain chantier

Dans un nouveau fil Work / GPT-6 Astra, l’instruction de départ peut rester volontairement courte :

> Tu travailles sur `christolosier-ship-it/Gargotte-V5`. Exécute intégralement `docs/REFACTORISATION-V6-LOCAL-FIRST-INSFORGE.md`. Utilise GitHub, InsForge et Vercel selon le document. Respecte les trois phases et leurs gates, préserve les données existantes et ne lance pas la refonte UI/UX. Poursuis jusqu’à validation complète de la refactorisation ou jusqu’à un véritable blocage externe nécessitant une action utilisateur.

Le présent document contient les décisions d’architecture. Ne redéfinir une décision que si l’état réel du code ou les capacités réelles d’InsForge la rendent techniquement invalide ; dans ce cas, documenter clairement la raison et choisir l’alternative la moins disruptive.
