# Gargottex V6 - UI-5 Administration, Médias & Synchronisation

## Statut

**VERROUILLÉ - source de vérité pour l'Atelier, l'Auth visible, les Médias, les Imports/Exports, la synchronisation et les diagnostics**

Ce document décrit les comportements visibles par l'utilisateur. Les détails de stockage, de transport et de sécurité appartiennent à `REFACTORISATION-V6-LOCAL-FIRST-NEON.md` et ne sont pas recopiés ici.

Principe directeur :

> **Toute action d'administration doit être compréhensible, volontaire et impossible à confondre avec une simple consultation.**

---

# 1. Décisions verrouillées

1. L'Atelier utilise un bouton **Enregistrer** explicite.
2. Il n'existe pas d'auto-save à chaque frappe.
3. Quitter une fiche modifiée sans enregistrer déclenche un avertissement.
4. Sur téléphone, Enregistrer reste accessible dans une barre sticky.
5. La suppression n'est jamais déclenchée directement depuis une carte de collection.
6. Les actions destructives vivent dans une zone Danger.
7. Médias propose au minimum `Tous | Liés | Orphelins`.
8. Les états média distinguent présence locale et sauvegarde distante.
9. Tout import massif passe par une preview avant écriture.
10. Preview : lignes valides, avertissements, erreurs et effet prévu.
11. JSON, XLSX et originaux médias restent des mécanismes distincts.
12. Un statut de synchronisation discret reste accessible dans la topbar.
13. `Enregistré localement` et `Synchronisé avec Neon` ne sont jamais confondus.
14. Une erreur Neon ne bloque pas le travail local.
15. `Réessayer` est disponible lorsque la synchronisation échoue.
16. Journal/diagnostic reste secondaire, en drawer ou panneau dédié.
17. Le diagnostic synthétique précède les logs bruts.
18. Copier/Exporter le diagnostic est disponible.
19. Vider le journal demande confirmation et ne touche jamais au Codex.
20. Aucun second backend média n'est introduit par l'UI.
21. L'original média n'est jamais recompressé, redimensionné ou converti par l'interface.
22. Pour les figurines qui nécessitent un fond transparent, **IS-Net / DIS** est le moteur de détourage de référence validé par la maquette. Le résultat est un dérivé d'affichage ; l'original reste intact.

---

# 2. Atelier

## 2.1 Rôle

Le Codex consulte. L'Atelier crée, modifie et supprime.

Familles éditables : Donjons, Créatures, Héros, PNJ, Quêtes, Loot, Objets interactifs, Brouhaha.

## 2.2 Desktop / tablette paysage

Composition : collection/recherche à gauche, formulaire à droite.

## 2.3 Tablette portrait

Formulaire prioritaire, collection dans un drawer si nécessaire.

## 2.4 Téléphone

`Liste -> Fiche d'édition plein écran -> barre Enregistrer`.

---

# 3. Enregistrement et dirty state

Une fiche distingue :

- non modifiée ;
- modifiée non enregistrée ;
- enregistrement local en cours ;
- enregistrée localement ;
- synchronisation distante en attente ;
- synchronisation en cours ;
- synchronisée ;
- erreur de synchronisation.

Après clic sur `Enregistrer` :

1. validation ;
2. écriture locale immédiate ;
3. mise à jour de l'interface ;
4. synchronisation distante ensuite.

L'interface n'affiche jamais `Synchronisé` avant confirmation distante.

Si l'utilisateur quitte avec des changements non enregistrés :

`Rester | Quitter sans enregistrer | Enregistrer`.

---

# 4. Formulaires

Les sections suivent la hiérarchie métier de la fiche Codex correspondante.

Exemple Créature :

```text
Identité
Gameplay
Compétence
IA / comportement
Loot
Lore
Médias liés
Métadonnées
```

L'objectif est d'éviter un formulaire monolithique tout en gardant les champs essentiels rapidement accessibles.

---

# 5. Création et suppression

## Création

