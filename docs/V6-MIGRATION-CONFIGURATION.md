# Configuration et migration V6

## Construire et servir

Node 24, `npm ci`, `npm test`, `npm run build`. Servir **dist/**, jamais la racine en production.
La PWA conserve ses modules JavaScript, sans framework. esbuild bundle uniquement le client Neon et ses dépendances.
`PUBLIC_NEON_DATABASE_URL` est une URL **HTTPS sans identifiants**, par exemple `https://ep-….c-6.us-east-2.aws.neon.tech/neondb`.
Aucune connexion `postgres://`, clé d’administration, mot de passe ou session ne va dans le build.

La preview de `refactor/v6-neon-local-first` possède un fallback public explicitement limité à cette branche de test.
La production exige une variable `PUBLIC_NEON_DATABASE_URL` configurée ; le build refuse son absence pour ne pas publier silencieusement une V6 sans cloud.
Ajouter chaque domaine de déploiement utilisé aux domaines autorisés Neon Auth. Ne pas désactiver la protection des previews Vercel.

## Migrations Neon

Les deux premières migrations sont appliquées uniquement à la branche de travail `br-wandering-bread-b48avojm`. Sa branche enfant `br-falling-violet-b4am8hbo` inclut aussi la troisième migration des originaux et constitue désormais la cible de preview/test Phase 2.
La deuxième déplace l’écriture de l’historique après l’opération SQL finale : `ON CONFLICT` ne crée donc aucune révision fantôme.
La branche production nécessite d’abord Auth + Data API, sans grants globaux, puis les migrations en ordre chronologique.
Ne pas rejouer un fichier déjà appliqué. Ne pas réécrire l’historique. La promotion nécessite la confirmation prévue dans le plan.
Créer/administrer le compte personnel via Neon ; aucune inscription dans l’interface Gargottex.

## Synchronisation

- Même nom de base IndexedDB V5, version portée à 4 ; aucun store métier effacé pendant l’upgrade.
- Les opérations métier et leur outbox sont enregistrées dans une seule transaction locale.
- Les événements immuables contiennent les métadonnées structurées, jamais les blobs. Confirmation par numéro exact d’événement.
- Envois par lots jusqu’à 50 fiches distinctes d’une même catégorie, en respectant l’ordre des opérations.
- Les erreurs restent dans l’outbox avec compteur et dernière erreur ; retry exponentiel plafonné à cinq minutes, réveil au retour réseau.
- Pull incrémental paginé depuis `entity_revisions`, avec curseur local transactionnel ; appliquer une révision distante ne recrée pas d’outbox.
- Le verrou transactionnel serveur par propriétaire sérialise l’attribution des révisions ; les curseurs ne dépendent pas des horloges des appareils.
- Les suppressions distantes sont des tombstones. L’historique conserve l’état précédent.
- Une édition locale en attente prime sur une révision reçue. En concurrence, la dernière synchronisation acceptée devient courante ; les états remplacés restent en historique.
- Un premier compte lie atomiquement cette copie locale à son propriétaire. Pour un autre compte, utiliser un autre profil de navigateur ; aucune réaffectation silencieuse des données.
- Les originaux locaux sont conservés et sauvegardés par morceaux après connexion ; reprise, hash et restauration sont décrits dans `V6-MEDIA-SYNCHRONISATION.md`. Les erreurs ne détruisent aucune copie saine.

## Migration de l’iPad

**Ne pas effacer les données Safari ni désinstaller l’ancienne PWA pendant la migration.**
IndexedDB appartient à l’origine web. Sur la même origine, l’upgrade conserve les stores existants.
Sur une nouvelle origine, transférer un export ; la nouvelle URL ne peut pas lire l’ancienne IndexedDB.

1. Garder l’ancienne installation et ses sauvegardes accessibles.
2. Sur une installation équipée de l’export V6, Import/Export → « Exporter les données JSON (sans images) ».
3. Vérifier les neuf catégories : donjons, créatures, héros, PNJ, quêtes, loot, interactables, Brouhaha et métadonnées médias.
4. Sur la destination, importer ce JSON. L’import valide tout le fichier avant une transaction de fusion. Les identifiants correspondants sont remplacés après confirmation, les autres fiches restent présentes. Un JSON invalide n’écrit rien.
5. Se connecter au compte personnel. Attendre « Synchronisé » et vérifier les comptages et des fiches représentatives.
6. Vérifier que chaque original attendu est « sauvegardé et vérifié », sans erreur média. Sur un nouveau navigateur, les fiches sont reconstruites ; récupérer les originaux individuellement depuis Médias et contrôler taille/hash et relations. L’inventaire réel est une preuve de Phase 3, pas encore réalisée.
7. Conserver l’ancienne installation tant que cette comparaison n’est pas terminée.

Si l’ancienne origine ne propose pas encore l’export JSON, elle doit recevoir l’outil d’export avant le changement d’origine. Le code V6 peut être servi sur cette origine avec `config.js` vide : la couche locale et les exports restent opérationnels sans Neon. Ne pas considérer un XLSX ancien comme la preuve des données actuelles de l’iPad.

## Vérifications reproductibles

`npm test` couvre stockage, transactions, panne réseau, écriture concurrente à un envoi, bootstrap, tombstones, préservation de blobs locaux, isolation du compte et exports.
`scripts/verify-neon.mjs` vérifie le transport réel contre une **branche jetable explicitement fournie**, avec un fichier local de comptes de test contenant id/JWT. Les secrets ne sont pas committés et aucun compte réel n’est utilisé.
Les tests navigateur/PWA et la comparaison des données réelles de l’iPad complètent ces tests automatisés ; leur état exact figure dans `V6-ETAT-EXECUTION.md`.
