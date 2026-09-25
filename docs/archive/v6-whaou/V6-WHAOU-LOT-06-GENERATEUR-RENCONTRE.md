# V6-WHAOU — Lot 06 — Générateur et Rencontre

## But

Faire du Générateur une vraie mise en place de table, puis donner au résultat la sensation que les figurines viennent d'être posées devant les joueurs.

Aucune règle de génération ne doit changer.

## Pré-requis

Lire AGENTS.md et docs/V6-WHAOU.md.

Inspecter :
- renderGenerator ;
- renderEncounterResult ;
- SessionContext ;
- actions generate-session-encounter ;
- session-eliminate-creature ;
- objets interactifs ;
- Loot de session.

## État sans session

Conserver renderSessionStartCard.
Appliquer uniquement le socle visuel du Lot 01.

## Configuration

Les cinq étapes actuelles restent :
1. Donjon ;
2. Étage ;
3. Mode ;
4. Budget ;
5. Générer.

Améliorations :
- connexion visuelle légère entre étapes ;
- Budget comme jeton/valeur centrale ;
- Normal, Mini-boss et Boss différenciés par sigil/accent ;
- Donjon actif donne un accent local ;
- bouton Générer possède un feedback tactile court ;
- aucun faux temps de chargement.

Quand une rencontre existe :
- configuration se compacte comme aujourd'hui ;
- le résultat devient clairement prioritaire.

## Apparition du résultat

- entrée de l'article rencontre en 180-280 ms ;
- reduced motion : rendu direct ;
- aucun rerender supplémentaire uniquement pour l'animation.

## Créatures de rencontre

- visuel davantage traité comme figurine ;
- image un peu plus dominante ;
- quantité restante très lisible ;
- stats inchangées ;
- compétence lisible ;
- Fiche conserve sa navigation ;
- Éliminer reste un bouton explicite.

Ne pas dupliquer visuellement trois fois une même créature pour quantité 3.

## Élimination

Amélioration raisonnable :
- feedback local court sur la ligne concernée ;
- puis état mis à jour ;
- si quantité reste > 0, ligne conservée ;
- si quantité = 0, disparition propre.

Ne pas introduire un tracker de PV.

## Loot de session

Lorsqu'un Loot apparaît :
- petite entrée locale ;
- relation cause -> conséquence perceptible ;
- aucune animation si aucun Loot.

## Objets interactifs

- conserver bloc distinct ;
- reprendre la grammaire blueprint du Codex ;
- actions et effet prioritaires ;
- ouverture fiche inchangée.

## Mode Boss

Sans nouvelle cinématique :
- résultat plus lourd visuellement ;
- sigil Boss ;
- accent de catégorie ;
- pas d'écran intermédiaire.

## Rencontre terminée

- apaisement visuel ;
- message actuel conservé ;
- Loot accumulé reste lisible ;
- aucun état persistant nouveau.

## Contraintes

- règles de génération inchangées ;
- budget inchangé ;
- SessionContext inchangé ;
- aucune gestion de PV individuel ;
- pas de particules ;
- pas de duplication média ;
- pas de délai artificiel.

## Tests

- session inactive ;
- génération Normal ;
- Mini-boss ;
- Boss ;
- budget absent ;
- aucun candidat ;
- quantités multiples ;
- élimination occurrence par occurrence ;
- Loot ;
- objets interactifs ;
- rencontre terminée ;
- téléphone/tablette ;
- reduced motion ;
- Fast CI.

## Gate Lot 06

Validé si :
- config et résultat sont clairement deux états d'une même table ;
- les créatures semblent posées sur la table ;
- éliminer est satisfaisant sans altérer la mécanique ;
- aucune règle gameplay n'a changé.
