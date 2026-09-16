# Gargottex V6 - UI-4 Accueil & outils de partie

## Statut

**VERROUILLÉ - source de vérité pour l'Accueil et les outils de session**

Ce document couvre : Accueil, Générateur, Brouhaha de session et Quêtes de session.

Principe directeur :

> **Pendant une partie, Gargottex doit réduire les sélections répétées et les gestes inutiles.**

UI-4 ne transforme pas Gargottex en moteur de campagne, VTT ou tracker de combat complet.

---

# 1. Contexte de partie partagé

Le contexte de partie est un état UI local et temporaire comprenant au minimum :

- donjon actif ;
- étage actif ;
- mode de rencontre ;
- rencontre générée éventuelle ;
- Brouhaha courant et historique ;
- quête tirée éventuelle.

Il ne s'agit pas d'une nouvelle donnée métier, ni d'une campagne longue durée.

Le même donjon est partagé entre Accueil, Générateur, Brouhaha et Quêtes de session.

---

# 2. Changement de donjon

Sans état de session significatif, le changement est immédiat.

Si une rencontre, un Brouhaha ou une quête tirée existe déjà, afficher une confirmation indiquant clairement que les états temporaires incompatibles seront remis à zéro.

Le Codex n'est jamais modifié par cette action.

---

# 3. Changement d'étage

L'étage appartient au contexte partagé mais concerne principalement le Générateur.

Règle verrouillée :

- sans rencontre générée, le changement est immédiat ;
- si une rencontre existe pour l'étage courant, demander confirmation ;
- après confirmation, invalider uniquement la rencontre courante et son état local associé ;
- le Brouhaha et la quête tirée ne sont pas réinitialisés par un simple changement d'étage.

---

# 4. Accueil

L'Accueil est le comptoir de départ et de reprise de Gargottex.

## 4.1 Sans session active

Afficher :

- identité Gargottex ;
- choix / reprise d'un donjon ;
- accès rapides ;
- quelques compteurs discrets.

La galerie média générique n'appartient plus à l'Accueil.

## 4.2 Partie en cours

Afficher un résumé directement actionnable :

```text
Donjon actif
Étage éventuel

Rencontre
Brouhaha
Quête

Terminer la partie
```

Chaque bloc ouvre l'outil correspondant sans redemander le donjon.

## 4.3 Terminer la partie

Confirmation obligatoire.

Cette action nettoie uniquement le contexte temporaire de session. Elle ne supprime aucune donnée métier, aucun média et aucune donnée synchronisée.

---

# 5. Générateur

## 5.1 Configuration

Ordre :

```text
Donjon actif
Étage
Mode de rencontre
Budget
Générer
```

Le mode de rencontre est exclusif :

`Normal | Mini-boss | Boss`

Une seule valeur peut être active.

Le budget vient des données métier existantes.

## 5.2 Après génération

Le résultat devient prioritaire. Les paramètres se compactent en résumé modifiable.

Le résultat distingue :

- Créatures ;
- Objets du décor.

Chaque entrée permet une ouverture rapide sans quitter la session.

## 5.3 Plusieurs exemplaires d'une même créature

Si une rencontre contient plusieurs exemplaires d'une même créature, l'état de session doit distinguer la **quantité restante**.

Règle verrouillée :

- `Éliminer` retire **une occurrence** ;
- chaque occurrence éliminée déclenche son tirage de Loot une seule fois ;
- la ligne reste visible tant qu'au moins une occurrence reste ;
- lorsque la quantité atteint zéro, le groupe est marqué éliminé / terminé.

Aucun tracker de PV individuel n'est introduit.

## 5.4 Mini-fiche de rencontre

Créature : image, nom, stats principales, capacité/comportement utile, ouverture fiche complète, `Éliminer`.

Objet du décor : nom, type, PV, actions autorisées, effet, ouverture fiche complète.

La mini-fiche réutilise la grammaire du Codex au lieu d'inventer une seconde présentation.

---

# 6. Ce que le Générateur ne devient pas

Hors périmètre :

