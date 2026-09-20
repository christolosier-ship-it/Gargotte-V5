# Gargottex V6 - UI-2 Bestiaire & Fiche Créature

## Statut

**ACTIF - source de vérité fonctionnelle du Bestiaire et de la fiche Créature**

Références obligatoires :

- `REFONTE-UI-UX-V6.md` ;
- `UI-1-DESIGN-SYSTEM-V6.md` ;
- maquette V3 ;
- `WORKFLOW-IMAGES-REMBG-V6.md` pour les figurines détourées.

Principe :

> **Galerie pour explorer. Liste pour arbitrer. Fiche pour comprendre.**

---

# 1. Sous-lots

## UI-2A - Collection

- Galerie/Liste ;
- recherche ;
- filtres ;
- tri ;
- restauration du contexte.

## UI-2B - Fiche

- illustration ;
- identité ;
- stats ;
- compétence ;
- comportement ;
- Butin ;
- Lore.

## UI-2C - Relations et cas avancés

- médias ;
- relations ;
- boss/phases ;
- états incomplets ;
- retour/restauration.

Chaque sous-lot passe sa gate avant le suivant.

---

# 2. Collection Bestiaire

Vue initiale :

- desktop : Galerie ;
- tablette : Galerie ;
- téléphone : Liste.

Le dernier mode choisi est mémorisé localement.

## Contrôles obligatoires

- recherche ;
- filtre Donjon ;
- filtre Catégorie ;
- filtre Menace ;
- filtre Tags ;
- tri Nom ;
- tri Menace ;
- tri Donjon ;
- Galerie/Liste ;
- reset lorsque des filtres sont actifs.

**Ces contrôles doivent réellement filtrer/trier les données. Ils ne peuvent pas rester décoratifs comme dans certaines parties de la maquette.**

La recherche est locale et fonctionne offline.

## Galerie

Carte :

- figurine ;
- nom ;
- Donjon ;
- catégorie ;
- menace.

Pas de mini-fiche complète.

## Liste

Ligne :

- vignette ;
- nom ;
- catégorie ;
- Donjon ;
- PV ;
- ATK ;
- DEF ;
- menace.

---

# 3. Responsive

## Desktop

Collection et fiche peuvent coexister.

La fiche garde une largeur confortable.

## Tablette portrait et paysage

Toujours :

`Bestiaire -> Fiche -> Retour Bestiaire`

Jamais collection + fiche côte à côte.

## Téléphone

Même séquence.

Le retour restaure :

- recherche ;
- filtres ;
- tri ;
- mode ;
- scroll ;
- sélection utile.

La détection de layout doit reposer sur la composition responsive, pas sur `navigator.maxTouchPoints` seul.

---

# 4. Hiérarchie de fiche

Ordre :

1. illustration / identité ;
2. Donjon ;
3. catégorie / Menace / Socle ;
4. stats ;
5. Compétence ;
6. Comportement ;
7. Butin ;
8. Lore ;
9. tags ;
10. entités liées.

Stats :

`PV | ATK | DEF | PORTÉE / ZONE | ACTIONS`

La Menace reste dans l'identité.

---

# 5. Illustration

La figurine est un contenu majeur.

Règles :

- silhouette entière privilégiée ;
- `object-fit: contain` pour une figurine détourée ;
- plein écran disponible ;
- dimensions réservées ;
- lazy-loading hors premier viewport ;
- pas de chargement massif d'originaux.

Pour les fonds transparents :

- utiliser le workflow rembg documenté ;
- l'original reste intact ;
- le PNG transparent est un dérivé ;
- un CSS `background:#fff` ne doit jamais recréer un faux fond blanc autour d'une figurine détourée.

---

# 6. Données et compatibilité IndexedDB

La nouvelle UI doit lire les enregistrements existants sans migration obligatoire.

Champs absents :

- ne pas casser la fiche ;
- masquer/réduire la section concernée ;
- afficher `—` uniquement si le contexte exige une valeur.

Une fiche UI ne doit pas réécrire un enregistrement simplement parce qu'elle l'a lu.

Aucun identifiant existant ne change.

---

# 7. Compétence

La Compétence suit immédiatement les stats.

Emblème :

`Icone_Gameplay_COMPETENCE.webp`

Le texte complet reste lisible.

Les effets narratifs peuvent utiliser une matière plus chaude, sans réduire le contraste.

---

# 8. Comportement

Bloc fonctionnel :

- IA/comportement ;
- priorité de cible ;
- règles utiles.

