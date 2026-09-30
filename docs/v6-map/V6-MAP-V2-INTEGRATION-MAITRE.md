# V6-Map V2 — plan maître d’intégration

**Statut : plan documentaire proposé, prêt à servir de base à l’implémentation après revue. Les décisions « afficher/masquer les donjons » et « évincer la carte du cache après l’avoir quittée » sont ACTÉES ET VERROUILLÉES.** Ce document décrit l’intégration des cartes déjà validées dans Gargotte-V5 ; il n’autorise aucun changement runtime, backend, IndexedDB ou média métier. Les lots détaillés sont liés ci-dessous.

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

Les validations doivent rester ciblées et légères : inventaire/manifeste exact, navigation bout-en-bout, affichage/masquage des sprites, cycle d’entrée/sortie de carte, responsive tablette/desktop/téléphone, et absence de régression dans les parcours existants. Pas d’assertions fragiles de pixels ou de durée. Aucune gate ne doit impliquer d’effacement de cache global, d’IndexedDB ou de données utilisateur.

## Sources d’autorité

- [Maître documentaire V2](V6-MAP-MAITRE-V2.md) et [registre des implantations](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md).
- [Socle géographique d’Ardéra](V6-MAP-V2-SOCLE-GEOGRAPHIQUE-ARDERA.md) et cahiers continentaux/dimensionnels cités par le maître.
- `AGENTS.md` pour les règles de sécurité et invariants applicatifs.
