# Gargottex V6 — Cible de refonte UI/UX

## 0. Objet du document

Ce document est la **source de vérité UI/UX** pour la refonte visuelle de Gargottex après validation de la refactorisation technique V6 local-first + Neon + Vercel.

Il ne décrit pas une simple modernisation CSS. Il définit la **cible fonctionnelle, visuelle et responsive** du Codex de *Gargotte & Va-Nu-Pieds*.

La refonte doit transformer Gargottex d'un outil utilitaire de consultation/édition en une **encyclopédie visuelle de Gargotte**, sans perdre :

- la rapidité de consultation ;
- l'efficacité en partie ;
- la séparation lecture / édition ;
- le fonctionnement local-first ;
- le fonctionnement PWA ;
- les données, relations et fonctions métier existantes ;
- l'usage desktop, tablette et téléphone.

Le principe directeur est :

> **Architecture sobre et systémique + émotion et identité Gargotte.**

La structure doit rester claire comme une application moderne, tandis que la direction artistique doit donner l'impression d'ouvrir le véritable codex de Gargotte.

---

# 1. Dépendance avec la refactorisation technique V6

La refonte UI/UX est un chantier séparé de `docs/REFACTORISATION-V6-LOCAL-FIRST-NEON.md`.

La refactorisation technique actuelle impose explicitement de **ne pas redessiner le Codex, l'Atelier, la navigation, les cartes, les formulaires ou le design global** tant qu'elle n'est pas validée.

La présente refonte ne doit donc commencer en implémentation qu'après validation des gates techniques de la V6.

À préserver pendant la refonte :

- IndexedDB comme base de travail locale ;
- synchronisation Neon en arrière-plan ;
- usage hors ligne ;
- exports indépendants du cloud ;
- données métier existantes ;
- médias locaux selon les règles de la V6 technique ;
- aucune dépendance réseau introduite dans un parcours de consultation normal.

La refonte UI/UX **ne doit pas changer le modèle métier** sauf nécessité démontrée et explicitement documentée.

---

# 2. Périmètre fonctionnel à conserver

La cible conserve les huit vues majeures actuelles :

1. **Accueil**
2. **Codex**
3. **Générateur**
4. **Brouhaha**
5. **Quêtes**
6. **Atelier**
7. **Médias**
8. **Import / Export**

Fonctions transversales à conserver :

- recherche globale ;
- journal / diagnostic ;
- état de synchronisation local/cloud ;
- navigation entre entités ;
- ouverture des médias ;
- persistance de l'état UI utile ;
- fonctionnement tactile ;
- installation PWA.

Le contenu métier du Codex reste constitué des entités existantes :

- donjons ;
- créatures ;
- héros ;
- PNJ ;
- quêtes ;
- loot ;
- objets interactifs ;
- effets de Brouhaha ;
- médias.

---

# 3. Direction artistique verrouillée

## 3.1 Intention

Direction retenue : **dark fantasy tavernier premium**, avec une lecture moderne.

L'application doit évoquer :

- la Chope Qui Colle ;
- un registre de meneur de jeu ;
- un bestiaire de figurines ;
- un grimoire éditorial moderne ;
- l'humour absurde de Gargotte.

L'application ne doit pas évoquer :

- un dashboard SaaS générique ;
- un faux parchemin médiéval omniprésent ;
- une interface RPG mobile clinquante ;
- du cyberpunk ;
- un inventaire de jeu vidéo saturé d'effets ;
- une administration froide et monochrome.

## 3.2 Palette cible

Palette de base recommandée :

| Token | Rôle | Cible |
|---|---|---|
| `--bg-0` | fond général | presque noir brun `#0B0806` |
| `--bg-1` | fond secondaire | brun noir `#120D09` |
| `--surface-1` | panneau principal | `#17110D` |
| `--surface-2` | panneau élevé | `#201711` |
| `--surface-3` | carte active / accent sombre | `#281C14` |
| `--border` | lignes / cadres | brun cuivre `#4C3928` |
| `--gold` | accent principal | laiton vieilli `#D0A05A` |
| `--gold-soft` | accent lumineux | ivoire doré `#F0CC8B` |
| `--text` | texte principal | ivoire chaud `#F3E6D5` |
| `--muted` | texte secondaire | gris brun `#AD9B84` |
| `--danger` | alerte / boss / danger | rouge brique sombre |
| `--success` | état synchronisé / OK | vert mousse désaturé |

