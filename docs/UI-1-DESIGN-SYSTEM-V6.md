# Gargottex V6 — UI-1 Design System

## Statut

**VERROUILLÉ — source de vérité du design system UI/UX V6**

Ce document complète `docs/REFONTE-UI-UX-V6.md` et formalise les décisions de design nécessaires avant toute implémentation de la refonte visuelle.

Il définit les **tokens, règles d’usage, composants, conventions responsive et principes visuels** communs à l’ensemble de Gargottex.

Il ne déclenche aucune refonte de l’application tant que les gates techniques de `docs/REFACTORISATION-V6-LOCAL-FIRST-NEON.md` ne sont pas validées.

---

# 1. Intention générale

La direction artistique retenue est :

> **Taverne éditoriale premium + bestiaire de figurines, avec une touche légère de grimoire de terrain.**

Le design system doit produire une interface :

- immersive sans devenir décorative au détriment de la lecture ;
- fortement identifiable comme *Gargotte & Va-Nu-Pieds* ;
- confortable pendant une partie ;
- cohérente sur desktop, tablette et téléphone ;
- efficace dans l’Atelier et les écrans de gestion ;
- compatible PWA et fonctionnement offline ;
- suffisamment systémique pour être maintenu sans dérive graphique.

La structure reste moderne et sobre. L’émotion vient des illustrations, de la matière, de la typographie éditoriale et des accents de donjon.

---

# 2. Principes non négociables

1. **Le contenu passe avant la décoration.**
2. **Les illustrations sont un contenu majeur du Codex.**
3. **L’Atelier reste plus fonctionnel que narratif.**
4. **Les couleurs de gameplay ont un sens stable.**
5. **Une couleur ne doit jamais être le seul vecteur d’information.**
6. **Les composants doivent rester lisibles sans texture.**
7. **Les interactions tactiles importantes visent environ 44 px minimum.**
8. **Aucun hover ne doit être indispensable.**
9. **Les longs textes utilisent la typographie d’interface, jamais la typographie fantasy.**
10. **Les accents de donjon personnalisent l’ambiance sans modifier la structure UI.**

---

# 3. Palette globale

## 3.1 Tokens principaux

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

## 3.2 Règles d’usage

### Fond

- `--color-bg-0` : fond général de l’application.
- `--color-bg-1` : grandes zones secondaires, shell, arrière-plan de page.

### Surfaces

- `--color-surface-1` : cartes, formulaires, listes.
- `--color-surface-2` : panneau élevé, compétence, zone active.
- `--color-surface-3` : sélection forte, élément actif ou accent sombre.

### Or / laiton

`--color-accent-gold` est la couleur identitaire principale mais **ne doit pas devenir une couleur de remplissage omniprésente**.

Usage recommandé :

- état actif ;
- bordure importante ;
- bouton primaire ;
- détail de navigation ;
- titres éditoriaux ponctuels ;
- accent premium.

Usage interdit :

- fonds massifs de grandes sections ;
- tous les boutons ;
- toutes les cartes ;
- tous les badges.

---

# 4. Couleurs des catégories de créatures

Les catégories reprennent les conventions visuelles RPG classiques.

| Catégorie | Couleur | Hex | Rôle visuel |
|---|---|---:|---|
| Basique | Gris clair | `#C8CDD3` | ennemi standard |
| Tactique | Vert | `#5FAF72` | rôle tactique / support |
| Spéciale | Bleu | `#4F91E3` | mécanique particulière |
| Brute | Violet | `#8B68D8` | force / menace lourde |
| Mini-boss | Ambre / or légendaire | `#D9A12E` | rencontre exceptionnelle |
| Boss | Rouge vif | `#EF4B4B` | menace majeure |

Tokens :

```css
:root {
  --creature-basic: #C8CDD3;
  --creature-tactical: #5FAF72;
  --creature-special: #4F91E3;
  --creature-brute: #8B68D8;
  --creature-miniboss: #D9A12E;
  --creature-boss: #EF4B4B;
}
```

## 4.1 Règle d’accessibilité

Une catégorie doit toujours être représentée par :

```text
icône + texte + couleur
```

Exemple :

```text
◆ TACTIQUE
☠ BOSS
```

La couleur seule n’est jamais suffisante.

## 4.2 Intensité

La couleur de catégorie doit rester un **accent**, pas une grande surface.

