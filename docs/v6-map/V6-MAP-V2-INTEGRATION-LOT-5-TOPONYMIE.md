# V6-Map V2 — lot 5 : toponymie des cartes hors Entrevers

**Ajout validé du 02/10/2026 :** intégrer les 48 nouveaux noms des six continents hors Valdorie. Le [registre des lieux-dits et sa traçabilité](V6-MAP-V2-LIEUX-DITS-SIX-CONTINENTS.md) complète les sources historiques : ces noms sont désormais autorisés par le propriétaire.

**Amendement courant du 02/10/2026 :** le propriétaire demande l’extension du rendu MJ approuvé à tout l’atlas, sauf Entrevers. Brasserie et Enfer utilisent uniquement des lieux-dits, sans traitement de régions. Tous les libellés publics restent visibles en vue d’ensemble. Ce choix remplace les restrictions de rendu des amendements antérieurs ci-dessous. Voir [couverture, exceptions et traçabilité de l’extension](V6-MAP-V2-TOPONYMIE-MJ-ATLAS.md).

**But :** intégrer les noms validés comme libellés lisibles sur les cartes, dans une couche d’interface indépendante. **L’Entrevers est explicitement exclu de cette couche de toponymie.** Les commandes, noms accessibles ou liste de destinations nécessaires à son fonctionnement restent de l’interface de navigation, pas des toponymes superposés à sa fresque.

## Cartes couvertes

Le lot couvre onze fonds :

1. la mappemonde d’Ardéra ;
2. les sept cartes continentales : Austrébrume, Boréclat, Ferrécime, Pélagrève, Sahaldune, Sylvaronde et Valdorie ;
3. les cartes dimensionnelles de la Brasserie Céleste et de l’Enfer de la Sobriété Éternelle ;
4. la carte fille de la cité sous-marine de Pélagrève.

La carte fille demeure atteinte depuis Pélagrève. Ne pas lui créer une entrée principale supplémentaire ou un nom qui n’a pas été validé.

## Sources des noms et niveau de précision

Il n’existe pas encore un registre consolidé, carte par carte, de tous les libellés destinés à l’interface. Le lot doit établir ce registre à partir des sources V2, sans copier des propositions V1 abandonnées ni inventer des noms.

- Le [socle géographique d’Ardéra](V6-MAP-V2-SOCLE-GEOGRAPHIQUE-ARDERA.md) fait autorité pour les sept continents, leurs six régions respectives et les toponymes secondaires qu’il a conservés.
- Chaque [cahier continental](V6-MAP-MAITRE-V2.md) affine les noms, graphies, régions, merveilles et positions relatives propres à sa carte. Valdorie approuve notamment des toponymes secondaires (Avelorne, Rivombre, ruisseau des Saules, lac d’Ysambre, Collines de la Vieille Lande et Monts d’Escarbelle). Le cahier d’Austrébrume signale deux toponymes secondaires approuvés ; reprendre leurs graphies depuis le cahier courant.
- Le cahier de la Brasserie Céleste valide un catalogue de seize noms ; celui de l’Enfer en valide également seize. Leurs descriptions et compositions relatives guident un placement initial, mais ne donnent pas des coordonnées pixels validées.
- Pélagrève valide les noms géographiques documentés, mais **le nom propre de la cité sous-marine n’est pas arrêté**. Les noms d’agglomérations encore réservés dans les autres cahiers le restent également.
- Le [registre des donjons](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md) et les cahiers de zones font autorité sur leurs noms éditoriaux et leurs positions relatives. Un nom de donjon n’autorise pas à le rendre cliquable : le clic sur un donjon reste hors de cette version.

Pour chaque libellé, le registre de travail doit consigner au minimum : graphie exacte, carte parente, catégorie (continent/région/eau/relief/ville/lieu/donjon), statut (**VALIDÉ**, **RÉSERVÉ**, ou **PROPOSITION À ANNOTER**), source documentaire, ancre relative à l’image et statut de validation de cette ancre. Séparer le statut du nom de celui de sa position : un nom validé n’implique pas un point validé.

## Règles de placement

