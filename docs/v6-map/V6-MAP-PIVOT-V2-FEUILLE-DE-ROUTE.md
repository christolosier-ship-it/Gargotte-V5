# V6-Map — Pivot V2 : feuille de route Entrevers → monde → continents

Statut : **PROPOSITION DOCUMENTAIRE À VALIDER**. Décision de conception demandée le 28/09/2026. Ce document prépare la refonte, sans remplacer à lui seul `V6-MAP-MAITRE.md` ni révoquer ses décisions de lore. Aucun code, aucune image et aucune donnée de production ne sont modifiés par ce lot.

Références : `AGENTS.md`, `V6-MAP-MAITRE.md`, `V6-MAP-A0-ANNEXE-CONTRATS.md`, A1/A2, B1–B4, C1–C3 et `V6-MAP-PIVOT-V2-ARCHITECTURE-DOCUMENTAIRE.md`. La source visuelle approuvée de la mappemonde 4K doit encore être inventoriée comme asset réel ; ne pas présumer sa présence dans le dépôt.

## 1. Décisions expresses du pivot

1. **Mappemonde d'Ardéra déjà approuvée, affichée comme carte mondiale 4K** ; pas de nouvelle campagne d'enrichissement 8K/16K mondial, pas d'upscaling.
2. **Sept cartes continentales illustrées indépendantes**, riches en géographie, civilisations et humour Gargotte ; clic sur une zone de la mappemonde → ouverture de sa carte dédiée, retour explicite. Pas de transition par zoom entre différents niveaux de peinture.
3. **L'Entrevers au-dessus d'Ardéra** dans la hiérarchie de consultation. Créer une vue illustrée de l'univers / sommaire cosmologique dédiée, dont le parti pris graphique et les liens restent à définir. L'Entrevers (univers) **n'est pas** la Trame astrale (réalité intermédiaire) et sa position supérieure dans l'interface n'établit aucune proximité spatiale ni portail fictionnel.
4. Conserver en plus les **trois cartes dimensionnelles distinctes** déjà prévues : Trame astrale, Hautes Fermentations et Royaume des Soifs Éteintes. Les futures dimensions disposent d'entrées extensibles, sans carte inventée à l'avance.
5. **Interdiction absolue de l'upscaling** pour revendiquer la résolution ou le détail d'un nouveau fond. Vérifier pixels natifs de chaque sortie ; choisir la résolution et le ratio de chaque continent selon le moteur effectivement disponible et sa morphologie. Une définition non atteinte n'est pas déclarée « native ». Préparer séparément les variantes de diffusion éventuellement plus petites ; ne pas les présenter comme de nouvelles peintures.
6. **Le placement des 15 donjons est un STOP de validation avec le propriétaire**, avant brief artistique définitif de Valdorie, peinture qui les suggérerait ou intégration de leurs points dans l'application. Conserver la proposition V1 antérieure, ses statuts et ses réserves ; aucun placement définitif tacite.
7. Direction artistique : fantasy peinte sur parchemin, riche en scènes burlesques de taverne, bière, chaos, absurdité et sous-entendus grivois non explicites, compatible avec la lecture cartographique. Tout détail comique public doit rester indépendant d'un indice narratif secret.
8. **Fond raster strictement public** : aucun nom, label, marqueur interactif, entrée identifiable de donjon secret, portail non attesté ou indice caché n'est peint dans le fond. Noms, localisations, états de découverte et droits restent en surcouches/données filtrées avant transmission aux joueurs. Les positions des 15 donjons sont préparées en registre de conception séparé de l'illustration.

## 2. Architecture de consultation cible

```text
L'Entrevers (vue supérieure de l'univers / sommaire cosmologique)
├── Ardéra (mappemonde matérielle 4K approuvée)
│   ├── Valdorie
│   ├── Boréclat
│   ├── Sahaldune
│   ├── Sylvaronde
│   ├── Ferrécime
│   ├── Pelagrève
│   └── Austrébrume
├── Trame astrale (carte indépendante)
├── Hautes Fermentations (carte indépendante, nom géographique de travail)
└── Royaume des Soifs Éteintes (carte indépendante, nom géographique de travail)
```

