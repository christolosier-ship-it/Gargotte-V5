# Gargottex V6 - Refonte UI/UX

## Statut

**ACTIF - document maître, contrat de chantier et ordre des sources de vérité**

Ce document pilote la construction de la future UI Gargottex V6.

Il remplace l'ancienne logique où la documentation UI attendait une refactorisation technique préalable. L'ancienne refactorisation distante/Neon est **retirée du chantier UI et reportée à un projet technique ultérieur**. Aucun document technique Neon n'est requis pour exécuter la présente refonte.

Principe directeur :

> **Construire la nouvelle UI à partir de deux références complémentaires : les documents fonctionnels pour le comportement, et la maquette V3 pour la composition, l'émotion et l'identité visuelle.**

La refonte doit préserver l'application actuelle en production, son fonctionnement PWA, son mode offline et **toutes les données déjà présentes dans IndexedDB**.

---

# 1. Contexte de production non négociable

L'application existante est déjà utilisée en production.

État à préserver :

- PWA installable ;
- fonctionnement offline ;
- données métier existantes dans IndexedDB ;
- médias/originaux déjà stockés localement ;
- identifiants et relations existants ;
- imports/exports actuels ;
- Service Worker et reprise hors ligne.

Les données IndexedDB réellement présentes sur les appareils utilisateurs **ne sont pas accessibles au chantier de développement**. Elles doivent donc être considérées comme **irremplaçables et potentiellement plus riches que les fixtures du dépôt**.

Conséquences obligatoires :

1. aucune tâche UI ne peut supposer une base vide ;
2. aucune tâche UI ne peut réinitialiser IndexedDB pour simplifier une migration ;
3. interdiction de `indexedDB.deleteDatabase()` dans un chemin normal de mise à jour ;
4. interdiction de supprimer ou renommer un object store existant sans chantier de migration explicitement validé ;
5. les identifiants existants restent stables ;
6. les nouveaux champs doivent être tolérants à l'absence de valeur sur les anciens enregistrements ;
7. une évolution de schéma IndexedDB doit être additive autant que possible et comporter une migration testée ;
8. les médias originaux existants ne sont jamais remplacés par une miniature, un WebP, un détourage ou un dérivé ;
9. vider un cache PWA ne doit jamais être confondu avec vider les données IndexedDB ;
10. avant toute mise en production susceptible de modifier le schéma local, un chemin de sauvegarde/export et un scénario de retour doivent être vérifiés.

**La conservation des données existantes prime sur toute autre règle de ce chantier.**

---

# 2. Architecture technique : position actuelle

La refactorisation Neon / synchronisation distante est remise à plus tard.

Pour la présente refonte UI :

- la PWA existante et IndexedDB restent la base opérationnelle ;
- le travail local ne dépend d'aucun backend distant nouveau ;
- aucune dépendance Neon, Auth distante ou stockage cloud supplémentaire ne doit être introduite par un lot UI ;
- les écrans ou états de synchronisation distante visibles dans la maquette V3 sont des **références visuelles différées** tant qu'un futur chantier technique ne les réactive pas ;
- une future refactorisation distante devra disposer de sa propre documentation d'architecture et de sa propre stratégie de migration.

Le code de production actuel reste une source obligatoire à inspecter, notamment :

- `src/app.js` ;
- `src/storage/idb.js` ;
- le Service Worker ;
- les templates et fixtures réellement utilisés ;
- les formats JSON/XLSX existants.

---

# 3. Sources de vérité

## 3.1 Ordre des références

| Priorité | Source | Autorité |
|---|---|---|
| 1 | **ce document maître** | processus de travail, sécurité des données, périmètre, ordre des sources |
| 2 | `UI-1` à `UI-6` | comportement, contenu, responsive métier, gates de chaque lot |
| 3 | `GARGOTTEX-V6-MAQUETTE-PREMIUM-V3.html` + CSS/JS + ressources | composition, proportions, émotion, direction artistique, exemples visuels |
| 4 | `WORKFLOW-IMAGES-REMBG-V6.md` + script/action existants | transformation des images et dérivés transparents |
| 5 | code de production actuel | compatibilité réelle, contrats de données et comportement déjà livré |
| 6 | `CAHIER-DES-VUES-GARGOTTEX-V6-REV2.pdf` | aide de lecture uniquement, jamais source normative |

