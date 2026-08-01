<div align="center">
  <img src="./assets/images/Berthold.png" alt="Gargottex logo" width="112" height="112" />

# Gargottex

**Le codex hors ligne de _Gargotte & Va-Nu-Pieds_ pour préparer, enrichir et improviser vos aventures.**

[![Offline first](https://img.shields.io/badge/PWA-Offline--first-6f4a2f?style=flat-square)](./service-worker.js)
[![Vanilla JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?style=flat-square&logo=javascript&logoColor=000)](./src/app.js)
[![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-4b3628?style=flat-square)](./src/storage/idb.js)
[![No backend](https://img.shields.io/badge/Backend-None-2f7d32?style=flat-square)](#données-et-confidentialité)

[Présentation](#présentation) · [Fonctionnalités](#fonctionnalités) · [Démarrage](#démarrage-rapide) · [Architecture](#architecture)

</div>

## Présentation

Gargottex est une application web autonome conçue pour accompagner les parties de **Gargotte & Va-Nu-Pieds**. Elle centralise le contenu du jeu, aide à préparer les donjons et permet d’improviser rapidement créatures, quêtes, objets et effets de Brouhaha pendant une session.

L’application fonctionne entièrement dans le navigateur. Les données, images et préférences sont conservées localement dans IndexedDB, sans compte, sans API distante et sans backend.

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

Aucune installation npm ni étape de compilation n’est nécessaire.

```bash
git clone https://github.com/christolosier-ship-it/Gargotte-V5.git
cd Gargotte-V5
python3 -m http.server 8080
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

Les sauvegardes complètes peuvent inclure les données structurées et les images stockées localement. Les exports restent sur l’appareil jusqu’à ce que l’utilisateur les copie ou les partage.

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

Le projet ne nécessite :

- aucun compte utilisateur ;
- aucune clé API ;
- aucun serveur applicatif ;
- aucun service cloud ;
- aucun suivi analytique pour fonctionner.

Les données ne quittent pas le navigateur sauf lors d’un export ou d’un partage déclenché par l’utilisateur.

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

Les données initiales ne sont injectées que lorsque le magasin des donjons est vide. Les sessions suivantes rechargent les données et l’état de l’interface depuis IndexedDB.

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
> Pour tester un nouveau jeu de données initiales, utilisez un profil de navigateur vierge ou effacez explicitement les données du site après avoir exporté toute progression utile.

## Déploiement sur GitHub Pages

Le projet peut être publié directement comme site statique :

1. ouvrez **Settings** → **Pages** dans le dépôt ;
2. choisissez **Deploy from a branch** ;
3. sélectionnez la branche de publication et le dossier `/root` ;
4. enregistrez la configuration ;
5. ouvrez une première fois l’URL en ligne pour initialiser IndexedDB et le cache.

Tous les chemins applicatifs sont relatifs et aucune variable d’environnement n’est requise.

## État des versions

La branche par défaut est actuellement nommée `V5.3`. Plusieurs identifiants de version existent également dans le code, le manifest et le cache du service worker. Lors d’une livraison, pensez à les synchroniser afin d’éviter les caches fantômes, ces petits gobelins numériques qui adorent servir un ancien fichier au pire moment.