Soit **12 vues graphiques de consultation envisagées** : 1 Entrevers, 1 Ardéra, 7 continents, 3 dimensions. Cela ne signifie ni douze dimensions physiques ni douze niveaux de zoom. Les Plans divins/infernaux sont des familles, pas des cartes uniques ; les ouvertures directes restent des actions de navigation, non des portails confirmés dans le lore. Toute option « aller à » indique une consultation et jamais une téléportation fictive.

Parcours principal : Entrevers → Ardéra → continent → panneau de lieu autorisé → Codex. Retours au parent, accès aux autres cartes et action « Revenir à la Chope » à repenser dans ce parcours sans perdre son statut central. Pour les cartes dimensionnelles, navigation depuis l'Entrevers et retour. Aucune obligation de visualiser les douze fonds simultanément.

## 3. Registres géographiques et navigation

- Une image par vue, avec `view_id` stable, `parent_view_id` éventuel, version d'asset immuable, dimensions natives réelles, ratio, URL et miniature/fallback si réellement disponibles. Ne pas confondre identifiants de vue avec IDs des fiches Codex.
- Les sept zones cliquables de la mappemonde ont des polygones/hitboxes séparés du bitmap. Les vues continentales possèdent chacune leur repère local indépendant 0..100. Il n'est pas requis de faire coïncider chaque pixel continental avec une transformation mathématique du 4K, mais silhouettes, baies, grands réseaux et merveilles doivent rester reconnaissables et compatibles. Ne pas inventer de coordonnées définitives par simple recadrage.
- Prévoir des emplacements réservés à l'extension : nouvelles vues/dimensions, régions d'intérêt ultérieures, ports, villes et liens entre cartes, sans les exposer comme lieux de lore validés.
- Les 42 régions, sept continents, sept merveilles, quatre océans et cinq mers validés sont conservés. La Mer des Trois Couronnes garde ses **deux sorties**, les mers intérieures de Pelagrève leurs connexions ; pas de pont terrestre ajouté.
- Une éventuelle loupe d'accessibilité **dans une image** ne doit pas réintroduire un pipeline de zoom cartographique multi-fonds ni servir à justifier un faux 8K/16K.

## 4. Registre des donjons : décision bloquante avant peinture

Le maître actuel porte une répartition **V1 PROVISOIRE APPROUVÉE**, non des coordonnées finales. Registre à examiner donjon par donjon avec le propriétaire, contre le lore réel et le fond approuvé.

| Vue proposée avant arbitrage | IDs de donjons concernés | Statut |
|---|---|---|
| Valdorie | D1, D2, D4, D5, D6, D9, D11, D15 | V1 provisoire, 8 |
| Pelagrève | D3, D10 | V1 provisoire, 2 |
| Ferrécime | D12, D14 | V1 provisoire, 2 |
| Sylvaronde | D13 | V1 provisoire, 1 |
| Boréclat, Sahaldune, Austrébrume | Aucun D1–D15 attribué à ce stade | Emplacements futurs possibles, pas d'ajout implicite |
| Hautes Fermentations | D7 | V1 provisoire, 1 |
| Royaume des Soifs Éteintes | D8 | V1 provisoire, 1 |
| Trame astrale / Entrevers | Aucun D1–D15 attribué | Ne pas déplacer D7/D8 ici sans décision |

**13 emplacements provisoires sur Ardéra + 2 dans des dimensions = 15.** Ne jamais présumer que D1…D15 sont les IDs techniques des fiches : résoudre `entity_type + entity_id` depuis le catalogue réel, détecter les écarts de titres et garder D5/D15 distincts. Si l'utilisateur souhaite changer un continent ou une dimension, réviser explicitement cette table après validation. Définir ensuite emplacement relatif, point local, accès public/secret, relation au paysage, statut et réserve d'espace pour contenus futurs. Tous les points sensibles restent invisibles pour les campagnes non autorisées.

