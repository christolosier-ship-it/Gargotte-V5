# Gargottex — V6-Map V2 : index maître documentaire actif

**Statut : V2 AUTORITÉ DE CONCEPTION depuis la PR #60 (29/09/2026).** Point d'entrée actif ; le [socle géographique V2 d'Ardéra](V6-MAP-V2-SOCLE-GEOGRAPHIQUE-ARDERA.md) préserve les seules données géographiques nécessaires à l'interprétation des cahiers après suppression des quinze documents historiques V1 et des POC A1/A2 du dépôt courant. Leur historique reste consultable dans Git ; aucun exécutable A1/A2 n'est requis par V2. Il ne constitue **ni un ordre de production**, ni une Gate technique/rendu, ni une migration de données, ni une nouvelle décision de lore. Éviter les redites : les cahiers détaillés et le [registre V2](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md) ont autorité sur leurs périmètres et sur les dernières validations explicites.

## 1. Hiérarchie et périmètre de consultation

L'Entrevers est la vue de navigation supérieure, pas la Trame astrale. Architecture de consultation conservée : **une fresque Entrevers + une mappemonde Ardéra + sept fonds continentaux + trois entrées de cartes dimensionnelles = douze vues prévues**. Les trois dimensions consultables sont Trame astrale, La Brasserie Céleste et L'Enfer de la Sobriété Éternelle. Une entrée dans une vue n'implique pas portail, téléportation, accès fictionnel ni découverte de secret.

**Dans la PR #60, le travail de conception graphique détaillée de la Trame astrale est explicitement hors périmètre** à la demande du propriétaire. Le concept et l'entrée de navigation issus du pivot sont préservés, sans document ou image Trame ajouté par la présente clôture. Ne pas confondre « ne pas travailler la Trame dans cette PR » et suppression d'un élément cosmologique/navigable précédemment approuvé.

Ardéra reste la mappemonde 4K **existante et approuvée**, dont le fichier exact et les pixels natifs doivent être revérifiés avant les futurs travaux graphiques. Les sept continents ont chacun un fond illustré indépendant ; un changement de carte ne se fait pas par agrandissement automatique de la mappemonde. Zéro faux 8K/16K, zéro upscaling revendiqué comme détail natif. Le ratio et les véritables pixels des rendus doivent être démontrés par les originaux.

## 2. Sources actives du contrat V2

