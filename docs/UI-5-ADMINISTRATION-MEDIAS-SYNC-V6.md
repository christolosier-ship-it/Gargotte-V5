# Gargottex V6 — UI-5 Administration, Médias & Synchronisation

## Statut

**VERROUILLÉ — architecture fonctionnelle et responsive de l’Atelier, des Médias, des Imports/Exports, du Journal/diagnostics et des états de synchronisation**

Ce document complète :

- `docs/REFONTE-UI-UX-V6.md` ;
- `docs/UI-1-DESIGN-SYSTEM-V6.md` ;
- `docs/UI-2-BESTIAIRE-FICHE-CREATURE-V6.md` ;
- `docs/UI-3-CODEX-AUTRES-ENTITES-V6.md` ;
- `docs/UI-4-OUTILS-DE-PARTIE-V6.md` ;
- `docs/REFACTORISATION-V6-LOCAL-FIRST-NEON.md`.

UI-5 traite les zones les plus sensibles de Gargottex :

- Atelier ;
- Médias ;
- Import / Export ;
- synchronisation locale / Neon ;
- Journal et diagnostics.

Principe directeur :

> **Toute action d’administration doit être compréhensible, réversible autant que possible et impossible à confondre avec une simple consultation.**

UI-5 ne change pas les règles métier. Il met en forme les opérations déjà prévues par la V6 technique.

---

# 1. Objectifs UI-5

UI-5 doit permettre de :

- créer et modifier les données métier sans ambiguïté ;
- distinguer clairement une modification non enregistrée d’une donnée enregistrée localement ;
- distinguer clairement une donnée locale d’une donnée synchronisée avec Neon ;
- rendre la suppression volontaire et explicite ;
- administrer les médias sans jamais dégrader l’original ;
- comprendre si un original est présent localement, sauvegardé dans Neon, ou les deux ;
- importer en masse sans écriture aveugle ;
- exporter les données structurées indépendamment du cloud ;
- diagnostiquer les problèmes sans exposer de secrets ;
- rester pleinement utilisable offline pour les fonctions locales.

---

# 2. Décisions verrouillées

Les décisions suivantes sont actées :

1. L’Atelier utilise un bouton **Enregistrer** explicite.
2. Il n’existe pas d’auto-save à chaque frappe.
3. Quitter une fiche modifiée sans enregistrer déclenche un avertissement.
4. Sur téléphone, l’action Enregistrer reste disponible dans une barre fixe ou sticky en bas de l’écran.
5. La suppression n’est jamais déclenchée directement depuis une carte ou ligne de collection.
6. La suppression vit dans une zone **Danger** distincte de l’édition normale.
7. Médias propose au minimum les filtres `Tous / Liés / Orphelins`.
8. Le statut de présence média doit distinguer explicitement local et distant.
9. Tout import massif passe par une preview avant écriture.
10. La preview d’import expose lignes valides, avertissements et erreurs.
11. JSON structuré, XLSX et médias sont présentés comme mécanismes distincts.
12. Un indicateur de synchronisation permanent et discret existe dans la topbar.
13. L’interface distingue toujours `Enregistré localement` de `Synchronisé avec Neon`.
14. Une erreur Neon ne bloque jamais l’édition locale.
15. Une action manuelle `Réessayer` est disponible lorsque la synchronisation distante échoue.
16. Le Journal reste un drawer / outil secondaire, pas une vue principale de navigation.
17. Le Journal présente d’abord un diagnostic synthétique, puis les logs techniques.
18. Une action `Copier / Exporter le diagnostic` est disponible.
19. `Vider le journal` demande confirmation et ne touche jamais aux données métier.
20. Aucun second backend média n’est introduit : les originaux sont sauvegardés dans Neon Postgres selon la V6 technique.

Décision média complémentaire non négociable :

> **L’original n’est jamais recompressé, redimensionné ou converti. La copie distante doit être bit-identique et vérifiée par SHA-256.**

---

# 3. Grammaire générale de l’administration

Les écrans d’administration sont volontairement plus fonctionnels que le Codex.

Ils réutilisent UI-1 :

- palette sombre ;
- Inter comme police dominante ;
- Alegreya seulement pour quelques titres ;
- bordures plus importantes que les textures ;
- cibles tactiles d’environ 44 px ;
- focus clavier visible ;
- aucun fonctionnement dépendant du hover.

