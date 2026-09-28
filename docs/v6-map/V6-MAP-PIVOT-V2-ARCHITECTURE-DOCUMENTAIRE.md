# V6-Map — Pivot V2 : architecture documentaire et plan de migration

Statut : **PROPOSITION DOCUMENTAIRE EN REVUE ; REGISTRE D'AFFECTATIONS V2 CRÉÉ et validé pour les zones relatives le 28/09/2026**. Complément de `V6-MAP-PIVOT-V2-FEUILLE-DE-ROUTE.md` ; aucun remplacement immédiat du maître actif, aucune coordonnée précise ou implantation technique définitive, et aucun prompt de production continentale. Ne pas interpréter un fichier « à créer » ci-dessous comme déjà présent dans GitHub.

## 1. Principes d'organisation

- Une **autorité V2 unique** pour les décisions pérennes, et des cahiers courts qui renvoient au maître plutôt que dupliquent son lore.
- Un **registre indépendant des implantations** désormais présent : `V6-MAP-V2-REGISTRE-IMPLANTATIONS.md`. Les affectations et positions relatives ont été validées par le propriétaire ; **les quinze coordonnées, IDs métier et règles d'exposition restent en attente**, sans figement par rédaction automatique.
- Une fiche par **vue illustrée** : 1 Entrevers, 7 continents et 3 cartes dimensionnelles. Ardéra 4K est une illustration déjà approuvée : le maître et le contrat des fonds la référencent, sans la régénérer.
- Distinguer **cosmologie / représentation graphique / navigation d'interface**. Une vue « Entrevers » en tête de navigation n'est ni la Trame astrale ni une preuve de portail ou de topologie spatiale.
- Pas d'upscaling, jamais de promesse de « natif 4K/8K » sans dimensions réelles contrôlées. Le ratio/rendu natif de chaque carte continentale est décidé en fonction de sa morphologie et d'une génération techniquement démontrée, pas imposé arbitrairement à 4096².
- **Cartes publiques, surcouches sensibles privées** : aucune localisation de donjon secret ne se lit dans le fond ; positions et fiches protégées par filtrage préalable selon campagne.
- Réemploi des décisions géographiques V1, des résultats POC A0/A1/A2 et des garanties données/médias V6/V7 ; réécrire les prescriptions de pyramide/zoom devenues obsolètes, sans effacer les preuves historiques.

## 2. Arborescence V2 proposée (registre et cahier Valdorie déjà créés ; autres fichiers encore futurs)

```text
docs/v6-map/
├── V6-MAP-MAITRE-V2.md
├── V6-MAP-V2-REGISTRE-IMPLANTATIONS.md
├── V6-MAP-V2-PRODUCTION-FONDS.md
├── V6-MAP-V2-DA-GARGOTTE.md
├── V6-MAP-V2-ENTREVERS.md
├── V6-MAP-V2-CONTINENT-VALDORIE.md
├── V6-MAP-V2-CONTINENT-BORECLAT.md
├── V6-MAP-V2-CONTINENT-SAHALDUNE.md
├── V6-MAP-V2-CONTINENT-SYLVARONDE.md
├── V6-MAP-V2-CONTINENT-FERRECIME.md
├── V6-MAP-V2-CONTINENT-PELAGREVE.md
├── V6-MAP-V2-CONTINENT-AUSTREBRUME.md
├── V6-MAP-V2-DIMENSION-TRAME-ASTRALE.md
├── V6-MAP-V2-DIMENSION-BRASSERIE-CELESTE.md
├── V6-MAP-V2-DIMENSION-ENFER-SOBRIETE-ETERNELLE.md
├── V6-MAP-V2-NAVIGATION-TOPONYMIE-CODEX.md
└── V6-MAP-V2-SECURITE-OFFLINE-VALIDATION.md
```

Ces dix-sept fichiers constituent la **structure cible**, et non une demande de les remplir immédiatement. **Exceptions : le registre des quinze donjons et le cahier pilote Valdorie sont créés dans la branche documentaire** ; les autres noms sont des fichiers futurs. L'image mondiale n'est pas un dix-huitième fichier Markdown : elle est un asset à inventorier/versionner. Les deux fichiers `V6-MAP-PIVOT-V2-*.md` servent uniquement de proposition de transition.

## 3. Responsabilité précise de chaque document

