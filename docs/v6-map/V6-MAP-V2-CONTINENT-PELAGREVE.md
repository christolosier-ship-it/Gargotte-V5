# V6-Map V2 — Pelagrève : cahier continental approuvé

**STATUT : DOUZE ARBITRAGES DE CONCEPTION VALIDÉS PAR LE PROPRIÉTAIRE LE 28/09/2026.** Pelagrève accueille une grande cité portuaire et **une cité sous-marine**, sans donjon D1–D15. **Cinq réserves d'extension validées en nombre ET dans leurs secteurs régionaux R1–R5** ; seul leur ancrage précis reste à fixer sur la vraie carte. **Cité sous-marine validée au large de la Ceinture des Lagons, hors Labyrinthe Corallien et ses abords, ET REPRÉSENTÉE PAR UN CALQUE PUBLIC INDÉPENDANT, relié à un repère sur la carte.** Cadrage portrait 2:3 validé comme choix artistique, résolution en pixels non promise. Aucune image générée, aucune modification d'application, aucun géopoint chiffré inventé.

**Précédence :** `AGENTS.md`, véritable mappemonde PNG 4K approuvée, `V6-MAP-V2-SOCLE-GEOGRAPHIQUE-ARDERA.md` pour la géographie et six régions uniquement (ignorer répartition D3/D10 et ancien pipeline V1), `V6-MAP-V2-REGISTRE-IMPLANTATIONS.md` pour l'affectation V2 D1–D15, `V6-MAP-V2-SIX-CONTINENTS-CADRAGE.md` pour la méthode, puis décisions expresses ci-dessous. La PR #59 V2 Valdorie est fusionnée ; ce document se situe dans la PR #60 documentaire.

## 0. Registre des douze arbitrages expressément VALIDÉS

| N° | Choix acté par le propriétaire le 28/09/2026 |
|---|---|
| **1** | **Portrait 2:3, avec marges océaniques** autour du croissant continental et des archipels. Ne pas déformer le contour pour forcer le cadre. Pixels natifs, compatibilité de format et éventuel recadrage destructif sans agrandissement : gate technique distincte. |
| **2** | **Une grande cité portuaire commerciale, trois à cinq bourgs/escales, PLUS une cité sous-marine.** La cité sous-marine est désormais **VALIDÉE au large de la Ceinture des Lagons, hors Labyrinthe Corallien et de ses abords** ; l'ancrage précis sur le fond, l'architecture, la profondeur, son nom ainsi que les noms/points de la cité portuaire et des 3–5 bourgs restent réservés. Ne pas inventer une capitale politique, une cité sous-marine faisant office de donjon, ni un accès/portail. |
| **3** | **Variante C personnelle : continent mêlant piraterie et fantasy d'inspiration asiatique**, avec peuples terrestres, marins et sous-marins. Cette identité visuelle remplace le choix prédéfini A/B de circulation ; conserver des réseaux de bateaux, détroits, marchés et petites routes plausibles. **Pandaren obligatoirement visibles**, y compris dans la vie publique et les gargotteries. Aucune route de voyage en gameplay n'est déduite de l'ambiance. |
| **4** | **Mixité multiraciale** dans ports, villages, navires, cité sous-marine et vignettes ; silhouettes aquatiques/hybrides attestées si références Codex disponibles. Les Pandarens sont une demande explicite artistique du propriétaire, **pas une confirmation de leur présence préalable dans les données actuelles** (recherche GitHub par nom sans résultat à la date du cadrage). Vérifier la référence raciale et son apparence avant de déclarer une fiche Codex jouable ou de créer une nouvelle origine/ethnie. |
| **5** | **12 à 18 gargotteries publiques** réparties sur mer, îles et terres, avec plusieurs races et inspirations pirates/asiatiques. |
| **6** | **Palette mixte selon les régions** : turquoise et lagons lumineux là où propices ; côtes rocheuses battues de vents et bleus orageux ailleurs. Ne pas uniformiser les deux mers. |
| **7** | **Mer des Lanternes** vaste, profonde, calme et plus sombre ; **Mer aux Cent Passes** plus lumineuse, fragmentée en îles et chenaux. Elles communiquent entre elles et avec l'océan par les détroits réels du maître. |
| **8** | **Dorsale des Fournaises ponctuellement volcanique active**, cônes et fumerolles localisés, sans transformer tout Pelagrève en lave ni inventer une connexion aux Marches de Braise/Ferrécime. |
| **9** | **Labyrinthe Corallien principalement sauvage et sous-marin**, récifs/arches biologiques perceptibles à travers l'eau, **sans bâtiment, point d'observation construit ou accès artificiel**. Ce n'est ni un donjon ni un portail. |
| **10** | **Cinq réserves futures** sur des points singuliers : nombre et **secteurs régionaux R1–R5 tous VALIDÉS** par le propriétaire. Le **Labyrinthe Corallien ET SES ABORDS sont expressément EXCLUS**. Les cinq géopoints, leurs contours et les singularités exactes à retenir sur le vrai fond restent à préciser ; aucune conversion en D16+. |
| **11** | **Aucun texte peint** sur le fond, y compris nom du continent, mers, pays, enseignes et faux caractères. Toponymie uniquement dans l'interface masquable. |
| **12** | **Présence généreuse de navires, phares, marchés côtiers, récifs et épaves publiques**, certains relevant de l'esthétique piraterie et d'autres des inspirations asiatiques fantasy, parfois mêlées, sans texte ni symbole de faction non vérifié. |

