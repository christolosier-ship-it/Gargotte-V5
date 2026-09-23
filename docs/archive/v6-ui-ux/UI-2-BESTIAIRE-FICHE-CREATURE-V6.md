# Gargottex V6 - UI-2 Bestiaire & Fiche Créature

## Statut

**LIVRÉ / FERMÉ — UI-2A + UI-2B + UI-2C validés le 20 septembre 2026**

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

---

# 18. Implémentation UI-2B sur V5.3

Statut : **LIVRÉ — 20 septembre 2026**

Pré-check :

- périmètre : vraie fiche Créature V6, sans relations avancées ni regroupement boss/phases ;
- impact données : lecture seule des Créatures, Donjons, Loot et médias déjà présents ;
- IndexedDB : aucun changement de schéma, aucun changement de version, aucune réécriture lors de la lecture ;
- référence V3 : composition illustration/détail, sigil, cinq stats, compétence laiton, sections fonctionnelles et Lore papier ;
- images : aucun traitement rembg déclenché dans ce sous-lot, aucun original ni dérivé média modifié ;
- hébergement : Vercel n'est plus utilisé pour Gargotte et n'entre plus dans la validation de ce chantier.

Livré :

- illustration majeure avec silhouette complète en `object-fit: contain` ;
- ouverture plein écran via la visionneuse existante ;
- identité, Donjon, Catégorie, Menace et Socle ;
- cinq statistiques `PV | ATK | DEF | PORTÉE / ZONE | ACTIONS` avec emblèmes premium ;
- Compétence avec emblème premium et information Brouhaha lorsqu'elle existe ;
- Comportement et priorité de cible sans inventer d'IA absente ;
- Butin issu des relations locales déjà reconstruites ;
- Lore sur matière papier claire avec texte brun sombre ;
- tags uniquement lorsqu'ils existent ;
- slot DOM réservé à UI-2C sans contenu artificiel ;
- sections absentes supprimées du flux au lieu d'afficher des blocs vides ;
- catégorie inconnue/absente et valeurs anciennes tolérées sans casser la fiche.

Responsive UI-2B :

- grand desktop confortable (>= 1480 px) : rail Bestiaire compact + fiche simultanée ;
- desktop plus étroit : fiche pleine largeur + Retour ;
- tablette paysage/portrait : fiche seule + Retour ;
- téléphone : fiche seule + Retour, illustration prioritaire et stats accessibles sans écrasement ;
- retour vers la collection conservant le contexte UI-2A et son scroll.

Validation :

- aucune migration IndexedDB ;
- `DB_VERSION` attendu inchangé à 2 ;
- aucune écriture métier déclenchée par `renderCreatureDetail` ;
- assets premium déjà précachés par le Service Worker UI-1, aucun nouvel asset nécessaire ;
- données manquantes : les sections Compétence, Comportement, Butin, Lore et Tags se réduisent proprement ;
- comparaison V3 : même hiérarchie et même mise en scène, sans recopier les handlers fictifs de la maquette ;
- UI-2C non démarré.

---

# 19. Implémentation UI-2C sur V5.3

Statut : **LIVRÉ — 20 septembre 2026**

Pré-check :

- périmètre : relations fiables, navigation liée, Boss/phases explicites, cas incomplets et restauration complète du contexte ;
- IndexedDB : aucune migration, aucun store modifié, aucune écriture métier déclenchée par la lecture du Bestiaire ;
- données de phase : aucun champ de phase n’existe dans le template Créatures V5.3 ; aucune phase n’est donc déduite depuis un nom ;
- hébergement : Vercel reste hors du projet et hors validation.

Relations :

- priorité visuelle : créatures du même Donjon, puis relations explicites, puis médias directement associés ;
- le même Donjon est résolu par `dungeon_id` valide, ou par nom exact uniquement lorsqu’il identifie un Donjon unique ;
- relations explicites acceptées uniquement lorsqu’un type d’entité et un ID sont fournis ;
- les relations cassées sont signalées sans tentative de rapprochement automatique ;
- le Butin lié et le Donjon lié ouvrent leur vraie fiche Codex ;
- les médias sont considérés directement associés seulement si `entity_type` désigne une Créature et `entity_id` correspond exactement ;
- aucune relation n’est construite depuis une ressemblance de nom.

Navigation et retour :

- pile de retour Codex locale et persistée dans `meta.ui_state` ;
- navigation Créature -> Donjon/Loot/Média/autre Créature avec retour vers la fiche d’origine ;
- retour au Bestiaire préserve recherche, filtres, tri, sens, mode, sélection et scroll UI-2A ;
- `Voir tout` sur le même Donjon ouvre une vraie collection préfiltrée ;
- le contexte précédent peut ensuite être restauré intégralement.

Mini-boss et Boss :

- les Mini-boss restent des entrées indépendantes avec leur catégorie premium ;
- aucune logique de regroupement de phases n’est appliquée aux Mini-boss ;
- un Boss multi-phases est regroupé uniquement par relation explicite fiable : listes d’IDs de phases, ID de groupe, parent de phase ou relation explicitement typée phase ;
- une référence de phase cassée invalide le regroupement concerné ;
- aucune ressemblance de nom ne participe à cette détection ;
- desktop et tablette : pile de phases compacte ;
- téléphone : phases en accordéons.

États avancés :

- image absente : fallback V6 existant ;
- image renseignée mais illisible : fallback visuel côté UI, sans modifier le média ;
- textes et noms longs : retour à la ligne contrôlé ;
- catégorie ancienne/inconnue : affichée sans casser la fiche, avec traitement visuel de secours ;
- sections et relations absentes : aucun bloc décoratif vide.

---

# 20. Clôture Gate UI-2

Statut : **FERMÉ**

Validation finale UI-2A + UI-2B + UI-2C :

1. recherche, filtres et tris réellement appliqués ;
2. Galerie et Liste distinctes avec dernier mode mémorisé ;
3. contexte Bestiaire restauré après fiche, y compris scroll ;
4. tablette séquentielle Collection -> Fiche -> Retour ;
5. téléphone séquentiel Collection -> Fiche -> Retour ;
6. fiche Créature alignée sur la composition V3 et ses ressources premium ;
7. aucun original média modifié et aucun détourage déclenché par UI-2 ;
8. anciens enregistrements lus sans migration obligatoire ;
9. Boss regroupés uniquement sur relation explicite fiable, jamais par nom ;
10. aucune suppression, migration ou réécriture massive IndexedDB.

UI-2 est clos. Le prochain lot UI ne doit pas réouvrir UI-2 sauf correction de régression.


---

# Polish post-lot — 21 septembre 2026

Ajustements validés sur la fiche Créature :

- la scène d’illustration conserve une hauteur bornée ;
- après la zone haute image + identité/statistiques/compétence, les blocs fonctionnels passent sur **toute la largeur de la fiche** ;
- leur ordre est fixe : **Comportement → Butin → Lore**, chacun avec une hauteur dictée uniquement par son contenu ;
- les tags suivent le Lore sans créer de panneau vide ;
- **Entités liées** occupe ensuite toute la largeur de la fiche et utilise des rails horizontaux défilants ;
- la sous-zone **Médias associés** est retirée de la fiche Créature ; les médias restent gérés dans la bibliothèque dédiée et continuent d’alimenter les images des entités lorsqu’ils sont liés ;
- aucune donnée, relation ou Blob n’est modifié par ce changement de composition.
