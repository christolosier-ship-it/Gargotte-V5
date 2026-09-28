# V6-Map V2 — Pelagrève : cahier continental approuvé

**STATUT : DOUZE ARBITRAGES DE CONCEPTION VALIDÉS PAR LE PROPRIÉTAIRE LE 28/09/2026.** Pelagrève accueille une grande cité portuaire et **une cité sous-marine**, sans donjon D1–D15. **Cinq réserves d'extension validées en nombre**, leurs cinq secteurs particuliers encore à arbitrer. Cadrage portrait 2:3 validé comme choix artistique, résolution en pixels non promise. Aucune image générée, aucune modification d'application, aucun géopoint chiffré inventé.

**Précédence :** `AGENTS.md`, véritable mappemonde PNG 4K approuvée, `V6-MAP-MAITRE.md` pour la géographie et six régions uniquement (ignorer répartition D3/D10 et ancien pipeline V1), `V6-MAP-V2-REGISTRE-IMPLANTATIONS.md` pour l'affectation V2 D1–D15, `V6-MAP-V2-SIX-CONTINENTS-CADRAGE.md` pour la méthode, puis décisions expresses ci-dessous. La PR #59 V2 Valdorie est fusionnée ; ce document se situe dans la PR #60 documentaire.

## 0. Registre des douze arbitrages expressément VALIDÉS

| N° | Choix acté par le propriétaire le 28/09/2026 |
|---|---|
| **1** | **Portrait 2:3, avec marges océaniques** autour du croissant continental et des archipels. Ne pas déformer le contour pour forcer le cadre. Pixels natifs, compatibilité de format et éventuel recadrage destructif sans agrandissement : gate technique distincte. |
| **2** | **Une grande cité portuaire commerciale, trois à cinq bourgs/escales, PLUS une cité sous-marine.** L'identité et l'emplacement exacts des deux cités, leurs noms et les 3–5 bourgs sont réservés, notamment la localisation de la cité sous-marine au regard des deux mers et de la merveille. Ne pas inventer une capitale politique, une cité sous-marine faisant office de donjon, ni un accès/portail. |
| **3** | **Variante C personnelle : continent mêlant piraterie et fantasy d'inspiration asiatique**, avec peuples terrestres, marins et sous-marins. Cette identité visuelle remplace le choix prédéfini A/B de circulation ; conserver des réseaux de bateaux, détroits, marchés et petites routes plausibles. **Pandaren obligatoirement visibles**, y compris dans la vie publique et les gargotteries. Aucune route de voyage en gameplay n'est déduite de l'ambiance. |
| **4** | **Mixité multiraciale** dans ports, villages, navires, cité sous-marine et vignettes ; silhouettes aquatiques/hybrides attestées si références Codex disponibles. Les Pandarens sont une demande explicite artistique du propriétaire, **pas une confirmation de leur présence préalable dans les données actuelles** (recherche GitHub par nom sans résultat à la date du cadrage). Vérifier la référence raciale et son apparence avant de déclarer une fiche Codex jouable ou de créer une nouvelle origine/ethnie. |
| **5** | **12 à 18 gargotteries publiques** réparties sur mer, îles et terres, avec plusieurs races et inspirations pirates/asiatiques. |
| **6** | **Palette mixte selon les régions** : turquoise et lagons lumineux là où propices ; côtes rocheuses battues de vents et bleus orageux ailleurs. Ne pas uniformiser les deux mers. |
| **7** | **Mer des Lanternes** vaste, profonde, calme et plus sombre ; **Mer aux Cent Passes** plus lumineuse, fragmentée en îles et chenaux. Elles communiquent entre elles et avec l'océan par les détroits réels du maître. |
| **8** | **Dorsale des Fournaises ponctuellement volcanique active**, cônes et fumerolles localisés, sans transformer tout Pelagrève en lave ni inventer une connexion aux Marches de Braise/Ferrécime. |
| **9** | **Labyrinthe Corallien principalement sauvage et sous-marin**, récifs/arches biologiques perceptibles à travers l'eau, **sans bâtiment, point d'observation construit ou accès artificiel**. Ce n'est ni un donjon ni un portail. |
| **10** | **Cinq réserves futures** dans des points singuliers : nombre VALIDÉ, **cinq secteurs et géopoints précis EN ATTENTE d'arbitrage distinct**. Leur relation éventuelle au Labyrinthe Corallien n'est pas encore décidée ; aucune exclusion tacite ni conversion en D16+. |
| **11** | **Aucun texte peint** sur le fond, y compris nom du continent, mers, pays, enseignes et faux caractères. Toponymie uniquement dans l'interface masquable. |
| **12** | **Présence généreuse de navires, phares, marchés côtiers, récifs et épaves publiques**, certains relevant de l'esthétique piraterie et d'autres des inspirations asiatiques fantasy, parfois mêlées, sans texte ni symbole de faction non vérifié. |

