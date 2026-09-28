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

**Propositions artistiques, NON canonicalisées par ce document :**

- Grande cité anonyme des Plaines de Valdor : enceinte, portes, rues compactes, grand pont si cohérent avec les eaux, marché, maisons serrées, port fluvial **uniquement si un fleuve navigable y passe effectivement**. Ses quartiers peuvent réserver D3/D4 en surcouche sans les rendre identifiables sur la peinture.
- Port public anonyme des Côtes Grises : quais de pierre/bois, phare, entrepôts, navires et marché aux poissons ; garder libre la zone locale de D10 jusqu'à sa position exacte.
- Bourgades agricoles discrètes dans les Plaines et les Bassins de l'Est ; petites exploitations, moulins, halles et ponts. Saint-Fût demeure petit et à l'écart du réseau majeur.
- Routes rares mais lisibles reliant la grande ville, un axe commercial vers les Côtes Grises et des voies suivant les vallées/cols des Hautes Marches. Un chemin modeste mène à Saint-Fût ; pas d'autoroute médiévale devant la Chope.
- Commerces fluviaux **proposés** sur des tronçons plausibles de l'Avelorne/Rivombre : barges, bacs, petits ports, moulins. Aucun cours d'eau ne devient navigable sans considération des pentes et des reliefs.
- Végétation et habitations variées par biome ; vastes espaces sauvages conservés en Sylve, Hautes Marches et Terres de Cendre.
- Réserves visuelles et données pour futurs villages, ports, curiosités, donjons, quêtes et régions d'intérêt sans peindre leurs futurs emplacements comme des indices.

La densité urbaine doit rester **raisonnable à l'échelle continentale** : bâtiments monumentaux lisibles, merveilles naturelles plus dominantes que les villes.

## 6. Catalogue de gargotteries publiques, grivoises et cartographiquement lisibles

**18–24 micro-scènes proposées, pas un inventaire de lieux canoniques ni un quota à remplir coûte que coûte.** Évoquer bière, goinfrerie, foire, bagarre de taverne, catastrophes logistiques et humour sous la ceinture **adulte, burlesque et non explicite**. Les effets doivent se découvrir à l'inspection, sans saturer la géographie ou mettre en scène une entrée de donjon. Sans texte ni écritures lisibles sur pancartes.

| Secteur public | Idées de gags visuels non liés aux donjons |
|---|---|
| Saint-Fût et sa campagne | Charrette de fûts embourbée, poules poursuivant un ivrogne, pompe à bière de place publique hors service, linge de dessous adulte emporté par le vent, tonneaux servant de bancs, cochon volant une miche. |
| Plaines de Valdor et grande ville | Statue de satyre au pagne démesuré, enseigne sculptée suggestive **sans lettres**, petite procession de brasseurs avec tonneau trop grand pour la rue, marché de saucisses géantes, arroseur arrosé à la fontaine, ruelle où les chariots restent coincés. |
| Côtes Grises | Phare en forme de vieux pichet (option stylistique), marin cramponné à son fût, navire marchand déséquilibré par ses cargaisons, criée aux poissons burlesque, passerelle de quai anormalement branlante. |
| Hautes Marches | Halte de muletiers avec tonneaux mal arrimés, gargouille au postérieur exagéré sur un relais public, vieux pont ridiculement étroit, auberge de col battue par les vents. |
| Sylve et Bassins de l'Est | Champignons qui servent de tabourets, clairière de banquet abandonné, petit moulin aux pales disproportionnées, canards dérobant le déjeuner des bateliers, pêcheur surpris par un brochet trop ambitieux. |
| Terres de Cendre | Caravane dont les fûts roulent dans la pente, halte routière faite de pièces récupérées, statue publique à la pose franchement prétentieuse. |

**Direction du comique :** la carte reste un atlas médiéval fantasy premium ; personnages adultes très petits à l'échelle de la carte ; satire de beuverie et de sensualité ridicule, **pas de nudité explicite, pas d'acte sexuel, pas de violence graphique**. Ne dessiner ni le Château Bastognac, ni l'Hôtel Zombifornia, ni le Cabaret, ni la Ruche Royale comme des « blagues cachées » dont les silhouettes ou thèmes identifieraient un donjon non découvert. En cas de doute sur un emplacement, déplacer ou retirer la micro-scène.

## 7. Réserves d'avenir et cohérence inter-vues

- Prévoir des zones visuellement libres pour futurs sites publics/privés dans les six régions, sans préattribuer des donjons inexistants.
- Les sept hotspots continentaux sont gérés sur la mappemonde ; la carte de Valdorie garde son `view_id` propre et un bouton de retour vers Ardéra, ainsi que le raccourci Chope. La consultation d'une carte **ne représente pas un voyage physique**.
- Noms de mers, villes, régions, fleuves, merveilles et sites sont fournis par surcouches masquables ; les calques des lieux sensibles n'existent dans la réponse joueur qu'après autorisation.
- L'Entrevers, vue cosmologique au-dessus d'Ardéra, et les trois dimensions ne sont pas visibles comme portes physiques sur Valdorie par simple parenté de navigation. **Aucun portail inventé.**
- La stratégie média Atlas reste distincte des images métier V7. Pas de nouvelle lecture globale des Blobs, reset IndexedDB ou suppression d'assets historiques.

## 8. Contrat de production native (à instruire avant peinture)

