# V6-Map V2 — Registre de conception des quinze donjons

**Statut : affectations et descriptions relatives D1–D15 VALIDÉES, affinements géographiques de Valdorie + règle des neuf donjons initialement cachés VALIDÉS le 28/09/2026 ; coordonnées numériques, identifiants métier et implémentation des permissions RÉSERVÉS.** Ce document reprend expressément les corrections communiquées après le registre V1 de `V6-MAP-MAITRE.md`. Les coordonnées V1, quand elles existent, ne sont ni transposées ni déclarées définitives. Cette mise à jour documentaire ne modifie aucun enregistrement du Codex.

## 1. Arbitrages de dénomination VALIDÉS

- Le nom des plaines reste exactement **Les Plaines de Valdor**. Ne pas introduire « Val-d’Or ».
- La dimension divine devient **La Brasserie Céleste**. Le donjon **D7** porte lui aussi ce nom ; **la dimension et le donjon sont deux entités différentes**, même si leurs libellés sont identiques.
- La dimension infernale devient **L'Enfer de la Sobriété Éternelle**. Le donjon **D8** porte lui aussi ce nom ; ils restent deux entités distinctes.
- L'Entrevers demeure l'univers / la vue supérieure, **pas** la Trame astrale.
- **Compatibilité technique** : les identifiants conceptuels historiques `map:hautes-fermentations` et `map:royaume-soifs-eteintes` sont conservés comme clés stables pendant la préparation V2 ; changer leurs libellés de présentation n'est pas une migration d'ID, d'URL, de cache ou de données. Réviser d'éventuels slugs/chemins seulement dans un contrat de migration explicite. Dans les textes V1, « Hautes Fermentations » et « Royaume des Soifs Éteintes » désignent les **anciens noms de travail** des cartes, et non des dimensions supplémentaires.
- Noms et géographie interne historiques de leurs territoires (Terrasses des Brasseurs, Citadelle de l'Abstinence, etc.) restent dans le corpus V1 tant qu'ils ne sont pas révisés ; les validations présentes concernent le **nom de dimension** et l'**affectation D7/D8**, pas de nouveaux coordonnées, passages ou portails.

## 2. Affectations et zones relatives VALIDÉES, géopoints RÉSERVÉS

| ID éditorial / placement_id | Donjon | Carte / continent validé | Région ou position relative validée | Réserve explicite |
|---|---|---|---|---|
| D1 / `placement:d01` | Le Château Bastognac | Ardéra / Valdorie | **Proche de la Chope, côté Collines de la Vieille Lande** | Aucun rayon ni point numérique confirmé ; ancien « NO du village » non reconduit comme contrainte. Titre à confronter au vrai Codex (« Château de Bastognac » dans le seed V1). |
| D2 / `placement:d02` | La Forêt en Chantier | Ardéra / Valdorie | **Proche de la Chope, côté forêt** | Deux emplacements distincts D1/D2 ; rayon/point exact encore réservés. |
| D3 / `placement:d03` | Hôtel Zombifornia | Ardéra / Valdorie | **Quartier hôtelier de la grande cité fortifiée des Plaines de Valdor**, avec D4 dans la même cité | Sort de Pelagrève ; nom de ville et géopoint non arrêtés. |
| D4 / `placement:d04` | Le Cabaret des Joyeuses | Ardéra / Valdorie | **Quartier festif de la même grande cité fortifiée que D3** | Deux lieux distincts, points différents. |
| D5 / `placement:d05` | Le Sanctuaire du Houblon Noir | Ardéra / Valdorie | **Contreforts des Hautes Marches** | Ancienne proposition confirmée. |
| D6 / `placement:d06` | Le Panthéon des Fermentations Interdites | Ardéra / Valdorie | **Directement sous D5** | Même point planimétrique et deux niveaux ; **marqueur unique avec choix D5/D6 filtré selon droits VALIDÉ**, mode d'accès narratif toujours RÉSERVÉ, aucun portail induit. |
| D7 / `placement:d07` | La Brasserie Céleste | Dimension **La Brasserie Céleste** | Dimension confirmée ; les Terrasses des Brasseurs restent l'ancienne **piste régionale V1**, non un nouveau point validé ici | La dimension n'est pas le donjon ; anciens X74/Y57 indicatifs, non finalisés. |
| D8 / `placement:d08` | L'Enfer de la Sobriété Éternelle | Dimension **L'Enfer de la Sobriété Éternelle** | Dimension confirmée ; la Citadelle de l'Abstinence reste l'ancienne **piste régionale V1**, non un nouveau point validé ici | La dimension n'est pas le donjon ; anciens X75/Y53 indicatifs, non finalisés. |
| D9 / `placement:d09` | Le Bastion du Sauciflard | Ardéra / Valdorie | **Partie profonde de la Sylve des Anciens, distincte des Arbres-Colosses** | Ancienne proposition « région frontalière des Hautes Marches » remplacée. |
| D10 / `placement:d10` | Les Thermes de la Bonne Trempette | Ardéra / Valdorie | **Littoral rocheux des Côtes Grises** | Sort de Pelagrève / Dorsale des Fournaises. |
| D11 / `placement:d11` | La Ruche Royale | Ardéra / Valdorie | **Transition prairies fleuries / forêt à l'est des Plaines de Valdor** | Ancienne proposition confirmée et précisée. |
| D12 / `placement:d12` | Le Monastère des Dénaturées | Ardéra / Ferrécime | **Région montagneuse de Ferrécime** | L'Échine d'Ardéra est une piste ancienne, pas une sous-région définitivement reconfirmée ici. |
| D13 / `placement:d13` | Les Marécages Infectés | Ardéra / Sylvaronde | **Delta des Mille Bras** | Ancienne proposition confirmée. |
| D14 / `placement:d14` | La Citadelle des Tonneaux Perchés | Ardéra / Ferrécime | **Ferrécime** | Les Hautes Voûtes restent la piste régionale V1 ; la confirmation explicite porte sur le continent. |
| D15 / `placement:d15` | Le Gynécotron du Gnome Tordu | Ardéra / Ferrécime | **Les Marches de Braise, secteur volcanique** | Aucun lien avec D5. Ancienne hypothèse du complexe souterrain des Hautes Marches **abandonnée**. |

**Comptage validé :** Valdorie **9** (D1, D2, D3, D4, D5, D6, D9, D10, D11) ; Ferrécime **3** (D12, D14, D15) ; Sylvaronde **1** (D13) ; La Brasserie Céleste **1** (D7) ; L'Enfer de la Sobriété Éternelle **1** (D8). **13 implantations sur Ardéra + 2 dimensionnelles = 15.** Boréclat, Sahaldune, Pelagrève et Austrébrume ne reçoivent aucun D1–D15 à ce stade, mais restent ouverts aux contenus futurs. Pas de donjon D1–D15 affecté à la Trame ou à la vue générale de l'Entrevers.

## 3. Ce qui n'est PAS encore validé

1. Les coordonnées numériques des quinze marqueurs, contours des villes, distances et éventuellement niveaux verticaux/souterrains.
2. L'identité technique `entity_type/entity_id` de chaque donjon dans les données de production ; D1…D15 sont des références éditoriales, pas des IDs supposés existants.
3. Les itinéraires, entrées, portails et connexions de scénario ; **D6 sous D5** ne démontre aucun accès direct, et **D15 n'a aucun lien avec D5** selon l'arbitrage présent.
4. Pour les **neuf donjons de Valdorie**, la règle de conception **tous cachés initialement et révélation explicite par MJ pour une campagne** est VALIDÉE. Son implémentation réelle et les droits backend restent à vérifier. Pour les autres donjons, leur état initial particulier et leurs règles techniques restent à arbitrer dans leurs fiches respectives.
5. Les trois sous-régions non reconfirmées D7/Terrasses, D8/Citadelle et D14/Hautes Voûtes, ainsi que l'Échine d'Ardéra pour D12 : pistes documentées, pas statuts nouveaux VALIDÉ.
6. La position des infrastructures futures et des décors Gargotte ; elles ne doivent jamais divulguer un donjon masqué.

## 4. Contrat de peinture et d'affichage

Prévoir les emplacements dans un registre de surcouches/données **séparé des fonds**. Aucun nom, marqueur de donjon, bâtiment-signature ou indice narratif secret peint sur une carte publique. **Pour Valdorie, les neuf donjons ont chacun une illustration séparée conditionnelle, initialement cachée aux joueurs jusqu'à confirmation explicite du MJ par campagne ; leurs NEUF CONCEPTS ARTISTIQUES sont VALIDÉS SANS RÉSERVE par le propriétaire le 28/09/2026 dans [le cahier artistique](V6-MAP-V2-VALDORIE-ILLUSTRATIONS-DONJONS.md) ; les neuf rendus finaux n'ont pas encore été produits ni approuvés.** Les images sensibles elles-mêmes ne peuvent résider dans un manifest/URL/cache public. Les marques visibles au MJ ou après découverte sont gérées indépendamment avec droits vérifiés **avant** transmission et recherche. D1/D2 proches de la Chope sont deux points distincts ; D3/D4 dans la même ville sont deux points distincts ; D5/D6 partagent un **marqueur unique** avec menu limité aux destinations autorisées. La Chope demeure un lieu rural ordinaire et un raccourci de navigation, pas un nexus cosmologique.

## 5. Statut de gate

**Gate d'affectation et de position relative : VALIDÉE (28/09/2026), y compris précisions Valdorie ci-dessus. Règle initiale de secret des neuf donjons et calques conditionnels : VALIDÉE EN CONCEPTION. Gate des neuf concepts d'illustration Valdorie : VALIDÉE SANS RÉSERVE le 28/09/2026. Restent EN ATTENTE : rendus finals, coordonnées locales, liens aux IDs métier, filtrage réel, référence authentifiée de la carte mondiale 4K et capacité native de génération 3:2.** Les anciennes répartitions V1 du maître et de l'annexe A0 restent conservées comme historique, mais ne doivent pas être utilisées comme affectations courantes dans la future V2. Ne pas fusionner ce chantier documentaire sans revue de ses renvois ; aucune génération d'image.
