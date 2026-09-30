# V6-Map V2 — lot 4 : chargement, éviction et validation

**But :** appliquer la décision ACTÉE ET VERROUILLÉE : charger les images à la demande pour la vue affichée et évincer la carte du cache applicatif dès qu’elle n’est plus affichée.

## Contrat de chargement

- Ne pas décoder, télécharger ou précharger toutes les cartes au bootstrap.
- À l’ouverture d’une vue, charger son fond et uniquement les sprites nécessaires à cette vue et à l’état d’affichage actif.
- À la sortie, démonter son DOM média, libérer les Object URLs si cette implémentation en crée, puis évincer la carte et ses ressources associées du cache applicatif dédié à Map.
- Évincer seulement les clés cartographiques ciblées. Ne jamais supprimer/vider le cache global de l’application, le cache PWA entier, IndexedDB, les Blobs ou des médias utilisateurs.
- Examiner la stratégie Service Worker actuelle avant de coder : une requête réseau ordinaire ne doit pas provoquer une nouvelle mise en cache générale qui annulerait l’éviction demandée. Ne changer que le chemin Map requis, avec versionnement/portée ciblés.
- Si la carte est encore visible pendant une transition, conserver ses ressources jusqu’au démontage réel afin d’éviter un écran vide.

## Portée hors ligne explicite

La conservation demandée s’arrête quand l’utilisateur quitte la carte. L’application ne promet donc pas une réouverture hors ligne ultérieure d’une carte évincée. Si aucune connexion n’est disponible et que la ressource n’est plus dans la mémoire ou dans le cache cartographique actif, afficher un état d’échec lisible et une action de réessai. Une éventuelle évolution « rendre disponible hors ligne » est distincte et hors périmètre.

Les règles du navigateur concernant son propre cache HTTP ne sont pas nécessairement équivalentes au cache explicite de l’application. L’implémentation doit documenter quel stockage applicatif elle contrôle et vérifier que l’éviction porte bien sur les entrées qu’elle a créées, sans annoncer l’effacement universel de tout cache du navigateur.

## Validation simple et ciblée

1. Inventaire des assets réellement accessibles depuis l’application et contrôle des erreurs de chargement.
2. Parcours depuis Map vers les principales branches et retours.
3. Vérifier qu’aucune carte n’est chargée avant d’être ouverte et qu’une autre vue n’est pas conservée après la sortie, hors ressources nécessaires à l’interface courante.
4. Test du cycle ouvrir → afficher → quitter → vérifier l’éviction applicative → rouvrir avec réseau ; confirmer que la vue recharge normalement.
5. Test hors réseau après éviction : état d’échec/réessai correct, sans attente de disponibilité hors ligne.
6. Smoke test tablette, desktop et téléphone ; vérifier l’absence de régression de navigation.
7. CI courte existante et tests ciblés du parcours. Pas d’assertions de pixels exacts ou de temps arbitrairement fragiles.

## Stop conditions

L’éviction après sortie reste le comportement requis. Choisir une méthode d’éviction ciblée qui préserve le cache global, les données utilisateur, IndexedDB/Blobs et le backend. Si la stratégie de cache actuelle empêche une éviction ciblée sans risque pour ces données, arrêter l’implémentation et signaler le blocage technique au propriétaire ; ne pas vider un cache global et ne pas abandonner silencieusement l’éviction demandée. Ne pas considérer une anomalie majeure de données ou de navigation comme un détail de finition.
