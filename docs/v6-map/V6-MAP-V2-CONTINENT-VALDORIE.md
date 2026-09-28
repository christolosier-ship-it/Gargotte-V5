# V6-Map V2 — Valdorie : cahier de conception continentale

**Statut : TREIZE ARBITRAGES VALDORIE VALIDÉS LE 28/09/2026 ; NEUF CONCEPTS D'ILLUSTRATION DES DONJONS EN ATTENTE DE VALIDATION INDIVIDUELLE ; géopoints, IDs métier, capacités de génération et implémentation EN ATTENTE. Aucune image générée.** Première carte continentale pilote du nouveau parcours **Entrevers → Ardéra (mappemonde approuvée 4K) → Valdorie**. Ce cahier fixe les invariants déjà documentés, les décisions V2 de placement relatif et des **propositions artistiques clairement distinctes du lore canonique**. Il ne crée ni coordonnées définitives, ni identité technique de donjon, ni accès narratif.

Références à consulter avant exécution : `AGENTS.md`, `V6-MAP-MAITRE.md` (géographie V1 et historiques), `V6-MAP-PIVOT-V2-FEUILLE-DE-ROUTE.md`, `V6-MAP-PIVOT-V2-ARCHITECTURE-DOCUMENTAIRE.md`, **`V6-MAP-V2-REGISTRE-IMPLANTATIONS.md` (autorité actuelle sur les affectations)**, annexe A0 et la véritable illustration Ardéra V3 / 4K approuvée (inventaire de fichier/hash à faire avant génération). En cas de conflit : ne pas recopier l'ancienne répartition D1–D15 du maître V1 ; préserver l'historique et signaler le conflit.

## 0. Treize arbitrages VALIDÉS par le propriétaire le 28/09/2026

| N° | Décision expressément actée |
|---|---|
| 1 | **Paysage 3:2 avec marges maritimes** : cadrage artistique, pas une promesse de pixels natifs non démontrés. |
| 2 | **Une grande cité fortifiée** des **Plaines de Valdor**, nom RÉSERVÉ (jamais « Val-d’Or »). |
| 3 | **Une grande cité, un grand port commercial et trois à cinq bourgs secondaires** ; des hameaux ordinaires restent possibles. |
| 4 | La **Chope Qui Colle** est identifiable sur le fond public, **sans monumentalisation**, au sein du petit hameau Saint-Fût-le-Petit. |
| 5 | **25 à 30** scènes publiques Gargotte, variées, grivoises adultes et non explicites, sans perdre la lisibilité de la carte. |
| 6 | D1 proche de la Chope **côté Collines de la Vieille Lande**, D2 proche de la Chope **côté forêt**, deux points distincts. |
| 7 | D3 **quartier hôtelier**, D4 **quartier festif**, tous deux dans la grande cité fortifiée. |
| 8 | D5/D6 : **un marqueur partagé**, menu D5/D6 filtré selon droits ; D6 est directement SOUS D5, non au sud. |
| 9 | D9 **partie profonde de la Sylve hors Arbres-Colosses**, D10 **littoral rocheux des Côtes Grises**, D11 **transition prairies fleuries/forêt à l'est des Plaines**. |
| 10 | **Neuf illustrations dédiées, sur calque indépendant et conditionnel** ; aucune silhouette secrète n'est imprimée dans le bitmap public. |
| 11 | **Neuf donjons cachés initialement** aux joueurs, révélés individuellement par acte explicite du MJ pour chaque campagne. |
| 12 | **Aucune réserve d'emplacement futur prédéfinie** ; laisser les paysages respirer naturellement, sans créer de géopoints futurs fictifs. |
| 13 | **Aucun texte peint** sur le fond, titre du continent compris ; noms exclusivement en surcouches d'interface masquables. |

**Validation esthétique distincte :** les neuf descriptions proposées dans [`V6-MAP-V2-VALDORIE-ILLUSTRATIONS-DONJONS.md`](V6-MAP-V2-VALDORIE-ILLUSTRATIONS-DONJONS.md) sont **À ARBITRER UNE À UNE**. Leur présence dans GitHub ne valide pas leurs silhouettes.

## 1. Intentions et livrables du continent