## 5. Ordre de travail et gates

| Phase | Travail borné | Condition de sortie |
|---|---|---|
| P0. Pivot documentaire | Feuille de route + architecture des fichiers, sans changer le maître actif ni le runtime | Revue utilisateur du nouveau modèle et de l'Entrevers |
| P1. Inventaire/positionnement | Vérifier le lore des 15 donjons, les 13+2 pistes V1, la mappemonde 4K et la séparation public/secret ; discuter chaque emplacement | **Validation explicite des quinze affectations et positions** ; aucun prompt continental final avant |
| P2. Contrats V2 | Réviser maître/A0/B1/B2/B3/B4/C1/C2/C3 selon architecture documentaire, conserver preuves A1/A2 comme historique du POC | Aucun contrat contredit le pivot, aucun ID ou secret exposé |
| P3. Direction artistique et pilote | Charte Gargotte cartographique, limites de confidentialité, capacité native du générateur, puis brief et réalisation de Valdorie après P1 | Rapport pixels natifs + revue du lore, des détails et de la lisibilité |
| P4. Continents restants | Six cartes indépendantes, statut individuel, zones cliquables sur Ardéra et registre de lieux | Sept cartes visuellement approuvées et cohérentes avec le monde |
| P5. Cartes dimensionnelles et Entrevers | Produire les 3 cartes préexistantes et la vue supérieure de l'Entrevers après validation artistique/cosmologique de celle-ci | Douze vues consultables sans confusion univers/Trame/portails |
| P6. Intégration et validation | Navigation par vues, surcouches, Codex, droits MJ/joueur par campagne, chargement paresseux, cache/offline réel iPad | Aucun secret fuyant, aucune perte IndexedDB/Blobs, tests iPad et rollback documentés |

P3/P4 et P5 peuvent être préparés en parallèle après décision de l'architecture, mais **aucun visuel de donjon ou implantation nominative n'est produit avant P1**. Les anciennes Gates A0/A1/A2 restent historiquement vertes pour leur périmètre, sans valider automatiquement la nouvelle UX ni les nouveaux fonds. Le POC de tuiles A1/A2 sert de retour d'expérience, pas d'obligation de conserver une pyramide de zoom.

## 6. Politique de sûreté et de livraison

- Le fond d'une vue contient uniquement du décor public. Aucun secret lisible ou devinable, y compris par forme distinctive créée à l'emplacement d'un donjon caché.
- Les positions/noms/aperçus/recherche des lieux sensibles sont filtrés par le backend réel et la campagne **avant transmission**. La vue MJ et son « Aperçu joueurs » gardent les protections historiques. Ne présumer aucun rôle/API V7 en place avant inspection.
- L'Atlas n'est ni un éditeur ni une mécanique de déplacement/jeu. Préserver IDs, relations, IndexedDB, Blobs, médias détourés et chantier V7.
- Optimiser chaque vue native pour Safari iPad : pas de décodage des douze cartes au bootstrap, chargement ciblé, déchargement/éviction, fallback et cache versionné exact ; politique offline à requalifier sur images réelles. Ne pas confondre les assets Atlas avec les médias métier V7.
- Statuts obligatoires dans les fichiers : VALIDÉ / V1 PROVISOIRE / RÉSERVÉ. Une proposition d'architecture ou de décor n'est pas du lore canonique.

## 7. Arrêts obligatoires de ce lot

Ce pivot documentaire **ne lance ni production de Valdorie ni implantation définitive de donjon**. Ne pas convertir la hiérarchie des vues en carte physique des portails. Ne pas supprimer/archiver les documents encore actifs avant approbation de la V2 et décision de remplacement. Aucun commit runtime, asset image, schéma de données ou opération IndexedDB.
