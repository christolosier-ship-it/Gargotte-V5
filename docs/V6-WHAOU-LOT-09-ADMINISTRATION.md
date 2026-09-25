# V6-WHAOU — Lot 09 — Administration

## But

Donner à l'administration une identité d'établi et de registre sans diminuer sa précision.

Ce lot reste volontairement plus sobre que le Codex et la Partie.

## Pré-requis

Lire AGENTS.md et docs/V6-WHAOU.md.

Inspecter :
- renderAtelier ;
- renderWorkshopEditor ;
- renderWorkshopStatus ;
- dirty guard ;
- renderImportExport ;
- renderImportPreview ;
- renderDiagnosticPanel ;
- renderJournalDrawer.

## Atelier — liste

- familles comme plaques/tiroirs d'établi ;
- sélection légèrement enfoncée/éclairée ;
- images actives prioritaires ;
- fiches incomplètes repérables via états déjà connus ;
- toolbar conservée ;
- Nouveau reste immédiatement visible.

Ne pas transformer la liste en galerie narrative.

## Atelier — édition

- sections mieux séparées visuellement ;
- formulaire reste neutre ;
- aperçu image plus présent quand utile ;
- dirty state ambre ;
- saved state vert discret ;
- saving état clair ;
- petit feedback de succès sur le badge uniquement ;
- savebar toujours tactile et sticky selon responsive actuel.

### Zone Danger

Rester sérieuse :
- contraste clair ;
- aucun humour ;
- aucune ambiguïté ;
- confirmation actuelle conservée.

## Import

### Avant preview

- JSON et XLSX comme deux zones de réception cohérentes ;
- famille active + emblème ;
- message aucune écriture plus visible.

### Preview

- Total / Valides / Warnings / Erreurs comme contrôles d'inspection ;
- valides calmes ;
- warnings ambre ;
- erreurs rouges ;
- effet prévu très lisible ;
- bouton confirmer inchangé fonctionnellement.

### Bilan

- petit sceau/feedback terminé ;
- chiffres exacts conservés.

## Export

Présenter trois niveaux de sauvegarde :
- XLSX structuré ;
- JSON structuré ;
- Backup ZIP complet.

Le ZIP complet peut être visuellement plus important.

Ne jamais laisser croire que XLSX ou JSON structurés contiennent les Blobs.

Si un état de vérification ZIP existe déjà ou peut être exposé sans complexité, afficher clairement :
- préparation ;
- vérification ;
- prêt.

## Diagnostic

Direction instrumentation :
- compteurs ;
- voyants ;
- plaques ;
- état offline ;
- cache ;
- stockage ;
- service worker.

Toutes les valeurs restent textuelles.
La couleur n'est jamais le seul indicateur.

## Journal

Direction registre technique :
- niveau via bord latéral + texte ;
- message intégral ;
- date secondaire ;
- aucune blague dans le log.

## Contraintes

- aucune modification de la logique d'import ;
- aucune écriture avant confirmation ;
- aucune restauration ZIP destructive ;
- aucun changement IndexedDB ;
- diagnostic ne revient pas sur le chemin critique bootstrap ;
- pas de refresh global ajouté ;
- pas d'humour sur suppression ou erreur technique.

## Tests

- Atelier liste/édition ;
- dirty guard ;
- save ;
- delete modal ;
- Import JSON ;
- Import XLSX ;
- warning ;
- erreur ;
- export XLSX ;
- JSON ;
- backup ZIP ;
- diagnostic ;
- journal ;
- téléphone/tablette ;
- reduced motion ;
- Fast CI + scénarios Full Import/Export/PWA concernés.

## Gate Lot 09

Validé si :
- l'administration paraît appartenir à Gargotte ;
- elle reste la zone la plus calme et la plus précise ;
- aucun flux sensible n'est devenu ambigu ;
- bootstrap et PWA ne régressent pas.
