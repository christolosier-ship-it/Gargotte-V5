# Gargottex V6 - Workflow images transparentes rembg

## Statut

**ACTIF - workflow de référence pour les dérivés détourés**

Ce workflow a été éprouvé sur les ressources de la maquette et doit être repris pour toute figurine dont le fond doit devenir transparent.

Références exécutables actuelles :

- `scripts/mockup/process_mockup_resources.py`
- `.github/workflows/mockup-resource-pipeline.yml`
- `docs/mockup-assets/generated-data/cutout-audit.json`

---

# 1. Principe absolu

> **L'original n'est jamais modifié. Le détourage produit un dérivé d'affichage.**

Cette règle vaut pour :

- Créatures ;
- Héros ;
- PNJ si besoin ;
- toute figurine ou objet nécessitant un fond transparent.

---

# 2. Moteur validé

- outil : `rembg`
- famille de modèle : IS-Net / DIS
- modèle : `isnet-general-use`
- format de sortie de référence : PNG RGBA

Le modèle peut être réévalué ultérieurement, mais aucun changement n'est adopté sans comparaison visuelle sur un échantillon réel Gargotte.

---

# 3. Pipeline

```text
ORIGINAL IMMUTABLE
        |
        v
copie de travail / flux mémoire
        |
        v
rembg + isnet-general-use
        |
        v
PNG RGBA transparent
        |
        v
audit alpha
        |
        v
contrôle visuel
        |
        +--> validé -> dérivé utilisable
        |
        +--> défaut -> original conservé + dérivé à corriger
```

---

# 4. Original

Ne jamais :

- redimensionner l'original en place ;
- recomprimer l'original ;
- convertir son format en place ;
- écraser son Blob IndexedDB ;
- remplacer un JPEG/PNG original par le PNG détouré ;
- appliquer un fond blanc avant stockage.

Pour les ressources de production stockées dans IndexedDB, le traitement doit travailler sur une copie/Blob lu en mémoire et écrire le dérivé séparément.

---

# 5. Dérivé

Le dérivé transparent peut :

- être redimensionné pour l'affichage ;
- être régénéré ;
- être supprimé puis recréé ;
- utiliser un cache séparé ;
- posséder des métadonnées propres.

Il ne doit jamais devenir la seule copie de l'image.

---

# 6. Audit automatique

Contrôler au minimum :

- présence d'un canal alpha ;
- ratio de pixels transparents ;
- dimensions ;
- bbox alpha ;
- fichier décodable.

Le script de référence produit actuellement ces informations dans `cutout-audit.json`.

Un ratio alpha valide n'est pas une preuve de qualité visuelle : il faut également inspecter.

---

# 7. Contrôle visuel

Vérifier :

- cheveux ;
- oreilles ;
- cornes ;
- ailes ;
- armes ;
- cordes ;
- bords de socle ;
- bière/mousse ;
- parties claires proches du fond ;
- ombres autour du socle.

Chercher :

- halo blanc ;
- trous dans le personnage ;
- bord trop dur ;
- suppression de détails fins ;
- fragments du fond restant.

---

# 8. Échec

Si le résultat n'est pas propre :

1. conserver l'original ;
2. ne pas publier automatiquement le dérivé ;
3. marquer la ressource à revoir ;
4. essayer un autre réglage/modèle seulement sur le dérivé ;
5. si nécessaire, correction manuelle du dérivé.

Aucun fallback ne modifie l'original.

---

# 9. Intégration UI

Pour les figurines :

- utiliser `object-fit: contain` ;
- fond du conteneur transparent ou scénographié ;
- ne pas appliquer `background:#fff` sur l'image ;
- éviter de tronquer le socle ;
- prévoir dimensions/aspect ratio pour limiter CLS.

---

# 10. Nommage et association

Le dérivé doit rester traçable vers son original.

Préférer :

- identifiant métier stable ;
- ou nom de fichier dérivé sans ambiguïté.

Ne pas créer une relation basée uniquement sur une similarité approximative de nom si un ID est disponible.

---

# 11. Données IndexedDB existantes

Le contenu réel des appareils de production n'est pas accessible au chantier.

Donc :

- ne pas lancer une migration qui remplace tous les originaux ;
- ne pas supposer que tous les médias possèdent `image_path` ;
- ne pas exiger que tous les utilisateurs régénèrent leurs images ;
- générer le dérivé à la demande ou via une opération explicite/migration sûre ;
- garder l'application capable d'afficher l'original si aucun dérivé n'existe.

---

# 12. Ressources du dépôt

Échantillons de test :

- `docs/mockup-assets/creatures/`
- `docs/mockup-assets/heros/`

Dérivés :

- `docs/mockup-assets/creatures-transparent/`
- `docs/mockup-assets/heros-transparent/`

Ces dossiers servent à éprouver le workflow et la maquette.

Ils ne remplacent pas les médias IndexedDB de production.

---

# 13. Gate image

Une ressource détourée est validée si :

1. original inchangé ;
2. dérivé séparé ;
3. alpha réel ;
4. contrôle visuel correct ;
5. pas de halo blanc gênant ;
6. socle/appendices conservés ;
7. association original/dérivé traçable ;
8. UI affiche bien le dérivé sans fond blanc forcé.

