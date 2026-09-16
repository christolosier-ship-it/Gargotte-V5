# Gargottex V6 — UI-4 Accueil & outils de partie

## Statut

**VERROUILLÉ — architecture fonctionnelle et responsive de l’Accueil, du Générateur, du Brouhaha de session et des Quêtes de session**

Ce document complète :

- `docs/REFONTE-UI-UX-V6.md` ;
- `docs/UI-1-DESIGN-SYSTEM-V6.md` ;
- `docs/UI-2-BESTIAIRE-FICHE-CREATURE-V6.md` ;
- `docs/UI-3-CODEX-AUTRES-ENTITES-V6.md`.

UI-4 couvre les vues orientées **usage en cours de partie** :

- Accueil ;
- Générateur ;
- Brouhaha de session ;
- Quêtes de session.

Le principe directeur est :

> **Pendant une partie, Gargottex doit réduire le nombre de décisions, de sélections répétées et de gestes inutiles.**

UI-4 ne transforme pas Gargottex en moteur de campagne, VTT, tracker d’initiative ou gestionnaire de combat complet.

UI-4 ne modifie pas le modèle métier existant. Le contexte de partie défini ci-dessous est un **état UI temporaire local**, persistable avec l’état de l’application, mais distinct des données métier du Codex.

---

# 1. Objectifs UI-4

UI-4 doit permettre de :

- lancer rapidement une partie depuis l’Accueil ;
- sélectionner un donjon une seule fois et partager ce contexte entre les outils de session ;
- générer une rencontre sans ressaisir le même contexte ;
- suivre le Brouhaha du donjon actif ;
- tirer une quête cohérente avec ce même donjon ;
- reprendre immédiatement une session interrompue ;
- éviter les changements de contexte silencieux ;
- préserver les fonctions existantes du Générateur, du Brouhaha et du tirage de Quêtes ;
- rendre les trois outils efficaces sur desktop, tablette et téléphone ;
- conserver un fonctionnement local-first et offline.

---

# 2. Décisions verrouillées

Les décisions suivantes sont actées :

1. Un **contexte de partie partagé** relie Accueil, Générateur, Brouhaha et Quêtes de session.
2. Le **donjon actif** est commun à ces quatre vues.
3. Changer de donjon depuis l’un de ces outils change le donjon actif pour l’ensemble de la session.
4. Si une rencontre, un historique de Brouhaha ou une quête tirée existe déjà, changer de donjon nécessite une confirmation explicite avant remise à zéro des états temporaires incompatibles.
5. L’**étage actif** fait partie du contexte partagé, même s’il est principalement utilisé par le Générateur.
6. Le type de rencontre devient un choix exclusif : `Normal | Mini-boss | Boss`.
7. Après génération, le **résultat de rencontre devient prioritaire** et les paramètres sont compactés en résumé modifiable.
8. L’action existante `Éliminer` conserve le comportement : élimination locale de la créature puis tirage automatique de son loot.
9. UI-4 n’ajoute **aucun combat tracker complet** : pas de tracker de PV, initiative, tours, conditions ou timeline de combat.
10. Le niveau de Brouhaha et l’action `Tirer un effet` restent deux actions distinctes.
11. Le Brouhaha dispose d’une action `Réinitialiser` avec confirmation.
12. La vue Quêtes de session ne contient plus la bibliothèque complète des quêtes ; cette fonction appartient au Codex défini en UI-3.
13. La galerie média générique est retirée de l’Accueil cible.
14. L’Accueil possède un état **Partie en cours** lorsque le contexte de session contient des éléments actifs.
15. Une action globale `Terminer / Réinitialiser la partie` nettoie uniquement l’état UI temporaire de session, jamais les données métier du Codex.

---

# 3. Contexte de partie partagé

## 3.1 Définition

Le contexte de partie est un état UI local qui regroupe au minimum :

```text
session
├── dungeonId
├── floorIndex
├── encounterMode
├── encounterResult
├── brouhahaLevel
├── brouhahaHistory
├── brouhahaDrawn
└── drawnQuestId / drawnQuestSnapshot si nécessaire
```

Les noms techniques exacts peuvent différer lors de l’implémentation. Le comportement fonctionnel doit rester celui-ci.

