# Gargottex V6 - UI-5 Administration, Médias & Persistance locale

## Statut

**LIVRÉ — UI-5 COMPLET (A + B + C) — 20 septembre 2026 — source de vérité de l'Atelier, des Médias, des imports/exports et de la persistance visible**

Le nom historique du fichier contient « SYNC », mais la **synchronisation distante est différée** avec la refactorisation technique.

Le chantier actuel protège et utilise la PWA + IndexedDB existants.

Principe :

> **Créer et modifier sans jamais mettre en danger les données déjà présentes sur l'appareil.**

---

# 1. Découpage

## UI-5A - Atelier

- familles ;
- liste ;
- formulaire ;
- dirty state ;
- Enregistrer ;
- création ;
- suppression.

## UI-5B - Médias

- originaux ;
- dérivés ;
- rattachements ;
- détourage rembg ;
- suppression locale volontaire.

## UI-5C - Import/Export & diagnostic local

- preview ;
- import ;
- export ;
- PWA ;
- IndexedDB ;
- diagnostic ;
- offline.

---

# 2. Sécurité IndexedDB

Ce lot est celui qui présente le plus de risque de perte.

Règles absolues :

1. ne jamais supprimer la base pour appliquer la nouvelle UI ;
2. ne jamais supprimer un object store existant dans ce chantier sans migration séparée ;
3. préserver IDs et clés ;
4. lors d'une édition, conserver les propriétés non présentes dans le formulaire ;
5. nouveaux champs optionnels par défaut ;
6. une migration d'index/store est versionnée et testée sur copie ;
7. les données binaires existantes sont préservées ;
8. le Service Worker ne réinitialise pas IndexedDB ;
9. un échec de mise à jour n'efface aucune donnée locale saine ;
10. les tests de fixtures ne prouvent pas à eux seuls la compatibilité avec les IndexedDB réels de production.

Avant déploiement d'une migration locale :

- tester un upgrade depuis une version précédente ;
- exporter/sauvegarder sur un appareil de validation ;
- vérifier lecture/écriture après upgrade ;
- tester réouverture offline.

---

# 3. Atelier

Le Codex consulte.

L'Atelier crée, modifie et supprime.

Familles :

- Créatures ;
- Donjons ;
- Héros ;
- PNJ ;
- Quêtes ;
- Loot ;
- Objets interactifs ;
- Brouhaha.

La V3 « menu classique à cases puis fiche » est la référence.

---

# 4. Responsive Atelier

Desktop :

- liste/collection à gauche ;
- fiche à droite.

Tablette paysage :

- liste + formulaire possible si confortable.

Tablette portrait :

- formulaire prioritaire ;
- liste en drawer/panneau secondaire si nécessaire.

Téléphone :

`Liste -> Fiche d'édition -> Retour`

Barre `Enregistrer` sticky.

Cette exception ne doit pas être confondue avec le comportement séquentiel du Codex tablette.

---

# 5. Enregistrement

Pas d'auto-save à chaque frappe.

États :

- propre ;
- modifié non enregistré ;
- validation ;
- enregistrement local ;
- enregistré localement ;
- erreur locale.

Après clic `Enregistrer` :

1. valider ;
2. écrire dans IndexedDB ;
3. confirmer localement ;
4. mettre à jour l'UI.

Aucun libellé « Synchronisé avec Neon » dans le chantier actuel.

---

# 6. Quitter avec modifications

Modal :

`Rester | Quitter sans enregistrer | Enregistrer`

Aucune modification ne se perd silencieusement.

---

# 7. Création

`+ Nouveau` ouvre une fiche complète.

Avant Enregistrer :

- brouillon UI ;
- pas d'enregistrement métier caché.

Les valeurs par défaut ne doivent pas inventer une donnée métier significative.

---

# 8. Suppression

Suppression uniquement depuis la fiche.

Zone Danger.

Confirmation forte.

La suppression doit préciser :

- entité ;
- relations connues ;
- média éventuellement lié.

Aucune cascade inventée.

---

# 9. Formulaires

La structure suit la fiche Codex correspondante.

Exemple Créature :

- Identité ;
- Gameplay ;
- Compétence ;
- Comportement ;
- Butin ;
- Lore ;
- Médias ;
- Tags.

Un formulaire n'efface jamais un champ existant simplement parce qu'il n'est pas visible dans la nouvelle UI.

Technique recommandée :

- lire l'objet complet ;
- modifier les champs édités ;
- réécrire l'objet enrichi, sans reconstruire depuis zéro un sous-ensemble destructif.

---

# 10. Médias : principes

L'original est sacré.

Distinguer :

- original ;
- thumbnail ;
- dérivé transparent ;
- aperçu.

