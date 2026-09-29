# V6-Map V2 — L'Entrevers : hub unique de consultation

**STATUT : CONCEPT DE NAVIGATION ET DIRECTION ARTISTIQUE VALIDÉS PAR LE PROPRIÉTAIRE ; COMPOSITION EXACTE, HOTSPOTS, FORMAT NATIF ET RENDU FINAL EN ATTENTE.** Document de cadrage, pas un ordre de génération immédiate ni une modification du runtime.

Références : `AGENTS.md`, `V6-MAP-MAITRE.md` pour les réalités géographiques et distinctions de lore, `V6-MAP-PIVOT-V2-FEUILLE-DE-ROUTE.md` et `V6-MAP-PIVOT-V2-ARCHITECTURE-DOCUMENTAIRE.md` pour l'arborescence V2, `V6-MAP-V2-REGISTRE-IMPLANTATIONS.md` pour D1–D15, `V6-MAP-V2-SIX-CONTINENTS-CADRAGE.md` pour les continents. Brief de production graphique séparé : [`V6-MAP-V2-ENTREVERS-BRIEF-GRAPHIQUE.md`](V6-MAP-V2-ENTREVERS-BRIEF-GRAPHIQUE.md).

## 1. Décisions utilisateur à préserver

1. **SIMPLIFICATION VALIDÉE : une seule map illustrée Entrevers**, servant d'entrée globale et représentant **le monde d'Ardéra, les plans et les dimensions** disponibles. Chaque destination accessible se sélectionne directement sur cette illustration, puis ouvre **sa propre carte indépendante**. Il ne s'agit ni de dessiner toutes les cartes détaillées simultanément ni d'utiliser un zoom dans la fresque pour changer de géographie.
2. **Concept visuel retenu : « Le Grand N'importe Quoi Primordial ».** Une composition cosmique fantasy-cartoon gargottienne volontairement absurde, foisonnante, joyeusement désordonnée et grivoise. Refus des propositions initiales de taverne cosmique, comptoir/plateau et carrousel/astrolabe : ne pas les réintroduire comme architecture de l'Entrevers.
3. **Plusieurs géantes adultes façon pin-up fantasy**, plantureuses, extravagantes et au milieu d'une fête interdimensionnelle manifestement trop arrosée, constituent les figures dominantes de la fresque. L'apparence de nudité est **suggérée uniquement** : les parties intimes sont toujours intégralement masquées dans l'image visible par les réalités, le globe d'Ardéra, les nuages, cheveux, drapés ou accessoires. Ton suggestif, provocateur et burlesque, **sans nudité explicite ni acte sexuel**. Les personnages secondaires associés aux gags sont adultes.
4. **Ardéra au premier plan narratif et interactif.** Le monde matériel, représenté comme globe/disque-cartographie identifiable, se retrouve dans une position incongrue auprès de la géante centrale, **au niveau du décolleté ou entre ses cuisses vêtues/occultées**. Ces deux variantes ont été évoquées, mais **aucun emplacement final n'a encore été arbitré**. La zone de carte d'Ardéra doit rester reconnaissable, nette et sélectionnable, et sa silhouette ne doit pas être prétendue fidèle à un globe géodésique non attesté.
5. Les autres géantes, dimensions, objets et décors contribuent à la fresque chaotique. **Le désordre est celui de la représentation graphique et de l'humour**, pas une explication officielle de la création de l'univers, une preuve de parenté des dimensions, de leur position réelle ni un portail confirmé.
6. **Aucun texte peint** : noms, légende, états, focus, infobulles et zones d'interaction sont des surcouches d'interface distinctes du bitmap. Les emplacements pour destinations futures ne deviennent pas des cartes interactives avant existence et validation des fonds/données correspondants.

**Validé :** architecture à un hub, idée de bacchanale cosmique avec plusieurs géantes adultes, monde Ardéra placé de façon équivoque mais non explicite, ton Gargotte et destination par clic. **Restent ouverts :** variante précise pour Ardéra, nombre/poses définitifs des géantes, ratio natif disponible, composition/pixels/hitboxes et approbation d'un premier véritable rendu.

## 2. Cosmologie : hiérarchie de consultation, pas géographie des portails

L'**Entrevers** est le nom de l'univers et de sa **vue supérieure de navigation** ; il n'est **pas** synonyme de la **Trame astrale**. Celle-ci est une réalité intermédiaire dotée de sa propre carte. La proximité graphique de deux destinations ou un filet magique peint ne démontre pas un passage praticable entre elles.

Destinations réellement envisagées au lancement selon le pivot V2 :

