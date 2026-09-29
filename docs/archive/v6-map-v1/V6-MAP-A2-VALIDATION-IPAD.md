# V6-Map A2 — Validation iPad et choix du moteur de tuiles
Statut initial (historique) : À FAIRE. **État au 27/09 après retour matériel : Gate A2 VERTE sur le POC neutre, réserves sur formats détaillées en clôture.** Références : maître, A1 et A0 validés, AGENTS.md.

## Objectif
Éprouver le POC sur l'iPad cible et figer des décisions mesurées : format d'images, taille des tuiles, niveaux de zoom, budget mémoire/cache, stratégie de chargement. Les valeurs 512 px ou les résolutions Z0–Z4 du brainstorming ne sont que des exemples à comparer.

## Préconditions
Gate A1 VERTE ; démonstrateur isolé accessible ; protocole répétable. Faire une passe automatisée WebKit si disponible, mais ne jamais présenter une simulation WebKit comme une mesure sur l'iPad physique. Demander au propriétaire la validation matérielle lorsque l'appareil n'est pas accessible.

## Mesures et tests
1. Comparer variantes de tuiles, poids/qualité WebP ou autre format accepté par les appareils cibles, temps de décodage, mémoire et comportements réseau ; noter dispositif, OS/navigateur, méthode et contexte.
2. Tester zooms répétés, déplacements rapides, recadrage, changement de fond, retour précédent, app mise en veille puis rouverte ; surveiller Object URLs/ressources décodées, erreurs et tuiles périmées.
3. Tester premier chargement, cache des quatre fonds de base en démonstration, réseau coupé, tuiles détaillées déjà vues vs absentes, mise à jour de manifest/version et stratégie cache séparée.
4. Vérifier contrastes et placements de noms, commande masquer noms, panneaux tablette portrait/paysage et toucher ; pas d'assertions de millisecondes ou pixels hors besoin objectivement justifié.
5. Documenter coût estimé pour Ardéra et les trois dimensions, avec une proposition de budget et stratégie de préchargement borné.

## Livrables
Rapport comparatif reproductible, choix motivé du format/tailles/seuils, correctifs ciblés du POC si requis, catalogue des limites et protocole de validation des cartes finales.

## Gate A2
Choix explicites basés sur essais, navigation acceptable sur l'iPad cible, fond général disponible offline, dégradation gracieuse si détail manquant, aucune fuite mémoire ou blocage notable. Si appareil réel non testé : Gate **EN ATTENTE**, pas verte, et ne pas autoriser B1 final en prétendant le contraire.

## Hors périmètre
Pas de production d'Ardéra, pas de campagne/portail, pas de migration backend ni nettoyage IndexedDB.
## Suivi d'exécution, 27/09/2026

Branche dédiée `v6-map/a2-validation-ipad`, depuis V5.3 après fusion de #56. **Statut Gate A2 : EN ATTENTE de validation réelle de l'iPad cible**, même si les contrôles automatisés passent.

Livrables : [rapport comparatif et limites](V6-MAP-A2-RAPPORT-COMPARATIF.md), [protocole matériel reproductible](V6-MAP-A2-PROTOCOLE-IPAD.md), laboratoire indépendant `poc/v6-map-a1/a2-validation.html`, cache public neutre strictement scoped et 4 fonds tests, tests ciblés WebKit portrait/paysage via CI spécifique. Les formats/tailles et les budgets restent des hypothèses de travail jusqu'au retour physique. Aucun visuel final, aucun B1, aucune modification au Worker global, IndexedDB, médias ou V7.


### Preuves automatisées et réserve du verdict

