# Gargottex V6 — UI-2 Bestiaire & Fiche Créature

## Statut

**VERROUILLÉ — architecture fonctionnelle et responsive du Bestiaire et de la fiche Créature**

Ce document complète :

- `docs/REFONTE-UI-UX-V6.md` ;
- `docs/UI-1-DESIGN-SYSTEM-V6.md`.

Il transforme le design system UI-1 en une architecture détaillée pour la consultation des créatures.

Il ne déclenche aucune implémentation tant que les gates techniques de la refactorisation V6 ne sont pas validées.

La fiche Créature définie ici devient l’**écran étalon du Codex**. Les autres fiches métier devront reprendre son langage visuel et ses règles de hiérarchie sans devenir de simples clones.

---

# 1. Objectifs UI-2

UI-2 doit permettre de :

- parcourir un bestiaire devenu volumineux sans perdre en vitesse ;
- explorer visuellement les créatures grâce aux illustrations ;
- retrouver rapidement une créature pendant une partie ;
- ouvrir une fiche et comprendre immédiatement son identité, sa menace, ses stats et sa mécanique principale ;
- conserver une expérience cohérente sur desktop, tablette paysage, tablette portrait et téléphone ;
- préserver l’état de navigation lorsque l’utilisateur ouvre puis ferme une fiche ;
- préparer la généralisation du langage UI aux autres entités du Codex.

Principe directeur :

> **Galerie pour explorer. Liste pour arbitrer. Fiche pour comprendre.**

---

# 2. Décisions verrouillées

Les décisions suivantes sont actées :

1. Le Bestiaire possède deux modes : **Galerie** et **Liste**.
2. Le mode par défaut est :
   - Galerie sur desktop et tablette ;
   - Liste sur téléphone.
3. Le dernier mode utilisé est mémorisé localement par appareil / session UI.
4. Desktop : la collection reste visible à gauche lorsqu’une fiche est ouverte.
5. Desktop sans sélection : la Galerie peut occuper toute la zone de contenu.
6. Tablette paysage : `rail + collection compacte + fiche`.
7. Tablette portrait : fiche prioritaire + Bestiaire dans un drawer.
8. Téléphone : navigation séquentielle `Bestiaire → Fiche → retour Bestiaire`.
9. Identité, stats et capacité restent toujours visibles / ouvertes sur mobile.
10. Comportement, Butin et Lore deviennent des sections repliables sur téléphone si nécessaire.
11. Les créatures liées sont présentées en priorité par **même donjon** puis relations explicites.
12. Rail lié permanent uniquement sur très grand desktop ; ailleurs, section contextuelle en bas de fiche.
13. Boss multi-phase : pile verticale compacte desktop/tablette ; accordéons sur téléphone.
14. La fiche principale utilise une image en cadrage contrôlé, avec `contain` privilégié pour les figurines.
15. L’image principale peut être ouverte en plein écran.
16. Filtres créatures : recherche, Donjon, Catégorie, Menace, Tags.
17. Tris initiaux uniquement : Nom, Menace, Donjon.
18. Recherche, filtres, tri, mode Galerie/Liste et position de scroll sont restaurés au retour d’une fiche.
19. L’accent narratif du donjon ne remplace jamais les couleurs de gameplay globales.
20. Les données absentes ne doivent jamais produire de grand panneau vide.

---

# 3. Architecture du Bestiaire

## 3.1 Structure fonctionnelle

Le Bestiaire comprend :

```text
En-tête
├── titre + nombre de résultats
├── recherche
├── filtres
├── tri
├── bascule Galerie / Liste
└── action Réinitialiser si filtres actifs

Collection
├── Galerie
└── Liste

Fiche sélectionnée
└── selon appareil et largeur disponible
```

Le Bestiaire doit rester utile avec plusieurs centaines de créatures.

---

# 4. Barre de recherche et filtres

## 4.1 Recherche

Recherche instantanée sur les champs utiles existants, au minimum :

- nom ;
- donjon ;
- catégorie ;
- tags ;
- contenu indexé déjà supporté par l’application si pertinent.

La recherche locale reste prioritaire et ne dépend pas du réseau.

## 4.2 Filtres

Filtres verrouillés :

```text
Donjon
Catégorie
Menace
Tags
```

Comportement :

