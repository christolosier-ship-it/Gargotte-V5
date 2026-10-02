# V6-Map V2 — surface utile, zoom et textes à 75 %

## Décision propriétaire du 02/10/2026

Améliorer la surface utile et le zoom des **sept continents uniquement**. Réduire de **25 % tous les textes cartographiques de toutes les maps**, y compris régions, lieux-dits, eaux, destinations et noms de donjons. La réduction concerne les libellés superposés, pas les menus, titres de page, commandes ou index textuels. Entrevers reste sans toponymie.

Les noms, ancres, fonds et marqueurs existants sont conservés. Aucun sprite ne revient à l’affichage. Afficher/masquer les donjons et éviction du fond au départ restent verrouillés.

## Surface de consultation

Les continents affichent un titre et une barre compacte. Les paragraphes répétitifs précédant la carte sont retirés de l’affichage continental, sans retirer les noms de l’index. Le fond utilise toute la largeur disponible, dans une fenêtre défilante dont la hauteur suit l’écran. Pélagrève conserve son orientation portrait : la consultation verticale reste nécessaire.

Les cartes mondiales, dimensionnelles, Entrevers et la cité sous-marine conservent leurs commandes Détails et leur disposition précédente ; leurs libellés reçoivent néanmoins la réduction typographique.

## Zoom progressif continental

- Zoom local de 100 à 400 %, par boutons +/− (pas de 25 points), curseur ou pincement à deux doigts.
- Déplacement de la carte au doigt ou par glisser à la souris ; défilement natif et clavier de la fenêtre restent disponibles.
- Le geste de déplacement ne déclenche pas une destination ; un clic/tap simple et le clavier conservent les hotspots existants, notamment la cité sous-marine de Pélagrève.
- Le zoom préserve le point consulté autour du centre de la fenêtre ou du pincement. Ctrl+molette dans la carte prend en charge le geste équivalent d’un trackpad ; le défilement normal n’est pas détourné.
- Détails agrandit le continent à au moins 150 % et, si possible, 900 px de largeur ; Vue d’ensemble revient à 100 % et au début du fond.
- À chaque ouverture de carte, le zoom revient à 100 %. Il n’est pas enregistré dans IndexedDB ou la campagne.
- Le fond d’image, les toponymes, les marqueurs et les contours restent dans le même repère. Le zoom change la largeur du cadre, pas les coordonnées ni le fichier image. Aucun nouveau téléchargement de fond ou de sprite n’est nécessaire.

Le zoom est un agrandissement d’affichage, pas un réencodage ou une amélioration artificielle de la résolution du fond. Les textes restent proportionnels jusqu’à leurs plafonds de lecture ; zoomer n’augmente pas indéfiniment leur taille.

## Réduction typographique exacte

`MAP_TEXT_SCALE = 0.75` dans `src/map-v2-toponyms.js`. Pour les libellés publics, le moteur calcule d’abord la taille ajustée selon les anciennes règles, puis applique le facteur 0,75 et remesure le texte. Ainsi, à **largeur de fond identique**, la taille est 25 % inférieure à la baseline précédente, même pour un nom long qui demandait déjà une réduction.

Les noms de donjons reçoivent le même facteur sur leur ancienne formule responsive. Les parchemins/cartouches et espacements se réadaptent au texte réduit. Leurs centres de présentation peuvent se recaler pour éviter les collisions, mais les points géographiques ne changent pas. Une surface plus grande ou un niveau de zoom différent peut donner une taille apparente différente : la comparaison à −25 % se fait à largeur égale.

En vue d’ensemble sur téléphone, les noms sont volontairement petits ; zoom, Détails et index textuel restent disponibles. Aucun mode Lecture, filtre de décor, nouveau lieu ou suppression de libellé n’est ajouté.

## Traçabilité

- `src/map-v2.js` : contrôles continentaux, zoom borné, conservation du repère consulté, pointeurs et suppression du clic après déplacement, nettoyage de l’observation à la sortie.
- `src/map-v2-toponyms.js` : facteur partagé 0,75 et mesures des textes/cartouches après réduction ; recalcul du placement aux nouvelles dimensions.
- `styles.css` : surface continentale élargie, en-tête compact, barre de zoom, fenêtre tactile bornée.
- `tests/v6-fast/fast.spec.mjs` : contrôle des sept continents, limites 100/400, image DOM conservée, réduction typographique à largeur égale et pincement Chromium. Les tests existants protègent les douze cartes, les 48 lieux-dits, les treize donjons, navigation et cache.

## Validation

La suite Fast passe **31/31 tests**. La revue artistique couvre les douze cartes en trois formats et deux modes : **72 captures sans collision entre libellés, débordement horizontal ni erreur de page/ressource**. Le test du zoom contrôle les sept continents, la réduction typographique à largeur égale et le pincement simulé Chromium. Un contrôle complémentaire du glisser à la souris confirme le déplacement de Pélagrève sans changement de carte, erreur navigateur ou nouvelle requête du fond pendant le zoom/déplacement. Les **10/10 tests Map passent à nouveau** après le dernier ajustement de hauteur disponible.

Le guide de vérification navigateur est appliqué avec Playwright en repli au CLI indisponible. Les gestes simulés Chromium ne remplacent pas une revue sur iPad physique/Safari.

Aucune modification d’IndexedDB, backend, fonds, assets sprites ou logique d’éviction du cache.
