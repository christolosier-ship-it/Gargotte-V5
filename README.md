<div align="center">
  <img src="./assets/images/berthold.png" alt="Gargottex logo" />

# Gargottex

**Le codex hors ligne de _Gargotte & Va-Nu-Pieds_ pour préparer, enrichir et improviser vos aventures.**

[![Offline first](https://img.shields.io/badge/PWA-Offline--first-6f4a2f?style=flat-square)](./service-worker.js)
[![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?style=flat-square&logo=javascript&logoColor=000)](./src/app.js)
[![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-4b3628?style=flat-square)](./src/storage/idb.js)
[![Cible Google Drive](https://img.shields.io/badge/Cible-Google_Drive-4285F4?style=flat-square)](./docs/REFACTORISATION-V6-LOCAL-FIRST-GOOGLE-DRIVE.md)

[Présentation](#présentation) · [Fonctionnalités](#fonctionnalités) · [Démarrage](#démarrage-rapide) · [Architecture](#architecture)

</div>

## Présentation

Gargottex est une application web autonome conçue pour accompagner les parties de **Gargotte & Va-Nu-Pieds**. Elle centralise le contenu du jeu, aide à préparer les donjons et permet d’improviser rapidement créatures, quêtes, objets et effets de Brouhaha pendant une session.

L’application fonctionne dans le navigateur et enregistre immédiatement les modifications dans IndexedDB.

**Cible V6 retenue : IndexedDB + Google Drive + GitHub Pages.** La synchronisation Drive reste à implémenter. Le code de cette branche hérite encore du chantier Neon ; aucune migration Drive ni gate Drive n'est validée.

Voir le [plan Google Drive](./docs/REFACTORISATION-V6-LOCAL-FIRST-GOOGLE-DRIVE.md), [l'état d'exécution](./docs/V6-ETAT-EXECUTION.md), [la synchronisation](./docs/V6-MEDIA-SYNCHRONISATION.md) et [la migration/configuration](./docs/V6-MIGRATION-CONFIGURATION.md). Les validations Neon restent des preuves historiques dans [l'archive](./docs/archive/neon/V6-ETAT-EXECUTION.md). La refonte UI/UX parallèle n'est pas concernée.

> [!NOTE]
> Gargottex est un outil de préparation et d’assistance au meneur de jeu. Il ne remplace pas les règles officielles ni l’arbitrage de la table.

## Fonctionnalités

- **Codex complet** pour consulter donjons, créatures, héros, PNJ, quêtes, loot, objets interactifs et effets de Brouhaha.
- **Atelier d’édition** pour créer, modifier et supprimer les entrées du codex.
- **Générateur de rencontres** basé sur le donjon, l’étage, le budget de menace et les options boss ou mini-boss.
- **Module Brouhaha** avec niveau de 0 à 12, tirage d’effets et historique de session.
- **Génération de quêtes** à partir des donjons, PNJ et récompenses disponibles.
- **Recherche globale** dans les principales entités du jeu.
- **Galerie de médias** avec images liées aux fiches du codex.
- **Import et export CSV/XLSX** à partir de modèles fournis dans le dépôt.
- **Sauvegarde et restauration** des données locales, médias compris.
- **Journal technique** pour suivre les imports, erreurs et opérations importantes.
- **PWA installable** et utilisable hors ligne après le premier chargement.
- Interface responsive adaptée à l’ordinateur, la tablette et au téléphone.

## Contenu géré

| Entité | Exemples de données |
| --- | --- |
| Donjons | description, budgets d’étages, boss, tags, illustration |
| Créatures | catégorie, menace, PV, ATK, DEF, actions, IA, lore et loot |
| Héros | niveaux, rôle, statistiques, compétence et Brouhaha |
| PNJ | race, ton, rôle et histoire |
| Quêtes | objectif, difficulté, donneur, donjon et récompense |
| Loot | type, effet, valeur en or et créature associée |
| Objets interactifs | PV, actions possibles, effets et donjon associé |
| Brouhaha | niveau, contexte universel ou donjon, texte de l’effet |
| Médias | fichier, chemin, type MIME et entité associée |

## Démarrage rapide

Node.js 24 est utilisé en CI. Le build actuel regroupe encore le SDK Neon et prépare le cache PWA ; il n'implémente pas Google Drive. Sans URL Neon configurée, le build local fonctionne en mode local. La procédure cible et les adaptations nécessaires sont décrites dans le guide de configuration.

```bash
git clone https://github.com/christolosier-ship-it/Gargotte-V5.git
cd Gargotte-V5
npm ci
npm test
npm run build
python3 -m http.server 8080 --directory dist
```

Ouvrez ensuite `http://localhost:8080`.

> [!IMPORTANT]
> Utilisez un serveur HTTP local. L’ouverture directe de `index.html` avec le protocole `file://` peut empêcher le fonctionnement correct des modules JavaScript, d’IndexedDB et du service worker.

## Utilisation

1. Ouvrez le **Codex** pour consulter les fiches existantes.
2. Utilisez l’**Atelier** pour enrichir ou corriger le contenu.
3. Sélectionnez un donjon et un étage dans le **Générateur** pour composer une rencontre.
4. Faites évoluer le niveau de **Brouhaha** pendant la partie et tirez les effets nécessaires.
5. Générez ou consultez une **quête** lorsque les joueurs réclament soudainement du contenu non prévu, ce qui arrive évidemment toujours.
6. Exportez régulièrement une sauvegarde avant les modifications importantes.

## Import, export et sauvegardes

Gargottex prend en charge les fichiers CSV et XLSX pour les principales catégories du codex. Les modèles prêts à remplir sont disponibles dans `templates/`.

Les en-têtes attendus sont définis directement dans `src/app.js`, notamment pour :

- les donjons ;
- les créatures ;
- les héros ;
- les PNJ ;
- les quêtes ;
- le loot ;
- les objets interactifs ;
- les effets de Brouhaha ;
- les médias.

> [!TIP]
> Conservez les noms de colonnes des modèles. Les relations entre entités sont résolues à partir des identifiants ou des noms, selon le type d’import.

Les sauvegardes complètes peuvent inclure les données structurées et les images stockées localement. L'export ZIP global peut saturer la mémoire d'un iPad ; il n'est pas un prérequis de migration. Privilégier les exports structurés et les futurs transferts médias progressifs. Les exports restent sur l’appareil jusqu’à ce que l’utilisateur les copie ou les partage.

## Installation PWA et mode hors ligne

Le dépôt fournit un manifest, des icônes et un service worker. Après un premier chargement depuis HTTPS ou `localhost`, l’application peut être installée depuis le navigateur.

Le service worker :

- précharge le shell applicatif, les modules, les modèles et les images principales ;
- privilégie le réseau pour les fichiers HTML, CSS, JavaScript et le manifest ;
- utilise le cache en priorité pour les autres ressources ;
- conserve une copie locale des nouvelles ressources chargées ;
- supprime les anciens caches lors de l’activation d’une nouvelle version.

> [!WARNING]
> Les données IndexedDB et le cache du service worker sont indépendants. Effacer les données du site dans le navigateur peut supprimer à la fois le codex personnalisé, les médias et les ressources hors ligne.

## Données et confidentialité

Toutes les informations sont conservées dans la base IndexedDB locale `gargottex-v5-offline`.

La consultation et l'édition locales ne nécessitent pas de compte. La cible Google Drive utilisera une autorisation Google pour les fichiers concernés, avec données et originaux privés, transferts progressifs et contrôle SHA-256. Une reconnexion pourra être nécessaire après expiration de l'autorisation ; les modifications locales resteront conservées.

Le runtime Neon historique de la PR #9 n'est pas encore remplacé. Aucun secret ne doit être placé dans le build, le dépôt ou les exports. Les exports JSON/XLSX structurés restent indépendants du cloud.

## Architecture

```text
Gargotte-V5/
├── assets/
│   └── images/                 # Logo, personnages et illustrations locales
├── src/
│   ├── app.js                  # Interface, navigation et logique métier
│   ├── storage/
│   │   └── idb.js              # Schéma et accès IndexedDB
│   └── utils/
│       ├── common.js           # Chaînes, CSV, identifiants et utilitaires
│       ├── xlsx.js             # Lecture et génération de classeurs XLSX
│       └── zip.js              # Création et lecture des sauvegardes ZIP
├── templates/                  # Modèles CSV et XLSX d’import
├── index.html                  # Point d’entrée de l’application
├── seed-data.js                # Contenu initial injecté au premier lancement
├── styles.css                  # Identité visuelle et responsive design
├── manifest.webmanifest        # Métadonnées d’installation PWA
├── service-worker.js           # Cache offline-first
└── README.md                   # Documentation du projet
```

Le flux de données principal est volontairement direct :

```text
Données initiales ou import
          ↓
Validation et normalisation
          ↓
IndexedDB locale
          ↓
Index en mémoire et interface
          ↓
Édition, génération ou export
```

## Stockage IndexedDB

La base locale contient les magasins suivants :

```text
meta
├── dungeons
├── creatures
├── heroes
├── npcs
├── quests
├── loot_items
├── interactables
├── brouhaha_effects
├── media_assets
└── logs
```

Le code V6 hérité vérifie l'absence de marqueur d'initialisation et de données métier avant d'injecter le seed en mode local. La cible Drive devra aussi empêcher une injection parasite pendant une restauration distante. Les sessions suivantes rechargent les données et préférences depuis IndexedDB. Les stores techniques d'outbox et de synchronisation sont exclus des exports structurés.

## Stack technique

| Technologie | Utilisation |
| --- | --- |
| HTML5 | Structure de l’application et métadonnées PWA |
| CSS3 | Interface, thèmes, cartes et mise en page responsive |
| JavaScript ES Modules | Logique métier et séparation des utilitaires |
| IndexedDB | Persistance du codex, des médias, de l’état et des journaux |
| Service Worker et Cache API | Installation et fonctionnement hors ligne |
| File, Blob et URL APIs | Import, export et prévisualisation des médias |
| CSV, XLSX et ZIP locaux | Échange de données et sauvegardes complètes |

## Ajouter ou modifier du contenu

### Depuis l’application

L’Atelier est la voie recommandée pour les modifications ponctuelles. Les relations, valeurs numériques, tags et images sont gérés depuis les formulaires correspondants.

### Par import

Pour les ajouts en volume :

1. copiez le modèle CSV ou XLSX adapté depuis `templates/` ;
2. conservez les en-têtes existants ;
3. complétez les lignes ;
4. prévisualisez l’import dans l’application ;
5. contrôlez les relations et les erreurs signalées ;
6. validez l’écriture dans IndexedDB.

### Dans les données initiales

Modifiez `seed-data.js` pour changer le contenu livré lors d’une première installation. Cette modification ne remplace pas automatiquement les données déjà présentes dans IndexedDB.

> [!IMPORTANT]
> Pour tester un nouveau jeu de données initiales, utilisez un profil de navigateur vierge sans effacer l’installation actuelle.

## Déploiement sur GitHub Pages

L'adresse actuelle est https://christolosier-ship-it.github.io/Gargotte-V5/. La cible conserve cette adresse et prévoit la publication du build statique dist/ via GitHub Actions, après validation des trois gates Drive.

Le build actuel et sa configuration Neon/Vercel doivent d'abord être adaptés. Ne pas publier cette branche comme une version Drive déjà fonctionnelle. Voir la [procédure cible](./docs/V6-MIGRATION-CONFIGURATION.md).

## État des versions

La branche par défaut est actuellement nommée `V5.3`. Plusieurs identifiants de version existent également dans le code, le manifest et le cache du service worker. Lors d’une livraison, pensez à les synchroniser afin d’éviter les caches fantômes, ces petits gobelins numériques qui adorent servir un ancien fichier au pire moment.
