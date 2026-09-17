# V6 — fondation des médias sur Google Drive

## Statut

Spécification cible à implémenter, aucune gate Drive validée. Référence : [plan Google Drive](REFACTORISATION-V6-LOCAL-FIRST-GOOGLE-DRIVE.md). Le [modèle Neon historique](archive/neon/V6-MEDIA-FONDATION.md) reste archivé ; les tables et scripts correspondants ne sont pas modifiés dans cette livraison.

## Modèle

media_assets conserve les IDs et relations métier. Le Blob local reste la copie de travail. Une référence distante technique associe espace/propriétaire, ID média, ID de fichier Drive, MIME, taille, SHA-256 et provenance. Les jetons et sessions de transfert ne font pas partie des exports structurés.

Séparer les sources artistiques, les originaux gérés par Gargottex et les miniatures. Aucune conversion de format sur l'original. Les images V5 déjà recompressées restent conservées avec leur provenance ; une source Drive n'est jamais présentée comme la reconstruction bit-identique de ces images.

Les dossiers contenant « Old » et leurs descendants sont exclus. Les rapprochements de noms demandent confirmation des ambiguïtés, puis contrôle des octets. Conserver les choix déjà confirmés dans l'inventaire privé ; ne pas publier cet inventaire dans le dépôt.

## Intégrité et durabilité

Un fichier référencé par ID peut être modifié ou supprimé dans Drive. Le hash attendu doit détecter ce changement. Une référence à une source mutable n'est pas une sauvegarde indépendante : utiliser une copie gérée vérifiée lorsque nécessaire, sans toucher à la source.

Un nouvel original reçoit une nouvelle référence/version ; aucun remplacement silencieux de l'original vérifié. Utiliser le SHA-256 distant s'il est fourni par Drive, sinon effectuer une relecture indépendante. Une miniature ou un hash déclaré seulement par l'émetteur ne suffit pas à confirmer les octets distants.

Ne retirer une copie locale que dans une politique ultérieure explicitement définie, après preuve de récupération. Aucune éviction applicative automatique dans la première version. Une suppression métier conserve un tombstone ; ne supprimer physiquement ni source artistique ni fichier encore référencé.

## Mémoire et quotas

La limite 64 Mio et les chunks PostgreSQL de 256 Kio appartiennent au runtime historique. Définir et mesurer la limite du transport Drive sur iPad avant la gate 2. Préférer le calcul incrémental pour les gros fichiers ; borner buffers, transferts et miniatures.

L'espace libre Drive ne garantit ni RAM ni quota IndexedDB. Vérifier les estimations et traiter les erreurs réelles ; ne jamais marquer « sauvegardé » ou « disponible hors ligne » en cas d'échec.

## Gate 1

Sur un espace de test distinct : autorisation aux fichiers sélectionnés, refus sans autorisation/autre compte, upload interrompu et repris, taille et SHA-256 identiques après téléchargement sur iPad. Les tests Neon antérieurs ne remplacent pas cette preuve.