**Validés au niveau conceptuel :** les douze choix, l'existence d'une ville sous-marine publique et le rôle visuel obligatoire des Pandarens. **Restent ouverts, sans les présenter comme des choix déjà actés :** l'endroit/forme de la cité sous-marine, les cinq secteurs de réserve, les positions et noms de sites, les détails raciaux vérifiables dans le Codex et les rendus images à venir. L'identité pirate/asiatique concerne une direction artistique fantasy, non une imitation littérale d'une culture historique, d'une œuvre propriétaire ou une répartition raciale imposée.

## 1. Géographie et hydrographie canoniques

Pelagrève : X81–95/Y34–66 dans le repère mondial 0..100, **boîte approximative de repérage, pas contour exact**. Croissant continental **fracturé**, avec péninsules, archipels, détroits, deux mers intérieures. L'image PNG approuvée du monde doit fixer les côtes réelles, sans reconstituer la géométrie à partir d'un rectangle ni ajouter un isthme ou un pont terrestre.

| Région canonique | Traitement de composition VALIDÉ ou géographie à préserver |
|---|---|
| **Les Côtes des Éclats (NO)** | Côtes rocheuses battues des vents, face à la Mer des Éclats et Ferrécime. Ambiance plus rude et corsaire possible ; aucun placement nouveau de donjon. |
| **Les Mers Encloses (centre)** | Mer des Lanternes et Mer aux Cent Passes, toutes deux lisibles et hydrologiquement reliées entre elles et à l'océan ; respect des détroits, îles et lacs centraux. |
| **La Dorsale des Fournaises (NE)** | Relief volcanique avec activité ponctuelle, fumerolles, cônes et palette minérale, sans continuité magmatique fictive avec un autre continent. |
| **Les Côtes des Alizés (E)** | Façade maritime, vents, escales, commerce et diversité de bateaux ; localisation exacte de la grande cité portuaire à décider sur le fond, non présumée ici. |
| **La Ceinture des Lagons (SE)** | Eaux lumineuses, îles et récifs ; **Labyrinthe Corallien** près du SE, merveille biologique/magique sauvage, sans installation ou accès construit. |
| **Les Marches des Marées (SO)** | Baies, estran, hauts et bas niveaux marins, petites communautés publiques et navigations plausibles. |

**Quatre bassins validés** : mers encloses, versant ouest, est, sud, avec lacs centraux et réseaux insulaires propres. **Mer des Lanternes plus vaste/profonde/calme/sombre ; Mer aux Cent Passes ramifiée/insulaire/lumineuse ; deux mers reliées ENTRE ELLES ET à L'OCÉAN par détroits.** Distinguer par la peinture et le plan d'eau sans fabriquer une source magique à leur palette. Le ciel et la mer ouverte ne remplacent pas les contours des deux eaux intérieures.

**Merveille Labyrinthe Corallien :** approx. X91/Y60 dans le repère mondial, phénomène biologique et magique d'Ardéra. Récifs et arches coralliennes à travers l'eau, sans temple, tour, port, palais, bâtiment public, poste d'observation construit ou portail. La ville sous-marine ne doit pas être automatiquement déduite comme habitant le cœur de cette merveille ; son emplacement et son éventuelle relation géographique au Labyrinthe restent à décider explicitement.

## 2. Cités, bourgs, vie multiraciale et transports

**Densité VALIDÉE :** une grande cité portuaire commerciale **et** une cité sous-marine **et** trois à cinq bourgs/escales publics. Le nom, la taille réelle, le secteur exact et l'iconographie architecturale spécifique de chaque ville ne sont pas encore des faits canoniques indépendants du choix artistique.

