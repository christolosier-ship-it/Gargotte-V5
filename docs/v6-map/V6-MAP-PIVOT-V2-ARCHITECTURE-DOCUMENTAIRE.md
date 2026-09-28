# V6-Map — Pivot V2 : architecture documentaire et plan de migration

Statut : **PROPOSITION DOCUMENTAIRE À VALIDER**. Complément de `V6-MAP-PIVOT-V2-FEUILLE-DE-ROUTE.md` ; aucun remplacement immédiat du maître actif, aucune implantation définitive et aucun prompt de production continentale. Ne pas interpréter un fichier « à créer » ci-dessous comme déjà présent dans GitHub.

## 1. Principes d'organisation

- Une **autorité V2 unique** pour les décisions pérennes, et des cahiers courts qui renvoient au maître plutôt que dupliquent son lore.
- Un **registre indépendant des implantations** à valider en séance avec le propriétaire AVANT les briefs continentaux. Les quinze lieux ne seront pas figés par rédaction automatique.
- Une fiche par **vue illustrée** : 1 Entrevers, 7 continents et 3 cartes dimensionnelles. Ardéra 4K est une illustration déjà approuvée : le maître et le contrat des fonds la référencent, sans la régénérer.
- Distinguer **cosmologie / représentation graphique / navigation d'interface**. Une vue « Entrevers » en tête de navigation n'est ni la Trame astrale ni une preuve de portail ou de topologie spatiale.
- Pas d'upscaling, jamais de promesse de « natif 4K/8K » sans dimensions réelles contrôlées. Le ratio/rendu natif de chaque carte continentale est décidé en fonction de sa morphologie et d'une génération techniquement démontrée, pas imposé arbitrairement à 4096².
- **Cartes publiques, surcouches sensibles privées** : aucune localisation de donjon secret ne se lit dans le fond ; positions et fiches protégées par filtrage préalable selon campagne.
- Réemploi des décisions géographiques V1, des résultats POC A0/A1/A2 et des garanties données/médias V6/V7 ; réécrire les prescriptions de pyramide/zoom devenues obsolètes, sans effacer les preuves historiques.

