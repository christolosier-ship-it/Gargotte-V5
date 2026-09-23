# V7 Lot 6 — Migration réelle des médias

## Objectif
Migrer l'ensemble des médias de production IndexedDB vers R2 en utilisant uniquement le moteur validé au Lot 5.

## Préconditions
- Lire le maître V7.
- Lot 5 validé.
- Aucun bug de reprise connu.
- Aucun nettoyage local actif.

## Travaux
- Lancer la migration par lots raisonnables.
- Laisser la migration reprendre d'une session à l'autre.
- Surveiller les échecs.
- Corriger uniquement les causes réelles.
- Relancer sélectivement les échecs.
- Comparer le volume et le nombre de médias attendus.
- Vérifier les métadonnées D1 associées.

Pour chaque média attendu :
- original identifié lorsqu'il existe ;
- thumbnail et preview identifiés lorsqu'ils existent ;
- dérivé `transparent_blob` identifié et migré lorsqu'il existe ;
- chaque cible R2 identifiée séparément ;
- contrôle d'intégrité réussi pour chaque variante ou état explicitement qualifié.

## Cas particuliers
Tout média dont le Blob source est absent, illisible ou incohérent doit être signalé distinctement. Ne pas le faire passer silencieusement comme migré.

## Interdictions
- Aucune bascule backend-first tant que la Gate n'est pas franchie.
- Aucun effacement IndexedDB.
- Aucun nettoyage du migrateur.

## Gate absolue
- Tous les médias attendus ont un état final explicite.
- Aucun média marqué migrated sans vérification.
- Les erreurs résiduelles sont nulles ou documentées et acceptées explicitement.
- Les originaux disponibles sont intacts localement.

## Livrable
Bibliothèque R2 vérifiée et rapport final de migration.
