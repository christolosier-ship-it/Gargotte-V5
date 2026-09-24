# Gargottex V6-Fast — Optimisation runtime et CI

## Statut
DOCUMENT MAÎTRE — chantier actif.

## Objectif
V6-Fast optimise Gargottex V6 sans refonte visuelle et sans changement fonctionnel volontaire.

Le chantier vise en priorité :
- un démarrage nettement plus léger ;
- une bibliothèque Média stable avec plusieurs centaines d'images ;
- l'absence de crash lors de consultations répétées en plein écran ;
- une consommation mémoire bornée ;
- une CI courte et adaptée aux risques actuels ;
- une architecture de lecture média réutilisable par V7.

## Constat de départ
L'audit de V5.3 a confirmé plusieurs causes structurelles :
- loadAllData charge media_assets avec les Blobs au démarrage ;
- rebuildMediaCache crée des Object URLs pour toutes les variantes de tous les médias ;
- refreshData relit l'ensemble de la base après de petites écritures ;
- les grilles Média montent l'ensemble des cartes ;
- ouvrir ou fermer une image plein écran appelle le renderer global ;
- toasts et overlays déclenchent eux aussi des rendus complets ;
- le diagnostic PWA/IndexedDB est sur le chemin critique du bootstrap ;
- le Service Worker privilégie le réseau pour l'app-shell ;
- seed-data et des modules lourds sont chargés même lorsqu'ils ne sont pas nécessaires ;
- la CI UI-6 rejoue encore une recette de fin de refactorisation qui est désormais close.

## Décisions déjà prises

### UI-6
UI-6 est clos et archivé dans docs/archive/v6-ui-ux.

La maquette V3 reste un historique. Elle n'est plus une baseline obligatoire.
Le job de comparaison visuelle V3 n'a plus de valeur pour la CI active et doit être retiré au Lot 1.

### Politique média V6-Fast
La qualité visuelle ne doit pas être sacrifiée pour gagner en performance.

Règle d'affichage cible :
- si un dérivé détouré validé existe, il est le visuel actif et prioritaire ;
- les images de Donjons restent les seules images actives non détourées ;
- les anciens originaux à fond blanc, thumbnails et previews issus de ces originaux ne doivent plus être utilisés dans les parcours d'affichage normaux ;
- V6-Fast ne supprime toutefois pas ces anciens Blobs d'IndexedDB : ils restent intacts jusqu'à un nettoyage ultérieur explicitement validé.

Le plein écran doit utiliser le visuel actif en pleine qualité.

Pour les petites cartes, une représentation d'affichage temporaire peut être calculée à partir du détourage actif si des mesures réelles montrent que cela est nécessaire. Elle doit :
- provenir du détourage, jamais de l'ancien original blanc ;
- conserver l'alpha ;
- être dimensionnée en fonction de la taille réellement affichée et du devicePixelRatio ;
- ne pas remplacer la source haute qualité ;
- rester non persistée tant qu'une persistance n'est pas réellement justifiée.

### Périmètre média V7
V7 ne migrera vers R2 que :
- les images détourées actives ;
- les images de Donjons, qui restent non détourées.

Les anciens originaux blancs, anciens thumbnails et anciennes previews ne seront pas migrés.
Les originaux de sécurité sont conservés hors application sur Google Drive.

Jusqu'à validation de V7, V6-Fast ne détruit rien automatiquement dans IndexedDB.

## Principes d'architecture

### 1. Charger à la demande
Aucun Blob média ne doit être chargé uniquement parce que l'application démarre.

Le store media_assets possède déjà les index entity_type, entity_id et path. V6-Fast doit exploiter ces index et des lectures ciblées au lieu de créer un nouveau store intermédiaire.

### 2. Séparer donnée métier et binaire
Les vues ne doivent plus dépendre directement de l'ensemble de state.data.media_assets.

Introduire une couche d'accès média claire, appelée par l'UI, qui puisse aujourd'hui lire IndexedDB et demain être remplacée par une implémentation D1/R2 sans réécrire toutes les vues.

### 3. Object URLs à durée de vie contrôlée
Interdit :
- cache global construit au démarrage ;
- Object URL conservée sans consommateur ;
- reconstruction totale du cache après une écriture locale.

