# Gargottex V6 — Mockup Assets Lab

Ressources graphiques créées pour la maquette navigable V6.

## Statut

**Expérimental / maquette.**

Ces ressources peuvent être promues plus tard vers `assets/ui/` après validation visuelle, responsive et accessibilité. Elles ne sont pas encore des assets de production.

## Contenu

- `icons/premium-symbols.svg` : sprite SVG des 6 catégories de créatures et des pictogrammes gameplay.
- `textures/grain-dark.svg` : grain maître sombre, usage global léger.
- `textures/wood-charred.svg` : bois noirci premium, usage sidebar / home / couverture.
- `textures/paper-warm.svg` : papier chaud sombre, usage lore / narratif.
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

## Détourage des figurines

Le moteur retenu pour les dérivés transparents de la maquette est **IS-Net / DIS** via `rembg`. Les originaux restent intacts ; seuls les fichiers de `creatures-transparent/` sont régénérés.

## Lore

Le panneau Lore combine `paper-warm.svg` avec une patine CSS légère : usure de papier, variation chaude et petites taches discrètes. La texture ne doit jamais réduire la lisibilité.
