# Gargottex V6 - UI-3 Codex : autres entités

## Statut

**VERROUILLÉ - source de vérité pour les autres entités du Codex**

Ce document complète UI-2 sans recopier UI-1. Il définit les architectures métier de Donjons, Héros, PNJ, Quêtes, Loot, Objets interactifs, Brouhaha référentiel et intégration contextuelle des Médias.

Principe directeur :

> **Même Gargottex, mais pas la même fiche.**

---

# 1. Décisions verrouillées

1. Toutes les familles UI-3 sont des **collections de plusieurs éléments** ; aucune n'est conçue comme une fiche singleton.
2. Le parcours commun est `Collection (Galerie/Liste) -> Fiche -> Retour collection`, avec restauration du contexte.
3. Donjon = hub narratif du Codex, mais chaque Donjon appartient d'abord à une collection.
4. Héros regroupés par `hero_base_name`.
5. Un Héros affiche un niveau sélectionné et une progression.
6. Le libellé utilisateur `Objets` devient **Objets interactifs**.
7. Brouhaha se sépare en référentiel Codex et outil de session UI-4.
8. Médias n'est pas une famille narrative du Codex mais une bibliothèque transversale.
9. Les accents de donjon ne sont appliqués qu'aux relations fiables.
10. Aucun changement de modèle métier n'est introduit par UI-3.
11. Chaque famille utilise le mode de collection adapté à son usage.
12. Une donnée absente réduit la fiche au lieu de créer une zone vide.

---

# 2. Modes de collection

| Entité | Mode principal | Secondaire | Mode initial |
|---|---|---|---|
| Donjons | Galerie | Liste | Galerie |
| Héros | Galerie groupée | Liste | Galerie |
| PNJ | Galerie | Liste | Galerie |
| Quêtes | Liste | Cartes | Liste |
| Loot | Galerie | Liste | Galerie |
| Objets interactifs | Liste | Galerie | Liste |
| Brouhaha | Cartes par niveau | Liste | Cartes |
| Médias | Galerie | vue compacte éventuelle | Galerie |

Lorsque plusieurs modes existent, le dernier mode utilisé est mémorisé localement.

Une carte ou une ligne ouvre toujours une **fiche dédiée**. Sur tablette et téléphone, collection et fiche ne sont pas affichées côte à côte.

## 2.2 Champs existants à respecter

La maquette et l'UI de production s'appuient sur les champs déjà présents dans les templates de l'application :

- Donjon : `name`, `description`, `floor_budgets`, `boss_name`, `tags`, `image_path` ;
- Héros : `hero_base_name`, `level`, `name`, `role`, `title`, `pv`, `atk`, `def`, `zone`, `actions`, `ability_text`, `effect_text`, `brouhaha`, `tags`, `image_path` ;
- PNJ : `name`, `race`, `tone`, `role`, `lore`, `tags`, `image_path` ;
- Quête : `name`, `description`, `objective`, `reward`, `difficulty`, `npc_name`, `dungeon_name`, `tags`, `image_path` ;
- Loot : `creature_name`, `name`, `type`, `effect`, `gold_value`, `tags`, `image_path` ;
- Objet interactif : `name`, `dungeon_name`, `type`, `hp`, `actions_allowed`, `effect`, `image_path`, `tags` ;
- Brouhaha : `level`, `dungeon_name`, `effect_text`.

La présentation ne doit pas inventer de champs métier supplémentaires. Une illustration est prévue pour chaque type d'élément : `image_path` lorsqu'il existe, ou média lié pour Brouhaha afin de ne pas imposer un changement de schéma uniquement pour l'UI.

---

## 2.1 Iconographie des familles

La maquette réutilise d'abord les emblèmes déjà validés lorsqu'ils portent **exactement** le même sens.

Réutilisation validée :

- Donjon : `Icone_Gameplay_DONJON.webp` ;
- Loot : `Icone_Gameplay_BUTIN.webp` ;
- sections Lore / narration : `Icone_Gameplay_LORE.webp` ;
- statistiques Héros et autres blocs compatibles : `PV`, `ATK`, `DEF`, `ACTION` ;
- catégories Créature : sigils `Basique`, `Tactique`, `Spéciale`, `Brute`, `MiniBoss`, `Boss`.

Emblèmes dédiés à créer :

- `Icone_Gameplay_COMPETENCE.webp` ;
- `Icone_Entite_HEROS.webp` ;
- `Icone_Entite_PNJ.webp` ;
- `Icone_Entite_QUETE.webp` ;
- `Icone_Entite_OBJET_INTERACTIF.webp` ;
- `Icone_Entite_BROUHAHA.webp`.

Règle : ne pas détourner un pictogramme existant si sa sémantique diffère. Par exemple `MENACE` ne sert pas à représenter automatiquement la difficulté d'une Quête.

Rareté de Loot et difficulté de Quête utilisent **texte + couleur** et ne nécessitent pas de nouvel emblème dédié.

