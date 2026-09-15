# Gargottex V6 — UI-3 Codex : autres entités

## Statut

**VERROUILLÉ — architecture fonctionnelle et responsive des autres entités du Codex**

Ce document complète :

- `docs/REFONTE-UI-UX-V6.md` ;
- `docs/UI-1-DESIGN-SYSTEM-V6.md` ;
- `docs/UI-2-BESTIAIRE-FICHE-CREATURE-V6.md`.

UI-2 a défini la fiche Créature comme écran étalon du Codex. UI-3 généralise désormais ce langage à :

- Donjons ;
- Héros ;
- PNJ ;
- Quêtes ;
- Loot ;
- Objets du décor ;
- Brouhaha en tant que référentiel ;
- Médias en tant que bibliothèque transversale.

Le principe directeur est :

> **Même Gargottex, mais pas la même fiche.**

Les entités partagent le même design system, la même navigation et les mêmes règles responsive, mais chacune conserve une hiérarchie métier propre.

UI-3 ne modifie pas le modèle métier existant. Les éventuels enrichissements de schéma identifiés pendant la refonte sont documentés comme évolutions futures et ne doivent pas être introduits implicitement.

---

# 1. Objectifs UI-3

UI-3 doit permettre de :

- décliner le langage visuel de UI-2 au reste du Codex ;
- éviter une interface où toutes les entités seraient de simples variantes de la fiche Créature ;
- rendre les relations métier navigables naturellement ;
- faire du Donjon un hub narratif structurant ;
- présenter la progression d’un héros comme une seule identité, et non comme plusieurs fiches isolées ;
- distinguer clairement Loot et Objets du décor ;
- séparer le Brouhaha encyclopédique du Brouhaha utilisé pendant une partie ;
- repositionner Médias comme bibliothèque transversale plutôt que comme entité narrative du Codex ;
- préserver le fonctionnement local-first, offline et PWA ;
- rester strictement compatible avec le modèle de données existant.

---

# 2. Décisions verrouillées

Les décisions suivantes sont actées :

1. Le **Donjon devient un hub narratif naturel du Codex**.
2. Les **Héros sont regroupés par `hero_base_name`** et non présentés comme une carte indépendante par niveau.
3. La fiche Héros expose un **niveau sélectionné** et une **frise de progression** pour les autres niveaux disponibles.
4. Le libellé visible `Objets` devient **Objets du décor** afin d’éviter la confusion avec Loot.
5. Le Brouhaha est séparé en deux usages :
   - **Codex Brouhaha** : référentiel des effets ;
   - **Vue Brouhaha de partie** : outil interactif traité en UI-4.
6. Médias n’est plus traité comme une famille de fiches narratives du Codex.
7. Médias conserve une **vue dédiée dans la navigation principale** et apparaît contextuellement dans les fiches auxquelles les médias sont liés.
8. L’accent narratif d’un donjon n’est propagé qu’aux entités dont le lien au donjon est explicite ou déductible sans ambiguïté.
9. Aucun changement de modèle métier n’est introduit dans UI-3.
10. Les modes de collection sont adaptés à l’usage de chaque entité au lieu d’imposer Galerie + Liste partout.
11. Les relations contextuelles réutilisent les identifiants et champs existants.
12. Une donnée absente réduit la fiche au lieu de produire une zone vide.
13. Les règles UI-1 et UI-2 restent la référence pour palette, typographies, composants, accessibilité, images, responsive et performance.

---

# 3. Grammaire commune du Codex

Toutes les familles d’entités utilisent les mêmes primitives générales :

```text
Page / collection
├── titre
├── recherche si utile
├── filtres si utiles
├── tri si utile
└── collection adaptée au type

Fiche
├── identité
├── illustration / média principal si disponible
├── informations critiques métier
├── blocs secondaires
├── narration éventuelle
└── relations contextuelles
```

Le vocabulaire visuel partagé reste :

