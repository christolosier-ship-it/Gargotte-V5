# Atlas — extension de la toponymie MJ approuvée

Décision propriétaire du 02/10/2026 : étendre aux autres cartes le rendu validé sur Valdorie. **Entrevers reste sans texte cartographique. Brasserie et Enfer n’ont que des lieux-dits : aucun parchemin de région.** Cet amendement remplace la restriction « Valdorie uniquement » des amendements précédents, sans réouvrir les décisions afficher/masquer les donjons et éviction du fond au départ.

## Rendu et couverture

Le composant de [Valdorie](V6-MAP-V2-VALDORIE-TOPONYMIE-MJ.md) est réutilisé, sans duplication des ressources : police IM Fell English locale, texte HTML courbé par CircleType, parchemin illustré pour les régions, parchemin plus petit pour les lieux-dits, cartouche bleu pour les eaux intérieures, contour maritime souple et volutes pour les mers/océans. Brun sur beige, ivoire sur bleu. Mesure des chaînes et adaptation à la largeur affichée, avec recalcul au redimensionnement et au toggle.

| Carte | Libellés publics illustrés | Traitement |
|---|---:|---|
| Entrevers | 0 | Aucun texte superposé, navigation accessible conservée |
| Ardéra | 16 | 7 continents sur parchemin majeur, 9 mers/océans en bleu |
| Austrébrume | 9 | 6 régions, 3 lieux secondaires |
| Boréclat | 7 | 6 régions, 1 lieu secondaire |
| Ferrécime | 7 | 6 régions, Cimes Suspendues en lieu secondaire |
| Pélagrève | 8 | 6 régions, Labyrinthe Corallien et destination cité sous-marine en petit parchemin |
| Sahaldune | 7 | 6 régions, Couronne de Sel en lieu secondaire |
| Sylvaronde | 7 | 6 régions, Canopée-Monde en lieu secondaire |
| Valdorie | 18 | Rendu approuvé conservé : 6 régions, 7 lieux, 4 eaux intérieures, 1 mer |
| Brasserie Céleste | 16 | Uniquement petits parchemins de lieux-dits, y compris les anciens groupes techniques major/secondary |
| Enfer de la Sobriété Éternelle | 16 | Uniquement petits parchemins de lieux-dits, y compris les anciens groupes techniques major/secondary |
| Cité sous-marine | 0 | Catalogue toujours vide : aucune invention de noms réservés |

Total : **111 libellés illustrés**, dont 103 noms du catalogue inchangé et 8 noms de destinations déjà existants. Les régions dont le nom évoque des eaux restent des régions : le traitement se fonde sur la catégorie documentée, pas sur une recherche du mot « lac » ou « bassin ». Les dimensions sont explicitement traitées en lieux-dits, même lorsqu’un nom contient « Canal » ou « Bassins ».

Les noms de donjons conservent leur traitement existant, distinct de la toponymie publique, ainsi que leur masquage conjoint avec les sprites. Leur implantation et leur échelle ne sont pas corrigées par cette extension. Aucun fond ou sprite n’est réédité. Aucun nouveau nom, région, destination ou lore n’est créé.

## Lecture et placement

Tous les libellés publics restent affichés en vue d’ensemble, y compris sur téléphone. Leur taille proportionnelle peut être petite ; Détails agrandit la carte sans recharger le fond. Les noms de donjons gardent leur règle de masquage sur petit écran. Les hotspots existants et leurs accès clavier restent indépendants des cartouches décoratifs.

Les ancres du registre restent inchangées et proposées, non canoniques. Seuls les décalages de présentation ci-dessous s’ajoutent, pour éviter les collisions de parchemins constatées dans les captures. Les décalages Valdorie précédemment validés sont conservés et limités à cette carte.

| Carte | Texte | Décalage x / y, % du fond |
|---|---|---|
| Ardéra | Mer Boréale | −2 / −2 |
| Austrébrume | Les Fjords de Nacrelune | 0 / +4 |
| Austrébrume | Les Bois des Dernières Feuilles | 0 / −3 |
| Austrébrume | Les Monts du Voile | −3 / +1 |
| Austrébrume | Les Landes du Grand Hiver | +2 / +2 |
| Austrébrume | Falaises de Nacrelune | 0 / +5 |
| Austrébrume | Plateaux du Dernier Vent | 0 / +3 |
| Austrébrume | Cascades de Brume | 0 / −2 |
| Austrébrume | Le Bassin des Lacs Sombres | 0 / −4 |
| Ferrécime | L’Échine d’Ardéra | +1 / −3 |
| Enfer | Le Tribunal de la Mesure | 0 / +2 |

## Traçabilité

- `src/map-v2.js` : fabrique commune des libellés, classification région/lieu/eau/mer ; dimensions forcées en lieux-dits ; destinations continentales illustrées ; aucune branche de toponymie Entrevers.
- `src/map-v2-toponyms.js` : activation sur les cartes possédant des libellés illustrés, décalages par carte, mêmes ressources et calculs que Valdorie ; nettoyage des instances et observateurs à la sortie.
- `styles.css` : visibilité des lieux secondaires illustrés en petite vue sur tout l’atlas ; noms de donjons inchangés.
- `tests/v6-fast/fast.spec.mjs` : couverture des douze cartes, conservation du catalogue et de sa visibilité mobile, dimensions sans régions, Entrevers et cité sans invention, adaptation du test de retour vers Ardéra.
- `scripts/verify-map-art.mjs` : revue reproductible des douze fonds en trois formats, vues d’ensemble et Détails, détection des collisions, erreurs HTTP/page et débordement horizontal.

Les fichiers de catalogue, fonds/sprites, service worker et IndexedDB ne sont pas modifiés par cette extension. Les ressources locales déjà embarquées restent utilisables hors ligne dans les limites du contrat de cache existant : seul le fond actif est chargé à la demande et évincé au départ.

## Gate de vérification

Commandes : `npm run test:v6fast:fast` et `node scripts/verify-map-art.mjs`. Inspecter les compositions, pas seulement les cartouches isolés. Les captures aux dimensions tablette ne constituent pas une validation Safari/iPad physique. La validation artistique finale des placements proposés reste celle du propriétaire.

### Contrôles locaux du 02/10/2026

- Tests ciblés Map : **7/7 réussis**, dont navigation, cache, toggles et catalogue illustré de l’atlas.
- Suite Fast complète finale : **28/28 réussis** après les derniers décalages de lecture.
- Revue finale : **72 captures**, aucun chevauchement de libellés affichés, aucun débordement horizontal ni erreur page/HTTP détecté.
- Inspection des compositions desktop des neuf cartes nouvellement stylées, puis vues ciblées tablette Pélagrève et téléphone Ardéra/Brasserie. Les décalages d’Austrébrume ont été réinspectés après correction. Sur téléphone, Détails reste nécessaire à la lecture confortable des petits noms.
- Guide `agent-browser-verify` utilisé pour la vérification : le CLI agent-browser échoue au démarrage du daemon ; repli sur le script Playwright du dépôt avec Chromium et profil jetable. Aucun contrôle Safari natif n’est revendiqué.
- Ces résultats locaux ne préjugent pas du résultat de la CI distante ni d’une validation artistique propriétaire des ancres.
