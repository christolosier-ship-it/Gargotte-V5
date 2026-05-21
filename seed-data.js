globalThis.GARGOTTEX_SEED = {
  "dungeons": [
    {
      "id": "dungeon_le-cabaret-des-joyeuses",
      "name": "Le Cabaret des Joyeuses",
      "slug": "le-cabaret-des-joyeuses",
      "description": "Donjon importé depuis le bestiaire Le Cabaret des Joyeuses.",
      "image_path": "assets/images/veloria.jpeg",
      "floor_budgets": [
        3,
        5,
        7,
        9,
        11
      ],
      "base_floor_count": 5,
      "boss_name": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "dungeon_le-ch-teau-de-bastognac",
      "name": "Le Château de Bastognac",
      "slug": "le-ch-teau-de-bastognac",
      "description": "Donjon importé depuis le bestiaire Le Château de Bastognac.",
      "image_path": "assets/images/logo-512.png",
      "floor_budgets": [
        3,
        5,
        7,
        9,
        11
      ],
      "base_floor_count": 5,
      "boss_name": "",
      "tags": [
        "le-chateau-de-bastognac"
      ]
    }
  ],
  "creatures": [
    {
      "id": "creature_gobelin-bricoleur",
      "name": "Gobelin Bricoleur",
      "slug": "gobelin-bricoleur",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "basique",
      "menace": 1,
      "pv": 2,
      "atk": 1,
      "def": 0,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "—",
      "special_attack_noise": 0,
      "ai_behavior": "Si un objet interactif est adjacent, il le lance sur un héros. Sinon il attaque. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Héros le plus proche",
      "socle": "32mm",
      "lore": "Gobelin persuadé d'être un génie de l'ingénierie. Ses inventions explosent souvent... mais rarement comme prévu.",
      "image_path": "",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_gobelin-lance-tout",
      "name": "Gobelin Lance-Tout",
      "slug": "gobelin-lance-tout",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "basique",
      "menace": 1,
      "pv": 2,
      "atk": 1,
      "def": 0,
      "zone": 3,
      "actions": 2,
      "special_attack_name": "—",
      "special_attack_noise": 0,
      "ai_behavior": "Reste à au moins 2 cases des héros et lance des objets. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Héros le plus proche",
      "socle": "32mm",
      "lore": "Si quelque chose peut être jeté… ce gobelin le jettera. Pierres, os, couteaux, chaussures… parfois même d’autres gobelins.",
      "image_path": "",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_squelette-maladroit",
      "name": "Squelette Maladroit",
      "slug": "squelette-maladroit",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "basique",
      "menace": 1,
      "pv": 3,
      "atk": 2,
      "def": 1,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "—",
      "special_attack_noise": 0,
      "ai_behavior": "Avance toujours vers le héros le plus proche. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Héros le plus proche",
      "socle": "32mm",
      "lore": "Mort-vivant un peu désarticulé qui se bat avec enthousiasme... mais pas toujours avec précision.",
      "image_path": "",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_squelette-tire-au-pif",
      "name": "Squelette Tire-au-Pif",
      "slug": "squelette-tire-au-pif",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "basique",
      "menace": 1,
      "pv": 2,
      "atk": 2,
      "def": 0,
      "zone": 4,
      "actions": 2,
      "special_attack_name": "—",
      "special_attack_noise": 0,
      "ai_behavior": "Tire sur le héros le plus éloigné visible. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Héros le plus éloigné visible",
      "socle": "32mm",
      "lore": "Contrairement aux archers ordinaires, celui-ci ne vise absolument rien. Il tire dans une direction et espère très fort que quelqu’un s’y trouve. Étonnamment… ça marche parfois.",
      "image_path": "",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_squelette-porte-placard",
      "name": "Squelette Porte-Placard",
      "slug": "squelette-porte-placard",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "basique",
      "menace": 1,
      "pv": 5,
      "atk": 1,
      "def": 2,
      "zone": 1,
      "actions": 1,
      "special_attack_name": "—",
      "special_attack_noise": 0,
      "ai_behavior": "Se place dans les passages étroits pour bloquer les héros. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Héros le plus proche",
      "socle": "32mm",
      "lore": "Il a passé tellement de temps enfermé dans un placard qu’il a développé un talent unique : bloquer les portes.",
      "image_path": "",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_balai-hant",
      "name": "Balai Hanté",
      "slug": "balai-hant",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "basique",
      "menace": 1,
      "pv": 2,
      "atk": 0,
      "def": 1,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "Grand Coup de Balai : repousse 1 héros adjacent de 1 case",
      "special_attack_noise": 0,
      "ai_behavior": "Se déplace en ligne droite et pousse les objets. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Héros le plus proche",
      "socle": "32mm",
      "lore": "Ancien balai du château possédé par un esprit domestique furieux. Son objectif est simple : remettre de l’ordre dans le donjon…",
      "image_path": "",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_gobelin-chef",
      "name": "Gobelin Chef",
      "slug": "gobelin-chef",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "tactique",
      "menace": 2,
      "pv": 6,
      "atk": 2,
      "def": 3,
      "zone": 1,
      "actions": 3,
      "special_attack_name": "Motivation Gobeline (passif) : gobelins à 3 cases +1 ATK",
      "special_attack_noise": 1,
      "ai_behavior": "Reste derrière les gobelins et leur donne des bonus. Si un objet interactif est adjacent, il le lance sur un héros. Sinon il se dirige vers un objet interactif. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Objet interactif le plus proche",
      "socle": "32mm",
      "lore": "Chef autoproclamé des gobelins. Sa stratégie repose surtout sur sa capacité à hurler des ordres incompréhensibles.",
      "image_path": "",
      "tags": [
        "tactique",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_cuisinier-zombie",
      "name": "Cuisinier Zombie",
      "slug": "cuisinier-zombie",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "tactique",
      "menace": 2,
      "pv": 5,
      "atk": 1,
      "def": 3,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "Soupe du Jour (ça bouge encore) : +1 PV aux monstres à 2 cases (ignore obstacles)",
      "special_attack_noise": 0,
      "ai_behavior": "Se rapproche d’un autre monstre pour le soutenir. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Créature la plus proche",
      "socle": "32mm",
      "lore": "Personne ne sait ce qu'il met dans sa marmite... mais les morts-vivants adorent.",
      "image_path": "",
      "tags": [
        "tactique",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_cloche-poss-d-e",
      "name": "Cloche Possédée",
      "slug": "cloche-poss-d-e",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "tactique",
      "menace": 2,
      "pv": 3,
      "atk": 0,
      "def": 1,
      "zone": 1,
      "actions": 1,
      "special_attack_name": "DRIIIING ! (Passif) : augmente de +1 le Brouhaha du donjon à chaque tour",
      "special_attack_noise": 1,
      "ai_behavior": "S'éloigne du héros le plus proche.",
      "ai_target_priority": "Fuite",
      "socle": "32mm",
      "lore": "Autrefois utilisée pour appeler les repas. Aujourd’hui elle appelle surtout les ennuis.",
      "image_path": "",
      "tags": [
        "tactique",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_fant-me-bureaucrate",
      "name": "Fantôme Bureaucrate",
      "slug": "fant-me-bureaucrate",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "tactique",
      "menace": 2,
      "pv": 8,
      "atk": 1,
      "def": 6,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "Formulaire 27-B Obligatoire : ignore blocages et traverse obstacles",
      "special_attack_noise": 0,
      "ai_behavior": "Occupe les portes et passages étroits pour bloquer l’accès. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Porte la plus proche",
      "socle": "32mm",
      "lore": "Mort au travail après avoir rempli le formulaire 847-B sans tampon officiel. Depuis, il est condamné a gérer l’accès aux couloirs du donjon.",
      "image_path": "",
      "tags": [
        "tactique",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_garde-poss-d",
      "name": "Garde Possédé",
      "slug": "garde-poss-d",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "tactique",
      "menace": 2,
      "pv": 6,
      "atk": 3,
      "def": 2,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "Protection Spectrale : monstres adjacents +1 DEF",
      "special_attack_noise": 0,
      "ai_behavior": "Protège le monstre le plus proche en se plaçant devant lui. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Créature la plus proche",
      "socle": "32mm",
      "lore": "Ancien soldat fidèle… toujours fidèle… même mort.",
      "image_path": "",
      "tags": [
        "tactique",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_poule-d-moniaque",
      "name": "Poule Démoniaque",
      "slug": "poule-d-moniaque",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "speciale",
      "menace": 3,
      "pv": 3,
      "atk": 0,
      "def": 1,
      "zone": 3,
      "actions": 2,
      "special_attack_name": "Omelette dans ta Tête : projectile œuf en or ATK 2 qui ignore DEF (ramassable)",
      "special_attack_noise": 1,
      "ai_behavior": "Lance des œufs sur les héros. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Héros le plus proche",
      "socle": "32mm",
      "lore": "Ancienne poule de ferme corrompue par la magie noire. Elle pond maintenant de l’or… et des problèmes.",
      "image_path": "",
      "tags": [
        "speciale",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_mimique-rat",
      "name": "Mimique Raté",
      "slug": "mimique-rat",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "speciale",
      "menace": 3,
      "pv": 4,
      "atk": 3,
      "def": 1,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "SURPRISE ! : première attaque +2 dégâts",
      "special_attack_noise": 1,
      "ai_behavior": "Ne peut pas se déplacer, attaque uniquement quand un joueur est adjacent.",
      "ai_target_priority": "Héros avec la DEF la plus faible",
      "socle": "40mm",
      "lore": "Un mimique qui n’a jamais vraiment compris comment imiter un coffre. Le panneau “I am treasure” était censé aider.",
      "image_path": "",
      "tags": [
        "speciale",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_ogre-maladroit",
      "name": "Ogre Maladroit",
      "slug": "ogre-maladroit",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "brute",
      "menace": 4,
      "pv": 14,
      "atk": 4,
      "def": 3,
      "zone": 1,
      "actions": 1,
      "special_attack_name": "Gros Bourrin (passif) : après attaque repousse tous les héros adjacents de 2 cases",
      "special_attack_noise": 1,
      "ai_behavior": "Avance tout droit vers les héros en poussant les objets. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Héros le plus proche",
      "socle": "40mm",
      "lore": "Très fort. Très dangereux. Très stupide. Il a déjà perdu un combat contre une porte.",
      "image_path": "",
      "tags": [
        "brute",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_chevalier-sans-cheval",
      "name": "Chevalier Sans Cheval",
      "slug": "chevalier-sans-cheval",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "mini_boss",
      "menace": 4,
      "pv": 10,
      "atk": 4,
      "def": 5,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "Charge Héroïque Imaginaire : charge 3 cases et +2 ATK",
      "special_attack_noise": 1,
      "ai_behavior": "Charge le héros le plus éloigné visible. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Héros le plus éloigné visible",
      "socle": "60mm",
      "lore": "Un chevalier tombé de son cheval… et qui ne s’en est toujours pas rendus compte...",
      "image_path": "",
      "tags": [
        "mini_boss",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_baron-pas-tr-s-terrifiant",
      "name": "Baron Pas-Très-Terrifiant",
      "slug": "baron-pas-tr-s-terrifiant",
      "dungeon_name": "Le Château de Bastognac",
      "dungeon_id": "dungeon_le-ch-teau-de-bastognac",
      "dungeon_slug": "le-ch-teau-de-bastognac",
      "category": "boss",
      "menace": 5,
      "pv": 16,
      "atk": 3,
      "def": 4,
      "zone": 2,
      "actions": 2,
      "special_attack_name": "Coup spécial 1 : Bégaiement Royal : +1 ATK à toutes les créatures pendant 1 tour. Coup spécial 2 : Renforts Inexplicables : invoque 2 squelettes",
      "special_attack_noise": 0,
      "ai_behavior": "Attaque le héros ayant le plus de PV. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer.",
      "ai_target_priority": "Héros avec le plus de PV",
      "socle": "80mm",
      "lore": "Personne ne sait vraiment qui il est. Un jour, il est simplement apparu dans le château avec une couronne. Depuis, tout le monde l’appelle “Baron” et il fait semblant que c’était prévu. Lui non plus ne comprend pas trop ce qui se passe.",
      "image_path": "",
      "tags": [
        "boss",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "creature_gobeline-aguicheuse",
      "name": "Gobeline Aguicheuse",
      "slug": "gobeline-aguicheuse",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 1,
      "pv": 4,
      "atk": 2,
      "def": 1,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "Regard Fatal — attire 1 héros de 1 case; s’il devient adjacent, il subit -1 DEF jusqu’à son prochain tour",
      "special_attack_noise": 1,
      "ai_behavior": "Isole la cible la plus proche puis la rapproche",
      "ai_target_priority": "Isolé > Faible DEF",
      "socle": "32mm",
      "lore": "Elle attire les héros comme un clin d’œil qui promet des ennuis et un peu trop de proximité. Une fois qu’on s’approche, elle considère déjà la partie gagnée.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_gobeline-serveuse-explosive",
      "name": "Gobeline Serveuse Explosive",
      "slug": "gobeline-serveuse-explosive",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 1,
      "pv": 3,
      "atk": 3,
      "def": 1,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "Service Détonnant — à sa mort, explosion en zone 1 infligeant 1 dégât et +2 bruit",
      "special_attack_noise": 2,
      "ai_behavior": "Se jette dans les groupes et force la mêlée",
      "ai_target_priority": "Groupe",
      "socle": "32mm",
      "lore": "Elle sert les verres avec une ardeur qui manque franchement de retenue. Chez elle, le cocktail finit souvent en rouge, en chaud et en très mauvaise idée.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_snorgle-sensuelle",
      "name": "Snorgle Sensuelle",
      "slug": "snorgle-sensuelle",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 1,
      "pv": 6,
      "atk": 2,
      "def": 2,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "Charme Gênant — un héros adjacent subit -1 ATK jusqu’à son prochain tour",
      "special_attack_noise": 0,
      "ai_behavior": "Colle les cibles dangereuses et parasite leur puissance",
      "ai_target_priority": "ATK élevée",
      "socle": "32mm",
      "lore": "Elle pense avoir le magnétisme d’une chanson interdite et l’assurance d’un rideau qui s’ouvre trop tard. Son charme laisse surtout les autres légèrement étourdis et très prudents.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_squelette-courtisane",
      "name": "Squelette Courtisane",
      "slug": "squelette-courtisane",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 1,
      "pv": 5,
      "atk": 2,
      "def": 2,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "Pas de Grâce — ignore la première attaque reçue à chaque tour",
      "special_attack_noise": 0,
      "ai_behavior": "Harcèle, puis change de cible dès qu’elle est menacée",
      "ai_target_priority": "Proche",
      "socle": "32mm",
      "lore": "Elle n’a plus de chair, mais elle a gardé le goût des regards appuyés et des entrées trop théâtrales. Chaque os claque comme une petite promesse de scandale.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_illusionniste-des-rideaux",
      "name": "Illusionniste des Rideaux",
      "slug": "illusionniste-des-rideaux",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 1,
      "pv": 5,
      "atk": 2,
      "def": 1,
      "zone": 2,
      "actions": 2,
      "special_attack_name": "Tour de Rideau — échange sa position avec une unité adjacente",
      "special_attack_noise": 1,
      "ai_behavior": "Se faufile sur les flancs et piège une cible exposée",
      "ai_target_priority": "Faible DEF",
      "socle": "32mm",
      "lore": "Elle surgit des drapés avec le sens du timing d’une confidence mal placée. Si elle te déplace, c’est rarement pour te laisser en meilleur état.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_plume-vivante-poss-d-e",
      "name": "Plume Vivante Possédée",
      "slug": "plume-vivante-poss-d-e",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 1,
      "pv": 3,
      "atk": 1,
      "def": 1,
      "zone": 1,
      "actions": 3,
      "special_attack_name": "Piqué de Cabaret — avance de 2 cases vers le héros le plus proche puis inflige 1 dégât au contact",
      "special_attack_noise": 1,
      "ai_behavior": "Suit la première ouverture et harcèle sans relâche",
      "ai_target_priority": "Couloir > Proche",
      "socle": "32mm",
      "lore": "On aurait dû la ranger dans une coiffe, mais elle a préféré faire carrière. Depuis, elle pique les héros avec un zèle qu’on ne trouve normalement que dans les histoires un peu trop bien froissées.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_h-tesse-dominante",
      "name": "Hôtesse Dominante",
      "slug": "h-tesse-dominante",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 2,
      "pv": 7,
      "atk": 2,
      "def": 3,
      "zone": 2,
      "actions": 2,
      "special_attack_name": "Rappel à l’Ordre — attire un héros de 2 cases; s’il finit adjacent, il subit -1 DEF pendant 1 tour",
      "special_attack_noise": 1,
      "ai_behavior": "Rassemble les intrus et les place à portée de ses alliés",
      "ai_target_priority": "Isolé > Faible DEF",
      "socle": "32mm",
      "lore": "Elle reçoit les invités avec une politesse si serrée qu’elle en devient presque indécente. Quand elle te place quelque part, c’est rarement là où tu comptais finir.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_ma-tresse-de-salle",
      "name": "Maîtresse de Salle",
      "slug": "ma-tresse-de-salle",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 2,
      "pv": 6,
      "atk": 2,
      "def": 2,
      "zone": 2,
      "actions": 2,
      "special_attack_name": "Ordre de Service — les alliés adjacents gagnent +1 ATK jusqu’à la fin du tour",
      "special_attack_noise": 1,
      "ai_behavior": "Reste derrière la ligne et renforce les alliés proches",
      "ai_target_priority": "Allié > Groupe",
      "socle": "32mm",
      "lore": "Elle tient la salle d’une main impeccable et d’un sourire qui n’annonce rien de très innocent. Elle sait faire avancer le service, les clients et parfois les respirations.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_cantatrice-envo-tante",
      "name": "Cantatrice Envoûtante",
      "slug": "cantatrice-envo-tante",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 2,
      "pv": 6,
      "atk": 3,
      "def": 2,
      "zone": 2,
      "actions": 2,
      "special_attack_name": "Refrain Lancinant — un héros à portée 2 subit -1 action à son prochain tour (min. 1)",
      "special_attack_noise": 1,
      "ai_behavior": "Chante au centre de la mêlée pour casser le rythme adverse",
      "ai_target_priority": "Groupe > Proche",
      "socle": "32mm",
      "lore": "Sa voix a le pouvoir rare de faire rougir les verres et trembler les genoux. Elle prétend chanter pour le plaisir, mais le cabaret a surtout l’air de subir un tête-à-tête un peu trop sonore.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_gardienne-des-bougies",
      "name": "Gardienne des Bougies",
      "slug": "gardienne-des-bougies",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 2,
      "pv": 5,
      "atk": 2,
      "def": 2,
      "zone": 2,
      "actions": 2,
      "special_attack_name": "Mèche Théâtrale — crée une case en feu adjacente; la première unité qui y entre ou y démarre subit 1 dégât",
      "special_attack_noise": 1,
      "ai_behavior": "Protège les accès en allumant les passages trop étroits",
      "ai_target_priority": "Couloir > Porte",
      "socle": "32mm",
      "lore": "Elle adore les ambiances chaudes, les flammes bien dressées et les rideaux qui prennent des initiatives. Son idée du confort inclut souvent un léger parfum de cendre.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_videuse-l-gante",
      "name": "Videuse Élégante",
      "slug": "videuse-l-gante",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 2,
      "pv": 8,
      "atk": 3,
      "def": 3,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "Sortie de Soirée — pousse une cible de 2 cases; si elle finit contre un obstacle, elle subit +1 dégât",
      "special_attack_noise": 1,
      "ai_behavior": "Tient les couloirs et renvoie les héros vers le décor",
      "ai_target_priority": "Couloir > Proche",
      "socle": "32mm",
      "lore": "Elle ne jette personne dehors, elle le raccompagne avec une grâce qui fait presque oublier la bosse dans le mur. Le problème, c’est qu’elle a l’élégance très persuasive.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_poule-d-moniaque",
      "name": "Poule Démoniaque",
      "slug": "poule-d-moniaque",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 3,
      "pv": 7,
      "atk": 3,
      "def": 2,
      "zone": 2,
      "actions": 2,
      "special_attack_name": "Couvoir Infernal — pose un œuf explosif sur une case adjacente libre; au début du prochain tour de monstres, l’œuf explose en zone 1",
      "special_attack_noise": 2,
      "ai_behavior": "Reste à portée, pond des œufs puis se retire derrière la ligne",
      "ai_target_priority": "Distance > Groupe",
      "socle": "32mm",
      "lore": "Elle pond des œufs comme d’autres laissent des cartes de visite, avec une confiance franchement obscène. Personne ne sait d’où elle vient, mais tout le monde sait qu’il faut reculer.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_diva-catastrophe",
      "name": "Diva Catastrophe",
      "slug": "diva-catastrophe",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "basique",
      "menace": 3,
      "pv": 8,
      "atk": 3,
      "def": 3,
      "zone": 2,
      "actions": 2,
      "special_attack_name": "Rafale de Scène — repousse toutes les unités adjacentes de 1 case; chaque collision avec un décor inflige +1 dégât",
      "special_attack_noise": 2,
      "ai_behavior": "Se place au cœur du plateau et transforme chaque contact en incident de scène",
      "ai_target_priority": "Groupe > Couloir",
      "socle": "32mm",
      "lore": "Elle entre en scène comme si tout le mobilier lui appartenait déjà. Entre deux notes, elle laisse derrière elle des cœurs battants, des verres cassés et un léger malaise.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_ogresse-videuse",
      "name": "Ogresse Videuse",
      "slug": "ogresse-videuse",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "brute",
      "menace": 4,
      "pv": 10,
      "atk": 4,
      "def": 3,
      "zone": 1,
      "actions": 2,
      "special_attack_name": "Dégagement Musclé — attaque toutes les unités adjacentes et pousse les héros touchés de 1 case",
      "special_attack_noise": 2,
      "ai_behavior": "Avance droit dans les regroupements et nettoie la piste",
      "ai_target_priority": "Groupe",
      "socle": "32mm",
      "lore": "Chez elle, l’expulsion relève de la tradition familiale et du bon goût. Si quelqu’un traîne trop près, elle le remet dehors avec une conviction très physique.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_clara-perdue",
      "name": "Clara Perdue",
      "slug": "clara-perdue",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "mini_boss",
      "menace": 4,
      "pv": 12,
      "atk": 3,
      "def": 2,
      "zone": 2,
      "actions": 3,
      "special_attack_name": "Improvisation Dangereuse — à son activation, si un décor est adjacent, elle le casse (+1 bruit); sinon elle pousse le héros le plus proche de 1 case",
      "special_attack_noise": 1,
      "ai_behavior": "Cherche en permanence le contact avec le décor ou la cible la plus accessible",
      "ai_target_priority": "Décor > Proche",
      "socle": "32mm",
      "lore": "Elle est humaine, paumée et manifestement arrivée là par une porte qui menait à des ennuis. Elle improvise avec ce qu’elle trouve, y compris son niveau de panique.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "creature_madame-carminia",
      "name": "Madame Carminia",
      "slug": "madame-carminia",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_slug": "le-cabaret-des-joyeuses",
      "category": "boss",
      "menace": 5,
      "pv": 14,
      "atk": 4,
      "def": 4,
      "zone": 3,
      "actions": 3,
      "special_attack_name": "Final Carmin — attire jusqu’à 2 héros de 1 case chacun; chaque héros ainsi rapproché subit -1 DEF jusqu’à son prochain tour. Passif: Entrée en Coulisses — à la fin de son tour, si un allié est détruit ou si le Brouhaha est pair, elle invoque 1 créature standard adjacente à un décor ou à une porte libre.",
      "special_attack_noise": 2,
      "ai_behavior": "Contrôle le centre du combat, regroupe les héros et verrouille les meilleures positions",
      "ai_target_priority": "Groupe > Faible DEF",
      "socle": "32mm",
      "lore": "Elle gouverne le cabaret avec un aplomb qui ferait rougir un confessionnal. Tout le monde obéit, tout le monde sourit, et personne n’ose demander pourquoi le rideau bouge encore.",
      "image_path": "",
      "tags": [
        "le-cabaret-des-joyeuses"
      ]
    }
  ],
  "heroes": [
    {
      "id": "hero_aelion-trois-gorg-es_l1",
      "hero_base_name": "Aelion Trois-Gorgées",
      "level": 1,
      "name": "Aelion Trois-Gorgées - Snob déshydraté",
      "role": "Assassin",
      "title": "Snob déshydraté",
      "pv": 6,
      "atk": 3,
      "def": 1,
      "zone": 1,
      "actions": 3,
      "ability_text": "Petite Rasade",
      "effect_text": "Gagne +1 ATK pendant 1 tour",
      "brouhaha": "",
      "image_path": "",
      "tags": [
        "aelion-trois-gorgees",
        "assassin"
      ]
    },
    {
      "id": "hero_aelion-trois-gorg-es_l2",
      "hero_base_name": "Aelion Trois-Gorgées",
      "level": 2,
      "name": "Aelion Trois-Gorgées - Larcineur Bouchonné",
      "role": "Assassin",
      "title": "Larcineur Bouchonné",
      "pv": 7,
      "atk": 4,
      "def": 1,
      "zone": 1,
      "actions": 3,
      "ability_text": "La Rincette",
      "effect_text": "Gagne +1 ATK et +1 déplacement pendant 1 tour",
      "brouhaha": "",
      "image_path": "",
      "tags": [
        "aelion-trois-gorgees",
        "assassin"
      ]
    },
    {
      "id": "hero_aelion-trois-gorg-es_l3",
      "hero_base_name": "Aelion Trois-Gorgées",
      "level": 3,
      "name": "Aelion Trois-Gorgées - Vinaïgueur de Duel",
      "role": "Assassin",
      "title": "Vinaïgueur de Duel",
      "pv": 8,
      "atk": 5,
      "def": 2,
      "zone": 1,
      "actions": 3,
      "ability_text": "La P'tite Sœur",
      "effect_text": "Attaque 2 fois la même cible pendant 1 tour mais attention un 3ème coup est portée à l'allié le plus proche",
      "brouhaha": "+1",
      "image_path": "",
      "tags": [
        "aelion-trois-gorgees",
        "assassin"
      ]
    },
    {
      "id": "hero_aelion-trois-gorg-es_l4",
      "hero_base_name": "Aelion Trois-Gorgées",
      "level": 4,
      "name": "Aelion Trois-Gorgées - Grand Cru de la Dague",
      "role": "Assassin",
      "title": "Grand Cru de la Dague",
      "pv": 9,
      "atk": 6,
      "def": 2,
      "zone": 1,
      "actions": 3,
      "ability_text": "Un Dernier pour la Route",
      "effect_text": "Gagne +3 ATK et -2 DEF pendant 1 tour mais fait perdre la moitié des PV",
      "brouhaha": "+1",
      "image_path": "",
      "tags": [
        "aelion-trois-gorgees",
        "assassin"
      ]
    },
    {
      "id": "hero_br-nhilda-la-torgnole_l1",
      "hero_base_name": "Brünhilda la Torgnole",
      "level": 1,
      "name": "Brünhilda la Torgnole - Mur en slip",
      "role": "Tank",
      "title": "Mur en slip",
      "pv": 12,
      "atk": 3,
      "def": 4,
      "zone": 1,
      "actions": 3,
      "ability_text": "Ivresse Héroïque",
      "effect_text": "Gagne +2 DEF pendant 1 tour et repousse les ennemis adjacents d'une case.",
      "brouhaha": "",
      "image_path": "",
      "tags": [
        "brunhilda-la-torgnole",
        "tank"
      ]
    },
    {
      "id": "hero_br-nhilda-la-torgnole_l2",
      "hero_base_name": "Brünhilda la Torgnole",
      "level": 2,
      "name": "Brünhilda la Torgnole - Pare-Baffes",
      "role": "Tank",
      "title": "Pare-Baffes",
      "pv": 14,
      "atk": 3,
      "def": 4,
      "zone": 1,
      "actions": 3,
      "ability_text": "-",
      "effect_text": "",
      "brouhaha": "",
      "image_path": "",
      "tags": [
        "brunhilda-la-torgnole",
        "tank"
      ]
    },
    {
      "id": "hero_br-nhilda-la-torgnole_l3",
      "hero_base_name": "Brünhilda la Torgnole",
      "level": 3,
      "name": "Brünhilda la Torgnole - Rempart à Mandales",
      "role": "Tank",
      "title": "Rempart à Mandales",
      "pv": 16,
      "atk": 3,
      "def": 4,
      "zone": 1,
      "actions": 3,
      "ability_text": "Torgnole Monumentale",
      "effect_text": "Baffe circulaire qui repousse les créatures adjacentes de 2 cases et leur fait perdre 1 PV, la baffe ignore la DEF et touche les ennemis, les alliés et les objets",
      "brouhaha": "+1",
      "image_path": "",
      "tags": [
        "brunhilda-la-torgnole",
        "tank"
      ]
    },
    {
      "id": "hero_br-nhilda-la-torgnole_l4",
      "hero_base_name": "Brünhilda la Torgnole",
      "level": 4,
      "name": "Brünhilda la Torgnole - Forteresse à Torgnoles",
      "role": "Tank",
      "title": "Forteresse à Torgnoles",
      "pv": 18,
      "atk": 3,
      "def": 5,
      "zone": 1,
      "actions": 3,
      "ability_text": "Rugissement de la Gargote",
      "effect_text": "Bloque tout les déplacements ennemis et alliés au prochain tour",
      "brouhaha": "+1",
      "image_path": "",
      "tags": [
        "brunhilda-la-torgnole",
        "tank"
      ]
    },
    {
      "id": "hero_grompif-arcabidon_l1",
      "hero_base_name": "Grompif Arcabidon",
      "level": 1,
      "name": "Grompif Arcabidon - Apprenti Distillomage",
      "role": "Mage distance",
      "title": "Apprenti Distillomage",
      "pv": 5,
      "atk": 4,
      "def": 1,
      "zone": 4,
      "actions": 3,
      "ability_text": "Jet de Gnôle",
      "effect_text": "Gagne +1 ATK pendant 1 tour",
      "brouhaha": "",
      "image_path": "",
      "tags": [
        "grompif-arcabidon",
        "mage-distance"
      ]
    },
    {
      "id": "hero_grompif-arcabidon_l2",
      "hero_base_name": "Grompif Arcabidon",
      "level": 2,
      "name": "Grompif Arcabidon - Sorcier du Petit Fût",
      "role": "Mage distance",
      "title": "Sorcier du Petit Fût",
      "pv": 6,
      "atk": 4,
      "def": 1,
      "zone": 4,
      "actions": 3,
      "ability_text": "Mousse Régénérante",
      "effect_text": "Soigne +2 PV",
      "brouhaha": "",
      "image_path": "",
      "tags": [
        "grompif-arcabidon",
        "mage-distance"
      ]
    },
    {
      "id": "hero_grompif-arcabidon_l3",
      "hero_base_name": "Grompif Arcabidon",
      "level": 3,
      "name": "Grompif Arcabidon - Thaumaturge des Barriques",
      "role": "Mage distance",
      "title": "Thaumaturge des Barriques",
      "pv": 7,
      "atk": 5,
      "def": 2,
      "zone": 4,
      "actions": 3,
      "ability_text": "Distillation Occulte",
      "effect_text": "Attaque normale mais inflige +2 ATK à tout les ennemis, alliés et objets adjacent à la cible",
      "brouhaha": "+1",
      "image_path": "",
      "tags": [
        "grompif-arcabidon",
        "mage-distance"
      ]
    },
    {
      "id": "hero_grompif-arcabidon_l4",
      "hero_base_name": "Grompif Arcabidon",
      "level": 4,
      "name": "Grompif Arcabidon - Archi-Distillomancien",
      "role": "Mage distance",
      "title": "Archi-Distillomancien",
      "pv": 8,
      "atk": 6,
      "def": 2,
      "zone": 4,
      "actions": 3,
      "ability_text": "Fûtaclysme Arcanique",
      "effect_text": "Repousse ennemis, alliés et objets adjacents d’1 case, inflige 1 PV et ignore DEF",
      "brouhaha": "+1",
      "image_path": "",
      "tags": [
        "grompif-arcabidon",
        "mage-distance"
      ]
    },
    {
      "id": "hero_magdalena-coquinelle_l1",
      "hero_base_name": "Magdalena Coquinelle",
      "level": 1,
      "name": "Magdalena Coquinelle - Pécheresse Repentie",
      "role": "Clerc soutien",
      "title": "Pécheresse Repentie",
      "pv": 7,
      "atk": 2,
      "def": 2,
      "zone": 3,
      "actions": 3,
      "ability_text": "Petite Taffe",
      "effect_text": "Soigne 2 PV à un allié, portée 3",
      "brouhaha": "",
      "image_path": "",
      "tags": [
        "magdalena-coquinelle",
        "clerc-soutien"
      ]
    },
    {
      "id": "hero_magdalena-coquinelle_l2",
      "hero_base_name": "Magdalena Coquinelle",
      "level": 2,
      "name": "Magdalena Coquinelle - Consolatrice des Ratés",
      "role": "Clerc soutien",
      "title": "Consolatrice des Ratés",
      "pv": 8,
      "atk": 2,
      "def": 2,
      "zone": 3,
      "actions": 3,
      "ability_text": "Bouffée Sacrée",
      "effect_text": "Soigne +1 PV et +1 DEF pendant 2 tours, portée 3",
      "brouhaha": "",
      "image_path": "",
      "tags": [
        "magdalena-coquinelle",
        "clerc-soutien"
      ]
    },
    {
      "id": "hero_magdalena-coquinelle_l3",
      "hero_base_name": "Magdalena Coquinelle",
      "level": 3,
      "name": "Magdalena Coquinelle - Miraculée du Comptoir",
      "role": "Clerc soutien",
      "title": "Miraculée du Comptoir",
      "pv": 9,
      "atk": 2,
      "def": 3,
      "zone": 3,
      "actions": 3,
      "ability_text": "Nuage Miraculeux",
      "effect_text": "Soigne +2 PV à tous les alliés mais leurs faits perdre 1 action au tour suivant",
      "brouhaha": "",
      "image_path": "",
      "tags": [
        "magdalena-coquinelle",
        "clerc-soutien"
      ]
    },
    {
      "id": "hero_magdalena-coquinelle_l4",
      "hero_base_name": "Magdalena Coquinelle",
      "level": 4,
      "name": "Magdalena Coquinelle - Abbesse du Lupanar",
      "role": "Clerc soutien",
      "title": "Abbesse du Lupanar",
      "pv": 10,
      "atk": 4,
      "def": 4,
      "zone": 3,
      "actions": 3,
      "ability_text": "Fumée Divine",
      "effect_text": "Soigne +4 PV et +1 ATK à un allié pendant 1 tour, mais bloque ces déplacements pendant 1 tour (et lui donne les yeux rouges)",
      "brouhaha": "",
      "image_path": "",
      "tags": [
        "magdalena-coquinelle",
        "clerc-soutien"
      ]
    }
  ],
  "npcs": [
    {
      "id": "npc_sylviane-racinebouteille",
      "name": "Sylviane Racinebouteille",
      "slug": "sylviane-racinebouteille",
      "race": "Demi-Ant",
      "tone": "Placide, maternelle, très lente",
      "role": "Gardienne du tonneau éternel",
      "lore": "Ancien chêne millénaire autour duquel la taverne a été construite. Ses racines traversent la cave et alimentent certains tonneaux en sève fermentée. Quand les clients deviennent trop bruyants, elle fait pousser des racines pour les faire trébucher.",
      "image_path": "",
      "tags": [
        "demi-ant",
        "gardienne-du-tonneau-eternel"
      ]
    },
    {
      "id": "npc_mirelda-trois-tentacules",
      "name": "Mirelda Trois-Tentacules",
      "slug": "mirelda-trois-tentacules",
      "race": "Demi-Kraken",
      "tone": "Sarcastique, blasée",
      "role": "Plongeuse officielle",
      "lore": "Mirelda peut laver douze chopes à la fois grâce à ses tentacules. Personne ne sait exactement combien de bras elle possède sous le comptoir et personne ne pose la question.",
      "image_path": "",
      "tags": [
        "demi-kraken",
        "plongeuse-officielle"
      ]
    },
    {
      "id": "npc_giselle-cliquetron",
      "name": "Giselle Cliquetron",
      "slug": "giselle-cliquetron",
      "race": "Demi-Mécanique (technologie gnome)",
      "tone": "Enthousiaste, bricoleuse, légèrement dangereuse",
      "role": "Réparatrice d’objets et inventrice",
      "lore": "Ancienne expérience d’un atelier gnome. Une partie de son corps est faite d’engrenages, de pistons et de plaques de cuivre. Elle améliore sans cesse la taverne avec des machines improbables dont la moitié fonctionne et l’autre moitié explose.",
      "image_path": "",
      "tags": [
        "demi-mecanique-technologie-gnome",
        "reparatrice-d-objets-et-inventrice"
      ]
    },
    {
      "id": "npc_morticia-raccommode-chair",
      "name": "Morticia Raccommode-Chair",
      "slug": "morticia-raccommode-chair",
      "race": "Demi-Morte-Vivante",
      "tone": "Nonchalante, sarcastique, très calme",
      "role": "Infirmière improvisée de la taverne",
      "lore": "Ancienne aventurière revenue d’entre les morts après une expédition ratée. Depuis, elle recoud les bagarres de taverne avec une aiguille et du fil et garde toujours quelques morceaux de secours dans une petite boîte.",
      "image_path": "",
      "tags": [
        "demi-morte-vivante",
        "infirmiere-improvisee-de-la-taverne"
      ]
    },
    {
      "id": "npc_rainette-saute-tonneau",
      "name": "Rainette Saute-Tonneau",
      "slug": "rainette-saute-tonneau",
      "race": "Demi-Gripplis",
      "tone": "Vive, malicieuse, très bruyante",
      "role": "Livreuse de chopes express",
      "lore": "Rainette traverse la taverne en bonds spectaculaires entre les tables. Elle peut transporter cinq chopes à la fois mais en renverse souvent une par accident.",
      "image_path": "",
      "tags": [
        "demi-gripplis",
        "livreuse-de-chopes-express"
      ]
    },
    {
      "id": "npc_drakana-flambecaille",
      "name": "Drakana Flambecaille",
      "slug": "drakana-flambecaille",
      "race": "Demi-Drakken",
      "tone": "Fière, provocante, légèrement brutale",
      "role": "Videuse officielle de la taverne",
      "lore": "Ancienne mercenaire draconique qui a décidé que cogner les ivrognes était un métier plus stable. Ses écailles rouges chauffent quand elle s’énerve.",
      "image_path": "",
      "tags": [
        "demi-drakken",
        "videuse-officielle-de-la-taverne"
      ]
    },
    {
      "id": "npc_ignara-brasierjoyeuse",
      "name": "Ignara Brasierjoyeuse",
      "slug": "ignara-brasierjoyeuse",
      "race": "Demi-Ifrit",
      "tone": "Passionnée, explosive, grande gueule",
      "role": "Maîtresse du four et des grillades",
      "lore": "Ignara peut allumer le four d’un simple claquement de doigts. Ses brochettes sont célèbres mais elle a déjà brûlé plusieurs cuisines et une moustache de client.",
      "image_path": "",
      "tags": [
        "demi-ifrit",
        "maitresse-du-four-et-des-grillades"
      ]
    },
    {
      "id": "npc_ysabeau-pollenbrune",
      "name": "Ysabeau Pollenbrune",
      "slug": "ysabeau-pollenbrune",
      "race": "Demi-Abeille",
      "tone": "Douce mais hyperactive",
      "role": "Apicultrice et brasseuse de miel",
      "lore": "Produit un hydromel exceptionnel grâce à ses ruches installées dans les poutres de la taverne. Les clients trop collants ressortent parfois couverts de miel.",
      "image_path": "",
      "tags": [
        "demi-abeille",
        "apicultrice-et-brasseuse-de-miel"
      ]
    }
  ],
  "quests": [
    {
      "id": "quest_test_le-cabaret-des-joyeuses",
      "name": "test",
      "slug": "test",
      "description": "Test",
      "objective": "Test",
      "reward": "Test",
      "difficulty": 1,
      "npc_id": "npc_mirelda-trois-tentacules",
      "npc_name": "Mirelda Trois-Tentacules",
      "dungeon_id": "dungeon_le-cabaret-des-joyeuses",
      "dungeon_name": "Le Cabaret des Joyeuses",
      "image_path": "",
      "tags": [
        "Test"
      ]
    }
  ],
  "loot_items": [
    {
      "id": "loot_sac-de-vis-rouill-es_gobelin-bricoleur",
      "creature_id": "creature_gobelin-bricoleur",
      "creature_name": "Gobelin Bricoleur",
      "name": "Sac de vis rouillées",
      "type": "Vendable",
      "effect": "Objet utile",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_ressort-myst-rieux_gobelin-bricoleur",
      "creature_id": "creature_gobelin-bricoleur",
      "creature_name": "Gobelin Bricoleur",
      "name": "Ressort mystérieux",
      "type": "Vendable",
      "effect": "Objet bizarre",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_caillou-bien-quilibr_gobelin-lance-tout",
      "creature_id": "creature_gobelin-lance-tout",
      "creature_name": "Gobelin Lance-Tout",
      "name": "Caillou bien équilibré",
      "type": "Projectile",
      "effect": "ATK 1 portée 3",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_bout-de-ferraille_gobelin-lance-tout",
      "creature_id": "creature_gobelin-lance-tout",
      "creature_name": "Gobelin Lance-Tout",
      "name": "Bout de ferraille",
      "type": "Vendable",
      "effect": "Objet déchet de valeurs",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_os-d-tachable_squelette-maladroit",
      "creature_id": "creature_squelette-maladroit",
      "creature_name": "Squelette Maladroit",
      "name": "Os détachable",
      "type": "Vendable",
      "effect": "Objet bizarre",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_rotule-branlante_squelette-maladroit",
      "creature_id": "creature_squelette-maladroit",
      "creature_name": "Squelette Maladroit",
      "name": "Rotule branlante",
      "type": "Projectile",
      "effect": "ATK 1 portée 3",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_fl-che-tordue_squelette-tire-au-pif",
      "creature_id": "creature_squelette-tire-au-pif",
      "creature_name": "Squelette Tire-au-Pif",
      "name": "Flèche tordue",
      "type": "Projectile",
      "effect": "ATK 1 portée 3",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_carquois-trou_squelette-tire-au-pif",
      "creature_id": "creature_squelette-tire-au-pif",
      "creature_name": "Squelette Tire-au-Pif",
      "name": "Carquois troué",
      "type": "Vendable",
      "effect": "Objet",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_poign-e-de-porte_squelette-porte-placard",
      "creature_id": "creature_squelette-porte-placard",
      "creature_name": "Squelette Porte-Placard",
      "name": "Poignée de porte",
      "type": "Vendable",
      "effect": "Objet utile",
      "gold_value": 2,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_charni-re-de-placard_squelette-porte-placard",
      "creature_id": "creature_squelette-porte-placard",
      "creature_name": "Squelette Porte-Placard",
      "name": "Charnière de placard",
      "type": "Vendable",
      "effect": "Objet utile",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_manche-balai_balai-hant",
      "creature_id": "creature_balai-hant",
      "creature_name": "Balai Hanté",
      "name": "Manche à balai",
      "type": "Vendable",
      "effect": "Objet utile",
      "gold_value": 2,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_touffe-de-poils-magiques_balai-hant",
      "creature_id": "creature_balai-hant",
      "creature_name": "Balai Hanté",
      "name": "Touffe de poils magiques",
      "type": "Utilitaire",
      "effect": "+1 déplacement gratuit",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_couronne-caboss-e_gobelin-chef",
      "creature_id": "creature_gobelin-chef",
      "creature_name": "Gobelin Chef",
      "name": "Couronne cabossée",
      "type": "Vendable",
      "effect": "Objet épique",
      "gold_value": 3,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_plan-de-raid-rat_gobelin-chef",
      "creature_id": "creature_gobelin-chef",
      "creature_name": "Gobelin Chef",
      "name": "Plan de raid raté",
      "type": "Vendable",
      "effect": "Objet",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_cuill-re-graisseuse_cuisinier-zombie",
      "creature_id": "creature_cuisinier-zombie",
      "creature_name": "Cuisinier Zombie",
      "name": "Cuillère graisseuse",
      "type": "Projectile",
      "effect": "´+2 PV portée 3",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_morceau-de-viande-suspecte_cuisinier-zombie",
      "creature_id": "creature_cuisinier-zombie",
      "creature_name": "Cuisinier Zombie",
      "name": "Morceau de viande suspecte",
      "type": "Consommable",
      "effect": "+2 PV",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_battant-de-cloche_cloche-poss-d-e",
      "creature_id": "creature_cloche-poss-d-e",
      "creature_name": "Cloche Possédée",
      "name": "Battant de cloche",
      "type": "Vendable",
      "effect": "Objet déchet de valeurs",
      "gold_value": 2,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_petit-clat-de-bronze_cloche-poss-d-e",
      "creature_id": "creature_cloche-poss-d-e",
      "creature_name": "Cloche Possédée",
      "name": "Petit éclat de bronze",
      "type": "Vendable",
      "effect": "Objet déchet de valeurs",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_formulaire-spectral_fant-me-bureaucrate",
      "creature_id": "creature_fant-me-bureaucrate",
      "creature_name": "Fantôme Bureaucrate",
      "name": "Formulaire spectral",
      "type": "Utilitaire",
      "effect": "Ouvre un coffre gratuitement",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_tampon-officiel_fant-me-bureaucrate",
      "creature_id": "creature_fant-me-bureaucrate",
      "creature_name": "Fantôme Bureaucrate",
      "name": "Tampon officiel",
      "type": "Utilitaire",
      "effect": "Ouvre une porte gratuitement",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_casque-caboss_garde-poss-d",
      "creature_id": "creature_garde-poss-d",
      "creature_name": "Garde Possédé",
      "name": "Casque cabossé",
      "type": "Vendable",
      "effect": "Objet déchet de valeurs",
      "gold_value": 2,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_insigne-militaire_garde-poss-d",
      "creature_id": "creature_garde-poss-d",
      "creature_name": "Garde Possédé",
      "name": "Insigne militaire",
      "type": "Vendable",
      "effect": "Objet bizarre",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_uf-dor_poule-d-moniaque",
      "creature_id": "creature_poule-d-moniaque",
      "creature_name": "Poule Démoniaque",
      "name": "Œuf d’or",
      "type": "Projectile",
      "effect": "ATK 2 ignore DEF portée 3 ou vendu",
      "gold_value": 5,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot__poule-d-moniaque",
      "creature_id": "creature_poule-d-moniaque",
      "creature_name": "Poule Démoniaque",
      "name": "-",
      "type": "-",
      "effect": "-",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_tr-sor-du-mimique_mimique-rat",
      "creature_id": "creature_mimique-rat",
      "creature_name": "Mimique Raté",
      "name": "Trésor du Mimique",
      "type": "Vendable",
      "effect": "Objet épique",
      "gold_value": 3,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_dent-de-coffre_mimique-rat",
      "creature_id": "creature_mimique-rat",
      "creature_name": "Mimique Raté",
      "name": "Dent de coffre",
      "type": "Vendable",
      "effect": "Objet bizarre",
      "gold_value": 2,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_slip-dogre_ogre-maladroit",
      "creature_id": "creature_ogre-maladroit",
      "creature_name": "Ogre Maladroit",
      "name": "Slip d'ogre",
      "type": "Vendable",
      "effect": "Objet ridicule",
      "gold_value": 3,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_dent-dogre_ogre-maladroit",
      "creature_id": "creature_ogre-maladroit",
      "creature_name": "Ogre Maladroit",
      "name": "Dent d’ogre",
      "type": "Vendable",
      "effect": "Objet épique",
      "gold_value": 2,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_peron-rouill_chevalier-sans-cheval",
      "creature_id": "creature_chevalier-sans-cheval",
      "creature_name": "Chevalier Sans Cheval",
      "name": "Éperon rouillé",
      "type": "Vendable",
      "effect": "Objet épique",
      "gold_value": 3,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_cale-on-coeur_chevalier-sans-cheval",
      "creature_id": "creature_chevalier-sans-cheval",
      "creature_name": "Chevalier Sans Cheval",
      "name": "Caleçon à coeur",
      "type": "Vendable",
      "effect": "Objet ridicule",
      "gold_value": 2,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_doudou-du-baron_baron-pas-tr-s-terrifiant",
      "creature_id": "creature_baron-pas-tr-s-terrifiant",
      "creature_name": "Baron Pas-Très-Terrifiant",
      "name": "Doudou du Baron",
      "type": "Vendable",
      "effect": "Objet ridicule",
      "gold_value": 3,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_couronne-en-toc_baron-pas-tr-s-terrifiant",
      "creature_id": "creature_baron-pas-tr-s-terrifiant",
      "creature_name": "Baron Pas-Très-Terrifiant",
      "name": "Couronne en toc",
      "type": "Vendable",
      "effect": "Objet ridicule",
      "gold_value": 3,
      "image_path": "",
      "tags": [
        "loot",
        "le-chateau-de-bastognac"
      ]
    },
    {
      "id": "loot_rouge-l-vres-carlate_gobeline-aguicheuse",
      "creature_id": "creature_gobeline-aguicheuse",
      "creature_name": "Gobeline Aguicheuse",
      "name": "Rouge à lèvres écarlate",
      "type": "Vendable",
      "effect": "Objet utile",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_ventail-de-sc-ne_gobeline-aguicheuse",
      "creature_id": "creature_gobeline-aguicheuse",
      "creature_name": "Gobeline Aguicheuse",
      "name": "Éventail de scène",
      "type": "Projectile",
      "effect": "ATK 1 portée 2",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_verre-explosif_gobeline-serveuse-explosive",
      "creature_id": "creature_gobeline-serveuse-explosive",
      "creature_name": "Gobeline Serveuse Explosive",
      "name": "Verre explosif",
      "type": "Projectile",
      "effect": "ATK 1 portée 2; explosion à l’impact",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_tablier-br-l_gobeline-serveuse-explosive",
      "creature_id": "creature_gobeline-serveuse-explosive",
      "creature_name": "Gobeline Serveuse Explosive",
      "name": "Tablier brûlé",
      "type": "Vendable",
      "effect": "Objet bizarre",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_parfum-douteux_snorgle-sensuelle",
      "creature_id": "creature_snorgle-sensuelle",
      "creature_name": "Snorgle Sensuelle",
      "name": "Parfum douteux",
      "type": "Utilitaire",
      "effect": "Une cible adjacente subit -1 ATK pendant 1 tour",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_boue-brillante_snorgle-sensuelle",
      "creature_id": "creature_snorgle-sensuelle",
      "creature_name": "Snorgle Sensuelle",
      "name": "Boue brillante",
      "type": "Vendable",
      "effect": "Objet étrange",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_bijou-cass_squelette-courtisane",
      "creature_id": "creature_squelette-courtisane",
      "creature_name": "Squelette Courtisane",
      "name": "Bijou cassé",
      "type": "Vendable",
      "effect": "Objet précieux",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_talon-aiguille_squelette-courtisane",
      "creature_id": "creature_squelette-courtisane",
      "creature_name": "Squelette Courtisane",
      "name": "Talon aiguille",
      "type": "Projectile",
      "effect": "ATK 1 portée 2",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_foulard-magique_illusionniste-des-rideaux",
      "creature_id": "creature_illusionniste-des-rideaux",
      "creature_name": "Illusionniste des Rideaux",
      "name": "Foulard magique",
      "type": "Utilitaire",
      "effect": "Échange sa position avec une unité adjacente",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_rideau-d-chir_illusionniste-des-rideaux",
      "creature_id": "creature_illusionniste-des-rideaux",
      "creature_name": "Illusionniste des Rideaux",
      "name": "Rideau déchiré",
      "type": "Vendable",
      "effect": "Objet utile",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_plume-coupante_plume-vivante-poss-d-e",
      "creature_id": "creature_plume-vivante-poss-d-e",
      "creature_name": "Plume Vivante Possédée",
      "name": "Plume coupante",
      "type": "Projectile",
      "effect": "ATK 1 portée 2",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_bouton-de-costume_plume-vivante-poss-d-e",
      "creature_id": "creature_plume-vivante-poss-d-e",
      "creature_name": "Plume Vivante Possédée",
      "name": "Bouton de costume",
      "type": "Vendable",
      "effect": "Objet ridicule",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_nappe-de-c-r-monie_h-tesse-dominante",
      "creature_id": "creature_h-tesse-dominante",
      "creature_name": "Hôtesse Dominante",
      "name": "Nappe de cérémonie",
      "type": "Utilitaire",
      "effect": "Crée une case difficile adjacente",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_sifflet-de-salle_h-tesse-dominante",
      "creature_id": "creature_h-tesse-dominante",
      "creature_name": "Hôtesse Dominante",
      "name": "Sifflet de salle",
      "type": "Vendable",
      "effect": "Objet utile",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_carnet-de-r-servations_ma-tresse-de-salle",
      "creature_id": "creature_ma-tresse-de-salle",
      "creature_name": "Maîtresse de Salle",
      "name": "Carnet de réservations",
      "type": "Utilitaire",
      "effect": "Un allié adjacent gagne +1 ATK ce tour",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_gants-blancs_ma-tresse-de-salle",
      "creature_id": "creature_ma-tresse-de-salle",
      "creature_name": "Maîtresse de Salle",
      "name": "Gants blancs",
      "type": "Vendable",
      "effect": "Objet utile",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_micro-hant_cantatrice-envo-tante",
      "creature_id": "creature_cantatrice-envo-tante",
      "creature_name": "Cantatrice Envoûtante",
      "name": "Micro hanté",
      "type": "Projectile",
      "effect": "ATK 2 portée 3",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_partition-maudite_cantatrice-envo-tante",
      "creature_id": "creature_cantatrice-envo-tante",
      "creature_name": "Cantatrice Envoûtante",
      "name": "Partition maudite",
      "type": "Utilitaire",
      "effect": "Une cible à portée 2 subit -1 action au prochain tour",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_bougie-de-loge_gardienne-des-bougies",
      "creature_id": "creature_gardienne-des-bougies",
      "creature_name": "Gardienne des Bougies",
      "name": "Bougie de loge",
      "type": "Utilitaire",
      "effect": "Crée une case en feu adjacente",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_cire-parfum-e_gardienne-des-bougies",
      "creature_id": "creature_gardienne-des-bougies",
      "creature_name": "Gardienne des Bougies",
      "name": "Cire parfumée",
      "type": "Vendable",
      "effect": "Objet utile",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_poing-de-velours_videuse-l-gante",
      "creature_id": "creature_videuse-l-gante",
      "creature_name": "Videuse Élégante",
      "name": "Poing de velours",
      "type": "Utilitaire",
      "effect": "La prochaine poussée d’une attaque de mêlée gagne +1 case",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_badge-de-s-curit_videuse-l-gante",
      "creature_id": "creature_videuse-l-gante",
      "creature_name": "Videuse Élégante",
      "name": "Badge de sécurité",
      "type": "Vendable",
      "effect": "Objet utile",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_uf-explosif_poule-d-moniaque",
      "creature_id": "creature_poule-d-moniaque",
      "creature_name": "Poule Démoniaque",
      "name": "Œuf explosif",
      "type": "Projectile",
      "effect": "ATK 1 portée 2; explosion en zone 1 à l’impact",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_plume-de-soufre_poule-d-moniaque",
      "creature_id": "creature_poule-d-moniaque",
      "creature_name": "Poule Démoniaque",
      "name": "Plume de soufre",
      "type": "Vendable",
      "effect": "Objet étrange",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_paillettes-tranchantes_diva-catastrophe",
      "creature_id": "creature_diva-catastrophe",
      "creature_name": "Diva Catastrophe",
      "name": "Paillettes tranchantes",
      "type": "Projectile",
      "effect": "ATK 1 portée 3",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_ventail-luxueux_diva-catastrophe",
      "creature_id": "creature_diva-catastrophe",
      "creature_name": "Diva Catastrophe",
      "name": "Éventail luxueux",
      "type": "Utilitaire",
      "effect": "Attire une cible adjacente de 1 case",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_plateau-caboss_ogresse-videuse",
      "creature_id": "creature_ogresse-videuse",
      "creature_name": "Ogresse Videuse",
      "name": "Plateau cabossé",
      "type": "Projectile",
      "effect": "ATK 2 portée 2",
      "gold_value": 0,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_tablier-blind_ogresse-videuse",
      "creature_id": "creature_ogresse-videuse",
      "creature_name": "Ogresse Videuse",
      "name": "Tablier blindé",
      "type": "Vendable",
      "effect": "Objet utile",
      "gold_value": 2,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_ruban-de-sc-ne_clara-perdue",
      "creature_id": "creature_clara-perdue",
      "creature_name": "Clara Perdue",
      "name": "Ruban de scène",
      "type": "Utilitaire",
      "effect": "Le porteur gagne +1 déplacement sur sa prochaine action",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_gourde-de-coulisse_clara-perdue",
      "creature_id": "creature_clara-perdue",
      "creature_name": "Clara Perdue",
      "name": "Gourde de coulisse",
      "type": "Vendable",
      "effect": "Objet ridicule",
      "gold_value": 1,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_contrat-infernal_madame-carminia",
      "creature_id": "creature_madame-carminia",
      "creature_name": "Madame Carminia",
      "name": "Contrat infernal",
      "type": "Utilitaire",
      "effect": "Donne +1 action à un allié adjacent ou libère une unité bloquée",
      "gold_value": 3,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    },
    {
      "id": "loot_bijou-de-loge_madame-carminia",
      "creature_id": "creature_madame-carminia",
      "creature_name": "Madame Carminia",
      "name": "Bijou de loge",
      "type": "Vendable",
      "effect": "Objet magique",
      "gold_value": 2,
      "image_path": "",
      "tags": [
        "loot",
        "le-cabaret-des-joyeuses"
      ]
    }
  ],
  "interactables": [],
  "brouhaha_effects": [
    {
      "id": "brouhaha_2_universel_test",
      "level": 2,
      "dungeon_name": "",
      "dungeon_id": "",
      "effect_text": "Test"
    }
  ],
  "media_assets": [
    {
      "id": "media_bard",
      "label": "Chanteuse",
      "file_name": "bard.png",
      "path": "assets/images/bard.png",
      "mime_type": "image/png",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_berthold",
      "label": "Berthold",
      "file_name": "berthold.png",
      "path": "assets/images/berthold.png",
      "mime_type": "image/png",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_bruna",
      "label": "Brüna",
      "file_name": "bruna.jpeg",
      "path": "assets/images/bruna.jpeg",
      "mime_type": "image/jpeg",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_centoria",
      "label": "Centoria",
      "file_name": "centoria.jpeg",
      "path": "assets/images/centoria.jpeg",
      "mime_type": "image/jpeg",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_demon",
      "label": "Démon",
      "file_name": "demon.png",
      "path": "assets/images/demon.png",
      "mime_type": "image/png",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_gundrade",
      "label": "Gundrade",
      "file_name": "gundrade.jpeg",
      "path": "assets/images/gundrade.jpeg",
      "mime_type": "image/jpeg",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_logo-192",
      "label": "Logo 192",
      "file_name": "logo-192.png",
      "path": "assets/images/logo-192.png",
      "mime_type": "image/png",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_logo-512",
      "label": "Logo 512",
      "file_name": "logo-512.png",
      "path": "assets/images/logo-512.png",
      "mime_type": "image/png",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_logo-source",
      "label": "Logo source",
      "file_name": "logo-source.jpeg",
      "path": "assets/images/logo-source.jpeg",
      "mime_type": "image/jpeg",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_rainette",
      "label": "Rainette",
      "file_name": "rainette.jpeg",
      "path": "assets/images/rainette.jpeg",
      "mime_type": "image/jpeg",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_sigrune",
      "label": "Sigrune",
      "file_name": "sigrune.jpeg",
      "path": "assets/images/sigrune.jpeg",
      "mime_type": "image/jpeg",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_trixie",
      "label": "Trixie",
      "file_name": "trixie.jpeg",
      "path": "assets/images/trixie.jpeg",
      "mime_type": "image/jpeg",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_veloria",
      "label": "Veloria",
      "file_name": "veloria.jpeg",
      "path": "assets/images/veloria.jpeg",
      "mime_type": "image/jpeg",
      "entity_type": "gallery",
      "entity_id": ""
    },
    {
      "id": "media_waitress",
      "label": "Serveuse",
      "file_name": "waitress.jpeg",
      "path": "assets/images/waitress.jpeg",
      "mime_type": "image/jpeg",
      "entity_type": "gallery",
      "entity_id": ""
    }
  ]
};
