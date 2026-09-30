# V6-Map V2 — lot 3 : affichage/masquage des donjons

**But :** fournir le contrôle ACTÉ ET VERROUILLÉ qui affiche ou masque les sprites de donjons sur les cartes concernées.

## Contenu et comportement

- Associer les treize illustrations disponibles aux implantations documentées D1–D6 et D9–D15.
- Utiliser les sprites de `assets/sprites/` comme surcouche aux fonds de `assets/maps/`, sans modifier les originaux.
- Fournir une commande explicite sous forme de bouton à bascule « Afficher les donjons » / « Masquer les donjons », avec état annoncé aux technologies d’assistance.
- Garder les repères non cliquables dans cette version ; le clic ou toucher sur un repère ne doit ni ouvrir une fiche ni provoquer une navigation.
- N’afficher les repères que sur les fonds où le registre place les donjons. Aucun donjon ne doit être inventé sur les autres continents ou Entrevers.
- D7/D8 sont les cartes entières de leur dimension respective et ne reçoivent pas de sprite ou marqueur additionnel.

## Confidentialité — limite connue

Le contrôle est une préférence d’affichage et non une règle d’accès. Il ne masque pas les fichiers intégrés de l’application et ne garantit pas le secret d’un donjon. L’interface ne devra pas prétendre que les contenus sont filtrés par campagne, que le bouton réserve une vue au MJ, ou que les coordonnées sont protégées. Le périmètre actuel assume cette limite : le bouton est un affichage/masquage, pas une protection MJ/joueur.

## Gate

- Le bouton masque et réaffiche tous les sprites présents sur la carte sans affecter le fond.
- L’état initial du bouton et sa persistance éventuelle doivent être décidés explicitement pendant l’implémentation, puis être identiques entre le libellé, l’état visuel et l’état accessible. Ne pas inférer une préférence utilisateur non exprimée.
- Pas de clic ouvrant un donjon, pas de fuite de comportement implicite.
- Vérification visuelle sur une carte dense et sur une carte ayant un seul marqueur ; les 13 fichiers se chargent correctement à la demande.