## 3.2 Règle en cas de divergence

Ne jamais choisir silencieusement.

Appliquer l'ordre suivant :

1. **sécurité et préservation des données** ;
2. comportement métier du document UI spécialisé ;
3. composition et direction visuelle de la maquette V3 ;
4. design system UI-1 ;
5. exemple ou donnée de démonstration de la maquette.

Exemples :

- une interaction simulée dans la maquette mais définie précisément par UI-3 suit UI-3 ;
- la mise en scène du Brouhaha suit la maquette V3 tant qu'elle ne casse pas UI-4 ou UI-6 ;
- les logos premium de gameplay suivent la maquette V3, même si une ancienne version de UI-1 parlait d'icônes génériques ;
- un panneau « Neon » de la maquette ne crée pas une obligation backend dans le chantier actuel.

Si une amélioration validée de la maquette n'existe pas encore dans la documentation, **la documentation doit être mise à jour avant de considérer l'implémentation terminée**.

---

# 4. Référence visuelle obligatoire

Référence principale :

- `docs/GARGOTTEX-V6-MAQUETTE-PREMIUM-V3.html`
- `docs/mockup-assets/maquette-v3.css`
- `docs/mockup-assets/maquette-v3.js`
- `docs/mockup-assets/icons/`
- `docs/mockup-assets/textures/`
- `docs/mockup-assets/ornaments/`

La V3 n'est **pas** un code de production à recopier aveuglément.

Elle sert à verrouiller :

- proportions ;
- hiérarchie ;
- rythme ;
- densité ;
- placement des illustrations ;
- langage des cartes et fiches ;
- textures ;
- effets de matière ;
- emblèmes ;
- mise en scène des Donjons ;
- progression Héros ;
- Brouhaha chaotique ;
- comportement visuel desktop / tablette / téléphone.

Les valeurs fictives, relations simulées et handlers de démonstration ne sont pas des règles métier.

---

# 5. Workflow image obligatoire

Toute tâche qui ajoute ou remplace une figurine devant apparaître détourée doit lire :

- `docs/WORKFLOW-IMAGES-REMBG-V6.md`
- `scripts/mockup/process_mockup_resources.py`
- `.github/workflows/mockup-resource-pipeline.yml`

Moteur validé :

- `rembg`
- IS-Net / DIS
- modèle `isnet-general-use`

Règle absolue :

> **un détourage est un dérivé d'affichage ; l'original reste intact.**

La future production pourra adapter l'emplacement du pipeline, mais pas cette règle.

---

# 6. Organisation des lots

Les six lots restent pertinents, mais UI-3 et UI-5 sont découpés en sous-lots pour éviter les chantiers trop larges.

## UI-1 - Design system & shell

- tokens ;
- navigation ;
- composants ;
- emblèmes ;
- matières ;
- responsive commun ;
- primitives d'accessibilité.

## UI-2 - Bestiaire & fiche Créature

Sous-lots recommandés :

- UI-2A : collection, filtres, recherche, tri ;
- UI-2B : fiche Créature ;
- UI-2C : relations, boss/phases, états média et restauration de contexte.

## UI-3 - Autres entités du Codex

Découpage obligatoire :

- **UI-3A : Donjons + Héros** ;
- **UI-3B : PNJ + Quêtes + Loot** ;
- **UI-3C : Objets interactifs + Brouhaha référentiel** ;
- **UI-3D : relations, navigation croisée, recherche globale et restauration de contexte**.

Chaque sous-lot possède sa propre validation avant le suivant.

## UI-4 - Accueil & outils de partie

- Accueil ;
- SessionContext local ;
- Générateur ;
- Brouhaha de session ;
- Quêtes de session.

