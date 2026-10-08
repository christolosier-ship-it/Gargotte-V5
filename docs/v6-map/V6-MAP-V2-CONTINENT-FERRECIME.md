# V6-Map V2 — Ferrécime : cahier continental approuvé

**Statut : ONZE ARBITRAGES DE CONCEPTION VALIDÉS PAR LE PROPRIÉTAIRE LE 28/09/2026 ; trois concepts d'illustration D12/D14/D15 VALIDÉS.** Les coordonnées exactes des donjons et des deux réserves, les images effectivement générées, les IDs du Codex et la mise en œuvre technique restent EN ATTENTE. Les secteurs relatifs des réserves R1/R2 sont VALIDÉS. **Aucune image générée, aucune modification applicative.**

**Dépendance :** ce fichier appartient au lot documentaire de PR #60. Le pivot Valdorie V2 de PR #59 est désormais fusionné sur la branche de base `V5.3` ; ses références V2 sont disponibles. Revérifier la comparaison des branches lors de l'intégration de PR #60. Sources : `AGENTS.md`, géographie canonique du `V6-MAP-V2-SOCLE-GEOGRAPHIQUE-ARDERA.md`, `V6-MAP-MAITRE-V2.md`, puis après #59 `V6-MAP-V2-REGISTRE-IMPLANTATIONS.md` et les contrats de la feuille de route V2. L'ancien maître V1 a été retiré du dépôt courant (historique Git uniquement) et le socle géographique V2 en conserve les données utiles pour ses **anciens placements** et son **ancien upscaling**. Le présent cahier n'autorise pas les modifications de V7/IndexedDB, ni la génération.

## 0. Décisions expresses du propriétaire, 28/09/2026