## 3.2 Ce que le contexte n’est pas

Le contexte de partie n’est pas :

- une nouvelle table métier ;
- une campagne sauvegardée ;
- un historique longue durée ;
- un système multi-session ;
- un journal de combat ;
- une source de vérité cloud obligatoire.

Il s’agit d’un état de travail courant, local et léger.

## 3.3 Persistance

Le contexte peut être persisté dans l’état UI local afin de permettre :

- fermeture puis réouverture de la PWA ;
- navigation entre vues sans perte de session ;
- fonctionnement hors ligne.

La persistance doit rester compatible avec la philosophie local-first de Gargottex.

## 3.4 Donjon actif

Le donjon actif est la référence commune pour :

- Générateur ;
- Brouhaha ;
- Quêtes de session ;
- carte `Partie en cours` de l’Accueil.

Une fois sélectionné, il ne doit pas être demandé à nouveau dans chaque outil.

## 3.5 Changement de donjon

Si aucun état de session significatif n’existe, le changement est immédiat.

Si la session contient au moins un des éléments suivants :

- rencontre générée ;
- Brouhaha non nul ;
- historique Brouhaha ;
- quête tirée ;

alors afficher une confirmation claire :

```text
Changer de donjon ?

La rencontre en cours, le Brouhaha et la quête tirée seront réinitialisés.
Les données du Codex ne seront pas modifiées.

[ Annuler ] [ Changer de donjon ]
```

Aucun changement de donjon ne doit silencieusement conserver des données de session appartenant à l’ancien donjon.

---

# 4. Étage actif

L’étage actif est partagé dans le contexte mais sa principale utilisation reste le Générateur.

Règles :

- changer d’étage ne réinitialise pas le donjon ;
- si une rencontre générée existe pour un autre étage, la modification demande confirmation ou invalide explicitement le résultat selon l’interaction retenue ;
- Brouhaha et Quêtes ne dépendent pas de l’étage sauf future évolution métier explicite.

L’Accueil peut afficher l’étage courant lorsqu’il est défini.

---

# 5. Accueil — rôle cible

## 5.1 Intention

L’Accueil devient le **comptoir de départ et de reprise de Gargottex**.

Il ne doit pas devenir un dashboard analytique.

Deux états principaux :

1. aucune partie active ;
2. partie en cours.

---

# 6. Accueil sans partie active

Hiérarchie cible :

```text
Identité Gargottex
↓
Action principale : choisir / reprendre un donjon
↓
Accès rapides
↓
Compteurs éditoriaux discrets
```

## 6.1 Identité

Conserver :

- logo ;
- identité Gargottex ;
- courte accroche narrative ;
- ambiance de taverne éditoriale.

Éviter une grande zone décorative sans fonction sur les petits écrans.

## 6.2 Action principale

Bloc central :

```text
PRÉPARER UNE PARTIE

Choisir un donjon
[ Sélectionner ]
```

Le dernier donjon utilisé peut être proposé en raccourci s’il existe.

## 6.3 Accès rapides

Actions recommandées :

- Ouvrir le Codex ;
- Générateur ;
- Brouhaha ;
- Quêtes ;
- Atelier.

## 6.4 Compteurs

Compteurs autorisés :

- Donjons ;
- Créatures ;
- Héros ;
- Quêtes ;
- Médias si utile.

Les compteurs restent secondaires et ne doivent pas prendre l’apparence d’un dashboard SaaS.

## 6.5 Galerie média

La galerie média générique de l’Accueil est supprimée de la cible.

Les médias restent accessibles depuis leur vue dédiée et contextuellement dans les fiches.

---

# 7. Accueil — Partie en cours

Lorsqu’un contexte de session actif existe, l’Accueil devient une table de reprise rapide.

Structure cible :

```text
PARTIE EN COURS
Donjon actif
Étage actif éventuel

RENCONTRE
résumé
[ Reprendre ]

BROUHAHA
niveau actuel + dernier effet
[ Ouvrir ]

QUÊTE
quête tirée éventuelle
[ Ouvrir ]

[ Terminer la partie ]
```

## 7.1 Carte Donjon actif

Afficher :