Les textures narratives sont limitées. Un formulaire ne doit jamais donner l’impression d’être imprimé sur un vieux parchemin graisseux.

---

# 4. Atelier — architecture générale

## 4.1 Rôle

L’Atelier est **la zone d’édition des données métier**.

Le Codex reste une expérience de consultation.

L’Atelier couvre les familles éditables :

- Donjons ;
- Créatures ;
- Héros ;
- PNJ ;
- Quêtes ;
- Loot ;
- Objets du décor ;
- Brouhaha.

Les médias disposent de leur vue de gestion dédiée.

## 4.2 Desktop

Structure cible :

```text
Sidebar application
│
└── Atelier
    ├── sélection type d’entité
    ├── collection / recherche / filtres
    └── formulaire de l’entité sélectionnée
```

Composition principale :

```text
Collection 30–35 % | Formulaire 65–70 %
```

La collection et le formulaire peuvent scroller indépendamment lorsque cela améliore l’usage.

## 4.3 Tablette paysage

```text
Rail | collection compacte | formulaire
```

Priorité aux champs et à la sauvegarde.

## 4.4 Tablette portrait

La collection peut devenir un drawer.

Le formulaire reste la zone principale.

## 4.5 Téléphone

Navigation séquentielle :

```text
Liste des entités
↓
Fiche d’édition plein écran
↓
barre Enregistrer sticky
```

Aucun long formulaire ne doit être comprimé à côté d’une liste miniature.

---

# 5. Atelier — état d’édition

## 5.1 États de fiche

Une fiche d’édition doit distinguer :

- propre / non modifiée ;
- modifiée non enregistrée ;
- enregistrement local en cours ;
- enregistrée localement ;
- synchronisation distante en attente ;
- synchronisation distante en cours ;
- synchronisée ;
- erreur de synchronisation.

## 5.2 Indication de modification

Dès qu’un champ diffère de l’état chargé :

```text
Modifications non enregistrées
```

Le bouton Enregistrer devient actif.

L’indication ne dépend pas uniquement d’une couleur.

## 5.3 Enregistrer

Flux :

```text
[ Enregistrer ]
      ↓
validation
      ↓
IndexedDB
      ↓
UI mise à jour
      ↓
Enregistré localement ✓
      ↓
outbox
      ↓
Neon
```

Ne jamais afficher `Synchronisé` tant que Neon n’a pas confirmé.

## 5.4 Sortie avec modifications non enregistrées

Si l’utilisateur quitte la fiche, change d’entité ou ferme l’éditeur avec des modifications non enregistrées :

```text
Modifications non enregistrées

Enregistrer avant de quitter ?

[ Rester ] [ Quitter sans enregistrer ] [ Enregistrer ]
```

---

# 6. Organisation des formulaires

Le formulaire suit la hiérarchie métier de la fiche Codex correspondante.

Exemple Créature :

```text
Identité
├── Nom
├── Donjon
├── Catégorie
├── Menace
└── Socle

Gameplay
├── PV
├── ATK
├── DEF
├── Portée / Zone
└── Actions

Capacité signature
IA / comportement
Loot
Lore
Médias liés
Métadonnées / Tags
```

Les sections longues peuvent être repliables sur téléphone mais pas au point de cacher les champs essentiels.

---

# 7. Création d’une entité

Action :

```text
+ Nouvelle créature
+ Nouveau donjon
...
```

Une création ouvre une vraie fiche d’édition, pas une petite modal contenant la moitié du modèle.

Tant qu’elle n’est pas enregistrée, la nouvelle fiche reste un brouillon UI.

Après Enregistrer :

- écriture locale ;
- attribution de l’identifiant selon l’architecture existante ;
- ajout à l’outbox ;
- synchronisation distante ultérieure.

---

# 8. Suppression

## 8.1 Accès

La suppression n’est pas proposée dans la collection principale.

Elle se trouve dans une section :

```text
ZONE DANGER
```

## 8.2 Confirmation

Exemple :

```text
Supprimer « Gobeline Turbo-Coude » ?

Cette suppression sera enregistrée localement puis synchronisée.
Les relations existantes peuvent être affectées.

[ Annuler ] [ Supprimer ]
```