**Validés au niveau conceptuel :** les douze choix, l'existence de la cité sous-marine **et son secteur au large de la Ceinture des Lagons**, son **mode de représentation en calque PUBLIC indépendant accessible depuis un repère du continent** (confirmation expresse ultérieure du propriétaire), les cinq secteurs R1–R5, l'exclusion du Labyrinthe Corallien et de ses abords des réserves, et le rôle visuel obligatoire des Pandarens. **Restent ouverts :** le géopoint exact, la profondeur, la forme/architecture et le nom de la cité sous-marine, les coordonnées/contours R1–R5 et les noms des lieux, les références graphiques Pandaren vérifiables et les rendus images à venir. L'identité pirate/asiatique concerne une direction artistique fantasy, non une imitation littérale d'une culture historique, d'une œuvre propriétaire ou une répartition raciale imposée.

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

**Merveille Labyrinthe Corallien :** approx. X91/Y60 dans le repère mondial, phénomène biologique et magique d'Ardéra. Récifs et arches coralliennes à travers l'eau, sans temple, tour, port, palais, bâtiment public, poste d'observation construit ou portail. La ville sous-marine est **VALIDÉE au large de la Ceinture des Lagons, HORS du Labyrinthe Corallien ET de ses abords**, sans empiéter sur le récif remarquable. Aucun bâtiment, embarcadère ou artifice narratif ne doit être ajouté au Labyrinthe sauvage. Les géopoints sont à définir sur le fond.

## 2. Cités, bourgs, vie multiraciale et transports

**Densité VALIDÉE :** une grande cité portuaire commerciale **et** une cité sous-marine **et** trois à cinq bourgs/escales publics. Le nom, la taille réelle, le secteur exact et l'iconographie architecturale spécifique de chaque ville ne sont pas encore des faits canoniques indépendants du choix artistique.

**Parti pris pirate + asiatique fantasy VALIDÉ :** diversité architecturale dans les petites baies et villes marchandes, silhouettes de toitures courbes, voiles de jonques fantasy, navires corsaires, lanternes décoratives muettes, bois peint, cuivre, pontons et étals, sans vraie écriture ou symbole historique sensible. Pas de stéréotype « un seul peuple = pirates » ni d'affiliation automatique d'une race aux contrebandiers. Les paysages sauvages restent présents sur les îles et péninsules. Les zones sous-marines montrent une communauté habitée indépendante, **sans dessiner un bouchon sur un détroit ou une fausse île**.

**Visibilité de la cité sous-marine : CONTRAT VALIDÉ EXPLICITEMENT.** Le propriétaire a confirmé : « Je valide le calque public indépendant pour la cité sous-marine de Pelagrève. » Il faut donc une **illustration/ressource publique séparée du fond continental de surface**, accessible par un **repère public indépendant** géoréférencé au large de la Ceinture des Lagons (coordonnée locale à fixer après validation du vrai fond). Le fond principal ne doit ni afficher la cité sous-marine comme un faux îlot, ni modifier les côtes, la couleur géographique des deux mers ou les détroits pour révéler cette profondeur. La ressource indépendante peut représenter la cité, ses habitants et son environnement immergé, sans inscription peinte ; sa silhouette/architecture et ses dimensions natives seront soumises à validation **après production**, et non supposées approuvées aujourd'hui.

**Contrat de confidentialité et de sens :** cette cité est un **lieu PUBLIC**, distinct des calques conditionnels de donjon et des réserves exclusivement MJ. Son accès ne dépend d'aucune révélation MJ. Le repère public pointe vers le calque public, **sans laisser penser qu'il s'agit d'un portail** ou d'un donjon D16+. La profondeur, le nom, les détails de transport et l'implémentation d'interface exacts restent à déterminer lors du chantier Atlas, sans changement applicatif dans cette PR documentaire.

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

## 4. Cinq réserves d'avenir : secteurs VALIDÉS, géopoints réservés

**Décision explicite du propriétaire, 28/09/2026 :** réponse « 2. Ok » aux cinq propositions ci-dessous ; réponse « 3. Labyrinthe exclu. » à la question sur la merveille. Le nombre **cinq**, les cinq secteurs relatifs R1–R5 et l'exclusion du **Labyrinthe Corallien et de ses abords** sont donc **VALIDÉS**. Aucune coordonnée numérique, nouveau donjon ou île ne découle de cette approbation.

