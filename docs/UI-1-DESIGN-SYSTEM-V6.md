# Gargottex V6 - UI-1 Design System & Shell

## Statut

**ACTIF - source de vérité visuelle commune du chantier UI V6**

À lire avec :

- `REFONTE-UI-UX-V6.md` ;
- la maquette V3 ;
- `docs/mockup-assets/`.

UI-1 définit la grammaire commune. La maquette V3 définit son application visuelle de référence.

---

# 1. Direction artistique

> **Taverne éditoriale premium + bestiaire de figurines + fantasy cartoon absurde Gargotte.**

Objectifs :

- structure moderne et lisible ;
- identité Gargotte immédiatement reconnaissable ;
- illustrations au premier plan ;
- matière sans bruit visuel ;
- gameplay lisible à la table ;
- administration plus fonctionnelle que narrative.

Règle :

> **Le Codex respire. L'Atelier travaille. Le Brouhaha déborde.**

---

# 2. Principes non négociables

1. contenu avant décoration ;
2. illustrations = contenu majeur ;
3. couleur jamais seul vecteur d'information ;
4. aucune interaction essentielle au hover ;
5. cible tactile importante environ 44 px minimum ;
6. focus visible ;
7. textes longs en Inter ;
8. Alegreya réservée à la voix éditoriale ;
9. texture absente sous les formulaires et stats compactes ;
10. accent Donjon local, jamais substitut aux couleurs gameplay ;
11. la V3 est la baseline de composition ;
12. les icônes utilitaires et les emblèmes illustrés sont deux familles différentes.

---

# 3. Palette structurelle

```css
:root {
  --color-bg-0: #0B0806;
  --color-bg-1: #120D09;

  --color-surface-1: #17110D;
  --color-surface-2: #21170F;
  --color-surface-3: #2A1D13;

  --color-border-subtle: #3C2C21;
  --color-border: #4B3828;
  --color-border-strong: #6A4B31;

  --color-text-primary: #F4E8D8;
  --color-text-secondary: #B7A187;
  --color-text-tertiary: #867563;

  --color-accent-gold: #D4A45F;
  --color-accent-gold-soft: #F0CF93;
  --color-accent-gold-dark: #8A5E31;

  --color-success: #849D79;
  --color-info: #70859A;
  --color-warning: #D9A12E;
  --color-danger: #EF4B4B;
}
```

Le laiton est un accent :

- bouton primaire ;
- sélection ;
- filet ;
- bordure importante ;
- détail éditorial.

Il ne devient jamais un grand fond systématique.

---

# 4. Couleurs gameplay

| Niveau | Créature | Loot | Quête | Hex |
|---|---|---|---|---|
| 1 | Basique | Mauvais | Très facile | `#C8CDD3` |
| 2 | Tactique | Commun | Facile | `#5FAF72` |
| 3 | Spéciale | Inhabituel | Normale | `#4F91E3` |
| 4 | Brute | Rare | Difficile | `#8B68D8` |
| 5 | Mini-boss | Épique | Très difficile | `#D9A12E` |
| 6 | Boss | Légendaire | Extrême | `#EF4B4B` |

Toujours :

`emblème ou indicateur + texte + couleur`

La couleur reste un accent : liseré, tag, filet, micro-halo, pas une fiche entièrement recolorée.

---

# 5. Typographie

## Alegreya

Usage :

- titres de page ;
- noms de créatures ;
- noms de Donjons ;
- titres de Quêtes ;
- compétences ;
- citations narratives courtes.

## Inter

Usage :

- navigation ;
- boutons ;
- champs ;
- métadonnées ;
- stats ;
- listes ;
- filtres ;
- longs textes ;
- administration.

Cible : **80 à 90 % du texte visible reste en Inter**.

Production :

- fontes embarquées localement ;
- disponibles offline ;
- `font-display: swap` ;
- aucun besoin réseau permanent.

L'import Google Fonts de la maquette est uniquement pratique pour le prototype.

---

# 6. Iconographie : deux familles distinctes

## 6.1 Icônes utilitaires

Lucide est la bibliothèque principale.

Tabler peut compléter si nécessaire.

Exemples :

- retour ;
- fermer ;
- recherche ;
- galerie/liste ;
- ajouter ;
- supprimer ;
- import/export ;
- synchroniser ;
- plein écran.

Style cohérent, simple, lisible à 16-24 px.

## 6.2 Emblèmes premium Gargotte

Les sigils, logos gameplay et logos d'entités sont **des ressources illustrées premium**, pas des pictogrammes Lucide.

Répertoire de référence :

`docs/mockup-assets/icons/`

### Sigils créatures

- `Sigil_Basique.webp`
- `Sigil_Tactique.webp`
- `Sigil_Speciale.webp`
- `Sigil_Brute.webp`
- `Sigil_MiniBoss.webp`
- `Sigil_Boss.webp`

Direction : crânes fantasy cartoon absurdes, cohérents entre eux.

### Logos gameplay

- `Icone_Gameplay_PV.webp`
- `Icone_Gameplay_ATK.webp`
- `Icone_Gameplay_DEF.webp`
- `Icone_Gameplay_ZONE.webp`
- `Icone_Gameplay_ACTION.webp`
- `Icone_Gameplay_MENACE.webp`
- `Icone_Gameplay_SOCLE.webp`
- `Icone_Gameplay_COMPORTEMENT.webp`
- `Icone_Gameplay_BUTIN.webp`
- `Icone_Gameplay_LORE.webp`
- `Icone_Gameplay_DONJON.webp`
- `Icone_Gameplay_COMPETENCE.webp`