- nom ;
- affiche / visuel compact si disponible ;
- étage ;
- budget courant si pertinent ;
- accent narratif du donjon.

## 7.2 Carte Rencontre

Si une rencontre existe :

- nombre de créatures encore présentes si calculable sans ambiguïté ;
- menace utilisée / budget ;
- mode Normal / Mini-boss / Boss ;
- action `Reprendre`.

Sinon :

- état court `Aucune rencontre générée` ;
- action `Générer`.

## 7.3 Carte Brouhaha

Afficher :

- niveau actuel sur 12 ;
- dernier effet tiré si disponible ;
- action `Ouvrir`.

## 7.4 Carte Quête

Afficher :

- nom de la quête tirée ;
- difficulté ;
- action `Ouvrir`.

Sans quête : action `Tirer une quête`.

---

# 8. Terminer / Réinitialiser la partie

Cette action nettoie uniquement :

- donjon actif de session si l’utilisateur confirme une fin complète ;
- étage actif ;
- rencontre générée ;
- états locaux de la rencontre ;
- niveau et historique Brouhaha ;
- effets tirés ;
- quête tirée.

Elle ne doit jamais supprimer :

- donjon ;
- créature ;
- quête ;
- loot ;
- média ;
- donnée éditée du Codex ;
- synchronisation distante.

Confirmation obligatoire :

```text
Terminer la partie ?

Le contexte de session sera réinitialisé.
Les données du Codex seront conservées.

[ Annuler ] [ Terminer ]
```

---

# 9. Générateur — principe général

Le Générateur reste basé sur la logique métier existante.

Hiérarchie :

```text
Donjon actif
↓
Étage
↓
Mode de rencontre
↓
Budget
↓
Générer
↓
Résultat
```

Le design doit distinguer deux états :

1. configuration ;
2. rencontre générée.

---

# 10. Générateur — état configuration

## 10.1 Donjon

Le donjon provient du contexte partagé.

Il reste modifiable depuis le Générateur mais suit les règles de confirmation du changement de donjon.

## 10.2 Étage

Afficher chaque option sous une forme immédiatement lisible :

```text
Étage 1 · Budget 3
Étage 2 · Budget 5
Étage 3 · Budget 7
```

## 10.3 Mode de rencontre

Remplacer les deux toggles Boss / Mini-boss par un contrôle exclusif :

```text
Normal | Mini-boss | Boss
```

Une seule valeur active.

## 10.4 Budget

Le budget reste issu de `floor_budgets` du donjon.

Le budget est affiché clairement mais n’est pas éditable dans UI-4 si le modèle métier actuel ne le prévoit pas.

## 10.5 Action principale

Bouton primaire dominant :

```text
GÉNÉRER LA RENCONTRE
```

Grande cible tactile.

---

# 11. Générateur — résultat de rencontre

Après génération, le résultat devient la partie principale de l’écran.

La configuration est réduite à un résumé compact :

```text
Enfer de la Sobriété
Étage 3 · Budget 7/7 · Mode Normal

[ Modifier ] [ Relancer ]
```

## 11.1 Composition

Présenter deux groupes :

```text
CRÉATURES

OBJETS DU DÉCOR
```

Chaque créature affiche au minimum :

- quantité ;
- nom ;
- menace unitaire ;
- illustration compacte si disponible ;
- état éliminé ;
- action d’ouverture rapide.

Chaque objet du décor affiche :

- nom ;
- type ;
- visuel compact si disponible ;
- action d’ouverture rapide.

## 11.2 Budget

Afficher :

```text
Budget utilisé / Budget disponible
```

Le résultat ne doit pas ressembler à un tableau comptable.

---

# 12. Mini-fiche de rencontre

Taper une créature ou un objet ouvre un panneau contextuel rapide sans quitter la session.

## 12.1 Créature

Afficher au minimum :

- image ;
- nom ;
- PV ;
- ATK ;
- DEF ;
- capacité / comportement utile ;
- action `Ouvrir la fiche complète` ;
- action `Éliminer`.

## 12.2 Éliminer

Le libellé cible est :

```text
Éliminer
```

et non `Kill`.

Comportement verrouillé :

```text
Éliminer
↓
marquer localement la créature comme éliminée
↓
tirer automatiquement son loot
↓
afficher le résultat du loot
```

