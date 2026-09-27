# V6-Map B3 — Toponymie dynamique et niveaux de lecture
Statut initial : À FAIRE. Références : maître, A0, B1 et B2 validés, AGENTS.md.

## Objectif
Afficher TOUS les noms comme surcouche indépendante des fonds, en respectant les priorités liées au zoom, la lisibilité tactile et le masque global de toponymie.

## Préconditions
Géographie source Ardéra et contrat de coordonnées stables ; vérifier les 42 régions, 7 continents, quatre océans et mers, appellations secondaires approuvées de Valdorie et les deux mers de Pelagrève. Aucune récupération d'un ancien nom refusé.

## Travail borné
1. Construire le catalogue de libellés avec ID stable, carte, géométrie (point/ligne/zone ou ancrage adapté), catégorie, ordre de priorité, plages de visibilité, statut public/sensible et texte Unicode exact. Un fleuve peut suivre un tracé sans imposer un texte horizontal arbitraire.
2. Afficher continents et océans majeurs au monde, régions et mers au zoom continental, petits cours d'eau/villages au zoom régional ; conserver le nom de la Chope identifiable comme marqueur spécial.
3. Algorithme de collision/débordement limitant les chevauchements et évitant les sauts intempestifs pendant déplacement ; contraste et tailles lisibles sur quatre palettes dimensionnelles.
4. Commande indépendante « Masquer les noms » réversible, préférences locales ; elle ne masque pas nécessairement marqueurs et commandes.
5. Appliquer la règle de confidentialité AVANT le placement, la recherche et l'interaction ; jamais peindre un nom sensible dans les tuiles. Pas de texte fantôme ni de résultat de recherche révélateur.

## Livrables
Catalogue de la toponymie, rendu commun, tests d'échelles et intégration réversible. Les noms encore réservés restent non publiés, jamais inventés pour remplir une zone.

## Gate B3
Aucun texte incrusté dans image ; 7+42 et noms maritimes conformes au maître ; pas de chevauchement majeur aux tailles d'écran cibles ; commande globale opérationnelle ; coordonnées identiques sur fonds de résolutions différentes ; aucune fuite de lieu masqué. Gate rouge si collision instable, libellé provisoire présenté comme canon ou régression de fluidité.

## Hors périmètre
Pas d'éditeur de noms dans l'Atlas, pas de mise en production de zones secrètes avant C2, pas de changement des noms validés sans approbation.