| Fichier | Responsabilité unique / critère d'entrée |
|---|---|
| `V6-MAP-MAITRE-V2.md` | Décisions canoniques, univers/Trame/Ardéra, arborescence 12 vues, 7 continents/42 régions/7 merveilles, statuts VALIDÉ/PROVISOIRE/RÉSERVÉ, navigation monde→continent, interdiction upscale, confidentialité et ordre des gates. Rédiger après revue du pivot. |
| `V6-MAP-V2-REGISTRE-IMPLANTATIONS.md` | **Déjà créé** : quinze affectations et positions relatives V2 validées, distinctions par dimension, historique V1 et corrections. Les coordonnées finales, IDs métier, critères de visibilité et accès demeurent réservés. **Aucune coordonnée finale déduite de la validation relative.** |
| `V6-MAP-V2-PRODUCTION-FONDS.md` | Inventaire/hash de la vraie image maître 4K, références et droits, contrat fichier natif, ratio individuel, test de taille réelle, PNG source, dérivés de diffusion plus petits si besoin, aucun upscale, nomination/versionnement, contrôle avant/après, rollback. |
| `V6-MAP-V2-DA-GARGOTTE.md` | Bible de peinture et d'humour : tavernes, bière, foire, bordel joyeux, burlesque grivois adulte et non explicite, gargotteries publiques par biome ; dosage/lisibilité ; aucun décor suggérant un secret. |
| `V6-MAP-V2-ENTREVERS.md` | **Vue supérieure illustrée** de l'univers et ses entrées navigables ; distinction d'Ardéra, de la Trame et des familles de plans ; langage graphique cosmologique ; représentation symbolique plutôt que modèle astronomique non attesté ; aucun portail inventé. Concept graphique et liens à valider avant génération. |
| `V6-MAP-V2-CONTINENT-*.md` (7) | **Valdorie créée en tant que brief à revoir, aucune génération autorisée ; les six autres fiches sont futures.** Une fiche par continent, calée sur la mappemonde : six régions approuvées, merveille, silhouettes et hydrographie, paysages, civils anonymes, routes/ports, scènes Gargotte, limites de confidentialité, affectations relatives du registre, extensions futures, prompt conceptuel et contrôle sortie native. Coordonnées exactes et droits avant prompt exécutable. |
| `V6-MAP-V2-DIMENSION-*.md` (3) | Trame astrale, **La Brasserie Céleste** et **L'Enfer de la Sobriété Éternelle** : régions/territoires du corpus existant, palette, références, D7/D8 dans leurs dimensions homonymes mais comme objets distincts, fond sans secret, consultation ≠ accès réel ; aucune assimilation Trame=Entrevers. Conserver provisoirement les anciennes clés conceptuelles map_id jusqu'à contrat de migration. |
| `V6-MAP-V2-NAVIGATION-TOPONYMIE-CODEX.md` | Contrat vue par vue/hotspots indépendants des bitmaps, identifiants stables, retours, Chope, label dynamique, panneau Codex, extension, pas de changement de fond piloté par zoom. |
| `V6-MAP-V2-SECURITE-OFFLINE-VALIDATION.md` | Filtrage MJ/joueur/campagne côté backend, absence de secrets en image/recherche/cache/URL, chargement paresseux, ressources versionnées, validation Safari iPad, vraie qualification offline et non-régression IndexedDB/V7. |

## 4. Gabarit contraignant d'une fiche continent

Une même fiche contient ces rubriques dans cet ordre, sans réécrire le registre central : (1) statut et références visuelles validées ; (2) silhouette/côtes et zones adjacentes ; (3) six régions et merveille canonique ; (4) reliefs/hydrographie/continuités obligatoires ; (5) civilisation publique et axes commerciaux en **propositions artistiques** ; (6) catalogue de gargotteries publiques propres au biome ; (7) renvoi aux donjons du registre **uniquement après Gate placement**, sans peindre de secret ; (8) réserves pour sites et régions futurs ; (9) capacité native du générateur, ratio/dimensions choisies, rapport de pixels ; (10) prompt final et contrôle QA ; (11) décision utilisateur et statut de validation graphique. Les profils non arbitrés restent des documents de préparation, jamais des ordres de génération finale.

## 5. Registre D1–D15 : décision relative enregistrée, finalisation restant à faire

Le registre [`V6-MAP-V2-REGISTRE-IMPLANTATIONS.md`](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md) est créé. Le propriétaire a validé les **affectations continentales et dimensionnelles et les descriptions relatives**, non des points numériques : **Valdorie 9, Ferrécime 3, Sylvaronde 1, La Brasserie Céleste D7, L'Enfer de la Sobriété Éternelle D8**. Les noms de dimensions remplacent les anciens noms de travail, mais les clés `map_id` conceptuelles restent inchangées avant migration explicitement planifiée ; distinguer D7 et D8 de leurs dimensions homonymes.

Conserver pour chaque entrée le `placement_id` conceptuel stable, l'ID Dn éditorial, le titre à confronter au catalogue réel, `entity_type/entity_id` réel ou « non résolu », dimension/continent/région validés ou provisoires selon champ, point local **vide avant décision**, profondeur si souterrain, visibilité public/MJ à établir, historique V1, validation du propriétaire, réserve d'extension et éventuels conflits de lore. Aucun site secret ne doit être suggéré dans un fond raster public.

