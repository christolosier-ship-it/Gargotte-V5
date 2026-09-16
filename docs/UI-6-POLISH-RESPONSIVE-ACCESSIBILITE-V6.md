# Gargottex V6 — UI-6 Polish responsive, accessibilité & validation finale

## Statut

**VERROUILLÉ — phase finale de cohérence, responsive, accessibilité, performance et validation multi-appareils**

Ce document complète :

- `docs/REFONTE-UI-UX-V6.md` ;
- `docs/UI-1-DESIGN-SYSTEM-V6.md` ;
- `docs/UI-2-BESTIAIRE-FICHE-CREATURE-V6.md` ;
- `docs/UI-3-CODEX-AUTRES-ENTITES-V6.md` ;
- `docs/UI-4-OUTILS-DE-PARTIE-V6.md` ;
- `docs/UI-5-ADMINISTRATION-MEDIAS-SYNC-V6.md` ;
- `docs/REFACTORISATION-V6-LOCAL-FIRST-NEON.md`.

UI-6 n’introduit **aucune nouvelle architecture UX** et **aucune nouvelle fonctionnalité produit** par défaut.

Son rôle est de vérifier, corriger et certifier l’ensemble UI-1 → UI-5 sur appareils, tailles, états et contraintes réels.

Principe directeur :

> **UI-6 polit, mesure et valide. Elle ne redessine pas Gargottex une nouvelle fois.**

---

# 1. Objectifs UI-6

UI-6 doit permettre de :

- valider les layouts desktop, tablette et téléphone sur tailles réelles ;
- supprimer les zones intermédiaires où une vue casse entre deux breakpoints ;
- vérifier la cohérence transversale de tous les composants ;
- atteindre un niveau d’accessibilité conforme aux usages essentiels ;
- vérifier clavier, focus, zoom, tailles tactiles et reduced motion ;
- mesurer les performances sans sacrifier l’identité visuelle ;
- tester l’application avec des volumes de données réalistes ou élevés ;
- tester offline, reconnexion, synchronisation et médias distants ;
- valider PWA, rotation, multitâche et safe areas ;
- ajouter une couverture de tests automatisés légère et pertinente ;
- produire une matrice finale de validation avant clôture de la refonte UI/UX.

---

# 2. Décisions verrouillées

Les décisions suivantes sont actées :

1. UI-6 ne redéfinit pas l’architecture UX de UI-1 à UI-5.
2. Les breakpoints de référence restent `768 px` et `1200 px`.
3. Des media queries intermédiaires sont autorisées uniquement si un composant casse réellement.
4. Les cibles principales sont : iPhone, iPad portrait, iPad paysage, desktop étroit, desktop large.
5. Un contrôle Chrome Android est inclus pour compatibilité PWA, sans doubler toute la matrice.
6. La cible d’accessibilité est **WCAG 2.2 AA** pour les parcours et contenus essentiels.
7. Les cibles tactiles importantes font environ **44 × 44 px minimum**.
8. La navigation clavier desktop est obligatoire sur toutes les vues et composants interactifs.
9. `Playwright` est retenu comme outil principal de tests de parcours et responsive.
10. `axe` est retenu pour l’automatisation des contrôles d’accessibilité détectables.
11. Une visual regression limitée et ciblée est mise en place sur les vues structurantes.
12. Les performances sont évaluées par budgets simples et stables, pas par recherche d’un score 100 artificiel.
13. Les scénarios offline, reconnexion, synchronisation en attente et médias `remote_only` sont obligatoires.
14. Des tests de gros volumes sont obligatoires.
15. Les safe areas iOS sont obligatoirement prises en compte.
16. La rotation tablette portrait ↔ paysage ne doit pas perdre le contexte UI.
17. L’agrandissement du texte doit rester utilisable sans chevauchement critique.
18. `prefers-reduced-motion` est strictement respecté.
19. Aucun bug bloquant ou majeur responsive/accessibilité/performance ne peut subsister à la Gate UI-6.
20. La Gate finale combine tests automatisés et validation sur appareils réels.
21. UI-6 ne crée pas de nouvelle fonctionnalité sauf correction indispensable révélée par les tests.
22. Une matrice finale de validation est produite et conservée avec la documentation.

---

# 3. Portée de validation

Toutes les zones de UI-1 à UI-5 sont concernées :