Ce comportement reste local au résultat de rencontre.

## 12.3 Objet du décor

Afficher :

- nom ;
- type ;
- PV ;
- actions autorisées ;
- effet ;
- action de tirage d’effet si la logique existante le prévoit ;
- action `Ouvrir la fiche complète`.

---

# 13. Ce que le Générateur ne devient pas

UI-4 interdit l’ajout implicite de :

- tracker de PV individuel ;
- initiative ;
- ordre de tour ;
- statut / condition ;
- compteur de rounds ;
- journal complet de combat ;
- dés virtuels généralistes ;
- carte tactique.

Ces fonctions nécessiteraient un chantier distinct.

---

# 14. Brouhaha de session — intention

Le Brouhaha de session est l’outil de manipulation du niveau courant pendant la partie.

Il est distinct du **Codex Brouhaha** défini en UI-3.

Principe :

> **Changer le niveau n’est pas tirer un effet.**

---

# 15. Brouhaha — structure cible

Hiérarchie :

```text
Donjon actif
↓
Jauge / cadran 0–12
↓
−1 / +1
↓
Tirer un effet
↓
Effet courant
↓
Historique
↓
Réinitialiser
```

## 15.1 Cadran

Le niveau courant est le centre visuel.

Exemple :

```text
BROUHAHA

6 / 12

[ −1 ]    [ +1 ]
```

Les boutons doivent être grands et séparés pour éviter les erreurs tactiles.

## 15.2 Tirer un effet

Action indépendante :

```text
TIRER UN EFFET
```

Modifier le niveau ne déclenche jamais automatiquement un tirage.

## 15.3 Effet courant

Après tirage, afficher immédiatement le ou les effets correspondant aux règles existantes.

Les règles actuelles particulières des niveaux élevés restent inchangées.

## 15.4 Historique

Afficher un historique court et lisible :

```text
Niv 7 · effet...
Niv 6 · effet...
Niv 4 · effet...
```

L’historique appartient à la session et non au Codex.

---

# 16. Intensité visuelle du Brouhaha

Quatre paliers visuels indicatifs :

```text
0–3   calme
4–6   échauffement
7–9   tension
10–12 critique
```

L’intensité peut agir sur :

- halo ;
- bordure ;
- accent du cadran ;
- micro-animation courte.

Elle ne doit pas :

- changer brutalement toute la palette ;
- produire des animations agressives ;
- réduire la lisibilité ;
- ignorer `prefers-reduced-motion`.

---

# 17. Réinitialiser Brouhaha

Action secondaire clairement séparée des contrôles +/−.

Confirmation :

```text
Réinitialiser le Brouhaha ?

Le niveau repassera à 0 et l’historique de cette session sera effacé.

[ Annuler ] [ Réinitialiser ]
```

Cette action ne modifie jamais le référentiel `brouhaha_effects` du Codex.

---

# 18. Quêtes de session — intention

La vue Quêtes de session sert à **tirer et utiliser une quête pendant la partie**.

La bibliothèque complète des quêtes appartient au Codex UI-3.

UI-4 doit éviter la duplication de ces deux usages.

---

# 19. Quêtes de session — avant tirage

Structure :

```text
QUÊTE DU DONJON

Donjon actif

[ TIRER UNE QUÊTE ]
```

Le donjon provient du contexte partagé.

Aucune longue liste de quêtes n’est affichée ici.

---

# 20. Quêtes de session — après tirage

Présenter une fiche courte orientée jeu :

```text
Nom
Difficulté
PNJ donneur éventuel

Description

OBJECTIF
...

RÉCOMPENSE
...
```

Actions :

```text
[ Tirer à nouveau ]
[ Ouvrir dans le Codex ]
```

## 20.1 Tirer à nouveau

Le remplacement de la quête courante peut être immédiat ou demander une confirmation légère si cela évite une perte involontaire de contexte.

La nouvelle quête doit rester limitée au donjon actif selon la logique métier existante.

## 20.2 Ouvrir dans le Codex

Cette action ouvre la fiche Quête définie en UI-3.

Le retour à la session doit rester compréhensible et préserver le contexte de partie.

---

