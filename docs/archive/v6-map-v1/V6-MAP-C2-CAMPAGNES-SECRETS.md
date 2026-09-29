# V6-Map C2 — Campagnes, autorisations et découvertes
Statut initial : À FAIRE. Références : maître, A0, B4/C1 validés, architecture backend V7 réellement stabilisée, AGENTS.md.

## Objectif
Garantir que les lieux/donjons secrets sont révélés explicitement par le MJ pour UNE campagne, tandis que les quatre cartes restent consultables dès le départ. La vue MJ est complète, avec secrets identifiés ; son « Aperçu joueurs » est temporaire et non mutatif.

## Préconditions de sécurité
Contrôler authentification, rôles, API et schéma existants dans V7 ; vérifier si l'entité campagne existe réellement et ses contrôles d'accès. En absence d'un modèle fiable, soumettre la conception contractuelle à validation et STOP avant tout déploiement aux joueurs. Ne jamais s'appuyer sur le seul CSS, sur un booléen côté navigateur ni sur l'absence de marqueur dans l'UI.

## Travail borné
1. Séparer définitions globales d'Atlas (lieux avec caractère public/sensible, appartenance dimensionnelle, liens Codex) et découvertes (campagne_id, location_id, confirmation MJ, éventuellement audit minimal). Préserver IDs du Codex, éviter duplications et collisions.
2. Définir rôle du MJ et de lecteur sur le serveur ; contrôle d'appartenance à la campagne et filtrage de la réponse **avant transmission**. Champs sensibles, recherche, autocomplete, aperçus, endpoints de détail, portail lié, logs, URLs et cache offline doivent subir la même politique.
3. Action explicite MJ « Confirmer découverte » par campagne ; rectification explicite d'erreur possible. L'ouverture d'une fiche Codex, d'une dimension ou d'un aperçu ne confirme jamais une découverte.
4. Vue MJ complète (secret nettement différencié), bouton « Aperçu joueurs » temporaire qui ne bascule pas définitivement de rôle, ne change pas la campagne et ne révèle ni n'efface aucune découverte.
5. Quatre cartes publiques depuis le début ; seuls lieux sensibles filtrés. Un donjon D15 révélé campagne A reste masqué B. Une relation D5/D15 ne doit pas créer de fuite réciproque.
6. Stratégie offline par compte/campagne : données publiques cachables ; données sensibles MJ protégées, isolation des caches privés, purge/renouvellement de session et comportement de déconnexion explicités. Tester la limite réaliste du cache sur appareil partagé et ne jamais promettre secret absolu contre un MJ autorisé.
7. Stratégie de migration/version des nouvelles données séparée du chantier de migration V7 historique ; pas de reset IndexedDB.

## Livrables
Contrat D1/Worker/Access ou adaptation à l'architecture réelle, implémentation isolée des découvertes/lecture MJ/filtrage, tests de permissions et campagne, documentation et retour arrière. Aucun secret dans assets publics.

## Gate C2
Test impératif A et B séparées ; utilisateur joueur ne reçoit pas D15/son nom/emplacement via API/recherche/cache/source ; vue MJ complète ; bouton aperçu non mutatif ; accès direct à un endpoint secret refusé sans droit ; révélations réversibles par action MJ ; offline et déconnexion examinés ; aucun effet déclenché par consultation Codex. STOP immédiat sur toute fuite. La Gate V7 backend requise doit être vérifiée, pas supposée.

## Hors périmètre
Aucun nouveau gameplay, pas de système de quêtes, pas de localisation inventée des portails, pas de refonte générale des accès V7 sans accord explicite.