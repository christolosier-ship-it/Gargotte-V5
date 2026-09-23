# V7 Lot 2 — Infrastructure Cloudflare

## Objectif
Créer une infrastructure Cloudflare V7 vierge et isolée de la production V6.

## Préconditions
- Lire le maître V7.
- Lot 1 validé et suffisamment précis.
- Vérifier les limites/prix Cloudflare actuels avant création.

## Travaux
Créer et configurer selon le contrat du Lot 1 :
- Cloudflare Access ;
- D1 ;
- R2 ;
- Worker API ;
- bindings Worker vers D1/R2 ;
- secrets et variables d'environnement ;
- observabilité minimale.

Utiliser uniquement des données synthétiques de test.

Valider :
- authentification ;
- identité reçue par Worker ;
- accès Worker → D1 ;
- accès Worker → R2 ;
- absence de secret côté client ;
- comportement d'erreur.

## Interdictions
- Ne pas brancher la PWA V6.
- Ne pas migrer de données réelles.
- Ne pas uploader de média de production.
- Ne pas toucher IndexedDB.

## Gate
- Access opérationnel.
- Worker opérationnel.
- D1 opérationnel.
- R2 opérationnel.
- Bindings testés.
- V6 inchangée.

## Livrable
Infrastructure V7 prête pour l'API fonctionnelle du Lot 3.
