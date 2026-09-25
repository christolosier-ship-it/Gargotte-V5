> **ARCHIVE — chantier V6-Fast clos et fusionné dans V5.3 le 25/09/2026.**
>
> Historique technique uniquement. Ce document n'est plus normatif pour les travaux courants.

# V6-Fast Lot 3 — Rendu média, mémoire et overlays

## Statut

**IMPLÉMENTÉ — Gate automatisée validée le 25/09/2026.**

**Reste avant clôture complète : smoke sur iPad physique après merge.**

## Objectif
Borner la consommation DOM/mémoire des vues Média et supprimer les reconstructions globales provoquées par le viewer, les toasts et les overlays.

## Préconditions
- Lire docs/archive/v6-fast/V6-FAST.md.
- Lot 2 validé.
- Utiliser le MediaRepository créé au Lot 2.

## Travaux

### 1. Borner les grilles Média
Les vues Administration > Médias et Codex > Médias ne doivent plus monter toute la bibliothèque.

Mettre en place une stratégie bornée :
- virtualisation ;
- fenêtre glissante ;
- pagination ;
- ou mécanisme équivalent.

Critère : avec 400 médias, le nombre de cartes image réellement montées reste limité et ne croît pas jusqu'à 400 après une longue navigation.

Conserver recherche, filtres et modes de consultation existants.

### 2. Charger l'image seulement lorsqu'elle devient utile
Une carte hors écran ne doit pas provoquer le chargement de son Blob actif.

Utiliser IntersectionObserver ou la mécanique de virtualisation choisie.

loading=lazy seul n'est pas suffisant si le DOM et les Blob URLs sont déjà créés.

### 3. Qualité des détourages
Le détourage pleine résolution reste la source de référence.

Pour une carte petite, si les mesures montrent que décoder le plein fichier reste trop coûteux, créer une représentation temporaire depuis le détourage :
- dimensions adaptées à la taille CSS et au devicePixelRatio ;
- alpha conservé ;
- qualité visuelle sans perte perceptible à la taille rendue ;
- Blob temporaire révoqué à la destruction ;
- pas de persistance IndexedDB par défaut ;
- jamais de génération depuis l'ancien original blanc.

Fiche et plein écran continuent d'utiliser une version adaptée à leur taille, avec pleine résolution pour la consultation plein écran.

### 4. Isoler le viewer
openImageViewer et closeImageViewer ne doivent plus appeler le renderer global.

Créer un root/overlay indépendant.

Ouvrir puis fermer une image ne doit pas :
- remplacer #app ;
- recréer la grille derrière ;
- recréer les centaines d'images de la page ;
- perdre le scroll de la collection.

### 5. Isoler toasts et overlays
Les toasts, dialogs et drawers simples ne doivent pas forcer app.innerHTML = renderPage lorsque seule leur couche change.

Traiter au minimum :
- toast stack ;
- image viewer ;
- overlays fréquemment utilisés.

Ne pas réécrire toute l'application en framework. Corriger les zones réellement responsables des rerenders globaux.

### 6. Cycle de vie Object URL
À la fin de ce lot, le gestionnaire doit être borné.

Garanties :
- création à la demande ;
- référence associée à un consommateur ou contexte ;
- révocation à la sortie ;
- aucune URL zombie après destruction d'une carte ;
- aucune révocation prématurée d'une image encore affichée.

### 7. Stress test réaliste
Ajouter à la Full CI une fixture avec de vrais Blobs transparents.

Scénario minimal :
- bibliothèque importante ;
- scroll prolongé ;
- ouverture/fermeture répétée du plein écran ;
- changement de visuels ;
- retour collection.

Assertions déterministes recommandées :
- nombre de cartes montées borné ;
- nombre d'Object URLs vivantes borné ;
- #app non remplacé par ouverture/fermeture viewer ;
- aucun message d'erreur global ;
- aucune image encore montée ne référence une URL révoquée.

Ne pas prétendre mesurer précisément la RAM WebKit depuis Playwright si l'API n'est pas fiable.

## Gate
Le lot est validé si :
- les vues Média ne montent plus 400 cartes simultanément ;
- scroller longtemps ne fait pas croître indéfiniment le DOM actif ;
- ouvrir/fermer le viewer ne rerend plus l'application ;
- les Object URLs sont libérées ;
- la qualité des détourages reste excellente ;
- un scénario répété de plein écran ne provoque plus de panne dans les tests et lors d'un smoke iPad réel ;
- les données restent intactes ;
- Fast + Full ciblée passent.


## Bilan d'exécution — 25/09/2026

### Bibliothèques Média bornées
Les deux vues concernées utilisent une pagination bornée à **48 cartes maximum** :
- Administration > Médias ;
- Codex > Médias.

La recherche, les filtres et le tri continuent de porter sur la bibliothèque complète. Seule la tranche rendue est limitée.