# 3. Donjons

## 3.1 Collection

La collection Donjon peut basculer Galerie/Liste. La carte privilégie l'affiche et affiche seulement les informations utiles pour choisir le lieu : nom, boss final et quelques compteurs contextuels.

Le Drive de référence contient actuellement **15 dossiers de Donjon** ; la maquette doit donc rester confortable à cette échelle et au-delà.

## 3.2 Fiche Donjon

Ordre cible :

```text
Affiche / identité
Description
Budgets / progression d'étages
Boss final
Créatures
Quêtes
Objets interactifs
Brouhaha du donjon
Médias liés
Métadonnées secondaires
```

Le Donjon est un hub, pas une page qui recopie intégralement toutes les collections liées.

Les grandes sections associées affichent un aperçu puis `Voir tout`.

`Voir tout` ouvre la collection correspondante **préfiltrée sur le donjon courant** et conserve un retour vers le hub précédent.

## 3.3 Boss final

Le modèle actuel utilise `boss_name`.

Si une créature correspond sans ambiguïté, le boss devient cliquable. Sinon le nom reste textuel.

UI-3 n'ajoute pas `boss_creature_id`.

---

# 4. Héros

## 4.1 Collection

Une seule carte par `hero_base_name`.

La collection Héros est une vraie galerie/liste, pas une fiche unique. Les images de niveaux restent associées au même héros et la fiche choisit l'image du niveau actif lorsqu'elle existe.

La carte montre :

- portrait ;
- nom de base ;
- rôle ;
- niveaux disponibles.

## 4.2 Niveau initial

À l'ouverture :

1. restaurer le dernier niveau consulté pour ce héros s'il existe encore ;
2. sinon sélectionner le niveau disponible le plus bas.

## 4.3 Fiche Héros

Ordre :

```text
Portrait / identité
Nom
Rôle / titre
Sélecteur de niveau
Stats
Compétence
Effet
Brouhaha associé
Frise de progression
Médias / tags utiles
```

Changer de niveau met à jour les données du niveau sélectionné sans faire sauter inutilement le scroll.

La progression montre les autres niveaux de façon compacte, sans afficher plusieurs fiches complètes.

---

# 5. PNJ

Le PNJ est une fiche narrative, jamais une Créature sans stats.

Collection : Galerie par défaut, Liste en alternative. Une carte ouvre la fiche PNJ et le retour restitue la collection.

Fiche :

```text
Portrait / identité
Nom
Race
Rôle
Ton
Lore
Quêtes associées
Médias liés
Tags
```

Les quêtes liées sont calculées depuis les relations existantes.

Le PNJ reste sur palette neutre tant qu'aucune appartenance de donjon directe et fiable n'existe.

---

# 6. Quêtes du Codex

La Quête UI-3 est une **fiche de référence**. Le tirage de session appartient à UI-4.

Collection : Liste par défaut, cartes en alternative. Chaque quête reste un élément autonome ouvrant sa fiche de référence.

Filtres utiles : donjon, difficulté, PNJ, tags, selon les données réellement disponibles.

Fiche :

```text
Nom
Difficulté
Donjon
PNJ donneur éventuel
Description
Objectif
Récompense
Illustration éventuelle
Tags
Relations contextuelles
```

L'Objectif doit être le bloc le plus repérable pendant une consultation rapide.

## 6.1 Difficulté des Quêtes

Six niveaux sont verrouillés et reprennent exactement la palette des catégories Créature :

| Difficulté | Couleur source |
|---|---|
| Très facile | Basique |
| Facile | Tactique |
| Normale | Spéciale |
| Difficile | Brute |
| Très difficile | Mini-boss |
| Extrême | Boss |

Le libellé reste toujours visible en plus de la couleur.

---

# 7. Loot

Loot représente un objet récupérable ou une récompense, distinct des Objets interactifs.

Collection : Galerie par défaut, Liste en alternative.

## 7.1 Rareté du Loot

Six niveaux de rareté sont verrouillés et reprennent exactement la palette des catégories Créature :

| Rareté | Couleur source |
|---|---|
| Mauvais | Basique |
| Commun | Tactique |
| Inhabituel | Spéciale |
| Rare | Brute |
| Épique | Mini-boss |
| Légendaire | Boss |

Le libellé reste toujours visible en plus de la couleur. La clé technique du futur champ de rareté sera fixée lors de l'évolution du modèle métier ; UI-3 verrouille ici la sémantique et la présentation.

Fiche :

```text
Illustration
Nom
Rareté
Type
Effet
Valeur
Créature source
Donjon source si déductible sans ambiguïté
Tags / médias liés
```

L'accent du donjon n'est utilisé que si la provenance peut être déterminée avec certitude.

---

# 8. Objets interactifs

Le store technique reste `interactables`, mais le libellé utilisateur est **Objets interactifs**.

