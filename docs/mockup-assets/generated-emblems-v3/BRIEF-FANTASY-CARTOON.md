# Gargottex V6 — Emblèmes générés V3

Statut : **brief de relance pour génération d'image**

Cette V3 remplace la direction précédente, jugée trop sérieuse / héraldique.

## Règle absolue

Les sigils et icônes gameplay sont de **vrais petits logos illustrés générés en image**. Ils sont au même niveau de finition.

Ne pas les dessiner comme des pictogrammes SVG minimalistes, des glyphes SaaS ou de simples formes géométriques.

## Direction artistique commune

- fantasy cartoon premium, dans l'esprit Gargotte & Va-Nu-Pieds ;
- fun, vivant, expressif, légèrement absurde ;
- formes généreuses, silhouettes immédiatement reconnaissables ;
- détails peints / sculptés lisibles, sans surcharge ;
- finition de jeu de plateau haut de gamme ;
- contours francs, volumes légèrement exagérés, petites irrégularités charmantes ;
- métal, bois, cuir, pierre ou magie possibles selon le sujet, mais traités de façon cartoon ;
- palette chaude Gargottex, avec couleur fonctionnelle quand elle existe ;
- pas de texte dans le logo ;
- pas de personnage complet ;
- pas de photoréalisme ;
- pas d'anime ;
- pas de cyberpunk ;
- pas de blason royal solennel ;
- pas de sceau sacré trop noble ;
- pas de minimalisme corporate.

## Format cible

- carré 1:1 ;
- master 512×512 minimum ;
- fond transparent si possible ;
- sinon fond uni très sombre facilement détourable ;
- sujet centré avec marge de sécurité ;
- doit rester identifiable à environ 24–32 px dans la maquette ;
- doit rester joli à 80–120 px comme emblème de section.

## Famille A — Sigils créatures

### `sigil-basic`
Petit insigne simple et sympathique : pierre-totem cabossée ou bouclier rustique légèrement de travers, avec deux ou trois marques gravées. Gris/ivoire. Doit évoquer le combattant ordinaire mais attachant.

### `sigil-tactical`
Insigne malin : œil rusé, mini carte pliée ou cible bricolée avec flèche volontairement décalée. Vert. Sensation de créature qui a un plan, pas d'emblème militaire sévère.

### `sigil-special`
Éclat magique fantaisiste, étoile irrégulière ou petite fiole magique qui pétille. Bleu. Energie, surprise et bizarrerie.

### `sigil-brute`
Gros marteau court, poing cuirassé cartoon ou morceau de rocher fendu. Violet. Massif, drôle et immédiatement brutal.

### `sigil-miniboss`
Petite couronne un peu trop grande, trophée flamboyant ou casque théâtral. Ambre. Prestige assumé avec une pointe d'exagération.

### `sigil-boss`
Crâne monstrueux cartoon, masque grinçant ou couronne-crâne exagérée. Rouge. Spectaculaire et menaçant, mais toujours Gargotte, jamais dark fantasy réaliste.

## Famille B — Gameplay, même niveau premium

### `gameplay-hp`
Cœur fantasy cartoon robuste, légèrement gonflé, éventuellement cerclé de métal ou recousu façon objet magique. Rouge chaud + laiton discret.

### `gameplay-atk`
Deux armes fantasy cartoon croisées, volontairement un peu disproportionnées, avec impact visuel fort. Laiton/acier, petite étincelle possible. Doit être énergique, pas héraldique.

### `gameplay-def`
Bouclier bombé et cabossé, protections exagérées, petites marques de coups. Solide mais sympathique.

### `gameplay-range`
Cible bricolée, flèche plantée ou rayon magique qui dépasse légèrement. Lecture immédiate de portée/zone, mouvement visuel.

### `gameplay-actions`
Deux bottes d'aventurier, traces dynamiques ou petite sandale ailée cartoon. Donne envie de bouger, silhouette claire.

### `gameplay-threat`
Petit crâne alarmé, bombe fantasy, panneau de danger bricolé ou œil menaçant. Doit exprimer « ça sent mauvais » avec humour visuel.

### `gameplay-base`
Socle de figurine stylisé, vu en légère perspective, avec quelques cailloux ou fissures. Doit rappeler immédiatement une miniature de jeu de plateau.

### `gameplay-ai`
Petit cerveau rusé, œil avec sourcil expressif ou masque tactique cartoon. Intelligence/comportement, pas robotique.

### `gameplay-loot`
Bourse trop pleine, coffre qui déborde ou petit tas de pièces et gemmes. Gourmand, attirant, immédiatement lisible.

### `gameplay-lore`
Vieux livre vivant ou grimoire entrouvert avec plume, signet ou petit éclat magique. Narratif, chaleureux, pas religieux.

### `gameplay-dungeon`
Petite porte de donjon tordue, tourelle trapue ou entrée de cave fantasy avec torche. Doit évoquer une aventure qui commence, pas une forteresse austère.

## Intégration maquette

Quand les images sont générées et validées, elles seront placées sous :

```text
docs/mockup-assets/generated-emblems-v3/
  sigil-basic.png
  sigil-tactical.png
  sigil-special.png
  sigil-brute.png
  sigil-miniboss.png
  sigil-boss.png
  gameplay-hp.png
  gameplay-atk.png
  gameplay-def.png
  gameplay-range.png
  gameplay-actions.png
  gameplay-threat.png
  gameplay-base.png
  gameplay-ai.png
  gameplay-loot.png
  gameplay-lore.png
  gameplay-dungeon.png
```

La maquette V2 reste intacte tant que cette famille n'est pas réellement générée et intégrée. Une V3 HTML séparée sera créée seulement lorsque les ressources image seront disponibles.
