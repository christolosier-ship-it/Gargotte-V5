# Gargottex V6 — Local-first + Google Drive + GitHub Pages

## 1. Décision et statut

Décision du 17 septembre 2026 : remplacer la cible Neon/Postgres et la distribution Vercel par Google Drive et GitHub Pages. Motifs : capacité disponible, maîtrise des coûts et réduction des services à administrer. L'espace libre déclaré par le propriétaire suffit à l'inventaire connu ; vérifier à nouveau les quotas au moment des transferts. Aucun tarif gratuit illimité n'est garanti.

**Ce document est la source de vérité du prochain chantier technique. La synchronisation Drive n'est pas implémentée et aucune gate Drive n'est validée.** Le code hérité de la PR #9 reste Neon au commit d38fc2993bc7111224f2aae05076d7dcf8e45a05. Les anciennes preuves sont conservées dans [l'archive Neon](archive/neon/V6-ETAT-EXECUTION.md).

Cette livraison est documentaire. Le lancement du développement, la configuration OAuth et la migration sont des étapes ultérieures. Les documents UI/UX, maquettes et assets de leur chantier parallèle sont hors périmètre.

## 2. Architecture

| Composant | Responsabilité cible |
| --- | --- |
| GitHub | Code, tests, documentation, historique et build |
| GitHub Pages | PWA statique à l'adresse actuelle /Gargotte-V5/ |
| IndexedDB | Copie de travail, originaux locaux, outbox, états de synchronisation |
| Google Identity Services | Autorisation personnelle d'accès aux fichiers Drive |
| Google Drive API | Données structurées, opérations immuables, sauvegardes et originaux privés |
| XLSX / JSON | Imports et exports portables des données structurées |

Aucun serveur applicatif permanent, Neon, Supabase, bucket supplémentaire ou backend Vercel n'est requis par cette cible. Les ressources historiques restent intactes tant que leur retrait n'est pas traité séparément.

L'accès local ne dépend jamais de Google. Les modules Google sont chargés seulement pour la connexion ; leur indisponibilité ne bloque pas le démarrage hors ligne.

## 3. Invariants

- Enregistrer chaque édition et son événement sortant dans une même transaction locale, avant tout réseau.
- Préserver le nom IndexedDB gargottex-v5-offline, les identifiants métier, relations, stores, blobs et préférences. Toute évolution de version est additive et testée.
- Conserver les neuf catégories existantes : dungeons, creatures, heroes, npcs, quests, loot_items, interactables, brouhaha_effects, media_assets.
- Ne jamais considérer l'absence de donjons comme la preuve d'une base vierge. Une restauration distante ne doit pas injecter de seed concurrent.
- Aucun effacement de Safari, aucune désinstallation, aucun écrasement global pour migrer.
- Aucun réencodage, resize ou substitution de miniature sur un original ; contrôle SHA-256 et taille.
- Aucun contenu privé, fichier d'inventaire personnel, identifiant de fichier Drive personnel ou jeton publié dans GitHub.
- Aucun changement de règles, lore, statistiques ni refonte UI/UX. Seuls connexion, progression, erreurs, conflits et restauration nécessaires sont autorisés.
- Aucun ZIP global obligatoire : le précédent export complet sature la mémoire de l'iPad.

## 4. Autorisation et confidentialité

Utiliser Google Identity Services en mode navigateur, sans secret client ni refresh token embarqué. Le Client ID OAuth est public ; une éventuelle clé Picker est limitée aux API et origines requises. Les jetons d'accès restent en mémoire et hors logs, cache, URL, exports et IndexedDB.

Privilégier drive.file pour les fichiers créés par Gargottex et ceux explicitement autorisés via Google Picker. Sélectionner un dossier n'est pas une preuve d'accès récursif à ses fichiers existants : tester ce parcours en phase 1. Prévoir une sélection multiple par lots. Ne pas élargir silencieusement à drive ou drive.readonly ; une telle option exige une décision documentée et l'examen des obligations Google.

Le connecteur Drive de l'assistant et le client OAuth de Gargottex ont des autorisations distinctes. Le propriétaire doit configurer le projet Google Cloud, activer Drive API et Picker si utilisé, créer un client Web et autoriser l'application.