| Entrée cliquable du hub | Fond ouvert en consultation | Relation à respecter |
|---|---|---|
| **Ardéra**, entrée principale | Mappemonde matérielle approuvée, puis **sept cartes continentales autonomes** depuis leurs zones sur Ardéra | Ardéra est le monde matériel, pas la totalité de l'Entrevers. |
| **Trame astrale** | Carte indépendante de la Trame (Archipels d'Éther, Courants de Filaments, Nœud des Convergences, Voiles Sans Rive, Déchirure Immobile) | La Trame n'est ni le fond du hub ni un portail universel implicite. |
| **La Brasserie Céleste**, dimension | Carte illustrée d'un **fragment de la dimension divine infinie**, ancien nom de travail « Hautes Fermentations » | **V2 du 29/09 : tout le fragment cartographié appartient à D7**, sans marqueur D7 interne ; la carte n'épuise pas la dimension infinie ; conserver la distinction entre identité de vue et entité métier du Codex. Les « Terrasses des Brasseurs » sont une ancienne piste de découpage V1 abandonnée. |
| **L'Enfer de la Sobriété Éternelle**, dimension | Carte d'un **fragment de la dimension infernale infinie**, ancien nom de travail « Royaume des Soifs Éteintes » | **V2 du 29/09 : tout le fragment cartographié appartient à D8, sans second marqueur D8 interne** ; la carte ne représente pas l'intégralité de la dimension infinie. Conserver distinctes identité de vue et entité métier du Codex ; la « Citadelle de l'Abstinence » et l'ancien point D8 restent des pistes V1 historiques, non des implantations V2. |

Les catégories **Plans divins / Plans infernaux / éventuels Plans élémentaires** sont des familles de classement, **pas des cartes supplémentaires arbitraires**. Futures réalités : réservées, non ouvertes au clic tant qu'aucune carte réellement approuvée n'existe. Ne pas appeler une famille « destination » sans contenu défini.

La représentation de la Trame peut être un **fragment visuel identifiable** d'archipels flottants et de filaments indépendant des autres objets de la fresque ; les filaments purement décoratifs dans tout l'Entrevers ne font pas de la fresque entière la Trame. Les deux dimensions ont des îlots/saynètes assez distincts pour être reconnus. Ne pas utiliser le bâtiment précis de D7/D8 en guise d'icône de toute la dimension.

L'arborescence de référence demeure **une vue Entrevers + une mappemonde Ardéra + sept continents + trois cartes dimensionnelles = douze vues de consultation**. Le nouveau choix retire la nécessité d'une organisation graphique plus compliquée à l'entrée, mais **ne supprime ni la carte Trame, ni les autres fonds autonomes, ni leurs données**. La séparation existante entre cartes et surcouches reste d'actualité. Les clés `map_id` conceptuelles historiques citées en A0 ne doivent pas être renommées/migrées par simple modification documentaire : décision de mapping réservée au chantier d'implémentation.

**Arbitrage D7 ultérieur au pivot :** voir [le cahier V2 de La Brasserie Céleste](V6-MAP-V2-DIMENSION-BRASSERIE-CELESTE.md). La carte montre **un fragment de dimension infinie**, couvert en entier par D7 ; elle n'est pas la totalité du plan divin et ne délimite pas D7 hors champ. Ne pas afficher un deuxième point D7 dans le fond. **Arbitrage D8 équivalent désormais VALIDÉ séparément** : voir [le cahier V2 de L'Enfer de la Sobriété Éternelle](V6-MAP-V2-DIMENSION-ENFER-SOBRIETE-ETERNELLE.md) ; lui aussi ne montre qu'un fragment de dimension infinie entièrement couvert par D8, sans second point D8. Ne pas extrapoler ces décisions aux autres dimensions.

**Consultation ≠ voyage réel :** cliquer une destination change de carte dans l'Atlas ; cela ne téléporte pas les personnages, n'implique aucun accès de campagne, ni un nouveau réseau de portails. Les merveilles d'Ardéra ne deviennent pas des passages par simple analogie graphique.

## 3. Contrat d'interaction de la map unique

