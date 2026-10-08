# V6-Map V2 — repères de donjons façon planche MJ

## Décision propriétaire du 02/10/2026

Remplacer les sprites dans toutes les vues Map par le rendu validé dans la maquette de Ferrécime : pastille brillante, trait de liaison et cartouche beige contenant **uniquement le nom**. Aucun D1/D2/D12, numéro, code ou sprite n’est affiché, y compris dans l’index cartographique. Les identifiants techniques restent inchangés dans le registre.

Les couleurs sont arbitraires, variées et stables, sans signification de gameplay. Les sprites sont conservés dans `assets/sprites/`, mais ne sont ni chargés ni affichés par Map. La coupe illustrée souterraine est également retirée. Aucun asset, média métier ou enregistrement utilisateur n’est supprimé.

Cette décision remplace les prescriptions historiques d’intégration, de mise à l’échelle et de contour des sprites, pas les décisions de navigation. Afficher/masquer les donjons et éviction de la carte au départ restent verrouillés. Depuis la décision du 03/10/2026, les noms ouvrent une modale locale avec le titre du donjon et un contenu réservé pour la suite. Aucune relation avec une fiche Codex n’est déduite. Voir `V6-MAP-V2-LECTURE-ZOOM-CONTINENTS.md` pour le filtrage lié au zoom et les garanties de la modale.

## Couverture

Le composant est commun à toutes les cartes. Le catalogue courant comporte treize donjons : neuf à Valdorie, trois à Ferrécime, un à Sylvaronde. Le Sanctuaire et le Panthéon partagent une pastille : douze pastilles, treize cartouches au total.

Les autres fonds ne reçoivent pas de donjons inventés. La Brasserie et l’Enfer représentent chacun leur donjon par leur carte dimensionnelle entière : aucun repère intérieur nouveau. Entrevers reste sans texte superposé. Les 48 lieux-dits publics de la PR #70 et l’ensemble des toponymes sont conservés.

## Recalage sur les planches fournies

Références : `AAE35D49-83CA-4C4A-A777-93EC706B90C8(2).jpeg` (Valdorie) et `C9BB43F6-3274-49D9-A43F-E4EDF891851F(2).jpeg` (Ferrécime). Les centres des pastilles des planches, rapportés aux dimensions du fond, remplacent les anciens pieds des sprites. Les coordonnées sont des pourcentages locaux, pas des données géographiques canoniques.

| Carte | Identifiant interne | Nom affiché | Point x/y % |
|---|---|---|---|
| Valdorie | D01 | Le Château Bastognac | 74,5 / 45,7 |
| Valdorie | D02 | La Forêt en Chantier | 80,9 / 41,4 |
| Valdorie | D03 | Hôtel Zombifornia | 46,2 / 55,7 |
| Valdorie | D04 | Le Cabaret des Joyeuses | 52,7 / 59,3 |
| Valdorie | D05 | Le Sanctuaire du Houblon Noir | 48,9 / 20,8 |
| Valdorie | D06 | Le Panthéon des Fermentations Interdites | 48,9 / 20,8 |
| Valdorie | D09 | Le Bastion du Sauciflard | 89,5 / 26,7 |
| Valdorie | D10 | Les Thermes de la Bonne Trempette | 6,7 / 19,3 |
| Valdorie | D11 | La Ruche Royale | 75,2 / 48,5 |
| Ferrécime | D12 | Le Monastère des Dénaturées | 34,5 / 20,0 |
| Ferrécime | D14 | La Citadelle des Tonneaux Perchés | 39,8 / 44,9 |
| Ferrécime | D15 | Le Gynécotron du Gnome Tordu | 59,4 / 86,8 |
| Sylvaronde | D13 | Les Marécages Infectés | 68,0 / 15,8 |

La planche propriétaire prévaut ici sur les anciennes propositions de placement des sprites. Le point des Thermes est celui figurant au large du secteur nord-ouest sur la planche, pas l’ancienne proposition à l’est du port. Les positions D12, D13, D14 et D15 ont été recalées sur les annotations propriétaire du 8 octobre 2026 ; les coordonnées ci-dessus correspondent aux centres des nouveaux repères. Le Panthéon reste souterrain, directement sous le Sanctuaire : deux noms raccordés au même point, pas deux sites de surface.

## Présentation adaptative

Le point est fixe. Le cartouche possède un centre de présentation préféré et un trait calculé jusqu’à son bord. La largeur s’adapte à la chaîne ; les noms longs peuvent revenir à la ligne. Une recherche locale bornée évite les libellés publics, les autres cartouches et les pastilles, puis se recalcule au changement de largeur/hauteur, au chargement de la police et après les toggles. Les points ne sont jamais déplacés pour résoudre une collision de texte.