`+ Nouvelle ...` ouvre une vraie fiche d'édition, pas une petite modal.

Avant Enregistrer, la nouvelle entrée reste un brouillon UI.

## Suppression métier

La suppression se trouve dans la zone Danger de la fiche.

La confirmation rappelle l'entité ciblée et les impacts connus calculables depuis les relations existantes.

Aucune cascade métier n'est inventée par l'UI.

---

# 6. Auth visible

UI-5 définit seulement les états visibles, pas l'implémentation Auth.

États minimum :

- session en vérification ;
- connecté ;
- hors ligne avec travail local disponible ;
- session expirée / reconnexion nécessaire ;
- erreur Auth distante.

Règles :

- l'accès distant et la synchronisation nécessitent une session valide ;
- une session expirée met la synchronisation en pause et propose `Se reconnecter` ;
- les données déjà disponibles localement restent utilisables selon les règles techniques V6 ;
- l'interface ne donne jamais l'impression que l'expiration Auth a supprimé les données locales ;
- aucune inscription publique n'est présentée comme parcours normal de Gargottex.

Le statut compte/Auth reste secondaire dans la topbar ou le panneau de synchronisation.

---

# 7. Médias : principes UX

La vue Médias doit permettre de comprendre :

1. à quelle entité le média est lié ;
2. si l'original existe sur cet appareil ;
3. si l'original est sauvegardé et vérifié à distance ;
4. si une action de téléchargement ou de retry est nécessaire.

L'original et la miniature sont toujours distingués.

Les détails techniques de stockage restent dans la documentation V6 technique.

---

# 8. États média

Libellés UX minimum :

- **Sur cet appareil uniquement** ;
- **Sauvegarde en cours** ;
- **Local + sauvegardé et vérifié** ;
- **Sauvegardé dans Neon, non téléchargé ici** ;
- **Téléchargement en cours** ;
- **Erreur de sauvegarde** ;
- **Original indisponible**.

`Original sauvegardé et vérifié` n'est affiché qu'après validation d'intégrité selon la règle technique V6.

---

# 9. Bibliothèque Médias

En-tête : Ajouter + recherche.

Filtres minimum :

`Tous | Liés | Orphelins`

Filtres complémentaires possibles selon besoin réel : type d'entité, entité liée, type de fichier, état local/distant, erreurs.

Une carte affiche :

- aperçu ;
- label / fichier ;
- entité liée ;
- statut lié/orphelin ;
- statut local/distant.

Le détail Média affiche les métadonnées utiles, le rattachement, la présence locale et l'état de sauvegarde.

---

# 10. Actions média

Les actions destructives sont volontairement séparées.

## 10.1 Retirer de cet appareil

Cette action supprime **uniquement la copie locale de l'original** et conserve la sauvegarde distante ainsi que le rattachement métier.

Elle n'est proposée que si une copie distante saine et vérifiée existe.

Après l'action, le média devient `remote_only` et peut être téléchargé à nouveau.

## 10.2 Supprimer définitivement

Cette action supprime le média comme ressource métier selon les règles techniques V6 et demande une confirmation forte.

La confirmation indique clairement :

- entité liée ;
- présence locale ;
- présence distante ;
- caractère définitif de l'action.

Si le média est `local_only`, l'interface avertit explicitement qu'aucune sauvegarde distante saine n'existe.

## 10.3 Télécharger l'original

Disponible pour un média distant non local.

Le média n'est déclaré sain localement qu'après validation d'intégrité.

## 10.4 Réessayer

Relance un transfert ou une vérification ayant échoué, sans dupliquer les opérations déjà confirmées.

---

# 11. Synchronisation globale

États UX :

- Synchronisé ;
- Synchronisation en cours ;
- modifications locales en attente ;
- hors ligne ;
- erreur de synchronisation.

Le panneau de détail sépare toujours :

- état local ;
- état Neon ;
- opérations structurées en attente ;
- médias en attente ou en erreur ;
- dernière synchronisation réussie.

