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
