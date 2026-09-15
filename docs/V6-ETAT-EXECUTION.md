# V6 Neon — état d’exécution

## État au 15 septembre 2026

**Phase 1 en cours, gate NON validée. Phases 2 et 3 non engagées.**
Aucune promotion Neon, aucune migration des données de l’iPad et aucun déploiement Vercel.
Branche de référence Git : `V5.3`, commit initial `a2bb065`.
Branche de travail Git : `refactor/v6-neon-local-first`.

## Environnement isolé

- Projet Neon : `Gargottex` / `young-bread-85335056`.
- Branche par défaut : `production` / `br-odd-union-b4smjq0r` (non modifiée).
- Branche de travail : `refactor-v6-neon-local-first` / `br-wandering-bread-b48avojm`.
- Base : `neondb`.
- Auth : `https://ep-wild-thunder-b47hzi12.neonauth.c-6.us-east-2.aws.neon.tech/neondb/auth`.
- Data API : `https://ep-wild-thunder-b47hzi12.apirest.c-6.us-east-2.aws.neon.tech/neondb/rest/v1`.
- URL publique cliente : `https://ep-wild-thunder-b47hzi12.c-6.us-east-2.aws.neon.tech/neondb`.

Data API activée avec `auth_provider: neon_auth`, `add_default_grants: false`.
Deux comptes jetables `@example.invalid` ont été créés uniquement sur cette branche pour les tests.
Aucun compte personnel et aucune donnée métier réelle n’ont été importés.

## Travail réalisé

- Migration `20260915223000_gargottex_foundation.sql` appliquée en transaction sur la branche isolée.
- Neuf tables métier : fiches structurées complètes dans `data jsonb`, identifiants conservés, clé primaire `(user_id,id)`.
- Relations existantes conservées dans JSONB et indexées ; pas de nouvelles FK strictes qui rejetteraient des références optionnelles/historiques. Validation applicative des relations encore à réaliser.
- Métadonnées serveur distinctes des champs métier : dates, tombstone et révision.
- RLS sur les dix tables métier/historique ; aucun accès anonyme ; pas de suppression physique accordée au client.
- Trigger de révisions privé, contrôle explicite du propriétaire, états précédents conservés ; mise à jour identique sans nouvelle révision. Comportement réel via JWT encore NON validé.
- Rejet SQL récursif de `blob` et `thumb_blob`.
- Repository local intermédiaire, transaction IndexedDB annulée en cas d’exception.
- Correction du bootstrap : une catégorie Donjons vide n’autorise plus à réécrire les autres données. Une installation cloud vierge n’est pas alimentée automatiquement avec les exemples.
- Interface technique de connexion minimale (sans inscription), SDK officiel bundlé avec esbuild.
- SW limité aux requêtes de même origine pour éviter tout cache Auth/Data API.

### Adaptation du mécanisme de préparation

`prepare_database_migration` cible automatiquement la branche par défaut et ne permet pas de choisir le parent.
La production n’a pas la Data API et ne possède donc ni `auth.user_id()` ni le rôle `authenticated`, prérequis du SQL.
La préparation a été faite sur une branche dédiée issue de production : provisionnement Data API sur cette branche, puis exécution transactionnelle du SQL versionné via `run_sql_transaction`.
Aucun SQL applicatif n’a été exécuté en production. Avant toute promotion, préparer une migration révisable avec les prérequis Data API et demander la confirmation prévue au §4.4 du plan.

## Vérifications obtenues

- `npm test` : tests locaux de CRUD, conservation des champs, rollback transactionnel, absence de réensemencement destructif.
- `npm run build` : réussi, SDK navigateur bundlé.
- SQL distant : RLS active sur les dix tables, lecture anonyme et suppression physique cliente interdites.
- Auth réel : création des deux comptes, session HTTP 200 et JWT fourni.
- Le `kid` du JWT est présent dans le JWKS public de la même branche.

## Blocage externe reproductible

La première écriture via Data API avec ce JWT renvoie :

```json
{"message":"jwk not found","code":null,"detail":null,"hint":null}
```

HTTP 400. La requête n’atteint pas les tests d’isolation métier.
Tentatives : refresh de schéma, cache JWT à zéro, recréation Data API avec JWKS explicite de la même branche (même échec). Configuration finalement rétablie à `neon_auth`, sans grants globaux.
Ne pas contourner cette erreur en supprimant RLS, en utilisant un rôle propriétaire ou en exposant un secret Postgres.
Vérifier dans Neon Console, sur **la branche de travail**, Data API > Settings > Authentication, l’association du fournisseur Managed Better Auth avec le JWKS ci-dessus. Si elle est correcte, transmettre l’erreur au support Neon avec les identifiants projet/branche.

## À reprendre après résolution

1. Renouveler les JWT des comptes de test, vérifier écriture/lecture propriétaire, refus autre compte/anonyme/usurpation, déduplication des révisions, tombstones, rejet des blobs et protection de l’historique.
2. Vérifier l’application dans le navigateur et l’ouverture d’une vraie base V5 existante ; le téléchargement Chromium a rencontré des timeouts dans cet environnement.
3. Revoir les diffs, valider la gate Phase 1, puis seulement développer la Phase 2 (outbox atomique, retry, pull incrémental, gestion multi-appareils, imports).
4. Phase 3 : migration JSON, export/import XLSX, preview Vercel, tests PWA, CI et documentation finale.

L’interface Auth actuelle ne connecte encore aucun moteur de synchronisation. Elle indique seulement l’état du compte. Le README de la version stable reste inchangé tant que le comportement final n’est pas validé.