Message de référence en cas d'erreur distante :

> Vos modifications sont enregistrées sur cet appareil. La sauvegarde distante n'a pas encore abouti.

Une erreur média distante ne supprime jamais l'original local sain.

---

# 12. Import / Export

La page distingue clairement :

1. JSON structuré ;
2. XLSX ;
3. Imports ;
4. état de sauvegarde des médias.

Le JSON et le XLSX ne prétendent pas contenir les originaux binaires.

## 12.1 Preview obligatoire

Avant toute écriture :

- total de lignes ;
- valides ;
- avertissements ;
- erreurs ;
- aperçu ;
- relations non résolues détectables ;
- création/mise à jour si déterminable de façon fiable.

## 12.2 Politique d'import verrouillée

- une ligne avec **erreur bloquante** est exclue de l'import ;
- une ligne avec **avertissement** reste importable ;
- si aucune ligne valide/importable ne reste, l'action Importer est désactivée ;
- la confirmation annonce explicitement combien de lignes seront réellement écrites ;
- après import, un résumé final indique importées, ignorées et erreurs restantes.

Aucune écriture locale ou distante n'a lieu avant confirmation utilisateur.

---

# 13. Journal et diagnostic

Le Journal reste secondaire.

Résumé avant logs :

- version / état PWA ;
- IndexedDB ;
- état Auth ;
- état sync ;
- files d'attente ;
- compteurs média utiles ;
- dernière erreur.

Les logs peuvent être filtrés par niveau.

Actions :

- Copier diagnostic ;
- Exporter diagnostic ;
- Vider journal.

Aucun secret, token ou contenu binaire n'est exposé dans le diagnostic.

`Vider le journal` supprime uniquement les logs techniques locaux.

---

# 14. Offline

Offline :

- l'Atelier continue de travailler sur le local ;
- Enregistrer écrit localement ;
- un nouveau média peut être ajouté localement ;
- JSON/XLSX local reste disponible ;
- les opérations distantes passent en attente ;
- un média `remote_only` ne peut évidemment pas être récupéré avant le retour réseau.

---

# 15. Responsive

UI-1/UI-6 portent les règles communes.

UI-5 impose :

- desktop : collection + formulaire, galerie média + détail ;
- tablette portrait : contenu principal prioritaire, éléments secondaires en drawer ;
- téléphone : flux séquentiel, formulaire plein écran, Enregistrer sticky, détail Média plein écran/sheet ;
- Import/Export et diagnostics restent des pages verticales lisibles plutôt qu'un master-detail artificiel.

---

# 16. Accessibilité

Obligations spécifiques :

- labels de formulaire permanents ;
- erreurs associées aux champs ;
- confirmations destructives explicites ;
- statuts compréhensibles sans couleur ;
- progression média annoncée textuellement ;
- focus géré dans modales/drawers ;
- toutes les actions critiques accessibles au clavier sur desktop.

Les objectifs mesurables et tests sont définis dans UI-6.

---

# 17. Gate UI-5

UI-5 est validée lorsque :

1. lecture et édition ne peuvent pas être confondues ;
2. une modification non enregistrée ne se perd pas silencieusement ;
3. local et distant sont toujours distingués ;
4. une panne Neon n'empêche pas le travail local ;
5. Auth expirée met la sync en pause sans faire croire à une perte locale ;
6. suppression métier et suppression média sont volontaires ;
7. `Retirer de cet appareil` est distinct de `Supprimer définitivement` ;
8. un média distant non local peut être identifié et récupéré ;
9. aucun original n'est dégradé ;
10. l'import ne peut pas écrire avant preview et confirmation ;
11. les lignes en erreur sont exclues, les warnings restent importables ;
12. le diagnostic ne révèle aucun secret ;
13. JSON/XLSX restent indépendants du cloud ;
14. aucun détail technique de stockage n'est dupliqué dans ce document.

**UI-5 devient la source de vérité pour l'administration, l'Auth visible, les Médias et la synchronisation côté utilisateur.**
