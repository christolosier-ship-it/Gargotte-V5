# Valdorie — reproduction de la maquette de toponymie MJ

**Extension ultérieure approuvée le même jour :** ce rendu est désormais réutilisé sur l’atlas, sans texte sur Entrevers et sans régions sur Brasserie/Enfer. Les mentions « Valdorie uniquement » ci-dessous décrivent la livraison historique, pas le périmètre courant. Voir [extension, décalages et vérification](V6-MAP-V2-TOPONYMIE-MJ-ATLAS.md).

Décision propriétaire du **02/10/2026** : reproduire sur Valdorie la maquette HTML validée, puis son cartouche maritime aux extrémités souples et volutes. Cet amendement remplace, **pour Valdorie uniquement**, la suppression des cartouches décidée lors de la première correction. Les autres cartes gardent leur rendu actuel ; l’Entrevers reste sans toponymie.

## Rendu livré

| Catégorie | Traitement | Taille de référence relative à la largeur affichée |
|---|---|---|
| Six régions | Parchemin illustré, extrémités roulées, texte brun foncé en léger arc | 2 %, plafond 34 px |
| Sept lieux / reliefs / agglomérations secondaires | Même parchemin, plus petit, arc plus discret | 1,36 %, plafond 23 px |
| Avelorne, Rivombre, Saules, Ysambre | Cartouche bleu en arc, texte ivoire | 1,36 %, plafond 23 px |
| Mer des Trois Couronnes | Cartouche bleu à contour légèrement ondulé, bouts arrondis et volutes | 1,8 %, plafond 28 px |

Les tailles sont ensuite réduites si le texte dépasse l’emprise permise ou le bord de l’image. Les graphies, accents et apostrophes restent des données HTML ; aucune lettre n’est peinte dans le fond ou le parchemin. La largeur est mesurée avec la police locale, et recalculée à chaque redimensionnement et réaffichage. Les chiffres ne sont pas des valeurs de corps absolues identiques à toutes les tailles d’écran.

Le texte est **brun `#301608` sur parchemin** et **ivoire `#fff3d6` sur bleu**. Police IM Fell English, même fichier que la maquette. Les régions utilisent la même graisse synthétique. CircleType 2.3.1 courbe les lettres HTML ; aucun SVG de texte, CDN, API distante ou abonnement.

## Catalogue et source

Les quinze noms précédents sont conservés. Les quatre noms hydrologiques passent de la catégorie technique `secondary` à `water`. Suite au retour propriétaire du 02/10/2026, les lieux-dits, rivières et lacs restent **affichés en vue d’ensemble aussi sur téléphone** ; ils ne sont plus masqués automatiquement sur Valdorie. Les six régions approuvées restent inchangées.

Ajout du seizième nom : **Mer des Trois Couronnes**, déjà présent dans le cahier continental (§2 : mer, écoulement de l’Avelorne) et la planche MJ propriétaire. Il ne s’agit pas d’un nouvel océan inventé. Ancre de lecture proposée **50 / 93 %**, dans la marge maritime sud de la planche, à annoter comme les autres centres.

### Agglomérations nommées sous mandat du propriétaire

Le propriétaire demande expressément le 02/10/2026 d’inventer les deux noms jusque-là réservés. Le catalogue contient désormais **18 noms : 6 régions, 7 lieux/reliefs/agglomérations, 4 eaux intérieures et 1 mer**. Ces deux créations ne sont pas attribuées rétrospectivement aux anciens cahiers ou à la planche MJ.

| Nom intégré | Élément de la planche | Ancre de lecture x / y % | Origine du nom |
|---|---|---|---|
| **Brassefort** | Grande cité fortifiée centrale des Plaines de Valdor | 54 / 53 | Création pour la demande propriétaire : brassage + fortifications |
| **Port-Rivombre** | Grand port commercial à l’ouest, Côtes Grises | 22 / 26 | Création pour la demande propriétaire, rattachée au fleuve Rivombre déjà documenté |

Les noms sont utilisés comme libellés publics de la carte, pas comme nouvelles fiches métier ou destinations cliquables. Les positions restent proposées, ajustables après revue. Aucun nom des autres bourgs n’est inventé. L’ancien statut réservé de ces deux agglomérations est levé uniquement pour leur nom ; aucun lore supplémentaire n’est ajouté.

Contrôle du complément : **6/6 tests Map réussis**, dont présence des lieux et eaux en vue d’ensemble aux largeurs 320, 390 et 834 px ; réaffichage après toggle et éviction du cache toujours contrôlés. **72 captures sans collision de libellés ni débordement horizontal**, sans erreur page/HTTP détectée. Inspection ciblée Valdorie desktop et téléphone en vue d’ensemble. Sur téléphone ajusté à l’écran, les petits noms sont présents mais la lecture confortable demande Détails. Le rendu des six régions et les sprites ne sont pas modifiés.