- tracker de PV ;
- initiative ;
- ordre de tour ;
- conditions ;
- compteur de rounds ;
- carte tactique ;
- dés virtuels généralistes ;
- journal de combat complet.

---

# 7. Brouhaha de session

Principe :

> **Changer le niveau n'est pas tirer un effet.**

Hiérarchie :

```text
Donjon actif
Niveau 0-12
-1 / +1
Tirer un effet
Effet courant
Historique
Réinitialiser
```

Le niveau et le tirage sont deux actions distinctes.

`Réinitialiser` demande confirmation et remet à zéro le Brouhaha et son historique de session uniquement.

L'intensité visuelle peut augmenter avec le niveau, mais ne remplace jamais le texte ni les états accessibles.

---

# 8. Quêtes de session

La vue de session sert à **tirer et utiliser une quête**, pas à parcourir la bibliothèque complète.

La bibliothèque Quêtes appartient au Codex UI-3.

## 8.1 Avant tirage

Afficher : donjon actif + action principale `Tirer une quête`.

## 8.2 Après tirage

Afficher une fiche courte :

- nom ;
- difficulté ;
- PNJ éventuel ;
- description ;
- objectif ;
- récompense.

Actions :

- `Tirer à nouveau` ;
- `Ouvrir dans le Codex`.

## 8.3 Tirer à nouveau

Règle verrouillée : **le nouveau tirage remplace immédiatement la quête courante, sans modal de confirmation**.

La quête courante est un état temporaire de session, pas une donnée modifiée du Codex.

Aucun historique de quêtes tirées n'est ajouté dans UI-4.

---

# 9. Navigation entre outils

Lorsque le contexte existe, le passage entre Accueil, Générateur, Brouhaha et Quêtes doit être immédiat et conserver l'état courant.

Sur téléphone :

- `Jeu` donne accès à Générateur et Brouhaha ;
- Quêtes conserve son entrée dédiée ;
- le donjon actif reste visible de façon compacte dans les outils de session.

---

# 10. Responsive

Les règles globales appartiennent à UI-1/UI-6.

UI-4 impose seulement :

- grandes cibles tactiles ;
- faible profondeur de navigation ;
- action principale évidente ;
- résultat visible sans chercher ;
- pas de colonnes comprimées sur téléphone ;
- mini-fiches en drawer/sheet ou vue courte selon la largeur.

La tablette est une cible prioritaire pour l'usage autour d'une table.

---

# 11. Offline et synchronisation

Les outils de session travaillent sur les données locales disponibles.

Aucune action de session ne doit attendre Neon pour mettre l'interface à jour.

La synchronisation distante reste secondaire et ses états visibles sont définis dans UI-5.

---

# 12. États à gérer

Accueil : aucune session, session partielle, partie en cours, donjon manquant.

Générateur : aucun donjon, étage sans budget, aucun candidat compatible, résultat normal, rencontre partiellement consommée, rencontre terminée.

Brouhaha : niveau 0, historique vide, effet absent, niveau critique.

Quêtes : aucune quête disponible, quête tirée, PNJ absent, média absent.

---

# 13. Gate UI-4

UI-4 est validée lorsque :

1. le donjon n'est sélectionné qu'une fois pour une session normale ;
2. le contexte survit au passage entre outils ;
3. changer de donjon ne détruit jamais silencieusement l'état temporaire ;
4. changer d'étage avec rencontre demande confirmation puis invalide uniquement la rencontre ;
5. `Normal | Mini-boss | Boss` est exclusif ;
6. le résultat devient prioritaire après génération ;
7. `Éliminer` agit occurrence par occurrence et tire le Loot une seule fois par occurrence ;
8. le Générateur ne dérive pas vers un combat tracker ;
9. le Brouhaha sépare niveau et tirage ;
10. `Tirer à nouveau` remplace immédiatement la quête de session ;
11. la bibliothèque Quêtes reste dans le Codex ;
12. terminer une partie ne touche jamais aux données métier ;
13. les outils restent utilisables offline ;
14. aucun détail du design system ou de la synchronisation technique n'est dupliqué ici.

**UI-4 devient la source de vérité de l'Accueil et des outils de session.**
