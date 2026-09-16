# Gargottex V6 - UI-3 Codex : autres entités

## Statut

**VERROUILLÉ - source de vérité pour les autres entités du Codex**

Ce document complète UI-2 sans recopier UI-1. Il définit les architectures métier de Donjons, Héros, PNJ, Quêtes, Loot, Objets du décor, Brouhaha référentiel et intégration contextuelle des Médias.

Principe directeur :

> **Même Gargottex, mais pas la même fiche.**

---

# 1. Décisions verrouillées

1. Donjon = hub narratif du Codex.
2. Héros regroupés par `hero_base_name`.
3. Un Héros affiche un niveau sélectionné et une progression.
4. Le libellé utilisateur `Objets` devient **Objets du décor**.
5. Brouhaha se sépare en référentiel Codex et outil de session UI-4.
6. Médias n'est pas une famille narrative du Codex mais une bibliothèque transversale.
7. Les accents de donjon ne sont appliqués qu'aux relations fiables.
8. Aucun changement de modèle métier n'est introduit par UI-3.
9. Chaque famille utilise le mode de collection adapté à son usage.
10. Une donnée absente réduit la fiche au lieu de créer une zone vide.

---

# 2. Modes de collection

| Entité | Mode principal | Secondaire | Mode initial |
|---|---|---|---|
| Donjons | Galerie | aucun obligatoire | Galerie |
| Héros | Galerie groupée | aucun obligatoire | Galerie |
| PNJ | Galerie | Liste | Galerie |
| Quêtes | Liste | aucun obligatoire | Liste |
| Loot | Galerie | Liste | Galerie |
| Objets du décor | Liste | aucun obligatoire | Liste |
| Brouhaha | Échelle / référentiel | aucun | Référentiel |
| Médias | Galerie | vue compacte éventuelle | Galerie |

Lorsque plusieurs modes existent, le dernier mode utilisé est mémorisé localement.

---

# 3. Donjons

## 3.1 Collection

La carte Donjon privilégie l'affiche et affiche seulement les informations utiles pour choisir le lieu : nom, boss final et quelques compteurs contextuels.

## 3.2 Fiche Donjon

Ordre cible :

```text
Affiche / identité
Description
Budgets / progression d'étages
Boss final
Créatures
Quêtes
Objets du décor
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

Collection : Galerie par défaut, Liste en alternative.

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

Collection : Liste.

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

---

# 7. Loot

Loot représente un objet récupérable ou une récompense, distinct des Objets du décor.

Collection : Galerie par défaut, Liste en alternative.

Aucune rareté n'est inventée.

Fiche :

```text
Illustration
Nom
Type
Effet
Valeur
Créature source
Donjon source si déductible sans ambiguïté
Tags / médias liés
```

L'accent du donjon n'est utilisé que si la provenance peut être déterminée avec certitude.

---

# 8. Objets du décor

Le store technique reste `interactables`, mais le libellé utilisateur est **Objets du décor**.

Collection : Liste.

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
- Objet du décor : via relation donjon ;
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
Donjon -> Objet du décor
Donjon -> Brouhaha
Créature -> Donjon
Créature -> Loot
Quête -> Donjon
Quête -> PNJ
PNJ -> Quête
Loot -> Créature
Objet du décor -> Donjon
Brouhaha -> Donjon
```

Une relation contextuelle ne doit pas obliger à revenir à la racine du Codex.

Le retour conserve autant que possible filtres, mode, scroll et contexte de la collection précédente.

---

# 13. Recherche globale

La recherche globale distingue clairement les types de résultats.

Même si Médias est transversal, un média peut rester trouvable si l'indexation existante le supporte.

Le libellé utilisateur est **Objet du décor**, sauf dans les formats techniques qui doivent conserver leurs clés existantes.

---

# 14. Responsive

Les breakpoints et règles communes appartiennent à UI-1/UI-6.

Comportements métier :

- Donjon : page hub riche ;
- Héros : fiche de progression ;
- PNJ, Quêtes, Loot, Objets du décor : master-detail seulement lorsque la largeur le permet ;
- tablette portrait : fiche prioritaire et collection en drawer si nécessaire ;
- téléphone : `Collection -> Fiche -> Retour` ;
- Brouhaha référentiel : page filtrable unique ;
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
- rareté de Loot ;
- nouvelles catégories ;
- relation Héros -> Donjon ;
- changement structurel uniquement motivé par la présentation.

---

# 17. Gate UI-3

UI-3 est validée lorsque :

1. chaque famille conserve une grammaire adaptée à son usage ;
2. le Donjon sert de hub naturel ;
3. un Héros est perçu comme une identité évolutive ;
4. le PNJ reste narratif ;
5. la Quête Codex reste distincte du tirage de session ;
6. Loot et Objets du décor sont immédiatement distinguables ;
7. Brouhaha référentiel et Brouhaha de session sont séparés ;
8. Médias reste transversal ;
9. les relations contextuelles reposent sur les données existantes ;
10. les modes par défaut et leur persistance sont définis ;
11. `Voir tout` depuis un Donjon ouvre une collection préfiltrée avec retour cohérent ;
12. aucun détail du design system ou du stockage média n'est dupliqué ici.

**UI-3 devient la source de vérité des autres entités du Codex.**
