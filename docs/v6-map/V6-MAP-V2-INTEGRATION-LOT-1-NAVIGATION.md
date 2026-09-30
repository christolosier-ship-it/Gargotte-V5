# V6-Map V2 — lot 1 : inventaire et entrée de navigation

**But :** relier l’entrée Map au shell applicatif et établir un manifeste fiable des cartes qui seront consultées. Ne pas modifier les images ni les autres fonctionnalités.

## Travail attendu

1. Vérifier le contenu exact de `assets/maps/` et `assets/sprites/` : chemin, nom, extension, dimensions et taille des fichiers. Le manifeste est documentaire ; il ne renomme pas les assets.
2. Confirmer douze cartes : Entrevers, Ardéra, sept continents, deux cartes de dimension et la carte fille de la cité sous-marine de Pélagrève. Confirmer les treize sprites présents et leur correspondance D1–D6/D9–D15.
3. Ajouter l’entrée « Map » dans le même groupe de navigation fonctionnelle que « Brouhaha » : immédiatement sous Brouhaha sur tablette et desktop, et dans le sous-menu « Jeu » sur téléphone.
4. Ajouter un état/vue Map sans toucher à la navigation existante au-delà de ce point d’entrée et du retour depuis les vues cartographiques.
5. Ne pas lister la Trame astrale comme destination ou asset attendu.

## Garde-fous

- Ne pas précharger les images au démarrage.
- Ne pas modifier les routes ou états métier existants sans nécessité démontrée.
- Aucun changement IndexedDB, backend, Blobs, Service Worker global ou pipeline média dans ce lot.
- Ne pas déduire que le bouton Map constitue une permission ou un filtrage de confidentialité.

## Gate

- Le manifeste correspond aux fichiers réellement versionnés ; chaque entrée listée est présente, chaque carte attendue est identifiée.
- Le bouton apparait à l’emplacement prévu sur desktop, tablette et téléphone.
- Le menu Brouhaha et les parcours existants restent fonctionnels.
- Aucun asset cartographique n’est chargé avant l’ouverture de Map.