La couleur ne doit jamais être le seul vecteur d'information.

## 3.3 Couleurs de catégories de créatures

Chaque catégorie reçoit un marqueur constant combinant **texte + icône + couleur** :

- Basique ;
- Tactique ;
- Spéciale ;
- Brute ;
- Mini-boss ;
- Boss.

Les teintes exactes seront fixées pendant le design system, mais elles doivent rester compatibles avec le fond sombre et conserver un contraste accessible.

## 3.4 Typographies

Deux familles maximum :

### Typographie d'identité

Utilisée pour :

- logotype Gargottex ;
- grands titres ;
- noms de créatures ou donjons lorsque l'espace le permet ;
- intertitres éditoriaux ponctuels.

Style : serif fantasy expressive, lisible, sans excès décoratif.

### Typographie d'interface

Utilisée pour :

- corps de texte ;
- stats ;
- filtres ;
- formulaires ;
- navigation ;
- tableaux ;
- libellés ;
- notifications.

Style : sans-serif très lisible.

Règle : **aucun long texte dans la typographie fantasy**.

Les polices finales devront être libres ou correctement licenciées, performantes en PWA et chargées sans dégrader le fonctionnement offline.

## 3.5 Iconographie

Les emojis actuels doivent progressivement être remplacés par un **set d'icônes cohérent**.

Style :

- gravure simplifiée ;
- pictogramme de jeu de plateau ;
- métal estampé / sigle de taverne ;
- traits suffisamment simples pour rester lisibles à 16–24 px.

Icônes principales à prévoir :

- accueil ;
- codex ;
- générateur ;
- Brouhaha ;
- quêtes ;
- atelier ;
- médias ;
- données/import-export ;
- recherche ;
- journal ;
- PV ;
- ATK ;
- DEF ;
- portée ;
- actions ;
- menace ;
- socle ;
- comportement ;
- butin ;
- lore ;
- donjon ;
- catégorie ;
- synchronisation.

## 3.6 Texture

Niveau retenu : **présente mais discrète**.

Autorisés :

- grain très léger ;
- bois sombre dans les grandes zones décoratives ;
- métal/laiton sur bordures ou éléments signature ;
- papier/carton uniquement dans certains blocs narratifs ;
- micro-usure et patine.

Interdits :

- texture forte sous les longs textes ;
- parchemin sur chaque panneau ;
- bruit visuel permanent ;
- effets qui réduisent contraste ou lisibilité.

---

# 4. Principes UX non négociables

## 4.1 Lecture d'abord

Le Codex est un outil de consultation. La donnée importante doit être comprise en quelques secondes.

Une fiche ne doit pas obliger à lire tout son texte pour comprendre :

- qui est l'entité ;
- d'où elle vient ;
- son rôle ;
- sa menace ;
- ses statistiques ;
- sa mécanique principale.

## 4.2 Codex et Atelier restent séparés

Le **Codex** est une expérience de lecture et d'exploration.

L'**Atelier** est une expérience de création et d'édition.

Ne pas réintroduire des boutons de modification, suppression ou champs de formulaire dans les fiches de lecture sauf action secondaire clairement identifiée.

## 4.3 Les illustrations sont du contenu

Une illustration ne doit plus être traitée comme une simple miniature de base de données.

Règles :

- respecter les formats verticaux lorsque possible ;
- limiter les crops agressifs ;
- privilégier `contain` ou un cadrage contrôlé pour les figurines ;
- autoriser l'ouverture plein écran ;
- réserver les petites vignettes aux listes compactes ;
- l'image principale d'une fiche doit respirer.

## 4.4 Hiérarchie avant décoration

Tout écran doit rester efficace si les textures sont supprimées.

La hiérarchie doit être obtenue d'abord par :

- taille ;
- position ;
- espacement ;
- contraste ;
- groupement ;
- typographie ;
- composants.

Les effets décoratifs viennent ensuite.

## 4.5 Recherche partout