- multi-sélection lorsque cela apporte une vraie valeur ;
- filtres actifs visibles sous forme de chips ;
- suppression individuelle d’un filtre ;
- action `Tout effacer` ;
- nombre de résultats mis à jour immédiatement ;
- aucune page entière de réglages avant de voir le contenu.

## 4.3 Catégories

Couleurs UI-1 :

```text
Basique       #C8CDD3
Tactique      #5FAF72
Spéciale      #4F91E3
Brute         #8B68D8
Mini-boss     #D9A12E
Boss          #EF4B4B
```

Toujours :

```text
icône + texte + couleur
```

## 4.4 Tri

Trois tris initiaux :

- Nom ;
- Menace ;
- Donjon.

Ordre ascendant / descendant lorsque pertinent.

Ne pas ajouter une forêt de tris tant qu’un besoin réel n’est pas identifié.

---

# 5. Mode Galerie

## 5.1 Objectif

Le mode Galerie sert à :

- explorer ;
- reconnaître visuellement ;
- parcourir un donjon ;
- apprécier les figurines ;
- sélectionner une créature.

Il ne doit pas essayer d’afficher toute la fiche.

## 5.2 Carte Galerie

Ratio cible : proche de **3:4**.

Structure :

```text
┌────────────────────────────┐
│                            │
│       illustration         │
│                            │
├────────────────────────────┤
│ Nom                        │
│ Donjon                     │
│ CATÉGORIE        MENACE    │
└────────────────────────────┘
```

Contenu maximum :

- illustration ;
- nom ;
- donjon / contexte principal ;
- catégorie ;
- menace.

Ne pas afficher PV / ATK / DEF / portée / actions dans cette carte.

## 5.3 Images

- vignette dédiée optimisée ;
- lazy-loading ;
- cadrage contrôlé ;
- éviter les crops coupant la silhouette d’une figurine ;
- fallback propre sans image.

---

# 6. Mode Liste

## 6.1 Objectif

Le mode Liste sert à retrouver une créature très rapidement pendant une partie.

## 6.2 Ligne Liste

Structure cible :

```text
[portrait] Nom de la créature
           Catégorie · Donjon

           PV 8 · ATK 3 · DEF 2 · ☠ Menace 2
```

Sur desktop/tablette, les stats peuvent rester alignées dans une zone secondaire.

Sur téléphone, la densité est ajustée sans rendre les zones tactiles trop petites.

## 6.3 Sélection

Une ligne sélectionnée doit être immédiatement identifiable par :

- surface active ;
- bordure ou accent laiton ;
- contraste ;
- état accessible, pas seulement couleur.

---

# 7. Persistance de l’état du Bestiaire

Lorsque l’utilisateur ouvre une fiche puis revient à la collection, restaurer :

- recherche ;
- filtres ;
- tri ;
- mode Galerie / Liste ;
- position de scroll ;
- créature sélectionnée si pertinent.

Sur téléphone, le retour `‹ Bestiaire` doit ramener exactement au contexte précédent.

Objectif : éviter le retour en haut de 150 créatures après chaque consultation.

---

# 8. Fiche Créature — hiérarchie obligatoire

Ordre de lecture verrouillé :

```text
1. Illustration / identité
2. Donjon / contexte
3. Catégorie / Menace / Socle
4. Statistiques
5. Capacité signature
6. Comportement / IA
7. Butin
8. Lore
9. Tags / métadonnées secondaires si utiles
10. Entités liées
```

La partie utile en jeu doit précéder la partie narrative.

---

# 9. En-tête de la fiche

Doit contenir :

- nom de la créature ;
- donjon ;
- illustration principale ;
- catégorie ;
- menace ;
- socle.

Le nom et l’image dominent.

Le donjon est un lien contextuel vers sa future fiche / hub lorsque cette navigation existe.

L’accent du donjon peut apparaître via :

- halo discret ;
- bordure ;
- séparateur ;
- micro-détail décoratif.

Limite globale définie en UI-1 : **10–15 % de la surface visuelle**.

---

# 10. Illustration principale

## 10.1 Règles

- priorité à la silhouette complète ;
- `object-fit: contain` privilégié pour les figurines ;
- `cover` uniquement lorsque le recadrage est explicitement maîtrisé ;
- arrière-plan calme ;
- accent de donjon autorisé en halo / fond léger ;
- aucun texte critique incrusté sur l’image ;
- clic / tap ouvre une visionneuse plein écran.