- **Image publique unique** pour l'Entrevers, plus un registre de **quatre hotspots publics** indépendants des pixels de peinture. Une seule illustration n'implique pas le chargement simultané des quatre fonds de destination, encore moins des sept fonds continentaux.
- Les zones sont définies **après approbation du vrai fichier final**, sur son image native versionnée. Elles ne sont pas calculées à partir d'une capture du concept, d'une illustration provisoire ou de coordonnées inventées maintenant.
- Au clic/toucher/clavier sur un hotspot disponible : afficher son libellé d'interface et ouvrir **la vue cible indépendante**. Le retour depuis chacune revient au hub Entrevers (ou au chemin de navigation existant si explicitement conservé), sans confondre ce retour UI avec un portail de lore. Depuis Ardéra, cliquer un continent ouvre le fond continental ; les dimensions n'ont pas de sous-continent matériel automatique.
- **Lisibilité :** Ardéra est le plus fort point d'accroche visuel. Trame, dimension céleste et dimension infernale possèdent chacune une silhouette/contraste/zone de sélection distincts, même si l'environnement est exubérant. Les géantes peuvent traverser visuellement les scènes **sans masquer les zones cliquables**. Éviter chevauchements frustrants et ambiguïtés au toucher sur iPad.
- **Accessibilité :** zones focusables, libellés accessibles, états de focus et sélection, option de liste de destinations lisible indépendamment de l'illustration et de ses formes suggestives. Les noms dans l'UI restent masquables sur l'image si souhaité, mais l'accès aux destinations doit rester possible sans lecture du bitmap.
- Les détails d'ambiance, personnages et éléments érotiques suggérés **ne sont pas des contrôles** sauf décision explicite et ajout d'une destination réelle ; aucune réaction au clic inventée.
- Les emplacements « à venir » peuvent avoir un rôle **strictement décoratif**. Ne pas afficher de faux accès, de fausse carte, de faux message d'erreur de destination ni de secrets de MJ. Une vue inconnue ne doit pas apparaître comme visitable.
- Conserver dans la future adaptation UX le retour au parent, le sélecteur de cartes/dimensions et l'action **« Revenir à la Chope »** sur le parcours Ardéra/Valdorie, sans donner à la Chope un pouvoir cosmologique. Détails du contrat global à intégrer plus tard dans `V6-MAP-V2-NAVIGATION-TOPONYMIE-CODEX.md`, sans coder maintenant.

## 4. Contrat de visibilité et contraintes graphiques

Le fond Entrevers est **public**. Aucune localisation de donjon caché, entrée secrète de dimension, placement MJ, marqueur de campagne, relation de portail non validée, indice sur D7/D8 ou texte incrusté dans la peinture. Les objets flottants et scènes absurdes sont du **décor illustratif**, jamais un nouvel élément de lore ou un mécanisme de jeu implicite.

**Langage graphique Gargotte approuvé :** fantasy cartoon premium, proportions impossibles, juxtaposition de mondes, géantes de fête et figures burlesques, ambre/cuivre/violet/bleu nuit, brumes et mousses, petits gnomes dépassés, gargouilles/diablotines comiques, tonneaux, personnages en panique et plaisanteries visuelles équivoques. Le chaos doit rester riche en détails tout en ménageant des silhouettes de destinations perceptibles à l'échelle de l'iPad.

Les géantes sont **clairement adultes**. Sous-entendus et nudité seulement suggérée par dissimulation graphique complète des parties sensibles ; pas de détail anatomique explicite, pas de contact sexuel, pas d'ivresse sexualisée comme prétexte à un acte. Ce cahier cherche une scène burlesque non explicite, **pas une stratégie de contournement des contrôles d'un générateur**. Les alternatives de drapés, cheveux, mousse, fumée, éléments de décor et vêtements de scène restent autorisées si une composition ne peut pas être réalisée convenablement.

**ZÉRO UPSCALING, sans exception.** N'annoncer aucun format natif 4K/8K/16K ni ratio exact sans preuve de sortie du moteur disponible. La production parallèle des sept continents ne vaut pas validation automatique de la fresque Entrevers. Ne pas réutiliser le master d'Ardéra comme fichier agrandi, ni générer des assemblages factices. Un dérivé plus petit/recadré ne devient pas une nouvelle peinture native. Enregistrer dimensions réelles, version et preuve de contrôle après génération.

## 5. Gates et état des travaux

| Étape | Condition vérifiable | Statut |
|---|---|---|
| **E0 Concept** | Hub unique + quatre destinations réellement définies, Entrevers distinct de Trame, « Grand N'importe Quoi Primordial », géantes adultes et grivoiserie non explicite | **VALIDÉ en intention** |
| **E1 Composition** | Emplacement exact du monde dans la fresque, équilibre des personnages/destinations, source ou représentation d'Ardéra, format/résolution native disponibles | **EN ATTENTE** |
| **E2 Génération et QA visuelle** | Fichier réel inspecté : quatre destinations reconnaissables, aucune anatomie sensible visible, aucun texte/secret, cohérence artistique, rapport pixels exact | **NON LANCÉ** |
| **E3 Zones de navigation** | Hotspots publics et labels UI indépendants du fond, validation sur vrai fichier final ; destination list alternative et tests iPad | **EN ATTENTE, sans écriture de code ici** |
| **E4 Intégration / sécurité** | Fonds chargés à la demande, cache versionné, retour/Chope, visibilité MJ filtrée avant exposition, QA offline proportionnée | **EN ATTENTE, chantier distinct** |

**Exclusions du présent lot :** aucune génération d'image, aucun changement de code/UI, aucun commit de média, aucun placement D1–D15, aucune migration `map_id`, aucun changement IndexedDB/Blobs/backend, aucun impact V7, aucun merge automatique de la PR documentaire.