## Ancres et décalages de présentation

Les quinze centres de référence de la PR #67 sont conservés. Les parchemins occupant davantage d’espace que le texte nu, les décalages ci-dessous s’appliquent exclusivement au rendu et ne déplacent pas les sites ou pieds des sprites.

| Texte | Décalage x / y, en % de l’image |
|---|---|
| Arbres-Colosses | 0 / +2 |
| Collines de la Vieille Lande | −1 / −3,5 |
| Saint-Fût-le-Petit | −5 / −2 |
| Ruisseau des Saules | 0 / +2 |
| La Chope Qui Colle | +1 / +1 |
| L’Avelorne | −2 / +7 |
| La Rivombre | 0 / +2 |
| Nom de Bastognac | −4 / −2 |
| Nom des Thermes | −2 / −2 |
| Nom de la Ruche | −7 / +3 |

Les autres libellés ne reçoivent aucun décalage supplémentaire. Ces positions de lecture restent proposées, non canoniques. La passe d’implantation et d’échelle des sprites demeure différée ; elle n’est pas annoncée comme réalisée par cet amendement.

## Traçabilité technique

- `src/map-v2-toponyms.js` : mesure du texte, bandes de texture courbées, géométrie des cartouches bleus, volutes CSS, recalcul et destruction des instances/observateurs à la sortie.
- `src/vendor/circletype-2.3.1.js` : dépendance embarquée et figée.
- `assets/map-labels/` : parchemin WebP transparent et police provenant de la maquette approuvée, notices OFL/MIT. Ressources décoratives réutilisables, distinctes des fonds/sprites.
- `src/map-v2.js` : branche de rendu réservée à Valdorie et réaffichage local au toggle, sans recréer l’image de la carte.
- `styles.css` : règles préfixées `map-mj-*`, contraste et décoration. Aucun changement global de la police applicative.
- `src/map-v2-data.js` / `src/map-v2-cartography.js` : classification de l’eau, ajout documenté de la mer ; pieds, tailles et fichiers des sprites inchangés.
- `service-worker.js` : ajoute les deux ressources et deux modules à la liste d’assets du shell. Le cache **du fond actif** est toujours évincé au départ ; aucune modification de son mécanisme ou de la base IndexedDB.
- `tests/v6-fast/fast.spec.mjs` : contrôle du catalogue, hiérarchie, contraste, volutes, réaffichage, conservation de l’image au toggle et absence de ce rendu sur Ardéra.

## Validation

Contrôles reproductibles : `npm run test:v6fast:fast` et `node scripts/verify-map-art.mjs`. Les captures doivent être inspectées à l’échelle de la carte, pas uniquement les libellés isolés. La vue Détails conserve le même fond, sans rechargement. Tous les toponymes publics de Valdorie restent affichés en vue d’ensemble ; sur téléphone, leur taille proportionnelle demeure petite, et Détails permet une lecture agrandie. La règle de masquage des noms de donjons sur petite vue reste inchangée.

La validation locale Chromium et les captures aux dimensions tablette ne remplacent pas une validation Safari/iPad physique. La reproductibilité du composant est démontrable ; une identité de pixels entre navigateurs et une validation artistique humaine exhaustive ne sont pas garanties.

### Bilan local du 02/10/2026

Le bilan ci-dessous décrit la PR #67 fusionnée, avant la restauration de visibilité et la nomination des deux agglomérations. Les contrôles de ce complément sont consignés dans la nouvelle PR.

- Fast complète : **27/27** réussis ; après le dernier ajustement des décalages, les **6 tests Map** ont été rejoués avec succès.
- Contrôle cartographique final : **72 captures** (12 cartes × 3 formats × 2 modes), **aucun chevauchement de libellés affichés**, aucun débordement horizontal ni erreur page/HTTP détecté.
- Inspection visuelle ciblée : Valdorie desktop, tablette en vue d’ensemble et téléphone en Détails. La petite vue d’ensemble téléphone ne promet pas la lecture de tous les lieux secondaires.
- Le CLI agent-browser n’a pas démarré dans l’environnement ; vérification effectuée avec le navigateur Chromium piloté par le script Playwright du dépôt. Aucun résultat Safari local n’est revendiqué.
- Les fonds et sprites existants sont inchangés ; le visuel des sprites et leur implantation ne sont pas validés par les contrôles de ce lot.
- CI distante : à lire sur le dernier commit de la PR #67 ; les résultats locaux ne valent pas succès CI anticipé.