La recherche globale doit rester accessible quel que soit l'appareil.

Elle doit permettre de retrouver rapidement les entités principales et d'ouvrir directement leur fiche.

## 4.6 Tactile réel

Cibles tactiles : environ **44 px minimum** pour les actions importantes.

Ne pas dépendre du hover pour comprendre ou utiliser une fonction.

## 4.7 Animations

Animations courtes et fonctionnelles :

- changement de panneau ;
- ouverture de drawer ;
- sélection de carte ;
- apparition d'un détail ;
- feedback de synchronisation.

Pas d'animations longues ni décoratives pendant une partie.

---

# 5. Architecture responsive verrouillée

La refonte repose sur **trois familles de layouts**, pas sur un desktop simplement compressé.

Les seuils initiaux :

```text
Téléphone : < 768 px
Tablette  : 768–1199 px
Desktop   : >= 1200 px
```

Ces seuils sont des points de départ. L'implémentation doit utiliser le comportement réel du contenu pour ajuster les breakpoints si nécessaire.

## 5.1 Desktop

Objectif : densité, visibilité simultanée, navigation rapide.

Structure générale :

```text
┌──────────────┬───────────────────────────────────────────┐
│ navigation   │ topbar : recherche / sync / compte       │
│ permanente   ├───────────────────────────────────────────┤
│              │ espace de travail                        │
│              │                                           │
└──────────────┴───────────────────────────────────────────┘
```

Principes :

- sidebar permanente ;
- recherche globale visible ;
- espace de travail large ;
- master-detail autorisé ;
- plusieurs panneaux simultanés lorsque cela améliore la lecture ;
- aucune colonne secondaire purement décorative.

## 5.2 Tablette paysage

Objectif : conserver la puissance du desktop avec moins de largeur.

Structure :

```text
rail compact | collection / outils | fiche principale
```

Principes :

- sidebar réduite à un rail d'icônes ;
- master-detail conservé pour le Codex ;
- filtres repliables si nécessaire ;
- aucune information métier importante supprimée ;
- l'illustration reste importante mais moins dominante que sur desktop.

## 5.3 Tablette portrait

Objectif : priorité au contenu sans empiler une longue liste au-dessus de la fiche.

Structure :

```text
rail compact | fiche principale
              + drawer / panneau Bestiaire
```

Principes :

- fiche au premier plan ;
- collection accessible par drawer/panneau ;
- les formulaires passent en une ou deux colonnes selon largeur réelle ;
- les panneaux secondaires deviennent des sections repliables si nécessaire.

## 5.4 Téléphone

Objectif : une tâche claire par écran.

Navigation globale proposée :

```text
Accueil | Codex | Jeu | Quêtes | Plus
```

Regroupements :

- `Jeu` : Générateur + Brouhaha ;
- `Plus` : Atelier + Médias + Import/Export + Journal / diagnostics si besoin.

Le téléphone doit utiliser une navigation **séquentielle** :

```text
Bestiaire
   ↓ toucher une créature
Fiche créature plein écran
   ↓
‹ Bestiaire
```

Interdiction de reproduire l'ancien comportement :

```text
longue liste
longue liste
longue liste
...
fiche sélectionnée très loin sous la liste
```

---

# 6. Navigation globale cible

## 6.1 Desktop

Sidebar :

- Accueil ;
- Codex ;
- Générateur ;
- Brouhaha ;
- Quêtes ;
- Atelier ;
- Médias ;
- Données / Import-Export.

Topbar :

- marque Gargottex ;
- recherche globale ;
- statut local/synchronisation ;
- accès compte ;
- journal / diagnostics en action secondaire.

## 6.2 Tablette

Rail d'icônes permanent en paysage.

En portrait, le rail reste privilégié tant qu'il n'écrase pas le contenu.

Chaque icône doit disposer d'un label accessible et d'un état actif clair.

## 6.3 Téléphone

Barre basse à cinq entrées maximum.

Les fonctions regroupées s'ouvrent dans des hubs simples, pas dans des menus à trois niveaux.

---

# 7. Codex — architecture cible

## 7.1 Modes

Le Codex propose deux modes de collection :

### Galerie

