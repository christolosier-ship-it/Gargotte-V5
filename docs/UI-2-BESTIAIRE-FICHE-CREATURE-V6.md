# Gargottex V6 - UI-2 Bestiaire & Fiche Créature

## Statut

**VERROUILLÉ - source de vérité pour le Bestiaire et la fiche Créature**

Ce document complète `REFONTE-UI-UX-V6.md` et réutilise le design system de `UI-1-DESIGN-SYSTEM-V6.md` sans en recopier les tokens.

Principe directeur :

> **Galerie pour explorer. Liste pour arbitrer. Fiche pour comprendre.**

---

# 1. Objectifs

UI-2 doit permettre de :

- parcourir plusieurs centaines de créatures ;
- explorer visuellement le bestiaire ;
- retrouver rapidement une créature pendant une partie ;
- comprendre immédiatement identité, menace, stats et mécanique principale ;
- préserver recherche, filtres, tri, vue et scroll lors des allers-retours ;
- fournir l'écran étalon du Codex pour UI-3.

---

# 2. Décisions verrouillées

1. Le Bestiaire propose **Galerie** et **Liste**.
2. Vue initiale : Galerie sur desktop/tablette, Liste sur téléphone.
3. Le dernier mode choisi est mémorisé localement.
4. Desktop : collection visible lorsque la fiche est ouverte.
5. Desktop sans sélection : la collection peut occuper tout l'espace de travail.
6. Tablette paysage : rail + collection compacte + fiche.
7. Tablette portrait : fiche prioritaire + drawer Bestiaire.
8. Téléphone : `Bestiaire -> Fiche -> retour Bestiaire`.
9. Identité, stats et capacité signature restent directement visibles sur mobile.
10. Comportement, Butin, Lore et Liés peuvent être repliables sur mobile.
11. Les créatures liées privilégient le même donjon puis les relations explicites.
12. Un rail Liés permanent n'est autorisé que sur très grand desktop.
13. Les boss multi-phases utilisent une pile compacte desktop/tablette et des accordéons sur téléphone.
14. Le cadrage principal privilégie la silhouette complète et `contain` pour les figurines.
15. L'image principale s'ouvre en plein écran.
16. Filtres : recherche, Donjon, Catégorie, Menace, Tags.
17. Tris initiaux : Nom, Menace, Donjon.
18. Retour depuis une fiche : restauration de la recherche, des filtres, du tri, de la vue et du scroll.
19. L'accent du donjon reste narratif et ne remplace jamais les couleurs de gameplay.
20. Une donnée absente réduit la fiche, elle ne crée pas un panneau vide.

---

# 3. Bestiaire

## 3.1 En-tête

Le Bestiaire contient :

- titre et nombre de résultats ;
- recherche ;
- filtres ;
- tri ;
- bascule Galerie/Liste ;
- remise à zéro lorsque des filtres sont actifs.

La recherche est locale-first et ne dépend pas du réseau.

Les filtres actifs restent visibles et supprimables individuellement.

## 3.2 Galerie

La Galerie sert à reconnaître et explorer.

Une carte affiche uniquement :

- illustration ;
- nom ;
- donjon / contexte ;
- catégorie ;
- menace.

Elle ne devient jamais une mini-fiche de statistiques.

## 3.3 Liste

La Liste sert à arbitrer rapidement pendant une partie.

Une ligne affiche :

- petite vignette ;
- nom ;
- catégorie et donjon ;
- PV, ATK, DEF ;
- menace.

La ligne sélectionnée possède un état accessible clair, pas uniquement une couleur.

---

# 4. Persistance du contexte

Lors d'un retour au Bestiaire, restaurer :

- recherche ;
- filtres ;
- tri ;
- Galerie/Liste ;
- scroll ;
- sélection précédente si utile.

Sur téléphone, le retour doit replacer l'utilisateur à l'endroit exact de sa collection, autant que l'architecture le permet.

---

# 5. Fiche Créature

Hiérarchie verrouillée :

```text
1. Illustration / identité
2. Donjon / contexte
3. Catégorie / Menace / Socle
4. Statistiques
5. Capacité signature
6. Comportement / IA
7. Butin
8. Lore
9. Tags / métadonnées utiles
10. Entités liées
```

La partie utile en jeu précède la narration.

## 5.1 Identité

L'en-tête contient :

- nom ;
- donjon ;
- illustration ;
- catégorie ;
- menace ;
- socle.

Le donjon devient un lien vers son hub lorsqu'il existe.

## 5.2 Statistiques

Ordre stable :

`PV | ATK | DEF | PORTÉE / ZONE | ACTIONS`

La Menace reste dans l'identité et n'est pas dupliquée dans la bande de stats.

## 5.3 Capacité signature

La capacité principale vient immédiatement après les stats et reste visible sans interaction supplémentaire sur tous les appareils.