Collection : Liste par défaut, Galerie en alternative. Chaque Objet interactif ouvre une fiche dédiée.

Fiche :

```text
Nom
Donjon
Type
Illustration éventuelle
PV
Actions autorisées
Effet
Tags
Médias liés
```

Le champ `actions_allowed` peut être rendu plus lisible si ses séparateurs sont connus de manière fiable, sans inventer une nouvelle structure métier.

---

# 9. Brouhaha référentiel

UI-3 présente le référentiel des effets, pas l'outil manipulé pendant la partie.

Le référentiel est lui-même une collection de plusieurs effets Brouhaha. Il propose des cartes par niveau ou une liste ; un effet sélectionné ouvre une fiche dédiée.

Structure :

```text
Filtre : Universel | Donjon

Niveau
Effet
Contexte
```

Le niveau est immédiatement visible. L'intensité visuelle ne doit jamais être le seul moyen de comprendre la gravité.

UI-4 définit le niveau courant, le tirage et l'historique de session.

---

# 10. Médias dans le Codex

Médias reste accessible depuis sa vue dédiée et apparaît comme section secondaire dans les fiches liées.

Une fiche peut montrer une galerie courte de médias associés, mais elle ne devient pas un gestionnaire de médias.

Les états local/distant, téléchargement, sauvegarde et suppression sont définis uniquement dans UI-5.

Un média distant mais non local ne doit pas être assimilé à un média inexistant.

---

# 11. Accents de donjon

Règle fonctionnelle :

- Donjon : oui ;
- Créature : via relation donjon ;
- Quête : via relation donjon ;
- Objet interactif : via relation donjon ;
- Brouhaha : si rattaché au donjon ;
- Loot : uniquement via provenance fiable ;
- Héros : neutre ;
- PNJ : neutre par défaut ;
- Médias : héritent seulement du contexte de la fiche qui les affiche.

Les valeurs visuelles et limites d'intensité restent dans UI-1.

---

# 12. Navigation contextuelle

Parcours naturels à préserver :

```text
Donjon -> Créature
Donjon -> Quête
Donjon -> Objet interactif
Donjon -> Brouhaha
Créature -> Donjon
Créature -> Loot
Quête -> Donjon
Quête -> PNJ
PNJ -> Quête
Loot -> Créature
Objet interactif -> Donjon
Brouhaha -> Donjon
```

Une relation contextuelle ne doit pas obliger à revenir à la racine du Codex.

Le retour conserve autant que possible filtres, mode, scroll et contexte de la collection précédente.

---

# 13. Recherche globale

La recherche globale distingue clairement les types de résultats.

Même si Médias est transversal, un média peut rester trouvable si l'indexation existante le supporte.

Le libellé utilisateur est **Objet interactif**, sauf dans les formats techniques qui doivent conserver leurs clés existantes.

---

# 14. Responsive

Les breakpoints et règles communes appartiennent à UI-1/UI-6.

Comportements métier :

- desktop : master-detail autorisé lorsque la largeur laisse respirer la fiche ;
- Donjon : collection -> hub riche ;
- Héros : collection -> fiche de progression ;
- PNJ, Quêtes, Loot, Objets interactifs et Brouhaha : collection -> fiche dédiée ;
- tablette, portrait comme paysage : `Collection -> Fiche -> Retour`, sans colonnes collection + fiche comprimées ;
- téléphone : `Collection -> Fiche -> Retour` ;
- Médias : galerie dédiée.

---

# 15. États incomplets

Gérer :

- image absente ;
- média distant non local ;
- relation absente ou cassée ;
- texte narratif absent ;
- résultat vide ;
- données locales présentes avec cloud indisponible.

Règle :

> **Une donnée absente réduit la fiche, elle ne crée pas un panneau fantôme.**

---

# 16. Non-changements métier

UI-3 n'introduit pas implicitement :

- `boss_creature_id` ;
- `npc_dungeon_id` ;
- nouvelles catégories ;
- relation Héros -> Donjon ;
- changement structurel uniquement motivé par la présentation.

---

# 17. Gate UI-3

UI-3 est validée lorsque :

1. chaque famille possède une vraie collection et une fiche adaptée à son usage ;
2. le Donjon sert de hub naturel ;
3. un Héros est perçu comme une identité évolutive ;
4. le PNJ reste narratif ;
5. la Quête Codex reste distincte du tirage de session ;
6. Loot et Objets interactifs sont immédiatement distinguables ;
7. Brouhaha référentiel et Brouhaha de session sont séparés ;
8. Médias reste transversal ;
9. les relations contextuelles reposent sur les données existantes ;
10. les modes par défaut et leur persistance sont définis ;
11. `Voir tout` depuis un Donjon ouvre une collection préfiltrée avec retour cohérent ;
12. aucun détail du design system ou du stockage média n'est dupliqué ici.

**UI-3 devient la source de vérité des autres entités du Codex.**
