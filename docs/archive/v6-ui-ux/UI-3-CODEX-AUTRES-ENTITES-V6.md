# Gargottex V6 - UI-3 Codex : autres entités

## Statut

**LIVRÉ — UI-3 COMPLET (UI-3A + UI-3B + UI-3C + UI-3D) — 20 septembre 2026**

Références :

- document maître ;
- UI-1 ;
- UI-2 pour les patterns collection/fiche ;
- maquette V3.

Principe :

> **Même Gargottex, mais pas la même fiche.**

---

# 1. Découpage du lot

UI-3 est volontairement découpé.

## UI-3A - Donjons + Héros

Deux familles fortement éditoriales et illustrées.

## UI-3B - PNJ + Quêtes + Loot

Fiches narratives / contractuelles / objets.

## UI-3C - Objets interactifs + Brouhaha référentiel

Fiches orientées usage à la table.

## UI-3D - Transversal Codex

- navigation croisée ;
- `Voir tout` préfiltré ;
- recherche globale ;
- restauration du contexte ;
- relations ;
- libellés communs.

---

# 2. Modes de collection

| Famille | Initial | Alternative |
|---|---|---|
| Donjons | Galerie | Liste |
| Héros | Galerie | Liste |
| PNJ | Galerie | Liste |
| Quêtes | Liste | Cartes |
| Loot | Galerie | Liste |
| Objets interactifs | Liste | Galerie |
| Brouhaha | Cartes | Liste |

Le dernier mode choisi peut être mémorisé.

Tablette et téléphone :

`Collection -> Fiche -> Retour`

Desktop :

master-detail autorisé lorsque la fiche garde une largeur confortable.

---

# 3. Champs existants

La présentation doit respecter les données existantes.

## Donjon

- `name`
- `description`
- `floor_budgets`
- `boss_name`
- `tags`
- `image_path`

## Héros

- `hero_base_name`
- `level`
- `name`
- `role`
- `title`
- `pv`
- `atk`
- `def`
- `zone`
- `actions`
- `ability_text`
- `effect_text`
- `brouhaha`
- `tags`
- `image_path`

## PNJ

- `name`
- `race`
- `tone`
- `role`
- `lore`
- `tags`
- `image_path`

## Quête

- `name`
- `description`
- `objective`
- `reward`
- `difficulty`
- `npc_name`
- `dungeon_name`
- `tags`
- `image_path`

## Loot

- `creature_name`
- `name`
- `type`
- `effect`
- `gold_value`
- `tags`
- `image_path`

## Objet interactif

- `name`
- `dungeon_name`
- `type`
- `hp`
- `actions_allowed`
- `effect`
- `image_path`
- `tags`

## Brouhaha

- `level`
- `dungeon_name`
- `effect_text`

Ne pas imposer une migration uniquement pour embellir une fiche.

---

# 4. Donjons

## Collection

Carte :

- illustration ;
- nom ;
- numéro/contexte ;
- boss si présent ;
- quelques métadonnées utiles.

## Fiche

La composition V3 est la référence :

1. couverture / ambiance ;
2. identité ;
3. progression des étages ;
4. Boss final ;
5. aperçus Créatures ;
6. Quêtes ;
7. Objets interactifs ;
8. Brouhaha.

Le Donjon est un **hub**, pas une copie de toutes les collections.

### Étages

Le composant doit rester lisible pour :

- 5 étages ;
- 8 ;
- 10 ;
- plusieurs dizaines ;
- potentiellement 100.

L'esprit est volontairement légèrement chaotique, mais le numéro et le budget restent immédiatement lisibles.

Pour gros volumes :

- scroll horizontal/vertical ou segmentation ;
- jamais 100 cases tassées dans la largeur.

### Boss

La révélation théâtrale de la V3 est conservée comme option visuelle.

Si la relation créature n'est pas fiable, afficher seulement le nom.

### Voir tout

Doit réellement :

- ouvrir la famille cible ;
- appliquer le filtre Donjon ;
- conserver un retour vers le Donjon.

Un toast simulant cette action n'est pas suffisant en production.

---

# 5. Héros

## Collection

Une carte par `hero_base_name`.

Ne pas afficher quatre cartes séparées pour les quatre niveaux.

## Niveau initial