Ne pas interpréter ou inventer une IA absente.

---

# 9. Butin

La section de fiche s'appelle **Butin**.

La famille du Codex s'appelle **Loot**.

Chaque élément peut ouvrir la famille Loot lorsqu'une relation existe.

---

# 10. Lore

Traitement éditorial léger :

- papier clair usé ;
- texte brun sombre ;
- pas de texture forte ;
- pas de duplication de titre ou de phrase d'ambiance inutile.

---

# 11. Catégories

Toujours :

- sigil premium ;
- texte ;
- couleur d'accent.

Couleur :

- liseré de carte ;
- badge ;
- micro-accent de fiche ;
- halo contenu.

Jamais une fiche entièrement recolorée.

---

# 12. Relations

Priorité :

1. même Donjon ;
2. relations explicites ;
3. contenu directement associé par les données.

Les relations ne sont jamais inventées pour remplir un rail.

`Voir tout` ouvre une collection réellement préfiltrée et conserve un chemin de retour.

---

# 13. Boss et phases

Une phase n'est regroupée que si la relation est fiable.

Une simple ressemblance de nom n'est pas suffisante.

Avec relation fiable :

- desktop : pile compacte ;
- tablette : pile verticale sur fiche dédiée ;
- téléphone : accordéons.

Sans relation fiable : entrées séparées.

---

# 14. États média

Dans la phase actuelle local-first :

- original local présent ;
- dérivé disponible ;
- image absente/illisible.

Les états distants de type `remote_only` ne deviennent obligatoires que lorsqu'un futur chantier de synchronisation les réintroduit.

---

# 15. États incomplets

Gérer :

- aucune créature ;
- aucun résultat ;
- image absente ;
- Compétence absente ;
- Butin absent ;
- Lore absent ;
- tags absents ;
- relation cassée ;
- nom long ;
- données anciennes.

Règle :

> **Une donnée absente réduit la fiche, elle ne crée pas un trou.**

---

# 16. Gate UI-2

Validation obligatoire :

1. recherche/filtres/tri fonctionnels ;
2. Galerie et Liste distinctes ;
3. contexte restauré ;
4. tablette séquentielle ;
5. téléphone séquentiel ;
6. fiche conforme V3 ;
7. figurines détourées sans altération des originaux ;
8. données IndexedDB anciennes lisibles ;
9. boss regroupés uniquement avec relation fiable ;
10. aucune perte de données ni réécriture massive.

---

# 17. Implémentation UI-2A sur V5.3

Statut : **LIVRÉ — 20 septembre 2026**

Pré-check :

- périmètre : Collection Bestiaire uniquement ;
- impact données : lecture des Créatures + écriture de l'état d'interface dans `meta.ui_state` ;
- IndexedDB : schéma, stores, IDs, relations, Blobs et enregistrements métier inchangés ;
- référence V3 : toolbar Bestiaire, galerie 3/4, lignes compactes, accents de catégorie et emblèmes premium ;
- fiche Créature : conservée telle quelle comme pont de navigation, refonte complète réservée à UI-2B.

Livré :

- Galerie et Liste fonctionnelles ;
- Galerie par défaut desktop/tablette, Liste par défaut téléphone lors du premier usage ;
- dernier mode mémorisé dans l'état UI local ;
- recherche locale/offline ;
- filtres Donjon, Catégorie, Menace et Tags réellement appliqués ;
- filtre Tags multi-sélection ;
- tris Nom, Menace et Donjon avec sens ascendant/descendant ;
- reset des filtres ;
- compteur de résultats ;
- sélection, filtres, tri, mode et scroll restaurés ;
- cartes/lignes inspirées directement de la V3 ;
- sigils de catégorie et emblèmes Donjon/PV/ATK/DEF/Menace réutilisés depuis `assets/ui-v6/icons/` ;
- anciens enregistrements tolérés, notamment tags absents ou stockés dans un ancien format.

Responsive UI-2A :

- desktop : collection pleine largeur structurée pour accueillir le futur master-detail ;
- tablette portrait/paysage : collection pleine largeur ;
- téléphone : collection pleine largeur, Liste par défaut ;
- l'ouverture de la fiche reste séquentielle et le retour restaure la position de collection.

Validation UI-2A :

- aucun contrôle décoratif ;
- aucune migration IndexedDB ;
- aucune réécriture d'une Créature lors de sa lecture ;
- aucun original média modifié ;
- UI-2B non démarré.
