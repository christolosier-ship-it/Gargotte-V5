# V6-Fast Lot 1 — CI légère et fermeture UI-6

## Statut

**CLOS — Gate validée le 24/09/2026.**

## Objectif
Remplacer la recette finale UI-6 par une validation V6-Fast adaptée aux risques actuels.

Ce lot ne modifie pas le comportement de production.

## Préconditions
- Lire docs/V6-FAST.md.
- UI-6 est considéré comme clos.
- Ne pas utiliser la maquette V3 comme oracle de validation.

## Travaux

### 1. Retirer la validation visuelle V3 active
Le test de comparaison production / maquette V3 n'est plus utile.

À retirer de la CI active :
- le pack de captures V3 ;
- visual.spec.mjs si son seul rôle est la comparaison historique ;
- toute génération d'artefacts liée uniquement à cette comparaison.

L'historique reste disponible dans Git. Il n'est pas nécessaire de conserver une copie active du test.

### 2. Remplacer le workflow UI-6
Le workflow nommé UI-6 final validation ne doit plus être la CI quotidienne.

Créer une organisation V6-Fast avec deux niveaux :

#### Fast
Déclenchée sur les pull requests vers V5.3.

Objectif : environ 10 à 12 scénarios utiles, Chromium uniquement sauf justification technique forte.

Conserver en priorité :
- bootstrap et navigation principale ;
- Codex recherche/filtres/persistance ;
- un parcours cross-family représentatif ;
- un parcours de session ;
- Atelier sauvegarde + dirty guard ;
- Import preview sans écriture puis confirmation ;
- règles média actives ;
- garde-fou de données représentatif ;
- accessibilité sur quelques surfaces essentielles ;
- un contrôle responsive représentatif.

Ne pas recopier mécaniquement les 28 tests UI-6.

#### Full
Workflow manuel ou lancé explicitement avant une livraison sensible.

Y placer les contrôles plus coûteux :
- migration IndexedDB historique complète ;
- PWA/offline approfondi ;
- axe étendu ;
- responsive étendu ;
- WebKit iPad ;
- stress média avec vrais Blobs ;
- tests de compatibilité qui ne justifient pas une exécution sur chaque petite PR.

La Full n'inclut pas le comparatif V3.

### 3. Remplacer les tests historiques trop fragiles
Retirer de la CI Fast les assertions dont la valeur est essentiellement cosmétique ou historique, par exemple :
- égalités de hauteur à quelques pixels près ;
- comptage décoratif d'éléments d'animation ;
- vérification de textes supprimés lors d'une ancienne étape UI ;
- comparaison exacte de géométrie sans conséquence fonctionnelle.

Une régression de layout importante reste testée par :
- absence de débordement ;
- visibilité des éléments critiques ;
- navigation ;
- structure responsive attendue.

### 4. Consolider responsive et reflow
Les tests responsive matrix, zoom/reflow et reflow critical interactions se recouvrent.

Créer une couverture plus compacte :
- téléphone représentatif ;
- iPad portrait ou paysage représentatif ;
- desktop représentatif ;
- un contrôle de reflow étroit.

La Fast ne doit pas refaire toutes les tailles déjà validées pendant UI-6.

### 5. WebKit orienté usage réel
Le smoke WebKit coûte cher à installer.

Le retirer de la Fast et le conserver dans la Full avec un viewport iPad représentatif.

Scénario recommandé :
- ouvrir l'application ;
- Codex ;
- Médias ;
- scroller ;
- ouvrir/fermer plusieurs visuels ;
- retour collection ;
- vérifier absence de débordement et erreur bloquante.

### 6. Refaire le stress média
Le test actuel de gros volume crée des media_assets sans Blob. Il ne reproduit pas le problème réel.

Préparer une fixture générant des images synthétiques avec alpha et de vraies tailles de Blob.

Les invariants précis de mémoire et de cycle de vie seront ajoutés progressivement aux Lots 2 et 3.