La cible fixe « 4096 × 4096 natif » **n'est pas actée** : elle a été envisagée avant de constater les limites réelles de génération. Préparer le vrai master 4K approuvé et le contrôle géographique, vérifier les dimensions natives de sortie du moteur, puis choisir explicitement une résolution/ratio natifs adaptés au continent et à l'iPad. Pas d'upscaling, ni de second agrandissement, ni de fausse mention « 4K ».

La carte continentale devra être une création indépendante inspirée de la géographie mondiale, avec assez d'eau périphérique pour les péninsules, côtes et archipels, mais sans étirer le littoral pour remplir artificiellement un carré. Tout dérivé de diffusion **plus petit** devra être nommé comme réduction/compression du fond natif, non comme un nouveau master. Rapport requis : fichier source et référence, dimensions pixels **mesurées**, format, poids, éventuel profil alpha, validateur visuel, révision, test d'affichage iPad. Format du master conseillé PNG sans perte si le moteur le fournit ; formats de diffusion à qualifier séparément, sans supposer qu'un encodeur Canvas WebP absent empêche son décodage.

## 9. Prompt conceptuel à conserver, **NON EXÉCUTABLE avant Gate**

```text
Produce an independent richly detailed fantasy atlas painting of the continent Valdorie, using the approved Ardéra V3 / 4K map as the binding geographic and visual reference.

Preserve Valdorie's overall silhouette, three southern peninsulas, surrounding seas and archipelagos, two primary watersheds, northern-central highlands, eastern ancient forest and Arbres-Colosses. Keep the six canon regions in their approved relative areas: Côtes Grises, Hautes Marches, Sylve des Anciens, Plaines de Valdor, Bassins de l'Est and Terres de Cendre. Maintain the drainage of Avelorne towards the Mer des Trois Couronnes, Rivombre towards Côtes Grises, the eastern lake Ysambre, the old hills near Saint-Fût and the Monts d'Escarbelle. Do not invent passages closing the sea or move the natural wonder.

Illustrate Saint-Fût-le-Petit as a genuinely small rural hamlet with its old bridge, fields and stream. Give the public Chope Qui Colle tavern a discreet yet recognizable visual silhouette, with a barrel-yard and an unlettered tankard-shaped sign.

Enrich public geography with an imposing but proportionate anonymous walled city in the Plaines de Valdor, an anonymous commercial port on Côtes Grises, villages, natural roads, coherent river trade, farms, bridges, mills and forests. Keep large wild territories and the Arbres-Colosses visually more monumental than ordinary settlements.

Add numerous tiny PUBLIC Gargotte vignettes: clumsy barrel caravans, a ludicrously loaded merchant cart, bawdy adult tavern humor conveyed through subtle visual innuendo, an absurd satyr statue, an overloaded ship and chaotic festivals. Warm, burlesque, ridiculous fantasy tavern atmosphere, never explicit or overcrowded.

Preserve compositional space for NINE dungeon overlays: D1 and D2 near the Chope, D3/D4 in the same city, D5 in Hautes Marches and D6 directly below D5, D9 in Sylve des Anciens, D10 in Côtes Grises and D11 in the wooded flowering area east of the Plaines. Never paint any of their secret entrances, identifying architecture, literal markers or names into the public background. All actual dungeon markers and Codex links are application overlays subject to authorization, not embedded in this image.

Premium hand-painted medieval illuminated parchment atlas, organic blue-green seas, varied temperate greens, copper and weathered gold ink, expressive landforms and rich detail. NO text, NO labels, NO fake lettering, NO political borders, NO UI, NO secret hints, NO unconfirmed portals. Do not upscale the source: generate at the actual demonstrated native resolution and report it accurately.
```

Le prompt est une **base de travail non autorisée à générer** tant que les repères et la visibilité des lieux ne sont pas arbitrés. Il ne contient volontairement aucune dimension pixel promise ni coordonnée de donjon inventée.

## 10. Checklist QA et Gates

| Contrôle | Critère de décision |
|---|---|
| Géographie | 3 péninsules, 6 régions correctes, côtes/archipels et hydrographie cohérents, Arbres-Colosses dans la Sylve. |
| Repères publics | Saint-Fût petit et rural ; Chope identifiable en tant que décor public ; grande ville et port anonymes proportionnés. |
| Donjons | 9 placements V2, D1/D2 proches de la Chope, D3/D4 même ville, D6 **sous** D5 ; zéro entrée secrète peinte. |
| Humoristique | Gargotteries publiques visibles en inspection, comique adulte burlesque, ni nudité explicite ni saturation de la carte. |
| Technique | Image réellement générée à résolution native vérifiée, pas d'upscale, labels et marqueurs non peints, fond public versionné. |
| Navigation et confidentialité | Retours parent, marqueur Chope, surcouches indépendantes, réponse joueur filtrée avant envoi, espace futur préservé. |
| Tests | Revue visuelle sur vrai fond, ergonomie iPad au format réellement livré, absence de contamination du patrimoine IndexedDB/V7. |

**État actuel :** Gate de rattachement relatif des neuf donjons **VALIDÉE** via le registre ; choix des géopoints, contrôle du lore réel, de la visibilité et des IDs métier, forme/ratio/résolution de la peinture et prompt définitif **EN ATTENTE**. Ce fichier n'approuve aucune image ni aucun déploiement.