Pour explorer visuellement.

Carte :

- illustration ;
- nom ;
- contexte principal ;
- catégorie ;
- menace ou niveau selon entité.

### Liste

Pour retrouver rapidement une entrée pendant une partie.

Ligne compacte avec :

- petite vignette ;
- nom ;
- informations critiques ;
- indicateur de catégorie ;
- ouverture immédiate de la fiche.

## 7.2 Filtres

Pour les créatures :

- recherche ;
- donjon ;
- catégorie ;
- menace ;
- tags ;
- éventuellement boss / mini-boss en raccourci si pertinent.

Les filtres actifs doivent être visibles et facilement réinitialisables.

## 7.3 Navigation contextuelle

Une fiche peut proposer des entités liées :

- créatures du même donjon ;
- loot associé ;
- quêtes associées ;
- PNJ liés ;
- objets interactifs liés.

Le rail « liés » est une aide à la navigation, jamais une duplication exhaustive du Codex.

---

# 8. Fiche Créature — référence de design

La fiche Créature est le **composant étalon** de la refonte.

Sa réussite définit le langage visuel des autres fiches.

## 8.1 Hiérarchie obligatoire

Ordre cible :

```text
1. Identité
2. Donjon / appartenance
3. Catégorie + menace + socle
4. Statistiques
5. Capacité signature
6. Comportement / IA
7. Butin
8. Lore
9. Tags / métadonnées secondaires
```

## 8.2 En-tête

Doit contenir :

- nom ;
- donjon ;
- catégorie ;
- menace ;
- socle ;
- illustration principale.

Le nom et l'illustration doivent dominer visuellement.

## 8.3 Statistiques

Composant `StatStrip` ou `StatGrid` standardisé.

Minimum :

- PV ;
- ATK ;
- DEF ;
- Portée / Zone ;
- Actions.

Menace reste dans l'identité de la créature et ne doit pas être confondue avec une stat de combat ordinaire.

## 8.4 Capacité signature

Le coup spécial doit être immédiatement visible.

Composant dédié :

```text
[icône] Nom de capacité
        description / règle
        Brouhaha éventuel
```

Il doit avoir plus de poids qu'un simple paragraphe.

## 8.5 Comportement / IA

Bloc distinct avec :

- comportement ;
- priorité de cible ;
- règle universelle si applicable.

Les informations utiles en partie passent avant le lore.

## 8.6 Butin

Liste visuelle compacte.

Pour chaque loot :

- nom ;
- type ;
- effet si utile ;
- valeur en or si existante.

## 8.7 Lore

Bloc éditorial final.

Le lore doit être agréable à lire mais ne doit pas repousser les règles de jeu importantes hors du premier écran sur desktop/tablette.

---

# 9. Fiche Créature — comportement par appareil

## 9.1 Desktop

Composition cible :

```text
┌──────────┬────────────────┬─────────────────────────────┬────────────┐
│ nav      │ illustration   │ fiche créature              │ liés       │
│          │ grande         │ identité / stats / capacité │            │
│          │                │ comportement / loot / lore  │            │
└──────────┴────────────────┴─────────────────────────────┴────────────┘
```

Le rail `liés` peut disparaître à largeur desktop minimale si nécessaire.

## 9.2 Tablette paysage

Composition :

```text
rail | collection compacte | fiche
```

La fiche peut organiser illustration + identité en deux zones dans sa partie supérieure.

## 9.3 Tablette portrait

Composition :

```text
rail | fiche plein espace
```

Bouton `Bestiaire` ouvre la collection dans un drawer.

## 9.4 Téléphone

Écran 1 : collection.

Écran 2 : fiche.

Structure fiche :

```text
‹ Bestiaire
illustration
nom
badges
stats
capacité
comportement
butin
lore
```

Les sections secondaires peuvent utiliser des ancres ou tabs internes si cela réduit réellement le scroll, sans cacher la capacité principale.

---

# 10. Déclinaison des autres fiches

Les autres entités réutilisent le langage de la fiche Créature mais ne doivent pas devenir des clones artificiels.

## 10.1 Donjon

Priorités :

