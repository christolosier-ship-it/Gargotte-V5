# V6-WHAOU — Lot 05 — Codex secondaire

## But

Donner une identité forte mais légère aux familles Quêtes, Loot, Objets interactifs et Brouhaha référentiel.

Ce lot ne doit pas rivaliser en complexité avec Donjons ou Créatures.

## Pré-requis

Lire AGENTS.md et docs/V6-WHAOU.md.

Inspecter :
- renderQuestCollectionCard / renderQuestDetailV6 ;
- renderLootCollectionCard / renderLootDetailV6 ;
- renderInteractableCollectionCard / renderInteractableDetailV6 ;
- renderBrouhahaCollectionCard / renderBrouhahaReferenceDetailV6 ;
- renderSimpleFamilyCodex.

## Quêtes Codex

### Collection

Direction tableau de contrats :
- carte/listes propres ;
- difficulté traitée comme petit sceau ;
- objectif très visible ;
- commanditaire + Donjon secondaires ;
- portrait du PNJ uniquement si disponible sans complexifier le chemin média ;
- accent Donjon très discret.

### Fiche

Le contrat existant devient plus physique :
- papier chaud ;
- ombre ;
- sceau difficulté ;
- Objectif comme clause principale ;
- Commanditaire et Donjon comme parties du contrat ;
- Récompense en pied de fiche ;
- entrée très courte type dépliage simulé, sans animation de parchemin.

## Loot

### Collection

Direction vitrine :
- objet au centre ;
- petite ombre de contact ;
- rareté par halo/liseré, jamais grand fond coloré ;
- valeur en or plus visible ;
- provenance discrète.

### Fiche

- présentoir visuel ;
- reflet local de rareté ;
- valeur comme étiquette de marchand ;
- effet prioritaire ;
- source Créature et Donjon conservées ;
- image source de Créature seulement si elle est déjà disponible de manière lazy.

## Objets interactifs

### Collection

Direction inventaire technique :
- objet ;
- type ;
- Donjon ;
- PV si présent ;
- actions principales visibles si leur parsing est déjà fiable.

### Fiche

Pousser le blueprint existant :
- grille technique ;
- petites flèches décoratives limitées ;
- Actions comme commandes physiques ;
- Effet comme conséquence ;
- entrée grille puis objet très courte.

Aucun pseudo-schéma fonctionnel inventé.

## Brouhaha référentiel

### Collection

Utiliser les niveaux :
- calm ;
- rising ;
- hot ;
- critical.

Progressivement :
- bordure plus marquée ;
- grand niveau fantôme ;
- noise wave plus forte ;
- niveau 12 visuellement unique mais lisible.

### Fiche

- grand numéro ;
- effet de référence dominant ;
- portée Donjon visible ;
- fissures locales selon intensité ;
- conserver explicitement le rappel que cette fiche ne modifie pas la session.

## Contraintes

- aucune action de session depuis le Brouhaha Codex ;
- aucune animation lourde ;
- pas de faux parchemin déroulant ;
- pas de fond entièrement coloré par rareté/difficulté ;
- pas de données dérivées persistées pour le visuel.

## Tests

- toutes difficultés Quêtes ;
- Quête sans image ;
- Loot avec/sans image ;
- raretés ;
- Objet interactif avec/sans PV/actions ;
- Brouhaha niveaux bas/haut/12 ;
- relations ;
- collection -> fiche -> retour ;
- tablette/téléphone ;
- reduced motion ;
- Fast CI.

## Gate Lot 05

Validé si chaque famille a sa personnalité sans donner l'impression de quatre mini-applications différentes.
