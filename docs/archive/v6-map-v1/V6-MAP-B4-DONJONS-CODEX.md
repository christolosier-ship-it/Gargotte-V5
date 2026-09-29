# V6-Map B4 — Marqueurs des quinze donjons, aperçu et recherche
Statut initial : À FAIRE. Références : maître, A0/B2/B3 validés, AGENTS.md et API actuelle du Codex.

## Objectif
Raccorder l'Atlas aux quinze donjons existants sans dupliquer leurs fiches, avec recherche globale des lieux et affichage progressif des marqueurs au zoom. Implémentation de la cartographie des lieux, pas encore du module complet de campagnes/secrets de C2.

## Préconditions
Vérifier identité/IDs réels des entités dans la source active (IndexedDB si avant bascule, D1/Worker si après V7) ; ne jamais supposer que D1..D15 sont leurs IDs techniques. Vérifier quelle liste est présente dans le catalogue de production et ce qui reste seulement dans le document de conception. Vérifier contrat anti-fuite avant toute exposition publique.

## Travail borné
1. Construire catalogue de 15 implantations V1 PROVISOIRES tel que maître : Valdorie 8, Pelagrève 2, Ferrécime 2, Sylvaronde 1, Hautes Fermentations D7 et Royaume des Soifs Éteintes D8. Boréclat/Sahaldune/Austrébrume vides. Ne pas inventer coordonnées définitives ou portail ; points géographiques provisoires documentés comme tels.
2. Modèle de lien stable location_id -> entity_type/entity_id réels ; ouvrir la fiche Codex existante depuis panneau nom/région/description/miniature si existante. Pas de write métier, ni découverte à l'ouverture.
3. Marqueurs principaux visibles à zoom faible, autres progressifs ; la Chope prioritaire ; zoom et dézoom ne doivent pas déplacer la position réelle du marqueur. Éviter les regroupements chiffrés obligatoires.
4. Recherche transversale quatre cartes avec dimension dans chaque résultat ; filtrer avant rendu/indexation client suivant droits. Ne pas lancer une recherche globale non filtrée tant que C2 n'est pas opérationnel : au besoin réserver fonction ou l'exposer uniquement à un jeu de données public de test.
5. Vérifier correspondances visuelles et géographiques D5/D15 distincts ; D7/D8 sur leur dimension respective ; recherche et aperçu sans indice indirect de lieu caché.

## Livrables
Catalogue d'emplacements provisoires, service de liaison Codex, marqueurs dynamiques, recherche publique sûre, tests unitaires/routage et matrice de couverture. Feature flag ou restriction de déploiement tant que C2 n'autorise pas la diffusion par campagne.

## Gate B4
15 identifiants fonctionnellement liés ou écarts explicitement documentés ; aucune fiche modifiée ; ouverture/retour Codex et restauration du zoom ; aucune apparition des lieux non autorisés ; recherche globale avec libellé dimension ; aucun portail non validé. Si secret pas filtrable côté serveur, Gate de diffusion aux joueurs ROUGE jusqu'à C2.

## Hors périmètre
Ne pas automatiser découverte, ne pas considérer la V1 provisoire comme emplacement de lore définitif, pas de nouvelle migration D1/R2.