# V6-Map A1 — POC technique Saint-Fût-le-Petit
Statut initial : À FAIRE. Références : V6-MAP-MAITRE.md, A0 validé, AGENTS.md.

## Objectif
Démontrer la navigation multirésolution dans une zone TEST de Valdorie autour de Saint-Fût-le-Petit (centre indicatif Ardéra 30/44), sans générer de cartes finales et sans toucher aux enregistrements métier.

## Préconditions
Gate A0 VERTE. Vérifier état du dépôt, disponibilité de la branche POC, tests et mode de lancement local. Employer visuels neutres/provisoires clairement distingués des ressources finales. Aucun lien effectif vers un donjon non documenté dans le POC.

## Travail borné
1. Implémenter un composant isolé ou une route de démonstration désactivée de la navigation normale tant que la Gate n'est pas validée. Choisir un moteur léger ou une réalisation native après justification dans A0, sans imposer de dépendance lourde par défaut.
2. Installer un repère stable X/Y et un mini-manifest multirésolution couvrant collines, ruisseau, village, lisière forestière, avec fonds provisoires. La continuité géographique entre résolutions prime sur l'ornement.
3. Zoom tactile à deux doigts, déplacement, bornes, fallback vers niveau inférieur pendant chargement, limitation des tuiles décodées et libération hors champ ; aucune lecture globale des médias Codex.
4. Surcouche noms entièrement indépendante avec seuils de visibilité et commande globale masquer/réafficher. Marqueur spécial de Chope et un exemple de lieu non sensible. Panneau de prévisualisation sans écriture métier.
5. Instrumentation minimale de chargement/cache/erreurs pour préparer A2, sans journaliser de données privées.

## Livrables
POC isolé, manifest d'essai, tests ciblés du repère et des cas d'erreur, notice locale et conditions de rollback. Pas de modification d'IndexedDB de production, de la migration V7 ni du service worker global si non indispensable au POC isolé.

## Tests / Gate A1
Zoom/déplacement fiables ; fonds toujours alignés ; un nom masqué ne reste pas cliquable par inadvertance ; fallback fonctionnel pour une tuile absente ; navigation hors du POC inchangée ; test mémoire sans accumulation manifeste à changement de zone. Gate rouge si artefacts géographiques sautent, fuite de données, régression média/Codex ou absence de reprise sûre.

## Fin de session
PR autonome limitée au POC, statut précis, captures/observations locales si disponibles ; A2 reste requis pour tout arbitrage définitif de résolution/performance.

## Suivi de réalisation du lot A1 (branche v6-map/a1-poc-saint-fut)

Statut de construction : **POC créé, Gate A1 VERTE, validation technique sur Chromium CI.** Notice : [A1-NOTICE-POC.md](A1-NOTICE-POC.md). Jeu neutre local accessible uniquement par URL directe `poc/v6-map-a1/index.html`, sans intégrer la navigation normale. Pas de changement IndexedDB, médias métier, service-worker.js ni V7 ; pas d'illustration finale. Verdict définitif et tests observés consignés après GitHub Actions, sans anticipation A2/B1.

### Vérification de la Gate A1 (27/09/2026)

**VERTE sur le périmètre borné du POC**, sans prétendre valider une cartographie finale, la performance réelle iPad ou les choix A2.

- GitHub Actions [V6-Fast CI #59](https://github.com/christolosier-ship-it/Gargotte-V5/actions/runs/36313250182), commit 1770b488 : **succès**. Fast CI historique : 21 tests réussis. Étape « Validate isolated V6-Map A1 » : contrôle de syntaxe JS, régénération déterministe vérifiée (11 tuiles), puis **5 tests A1 réussis**, 0 échec.
- Couverture A1 : manifest/repère, géographie homogène, fond de secours, page autonome sans création IndexedDB, entrée normale Gargottex inchangée, libellés masqués non interactifs, Chope, zoom à deux pointeurs, déplacement et bornes, tuile de détail volontairement indisponible avec fallback, restitution/libération des images de niveaux supérieurs.
- **Échec initial correctement classé comme défaut de test** : le sélecteur par nom « Zoomer » correspondait aussi à « Dézoomer » en mode strict Playwright ; remplacement ciblé par #zoom-in dans le test, aucun changement runtime. Le nouveau run est vert. Les assertions restent comportementales, sans limites arbitraires en pixels/temps.
- Diff limité au sous-dossier POC, au test/config A1, à sa documentation, au script npm et à l'étape A1 du workflow Fast. Aucun changement dans src/, service-worker.js, V7, IndexedDB, médias métier, IDs, données de campagne ni images finales. Absence de nouveau package cartographique.
- La Full CI générale du dépôt est déclenchée automatiquement à chaque PR et ne conditionne pas cette Gate documentaire/technique ciblée ; l'inspection matérielle iPad et l'arbitrage des tailles/formats/cache demeurent **A2**, non exécutés ici.
- Retour arrière : retrait des seuls fichiers A1 selon A1-NOTICE-POC.md ; la PR n'est pas fusionnée. **STOP à la Gate A1 : aucun A2 ni B1 engagé.**