Usage :

- bordure ;
- pictogramme ;
- mot-clé ;
- petit bandeau ;
- pastille ou badge.

## 4.3 Réutilisation de l'échelle couleur

La même échelle de six couleurs est réutilisée pour deux systèmes supplémentaires afin de garder une lecture cohérente :

| Niveau couleur | Loot | Quête |
|---|---|---|
| Basique / gris | Mauvais | Très facile |
| Tactique / vert | Commun | Facile |
| Spéciale / bleu | Inhabituel | Normale |
| Brute / violet | Rare | Difficile |
| Mini-boss / ambre | Épique | Très difficile |
| Boss / rouge | Légendaire | Extrême |

La couleur conserve uniquement un rôle de repère. Le libellé de rareté ou de difficulté reste toujours écrit ; la couleur seule n'est jamais suffisante.

---

# 5. Typographies

## 5.1 Familles verrouillées

### Identité / éditorial

**Alegreya**

Usage :

- logotype texte Gargottex ;
- grands titres ;
- nom d’une créature ;
- nom d’un donjon ;
- titre de quête ;
- titre de compétence ;
- citations narratives ponctuelles.

### Interface

**Inter**

Usage :

- navigation ;
- texte courant ;
- filtres ;
- boutons ;
- statistiques ;
- formulaires ;
- tableaux ;
- badges ;
- métadonnées ;
- journal et diagnostic.

## 5.2 Règle de proportion

Environ **80 à 90 % du texte visible** d’un écran reste en Inter.

Alegreya est une voix éditoriale, pas une police d’interface générale.

## 5.3 Chargement

Les fontes doivent être :

- libres ou correctement licenciées ;
- incluses localement dans la PWA ou mises en cache de manière fiable ;
- disponibles offline après installation ;
- déclarées avec `font-display: swap`.

Ne pas dépendre d’un chargement réseau permanent.

## 5.4 Échelle typographique

```css
:root {
  --font-size-display-xl: 56px;
  --line-height-display-xl: 60px;

  --font-size-display-lg: 40px;
  --line-height-display-lg: 44px;

  --font-size-title-page: 32px;
  --line-height-title-page: 36px;

  --font-size-title-section: 24px;
  --line-height-title-section: 28px;

  --font-size-title-card: 16px;
  --line-height-title-card: 20px;

  --font-size-body-lg: 16px;
  --line-height-body-lg: 24px;

  --font-size-body: 14px;
  --line-height-body: 21px;

  --font-size-small: 12px;
  --line-height-small: 17px;

  --font-size-label: 11px;
  --line-height-label: 14px;
}
```

## 5.5 Mobile

Le responsive ne doit pas réduire mécaniquement toute la typographie.

Le nom d’une créature ou d’un donjon conserve une présence éditoriale forte sur téléphone.

La lisibilité prime sur la densité.

---

# 6. Iconographie

## 6.1 Bibliothèque principale

Utiliser **Lucide** comme bibliothèque d’icônes principale.

Le projet étant actuellement en JavaScript vanilla, ne pas introduire `lucide-react` uniquement pour les icônes.

Préférer :

- SVG Lucide ;
- package Lucide compatible JavaScript ;
- sprites ou imports ciblés selon l’architecture retenue.

## 6.2 Bibliothèque secondaire

**Tabler Icons** peut être utilisée en secours lorsqu’une icône nécessaire est absente ou moins convaincante dans Lucide.

Éviter de mélanger plusieurs bibliothèques pour une même famille d’actions si ce n’est pas nécessaire.

## 6.3 Style commun

Cible :

```text
stroke-width ≈ 1.75 à 2
formes simples
bonne lecture à 16–24 px
angles et proportions homogènes
```

## 6.4 Tailles d’icônes

```css
--icon-xs: 14px;
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

## 6.5 Familles à couvrir

Navigation :

- Accueil ;
- Codex ;
- Générateur ;
- Brouhaha ;
- Quêtes ;
- Atelier ;
- Médias ;
- Import / Export.

Actions :

- rechercher ;
- revenir ;
- fermer ;
- ajouter ;
- modifier ;
- supprimer ;
- filtrer ;
- liste ;
- galerie ;
- télécharger ;
- importer ;
- synchroniser ;
- ouvrir plein écran.

Gameplay :

- PV ;
- ATK ;
- DEF ;
- portée ;
- actions ;
- menace ;
- socle ;
- comportement ;
- compétence ;
- butin ;
- lore ;
- donjon ;
- catégorie.

---

# 7. Grille d’espacement

Le système repose sur une grille de base **4 px**.

Tokens :

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
}
```