Un dérivé n'est jamais enregistré à la place de l'original.

Si le modèle actuel stocke des Blobs en IndexedDB, conserver ces Blobs.

---

# 11. Workflow de détourage

Pour une figurine :

- utiliser `WORKFLOW-IMAGES-REMBG-V6.md` ;
- IS-Net / DIS via `rembg` ;
- résultat transparent séparé ;
- audit alpha ;
- contrôle visuel.

Sur échec de détourage :

- conserver l'original ;
- marquer le dérivé à corriger ;
- ne jamais remplacer automatiquement l'original.

---

# 12. Bibliothèque Médias

En-tête :

- Ajouter ;
- recherche ;
- Tous ;
- Liés ;
- Orphelins.

Carte :

- aperçu ;
- label ;
- entité liée ;
- état local ;
- type de ressource.

Détail :

- original ;
- dérivé(s) ;
- rattachement ;
- taille/type utiles ;
- actions.

---

# 13. Actions média

## Retirer un dérivé

Peut supprimer un dérivé régénérable.

Ne touche pas l'original.

## Retirer l'original local

Dans le chantier actuel, cette action n'est autorisée **que si l'application dispose déjà d'un mécanisme de sauvegarde externe sain et explicitement validé**.

Sinon elle n'est pas proposée.

## Supprimer définitivement

Confirmation forte.

La suppression d'un original ne doit jamais être confondue avec la suppression d'une miniature.

---

# 14. Synchronisation distante différée

Les éléments visuels `Neon`, `remote_only`, Auth distante ou retry cloud présents dans la maquette sont **hors Gate actuelle**.

Ne pas :

- implémenter Neon comme dépendance UI ;
- créer un faux état « synchronisé » ;
- afficher une sauvegarde distante inexistante.

Lorsqu'un futur chantier remote reprendra, UI-5 sera enrichi.

---

# 15. Import / Export

JSON, XLSX et médias restent distincts.

## Preview obligatoire avant import massif

Afficher :

- total ;
- valides ;
- avertissements ;
- erreurs ;
- effet prévu ;
- création/mise à jour lorsque déterminable.

Règles :

- erreur bloquante exclue ;
- warning importable ;
- confirmation du nombre réellement écrit ;
- aucun write avant confirmation.

---

# 16. Export de sécurité

Avant une évolution IndexedDB significative, vérifier qu'un export exploitable des données structurées est possible.

Un export JSON/XLSX ne doit pas prétendre contenir les médias binaires s'il ne les contient pas.

La sauvegarde média doit être traitée séparément.

---

# 17. Diagnostic local

Résumé utile :

- version PWA ;
- version schéma IndexedDB ;
- stores accessibles ;
- compteurs ;
- état Service Worker ;
- espace/erreurs lorsque disponible ;
- dernière erreur locale.

Aucun secret.

Actions possibles :

- Copier diagnostic ;
- Exporter diagnostic ;
- Vider journal local.

Vider le journal ne touche jamais les données métier.

---

# 18. PWA / Service Worker

La nouvelle UI doit continuer à :

- s'installer ;
- démarrer offline ;
- reprendre avec les données locales ;
- mettre à jour les assets sans supprimer IndexedDB ;
- éviter les caches fantômes après déploiement.

Les nouveaux assets UI doivent être intégrés au cache de production selon le mécanisme actuel.

---

# 19. Gate UI-5A

- toutes les familles éditables ;
- listes/fiches ;
- Enregistrer explicite ;
- dirty state ;
- aucune perte de propriété non affichée ;
- suppression volontaire.

# 20. Gate UI-5B

- originaux intacts ;
- dérivés séparés ;
- rembg intégré proprement ;
- galerie/détail médias ;
- aucun fond blanc artificiel sur PNG transparent.

# 21. Gate UI-5C

- import avec preview ;
- export vérifié ;
- diagnostic local ;
- PWA/offline ;
- upgrade IndexedDB testé ;
- aucune dépendance backend distante ajoutée.

---

# 22. Implémentation UI-5A sur V5.3

Statut : **LIVRÉ — UI-5A uniquement — 20 septembre 2026**

UI-5 global reste **ACTIF** pour UI-5B et UI-5C.

## Périmètre

Atelier V6 livré pour :

- Créatures ;
- Donjons ;
- Héros ;
- PNJ ;
- Quêtes ;
- Loot ;
- Objets interactifs ;
- Brouhaha.

Workflow : `type -> liste -> fiche d'édition`.

La composition reprend le menu classique par familles de la V3, mais les formulaires utilisent les données de production réelles.

## Sécurité de sauvegarde

Aucune migration IndexedDB n'est nécessaire.