- Alegreya pour l’identité éditoriale ;
- Inter pour les données et l’interface ;
- surfaces brun/noir ;
- laiton comme accent structurel ;
- accent narratif du donjon lorsque pertinent ;
- bordures plutôt que grosses ombres ;
- illustrations valorisées ;
- interaction tactile ≈ 44 px minimum ;
- aucun fonctionnement dépendant du hover.

---

# 4. Modes de collection verrouillés

Les modes par entité sont :

| Entité | Mode principal | Mode secondaire |
|---|---|---|
| Donjons | Galerie | aucun obligatoire |
| Héros | Galerie groupée par personnage | aucun obligatoire |
| PNJ | Galerie | Liste |
| Quêtes | Liste | aucun obligatoire |
| Loot | Galerie | Liste |
| Objets du décor | Liste | aucun obligatoire |
| Brouhaha | Échelle / référentiel | aucun |
| Médias | Galerie | éventuellement vue compacte |

Les modes supplémentaires ne doivent pas être ajoutés si aucun besoin réel ne les justifie.

---

# 5. Donjons — rôle dans le Codex

## 5.1 Intention

Le Donjon devient un **hub narratif et structurel**.

Il doit permettre de comprendre immédiatement :

- l’identité du lieu ;
- son ambiance ;
- sa structure d’étages ;
- son boss final ;
- ses créatures ;
- ses quêtes ;
- ses objets du décor ;
- ses effets de Brouhaha.

Le Donjon ne doit pas devenir un simple écran agrégateur administratif.

---

# 6. Collection Donjons

## 6.1 Mode Galerie

Chaque carte Donjon doit privilégier l’affiche / illustration.

Structure :

```text
┌────────────────────────────┐
│                            │
│       affiche donjon       │
│                            │
├────────────────────────────┤
│ Nom                        │
│ Boss final                 │
│ N créatures · N quêtes     │
└────────────────────────────┘
```

Les compteurs sont calculés à partir des relations existantes.

## 6.2 Accent narratif

La carte utilise les tokens validés du donjon :

```css
--dungeon-accent
--dungeon-accent-soft
--dungeon-accent-dark
```

La palette structurelle Gargottex reste dominante.

---

# 7. Fiche Donjon

## 7.1 Hiérarchie

Ordre cible :

```text
1. Affiche / illustration
2. Nom
3. Description
4. Budgets / progression d’étages
5. Boss final
6. Créatures du donjon
7. Quêtes du donjon
8. Objets du décor
9. Brouhaha du donjon
10. Médias liés éventuels
11. Tags / métadonnées secondaires
```

## 7.2 Affiche

L’affiche donne la couleur narrative du hub.

Règles :

- grande mais non envahissante ;
- cadrage contrôlé ;
- ouverture plein écran ;
- accent colorimétrique dérivé de l’affiche ;
- ne pas placer les données gameplay essentielles directement sur l’image.

## 7.3 Budgets d’étages

Le champ existant `floor_budgets` est présenté sous forme d’une progression lisible.

Exemple :

```text
Étage 1   Menace 3
Étage 2   Menace 5
Étage 3   Menace 7
Étage 4   Menace 9
```

Une frise ou pile verticale est autorisée.

Éviter un graphique complexe qui n’apporte rien à la lecture.

## 7.4 Boss final

Le modèle actuel repose sur `boss_name`.

Règle UI-3 :

- si une créature correspond sans ambiguïté à `boss_name`, rendre le boss cliquable ;
- sinon afficher son nom comme information textuelle ;
- ne pas modifier le modèle pour ajouter `boss_creature_id` dans ce chantier.

Une éventuelle relation structurée pourra être étudiée ultérieurement.

## 7.5 Sections liées

Les blocs Créatures, Quêtes, Objets du décor et Brouhaha utilisent des aperçus courts avec action `Voir tout` si le volume est important.

La fiche Donjon ne doit pas charger visuellement toute la base associée en une seule page infinie.

---

# 8. Responsive Donjon

## Desktop

Page hub large.

Composition recommandée :

```text
Sidebar | affiche / identité | contenu du hub
```

Les sections liées peuvent utiliser des rails horizontaux ou grilles compactes.