Règles :

- `4–8 px` : micro-ajustements, icône + texte ;
- `12–16 px` : intérieur d’un composant ;
- `24 px` : groupement logique ;
- `32 px` : séparation de sections ;
- `48–64 px` : respiration éditoriale.

Principe :

> **Le Codex respire. L’Atelier travaille.**

Les écrans éditoriaux peuvent utiliser davantage de vide que les formulaires.

---

# 8. Rayons

```css
:root {
  --radius-xs: 6px;
  --radius-sm: 10px;
  --radius-md: 14px;
  --radius-lg: 18px;
  --radius-xl: 24px;
  --radius-pill: 999px;
}
```

Usage :

- `6 px` : petits tags / micro-composants ;
- `10 px` : champs, boutons ;
- `14 px` : cartes ;
- `18 px` : panneaux ;
- `24 px` : grandes surfaces ou cartes éditoriales ;
- `999 px` : badges, filtres-pills, jamais comme rayon général.

Objectif : éviter l’effet « tout est rond ».

---

# 9. Bordures et profondeur

## 9.1 Principe

La profondeur est créée d’abord par :

1. contraste de surface ;
2. bordure ;
3. espacement ;
4. ombre si nécessaire.

## 9.2 Ombres

Les ombres fortes sont réservées à :

- topbar flottante ;
- modal ;
- drawer ;
- panneau temporaire ;
- élément réellement élevé.

Une carte standard du bestiaire ne doit pas utiliser une grosse ombre.

Tokens recommandés :

```css
--shadow-sm: 0 4px 12px rgba(0,0,0,.20);
--shadow-md: 0 12px 28px rgba(0,0,0,.28);
--shadow-lg: 0 20px 48px rgba(0,0,0,.36);
```

---

# 10. Textures

## 10.1 Niveaux

### Niveau 0 — fonctionnel

Aucune texture visible sous :

- formulaires ;
- champs ;
- tableaux ;
- stats ;
- listes compactes.

### Niveau 1 — ambiance

Texture légère possible sur :

- grand fond ;
- sidebar ;
- rail tablette ;
- bandeau de page ;
- panneau décoratif.

### Niveau 2 — narratif

Texture plus présente mais contrôlée pour :

- couverture de donjon ;
- lore ;
- histoire / description narrative ;
- capacité exceptionnelle ;
- home ;
- blocs narratifs spécifiques.

Les blocs de **Lore, histoire et texte assimilé** utilisent un papier / parchemin **beige très clair**, nuancé, légèrement usé et taché. La matière doit rester réaliste mais discrète, avec un texte brun foncé à fort contraste.

## 10.2 Ressources

Privilégier des sources gratuites et compatibles avec le projet.

Sources autorisées à évaluer :

- bibliothèques CC0 ;
- Poly Haven ou équivalent ;
- textures créées en interne ;
- bruit CSS ou SVG procédural léger.

## 10.3 Performance

Les textures sources haute résolution ne doivent pas être embarquées telles quelles.

Pipeline recommandé :

```text
source libre haute qualité
→ recadrage
→ réduction
→ correction colorimétrique
→ compression WebP/AVIF
→ stockage local PWA
```

Tailles indicatives :

- micro-texture : 256–512 px ;
- texture de grande zone : 512–1024 px ;
- éviter les assets PBR 4K/8K dans l’application.

Bibliothèque cible possible :

```text
assets/textures/
  grain-dark.webp
  wood-dark.webp
  brass-aged.webp
  paper-aged-light.webp
  leather-dark.webp
```

---

# 11. Accent narratif par donjon

Chaque donjon peut disposer d’un accent narratif dérivé des **couleurs dominantes de son affiche**.

L’objectif est d’ajouter une signature visuelle locale sans créer un thème totalement différent.

## 11.1 Extraction

L’extraction des couleurs n’est pas réalisée dynamiquement à chaque affichage.

Processus :

```text
affiche du donjon
→ extraction ponctuelle des couleurs dominantes
→ sélection / validation humaine
→ stockage de 2 à 3 tokens
→ utilisation stable dans l’UI
```