Sur les sept continents, les cartouches apparaissent uniquement en Détails (> 100 %) et selon le bouton Donjons. Leur taille est proportionnelle au fond avec un plancher ; Détails agrandit le fond et les textes sans recharger les images. Les traits passent sous la toponymie publique, les cartouches sont au-dessus. Les couleurs ne remplacent pas les noms. Chaque cartouche possède un nom accessible ; les pastilles et traits sont décoratifs.

Le bouton Donjons masque ensemble les points, traits, cartouches et entrées de donjon dans l’index. Le bouton Toponymes commande uniquement les noms publics : il ne masque pas les donjons. Les deux commandes ne modifient ni données ni fond d’image.

## Compactage du 04/10/2026

La hauteur minimale de 44 px héritée des boutons généraux est retirée du cartouche visible. Les marges passent de `.35em .65em .4em` à `.16em .48em .2em`. La largeur est mesurée avec la police courante : une ligne quand le nom tient, sinon une largeur ajustée à deux lignes équilibrées dans la limite responsive existante. Aucun nom n'est tronqué, aucune taille de police n'est réduite.

Une zone transparente d'au moins 44 × 44 px reste cliquable autour du nom. Le placement réserve ces zones pour qu'elles ne se chevauchent pas entre donjons et restent dans le fond. Le trait se termine au bord du papier visible, pas au bord de la zone invisible. La modale, le clavier, les couleurs, les points et les préférences d'affichage ne changent pas.

Implémentation : `styles.css` (papier compact et zone transparente), `src/map-v2-toponyms.js` (mesure, largeur et placement des zones de clic). Le test compactage dans `tests/v6-fast/fast.spec.mjs` contrôle les treize noms sur trois formats, la police inchangée, les noms complets, les zones séparées et le clic en dehors du papier visible. Les vérifications de modale, de zoom et de cache restent actives.

Validation locale de ce compactage : **13/13 tests Map**, dont les zones de clic sur les trois formats et les treize noms enregistrés. La revue artistique produit **72 captures sans chevauchement de libellés, débordement horizontal ou erreur de page/ressource** ; inspection visuelle complémentaire de Valdorie en détail sur tablette. Les fonds, coordonnées, noms et données utilisateur sont inchangés. WebKit est couvert par le test marqué `@webkit` dans la CI Full.

## Traçabilité de l’implémentation

- `src/map-v2-cartography.js` : `DUNGEON_MARKERS`, points recalés, centres préférés, groupe souterrain et palette `DUNGEON_COLORS`. Les coordonnées exposées dans `DUNGEONS` sont issues de ce nouveau registre. Les anciens `SPRITE_PLACEMENTS`/`SPRITE_EVIDENCE` restent des métadonnées historiques hors du chemin d’affichage.
- `src/map-v2.js` : rendu partagé sans image de sprite, index avec noms seuls, suppression de la coupe souterraine. Aucun changement au mécanisme d’éviction du cache.
- `src/map-v2-toponyms.js` : mesure et placement bornés des cartouches, calcul des traits, recalcul après stabilisation de CircleType, observation de largeur et hauteur, annulation des tâches à la sortie.
- `styles.css` : pastilles en dégradé radial, liaisons et cartouches HTML/CSS, masquage conjoint et suppression de la règle qui cachait les noms de donjons sur petit écran.
- `tests/v6-fast/fast.spec.mjs` : mise à jour des assertions devenues obsolètes sur les sprites ; contrôle des treize noms, douze points, du partage souterrain, des points de Ferrécime, des couleurs stables, des toggles et de l’absence de requêtes sprites sur les douze cartes.

## Validation

La suite Fast passe **30/30 tests**, puis les **9/9 tests Map passent à nouveau** après les derniers réglages responsive. La revue couvre douze cartes, trois formats Chromium (390, 834 et 1440 px), vue d’ensemble et Détails : **72 captures sans collision entre libellés, débordement horizontal ni erreur de page ou ressource**. La détection ne garantit pas l’absence de recouvrement de tout détail du décor. Une revue visuelle complémentaire porte sur Valdorie, Ferrécime et Sylvaronde. En vue d’ensemble sur téléphone, les textes sont petits ; Détails et l’index offrent une lecture agrandie ou textuelle.

Playwright est utilisé en repli au CLI navigateur indisponible dans cet environnement. Une validation sur iPad physique/Safari reste du ressort de la revue propriétaire. Aucun changement IndexedDB, backend, migration ou réencodage des fonds n’est réalisé.
