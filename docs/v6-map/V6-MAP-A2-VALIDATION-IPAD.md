# V6-Map A2 — Validation iPad et choix du moteur de tuiles
Statut initial : À FAIRE. Références : maître, A1 et A0 validés, AGENTS.md.

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