- couverture / illustration ;
- nom ;
- description ;
- budgets d'étage ;
- boss ;
- créatures ;
- quêtes ;
- objets ;
- Brouhaha contextuel.

Le donjon doit progressivement devenir un **hub narratif naturel** du Codex.

## 10.2 Héros

Priorités :

- portrait ;
- nom ;
- niveau ;
- rôle / titre ;
- stats ;
- compétence ;
- effet ;
- Brouhaha ;
- progression.

## 10.3 PNJ

Priorités :

- portrait ;
- nom ;
- race ;
- rôle ;
- ton ;
- lore ;
- quêtes associées.

## 10.4 Quête

Priorités :

- nom ;
- difficulté ;
- donneur ;
- donjon ;
- description ;
- objectif ;
- récompense.

## 10.5 Loot

Priorités :

- illustration ;
- nom ;
- type ;
- effet ;
- valeur ;
- créature source.

## 10.6 Objet interactif

Priorités :

- nom ;
- donjon ;
- type ;
- PV ;
- actions autorisées ;
- effet.

## 10.7 Brouhaha

Priorités :

- niveau ;
- contexte ;
- texte de l'effet ;
- historique en mode session.

---

# 11. Accueil cible

L'accueil devient un **tableau de bord narratif léger**, pas un dashboard analytique.

À montrer :

- identité Gargottex ;
- accès rapides ;
- nombre de donjons / créatures / quêtes / médias ;
- dernier donjon utilisé ou contexte de session ;
- accès Codex ;
- Générateur ;
- Brouhaha ;
- Atelier.

Éviter les graphiques sans utilité de jeu.

---

# 12. Générateur cible

La logique métier actuelle reste prioritaire.

Hiérarchie :

1. donjon ;
2. étage ;
3. budget ;
4. options boss / mini-boss ;
5. action générer ;
6. résultat ;
7. créatures et objets générés.

Le résultat doit être lisible comme une **composition de rencontre**, pas comme un simple tableau.

Sur téléphone, les contrôles précèdent le résultat dans un flux vertical clair.

---

# 13. Brouhaha cible

La jauge 0–12 devient le centre visuel de la vue.

Doivent rester visibles :

- niveau actuel ;
- augmentation / diminution ;
- contexte du donjon ;
- effet déclenché ;
- historique ;
- reset / actions de session.

Les niveaux critiques peuvent avoir une intensité visuelle croissante, sans animation agressive.

---

# 14. Quêtes cible

Deux objectifs :

- tirer rapidement une quête ;
- consulter les quêtes enregistrées.

La quête tirée doit être présentée comme une fiche narrative courte avec :

- nom ;
- difficulté ;
- donjon ;
- PNJ ;
- objectif ;
- récompense.

---

# 15. Atelier cible

L'Atelier reprend le design system mais reste volontairement plus fonctionnel.

Desktop/tablette :

```text
liste d'entités | formulaire
```

Téléphone :

```text
sélecteur entité
↓
formulaire plein écran
```

Règles :

- labels toujours visibles ;
- regroupement logique des champs ;
- champs numériques compacts ;
- textareas pour lore / IA / description ;
- sauvegarde évidente ;
- suppression clairement séparée ;
- feedback local + sync distinct ;
- aucune texture lourde derrière les formulaires.

---

# 16. Médias cible

Galerie responsive avec :

- filtre type ;
- filtre entité ;
- statut utilisé / orphelin ;
- ajout ;
- aperçu ;
- rattachement ;
- suppression sûre.

Les cartes média peuvent être plus neutres graphiquement que les cartes du Codex.

---

# 17. Import / Export cible

Cette vue doit inspirer confiance.

Séparer clairement :

- sauvegarde complète ;
- restauration ;
- imports par entité ;
- exports par entité ;
- téléchargement de modèles ;
- état / progression ;
- erreurs.

Ne pas transformer cette vue en écran technique illisible.

---

# 18. Design system à produire avant implémentation complète

Créer une couche de composants et tokens avant de redessiner les huit vues en profondeur.

## 18.1 Tokens

Minimum :

- couleurs ;
- typographies ;
- échelle d'espacement ;
- rayons ;
- bordures ;
- ombres ;
- tailles d'icônes ;
- tailles tactiles ;
- largeurs de contenu ;
- breakpoints ;
- durées d'animation ;
- z-index.