1. dernier niveau consulté s'il existe ;
2. sinon niveau disponible le plus bas.

## Fiche

La V3 devient la référence fonctionnelle et visuelle :

- image propre au niveau ;
- sélecteur horizontal N1/N2/N3/N4 ;
- stats du niveau ;
- compétence acquise au niveau ;
- **compétences des niveaux précédents cumulées et toujours visibles** ;
- `Brouhaha +X` affiché comme un tampon violent sur la compétence qui le génère.

Changer de niveau :

- ne change pas de héros ;
- met à jour image/stats ;
- conserve les compétences déjà acquises ;
- ne provoque pas de saut de scroll inutile.

Les images détourées suivent `WORKFLOW-IMAGES-REMBG-V6.md`.

---

# 6. PNJ

Le PNJ n'est jamais une Créature sans stats.

Fiche :

- portrait complet ;
- nom ;
- race ;
- rôle ;
- ton ;
- Lore ;
- Quêtes associées ;
- tags.

La maquette V3 de type « portrait narratif » sert de référence.

Ne pas inventer :

- PV ;
- ATK ;
- DEF ;
- Menace.

---

# 7. Quêtes du Codex

La Quête Codex est distincte du tirage de session UI-4.

Collection initiale : Liste.

Fiche :

- titre ;
- difficulté ;
- Donjon ;
- commanditaire ;
- description ;
- objectif ;
- récompense ;
- tags.

L'objectif doit être la zone la plus rapidement identifiable.

## Difficulté

- Très facile ;
- Facile ;
- Normale ;
- Difficile ;
- Très difficile ;
- Extrême.

Toujours texte + couleur.

Ne pas afficher une rangée de légende permanente si elle n'aide pas l'usage réel.

---

# 8. Loot

Loot est distinct des Objets interactifs.

Fiche :

- illustration ;
- nom ;
- rareté ;
- type ;
- effet ;
- valeur ;
- créature source ;
- provenance fiable ;
- tags.

Rareté :

- Mauvais ;
- Commun ;
- Inhabituel ;
- Rare ;
- Épique ;
- Légendaire.

Toujours texte + couleur.

Ne pas inventer une rareté absente dans les données existantes sans évolution métier validée.

---

# 9. Objets interactifs

Libellé utilisateur obligatoire :

> **Objets interactifs**

Ne plus utiliser « Objets du décor » comme nom de famille.

Fiche orientée table :

- illustration/schéma ;
- nom ;
- type ;
- Donjon ;
- PV si présent ;
- actions autorisées ;
- effet.

La maquette type « plan technique » est la référence visuelle.

Mode initial : Liste.

---

# 10. Brouhaha référentiel

À ne pas confondre avec UI-4.

Le Codex explique les effets possibles.

La session affiche le niveau courant et tire les effets.

Fiche :

- niveau ;
- Donjon/universel ;
- nom/label si disponible ;
- effet ;
- illustration liée si disponible.

L'intensité visuelle peut augmenter, mais le niveau reste textuel.

---

# 11. Recherche globale

La recherche globale doit réellement couvrir :

- Créatures ;
- Donjons ;
- Héros ;
- PNJ ;
- Quêtes ;
- Loot ;
- Objets interactifs ;
- Brouhaha lorsque pertinent.

La maquette actuelle ne constitue qu'un prototype de cette recherche.

Le résultat indique le type d'entité et ouvre la bonne fiche.

La recherche reste locale/offline.

---

# 12. Relations

Une relation visible doit venir :

- d'une clé existante ;
- d'un nom explicitement stocké ;
- d'une association non ambiguë.

Ne jamais créer une relation uniquement parce que deux textes se ressemblent.

Navigation croisée :

- conserver la collection d'origine ;
- conserver filtres/recherche ;
- fournir un retour compréhensible.

---

# 13. Restauration de contexte

Par famille :

- mode Galerie/Liste ;
- recherche ;
- filtres ;
- scroll ;
- sélection ;
- niveau Héros.

Après rotation tablette, ces états sont conservés.

---

# 14. Médias et images

Les images existantes restent intactes.

Les dérivés transparents :

- sont séparés des originaux ;
- suivent le workflow rembg ;
- peuvent servir en galerie et fiche.

Une image absente ne doit pas casser le layout.

---

# 15. Données anciennes

Tous les lecteurs doivent accepter :