- [Cadrage commun des continents, Entrevers et dimensions D7/D8](V6-MAP-V2-SIX-CONTINENTS-CADRAGE.md).
- [Registre V2 unique des quinze donjons](V6-MAP-V2-REGISTRE-IMPLANTATIONS.md), y compris correction des deux anciennes pseudo-localisations D7/D8 ; aucun registre concurrent.
- [Cahier Valdorie](V6-MAP-V2-CONTINENT-VALDORIE.md) et [concepts des neuf donjons](V6-MAP-V2-VALDORIE-ILLUSTRATIONS-DONJONS.md).
- Cahiers indépendants des six autres continents : [Boréclat](V6-MAP-V2-CONTINENT-BORECLAT.md), [Sahaldune](V6-MAP-V2-CONTINENT-SAHALDUNE.md), [Sylvaronde](V6-MAP-V2-CONTINENT-SYLVARONDE.md), [Ferrécime](V6-MAP-V2-CONTINENT-FERRECIME.md), [Pelagrève](V6-MAP-V2-CONTINENT-PELAGREVE.md), [Austrébrume](V6-MAP-V2-CONTINENT-AUSTREBRUME.md).
- Illustrations de donjons déjà cadrées pour [Ferrécime D12/D14/D15](V6-MAP-V2-FERRECIME-ILLUSTRATIONS-DONJONS.md) et [Sylvaronde D13](V6-MAP-V2-SYLVARONDE-ILLUSTRATION-D13.md).
- [Entrevers : doctrine de vue supérieure](V6-MAP-V2-ENTREVERS.md) et [brief graphique](V6-MAP-V2-ENTREVERS-BRIEF-GRAPHIQUE.md).
- [La Brasserie Céleste, dimension/donjon D7](V6-MAP-V2-DIMENSION-BRASSERIE-CELESTE.md) et [brief autonome du pilote D7](V6-MAP-V2-BRASSERIE-CELESTE-BRIEF-PILOTE.md).
- [L'Enfer de la Sobriété Éternelle, dimension/donjon D8](V6-MAP-V2-DIMENSION-ENFER-SOBRIETE-ETERNELLE.md) et [brief autonome du pilote D8](V6-MAP-V2-ENFER-SOBRIETE-ETERNELLE-BRIEF-PILOTE.md).
- Documents de transition conservés [feuille de route du pivot](V6-MAP-PIVOT-V2-FEUILLE-DE-ROUTE.md) et [architecture de migration](V6-MAP-PIVOT-V2-ARCHITECTURE-DOCUMENTAIRE.md) ; leurs estimations et états d'avant clôture ne remplacent jamais les décisions ultérieures des cahiers V2.
- [Socle géographique V2](V6-MAP-V2-SOCLE-GEOGRAPHIQUE-ARDERA.md) : mers, six régions par continent et contexte de Saint-Fût, reportés sans anciens géopoints ; les quinze cahiers V1, leurs preuves A0–A2 et les POC exécutables ont été retirés de l'arborescence courante sur demande. Leur traçabilité historique demeure dans les commits/PR GitHub #55–#60, non prescriptive pour V2.

## 3. Comptage et statut des donjons

**D1–D15 : quinze entités métier éditoriales**. Affectations validées : **Valdorie 9** (D1, D2, D3, D4, D5, D6, D9, D10, D11), **Ferrécime 3** (D12, D14, D15), **Sylvaronde 1** (D13), **dimension divine 1** (D7), **dimension infernale 1** (D8), soit **treize affectations sur Ardéra + deux dimensions**. Ne pas affecter par défaut D1–D15 aux quatre autres continents, à la Trame ou à l'Entrevers.

**Arbitrage ultérieur 29/09 :** La Brasserie Céleste est un plan divin infini qui EST le donjon D7 sur tout le fragment peint ; L'Enfer de la Sobriété Éternelle est un plan infernal infini qui EST le donjon D8 sur tout le fragment peint. Aucune pastille intérieure D7/D8 ni reprise du point V1 « Terrasses des Brasseurs » ou « Citadelle de l'Abstinence ». La carte/vue et la fiche métier Codex restent deux identités techniques distinctes avec droits indépendants. La peinture ne délimite ni l'extension réelle de ces dimensions ni les limites connues de D7/D8 hors champ.

Le registre V2 est l'autorité sur noms, positions relatives et réserves. **Les coordonnées terrestres D1–D6/D9–D15, IDs métier et filtrages réels restent à décider/vérifier**, ainsi que la confidentialité par campagne. Valdorie : les neuf donjons sont cachés initialement aux joueurs et leurs illustrations conditionnelles ont leurs concepts validés, pas leurs rendus finals. D5/D6 : une position planimétrique commune, choix filtré selon droits ; aucun passage fictionnel implicite. Ne jamais exposer un lieu secret ou même un indice involontaire dans un bitmap public.

## 4. Gates encore à exécuter pour de véritables cartes

Les cahiers et les briefs graphiques sont des **contrats documentaires**, non des rendus réalisés. Lancer chaque pilote graphique sur **ordre distinct** ; enregistrer les dimensions natives réelles, vérifier la continuité de géographie, le ratio, la lisibilité iPad, l'exactitude des scènes/repères et demander une acceptation utilisateur VERT/ORANGE/ROUGE. Hotspots, toponymie, fiches Codex et visibilité restent sur des surcouches distinctes et soumises aux droits. Vérifier la source exacte de la mappemonde avant toute dérivation. Ne pas utiliser la validation historique A2 du **POC neutre désormais supprimé** comme certification de tous les fonds finis ou de leur véritable offline iPad. Les tests de la PWA actuelle relèvent des suites V6-Fast indépendantes ; tout nouveau POC V2 nécessitera sa propre validation.

**Sécurité :** lire `AGENTS.md` avant intervention ; pas de changement runtime, UI, backend, V7, IndexedDB, Blobs, identifiants conceptuels `map_id` ou liens de campagne sans chantier dédié et sécurité des données. Les quinze documents V1 et leurs fichiers techniques A1/A2 ont été retirés de l'arborescence actuelle sur demande, après reprise des informations géographiques utiles dans le socle V2. Leur historique Git reste accessible ; leurs pyramides 4K→8K→16K, repères D7/D8 internes et gates avant pivot ne sont plus prescriptifs pour V2. Ne pas vider les caches ou données du site dans le navigateur pour supprimer le POC historique : l'éventuel Service Worker A2 et son cache isolé ne peuvent être nettoyés qu'avec une action ciblée, distincte du cache et d'IndexedDB de l'application.