## UI-5 - Administration, médias & persistance locale

Découpage obligatoire :

- **UI-5A : Atelier** ;
- **UI-5B : Médias + dérivés image** ;
- **UI-5C : Import/Export + diagnostic local + PWA/offline**.

La synchronisation distante est différée.

## UI-6 - Polish, accessibilité & validation

- responsive réel ;
- accessibilité ;
- performance ;
- stress dataset ;
- PWA/offline ;
- non-régression visuelle ;
- non-régression des données locales.

---

# 7. Workflow léger pour chaque future tâche

Le chantier utilise des **points de contrôle compacts**, pas un cérémonial de Gates à documenter une par une.

Le déroulé normal d'une tâche ou d'un sous-lot tient en trois moments :

## A. Pré-check avant travaux

Avant de modifier le code :

- lire ce document maître ;
- lire le document du lot concerné ;
- ouvrir la vue correspondante dans la maquette V3 ;
- inspecter le code de production réellement touché ;
- identifier si la tâche lit, écrit ou migre des données IndexedDB ;
- si la tâche touche des images détourées, lire le workflow rembg.

Résumé attendu, en quelques lignes seulement :

```text
Périmètre :
Impact données : aucun | lecture | écriture | migration
IndexedDB : inchangé | évolution additive | STOP
Référence V3 :
Risque principal :
```

Aucun rapport séparé n'est demandé pour les anciennes Gate 0 à 6.

### STOP sécurité données

Le chantier s'arrête immédiatement si :

- une migration destructive paraît nécessaire ;
- un object store existant devrait être supprimé ou renommé sans chantier dédié ;
- un original média risque d'être remplacé/perdu ;
- la compatibilité avec les anciennes données n'est pas démontrable ;
- une hypothèse sur les IndexedDB utilisateurs réels est indispensable.

Dans ce cas, un chantier de migration séparé est préparé avant de poursuivre.

## B. Construction

La construction regroupe naturellement :

- implémentation visuelle ;
- branchement des données si nécessaire ;
- responsive ;
- interactions.

Ordre conseillé :

1. construire selon UI-1 + document du lot + V3 ;
2. brancher IndexedDB/modèles métier si la tâche en dépend ;
3. conserver les fallbacks pour données anciennes ou incomplètes ;
4. vérifier progressivement desktop, tablette et téléphone ;
5. corriger les interactions au fil du chantier.

Si la tâche ne touche pas aux données métier, noter simplement :

`Données : N/A, aucun contrat métier modifié.`

Il n'est pas nécessaire d'inventer une étape de branchement uniquement pour « passer une Gate ».

## C. Validation et clôture

Avant de considérer le sous-lot terminé :

- comparaison visuelle avec V3 ;
- interactions principales ;
- desktop / tablette paysage / tablette portrait / téléphone ;
- clavier et reduced motion lorsque pertinents ;
- offline lorsque pertinent ;
- données absentes, anciennes ou incomplètes ;
- non-régression IndexedDB si la tâche touche les données ;
- documentation mise à jour si une décision a évolué.

Bilan compact :

```text
Livré :
Données/IndexedDB :
Responsive :
Écarts V3 :
Tests :
Reste à faire :
```

### STOP validation

Le lot ne se ferme pas s'il subsiste :

- un risque de perte de données ;
- une anomalie bloquante ou majeure ;
- un responsive essentiel incorrect ;
- une divergence importante avec V3 non expliquée ;
- un comportement métier obligatoire non fonctionnel.

## D. Gates des lots UI

Les sections `Gate UI-1`, `Gate UI-2`, etc. présentes dans les documents spécialisés sont des **checklists d'acceptation de fin de lot**, pas des étapes procédurales supplémentaires.

Elles sont évaluées pendant la validation finale du lot.

Même principe pour la Gate image du workflow rembg.

**En pratique : pré-check compact -> construction continue -> validation/clôture compacte.**

---

# 8. Règles de branchement sur les données existantes

## 8.1 Lecture

Toute lecture doit :

