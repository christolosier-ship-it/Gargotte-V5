# V6-WHAOU — Lot 03 — Créatures

## But

Faire du Bestiaire et de la fiche Créature la vitrine tabletop de Gargottex.

Les détourages doivent donner la sensation d'une figurine posée dans l'interface, pas d'une photo enfermée dans une carte.

## Pré-requis

Lire :
- AGENTS.md ;
- docs/V6-WHAOU.md.

Inspecter :
- renderBestiaryGalleryCard ;
- renderBestiaryListRow ;
- renderBestiaryCollection ;
- renderCreatureDetail ;
- renderCreatureRelations ;
- renderBossPhaseStack ;
- media active policy ;
- responsive Bestiaire.

## Bestiaire galerie

Améliorations :
- détourages plus dominants ;
- petite ombre de contact ;
- débordement visuel très contrôlé à l'intérieur de la carte ;
- catégorie perceptible par accent local ;
- sigil mieux intégré ;
- Boss et Mini-boss légèrement plus lourds visuellement ;
- sélection plus claire ;
- hover desktop optionnel mais jamais nécessaire.

Ne pas augmenter fortement la hauteur des cartes.

## Bestiaire liste

Rester dense.

Polish :
- vignette détourée plus propre ;
- catégorie et Menace faciles à scanner ;
- accent de sélection ;
- stats inchangées ;
- aucun effet spectaculaire.

## Filtres et recherche

Conserver le comportement.

À faire :
- ouverture/fermeture des filtres plus nette ;
- transition des résultats sobre ;
- empty state Bestiaire dans la convention V6-WHAOU.

Ne pas animer individuellement des dizaines de cartes après chaque frappe clavier.

## Fiche Créature

### Figurine

- renforcer plinthe existante ;
- ombre de contact ;
- fond local subtil ;
- entrée de figurine courte ;
- aucun mouvement en boucle ;
- plein écran inchangé fonctionnellement.

### Identité

- grand sigil de catégorie très faible en arrière-plan si lisible ;
- nom prioritaire ;
- Donjon relationnel conservé ;
- catégorie, Menace et Socle restent structurés.

### Stats

Ne pas modifier la hiérarchie fonctionnelle.
Un léger relief ou contraste est autorisé.

### Compétence

Traiter comme carte de règle premium :
- icône Compétence ;
- titre fort ;
- Brouhaha sous forme de tampon si non nul ;
- impact de tampon possible à l'entrée.

### Comportement

Traiter comme consigne tactique :
- priorité de cible très identifiable ;
- corps de texte lisible ;
- aucune décoration agressive.

### Loot

- garder les relations existantes ;
- image Loot si déjà accessible sans lecture média globale ;
- sinon emblème ;
- valeur et effet immédiatement lisibles.

### Lore

Rester éditorial et calme.

### Relations

- rail illustré ;
- détourages prioritaires ;
- relation Donjon, Loot et phases clairement distinguées ;
- pas de nouvelle relation automatique.

### Boss et phases

Si plusieurs phases fiables :
- renforcer la continuité Phase 1 -> 2 -> 3 ;
- ne pas fusionner les fiches ;
- garder chaque phase ouvrable ;
- utiliser une liaison graphique simple.

## Contraintes

- pas de moteur 3D ;
- pas de duplication de figurines pour représenter une quantité ;
- pas de chargement anticipé de tous les médias ;
- pas de nouveaux champs catégorie/Menace ;
- pas de modification des règles de Boss.

## Tests

- toutes catégories ;
- créature sans image ;
- créature avec détourage ;
- Boss ;
- phases ;
- compétence avec/sans Brouhaha ;
- comportement partiel ;
- Loot avec/sans relation ;
- relations Donjon ;
- galerie/liste ;
- téléphone/tablette ;
- reduced motion ;
- Fast CI.

## Gate Lot 03

Validé si :
- le Bestiaire évoque réellement une collection de figurines ;
- la fiche Créature est spectaculaire mais reste lisible à la table ;
- catégorie et Menace restent compréhensibles sans dépendre de la couleur ;
- les médias restent lazy et bornés ;
- aucune donnée métier n'a changé.