## 18.2 Composants primitifs

- `Button`
- `IconButton`
- `Field`
- `Select`
- `Textarea`
- `Badge`
- `Chip`
- `Panel`
- `Divider`
- `Tabs`
- `Drawer`
- `Modal`
- `Toast`
- `EmptyState`
- `SyncStatus`

## 18.3 Composants métier

- `AppSidebar`
- `TabletRail`
- `MobileBottomNav`
- `GlobalSearch`
- `EntityCard`
- `EntityListRow`
- `EntityHero`
- `CreatureBadge`
- `ThreatBadge`
- `StatStrip`
- `AbilityPanel`
- `BehaviorPanel`
- `LootPanel`
- `LorePanel`
- `RelatedEntitiesRail`
- `DungeonFilter`
- `CategoryFilter`
- `ThreatFilter`
- `MediaCard`
- `EditorSection`

Les noms sont indicatifs. L'implémentation actuelle reste en JavaScript ES Modules ; ne pas introduire un framework uniquement pour reproduire ces concepts.

---

# 19. Accessibilité et lisibilité

Minimum attendu :

- contraste suffisant WCAG pour textes essentiels ;
- focus clavier visible ;
- labels de formulaire explicites ;
- navigation utilisable sans hover ;
- boutons icon-only avec nom accessible ;
- taille tactile suffisante ;
- taille de texte lisible sur iPhone/iPad ;
- ne jamais coder une catégorie uniquement par couleur ;
- respecter `prefers-reduced-motion` ;
- alt text utile pour les illustrations quand pertinent.

---

# 20. Performance

La direction artistique ne doit pas sacrifier la PWA.

Règles :

- pas de grosses textures répétées inutilement ;
- images responsive ;
- lazy loading hors premier écran ;
- miniatures dédiées pour les listes ;
- pas de filtre CSS lourd permanent sur de grandes images ;
- animations utilisant propriétés peu coûteuses ;
- fonctionnement correct offline ;
- ne pas charger toutes les illustrations du Codex simultanément sur mobile.

---

# 21. États UI à concevoir explicitement

Chaque vue importante doit définir :

- chargement local ;
- vide ;
- résultat normal ;
- recherche sans résultat ;
- erreur locale ;
- offline ;
- synchronisation en cours ;
- synchronisé ;
- erreur de synchronisation ;
- média absent ;
- données partiellement disponibles.

L'état cloud ne doit jamais masquer le fait que la donnée locale reste la base de travail immédiate.

---

# 22. Plan d'implémentation recommandé

## Phase UI-0 — Audit et baseline

- figer captures des huit vues actuelles ;
- lister composants CSS/JS existants ;
- inventorier interactions ;
- mesurer les principaux parcours mobile/tablette/desktop ;
- valider que la refactorisation technique V6 est terminée.

### Gate UI-0

Aucune régression fonctionnelle connue non documentée avant démarrage.

## Phase UI-1 — Design system

- tokens ;
- typographies ;
- palette ;
- icônes ;
- boutons ;
- champs ;
- panneaux ;
- badges ;
- navigation responsive ;
- primitives de layout.

### Gate UI-1

Les primitives sont cohérentes sur desktop, tablette et téléphone sans modifier les données métier.

## Phase UI-2 — Codex + fiche Créature

- collection Galerie ;
- collection Liste ;
- filtres ;
- fiche Créature ;
- entités liées ;
- comportement desktop ;
- tablette paysage ;
- tablette portrait ;
- téléphone séquentiel.

### Gate UI-2

Une créature peut être trouvée, ouverte et comprise rapidement sur les trois familles d'appareils.

La fiche Créature devient la référence validée pour la suite.

## Phase UI-3 — Autres fiches Codex

- Donjons ;
- Héros ;
- PNJ ;
- Quêtes ;
- Loot ;
- Objets ;
- Brouhaha ;
- Médias.

### Gate UI-3

Le Codex complet suit le même langage visuel sans uniformiser artificiellement les entités.

## Phase UI-4 — Outils de partie

- Accueil ;
- Générateur ;
- Brouhaha ;
- Quêtes.