## 2. Arborescence V2 proposée (fichiers futurs, non créés par ce lot)

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
├── V6-MAP-V2-DIMENSION-HAUTES-FERMENTATIONS.md
├── V6-MAP-V2-DIMENSION-ROYAUME-SOIFS-ETEINTES.md
├── V6-MAP-V2-NAVIGATION-TOPONYMIE-CODEX.md
└── V6-MAP-V2-SECURITE-OFFLINE-VALIDATION.md
```

Ces dix-sept fichiers constituent la **structure cible**, et non une demande de les remplir immédiatement. L'image mondiale n'est pas un dix-huitième fichier Markdown : elle est un asset à inventorier/versionner. Les deux fichiers `V6-MAP-PIVOT-V2-*.md` servent uniquement de proposition de transition.

## 3. Responsabilité précise de chaque document

| Fichier | Responsabilité unique / critère d'entrée |
|---|---|
| `V6-MAP-MAITRE-V2.md` | Décisions canoniques, univers/Trame/Ardéra, arborescence 12 vues, 7 continents/42 régions/7 merveilles, statuts VALIDÉ/PROVISOIRE/RÉSERVÉ, navigation monde→continent, interdiction upscale, confidentialité et ordre des gates. Rédiger après revue du pivot. |
| `V6-MAP-V2-REGISTRE-IMPLANTATIONS.md` | Quinze dossiers D1–D15 ; ancienne piste V1, vérification du lore/source Codex, dimension/continent proposé, région, position locale discutée, niveau public/secret, statut de décision du propriétaire, lien métier réel, réserve pour extensions. **Aucune coordonnée finale avant validation commune.** |
| `V6-MAP-V2-PRODUCTION-FONDS.md` | Inventaire/hash de la vraie image maître 4K, références et droits, contrat fichier natif, ratio individuel, test de taille réelle, PNG source, dérivés de diffusion plus petits si besoin, aucun upscale, nomination/versionnement, contrôle avant/après, rollback. |
| `V6-MAP-V2-DA-GARGOTTE.md` | Bible de peinture et d'humour : tavernes, bière, foire, bordel joyeux, burlesque grivois adulte et non explicite, gargotteries publiques par biome ; dosage/lisibilité ; aucun décor suggérant un secret. |
| `V6-MAP-V2-ENTREVERS.md` | **Vue supérieure illustrée** de l'univers et ses entrées navigables ; distinction d'Ardéra, de la Trame et des familles de plans ; langage graphique cosmologique ; représentation symbolique plutôt que modèle astronomique non attesté ; aucun portail inventé. Concept graphique et liens à valider avant génération. |
| `V6-MAP-V2-CONTINENT-*.md` (7) | Une fiche par continent, calée sur la mappemonde : six régions approuvées, merveille, silhouettes et hydrographie, paysages, civils anonymes, routes/ports, scènes Gargotte, limites de confidentialité, donjons **après** registre validé, extensions futures, prompt spécifique et contrôle sortie native. |
| `V6-MAP-V2-DIMENSION-*.md` (3) | Les trois cartes séparées déjà prévues : régions/territoires approuvés, palette, références, D7/D8 si validés, fond sans secret, consultation ≠ accès réel ; aucune assimilation Trame=Entrevers. |
| `V6-MAP-V2-NAVIGATION-TOPONYMIE-CODEX.md` | Contrat vue par vue/hotspots indépendants des bitmaps, identifiants stables, retours, Chope, label dynamique, panneau Codex, extension, pas de changement de fond piloté par zoom. |
| `V6-MAP-V2-SECURITE-OFFLINE-VALIDATION.md` | Filtrage MJ/joueur/campagne côté backend, absence de secrets en image/recherche/cache/URL, chargement paresseux, ressources versionnées, validation Safari iPad, vraie qualification offline et non-régression IndexedDB/V7. |

## 4. Gabarit contraignant d'une fiche continent

Une même fiche contient ces rubriques dans cet ordre, sans réécrire le registre central : (1) statut et références visuelles validées ; (2) silhouette/côtes et zones adjacentes ; (3) six régions et merveille canonique ; (4) reliefs/hydrographie/continuités obligatoires ; (5) civilisation publique et axes commerciaux en **propositions artistiques** ; (6) catalogue de gargotteries publiques propres au biome ; (7) renvoi aux donjons du registre **uniquement après Gate placement**, sans peindre de secret ; (8) réserves pour sites et régions futurs ; (9) capacité native du générateur, ratio/dimensions choisies, rapport de pixels ; (10) prompt final et contrôle QA ; (11) décision utilisateur et statut de validation graphique. Les profils non arbitrés restent des documents de préparation, jamais des ordres de génération finale.

## 5. Gabarit du registre D1–D15 et ordre de revue

Champs minima pour chaque entrée : `placement_id` stable (conception), Dn éditorial, titre exact à confronter au catalogue réel, `entity_type/entity_id` réel ou « non résolu », carte/continent/région anciennement envisagés, justification par le lore, statut ancien, proposition de zone publique/privée, point local **vide avant décision**, visibilité public/MJ, validation explicite (date/commentaire), réserve d'extension et signalement des conflits. Les dimensions disposent d'un référentiel propre ; ne pas forcer D7 et D8 sur la mappemonde matérielle.

Ordre de la séance : Valdorie (D1, D2, D4, D5, D6, D9, D11, D15), Pelagrève (D3, D10), Ferrécime (D12, D14), Sylvaronde (D13), puis D7 (Hautes Fermentations), D8 (Royaume des Soifs Éteintes). Vérifier spécialement D5/D15 distincts et la différence de titre connue de D1 entre maître et seed ; ne pas déduire les IDs réels d'un numéro D. Les autres continents sont sans implantation V1, mais gardent des réserves pour la suite.

## 6. Migration des anciens cahiers après validation du pivot

| Fichiers V1 actuellement présents | Traitement **futur**, pas dans cette PR |
|---|---|
| `V6-MAP-MAITRE.md` | Conserver lisible et historique ; basculer l'autorité active vers le maître V2 seulement après accord du propriétaire et revue des renvois. |
| `V6-MAP-A0-CONTRAT.md`, `V6-MAP-A0-ANNEXE-CONTRATS.md` | Préserver preuves et registres V1 ; amender explicitement contrats de vue/hiérarchie et nombre de vues côté V2, sans réécrire rétroactivement la Gate. |
| A1 et A2 : POC, validation et rapport iPad | Archiver comme preuve historique utile (moteur léger, cache, essais), mais leurs pyramides de tuiles n'obligent plus à produire des niveaux de zoom artistiques. |
| `V6-MAP-B1-RESSOURCES-ARDERA.md` | Remplacer son plan 4K→8K→16K/tuiles par master 4K approuvé + sept fonds indépendants natifs, avec vérification de fidélité géographique. |
| `V6-MAP-B2-INTERFACE.md` / `B3-TOPONYMIE.md` | Reprendre hotspots mondiaux, navigation parent/enfant et surcouches textuelles/visibilité par vue, sans progressivité de zoom inter-fonds. |
| `V6-MAP-B4-DONJONS-CODEX.md` | Reprendre **après la séance des quinze placements** ; préserver l'identité métier, la confidentialité et les marqueurs dynamiques. |
| `V6-MAP-C1-DIMENSIONS.md` | Conserver trois cartes distinctes, ajouter leur accès depuis la vue de l'Entrevers ; ne pas confondre carte supérieure et Trame astrale. |
| `V6-MAP-C2-CAMPAGNES-SECRETS.md` | Préserver ses garanties de filtrage, à adapter au modèle de vues et au backend V7 réellement établi. |
| `V6-MAP-C3-PWA-VALIDATION.md` | Requalifier cache/offline et essais Safari pour douze vues potentielles, pas quatre pyramides multi-résolution. |
| `AGENTS.md` | Ne mettre à jour les références actives qu'après activation formelle de V2 ; aucun changement de la politique média/V7. |

**Ne pas supprimer les anciens cahiers pendant l'étude** : les chemins de référence existants et la traçabilité des décisions doivent rester disponibles. Après acceptation V2, prévoir un commit de migration documentaire/renvois isolé, puis les lots d'implémentation séparés.

## 7. Livrables et critères de fermeture de cette préparation

Ce lot ne produit que **deux documents de cadrage** : feuille de route et présente structure. Critères de revue : l'Entrevers figure bien au-dessus du monde et distinct de la Trame ; les sept continents et les trois dimensions subsistent ; 13+2 placements toujours **provisoires** ; aucune résolution inventée ; aucune mise en scène de site secret ; aucun upgrade du runtime, des services, de l'IndexedDB ni des assets. Les décisions en attente sont le concept visuel de l'Entrevers, l'arbitrage des quinze placements et la capacité native réelle des futures générations.