Si les impacts peuvent être calculés depuis le modèle existant, les afficher avant confirmation.

Ne pas inventer une cascade métier implicite.

## 8.3 Offline

Une suppression hors ligne :

- est appliquée localement ;
- crée l’opération de synchronisation ;
- reste en attente jusqu’au retour réseau.

---

# 9. Médias — rôle UI-5

La vue Médias est la **bibliothèque et le centre de sauvegarde des illustrations**.

Elle doit rendre visibles trois concepts distincts :

1. relation du média à une entité ;
2. présence de l’original sur l’appareil ;
3. sauvegarde de l’original dans Neon.

Aucune opération UI ne doit laisser penser qu’une miniature est l’original.

---

# 10. Médias — qualité et intégrité

## 10.1 Original

L’original est le fichier maître.

Il conserve :

- octets originaux ;
- format d’origine ;
- dimensions d’origine ;
- qualité d’origine ;
- nom / MIME ;
- taille ;
- SHA-256.

## 10.2 Miniature

La miniature est un dérivé d’interface.

Elle peut être :

- générée localement ;
- mise en cache ;
- téléchargée séparément ;
- supprimée ;
- régénérée.

Sa disparition n’est jamais une perte de média.

## 10.3 Terminologie UI

Ne jamais employer `Optimisé` si cela pourrait laisser croire que l’original a été remplacé.

Préférer :

```text
Original
Miniature
Aperçu
```

---

# 11. États média

L’interface traduit les états techniques V6 en libellés compréhensibles.

| État technique | Libellé UI |
|---|---|
| `local_only` | **Sur cet appareil uniquement** |
| `uploading` | **Sauvegarde en cours** |
| `local_remote_verified` | **Local + sauvegardé et vérifié** |
| `remote_only` | **Sauvegardé dans Neon · non téléchargé ici** |
| `downloading` | **Téléchargement en cours** |
| `sync_error` | **Erreur de sauvegarde** |
| `missing` | **Original indisponible** |

Le statut critique est visible sur la carte Média et dans le détail.

## 11.1 Statut vérifié

Le libellé fort :

```text
Original sauvegardé et vérifié ✓
```

n’est affiché qu’après correspondance SHA-256.

---

# 12. Vue Médias

## 12.1 En-tête

```text
MÉDIAS

[ Ajouter ] [ Rechercher... ]
```

## 12.2 Filtres

Minimum :

```text
Tous | Liés | Orphelins
```

Puis selon besoin :

- type d’entité ;
- entité liée ;
- MIME ;
- état local/distant ;
- erreur de synchronisation.

## 12.3 Carte média

Contenu :

- miniature / aperçu ;
- label ;
- nom de fichier ;
- entité liée ;
- statut utilisé/orphelin ;
- statut média local/distant ;
- erreur éventuelle.

Le statut de sauvegarde ne doit pas masquer l’image.

---

# 13. Détail Média

Le panneau de détail affiche :

```text
Aperçu
Label
Nom de fichier
Type MIME
Dimensions
Taille
SHA-256 abrégé + action copier si utile
Entité liée
Présence locale
Sauvegarde Neon
Dernière vérification
```

Actions possibles selon état :

- Ouvrir l’original ;
- Télécharger l’original sur cet appareil ;
- Réessayer la sauvegarde ;
- Rattacher à une entité ;
- Détacher ;
- Supprimer.

Aucune action `Compresser` ou `Optimiser l’original` n’existe.

---

# 14. Ajout d’un média

Flux cible :

```text
Choisir fichier
↓
lecture métadonnées
↓
calcul SHA-256
↓
enregistrement original IndexedDB
↓
aperçu immédiat
↓
outbox média
↓
sauvegarde Neon en arrière-plan
↓
vérification SHA-256
```

L’utilisateur ne doit pas attendre Neon pour continuer à utiliser l’application.

Si le réseau est absent :

```text
Sur cet appareil uniquement
Sauvegarde distante en attente
```

---

# 15. Téléchargement d’un média distant

État :

```text
Sauvegardé dans Neon
Non téléchargé sur cet appareil
```

Action :

```text
Télécharger l’original
```

Flux :

