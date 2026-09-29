# V6-Map B2 — Interface de consultation de l'Atlas
Statut initial : À FAIRE. Références : V6-MAP-MAITRE.md, A0/A2 validés, ressources utilisables de B1, AGENTS.md.

## Objectif
Intégrer une entrée Atlas dans Gargottex et son composant de consultation, sans créer d'éditeur ni toucher aux écrans métier existants. Raccorder un fond disponible à un moteur partagé par les quatre futures cartes.

## Pré-check
Observer la navigation réelle app/Codex/Atelier, le responsive desktop/tablette/téléphone, le mode PWA et l'état actuel de V7. Avant toute écriture décider du point d'injection réversible ; préserver IDs, médias, scrolls et navigation existante.

## Travail borné
1. Ajouter l'entrée Atlas et son shell autonome avec sélecteur permanent de carte (les quatre entrées prévues ; pas de carte manquante prétendument disponible en production avant C1).
2. Vue paysage tablette : carte dominante et panneau contextuel latéral ; portrait/téléphone : volet inférieur. Fermeture d'un aperçu sans perte du centre ou du zoom.
3. Gestion gestes tactiles, commandes zoom et retour à la Chope, limites de carte, chargement/panne et fallback niveau inférieur. Recentrage première visite sur Saint-Fût/Chope ; restituer localement carte/centre/zoom après visites, versionner la préférence si coordonnées évoluent.
4. Prévoir l'emplacement du bouton de toponymie et du futur « Aperçu joueurs » réservé au MJ ; ne pas livrer de faux contrôle inerte, ni afficher les secrets en attendant C2.
5. Garder l'Atlas lecture seule ; l'ouverture du Codex depuis un aperçu utilise les IDs existants et ne révèle aucun donjon par effet de bord.
6. Conserver un chargement média ciblé ; aucun getAll massif de Blobs ni rerender général sur chaque déplacement.

## Livrables
Interface responsive avec fond disponible, restauration de position, navigation réversible, accessibilité des commandes et tests ciblés. Si B1 non prêt, branche/PR de préparation non activée en production, Gate dépendante non verte.

## Tests / Gate B2
Première ouverture au village, retour aux vues précédentes, changement de carte lorsqu'asset présent, zoom iPad/pointeur, réouverture PWA, panneaux, commandes clavier/lecteur d'écran si applicable. Aucun écran Codex/Atelier dégradé. La restauration n'affecte ni la campagne ni les découvertes. Pas de production exposant des lieux secrets sans filtre. Documenter test réel et simulations séparément.

## Exclusions
Aucune gestion de découverte, aucun portail inventé, aucun changement de schéma métier, aucune fusion de V7 dans V6-Map.