# V6-Map V2 — Six continents après Valdorie : cadrage et registre des arbitrages

**STATUT : CADRAGE DOCUMENTAIRE PROPOSÉ LE 28/09/2026 ; AUCUN NOUVEAU CONCEPT CONTINENTAL OU SOUS-EMPLACEMENT DE DONJON N'EST VALIDÉ PAR CE FICHIER. AUCUNE IMAGE GÉNÉRÉE.**

**Dépendance GitHub** : le pivot de Valdorie est préparé dans la **PR #59**, actuellement encore ouverte au début de ce chantier. Cette nouvelle branche part de `V5.3` et ne modifie aucun des cinq fichiers de #59. Fusionner/résoudre #59 avant d'activer les références V2 de ce cadrage. L'état de PR doit être revérifié au moment de la fusion ; aucun merge automatique.

Sources contractuelles : `AGENTS.md`, `V6-MAP-MAITRE.md` (géographie canonique, PAS son ancien pipeline 8K/16K), `V6-MAP-A0-ANNEXE-CONTRATS.md`, et, une fois la PR #59 fusionnée, `V6-MAP-PIVOT-V2-FEUILLE-DE-ROUTE.md`, `V6-MAP-PIVOT-V2-ARCHITECTURE-DOCUMENTAIRE.md`, `V6-MAP-V2-REGISTRE-IMPLANTATIONS.md`, `V6-MAP-V2-CONTINENT-VALDORIE.md` et l'annexe des neuf illustrations validées.

## 1. Workflow commun, reproduit de Valdorie

Pour **chacun des six autres continents** : (1) extraire ses six régions, merveilles, mers et continuités depuis le maître mondial approuvé ; (2) proposer et faire **valider ensemble** format/ratio et marges, cités, port(s), 3–5 bourgs seulement si cela convient à CE biome, populations/races, densité et catalogue de gargotteries ; (3) confirmer chaque donjon existant dans sa région et sa position relative, sans inventer de géopoint ; (4) préparer et soumettre des **concepts d'illustrations individuels** pour les donjons réellement présents ; (5) enregistrer la décision et les statuts dans une fiche continent, une annexe artistique si nécessaire, puis dans le registre des quinze ; (6) attendre le fond géographique approuvé avant géopoints locaux définitifs et avant overlays de production ; (7) produire séparément le fond PUBLIC sans texte/secret et les images CONDITIONNELLES, sans upscaling et avec pixels natifs mesurés ; (8) contrôler le rendu, l'iPad et les autorisations.

**Ne pas cloner aveuglément la recette visuelle Valdorie** : sa forme 3:2, sa ville fortifiée, son port et son quota de 25–30 scènes sont ses choix propres, pas une règle de tous les biomes. Adopter pour chaque continent une composition et une densité adaptées à sa vraie silhouette, tout en conservant la même exigence de qualité et de détail. Une carte d'archipel ou du Grand Hiver ne doit pas être forcée dans un carré, ni densifiée de tavernes à chaque kilomètre.

**Invariants transversaux non négociables :** mappemonde 4K approuvée intacte ; sept fonds continentaux autonomes ; Entrevers au-dessus d'Ardéra, distinct de la Trame ; aucune résolution natale annoncée sans preuve ; **zéro upscaling** ; aucun assemblage mensonger de niveaux ; aucune toponymie/texte incrusté ; merveilles ≠ portails ; pas de donjon peint dans le fond public si secret ; conservation des 15 affectations V2 ; Atlas séparé d'IndexedDB/Blobs/V7.

## 2. Diversité des races : ajout transversal demandé et à intégrer à chaque fiche

Les scènes de population et de gargotterie doivent illustrer **différents peuples/races déjà attestés dans le jeu**, plutôt qu'une succession de foules humaines uniformes. Exemples de références vérifiables dans les images et le bestiaire : gobelins/gobelines, elfes, gnomes, kobolds, nains, orques et autres personnages et créatures présents dans le catalogue réellement utilisé. Le `seed-data.js` historique comprend aussi des PNJ de types Demi-Ant, Demi-Kraken, Demi-Mécanique (technologie gnome), Demi-Morte-Vivante, Demi-Gripplis, Demi-Drakken, Demi-Ifrit et Demi-Abeille. **Ces exemples sont un répertoire visuel potentiel, pas une liste de races jouables exhaustive ni une preuve d'autochtonie d'un continent** : confronter le Codex de production actuel avant répartition canonique.

Règles proposées de conception : chaque carte habitée comporte plusieurs races visuellement distinguables à l'échelle possible ; les marchés, quais, caravanes, postes de garde, ateliers et fêtes montrent de la mixité, y compris les rôles non comiques ; éviter « une race = un continent », « un biome = un seul peuple », stéréotypes humiliants ou intégration arbitraire d'une créature du donjon secret. La présence artistique de ces peuples dans un décor **ne fixe pas leur origine raciale, territoire politique, statut de faction, diplomatie ou affiliation aux donjons** ; ces éventuelles affirmations nécessiteraient un arbitrage lore explicite.