## 5.4 Comportement / IA

Bloc fonctionnel distinct :

- comportement ;
- priorité de cible ;
- règles existantes utiles.

## 5.5 Butin

Liste compacte ou mini-cartes selon le contenu.

Le terme **Butin** désigne la section de la fiche Créature. **Loot** reste le nom de la famille correspondante dans le Codex UI-3.

## 5.6 Lore

Le Lore vient après le gameplay et reçoit le traitement éditorial défini par UI-1.

---

# 6. Images et états média

UI-2 ne définit pas la stratégie de stockage des originaux. Elle applique UI-5 et la documentation technique.

Règles :

- la Galerie/Liste utilise des miniatures ou dérivés d'affichage ;
- la fiche utilise l'original local lorsqu'il est disponible, ou un dérivé adapté à l'affichage ;
- aucune optimisation UI ne remplace ni ne modifie l'original ;
- les conversions WebP/AVIF éventuelles concernent uniquement les **dérivés d'affichage**, jamais l'original sauvegardé ;
- lazy-loading hors premier viewport ;
- dimensions explicites pour limiter les sauts de layout ;
- aucun chargement massif des originaux.

États à distinguer :

- original local disponible ;
- original sauvegardé distant mais non téléchargé (`remote_only`) ;
- média réellement absent / indisponible.

Un média `remote_only` ne doit pas être présenté comme « image inexistante ». L'interface affiche un aperçu/placeholder cohérent et une action de récupération lorsque UI-5 l'autorise.

---

# 7. Boss et phases

## 7.1 Mini-boss

La fiche standard reste la base, avec le traitement de catégorie prévu par UI-1.

## 7.2 Boss multi-phases

Le regroupement de plusieurs entrées en phases d'un même boss n'est automatique **que si les données existantes permettent une relation non ambiguë et validée**.

Une convention de nom seule ne doit pas être devinée par l'UI si elle peut produire des faux regroupements.

Sans relation fiable :

- les entrées restent consultables séparément ;
- aucun changement de modèle n'est introduit par UI-2.

Lorsqu'un regroupement fiable existe :

- desktop/tablette : phases empilées verticalement ;
- téléphone : accordéons ;
- éviter des tabs qui masquent entièrement les autres phases.

---

# 8. Relations

Priorité :

1. même donjon ;
2. relations explicites ;
3. contenu directement associé par le modèle.

Le Bestiaire ne crée aucun système de recommandation opaque.

Les liens contextuels suivent les règles générales de UI-3 et doivent conserver un chemin de retour compréhensible.

---

# 9. Responsive

## Desktop

Sans sélection : collection large.

Avec sélection : collection + fiche, avec illustration importante. Un rail Liés est possible uniquement si la largeur reste confortable.

## Tablette paysage

Master-detail compact. La Liste est particulièrement adaptée lorsque la Galerie devient trop serrée.

## Tablette portrait

Fiche prioritaire. Le Bestiaire vit dans un drawer qui conserve son état.

## Téléphone

Bestiaire et fiche sont deux écrans successifs.

Toujours ouverts :

- identité ;
- stats ;
- capacité signature.

Repliables si utile :

- comportement ;
- Butin ;
- Lore ;
- Liés.

---

# 10. États incomplets

Gérer explicitement :

- aucune créature ;
- aucune correspondance de recherche ;
- filtres sans résultat ;
- média local absent mais distant disponible ;
- média indisponible ;
- capacité absente ;
- Butin absent ;
- Lore absent ;
- relation manquante ;
- cloud indisponible avec données locales disponibles.

Règle :

> **Une donnée absente réduit la fiche, elle ne crée pas un trou.**

---

# 11. Accessibilité et performance

Les règles chiffrées et tokens restent dans UI-1 et UI-6.

UI-2 ajoute seulement les obligations métier suivantes :

- carte/ligne entièrement activable avec focus visible ;
- catégorie compréhensible sans couleur seule ;
- visionneuse fermable au clavier ;
- drawer accessible ;
- accordéons avec état ouvert/fermé exposé ;
- aucun hover indispensable ;
- gros volumes testés sans charger tous les originaux.

---

# 12. Gate UI-2

UI-2 est validée lorsque :

1. une créature se retrouve rapidement dans un gros bestiaire ;
2. Galerie et Liste ont deux usages clairement distincts ;
3. la fiche hiérarchise correctement gameplay puis narration ;
4. le retour restaure le contexte de collection ;
5. le téléphone n'empile jamais collection complète puis fiche ;
6. la tablette dispose d'un vrai comportement dédié ;
7. les états média local / distant / absent sont compréhensibles ;
8. les boss multi-phases ne sont jamais regroupés sur une heuristique ambiguë ;
9. aucune règle de stockage média ou token visuel n'est dupliquée ici.

**UI-2 devient la source de vérité du Bestiaire et de la fiche Créature.**