## 11.2 Tokens

```css
--dungeon-accent: #RRGGBB;
--dungeon-accent-soft: #RRGGBB;
--dungeon-accent-dark: #RRGGBB;
```

## 11.3 Zones autorisées

L’accent peut être appliqué à :

- halo discret derrière l’illustration ;
- bordure d’un panneau ;
- titre de donjon ;
- séparateur ;
- détail décoratif ;
- état actif local ;
- micro-texture narrative.

## 11.4 Limite

L’accent de donjon doit représenter environ **10 à 15 % maximum de la surface visuelle**.

Il ne remplace jamais :

- la couleur de catégorie ;
- les couleurs succès / erreur ;
- les couleurs des stats ;
- la palette structurelle Gargottex.

Le squelette reste brun / noir / laiton.

---

# 12. Boutons

Trois niveaux principaux.

## 12.1 Primaire

Usage : une action dominante dans une zone.

Style :

- fond laiton / cuivre ;
- texte sombre ;
- contraste fort ;
- une occurrence principale par bloc fonctionnel.

Exemples :

- Générer ;
- Enregistrer ;
- Tirer une quête ;
- Importer ;
- Confirmer.

## 12.2 Secondaire

Style :

- fond sombre ;
- bordure visible ;
- texte ivoire ;
- hover/focus discret.

## 12.3 Tertiaire

Style :

- texte ou icône ;
- fond transparent ;
- usage pour actions secondaires.

## 12.4 Destructif

Rouge uniquement pour une action réellement destructive.

Ne jamais utiliser le rouge uniquement pour attirer l’attention.

---

# 13. Champs de formulaire

Les formulaires privilégient l’efficacité.

Style :

- fond calme ;
- bordure `--color-border` ;
- rayon `--radius-sm` ;
- labels en Inter ;
- focus clairement visible ;
- aucune texture sous les champs.

État focus recommandé :

```css
outline: 2px solid var(--color-accent-gold);
outline-offset: 2px;
```

Les champs doivent rester utilisables au clavier et au tactile.

---

# 14. Filtres

Les filtres sont des contrôles compacts de type pill ou bouton de sélection.

Exemples :

```text
Donjon ▾
Catégorie ▾
Menace ▾
Tags ▾
```

Règles :

- hauteur tactile suffisante ;
- état actif immédiatement identifiable ;
- nombre de filtres actifs visible ;
- action de réinitialisation accessible ;
- ne pas utiliser les couleurs de catégorie comme simple décoration du filtre.

---

# 15. Badges

Trois familles.

## 15.1 Badge catégorie

Exemple :

```text
◆ TACTIQUE
```

Caractéristiques :

- couleur de catégorie ;
- texte explicite ;
- pictogramme ;
- contraste élevé.

## 15.2 Badge de donnée

Exemples :

```text
SOCLE 32 mm
NIVEAU 3
DONJON 8
```

Style neutre, fond sombre, bordure discrète.

## 15.3 Badge de gameplay

Exemple :

```text
☠ MENACE 4
```

Plus visible qu’un badge de donnée, sans prendre le dessus sur le titre.

---

# 16. Statistiques

Les stats constituent une famille de composants spécifique.

Exemple créature :

```text
PV | ATK | DEF | PORTÉE | ACTIONS
```

Chaque cellule contient :

1. pictogramme ;
2. valeur ;
3. libellé.

Règles :

- chiffres très lisibles ;
- structure stable sur toutes les fiches compatibles ;
- pas de texture ;
- pas de dégradés agressifs ;
- pas de couleur différente par stat sauf besoin fonctionnel démontré.

---

# 17. Carte Créature — mode Galerie

La carte Galerie sert à **reconnaître et choisir**.

Elle ne doit pas devenir une mini-fiche complète.

## 17.1 Structure

Ratio recommandé : proche de **3:4**.

```text
┌──────────────────────┐
│                      │
│     illustration     │
│                      │
├──────────────────────┤
│ Nom                  │
│ Donjon               │
│ CATÉGORIE · MENACE   │
└──────────────────────┘
```

Informations autorisées :

- illustration ;
- nom ;
- donjon ou contexte principal ;
- catégorie ;
- menace.

Ne pas afficher toutes les stats.

---

# 18. Carte Créature — mode Liste