- shell applicatif ;
- sidebar desktop ;
- rail tablette ;
- navigation mobile ;
- topbar ;
- recherche globale ;
- Codex ;
- Bestiaire Galerie ;
- Bestiaire Liste ;
- fiche Créature ;
- autres fiches Codex ;
- Accueil ;
- Générateur ;
- Brouhaha ;
- Quêtes de session ;
- Atelier ;
- Médias ;
- Import / Export ;
- sync ;
- Journal / diagnostics ;
- modales ;
- drawers ;
- toasts ;
- visionneuse d’images ;
- états vides ;
- erreurs ;
- offline ;
- données partielles.

---

# 4. Matrice responsive de référence

## 4.1 Téléphones

Tester au minimum :

```text
Téléphone étroit       ~ 320–360 px
Téléphone courant      ~ 390 px
Grand téléphone        ~ 430 px
```

Objectifs :

- aucune navigation horizontale involontaire ;
- aucun bouton primaire tronqué ;
- aucune barre sticky masquée par le clavier ou le home indicator ;
- textes éditoriaux encore lisibles ;
- images non écrasées ;
- drawers / sheets utilisables ;
- retour collection/fiches cohérent.

## 4.2 Tablettes

Tester au minimum :

```text
iPad portrait
~ 768–834 px selon appareil

iPad paysage
~ 1024–1194 px selon appareil
```

La tablette n’est jamais traitée comme un desktop rétréci.

Valider :

- rail tablette ;
- master-detail lorsque prévu ;
- drawer collection en portrait lorsque prévu ;
- densité des formulaires ;
- taille des illustrations ;
- zones tactiles ;
- rotation sans perte de contexte.

## 4.3 Desktop

Tester au minimum :

```text
Desktop étroit     ~ 1200–1366 px
Desktop courant    ~ 1440–1600 px
Desktop large      >= 1920 px
```

Valider :

- sidebar ;
- largeur de lecture ;
- occupation des grandes images ;
- maîtrise des espaces vides ;
- absence d’étirement excessif ;
- efficacité des layouts master-detail ;
- confort clavier/souris.

---

# 5. Zones intermédiaires

Les seuils `768` et `1200` restent les références.

Toutefois, un composant peut recevoir un breakpoint intermédiaire lorsqu’un problème réel est observé, par exemple :

- fiche Créature comprimée vers 980 px ;
- trois colonnes trop serrées vers 1280 px ;
- topbar qui sature vers 820 px ;
- cartes Galerie devenant trop étroites ;
- filtres débordant sans wrap utile.

Règle :

> **Créer un breakpoint pour résoudre une contrainte de contenu observée, jamais pour collectionner des nombres magiques.**

Chaque nouveau breakpoint doit être documenté dans le CSS / design system si son usage devient transversal.

---

# 6. Safe areas iOS

Prendre en compte :

```css
safe-area-inset-top
safe-area-inset-right
safe-area-inset-bottom
safe-area-inset-left
```

Zones concernées :

- topbar ;
- navigation mobile ;
- barre Enregistrer ;
- bottom sheets ;
- modales plein écran ;
- visionneuse ;
- boutons proches des bords.

La navigation basse ne doit jamais entrer en conflit avec le home indicator.

---

# 7. Rotation tablette

Passage portrait ↔ paysage :

- conserve la vue active ;
- conserve l’entité ouverte ;
- conserve les filtres ;
- conserve la recherche ;
- conserve le niveau Héros sélectionné ;
- conserve le contexte de partie ;
- conserve le Brouhaha ;
- conserve les modifications Atelier non enregistrées ;
- ne renvoie jamais automatiquement à l’Accueil.

Le changement de layout peut être immédiat, mais pas destructif.

---

# 8. Navigation et cohérence transversale

UI-6 vérifie que les mêmes patterns se comportent pareil partout.

Exemples :

- même `Back` / retour collection ;
- mêmes styles primaire / secondaire / tertiaire ;
- même fermeture de drawer ;
- même comportement des modales ;
- même position des actions destructives ;
- même wording local / sync ;
- même traitement des états vides ;
- même comportement des filtres ;
- même logique de focus après ouverture/fermeture.

Une divergence doit être soit corrigée, soit explicitement justifiée par un besoin métier.

---

# 9. Accessibilité — cible

Objectif : **WCAG 2.2 AA pour les parcours essentiels**.

