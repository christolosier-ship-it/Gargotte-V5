# Gargottex V6 - UI-6 Polish responsive, accessibilité & validation finale

## Statut

**VERROUILLÉ - source de vérité pour la validation finale de la refonte UI/UX**

UI-6 ne redessine pas Gargottex et n'ajoute pas de nouvelle fonctionnalité produit par défaut.

Principe directeur :

> **UI-6 polit, mesure et valide. Elle ne recommence pas la conception.**

---

# 1. Décisions verrouillées

1. UI-6 ne redéfinit pas UI-1 à UI-5 sans défaut démontré.
2. Les familles de breakpoints restent celles du design system.
3. Des ajustements intermédiaires sont permis uniquement lorsqu'un composant casse réellement.
4. Cibles principales : iPhone, iPad portrait, iPad paysage, desktop étroit, desktop large.
5. Un smoke test Chrome Android complète la matrice.
6. Cible : WCAG 2.2 AA sur les parcours essentiels.
7. Les actions tactiles importantes respectent la cible définie par UI-1.
8. Navigation clavier desktop obligatoire.
9. Playwright couvre les parcours principaux.
10. axe couvre les erreurs d'accessibilité automatisables.
11. Une visual regression ciblée protège les vues structurantes.
12. Les performances utilisent des budgets réalistes, pas un score parfait obligatoire.
13. Offline, reconnexion, sync en attente et médias distants sont testés.
14. Les gros volumes sont testés.
15. Safe areas iOS obligatoires.
16. La rotation tablette conserve le contexte.
17. Zoom, taille de texte et reflow sont testés.
18. `prefers-reduced-motion` est respecté.
19. La Gate exige zéro anomalie bloquante et zéro majeure.
20. La Gate combine automatisation et appareils réels.
21. Une matrice de validation finale est conservée dans la documentation.

---

# 2. Portée

Valider toutes les zones UI-1 à UI-5 :

- shell et navigation ;
- recherche globale ;
- Codex et fiches ;
- Accueil et outils de partie ;
- Atelier ;
- Médias ;
- Import/Export ;
- Auth visible ;
- synchronisation ;
- Journal/diagnostics ;
- modales, drawers, toasts et visionneuse ;
- états vides, offline, partiels et erreurs.

---

# 3. Matrice responsive

Les valeurs suivantes servent de **cibles de validation UI-6**. Elles ne remplacent pas les breakpoints du design system.

## Téléphone

Tester au minimum :

- étroit : environ 320 à 360 px ;
- courant : environ 390 px ;
- grand téléphone : environ 430 px.

Vérifier : pas de débordement involontaire, navigation utilisable, actions non masquées, clavier virtuel, bottom nav, sheets et images.

## Tablette

Tester au minimum :

- portrait : environ 768 à 834 px ;
- paysage : environ 1024 à 1194 px ;
- rotation en cours d'usage.

Vérifier : rail, master-detail quand prévu, drawer en portrait, formulaires, illustrations, tactiles et conservation de contexte.

## Desktop

Tester au minimum :

- étroit : environ 1200 à 1366 px ;
- courant : environ 1440 à 1600 px ;
- large : 1920 px et plus.

Vérifier : sidebar, largeur de lecture, master-detail, clavier, focus, densité et espaces vides.

Un breakpoint supplémentaire n'est ajouté que pour résoudre un problème de contenu observé et reproductible.

---

# 4. Conservation de contexte

La rotation ou le redimensionnement ne doit pas perdre :

- vue active ;
- entité ouverte ;
- recherche ;
- filtres ;
- scroll lorsque pertinent ;
- niveau Héros ;
- contexte de partie ;
- Brouhaha ;
- quête de session ;
- modifications Atelier non enregistrées.

---

# 5. Safe areas et clavier virtuel

Valider particulièrement sur iOS :

- topbar ;
- bottom nav ;
- barre Enregistrer ;
- modales et sheets ;
- visionneuse ;
- boutons proches des bords ;
- viewport après ouverture/fermeture du clavier.

Aucune action critique ne doit être cachée par le home indicator ou le clavier.

---

# 6. Cohérence transversale

UI-6 vérifie que les mêmes patterns se comportent de la même façon partout :

- retour ;
- boutons ;
- drawers ;
- modales ;
- focus ;
- actions destructives ;
- états vides ;
- filtres ;
- wording local/distant ;
- erreurs ;
- confirmations.

Une divergence doit être corrigée ou explicitement justifiée par un besoin métier.

---

# 7. Accessibilité

## 7.1 Contrastes

Tester les tokens UI-1 **sur leurs surfaces réelles**, notamment :

