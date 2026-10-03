# V6-Map V2 — lot 2 : hiérarchie, interactions et placements

**Amendement prioritaire du 03/10/2026 :** sur les sept continents, zoom 100 % = régions et mers/océans ; zoom > 100 % = lieux-dits, rivières/lacs et donjons selon le bouton Donjons. Chaque nom de donjon ouvre une modale locale avec son titre, sans contenu métier pour le moment. Cette décision remplace les anciennes mentions « tous les libellés visibles » et « repères non ouvrants ». Entrevers reste sans texte ; les autres cartes conservent leur consultation. [Décision et traçabilité](V6-MAP-V2-LECTURE-ZOOM-CONTINENTS.md#évolution-du-03102026--couches-liées-au-zoom-et-modale).

**Amendement courant du 02/10/2026 :** les [cartouches MJ de donjons](V6-MAP-V2-DONJONS-CARTOUCHES-MJ.md) remplacent les sprites et la coupe souterraine. Les noms seuls sont raccordés aux pastilles, avec un point partagé pour Sanctuaire/Panthéon. Les planches propriétaire de Valdorie et Ferrécime priment sur les anciens placements. Les mentions de clics sur sprites ci-dessous s’entendent désormais comme repères non ouvrants ; navigation et éviction ne changent pas.

**But :** rendre les fonds consultables par navigation hiérarchique et relier les destinations connues. La carte reste un outil de consultation, pas une carte de déplacement.

## Parcours hiérarchique

- Entrée Map → Entrevers (racine).
- Clic sur Ardéra dans l’Entrevers → mappemonde d’Ardéra.
- Clic sur un continent dans Ardéra → fond du continent correspondant.
- Clic sur une dimension dans l’Entrevers → fond de cette dimension.
- Depuis Pélagrève, l’interaction clairement prévue pour la cité sous-marine ouvre sa carte fille.
- Chaque carte fille offre un retour vers son parent et un retour général au point d’entrée Map.
- Les Cimes Suspendues et autres merveilles ne deviennent pas des portails par le seul fait qu’elles soient cliquables dans une carte ; ne rendre cliquables que les destinations documentées par la hiérarchie ci-dessus.
- Un clic sur un sprite de donjon ne navigue pas et n’ouvre pas de fiche dans cette version. L’ouverture des donjons sera traitée dans un chantier ultérieur.

## Politique de hotspots

Les zones cliquables doivent suivre les formes et l’échelle de l’image réellement affichée, fonctionner au redimensionnement et être activables au pointeur comme au toucher. La couche de toponymie est traitée séparément au [lot 5](V6-MAP-V2-INTEGRATION-LOT-5-TOPONYMIE.md) ; ce lot 2 ne fixe pas de libellés. Utiliser des cibles accessibles (nom accessible, focus clavier et activation clavier) sans texte peint dans les bitmaps. Préserver le ratio de l’image et éviter qu’une zone ne se décale lors de la mise à l’échelle.

La forme, l’emprise et l’identifiant des hotspots doivent rester une couche de données distincte du fond illustré ; ne pas retoucher le bitmap pour ajouter les comportements.

## Repères de donjons provisoires

Le registre V2 établit des continents, régions et relations relatives mais ne fournit pas systématiquement de coordonnées pixels ou normalisées. Pour le premier rendu, choisir la position la plus cohérente avec la géographie documentée, sans inventer de région, relation ou nouvelle donnée de lore.

- Enregistrer chaque point provisoire dans un manifeste/cartouche technique propre à la carte, normalisé par rapport à la taille intrinsèque du fond, afin qu’il survive au redimensionnement.
- Marquer les points comme **PROPOSITION À ANNOTER / NON VALIDÉ**. N’utiliser le statut VALIDÉ qu’après correction ou confirmation explicite de l’utilisateur.
- Distinguer les deux points D3 et D4, les deux lieux D1 et D2 et les niveaux D5/D6 tels que décrit dans le registre. D5/D6 partagent un point planimétrique, mais ce plan documentaire n’autorise pas à inventer le comportement d’un choix de fiche ou des droits.
- D7 et D8 occupent chacun tout leur fragment dimensionnel : aucun marqueur intérieur.
- La proposition antérieure de coordonnées Sylvaronde D13 ne doit pas être promue au statut validé sans confirmation explicite.

## Gate

- Les parcours d’ouverture/retour couvrent Entrevers, Ardéra, les sept continents, les deux dimensions et la cité sous-marine.
- Les hotspots restent alignés à plusieurs tailles d’affichage et répondent au toucher/clavier.
- Chaque emplacement sans coordonnées canoniques est visiblement marqué comme proposition dans les livrables d’implémentation.
- Les clics sur les sprites de donjons ne prétendent pas encore ouvrir de donjon ou de fiche.

## Amendement de correction du 01/10/2026

Les boutons nommés de la fresque sont remplacés par des polygones cliquables sans texte. Le comptoir ambré représente Ardéra sur l'Entrevers validé ; jardin brassicole à droite, cité froide en bas à droite. Aucun clic de proximité sur les zones vides. Les alternatives clavier et listes de destinations restent hors peinture.

Voir [méthode, registre et vérification](V6-MAP-V2-CORRECTION-CARTOGRAPHIQUE-ARTISTIQUE.md). Les points numériques ne deviennent pas canoniques par cette implémentation.