Les changements de page utilisent un rendu local du sous-arbre Média et ne reconstruisent pas tout `#app`.

### Rendus Média locaux
Les actions suivantes ont été sorties du renderer global lorsqu'elles ne concernent que la bibliothèque Média :
- page précédente / suivante ;
- recherche Administration Média ;
- recherche Codex Média ;
- scope / filtres ;
- mode Galerie / Liste du Codex Média ;
- sélection d'un média ;
- rattachement ;
- upload ;
- retour depuis la fiche Média.

Un compteur `mediaPartialRenders` permet aux tests de distinguer ces mises à jour d'un `render()` global.

### Viewer, toasts et Journal
Deux roots indépendants de `#app` sont créés au runtime :
- `#toast-root` ;
- `#overlay-root`.

Le viewer image :
- n'appelle plus `render()` à l'ouverture ;
- n'appelle plus `render()` à la fermeture ;
- ne remplace plus la grille derrière ;
- conserve le scroll ;
- restaure le focus sur la carte exacte grâce à `mediaId` / `mediaType`.

Les toasts ne déclenchent plus aucun rendu global.

Le Journal est également rendu dans le root d'overlay et son ouverture/fermeture ne reconstruit plus l'application.

Les modales Atelier restent volontairement dans `#app`, car elles dépendent directement de l'état d'édition.

### Dépendance cachée découverte
Le premier run Fast a révélé que l'Atelier dépendait implicitement de l'ancien comportement de `toast()` : après une sauvegarde, le toast déclenchait autrefois le `render()` qui rafraîchissait le statut « Enregistré localement ».

Correction :
- l'Atelier déclenche maintenant explicitement son rendu parce que les données ont changé ;
- le toast reste totalement indépendant.

La Fast repasse sans assouplissement du test Atelier.

### Cycle de vie Object URL
Garanties validées :
- création à la demande ;
- maximum structurel borné par la page active ;
- révocation lors des changements de page, recherche, filtre ou contexte ;
- réutilisation de l'URL active par le viewer ;
- aucune croissance cumulative au fil de plusieurs pages ;
- aucune URL globale recréée au simple open/close du viewer.

Le stress automatisé confirme :
- **cartes Média montées <= 48** ;
- **Object URLs vivantes <= 48**.

### Qualité des détourages
Aucune représentation basse définition temporaire n'a été ajoutée.

Décision du Lot 3 :
- le détourage pleine qualité reste la source active ;
- le plein écran utilise la source active haute qualité ;
- la pagination + le chargement à la demande bornent suffisamment le nombre de consommateurs simultanés dans les tests actuels ;
- aucun nouveau Blob d'affichage n'est persisté.

Une réduction transitoire calculée depuis le détourage pourra être étudiée uniquement si un smoke matériel montre encore une pression mémoire mesurable.

### PWA
- version application : **5.6.3** ;
- cache : `gargottex-v6-fast-media-render-v1`.

La Full CI se déclenche également sur les changements de `styles.css`.

### Stress test réaliste
La Full CI crée **420 médias** comportant de vrais Blobs PNG transparents 768x768.

Le scénario :
1. ouvre le Codex Média ;
2. vérifie 48 cartes maximum ;
3. parcourt plusieurs pages ;
4. contrôle que le nombre d'Object URLs ne croît pas ;
5. change plusieurs visuels ;
6. ouvre et ferme le plein écran 12 fois ;
7. vérifie que le nœud de grille reste le même ;
8. vérifie que le compteur `renderCalls` ne bouge pas pendant le viewer ;
9. vérifie le scroll avant/après chaque open/close.

Le premier run du nouveau test attribuait à tort au viewer le scroll provoqué par Playwright lorsqu'il amenait une nouvelle carte à l'écran. Le test a été corrigé pour mesurer le scroll juste autour de chaque ouverture/fermeture, sans réduire les invariants DOM/mémoire.

### Validation CI finale
Fast :
- **12/12 tests** ;
- **37,8 s Playwright**.

Full :
- **22/22 tests** ;
- **58,3 s Playwright** ;
- stress 420 médias : **7,4 s** ;
- WebKit iPad : **16,1 s** ;
- IndexedDB historique : OK ;
- Service Worker / offline : OK ;
- détourages : OK.

## Gate — résultat automatisé
- vues Média bornées : **OK**
- longue navigation sans croissance DOM illimitée : **OK**
- viewer sans reconstruction globale : **OK**
- Object URLs bornées et libérées : **OK**
- qualité des détourages conservée : **OK**
- stress répété plein écran en Chromium : **OK**
- smoke WebKit format iPad : **OK**
- données intactes : **OK**
- Fast + Full : **OK**
- smoke sur iPad physique : **À VALIDER APRÈS MERGE**

**Lot 3 techniquement prêt. La clôture complète attend uniquement le smoke matériel iPad.**