- textes secondaires/tertiaires ;
- catégories ;
- badges ;
- boutons ;
- focus ;
- warning/danger ;
- sync et erreurs.

Si une combinaison ne respecte pas la cible AA pour l'usage prévu, corriger l'usage ou le token dans UI-1 plutôt que créer une exception locale.

Les couleurs de catégorie et les couleurs système peuvent être proches, mais leur sens doit toujours rester différencié par texte, icône et contexte.

## 7.2 Clavier

Tester :

- navigation globale ;
- recherche ;
- filtres ;
- Galerie/Liste ;
- liens contextuels ;
- formulaires ;
- segmented controls ;
- drawers ;
- modales ;
- visionneuse ;
- Journal ;
- preview d'import.

Exigences : ordre logique, focus visible, restauration du focus, pas de piège hors modal, fermeture `Escape` lorsque sûre.

## 7.3 Lecteur d'écran réel

La Gate inclut un **smoke test VoiceOver sur iPhone ou iPad réel** couvrant au minimum :

- navigation mobile ;
- ouverture d'une fiche Créature ;
- boutons icon-only ;
- accordéons ;
- modal de confirmation ;
- formulaire Atelier ;
- statut de synchronisation.

Axe complète ce test mais ne le remplace pas.

Un smoke test TalkBack peut être ajouté lors du contrôle Android si disponible, sans devenir une seconde matrice complète.

## 7.4 Texte, zoom et reflow

Tester au minimum les paliers de zoom usuels 100 %, 125 %, 150 % et 200 %, puis un scénario de reflow à forte magnification sur les parcours essentiels.

Objectifs :

- pas de texte critique inaccessible ;
- pas de chevauchement destructif ;
- pas de scroll horizontal à deux dimensions pour la lecture ordinaire ;
- contrôles toujours accessibles ;
- les cartes changent de disposition plutôt que réduire excessivement le texte.

Les exceptions naturelles, comme certains contenus intrinsèquement bidimensionnels, doivent rester rares et justifiées.

## 7.5 Reduced motion

Aucune animation n'est indispensable à la compréhension. Avec reduced motion, les mouvements décoratifs et transitions non nécessaires sont supprimés ou fortement réduits.

---

# 8. Images

Valider :

- miniatures en collections ;
- lazy-loading ;
- dimensions réservées ;
- original chargé seulement si utile ;
- mémoire maîtrisée ;
- URLs objet libérées lorsque nécessaire ;
- état `remote_only` ;
- média absent ;
- image très haute / très large.

La qualité de l'original n'est jamais réduite pour gagner un score de performance.

---

# 9. Outillage de test

## Playwright

Parcours minimum :

1. Accueil -> Codex -> Bestiaire -> Créature -> retour ;
2. recherche globale -> résultat -> fiche ;
3. Galerie/Liste avec conservation du contexte ;
4. Donjon -> relation contextuelle -> retour ;
5. Héros -> changement de niveau ;
6. Générateur -> rencontre -> mini-fiche -> élimination d'une occurrence ;
7. Brouhaha -> niveau -> tirage -> historique ;
8. Quête de session -> nouveau tirage -> Codex ;
9. Atelier -> dirty state -> Enregistrer ;
10. Atelier -> quitter non enregistré -> confirmation ;
11. Médias -> états local/distant -> détail ;
12. Import -> preview -> annuler / confirmer sur données de test ;
13. Journal -> filtre -> fermeture ;
14. session Auth expirée -> sync en pause -> reconnexion ;
15. navigation mobile.

## axe

Automatiser les contrôles détectables : noms accessibles, rôles, labels, structure ARIA, contrastes détectables et erreurs communes.

## Visual regression

Captures ciblées seulement sur les vues structurantes : Accueil, Bestiaire, fiche Créature, fiche Donjon, Générateur, Brouhaha, Atelier, Médias, Import preview.

Tailles de référence recommandées :

- 390 x 844 ;
- environ 820 x 1180 ;
- environ 1180 x 820 ;
- 1366 x 768 ;
- 1920 x 1080.

Une baseline n'est mise à jour qu'après changement intentionnel validé.

---

# 10. Performance

Les budgets servent de garde-fous.

Objectifs fonctionnels :

- ouverture d'une donnée locale sans attente réseau ;
- recherche et filtres sans blocage perceptible ;
- drawers/modales fluides ;
- aucun chargement massif d'originaux ;
- pas de rerender inutile d'une grosse collection à chaque frappe.

## Indicateurs Web Vitals

Sur un scénario de référence raisonnable :