## Tablette paysage

Affiche plus compacte, contenu structuré en sections.

## Tablette portrait

Affiche pleine largeur raisonnable, puis progression verticale.

## Téléphone

Flux séquentiel :

```text
‹ Donjons
Affiche
Nom
Description
Étages
Boss
Créatures
Quêtes
Objets du décor
Brouhaha
```

Les grandes collections liées peuvent devenir des rails horizontaux ou sections repliables.

---

# 9. Héros — principe de regroupement

Le modèle existant contient plusieurs entrées par héros selon `hero_base_name` et `level`.

UI-3 considère qu’un héros est une **identité unique avec progression**.

La collection ne doit donc pas afficher plusieurs cartes identiques pour les niveaux 1, 2, 3, 4.

---

# 10. Collection Héros

Mode : **Galerie groupée par `hero_base_name`**.

Carte cible :

```text
[portrait]

Sigrune
Guerrière
Niveaux disponibles : 1 · 2 · 3 · 4
```

Affichage possible :

- portrait principal ;
- nom de base ;
- rôle ;
- nombre / liste compacte des niveaux disponibles.

Ne pas afficher toutes les statistiques dans la carte.

---

# 11. Fiche Héros

## 11.1 Hiérarchie

```text
1. Portrait / identité
2. Nom
3. Rôle / titre
4. Sélecteur de niveau
5. Stats du niveau sélectionné
6. Compétence
7. Effet
8. Brouhaha associé
9. Frise de progression
10. Tags / médias liés éventuels
```

## 11.2 Sélecteur de niveau

Composant cible :

```text
Niveau 1 | Niveau 2 | Niveau 3 | Niveau 4
```

Il ne s’agit pas d’onglets cachant des entités sans contexte : c’est un sélecteur de progression d’un même héros.

Le niveau actif met à jour :

- nom complet si différent ;
- titre ;
- statistiques ;
- compétence ;
- effet ;
- Brouhaha ;
- illustration si les données le prévoient.

## 11.3 Statistiques

Réutiliser `StatRow` :

```text
PV | ATK | DEF | PORTÉE | ACTIONS
```

## 11.4 Progression

Sous la fiche active, afficher une frise légère :

```text
N1 ─ Compétence
N2 ─ Évolution / effet
N3 ─ Compétence
N4 ─ Évolution / effet
```

Objectif : comprendre la trajectoire du héros sans afficher quatre fiches complètes simultanément.

---

# 12. Responsive Héros

## Desktop / tablette paysage

Portrait + fiche + progression visible dans la même zone.

## Tablette portrait

Portrait / identité puis sélection de niveau et stats.

## Téléphone

Le sélecteur de niveau reste visible près du haut de la fiche.

La progression complète peut devenir une section repliable.

Le changement de niveau ne doit pas modifier brutalement la position de scroll.

---

# 13. PNJ — intention

Le PNJ est une **fiche narrative**, pas une créature sans statistiques.

Aucune stat artificielle ne doit être inventée pour aligner visuellement PNJ et Créatures.

---

# 14. Collection PNJ

Modes :

- Galerie ;
- Liste.

Carte Galerie :

```text
[portrait]
Nom
Race · rôle
```

Ligne Liste :

```text
[portrait] Nom
           Race · rôle · ton
```

Filtres possibles uniquement à partir des données existantes utiles :

- race ;
- rôle ;
- tags.

Ne pas ajouter de filtre Donjon si aucune appartenance directe n’existe dans le modèle.

---

# 15. Fiche PNJ

Hiérarchie :

```text
1. Portrait / identité
2. Nom
3. Race
4. Rôle
5. Ton
6. Lore
7. Quêtes associées
8. Médias liés éventuels
9. Tags
```

## 15.1 Ton

Le champ `tone` est un attribut de jeu utile et doit apparaître clairement, par exemple :

```text
TON : bourru mais cordial
```

Il ne doit pas être perdu dans le Lore.

## 15.2 Quêtes associées

Les quêtes portant `npc_id` correspondant sont affichées en relations contextuelles.