- Run A2 WebKit portrait/paysage [#36321385112](https://github.com/christolosier-ship-it/Gargotte-V5/actions/runs/36321385112) : **10/10 tests réussis** sur le commit de code `5772ba9` ; quatre bases disponibles dans le cache du Worker et servies avec ressources réseau neutralisées, fallback, zoom/pan, géographie stable et mesures neutres. **`context.setOffline(true)` sous WebKit Linux reste non concluant** (`Load failed`) : il n'est pas noté « essai offline iPad réussi ».
- Historique de corrections et classification dans le rapport : clé de cache doublement préfixée = code corrigé ; requête avec query en ligne pouvant retourner 200 = assertion initiale trop stricte, ajustée pour contrôler la **clé cache exacte** ; inspection cache dans le contexte du Worker = diagnostic adapté au simulateur.
- L'ouverture/rechargement du fond général hors ligne, la veille/reprise, le comportement mémoire Safari réel et le contrôle de publication HTTPS du laboratoire demeurent à accomplir suivant `V6-MAP-A2-PROTOCOLE-IPAD.md`. **Gate EN ATTENTE**, sans autorisation automatique pour B1.

## Clôture après validation sur l'iPad physique (27/09/2026)

**Gate A2 : VERTE pour la navigation et le cache du POC neutre sur validation explicite du propriétaire**, qui a transmis une capture du laboratoire A2 et confirmé : « Tout les tests sont concluants et validés ». La capture vérifie directement que le benchmark est terminé, que le Service Worker A2 est actif et pilote cette page, avec **4/4 fonds neutres présents dans le cache**. Elle indique « navigateur annonce en ligne » : le parcours réellement hors ligne et les gestes/veille/fallback sont **attestés par le propriétaire**, pas prouvés indépendamment par la seule image. Aucune mesure native RSS ou historique de veille n'a été communiquée. Le test Playwright WebKit Linux intégralement offline reste non concluant et ne doit pas être transformé en succès de CI.

**Appareil photographié :** iPad Safari, extrait du User-Agent Version/26.4 Safari/604.1 avec UA desktop « Macintosh » ; dimensions CSS visibles dans JSON : 810×1080, DPR 2. Modèle exact, build iPadOS, espace disque et JSON brut complet non communiqués.

**Résultats de poids en octets (tuiles neutres 256 / 512 / 1024 px) :**
- PNG : 22 301 / 50 416 / 115 906.
- JPEG q=.82 : 10 247 / 26 230 / 68 642.
- WebP q=.82 : encodeur Canvas non pris en charge pendant ce test, **sans preuve d'incompatibilité du décodeur WebP pour un fichier préencodé**.
- AVIF affiché : 22 301 / 50 416 / 115 906, poids strictement égaux au PNG et différence RGB nulle. **Suspect : ne pas qualifier AVIF** avant contrôle de signature binaire. Le banc A2 est corrigé en ce sens dans cette PR.

**Décisions techniques pilotes A2 :** moteur natif DOM du POC conservé ; carré 512 px comme dimension d'essai pour les premiers fonds, PNG en référence/fallback confirmé, JPEG opaque optionnel avec revue visuelle sur peinture. WebP produit hors Canvas à vérifier en décodage/qualité sur iPad avant adoption ; AVIF non retenu tant que le vrai binaire n'est pas prouvé. Zoom POC 1 à 4, seuils z1≈1,45 et z2≈2,55 comme point de départ, **non définitifs** sur la géographie B1. Enveloppe de travail ≈32 MiB de surfaces RGBA actives, estimation théorique et pas une mesure Safari ; chargement prioritaire viewport, voisins bornés et éviction hors champ. Garder les quatre fonds basiques en cache public isolé, détails opportunistes et aucun secret dans le cache public.

Une transition de Worker/manifest sur une deuxième révision réellement publiée n'était pas démontrable à cette réception ; la qualifier avant clôture C3. La Gate verte valide la **faisabilité du démonstrateur et l'acceptation matérielle déclarée**, pas les futurs assets peints, leurs formats finaux ou le déploiement C3. **B1 n'est pas démarré automatiquement** et aucune illustration finale n'a été générée. Les passages antérieurs « EN ATTENTE » de ce cahier sont l'historique avant ce retour utilisateur.
