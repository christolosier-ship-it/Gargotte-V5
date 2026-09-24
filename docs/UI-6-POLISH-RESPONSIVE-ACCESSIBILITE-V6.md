# Gargottex V6 - UI-6 Polish, Accessibilité & Validation finale

## Statut

**ACTIF - Gate finale de la refonte UI V6**

UI-6 ne redessine pas l'application.

Elle vérifie que UI-1 à UI-5, la maquette V3 et la préservation des données existantes ont été correctement réunies.

---

# 1. Ordre de priorité de la Gate

1. aucune perte de données ;
2. parcours critiques fonctionnels ;
3. responsive ;
4. accessibilité ;
5. fidélité V3 ;
6. performance ;
7. polish.

Un défaut visuel ne justifie jamais un risque sur IndexedDB.

---

# 2. Matrice responsive

## Téléphone

Tester environ :

- 320-360 px ;
- 390 px ;
- 430 px.

## Tablette portrait

Environ 768-834 px.

Codex :

`Collection -> Fiche -> Retour`

## Tablette paysage

Environ 1024-1194 px.

Codex :

`Collection -> Fiche -> Retour`

**Aucun panneau fiche à droite de la collection dans le Codex tablette.**

Atelier : règles propres UI-5.

## Desktop

Tester :

- 1200-1366 ;
- 1440-1600 ;
- 1920+.

Master-detail Codex autorisé.

---

# 3. Comparaison visuelle

Baseline :

- maquette V3 ;
- ressources V3 ;
- cahier des vues REV2 comme aide seulement.

Captures à protéger :

- Accueil ;
- Bestiaire collection ;
- fiche Créature ;
- Donjon ;
- Héros ;
- PNJ ;
- Quête ;
- Loot ;
- Générateur ;
- Brouhaha ;
- Atelier ;
- Médias ;
- Import/Export.

Une variation est acceptable si elle :

- corrige un bug ;
- améliore accessibilité ;
- gère mieux les données réelles ;
- améliore performance ;

sans dégrader l'intention visuelle.

---

# 4. Non-régression données IndexedDB

Gate obligatoire.

Tester sur une copie représentative :

1. installation version précédente ;
2. création de données/médias ;
3. mise à jour vers V6 ;
4. ouverture de toutes les familles ;
5. édition d'une entité ;
6. fermeture/réouverture ;
7. fonctionnement offline ;
8. export après migration.

Vérifier :

- nombres d'enregistrements ;
- IDs ;
- relations ;
- Blobs médias ;
- champs inconnus préservés ;
- absence de reset.

Interdit comme « solution de test » :

- supprimer IndexedDB puis constater que la nouvelle version fonctionne.

---

# 5. Accessibilité

Cible : WCAG 2.2 AA sur les parcours essentiels.

## Clavier desktop

Tester :

- navigation ;
- recherche ;
- filtres ;
- Galerie/Liste ;
- fiches ;
- modales ;
- drawers ;
- visionneuse ;
- Atelier ;
- import preview.

Exigences :

- ordre logique ;
- focus visible ;
- focus restauré ;
- Escape lorsque sûr ;
- pas de piège.

## VoiceOver

Smoke réel iPhone/iPad :

- navigation mobile ;
- ouvrir une Créature ;
- bouton icon-only ;
- retour collection ;
- formulaire Atelier ;
- confirmation destructrice ;
- état d'import.

## Zoom/reflow

100, 125, 150, 200 %.

Pas de texte critique inaccessible.

---

# 6. Couleur et sémantique

Tester :

- catégories ;
- rareté ;
- difficulté ;
- warning ;
- danger ;
- sélection.

Toujours texte + couleur + forme/emblème lorsque nécessaire.

---

# 7. Motion

`prefers-reduced-motion` :

- Brouhaha reste compréhensible ;
- révélations restent lisibles ;
- aucune animation indispensable ;
- pas de nausée/flash.

---

# 8. Images

Valider :

- figurines détourées ;
- originaux ;
- thumbnails ;
- images très hautes ;
- images très larges ;
- média absent ;
- dérivé absent ;
- lazy-loading.