Cette relation doit être calculée depuis les données existantes.

## 15.3 Accent narratif

Par défaut, le PNJ conserve la palette Gargottex neutre.

Ne pas lui appliquer arbitrairement l’accent d’un donjon simplement parce qu’une quête le mentionne.

Si une appartenance directe est ajoutée au modèle dans une future évolution, cette règle pourra être revue.

---

# 16. Quêtes — rôle dans UI-3

UI-3 définit la **fiche Quête du Codex**.

Le tirage aléatoire / outil de partie sera traité en UI-4.

La fiche de référence ne doit pas reprendre les interactions de l’outil de session.

---

# 17. Collection Quêtes

Mode principal : **Liste**.

Une quête est retrouvée plus efficacement par texte et contexte que par une galerie systématique.

Ligne cible :

```text
Nom de la quête
Donjon · PNJ · Difficulté ★★★
Objectif résumé
```

Filtres :

- donjon ;
- difficulté ;
- PNJ si pertinent ;
- tags.

Recherche :

- nom ;
- description ;
- objectif ;
- récompense ;
- tags selon index local disponible.

---

# 18. Fiche Quête

Hiérarchie :

```text
1. Nom
2. Difficulté
3. Donjon
4. PNJ donneur éventuel
5. Description
6. Objectif
7. Récompense
8. Illustration éventuelle
9. Tags
10. Relations contextuelles
```

## 18.1 Objectif

L’objectif reçoit un bloc fortement identifiable.

Il doit pouvoir être repéré immédiatement pendant une partie.

## 18.2 Récompense

La récompense est un bloc distinct mais moins dominant que l’objectif.

## 18.3 Donjon

Une quête liée à un donjon reprend son accent narratif.

Le nom du Donjon est cliquable vers son hub.

## 18.4 PNJ

Si `npc_id` existe :

- afficher le PNJ ;
- permettre d’ouvrir sa fiche.

---

# 19. Loot — intention

Loot représente un **objet récupérable / récompense liée à une créature**, distinct des Objets du décor.

Aucun système de rareté n’est inventé dans UI-3.

Les couleurs RPG de catégories restent réservées aux créatures.

---

# 20. Collection Loot

Modes :

- Galerie ;
- Liste.

Carte Galerie :

```text
[illustration]
Nom
Type
Valeur en or
```

Ligne Liste :

```text
Nom · Type
Effet résumé · 3 or
Source : Créature
```

Filtres possibles :

- type ;
- créature source ;
- tags.

---

# 21. Fiche Loot

Hiérarchie :

```text
1. Illustration éventuelle
2. Nom
3. Type
4. Effet
5. Valeur en or
6. Créature source
7. Donjon source si déductible sans ambiguïté
8. Tags / médias liés éventuels
```

## 21.1 Provenance

Si `creature_id` existe :

- afficher la créature source ;
- lien vers sa fiche ;
- si cette créature possède un `dungeon_id`, l’accent du donjon peut être utilisé.

Sans créature source :

- rester sur palette Gargottex neutre ;
- ne pas deviner un contexte.

---

# 22. Objets du décor — définition

Le libellé visible devient :

> **Objets du décor**

Le store / type métier `interactables` n’est pas renommé dans le modèle dans ce chantier.

Cette famille représente les éléments de décor avec lesquels les joueurs peuvent agir.

---

# 23. Collection Objets du décor

Mode principal : **Liste**.

Structure :

```text
Nom
Donjon · Type
PV · Actions autorisées
```

Filtres :

- donjon ;
- type ;
- tags.

L’illustration reste utile lorsqu’elle existe mais ne justifie pas à elle seule un mode Galerie obligatoire.

---

# 24. Fiche Objet du décor

Hiérarchie :

```text
1. Nom
2. Donjon
3. Type
4. Illustration éventuelle
5. PV
6. Actions autorisées
7. Effet
8. Tags
9. Médias liés éventuels
```

## 24.1 Actions autorisées

Le champ `actions_allowed` doit devenir un élément visuellement très lisible.