Lors d'un Enregistrer :

1. l'enregistrement complet est relu directement depuis son object store par ID ;
2. une copie complète est conservée ;
3. seuls les champs dont le contrôle a réellement été modifié sont patchés ;
4. les champs dérivés strictement dépendants d'un champ modifié sont actualisés ;
5. toutes les propriétés non affichées ou non modifiées restent intactes ;
6. l'ID est conservé ;
7. `updated_at` est actualisé et `created_at` n'est créé que lorsqu'il manque ;
8. l'objet complet enrichi est réécrit.

Les valeurs `0`, chaînes volontairement vidées, propriétés inconnues d'anciens enregistrements, relations non affichées et propriétés futures sont donc préservées selon leur état réel.

Le Butin lié depuis une fiche Créature est volontairement en lecture seule dans UI-5A. Les Loots sont édités dans leur propre famille afin de préserver leurs IDs et propriétés. UI-5A ne fait plus de `delete/reinsert` massif des Loots lors d'une sauvegarde Créature.

## Nouveau

`+ Nouveau` crée uniquement un brouillon runtime.

Avant `Enregistrer` :

- aucun `putOne` métier ;
- aucune fiche vide cachée dans IndexedDB ;
- aucune relation significative inventée ;
- les champs restent vides jusqu'à saisie explicite.

## Dirty state

Aucune frappe n'est autosauvegardée.

L'Atelier maintient en mémoire :

- le brouillon ;
- la liste exacte des champs modifiés ;
- le fichier image éventuellement choisi ;
- l'état `propre / modifié / enregistrement / enregistré / erreur`.

En cas d'abandon d'une fiche modifiée :

`Rester | Quitter sans enregistrer | Enregistrer`

Le même garde s'applique aux changements de famille et aux sorties vers une autre vue/Codex.

Un `beforeunload` navigateur protège également une fermeture ou un rechargement avec modifications non enregistrées.

## Formulaires

Les formulaires sont regroupés en sections permanentes suivant les fiches Codex :

- Identité ;
- Gameplay / usage ;
- Compétence ;
- Comportement ;
- Butin ;
- Lore ;
- progression, objectif, récompense ou effet selon la famille ;
- Média lorsque présent.

Les labels restent visibles en permanence.

Une ancienne valeur de select qui n'existe plus dans les options actuelles reste affichée comme `Valeur actuelle indisponible` et n'est jamais remplacée implicitement.

## Zone Danger

La suppression est disponible uniquement depuis la fiche.

Avant suppression, une confirmation forte affiche :

- l'entité ciblée ;
- les relations par ID connues ;
- les médias liés connus ;
- l'éventuelle présence de modifications non enregistrées.

La suppression retire uniquement l'entité explicitement confirmée.

Aucune cascade vers Créatures, Quêtes, Loot, Brouhaha, Objets interactifs ou Médias n'est inventée.

## Responsive

- desktop : liste + formulaire ;
- tablette paysage : liste + formulaire lorsque la largeur le permet ;
- tablette portrait : liste puis formulaire prioritaire avec retour explicite ;
- téléphone : `Liste -> Fiche -> Retour` ;
- barre `Enregistrer` sticky sur téléphone.

## Gate UI-5A

- huit familles éditables : validé ;
- workflow type/liste/fiche : validé ;
- Nouveau sans write caché : validé ;
- Enregistrer explicite : validé ;
- aucun autosave à la frappe : validé ;
- dirty state : validé ;
- avertissement avant abandon : validé ;
- formulaires structurés + labels permanents : validé ;
- lecture complète + patch des seuls champs modifiés : validé ;
- propriétés non affichées préservées : validé ;
- Zone Danger : validée ;
- suppression confirmée sans cascade inventée : validée ;
- responsive Atelier : validé structurellement ;
- IndexedDB : schéma inchangé.

**UI-5A est clos. UI-5B et UI-5C ne sont pas démarrés par ce sous-lot.**

---

# 23. Implémentation UI-5B sur V5.3

Statut : **LIVRÉ — UI-5B uniquement — 20 septembre 2026**

UI-5 global reste **ACTIF** pour UI-5C.

## Modèle média compatible production

Aucune migration IndexedDB n'est requise. Les anciens médias gardent `blob`, `thumb_blob`, `path` et `thumb_path`.

Pour les nouveaux médias :
- `blob` = original local immutable, copie byte-à-byte ;
- `thumb_blob` = thumbnail régénérable ;
- `preview_blob` = aperçu WebP régénérable ;
- `transparent_blob` = dérivé PNG RGBA séparé et régénérable.

Toutes les nouvelles propriétés sont facultatives.

## Original immutable et pipeline rembg

