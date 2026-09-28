# V6-Map — Pivot V2 : feuille de route Entrevers → monde → continents

Statut : **PIVOT DOCUMENTAIRE EN REVUE ; 13 ARBITRAGES VALDORIE VALIDÉS**. Affectations et positions relatives D1–D15 + noms des deux dimensions **VALIDÉS par le propriétaire le 28/09/2026** ; coordonnées numériques et géopoints toujours RÉSERVÉS. Ce document prépare la refonte, sans remplacer à lui seul `V6-MAP-MAITRE.md` ni révoquer ses décisions de lore. Aucun code, aucune image et aucune donnée de production ne sont modifiés par ce lot.

Références : `AGENTS.md`, `V6-MAP-MAITRE.md`, `V6-MAP-A0-ANNEXE-CONTRATS.md`, A1/A2, B1–B4, C1–C3 et `V6-MAP-PIVOT-V2-ARCHITECTURE-DOCUMENTAIRE.md` et `V6-MAP-V2-REGISTRE-IMPLANTATIONS.md`. La source visuelle approuvée de la mappemonde 4K doit encore être inventoriée comme asset réel ; ne pas présumer sa présence dans le dépôt.

## 1. Décisions expresses du pivot

1. **Mappemonde d'Ardéra déjà approuvée, affichée comme carte mondiale 4K** ; pas de nouvelle campagne d'enrichissement 8K/16K mondial, pas d'upscaling.
2. **Sept cartes continentales illustrées indépendantes**, riches en géographie, civilisations et humour Gargotte ; clic sur une zone de la mappemonde → ouverture de sa carte dédiée, retour explicite. Pas de transition par zoom entre différents niveaux de peinture.
3. **L'Entrevers au-dessus d'Ardéra** dans la hiérarchie de consultation. Créer une vue illustrée de l'univers / sommaire cosmologique dédiée, dont le parti pris graphique et les liens restent à définir. L'Entrevers (univers) **n'est pas** la Trame astrale (réalité intermédiaire) et sa position supérieure dans l'interface n'établit aucune proximité spatiale ni portail fictionnel.
4. Conserver en plus les **trois cartes dimensionnelles distinctes** déjà prévues : Trame astrale, **La Brasserie Céleste** et **L'Enfer de la Sobriété Éternelle**. Ces deux derniers noms remplacent leurs anciens noms de travail « Hautes Fermentations » et « Royaume des Soifs Éteintes » ; ne pas confondre chaque dimension avec son donjon homonyme D7 ou D8. Les clés conceptuelles historiques restent stables jusqu'à une décision de migration explicite. Les futures dimensions disposent d'entrées extensibles, sans carte inventée à l'avance.
5. **Interdiction absolue de l'upscaling** pour revendiquer la résolution ou le détail d'un nouveau fond. Vérifier pixels natifs de chaque sortie ; choisir la résolution et le ratio de chaque continent selon le moteur effectivement disponible et sa morphologie. Une définition non atteinte n'est pas déclarée « native ». Préparer séparément les variantes de diffusion éventuellement plus petites ; ne pas les présenter comme de nouvelles peintures.
6. **Les quinze affectations et zones relatives V2 sont VALIDÉES**, selon le registre indépendant. STOP maintenu pour les coordonnées exactes, le raccordement aux IDs métier et la confidentialité avant intégration cartographique ou brief artistique qui matérialiserait un lieu sensible. Les affectations V1 demeurent un historique, pas la répartition opérationnelle actuelle.
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
├── La Brasserie Céleste (dimension, distincte du donjon D7 du même nom)
└── L'Enfer de la Sobriété Éternelle (dimension, distincte du donjon D8 du même nom)
```

Soit **12 vues graphiques de consultation envisagées** : 1 Entrevers, 1 Ardéra, 7 continents, 3 dimensions. Cela ne signifie ni douze dimensions physiques ni douze niveaux de zoom. Les Plans divins/infernaux sont des familles, pas des cartes uniques ; les ouvertures directes restent des actions de navigation, non des portails confirmés dans le lore. Toute option « aller à » indique une consultation et jamais une téléportation fictive.

Parcours principal : Entrevers → Ardéra → continent → panneau de lieu autorisé → Codex. Retours au parent, accès aux autres cartes et action « Revenir à la Chope » à repenser dans ce parcours sans perdre son statut central. Pour les cartes dimensionnelles, navigation depuis l'Entrevers et retour. Aucune obligation de visualiser les douze fonds simultanément.

## 3. Registres géographiques et navigation

- Une image par vue, avec `view_id` stable, `parent_view_id` éventuel, version d'asset immuable, dimensions natives réelles, ratio, URL et miniature/fallback si réellement disponibles. Ne pas confondre identifiants de vue avec IDs des fiches Codex.
- Les sept zones cliquables de la mappemonde ont des polygones/hitboxes séparés du bitmap. Les vues continentales possèdent chacune leur repère local indépendant 0..100. Il n'est pas requis de faire coïncider chaque pixel continental avec une transformation mathématique du 4K, mais silhouettes, baies, grands réseaux et merveilles doivent rester reconnaissables et compatibles. Ne pas inventer de coordonnées définitives par simple recadrage.
- Prévoir des emplacements réservés à l'extension : nouvelles vues/dimensions, régions d'intérêt ultérieures, ports, villes et liens entre cartes, sans les exposer comme lieux de lore validés.
- Les 42 régions, sept continents, sept merveilles, quatre océans et cinq mers validés sont conservés. La Mer des Trois Couronnes garde ses **deux sorties**, les mers intérieures de Pelagrève leurs connexions ; pas de pont terrestre ajouté.
- Une éventuelle loupe d'accessibilité **dans une image** ne doit pas réintroduire un pipeline de zoom cartographique multi-fonds ni servir à justifier un faux 8K/16K.

## 4. Registre des donjons : affectations validées, géopoints réservés

**Référence courante :** [`V6-MAP-V2-REGISTRE-IMPLANTATIONS.md`](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md). Pour Valdorie : [`V6-MAP-V2-CONTINENT-VALDORIE.md`](V6-MAP-V2-CONTINENT-VALDORIE.md) et [neuf concepts VALIDÉS sans réserve](V6-MAP-V2-VALDORIE-ILLUSTRATIONS-DONJONS.md). Le document maître V1 et l'annexe A0 consignent les anciennes pistes et restent archivables comme **historique**, sans déterminer les affectations V2.

| Vue | Donjons validés | Total |
|---|---|---:|
| Valdorie | D1, D2, D3, D4, D5, D6, D9, D10, D11 | 9 |
| Ferrécime | D12, D14, D15 | 3 |
| Sylvaronde | D13 | 1 |
| La Brasserie Céleste (dimension) | D7 | 1 |
| L'Enfer de la Sobriété Éternelle (dimension) | D8 | 1 |
| Boréclat, Sahaldune, Pelagrève, Austrébrume, Trame et vue Entrevers | Aucun D1–D15 | 0 |

**13 sur Ardéra + 2 dimensionnels = 15.** D1/D2 sont proches de la Chope ; D3/D4 partagent la grande ville des **Plaines de Valdor** ; D6 est **directement sous D5** ; D15 est dans les **Marches de Braise** de Ferrécime, **sans lien avec D5**. Toutes les autres précisions, y compris l'absence de coordonnées finales, sont consignées dans le registre.

**Gate : affectations/régions relatives VALIDÉES, plus précisions Valdorie et principe des neuf lieux initialement cachés et révélés par MJ par campagne VALIDÉS en conception ; **neuf concepts d'illustration VALIDÉS sans réserve** ; images finales, coordonnées, identité métier, implémentation des accès et vérification du filtrage EN ATTENTE.** Aucun point secret n'est peint dans un fond public et aucun portail n'est déduit des proximités.
## 5. Ordre de travail et gates

| Phase | Travail borné | Condition de sortie |
|---|---|---|
| P0. Pivot documentaire | Feuille de route + architecture des fichiers, sans changer le maître actif ni le runtime | Revue utilisateur du nouveau modèle et de l'Entrevers |
| P1. Implantations V2 | **Affectations et positions relatives validées le 28/09/2026** ; confronter aux fiches de lore, confirmer point local, niveaux souterrains, IDs métier, statut public/secret et réserve future | Gate relative VALIDÉE ; Gate des géopoints et de l'exposition des secrets **EN ATTENTE** ; aucun prompt indiquant des entrées cachées avant |
| P2. Contrats V2 | Réviser maître/A0/B1/B2/B3/B4/C1/C2/C3 selon architecture documentaire, conserver preuves A1/A2 comme historique du POC | Aucun contrat contredit le pivot, aucun ID ou secret exposé |
| P3. Direction artistique et pilote | **13 arbitrages Valdorie validés : paysage 3:2 avec marges maritimes, cité fortifiée anonyme, grand port, 3–5 bourgs, Chope modeste et identifiable, 25–30 gargotteries, aucun texte peint, pas de zones futures prédéfinies.** **Les neuf concepts de donjons ont été validés sans réserve le 28/09/2026.** Inventorier le vrai master 4K, démontrer la sortie native 3:2 et le contrat de ressources sensibles, puis produire/revoir le fond public et les futurs rendus conditionnels selon gates distinctes | **Gate concept artistique VERTE** ; restent la preuve de la source mondiale 4K, la sortie native 3:2, le contrôle lore/QA et l'approbation des rendus ; AUCUN UPSCALING |
| P4. Continents restants | Six cartes indépendantes, statut individuel, zones cliquables sur Ardéra et registre de lieux | Sept cartes visuellement approuvées et cohérentes avec le monde |
| P5. Cartes dimensionnelles et Entrevers | Produire les 3 cartes préexistantes et la vue supérieure de l'Entrevers après validation artistique/cosmologique de celle-ci | Douze vues consultables sans confusion univers/Trame/portails |
| P6. Intégration et validation | Navigation par vues, surcouches, Codex, droits MJ/joueur par campagne, chargement paresseux, cache/offline réel iPad | Aucun secret fuyant, aucune perte IndexedDB/Blobs, tests iPad et rollback documentés |

P3/P4 et P5 peuvent être préparés en parallèle après décision de l'architecture, mais **aucune illustration sensible ne doit être intégrée/publiée avant les positions, IDs et contrôles de droits P1/P3**. Les concepts artistiques sont validés ; la création d'un fond public sans donjons pourra être instruite séparément dès preuve du master mondial et de la génération native. La Chope est le seul des dix repères publics/donjons de Valdorie à être peint dans le fond de base ; les neuf donjons ont chacun leur illustration conditionnelle. Les anciennes Gates A0/A1/A2 restent historiquement vertes pour leur périmètre, sans valider automatiquement la nouvelle UX ni les nouveaux fonds. Le POC de tuiles A1/A2 sert de retour d'expérience, pas d'obligation de conserver une pyramide de zoom.

## 6. Politique de sûreté et de livraison

- Le fond d'une vue contient uniquement du décor public. Aucun secret lisible ou devinable, y compris par forme distinctive créée à l'emplacement d'un donjon caché.
- Les positions/noms/aperçus/recherche des lieux sensibles sont filtrés par le backend réel et la campagne **avant transmission**. La vue MJ et son « Aperçu joueurs » gardent les protections historiques. Ne présumer aucun rôle/API V7 en place avant inspection.
- L'Atlas n'est ni un éditeur ni une mécanique de déplacement/jeu. Préserver IDs, relations, IndexedDB, Blobs, médias détourés et chantier V7.
- Optimiser chaque vue native pour Safari iPad : pas de décodage des douze cartes au bootstrap, chargement ciblé, déchargement/éviction, fallback et cache versionné exact ; politique offline à requalifier sur images réelles. Ne pas confondre les assets Atlas avec les médias métier V7.
- Statuts obligatoires dans les fichiers : VALIDÉ / V1 PROVISOIRE / RÉSERVÉ. Une proposition d'architecture ou de décor n'est pas du lore canonique.

## 7. Arrêts obligatoires de ce lot

Ce pivot documentaire **ne lance ni production de Valdorie ni placement à coordonnées définitives** ; les affectations V2 validées sont enregistrées. Ne pas convertir la hiérarchie des vues en carte physique des portails. Ne pas supprimer/archiver les documents encore actifs avant approbation de la V2 et décision de remplacement. Aucun commit runtime, asset image, schéma de données ou opération IndexedDB.