**Parti pris pirate + asiatique fantasy VALIDÉ :** diversité architecturale dans les petites baies et villes marchandes, silhouettes de toitures courbes, voiles de jonques fantasy, navires corsaires, lanternes décoratives muettes, bois peint, cuivre, pontons et étals, sans vraie écriture ou symbole historique sensible. Pas de stéréotype « un seul peuple = pirates » ni d'affiliation automatique d'une race aux contrebandiers. Les paysages sauvages restent présents sur les îles et péninsules. Les zones sous-marines montrent une communauté habitée indépendante, **sans dessiner un bouchon sur un détroit ou une fausse île**.

**Visibilité de la cité sous-marine :** existence publique VALIDÉE, mais son traitement visuel reste à choisir. Une carte de surface peut proposer une vignette séparée transparente, une fenêtre graphique localisée ou un calque contextuel PUBLIC propre avec ancre sous-marine, à condition de ne pas altérer la géographie des fonds/détroits et de ne pas inventer une porte magique. L'option exacte, son ancrage, sa profondeur, son nom et son éventuel rôle dans les voyages seront à arbitrer. La cité n'est PAS un des quinze donjons, ni une couche « secret de MJ » par défaut.

**Populations :** habitants terrestres, marins et sous-marins, races confirmées par les sources du jeu et **Pandarens impérativement représentés selon volonté du propriétaire**. Garder la variété dans les activités normales (navigation, artisanat, commerce, pêche, festivités, résidence sous-marine) autant que dans les gags. Le terme Pandaren correspond à une demande de direction artistique ; une vérification de référence visuelle/fiche Codex et d'originalité du costume/design est requise avant finaliser les assets. Les espèces aquatiques/hybrides doivent être compatibles avec les références attestées ; ne pas en inventer une catégorie jouable officielle en peignant un figurant. Le seed historique avec « Demi-Kraken » ne vaut pas civilisation sous-marine présumée.

**Navigation :** détroits et deux mers naturellement interconnectés, routes de cabotage et échanges, petits chemins sur les terres où il en existe, sans passerelle à travers une mer ni route impossible à travers un volcan. Le degré d'emphase maritime découle du monde pirate et sous-marin, mais les moyens exacts de trajet de personnages sont à définir par gameplay ultérieur.

## 3. Gargotteries PUBLIQUES : 12–18, scènes indicatives

**Plage VALIDÉE : 12–18 scènes**, éparpillées et lisibles, avec identités pirates et fantasy asiatique et plusieurs races du jeu. Composition indicative de **16** détails, pas seize nouveaux lieux canoniques, ni seize entrées de futurs donjons :

| Secteur | Micro-scènes illustratives et multiraciales proposées | Nombre |
|---|---|---:|
| Côtes des Éclats | Navire corsaire raccommodé avec un fût ; marché de poisson où un Pandaren et une gobeline négocient le même gros crustacé ; phare public dont le gardien lutte contre une voile envolée. | 3 |
| Mers Encloses | Régate de petites jonques fantasy chargées de tonneaux ; capitaine orque disputant sa carte vide à un poulpe chapardeur ; batelier nain transportant une théière beaucoup trop grande. | 3 |
| Dorsale des Fournaises | Marmite de poisson trop près d'une fumerolle ; petit groupe d'artisans tentant de sécher du linge d'adultes sous des embruns volcaniques. | 2 |
| Côtes des Alizés | Pandaren marin accrochant des lanternes décoratives sans lettres sur son bateau ; débarquement grotesque d'un pirate aux bottes démesurées ; quai de commerce mêlant gnomes, elfes et orques autour d'une caisse de saucisses. | 3 |
| Ceinture des Lagons | Barque de pêche qui se fait pousser par un poisson énorme ; gobelin essayant de prendre le soleil sous une ombrelle trop petite ; carnaval nautique sans inscription ni intrusion bâtie dans le Labyrinthe Corallien. | 3 |
| Marches des Marées | Capitaine piégé par une marée basse au milieu d'une fête ; duo Pandaren et kobold contestant la taille d'un petit tonneau. | 2 |
| **Total indicatif** | **16, dans la plage validée 12–18**. Les personnages sous-marins ordinaires peuvent enrichir les scènes d'habitat de la cité après choix de sa représentation. | **16** |

Ne pas afficher de faux panneaux écrits, de violence graphique, de sexualité explicite ou de stéréotype racial humiliant. Les détails paillards restent adultes et non explicites. **Pas de panneau « pirate » imprimé en alphabet fantaisiste**, noms/enseigne/personnages non marqués par un D# secret.

## 4. Cinq réserves d'avenir : nombre VALIDÉ, localisation relative À ARBITRER