## 10.2 Fallback

Sans image :

- placeholder cohérent ;
- nom visible ;
- aucune grande zone vide inutile ;
- fiche immédiatement fonctionnelle.

---

# 11. Badges de fiche

Trois familles UI-1 :

## Catégorie

Exemple :

```text
◆ TACTIQUE
```

Couleur de catégorie + texte + icône.

## Gameplay

Exemple :

```text
☠ MENACE 4
```

Plus visible que la donnée secondaire.

## Donnée

Exemple :

```text
SOCLE 32 mm
```

Neutre.

Le nombre de badges doit rester faible. Toute donnée n’a pas vocation à devenir une pilule.

---

# 12. Statistiques

Composant standard : `StatRow` / `StatStrip`.

Ordre :

```text
PV | ATK | DEF | PORTÉE / ZONE | ACTIONS
```

Chaque stat contient :

- icône ;
- valeur dominante ;
- libellé.

Règles :

- toujours visible rapidement ;
- structure stable d’une créature à l’autre ;
- aucune texture ;
- contrastes forts ;
- Menace n’est pas dupliquée dans la bande de stats.

---

# 13. Capacité signature

Le coup spécial est le bloc de gameplay le plus important après les stats.

Structure :

```text
[icône] NOM DE CAPACITÉ
        règle / effet
        bruit Brouhaha éventuel
```

Traitement :

- surface `--color-surface-2` ;
- bordure laiton subtile ;
- titre Alegreya ;
- corps Inter ;
- visible sans action supplémentaire sur tous les appareils.

Aucune capacité principale ne doit être cachée derrière un onglet fermé par défaut.

---

# 14. Comportement / IA

Bloc fonctionnel distinct.

Contenu existant à exploiter :

- comportement IA ;
- priorité de cible ;
- règles associées disponibles dans les données.

Objectif : permettre au meneur d’exécuter la créature sans parcourir le Lore.

Sur téléphone, section repliable autorisée mais son intitulé et son état doivent rester évidents.

---

# 15. Butin

## 15.1 Présentation

Liste compacte ou mini-cartes selon la richesse du contenu.

Pour chaque entrée :

- nom ;
- type ;
- effet si pertinent ;
- valeur en or si disponible.

## 15.2 Donnée absente

S’il n’y a aucun loot :

- ne pas afficher un grand panneau vide ;
- masquer la section ou afficher une mention courte uniquement si utile au contexte.

---

# 16. Lore

Le Lore arrive après les informations de jeu.

Traitement éditorial autorisé :

- texture papier très légère ;
- séparateur ;
- accent du donjon ;
- citation ;
- Alegreya pour titre / citation ;
- Inter pour le corps long.

Le Lore peut être plus ample visuellement mais ne doit pas gêner l’usage pendant une partie.

Sur téléphone, accordéon autorisé.

---

# 17. Créatures liées et navigation contextuelle

Priorité de sélection :

1. créatures du même donjon ;
2. relations explicites existantes ;
3. contenu directement associé par le modèle métier.

Ne pas inventer un système de recommandation opaque.

## 17.1 Très grand desktop

Rail `Même donjon / Créatures liées` autorisé si l’espace reste confortable.

## 17.2 Desktop standard / tablette / mobile

Section horizontale ou grille compacte en bas de fiche.

## 17.3 Navigation contextuelle

Prévoir lorsque les relations existent :

- ouvrir le donjon ;
- ouvrir un loot associé ;
- ouvrir une quête liée ;
- ouvrir un PNJ lié.

L’utilisateur ne doit pas être obligé de revenir à la racine du Codex pour suivre une relation naturelle.

---

# 18. Boss et mini-boss

La fiche Créature standard reste la base.

## 18.1 Mini-boss

Même structure qu’une créature standard avec :

- badge Mini-boss ;
- accent ambre / légendaire ;
- capacité(s) éventuellement plus riche(s).

## 18.2 Boss multi-phase

Les phases sont une extension de la fiche.

Desktop / tablette :

```text
Boss
├── identité générale
├── stats / règles communes
├── Phase 1
├── Phase 2
├── Phase 3
└── Lore / liés
```

Chaque phase est une sous-fiche compacte avec :

