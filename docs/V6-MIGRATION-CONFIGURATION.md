# V6 — configuration Google Drive et migration GitHub Pages

## Statut

Procédure cible à implémenter. Le runtime hérité utilise encore Neon ; ne pas suivre cette procédure comme si Drive était déjà disponible. [Plan](REFACTORISATION-V6-LOCAL-FIRST-GOOGLE-DRIVE.md), [état](V6-ETAT-EXECUTION.md), [ancienne procédure Neon](archive/neon/V6-MIGRATION-CONFIGURATION.md).

## Configuration Google, action propriétaire

1. Créer ou choisir un projet Google Cloud dédié ; activer Google Drive API et Google Picker API si le sélecteur est utilisé.
2. Configurer l'écran de consentement pour l'usage personnel et les permissions minimales. Vérifier les contraintes du statut test/publication ; ne pas promettre de sessions permanentes.
3. Créer un client OAuth de type Web. Origine JavaScript de production : https://christolosier-ship-it.github.io (sans chemin). Ajouter uniquement les origines de test réellement utilisées, dont localhost avec son port.
4. Configurer drive.file et le parcours de sélection explicite ; tester les fichiers existants par lots. Ne pas supposer d'autorisation récursive du dossier. Toute permission plus large doit être décidée séparément.
5. Fournir au build uniquement le Client ID public et, si nécessaire, la clé Picker publique restreinte. Les noms exacts des paramètres seront fixés par l'implémentation ; aucune variable Drive n'existe encore dans le code.
6. Autoriser le compte dans Safari et la PWA installée, puis tester expiration, révocation et changement de compte.

Aucun secret OAuth, mot de passe, refresh token ou URL de session de transfert dans le dépôt. Le connecteur de conversation ne configure ni le client Google Cloud ni le consentement de la PWA.

## Build et publication futurs

Le build actuel utilise Node 24, npm ci, npm test et npm run build, et produit dist/. Il bundle Neon et contient des conditions Vercel : les remplacer avant publication Drive, sans présenter la documentation comme un correctif du runtime.

Prévoir une publication de l'artefact dist/ sur GitHub Pages via Actions, avec chemins relatifs sous /Gargotte-V5/, manifest et scope préservés, cache versionné et activation cohérente des assets. L'URL de production reste https://christolosier-ship-it.github.io/Gargotte-V5/.

Aucune modification Pages, variable, déploiement ou ressource distante n'est effectuée par cette livraison documentaire.

## Migration locale et sources

Ne pas désinstaller la PWA ni effacer Safari. La même origine et le même nom IndexedDB facilitent la continuité, mais le parcours réel de la PWA installée doit être testé. Une preview sur une autre origine utilise une autre base.

1. Inventorier sur l'installation réelle les neuf catégories, IDs, relations et médias avant toute écriture de migration. Garder une sauvegarde structurée XLSX/JSON accessible ; ne pas imposer le ZIP global.
2. Préserver les blobs locaux actuels. Utiliser le XLSX récent comme source de rapprochement ; un ancien export ne prouve pas l'état actuel.
3. Identifier les fichiers Drive autorisés, exclure Old et descendants. Ne pas importer les donjons supplémentaires absents du dataset sans décision métier.
4. Réutiliser les associations déjà confirmées dans l'inventaire privé. Ne pas résoudre les homonymes seulement par nom ; vérifier contexte du donjon, IDs et relations.
5. Distinguer original local V5 et source Drive : s'ils diffèrent, conserver les deux provenances sans écrasement implicite.
6. Faire la migration par petits lots reprenables. Acquitter les originaux après taille/hash vérifiés ; enregistrer les écarts.
7. Restaurer sur un appareil vierge depuis Drive, sans réinjecter de seed. Comparer comptages, relations et médias.
8. Sur l'iPad installé, tester mode avion, éditions, fermeture/réouverture, retour réseau et mise à jour applicative.

## Récupération et exploitation

Les snapshots/checkpoints et le journal doivent permettre de restaurer un état cohérent. Une donnée supprimée manuellement sur Drive ne doit pas provoquer l'effacement de sa dernière copie locale. Aucun nettoyage automatique des sources ou sauvegardes dans la première version.

Un rollback de code ne doit pas ouvrir une base locale avec une version inférieure incompatible ; fournir un correctif compatible ou une procédure de récupération vérifiée. Ne pas proposer « vider les données » comme dépannage.

Afficher séparément état des données et état des médias ; proposer reconnexion quand nécessaire. Le quota compte les copies gérées et sauvegardes ; surveiller également le quota iPad. Les originaux disponibles hors ligne sont uniquement ceux déjà téléchargés.

## Gates

Configuration réelle et test iPad = gate 1 ; synchronisation complète à deux appareils = gate 2 ; dataset personnel, nouvel appareil et déploiement validés = gate 3. Aucune n'est actuellement validée. Ne retirer les ressources historiques qu'à l'occasion d'une tâche ultérieure explicite.