- image absente ;
- tags absents ;
- relations partielles ;
- champ optionnel absent ;
- texte très long ;
- ancien enregistrement incomplet.

Une nouvelle UI ne force pas la réécriture de toutes les entités.

---

# 16. Gates UI-3

## Gate UI-3A

- Donjons complets ;
- progression scalable ;
- Héros groupés ;
- images par niveau ;
- compétences cumulées ;
- Brouhaha tampon ;
- tablette/téléphone séquentiels.

## Gate UI-3B

- PNJ narratif ;
- Quête Codex ;
- Loot ;
- modes par défaut ;
- rarité/difficulté accessibles.

## Gate UI-3C

- Objets interactifs ;
- Brouhaha référentiel ;
- aucun ancien libellé « Objets du décor ».

## Gate UI-3D

- recherche globale réelle ;
- relations fiables ;
- `Voir tout` préfiltré ;
- retour/contexte restauré ;
- aucune relation fictive.

---

# 17. Implémentation UI-3A sur V5.3

Statut : **LIVRÉ — 20 septembre 2026**

Périmètre fermé : **Donjons + Héros uniquement**. UI-3B, UI-3C et UI-3D ne sont pas démarrés par ce chantier.

## Pré-check

- IndexedDB : aucune migration, aucun store modifié, aucune réécriture d’entité lors de la lecture ;
- Donjons : lecture des champs historiques `name`, `description`, `floor_budgets`, `boss_name`, `tags`, `image_path`, avec tolérance des champs optionnels anciens ;
- Héros : regroupement en mémoire des enregistrements de niveaux existants par `hero_base_name` exact ;
- ancien Héros sans `hero_base_name` : isolé par ID, jamais fusionné par similarité de nom ;
- workflow image relu : original immutable, dérivé transparent séparé, fallback original autorisé lorsque aucun dérivé n’existe.

## Donjons

Livré :

- collection Galerie/Liste avec recherche locale, dernier mode et scroll mémorisés ;
- couverture majeure et ambiance pilotée par l’image réelle et, si présent, un accent explicitement stocké ; sinon accent V6 neutre ;
- description sans phrase d’ambiance inventée ;
- progression des étages en rail horizontal scrollable, lisible de quelques étages à plusieurs dizaines / 100 ;
- support de `base_floor_count` ancien sans exiger ce champ ;
- Boss final résolu par `boss_name` exact dans le Donjon, ou par un unique Boss catégorisé dans ce Donjon ; en cas d’ambiguïté, aucune Créature n’est choisie arbitrairement ;
- aperçus fiables Créatures, Quêtes, Objets interactifs et Brouhaha à partir de `dungeon_id`, avec fallback par nom exact seulement si le Donjon est unique ;
- ouverture des entrées d’aperçu via la navigation liée existante ;
- image/couverture absente ou illisible : fallback de mise en page, sans mutation média.

Le moteur transversal `Voir tout` préfiltré reste réservé à UI-3D conformément au découpage du document.

## Héros

Livré :

- une carte de collection par `hero_base_name` exact ;
- regroupement de tous les enregistrements de niveaux sans modification des données ;
- recherche locale, Galerie/Liste, sélection et scroll mémorisés ;
- dernier niveau consulté mémorisé par Héros dans `meta.ui_state` ;
- niveau initial = dernier niveau consulté s’il existe, sinon plus petit niveau disponible ;
- sélecteur N1/N2/N3/N4, avec niveaux absents désactivés et niveaux supplémentaires anciens conservés ;
- image propre à l’enregistrement du niveau sélectionné ;
- préférence aux dérivés transparents explicitement associés : champs de dérivé dédiés ou média lié par `entity_type + entity_id` avec métadonnée transparent/cutout/rembg ;
- aucun rapprochement de média par ressemblance de nom ;
- fallback sur l’original existant si aucun dérivé transparent n’existe, conformément au workflow ;
- stats du niveau courant ;
- compétences cumulées uniquement jusqu’au niveau courant ;
- `-` et `—` ne créent pas de fausse compétence ;
- tampon `Brouhaha +X` placé sur la compétence qui porte réellement la valeur ;
- changement de niveau sans changement de Héros et sans retour forcé en haut de page.

## Responsive