- accepter les enregistrements existants ;
- gérer les champs absents ;
- ne pas exiger une réécriture globale pour afficher la nouvelle UI ;
- conserver les valeurs inconnues lors d'une édition partielle.

## 8.2 Écriture

Toute écriture doit :

- modifier seulement les champs concernés ;
- préserver les autres propriétés de l'enregistrement ;
- conserver l'identifiant ;
- ne pas écraser un Blob original par un dérivé ;
- ne pas supprimer une relation parce qu'elle n'est pas affichée dans le nouveau formulaire.

## 8.3 Migration IndexedDB

Une migration autorisée doit être :

- versionnée ;
- déterministe ;
- testable sur une copie ;
- idempotente lorsque possible ;
- sans perte silencieuse ;
- compatible avec une interruption de mise à jour.

Préférer :

- ajout d'index ;
- ajout de store ;
- enrichissement progressif des données à la lecture/écriture ;

plutôt que :

- suppression de store ;
- renommage destructif ;
- réimport complet obligatoire.

---

# 9. Architecture responsive verrouillée

Navigation :

- desktop : sidebar permanente ;
- tablette : rail compact lorsque pertinent ;
- téléphone : `Accueil | Codex | Jeu | Quêtes | Plus`.

Codex :

- desktop : master-detail autorisé si la largeur le permet ;
- tablette portrait **et paysage** : `Collection -> Fiche -> Retour` ;
- téléphone : `Collection -> Fiche -> Retour`.

Atelier :

- desktop : liste + formulaire ;
- tablette paysage : liste + formulaire possible ;
- tablette portrait : formulaire prioritaire, liste secondaire/drawer ;
- téléphone : liste -> fiche d'édition.

---

# 10. Direction émotionnelle verrouillée

La cible n'est pas un dashboard brun.

Elle est :

> **Taverne éditoriale premium + bestiaire de figurines + fantasy cartoon absurde Gargotte.**

La structure reste sobre.

L'émotion vient de :

- figurines ;
- couvertures de Donjon ;
- matériaux ;
- emblèmes illustrés ;
- typographie éditoriale ;
- compositions asymétriques contrôlées ;
- Brouhaha ;
- tampons, billets, notes et traces quand ils ont un sens ;
- micro-animations contextualisées.

Interdit :

- phrases décoratives ajoutées uniquement pour « faire ambiance » ;
- répétitions de titres ;
- sigils dupliqués sans fonction ;
- ornements qui gênent le gameplay ;
- UI SaaS générique repeinte en brun.

---

# 11. Critères de réussite globaux

La refonte V6 est réussie si :

1. toutes les données existantes restent accessibles ;
2. la PWA et l'offline restent fonctionnels ;
3. aucune migration UI ne force un reset IndexedDB ;
4. les vues de la V3 sont reconnaissables dans la production ;
5. les interactions documentées sont réellement fonctionnelles ;
6. les filtres/recherches ne sont pas décoratifs ;
7. le Codex est séquentiel sur tablette/téléphone ;
8. le desktop conserve sa densité utile ;
9. les images originales restent intactes ;
10. les dérivés transparents suivent le workflow rembg ;
11. les Héros gardent leur progression visuelle et leurs compétences cumulées ;
12. le Brouhaha garde sa pression et son chaos contrôlé ;
13. Atelier et Codex restent clairement distincts ;
14. l'accessibilité UI-6 est validée ;
15. aucune anomalie bloquante ou majeure ne subsiste avant production.

---

# 12. Maintenance documentaire

Lorsqu'une décision change :

1. modifier d'abord ce document si elle change le processus ou les priorités ;
2. modifier ensuite le lot spécialisé ;
3. mettre la maquette à jour si la décision est visuelle ;
4. ne jamais laisser deux sources se contredire volontairement ;
5. ne pas réintroduire la refactorisation Neon dans un lot UI ;
6. créer un nouveau chantier technique lorsque cette refactorisation reprendra.

**Ce document est l'entrée obligatoire de toute future tâche UI V6.**