1. récupération des chunks / binaire ;
2. reconstitution ;
3. calcul SHA-256 ;
4. comparaison ;
5. écriture IndexedDB ;
6. création/récupération miniature ;
7. statut `Local + sauvegardé et vérifié`.

Une erreur de hash interdit de présenter le fichier comme sain.

---

# 16. Téléchargement en lot et préparation offline

Si la couche technique V6 l’implémente sans risque, la vue Médias peut proposer :

```text
Télécharger les originaux manquants
```

Usage : préparer un iPad ou téléphone pour une session totalement offline.

Avant lancement, afficher :

- nombre de médias ;
- volume estimé ;
- espace local disponible si l’API permet de l’estimer de façon fiable.

Ce mécanisme reste optionnel. Le téléchargement à la demande est suffisant pour UI-5.

---

# 17. Suppression média

La suppression est volontaire et confirmée.

Le détail doit préciser :

- présence locale ;
- présence distante ;
- entité liée ;
- conséquence de suppression.

Ne jamais supprimer la dernière copie saine avant que l’intention de l’utilisateur soit claire.

La logique technique de déduplication éventuelle doit garantir qu’un original encore référencé ailleurs n’est pas supprimé physiquement.

---

# 18. Synchronisation globale

## 18.1 Indicateur Topbar

États minimum :

```text
✓ Synchronisé
↻ Synchronisation…
● Local uniquement / modifications en attente
⌁ Hors ligne
! Erreur de synchronisation
```

Le composant est discret mais toujours accessible.

## 18.2 Détail

Cliquer/toucher le statut ouvre un panneau synthétique :

```text
DONNÉES LOCALES
Enregistrées ✓

NEON
3 opérations structurées en attente
2 médias à sauvegarder
1 média en cours · 46 %
Dernière synchro réussie : 08:17

[ Réessayer ]
```

## 18.3 Principe local-first

Une erreur Neon doit être formulée ainsi :

```text
Vos modifications sont enregistrées sur cet appareil.
La sauvegarde distante n’a pas encore abouti.
```

Éviter les formulations anxiogènes laissant penser que l’édition locale est perdue.

---

# 19. Priorité des états

Le statut global doit synthétiser sans mentir.

Exemple de priorité :

1. erreur locale critique ;
2. erreur de synchronisation ;
3. synchronisation en cours ;
4. opérations en attente ;
5. hors ligne sans opération en attente ;
6. synchronisé.

Un média encore `local_only` signifie que la sauvegarde globale n’est **pas complètement synchronisée**, même si toutes les données structurées sont à jour.

---

# 20. Réessayer la synchronisation

Action disponible uniquement lorsqu’elle est utile.

Elle relance :

- écritures structurées en échec ;
- transferts média interrompus ;
- vérifications nécessaires.

Elle ne duplique pas les opérations déjà confirmées.

Pour un média chunké, reprendre au dernier chunk confirmé lorsque la couche technique le permet.

---

# 21. Import / Export — architecture

La page sépare clairement quatre familles :

```text
1. Sauvegarde structurée JSON
2. XLSX
3. Imports
4. Médias / sauvegarde distante
```

L’utilisateur doit comprendre que :

- JSON ≠ sauvegarde binaire des images ;
- XLSX ≠ sauvegarde des images ;
- Neon sauvegarde les originaux médias séparément.

---

# 22. JSON structuré

Bloc :

```text
SAUVEGARDE DES DONNÉES

Export JSON complet
Donjons, créatures, héros, PNJ, quêtes, loot,
objets du décor, Brouhaha et métadonnées utiles.

Les originaux médias ne sont pas inclus dans ce fichier.
```

L’export reste disponible offline à partir des données locales.

---

# 23. XLSX

Présenter :

- export global si supporté ;
- export par famille ;
- téléchargement de modèles si disponible ;
- import par famille.

Les formats techniques restent cohérents avec les templates existants.

---

# 24. Import — preview obligatoire

Flux :

```text
Sélection fichier
↓
Analyse
↓
PREVIEW
↓
Confirmation
↓
Écriture locale
↓
Synchronisation
```

Exemple :

```text
126 lignes détectées
119 valides
5 avertissements
2 erreurs

[ Annuler ] [ Importer les 119 lignes valides ]
```