Valdorie est une **carte illustrée indépendante et riche**, pas un recadrage agrandi du 4K et pas un niveau de pyramide de zoom géométriquement superposable pixel à pixel. L'image doit conserver les grandes silhouettes, la logique des eaux, les reliefs, les côtes, la merveille et les relations régionales de la mappemonde. Densifier la vie publique : villes, ports, voies terrestres, commerce fluvial, campagnes, gags de taverne et détails narratifs **non secrets**. La carte doit rester lisible et laisser des territoires vierges pour de futures quêtes.

Livrables ultérieurs, après les Gates ouvertes ci-dessous : (a) fond natif **3:2** sans texte/secret, avec Chope publique reconnaissable ; (b) **neuf illustrations conditionnelles séparées** et registre de points/liens Codex autorisés ; (c) aperçu de contrôle MJ avec repères/IDs de conception, **non distribué comme bitmap public** ; (d) manifeste de résolution/dimensions natives, version de la source et des ressources ; (e) revue iPad.

**Interdiction d'upscaling** : ne jamais demander ni annoncer « 4K natif » ou autre taille si le générateur ne livre pas réellement ces pixels. Choisir format/ratio/résolution selon la morphologie de Valdorie et les capacités démontrées du moteur, puis documenter les pixels exacts. La mappemonde 4K approuvée reste inchangée. Aucun pipeline mondial 8K/16K ni assemblage de pseudo-zoom.

## 2. Géographie canonique à conserver

Repère de **composition mondiale indicatif** (non contour final) : Valdorie X12–43 / Y26–57 sur Ardéra 0..100, nord en haut. Une fois sa carte autonome créée, définir un repère **local indépendant** de 0..100 pour les interactions, sans inventer les points de donjons à partir des boîtes indicatives. Continent tempéré diversifié, **trois péninsules méridionales**, des archipels cohérents et deux bassins majeurs. Préserver la mer et les passages visibles autour de Valdorie, notamment le rapport à la Mer des Trois Couronnes et son **passage occidental entre Valdorie et Sahaldune** ; ne pas refermer la mer par un littoral inventé.

| Région canonique | Rôle géographique et traitement attendu |
|---|---|
| **Les Côtes Grises** (O/NO) | Littoral exposé, côtes rocheuses, estuaire de la Rivombre ; port public anonyme possible, commerce maritime, contrastes vents/falaises. |
| **Les Hautes Marches** (N/centre) | Massifs et contreforts structurants, sources des eaux ; laisser un relief plausible et des cols rares plutôt qu'une ville à chaque sommet. |
| **La Sylve des Anciens** (E/NE) | Vaste forêt ancienne, présence des **Arbres-Colosses**, merveille intégrée à la forêt sans la convertir en porte, donjon ou village géant. |
| **Les Plaines de Valdor** (centre/sud) | Terres agricoles, hameaux, chemins et **une grande ville publique anonyme** associée aux emplacements logiques D3/D4 ; le nom canonique est « Valdor », jamais « Val-d’Or ». |
| **Les Bassins de l'Est** (E/SE) | Avelorne, lac, liaisons fluviales et mosaïque de forêts/terres fertiles. |
| **Les Terres de Cendre** (SO) | Reliefs plus anciens et secs, **Monts d'Escarbelle**, espaces ouverts et quelques chemins, sans transformer tout le secteur en volcanisme neuf. |

**Toponymie secondaire approuvée :** Avelorne (Hautes Marches → Bassins de l'Est → Mer des Trois Couronnes), Rivombre (vers les Côtes Grises), ruisseau des Saules (près de Saint-Fût, affluent du bassin de l'Avelorne), lac d'Ysambre (est), Collines de la Vieille Lande (près du village), Monts d'Escarbelle (Terres de Cendre). Les anciens noms Argenne, Ornebrune, Petite Aulne, Lac des Miroirs, Collines de Valdor et Monts de Cendre ne doivent pas être réintroduits. Les noms sont **des surcouches dynamiques**, jamais peints dans le décor.

**Contrôle géographique :** côte et trois péninsules reconnaissables sur un aller-retour avec la mappemonde ; tracé des fleuves cohérent avec leur bassin et leur embouchure, sans traverser un relief arbitrairement ; lac d'Ysambre et merveille au bon secteur ; continuité de la Mer des Trois Couronnes et des îles ; aucune région renommée.