- nom ;
- stats spécifiques si différentes ;
- capacité / attaques ;
- effet / transition si disponible.

Téléphone : phases sous forme d’accordéons.

Éviter des tabs cachant entièrement les phases les unes derrière les autres.

---

# 19. Desktop ≥ 1200 px

## 19.1 Bestiaire sans fiche sélectionnée

Galerie plein espace dans la zone de travail.

Structure :

```text
Sidebar | Topbar
        | Header Bestiaire
        | Recherche / filtres / tri / vue
        | Galerie ou Liste
```

## 19.2 Fiche ouverte

Composition cible :

```text
Sidebar | Collection | Illustration | Fiche
```

Répartition indicative :

- collection : 22–28 % de l’espace de travail ;
- zone fiche : reste de l’espace ;
- illustration dans la fiche : environ 35–40 % de la zone fiche quand la largeur le permet.

Sur très grand desktop seulement :

```text
Sidebar | Collection | Illustration | Fiche | Liés
```

Le rail `Liés` disparaît dès qu’il comprime la fiche.

## 19.3 Scroll

- collection indépendante si nécessaire ;
- fiche indépendante ;
- éviter que toute la page saute lors d’un changement de sélection.

---

# 20. Tablette paysage — 768 à 1199 px

Structure cible :

```text
Rail | Collection compacte | Fiche
```

Principes :

- rail navigation 72–80 px ;
- collection plus dense que desktop ;
- mode Galerie autorisé lorsque la place est suffisante ;
- mode Liste particulièrement adapté au master-detail ;
- illustration importante mais moins monumentale ;
- filtres repliables si leur présence permanente gêne le contenu.

L’iPad paysage doit conserver une vraie efficacité master-detail.

---

# 21. Tablette portrait — 768 à 1199 px

La tablette portrait ne doit pas empiler une grande collection au-dessus de la fiche.

Structure :

```text
Rail | Fiche principale
       + drawer Bestiaire
```

## 21.1 Drawer Bestiaire

Contient :

- recherche ;
- filtres ;
- tri ;
- Galerie / Liste ;
- collection.

Le drawer :

- conserve l’état ;
- peut couvrir une partie importante de la largeur ;
- se ferme après sélection si cela maximise la fiche ;
- reste accessible via un bouton `Bestiaire` clair.

---

# 22. Téléphone < 768 px

Navigation séquentielle obligatoire.

## 22.1 Écran Bestiaire

Ordre :

```text
Titre / nombre de résultats
Recherche
Filtres / tri
Liste par défaut
Galerie optionnelle
```

Le dernier mode choisi peut être restauré.

## 22.2 Ouverture

Toucher une créature ouvre une vraie vue fiche.

Pas d’empilement `liste complète + fiche sous la liste`.

## 22.3 Écran Fiche

Ordre :

```text
‹ Bestiaire
Illustration
Nom / Donjon
Catégorie / Menace / Socle
Stats
Capacité signature
Comportement
Butin
Lore
Liés
```

## 22.4 Sections mobiles

Toujours ouvertes :

- identité ;
- stats ;
- capacité signature.

Repliables si nécessaire :

- Comportement ;
- Butin ;
- Lore ;
- Créatures liées.

Le repli doit réduire le scroll sans cacher les informations les plus critiques.

---

# 23. Navigation retour et historique

Le bouton `‹ Bestiaire` doit :

- restaurer le mode ;
- restaurer recherche / filtres / tri ;
- restaurer le scroll ;
- replacer visuellement la créature précédemment ouverte ;
- ne pas recréer la collection depuis zéro si l’état local est déjà disponible.

Les liens contextuels doivent conserver un chemin de retour compréhensible.

---

# 24. États sans données / données partielles

À gérer explicitement :

- aucune créature ;
- aucun résultat de recherche ;
- aucun résultat après filtres ;
- image absente ;
- capacité absente ;
- loot absent ;
- lore absent ;
- donjon inconnu ;
- synchronisation distante indisponible mais données locales présentes.

Règle :

> **Une donnée absente réduit la fiche, elle ne crée pas un trou.**

---

# 25. Images et performance

Le Bestiaire peut devenir l’un des écrans les plus lourds visuellement.

Exigences :