---

# 14. Intégration production UI-5B

Deux chemins restent supportés.

## 14.1 Utilitaire local historique

```bash
python scripts/media/process_transparent_derivative.py original.jpg derive-transparent.png
```

Il refuse l'écrasement de la source, utilise `rembg` + `isnet-general-use`, écrit un PNG RGBA séparé, compare le SHA-256 de la source avant/après et produit un `.audit.json`.

L'import manuel du PNG reste disponible comme solution de secours.

## 14.2 Détourage intégré dans la PWA

Statut : **PRODUCTION — validé sur iPad — 21 septembre 2026**

La fiche Média dispose d'un seul moteur intégré :

- outil : `rembg-web` ;
- famille : **IS-Net / DIS** ;
- modèle : **`isnet-general-use`** ;
- runtime : `onnxruntime-web@1.23.0` ;
- bibliothèque : `@bunnio/rembg-web@1.0.2` ;
- modèle navigateur : `isnet-general-use.onnx`, environ 178,6 Mo ;
- SHA-256 attendu : `60920e99c45464f2ba57bee2ad08c919a52bbf852739e96947fbb4358c0d964a`.

Le modèle est identique à celui retenu dans le workflow rembg historique.

---

# 15. Flux de production avec validation humaine

Le flux intégré est strictement :

```text
media_assets.blob ORIGINAL
        |
        v
SHA-256 source
        |
        v
ISNet General Use en mémoire
        |
        v
PNG RGBA temporaire
        |
        v
audit alpha
        |
        v
APERÇU HUMAIN SUR DAMIER
        |
        +--> Rejeter / recommencer -> aucune écriture Gargottex
        |
        +--> Valider et enregistrer
                    |
                    v
            saveTransparentDerivative()
                    |
                    v
          transparent_* uniquement
          review_status = approved
```

**Aucun `transparent_blob` n'est écrit avant le clic humain `Valider et enregistrer`.**

Le clic humain constitue l'approbation visuelle du dérivé intégré. L'écriture est effectuée directement avec `transparent_review_status = "approved"` seulement si l'audit alpha est valide.

L'import manuel historique reste distinct : il écrit un dérivé en `pending` lorsqu'il passe l'audit, puis exige le contrôle visuel déjà présent.

---

# 16. Contrôles de sécurité

Avant l'inférence :

- le Blob original doit exister ;
- son SHA-256 est calculé.

Après l'inférence, avant même d'afficher le candidat :

- l'original est relu ;
- son SHA-256 doit être identique.

Juste avant la validation humaine :

- l'original est relu une nouvelle fois ;
- son SHA-256 doit correspondre à l'empreinte mémorisée avec le candidat.

Après `saveTransparentDerivative()` :

- l'original est relu ;
- son SHA-256 doit toujours être identique.

Toute divergence déclenche un **STOP sécurité**.

Seuls les champs `transparent_*` et `updated_at` du média sont modifiés lors de l'enregistrement du dérivé.

Aucune migration de `gargottex-v5-offline` n'est nécessaire.

---

# 17. Mémoire et cache iPad

Le modèle ISNet est lourd et peut exercer une forte pression mémoire sur Safari/iPadOS.

Après chaque inférence :

- la session ONNX est libérée via le mécanisme `disposeAllSessions()` de `rembg-web` ;
- le PNG temporaire reste seulement en mémoire jusqu'à validation/rejet ;
- le modèle téléchargé reste éligible au cache modèle de `rembg-web`.

`rembg-web` stocke le modèle dans une base IndexedDB séparée nommée **`rembg-models`**.

Ce cache :

- ne modifie pas `gargottex-v5-offline` ;
- permet de réutiliser le modèle sans nouveau téléchargement lorsqu'il est conservé par le navigateur ;
- rend le détourage utilisable hors ligne après le premier chargement réussi, sous réserve que Safari n'ait pas évincé le stockage du site.

Les scripts runtime distants sont également réutilisables via les caches navigateur / Service Worker après leur premier chargement lorsqu'ils sont disponibles.

---

# 18. Critères de validation humaine

Avant de cliquer `Valider et enregistrer`, inspecter notamment :

- cheveux ;
- oreilles ;
- cornes ;
- ailes ;
- armes ;
- cordes et fils fins ;
- éléments blancs sur fond blanc ;
- brume / fumée ;
- bords de socle ;
- halos.

Si le résultat n'est pas satisfaisant :

- cliquer `Rejeter / recommencer` ;
- aucun dérivé n'est écrit dans Gargottex ;
- l'original reste intact et continue d'être utilisé.

---

# 19. Gate production

Le workflow intégré est considéré valide si :

1. ISNet produit un PNG RGBA décodable ;
2. l'audit alpha passe ;
3. l'original conserve le même SHA-256 avant/après ;
4. aucune écriture `transparent_*` n'a lieu avant validation humaine ;
5. la validation humaine écrit uniquement le dérivé ;
6. le dérivé est enregistré directement en `approved` ;
7. le Codex ne préfère que les dérivés `approved` avec audit valide ;
8. le rejet d'un candidat ne modifie pas IndexedDB ;
9. la session ONNX est libérée après traitement ;
10. les tests Chromium et WebKit couvrent la barrière d'écriture.
