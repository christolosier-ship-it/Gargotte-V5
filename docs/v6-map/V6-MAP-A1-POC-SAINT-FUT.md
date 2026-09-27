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