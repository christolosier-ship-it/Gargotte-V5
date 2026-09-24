# AGENTS.md - Gargottex V6

## Règle d'entrée obligatoire

Pour toute tâche concernant la refonte UI/UX V6, lire avant modification :

1. `docs/REFONTE-UI-UX-V6.md` — document maître et contrat de chantier ;
2. le document `docs/UI-X-*.md` du lot concerné ;
3. `docs/GARGOTTEX-V6-MAQUETTE-PREMIUM-V3.html` et ses ressources pour la référence visuelle ;
4. le code de production réellement touché, notamment IndexedDB, médias et Service Worker.

## Données de production

L'application actuelle est une PWA en production avec des données existantes dans IndexedDB.

Ces données utilisateur ne sont pas disponibles dans le dépôt et doivent être considérées comme irremplaçables.

Interdictions sans chantier de migration explicitement validé :

- reset/suppression de la base IndexedDB ;
- suppression ou renommage destructif d'un object store ;
- remplacement massif des enregistrements existants ;
- remplacement d'un original média par un dérivé ;
- migration supposant une base vide.

Toute évolution doit rester compatible avec les anciens enregistrements et préserver IDs, relations, Blobs et propriétés non éditées.

## Architecture distante

La refactorisation Neon / synchronisation distante est reportée.

Ne pas introduire Neon, Auth distante ou nouveau backend dans un lot UI V6 sauf nouveau chantier explicitement demandé.

## Référence visuelle

La maquette V3 est la baseline pour :

- composition ;
- proportions ;
- émotion ;
- matières ;
- emblèmes ;
- responsive visuel.

Les documents UI sont la baseline pour :

- comportement ;
- données ;
- navigation ;
- états ;
- accessibilité ;
- gates.

Ne pas copier la logique fictive de la maquette lorsqu'un document UI définit le comportement réel.

## Responsive Codex

- desktop : master-detail possible ;
- tablette portrait/paysage : Collection -> Fiche -> Retour ;
- téléphone : Collection -> Fiche -> Retour.

L'Atelier suit UI-5 et peut conserver liste + formulaire en tablette paysage.

## Images

Le moteur de détourage intégré a été retiré après la campagne V6.

Règles toujours obligatoires :

- original média immutable ;
- dérivé transparent séparé dans les champs `transparent_*` ;
- aucun nettoyage ne supprime ou ne réécrit les dérivés existants ;
- les dérivés approuvés restent utilisables dans le Codex ;
- l'import manuel d'un PNG transparent reste autorisé avec contrôle alpha et contrôle visuel ;
- les métadonnées historiques de provenance sont conservées telles quelles.

## Workflow léger par tâche

Ne pas produire de compte rendu de Gate intermédiaire sauf si un risque réel doit être signalé.

Pour chaque tâche :

1. **Pré-check compact** : périmètre, impact données, IndexedDB, référence V3, risque principal.
2. **Construction continue** : UI + données si nécessaires + responsive, sans cérémonie séparée.
3. **Validation/clôture compacte** : tests, comparaison V3, non-régression données si pertinente, documentation mise à jour.

Deux seuls points d'arrêt obligatoires :

- **STOP sécurité données** : risque de perte, migration destructive, original média menacé ou compatibilité IndexedDB non démontrée ;
- **STOP validation** : anomalie bloquante/majeure ou comportement obligatoire non fonctionnel.

Une étape non applicable est notée `N/A`. Ne jamais créer du travail artificiel uniquement pour « passer une Gate ».

Les `Gate UI-X` des documents de lot restent des checklists d'acceptation de fin de lot, pas des cérémonies supplémentaires.
