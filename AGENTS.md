# AGENTS.md - Gargottex V6

## Règle d'entrée obligatoire

Pour toute tâche concernant la refonte UI/UX V6, lire avant modification :

1. `docs/REFONTE-UI-UX-V6.md` — document maître et contrat de chantier ;
2. le document `docs/UI-X-*.md` du lot concerné ;
3. `docs/GARGOTTEX-V6-MAQUETTE-PREMIUM-V3.html` et ses ressources pour la référence visuelle ;
4. `docs/WORKFLOW-IMAGES-REMBG-V6.md` si la tâche touche des figurines/images détourées ;
5. le code de production réellement touché, notamment IndexedDB et Service Worker.

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

Pour le détourage :

- rembg ;
- IS-Net / DIS ;
- `isnet-general-use` ;
- original immutable ;
- dérivé transparent séparé ;
- contrôle alpha + contrôle visuel.

## Clôture d'une tâche

Une tâche UI n'est terminée que lorsque :

- comportement conforme au lot ;
- visuel comparé à V3 ;
- compatibilité IndexedDB vérifiée ;
- responsive vérifié ;
- aucune régression PWA/offline ;
- documentation mise à jour si la réalisation a fait évoluer une décision.