## 3. Le cœur de l'aventure : Saint-Fût-le-Petit et la Chope Qui Colle

**VALIDÉ d'après le maître :** Saint-Fût-le-Petit reste un **hameau rural banal, relativement isolé** : Collines de la Vieille Lande, voisinage de la Sylve des Anciens, ruisseau des Saules, champs et vieux pont. Centre mondial X30/Y44 = indication historique, **pas un point exact à reconduire dans la carte autonome**. La **Chope Qui Colle**, auberge tenue par Berthold « Deux-Doigts », est un repère public essentiel de l'aventure, **pas un nexus cosmologique**.

**Contrat visuel V2 validé dans son principe :** peindre le hameau, un bâtiment de taverne reconnaissable, sa cour, une petite cheminée, la proximité du vieux pont, quelques parcelles cultivées et un chemin boueux. Le bâtiment doit rester dimensionné comme une auberge de village, sans devenir château ou mégalopole. Une silhouette ludique (enseigne en chope **sans lettres**, auvent, tonneaux publics) peut suffire ; son nom et sa sélection relèvent de la surcouche. Préserver un emplacement lisible pour le marqueur prioritaire « Chope », la commande « Revenir à la Chope » et les deux emplacements distincts D1/D2 alentour. Aucune entrée ni silhouette caractéristique de ces donjons n'est révélée par défaut.

## 4. Les neuf donjons de Valdorie : décisions V2 et contrat de représentation

**Affectations/positions relatives et règle de révélation VALIDÉES le 28/09/2026 ; géopoints, IDs Codex et filtrage backend EN ATTENTE.** Les neuf sites ont chacun une **illustration dédiée sur calque indépendant et conditionnel**, pas neuf signatures peintes sur le fond public. Tous sont initialement cachés aux joueurs, révélés explicitement par le MJ **par campagne**. Leurs silhouettes concrètes demeurent des propositions visuelles à valider une à une.

| ID / placement_id | Zone V2 validée | Implantation et précaution de conception |
|---|---|---|
| D1 / `placement:d01` — Le Château Bastognac | **Proche de la Chope, côté Collines de la Vieille Lande** | Point distinct de D2 ; château secret seulement sur calque conditionnel ; titre métier à vérifier. |
| D2 / `placement:d02` — La Forêt en Chantier | **Proche de la Chope, côté forêt** | Point distinct de D1 ; aucun chantier révélateur dans le fond public. |
| D3 / `placement:d03` — Hôtel Zombifornia | **Quartier hôtelier de la grande cité fortifiée des Plaines de Valdor** | Point individuel et illustration conditionnelle. |
| D4 / `placement:d04` — Le Cabaret des Joyeuses | **Quartier festif de la même grande cité fortifiée que D3** | Point distinct de D3 ; le quartier public ne dévoile pas le cabaret. |
| D5 / `placement:d05` — Le Sanctuaire du Houblon Noir | **Contreforts des Hautes Marches** | Réserver secteur de relief et position de surface à préciser, sans indice visuel de sanctuaire secret. |
| D6 / `placement:d06` — Le Panthéon des Fermentations Interdites | **Directement SOUS D5** | Même x/y à déterminer, niveau/depth distinct ; **un marqueur commun D5/D6 avec menu filtré par droits**. Aucun accès direct ou portail déduit ; coupe souterraine uniquement conditionnelle. |
| D9 / `placement:d09` — Le Bastion du Sauciflard | **Partie profonde de la Sylve des Anciens, distincte des Arbres-Colosses** | Illustration conditionnelle, aucune assimilation à la merveille. |
| D10 / `placement:d10` — Les Thermes de la Bonne Trempette | **Littoral rocheux des Côtes Grises** | Lieux publics de bain génériques permis, sans identifier ce donjon. |
| D11 / `placement:d11` — La Ruche Royale | **Transition prairies fleuries/forêt à l'est des Plaines de Valdor** | Ne pas peindre une ruche géante qui révélerait le donjon. |

**Hors Valdorie** : D7 et D8 dans leurs dimensions désormais nommées La Brasserie Céleste et L'Enfer de la Sobriété Éternelle ; D12/D14/D15 en Ferrécime ; D13 en Sylvaronde ; D3/D10 ne sont **plus** à Pelagrève et D15 n'a aucun lien avec D5. Ne pas extrapoler de donjon non validé à partir d'un décor de tavernes.