L'autorisation expirée peut nécessiter un geste utilisateur pour obtenir un nouveau jeton. Afficher « Connexion requise — modifications conservées localement ». Reprendre ensuite automatiquement les opérations en attente. Ne pas promettre de synchronisation quand la PWA est fermée ou suspendue.

Lier la copie locale à une identité Google stable et à un espace de synchronisation. Un changement de compte ne réaffecte ni ne téléverse automatiquement l'ancien contenu. La liaison Neon éventuelle doit être migrée explicitement sans effacer les données.

Les fichiers distants restent privés. Une application statique publique ne rend pas ses données Drive publiques ; les données locales restent accessibles à la personne ayant accès au profil/appareil.

## 5. Organisation Drive

Créer, lors du développement autorisé, un espace de test isolé puis un espace de production identifié par ID, avec données, opérations, médias gérés et sauvegardes. Ne pas utiliser le nom d'un dossier comme identifiant unique.

Les dossiers artistiques existants restent des sources : donjons 1 à 15, Héros et PNJ. Ignorer tout dossier dont le nom contient « Old », sans distinction de casse, et tous ses descendants. Ne pas déplacer, renommer, supprimer ou modifier les fichiers sources.

Une image source peut être référencée après autorisation et vérification. Cette référence seule ne garantit pas une sauvegarde immuable : détecter toute modification/disparition. Pour protéger les octets contre les modifications des sources, prévoir une copie gérée vérifiée avant de déclarer la sauvegarde durable. Comptabiliser ces copies dans le quota. Dédupliquer seulement si les références métier et la dernière copie saine sont protégées.

Lier média métier, ID Drive, MIME, taille, SHA-256 et provenance. Une correspondance de nom n'établit pas la bit-identité. Les anciens blobs V5 recompressés restent préservés tels quels ; les sources Drive réintroduites sont identifiées comme telles.

## 6. Protocole structuré à implémenter

Drive fournit des fichiers et un flux de changements, pas les transactions ni les révisions PostgreSQL du moteur actuel. Le protocole doit être spécifié et testé avant intégration.

- Chaque opération reçoit un identifiant global stable, un identifiant d'appareil, une entité/id métier, une version de schéma, sa révision parente et son contenu ou tombstone.
- Publier des lots bornés d'opérations immuables ; un lot est entièrement validé avant application locale.
- Conserver l'identité du lot pendant tous les retries. Préallouer/persister l'ID distant lorsque possible et traiter une réponse perdue sans produire plusieurs opérations logiques.
- Acquitter uniquement les événements exacts dont la publication est confirmée. Une nouvelle édition ne peut pas être acquittée par un ancien envoi.
- Récupérer le journal avec pagination/curseur Drive ; appliquer le contenu et avancer le curseur dans une transaction locale. Une opération déjà vue reste sans effet.
- Le flux de changements Drive indique les fichiers à récupérer, pas l'historique métier complet. Conserver celui-ci dans les fichiers d'opérations.
- Détecter les éditions concurrentes par leurs parents, sans dépendre de l'heure des appareils. Conserver les deux versions et proposer une résolution explicite ; celle-ci devient une nouvelle opération.
- Une suppression est un tombstone. Une édition concurrente non sauvegardée reste récupérable ; aucune résurrection ni destruction silencieuse.
- Les checkpoints sont immuables, avec un ensemble explicite d'opérations couvertes. Les pointeurs/index sont reconstruisibles ; aucun gros fichier partagé écrasé par plusieurs appareils ne constitue l'unique vérité.
- Ne pas purger le journal ni les tombstones dans la première livraison. La compaction ultérieure devra démontrer la restauration et le retour d'un appareil longtemps hors ligne.
- Un fichier Drive manquant ou inaccessible est une erreur à diagnostiquer, pas une suppression métier implicite.

## 7. Médias et mémoire

Voir [fondation média](V6-MEDIA-FONDATION.md) et [synchronisation média](V6-MEDIA-SYNCHRONISATION.md).

Traiter les originaux séquentiellement ou avec une concurrence strictement bornée ; utiliser les uploads reprenables, leur état persistant et les reprises après expiration de session. Vérifier SHA-256 distant lorsqu'il est disponible, sinon relire les octets pour vérification indépendante.