La liste sert à retrouver rapidement une entrée pendant une partie.

Structure cible :

```text
[portrait] Gobeline Turbo-Coude
           Tactique · Cabaret

PV 8    ATK 3    DEF 2    ☠ 2
```

Règles :

- densité plus forte que Galerie ;
- vignette petite mais identifiable ;
- ouverture immédiate de la fiche ;
- sélection active claire ;
- compatible master-detail desktop/tablette.

---

# 19. Fiche Créature — composants

La fiche Créature sert d’écran étalon du Codex.

Hiérarchie verrouillée :

```text
1. identité
2. donjon / contexte
3. catégorie / menace / socle
4. stats
5. compétence
6. comportement
7. butin
8. lore
9. entités liées
```

## 19.1 Illustration principale

- grand format ;
- priorité à la figurine ;
- éviter les crops agressifs ;
- ouverture plein écran possible ;
- halo discret d’accent donjon autorisé.

## 19.2 Compétence

Composant distinct.

Doit être reconnaissable immédiatement.

Peut utiliser :

- bordure laiton ;
- surface `--color-surface-2` ;
- titre Alegreya ;
- icône dédiée.

## 19.3 Comportement

Bloc fonctionnel, lisible, compact.

## 19.4 Butin

Peut utiliser une petite liste ou mini-cartes.

Ne pas transformer chaque loot en grosse carte si l’information tient sur une ligne.

## 19.5 Lore

Traitement éditorial plus chaleureux.

Autorisés :

- texture papier légère ;
- citation ;
- séparateur décoratif ;
- accent du donjon.

Le texte reste parfaitement lisible.

---

# 20. Navigation

## 20.1 Desktop

Sidebar cible : environ **236 px**.

Navigation permanente.

État actif :

- surface légèrement élevée ;
- accent laiton ;
- icône + texte ;
- contraste suffisant.

## 20.2 Tablette

Rail cible : **72 à 80 px**.

Les labels complets peuvent disparaître visuellement, mais doivent rester disponibles pour l’accessibilité.

## 20.3 Téléphone

Navigation basse :

```text
Accueil | Codex | Jeu | Quêtes | Plus
```

Avec :

```text
Jeu = Générateur + Brouhaha
Plus = Atelier + Médias + Import/Export + diagnostics
```

---

# 21. Composants structurels

Liste minimale du design system :

```text
AppShell
Sidebar
TabletRail
MobileBottomNav
Topbar
GlobalSearch
SyncStatus
PageHeader
Panel
EditorialPanel
Drawer
Modal
Tabs
SegmentedControl
FilterBar
FilterChip
ButtonPrimary
ButtonSecondary
ButtonTertiary
IconButton
TextField
SelectField
TextArea
BadgeCategory
BadgeData
BadgeGameplay
StatTile
StatRow
CreatureGalleryCard
CreatureListRow
CreatureHeroImage
AbilityPanel
BehaviorPanel
LootList
LorePanel
RelatedEntityRail
EmptyState
LoadingState
OfflineState
SyncErrorState
Toast
```

---

# 22. États interactifs

Tout composant interactif doit prévoir :

```text
default
hover
focus-visible
active
selected
disabled
loading
error
```

Sur tactile, le design ne doit pas dépendre du hover.

Le `focus-visible` doit rester évident et cohérent dans toute l’application.

---

# 23. Mouvement et animations

Animations autorisées :

- changement de panneau ;
- ouverture/fermeture d’un drawer ;
- modal ;
- sélection d’une carte ;
- apparition d’un détail ;
- toast ;
- état de synchronisation.

Durées cibles :

```css
--motion-fast: 120ms;
--motion-normal: 180ms;
--motion-slow: 260ms;
```

Éviter les animations décoratives longues.

Respecter `prefers-reduced-motion`.

---

# 24. Responsive — principes design system

Seuils de départ :

```text
Téléphone : < 768 px
Tablette  : 768–1199 px
Desktop   : >= 1200 px
```

Les composants doivent être conçus pour changer de comportement, pas seulement de largeur.

Exemples :

```text
Sidebar desktop → rail tablette → bottom nav mobile
Master-detail → master-detail compact → navigation séquentielle
Filtres visibles → filtres repliables → drawer / sheet mobile
Rail créatures liées → section repliable mobile
```

---

# 25. Densité par type d’écran

## Codex

