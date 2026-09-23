# V7 Lot 5 — Migrateur médias incrémental

## Objectif
Construire le moteur temporaire qui migre les médias IndexedDB vers R2 un par un, avec reprise et contrôle d'intégrité.

## Préconditions
- Lire le maître V7.
- Lot 3 validé.
- Modèle media_assets du Lot 1 appliqué.
- Aucun besoin d'attendre la bascule D1 pour commencer les tests synthétiques.

## Principe
Pour chaque média :
1. lire le Blob source depuis IndexedDB ;
2. calculer SHA-256 local ;
3. collecter taille, type MIME et métadonnées utiles ;
4. uploader vers R2 via l'API Worker ;
5. vérifier l'objet distant ;
6. comparer au minimum taille et SHA-256 ;
7. écrire/mettre à jour la métadonnée cible ;
8. marquer le média comme migré uniquement après vérification.

## États provisoires
Prévoir des états explicites, par exemple :
- pending
- uploading
- verifying
- migrated
- failed

Le modèle exact doit rester temporaire et facilement supprimable au Lot 8.

## Reprise
Le moteur doit :
- reprendre après fermeture de la PWA ;
- ne pas créer de doublon ;
- reconnaître un objet déjà migré et vérifié ;
- permettre de relancer uniquement les échecs ;
- ne pas dépendre d'une longue session continue.

## Interface provisoire
Prévoir un écran simple permettant de suivre :
- total ;
- migrés ;
- vérifiés ;
- en cours ;
- échecs ;
- restants ;
- volume migré ;
- erreurs détaillées.

## Tests obligatoires
Tester d'abord sur un très petit échantillon :
- petit fichier ;
- gros fichier ;
- plusieurs types MIME ;
- média lié ;
- média orphelin ;
- interruption volontaire ;
- reprise ;
- retry après échec.

## Interdictions
- Ne jamais supprimer le Blob local.
- Ne jamais marquer migrated avant contrôle.
- Ne pas lancer toute la bibliothèque pendant la construction du moteur.

## Gate
Le moteur est fiable, idempotent et reprend correctement après interruption sur un échantillon contrôlé.

## Livrable
Migrateur média prêt pour l'exécution réelle du Lot 6.
