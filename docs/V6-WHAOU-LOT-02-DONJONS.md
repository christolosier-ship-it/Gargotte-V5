# V6-WHAOU — Lot 02 — Donjons

## But

Faire des Donjons la famille la plus éditoriale du Codex et transformer l'ouverture d'un Donjon en véritable découverte, sans complexifier les données.

## Pré-requis

Lire :
- AGENTS.md ;
- docs/V6-WHAOU.md ;
- docs/V6-WHAOU-LOT-02-DONJONS.md.

Inspecter :
- renderDungeonCollectionCard ;
- renderDungeonDetailV6 ;
- renderDungeonFloors ;
- renderDungeonPreview ;
- queueDungeonCinematic / showDungeonCinematic ;
- dungeonAccent ;
- responsive Donjon.

## Collection Donjons

Conserver galerie/liste et toolbar.

Améliorations :
- couverture visuellement dominante ;
- accent Donjon en halo/reflet très local ;
- petit effet de profondeur desktop ;
- état sélectionné plus net ;
- Boss affiché comme petite plaque avec sigil Boss ;
- représentation compacte du nombre d'étages ;
- si beaucoup d'étages, ne jamais créer une rangée gigantesque de points ;
- fallback propre si couverture absente.

Les cartes restent performantes et lazy.

## Cinématique d'ouverture

Le système existant est conservé.

Objectifs :
- renforcer la continuité entre cinématique et fiche ;
- éviter l'effet overlay indépendant puis page sans relation visuelle ;
- utiliser la même image, le même accent et le même titre ;
- conserver le bouton Continuer et Escape ;
- conserver l'auto-fermeture ;
- conserver le comportement reduced motion ;
- ne pas relancer inutilement la cinématique à chaque rerender.

Ne pas créer un second système de cinématique.

## Fiche Donjon

### Couverture

- entrée très courte de la couverture ;
- léger zoom qui se stabilise ;
- accent local dans l'ombre de la fiche ;
- aucun mouvement permanent.

### Description

Conserver une lecture éditoriale simple.
Pas de texture qui nuise au texte.

### Étages & budgets

Transformer la progression en expédition lisible :
- cases ou jalons reliés ;
- irrégularité graphique légère ;
- numéro et budget prioritaires ;
- représentation qui reste correcte à 5, 10, 30 ou 100 étages ;
- fallback compact pour gros volumes.

Aucun scroll forcé ou saut de position inutile.

### Boss

La section Boss doit être le point culminant :
- sigil Boss dominant mais contenu ;
- figurine détourée prioritaire si disponible ;
- composition plus lourde que les autres relations ;
- Menace visible ;
- petit reveal d'entrée lors de l'arrivée sur la fiche ou la section si simple à déclencher.

Ne pas afficher d'information Boss inventée.

### Dans ce Donjon

Créatures, Quêtes, Objets interactifs et Brouhaha :
- conserver les relations fiables ;
- utiliser l'image/détourage existant lorsqu'il est disponible ;
- famille clairement identifiable par emblème ;
- conserver Voir tout / navigation relationnelle ;
- ne pas dupliquer les collections complètes dans la fiche.

### Tags

Rester secondaires en fin de fiche.

## Contraintes

- pas de champ de carte ou coordonnées Donjon ;
- pas de moteur de carte ;
- pas d'animation d'étages complexe ;
- pas de nouveau modèle métier ;
- pas de duplication des médias ;
- respecter média lazy et Object URLs bornées.

## Tests

- collection galerie ;
- collection liste ;
- Donjon avec image ;
- Donjon sans image ;
- Donjon avec Boss résolu ;
- Boss non résolu ;
- petit nombre d'étages ;
- très grand nombre d'étages ;
- relations ;
- retour collection ;
- tablette/iPad ;
- reduced motion ;
- Fast CI.

## Gate Lot 02

Validé si :
- ouvrir un Donjon crée une vraie sensation de découverte ;
- la fiche reste un hub, pas une encyclopédie dupliquée ;
- le Boss domine sans écraser la lecture ;
- les étages sont plus expressifs et toujours lisibles ;
- la performance média reste bornée ;
- aucune donnée métier n'a changé.