UI-6 ne prétend pas à une certification externe, mais doit satisfaire les critères détectables et les contrôles manuels pertinents.

## 9.1 Contrastes

Vérifier :

- texte principal ;
- texte secondaire ;
- badges ;
- boutons ;
- champs ;
- focus ;
- danger ;
- messages d’erreur ;
- statuts de synchronisation.

L’accent de donjon ne peut jamais dégrader le contraste requis.

## 9.2 Couleur

Aucune information critique ne dépend uniquement de la couleur.

Exemples :

- catégorie Créature = texte + icône + couleur ;
- sync = texte + icône + couleur ;
- erreur import = texte + symbole + couleur ;
- état média = libellé + icône éventuelle + couleur.

---

# 10. Navigation clavier

Obligatoire sur desktop.

Tester :

- sidebar ;
- topbar ;
- recherche globale ;
- filtres ;
- Galerie ;
- Liste ;
- fiche ;
- liens contextuels ;
- tabs / segmented controls ;
- formulaires ;
- drawers ;
- modales ;
- visionneuse ;
- Journal ;
- Import preview.

Règles :

- ordre logique ;
- focus visible ;
- pas de focus piégé hors modal ;
- modal avec focus initial pertinent ;
- restauration du focus après fermeture ;
- `Escape` ferme les overlays lorsque sûr ;
- activation clavier des contrôles custom.

---

# 11. Taille de texte et zoom

Tester au minimum :

- zoom navigateur 100 % ;
- 125 % ;
- 150 % ;
- 200 % sur parcours essentiels lorsque techniquement pertinent.

Objectifs :

- pas de texte critique tronqué sans accès au contenu ;
- pas de chevauchement destructif ;
- boutons encore utilisables ;
- navigation encore accessible ;
- formulaires encore lisibles.

Les cartes peuvent changer de disposition plutôt que réduire le texte excessivement.

---

# 12. Taille tactile

Cible générale :

```text
44 × 44 px minimum
```

pour :

- navigation ;
- bouton Enregistrer ;
- générer ;
- Brouhaha +/- ;
- fermer ;
- retour ;
- boutons d’overlay ;
- filtres importants ;
- suppression confirmée ;
- actions média.

Une icône graphique peut mesurer moins de 44 px si sa zone interactive respecte la cible.

---

# 13. Reduced motion

Avec :

```css
@media (prefers-reduced-motion: reduce)
```

réduire ou supprimer :

- animations de drawer ;
- zoom décoratif ;
- transitions longues ;
- mouvements de halo ;
- animations non essentielles.

La compréhension de l’interface ne dépend jamais d’une animation.

---

# 14. Images et alt text

Règles :

- illustration informative : alt utile ;
- décoration pure : alt vide / masquée aux technologies d’assistance ;
- nom de créature inutilement répété plusieurs fois dans les éléments voisins : éviter le bruit ;
- media viewer : nom ou contexte identifiable ;
- images absentes : état textuel compréhensible.

L’original haute qualité n’est jamais sacrifié pour satisfaire une optimisation UI. Les miniatures restent séparées conformément à UI-5 et à l’architecture V6.

---

# 15. Outillage de test

UI-6 autorise l’ajout d’un outillage de test minimal au projet.

## 15.1 Playwright

Utiliser Playwright pour :

- parcours majeurs ;
- responsive ;
- navigation ;
- overlays ;
- clavier ;
- screenshots ;
- états offline simulables ;
- regressions fonctionnelles UI.

L’ajout de Playwright ne justifie aucun framework frontend.

## 15.2 axe

Intégrer axe aux tests pertinents pour détecter automatiquement :

- contrastes détectables ;
- labels manquants ;
- rôles incorrects ;
- structure ARIA invalide ;
- problèmes de nom accessible ;
- erreurs courantes de navigation.

Les résultats axe ne remplacent pas les contrôles manuels.

## 15.3 Lighthouse

Lighthouse peut être utilisé comme indicateur complémentaire pour :

- performance ;
- accessibilité ;
- bonnes pratiques ;
- installabilité/PWA lorsque pertinent.

Aucun objectif `100/100` obligatoire.

---

# 16. Parcours Playwright minimum

Automatiser au minimum :