L'ancienne limite de 64 Mio appartient au code Neon existant, pas à Drive. La limite opérationnelle cible sera décidée par mesures mémoire sur iPad ; conserver un refus explicite et la copie locale si elle est dépassée. Ne pas charger tous les originaux simultanément.

Télécharger les métadonnées avant les binaires ; téléchargement individuel et lots de donjon explicitement demandés, avec progression et annulation. Un média disponible sur Drive n'est pas encore disponible hors ligne. Vérifier le quota local et les erreurs réelles d'écriture.

## 8. Migration et déploiement

L'URL cible reste https://christolosier-ship-it.github.io/Gargotte-V5/. Préserver origine, chemin, manifest, scope et accès à l'IndexedDB existante ; valider cela sur la PWA installée. Une autre origine ne peut pas lire cette base.

Construire un artefact statique dist/ adapté à Pages ; retirer les exigences Neon/Vercel du build seulement dans la future implémentation. Ne pas publier directement le code actuel comme s'il utilisait Drive. Tester les chemins sous /Gargotte-V5/ et une activation cohérente du service worker.

L'iPad est prioritaire pour ses données actuelles. Le XLSX récent et les sources Drive servent au rapprochement/récupération, pas à l'écrasement aveugle. Préserver les IDs disponibles, signaler les relations ambiguës et inventorier les divergences. Ne pas ajouter les donjons absents du dataset simplement parce qu'un dossier Drive existe.

Voir [configuration et migration](V6-MIGRATION-CONFIGURATION.md).

## 9. Trois phases et gates

| Phase | Travail | Gate obligatoire |
| --- | --- | --- |
| 1 — Fondation Drive | Contrat de données, OAuth, accès aux sources, espace de test, préservation locale et prototype sur iPad | Connexion réelle dans Safari et PWA installée ; transfert/récupération bit-identiques ; accès privé ; expiration/annulation sans perte ; fonctionnement local intact |
| 2 — Synchronisation | Journal, outbox, idempotence, conflits, tombstones, médias reprenables, restauration et exports | Deux appareils convergent ; panne/réponse perdue/reconnexion/changement de compte testés ; originaux vérifiés ; aucune perte ni duplication logique |
| 3 — Migration et Pages | Inventaire réel, migration progressive, contrôles de relations/hashes, restauration complète, déploiement | Comptages expliqués, médias attendus vérifiés ou écarts résolus explicitement, nouvel appareil, PWA installée/mode avion/mise à jour, CI pertinente verte et procédure de récupération vérifiée |

Ne pas passer à la phase suivante avant sa gate. Les gates Neon sont des preuves historiques non transférables. La phase 3 Neon n'a pas été clôturée.

## 10. Acceptation et livraison

Tester CRUD local, import JSON/XLSX invalide sans écriture partielle, conservation des blobs, reprise d'outbox, bootstrap depuis une installation vide, doublons, conflits édition/édition et édition/suppression, absence de résurrection, changement de compte, Google inaccessible, quotas Drive/local, corruption/hash divergent, fichiers sources modifiés/supprimés, interrompre/reprendre un upload et un téléchargement.

Exiger les preuves du navigateur installé sur iPad ; fake-indexeddb et tests de transport seuls ne suffisent pas. Conserver les exports structurés indépendants du cloud. Tester restauration à partir d'un checkpoint et du journal, ainsi que rollback applicatif sans downgrade destructif du schéma local.

Livrables : code/tests, configuration publique documentée, procédure OAuth, inventaire privé, preuves des gates, documentation d'exploitation et PR révisable. La V6 ne sera terminée qu'après gate 3, pas après cette mise à jour documentaire.

## 11. Références

- [État du chantier](V6-ETAT-EXECUTION.md)
- [Scopes Drive](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
- [Autorisation navigateur et expiration](https://developers.google.com/identity/oauth2/web/guides/use-token-model)
- [Uploads reprenables](https://developers.google.com/workspace/drive/api/guides/manage-uploads)
- [Flux de changements](https://developers.google.com/workspace/drive/api/guides/manage-changes)
- [Limites API et coûts](https://developers.google.com/workspace/drive/api/guides/limits)
- [Stockage WebKit](https://webkit.org/blog/14403/updates-to-storage-policy/)

Revalider les exigences Google et quotas lors de la configuration effective.