Densité moyenne à faible.

Priorité : illustration + lecture.

## Atelier

Densité moyenne à forte.

Priorité : saisie + comparaison.

## Générateur / Brouhaha

Densité moyenne.

Priorité : action rapide pendant la partie.

## Médias

Densité visuelle forte mais structurée.

## Import / Export

Densité faible.

Priorité : compréhension et sécurité.

---

# 26. Accessibilité

Exigences minimales :

- contraste texte/fond suffisant ;
- focus visible ;
- navigation clavier ;
- cibles tactiles ≈ 44 px pour les actions importantes ;
- labels accessibles pour les icônes ;
- catégories identifiables sans couleur seule ;
- textes redimensionnables ;
- aucune information indispensable au hover ;
- `prefers-reduced-motion` respecté.

---

# 27. Performance PWA

Le design system ne doit pas dégrader la philosophie local-first.

Règles :

- aucune texture indispensable chargée depuis un CDN à chaque ouverture ;
- fonts disponibles offline ;
- icônes locales ou intégrées au bundle ;
- textures compressées ;
- pas de framework ajouté uniquement pour le design system ;
- éviter les bibliothèques lourdes si quelques SVG suffisent ;
- animations légères ;
- dégradés CSS préférés à des images lorsqu’ils suffisent.

---

# 28. Dépendances visuelles autorisées

## Icônes

Priorité :

1. Lucide ;
2. Tabler Icons en secours.

Ne pas ajouter React uniquement pour utiliser `lucide-react`.

## Fonts

- Alegreya ;
- Inter.

## Textures

Sources gratuites ou CC0 uniquement, stockées localement après optimisation.

Les assets tiers doivent conserver leur licence documentée si nécessaire.

---

# 29. Ce qui est désormais verrouillé

Les décisions suivantes sont considérées comme actées :

- direction `Taverne éditoriale + Bestiaire de figurines` ;
- touches limitées de grimoire ;
- palette brun/noir/laiton ;
- couleurs RPG des catégories ;
- Alegreya + Inter ;
- Lucide comme iconographie principale ;
- Tabler comme secours ;
- grille d’espacement de 4 px ;
- rayons 6 / 10 / 14 / 18 / 24 / pill ;
- bordures privilégiées aux grosses ombres ;
- textures réparties en 3 niveaux ;
- cartes Galerie 3:4 ;
- mode Liste dense pour l’usage en partie ;
- trois familles de badges ;
- statistiques comme composant spécifique ;
- accent narratif dérivé des affiches de donjons ;
- accent donjon limité à 10–15 % de l’écran ;
- une action primaire dominante par zone ;
- desktop sidebar / tablette rail / mobile bottom nav ;
- design system compatible offline.

---

# 30. Points restant à préciser pendant l’implémentation

Ces points ne bloquent pas UI-1 :

- icône Lucide exacte par action ;
- texture libre exacte retenue ;
- palette d’accent de chaque donjon ;
- dimensions finales de certains composants selon le contenu réel ;
- ajustement fin des breakpoints si le contenu l’impose ;
- valeurs de contraste après tests WCAG réels ;
- variante de carte Galerie selon les formats d’illustration disponibles.

Ces choix doivent respecter le présent document sans en changer les principes.

---

# 31. Gate UI-1

UI-1 est validée lorsque :

- [x] palette globale définie ;
- [x] couleurs des catégories définies ;
- [x] typographies définies ;
- [x] échelle typographique définie ;
- [x] iconographie et bibliothèques définies ;
- [x] grille d’espacement définie ;
- [x] rayons définis ;
- [x] ombres et profondeur définies ;
- [x] stratégie texture définie ;
- [x] accents de donjons définis ;
- [x] boutons définis ;
- [x] filtres définis ;
- [x] badges définis ;
- [x] statistiques définies ;
- [x] cartes Galerie / Liste définies ;
- [x] composants de fiche Créature définis ;
- [x] navigation responsive définie ;
- [x] composants structurels listés ;
- [x] règles accessibilité définies ;
- [x] règles performance PWA définies.

**UI-1 peut être considérée comme verrouillée.**

La prochaine étape est **UI-2 : architecture détaillée du Bestiaire et de la fiche Créature sur desktop, tablette paysage, tablette portrait et téléphone**, sans encore généraliser la refonte aux autres types d’entités.