### Gate UI-4

Les parcours de partie sont plus rapides ou au minimum aussi rapides que dans la version précédente.

## Phase UI-5 — Administration

- Atelier ;
- Médias ;
- Import / Export ;
- Journal / diagnostics ;
- états de synchronisation.

### Gate UI-5

Aucune perte de fonction d'édition, import, export ou maintenance.

## Phase UI-6 — Polish responsive et accessibilité

- iPhone ;
- iPad portrait ;
- iPad paysage ;
- desktop étroit ;
- desktop large ;
- clavier ;
- reduced motion ;
- performance ;
- contrastes.

### Gate UI-6

Validation finale de la refonte sur les trois familles d'appareils.

---

# 23. Critères d'acceptation globaux

La refonte est validée uniquement si :

- les huit vues fonctionnelles existent toujours ;
- aucune donnée métier n'est perdue ;
- Codex et Atelier restent distincts ;
- la recherche globale reste disponible ;
- les illustrations disposent d'un traitement éditorial digne du projet ;
- le téléphone n'empile plus collection complète puis fiche ;
- la tablette possède un comportement propre et non un simple desktop réduit ;
- le desktop conserve une forte efficacité ;
- le fonctionnement offline reste intact ;
- la synchronisation Neon reste secondaire à l'enregistrement local ;
- aucune fonction critique n'exige un hover ;
- aucune catégorie ne dépend uniquement d'une couleur ;
- l'interface reste rapide sur iPhone/iPad ;
- l'identité visuelle est immédiatement reconnaissable comme Gargottex / Gargotte ;
- la refonte n'introduit pas un framework sans justification technique indépendante du design.

---

# 24. Décisions déjà verrouillées

Les points suivants sont considérés comme décidés et ne doivent pas être réouverts sans raison documentée :

1. Direction **dark fantasy tavernier premium**.
2. Base sombre brun/noir + laiton/cuivre + ivoire chaud.
3. Texture discrète, jamais dominante.
4. Deux familles typographiques maximum : identité + interface.
5. Remplacement progressif des emojis par un set cohérent d'icônes.
6. Conservation des huit vues majeures.
7. Séparation stricte Codex / Atelier.
8. Trois familles de layout : desktop / tablette / téléphone.
9. Tablette traitée comme une cible à part entière.
10. Téléphone en navigation séquentielle pour les fiches.
11. Navigation mobile à cinq entrées maximum.
12. Recherche globale accessible partout.
13. Illustration considérée comme contenu majeur.
14. Fiche Créature comme étalon du design system métier.
15. Hiérarchie Créature : identité → stats → capacité → comportement → butin → lore.
16. Bestiaire en deux modes : Galerie et Liste.
17. Filtres créatures : Donjon, Catégorie, Menace, Tags, recherche.
18. L'Atelier reste plus fonctionnel et moins décoratif que le Codex.
19. Le donjon peut devenir progressivement un hub narratif naturel du Codex.
20. L'architecture UI reste compatible avec la PWA JavaScript ES Modules existante.

---

# 25. Décisions restant à figer pendant UI-1

Ces choix sont encore ouverts mais ne bloquent pas la définition de la cible :

- familles typographiques exactes ;
- set d'icônes exact ;
- couleurs précises des six catégories de créatures ;
- intensité finale du grain / des textures ;
- rayon final des composants ;
- comportement exact du rail tablette portrait aux largeurs intermédiaires ;
- choix tabs vs ancres sur certaines longues fiches mobiles ;
- densité exacte du mode Liste.

Chaque choix doit être validé au niveau design system puis réutilisé partout.

---

# 26. Règle finale

La cible n'est pas de fabriquer « une application fantasy ».

La cible est de fabriquer **Gargottex** :

- assez beau pour donner envie d'explorer Gargotte ;
- assez clair pour arbitrer une partie en quelques secondes ;
- assez robuste pour rester utilisable hors ligne ;
- assez cohérent pour passer du desktop à l'iPad puis au téléphone sans changer de langage ;
- assez systémique pour que l'ajout futur de dizaines de donjons et centaines de créatures ne transforme pas l'interface en cave à gobelins.