Vérifier que :

- l'original n'est jamais recompressé par une simple consultation ;
- aucun fond blanc CSS n'est ajouté sous les détourages ;
- les dimensions évitent les sauts de layout.

---

# 9. Gros volumes

Tester au minimum :

- plusieurs centaines de Créatures ;
- dizaines de Donjons ;
- nombreux Héros/niveaux ;
- nombreuses Quêtes ;
- nombreux médias ;
- lore long ;
- noms longs ;
- relations absentes ;
- images absentes.

Virtualisation/pagination uniquement si les mesures l'exigent.

---

# 10. Playwright

Parcours minimum :

1. Accueil -> Codex -> Bestiaire -> fiche -> retour ;
2. recherche/filtres/tri Bestiaire ;
3. Galerie/Liste et persistance ;
4. Donjon -> Voir tout préfiltré -> retour Donjon ;
5. Héros -> N1/N2/N3/N4 -> compétences cumulées ;
6. PNJ -> Quête associée ;
7. recherche globale multi-familles ;
8. Générateur -> rencontre -> éliminer occurrence ;
9. Brouhaha -> niveau -> tirage -> historique ;
10. Quête session -> reroll -> Codex ;
11. Atelier -> modifier -> Enregistrer ;
12. Atelier -> quitter dirty -> modal ;
13. Médias -> détail ;
14. Import -> preview -> confirmation ;
15. navigation téléphone ;
16. tablette collection -> fiche -> retour.

---

# 11. axe

Automatiser :

- noms accessibles ;
- labels ;
- rôles ;
- ARIA ;
- erreurs fréquentes ;
- contrastes détectables.

axe complète, ne remplace pas les tests manuels.

---

# 12. Performance

Objectifs de vigilance :

- CLS <= 0,10 ;
- INP <= 200 ms ;
- LCP <= 2,5 s lorsque pertinent.

Lighthouse indicatif :

- Performance >= 80 ;
- Accessibilité >= 95 ;
- Best Practices >= 90.

Ne pas dégrader la qualité des originaux pour gagner un score.

---

# 13. PWA / Offline

Tester :

- installation ;
- lancement depuis écran d'accueil ;
- première ouverture offline si supportée ;
- réouverture offline ;
- retour multitâche ;
- mise à jour Service Worker ;
- données IndexedDB intactes ;
- ressources UI disponibles.

---

# 14. Architecture distante hors Gate

Ne pas bloquer UI-6 sur :

- Neon ;
- Auth distante ;
- remote_only ;
- sync cloud.

Ces scénarios reviendront avec le futur chantier technique.

Si une fonctionnalité distante existe déjà réellement dans la production au moment de UI-6, elle est alors ajoutée à la matrice sur la base de son implémentation réelle.

---

# 15. Appareils réels

Minimum :

- iPhone ;
- iPad portrait ;
- iPad paysage ;
- desktop étroit ;
- desktop large ;
- Chrome Android smoke.

L'émulation ne remplace pas l'iPad réel pour valider le comportement tablette.

---

# 16. Sévérité

## Bloquant

- perte/risque de perte de données ;
- application inutilisable ;
- migration IndexedDB cassée ;
- parcours critique impossible.

## Majeur

- fonctionnalité fortement dégradée ;
- responsive essentiel faux ;
- accessibilité essentielle cassée ;
- régression visuelle importante non justifiée.

## Mineur

- friction/cosmétique sans impact fonctionnel.

Sortie :

```text
Bloquants : 0
Majeurs   : 0
Mineurs   : documentés
```

---

# 17. Matrice finale

Conserver :

- appareil ;
- viewport/orientation ;
- commit ;
- vue ;
- tactile/clavier ;
- offline ;
- IndexedDB upgrade ;
- images ;
- accessibilité ;
- résultat ;
- anomalies ;
- décision.

---

# 18. Gate UI-6

La V6 peut être proposée en production lorsque :