```text
1. Accueil → Codex → Bestiaire → Créature → retour
2. Recherche globale → résultat → fiche
3. Galerie ↔ Liste avec conservation filtres
4. Donjon → Créature / Quête liée
5. Héros → changement niveau
6. Accueil → Générateur → rencontre → mini-fiche
7. Brouhaha + / - → tirer effet → historique
8. Quête de session → tirage → Codex
9. Atelier → modifier → dirty state → enregistrer
10. Atelier → quitter sans sauvegarder → confirmation
11. Médias → filtre → détail → statut local/distant
12. Import → preview → annuler
13. Journal → ouvrir → filtrer → fermer
14. Sync error → panneau → Réessayer
15. Navigation mobile via bottom nav
```

Les données de test peuvent être dédiées et reproductibles.

---

# 17. Visual regression

Créer des screenshots de référence ciblés, pas une capture de chaque pixel de l’application.

Vues prioritaires :

- Accueil ;
- Bestiaire Galerie ;
- Bestiaire Liste ;
- fiche Créature ;
- fiche Donjon ;
- Générateur avec résultat ;
- Brouhaha ;
- Atelier ;
- Médias ;
- Import preview.

Tailles recommandées :

```text
390 × 844
820 × 1180 environ
1180 × 820 environ
1366 × 768
1920 × 1080
```

Une différence visuelle n’est pas automatiquement une régression : les changements intentionnels doivent mettre à jour la baseline explicitement.

---

# 18. Budgets de performance

UI-6 utilise des budgets réalistes plutôt qu’un score parfait.

## 18.1 Interactions locales

Cibles sur appareil moderne représentatif :

- changement de vue locale : perception quasi immédiate ;
- ouverture d’une fiche déjà locale : sans attente réseau ;
- filtres : réponse sans blocage perceptible ;
- saisie recherche : aucune latence gênante ;
- ouverture drawer/modal : fluide ;
- aucune action locale ne doit attendre Neon.

## 18.2 Web Vitals indicatifs

Sur un scénario de référence raisonnable :

```text
CLS cible <= 0.10
INP cible <= 200 ms
LCP cible <= 2.5 s lorsque réseau / device permettent une mesure pertinente
```

Ces seuils servent de garde-fou, pas de prétexte pour dégrader l’illustration ou supprimer des fonctions essentielles.

## 18.3 Lighthouse

Seuils de vigilance recommandés, non absolus :

```text
Performance       >= 80
Accessibilité     >= 95
Best Practices    >= 90
```

Une baisse doit être comprise et documentée.

---

# 19. Performance images

Valider :

- miniatures en Galerie/Liste ;
- lazy loading hors premier viewport ;
- pas de chargement de centaines d’originaux ;
- original ouvert uniquement si nécessaire ;
- absence de base64 géant dans le DOM ;
- URLs objet révoquées lorsque nécessaire ;
- mémoire maîtrisée lors du changement de fiches ;
- visionneuse ne garde pas plusieurs originaux lourds inutilement.

La qualité de l’original n’est jamais réduite.

---

# 20. Stress test contenu

Tester l’interface avec un dataset volontairement chargé.

Minimum recommandé :

- plusieurs centaines de créatures ;
- plusieurs dizaines de donjons / quêtes ;
- noms très longs ;
- lore long ;
- tags nombreux ;
- entités sans image ;
- relations manquantes ;
- boss multi-phases ;
- nombreux médias ;
- médias `remote_only` ;
- erreurs sync ;
- import comportant warnings et erreurs.

Objectif :

> vérifier Gargottex quand la taverne est pleine, pas uniquement à l’ouverture.

---

# 21. Recherche et listes volumineuses

Pour gros volumes :

- recherche reste réactive ;
- filtres ne bloquent pas l’UI ;
- scroll reste fluide ;
- images sont lazy-loadées ;
- éviter de rendre plusieurs centaines d’originaux ;
- pagination/virtualisation ne sont ajoutées que si les mesures démontrent un besoin réel.

UI-6 ne force pas une virtualisation prématurée.

---

# 22. Tests réseau

Scénarios obligatoires :

## Online normal

- données locales ;
- sync complète ;
- média vérifié.

## Offline avant lancement

- shell PWA disponible ;
- données locales lisibles ;
- outils de partie utilisables ;
- Atelier local utilisable ;
- média local lisible.

## Perte réseau en édition

- Enregistrer localement fonctionne ;
- état sync passe en attente ;
- aucune perte.

## Reconnexion

