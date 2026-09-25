# V6-WHAOU — Lot 01 — Socle émotionnel, shell et Accueil

## But

Créer les primitives réutilisables du chantier et donner à l'Accueil une présence forte sans modifier l'architecture V6.

Ce lot doit être suffisamment propre pour que les lots suivants utilisent les mêmes mouvements, matières et états au lieu d'inventer leurs propres recettes.

## Pré-requis

Lire :
- AGENTS.md ;
- docs/V6-WHAOU.md.

Inspecter l'état réel de :
- styles.css ;
- src/app.js ;
- renderShell ;
- renderHome ;
- renderSearchResults ;
- états responsive ;
- prefers-reduced-motion.

## Périmètre

### A. Tokens et primitives

Créer ou consolider uniquement les primitives nécessaires :
- motion court ;
- motion éditorial ;
- easing commun ;
- ombre de figurine ;
- halo local ;
- surface papier ;
- surface atelier ;
- accent actif ;
- classe d'entrée de page légère.

Ne pas créer un second design system.

### B. Shell

Conserver la structure actuelle.

Améliorations attendues :
- état actif sidebar plus matériel mais sobre ;
- icône/emblème actif légèrement plus lumineux ;
- transition courte du contenu entre grandes vues ;
- ambiance très légèrement différenciée entre Codex, Partie et Administration ;
- topbar et navigation toujours stables ;
- aucune animation permanente importante.

Sur tactile, aucun comportement ne dépend de hover.

### C. Recherche globale

Conserver le moteur actuel.

Polish :
- résultats traités comme un petit registre ;
- groupes mieux différenciés par famille ;
- emblèmes existants visibles ;
- apparition courte ;
- empty state intégré à la grammaire Gargotte ;
- aucun rerender global additionnel.

### D. Accueil sans session

Conserver :
- hero actuel ;
- tagline ;
- conseil de Berthold ;
- boutons Codex / Préparer la partie ;
- démarrage de session ;
- état local ;
- raccourcis.

Ajouter :
- profondeur du comptoir via CSS et assets existants ;
- ombres, trace circulaire de chope ou détails de table très discrets ;
- lumière locale subtile ;
- billet Berthold plus crédible physiquement ;
- entrée légèrement séquencée des raccourcis ;
- possibilité de renouveler le conseil de Berthold par clic/tap si cela reste local et simple ;
- distinction visuelle des quatre raccourcis sans changer leur fonction.

Si l'animation lente de lumière est retenue :
- amplitude très faible ;
- aucune charge GPU significative ;
- supprimée avec prefers-reduced-motion.

### E. Accueil avec session

Exploiter le Donjon actif :
- accent local du Donjon dans le hero ;
- plateau Rencontre / Brouhaha / Quête plus physique ;
- Brouhaha reflété avec les classes d'intensité déjà existantes ou un mapping commun ;
- repère d'étage compact ;
- rencontre terminée visuellement apaisée ;
- Quête active traitée comme petit contrat.

Terminer la partie :
- conserver la confirmation fonctionnelle ;
- après confirmation, autoriser une transition courte vers l'accueil sans session ;
- aucun délai artificiel.

### F. Empty states transversaux de base

Définir une petite convention réutilisable :
- icône/emblème délavé ;
- fond discret ;
- texte fonctionnel conservé ;
- humour facultatif et rare.

Ne pas réécrire tous les empty states dans ce lot. Créer uniquement la base.

## Contraintes

- zéro migration IndexedDB ;
- aucun nouveau Blob ;
- aucun chargement réseau ;
- aucune animation essentielle ;
- aucun changement du SessionContext ;
- pas de WebGL/Canvas ;
- pas de nouveau renderer global ;
- ne pas toucher au comportement PWA/offline.

## Tests

Minimum :
- Accueil sans session ;
- Accueil avec session ;
- navigation shell ;
- recherche globale ;
- téléphone ;
- tablette ;
- prefers-reduced-motion ;
- Fast CI pertinente.

Vérifier que le premier rendu V6-Fast reste stable et qu'aucune primitive V6-WHAOU ne retarde gargottexReady.

## Gate Lot 01

Le lot est validé si :
- l'Accueil paraît plus vivant sans devenir plus chargé ;
- le shell reste stable ;
- le vocabulaire de mouvement est réutilisable ;
- la recherche reste fonctionnelle ;
- reduced motion est complet ;
- bootstrap et média lazy ne régressent pas ;
- aucun changement métier n'a été introduit.
