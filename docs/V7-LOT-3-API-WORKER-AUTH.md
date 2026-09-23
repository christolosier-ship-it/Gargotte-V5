# V7 Lot 3 — API Worker et autorisation

## Objectif
Implémenter et tester l'API backend complète sans brancher la PWA de production.

## Préconditions
- Lire le maître V7.
- Lot 2 validé.

## Travaux
Implémenter les endpoints définis au Lot 1 pour toutes les entités métier.

L'API doit couvrir au minimum :
- liste ;
- lecture par ID ;
- création ;
- modification ;
- suppression contrôlée ;
- validation des relations utiles ;
- médias R2 ;
- métadonnées media_assets ;
- erreurs explicites.

Auth :
- vérifier cryptographiquement l'identité Access côté Worker ;
- ne jamais faire confiance à un email ou rôle fourni par le client ;
- appliquer les rôles applicatifs définis au Lot 1.

Qualité :
- conserver les IDs fournis lors de la migration ;
- éviter les écritures destructives implicites ;
- définir clairement les opérations idempotentes ;
- ajouter les tests nécessaires.

Tester avec données synthétiques seulement.

## Interdictions
- Pas de données IndexedDB réelles.
- Pas de branchement UI de production.
- Pas de bascule de source de vérité.

## Gate
L'API peut gérer un jeu de données synthétique complet avec auth, D1 et R2 sans dépendre d'IndexedDB.

## Livrable
Backend fonctionnel prêt à recevoir les migrations.