| N° | Décision VALIDÉE |
|---|---|
| 1 | **Cadrage paysage 3:2 avec marges maritimes**, particulièrement au nord et à l'est. Les pixels natifs restent à prouver ; aucun upscale. |
| 2 | **D12 Monastère des Dénaturées : Hauts Plateaux de Silex** (ancienne piste Échine d'Ardéra remplacée). |
| 3 | **D14 Citadelle des Tonneaux Perchés : Hautes Voûtes, escarpement rocheux ordinaire**, à distance des Cimes Suspendues. |
| 4 | **D15 Gynécotron du Gnome Tordu : complexe industriel semi-enterré dans un flanc volcanique des Marches de Braise**, SANS LIEN avec D5. |
| 5 | **Quelques villages éparpillés** : pas de grande cité, grand port, petite cité minière, fortin ou nombre d'agglomérations rendu obligatoire par défaut. Des chemins/haltes ruraux publics adaptés à la topographie sont admis comme détails de composition, sans inventer leur canon. |
| 6 | **Populations multiraciales** issues du jeu, métiers et habits adaptés au climat, sans imposer un territoire exclusif à une race. Vérifier les références exactes dans le Codex/dossiers de bestiaire avant illustration. |
| 7 | **18–24 scènes Gargotte** publiques, montagnardes, variées et grivoises non explicites. |
| 8 | **Les trois concepts de silhouettes, palettes et gags D12, D14, D15 sont VALIDÉS intégralement**, tels que décrits dans [l'annexe des illustrations](V6-MAP-V2-FERRECIME-ILLUSTRATIONS-DONJONS.md). Les rendus d'images ne sont pas encore validés. |
| 9 | **D12/D14/D15 initialement cachés aux joueurs, révélés explicitement par le MJ par campagne**, et leurs illustrations en calques indépendants conditionnels, comme Valdorie ; aucune donnée/image sensible transmise avant autorisation. |
| 10 | **Aucun texte peint dans le fond** ; noms et marqueurs par surcouches d'interface. |
| 11 | **Réserver exactement deux secteurs pour des développements futurs**, dans des lieux géographiquement singuliers et éloignés des donjons D12/D14/D15. **Cimes Suspendues explicitement EXCLUES** des réserves. Le principe, le nombre **et les secteurs naturels relatifs R1/R2** sont VALIDÉS ; leurs contours fins, séparation effective des donjons et coordonnées locales restent à déterminer sur la carte réelle. |

**Attention au point 5 :** le choix « C : quelques villages éparpillés » remplace bien les options A/B de ville et port proposées. Le projet ne doit pas lui substituer une cité par habitude de copier le cahier Valdorie.

## 1. Géographie et frontières artistiques canoniques

Ferrécime est le continent X56–76 / Y22–52 dans le référentiel mondial 0..100, **boîte de composition indicative, non contour local définitif**. Les six régions, noms exacts et positions relatives restent :

| Région VALIDÉE | Position et contrainte |
|---|---|
| **Les Portes du Givre** | Nord, froid, accès/bassins liés au nord. |
| **L'Échine d'Ardéra** | Épine montagneuse centrale nord-sud. |
| **Les Hauts Plateaux de Silex** | Ouest, plateaux élevés et surfaces minérales, **D12**. |
| **Les Vallées des Mille Cascades** | Est, drainage oriental et vallées, sans faire couler les fleuves en sens impossible. |
| **Les Hautes Voûtes** | Centre/est, reliefs dont les **Cimes Suspendues** ; **D14 uniquement sur roche ordinaire**, pas sur la merveille. |
| **Les Marches de Braise** | Sud-est volcanique, **D15** dans son flanc volcanique. |

Quatre systèmes hydrographiques : versant ouest, versant est, lacs/bassins internes d'altitude et bassin sud. Côte **abrupte à l'est**, Mer des Éclats en regard de Pelagrève ; mer Boréale au nord. La géographie doit être vérifiée contre le véritable PNG mondial approuvé, pas simplement déduite des rectangles indicatifs.

**Merveille VALIDÉE : les Cimes Suspendues**, approx. X68/Y37 au niveau mondial, dans les Hautes Voûtes. Anomalie ancienne liée à la Trame astrale ; cela ne crée **ni portail**, ni cité flottante canonique, ni donjon, ni emplacement de réserve. Les autres montagnes ne flottent pas par contagion graphique.

## 2. Villages, peuples et routes

Peindre **quelques villages éparpillés** dans des vallées ou sur plateaux où l'habitat est plausible, avec hameaux et petites haltes publiques ; aucun nombre exact, nom, capitale, port majeur ou mine imposé. Le paysage montagnard, les lacs, les cols et les falaises dominent visuellement. Routes discrètes en lacets, sentiers, franchissements et échanges terrestres raisonnables ; les infrastructures extraordinaires (téléphériques ou systèmes mécaniques) ne sont PAS validées comme norme du continent. Ne pas densifier les Hautes Voûtes d'une métropole.

**Diversité multiraciale VALIDÉE :** marchés de hameaux, convoyeurs de cols, auberges rurales, travailleurs, passants et scènes drôles doivent mêler plusieurs peuples réellement représentés dans le jeu. Selon références et biomes, des nains, gnomes, elfes, gobelins, kobolds, orques, humains et divers hybrides documentés peuvent inspirer la composition ; exemples, NON répartition canonique fixée ni catalogue exhaustif. Toutes les races ne sont pas obligatoires dans chaque vignette. Tenues de froid, altitude ou chaleur volcanique adaptées à la région ; aucun costume unique imposé à une race, et aucun personnage/insigne de donjon secret dans le fond public.

## 3. Donjons D12, D14 et D15 : emplacement et image conditionnelle

| ID / placement_id | Région et précision VALIDÉES | Règles de représentation |
|---|---|---|
| **D12 / `placement:d12`** Monastère des Dénaturées | **Hauts Plateaux de Silex**, site de montagne isolé. | L'ancienne piste V1 « vallée reculée de l'Échine d'Ardéra » est remplacée. Concept approuvé : monastère austère, gradins rocheux et cloître. Image indépendante, cachée initialement. |
| **D14 / `placement:d14`** Citadelle des Tonneaux Perchés | **Hautes Voûtes, escarpement rocheux ORDINAIRE**, à distance de la merveille Cimes Suspendues. | Ne pas la peindre en cité volante ni l'incruster sur la merveille. Concept approuvé : citadelle avec tonneaux arrimés et monte-charge improbable. Image indépendante, cachée initialement. |
| **D15 / `placement:d15`** Gynécotron du Gnome Tordu | **Marches de Braise : complexe industriel SEMI-ENTERRÉ dans le flanc d'un volcan**. | Aucun lien avec D5 ; concept approuvé : atelier gnome basaltique/cuivré intégré au relief, sans dévoiler le boss, la machine ou l'intrigue. Image indépendante, cachée initialement. |

Les trois concepts précis sont figés dans l'[annexe](V6-MAP-V2-FERRECIME-ILLUSTRATIONS-DONJONS.md). Les trois sites sont **distincts**, sans liaison/portail implicite ; leurs points locaux cartographiques ont été validés puis recalés par annotations propriétaire, dernier recalage le 08/10/2026. Les images propres des donjons et leurs marqueurs seront servis en fonction des droits réellement établis par campagne et de l'acte explicite du MJ, jamais par simple masque DOM d'une URL publique ou d'un cache public.

## 4. Catalogue indicatif de gargotteries publiques

**Densité 18–24 VALIDÉE ; exemple de plan artistique : 20 scènes.** Les propositions ci-dessous illustrent le ton, sans créer vingt nouveaux lieux de lore ni annoncer un quartier urbain obligatoire. Répartir les peuples, varier les rôles sociaux, conserver paysages dominants et silhouettes lisibles.

| Secteur | Scènes publiques suggérées | Nombre |
|---|---|---:|
| Portes du Givre | Caravane multiraciale poussant un tonneau dans le vent ; aubergiste adulte cherchant son enseigne emportée ; couple de muletiers bataillant avec une chèvre ; brasseur à la barbe givrée. | 4 |
| Échine d'Ardéra | Faux guide pointant le mauvais sommet ; pont de corde traversé par deux fûts coincés ; une gargouille grivoise sculptée par un groupe d'artisans ; corbeille de saucisses dévalant la pente et semant son contenu. | 4 |
| Hauts Plateaux de Silex | Nains, elfes et gobelins autour d'une foire de montagne ; campement où un tonneau sert de chaise tournante ; concours de moustaches gelées. Toutes scènes suffisamment distantes de D12. | 3 |
| Vallées des Mille Cascades | Pêcheur ramenant une botte énorme ; batelier trop confiant devant une petite cascade ; éclaboussures d'une lessive de dessous adultes ; vendeur de boissons cherchant un endroit sec. | 4 |
| Hautes Voûtes | Mulet particulièrement fier de tirer une charrette vide ; poseur de banc public qui n'a pas prévu la pente ; brasseur portant son pichet au-dessus des nuages, hors Cimes Suspendues et à distance de D14. | 3 |
| Marches de Braise | Marchande faisant refroidir une tarte sur une roche trop chaude ; gobelin réchauffant sa marmite sur une pierre brûlante, loin de D15. | 2 |
| **Total de composition** | **20 ; plage d'acceptation : 18 à 24** | **20** |

Les scènes restent **non explicites, non graphiquement violentes, sans noms ni lettres**, et sans représenter des habitants de donjons cachés comme gags publics. Éviter la confusion stylistique entre la merveille et des appareils mécaniques ou des vortex.

## 5. Deux réserves d'extension : secteurs VALIDÉS, coordonnées réservées

**Décision expresse du propriétaire (28/09/2026) : « Je valide les secteurs R1 et R2 proposés. Leurs coordonnées précises seront définies sur la carte. »**

| Identifiant de conception | Secteur relatif VALIDÉ | Contrainte d'intégration toujours applicable |
|---|---|---|
| **R1** | **Extrémité nord des Portes du Givre**, autour d'un **passage glaciaire naturel remarquable**. | Ce passage est un relief public, **pas un portail de dimension**, ni l'annonce d'un futur donjon. Identifier le point/contour local exact sur le vrai fond, à distance des D12/D14/D15. |
| **R2** | **Est des Vallées des Mille Cascades**, autour d'une **confluence spectaculaire** cohérente avec le bassin oriental. | La confluence est un fait de paysage public, non une entrée scénaristique. Préserver un éloignement effectif de D14 aux Hautes Voûtes et D15 aux Marches de Braise ; fixer le point/contour précis sur le fond validé. |

Ces deux secteurs sont les **seules réserves géographiques futures prévues à Ferrécime** à ce stade. Les **Cimes Suspendues et leurs abords reconnaissables sont EXCLUS** ; R1 et R2 restent éloignés de D12, D14 et D15. En cas de conflit lors de la composition, ajuster le point **à l'intérieur du secteur approuvé** et présenter la planche MJ à validation, sans déplacer silencieusement une réserve vers la merveille ou la proximité d'un donjon.

Ne fixer **aucune coordonnée numérique, rayon, emprise métrique ni `entity_id` inventé** avant l'examen du vrai fond continental. Les réserves ne sont **ni des D16/D17, ni des portails**, ni des marqueurs visibles par les joueurs. Le fond public peut montrer des phénomènes naturels génériques, mais jamais une forme ou un signe révélant leur statut de réserve. Les informations R1/R2 ne figurent que dans une couche de planification MJ séparée.
## 6. Contrat artistique, technique et sécurité

Fond continental **paysage 3:2 avec marges maritimes N/E**, sans texte peint, aucun donjon ni réserve secrète visible ; villages et merveilles publiques autorisés. **UPSCALING INTERDIT, sans exception.** Produire une illustration **native indépendante** de la mappemonde approuvée, pas un upscale ni un recadrage agrandi. Ne jamais annoncer 4K/8K/16K à défaut des pixels effectivement générés. En cas d'incompatibilité du moteur avec 3:2 natif, proposer et faire arbitrer un recadrage destructif depuis un format natif compatible, sans interpolation, tout en préservant la géographie.

Les trois silhouettes de donjons sont des fichiers indépendants, potentiellement transparents/détourés si technologie réelle vérifiée. Le contrôle des droits s'applique **avant transmission des images/URL/aperçus/recherche/cache**, MJ/joueur/campagne, et non par simple masquage d'éléments publics.

Le prompt final de production reste à écrire **sur la base du vrai PNG maître et des capacités mesurées du générateur** ; aucun nom de ville, géopoint de donjon, race « autochtone » exclusive ou portail non confirmé ne doit y être introduit. Après production : manifeste d'asset/hash/dimensions mesurées, inspection géographie et ratios, validation individuelle des trois images, plan d'implantation MJ (D12/D14/D15/R1/R2), QA Safari iPad et contrôle de confidentialité. Aucune nouvelle API/rôle/store V7 n'est présumée existante.

## 7. Gates de validation

**VERT** : onze choix de conception ci-dessus ; région relative des trois donjons ; trois concepts artistiques approuvés ; règle de révélation par le MJ ; diversité multiraciale de la population ; deux réserves singulières éloignées, avec Cimes Suspendues exclues.

**RESTENT À FINALISER SUR LA CARTE** : les coordonnées locales et contours fins de D12/D14/D15 et des secteurs R1/R2 **déjà validés**, le contrôle effectif des distances et non-collisions ; éventuellement le placement et les noms des petits villages seulement s'ils doivent devenir des fiches Codex interactives. **Aucun nouvel arbitrage de secteur R1/R2 n'est requis**, sauf conflit visuel réel dûment signalé.

**RESTENT À VÉRIFIER TECHNIQUEMENT AVANT GÉNÉRATION / INTÉGRATION** : vrai PNG mondial 4K/hash, possibilité native 3:2 et dimensions mesurées, correspondance D12/D14/D15 ↔ IDs métier du Codex, modèle backend d'autorisation des illustrations par campagne, validation finale des images après production. Ne pas rouvrir d'office les onze choix déjà validés.

**Aucune image produite, aucune fusion ni modification de l'application.**
