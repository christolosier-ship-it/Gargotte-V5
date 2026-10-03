# V6-Map V2 — plan maître d’intégration

**Amendement prioritaire du 03/10/2026 :** sur les sept continents, zoom 100 % = régions et mers/océans ; zoom > 100 % = lieux-dits, rivières/lacs et donjons selon le bouton Donjons. Chaque nom de donjon ouvre une modale locale avec son titre, sans contenu métier pour le moment. Cette décision remplace les anciennes mentions « tous les libellés visibles » et « repères non ouvrants ». Entrevers reste sans texte ; les autres cartes conservent leur consultation. [Décision et traçabilité](V6-MAP-V2-LECTURE-ZOOM-CONTINENTS.md#évolution-du-03102026--couches-liées-au-zoom-et-modale).

**Amendement de lecture du 02/10/2026 :** [surface utile et zoom progressif des sept continents](V6-MAP-V2-LECTURE-ZOOM-CONTINENTS.md), avec réduction de 25 % des libellés superposés sur toutes les cartes. Les noms, points, affichage/masquage et éviction du cache ne changent pas.

**Amendement propriétaire du 02/10/2026 :** les [repères MJ de donjons](V6-MAP-V2-DONJONS-CARTOUCHES-MJ.md) remplacent l’affichage des sprites sur toutes les cartes : pastilles, traits, cartouches avec noms seuls. Les points de Valdorie et Ferrécime suivent les nouvelles planches fournies. Les sprites restent conservés, hors affichage ; les descriptions de rendu sprite ci-dessous sont historiques. Les décisions afficher/masquer et éviction restent verrouillées.

**Statut : implémentation réalisée sur la PR #65, en attente de revue.** Les décisions « afficher/masquer les donjons » et « évincer la carte du cache après l’avoir quittée » restent ACTÉES ET VERROUILLÉES. Ce document conserve le contrat initial et ajoute en fin de document la traçabilité du code, des tests et des limites de vérification. Ce document décrit l’intégration des cartes déjà validées dans Gargotte-V5 ; il n’autorise aucun changement runtime, backend, IndexedDB ou média métier. Les lots détaillés sont liés ci-dessous.

## Décisions de périmètre

- La Trame astrale est retirée de la fonctionnalité Map et de sa navigation. Aucune carte Trame n’est attendue. Cette décision ne réécrit pas les autres éléments de cosmologie du lore.
- Les cartes sont considérées validées par le propriétaire. Aucune nouvelle génération ou retouche artistique n’est dans ce chantier.
- Les fichiers d’intégration sont ceux du dépôt : `assets/maps/` et `assets/sprites/`. Le lot ne doit pas les déplacer ni les réencoder.
- La cité sous-marine est une carte fille cachée, accessible depuis la carte de Pélagrève ; elle n’est pas une entrée principale de la galerie.
- Les clics naviguent dans la hiérarchie cartographique. Les clics sur un donjon ne l’ouvrent pas encore ; leur ouverture est une évolution ultérieure.

## Inventaire de départ

À vérifier contre les chemins exacts du dépôt pendant le lot d’inventaire, sans renommer les fichiers :

| Niveau | Contenus attendus |
|---|---|
| Univers | Entrevers |
| Monde | Ardéra |
| Continent | Austrébrume, Boréclat, Ferrécime, Pélagrève, Sahaldune, Sylvaronde, Valdorie |
| Carte fille | Cité sous-marine de Pélagrève |
| Dimensions | La Brasserie Céleste, L’Enfer de la Sobriété Éternelle |
| Sprites conditionnels | Treize illustrations D1–D6 et D9–D15 ; D7 et D8 sont représentés par leur carte dimensionnelle entière, sans marqueur interne |

Cela représente douze fonds de carte et treize sprites de donjons, selon l’inventaire attendu des dossiers actuels. Le manifeste final du lot doit faire foi pour les noms de fichiers réels. Ne pas inclure de vue Trame ni inventer D7/D8 intérieur.

## Architecture de consultation

- Ajouter « Map » au menu principal de jeu, immédiatement sous « Brouhaha » sur tablette et desktop.
- Sur téléphone, l’entrée « Map » est dans le même sous-menu « Jeu » que « Brouhaha ».
- L’ouverture montre la vue racine Entrevers ; depuis Entrevers, une dimension ouvre sa carte, Ardéra ouvre sa mappemonde, puis un continent ouvre son fond.
- Depuis Pélagrève, une interaction identifiée sur la carte ouvre la carte fille de la cité sous-marine.
- Les cartes filles ont un retour clair vers leur parent. La navigation ne signifie pas déplacement ou portail dans le lore.
- Le bouton afficher/masquer les donjons est ACTÉ et VERROUILLÉ : il agit simplement sur la présentation, sans accès campagne ou permissions.

## Placements cartographiques

Le registre des implantations conserve l’autorité sur les régions et positions relatives. Là où aucun point exact n’est défini, l’implémentation peut placer provisoirement le repère à l’endroit le plus cohérent avec la documentation et la géographie visible. Ces coordonnées initiales doivent être signalées comme **PROPOSITION À ANNOTER**, jamais comme lore ou placement canonique validé. L’utilisateur pourra annoter les cartes et demander les corrections avant que les emplacements soient déclarés validés. D7/D8 n’ont pas de hotspot intérieur.

## Médias, chargement et cache

- Charger le fond et les sprites seulement à l’ouverture de la vue concernée ; ne pas précharger toutes les cartes au démarrage.
- L’éviction de la carte après l’avoir quittée est ACTÉE ET VERROUILLÉE : à la sortie d’une vue, libérer ses ressources décodées et retirer ses fichiers de la zone de cache applicative dédiée aux cartes, sans toucher au cache général de l’application, aux données utilisateur, à IndexedDB ou aux Blobs.
- Ne pas promettre l’accès hors ligne après fermeture/quitte de la carte : selon la décision actuelle, les ressources cartographiques ne sont conservées que pendant leur consultation. Sans réseau et sans carte encore en mémoire/cache actif, la réouverture peut nécessiter une connexion.
- Éviter que le Service Worker remette les cartes évincées dans le cache général. Le détail de réalisation doit être vérifié sur la stratégie de cache actuelle au lot 4.
- Les cartes sont des assets applicatifs statiques, distincts des images de donjons métier et du pipeline média/IndexedDB.

## Transparence du bouton Donjons

Le contrôle « afficher/masquer » n’est pas une barrière de confidentialité : les sprites intégrés au client peuvent être téléchargés ou inspectés, et le masquage visuel ne protège ni image ni emplacement. Le périmètre demandé est un affichage cartographique simple, pas une visibilité par campagne ou un filtrage autorisé serveur. La conséquence est connue et acceptée dans ce périmètre : le toggle n’ajoute aucune confidentialité ou permission par campagne.

## Hors périmètre explicite

- Trame astrale, nouvelles cartes, nouvelle génération graphique ou réoptimisation des assets déjà optimisés.
- Ouverture d’une fiche ou d’une carte dédiée au clic sur un donjon (fonction future).
- Édition de carte, placement sauvegardé, déplacement de personnage, portail ou mécanique de jeu.
- Droits MJ/joueur par campagne, API/backend, migration V7, IndexedDB, Blobs ou changement d’identifiants métier.
- Modifications des cartes et sprites eux-mêmes.

## Découpage et gates

1. [Lot 1 — inventaire et intégration de navigation](V6-MAP-V2-INTEGRATION-LOT-1-NAVIGATION.md)
2. [Lot 2 — hiérarchie, interactions et placements](V6-MAP-V2-INTEGRATION-LOT-2-INTERACTIONS-PLACEMENTS.md)
3. [Lot 3 — affichage des sprites de donjons](V6-MAP-V2-INTEGRATION-LOT-3-DONJONS.md)
4. [Lot 4 — chargement, éviction et validation](V6-MAP-V2-INTEGRATION-LOT-4-CACHE-VALIDATION.md)
5. [Lot 5 — toponymie des cartes hors Entrevers](V6-MAP-V2-INTEGRATION-LOT-5-TOPONYMIE.md)

Le lot 5 couvre les libellés des fonds Ardéra, des sept continents, des deux dimensions et de la carte fille de la cité sous-marine. L’Entrevers est explicitement exclu de la couche de toponymie cartographique.

Les validations doivent rester ciblées et légères : inventaire/manifeste exact, navigation bout-en-bout, affichage/masquage, taille et contour des sprites, toponymie, cycle d’entrée/sortie de carte, responsive tablette/desktop/téléphone, et absence de régression dans les parcours existants. Pas d’assertions fragiles de pixels ou de durée. Aucune gate ne doit impliquer d’effacement de cache global, d’IndexedDB ou de données utilisateur.

## Traçabilité de l’implémentation — PR #65

Audit effectué le 1er octobre 2026 sur le code de la branche `feat/v6-map-v2-integration`. Le commit de code testé est `85d02651df829156f888c7feabe359795d0584e7`; les deux workflows de ce commit sont réussis : **V6-Fast CI #263** (Chromium) et **V6-Fast full validation #114** (Chromium + WebKit/iPad). Les changements qui suivent dans cette PR portent sur cette trace documentaire.

| Lot | Contrat vérifié | Implémentation repérée | Vérification / résultat |
|---|---|---|---|
| [Lot 1 — inventaire et navigation](V6-MAP-V2-INTEGRATION-LOT-1-NAVIGATION.md) | 12 fonds de carte, 13 sprites et entrée Map sous Brouhaha / sous-menu Jeu sur téléphone. Aucun accès Trame. | Les répertoires `assets/maps/` et `assets/sprites/` contiennent respectivement 12 et 13 fichiers attendus. Les noms sont référencés dans `src/map-v2.js`; l’entrée responsive et la vue sont dans `src/app.js`. Aucun fond ni sprite n’a été modifié par la PR. | Test Playwright du menu téléphone et ouverture de Map ; CI #263 et #114 réussies. Les chemins et décomptes sont vérifiés. Cette trace ne publie pas de manifeste des dimensions en pixels ni des tailles octet de chaque image. |
| [Lot 2 — hiérarchie, interactions et placements](V6-MAP-V2-INTEGRATION-LOT-2-INTERACTIONS-PLACEMENTS.md) | Navigation Entrevers → Ardéra → continents, dimensions depuis Entrevers, cité sous-marine depuis Pélagrève, retours vers parent. Les sprites ne sont pas ouvrants. | `MAPS`, `CONTINENTS` et les hotspots de `src/map-v2.js` portent la hiérarchie et les actions. Ardéra a sept hotspots continentaux ; Pélagrève ouvre la carte fille. | Tests couvrent Ardéra, Valdorie, Pélagrève, la cité, les deux dimensions et les retours. Les positions de navigation codées sont des ancres d’interface à confirmer visuellement. |
| [Lot 3 — affichage des donjons](V6-MAP-V2-INTEGRATION-LOT-3-DONJONS.md) | Sprites redimensionnés avec contour lumineux ; bouton afficher/masquer verrouillé ; aucun clic ouvrant un donjon ; D7/D8 sans marqueur intérieur. | Les 13 fichiers sont inventoriés dans `assets/sprites/` et leurs noms/ancres sont déclarés dans `DUNGEONS` de `src/map-v2.js`. D5/D6 sont présentés ensemble sur leur ancre commune ; le bouton et `aria-pressed` reflètent l’état. `styles.css` adapte l’échelle et le contour. | Test Playwright vérifie les 9 images Valdorie, le masquage/réaffichage et l’absence de bouton donjon sur les dimensions ; l’inventaire confirme les 13 fichiers. Vérification visuelle fine de chaque carte non automatisée. |
| [Lot 4 — cache et validation](V6-MAP-V2-INTEGRATION-LOT-4-CACHE-VALIDATION.md) | Chargement à la demande ; cache Map distinct ; éviction quand Map ou la carte courante est quittée ; pas de purge du cache général ou des données. | `service-worker.js` isole les assets `assets/maps/` et `assets/sprites/` dans `map-v2-active-v1`, avec stratégie réseau et secours ciblé. Le message `MAP_V2_EVICT` supprime ce cache dédié. `src/app.js` évince en sortant de Map ; `src/map-v2.js` évince lors d’un changement de carte et à `pagehide`. | Test Playwright dédié « Map V2 caches only the active map and evicts the cache on exit » vérifie le cache actif, le remplacement Entrevers → Ardéra et le cache vide à la sortie. Il passe dans CI #263 et #114. |
| [Lot 5 — toponymie](V6-MAP-V2-INTEGRATION-LOT-5-TOPONYMIE.md) | Noms issus des sources V2, superposés à l’interface ; aucun toponyme sur Entrevers ; tailles adaptatives ; carte fille sans nom inventé. | Les entrées `toponyms` de `src/map-v2.js` sont des couches HTML et `styles.css` ajuste tailles et catégories selon l’écran. Les libellés de dimensions sont présents ; Entrevers et la cité sous-marine n’ont pas de couche de toponymes. Les 100 graphies uniques référencées dans les tableaux de toponymie ont été retrouvées dans les cahiers/socle V2 actifs après normalisation des apostrophes et espaces. | Tests vérifient l’absence sur Entrevers, les 16 libellés de chaque dimension, et afficher/masquer les toponymes de Valdorie. Les chevauchements, la lisibilité à taille réelle et la confirmation des ancres restent des points de revue visuelle/propriétaire ; aucune position provisoire n’est déclarée canonique. |

### Résultat de l’audit et réserves explicites

- **Contrat fonctionnel couvert** : entrée responsive, hiérarchie, 12 fonds et 13 sprites versionnés, contrôle des donjons, couches de toponymie et cache Map dédié.
- **Contrôles automatisés** : navigation, retour, toggle, compte de libellés et cache d’ouverture/éviction passent sur le commit indiqué ci-dessus.
- **À conserver comme provisoire** : les ancres numériques des hotspots, donjons et toponymes dont le registre ne fixe pas de point exact. D5/D6 partagent l’ancre planimétrique, avec deux visuels associés.
- **À annoter en revue visuelle** : lisibilité/chevauchement des textes et sprites sur les fonds réels aux tailles téléphone, tablette et desktop. Les graphies citées proviennent des sources V2 ; une correction utilisateur des positions demeure attendue.
- **Hors périmètre et inchangé** : optimisation/re-encodage des WebP, édition des fonds, données métier, IndexedDB, Blobs, backend et droits de campagne.
- La PR est **non fusionnée**. Le statut « Ready for review » concerne uniquement l’ouverture de la revue du code ; les réserves cartographiques ci-dessus restent visibles et annotables.

## Amendement du 01/10/2026 — correction après revue visuelle

La PR #65 est désormais fusionnée. La traçabilité ci-dessus décrit **son état historique**, avant la correction dédiée ; ses positions et son appréciation artistique ne valent pas validation propriétaire.

La [séquence de correction cartographique et artistique](V6-MAP-V2-CORRECTION-CARTOGRAPHIQUE-ARTISTIQUE.md) détaille les corrections réalisées, les sources, les treize ancrages de sprites, le registre complet des libellés et les limites de QA. Elle remplace la présentation initiale à cartouches et boutons nommés sur l'Entrevers, mais **ne remplace aucune des deux décisions verrouillées**.

Traçabilité actuelle : noms/médias dans `src/map-v2-data.js` ; points, échelles, dimensions et polygones dans `src/map-v2-cartography.js` ; DOM/interactions dans `src/map-v2.js` ; typographie et points d'appui dans `styles.css`. Les deux nouveaux modules font partie du cache de shell, sans précharger les images. La navigation attend l'éviction de l'ancien cache Map avant de créer les requêtes du nouveau fond. Les toggles et Détails conservent le DOM des images.

Les contrôles de correction complètent les cinq lots ; les coordonnées restent proposées et la revue Safari/iPad réelle ainsi que l'approbation artistique restent attendues.

### Références d'autorité conservées

- [Maître documentaire V2](V6-MAP-MAITRE-V2.md) et [registre des implantations](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md).
- [Socle géographique d’Ardéra](V6-MAP-V2-SOCLE-GEOGRAPHIQUE-ARDERA.md) et cahiers continentaux/dimensionnels cités par le maître.
- `AGENTS.md` pour les règles de sécurité et invariants applicatifs.