# 21. Navigation entre outils de partie

Lorsque le contexte de partie existe, les outils doivent offrir une navigation rapide entre :

```text
Accueil session
Générateur
Brouhaha
Quêtes
```

La navigation globale définie en UI-1 reste la référence.

Sur téléphone, `Jeu` peut servir de hub pour :

- Générateur ;
- Brouhaha.

Quêtes conserve son entrée principale définie dans la navigation mobile cible.

---

# 22. Responsive — principes UI-4

Contrairement au Codex, les outils de partie privilégient :

- grandes cibles tactiles ;
- actions primaires évidentes ;
- faible profondeur de navigation ;
- informations courantes visibles sans fouiller ;
- usage confortable autour d’une table.

---

# 23. Desktop

## Accueil

Peut afficher les cartes de session en grille 2–3 colonnes.

## Générateur

Configuration compacte puis grande zone résultat.

Une disposition en deux colonnes est autorisée uniquement si elle améliore la lecture.

## Brouhaha

Cadran + effet courant sur la partie haute, historique sur la partie basse ou latérale.

## Quêtes

Fiche tirée centrée dans une largeur de lecture confortable.

---

# 24. Tablette paysage

Cible prioritaire pour les outils de partie.

Principes :

- contrôles tactiles grands ;
- résultat du Générateur lisible sans zoom ;
- Brouhaha manipulable rapidement ;
- actions principales accessibles sans atteindre des coins minuscules ;
- pas de dépendance au hover.

---

# 25. Tablette portrait

Flux vertical avec regroupements clairs.

Le contexte actif reste visible en haut sous forme compacte.

Les panneaux secondaires peuvent devenir repliables si nécessaire.

---

# 26. Téléphone

Structure commune :

```text
Contexte
↓
Action principale
↓
Résultat
↓
Actions secondaires
```

Règles :

- aucune action critique en dessous de 44 px ;
- pas de colonnes comprimées ;
- mini-fiches en drawer / sheet ou vue dédiée courte ;
- résumé du contexte toujours compréhensible ;
- confirmation des actions destructrices de session.

---

# 27. États UI à prévoir

## Accueil

- aucune partie ;
- contexte partiel ;
- partie en cours ;
- donjon absent ;
- données locales disponibles / cloud indisponible.

## Générateur

- aucun donjon ;
- étage sans budget ;
- aucune créature compatible ;
- aucun boss compatible ;
- aucun mini-boss compatible ;
- résultat normal ;
- résultat partiellement consommé ;
- rencontre terminée localement.

## Brouhaha

- aucun donjon ;
- niveau 0 ;
- historique vide ;
- effet disponible ;
- absence d’effet pour un niveau / donjon ;
- niveau critique.

## Quêtes

- aucun donjon ;
- aucune quête disponible ;
- quête tirée ;
- PNJ absent ;
- image absente.

---

# 28. Accessibilité

Exigences spécifiques UI-4 :

- tous les contrôles de session utilisables au clavier ;
- grandes cibles tactiles ;
- changement de contexte jamais indiqué uniquement par couleur ;
- modales de confirmation avec focus géré ;
- libellés explicites `Éliminer`, `Réinitialiser`, `Terminer` ;
- contraste suffisant du cadran Brouhaha ;
- intensité Brouhaha compatible daltonisme ;
- `prefers-reduced-motion` respecté ;
- navigation utilisable sans hover.

---

# 29. Performance et offline

UI-4 doit fonctionner sans réseau à partir des données locales disponibles.

Règles :

- génération de rencontre locale ;
- tirage Brouhaha local ;
- tirage Quête local ;
- contexte de partie local ;
- aucune action de session ne doit attendre une réponse cloud pour mettre l’interface à jour ;
- synchronisation distante éventuelle reste secondaire ;
- images chargées à la taille utile ;
- aucun rechargement complet requis entre deux outils de session.

---

# 30. Composants UI-4

Composants à prévoir ou stabiliser :