1. UI-1 à UI-5 sont fermées ;
2. aucune perte de données n'est observée ;
3. upgrade IndexedDB est validé s'il existe ;
4. PWA/offline validés ;
5. responsive téléphone/tablette/desktop validé ;
6. Codex tablette séquentiel ;
7. VoiceOver smoke validé ;
8. clavier desktop validé ;
9. Playwright/axe passent ;
10. V3 reste reconnaissable ;
11. performances acceptables ;
12. Bloquants = 0 ;
13. Majeurs = 0.


---

# 19. Exécution UI-6 — 20/09/2026

## État de la Gate

**AUTOMATISATION VERTE — VALIDATION APPAREILS RÉELS / VOICEOVER RESTANTE**

Commit validé automatiquement :

`507fc64faf3545d5c65016398c79e1734d14aa84`

Workflow :

- `UI-6 final validation` ;
- run GitHub Actions **#33** (`35539924943`) ;
- résultat : **31/31 tests passés** ;
- aucun test flaky sur le run vert ;
- rapport Playwright conservé en artefact `ui6-playwright-report` (artifact `10614840614`).

## Données / IndexedDB

Validation automatique passée :

- fixture représentative créée en IndexedDB **v1** ;
- ouverture par V6 et upgrade naturel vers **v2** ;
- IDs préservés ;
- relations préservées ;
- propriétés historiques inconnues préservées ;
- Blob original média préservé byte-for-byte ;
- Blob thumbnail préservé byte-for-byte ;
- lecture puis édition d'une Créature ;
- fermeture / réouverture ;
- réouverture offline ;
- export structuré après upgrade ;
- anciens enregistrements incomplets et relations cassées rendus sans réécriture automatique.

Contrôle du code :

- `src/storage/idb.js` a le même blob SHA sur `V5.3` et UI-6 : `33cddaf3823d73aa9de9dff135ffddda4384eed4` ;
- `DB_VERSION = 2` inchangé ;
- aucune utilisation de `deleteDatabase()` ;
- aucune migration UI-6 ajoutée ;
- aucun backend Neon / Supabase / Firebase introduit.

## Responsive automatisé

Matrice Playwright validée :

- téléphone : 320×720, 360×800, 390×844, 430×932 ;
- tablette portrait : 768×1024, 834×1112 ;
- tablette paysage : 1024×768, 1194×834 ;
- desktop étroit : 1280×800 ;
- desktop : 1440×900 ;
- desktop large : 1920×1080.

Validé :

- absence de débordement horizontal critique ;
- navigation téléphone ;
- Codex séquentiel sous le breakpoint desktop master-detail ;
- retour Collection ↔ Fiche ;
- Atelier tablette portrait : liste puis éditeur ;
- Atelier tablette paysage : liste + éditeur selon ses règles propres.

## Parcours critiques Playwright

Les parcours obligatoires de la section 10 sont couverts, notamment :

- Accueil → Codex → Bestiaire → fiche ;
- recherche, filtres, tri, Galerie/Liste et persistance ;
- Donjon → Voir tout préfiltré → retour Donjon ;
- Héros N1/N2/N3/N4 et compétences cumulées ;
- PNJ → Quête associée ;
- recherche globale multi-familles ;
- Générateur → rencontre → élimination d'occurrence ;
- Brouhaha → niveau → tirage → historique ;
- Quête de session → reroll → Codex ;
- Atelier → édition → sauvegarde ;
- Atelier dirty → modale ;
- Médias → détail sans mutation de l'original ;
- Import → preview sans écriture → confirmation ;
- navigation mobile ;
- parcours tablette séquentiel.

## Accessibilité automatisée

Validé :

- axe WCAG 2.2 AA sur Accueil, Bestiaire, fiche Créature, Atelier et Import/Export ;
- focus visible ;
- focus initial des dialogs ;
- boucle Tab / Shift+Tab ;
- Escape lorsque sûr ;
- restauration du focus au déclencheur ;
- noms accessibles des boutons icon-only testés ;
- annonces live Atelier / Import ;
- recherche globale avec sémantique searchbox valide ;
- contrastes Bestiaire, fiche Créature et Atelier corrigés ;
- `prefers-reduced-motion` sans animation longue indispensable.