**Les neuf concepts architecturaux ne sont PAS encore approuvés :** voir [l'annexe des illustrations dédiées](V6-MAP-V2-VALDORIE-ILLUSTRATIONS-DONJONS.md). Les fichiers d'illustration sensibles ne devront pas davantage être diffusés via une URL ou un cache public que leurs marqueurs.

**Registre géométrique ultérieur, sans valeurs fictives :** pour chaque `placement_id`, `view_id`, point local (x,y), éventuel `level/depth`, statut public/sensible, niveau de découverte par campagne, lien Codex `entity_type/entity_id` réellement résolu, rayon de sélection UI, vérification d'un marqueur voisin. Pour D5/D6, définir le modèle vertical avant de renseigner leurs positions. Tous les marqueurs secrets sont filtrés **avant transmission**, y compris recherche, aperçus, URLs et cache. Ne pas présenter une vue de contrôle MJ comme fichier public.

## 5. Civilisations, commerce et fioritures géographiques

**Décision de densité VALIDÉE : une grande cité fortifiée anonyme, un grand port commercial anonyme et TROIS À CINQ bourgs secondaires.** Les hameaux modestes, dont Saint-Fût, ne deviennent pas de grandes villes. Les détails architecturaux sont des propositions de peinture non assimilées à un nouveau lore.

- **Grande cité des Plaines de Valdor :** enceinte, portes, rues compactes, place et halles ; deux quartiers distincts, hôtelier pour D3 et festif pour D4, sans mettre leurs façades secrètes dans le fond. Pont majeur seulement si les eaux le justifient ; port fluvial seulement si une eau navigable la traverse. Le nom de la cité reste RÉSERVÉ.
- **Grand port des Côtes Grises :** quais de pierre et de bois, phare, entrepôts, navires et criée publique ; D10 demeure sur le littoral rocheux sans devenir par supposition le port lui-même.
- **Trois à cinq bourgs secondaires :** implantations publiques plausibles liées à agriculture, traversée, carrefour et vallée. Répartition numérique précise et noms EN ATTENTE ; aucun nom inventé pour remplir la carte.
- **Saint-Fût :** hameau rural à l'écart des grands axes, Chope visible mais sans monumentalisation, chemin modeste, ruisseau et vieux pont.
- **Routes et commerce :** axes sobres entre cité et port, traversées de vallées/cols, liens vers bourgs ; navigation sur des tronçons fluviaux uniquement si relief et débit plausibles de l'Avelorne et de la Rivombre.
- **Grands espaces naturels :** préserver Sylve, Hautes Marches, Terres de Cendre et campagnes. Les Arbres-Colosses restent plus marquants que les villes ordinaires. Pas de futures coordonnées de donjons « réservées » par défaut.

Le port, la ville et les bourgs ne doivent porter aucun nom peint ni détail qui révèle D1/D2/D3/D4/D5/D6/D9/D10/D11.

## 6. Gargotteries publiques, grivoises et cartographiquement lisibles

**Décision VALIDÉE : 25 à 30 micro-scènes**, réparties sur le continent, distinctes des secrets, et lisibles à l'échelle de l'atlas. Humour adulte sous la ceinture, bière, ridicule, fausses cérémonies pompeuses et accidents logistiques ; pas de nudité explicite, d'acte sexuel, de violence graphique ou de texte peint.

**Plan d'ambiance proposé à 28 scènes**, modifiable à l'intérieur de la plage validée :

| Secteur public | Nombre | Micro-scènes proposées |
|---|---:|---|
| Saint-Fût et campagne | 5 | Charrette de fûts embourbée ; poules poursuivant un poivrot ; pompe à bière inutilisable ; linge de dessous d'adultes emporté par le vent ; cochon volant le casse-croûte. |
| Grande cité et Plaines de Valdor | 6 | Statue de satyre au pagne ridicule ; procession de brasseurs bloquée par un tonneau ; saucisses démesurées au marché ; chariot coincé dans une ruelle ; fontaine arrosant le mauvais notable ; gargouille au postérieur outrancier. |
| Côtes Grises et port | 5 | Phare au galbe de vieux pichet ; navire déséquilibré par ses fûts ; marin agrippé à sa barrique ; criée burlesque ; passerelle de quai branlante. |
| Hautes Marches | 4 | Auberge de col battue par les vents ; mulet chargé de tonneaux instables ; pont ridiculement étroit ; relais avec enseigne grivoise sculptée mais sans inscription. |
| Sylve des Anciens et Bassins de l'Est | 5 | Champignons-tabourets ; banquet abandonné ; moulin disproportionné ; canards voleurs de déjeuner ; pêcheur tiré par son énorme prise. |
| Terres de Cendre | 3 | Tonneaux dévalant devant une caravane ; halte de récupération bringuebalante ; statue à la pose pompeuse et absurde. |
| **Total** | **28** | Cible globale impérative **25–30**, adaptée au cadrage et à la lisibilité réelle. |

La géographie reste prioritaire sur les gags. Ne pas installer une scène à un emplacement qui divulgue indirectement un donjon initialement secret. Les neuf silhouettes spécifiques n'existent que dans leurs illustrations conditionnelles.

## 7. Extension libre et cohérence inter-vues

- **VALIDÉ : AUCUNE réserve géographique prédéfinie** pour un futur donjon, village, quête ou portail. Ne pas créer de cases, marqueurs ou coordonnées provisoires d'extension. Laisser néanmoins les paysages respirer en tant que paysages, pas en tant que réserves narratives.
- Sept hotspots continentaux sur la mappemonde ; Valdorie est une carte fille indépendante, avec retour Ardéra et raccourci Chope. Consultation d'une carte ≠ voyage physique.
- Tous les noms, merveilles, régions, sites et même le **titre « Valdorie »** passent par des surcouches masquables ; aucun texte peint.
- Les calques et fichiers sensibles des neuf donjons ne sont servis qu'aux utilisateurs réellement autorisés après révélation explicite du MJ **par campagne** ; ni URL prédictible, ni manifest public, ni cache public contenant ces illustrations.
- Aucun portail physique inventé entre l'Entrevers, la Trame ou les dimensions du simple fait de leur hiérarchie d'interface.
- Les médias Atlas restent indépendants des médias métier V7. Aucun chargement global des Blobs, reset IndexedDB ou nettoyage destructif.

## 8. Contrat de production native : CADRAGE 3:2 VALIDÉ

Le cadrage retenu est **PAYSAGE 3:2 AVEC MARGES MARITIMES**, pour les trois péninsules, les îles et la lecture des côtes. Ne pas déformer les proportions pour remplir artificiellement le cadre. La résolution **en pixels** n'est pas arrêtée : une cible « 4K natif » ou « 4096 × 4096 » ne peut être présumée à partir d'un prompt.

**UPSCALING INTERDIT.** Vérifier les pixels réels et le ratio d'origine du moteur. Si le moteur ne produit pas directement du 3:2, seul un recadrage **sans agrandissement** depuis un raster natif plus large, préservant la géographie, peut être proposé après preuve ; sinon soumettre une alternative au propriétaire, sans tromper sur la résolution. Ni interpolation ascendante ni simple étirement de la mappemonde 4K.

La carte continentale est une illustration indépendante cohérente avec le monde approuvé ; les neuf illustrations dédiées sont des ressources indépendantes (alpha si disponible nativement, ou détourage contrôlé sans upscale). Un fichier réduit pour l'iPad est un **dérivé de diffusion**, non un nouveau master. Le manifeste donnera fichier source authentique/hash, dimensions pixels mesurées, format, poids, éventuel alpha, révision, QA et test Safari iPad. Le décodage WebP doit être vérifié sur de vrais assets, sans l'inférer de l'encodeur Canvas.

## 9. Prompt conceptuel **NON EXÉCUTABLE AVANT LES GATES**

```text
Create an independent premium hand-painted medieval illuminated parchment atlas of Valdorie, with a LANDSCAPE 3:2 composition and surrounding maritime margins, using the approved Ardéra V3/4K world illustration as the binding geographic and style reference.

Preserve Valdorie's recognizable contour, three southern peninsulas, surrounding islands and seas and the western exit of Mer des Trois Couronnes. Keep the six original regions (Côtes Grises, Hautes Marches, Sylve des Anciens, Plaines de Valdor, Bassins de l'Est and Terres de Cendre), their main relief and drainage, Avelorne flowing towards Mer des Trois Couronnes, Rivombre towards Côtes Grises, stream Saules near Saint-Fût, lake Ysambre, Collines de la Vieille Lande, Monts d'Escarbelle and Arbres-Colosses in the Sylve. No invented mainland bridge, portal or new coastline.

Depict Saint-Fût-le-Petit as a genuinely small rural hamlet with fields, old bridge and stream; the PUBLIC Chope Qui Colle tavern should be recognizable but not monumental. Paint ONE imposing yet proportionate anonymous FORTIFIED city in Plaines de Valdor with publicly plausible hotel and festive districts, ONE major anonymous commercial coastal port in Côtes Grises, and THREE TO FIVE smaller public towns. Roads, ports, farming, bridges, mills and trade must follow plausible geography and leave wide wild areas.

Include 25 TO 30 tiny distinct PUBLIC Gargotte vignettes across the regions: clumsy barrel convoys, pub mishaps, bawdy stylized adult innuendo, absurd satyr statue, overloaded ship and festive market chaos. Keep the humor non-explicit, colorful and readable, and never suggest a hidden dungeon through background scenery.

The public illustrated background may show the Chope but MUST NOT contain the nine secret dungeon silhouettes, identifying architecture, entrances or names. Their INDIVIDUAL CONDITIONAL OVERLAYS have to be handled as separate protected images: D1 next to Chope towards the hills, D2 next to Chope towards the forest, D3 hotel district and D4 festive district in the same city, D5 in Hautes Marches foothills and D6 DIRECTLY UNDER D5 with one filtered marker, D9 deep in Sylve separate from Arbres-Colosses, D10 on Côtes Grises rocky coast, and D11 at the flowering-meadow/forest transition east of the Plaines. All nine start hidden to players and must be unlocked explicitly by the MJ per campaign.

No text whatsoever, including no painted continent title, no labels, no fake writing, no political borders, no UI, no portals or secrets. NO UPSCALING. Produce only in a verified native output size, disclose the real pixel dimensions and preserve geography.
```

Ce texte décrit la vision sans autoriser une génération. Valider d'abord les neuf silhouettes proposées dans [l'annexe des illustrations](V6-MAP-V2-VALDORIE-ILLUSTRATIONS-DONJONS.md), le vrai master mondial de référence, la capacité native du moteur et les règles d'accès aux ressources privées.

