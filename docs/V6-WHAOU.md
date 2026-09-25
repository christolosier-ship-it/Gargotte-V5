# Gargottex V6-WHAOU — Émotion, mise en scène et ambition visuelle

## Statut

ACTIF — DOCUMENT MAÎTRE DU CHANTIER V6-WHAOU.

V6-WHAOU est une évolution visuelle et interactionnelle de Gargottex V6. Il ne remplace ni les invariants runtime V6-Fast, ni le chantier V7 backend.

Le principe directeur est simple :

> Gargottex ne doit plus seulement consulter Gargotte. Il doit donner l'impression d'entrer dans une extension numérique de La Chope Qui Colle.

Le résultat recherché n'est pas une interface médiévale décorative. Il s'agit d'une application moderne, tactile et lisible, dont les moments importants ont une véritable mise en scène.

---

# 1. Objectifs

V6-WHAOU doit :

- augmenter fortement l'émotion perçue sans refaire l'architecture de l'application ;
- donner une personnalité distincte au Codex, aux outils de partie et à l'administration ;
- exploiter réellement les figurines détourées, les sigils, les icônes gameplay et les accents Donjon ;
- créer quelques moments signature plutôt que d'animer chaque bouton ;
- utiliser l'humour Gargotte avec parcimonie et au bon moment ;
- rester rapide et fiable sur iPad ;
- conserver le fonctionnement PWA et offline ;
- respecter prefers-reduced-motion ;
- conserver les comportements responsive V6 validés ;
- ne toucher ni au modèle de données, ni aux relations, ni à l'IndexedDB pour des raisons purement visuelles.

Formule de référence :

> Le Codex respire. La partie frappe. Le Brouhaha déborde. L'Atelier travaille.

---

# 2. Les quatre univers visuels

## 2.1 Codex

Sensation :
- collection premium ;
- figurines ;
- registre ;
- exploration ;
- contemplation.

Matières :
- papier chaud ;
- cuir sombre ;
- laiton ;
- bois noirci ;
- fonds profonds.

Motion :
- entrées éditoriales brèves ;
- continuité collection -> fiche ;
- figurines qui prennent place ;
- révélations localisées.

## 2.2 Partie

Sensation :
- table de jeu ;
- information immédiate ;
- objets posés devant les joueurs ;
- cause -> conséquence.

Motion :
- apparition d'une rencontre ;
- élimination d'une occurrence ;
- apparition du Loot ;
- tirage de Quête.

## 2.3 Brouhaha

Sensation :
- pression ;
- détérioration progressive ;
- chaos contrôlé.

Le chaos concerne le décor, jamais la compréhension :
- nombres droits ;
- boutons stables ;
- zones tactiles immobiles ;
- contrastes accessibles.

## 2.4 Administration

Sensation :
- arrière-boutique ;
- établi ;
- registres ;
- instrumentation.

Motion minimale.
Les formulaires restent propres et modernes.

---

# 3. Invariants absolus

V6-WHAOU ne doit jamais :

- reset ou supprimer IndexedDB ;
- créer une migration de données pour embellir une vue ;
- modifier silencieusement IDs, relations ou propriétés métier ;
- supprimer un Blob, original ou détourage ;
- réintroduire le chargement global des médias au bootstrap ;
- casser les lectures média lazy introduites par V6-Fast ;
- augmenter sans borne le nombre de cartes média montées ;
- créer des Object URLs globales persistantes ;
- réintroduire un render global pour un viewer, toast ou petite interaction locale ;
- ajouter WebGL, moteur Canvas, moteur physique ou système de particules global ;
- dépendre d'une ressource réseau externe ;
- créer une animation essentielle au fonctionnement ;
- utiliser hover comme seule manière de comprendre une action ;
- réintroduire une comparaison pixel-perfect avec la maquette V3 ;
- mettre une animation permanente lourde dans le shell ;
- transformer l'administration en interface narrative illisible.

La règle média active reste :
- dérivé transparent validé prioritaire ;
- image Donjon originale active ;
- anciens originaux blancs et previews historiques hors chemin d'affichage normal.

---

# 4. Grammaire de mouvement

Le chantier doit converger vers un petit vocabulaire commun.

Durées indicatives :
- feedback tactile : 90 à 160 ms ;
- entrée locale : 180 à 280 ms ;
- entrée éditoriale : 280 à 450 ms ;
- cinématique Donjon : mécanisme existant, maximum actuel conservé sauf justification.