Le token V6 `--color-text-tertiary` a été ajusté de `#867563` à `#95816D` afin de conserver la même famille visuelle tout en sécurisant le contraste sur les surfaces sombres.

## Zoom / reflow / performance

Validé automatiquement :

- proxy reflow 100 %, 125 %, 150 %, 200 % ;
- gros volumes : centaines de Créatures, dizaines de Donjons, nombreux Héros/niveaux, Quêtes et médias ;
- noms longs ;
- lore long ;
- relations absentes ;
- images absentes ;
- temps d'interaction Bestiaire sous le seuil de vigilance du test ;
- CLS <= 0,10 ;
- LCP <= 2,5 s sur le scénario de vigilance CI.

L'INP navigateur réel reste à observer en mesure terrain ; le test d'interaction synchrone reste sous 200 ms dans le scénario CI.

## PWA / Service Worker / offline

Validé automatiquement :

- cache UI final : `gargottex-v6-rembg-retired-v1` ;
- nom de cache identique dans l'application et le Service Worker ;
- ressources cœur présentes dans le cache ;
- contrôle Service Worker obtenu sans reload parasite au premier enregistrement ;
- `registration.update()` exercé ;
- action UI de mise à jour Service Worker exercée ;
- compteurs IndexedDB identiques avant / après update ;
- réouverture offline après upgrade IndexedDB ;
- données et média historique toujours lisibles offline.

## Dérivés transparents

Le moteur de détourage intégré est retiré. La validation automatique couvre désormais la non-régression des données qu'il a produites :

- un `transparent_blob` existant et approuvé reste prioritaire dans Média et le Codex ;
- les métadonnées historiques `transparent_*` sont conservées ;
- le Blob original et son SHA-256 restent inchangés ;
- l'import manuel d'un PNG transparent reste disponible ;
- le backup ZIP conserve toujours les dérivés transparents ;
- le cache modèle historique `rembg-models` est supprimé séparément sans toucher à la base Gargottex ;
- le code applicatif ne parcourt plus CacheStorage pendant le démarrage ;
- le changement de cache PWA retire l’ancien cache Gargottex, tandis que le Service Worker ne supprime jamais les caches ne portant pas le préfixe `gargottex-`.

La consultation d'un média dans la bibliothèque reste testée comme non mutante pour les originaux.

## Fidélité V3

Le rapport Playwright contient une paire de captures production / référence V3 pour :

- Accueil ;
- Bestiaire ;
- Créature ;
- Donjon ;
- Héros ;
- PNJ ;
- Quête ;
- Loot ;
- Générateur ;
- Brouhaha ;
- Atelier ;
- Médias ;
- Import/Export.

La direction V3 reste reconnaissable :

- hiérarchie sombre bois / laiton ;
- Alegreya + Inter ;
- matières V3 ;
- emblèmes ;
- composition éditoriale ;
- densité et proportions générales.

Les différences acceptées proviennent des données réelles, des états de session et des corrections d'accessibilité.

## Sévérité à l'issue de la validation automatisée

```text
Bloquants automatisés : 0
Majeurs automatisés   : 0
Flaky                  : 0
```

Les défauts de contraste découverts par axe pendant UI-6 ont été corrigés et ne restent pas ouverts.

## Validation réelle encore obligatoire

La Gate UI-6 n'est **pas fermée** tant que les points explicitement matériels des sections 5, 13 et 15 n'ont pas été vérifiés sur appareils réels :

- iPhone réel ;
- iPad réel portrait ;
- iPad réel paysage ;
- VoiceOver smoke réel ;
- installation depuis l'écran d'accueil ;
- lancement de la PWA installée ;
- retour multitâche ;
- réouverture offline de la PWA installée ;
- Chrome Android réel smoke.

Le WebKit Playwright et la matrice de viewports sont des protections complémentaires, mais ne sont volontairement **pas présentés comme substituts** à ces essais.

### Décision actuelle

**STOP validation matérielle uniquement.**

Aucun défaut bloquant ou majeur n'est connu dans la validation automatisée, mais le bilan final « prêt production » ne doit être donné qu'après le smoke réel ci-dessus.
