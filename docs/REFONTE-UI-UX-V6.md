# Gargottex V6 - Cible de refonte UI/UX

## Statut

**VERROUILLÉ - document chapeau et index de la refonte UI/UX V6**

Ce document décrit la vision globale et l'ordre des sources de vérité. Il ne recopie pas les détails déjà définis dans les étapes spécialisées.

Principe directeur :

> **Architecture sobre et systémique + émotion et identité Gargotte.**

La refonte transforme Gargottex en une encyclopédie visuelle et un compagnon de partie, sans perdre la rapidité, le local-first, l'offline, la PWA, les données existantes ni la séparation lecture / édition.

---

# 1. Hiérarchie documentaire

Les documents ont des responsabilités distinctes.

| Document | Autorité |
|---|---|
| `REFACTORISATION-V6-LOCAL-FIRST-NEON.md` | architecture technique, IndexedDB, Neon, Auth, synchronisation et sauvegarde des originaux médias |
| `UI-1-DESIGN-SYSTEM-V6.md` | design system : palette, typographies, iconographie, espacements, composants et primitives responsive |
| `UI-2-BESTIAIRE-FICHE-CREATURE-V6.md` | Bestiaire et fiche Créature |
| `UI-3-CODEX-AUTRES-ENTITES-V6.md` | Donjons, Héros, PNJ, Quêtes Codex, Loot, Objets interactifs, Brouhaha référentiel et Médias contextuels |
| `UI-4-OUTILS-DE-PARTIE-V6.md` | Accueil et outils de session |
| `UI-5-ADMINISTRATION-MEDIAS-SYNC-V6.md` | Atelier, Auth visible, Médias, Import/Export, synchronisation et diagnostics |
| `UI-6-POLISH-RESPONSIVE-ACCESSIBILITE-V6.md` | validation responsive, accessibilité, performance et appareils réels |

En cas de divergence, **le document spécialisé le plus proche du sujet prévaut**. Le présent document sert de carte générale, pas de seconde copie des spécifications.

Les valeurs exactes de couleurs, dimensions, durées, composants et seuils de validation ne sont donc pas répétées ici.

---

# 2. Périmètre fonctionnel

Les huit vues majeures sont conservées :

1. Accueil
2. Codex
3. Générateur
4. Brouhaha
5. Quêtes
6. Atelier
7. Médias
8. Import / Export

Fonctions transversales :

- recherche globale ;
- navigation entre entités ;
- contexte de partie ;
- état local / synchronisation ;
- Auth ;
- journal / diagnostic ;
- médias ;
- persistance d'état UI utile ;
- tactile et clavier ;
- installation PWA.

Le libellé utilisateur des `interactables` est **Objets interactifs**.

---

# 3. Principes UX communs

Les règles suivantes sont non négociables :

- le contenu et la hiérarchie précèdent la décoration ;
- les illustrations sont du contenu majeur ;
- le Codex sert à lire et explorer ;
- l'Atelier sert à créer et modifier ;
- aucune fonction critique ne dépend du hover ;
- les actions importantes sont réellement tactiles ;
- le téléphone et la tablette utilisent une navigation séquentielle pour la fiche Créature ;
- la tablette possède ses propres compositions ;
- le desktop privilégie densité utile et navigation rapide ;
- l'interface reste utilisable offline avec les données disponibles localement ;
- l'état distant ne masque jamais l'état local réel ;
- les originaux médias ne sont jamais dégradés par l'UI.

---

# 4. Architecture responsive

Trois familles structurent toute la refonte :

- téléphone ;
- tablette ;
- desktop.

Les breakpoints et comportements précis appartiennent à UI-1 et UI-6. Les documents UI-2 à UI-5 décrivent seulement les adaptations métier nécessaires.

Navigation cible :

- desktop : sidebar permanente ;
- tablette : rail compact lorsque pertinent ;
- téléphone : barre basse `Accueil | Codex | Jeu | Quêtes | Plus`.

Sur téléphone :

- `Jeu` regroupe Générateur et Brouhaha ;
- `Plus` donne accès aux fonctions secondaires et d'administration ;
- la recherche globale reste accessible via une action de recherche dans la topbar / l'en-tête, sans créer une sixième entrée de navigation.

---

# 5. Installation PWA

L'installation reste une capacité de Gargottex, pas une destination principale.

Si la plateforme permet une invitation d'installation exploitable, elle peut être proposée comme action secondaire dans `Plus` ou dans un contexte approprié.

Sur iOS, une aide courte peut expliquer l'ajout à l'écran d'accueil lorsque nécessaire.

Aucune bannière d'installation persistante ne doit gêner l'usage normal.

---

# 6. Les six étapes

## UI-1 - Design system

Définit la grammaire visuelle et les primitives communes. Toutes les valeurs visuelles exactes vivent uniquement dans ce document.

## UI-2 - Bestiaire et Créature

Établit l'écran étalon du Codex : Galerie pour explorer, Liste pour arbitrer, Fiche pour comprendre.

## UI-3 - Autres entités du Codex

Décline le langage sans photocopier la fiche Créature. Le Donjon devient un hub narratif, les Héros sont regroupés par personnage, les Médias deviennent transversaux.

## UI-4 - Outils de partie

Introduit un contexte de session partagé entre Accueil, Générateur, Brouhaha et Quêtes. La vue Quêtes de session sert uniquement à jouer ; la bibliothèque appartient au Codex.

Le Générateur utilise un choix exclusif `Normal | Mini-boss | Boss`.

## UI-5 - Administration

Sépare clairement consultation, édition, enregistrement local, sauvegarde distante, gestion des originaux médias, import/export et diagnostic.

## UI-6 - Validation finale

Ne redessine pas Gargottex. Elle mesure et valide responsive, accessibilité, performance, offline, PWA et appareils réels.

---

# 7. Dépendance technique

L'implémentation complète de la refonte attend la validation des gates techniques V6.

La documentation UI ne redéfinit pas :

- le schéma Postgres ;
- la stratégie de chunks ;
- les policies RLS ;
- les secrets ;
- les détails de transport média.

Elle définit seulement ce que l'utilisateur voit et comment l'interface se comporte.

---

# 8. Critères globaux de réussite

La refonte est réussie si :

- les huit vues existent toujours ;
- aucune donnée métier n'est perdue ;
- Codex et Atelier restent nettement distincts ;
- la recherche globale reste accessible ;
- les illustrations sont valorisées sans ralentir le parcours ;
- le contexte est conservé lors des retours et rotations ;
- le téléphone n'empile plus collection complète puis fiche ;
- la tablette n'est pas un desktop comprimé ;
- le desktop reste efficace ;
- le travail local n'attend pas Neon ;
- la synchronisation et les médias exposent des états compréhensibles ;
- les originaux médias restent intacts ;
- les parcours essentiels respectent la cible d'accessibilité définie par UI-6 ;
- la Gate UI-6 est validée sans anomalie bloquante ou majeure.

---

# 9. Règle de maintenance documentaire

Lorsqu'une décision évolue :

1. modifier le document qui en est l'autorité ;
2. corriger uniquement les références contradictoires dans les autres documents ;
3. ne pas recopier des tableaux de tokens ou détails techniques dans plusieurs fichiers ;
4. ne pas rouvrir une décision verrouillée sans raison documentée.

Après UI-6, toute nouvelle évolution UI/UX devient un chantier versionné distinct.
