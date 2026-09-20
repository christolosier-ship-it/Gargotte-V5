# Gargottex V6 - UI-4 Accueil & Outils de partie

## Statut

**LIVRÉ — UI-4 COMPLET — 20 septembre 2026**

Principe :

> **Pendant une partie, Gargottex réduit les sélections répétées et montre l'information utile avant la décoration.**

La session reste locale et temporaire.

---

# 1. SessionContext

État UI temporaire :

- Donjon actif ;
- étage actif ;
- mode Normal / Mini-boss / Boss ;
- rencontre générée ;
- quantités restantes ;
- Brouhaha courant ;
- historique Brouhaha ;
- quête tirée.

Ce contexte ne devient pas une campagne persistante complexe.

Il ne modifie pas les données métier du Codex.

---

# 2. Accueil

## Sans session

- identité Gargottex ;
- accès Codex ;
- démarrer/reprendre un contexte ;
- accès rapides.

## Partie en cours

Résumé actionnable :

- Donjon ;
- étage ;
- rencontre ;
- Brouhaha ;
- quête ;
- Terminer la partie.

La composition « comptoir » de la V3 sert de référence.

Éviter les petites phrases décoratives redondantes.

---

# 3. Terminer la partie

Confirmation obligatoire.

Nettoie uniquement :

- SessionContext ;
- rencontre ;
- Brouhaha session ;
- historique ;
- quête tirée.

Ne touche jamais :

- Codex ;
- IndexedDB métier ;
- médias ;
- imports ;
- préférences générales.

---

# 4. Changement de Donjon

Sans état temporaire : immédiat.

Avec rencontre/Brouhaha/quête :

- confirmation ;
- expliquer ce qui sera réinitialisé ;
- ne pas modifier le Codex.

---

# 5. Changement d'étage

Sans rencontre : immédiat.

Avec rencontre existante :

- confirmation ;
- invalider uniquement la rencontre de l'étage précédent.

Brouhaha et quête restent inchangés.

---

# 6. Générateur

Ordre :

1. Donjon ;
2. étage ;
3. mode ;
4. budget ;
5. Générer.

Mode exclusif :

`Normal | Mini-boss | Boss`

Le budget vient des données existantes.

Après génération, le résultat devient prioritaire et la configuration se compacte.

---

# 7. Résultat de rencontre

Deux types :

- Créatures ;
- Objets interactifs.

## Créature

Afficher :

- type/catégorie coloré ;
- image ;
- nom ;
- PV ;
- ATK ;
- DEF ;
- ACTION ;
- MENACE ;
- nom de Compétence ;
- quantité restante ;
- Fiche ;
- Éliminer.

La maquette V3 sert de référence visuelle.

## Objet interactif

Afficher :

- nom ;
- type ;
- PV si présent ;
- actions autorisées ;
- effet ;
- ouverture fiche.

---

# 8. Élimination

Si plusieurs occurrences :

- `Éliminer` retire une occurrence ;
- la quantité baisse ;
- le Loot est tiré une fois pour cette occurrence ;
- la ligne reste tant que quantité > 0 ;
- aucune gestion de PV individuel.

Le Générateur ne devient pas un tracker de combat.

---

# 9. Brouhaha session

Le comportement fonctionnel :

- niveau 0-12 ;
- -1 ;
- +1 ;
- Tirer un effet ;
- effet courant ;
- historique ;
- Réinitialiser.

Règle :

> **Changer le niveau n'est pas tirer un effet.**

La direction émotionnelle de la V3 est verrouillée :

- asymétrie ;
- pression ;
- fissures/traces ;
- agitation croissante ;
- commandes moins « tableau de bord » ;
- chaos contrôlé.

Le niveau et les actions restent parfaitement compréhensibles.

Avec reduced motion, la pression est transmise sans animation obligatoire.

---

# 10. Quêtes de session

Vue courte.

Après tirage :

- titre ;
- difficulté ;
- commanditaire ;
- description ;
- objectif ;
- récompense.

Actions :

- `Tirer à nouveau` ;
- `Ouvrir dans le Codex`.

`Tirer à nouveau` remplace immédiatement la quête temporaire.

Pas de confirmation.

---

# 11. Offline

Tous les outils de session fonctionnent avec les données locales disponibles.

Aucune étape n'attend un backend distant.

Un état réseau ne doit pas bloquer :

- Générateur ;
- Brouhaha ;
- Quêtes ;
- navigation locale.

---

# 12. Responsive

Téléphone :

- entrée `Jeu` ;
- onglets Générateur/Brouhaha ;
- Quêtes garde son entrée dédiée.

Tablette :

- priorité à la lisibilité autour d'une table ;
- résultats larges ;
- grandes cibles tactiles.

Desktop :

- densité utile ;
- raccourcis ;
- résultats lisibles sans profondeur inutile.

---

# 13. États à gérer

Accueil :

- aucune session ;
- session partielle ;
- session active.

Générateur :

- pas de Donjon ;
- budget absent ;
- aucun candidat ;
- rencontre active ;
- terminée.

Brouhaha :

- 0 ;
- historique vide ;
- critique.

Quêtes :

- aucune disponible ;
- tirée ;
- commanditaire absent.

---

# 14. Gate UI-4