- CLS cible <= 0,10 ;
- INP cible <= 200 ms ;
- LCP cible <= 2,5 s lorsque la mesure est pertinente.

## Lighthouse

Seuils de vigilance, non absolus :

- Performance >= 80 ;
- Accessibilité >= 95 ;
- Best Practices >= 90.

Une baisse est analysée avant toute concession sur le contenu ou la qualité média.

---

# 11. Stress dataset

Tester au minimum :

- plusieurs centaines de créatures ;
- plusieurs dizaines de donjons et quêtes ;
- nombreux médias ;
- noms très longs ;
- lore long ;
- nombreux tags ;
- entités sans image ;
- relations cassées ;
- boss multi-phases ;
- médias distants non locaux ;
- erreurs sync ;
- import avec warnings et erreurs.

Pagination/virtualisation ne sont ajoutées que si les mesures démontrent un besoin réel.

---

# 12. Réseau, offline et Auth

Scénarios obligatoires :

- online normal ;
- offline avant lancement ;
- perte réseau pendant édition ;
- reconnexion ;
- session Auth expirée ;
- synchronisation en attente ;
- média distant non local ;
- erreur de téléchargement ;
- récupération après retry.

Le travail local sain ne doit jamais être présenté comme perdu à cause d'une panne distante.

---

# 13. PWA réelle

Valider :

- installation ;
- lancement depuis l'écran d'accueil ;
- offline ;
- retour multitâche ;
- reprise du contexte de session ;
- reprise de l'état Atelier lorsque l'architecture le supporte ;
- mise à jour du service worker ;
- absence de cache fantôme après mise à jour.

Sur iOS, tester également l'aide d'installation si elle est exposée par l'UI.

---

# 14. Appareils réels

Gate minimale :

- iPhone réel ;
- iPad réel portrait ;
- iPad réel paysage ;
- desktop étroit ;
- desktop large ;
- Chrome Android en smoke test.

L'émulation navigateur augmente la couverture mais ne remplace pas les appareils réels.

---

# 15. Sévérité des anomalies

## Bloquant

Empêche un parcours critique ou risque une perte de données/média.

## Majeur

Fonction utilisable avec difficulté importante ou accessibilité essentielle cassée.

## Mineur

Défaut cosmétique ou friction faible sans perte de fonction.

Critère de sortie :

```text
Bloquants : 0
Majeurs   : 0
Mineurs   : documentés et acceptés
```

---

# 16. Wording à contrôler

Vérifier notamment :

- Objets du décor ;
- Butin pour la section Créature / Loot pour la famille du Codex ;
- Éliminer ;
- Enregistrer ;
- Enregistré localement ;
- Synchronisé avec Neon ;
- Original sauvegardé et vérifié ;
- Retirer de cet appareil ;
- Supprimer définitivement.

Les anciens libellés contradictoires ne doivent pas survivre.

---

# 17. Matrice finale

Conserver un tableau avec :

- cible/appareil ;
- orientation/viewport ;
- commit testé ;
- vues testées ;
- clavier/tactile ;
- VoiceOver lorsque prévu ;
- offline ;
- Auth/sync ;
- Médias ;
- résultat ;
- anomalies restantes ;
- décision finale.

---

# 18. Ordre d'exécution

```text
Implémentation UI-1 -> UI-5
Smoke automatisé
Audit responsive
Audit accessibilité automatisé
Corrections
Visual regression
Stress dataset
Offline / Auth / sync / médias
Appareils réels + VoiceOver
Corrections finales
Re-test
Matrice finale
Gate UI-6
```

---

# 19. Gate UI-6

La refonte UI/UX V6 est validée lorsque :

1. UI-1 à UI-5 sont implémentées conformément à leurs responsabilités ;
2. aucun Bloquant ou Majeur ne subsiste ;
3. les parcours essentiels atteignent la cible d'accessibilité retenue ;
4. clavier et VoiceOver smoke sont validés ;
5. reflow/zoom ne casse pas les parcours essentiels ;
6. iPhone et iPad réels sont validés ;
7. desktop étroit et large sont validés ;
8. Android smoke est validé ;
9. rotation conserve le contexte ;
10. offline, Auth et reconnexion fonctionnent ;
11. les médias local/distant fonctionnent sans perte de qualité ;
12. le stress dataset ne provoque pas de panne majeure ;
13. Playwright/axe passent sur la suite retenue ;
14. les regressions visuelles sont expliquées ;
15. la matrice finale est complétée ;
16. les anomalies mineures restantes sont documentées et acceptées.

**Après cette Gate, la conception UI/UX V6 est close. Toute évolution ultérieure devient un nouveau chantier versionné.**