Familles de mouvement :
1. apparition éditoriale : opacité + translation courte ;
2. impact/tampon : scale très court puis stabilisation ;
3. figurine : translation verticale faible + opacité ;
4. relation : glissement directionnel court ;
5. pression Brouhaha : variation de matière, halo et fissures.

Interdit :
- rebonds élastiques généralisés ;
- tremblement continu ;
- parallaxe tactile obligatoire ;
- animations infinies à forte fréquence.

prefers-reduced-motion doit toujours produire une version complète et compréhensible sans animation.

---

# 5. Règles de ton

L'humour Gargotte doit rester rare et contextuel.

Autorisé :
- conseil de Berthold ;
- empty states ;
- succès non critiques ;
- microcopy de résultat ;
- détails décoratifs.

À éviter :
- confirmations destructives humoristiques ;
- erreurs techniques masquées par une blague ;
- phrase drôle sous chaque titre ;
- sous-entendus qui diminuent la lisibilité ;
- décoration grivoise gratuite.

Les messages techniques gardent toujours leur contenu précis.

---

# 6. Assets

Ordre de préférence :
1. assets existants ;
2. CSS, gradients, pseudo-éléments ;
3. petit SVG local réutilisable si nécessaire ;
4. nouvelle image raster seulement si sa valeur est forte et son poids maîtrisé.

Tout asset nouveau doit :
- être stocké localement ;
- fonctionner offline ;
- avoir une fonction visuelle claire ;
- ne pas dupliquer un emblème existant ;
- rester léger ;
- être documenté dans le lot concerné.

---

# 7. Découpage du chantier

Chaque lot est dimensionné pour une passe ChatGPT GPT-5.6 Sol en effort Élevé.

## Lot 1 — Socle émotionnel, shell et Accueil

Document :
docs/V6-WHAOU-LOT-01-SOCLE-ACCUEIL.md

Couvre :
- tokens et helpers visuels ;
- transitions de page ;
- shell ;
- recherche globale ;
- Accueil sans session ;
- Accueil avec session ;
- états vides transversaux de base.

## Lot 2 — Donjons

Document :
docs/V6-WHAOU-LOT-02-DONJONS.md

Couvre :
- collection Donjons ;
- cinématique existante ;
- fiche Donjon ;
- progression des étages ;
- Boss ;
- aperçus liés ;
- accents locaux.

## Lot 3 — Créatures

Document :
docs/V6-WHAOU-LOT-03-CREATURES.md

Couvre :
- Bestiaire galerie/liste ;
- fiche Créature ;
- figurine/plinthe ;
- catégorie/Menace ;
- compétence ;
- comportement ;
- Loot ;
- relations ;
- Boss/phases.

## Lot 4 — Héros et PNJ

Document :
docs/V6-WHAOU-LOT-04-HEROS-PNJ.md

Couvre :
- collection Héros ;
- fiche Héros ;
- changement de niveau ;
- compétences cumulées ;
- collection PNJ ;
- fiche PNJ ;
- Quêtes associées.

## Lot 5 — Codex secondaire

Document :
docs/V6-WHAOU-LOT-05-CODEX-SECONDAIRE.md

Couvre :
- Quêtes Codex ;
- Loot ;
- Objets interactifs ;
- Brouhaha référentiel ;
- navigation visuelle cohérente entre ces familles.

## Lot 6 — Générateur et Rencontre

Document :
docs/V6-WHAOU-LOT-06-GENERATEUR-RENCONTRE.md

Couvre :
- préparation ;
- étapes 1 -> 5 ;
- rencontre générée ;
- créatures ;
- objets interactifs ;
- élimination ;
- Loot de session ;
- fin de rencontre.

## Lot 7 — Brouhaha et Quête de session

Document :
docs/V6-WHAOU-LOT-07-BROUHAHA-QUETE-SESSION.md

Couvre :
- intensités Brouhaha ;
- passage de niveau ;
- tirage d'effet ;
- niveau 12 ;
- historique ;
- Quête de session ;
- cohérence visuelle avec l'Accueil actif.

## Lot 8 — Médias et viewer

Document :
docs/V6-WHAOU-LOT-08-MEDIAS-VIEWER.md