La politique exacte sur les lignes invalides doit respecter le comportement métier choisi lors de l’implémentation. L’UI ne doit jamais cacher qu’une partie du fichier sera ignorée.

---

# 25. Preview d’import

Afficher au minimum :

- type d’entité ;
- fichier ;
- total lignes ;
- lignes valides ;
- avertissements ;
- erreurs bloquantes ;
- aperçu de quelques lignes ;
- relations non résolues détectables ;
- effet prévu : création / mise à jour si l’algorithme sait le déterminer de façon fiable.

Aucune écriture IndexedDB ou Neon avant validation utilisateur.

---

# 26. Journal / diagnostics

## 26.1 Accès

Le Journal reste un drawer accessible depuis :

- topbar ;
- menu `Plus` sur téléphone si nécessaire ;
- panneau de synchronisation en cas d’erreur.

Il n’occupe pas une destination principale de navigation.

## 26.2 Résumé diagnostic

Afficher avant les logs :

```text
APPLICATION
Version
Online / Offline
PWA / service worker

LOCAL
IndexedDB : OK / erreur
Outbox structurée : N
Outbox médias : N

NEON
Auth : connecté / non connecté
Dernière synchro
Dernière erreur

MÉDIAS
Originaux locaux : N
Originaux sauvegardés et vérifiés : N
Distants non téléchargés : N
En erreur : N
```

Aucun secret n’est affiché.

---

# 27. Logs techniques

Filtres :

```text
Tous | Info | Avertissements | Erreurs
```

Une entrée affiche :

- date/heure ;
- niveau ;
- sous-système ;
- message ;
- identifiant technique utile si non sensible.

Éviter de journaliser :

- tokens ;
- mots de passe ;
- chaînes de connexion ;
- contenu binaire ;
- données personnelles inutiles.

---

# 28. Copier / Exporter diagnostic

Action :

```text
Copier le diagnostic
```

ou

```text
Exporter le diagnostic
```

Le diagnostic exporté doit privilégier :

- version ;
- navigateur / plateforme si disponible ;
- état local ;
- état sync ;
- compteurs d’outbox ;
- erreurs ;
- journaux utiles.

Il doit exclure les secrets.

---

# 29. Vider le journal

Confirmation :

```text
Vider le journal ?

Cela supprime uniquement les logs techniques locaux.
Les données du Codex et les médias ne seront pas modifiés.

[ Annuler ] [ Vider ]
```

---

# 30. États offline

## Atelier

L’édition fonctionne normalement.

Après Enregistrer :

```text
Enregistré localement ✓
Sauvegarde distante en attente
```

## Médias

Un nouvel original peut être ajouté localement.

Statut :

```text
Sur cet appareil uniquement
```

## Import

Import local autorisé si le fichier est disponible.

## Export

JSON/XLSX local autorisé.

Le réseau n’est pas nécessaire pour ces opérations locales.

---

# 31. États d’erreur

## Erreur locale

Une erreur IndexedDB empêchant l’écriture est prioritaire et clairement bloquante.

Ne jamais afficher `Enregistré` si l’écriture locale a échoué.

## Erreur Neon

Non bloquante pour l’édition locale.

## Erreur média distante

L’original local sain reste la référence de travail.

Message :

```text
Original conservé sur cet appareil.
La sauvegarde distante a échoué.
[ Réessayer ]
```

## Hash invalide

Message fort :

```text
La copie distante ne correspond pas à l’original local.
L’original local n’a pas été supprimé.
```

Ne pas marquer le média comme sauvegardé.

---

# 32. Responsive UI-5

## Desktop

- Atelier : collection + formulaire ;
- Médias : galerie + panneau détail ;
- Import/Export : sections verticales ou deux colonnes contrôlées ;
- Journal : drawer latéral.

## Tablette paysage

- Atelier : master-detail compact ;
- Médias : galerie avec panneau / drawer ;
- contrôles tactiles généreux.

## Tablette portrait

- formulaire prioritaire ;
- collections et détails secondaires en drawer ;
- import/export vertical.

## Téléphone

- navigation séquentielle ;
- formulaire plein écran ;
- barre Enregistrer sticky ;
- galerie Média à 1–2 colonnes selon largeur ;
- détail Média plein écran / sheet ;
- Journal dans `Plus` ou drawer plein écran.

