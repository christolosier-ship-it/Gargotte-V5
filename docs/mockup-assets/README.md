# Gargottex V6 — Mockup Assets Lab

Ressources graphiques créées pour la maquette navigable V6.

## Statut

**Expérimental / maquette.**

Ces ressources peuvent être promues plus tard vers `assets/ui/` après validation visuelle, responsive et accessibilité. Elles ne sont pas encore des assets de production.

## Contenu

- `icons/premium-symbols.svg` : sprite SVG des 6 catégories de créatures et des pictogrammes gameplay.
- `textures/grain-dark.svg` : grain maître sombre, usage global léger.
- `textures/wood-charred.svg` : bois noirci premium, usage sidebar / home / couverture.
- `textures/paper-warm.svg` : ancien papier chaud sombre conservé pour référence.
- `textures/paper-aged-light.svg` : parchemin beige très clair, nuancé, légèrement usé et taché ; référence pour Lore, histoire et blocs narratifs.
- `textures/brass-aged.svg` : laiton vieilli, usage filets / cadres / accents.
- `textures/leather-dark.svg` : cuir sombre, usage exceptionnel uniquement.
- `ornaments/corner-brass.svg` : coin décoratif laiton pour les panneaux narratifs premium.

## Règles

- Navigation : icônes d'interface sobres, pas de couleur de catégorie.
- Gameplay : pictogrammes premium monochromes, couleur laiton / ivoire.
- Catégories : `icône + texte + couleur` selon UI-1.
- Textures : jamais derrière les formulaires ou les stats compactes.
- Le laiton reste un accent, pas un fond massif.
- Le cuir est événementiel, jamais systémique.
- Les SVG sont conçus pour être redimensionnables et recolorables avec `currentColor`.

## Catégories

- Basique : pierre facettée.
- Tactique : viseur / nœud stratégique.
- Spéciale : étoile mystique.
- Brute : marteau fracturé.
- Mini-boss : couronne.
- Boss : crâne.

## Pictogrammes gameplay

`PV`, `ATK`, `DEF`, `Portée/Zone`, `Actions`, `Menace`, `Socle`, `Comportement/IA`, `Butin`, `Lore`, `Donjon`.

À créer : `Compétence`, `Héros`, `PNJ`, `Quête`, `Objet interactif`, `Brouhaha`.

## Rareté et difficulté

Les six couleurs Créature servent aussi de référentiel commun :

- Basique : Loot **Mauvais** / Quête **Très facile** ;
- Tactique : Loot **Commun** / Quête **Facile** ;
- Spéciale : Loot **Inhabituel** / Quête **Normale** ;
- Brute : Loot **Rare** / Quête **Difficile** ;
- Mini-boss : Loot **Épique** / Quête **Très difficile** ;
- Boss : Loot **Légendaire** / Quête **Extrême**.

Ces niveaux utilisent des badges texte + couleur ; **aucune icône supplémentaire n'est requise** pour la rareté ou la difficulté.

## Détourage des figurines

Le moteur retenu pour les dérivés transparents de la maquette est **IS-Net / DIS** via `rembg`. Les originaux restent intacts ; seuls les fichiers de `creatures-transparent/` sont régénérés.

## Lore

Les blocs Lore, histoire et assimilés utilisent `paper-aged-light.svg` : parchemin beige très clair, fibres nuancées, usure et taches légères, avec texte brun foncé pour préserver le contraste.


## Sources UI-3 de la maquette

Les propositions UI-3 utilisent des exemples réels issus du Drive Gargotte et des templates existants de l'application :

- 15 dossiers de Donjon ;
- dossier Héros avec quatre images par niveau pour plusieurs héros ;
- dossier PNJ avec portraits nommés ;
- classeur de Quêtes ;
- classeur de Loot ;
- classeur Brouhaha.

Les exemples servent à éprouver les volumes, les noms longs, les images et la navigation. Ils ne créent aucun nouveau champ métier. Les fiches proposées restent volontairement différentes visuellement : dossier d'expédition pour Donjon, folio évolutif pour Héros, portrait narratif pour PNJ, contrat pour Quête, table d'inspection pour Loot, plan technique pour Objet interactif et carte d'incident pour Brouhaha.