**VALIDÉ :** cinq emplacements de développement futur, chacun sur une singularité géographique ; aucun D1–D15 n'est actuellement affecté à Pelagrève. Les réserves sont une **surcouche de planification MJ**, non un ajout d'île, de donjon, de portail, de phare secret ou de marqueur visible sur la peinture publique. **Aucune région ni coordonnée spécifique n'a été choisie par le propriétaire à cette étape.**

**Cinq pistes régionales proposées pour un second arbitrage, TOUTES NON VALIDÉES :**

| Réserve candidate | Proposition de secteur naturel singulier | Précaution |
|---|---|---|
| **R1** | **Côtes des Éclats**, cap ou îlot rocheux remarquable face à la Mer des Éclats. | Loin des zones urbaines/ports identifiés, ne pas créer de nouvelle île. |
| **R2** | **Dorsale des Fournaises**, col volcanique ou caldeira naturellement singulier, hors établissement habité. | Une réserve n'est ni un cratère transformé en portail, ni un bâtiment en éruption. |
| **R3** | **Marches des Marées**, îlot découvrant/estran remarquable et accessible uniquement suivant la marée, si la côte réelle le permet. | Ne pas modifier artificiellement le trait de côte. |
| **R4** | **Mers Encloses**, îlot isolé ou passage naturel remarquable à l'écart du cœur des détroits et de la future cité sous-marine. | Ne pas bloquer les communications mer intérieure ↔ mer intérieure ↔ océan. |
| **R5** | **Ceinture des Lagons**, formation insulaire/corallienne périphérique distincte du Labyrinthe Corallien. | L'exclusion ou non du **cœur du Labyrinthe Corallien** des réserves doit être expressément décidée ; cette proposition suppose une réserve extérieure pour préserver la merveille sauvage. |

Écarter les sites trop proches entre eux et la cité sous-marine une fois sa localisation définie. La présence des cinq réserves n'implique pas cinq images de donjons ou points Codex fonctionnels. **État : 5/5 en nombre, 0/5 secteurs validés, 0/5 géopoints locaux fixés.**

## 5. Points encore à valider / vérifier, sans rouvrir les douze arbitrages

### Arbitrages éditoriaux encore nécessaires
1. **Où placer la cité sous-marine** (par exemple Mer des Lanternes profonde, Mer aux Cent Passes dans un bassin insulaire sans bloquer ses chenaux, ou Ceinture des Lagons hors Labyrinthe) et **comment la représenter** sur une carte de surface sans créer de faux îlot ou couper les détroits. Ne pas lui inventer de nom ni de portail.
2. **Cinq secteurs R1–R5 :** valider ou corriger les cinq pistes régionales (§4), puis leurs singularités exactes/coordonnées sur le vrai fond. Dire explicitement si le Labyrinthe Corallien et ses abords sont exclus des futures réserves.
3. **Références Pandaren :** l'exigence de présence est VALIDÉE, mais vérifier sa représentation dans le corpus canonique/graphique de Gargotte et, si aucune n'existe, valider l'approche d'illustration du peuple demandé. Cette vérification ne supprime pas le choix du propriétaire et ne constitue pas une affirmation que le race existe déjà dans le Codex.
4. Éventuels **noms publics de cités/bourgs** : réservés ; ne bloquent pas la peinture sans texte mais doivent être décidés avant étiquetage interactif, si prévu.

### Gates techniques et production
- Vérifier l'authentique PNG 4K de la mappemonde, géométrie des détroits et mers, les dimensions réelles du générateur en ratio 2:3. **UPSCALING INTERDIT**, pas de 4K/8K/16K inventé ni d'assemblage artificiel de tuiles.
- Après peinture, valider visuellement la coexistence de deux mers distinctes, de la cité portuaire, de la cité sous-marine (sur ressource/couche choisie), des 3–5 bourgs et des 12–18 gargotteries. Les réserves R1–R5 sont planifiées sur calque MJ sans indice secret peint.
- Le registre V2 reste inchangé : **Pelagrève = 0 donjon D1–D15**, D3 et D10 restent en Valdorie. Ne pas confondre la ville sous-marine publique avec un donjon caché ; l'existence d'une cité n'attribue aucun nouveau `entity_type/entity_id` sans modèle de données et arbitrage de développement.
- Tester rendu/format réel sur Safari iPad ; ne modifier ni runtime, ni IndexedDB/Blobs, ni V7 dans cette PR documentaire. **Aucune image générée ni code modifié.**