### Logos d'entités

- `Icone_Entite_HEROS.webp`
- `Icone_Entite_PNJ.webp`
- `Icone_Entite_QUETE.webp`
- `Icone_Entite_OBJET_INTERACTIF.webp`
- `Icone_Entite_OBJET_BROUHAHA.webp`

Ces emblèmes peuvent être redimensionnés, mais jamais remplacés par une géométrie générique sans validation visuelle.

---

# 7. Espacements

Base 4 px :

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
```

Rythme :

- 4-8 : micro alignements ;
- 12-16 : intérieur composants ;
- 24 : groupe logique ;
- 32 : séparation de sections ;
- 48-64 : respiration éditoriale.

---

# 8. Rayons et profondeur

```css
--radius-xs: 6px;
--radius-sm: 10px;
--radius-md: 14px;
--radius-lg: 18px;
--radius-xl: 24px;
--radius-pill: 999px;
```

Profondeur :

1. contraste de surface ;
2. bordure ;
3. espacement ;
4. ombre si réellement élevée.

Éviter l'effet « toutes les cartes flottent ».

---

# 9. Matières

## Niveau 0 - fonctionnel

Pas de texture visible sous :

- formulaires ;
- tableaux ;
- champs ;
- stats ;
- listes denses.

## Niveau 1 - ambiance

Texture légère sur :

- fond global ;
- sidebar ;
- rail tablette ;
- bandeaux ;
- grands panneaux.

## Niveau 2 - narratif

Texture contrôlée sur :

- couverture Donjon ;
- compétence exceptionnelle ;
- Lore ;
- blocs narratifs ;
- Accueil.

Ressources de référence :

- `grain-dark.svg`
- `wood-charred.svg`
- `paper-aged-light.svg`
- `brass-aged.svg`
- `leather-dark.svg`
- ornements laiton.

Le papier clair du Lore utilise du texte sombre à contraste élevé.

---

# 10. Navigation

## Desktop

Sidebar permanente.

## Tablette

Rail compact.

## Téléphone

Bottom nav :

`Accueil | Codex | Jeu | Quêtes | Plus`

`Jeu` regroupe Générateur et Brouhaha.

`Plus` regroupe les fonctions secondaires/administratives.

La recherche globale reste disponible depuis la topbar ou l'en-tête.

---

# 11. Responsive commun

Familles de layout de référence :

- téléphone : jusqu'à environ 767 px ;
- tablette : environ 768 à 1199 px ;
- desktop : environ 1200 px et plus.

Ces seuils sont des repères de composition, pas une excuse pour ignorer le contenu.

## Codex

- desktop : master-detail possible ;
- tablette paysage : séquentiel ;
- tablette portrait : séquentiel ;
- téléphone : séquentiel.

Séquence :

`Collection -> Fiche -> Retour collection`

La tablette **n'est pas** un desktop comprimé.

## Atelier

Exception métier définie par UI-5 :

- tablette paysage peut conserver liste + formulaire ;
- tablette portrait donne priorité au formulaire.

---

# 12. Composants communs

Minimum :

- bouton primaire ;
- bouton secondaire ;
- bouton tertiaire/texte ;
- bouton danger ;
- champs ;
- select ;
- segmented control ;
- chip/tag ;
- carte collection ;
- ligne collection ;
- panneau ;
- modal ;
- drawer ;
- toast ;
- visionneuse média ;
- état vide ;
- état erreur ;
- skeleton/loading si nécessaire.

États à prévoir :

- default ;
- hover lorsque pertinent ;
- focus-visible ;
- active ;
- selected ;
- disabled ;
- loading ;
- error.

---

# 13. Animation

Durées de référence :

- rapide : 120 ms ;
- standard : 180 ms ;
- éditoriale : 260 ms.

Motion utile pour :

- changement d'état ;
- drawer/modal ;
- révélation Boss ;
- Brouhaha ;
- sélection.

Motion interdite si elle ralentit une action fréquente.

`prefers-reduced-motion` supprime/réduit les animations non nécessaires.

---

# 14. Accents de Donjon

Un Donjon peut fournir :

- accent ;
- accent doux ;
- accent sombre ;
- ambiance de fond.

Limite : environ 10-15 % de l'empreinte visuelle d'une fiche.

Ne remplace jamais :

- catégorie ;
- rareté ;
- difficulté ;
- danger ;
- warning.

---

# 15. Maquette V3 comme référence

Les composants de production doivent être comparés visuellement à la V3, en particulier :

- shell desktop/tablette/téléphone ;
- cartes Codex ;
- fiches Créature ;
- Donjon ;
- Héros ;
- PNJ ;
- Quêtes ;
- Loot ;
- Brouhaha ;
- Atelier ;
- Médias.

Une simplification technique est acceptable si elle ne dégrade pas la hiérarchie ou l'émotion.

---

# 16. Gate UI-1

UI-1 est validée lorsque :

1. tokens communs installés ;
2. fontes locales/offline ;
3. icônes utilitaires séparées des emblèmes premium ;
4. sigils/logos V3 intégrés ;
5. navigation trois familles validée ;
6. Codex séquentiel tablette/téléphone ;
7. composants communs accessibles ;
8. textures conformes aux niveaux 0/1/2 ;
9. reduced motion et focus-visible présents ;
10. aucun changement de données IndexedDB n'est requis par le design system seul.