- grand desktop confortable : master-detail autorisé ;
- desktop plus étroit : fiche seule avec Retour ;
- tablette paysage/portrait : `Collection -> Fiche -> Retour` ;
- téléphone : `Collection -> Fiche -> Retour`.

## Données et médias

- `src/storage/idb.js` inchangé ;
- DB `gargottex-v5-offline`, version 2 attendue inchangée ;
- aucun original média remplacé ;
- aucun rembg lancé automatiquement par UI-3A ;
- aucun nouvel asset premium requis : UI-3A réutilise les ressources UI-1 déjà disponibles offline.

## Gate UI-3A

- Donjons complets : validé ;
- progression scalable : validé ;
- Héros groupés : validé ;
- images par niveau : validé ;
- compétences cumulées : validé ;
- Brouhaha tampon : validé ;
- tablette/téléphone séquentiels : validé.

**UI-3A est clos. UI-3 global reste ACTIF pour UI-3B / UI-3C / UI-3D.**

---

# 18. Implémentation UI-3B sur V5.3

Statut : **LIVRÉ — 20 septembre 2026**

Périmètre fermé : **PNJ + Quêtes Codex + Loot uniquement**. UI-3C et UI-3D ne sont pas démarrés par ce chantier.

## Pré-check

- aucune migration IndexedDB ;
- aucun champ métier réécrit par la lecture ;
- relations PNJ/Quête et Loot/Créature résolues d'abord par ID, puis par nom exact uniquement lorsque le candidat est unique ;
- aucune similarité approximative de nom ;
- Quête Codex rendue uniquement depuis le store `quests`, sans réutiliser la Quête de session ;
- Loot rendu uniquement depuis `loot_items`, sans fusion avec les Objets interactifs.

## PNJ

Livré :

- collection Galerie/Liste avec recherche locale, mode, sélection et scroll mémorisés ;
- fiche narrative V3 avec portrait complet, identité, race, rôle, ton et Lore ;
- Lore sur matière papier ;
- aucune statistique PV / ATK / DEF / Menace ajoutée ;
- Quêtes associées uniquement via `npc_id` ou, à défaut, `npc_name` exact si le PNJ est unique ;
- ouverture de la Quête liée via la navigation Codex existante ;
- image absente/illisible réduite proprement sans mutation média.

## Quêtes Codex

Livré :

- mode initial Liste ;
- mode Cartes alternatif ;
- recherche locale et contexte mémorisé ;
- difficulté texte + couleur sur six paliers : Très facile, Facile, Normale, Difficile, Très difficile, Extrême ;
- compatibilité des anciennes valeurs numériques 1 à 6, sans réécriture de la valeur stockée ;
- valeur textuelle inconnue conservée textuellement avec style neutre ;
- commanditaire et Donjon reliés uniquement si la relation est fiable ;
- description ;
- objectif volontairement dominant visuellement ;
- récompense avec emblème premium ;
- Quête Codex distincte de la Quête de session UI-4.

## Loot

Livré :

- mode initial Galerie ;
- mode Liste alternatif ;
- recherche locale, mode, sélection et scroll mémorisés ;
- rareté texte + couleur uniquement lorsqu'un champ de rareté est réellement présent ;
- six raretés reconnues : Mauvais, Commun, Inhabituel, Rare, Épique, Légendaire ;
- aucune rareté déduite du type, du prix, des tags ou de la créature source ;
- type, effet et valeur affichés sans transformer une valeur absente en zéro ;
- source Créature via `creature_id`, avec fallback exact par `creature_name` uniquement si unique ;
- provenance Donjon affichée uniquement lorsque la Créature source est elle-même résolue de façon fiable vers un Donjon ;
- Loot et Objet interactif restent deux familles distinctes.

## Responsive

- grand desktop confortable : master-detail possible ;
- desktop plus étroit : fiche seule avec Retour ;
- tablette paysage/portrait : `Collection -> Fiche -> Retour` ;
- téléphone : `Collection -> Fiche -> Retour`.

## Données / offline

- `src/storage/idb.js` inchangé ;
- DB `gargottex-v5-offline`, version 2 inchangée ;
- aucun original média remplacé ;
- aucun nouvel asset nécessaire : logos PNJ, Quête, Loot, Donjon et Lore premium déjà précachés par UI-1.

## Gate UI-3B