**Question commune à valider avec le propriétaire :** diversité multiraciale sur chaque continent, sans quota par race et sans attribuer une exclusivité territoriale ; choix de quelques accents visuels par biome uniquement comme esthétique, sauf canon documenté. Les populations seront de taille suffisamment lisible dans le rendu réel, mais ni foule de figurines géantes ni spoilers de boss.

## 3. Inventaire des six continents : canon et décisions encore ouvertes

La position des merveilles au monde est indicative dans le référentiel Ardéra 0..100, pas un géopoint final continental. Les six régions sont déjà VALIDÉES et ne doivent pas être renommées.

### Ferrécime — pilotage proposé en premier, trois donjons

- **Canon :** X56–76/Y22–52 ; Portes du Givre, Échine d'Ardéra, Hauts Plateaux de Silex, Vallées des Mille Cascades, Hautes Voûtes, Marches de Braise ; quatre bassins ouest/est/internes/sud ; côte est abrupte, SE volcanique ; **Cimes Suspendues** dans les Hautes Voûtes vers X68/Y37, anomalie ancienne liée à la Trame astrale mais PAS un portail avéré.
- **D12 Monastère des Dénaturées** : continent et **région montagneuse VALIDÉS** ; « vallée reculée de l'Échine d'Ardéra » n'est qu'une **ancienne piste V1**, à approuver ou modifier ensemble.
- **D14 Citadelle des Tonneaux Perchés** : continent Ferrécime VALIDÉ ; **Hautes Voûtes** = ancienne piste V1, encore à arbitrer précisément ; ne pas situer la citadelle automatiquement sur une Cime Suspendue.
- **D15 Gynécotron du Gnome Tordu** : **Marches de Braise, secteur volcanique VALIDÉ**, **aucun lien avec D5** ; sous-secteur et rapport à un relief de surface ou complexe enfoui encore à décider, sans inventer de portail.
- Ouverts : format/ratio ; peuplement et architecture multi-races ; nombre/type de villes, forteresses, bourgs, voies et routes de cols ; niveau de gargotteries adapté à la montagne ; **trois concepts illustratifs D12/D14/D15 à proposer et faire approuver individuellement** ; trois géopoints locaux après référence visuelle réelle.

### Sylvaronde — un donjon

- **Canon :** X45–67/Y54–77 ; Delta des Mille Bras, Bassin des Grandes Eaux, Forêt des Hautes Couronnes, Monts des Orages, Hautes Brumes, Marches du Sud ; grand bassin vers delta NO, affluents/lacs des brumes, écoulements est/sud ; **Canopée-Monde** vers X54/Y60, merveille biologique et magique VERTICALE, différente des Arbres-Colosses de Valdorie.
- **D13 Marécages Infectés** : **Delta des Mille Bras VALIDÉ** ; position relative (chenaux isolés, îlot marécageux, bras mort, etc.) et concept d'illustration sont à proposer et approuver. La merveille elle-même n'est pas le donjon.
- Ouverts : format/ratio, habitat/commerce dans l'eau et la canopée sans géographie fantaisiste incontrôlée, populations multi-races, scènes Gargotte fluviales/sylvestres, densité, marqueur D13 et géopoint après fond.

### Boréclat — aucun D1–D15

- **Canon :** X25–59/Y4–20 ; Fjords des Brisants, Grande Taïga, Crêtes du Haut-Givre, Plateau des Blancs Silences, Pays des Sept Lacs, Marches d'Écume ; réseaux Sept Lacs→fjords, taïga occidentale et ruissellements saisonniers ; quatre fjords méridionaux, golfe occidental, îles à l'est et petite zone géothermique O ; **Aiguilles Boréales** dans les Crêtes vers X43/Y11, origine mystérieuse.
- **Aucun des quinze donjons actuels**. Ne pas en créer un pour décorer un fjord ni transformer les Aiguilles en portail/entrée.
- Ouverts : format très horizontal ou paysage adapté au littoral, nombre/forme de villages et port(s) nordiques, réseau de commerce hivernal, diversité de peuples en tenues climatiques plausibles, gargotteries de neige/glace/taïga/geothermie publiques, dosage de la présence humaine en Plateau des Blancs Silences.

### Sahaldune — aucun D1–D15

- **Canon :** X11–36/Y61–82 ; Côtes d'Ambre, Monts Fendus, Grande Dépression, Vallées des Deux Fleuves, Savanes d'Olvara, Littoral des Moussons ; deux fleuves pérennes nord vers **Mer des Trois Couronnes**, écoulements O, bassin central endoréique saisonnier, drainage S ; **Couronne de Sel** vers X23/Y71, anomalie magique ayant provoqué retrait d'une ancienne mer intérieure. Aucun canal artificiel entre dépression et océan.
- **Aucun des quinze donjons actuels**. Des haltes, ruines et marchés PUBLICS ne deviennent pas automatiquement des donjons cachés.
- Ouverts : ratio/cadrage, sites riverains/oasis et axes de caravane, ports du nord/sud selon vraie côte, mixité visuelle des races, gags de marché, caravane, sel et mousson sans copier-coller les déserts infernaux, densité des cités.

