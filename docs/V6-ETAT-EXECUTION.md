# V6 Neon — état d’exécution

## État au 16 septembre 2026

**Gates 1 et 2 validées pour le périmètre initial (données structurées uniquement). Phase 3 partiellement validée ; V6 non déclarée terminée.**

### Divergence du document détectée à la reprise

Le document de référence sur `V5.3` (`8ff289d` à la vérification) demande désormais les originaux médias dans Postgres, upload reprenable et contrôle SHA-256. Le document de la branche technique, utilisé jusqu’ici, interdit explicitement leur synchronisation (§2.6 et §9). Ces deux périmètres sont incompatibles. La validation acquise ne couvre pas les nouvelles gates média ; aucune implémentation média distante ni promotion ne sera présentée comme terminée. Choix utilisateur nécessaire avant d’adopter la nouvelle spécification. Les documents UI et le document technique modifiés en parallèle n’ont pas été remplacés ni fusionnés silencieusement.
La production Neon et les données de l’iPad n’ont pas été modifiées. Aucune refonte UI/UX ni modification du contenu métier.

- Référence Git : `V5.3`, commit initial `a2bb065`.
- Travail Git : `refactor/v6-neon-local-first`, PR #9.
- Projet Neon : `Gargottex` / `young-bread-85335056`.
- Production par défaut : `br-odd-union-b4smjq0r`.
- Branche isolée, enfant de production : `br-wandering-bread-b48avojm`.
- Base : `neondb`.
- URL cliente publique de test : `https://ep-wild-thunder-b47hzi12.c-6.us-east-2.aws.neon.tech/neondb`.
- Vercel : projet `gargotte-v5`, `prj_Tmg6QSlA1JF2bkMZdCPiFmfhP0DC`.
- Preview : https://gargotte-v5-git-refactor-v6-neon-local-first-christo5.vercel.app (protection Vercel conservée).

## Phase 1 — validée

Neuf tables métier JSONB conservent tous les champs et identifiants existants ; relations conservées et indexées sans ajouter de FK qui rejetteraient des références historiques. RLS propriétaire sur les dix tables métier/historique, aucun accès anonyme, aucune suppression physique cliente. Révisions append-only, états précédents, tombstones et rejet récursif des blobs.

Auth Managed Better Auth et Data API (`auth_provider: neon_auth`, `add_default_grants: false`) opérationnels sur la branche de travail. Deux comptes jetables `@example.invalid` y servent uniquement aux tests. Aucun compte personnel ni dataset réel importé.

Le blocage initial `jwk not found` du 15 septembre n’est plus reproduit après renouvellement des sessions. Les tests HTTP réels ont validé lecture/écriture propriétaire, refus anonyme/autre compte/usurpation, historique protégé et rejet des blobs. Aucune sécurité désactivée pour les obtenir.

Migrations appliquées uniquement sur la branche isolée :

1. `20260915223000_gargottex_foundation.sql`.
2. `20260916070000_revision_after_upsert.sql` : audit AFTER écriture pour supprimer les révisions fantômes d’un upsert identique.

### Adaptation de la préparation Neon

`prepare_database_migration` cible automatiquement la branche par défaut sans paramètre de parent. La production n’a pas les prérequis Data API (`auth.user_id()`, rôle `authenticated`). Une branche dédiée issue de production a donc été créée ; Data API y a été provisionnée et le SQL versionné exécuté avec `run_sql_transaction`.

Avant promotion : préparer le résultat révisable avec les prérequis Data API et obtenir la confirmation explicite exigée au §4.4 du plan. Ne pas remplacer production par la branche contenant les comptes et données de test.

## Phase 2 — validée

Repository local, enregistrement métier + outbox atomiques, bootstrap des données existantes, liaison à un propriétaire, envoi batch, confirmation exacte, retry, pull paginé, suppressions douces, fusion JSON non destructive. Dernière synchronisation validée gagnante, état remplacé récupérable dans les révisions. Les médias binaires restent exclusivement locaux.

`scripts/verify-neon.mjs` a passé avec le SDK officiel et des JWT réels : panne réseau simulée, reprise sans perte, upsert identique sans révision supplémentaire, reconstruction d’une installation vide, champs imbriqués et tombstones. Les secrets de test sont hors dépôt.

## Phase 3 — preuves obtenues et limites

- Huit tests `npm test` réussis : CRUD/rollback, outbox/reprise/concurrence, export/import JSON complet, XLSX avec accents et texte long, mise à niveau réelle du schéma IndexedDB 2 vers 3 sous fake-indexeddb avec blobs/indexes/préférences préservés, fallback offline du service worker et exclusion Auth/API du cache.
- `npm run build` réussi ; SDK bundlé, cache versionné par hash des assets, aucune chaîne PostgreSQL dans le client.
- GitHub Actions vert sur `b349341` (run `35063411290`). Contrôles du dernier commit à consulter dans la PR.
- Preview Vercel `b349341` READY ; interface vérifiée dans Chrome : création et modification de fiche en mode local, rechargement conservant nom et lore, actions d’export XLSX/JSON et restauration présentes. Aucune erreur applicative observée.
- Le test du service worker est simulé : il ne remplace pas l’installation PWA et le lancement en mode avion sur iPad.
- Les données seed de test ont conservé leurs champs, relations et comptages (138 entrées). Ce résultat ne prouve pas la migration des données actuellement présentes dans l’iPad. Le XLSX joint de mai n’est pas une sauvegarde certifiée de l’installation actuelle.

## Étapes nécessitant l’utilisateur avant clôture

1. Confirmation de promotion des deux migrations sur la production, après préparation/contrôle des prérequis Auth + Data API, conformément au §4.4. Configurer ensuite Vercel avec l’URL publique de production et le compte personnel.
2. Depuis l’installation iPad actuelle : export JSON structuré, import/bootstrap selon la procédure, comparaison des neuf comptages et de fiches représentatives. Conserver l’ancienne origine et IndexedDB.
3. Installation/lancement PWA sur l’iPad, mode avion avec créations/modifications/suppressions, reconnexion et contrôle Neon. Vérifier aussi la reconstruction d’un second appareil avec le compte personnel.
4. Après ces preuves : valider gate 3, actualiser ce document et rendre la PR finale prête à fusionner.

Voir `docs/V6-MIGRATION-CONFIGURATION.md` pour les commandes, les origines, les endpoints publics et le protocole de migration.