- thumbnails dédiées en Galerie / Liste ;
- image haute qualité chargée uniquement pour la fiche ;
- lazy-loading ;
- dimensions explicites pour limiter les sauts de layout ;
- compression WebP / AVIF selon compatibilité retenue ;
- pas de chargement simultané de toutes les images haute définition ;
- fonctionnement offline avec les médias locaux disponibles ;
- aucune dépendance à un CDN externe pour la consultation normale.

---

# 26. Accessibilité

Exigences spécifiques UI-2 :

- ligne / carte entièrement activable mais avec focus visible ;
- ordre clavier logique ;
- catégorie lisible sans couleur seule ;
- alt text utile lorsque pertinent ;
- visionneuse plein écran fermable au clavier ;
- drawer tablette accessible au clavier ;
- accordéons avec état ouvert / fermé exposé ;
- targets tactiles ≈ 44 px pour actions importantes ;
- aucune information uniquement au hover ;
- respect de `prefers-reduced-motion`.

---

# 27. Composants UI-2

Composants à prévoir ou stabiliser :

```text
BestiaryHeader
BestiaryToolbar
CreatureSearch
DungeonFilter
CategoryFilter
ThreatFilter
TagFilter
SortControl
ViewModeToggle
ActiveFilterChips
CreatureGallery
CreatureGalleryCard
CreatureList
CreatureListRow
CreatureDetail
CreatureHeroImage
CreatureIdentity
CategoryBadge
ThreatBadge
DataBadge
StatRow
AbilityPanel
BehaviorPanel
LootList
LorePanel
RelatedCreatures
BossPhaseStack
BossPhaseAccordion
BestiaryDrawer
ImageViewer
EmptyBestiaryState
NoSearchResultState
MissingImageState
```

Les noms sont indicatifs. L’architecture actuelle reste JavaScript ES Modules ; ne pas introduire un framework uniquement pour matérialiser ces composants.

---

# 28. Interactions et mouvement

Utiliser les durées UI-1 :

```text
rapide  : 120 ms
normal  : 180 ms
lent    : 260 ms
```

Interactions autorisées :

- sélection de carte ;
- transition collection → fiche ;
- drawer ;
- accordéon ;
- visionneuse ;
- changement Galerie / Liste ;
- feedback filtre.

Aucune animation ne doit ralentir le passage d’une créature à l’autre pendant une partie.

---

# 29. Critères d’acceptation UI-2

UI-2 est validée lorsque les comportements suivants sont définis et implémentables sans ambiguïté :

- [x] Galerie définie ;
- [x] Liste définie ;
- [x] recherche définie ;
- [x] filtres définis ;
- [x] tris définis ;
- [x] persistance de contexte définie ;
- [x] hiérarchie fiche Créature définie ;
- [x] image principale définie ;
- [x] badges définis ;
- [x] stats définies ;
- [x] capacité signature définie ;
- [x] comportement défini ;
- [x] butin défini ;
- [x] lore défini ;
- [x] entités liées définies ;
- [x] boss multi-phase défini ;
- [x] desktop défini ;
- [x] tablette paysage définie ;
- [x] tablette portrait définie ;
- [x] téléphone défini ;
- [x] retour / restauration de contexte définis ;
- [x] états incomplets définis ;
- [x] performance image définie ;
- [x] accessibilité définie.

---

# 30. Gate UI-2

La Gate UI-2 est considérée comme conceptuellement validée lorsque :

1. une créature peut être retrouvée rapidement dans un bestiaire volumineux ;
2. une fiche peut être comprise en quelques secondes ;
3. la capacité signature est visible immédiatement ;
4. le téléphone ne reproduit jamais le master-detail desktop sous forme d’une longue pile ;
5. l’iPad paysage conserve un vrai master-detail ;
6. l’iPad portrait privilégie la fiche et utilise un drawer pour la collection ;
7. le retour au Bestiaire restaure le contexte précédent ;
8. les boss multi-phase restent compatibles avec la fiche standard ;
9. l’image est valorisée sans sacrifier les règles de jeu ;
10. le Bestiaire reste performant et utilisable hors ligne.

**UI-2 est désormais la source de vérité pour le Bestiaire et la fiche Créature.**

La prochaine étape est **UI-3 : décliner ce langage sur Donjons, Héros, PNJ, Quêtes, Loot, Objets, Brouhaha et Médias, en adaptant la hiérarchie à chaque entité sans uniformisation artificielle.**