### Pelagrève — aucun D1–D15

- **Canon :** X81–95/Y34–66 ; Côtes des Éclats, Mers Encloses, Dorsale des Fournaises, Côtes des Alizés, Ceinture des Lagons, Marches des Marées ; croissant continental fracturé et archipels ; **Mer des Lanternes** (grande/profonde) et **Mer aux Cent Passes** (ramifiée/insulaire), reliées ENTRE ELLES et À L'OCÉAN par détroits ; **Labyrinthe Corallien** vers X91/Y60. Préserver côte découpée, lacs centraux, bassins insulaires et détroits. PAS de pont terrestre.
- **Aucun des quinze donjons actuels.** D3 et D10 ont été déplacés en Valdorie par décision V2 ; ne pas les faire réapparaître ici.
- Ouverts : silhouette possiblement plus haute que large et ratio adapté aux îles, populations multi-races et culture maritime, nombre de villes/ports/escales, transport par navires/bacs, gargotteries de marins, pirates de foire, coquillages et marchés aquatiques ; visibilité correcte des deux mers intérieures.

### Austrébrume — aucun D1–D15

- **Canon :** X43–75/Y84–96 ; Fjords de Nacrelune, Bois des Dernières Feuilles, Monts du Voile, Bassin des Lacs Sombres, Landes du Grand Hiver, Couronne Blanche ; quatre bassins vers fjords O, baie NE, vallées forestières N et régions polaires ; **Cascades de Brume** vers X59/Y89 : phénomène ATMOSPHÉRIQUE, PAS cascades d'eau, origine totalement mystérieuse ; **Falaises de Nacrelune** et **Plateaux du Dernier Vent** sont seulement PROPOSÉS dans V1, non canoniques.
- **Aucun des quinze donjons actuels.** Ne pas forcer de ville géante ou de village sur la calotte.
- Ouverts : cadrage de la bande australe/fjords, densité des campements, ports et petites cités côtières, mixité visuelle de populations adaptées au climat, humour de brouillard, du froid et de navigation, éventuel accord sur les deux toponymes secondaires V1 ; ne pas convertir les Cascades de Brume en phénomène hydrologique.

## 4. Ordre d'arbitrage recommandé (non obligatoire)

1. **Ferrécime** : verrouiller D12/D14/D15, leurs concepts et la montagne/volcanisme.
2. **Sylvaronde** : verrouiller la précision de D13, l'identité de Canopée-Monde et le caractère habitable de la forêt/delta.
3. **Pelagrève** : deux mers intérieures et continuité maritime à traiter soigneusement.
4. **Boréclat** : géographie arctique, quatre fjords, échanges et population.
5. **Sahaldune** : endoréisme, les deux fleuves, mer ancienne et cultures.
6. **Austrébrume** : merveille atmosphérique, frange australe et densité raisonnable.

Ce classement est **proposition d'organisation**, pas ordre canonique. La revue commune des choix devrait être close avant d'écrire leurs briefs définitifs, puis **une fiche continent par vue**, une annexe pour les quatre concepts D12/D13/D14/D15 si utile, et une mise à jour du registre des quinze **uniquement après les décisions du propriétaire**. Les quatre continents sans D1–D15 ne reçoivent pas de pseudo-annexes de donjons ; leur absence est un choix de répartition V2 déjà acté.

## 5. Questions à poser et Gate par continent

Renseigner pour chaque : A. ratio/cadrage natif + marges ; B. système de villes/ports/bourgs sans uniformiser tous les continents ; C. éventuelle proposition de topographie secondaire et toponymie, sans réécrire les six régions ; D. populations et **plusieurs races déjà présentes dans le jeu** (statut de la répartition ethno-géographique si nécessaire) ; E. densité, répartition et liste de 25–30 gargotteries si cette plage est approuvée spécifiquement, sinon autre quantité décidée ; F. merveille et interdictions lore ; G. donjon(s) réellement présent(s) : région, position relative, distinct de la merveille/portail, illustration conditionnelle et concept visuel à approuver ; H. absence de réserves géographiques prédéfinies ou décision contraire ; I. aucun texte peint ou changement expressément approuvé ; J. rapport de production native sans upscale, droits et QA.

**Stop validation :** ne pas transformer l'ancienne piste D12/Échine ou D14/Hautes Voûtes en décision sans réponse. Ne pas inventer des coordonnées X/Y avant le fond détaillé, des origines de races ou des sites secrets pour les continents vides. La production de fond public peut rester indépendante des IDs/URLs des donjons, contrairement à leur intégration conditionnelle. La vérification sécurité côté backend est obligatoire avant diffusion de ressources sensibles. Aucune modification runtime, IndexedDB, V7 ou image dans ce lot documentaire.
