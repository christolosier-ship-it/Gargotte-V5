# V6 — état d'exécution au 17 septembre 2026

## Cible actuelle

**Local-first + Google Drive + GitHub Pages. Documentation mise à jour ; implémentation Drive non commencée ; gates Drive 1, 2 et 3 non validées.**

Le [plan Google Drive](REFACTORISATION-V6-LOCAL-FIRST-GOOGLE-DRIVE.md) remplace les instructions Neon/Vercel. Les documents UI/UX restent inchangés.

## État effectivement établi

- PR historique [#9](https://github.com/christolosier-ship-it/Gargotte-V5/pull/9), branche refactor/v6-neon-local-first, commit examiné d38fc2993bc7111224f2aae05076d7dcf8e45a05.
- Gate 2 Neon validée selon les preuves de cette PR : 15 tests, transport SDK réel, contrôle SHA-256 et reprise. Ces résultats ne prouvent pas le futur transport Drive.
- Le runtime, la connexion, le build et les tests distants utilisent encore Neon.
- Phase 3 Neon non clôturée. Aucune migration personnelle complète ni validation PWA iPad n'est démontrée.
- Le stockage des originaux dans Neon gratuit a bloqué la cible précédente ; aucune promotion de ce schéma vers la production n'est demandée.
- L'utilisateur conserve son installation GitHub Pages. L'export ZIP global sature sa mémoire ; ne pas le rendre obligatoire.
- Les sources Drive ont été repérées ; leur nom ne prouve pas qu'elles sont identiques aux blobs V5.
- L'espace libre déclaré est suffisant pour envisager Drive, sous réserve du quota constaté pendant la migration.

## Prochaine exécution

1. Implémenter la fondation Google dans une branche isolée issue du travail technique, en préservant les évolutions parallèles de V5.3.
2. Faire configurer le client OAuth par le propriétaire ; les connecteurs de cette session n'administrent pas Google Cloud.
3. Valider la gate Drive 1 sur iPad avant de poursuivre la synchronisation complète.
4. Valider la gate Drive 2 avant toute migration personnelle.
5. Valider la gate Drive 3 avant clôture et promotion.

La mise à jour documentaire n'autorise ni suppression des ressources Neon/Vercel, ni clôture de la PR #9, ni modification des fichiers sources Drive.

## Historique

Les checkpoints Neon et leurs limites sont conservés dans [l'état archivé](archive/neon/V6-ETAT-EXECUTION.md). Les anciennes « étapes restantes » et instructions de promotion sont historiques, pas des actions à exécuter.
