> Archive historique Neon, figée lors du changement de cible du 17 septembre 2026. Les instructions de lancement, promotion et étapes restantes ci-dessous ne sont plus actives. Référence actuelle : [plan Google Drive](../../REFACTORISATION-V6-LOCAL-FIRST-GOOGLE-DRIVE.md).

# V6 Neon — état d’exécution

## État au 16 septembre 2026

**Gate Phase 2 révisée VALIDÉE : données structurées et originaux médias, reprise après interruption et restauration vérifiée. Arrêt demandé à cette gate ; Phase 3 non clôturée, V6 non terminée.**

## Reprise Phase 2 — remplace l’arrêt Phase 1 ci-dessous

L’utilisateur a autorisé la poursuite jusqu’à la gate 2. IndexedDB passe à la version 4 sans effacement : file média par génération, statuts, bootstrap des originaux locaux, transfert chunké reprenable, contrôle SHA-256 et téléchargement individuel. Les erreurs médias n’empêchent pas le pull structuré. Aucun nouveau SQL et aucune promotion : les tests et la preview utilisent `br-falling-violet-b4am8hbo`.

Quinze tests locaux passent, y compris corruptions, morceaux manquants, quotas, concurrence, protection des originaux et limite de taille. Le moteur a passé les tests SDK/Neon réels : réponse perdue après chunk accepté, reprise sans doublon, reconstruction du JPEG identique, suppression sans résurrection. Build réussi. CI et preview finales : voir PR #9. Détails dans `V6-MEDIA-SYNCHRONISATION.md`.

Les lignes suivantes conservent les preuves historiques de la Phase 1 et du chantier structuré. Les mentions « Phase 2 non engagée » décrivent cet ancien checkpoint, pas l’état courant.

### Nouvelle spécification confirmée — reprise Phase 1 médias

L’utilisateur a confirmé le 16 septembre la sauvegarde des originaux médias dans Postgres et demandé un arrêt à la prochaine gate validée. La spécification actuelle de `V5.3` est intégrée à la branche technique ; les documents UI sont conservés tels quels, sans implémentation de refonte.

Les tests HTTP avec JWT réels sont tous réussis : reconstruction multi-chunks, PNG (58 161 octets) et JPEG (352 290 octets) bit-identiques, hash erroné jamais vérifié, morceaux invalides/manquants refusés, refus anonyme/autre compte/usurpation et tombstones. Les douze tables ont la RLS active, sans lecture anonyme ni suppression physique cliente.

La fondation média est décrite dans `V6-MEDIA-FONDATION.md`. Nouvelle branche Neon `br-falling-violet-b4am8hbo`, enfant de la branche technique, migration `20260916121000_media_originals.sql`. Deux tables `media_originals` / `media_blob_chunks`, octets immuables, morceaux 256 Kio, vérification serveur SHA-256 et isolation propriétaire. Aucun déploiement du schéma média sur le parent ou la production.

Les nouveaux imports locaux conservent désormais les fichiers originaux sans resize/recompression ; les miniatures restent des dérivés. Neuf tests locaux et build passent. La limite initiale de vérification distante est de 64 Mio par original, sans limitation ni effacement de la copie locale.

Les gates initiales ci-dessous restent des preuves de synchronisation structurée. La Phase 2 révisée (outbox/transferts/restauration médias) n’est pas engagée. La Phase 3 révisée reste à faire après cette Phase 2.

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

## Étapes restantes après cette gate

1. Développer et valider la Phase 2 révisée des médias avant toute promotion. Les trois migrations restent sur des branches isolées. Configurer ensuite la cible finale et le compte personnel à l’étape de promotion.
2. Depuis l’installation iPad actuelle : export JSON structuré, import/bootstrap selon la procédure, comparaison des neuf comptages et de fiches représentatives. Conserver l’ancienne origine et IndexedDB.
3. Installation/lancement PWA sur l’iPad, mode avion avec créations/modifications/suppressions, reconnexion et contrôle Neon. Vérifier aussi la reconstruction d’un second appareil avec le compte personnel.
4. Après ces preuves : valider gate 3, actualiser ce document et rendre la PR finale prête à fusionner.

Voir `V6-MIGRATION-CONFIGURATION.md` pour les commandes, les origines, les endpoints publics et le protocole de migration.