**Ordre de finalisation géométrique recommandé :** Valdorie (D1, D2 proches de la Chope ; D3/D4 dans une même ville des Plaines de Valdor ; D5/D6 en superposition verticale ; D9 dans la Sylve ; D10 aux Côtes Grises ; D11 à l'est des Plaines), Ferrécime (D12 montagne, D14 continent confirmé et région V1 à reconfirmer, D15 Marches de Braise sans lien avec D5), Sylvaronde (D13 Delta), puis les deux dimensions homonymes D7/D8. Vérifier spécialement les deux fiches portant des noms égaux à leur dimension, la différence de titre D1 entre maître et seed, les niveaux souterrains D5/D6, les IDs réels et les droits par campagne.

**Gate relative VALIDÉE (28/09/2026) ; Gate géopoints/IDs métier/confidentialité EN ATTENTE.** Les autres continents restent disponibles pour de futurs donjons ; aucune génération lancée.
## 6. Migration des anciens cahiers après validation du pivot

| Fichiers V1 actuellement présents | Traitement **futur**, pas dans cette PR |
|---|---|
| `V6-MAP-MAITRE.md` | Conserver lisible et historique ; basculer l'autorité active vers le maître V2 seulement après accord du propriétaire et revue des renvois. |
| `V6-MAP-A0-CONTRAT.md`, `V6-MAP-A0-ANNEXE-CONTRATS.md` | Préserver preuves et registres V1 ; amender explicitement contrats de vue/hiérarchie et nombre de vues côté V2, sans réécrire rétroactivement la Gate. |
| A1 et A2 : POC, validation et rapport iPad | Archiver comme preuve historique utile (moteur léger, cache, essais), mais leurs pyramides de tuiles n'obligent plus à produire des niveaux de zoom artistiques. |
| `V6-MAP-B1-RESSOURCES-ARDERA.md` | Remplacer son plan 4K→8K→16K/tuiles par master 4K approuvé + sept fonds indépendants natifs, avec vérification de fidélité géographique. |
| `V6-MAP-B2-INTERFACE.md` / `B3-TOPONYMIE.md` | Reprendre hotspots mondiaux, navigation parent/enfant et surcouches textuelles/visibilité par vue, sans progressivité de zoom inter-fonds. |
| `V6-MAP-B4-DONJONS-CODEX.md` | Substituer les **affectations V2 validées** à la table V1 devenue historique ; attendre l'arbitrage des géopoints et IDs métier avant intégration, préserver confidentialité et marqueurs dynamiques. |
| `V6-MAP-C1-DIMENSIONS.md` | Conserver trois cartes distinctes, actualiser **les noms de présentation** La Brasserie Céleste et L'Enfer de la Sobriété Éternelle, conserver provisoirement les IDs conceptuels historiques, ajouter leur accès depuis l'Entrevers ; ne pas confondre carte supérieure, Trame et donjons homonymes. |
| `V6-MAP-C2-CAMPAGNES-SECRETS.md` | Préserver ses garanties de filtrage, à adapter au modèle de vues et au backend V7 réellement établi. |
| `V6-MAP-C3-PWA-VALIDATION.md` | Requalifier cache/offline et essais Safari pour douze vues potentielles, pas quatre pyramides multi-résolution. |
| `AGENTS.md` | Ne mettre à jour les références actives qu'après activation formelle de V2 ; aucun changement de la politique média/V7. |

**Ne pas supprimer les anciens cahiers pendant l'étude** : les chemins de référence existants et la traçabilité des décisions doivent rester disponibles. Après acceptation V2, prévoir un commit de migration documentaire/renvois isolé, puis les lots d'implémentation séparés.

## 7. Livrables et critères de fermeture de cette préparation

Le cadrage initial produisait deux documents ; la décision utilisateur du 28/09/2026 a autorisé **un troisième fichier, le registre V2 des quinze affectations validées**, et leur répercussion dans les deux documents de cadrage. L'ordre ultérieur « go » a autorisé un **quatrième document, le cahier conceptuel de Valdorie**, sans production d'image et sans remplissage fictif de coordonnées. Critères de revue : l'Entrevers figure bien au-dessus du monde et distinct de la Trame ; les sept continents et les trois dimensions subsistent ; 13+2 affectations et zones relatives **validées, géopoints réservés** ; aucune résolution inventée ; aucune mise en scène de site secret ; aucun upgrade du runtime, des services, de l'IndexedDB ni des assets. Les décisions en attente sont le concept visuel de l'Entrevers, l'arbitrage des quinze placements et la capacité native réelle des futures générations.