```text
SessionContextBar
ActiveDungeonCard
SessionHomeSummary
SessionResetDialog
EncounterConfig
FloorSelector
EncounterModeSelector
EncounterBudgetSummary
GenerateEncounterButton
EncounterResult
EncounterCreatureRow
EncounterObjectRow
EncounterQuickPanel
EncounterLootResult
BrouhahaDial
BrouhahaStepButton
BrouhahaDrawButton
BrouhahaCurrentEffect
BrouhahaHistory
BrouhahaResetDialog
SessionQuestCard
DrawQuestButton
OpenQuestInCodexAction
ConfirmContextChangeDialog
```

Les noms sont indicatifs.

L’architecture actuelle reste JavaScript ES Modules ; ne pas introduire un framework uniquement pour matérialiser ces composants.

---

# 31. Règles de cohérence avec UI-1 à UI-3

UI-4 réutilise :

- palette ;
- Alegreya + Inter ;
- icônes Lucide / Tabler ;
- accents de donjon ;
- boutons ;
- rayons ;
- bordures ;
- états interactifs ;
- règles tactiles ;
- shell responsive ;
- navigation globale ;
- fiches contextuelles du Codex.

Une mini-fiche de rencontre n’invente pas une seconde grammaire graphique pour les créatures ou objets du décor.

---

# 32. Ce qui n’est pas dans UI-4

Sont hors périmètre :

- édition métier ;
- gestion des Médias ;
- Import / Export ;
- journal / diagnostics ;
- tracker de combat avancé ;
- sauvegardes de campagnes multiples ;
- création de personnages ;
- inventaire joueur ;
- carte tactique ;
- IA de meneur de jeu ;
- modification du modèle de données métier.

Ces besoins nécessitent un chantier séparé.

---

# 33. Critères d’acceptation UI-4

UI-4 est validée conceptuellement lorsque :

- [x] contexte de partie partagé défini ;
- [x] donjon actif partagé défini ;
- [x] changement de donjon sécurisé ;
- [x] étage actif défini ;
- [x] Accueil sans session défini ;
- [x] Accueil avec session défini ;
- [x] terminaison de session définie ;
- [x] configuration Générateur définie ;
- [x] mode Normal / Mini-boss / Boss exclusif défini ;
- [x] résultat Générateur défini ;
- [x] mini-fiche de rencontre définie ;
- [x] action Éliminer + loot définie ;
- [x] limites du Générateur définies ;
- [x] Brouhaha de session défini ;
- [x] +/− séparé du tirage défini ;
- [x] intensité Brouhaha définie ;
- [x] reset Brouhaha défini ;
- [x] Quête avant tirage définie ;
- [x] Quête après tirage définie ;
- [x] bibliothèque Quêtes retirée de la vue session ;
- [x] responsive desktop défini ;
- [x] responsive tablette défini ;
- [x] responsive téléphone défini ;
- [x] états vides / erreurs définis ;
- [x] accessibilité définie ;
- [x] comportement offline défini.

---

# 34. Gate UI-4

La Gate UI-4 est considérée comme verrouillée si :

1. le donjon actif n’a besoin d’être sélectionné qu’une seule fois pour une session normale ;
2. passer du Générateur au Brouhaha puis aux Quêtes conserve ce contexte ;
3. changer de donjon avec une session active ne peut pas effacer silencieusement l’état temporaire ;
4. une rencontre peut être générée en quelques actions évidentes ;
5. le résultat de rencontre est plus important visuellement que les paramètres après génération ;
6. l’action `Éliminer` conserve le tirage de loot existant ;
7. le Générateur ne dérive pas vers un tracker de combat complet ;
8. le Brouhaha peut être modifié sans tirer involontairement un effet ;
9. la vue Quêtes sert à jouer et non à remplacer le Codex Quêtes ;
10. l’Accueil permet de reprendre immédiatement une partie ;
11. terminer une partie ne touche jamais aux données métier ;
12. les trois outils restent utilisables offline ;
13. tablette et téléphone disposent de contrôles réellement tactiles ;
14. les quatre vues restent cohérentes avec UI-1, UI-2 et UI-3.

**UI-4 devient la source de vérité pour l’Accueil et les outils de partie de Gargottex.**

La prochaine étape est **UI-5 : Atelier, Médias, Import / Export, Journal / diagnostics et états de synchronisation**, avec priorité à la sécurité des manipulations, à la clarté des formulaires et à la distinction entre état local et état distant.