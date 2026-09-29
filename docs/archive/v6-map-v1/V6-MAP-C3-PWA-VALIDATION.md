# V6-Map C3 — PWA, offline, vérification globale et clôture
Statut initial : À FAIRE. Références : maître, A0–C2 Gates validées, AGENTS.md, V7 réel.

## Objectif
Fiabiliser l'Atlas complet sur iPad et fermer le chantier après validation de géographie, UX, sécurité, cache et non-régression de Gargottex.

## Préconditions
Quatre cartes et surcouches intégrées ; Gate C2 sécurité VERTE ; état backend et Service Worker vérifié à nouveau. Disposer du protocole réel A2 et du budget de tuiles. Sauvegarde/rollback prêts ; ne pas nettoyer les données historiques au nom de la clôture.

## Travail borné
1. Garantir disponibilité offline des quatre fonds généraux, du shell et de la toponymie publique ; les détails téléchargés au fil de l'exploration peuvent être évincés. État explicite si ressource détaillée absente, fallback résolution inférieure et pas de promesse d'archive offline pérenne.
2. Mettre à part le cache de tuiles (manifest et chemins versionnés, capacité bornée, invalidation contrôlée) du cache shell et des données privées. Examiner l'actuel ignoreSearch du Service Worker : ne jamais confondre deux versions/variantes de carte. Ne pas supprimer des caches/données sans identifier leur propriété et leur politique de rollback.
3. Tests sur iPad réel portrait/paysage et reprise mise en veille : 4 cartes, zoom/pan intensifs, mémoire, bascule arrière Codex, dernière carte/position, bouton Chope, masque global des noms, recherche quatre dimensions, panneau contextuel, accessibilité.
4. Tests secrets : MJ/vue campagne/Aperçu joueurs, campagne A/B, API et ressources mises en cache, déconnexion/reconnexion, absence de nom ou portal indirect. Vérifier que le fond public n'incruste aucun secret.
5. Revue visuelle : 7 continents, 42 régions, 7 merveilles, 4 océans et mers approuvées, 15 emplacements V1 marqués PROVISOIRES en source ; continuité des fleuves et côtes entre zooms. Revue artistique des 4 palettes.
6. Régression de la PWA existante : catalogue, filtres, Codex, Atelier, média transparent prioritaire, images donjons, imports/exports, journal et migration V7 sans reset. CI Fast ciblée PR, Full ciblée si cas coûteux, tests manuels documentés.
7. Documenter tailles, version d'assets, méthode de mise à jour, erreurs connues, critères de compatibilité et reprise de session ; clôture documentée uniquement après Gate verte.

## Livrables
Rapport de validation finale, documentation d'exploitation/cache et registre des décisions restant réservées (portails, localisations lore définitives), état des tests et statut de clôture.

## Gate C3
Tous invariants du maître vérifiés ; 4 fonds généraux réellement réouvrables offline, chargements détaillés bornés, absence de fuite inter-campagnes, tests iPad réel documentés, non-régression métier et aucun effacement IndexedDB/Blobs. Si un de ces points échoue, Gate ROUGE ou EN ATTENTE motivée, pas de clôture fictive.

## Hors périmètre
Aucun nettoyage destructif de la migration V7, aucune extension géographique nouvelle, aucun déplacement des donjons sans approbation de lore.