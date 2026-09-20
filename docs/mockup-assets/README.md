# Gargottex V6 - Ressources de la maquette V3

## Statut

**Référence visuelle validée pour la future UI, mais pas copie automatique vers la production.**

Ce dossier contient les ressources utilisées pour éprouver la direction UI V6.

La production doit reprendre les ressources validées pertinentes en respectant :

- `docs/REFONTE-UI-UX-V6.md`
- `docs/UI-1-DESIGN-SYSTEM-V6.md`
- `docs/WORKFLOW-IMAGES-REMBG-V6.md`

---

# 1. Maquette

- `maquette-v3.css`
- `maquette-v3.js`
- HTML principal : `../GARGOTTEX-V6-MAQUETTE-PREMIUM-V3.html`

La maquette définit la composition, l'émotion et la hiérarchie visuelle.

Elle ne définit pas à elle seule la logique métier de production.

---

# 2. Emblèmes premium

Répertoire : `icons/`

## Sigils

- Basique
- Tactique
- Spéciale
- Brute
- Mini-boss
- Boss

Les sigils validés utilisent une famille de crânes fantasy cartoon absurdes.

## Gameplay

- PV
- ATK
- DEF
- Portée / Zone
- Actions
- Menace
- Socle
- Comportement
- Butin
- Lore
- Donjon
- Compétence

## Entités

- Héros
- PNJ
- Quête
- Objet interactif
- Brouhaha

Les icônes utilitaires simples restent séparées de ces emblèmes.

---

# 3. Textures et ornements

`textures/`

- grain sombre ;
- bois noirci ;
- papier clair vieilli ;
- laiton ;
- cuir rare.

`ornaments/`

- détails décoratifs validés pour les surfaces narratives.

Les textures sont des références de matière. La production peut utiliser des versions optimisées.

---

# 4. Ressources d'épreuve

## Créatures

- originaux de test : `creatures/`
- dérivés : `creatures-transparent/`

## Héros

- originaux de test : `heros/`
- dérivés : `heros-transparent/`

## Donjons

- `donjon/`

## Données

- `stat-export/`
- `generated-data/`

Ces ressources servent à stresser la maquette. Elles ne représentent pas l'intégralité des données réelles IndexedDB de production.

---

# 5. Détourage

Workflow :

- `rembg`
- IS-Net / DIS
- `isnet-general-use`

Voir `docs/WORKFLOW-IMAGES-REMBG-V6.md`.

Originals intacts, dérivés séparés.

---

# 6. Rareté / difficulté

Même échelle couleur que les catégories Créature :

- Basique -> Loot Mauvais / Quête Très facile
- Tactique -> Commun / Facile
- Spéciale -> Inhabituel / Normale
- Brute -> Rare / Difficile
- Mini-boss -> Épique / Très difficile
- Boss -> Légendaire / Extrême

Toujours texte + couleur.

---

# 7. Règle de promotion vers la production

Avant de déplacer/copier une ressource vers les assets finaux :

1. vérifier qu'elle est utilisée dans la V3 ;
2. vérifier son format et sa taille ;
3. vérifier son contraste ;
4. vérifier son rendu desktop/tablette/téléphone ;
5. vérifier l'accessibilité si sémantique ;
6. ne jamais écraser un média utilisateur IndexedDB.
