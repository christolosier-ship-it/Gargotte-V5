# Gargottex V6 - UI-4 Accueil & Outils de partie

## Statut

**ACTIF - source de vérité des outils de session**

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
