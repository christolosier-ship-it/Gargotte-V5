# V6-Map — Pivot V2 : architecture documentaire et plan de migration

**NOTE DE CLÔTURE ET DE DÉCOMMISSIONNEMENT (29/09/2026) :** document du pivot historique V2. [Maître V2 actif](V6-MAP-MAITRE-V2.md) et [socle géographique V2](V6-MAP-V2-SOCLE-GEOGRAPHIQUE-ARDERA.md). Après la PR #60, le propriétaire a demandé le retrait complet des quinze cahiers archivés V1 et des exécutables A1/A2 ; leurs traces ne subsistent que dans l'historique Git (#55–#60). Les « futurs fichiers » et anciennes étapes ci-dessous reflètent les décisions préparatoires, pas des tâches à rouvrir. Aucun nouveau brief Trame astrale ici.

Statut : **PROPOSITION DOCUMENTAIRE EN REVUE ; REGISTRE D'AFFECTATIONS V2 CRÉÉ et validé pour les zones relatives le 28/09/2026**. Complément de `V6-MAP-PIVOT-V2-FEUILLE-DE-ROUTE.md` ; aucun remplacement immédiat du maître actif, aucune coordonnée précise ou implantation technique définitive, et aucun prompt de production continentale. Ne pas interpréter un fichier « à créer » ci-dessous comme déjà présent dans GitHub.

## 1. Principes d'organisation

- Une **autorité V2 unique** pour les décisions pérennes, et des cahiers courts qui renvoient au maître plutôt que dupliquent son lore.
- Un **registre indépendant des implantations** désormais présent : `V6-MAP-V2-REGISTRE-IMPLANTATIONS.md`. Les affectations et positions relatives ont été validées par le propriétaire ; **les coordonnées terrestres des treize implantations, IDs métier et règles d'exposition restent en attente**, sans figement par rédaction automatique.
- Une fiche par **vue illustrée** : 1 Entrevers, 7 continents et 3 cartes dimensionnelles. Ardéra 4K est une illustration déjà approuvée : le maître et le contrat des fonds la référencent, sans la régénérer.
- Distinguer **cosmologie / représentation graphique / navigation d'interface**. Une vue « Entrevers » en tête de navigation n'est ni la Trame astrale ni une preuve de portail ou de topologie spatiale.
- Pas d'upscaling, jamais de promesse de « natif 4K/8K » sans dimensions réelles contrôlées. Le ratio/rendu natif de chaque carte continentale est décidé en fonction de sa morphologie et d'une génération techniquement démontrée, pas imposé arbitrairement à 4096².
- **Cartes publiques, surcouches sensibles privées** : aucune localisation de donjon secret ne se lit dans le fond ; positions et fiches protégées par filtrage préalable selon campagne.
- Réemploi des décisions géographiques V1, des résultats POC A0/A1/A2 et des garanties données/médias V6/V7 ; réécrire les prescriptions de pyramide/zoom devenues obsolètes, sans effacer les preuves historiques.

## 2. Arborescence V2 proposée (registre, cahier Valdorie et annexe des neuf illustrations déjà créés ; autres fichiers encore futurs)