## 10. Checklist QA et Gates

| Contrôle | Critère |
|---|---|
| Géographie | Six régions, trois péninsules, côtes/archipels et fleuves cohérents, Arbres-Colosses distincts du D9. |
| Composition | **3:2 paysage avec mer**, une cité fortifiée anonyme, un port, **3–5 bourgs**, Saint-Fût rural, Chope publique identifiable et modeste. |
| Donjons | Neuf affectations relatives validées, notamment D1 côté collines/D2 côté forêt, D3 quartier hôtelier/D4 festif, D6 sous D5 dans un marqueur commun. |
| Illustrations | Neuf silhouettes à **valider une par une**, calques conditionnels séparés, aucun indice peint dans le fond. |
| Gargotteries | **25–30** micro-scènes publiques non explicites, géographiquement plausibles et non révélatrices de secrets. |
| Extension | **Aucune réserve future prédéfinie**, mais grandes étendues naturelles non saturées. |
| Technique | Ratio 3:2, résolution native réelle vérifiée, **pas d'upscale**, aucun texte peint, noms via surcouches. |
| Sécurité | Neuf donjons cachés initialement, révélation MJ par campagne, filtrage serveur **avant transmission des images aussi**. |
| Validation | Vraie image Ardéra 4K inventoriée, concordance visuelle, essai Safari iPad, aucune altération IndexedDB/V7. |

**État au 28/09/2026 :** treize arbitrages VALIDÉS. Neuf implantations relatives validées. Les [neuf concepts d'illustration](V6-MAP-V2-VALDORIE-ILLUSTRATIONS-DONJONS.md) sont **EN ATTENTE DE VALIDATION INDIVIDUELLE** ; coordonnées numériques, IDs métier, visibilité technique, authentique source mondiale 4K et démonstration de génération native 3:2 EN ATTENTE. **Aucune image produite, aucun déploiement.**