Exemple :

```text
OUVRIR · FERMER · CASSER
```

Si le champ reste une chaîne texte dans le modèle, UI-3 ne crée pas de structure métier artificielle. L’interface peut seulement parser / afficher prudemment les séparateurs connus lorsque cela est sûr.

## 24.2 Accent

L’accent du donjon associé est autorisé.

---

# 25. Brouhaha — séparation conceptuelle

Deux expériences distinctes sont verrouillées.

## 25.1 Codex Brouhaha — UI-3

Référentiel des effets disponibles.

Objectif : comprendre les effets par niveau et par donjon.

## 25.2 Brouhaha de partie — UI-4

Outil interactif avec :

- jauge ;
- niveau actuel ;
- + / − ;
- historique ;
- tirage / effet courant ;
- contexte de session.

UI-3 ne doit pas mélanger ces deux interfaces.

---

# 26. Vue Codex Brouhaha

Mode : **échelle / référentiel**, pas Galerie / Liste.

Structure :

```text
Filtre : Universel | Donjon

0   effet éventuel
1   effet
2   effet
3   effet
...
12  effet critique
```

Chaque entrée contient :

- niveau ;
- donjon ou Universel ;
- texte de l’effet.

## 26.1 Hiérarchie visuelle

Le niveau doit être visible immédiatement.

L’intensité peut augmenter progressivement vers 12, mais sans créer une échelle multicolore agressive.

Le rouge reste réservé aux niveaux réellement critiques si le contenu le justifie.

## 26.2 Accents

- Universel : palette Gargottex neutre ;
- effet rattaché à un donjon : accent narratif du donjon.

---

# 27. Médias — changement de rôle UX

`media_assets` reste une donnée métier et une fonctionnalité importante.

Cependant, UI-3 ne traite plus Médias comme une famille de fiches narratives au même niveau que Créatures, Héros ou Donjons.

Médias devient une **bibliothèque transversale**.

---

# 28. Vue Médias dédiée

La vue principale Médias reste accessible depuis la navigation globale.

Mode principal : Galerie.

Filtres :

- type d’entité ;
- entité liée ;
- MIME / type média si utile ;
- utilisé / orphelin ;
- recherche label / fichier.

Chaque carte peut afficher :

- aperçu ;
- label ;
- nom de fichier ;
- type ;
- entité liée ;
- statut utilisé / orphelin.

Les opérations de gestion seront détaillées dans UI-5.

---

# 29. Médias contextuels dans les fiches

Lorsqu’un média possède `entity_type + entity_id` correspondant à une fiche, cette fiche peut afficher une section :

```text
Médias liés
```

Règles :

- section secondaire ;
- galerie courte ;
- ouverture plein écran ;
- ne pas concurrencer l’illustration principale ;
- ne pas charger toutes les ressources lourdes immédiatement.

La fiche d’une entité ne devient pas un gestionnaire de médias.

---

# 30. Propagation des accents de donjon

Règles verrouillées :

| Entité | Accent donjon |
|---|---|
| Donjon | oui, principal |
| Créature | oui, via `dungeon_id` |
| Quête | oui, via `dungeon_id` |
| Objet du décor | oui, via `dungeon_id` |
| Brouhaha | oui si `dungeon_id`, sinon neutre |
| Loot | oui seulement via créature source identifiable |
| Héros | non, palette neutre |
| PNJ | non par défaut |
| Médias | héritage visuel seulement dans le contexte de leur entité |

Aucun accent ne doit être inféré depuis une relation ambiguë.

---

# 31. Navigation contextuelle entre entités

Le Codex doit permettre les parcours naturels suivants :

```text
Donjon → Créature
Donjon → Quête
Donjon → Objet du décor
Donjon → Brouhaha
Créature → Donjon
Créature → Loot
Quête → Donjon
Quête → PNJ
PNJ → Quête
Loot → Créature
Objet du décor → Donjon
Brouhaha → Donjon
```

Les liens ne doivent pas obliger à revenir à la racine du Codex.