- outbox reprend ;
- statut se met à jour ;
- aucune duplication.

## Média remote-only

- métadonnées visibles ;
- placeholder / miniature si disponible ;
- action de téléchargement ;
- erreur réseau correctement gérée.

---

# 23. Tests PWA

Valider sur installation réelle :

- installation ;
- lancement depuis écran d’accueil ;
- navigation sans chrome navigateur gênant ;
- safe areas ;
- offline ;
- retour multitâche ;
- reprise session UI-4 ;
- reprise dirty state Atelier si l’architecture le supporte ;
- mise à jour du service worker ;
- absence de cache fantôme après nouvelle version.

---

# 24. iOS réel

La Gate finale doit inclure au minimum :

- un iPhone réel ;
- un iPad réel.

Tester spécifiquement :

- clavier virtuel ;
- barre Enregistrer ;
- bottom nav ;
- scroll dans modales/drawers ;
- rotation ;
- sélection de fichiers/images ;
- PWA installée ;
- retour du background ;
- viewport après apparition/disparition clavier.

---

# 25. Android de compatibilité

Effectuer au minimum un contrôle sur Chrome Android :

- installation PWA ;
- navigation mobile ;
- fichiers ;
- clavier ;
- offline ;
- bottom nav ;
- safe spacing bas.

Ce contrôle ne double pas la matrice iOS principale.

---

# 26. Desktop réel

Tester au minimum :

- Chrome/Chromium ;
- clavier complet ;
- souris ;
- fenêtre étroite ;
- grande fenêtre ;
- zoom ;
- raccourcis de focus usuels.

Safari desktop peut être ajouté si un comportement spécifique WebKit est suspecté.

---

# 27. États limites à valider

Chaque grande vue doit survivre à :

- aucune donnée ;
- une seule donnée ;
- beaucoup de données ;
- image absente ;
- image très haute ;
- image très large ;
- nom très long ;
- texte vide ;
- texte très long ;
- relation cassée ;
- offline ;
- sync lente ;
- sync erreur ;
- auth expirée ;
- média distant absent localement ;
- média hash invalide ;
- import invalide.

---

# 28. Sévérité des anomalies

## Bloquant

Empêche un parcours critique ou risque de perte de données.

Exemples :

- impossible d’enregistrer ;
- suppression involontaire ;
- impossible de naviguer ;
- écran inutilisable sur une cible principale ;
- original média perdu/corrompu.

## Majeur

Fonction utilisable avec difficulté importante ou accessibilité essentielle cassée.

Exemples :

- bouton masqué ;
- drawer impossible à fermer au clavier ;
- layout tablette fortement cassé ;
- contraste essentiel non conforme ;
- scroll bloqué.

## Mineur

Défaut cosmétique ou friction faible sans perte de fonction.

UI-6 peut être clôturée avec des anomalies mineures documentées.

---

# 29. Critère de sortie

Avant Gate UI-6 :

```text
Bloquants : 0
Majeurs   : 0
Mineurs   : documentés et acceptés
```

Les problèmes de données ou de média susceptibles de produire une perte sont toujours bloquants.

---

# 30. Cohérence du wording

UI-6 vérifie notamment les termes verrouillés :

- Créatures ;
- Héros ;
- PNJ ;
- Quêtes ;
- Loot ;
- Objets du décor ;
- Brouhaha ;
- Médias ;
- Atelier ;
- Enregistrer ;
- Éliminer ;
- Enregistré localement ;
- Synchronisé avec Neon ;
- Original sauvegardé et vérifié.

Ne pas laisser survivre d’anciens libellés contradictoires comme `Kill` ou `Objets` seul lorsque le contexte parle des interactables.

---

# 31. Automatisation CI

Si Playwright/axe sont intégrés à GitHub Actions :

- ne pas déclencher inutilement une infrastructure lourde ;
- garder une suite smoke rapide sur PR ;
- réserver les tests plus lourds à une étape dédiée si nécessaire ;
- conserver les screenshots / traces comme artifacts en cas d’échec si raisonnable ;
- ne pas bloquer sur des différences visuelles volatiles non maîtrisées.

Le workflow existant lié à d’autres parties du dépôt ne doit pas être détourné sans nécessité.

---

# 32. Matrice de validation finale

Créer un document ou tableau de suivi contenant au minimum :