Le moteur reste `rembg` + IS-Net / DIS + `isnet-general-use`.

Le script `scripts/media/process_transparent_derivative.py` produit localement un PNG RGBA séparé, refuse d'écraser la source, compare le SHA-256 avant/après et produit un audit JSON.

Lors de l'import dans la PWA, l'original est relu et haché, le dérivé est écrit uniquement dans les propriétés `transparent_*`, puis l'original est relu et rehaché. Toute variation déclenche un STOP sécurité.

## Audit alpha + contrôle visuel

La PWA vérifie signature PNG, alpha réel, dimensions, ratio transparent, bords semi-transparents, opaque et bbox alpha.

Un audit réussi reste en `Contrôle visuel requis`. Le Codex ne préfère le dérivé qu'après `Valider visuellement`.

Un dérivé à corriger ou en échec d'audit n'est jamais publié.

## Bibliothèque

- Ajouter ;
- recherche locale ;
- Tous / Liés / Orphelins ;
- cartes et détail ;
- Original / Thumbnail / Aperçu / Dérivé transparent ;
- rattachement exact par `entity_type + entity_id` ;
- état local et état du dérivé.

Le retrait disponible dans UI-5B concerne uniquement le dérivé régénérable. Le retrait/suppression de l'original n'est pas proposé sans sauvegarde externe saine, qui relève de UI-5C.

## Offline

Aucun Neon, aucun cloud, aucune Auth distante, aucun CDN. IndexedDB reste en version 2 et le Service Worker n'a pas besoin de migration.

## Gate UI-5B

- originaux intacts : validé par construction et empreinte ;
- dérivés séparés : validé ;
- rembg / isnet-general-use : validé via pipeline local générique ;
- PNG RGBA + audit alpha : validés ;
- contrôle visuel explicite : validé ;
- bibliothèque + détail : validés ;
- Tous / Liés / Orphelins + recherche : validés ;
- rattachement fiable par ID : validé ;
- aucun fond blanc forcé : validé ;
- compatibilité anciens médias : validée structurellement ;
- aucune migration IndexedDB : validé ;
- aucun cloud : validé.

**UI-5B est clos. UI-5C n'est pas démarré par ce sous-lot.**

---

# 24. Implémentation UI-5C sur V5.3

Statut : **LIVRÉ — UI-5C — 20 septembre 2026**

JSON et XLSX disposent de deux entrées distinctes. Le preview est calculé en mémoire et affiche total, valides, warnings, erreurs et effet prévu. Les warnings sont importables, les erreurs et doublons ambigus sont exclus. Aucun write métier n'a lieu avant confirmation.

Les updates préservent les enregistrements existants et les relations par nom ne deviennent des IDs que lorsqu'une cible exacte et unique existe. L'import Créatures ne supprime plus les Loots liés. Médias est exclu des imports structurés car JSON/XLSX ne contiennent pas les Blobs. La restauration ZIP destructive historique est désactivée.

Les XLSX existants sont conservés et explicitement présentés comme sans Blob. Un JSON structuré sans Blob est ajouté. Le backup ZIP v2 contient manifest, XLSX, JSON structuré, métadonnées médias et les Blobs disponibles (original, thumbnail, aperçu, dérivé transparent), indexés avec taille/type/SHA-256. Le ZIP est rouvert et vérifié avant téléchargement.

Le diagnostic expose version PWA, version/nom IndexedDB, stores, compteurs, Service Worker, cache V6, assets cœur offline, installation, stockage/quota et dernière erreur. Il permet copier/exporter, vérifier la mise à jour PWA et vider exclusivement `logs`.

Le cache Service Worker devient `gargottex-v6-ui5c`. Aucun code Service Worker ne touche IndexedDB. Aucune migration IndexedDB : Gate upgrade = **N/A**, DB_VERSION reste 2. La réouverture offline est validée structurellement par contrôle du cache ; le test réel sur appareil reste pour la validation finale UI-6.

## Gate UI-5C

- Import JSON/XLSX distinct + preview + métriques + effet prévu : validé.
- Aucun write métier avant confirmation : validé.
- Erreurs exclues / warnings importables / bilan final : validé.
- Exports XLSX conservés et clairement sans Blobs : validé.
- JSON structuré sans Blobs : validé.
- Backup ZIP avec Blobs auto-vérifié : validé.
- Diagnostic + copier/exporter + logs-only : validé.
- PWA cache/update/installation : validé structurellement.
- IndexedDB intact, migration N/A : validé.
- Aucun backend distant : validé.

# 25. Validation UI-5 complet

UI-5A : **VALIDÉ**  
UI-5B : **VALIDÉ**  
UI-5C : **VALIDÉ**

**UI-5 est clos.**