Couvre :
- Médias du Codex ;
- bibliothèque Média d'administration ;
- priorité détourage ;
- détail Média ;
- comparaison actif/original ;
- viewer plein écran.

## Lot 9 — Administration

Document :
docs/V6-WHAOU-LOT-09-ADMINISTRATION.md

Couvre :
- Atelier liste ;
- Atelier édition ;
- dirty/saved ;
- Import ;
- preview ;
- Export ;
- diagnostic ;
- journal d'erreurs.

## Lot 10 — Polish transversal et Gate finale

Document :
docs/V6-WHAOU-LOT-10-POLISH-GATE.md

Couvre :
- responsive ;
- iPad ;
- reduced motion ;
- accessibilité ;
- performance ;
- cohérence des motions ;
- tests ciblés ;
- suppression des incohérences ;
- clôture documentaire.

---

# 8. Ordre d'exécution

Ordre recommandé et attendu :

1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10.

Les Lots 2 à 9 peuvent techniquement être relativement indépendants, mais l'ordre évite de recréer plusieurs fois les mêmes primitives visuelles.

Le Lot 10 ne doit jamais servir à terminer des fonctionnalités majeures abandonnées dans les lots précédents. Il sert au polish, à la cohérence et à la validation.

---

# 9. Règle de session

Au début de chaque lot :

1. lire AGENTS.md ;
2. lire ce document maître ;
3. lire uniquement le document du lot demandé ;
4. inspecter l'état réel de V5.3 au moment de l'exécution ;
5. vérifier ce qui a été fusionné depuis la rédaction ;
6. vérifier la Gate du lot précédent ;
7. créer une branche dédiée au lot ;
8. ne pas anticiper les lots suivants sauf primitive strictement nécessaire.

En fin de lot :

1. exécuter les tests ciblés ;
2. exécuter au minimum la Fast CI utile au périmètre ;
3. si le lot touche média/PWA/offline, exécuter les scénarios Full concernés ;
4. vérifier tablette/iPad lorsque le rendu principal est concerné ;
5. vérifier prefers-reduced-motion ;
6. vérifier la Gate du lot ;
7. documenter uniquement les décisions durables ou écarts significatifs ;
8. ouvrir une PR vers V5.3 ;
9. ne pas lancer automatiquement le lot suivant.

---

# 10. Politique de tests

V6-WHAOU protège des invariants et comportements, pas des pixels exacts.

À tester :
- la vue s'ouvre ;
- le contenu métier reste présent ;
- les actions fonctionnelles restent utilisables ;
- les overlays ne bloquent pas la navigation ;
- reduced motion supprime les animations non essentielles ;
- aucun chargement média global réintroduit ;
- pagination/DOM borné Média conservés ;
- pas de régression Collection -> Fiche -> Retour sur tablette/téléphone ;
- pas de régression offline.

À éviter :
- assertions de coordonnées au pixel ;
- durées de transition exactes ;
- snapshots fragiles de toute la page ;
- seuils de performance arbitraires sans baseline.

---

# 11. Critères globaux de succès

V6-WHAOU est réussi lorsque :

- l'Accueil possède une vraie présence Gargotte ;
- ouvrir un Donjon, un Héros ou une Créature produit une sensation distincte ;
- les figurines détourées semblent appartenir à l'interface plutôt qu'être collées dans des vignettes ;
- les Donjons disposent d'une mise en scène propre sans perdre leur fonction de hub ;
- la session de jeu semble plus vivante que le Codex ;
- le Brouhaha devient le moment le plus expressif de l'application ;
- le système/administration conserve une lecture calme et professionnelle ;
- l'utilisateur comprend toujours immédiatement quoi toucher ;
- les performances V6-Fast restent intactes ;
- l'iPad reste une cible de premier ordre ;
- aucune donnée n'est modifiée pour satisfaire le visuel.

---

# 12. Hors périmètre

- nouvelles règles de jeu ;
- campagne persistante ;
- tracker de PV ;
- nouvelle base de données ;
- migration V7 ;
- nettoyage des médias historiques ;
- moteur de détourage ;
- génération d'images dans l'application ;
- son ou musique dans cette version ;
- WebGL ;
- système physique ;
- refonte complète du shell ;
- nouveau design system remplaçant V6.

V6-WHAOU est une couche d'ambition, pas une nouvelle application.