| Cible | Orientation / viewport | Vues testées | Clavier/tactile | Offline | Sync | Médias | Résultat |
|---|---|---|---|---|---|---|---|
| iPhone réel | portrait | principales | tactile | oui | oui | oui | PASS/FAIL |
| iPad réel | portrait | principales | tactile | oui | oui | oui | PASS/FAIL |
| iPad réel | paysage | principales | tactile | oui | oui | oui | PASS/FAIL |
| Desktop étroit | 1366×768 env. | toutes | clavier/souris | oui | oui | oui | PASS/FAIL |
| Desktop large | 1920×1080 env. | toutes | clavier/souris | oui | oui | oui | PASS/FAIL |
| Android Chrome | mobile | smoke | tactile | oui | smoke | smoke | PASS/FAIL |

Ajouter :

- date ;
- version/commit ;
- appareil / navigateur ;
- anomalies ;
- décision finale.

---

# 33. Ordre recommandé d’exécution UI-6

```text
1. implémentation UI-1 → UI-5 terminée
2. tests automatisés smoke
3. audit responsive navigateur
4. audit axe / accessibilité
5. corrections
6. visual regression
7. stress dataset
8. offline / sync / média
9. tests appareils réels
10. corrections finales
11. re-test
12. matrice finale
13. Gate UI-6
```

Ne pas valider une étape uniquement parce qu’elle « semble correcte » dans un seul navigateur desktop.

---

# 34. Ce que UI-6 n’autorise pas

UI-6 n’est pas une excuse pour :

- refaire la direction artistique ;
- changer les couleurs de catégories sans défaut démontré ;
- repenser la navigation ;
- réorganiser le modèle métier ;
- ajouter un tracker de combat ;
- ajouter une campagne ;
- introduire React/Vue/Svelte uniquement pour tester ;
- remplacer IndexedDB ;
- changer la stratégie média sans problème technique démontré ;
- réduire la qualité des originaux ;
- ajouter des animations décoratives lourdes.

---

# 35. Critères d’acceptation UI-6

UI-6 est conceptuellement complète lorsque :

- [x] matrice responsive définie ;
- [x] zones intermédiaires définies ;
- [x] safe areas définies ;
- [x] rotation définie ;
- [x] cohérence transversale définie ;
- [x] cible WCAG 2.2 AA définie ;
- [x] clavier défini ;
- [x] zoom / taille texte défini ;
- [x] touch targets définies ;
- [x] reduced motion défini ;
- [x] images / alt définis ;
- [x] Playwright défini ;
- [x] axe défini ;
- [x] visual regression définie ;
- [x] budgets performance définis ;
- [x] stress dataset défini ;
- [x] offline / reconnexion définis ;
- [x] PWA définie ;
- [x] iOS réel défini ;
- [x] Android smoke défini ;
- [x] sévérité anomalies définie ;
- [x] critère de sortie défini ;
- [x] matrice finale définie.

---

# 36. Gate UI-6

La refonte UI/UX V6 est validée lorsque :

1. les vues UI-1 à UI-5 sont implémentées conformément à leurs documents ;
2. aucun bug bloquant ou majeur responsive ne subsiste ;
3. aucun bug bloquant ou majeur d’accessibilité ne subsiste sur les parcours essentiels ;
4. le clavier permet les parcours desktop essentiels ;
5. les contrastes essentiels atteignent la cible AA ;
6. les actions tactiles principales sont utilisables sur téléphone/tablette ;
7. iPhone réel validé ;
8. iPad portrait validé ;
9. iPad paysage validé ;
10. desktop étroit validé ;
11. desktop large validé ;
12. Android Chrome smoke validé ;
13. rotation ne perd pas le contexte ;
14. offline fonctionne ;
15. reconnexion/sync fonctionne ;
16. médias local/distant fonctionnent sans perte de qualité ;
17. aucun original média n’est recompressé ;
18. stress dataset ne produit pas de panne ou blocage majeur ;
19. Playwright/axe passent sur la suite retenue ;
20. visual regression ne montre aucune régression non expliquée ;
21. la matrice finale de validation est complétée ;
22. les anomalies mineures restantes sont explicitement documentées et acceptées.

**UI-6 devient la source de vérité pour la validation finale de la refonte UI/UX Gargottex V6.**

Après Gate UI-6, la phase de conception UI est close. Toute évolution ultérieure devient un nouveau chantier versionné, pas une extension implicite de UI-6.
