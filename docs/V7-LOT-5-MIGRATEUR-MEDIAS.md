# V7 Lot 5 — Migrateur médias actifs incrémental

## Objectif
Construire le moteur temporaire qui migre vers R2 uniquement les médias actifs prévus par le contrat V7, un par un, avec reprise et contrôle d'intégrité.

## Préconditions
- Lire le maître V7.
- Lot 3 validé.
- Modèle media_assets du Lot 1 appliqué.

## Éligibilité
Pour chaque relation média, déterminer une seule source binaire attendue :
- dérivé transparent actif pour les entités détourées ;
- image non détourée pour un Donjon.

Ne pas uploader :
- original blanc historique ;
- thumb_blob historique ;
- preview_blob historique.

Un média sans source active éligible doit être qualifié explicitement. Il ne faut pas utiliser l'ancien original blanc comme fallback silencieux.

## Principe
Pour chaque média actif attendu :
1. identifier la source locale éligible ;
2. lire uniquement ce Blob ;
3. calculer SHA-256 local ;
4. collecter taille, MIME, dimensions et relation ;
5. uploader vers R2 via le Worker ;
6. vérifier l'objet distant ;
7. comparer taille et SHA-256 ;
8. écrire/mettre à jour la métadonnée D1 ;
9. marquer migrated uniquement après vérification.

## États provisoires
Prévoir des états explicites comme pending, uploading, verifying, migrated, failed et skipped_not_eligible.

Le modèle exact reste temporaire et supprimable au Lot 8.

## Reprise
Le moteur doit :
- reprendre après fermeture ;
- éviter les doublons ;
- reconnaître un média déjà vérifié ;
- relancer uniquement les échecs ;
- fonctionner par petites unités ;
- ne pas retraiter les variantes historiques exclues.

## Interface provisoire
Afficher au minimum :
- total éligible ;
- migrés ;
- vérifiés ;
- en cours ;
- échecs ;
- hors périmètre ;
- restants ;
- volume migré ;
- erreurs détaillées.

## Tests obligatoires
Tester sur un petit échantillon comprenant :
- transparent lié à une entité ;
- image de Donjon ;
- média contenant aussi un original blanc/thumbnails afin de vérifier qu'ils sont ignorés ;
- gros fichier ;
- interruption ;
- reprise ;
- retry ;
- média non éligible.

## Interdictions
- Ne jamais supprimer le Blob local.
- Ne jamais marquer migrated avant contrôle.
- Ne pas lancer toute la bibliothèque pendant la construction.
- Ne pas uploader une variante historique simplement parce qu'elle existe.

## Gate
Le moteur est fiable, idempotent, reprend après interruption et n'uploade que le patrimoine média actif.

## Livrable
Migrateur prêt pour le Lot 6.
