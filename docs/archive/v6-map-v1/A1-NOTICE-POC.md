# V6-Map A1 : notice locale, sécurité et retour arrière

**POC isolé, graphiques neutres provisoires, pas une préfiguration artistique définitive.**

Depuis la racine du dépôt, lancer `python3 -m http.server 4173 --bind 127.0.0.1`, puis ouvrir `http://127.0.0.1:4173/poc/v6-map-a1/index.html`. L'URL n'est ajoutée ni au menu de Gargottex ni au précache global. La zone de test est le rectangle Ardéra X20..40/Y34..54, centré 30/44 ; images locales 1024×512 et pyramide z0 1×1, z1 2×1, z2 4×2. Ces chiffres sont **propres au POC**, pas des décisions A2.

## Observables
- Zoom par boutons, molette et deux pointeurs tactiles ; déplacement, bornes et recentrage « Revenir à la Chope ». Libellés séparés du fond, masquables ; Chope et Vieux pont sont des repères publics avec panneau local sans écriture.
- Niveau 0 toujours sous les niveaux plus détaillés, et niveau 1 conservé en dessous du niveau 2 : erreur ou attente de détail sans blanc. Sortie du champ/niveau : retrait de l'image, de sa source et de ses callbacks. Onze tuiles maximum dans cette pyramide d'essai, **pas un budget mémoire de production**.
- Diagnostic local `window.__ATLAS_A1_DIAGNOSTICS__()` : zoom, caméra, révision, chargées, erreurs, demandes, actives, pic, libérées et fallback. Aucune lecture ni journalisation privée.
- Les onze SVG sont issus d'une **unique géographie** du générateur. Vérifier par `node poc/v6-map-a1/generate-tiles.mjs --check` ; régénérer sans --check. Les URL des tuiles sont distinctes et sans querystring, pour éviter la collision du Service Worker actuel (ignoreSearch:true) sans le modifier.
- Aucune campagne, donnée secrète, portail, donjon, lien actif Codex, illustration finale, dépendance cartographique lourde, appel IndexedDB, MediaRepository ou V7.

## Vérifications et retour arrière
`node --check poc/v6-map-a1/poc.mjs` ; `node poc/v6-map-a1/generate-tiles.mjs --check` ; `npm run test:v6map:a1` ; Fast CI V6-Fast conservée. Tests du repère, des onze tuiles, du fallback sur erreur, de la libération, du zoom deux pointeurs/pan/bornes, du masquage interactif des noms, du marqueur Chope, de l'entrée applicative inchangée et de l'absence de création IndexedDB par le POC. Tests iPad réel et arbitrages de performances/résolutions : **A2**, non revendiqués ici.

Rollback : retirer uniquement `poc/v6-map-a1/`, `tests/v6-map/a1.spec.mjs`, `playwright.a1.config.mjs`, la commande npm et l'étape Fast CI A1. Ne jamais toucher aux IndexedDB ni aux médias. Aucun changement du shell, des entités, du Service Worker ni de V7.
