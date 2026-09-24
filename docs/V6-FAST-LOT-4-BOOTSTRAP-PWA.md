# V6-Fast Lot 4 — Bootstrap, PWA et modules

## Objectif
Alléger le reste du chemin critique de démarrage après stabilisation du runtime média.

## Préconditions
- Lire docs/V6-FAST.md.
- Lots 1 à 3 validés.
- Mesurer à nouveau le démarrage avant de modifier le bootstrap.

## Travaux

### 1. Rendre l'application prête plus tôt
Le marqueur de disponibilité UI ne doit pas attendre des opérations secondaires.

Séparer :
- ouverture IndexedDB minimale ;
- chargement des données métier nécessaires ;
- restauration UI ;
- premier rendu ;
des tâches non critiques.

### 2. Diagnostic différé
collectLocalDiagnostic ne doit plus bloquer le bootstrap.

Le diagnostic complet est calculé :
- à l'ouverture de sa vue ;
- à la demande ;
- ou après le premier rendu en tâche opportuniste si utile.

Le comptage de tous les stores n'est pas une condition pour afficher l'accueil.

### 3. Logs bornés côté IndexedDB
getLogs(limit) ne doit pas faire getAll puis trier toute la table.

Utiliser l'index created_at et un curseur inverse limité.

### 4. Service Worker
Revoir la stratégie de l'app-shell.

Objectif :
- démarrage immédiat depuis un cache valide lorsque disponible ;
- vérification/mise à jour réseau sans bloquer inutilement l'interface ;
- mise à jour de version toujours maîtrisée ;
- offline conservé.

Éviter le network-first avec cache no-store pour les ressources de l'app-shell si cela retarde le lancement sans bénéfice.

Tester explicitement :
- premier chargement ;
- rechargement avec cache ;
- offline ;
- nouvelle version du Service Worker ;
- données IndexedDB intactes.

### 5. seed-data conditionnel
seed-data.js ne doit pas être chargé/parsé à chaque ouverture d'une base déjà initialisée.

Le charger uniquement lorsqu'une initialisation réelle est nécessaire.

Préserver exactement le comportement de première installation.

### 6. Chargement des modules lourds
Les fonctions spécialisées qui ne servent pas au démarrage doivent pouvoir être chargées à la demande.

Candidats prioritaires :
- XLSX ;
- ZIP / backup ;
- outils import/export ;
- autres modules lourds identifiés par mesure.

Ne pas découper app.js uniquement pour obtenir un nombre de fichiers plus élégant. Le découpage doit réduire le travail réellement effectué au démarrage.

### 7. Éviter le deuxième rendu de bootstrap
Vérifier les render successifs du démarrage.

Le premier affichage stable ne doit pas être immédiatement détruit/recréé pour une information secondaire comme le diagnostic.

### 8. Validation
Mesurer avant/après :
- temps jusqu'au marqueur ready ;
- nombre de ressources JS nécessaires au premier écran ;
- nombre de rendus globaux au bootstrap ;
- comportement cached/offline.

Les mesures CI servent à comparer les versions. Ne pas ajouter de seuil flaky dépendant du runner.

## Gate
Le lot est validé si :
- le diagnostic ne bloque plus le premier rendu ;
- les logs sont lus avec limite réelle ;
- l'app-shell démarre efficacement depuis le cache ;
- seed-data n'est plus systématique ;
- les modules lourds hors écran sont différés lorsqu'utile ;
- le bootstrap ne fait plus de rendu global immédiatement redondant ;
- offline et update PWA restent fiables ;
- IndexedDB reste intact ;
- Fast CI et Full ciblée passent.

## Clôture
Lorsque cette Gate est franchie, mettre à jour docs/V6-FAST.md avec le bilan réel du chantier et marquer V6-Fast clos.
