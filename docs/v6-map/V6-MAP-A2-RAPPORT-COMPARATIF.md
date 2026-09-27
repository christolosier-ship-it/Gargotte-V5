# V6-Map A2 — Rapport comparatif technique et limites de preuve

Date d'ouverture : 27/09/2026. Statut : **MESURES AUTOMATISÉES EN COURS ; VALIDATION MATÉRIELLE NON RÉALISÉE ; GATE EN ATTENTE.** Ce rapport porte sur le POC **neutre** Saint-Fût, et non sur des fonds finaux.

## Inventaire de référence vérifié dans A1

- Aucun moteur de carte tiers : DOM, éléments `Image`, `transform: translate(... ) scale(...)`, pointeurs tactiles natifs, niveaux z0 (1 × 1024×512), z1 (2 × 512×512), z2 (8 × 256×256), coordonnées de scène 1024×512, rectangle provisoire d'Ardéra X20..40/Y34..54. Centre X30/Y44.
- L'élément SVG de chaque tuile utilise **une géographie vectorielle identique** et une boîte `viewBox` découpée. Les positions géographiques ne sont jamais recalculées entre niveaux. Une comparaison visuelle de cette seule géométrie ne démontre ni la netteté des **rendus raster** aux zooms élevés ni la qualité de futures peintures. Chaque tuile A1 correspond approximativement à 1 pixel intrinsèque par unité de scène ; le niveau z2 n'apporte pas plus de densité intrinsèque que z0. Une vraie pyramide raster doit dériver des rendus différents d'une source haute définition co-enregistrée.
- A1 supprime du DOM les éléments hors niveau/champ et retire leur `src`/handlers ; les images sont chargées à la demande. Pic de cette fixture : 11 tuiles au maximum. Cela n'est **pas** une mesure de mémoire native WebKit. Pas d'Object URL dans le moteur A1 ; les Object URLs de la comparaison A2 sont créées puis révoquées.
- A1 garde z0 en arrière-plan ; z1 sous z2 lorsque requis. Erreur z0 = indisponibilité bloquante ; erreur de détail = fond inférieur conservé. Le manifest n'est pas un index de sites secrets et ne contient aucun lien métier.

## Banc comparatif reproductible A2

Page : `poc/v6-map-a1/a2-validation.html`. Source d'essai : **même crop carré du fond SVG neutre A1** ; rasterisation Canvas pour des images carrées 256, 512 et 1024 px. Pour chaque taille : PNG, WebP q=0,82, JPEG q=0,82, AVIF si `canvas.toBlob` rend réellement `image/avif` (un repli silencieux en PNG est classé *non supporté*). Trois répétitions, médiane octets/encodage/décodage, lecture des pixels pour différence RGB moyenne échantillonnée vs raster de référence de même dimension. Le benchmark effectue `Image` depuis chaque Blob URL, puis le révoque. Aucun chargement massif de médias Codex ; aucun envoi des mesures.

**Prudence :** la comparaison sur fond schématique simple favorise fortement certains formats et n'est PAS représentative du ratio de compression d'un parchemin peint détaillé ; la moyenne RGB ne juge pas l'impression visuelle, les contours ou le texte. Mesures WebKit Linux simulé et mesures Safari iPad physique doivent rester dans deux colonnes distinctes. Les valeurs d'encodage Canvas reflètent le banc de test et ne sont pas des temps de décodage réseau en production. Ne pas traiter `performance.memory` absent de Safari comme zéro.

| Proposition à comparer | Avantage attendu, à confirmer sur matière finale | Risque / usage |
|---|---|---|
| 256×256 px | surface décodée individuelle faible ; détails plus fins dans fenêtre | plus de requêtes, plus d'éléments et de frais de gestion |
| 512×512 px | hypothèse de compromis entre nombre de requêtes et bitmap | ne pas figer avant mesures Safari matériel |
| 1024×1024 px | moins de requêtes pour grande scène | pic individuel de bitmap et coût de décodage plus forts ; à éviter si jank/évictions |
| PNG | référence sans perte / contrôle de dérive | généralement lourd pour fond peint opaque |
| WebP | candidat prioritaire pour fond opaque/détails après lecture matérielle | comparer q=0,82 sur **art réel** et absence d'artefacts |
| JPEG | contrôle de compatibilité et de compression photo opaque | pertes sur contours ; pas d'alpha |
| AVIF | candidat facultatif si encodeur/décodeur et appareils cibles le prennent en charge | coût de décodage/variations Safari ; absence d'encodeur n'implique pas absence de décodeur |