### 7. Outillage CI
- générer et versionner package-lock.json ;
- utiliser npm ci ;
- éviter l'upload d'un gros rapport Playwright quand tout est vert ;
- conserver captures/traces détaillées sur échec ;
- supprimer les constantes et helpers de test morts.

Ne pas ajouter un test qui échoue simplement parce que le runner GitHub a été lent.
Les durées de workflow sont des indicateurs de vigilance, pas des assertions fonctionnelles.

## Résultat attendu
La Fast doit fournir un retour rapide sur une PR courante tout en gardant les risques lourds dans la Full.

Ordre de grandeur recherché :
- exécution Playwright Fast sensiblement sous la minute actuelle ;
- réduction forte du temps et du volume d'artefacts ;
- aucune comparaison V3.

Ce sont des objectifs d'ingénierie, pas des seuils d'échec rigides.

## Gate
Le lot est validé si :
- UI-6 n'est plus le workflow quotidien ;
- aucun test visuel V3 ne tourne automatiquement ;
- Fast et Full ont des rôles distincts ;
- la Fast protège données, navigation, Atelier, import et média sans recette historique inutile ;
- la Full conserve les scénarios coûteux réellement utiles ;
- la CI est verte et plus légère ;
- aucun code de production n'a été modifié pour faire passer les tests.


## Bilan d'exécution — 24/09/2026

### CI active
La recette UI-6 a été remplacée par :
- `V6-Fast CI` sur chaque PR vers `V5.3` ;
- `V6-Fast full validation` pour les changements lourds et le déclenchement manuel.

### Fast
- 11 scénarios Chromium ;
- run #3 : **11/11 passés** ;
- durée Playwright : **32,6 s** ;
- aucun retry ;
- aucun artefact lourd produit sur succès.

Le temps Playwright de la CI quotidienne est donc environ divisé par deux par rapport à l'ancienne suite UI-6 d'environ une minute.

### Full
- 21 scénarios au total ;
- Chromium + WebKit iPad ;
- run #3 : **21/21 passés** ;
- durée Playwright : **59,1 s** ;
- aucun retry final ;
- aucun artefact d'échec produit.

La Full couvre notamment :
- migration IndexedDB historique ;
- PWA / Service Worker ;
- responsive étendu ;
- accessibilité étendue ;
- 48 vrais Blobs PNG transparents 768×768 sous Chromium ;
- ouvertures/fermetures plein écran répétées ;
- smoke Média WebKit au format iPad.

### Limite WebKit CI documentée
Playwright WebKit sous Linux échoue lorsqu'un test tente d'écrire artificiellement un Blob dans IndexedDB avec :

`UnknownError: Error preparing Blob/File data to be stored in object store`

Ce comportement appartient à l'environnement WebKit Playwright utilisé par GitHub Actions. Il intervient pendant la création du fixture, avant le parcours applicatif.

Décision :
- le stress avec vrais Blobs IndexedDB reste couvert sous Chromium ;
- WebKit iPad utilise un média seedé existant pour tester la navigation Média et le viewer ;
- un smoke réel iPad reste la référence matérielle pour le chemin Blob IndexedDB sur Safari/iPadOS.

### Nettoyage réalisé
Retirés de la CI active :
- workflow `UI-6 final validation` ;
- workflow de génération du cahier V3 ;
- comparatif visuel V3 ;
- assertions historiques/cosmétiques UI-6 ;
- anciens tests `tests/ui6`.

### Outillage
- `package-lock.json` versionné ;
- dépendances Playwright/axe épinglées ;
- `npm ci` validé dans Fast et Full ;
- Fast installe uniquement Chromium ;
- rapports détaillés uniquement sur échec.

## Gate — résultat

- UI-6 n'est plus le workflow quotidien : **OK**
- aucun comparatif visuel V3 automatique : **OK**
- Fast / Full distinctes : **OK**
- Fast centrée sur les risques actuels : **OK**
- Full conserve les contrôles lourds utiles : **OK**
- CI verte : **OK**
- aucun code de production modifié pour faire passer les tests : **OK**

**Lot 1 validé.**