---

# 33. Accessibilité

Exigences :

- focus visible ;
- labels permanents ;
- boutons icon-only nommés ;
- erreurs associées aux champs ;
- confirmation destructive explicite ;
- aucun statut uniquement par couleur ;
- progression média accompagnée d’un texte / pourcentage lorsque pertinent ;
- cibles tactiles suffisantes ;
- support clavier desktop ;
- respect de `prefers-reduced-motion`.

---

# 34. Performance

## Atelier

Ne pas rerendre toute la collection pour chaque frappe si l’architecture peut l’éviter.

## Médias

- thumbnails pour galerie ;
- lazy loading ;
- original chargé uniquement lorsque nécessaire ;
- upload/download par chunks si la couche technique l’utilise ;
- pas de base64 géant dans le DOM ;
- pas de chargement simultané de tous les originaux.

## Diagnostics

Limiter le volume de logs rendu simultanément si l’historique devient important.

---

# 35. Composants UI-5

En complément des composants précédents :

```text
WorkshopShell
EntityEditorList
EditorForm
EditorSection
UnsavedChangesBadge
SaveBar
DangerZone
DeleteConfirmDialog

MediaLibrary
MediaCard
MediaDetail
MediaPresenceBadge
MediaBackupStatus
MediaUploadProgress
MediaDownloadProgress
MediaIntegrityStatus

SyncStatus
SyncDetailsPanel
SyncRetryAction
OutboxSummary

ImportExportPage
ImportDropzone
ImportPreview
ImportSummary
ImportErrorTable
ExportCard

JournalDrawer
DiagnosticSummary
LogFilter
LogList
DiagnosticExport
```

Les noms techniques sont indicatifs. Aucun framework n’est imposé.

---

# 36. Critères d’acceptation UI-5

UI-5 est conceptuellement validée lorsque :

- [x] sauvegarde explicite définie ;
- [x] modifications non enregistrées définies ;
- [x] navigation avec dirty state définie ;
- [x] responsive Atelier défini ;
- [x] suppression sécurisée définie ;
- [x] Média local/distant défini ;
- [x] original bit-identique verrouillé ;
- [x] miniature séparée de l’original ;
- [x] états média définis ;
- [x] sauvegarde média progressive définie ;
- [x] restauration média définie ;
- [x] vérification SHA-256 visible ;
- [x] indicateur sync global défini ;
- [x] local vs Neon distingués ;
- [x] erreur Neon non bloquante définie ;
- [x] retry défini ;
- [x] JSON / XLSX / médias séparés ;
- [x] preview d’import obligatoire ;
- [x] diagnostic synthétique défini ;
- [x] logs techniques définis ;
- [x] export diagnostic défini ;
- [x] purge journal sécurisée définie ;
- [x] offline défini ;
- [x] accessibilité définie ;
- [x] performance média définie.

---

# 37. Gate UI-5

La Gate UI-5 est validée conceptuellement lorsque :

1. une édition ne peut pas être confondue avec une simple lecture ;
2. une modification non enregistrée ne peut pas être perdue silencieusement par navigation ;
3. une sauvegarde locale réussie est distinguée d’une synchronisation distante réussie ;
4. une panne Neon ne bloque jamais le travail local ;
5. une suppression demande une action volontaire et contextualisée ;
6. un import massif ne peut pas écrire avant preview ;
7. la bibliothèque Média permet de comprendre où se trouve chaque original ;
8. un média n’est déclaré sauvegardé que si l’original distant est vérifié ;
9. aucune recompression de l’original n’est autorisée ;
10. un nouvel appareil peut identifier puis récupérer les originaux sauvegardés ;
11. les miniatures restent des dérivés jetables ;
12. le Journal permet de diagnostiquer local, Auth, sync et médias sans exposer de secrets ;
13. JSON et XLSX restent utilisables indépendamment de Neon ;
14. l’ensemble reste cohérent desktop, tablette et téléphone.

**UI-5 devient la source de vérité pour l’administration, les médias et les états de synchronisation de Gargottex V6.**

La prochaine étape est **UI-6 : polish responsive final, accessibilité, performance, tests sur appareils réels et cohérence transversale des vues UI-1 à UI-5.**