- PNJ narratif : validé ;
- Quête Codex : validé ;
- Loot : validé ;
- modes par défaut : validés ;
- rareté/difficulté accessibles par texte + couleur : validées.

**UI-3B est clos. UI-3 global reste ACTIF pour UI-3C / UI-3D.**

---

# 19. Implémentation UI-3C sur V5.3

Statut : **LIVRÉ — 20 septembre 2026**

Périmètre fermé : **Objets interactifs + Brouhaha référentiel uniquement**. UI-3D n'est pas démarré par ce chantier.

## Pré-check

- aucune migration IndexedDB ;
- stores existants `interactables` et `brouhaha_effects` lus tels quels ;
- seed actuel : aucun Objet interactif et un effet Brouhaha universel de niveau 2 ; l'UI accepte donc aussi bien une collection vide que les données de production réelles ;
- aucune logique de session Brouhaha réutilisée dans les fiches Codex ;
- ressources premium V3 déjà disponibles offline.

## Objets interactifs

Livré :

- libellé utilisateur de famille : **Objets interactifs** ;
- mode initial Liste ;
- Galerie alternative ;
- recherche locale, mode, sélection et scroll mémorisés ;
- fiche type plan technique inspirée de la V3 ;
- nom, type, Donjon, PV lorsqu'il existe, actions autorisées, effet et tags ;
- valeur PV `0` conservée et affichée ;
- Donjon résolu par `dungeon_id`, puis `dungeon_name` exact uniquement si unique ;
- relation non résolue affichée comme donnée déclarée, sans lien fictif ;
- aucune confusion avec le Loot ;
- ancien libellé « Objets du décor » absent de l'UI de production ;
- anciens classeurs/backups utilisant la feuille `Objets` restent importables via un alias de lecture, tandis que les nouveaux exports utilisent `Objets interactifs`.

## Brouhaha référentiel

Livré :

- collection initiale Cartes ;
- Liste alternative ;
- tri par niveau numérique croissant lorsque disponible ;
- recherche locale, mode, sélection et scroll mémorisés ;
- niveau toujours visible textuellement ;
- Donjon relié uniquement si la relation est fiable ;
- valeur **Universel** uniquement lorsque ni `dungeon_id` ni `dungeon_name` ne sont renseignés ;
- nom/label historique affiché s'il existe, sinon libellé neutre `Effet niveau X` ;
- effet de référence au premier plan ;
- intensité visuelle graduée par le niveau sans masquer sa valeur textuelle ;
- écran explicitement marqué **Référentiel Codex** ;
- aucune action de tirage, aucun changement de niveau courant, aucune écriture dans `state.ui.brouhaha.history` ou `drawn`.

## Responsive

- grand desktop confortable : master-detail possible ;
- tablette paysage/portrait : `Collection -> Fiche -> Retour` ;
- téléphone : `Collection -> Fiche -> Retour`.

## Données / offline

- `src/storage/idb.js` inchangé ;
- DB `gargottex-v5-offline`, version 2 inchangée ;
- aucun original média modifié ;
- Service Worker inchangé : logos Objets interactifs, Brouhaha, Donjon, PV et Actions déjà précachés.

## Gate UI-3C

- Objets interactifs : validé ;
- Brouhaha référentiel : validé ;
- ancien libellé de famille supprimé de l'UI de production : validé ;
- séparation avec Brouhaha de session : validée ;
- responsive séquentiel tablette/téléphone : validé.

**UI-3C est clos. UI-3 global reste ACTIF pour UI-3D.**

---

# 20. Implémentation UI-3D sur V5.3

Statut : **LIVRÉ — 20 septembre 2026**

UI-3D ferme le lot transversal du Codex. **UI-3A + UI-3B + UI-3C + UI-3D sont désormais clos.**

## Recherche globale locale/offline

La recherche de la topbar est maintenant un moteur Codex réel sur les huit familles :

- Créatures ;
- Donjons ;
- Héros ;
- PNJ ;
- Quêtes ;
- Loot ;
- Objets interactifs ;
- Brouhaha référentiel.

Les Médias ne sont pas injectés artificiellement dans la recherche Codex.

Le moteur :

