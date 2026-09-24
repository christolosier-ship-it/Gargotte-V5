# V7 Lot 6 — Migration réelle des médias actifs

## Objectif
Migrer l'ensemble des médias actifs de production vers R2 en utilisant uniquement le moteur validé au Lot 5.

## Préconditions
- Lire le maître V7.
- Lot 5 validé.
- Aucun bug de reprise connu.
- Aucun nettoyage local actif.

## Travaux
- Construire le décompte des médias éligibles selon le contrat.
- Lancer la migration par lots raisonnables.
- Laisser la migration reprendre d'une session à l'autre.
- Surveiller les échecs.
- Corriger uniquement les causes réelles.
- Relancer sélectivement les échecs.
- Comparer le nombre et le volume des médias actifs attendus.
- Vérifier les métadonnées D1 associées.

Pour chaque média éligible :
- une seule source active attendue est identifiée ;
- transparent pour une entité détourée ;
- image non détourée pour un Donjon ;
- cible R2 identifiée ;
- contrôle d'intégrité réussi.

Les anciens originaux blancs, thumbnails et previews sont comptés comme hors périmètre et ne constituent pas des erreurs de migration.

## Cas particuliers
Tout média actif attendu dont le Blob source est absent, illisible ou incohérent doit être signalé distinctement.

Ne jamais remplacer silencieusement un détourage manquant par l'ancien original blanc.

## Interdictions
- Aucune bascule backend-first tant que la Gate n'est pas franchie.
- Aucun effacement IndexedDB.
- Aucun nettoyage du migrateur.
- Aucune extension opportuniste du périmètre aux variantes historiques.

## Gate absolue
- Tous les médias actifs attendus ont un état final explicite.
- Aucun média marqué migrated sans vérification.
- Les erreurs résiduelles sont nulles ou documentées et acceptées explicitement.
- Les médias hors périmètre sont identifiés comme tels, pas comme des échecs.
- Les données locales restent intactes.

## Livrable
Bibliothèque R2 active vérifiée et rapport final de migration.
