# V6 — synchronisation Drive des données et originaux

## Statut et périmètre

Contrat cible non implémenté. [Plan canonique](REFACTORISATION-V6-LOCAL-FIRST-GOOGLE-DRIVE.md). Les [preuves Neon de phase 2](archive/neon/V6-MEDIA-SYNCHRONISATION.md) sont historiques.

## Données structurées

Conserver l'écriture locale + outbox atomique. Remplacer le journal SQL par des lots immuables d'opérations avec IDs stables, parents et versions de schéma. Les curseurs Drive sont opaques : ne pas les convertir en revision_id numérique.

Valider et appliquer les lots avec déduplication avant avancement transactionnel du curseur. Le flux changes est un mécanisme de découverte ; le journal métier contient les états nécessaires à la restauration. Les checkpoints sont immuables et indiquent exactement les opérations couvertes.

L'acquittement vise uniquement la génération envoyée. Une réponse perdue après acceptation doit être résolue par l'identité stable du fichier/lot, sans nouvelle opération logique. Les éditions concurrentes conservent leurs deux versions ; leur résolution est un nouvel événement. Un tombstone ne détruit pas une édition ou un original local non sauvegardé.

## Upload média

1. Lire l'original et la génération en attente, vérifier propriétaire et espace cible.
2. Calculer taille et SHA-256 en respectant le budget mémoire.
3. Démarrer/reprendre un upload Drive ; persister son état technique local sans exposer l'URL de session dans les logs/exports.
4. Après interruption, interroger l'état distant. Si la session a expiré, reprendre avec la même identité logique et une nouvelle session contrôlée.
5. Vérifier taille et hash distants ; relire le fichier si le checksum indépendant n'est pas disponible.
6. Confirmer seulement la génération exacte, puis publier la disponibilité du binaire. Une fiche ne doit pas annoncer un original vérifié tant que cette étape n'a pas réussi.

Les erreurs d'un média n'empêchent pas les échanges structurés. Borner le nombre de transferts, réessayer avec backoff et conserver les erreurs visibles. Expiration OAuth : arrêter proprement et demander une reconnexion sans perdre l'outbox. Les sessions de transfert restent des données sensibles.

## Téléchargement et offline

Récupérer d'abord les métadonnées. Télécharger un fichier ou un lot de donjon à la demande, avec progression et annulation. Vérifier taille et SHA-256 avant installation transactionnelle dans IndexedDB ; détecter une édition/suppression concurrente.

Une coupure conserve les copies saines. La reprise partielle doit être testée ou, à défaut, reprendre uniquement le fichier courant avec un message clair ; ne jamais prétendre disposer d'une reprise au dernier octet sans preuve. Ne pas charger tous les originaux en RAM.

États : local_only, uploading, remote_only, downloading, local_remote_verified, sync_error, missing ; ajouter un état de conflit explicite si nécessaire. Le statut structuré « synchronisé » ne masque pas un média en erreur. Les miniatures restent des dérivés régénérables.

## Concurrence et suppressions

Les verrous inter-onglets sont locaux à un appareil, pas des verrous Drive distribués. La sécurité multi-appareils repose sur les IDs d'opérations, parents, journaux immuables et déduplication. Ne pas résoudre par simple horodatage du dernier appareil.

La suppression métier publie un tombstone. Une suppression manuelle dans Drive génère une anomalie récupérable ; elle ne doit pas effacer automatiquement les données locales. La purge physique et la compaction du journal sont hors de la première livraison.

## Gate 2

Tests sur deux installations : édition/édition et édition/suppression hors ligne, horloges décalées, réponse perdue après acceptation, retry, token expiré/révoqué, changement de compte, pagination, bootstrap vide, checkpoints, absence de seed parasite, import/export, quota local/Drive, corruption, source supprimée et restauration bit-identique.

Confirmer la cohérence du dataset et de ses relations après convergence. Le mode fermé/suspendu n'offre aucune garantie de transfert ; reprendre au retour dans l'application.