| Réserve MJ | Secteur relatif VALIDÉ | Singularité naturelle à sélectionner sur le véritable fond |
|---|---|---|
| **R1** | **Côtes des Éclats** | Cap ou îlot rocheux remarquable face à la Mer des Éclats, à distance du grand port et des bourgs si leur implantation définitive les en rapproche. |
| **R2** | **Dorsale des Fournaises** | Col volcanique ou caldeira naturelle singulière, hors agglomérations. Pas de cratère transformé en portail. |
| **R3** | **Marches des Marées** | Îlot découvrant ou estran remarquable selon la marée, **seulement si cohérent avec les côtes réelles**. Ne pas forcer une nouvelle île. |
| **R4** | **Mers Encloses** | Îlot isolé ou passage naturel remarquable, **en dehors du cœur des détroits** et séparé de la cité sous-marine approuvée au large de la Ceinture des Lagons. |
| **R5** | **Ceinture des Lagons** | Formation insulaire ou corallienne périphérique **hors Labyrinthe Corallien et ses abords**, également distincte du secteur habité de la cité sous-marine. |

**Contraintes communes VALIDÉES :** l'ensemble des cinq réserves sert uniquement à planifier d'éventuels contenus futurs en couche MJ. La **merveille et ses abords sont totalement exclus des cinq**, sans marquage ni indice sur la peinture publique. Éloigner R1–R5 entre elles et des lieux habités autant que le permet la silhouette réelle. La cité sous-marine publique, les circulations des deux mers intérieures et les détroits ne doivent pas être masqués ou interrompus par une réserve. Si la disposition réelle impose une collision pour R5 ou une autre réserve, signaler le conflit et choisir le point exact dans le secteur validé avec le propriétaire plutôt que modifier la géographie ou violer les exclusions.

**État : 5/5 secteurs régionaux VALIDÉS ; 0/5 points/contours locaux chiffrés fixés.** Choisir les singularités précises sur le vrai fond et les reporter sur la planche de contrôle MJ. Les réserves ne sont ni des D16+, ni des portails, ni des points publics marqués sur l'image.
## 5. Points encore à valider / vérifier, sans rouvrir les douze arbitrages

### Arbitrages éditoriaux encore nécessaires
1. **Secteur ET mode de représentation DÉJÀ VALIDÉS :** cité sous-marine au large de la Ceinture des Lagons, hors Labyrinthe Corallien et de ses abords, dans un **calque PUBLIC indépendant accessible depuis un repère public sur le continent**. À finaliser uniquement : ancrage précis, profondeur, architecture/illustration, éventuel nom et modalités UI concrètes. Ne pas créer de fausse île, couper les détroits ni inventer un portail.
2. **Les cinq secteurs R1–R5 sont DÉJÀ VALIDÉS, et le Labyrinthe Corallien ainsi que ses abords sont expressément EXCLUS.** Finaliser uniquement les points naturels singuliers et leurs emprises/coordonnées précises sur le vrai fond, en évitant la cité sous-marine et toute obstruction des mers/détroits.
3. **Références Pandaren :** l'exigence de présence est VALIDÉE, mais vérifier sa représentation dans le corpus canonique/graphique de Gargotte et, si aucune n'existe, valider l'approche d'illustration du peuple demandé. Cette vérification ne supprime pas le choix du propriétaire et ne constitue pas une affirmation que le race existe déjà dans le Codex.
4. Éventuels **noms publics de cités/bourgs** : réservés ; ne bloquent pas la peinture sans texte mais doivent être décidés avant étiquetage interactif, si prévu.

### Gates techniques et production
- Vérifier l'authentique PNG 4K de la mappemonde, géométrie des détroits et mers, les dimensions réelles du générateur en ratio 2:3. **UPSCALING INTERDIT**, pas de 4K/8K/16K inventé ni d'assemblage artificiel de tuiles.
- Après peinture, valider visuellement la coexistence de deux mers distinctes, de la cité portuaire, de la cité sous-marine **au large de la Ceinture des Lagons et hors merveille, en calque public indépendant explicitement approuvé et accessible par repère**, des 3–5 bourgs et des 12–18 gargotteries. Les réserves R1–R5 **validées en secteurs** sont planifiées sur calque MJ sans indice secret peint.
- Le registre V2 reste inchangé : **Pelagrève = 0 donjon D1–D15**, D3 et D10 restent en Valdorie. Ne pas confondre la ville sous-marine publique avec un donjon caché ; l'existence d'une cité n'attribue aucun nouveau `entity_type/entity_id` sans modèle de données et arbitrage de développement.
- Tester rendu/format réel sur Safari iPad ; ne modifier ni runtime, ni IndexedDB/Blobs, ni V7 dans cette PR documentaire. **Aucune image générée ni code modifié.**
