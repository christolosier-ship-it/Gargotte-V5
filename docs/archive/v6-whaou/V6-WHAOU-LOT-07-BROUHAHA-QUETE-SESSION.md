# V6-WHAOU — Lot 07 — Brouhaha et Quête de session

## But

Faire du Brouhaha le moment le plus expressif de Gargottex, tout en gardant les commandes parfaitement stables.

Donner à la Quête de session une mise en scène rapide et légère.

## Pré-requis

Lire AGENTS.md et docs/V6-WHAOU.md.

Inspecter :
- renderBrouhaha ;
- classes calm/rising/hot/critical ;
- brouhaha-fractures ;
- session-brouhaha-plus/minus/draw/reset ;
- renderQuests ;
- Accueil avec session.

## Brouhaha — intensité

Conserver les seuils existants sauf raison fonctionnelle forte :
- calm ;
- rising ;
- hot ;
- critical.

### Calm

- surface propre ;
- lumière chaude ;
- très peu de fissures.

### Rising

- premières traces ;
- contraste légèrement plus fort ;
- pression plus présente.

### Hot

- fissures et dégâts décoratifs ;
- bordures ou éléments décoratifs légèrement désaxés ;
- commandes toujours parfaitement droites.

### Critical

- état très marqué ;
- accent rouge contenu ;
- emblème fort ;
- pression élevée ;
- jamais de tremblement continu.

## Changement de niveau

+1 :
- impact très court du nombre ;
- pression visuelle mise à jour.

-1 :
- feedback plus doux.

Ne jamais coupler automatiquement changement de niveau et tirage d'effet.

## Niveau 12

Créer un moment signature uniquement lors du passage vers 12 :
- animation 300-450 ms maximum ;
- fissure/halo/impact local ;
- pas d'overlay bloquant ;
- pas d'audio ;
- reduced motion : état final immédiat.

Le niveau 12 reste ensuite statique.

## Tirer un effet

L'effet courant doit apparaître comme un ticket/incident :
- impact court ;
- légère rotation limitée ;
- emblème Brouhaha ;
- texte immédiatement lisible.

## Historique

- lignes plus proches de tickets/registre ;
- niveau très visible ;
- courant identifiable ;
- reset reste sobre et explicite.

## Cohérence avec l'Accueil

L'Accueil actif doit refléter la même intensité, mais à faible amplitude.
Le chaos ne doit pas contaminer le shell global.

## Quête de session

### Tirage initial

- carte qui entre légèrement ;
- difficulté ;
- commanditaire ;
- Objectif dominant ;
- Récompense claire.

### Tirer à nouveau

Si simple :
- ancienne carte sort courte ;
- nouvelle entre ;
- aucun délai de jeu.

Si cela complexifie trop le renderer, utiliser une seule animation d'entrée sur la nouvelle carte.

### Ouvrir dans le Codex

Navigation inchangée.

## Contraintes

- aucune modification des effets Brouhaha ;
- aucun nouveau niveau ;
- aucun tirage automatique ;
- pas de vibration continue ;
- pas d'animation du shell ;
- aucun état persistant supplémentaire ;
- Quête Codex et Quête de session restent distinctes.

## Tests

- Brouhaha 0 ;
- 4 ;
- 7 ;
- 10 ;
- passage 11 -> 12 ;
- retour 12 -> 11 ;
- +1/-1 ;
- tirer effet ;
- historique ;
- reset ;
- Quête absente ;
- tirage ;
- reroll ;
- ouverture Codex ;
- reduced motion ;
- tablette/iPad ;
- Fast CI.

## Gate Lot 07

Validé si :
- le Brouhaha est le moment le plus vivant de l'application ;
- l'information ne bouge jamais au point de gêner ;
- niveau et tirage restent deux actions clairement séparées ;
- la Quête de session reste rapide à utiliser.