### Budget bitmap théorique, hors compositing et overhead

Surface RGBA = largeur × hauteur × 4 octets ; **borne basse calculée**, pas un relevé RSS : une tuile 256² ≈ 0,25 MiB ; 512² ≈ 1 MiB ; 1024² ≈ 4 MiB ; fond 1024×512 ≈ 2 MiB. Les onze tuiles A1 toutes retenues simultanément représentent ≈ 6 MiB de surfaces brutes (z0 2, z1 2, z2 2 MiB), sans compter couches WebKit, textures, médias de l'app ni décodages transitoires. Quatre fonds de démonstration 512×256 entièrement décodés ≈ 2 MiB ; ce ne sont pas les tailles de futures cartes.

Exemple **purement dimensionnel** pour une surface finale 8192×4096 toutes tuiles visibles : 256² = 512 requêtes ; 512² = 128 ; 1024² = 32. Chaque couverture totale représenterait théoriquement ≈ 128 MiB décodés, d'où l'exigence de visibilité locale et d'éviction, quel que soit le découpage. Ceci n'arrête **aucune dimension B1**.

## Cache expérimental et sécurité

Worker strictement dans `poc/v6-map-a1/` : `a2-sw.js`, cache `atlas-a2-public-neutral-r1` distinct de `gargottex-*`. Installation atomique (échec d'un asset public = installation non validée). Douze ressources publiques précachées : shell POC/validation, manifest A1, z0 A1 et **quatre fonds neutres** pour les quatre map_id ; aucun label secret, compte, média métier ni donnée privée. Cache hit par URL **exacte**, jamais `ignoreSearch` ; requête query inconnue hors réseau ne correspond pas à une variante existante. Détails z1/z2 : cache opportuniste borné à seize entrées **sur cette seule fixture**, pas une garantie de conservation hors ligne. Une nouvelle révision change le nom du cache, active après précache puis évince uniquement les anciennes entrées ayant le préfixe A2 ; en production, changer aussi les URL/chemins immuables et hashes.

**Limite importante :** le Worker global V6 actuel intercepte toute l'origine avec `ignoreSearch:true` et pourrait aussi voir les requêtes du POC avant l'activation du Worker enfant. La procédure demande une installation puis un rechargement en ligne afin de confirmer le **controller enfant** avant de couper le réseau. Le Worker A2 ne remplace/modifie pas le Worker global. La démonstration ne valide pas une stratégie complète offline des quatre cartes définitives ni des états MJ/joueur.

## Orientation technique proposée, NON DÉFINITIVE en l'absence d'iPad physique

- **Moteur natif DOM conservé comme candidat** tant que l'iPad ne présente pas de saccades, de saut cartographique ou de pression mémoire ; aucune nouvelle dépendance lourde n'est justifiée par A1 seul.
- Préférer provisoirement **WebP opaque à qualité ≈0,82 et tuiles carrées 512 px** comme hypothèse de comparaison B1, sous réserve du tableau de mesures réel et d'un échantillon graphique représentatif futur. Garder PNG pour ressources exigeant réellement le sans-perte/alpha et une voie de compatibilité si WebP échoue ; n'adopter AVIF que si la compatibilité et l'avantage net sont observés sur les iPad cibles.
- Proposer pour étude un plafond **de travail**, révisable après mesures, d'environ 32 MiB de surfaces RGBA de tuiles simultanément actives (hors shell, panneaux et mémoire Safari interne) ; prioriser viewport, une couronne immédiate de voisins si marge, et réduire préchargement si instabilité. **Ni quota Safari ni seuil accepté ne sont établis.** Comparer à `navigator.storage.estimate()` quand disponible, sans en déduire une réservation durable. Quatre fonds légers doivent être precachés explicitement ; détails opportunistes, éviction contrôlée.
- Versionner ensemble manifest, géographie source, overlays et tuiles via identifiants et noms de ressources immuables. Empêcher la réutilisation d'URL de différents contenus, les collisions `ignoreSearch` et le mélange de contenu privé dans le cache public.
- Tester portrait/paysage, fonds manquants, multi-navigation et réouverture iPad physique avant de figer format, dimension, seuil de zoom, budget et moteur. Aucune proposition ci-dessus n'autorise B1 final.

## Résultats de CI et résultats matériels

Le workflow A2 est dans `.github/workflows/v6-map-a2.yml`, avec tests WebKit simulés en portrait/paysage et artefacts JSON de mesures. Inscrire ici les numéros de runs, résultats, anomalies de code ou de test et chiffres réellement recueillis **après leur exécution**. Le propriétaire complétera le formulaire séparé `V6-MAP-A2-PROTOCOLE-IPAD.md`. Tant que sa validation n'existe pas : **Gate A2 EN ATTENTE**, y compris avec CI verte.

### Mesures initiales concrètes, CI WebKit Linux, non iPadOS

Les deux profils WebKit portrait/paysage donnent les mêmes tailles encodées sur la **fixture neutre**. Médianes de décodage après `Image.decode()` observées sur le run A2 [#36321255956](https://github.com/christolosier-ship-it/Gargotte-V5/actions/runs/36321255956), **dont le test cache était encore rouge pour un test incorrect d'une variante en ligne** :

| Côté | PNG octets / médiane décodage portrait | WebP q=.82 octets / médiane décodage portrait | JPEG q=.82 octets / médiane décodage portrait | AVIF encodage Canvas |
|---:|---:|---:|---:|---|
| 256 | 21 402 / 2 ms | 3 616 / 4 ms | 6 437 / 5 ms | non pris en charge |
| 512 | 45 617 / 5 ms | 7 732 / 4 ms | 16 019 / 8 ms | non pris en charge |
| 1024 | 96 478 / 13 ms | 17 552 / 10 ms | 40 980 / 16 ms | non pris en charge |

WebP 512 a un écart RGB moyen échantillonné de 1,16/255 par rapport au raster PNG neutre. Écart **non généralisable** à la lisibilité des arts définitifs. AVIF : un encodeur Canvas absent n'implique pas absence de décodeur sur iPadOS. Échantillonnage faible et environnement CI mutualisé : ces millisecondes ne peuvent servir de SLA.

### Journal d'anomalies et classification

- Run ciblé [#36320681223](https://github.com/christolosier-ship-it/Gargotte-V5/actions/runs/36320681223) : 8 tests sur 10, cache noté 0/4 par le diagnostic de page ; investigation plutôt que relâchement du test.
- Run [#36320802252](https://github.com/christolosier-ship-it/Gargotte-V5/actions/runs/36320802252) : `caches.keys()` de la page WebKit CI vide malgré Worker actif ; le diagnostic est déplacé dans le **Worker qui possède le cache**, interrogé par `MessageChannel`. Le Worker disposait bien des quatre ressources.
- Run [#36320933330](https://github.com/christolosier-ship-it/Gargotte-V5/actions/runs/36320933330) : **défaut code avéré**, `PREFIX + REV` produisait `atlas-a2-public-neutral-a2-neutral-r1` tandis que l'interface attendait `atlas-a2-public-neutral-r1` ; REV raccourcie à `r1`, cache cohérent. Rechargement véritablement offline renvoyait une erreur interne WebKit simulé, pas assimilable à une mesure physique.
- Run [#36321140811](https://github.com/christolosier-ship-it/Gargotte-V5/actions/runs/36321140811) : quatre ressources présentes dans le Worker, `context.setOffline(true)` entraîne `Load failed` côté WebKit CI. Test distingué entre réponse déjà mise en cache sous réseau artificiellement bloqué, simulation offline, et réouverture réelle sur Safari iPad.
- Run [#36321255956](https://github.com/christolosier-ship-it/Gargotte-V5/actions/runs/36321255956) : les quatre fonds, le shell, le manifest et le fallback ont renvoyé 200 avec routes de ressources neutralisées, mais **assertion de test trop contraignante** : une URL avec query inconnue est autorisée à être récupérée depuis le réseau en ligne (200), elle ne doit simplement jamais aliaser une entrée cache. L'assertion a été corrigée : vérifier absence de clés `?` dans le cache et comportement hors réseau, sans empêcher un fetch réseau légitime.

À compléter après dernier run de la PR : statut et éventuelles limites du simulateur. Un passage de CI ne vaut pas une réouverture hors ligne sur iPad réel. **Gate A2 EN ATTENTE matériel.**
