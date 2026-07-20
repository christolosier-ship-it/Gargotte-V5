# Gargotte & Va-Nu-Pieds — Le Château de Bastognac

Premier vertical slice jouable du jeu de plateau numérique, développé sous **Godot 4.6** et pensé pour un export Web tactile sur téléphone, tablette et ordinateur.

## Jouer

- Tournez le téléphone en paysage.
- Touchez un héros, puis une case adjacente pour le déplacer.
- Touchez une créature à portée pour attaquer.
- Utilisez le bouton de compétence pour l'action spéciale du héros.
- Nettoyez chaque étage et rejoignez l'escalier doré.

## Contenu de la V0.1

- 1 à 4 joueurs locaux contrôlant l'équipe sur le même écran.
- Cinq étages du Château de Bastognac.
- Quatre héros officiels de niveau 1.
- Seize créatures de Bastognac, dont le Baron Pas-Très-Terrifiant.
- Brouhaha 0–12, apparitions, catastrophes du décor et réduction par tour calme.
- Tables poussables, barils explosifs, piliers, grilles, torches et cases dangereuses.
- Export Web/PWA adapté à Safari sur iPhone.

## Lancer dans Godot

Ouvrir ce dossier avec Godot 4.6 puis lancer `game/Main.tscn`.

## Tester en ligne de commande

```bash
godot --headless --path . --editor --quit
godot --headless --path . --script game/SmokeTest.gd
godot --headless --path . --export-release "Web" build/web/index.html
```

## Sources de conception

Les statistiques, noms et capacités proviennent de Gargottex V5.3, de l'export `gargottex_export_2026-05-21.xlsx`, des règles V2 et des ressources du dossier Google Drive `Projet Gargotte`.
