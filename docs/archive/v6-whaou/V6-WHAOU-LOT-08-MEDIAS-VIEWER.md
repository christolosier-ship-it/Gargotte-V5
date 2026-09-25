# V6-WHAOU — Lot 08 — Médias et viewer

## But

Mettre en valeur les détourages tout en préservant strictement l'architecture V6-Fast : média lazy, DOM borné, Object URLs contrôlées et rendu local.

## Pré-requis

Lire :
- AGENTS.md ;
- docs/V6-WHAOU.md ;
- historique V6-Fast uniquement si nécessaire pour comprendre un invariant média.

Inspecter :
- MediaRepository ;
- renderMediaCodexCard / Body ;
- renderMediaAssetCard / Detail ;
- renderMediaSurfaceInPlace ;
- viewer local ;
- pagination 48 ;
- Object URL lifecycle.

## Médias du Codex

Direction galerie :
- visuels plus grands ;
- chrome réduit ;
- figurine détourée sur fond neutre ;
- petite ombre de contact ;
- Donjons restent couverture pleine ;
- variante active identifiable discrètement ;
- pagination actuelle conservée.

Aucun original blanc historique ne doit redevenir un fallback normal.

## Bibliothèque Média d'administration

### Cartes

- détouré validé clairement visible ;
- carte active légèrement surélevée ;
- Orphelin identifiable sans rouge agressif ;
- état du dérivé simplifié visuellement ;
- filtre Tous / Liés / Orphelins poli ;
- quantité toujours lisible.

### Détail

- visuel actif grand format ;
- fond adapté à l'alpha ;
- rattachement reste fonctionnel ;
- bloc Source locale rassurant et clair.

## Comparaison Actif / Original

Ajouter seulement si l'architecture lazy le permet proprement.

Interaction souhaitée :
- deux boutons ou segmented control ;
- Actif ;
- Original.

Règles :
- aucun slider complexe ;
- aucune mutation du média ;
- original chargé uniquement à la demande ;
- Object URL libérée à la sortie/changement ;
- si original absent, contrôle disabled ;
- Donjon traité correctement.

Si cette fonctionnalité menace les invariants V6-Fast, elle est reportée et documentée.

## Viewer plein écran

Polish :
- opacité + scale court ;
- fond sombre adapté au type ;
- fermer par bouton, tap extérieur et Escape selon existant ;
- conserver le rendu hors #app ;
- aucun render global ;
- média haute qualité actif.

## Contraintes

STOP immédiat si une proposition :
- relit tous les Blobs ;
- reconstruit un cache global ;
- garde les URLs vivantes ;
- monte plus de médias que la pagination actuelle ;
- remplace le dérivé transparent par l'ancien original blanc ;
- dégrade volontairement la qualité.

## Tests

- 400+ médias de stress ;
- pagination ;
- recherche ;
- filtre ;
- détourage ;
- Donjon original ;
- orphelin ;
- détail ;
- rattachement ;
- compare actif/original si implémenté ;
- viewer répété ;
- fermeture viewer sans perte de scroll ;
- Object URLs bornées ;
- téléphone/tablette ;
- reduced motion ;
- tests Full média concernés.

## Gate Lot 08

Validé si :
- les détourages sont plus spectaculaires ;
- la bibliothèque reste stable avec plusieurs centaines d'images ;
- viewer et comparaison restent locaux ;
- aucune régression V6-Fast média n'existe.
