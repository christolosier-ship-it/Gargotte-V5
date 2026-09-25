> **ARCHIVE — chantier V6-Fast clos et fusionné dans V5.3 le 25/09/2026.**
>
> Historique technique uniquement. Ce document n'est plus normatif pour les travaux courants.

# V6-Fast Lot 4 — Bootstrap, PWA et modules

## Statut
CLOS SUR PR #39 — Gate automatisée validée le 25/09/2026.

## Objectif
Alléger le reste du chemin critique de démarrage après stabilisation du runtime média.

## Préconditions
- Lire docs/archive/v6-fast/V6-FAST.md.
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

## Résultat d'exécution

### Bootstrap
- `gargottexReady` est posé immédiatement après le premier rendu stable.
- Première installation et redémarrage chaud : 1 seul `render()` global jusqu'à `ready`.
- Logs, enregistrement Service Worker, persistance stockage et retrait du modèle rembg historique sont exécutés après le premier rendu.
- Le diagnostic complet n'est plus une condition d'affichage de l'accueil.

### Diagnostic
- calcul à l'ouverture d'Import / Export ou à la demande ;
- mise à jour dans un root local `data-diagnostic-panel` ;
- aucune reconstruction globale du formulaire Import / Export lors du retour du diagnostic.

Cette isolation a supprimé une course réelle détectée par la Fast CI entre la sélection d'un fichier d'import et le rendu asynchrone du diagnostic.

### IndexedDB et seed
- `initDatabase()` détecte une base vide avant de demander le seed ;
- `seed-data.js` a été retiré du HTML initial ;
- première installation : seed chargé une fois puis comportement métier identique ;
- base existante : seed non chargé et non parsé.

### Logs
L'implémentation présente sur V5.3 utilisait déjà l'index `created_at`, un curseur `prev` et un arrêt à `limit`. Aucun refactor artificiel n'a été ajouté.

Un test Full remplit volontairement la table et vérifie que `getLogs(7)` renvoie exactement les 7 entrées les plus récentes, dans l'ordre attendu.

### Modules XLSX et ZIP
- suppression des imports statiques XLSX / ZIP de `src/app.js` ;
- import dynamique XLSX à la première action XLSX ;
- import dynamique ZIP à la première sauvegarde ZIP ;
- modules toujours précachés par la PWA afin de rester disponibles hors ligne ;
- test offline : présence cache + `import()` dynamique fonctionnel sans réseau.

La Gate a également révélé un bug latent antérieur : `exportEntityFile()` utilisait `ENTITY_DOWNLOAD_FILES` sans définition. La table de noms de fichiers XLSX a été restaurée explicitement.

### Service Worker
- cache versionné : `gargottex-v6-fast-bootstrap-v1` ;
- suppression du network-first `cache: no-store` pour l'app-shell ;
- réponse immédiate du cache valide ;
- revalidation réseau en arrière-plan ;
- fallback navigation vers `index.html` hors ligne ;
- IndexedDB non modifié par les mises à jour Service Worker.

### Mesures finales CI
Run final du 25/09/2026 :
- Fast : 13/13, 39,4 s ;
- Full Chromium + WebKit iPad : 24/24, 1,2 min ;
- cold ready : ~87,1 ms ;
- warm ready : ~51,9 ms ;
- cold render calls : 1 ;
- warm render calls : 1 ;
- redémarrage chaud avant `ready` : 0 seed, 0 diagnostic, 0 XLSX, 0 ZIP ;
- Full : migration IndexedDB, export/reopen/offline, Service Worker update, stress Média et smoke WebKit iPad verts.

Les temps `ready` sont indicatifs et propres au runner CI. Aucun seuil timing dépendant du runner n'est utilisé comme Gate.

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
Gate franchie le 25/09/2026. `docs/archive/v6-fast/V6-FAST.md` est mis à jour avec le bilan réel. V6-Fast est clos ; la PR #39 a été fusionnée dans V5.3 le 25/09/2026.