Le retour doit conserver le contexte de la collection précédente lorsque cela est pertinent.

---

# 32. Recherche globale

La recherche globale conserve toutes les familles métier existantes.

Même si Médias sort du Codex narratif, un média peut rester trouvable via la recherche globale si l’indexation actuelle le supporte.

Les résultats doivent identifier clairement le type :

```text
Créature
Donjon
Héros
PNJ
Quête
Loot
Objet du décor
Brouhaha
Média
```

Le terme visible `Objet du décor` remplace `Objet` dans l’interface lorsque cela ne casse pas un format d’export ou une clé technique.

---

# 33. Responsive commun UI-3

UI-3 conserve les familles de layout UI-1 / UI-2 :

```text
Téléphone : < 768 px
Tablette  : 768–1199 px
Desktop   : >= 1200 px
```

Mais le comportement varie selon l’entité.

## Desktop

Master-detail utilisé uniquement lorsque cela améliore réellement la consultation.

## Tablette paysage

Master-detail compact pour PNJ, Quêtes, Loot et Objets du décor si pertinent.

Donjon et Héros peuvent fonctionner comme pages de détail riches sans collection permanente.

## Tablette portrait

Priorité à la fiche ; collection en drawer lorsque le master-detail devient trop comprimé.

## Téléphone

Navigation séquentielle :

```text
Collection → Fiche → Retour collection
```

Donjon peut directement se présenter comme page hub après sélection.

Brouhaha référentiel reste une page unique filtrable.

Médias reste une galerie plein écran.

---

# 34. Persistance de contexte

Pour les collections utilisant sélection / fiche, conserver localement :

- recherche ;
- filtres ;
- tri ;
- position de scroll ;
- entité précédemment ouverte ;
- mode Galerie / Liste lorsque plusieurs modes existent ;
- niveau sélectionné pour un Héros si cela améliore la continuité.

Le retour à une collection ne doit pas réinitialiser l’utilisateur au début sans raison.

---

# 35. États incomplets

Toutes les fiches doivent gérer explicitement :

- image absente ;
- relation absente ;
- texte narratif absent ;
- média absent ;
- champ optionnel absent ;
- résultat vide ;
- relation cassée ;
- données locales disponibles mais cloud indisponible.

Règle commune :

> **Une donnée absente réduit la fiche, elle ne crée pas un panneau fantôme.**

---

# 36. Composants UI-3

En complément des composants UI-1 / UI-2, stabiliser :

```text
DungeonGallery
DungeonCard
DungeonDetail
DungeonHero
DungeonFloorBudgetList
DungeonBossPanel
DungeonRelatedSection

HeroGallery
HeroCard
HeroDetail
HeroLevelSelector
HeroProgressionTimeline

NpcGallery
NpcList
NpcCard
NpcListRow
NpcDetail
NpcToneBlock

QuestList
QuestListRow
QuestDetail
QuestObjectivePanel
QuestRewardPanel

LootGallery
LootList
LootCard
LootListRow
LootDetail
LootSourceLink

InteractableList
InteractableListRow
InteractableDetail
AllowedActionsBlock

BrouhahaReference
BrouhahaLevelRow
BrouhahaDungeonFilter

MediaGallery
MediaCard
MediaContextRail

RelatedSection
EntityBackLink
EntityMissingRelationState
```

Les noms sont indicatifs et n’imposent aucun framework.

---

# 37. Accessibilité

UI-3 conserve les exigences UI-1 / UI-2.

Exigences supplémentaires :

- le sélecteur de niveau Héros est utilisable au clavier ;
- les relations contextuelles exposent clairement leur destination ;
- les affiches de donjon disposent d’un texte alternatif pertinent si nécessaire ;
- les actions d’une fiche ne dépendent pas de la couleur d’accent du donjon ;
- l’échelle Brouhaha reste lisible sans couleur ;
- les cartes Média ont un label accessible ;
- les listes et galeries restent utilisables avec zoom texte / taille dynamique.

---

# 38. Performance

Les écrans UI-3 doivent respecter la PWA local-first.