- lit uniquement `state.data` déjà chargé depuis IndexedDB ;
- ne dépend d'aucun réseau ;
- normalise casse et accents ;
- indexe les champs métier pertinents de chaque famille ;
- affiche les résultats groupés et typés ;
- ouvre directement la bonne fiche ;
- regroupe les Héros par `hero_base_name` et ouvre le niveau qui a réellement produit le résultat ;
- conserve le dernier niveau Héros consulté.

La présentation reprend la densité et la hiérarchie de la recherche V3, mais aucune donnée fictive de la maquette n'est utilisée.

## Voir tout depuis un Donjon

Les quatre aperçus fiables du hub Donjon disposent d'un vrai `Voir tout` :

- Créatures ;
- Quêtes ;
- Objets interactifs ;
- Brouhaha.

Le bouton :

1. calcule les relations avec les mêmes règles fiables que le hub ;
2. sauvegarde l'état complet de la collection cible ;
3. ouvre la vraie collection ;
4. applique le filtre Donjon réel ;
5. conserve le mode d'affichage et le tri ;
6. remet temporairement recherche/filtres secondaires/scroll à zéro pour montrer tout le contenu fiable du Donjon ;
7. propose un retour explicite au Donjon source ;
8. restaure à l'identique la recherche, les filtres, la sélection et le scroll précédents de la famille cible.

Aucun filtre n'est construit depuis une simple ressemblance de nom.

## Navigation croisée

La navigation liée existante a été consolidée :

- cible acceptée uniquement si `relationStore(type) + id` résout une entité réelle ;
- pile de retour persistée dans `meta.ui_state` ;
- position de scroll de la fiche source mémorisée dans la pile ;
- retour vers la fiche source et sa position ;
- niveau Héros restauré depuis l'ID du niveau réellement ouvert ;
- contexte temporaire `Voir tout` conservé pendant les navigations liées internes.

Une recherche globale ou un changement manuel de famille ferme proprement un éventuel contexte `Voir tout` et restaure d'abord la collection qu'il avait temporairement préfiltrée.

## Rotation / responsive

Tous les états transversaux restent dans `meta.ui_state` :

- famille ;
- fiche ouverte ;
- recherche ;
- filtres ;
- mode ;
- tri ;
- scroll ;
- niveau Héros ;
- pile de retour ;
- contexte Donjon temporaire.

La rotation tablette ne reconstruit donc pas une collection vide et les media queries V6 continuent d'imposer le flux séquentiel `Collection -> Fiche -> Retour` lorsque la largeur ne permet pas le master-detail confortable.

## Données

- `src/storage/idb.js` inchangé ;
- DB `gargottex-v5-offline`, version 2 inchangée ;
- aucune migration ;
- aucune réécriture d'entité métier ;
- Service Worker inchangé ;
- recherche et navigation entièrement locales/offline.

## Gate UI-3D

- recherche globale réelle : validée ;
- résultats typés et ouverture de la bonne fiche : validés ;
- relations fiables : validées ;
- `Voir tout` réellement préfiltré : validé ;
- retour Donjon + restauration du contexte cible : validés ;
- niveau Héros conservé : validé ;
- aucune relation fictive : validé.

# 21. Clôture du lot UI-3

Validation consolidée :

- **UI-3A** : Donjons + Héros, progression scalable, regroupement des niveaux et compétences cumulées ;
- **UI-3B** : PNJ narratifs, Quêtes Codex et Loot distincts de leurs outils/entités voisines ;
- **UI-3C** : Objets interactifs + Brouhaha référentiel, séparation stricte du Brouhaha de session ;
- **UI-3D** : recherche globale, navigation transversale, relations, préfiltrage et restauration de contexte.

**UI-3 est clos.**


---

# Polish post-lot — 21 septembre 2026

Ajustements validés sur la fiche Héros :

- la hauteur du portrait est bornée et **ne dépend plus du nombre de compétences cumulées** du niveau affiché ;
- la colonne d’identité reste calée en haut de fiche et ne s’étire plus avec le playbook ;
- l’ouverture d’une fiche Héros reprend le mouvement court de la maquette V3 : révélation éditoriale de la fiche et du portrait, avec défilement doux sur les vues séquentielles ;
- un changement N1/N2/N3/N4 ne rejoue pas cette animation d’ouverture ;
- prefers-reduced-motion neutralise la révélation ;
- aucune donnée Héros ni structure IndexedDB n’est modifiée.