```text
docs/v6-map/
├── V6-MAP-MAITRE-V2.md
├── V6-MAP-V2-REGISTRE-IMPLANTATIONS.md
├── V6-MAP-V2-PRODUCTION-FONDS.md
├── V6-MAP-V2-DA-GARGOTTE.md
├── V6-MAP-V2-ENTREVERS.md
├── V6-MAP-V2-CONTINENT-VALDORIE.md
├── V6-MAP-V2-VALDORIE-ILLUSTRATIONS-DONJONS.md
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

Ces dix-huit fichiers constituent la **structure cible**, et non une demande de les remplir immédiatement. **Exceptions : le registre des quinze donjons, le cahier pilote Valdorie et son annexe de neuf illustrations sont créés dans la branche documentaire** ; les autres noms sont des fichiers futurs. L'image mondiale n'est pas un dix-neuvième fichier Markdown : elle est un asset à inventorier/versionner. Les deux fichiers `V6-MAP-PIVOT-V2-*.md` servent uniquement de proposition de transition.

## 3. Responsabilité précise de chaque document

| Fichier | Responsabilité unique / critère d'entrée |
|---|---|
| `V6-MAP-MAITRE-V2.md` | Décisions canoniques, univers/Trame/Ardéra, arborescence 12 vues, 7 continents/42 régions/7 merveilles, statuts VALIDÉ/PROVISOIRE/RÉSERVÉ, navigation monde→continent, interdiction upscale, confidentialité et ordre des gates. Rédiger après revue du pivot. |
| `V6-MAP-V2-REGISTRE-IMPLANTATIONS.md` | **Déjà créé** : quinze affectations et positions relatives V2 validées, distinctions par dimension, historique V1 et corrections. Les coordonnées finales, IDs métier, critères de visibilité et accès demeurent réservés. **Aucune coordonnée finale déduite de la validation relative.** |
| `V6-MAP-V2-PRODUCTION-FONDS.md` | Inventaire/hash de la vraie image maître 4K, références et droits, contrat fichier natif, ratio individuel, test de taille réelle, PNG source, dérivés de diffusion plus petits si besoin, aucun upscale, nomination/versionnement, contrôle avant/après, rollback. |
| `V6-MAP-V2-DA-GARGOTTE.md` | Bible de peinture et d'humour : tavernes, bière, foire, bordel joyeux, burlesque grivois adulte et non explicite, gargotteries publiques par biome ; dosage/lisibilité ; aucun décor suggérant un secret. |
| `V6-MAP-V2-ENTREVERS.md` | **Vue supérieure illustrée** de l'univers et ses entrées navigables ; distinction d'Ardéra, de la Trame et des familles de plans ; langage graphique cosmologique ; représentation symbolique plutôt que modèle astronomique non attesté ; aucun portail inventé. Concept graphique et liens à valider avant génération. |
| `V6-MAP-V2-CONTINENT-*.md` (7) | **Valdorie : 13 décisions du propriétaire VALIDÉES le 28/09/2026 ; aucune génération autorisée ; les six autres fiches sont futures.** Une fiche par continent, calée sur la mappemonde : six régions approuvées, merveille, silhouettes et hydrographie, paysages, civils anonymes, routes/ports, scènes Gargotte, limites de confidentialité, affectations relatives du registre, extensions futures, prompt conceptuel et contrôle sortie native. Coordonnées exactes et droits avant prompt exécutable. |
| `V6-MAP-V2-VALDORIE-ILLUSTRATIONS-DONJONS.md` | **Créé : neuf concepts de silhouettes D1/D2/D3/D4/D5/D6/D9/D10/D11, TOUS VALIDÉS SANS RÉSERVE par le propriétaire le 28/09/2026 ; rendus finaux encore à produire et inspecter.** Contracte l'image indépendante, le calque conditionnel, l'absence d'assets secrets publics ; pas d'image produite. |
| `V6-MAP-V2-DIMENSION-*.md` (3) | Trame astrale, **La Brasserie Céleste** et **L'Enfer de la Sobriété Éternelle** : régions/territoires du corpus existant, palette, références, D7/D8 dans leurs dimensions homonymes mais comme objets distincts, fond sans secret, consultation ≠ accès réel ; aucune assimilation Trame=Entrevers. Conserver provisoirement les anciennes clés conceptuelles map_id jusqu'à contrat de migration. |
| `V6-MAP-V2-NAVIGATION-TOPONYMIE-CODEX.md` | Contrat vue par vue/hotspots indépendants des bitmaps, identifiants stables, retours, Chope, label dynamique, panneau Codex, extension, pas de changement de fond piloté par zoom. |
| `V6-MAP-V2-SECURITE-OFFLINE-VALIDATION.md` | Filtrage MJ/joueur/campagne côté backend, absence de secrets en image/recherche/cache/URL, chargement paresseux, ressources versionnées, validation Safari iPad, vraie qualification offline et non-régression IndexedDB/V7. |

## 4. Gabarit contraignant d'une fiche continent

Une même fiche contient ces rubriques dans cet ordre, sans réécrire le registre central : (1) statut et références visuelles validées ; (2) silhouette/côtes et zones adjacentes ; (3) six régions et merveille canonique ; (4) reliefs/hydrographie/continuités obligatoires ; (5) civilisation publique et axes commerciaux en **propositions artistiques** ; (6) catalogue de gargotteries publiques propres au biome ; (7) renvoi aux donjons du registre **uniquement après Gate placement**, sans peindre de secret ; (8) réserves pour sites et régions futurs ; (9) capacité native du générateur, ratio/dimensions choisies, rapport de pixels ; (10) prompt final et contrôle QA ; (11) décision utilisateur et statut de validation graphique. Les profils non arbitrés restent des documents de préparation, jamais des ordres de génération finale.

## 5. Registre D1–D15 : décision relative enregistrée, finalisation restant à faire

Le registre [`V6-MAP-V2-REGISTRE-IMPLANTATIONS.md`](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md) est créé. Le propriétaire a validé les **affectations continentales et dimensionnelles, les positions relatives, puis les précisions Valdorie** (D1 collines, D2 forêt, D3 hôtelier, D4 festif, D5/D6 marqueur partagé, D9 profonde Sylve, D10 côte rocheuse, D11 transition prairie-forêt) ; aucun point numérique n'est validé : **Valdorie 9, Ferrécime 3, Sylvaronde 1, La Brasserie Céleste D7, L'Enfer de la Sobriété Éternelle D8**. Les noms de dimensions remplacent les anciens noms de travail, mais les clés `map_id` conceptuelles restent inchangées avant migration explicitement planifiée ; distinguer D7 et D8 de leurs dimensions homonymes.

Conserver pour chaque entrée le `placement_id` conceptuel stable, l'ID Dn éditorial, le titre à confronter au catalogue réel, `entity_type/entity_id` réel ou « non résolu », dimension/continent/région validés ou provisoires selon champ, point local **vide avant décision**, profondeur si souterrain, visibilité public/MJ à établir, historique V1, validation du propriétaire, réserve d'extension et éventuels conflits de lore. Aucun site secret ne doit être suggéré dans un fond raster public.

**Ordre de finalisation géométrique recommandé :** Valdorie (D1, D2 proches de la Chope ; D3/D4 dans une même ville des Plaines de Valdor ; D5/D6 en superposition verticale ; D9 dans la Sylve ; D10 aux Côtes Grises ; D11 à l'est des Plaines), Ferrécime (D12 montagne, D14 continent confirmé et région V1 à reconfirmer, D15 Marches de Braise sans lien avec D5), Sylvaronde (D13 Delta), puis les deux dimensions homonymes D7/D8. Vérifier spécialement les deux fiches portant des noms égaux à leur dimension, la différence de titre D1 entre maître et seed, les niveaux souterrains D5/D6, les IDs réels et les droits par campagne.

**Gate relative VALIDÉE (28/09/2026) ; Gate géopoints/IDs métier/confidentialité EN ATTENTE.** Les autres continents restent disponibles pour de futurs donjons ; aucune génération lancée.
## 6. Clôture de migration et retrait du corpus V1

- **PR #60** : maître et registre V2 réconciliés ; quinze cahiers V1 initialement transférés dans une archive pour vérification.
- **Nettoyage demandé ensuite par le propriétaire** : quinze pièces V1 et index d'archive retirés de l'arborescence actuelle, ainsi que `poc/v6-map-a1/`, scripts, configurations, tests et CI A1/A2. Historique et preuves d'époque toujours consultables via les commits des PR #55 à #60 ; **pas** une Gate pour les futurs fonds artistiques.
- La géographie encore utile a été reportée dans le [socle géographique V2](V6-MAP-V2-SOCLE-GEOGRAPHIQUE-ARDERA.md), sous l'autorité des arbitrages récents par continent. Les anciens modèles de pyramide d'images et géopoints D7/D8 n'ont plus de statut prescriptif.
- [Maître V2](V6-MAP-MAITRE-V2.md), [cadrage commun](V6-MAP-V2-SIX-CONTINENTS-CADRAGE.md), [registre unique](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md) et cahiers de zones demeurent les seules sources actives de conception. Le code métier, les médias, IndexedDB, V7 et le Service Worker principal ne sont pas concernés.

## 7. Livrables et critères de fermeture de cette préparation

Le cadrage initial produisait deux documents ; la décision utilisateur du 28/09/2026 a autorisé **un troisième fichier, le registre V2 des quinze affectations validées**, et leur répercussion dans les deux documents de cadrage. L'ordre ultérieur « go » a autorisé un **quatrième document, le cahier conceptuel de Valdorie**, puis les treize arbitrages ont été actés et une **cinquième pièce, l'annexe des neuf concepts d'illustration**, a été créée puis **entièrement approuvée sans réserve** par le propriétaire le 28/09/2026. Aucune production d'image, aucun remplissage fictif de coordonnées. Critères de revue : l'Entrevers figure bien au-dessus du monde et distinct de la Trame ; les sept continents et les trois dimensions subsistent ; 13+2 affectations et zones relatives **validées, géopoints réservés** ; aucune résolution inventée ; aucune mise en scène de site secret ; aucun upgrade du runtime, des services, de l'IndexedDB ni des assets. Les décisions en attente sont le concept visuel de l'Entrevers, **les géopoints numériques et neuf rendus finaux de donjons Valdorie**, les IDs métier, la vraie image mondiale source 4K et la capacité native réelle des futures générations. Les neuf concepts esthétiques sont déjà approuvés et ne sont pas à redécider. Les treize arbitrages de composition Valdorie sont VALIDÉS.
