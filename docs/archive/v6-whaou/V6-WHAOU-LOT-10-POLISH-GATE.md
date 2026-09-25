# V6-WHAOU — Lot 10 — Polish transversal et Gate finale

## But

Uniformiser V6-WHAOU, corriger les incohérences apparues entre lots et valider la qualité réelle sur desktop, tablette/iPad, téléphone, offline et reduced motion.

Ce lot n'est pas un lot de rattrapage fonctionnel majeur.

## Pré-requis

Tous les lots 01 à 09 doivent être fusionnés ou explicitement marqués comme reportés.

Lire :
- AGENTS.md ;
- docs/V6-WHAOU.md ;
- décisions durables notées dans les lots précédents.

## A. Audit visuel transversal

Vérifier :
- intensité respective Codex / Partie / Brouhaha / Administration ;
- cohérence des rayons, bordures et ombres ;
- cohérence des entrées ;
- cohérence des figurines ;
- cohérence des sigils ;
- cohérence des accents Donjon ;
- absence de texture sous texte compact ;
- absence de décoration redondante.

Réduire plutôt qu'ajouter si une vue est devenue trop chargée.

## B. Motion

Inventorier les animations ajoutées.

Conserver seulement :
- celles qui signalent un changement réel ;
- celles qui créent un moment signature ;
- celles qui restent courtes.

Supprimer :
- doublons ;
- effets décoratifs répétitifs ;
- mouvements sans fonction.

Vérifier l'absence d'animations infinies coûteuses.

## C. prefers-reduced-motion

Tester toutes les familles :
- Accueil ;
- Donjon ;
- Créature ;
- Héros ;
- Quête ;
- Objet ;
- Brouhaha ;
- Générateur ;
- Médias ;
- Administration.

Aucune information ne doit manquer lorsque les animations sont désactivées.

## D. Responsive

### Desktop

- sidebar ;
- master-detail ;
- densité utile ;
- pas de grands espaces vides artificiels.

### Tablette / iPad

Cible prioritaire :
- Collection -> Fiche -> Retour ;
- grandes cibles tactiles ;
- pas de hover requis ;
- pas de contenu masqué sous navigation ;
- orientation portrait et paysage ;
- stabilité des grandes images ;
- pas de surconsommation GPU visible.

### Téléphone

- navigation bottom ;
- fiches séquentielles ;
- pas de débordement horizontal ;
- savebar Atelier correcte ;
- viewer correct.

## E. Accessibilité

Vérifier :
- contrastes ;
- focus visible ;
- aria existants préservés ;
- 44 px environ pour interactions principales ;
- couleur jamais seule ;
- overlays fermables ;
- navigation clavier desktop.

## F. Performance

Préserver explicitement les gains V6-Fast :
- bootstrap sans Blob média global ;
- media lazy ;
- Object URLs bornées ;
- pagination média ;
- viewer local ;
- toasts locaux ;
- diagnostic différé ;
- XLSX/ZIP lazy ;
- seed conditionnel.

Ajouter une mesure seulement si elle protège un invariant réel.

Ne pas introduire un budget de millisecondes arbitraire.

## G. PWA / offline

Vérifier :
- installation ;
- redémarrage ;
- réouverture offline ;
- assets V6-WHAOU nécessaires précachés si besoin ;
- update du service worker ;
- absence de dépendance réseau visuelle.

## H. Nettoyage

- retirer classes inutilisées créées pendant le chantier ;
- retirer animations abandonnées ;
- ne pas nettoyer les données ni Blobs ;
- ne pas réécrire massivement styles.css sans nécessité ;
- conserver l'historique utile.

## I. Documentation de clôture

À la fin :
- mettre docs/V6-WHAOU.md en statut CLOS si toutes les Gates sont validées ;
- noter les éventuels reports ;
- archiver les lots uniquement après fusion et validation globale ;
- mettre AGENTS.md à jour ;
- ne pas archiver de force une fonctionnalité non validée.

## Tests finaux

Exécuter :
- Fast CI complète ;
- Full CI Chromium ;
- Full WebKit iPad ;
- stress média ;
- offline ;
- update PWA ;
- import/export ;
- smoke des principales familles Codex ;
- session complète Générateur -> Brouhaha -> Quête ;
- Atelier dirty/save ;
- reduced motion.

## Gate finale V6-WHAOU

Le chantier est clos uniquement si :

1. aucune régression fonctionnelle critique ;
2. aucune migration donnée ;
3. aucune perte média ;
4. bootstrap V6-Fast intact ;
5. média lazy intact ;
6. iPad stable ;
7. offline stable ;
8. reduced motion complet ;
9. navigation et focus corrects ;
10. Donjon, Créature, Héros, Générateur et Brouhaha possèdent chacun une mise en scène identifiable ;
11. Administration reste sobre ;
12. l'ensemble paraît plus ambitieux sans paraître plus compliqué.

Le meilleur signe de réussite est que l'utilisateur ressente davantage Gargotte tout en ayant moins conscience de l'interface.
