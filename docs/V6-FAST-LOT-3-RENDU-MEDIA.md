# V6-Fast Lot 3 — Rendu média, mémoire et overlays

## Objectif
Borner la consommation DOM/mémoire des vues Média et supprimer les reconstructions globales provoquées par le viewer, les toasts et les overlays.

## Préconditions
- Lire docs/V6-FAST.md.
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