Les URLs doivent être créées à la demande puis libérées lorsque leur vue ou leur consommateur disparaît.

### 4. Rendu local plutôt que rendu global
Une action locale ne doit pas reconstruire toute l'application.

Exemples :
- ouvrir/fermer le viewer ;
- afficher/retirer un toast ;
- changer une page de galerie ;
- mettre à jour un seul média.

### 5. DOM borné
Une collection de 400 médias ne doit pas créer 400 cartes image actives en même temps.

La solution peut être une virtualisation, une fenêtre glissante, une pagination ou un mécanisme équivalent, à condition que le nombre d'éléments média montés et de bitmaps actifs reste borné.

### 6. Mesurer les vrais risques
Les tests de performance doivent vérifier les invariants qui ont réellement provoqué les problèmes :
- Blobs chargés au bootstrap ;
- Object URLs vivantes ;
- nombre de cartes média montées ;
- rerenders globaux ;
- comportement avec de vrais Blobs transparents ;
- répétition ouverture/fermeture plein écran.

Les seuils arbitraires de pixels ou de timing ne doivent pas devenir des sources de flaky.

## Découpage

### Lot 1 — CI V6-Fast
docs/V6-FAST-LOT-1-CI.md

Objectif : fermer réellement l'héritage UI-6 et obtenir une CI courte avant les gros changements.

### Lot 2 — Runtime média
docs/V6-FAST-LOT-2-RUNTIME-MEDIA.md

Objectif : supprimer le chargement global des médias, introduire l'accès lazy et arrêter les refresh globaux.

### Lot 3 — Rendu média et overlays
docs/V6-FAST-LOT-3-RENDU-MEDIA.md

Objectif : borner le DOM et la mémoire, isoler viewer/toasts/overlays du renderer global.

### Lot 4 — Bootstrap, PWA et modules
docs/V6-FAST-LOT-4-BOOTSTRAP-PWA.md

Objectif : alléger le chemin critique de démarrage et le chargement des modules.

## Ordre obligatoire
Exécuter 1 → 2 → 3 → 4.

Le Lot 3 suppose la couche média du Lot 2.
Le Lot 4 se fait après stabilisation des médias afin de mesurer correctement ce qu'il reste à optimiser.

## Règle de session
Au début de chaque lot :
1. lire ce document maître ;
2. lire uniquement le document du lot ;
3. inspecter l'état réel de V5.3 et les changements fusionnés depuis la rédaction ;
4. vérifier le résultat du lot précédent ;
5. ne pas anticiper les lots suivants sauf nécessité de compatibilité.

En fin de lot :
1. exécuter les tests du périmètre ;
2. vérifier la Gate ;
3. documenter les écarts techniques utiles ;
4. laisser la branche dans un état stable ;
5. ne pas lancer le lot suivant automatiquement.

## Sécurité données
STOP immédiat si une optimisation nécessite :
- suppression ou reset IndexedDB ;
- perte de media_assets ;
- réécriture destructive de Blobs ;
- modification silencieuse des relations ;
- suppression d'un détourage validé ;
- nettoyage des anciens originaux avant validation explicite de V7.

V6-Fast optimise les lectures et le rendu. Ce n'est pas un chantier de nettoyage destructif.

## Hors périmètre
- nouvelle refonte UI/UX ;
- comparaison avec la maquette V3 ;
- nouveau moteur de détourage ;
- migration Cloudflare V7 elle-même ;
- suppression des anciens originaux blancs ;
- nouvelles fonctions gameplay.

## Critère de clôture V6-Fast
Le chantier est clos lorsque :
- la CI quotidienne est courte et centrée sur les risques réels ;
- aucun Blob média global n'est requis pour afficher l'application au démarrage ;
- les médias sont lus à la demande ;
- les vues Média gardent une empreinte DOM/mémoire bornée ;
- le viewer n'entraîne plus de reconstruction globale ;
- les refresh globaux liés aux petites écritures ont disparu ;
- le diagnostic et les fonctions lourdes ne bloquent plus le premier rendu ;
- PWA/offline restent fonctionnels ;
- les données IndexedDB existantes sont intactes ;
- le contrat V7 reste compatible avec la nouvelle couche d'accès média.