- Les noms et régions établis par la documentation peuvent être placés au premier passage à l’endroit le plus cohérent avec la carte réelle et leur description relative. Les ancres non spécifiées restent **PROPOSITION À ANNOTER / NON VALIDÉES** jusqu’à correction ou confirmation de l’utilisateur.
- Ne pas inventer le nom des cités, villages, sites sous-marins, mers ou reliefs restés sans nom. Un élément non nommé peut rester sans libellé ; s’il faut absolument le distinguer pour la navigation, demander un arbitrage plutôt que lui créer un nom canonique.
- Ne pas reconduire les toponymes ou subdivisions V1 signalés comme abandonnés dans les cahiers. Ne pas créer de nouvelle région ni altérer les six régions validées de chaque continent.
- La composition artistique relative de la Brasserie et de l’Enfer aide au positionnement, mais l’emplacement précis des libellés reste vérifiable sur les fonds finaux et annotable.
- Ne pas associer un libellé à un donjon masqué de façon à contourner le contrôle afficher/masquer acté. Le comportement conjoint de la visibilité des noms de donjons et du toggle des sprites doit rester cohérent avec le contrat du lot Donjons et être vérifié avec le propriétaire si le choix n’est pas déjà déterminé.
- Aucun libellé cartographique sur la fresque Entrevers. N’ajouter aucune fausse destination. Les contrôles de destination restent néanmoins accessibles au toucher, clavier et lecteur d’écran.

## Lisibilité et mise à l’échelle des textes

Les libellés sont des éléments d’interface, jamais du texte peint dans les WebP. Leur taille doit s’adapter à la taille réellement affichée de chaque carte sans devenir illisible :

- conserver une hiérarchie typographique simple entre noms majeurs et secondaires ;
- suivre le redimensionnement de la carte tout en définissant, après essais visuels, une taille plancher lisible aux formats téléphone, tablette et desktop ;
- éviter les chevauchements avec d’autres noms, hotspots et sprites ; déplacer une ancre de libellé ou utiliser un décalage de présentation sans changer l’ancre géographique sous-jacente ;
- préserver contraste, accents, apostrophes et graphie française exacte, sans masquer les éléments essentiels du fond ;
- vérifier à l’échelle réelle d’affichage, notamment la vue ajustée à l’écran sur tablette, et pas seulement en zoom rapproché.

Ne pas fixer arbitrairement une valeur typographique unique avant inspection des dimensions et du cadrage des cartes. Le but est une lecture immédiate, pas une densité maximale. Les libellés peuvent être organisés ou espacés pour préserver cette lisibilité ; ne pas supprimer silencieusement un nom validé pour résoudre un chevauchement.

## Livrables et gate

1. Inventaire de toponymie pour les onze fonds, avec source et statut nom/ancre.
2. Couche de libellés indépendante des images, sprites et hotspots.
3. Échelles typographiques adaptatives et comportement en cas de densité/chevauchement.
4. Revue visuelle des onze fonds sur téléphone, tablette et desktop ; test clavier/toucher et lecteur d’écran.
5. Validation utilisateur des ancres proposées et signalement explicite des noms réservés encore absents.

**Gate :** graphies conformes aux sources ; aucune invention ou survivance V1 ; aucune toponymie sur Entrevers ; textes lisibles à l’échelle d’usage et non chevauchés ; ancres non canonisées avant revue. Aucun bitmap n’est réédité par ce lot.

## Amendement de correction du 01/10/2026

Les cartouches sont supprimés ; serif classique légère, texte proportionnel au fond et faible halo de contraste. Sur téléphone en vue d'ensemble, les libellés secondaires et noms de donjons se lisent dans Détails (carte agrandie localement, sans recharge) ou dans l'index externe. Aucune suppression du catalogue des noms validés. Le registre complet des textes et les sources figurent dans l'amendement.

Voir [méthode, registre et vérification](V6-MAP-V2-CORRECTION-CARTOGRAPHIQUE-ARTISTIQUE.md). Les points numériques ne deviennent pas canoniques par cette implémentation.

## Amendement Valdorie du 02/10/2026 — maquette MJ approuvée

Pour **Valdorie uniquement**, la décision propriétaire suivante remplace l’absence de cartouches : régions sur parchemin illustré en arc, lieux plus petits, eaux sur bleu et mer à contour souple avec volutes. Le texte reste HTML, mesuré et adapté au fond. Les quinze noms sont conservés et la Mer des Trois Couronnes documentée est ajoutée. Aucun changement de sprites, de droits, d’IndexedDB ou de l’éviction du fond. Voir [rendu, ressources, décalages et traçabilité](V6-MAP-V2-VALDORIE-TOPONYMIE-MJ.md).

**Complément propriétaire du même jour :** les lieux-dits, rivières et lacs de Valdorie restent visibles en vue d’ensemble, y compris sur petit écran. Le propriétaire autorise expressément l’invention des deux noms réservés : **Brassefort** (cité fortifiée) et **Port-Rivombre** (grand port commercial). Catalogue public porté à 18 noms ; aucune autre création de nom ni modification des régions. La règle générale « ne pas inventer les noms réservés » reste applicable hors de ces deux créations autorisées et tracées.