1. contexte partagé réel ;
2. aucune sélection répétée inutile ;
3. changements Donjon/étage sûrs ;
4. résultat généré prioritaire ;
5. objets interactifs inclus ;
6. élimination occurrence par occurrence ;
7. pas de tracker de combat ;
8. Brouhaha fonctionnel + émotion V3 ;
9. quête de session distincte du Codex ;
10. Terminer la partie ne touche jamais aux données métier ;
11. fonctionnement offline.

---

# 15. Implémentation UI-4 sur V5.3

Statut : **LIVRÉ — 20 septembre 2026**

## SessionContext réel

UI-4 introduit un `state.ui.session` unique, persisté uniquement dans `meta.ui_state`.

Il contient :

- état actif/inactif ;
- Donjon actif ;
- étage ;
- mode `normal | mini_boss | boss` ;
- rencontre de session ;
- occurrences Créatures ;
- Objets interactifs référencés ;
- Brouhaha niveau/courant/historique ;
- ID de la Quête temporaire.

Aucun nouveau store IndexedDB n'est créé et aucune action de session n'appelle une écriture sur un store métier.

Une migration de compatibilité transforme à la lecture un ancien état temporaire `generator / brouhaha / questsResult` en SessionContext si une ancienne partie était réellement engagée.

## Accueil

Deux états distincts :

- aucune partie : identité Gargottex, accès Codex et démarrage explicite par Donjon ;
- partie active : comptoir de session avec Donjon, étage, rencontre, Brouhaha, quête et action `Terminer la partie`.

`Terminer la partie` demande confirmation puis nettoie uniquement l'état temporaire de session et ses anciens champs UI de compatibilité.

## Donjon et étage

Le Donjon actif est partagé entre Générateur, Brouhaha et Quête.

Changement de Donjon :

- immédiat sans état temporaire ;
- confirmation lorsqu'une rencontre, un Brouhaha ou une quête existe ;
- remise à zéro de ces trois états après confirmation ;
- aucune donnée Codex modifiée.

Changement d'étage :

- immédiat sans rencontre ;
- confirmation avec rencontre ;
- seule la rencontre est invalidée ;
- Brouhaha et quête restent intacts.

## Générateur

Ordre fonctionnel :

1. Donjon ;
2. étage ;
3. mode exclusif ;
4. budget réel du Donjon ;
5. génération.

Les modes sont `Normal | Mini-boss | Boss`.

Les pools utilisent uniquement les relations Donjon fiables déjà définies par le Codex. Les Créatures de Menace non positive sont exclues de la composition budgétaire afin d'éviter les boucles de génération.

Une rencontre stocke des occurrences locales de Créature par ID. Elle ne stocke aucun PV individuel et ne modifie jamais la fiche Créature.

Pour chaque groupe :

- catégorie ;
- image ;
- PV / ATK / DEF / ACTION / MENACE ;
- compétence si présente ;
- quantité restante ;
- accès Fiche ;
- `Éliminer`.

`Éliminer` consomme exactement une occurrence non éliminée. Le Loot est tiré une seule fois pour cette occurrence et enregistré uniquement dans la rencontre de session. La ligne disparaît lorsque sa quantité restante atteint zéro.

Les Objets interactifs générés restent des références vers le Codex et affichent nom, type, PV si présent, actions autorisées, effet et accès Fiche.

## Brouhaha de session

La mise en scène V3 est conservée dans une composition asymétrique à pression croissante :

- niveau très dominant ;
- commandes -1 / +1 latérales ;
- fissures et traces visuelles ;
- intensité croissante ;
- bouton de tirage séparé.

Fonctionnellement :

- niveau clampé 0-12 ;
- changer le niveau ne tire aucun effet ;
- tirage parmi les effets universels ou reliés de façon fiable au Donjon actif ;
- niveau 10+ conserve le comportement historique de deux effets lorsque disponibles ;
- effet courant séparé ;
- historique limité aux 20 derniers tirages ;
- reset Brouhaha indépendant de la session globale.

## Quête de session

Vue courte uniquement :

- titre ;
- difficulté ;
- commanditaire ;
- description ;
- objectif ;
- récompense.

`Tirer à nouveau` remplace immédiatement la quête temporaire sans confirmation. Lorsqu'il existe plusieurs candidats, le reroll évite la quête courante.

`Ouvrir dans le Codex` ouvre la vraie fiche Quête sans modifier la session.

## Offline et données

- aucune dépendance réseau ;
- aucun backend ;
- `src/storage/idb.js` inchangé ;
- Service Worker inchangé ;
- ressources visuelles déjà précachées par UI-1 ;
- les actions SessionContext écrivent uniquement `meta.ui_state` ;
- une relation Créature devenue indisponible pendant la session reste signalée comme telle et ne reçoit aucune catégorie de remplacement inventée.

## Gate UI-4

1. contexte partagé réel : validé ;
2. aucune sélection répétée inutile : validé ;
3. changements Donjon/étage sûrs : validés ;
4. résultat généré prioritaire : validé ;
5. Objets interactifs inclus : validé ;
6. élimination occurrence par occurrence : validée ;
7. aucun tracker de combat : validé ;
8. Brouhaha fonctionnel + émotion V3 : validé ;
9. quête de session distincte du Codex : validée ;
10. fin de partie sans mutation métier : validée ;
11. fonctionnement offline : validé.

**UI-4 est clos.**