Règles :

- thumbnails pour les collections ;
- lazy-loading des médias non visibles ;
- affiche / portrait haute qualité seulement sur la fiche ouverte ;
- ne pas charger toutes les images liées d’un Donjon simultanément ;
- rails horizontaux limités / paginés localement si nécessaire ;
- aucun CDN obligatoire pour la consultation ;
- accents de donjon stockés comme données / tokens légers, pas recalculés à chaque rendu ;
- aucune dépendance réseau pour naviguer entre relations déjà disponibles localement.

---

# 39. Modèle métier : non-changements explicites

UI-3 ne doit pas introduire :

- `boss_creature_id` ;
- `npc_dungeon_id` ;
- rareté de loot ;
- catégories supplémentaires ;
- relation artificielle Héros → Donjon ;
- relation Média supplémentaire non nécessaire ;
- changement de structure des stores uniquement pour répondre au design.

Ces évolutions peuvent être proposées ultérieurement dans un chantier métier dédié si elles deviennent nécessaires.

---

# 40. Critères d’acceptation UI-3

UI-3 est considérée comme définie sans ambiguïté lorsque :

- [x] Donjon est défini comme hub narratif ;
- [x] collection Donjons définie ;
- [x] fiche Donjon définie ;
- [x] budgets d’étages définis ;
- [x] comportement boss final défini sans migration de schéma ;
- [x] Héros regroupés par personnage ;
- [x] sélection de niveau définie ;
- [x] progression Héros définie ;
- [x] PNJ défini sans stats artificielles ;
- [x] relations PNJ → Quêtes définies ;
- [x] Quête Codex séparée de l’outil de tirage ;
- [x] collection Quêtes définie ;
- [x] fiche Quête définie ;
- [x] Loot défini sans rareté inventée ;
- [x] collection Loot définie ;
- [x] fiche Loot définie ;
- [x] `Objets du décor` verrouillé comme libellé UI ;
- [x] collection Objets du décor définie ;
- [x] fiche Objet du décor définie ;
- [x] Brouhaha référentiel séparé de l’outil de partie ;
- [x] vue Codex Brouhaha définie ;
- [x] Médias repositionné comme bibliothèque transversale ;
- [x] Médias contextuels dans les fiches définis ;
- [x] propagation des accents de donjon définie ;
- [x] navigation contextuelle entre entités définie ;
- [x] responsive défini ;
- [x] persistance de contexte définie ;
- [x] états incomplets définis ;
- [x] accessibilité définie ;
- [x] performance définie ;
- [x] absence de changement de modèle métier explicitement verrouillée.

---

# 41. Gate UI-3

La Gate UI-3 est considérée comme conceptuellement validée lorsque :

1. les autres entités reprennent clairement le langage Gargottex sans copier artificiellement la fiche Créature ;
2. un Donjon fonctionne comme point d’entrée naturel vers son contenu ;
3. un Héros est perçu comme un personnage évolutif, pas comme quatre entrées indépendantes ;
4. PNJ reste narratif et ne reçoit aucune stat inventée ;
5. Quête reste une fiche de référence distincte du tirage en partie ;
6. Loot et Objets du décor sont immédiatement distinguables ;
7. Brouhaha de référence et Brouhaha de session sont séparés ;
8. Médias reste accessible sans encombrer le Codex narratif ;
9. les accents de donjon sont utilisés uniquement sur des relations fiables ;
10. la navigation entre entités suit les relations métier existantes ;
11. l’expérience reste cohérente desktop / tablette / téléphone ;
12. aucune évolution de modèle métier n’est nécessaire pour appliquer UI-3.

**UI-3 devient la source de vérité pour Donjons, Héros, PNJ, Quêtes, Loot, Objets du décor, Brouhaha référentiel et intégration contextuelle des Médias.**

La prochaine étape est **UI-4 : définir les outils de partie et l’Accueil — Générateur, Brouhaha de session, Quêtes de session et tableau de bord narratif — avec priorité absolue à la vitesse d’utilisation pendant une partie.**
