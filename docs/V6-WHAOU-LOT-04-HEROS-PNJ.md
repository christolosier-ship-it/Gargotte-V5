# V6-WHAOU — Lot 04 — Héros et PNJ

## But

Donner deux identités distinctes :
- Héros : progression, figurine, capacités ;
- PNJ : portrait, personnalité, narration.

## Pré-requis

Lire AGENTS.md et docs/V6-WHAOU.md.

Inspecter :
- renderHeroCollectionCard ;
- renderHeroDetailV6 ;
- queueHeroDetailReveal ;
- rememberHeroLevel ;
- renderNpcCollectionCard ;
- renderNpcDetailV6 ;
- relations Quêtes PNJ.

## Collection Héros

- conserver une carte par hero_base_name ;
- figurine détourée dominante ;
- niveau consulté intégré visuellement au socle ou à la plaque ;
- rôle secondaire mais identifiable ;
- état actif propre ;
- option raisonnable : silhouettes fantômes très discrètes des autres niveaux uniquement si les médias nécessaires sont déjà disponibles sans préchargement global.

Si cette dernière option complexifie les lectures média, ne pas la faire.

## Fiche Héros

### Entrée

Réutiliser queueHeroDetailReveal.
Ne pas créer un second moteur.

### Figurine

- ombre/plinthe ;
- entrée courte ;
- plein écran conservé.

### Sélecteur N1-N4

- conserver quatre boutons accessibles ;
- les traiter comme jalons/rivets de progression ;
- active très clair ;
- disabled très clair.

### Changement de niveau

Animation autorisée :
- sortie très courte de l'image actuelle ;
- entrée de la nouvelle ;
- aucune interpolation/morphing ;
- pas de saut de scroll.

Les stats changées peuvent recevoir une impulsion discrète si l'implémentation reste locale et simple.

### Compétences

- anciennes compétences visibles mais plus calmes ;
- compétence du niveau courant dominante ;
- tampon Brouhaha avec impact court ;
- aucune compétence inventée.

## Collection PNJ

Direction registre des habitués :
- portrait dominant ;
- nom principal ;
- race et rôle secondaires ;
- carte légèrement plus narrative que les Héros ;
- détourages prioritaires.

## Fiche PNJ

### Portrait

- grande présence ;
- entrée simple ;
- débordement contrôlé si utile.

### Identité

- nom ;
- race ;
- rôle ;
- ton.

Le champ Ton peut être traité comme annotation de dossier, sans simuler une écriture manuscrite illisible.

### Lore

- lecture confortable ;
- surface papier locale possible ;
- aucune texture sous le texte si contraste insuffisant.

### Quêtes associées

- présenter les liens comme petits contrats/avis ;
- difficulté visible ;
- garder la navigation réelle.

## Contraintes

- pas de morphing ;
- pas de préchargement de 4 grandes images par Héros si V6-Fast ne le fait pas déjà ;
- pas de stats ajoutées aux PNJ ;
- pas de génération de portrait ;
- aucune modification métier.

## Tests

- Héros niveaux 1 à 4 ;
- niveaux manquants ;
- changement de niveau répété ;
- skills cumulées ;
- Brouhaha skill ;
- PNJ avec/sans portrait ;
- lore absent ;
- ton absent ;
- Quêtes liées ;
- téléphone/tablette ;
- reduced motion ;
- Fast CI.

## Gate Lot 04

Validé si :
- la progression Héros est perceptible sans devenir un effet gadget ;
- le changement de niveau est fluide ;
- les PNJ ne ressemblent jamais à des Créatures sans stats ;
- le média lazy reste intact ;
- aucune donnée métier n'a changé.
