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
