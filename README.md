# Gargottex V5

Version offline-first locale de Gargottex.

## Contenu

- `index.html`
- `styles.css`
- `seed-data.js`
- `service-worker.js`
- `src/`
- `assets/images/`
- `templates/`

## Fonctionnement

- Données locales en IndexedDB natif
- Plus de Supabase
- Import/export en CSV et XLSX via les templates fournis
- Images locales gérées séparément dans `media_assets`

## Lancement

Ouvrir via un serveur HTTP local, par exemple :

```bash
python -m http.server 8080
```

Puis ouvrir `http://localhost:8080`

## Notes

- Les données de départ du codex sont injectées depuis les templates fournis.
- Le nom de la première quête a été forcé à `test` comme demandé.
- Les images sont stockées localement dans IndexedDB avec un chemin relatif conservé dans les métadonnées.
