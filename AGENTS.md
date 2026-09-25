# AGENTS.md - Gargottex V6

## Documents actifs
Le chantier V6-WHAOU est **clos et archivé**. Son document maître, sa synthèse de clôture et ses dix cahiers de lots sont conservés dans `docs/archive/v6-whaou`.
La baseline applicative issue de cette clôture est Gargottex **5.6.5**, cache PWA `gargottex-v6-whaou-final-v1`.
Ne pas rouvrir un lot V6-WHAOU pour engager une migration backend ou média : ces évolutions relèvent de V7.

Le chantier V6-Fast est clos. Son historique documentaire est archivé dans `docs/archive/v6-fast`.
Les documents UI-1 à UI-6 sont archivés dans `docs/archive/v6-ui-ux`.
La maquette V3 et le cahier des vues sont historiques : ils ne sont plus une baseline obligatoire et aucun comparatif V3 ne doit être ajouté à la CI.

Les invariants runtime issus de V6-Fast restent applicables tant que l'architecture V6 correspondante est en production.

Pour un chantier V7, lire `docs/V7-CLOUDFLARE-BACKEND.md` puis uniquement le lot V7 concerné.
V6-WHAOU et V7 sont deux chantiers séparés : un lot V6-WHAOU ne doit pas engager de changement backend ou de migration V7.

## Données de production
L'application actuelle contient des données IndexedDB de production à considérer comme irremplaçables jusqu'à validation de V7.

Interdictions sans chantier explicite :
- reset ou suppression de la base ;
- suppression destructive d'un object store ;
- remplacement massif des enregistrements ;
- migration supposant une base vide ;
- suppression d'un dérivé transparent validé ;
- nettoyage des anciens Blobs avant validation de leur sort.

Toute évolution doit préserver IDs, relations et propriétés non éditées.

## Politique média active
Le moteur de détourage intégré a été retiré.

Pour l'affichage :
- un dérivé transparent validé est prioritaire ;
- les images de Donjons sont les seules images actives non détourées ;
- les anciens originaux à fond blanc, thumbnails et previews issus de ces originaux ne doivent plus servir de fallback normal ;
- la V6 actuelle ne supprime pas ces anciens Blobs : ils restent hors du chemin runtime.

Pour V7 :
- migrer uniquement les détourages actifs et les images de Donjons ;
- ne pas migrer les anciens originaux blancs, thumbnails ou previews ;
- les originaux de sécurité sont conservés hors application sur Google Drive.

## Invariants V6 issus de V6-Fast
Principes obligatoires :
- aucun chargement global de Blobs média au bootstrap ;
- lectures IndexedDB ciblées via les index existants ;
- Object URLs créées à la demande et libérées ;
- DOM média borné ;
- viewer et overlays locaux sans rerender global ;
- aucune dégradation volontaire de la qualité des détourages ;
- pas de nouveau store IndexedDB temporaire si les index actuels suffisent.

## CI
UI-6 est clos.

La CI active doit privilégier :
- une Fast CI courte sur les PR ;
- une Full CI ciblée/manuelle pour les scénarios coûteux ;
- aucun comparatif visuel maquette V3.

Les tests doivent protéger les risques actuels et éviter les assertions de pixels ou de temps arbitrairement fragiles.

## Responsive
Le comportement V6 validé reste la référence fonctionnelle actuelle :
- desktop : master-detail possible ;
- tablette Codex : Collection -> Fiche -> Retour ;
- téléphone : Collection -> Fiche -> Retour ;
- Atelier peut conserver liste + formulaire en tablette paysage.

Toute régression fonctionnelle doit être corrigée, mais les anciens documents UI ne sont plus des Gates actives.

## Workflow léger par tâche
1. pré-check compact : périmètre, données, IndexedDB, risque ;
2. construction continue ;
3. validation ciblée du périmètre ;
4. mise à jour documentaire uniquement si une décision durable change.

STOP sécurité données si une optimisation menace les données existantes.
STOP validation si une anomalie majeure rend la suite dangereuse.
