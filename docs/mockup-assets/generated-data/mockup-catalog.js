window.GARGOTTEX_MOCKUP_CATALOG = {
  "source": "docs/mockup-assets/stat-export/gargottex_export_2026-08-01.xlsx",
  "creatures": [
    {
      "id": "test-ange-emondeuse-sacree",
      "name": "Ange Émondeuse Sacrée",
      "cat": "basique",
      "dungeon": "La Brasserie Céleste",
      "threat": 1,
      "base": "32",
      "pv": 6,
      "atk": 3,
      "def": 2,
      "range": 1,
      "actions": 2,
      "ability": "Taille Sacrée",
      "copy": "attaque une cible adjacente; supprime un buff actif ou retire un terrain gênant adjacent.",
      "noise": 1,
      "ai": "Fonce sur les cibles buffées et les taille sans négociation. Priorité : Héros buffé.",
      "loot": [
        "Sécateur sacré",
        "Branche taillée · 1 or"
      ],
      "lore": "Elle coupe ce qui dépasse. Littéralement.",
      "tags": [
        "houblon-pur"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Ange Émondeuse Sacrée.png",
      "sourceImg": "./mockup-assets/creatures/Ange Émondeuse Sacrée.PNG",
      "match": {
        "method": "name",
        "score": 1
      }
    },
    {
      "id": "test-balai-hante",
      "name": "Balai Hanté",
      "cat": "basique",
      "dungeon": "Le Château de Bastognac",
      "threat": 1,
      "base": "32",
      "pv": 2,
      "atk": 0,
      "def": 1,
      "range": 1,
      "actions": 2,
      "ability": "Grand Coup de Balai : repousse 1 héros adjacent de 1 case",
      "copy": "",
      "noise": 0,
      "ai": "Se déplace en ligne droite et pousse les objets. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Héros le plus proche.",
      "loot": [
        "Touffe de poils magiques",
        "Manche à balai · 2 or"
      ],
      "lore": "Ancien balai du château possédé par un esprit domestique furieux. Son objectif est simple : remettre de l’ordre dans le donjon…",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Balai Hanté.png",
      "sourceImg": "./mockup-assets/creatures/Balai Hanté.PNG",
      "match": {
        "method": "name",
        "score": 1
      }
    },
    {
      "id": "test-baron-pas-tres-terrifiant",
      "name": "Baron Pas-Très-Terrifiant",
      "cat": "boss",
      "dungeon": "Le Château de Bastognac",
      "threat": 5,
      "base": "80",
      "pv": 16,
      "atk": 3,
      "def": 4,
      "range": 2,
      "actions": 2,
      "ability": "Coup spécial 1 : Bégaiement Royal : +1 ATK à toutes les créatures pendant 1 tour. Coup spécial 2 : Renforts Inexplicables : invoque 2 squelettes",
      "copy": "",
      "noise": 0,
      "ai": "Attaque le héros ayant le plus de PV. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Héros avec le plus de PV.",
      "loot": [
        "Couronne en toc · 3 or",
        "Doudou du Baron · 3 or"
      ],
      "lore": "Personne ne sait vraiment qui il est. Un jour, il est simplement apparu dans le château avec une couronne. Depuis, tout le monde l’appelle “Baron” et il fait semblant que c’était prévu. Lui non plus ne comprend pas trop ce qui se passe.",
      "tags": [
        "boss",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Baron Pas-Très-Terrifiant.png",
      "sourceImg": "./mockup-assets/creatures/Baron Pas-Très-Terrifiant.PNG",
      "match": {
        "method": "name",
        "score": 1
      }
    },
    {
      "id": "test-chevalier-sans-cheval",
      "name": "Chevalier Sans Cheval",
      "cat": "mini_boss",
      "dungeon": "Le Château de Bastognac",
      "threat": 4,
      "base": "60",
      "pv": 10,
      "atk": 4,
      "def": 5,
      "range": 1,
      "actions": 2,
      "ability": "Charge Héroïque Imaginaire : charge 3 cases et +2 ATK",
      "copy": "",
      "noise": 1,
      "ai": "Charge le héros le plus éloigné visible. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Héros le plus éloigné visible.",
      "loot": [
        "Caleçon à coeur · 2 or",
        "Éperon rouillé · 3 or"
      ],
      "lore": "Un chevalier tombé de son cheval… et qui ne s’en est toujours pas rendus compte...",
      "tags": [
        "mini_boss",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Chevalier Sans Cheval.png",
      "sourceImg": "./mockup-assets/creatures/Chevalier Sans Cheval.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-cloche-possedee",
      "name": "Cloche Possédée",
      "cat": "tactique",
      "dungeon": "Le Château de Bastognac",
      "threat": 2,
      "base": "32",
      "pv": 3,
      "atk": 0,
      "def": 1,
      "range": 1,
      "actions": 1,
      "ability": "DRIIIING ! (Passif) : augmente de +1 le Brouhaha du donjon à chaque tour",
      "copy": "",
      "noise": 1,
      "ai": "S'éloigne du héros le plus proche. Priorité : Fuite.",
      "loot": [
        "Petit éclat de bronze · 1 or",
        "Battant de cloche · 2 or"
      ],
      "lore": "Autrefois utilisée pour appeler les repas. Aujourd’hui elle appelle surtout les ennuis.",
      "tags": [
        "tactique",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Cloche Possédée.png",
      "sourceImg": "./mockup-assets/creatures/Cloche Possédée.PNG",
      "match": {
        "method": "name",
        "score": 1
      }
    },
    {
      "id": "test-coasse-sombre",
      "name": "Coasse-Sombre",
      "cat": "mini_boss",
      "dungeon": "Les Marécages Infectés",
      "threat": 4,
      "base": "60",
      "pv": 22,
      "atk": 5,
      "def": 5,
      "range": 3,
      "actions": 3,
      "ability": "Chant des Nappes",
      "copy": "crée 2 zones de boue et pousse toutes les unités adjacentes de 1 case.",
      "noise": 2,
      "ai": "S’approche, fait monter la pression des flaques et casse la ligne au moment où tout semblait aller bien. Priorité : Groupe.",
      "loot": [
        "Cloche de nuit",
        "Bave noire"
      ],
      "lore": "Sa gorge produit un son si grave que la boue se sent jugée. Quand il coasse, le marais répond en écho sale.",
      "tags": [
        "gripplie",
        "les-marecages-infectes"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Coasse-Sombre.png",
      "sourceImg": "./mockup-assets/creatures/Coasse-Sombre.PNG",
      "match": {
        "method": "name",
        "score": 1
      }
    },
    {
      "id": "test-cuisinier-zombie",
      "name": "Cuisinier Zombie",
      "cat": "tactique",
      "dungeon": "Le Château de Bastognac",
      "threat": 2,
      "base": "32",
      "pv": 5,
      "atk": 1,
      "def": 3,
      "range": 1,
      "actions": 2,
      "ability": "Soupe du Jour (ça bouge encore) : +1 PV aux monstres à 2 cases (ignore obstacles)",
      "copy": "",
      "noise": 0,
      "ai": "Se rapproche d’un autre monstre pour le soutenir. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Créature la plus proche.",
      "loot": [
        "Morceau de viande suspecte",
        "Cuillère graisseuse"
      ],
      "lore": "Personne ne sait ce qu'il met dans sa marmite... mais les morts-vivants adorent.",
      "tags": [
        "tactique",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Cuisinier Zombie.png",
      "sourceImg": "./mockup-assets/creatures/Cuisinier Zombie.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-deesse-de-la-fermentation-sacree",
      "name": "Déesse de la Fermentation Sacrée",
      "cat": "mini_boss",
      "dungeon": "Le Panthéon des Fermentations Interdites",
      "threat": 4,
      "base": "60",
      "pv": 10,
      "atk": 3,
      "def": 2,
      "range": 2,
      "actions": 2,
      "ability": "Fermentation Ascendante",
      "copy": "gagne +1 ATK à chaque Brouhaha pair; à 3 cumuls, déclenche une explosion de zone 1.",
      "noise": 2,
      "ai": "Mutante et imprévisible, elle monte en puissance à mesure que le donjon devient incontrôlable. Priorité : Groupe.",
      "loot": [
        "Bulle sacrée",
        "Amulette de fermentation"
      ],
      "lore": "Incarnation instable de fermentation. Elle change de forme plus vite que l’humeur des aventuriers.",
      "tags": [
        "mini-boss",
        "panthéon-des-fermentations-interdites"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Déesse de la Fermentation Sacrée.png",
      "sourceImg": "./mockup-assets/creatures/Déesse de la Fermentation Sacrée.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-deesse-de-la-mousse-eternelle",
      "name": "Déesse de la Mousse Éternelle",
      "cat": "mini_boss",
      "dungeon": "Le Panthéon des Fermentations Interdites",
      "threat": 4,
      "base": "60",
      "pv": 11,
      "atk": 2,
      "def": 3,
      "range": 2,
      "actions": 3,
      "ability": "Litanie Mousseuse",
      "copy": "invoque 1 allié basique et soigne les alliés proches de 1 PV.",
      "noise": 1,
      "ai": "Reste au centre de la bataille et noie tout le monde sous des invocations aussi moelleuses qu’envahissantes. Priorité : Allié blessé.",
      "loot": [
        "Écume bénie",
        "Diadème mousseux · 3 or"
      ],
      "lore": "Entité divine de mousse infinie. N’a jamais arrêté de déborder et semble considérer cela comme une qualité liturgique.",
      "tags": [
        "mini-boss",
        "panthéon-des-fermentations-interdites"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Déesse de la Mousse Éternelle.png",
      "sourceImg": "./mockup-assets/creatures/Déesse de la Mousse Éternelle.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-deesse-du-houblon-absolu",
      "name": "Déesse du Houblon Absolu",
      "cat": "mini_boss",
      "dungeon": "Le Panthéon des Fermentations Interdites",
      "threat": 4,
      "base": "60",
      "pv": 12,
      "atk": 2,
      "def": 5,
      "range": 3,
      "actions": 2,
      "ability": "Domination Végétale",
      "copy": "immobilise une cible à portée 3 et réduit le déplacement des unités proches de 1.",
      "noise": 1,
      "ai": "Contrôle la salle comme si le houblon lui avait donné les clefs du couloir et de la conscience collective. Priorité : Héros le plus proche.",
      "loot": [
        "Couronne verte · 3 or",
        "Brin de houblon pur"
      ],
      "lore": "Contrôle le houblon et l’esprit avec l’assurance d’une plante qui s’est clairement prise pour un dogme.",
      "tags": [
        "mini-boss",
        "panthéon-des-fermentations-interdites"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Déesse du Houblon Absolu.png",
      "sourceImg": "./mockup-assets/creatures/Déesse du Houblon Absolu.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-degustatrice-divine",
      "name": "Dégustatrice Divine",
      "cat": "tactique",
      "dungeon": "Le Panthéon des Fermentations Interdites",
      "threat": 2,
      "base": "32",
      "pv": 5,
      "atk": 2,
      "def": 2,
      "range": 2,
      "actions": 2,
      "ability": "Analyse Sensorielle",
      "copy": "un héros à portée 2 subit -1 ATK ou -1 DEF jusqu’à son prochain tour (au choix du donjon).",
      "noise": 1,
      "ai": "Observe les cibles avec le calme d’une juge et le tact d’un taureau dans une cave. Priorité : Héros le plus proche.",
      "loot": [
        "Perle de dégustation · 2 or",
        "Cahier de notes"
      ],
      "lore": "Goûte les gens sans consentement et les range dans la catégorie “buvable” ou “décevant”.",
      "tags": [
        "tactique",
        "panthéon-des-fermentations-interdites"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Dégustatrice Divine.png",
      "sourceImg": "./mockup-assets/creatures/Dégustatrice Divine.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-diablotine-controleuse",
      "name": "Diablotine Contrôleuse",
      "cat": "basique",
      "dungeon": "L'enfer de la Sobriété Éternelle",
      "threat": 2,
      "base": "32",
      "pv": 5,
      "atk": 1,
      "def": 1,
      "range": 3,
      "actions": 2,
      "ability": "Vérification Administrative",
      "copy": "supprime un buff ou un bonus de déplacement à portée 3.",
      "noise": 1,
      "ai": "Note tout, puis retire ce qui semble trop amusant. Priorité : Héros buffé.",
      "loot": [
        "Registre humide",
        "Tampon d'ordre · 1 or"
      ],
      "lore": "Elle note tout. Même tes soupirs.",
      "tags": [
        "sobriete-eternelle"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Diablotine Contrôleuse.png",
      "sourceImg": "./mockup-assets/creatures/Diablotine Contrôleuse.PNG",
      "match": {
        "method": "name",
        "score": 1
      }
    },
    {
      "id": "test-fantome-bureaucrate",
      "name": "Fantôme Bureaucrate",
      "cat": "tactique",
      "dungeon": "Le Château de Bastognac",
      "threat": 2,
      "base": "32",
      "pv": 8,
      "atk": 1,
      "def": 6,
      "range": 1,
      "actions": 2,
      "ability": "Formulaire 27-B Obligatoire : ignore blocages et traverse obstacles",
      "copy": "",
      "noise": 0,
      "ai": "Occupe les portes et passages étroits pour bloquer l’accès. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Porte la plus proche.",
      "loot": [
        "Formulaire spectral",
        "Tampon officiel"
      ],
      "lore": "Mort au travail après avoir rempli le formulaire 847-B sans tampon officiel. Depuis, il est condamné a gérer l’accès aux couloirs du donjon.",
      "tags": [
        "tactique",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Fantôme Bureaucrate.png",
      "sourceImg": "./mockup-assets/creatures/Fantôme Bureaucrate.PNG",
      "match": {
        "method": "name",
        "score": 1
      }
    },
    {
      "id": "test-garde-possede",
      "name": "Garde Possédé",
      "cat": "tactique",
      "dungeon": "Le Château de Bastognac",
      "threat": 2,
      "base": "32",
      "pv": 6,
      "atk": 3,
      "def": 2,
      "range": 1,
      "actions": 2,
      "ability": "Protection Spectrale : monstres adjacents +1 DEF",
      "copy": "",
      "noise": 0,
      "ai": "Protège le monstre le plus proche en se plaçant devant lui. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Créature la plus proche.",
      "loot": [
        "Casque cabossé · 2 or",
        "Insigne militaire · 1 or"
      ],
      "lore": "Ancien soldat fidèle… toujours fidèle… même mort.",
      "tags": [
        "tactique",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Garde Possédé.png",
      "sourceImg": "./mockup-assets/creatures/Garde Possédé.PNG",
      "match": {
        "method": "name",
        "score": 1
      }
    },
    {
      "id": "test-gobelin-bricoleur",
      "name": "Gobelin Bricoleur",
      "cat": "basique",
      "dungeon": "Le Château de Bastognac",
      "threat": 1,
      "base": "32",
      "pv": 2,
      "atk": 1,
      "def": 0,
      "range": 1,
      "actions": 2,
      "ability": "—",
      "copy": "",
      "noise": 0,
      "ai": "Si un objet interactif est adjacent, il le lance sur un héros. Sinon il attaque. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Héros le plus proche.",
      "loot": [
        "Ressort mystérieux · 1 or",
        "Sac de vis rouillées · 1 or"
      ],
      "lore": "Gobelin persuadé d'être un génie de l'ingénierie. Ses inventions explosent souvent... mais rarement comme prévu.",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Gobelin Bricoleur.png",
      "sourceImg": "./mockup-assets/creatures/Gobelin Bricoleur.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-gobelin-chef",
      "name": "Gobelin Chef",
      "cat": "tactique",
      "dungeon": "Le Château de Bastognac",
      "threat": 2,
      "base": "32",
      "pv": 6,
      "atk": 2,
      "def": 3,
      "range": 1,
      "actions": 3,
      "ability": "Motivation Gobeline (passif) : gobelins à 3 cases +1 ATK",
      "copy": "",
      "noise": 1,
      "ai": "Reste derrière les gobelins et leur donne des bonus. Si un objet interactif est adjacent, il le lance sur un héros. Sinon il se dirige vers un objet interactif. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Objet interactif le plus proche.",
      "loot": [
        "Plan de raid raté · 1 or",
        "Couronne cabossée · 3 or"
      ],
      "lore": "Chef autoproclamé des gobelins. Sa stratégie repose surtout sur sa capacité à hurler des ordres incompréhensibles.",
      "tags": [
        "tactique",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Gobelin Chef.png",
      "sourceImg": "./mockup-assets/creatures/Gobelin Chef.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-gobelin-lance-tout",
      "name": "Gobelin Lance-Tout",
      "cat": "basique",
      "dungeon": "Le Château de Bastognac",
      "threat": 1,
      "base": "32",
      "pv": 2,
      "atk": 1,
      "def": 0,
      "range": 3,
      "actions": 2,
      "ability": "—",
      "copy": "",
      "noise": 0,
      "ai": "Reste à au moins 2 cases des héros et lance des objets. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Héros le plus proche.",
      "loot": [
        "Bout de ferraille · 1 or",
        "Caillou bien équilibré"
      ],
      "lore": "Si quelque chose peut être jeté… ce gobelin le jettera. Pierres, os, couteaux, chaussures… parfois même d’autres gobelins.",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Gobelin Lance-Tout.png",
      "sourceImg": "./mockup-assets/creatures/Gobelin Lance-Tout.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-gobeline-aguicheuse",
      "name": "Gobeline Aguicheuse",
      "cat": "basique",
      "dungeon": "Le Cabaret des Joyeuses",
      "threat": 1,
      "base": "32",
      "pv": 4,
      "atk": 2,
      "def": 1,
      "range": 1,
      "actions": 2,
      "ability": "Regard Fatal",
      "copy": "attire 1 héros de 1 case; s’il devient adjacent, il subit -1 DEF jusqu’à son prochain tour",
      "noise": 1,
      "ai": "Isole la cible la plus proche puis la rapproche Priorité : Isolé > Faible DEF.",
      "loot": [
        "Éventail de scène",
        "Rouge à lèvres écarlate · 1 or"
      ],
      "lore": "Elle attire les héros comme un clin d’œil qui promet des ennuis et un peu trop de proximité. Une fois qu’on s’approche, elle considère déjà la partie gagnée.",
      "tags": [
        "le-cabaret-des-joyeuses"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Gobeline Aguicheuse.png",
      "sourceImg": "./mockup-assets/creatures/Gobeline Aguicheuse.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-gobeline-serveuse-explosive",
      "name": "Gobeline Serveuse Explosive",
      "cat": "basique",
      "dungeon": "Le Cabaret des Joyeuses",
      "threat": 1,
      "base": "32",
      "pv": 3,
      "atk": 3,
      "def": 1,
      "range": 1,
      "actions": 2,
      "ability": "Service Détonnant",
      "copy": "à sa mort, explosion en zone 1 infligeant 1 dégât et +2 bruit",
      "noise": 2,
      "ai": "Se jette dans les groupes et force la mêlée Priorité : Groupe.",
      "loot": [
        "Verre explosif",
        "Tablier brûlé · 1 or"
      ],
      "lore": "Elle sert les verres avec une ardeur qui manque franchement de retenue. Chez elle, le cocktail finit souvent en rouge, en chaud et en très mauvaise idée.",
      "tags": [
        "le-cabaret-des-joyeuses"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Gobeline Serveuse Explosive.png",
      "sourceImg": "./mockup-assets/creatures/Gobeline Serveuse Explosive.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-inspectrice-du-gout-dechue",
      "name": "Inspectrice du Goût Déchue",
      "cat": "basique",
      "dungeon": "Le Panthéon des Fermentations Interdites",
      "threat": 1,
      "base": "32",
      "pv": 4,
      "atk": 2,
      "def": 2,
      "range": 2,
      "actions": 1,
      "ability": "Jugement de Dégustation",
      "copy": "cible adjacente subit -1 ATK et -1 DEF jusqu’à son prochain tour.",
      "noise": 1,
      "ai": "Analyse les héros de près et leur assène des malus avec la froideur d’un mauvais critique gastronomique. Priorité : Héros le plus proche.",
      "loot": [
        "Palette de jugement",
        "Lunettes de dégustation · 1 or"
      ],
      "lore": "Ange brassicole déchue qui juge tout avec un palais trop exercé. A goûté trop de choses et condamne le reste par réflexe.",
      "tags": [
        "basique",
        "panthéon-des-fermentations-interdites"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Inspectrice du Goût Déchue.png",
      "sourceImg": "./mockup-assets/creatures/Inspectrice du Goût Déchue.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-larve-de-houblon",
      "name": "Larve de Houblon",
      "cat": "basique",
      "dungeon": "Le Sanctuaire du Houblon Noir",
      "threat": 1,
      "base": "32",
      "pv": 2,
      "atk": 1,
      "def": 0,
      "range": 1,
      "actions": 1,
      "ability": "Fermentation Rapide : si ignorée pendant 1 tour complet, invoque une Larve adjacente.",
      "copy": "",
      "noise": 0,
      "ai": "Reste près des décors et se multiplie discrètement. Priorité : Décor proche.",
      "loot": [],
      "lore": "Une petite larve verte qui transforme rapidement un problème mineur en réunion de famille.",
      "tags": [
        "basique",
        "sanctuaire-du-houblon-noir"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Larve de Houblon.png",
      "sourceImg": "./mockup-assets/creatures/Larve de Houblon.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-leviathan-hydrique",
      "name": "Léviathan Hydrique",
      "cat": "mini_boss",
      "dungeon": "L'enfer de la Sobriété Éternelle",
      "threat": 6,
      "base": "60",
      "pv": 26,
      "atk": 4,
      "def": 4,
      "range": 3,
      "actions": 2,
      "ability": "Déferlante Pure",
      "copy": "pousse toutes les unités à portée 2 de 1 case; si elles touchent un décor, elles subissent +1 dégât.",
      "noise": 2,
      "ai": "Se déplace comme une vague qui a appris à compter les côtes. Priorité : Groupe.",
      "loot": [
        "Onde captive",
        "Goutte d'ambre · 2 or"
      ],
      "lore": "Une masse d’eau vivante, parfaitement calme.",
      "tags": [
        "sobriete-eternelle"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Léviathan Hydrique.png",
      "sourceImg": "./mockup-assets/creatures/Léviathan Hydrique.PNG",
      "match": {
        "method": "name",
        "score": 1
      }
    },
    {
      "id": "test-maitre-brasseur-mecanognome",
      "name": "Maître Brasseur MécanoGnome",
      "cat": "tactique",
      "dungeon": "Le Sanctuaire du Houblon Noir",
      "threat": 2,
      "base": "32",
      "pv": 6,
      "atk": 1,
      "def": 3,
      "range": 2,
      "actions": 2,
      "ability": "Ordre de Brassage : alliés à 2 cases gagnent +1 ATK jusqu’à la fin du tour.",
      "copy": "",
      "noise": 1,
      "ai": "Reste derrière la ligne et buff les alliés offensifs. Priorité : Allié proche.",
      "loot": [
        "Clé à cuve · 2 or",
        "Rivet moteur"
      ],
      "lore": "Il appelle ça de la stratégie industrielle. Les autres appellent ça hurler sur des tonneaux.",
      "tags": [
        "tactique",
        "sanctuaire-du-houblon-noir"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Maître Brasseur MécanoGnome.png",
      "sourceImg": "./mockup-assets/creatures/Maître Brasseur MécanoGnome.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-mimique-rate",
      "name": "Mimique Raté",
      "cat": "speciale",
      "dungeon": "Le Château de Bastognac",
      "threat": 3,
      "base": "40",
      "pv": 4,
      "atk": 3,
      "def": 1,
      "range": 1,
      "actions": 2,
      "ability": "SURPRISE ! : première attaque +2 dégâts",
      "copy": "",
      "noise": 1,
      "ai": "Ne peut pas se déplacer, attaque uniquement quand un joueur est adjacent. Priorité : Héros avec la DEF la plus faible.",
      "loot": [
        "Dent de coffre · 2 or",
        "Trésor du Mimique · 3 or"
      ],
      "lore": "Un mimique qui n’a jamais vraiment compris comment imiter un coffre. Le panneau “I am treasure” était censé aider.",
      "tags": [
        "speciale",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Mimique Raté.png",
      "sourceImg": "./mockup-assets/creatures/Mimique Raté.PNG",
      "match": {
        "method": "name",
        "score": 1
      }
    },
    {
      "id": "test-ogre-maladroit",
      "name": "Ogre Maladroit",
      "cat": "brute",
      "dungeon": "Le Château de Bastognac",
      "threat": 4,
      "base": "40",
      "pv": 14,
      "atk": 4,
      "def": 3,
      "range": 1,
      "actions": 1,
      "ability": "Gros Bourrin (passif) : après attaque repousse tous les héros adjacents de 2 cases",
      "copy": "",
      "noise": 1,
      "ai": "Avance tout droit vers les héros en poussant les objets. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Héros le plus proche.",
      "loot": [
        "Dent d’ogre · 2 or",
        "Slip d'ogre · 3 or"
      ],
      "lore": "Très fort. Très dangereux. Très stupide. Il a déjà perdu un combat contre une porte.",
      "tags": [
        "brute",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Ogre Maladroit.png",
      "sourceImg": "./mockup-assets/creatures/Ogre Maladroit.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-poule-a-biere-infernale",
      "name": "Poule à Bière Infernale",
      "cat": "speciale",
      "dungeon": "Le Panthéon des Fermentations Interdites",
      "threat": 3,
      "base": "32",
      "pv": 5,
      "atk": 3,
      "def": 1,
      "range": 2,
      "actions": 2,
      "ability": "Ponte Sacrilège",
      "copy": "pond un œuf explosif; au début du prochain tour de monstres, l’œuf explose en zone 1.",
      "noise": 2,
      "ai": "Reste à distance et sème des œufs explosifs avec une discipline qui rend la scène encore plus absurde. Priorité : Groupe visible.",
      "loot": [
        "Œuf sacrilège",
        "Plume au soufre · 1 or"
      ],
      "lore": "Poule en houblon possédée, validée par erreur divine. Même le panthéon hésite à la reconnaître.",
      "tags": [
        "spéciale",
        "panthéon-des-fermentations-interdites"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Poule Démoniaque.png",
      "sourceImg": "./mockup-assets/creatures/Poule Démoniaque.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-saute-tonneau",
      "name": "Saute-Tonneau",
      "cat": "basique",
      "dungeon": "Les Marécages Infectés",
      "threat": 1,
      "base": "32",
      "pv": 8,
      "atk": 3,
      "def": 2,
      "range": 2,
      "actions": 2,
      "ability": "Baril Bondissant",
      "copy": "charge de 2 cases puis pousse la cible de 1 case.",
      "noise": 1,
      "ai": "Saute dans la mêlée avec son tonneau comme si le bon sens était optionnel. Priorité : Groupe.",
      "loot": [
        "Boue tactique",
        "Résidu de Saute-Tonneau · 1 or"
      ],
      "lore": "Il saute sur un tonneau, le tonneau saute sur les héros, et tout le monde fait semblant que c’était prévu.",
      "tags": [
        "gripplie",
        "les-marecages-infectes"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Saute-Tonneau.png",
      "sourceImg": "./mockup-assets/creatures/Saute-Tonneau.PNG",
      "match": {
        "method": "name",
        "score": 1
      }
    },
    {
      "id": "test-squelette-maladroit",
      "name": "Squelette Maladroit",
      "cat": "basique",
      "dungeon": "Le Château de Bastognac",
      "threat": 1,
      "base": "32",
      "pv": 3,
      "atk": 2,
      "def": 1,
      "range": 1,
      "actions": 2,
      "ability": "—",
      "copy": "",
      "noise": 0,
      "ai": "Avance toujours vers le héros le plus proche. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Héros le plus proche.",
      "loot": [
        "Os détachable · 1 or",
        "Rotule branlante"
      ],
      "lore": "Mort-vivant un peu désarticulé qui se bat avec enthousiasme... mais pas toujours avec précision.",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Squelette Maladroit.png",
      "sourceImg": "./mockup-assets/creatures/Squelette Maladroit.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-squelette-porte-placard",
      "name": "Squelette Porte-Placard",
      "cat": "basique",
      "dungeon": "Le Château de Bastognac",
      "threat": 1,
      "base": "32",
      "pv": 5,
      "atk": 1,
      "def": 2,
      "range": 1,
      "actions": 1,
      "ability": "—",
      "copy": "",
      "noise": 0,
      "ai": "Se place dans les passages étroits pour bloquer les héros. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Héros le plus proche.",
      "loot": [
        "Poignée de porte · 2 or",
        "Charnière de placard · 1 or"
      ],
      "lore": "Il a passé tellement de temps enfermé dans un placard qu’il a développé un talent unique : bloquer les portes.",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Squelette Porte-Placard.png",
      "sourceImg": "./mockup-assets/creatures/Squelette Porte-Placard.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    },
    {
      "id": "test-squelette-tire-au-pif",
      "name": "Squelette Tire-au-Pif",
      "cat": "basique",
      "dungeon": "Le Château de Bastognac",
      "threat": 1,
      "base": "32",
      "pv": 2,
      "atk": 2,
      "def": 0,
      "range": 4,
      "actions": 2,
      "ability": "—",
      "copy": "",
      "noise": 0,
      "ai": "Tire sur le héros le plus éloigné visible. | Règle universelle : si aucune condition spéciale ne s'applique → se déplacer vers le héros le plus proche et attaquer. Priorité : Héros le plus éloigné visible.",
      "loot": [
        "Flèche tordue",
        "Carquois troué · 1 or"
      ],
      "lore": "Contrairement aux archers ordinaires, celui-ci ne vise absolument rien. Il tire dans une direction et espère très fort que quelqu’un s’y trouve. Étonnamment… ça marche parfois.",
      "tags": [
        "basique",
        "le-chateau-de-bastognac"
      ],
      "displayImg": "./mockup-assets/creatures-transparent/Squelette Tire-au-Pif.png",
      "sourceImg": "./mockup-assets/creatures/Squelette Tire-au-Pif.PNG",
      "match": {
        "method": "media-path",
        "score": 1
      }
    }
  ],
  "heroes": [
    {
      "id": "test-brunhilda-la-torgnole",
      "name": "Brünhilda la Torgnole",
      "image": "./mockup-assets/heros-transparent/Brünhilda la Torgnole - Level 1.png",
      "levels": [
        {
          "level": 1,
          "name": "Brünhilda la Torgnole - Mur en slip",
          "title": "Mur en slip",
          "role": "Tank",
          "pv": 12,
          "atk": 3,
          "def": 4,
          "zone": 1,
          "actions": 3,
          "ability": "Ivresse Héroïque",
          "effect": "Gagne +2 DEF pendant 1 tour et repousse les ennemis adjacents d'une case.",
          "brouhaha": "",
          "tags": [
            "brunhilda-la-torgnole",
            "tank"
          ],
          "image": "./mockup-assets/heros-transparent/Brünhilda la Torgnole - Level 1.png",
          "match_score": 1
        },
        {
          "level": 2,
          "name": "Brünhilda la Torgnole - Pare-Baffes",
          "title": "Pare-Baffes",
          "role": "Tank",
          "pv": 14,
          "atk": 3,
          "def": 4,
          "zone": 1,
          "actions": 3,
          "ability": "-",
          "effect": "",
          "brouhaha": "",
          "tags": [
            "brunhilda-la-torgnole",
            "tank"
          ],
          "image": "./mockup-assets/heros-transparent/Brünhilda la Torgnole - Level 2.png",
          "match_score": 1
        },
        {
          "level": 3,
          "name": "Brünhilda la Torgnole - Rempart à Mandales",
          "title": "Rempart à Mandales",
          "role": "Tank",
          "pv": 16,
          "atk": 3,
          "def": 4,
          "zone": 1,
          "actions": 3,
          "ability": "Torgnole Monumentale",
          "effect": "Baffe circulaire qui repousse les créatures adjacentes de 2 cases et leur fait perdre 1 PV, la baffe ignore la DEF et touche les ennemis, les alliés et les objets",
          "brouhaha": "+1",
          "tags": [
            "brunhilda-la-torgnole",
            "tank"
          ],
          "image": "./mockup-assets/heros-transparent/Brünhilda la Torgnole - Level 3.png",
          "match_score": 1
        },
        {
          "level": 4,
          "name": "Brünhilda la Torgnole - Forteresse à Torgnoles",
          "title": "Forteresse à Torgnoles",
          "role": "Tank",
          "pv": 18,
          "atk": 3,
          "def": 5,
          "zone": 1,
          "actions": 3,
          "ability": "Rugissement de la Gargote",
          "effect": "Bloque tout les déplacements ennemis et alliés au prochain tour",
          "brouhaha": "+1",
          "tags": [
            "brunhilda-la-torgnole",
            "tank"
          ],
          "image": "./mockup-assets/heros-transparent/Brünhilda la Torgnole - Level 4.png",
          "match_score": 1
        }
      ]
    },
    {
      "id": "test-glibouille-nenucorde",
      "name": "Glibouille Nénucorde",
      "image": "./mockup-assets/heros-transparent/Glibouille Nénucorde - Level 1.png",
      "levels": [
        {
          "level": 1,
          "name": "Glibouille Nénucorde - La Barboteuse",
          "title": "La Barboteuse",
          "role": "Hameçonneuse",
          "pv": 4,
          "atk": 1,
          "def": 1,
          "zone": 3,
          "actions": 3,
          "ability": "Hameçon Piteux",
          "effect": "Inflige 1 dégât à une cible ennemie, puis Glibouille peut la tirer d'1 case vers elle ou la repousser d'1 case si la case d'arrivée est libre.",
          "brouhaha": "",
          "tags": [
            "glibouille-nenucorde",
            "hameconneuse",
            "gripplie",
            "controle-terrain",
            "repositionnement"
          ],
          "image": "./mockup-assets/heros-transparent/Glibouille Nénucorde - Level 1.png",
          "match_score": 1
        },
        {
          "level": 2,
          "name": "Glibouille Nénucorde - La Lanceuse de Flaque",
          "title": "La Lanceuse de Flaque",
          "role": "Hameçonneuse",
          "pv": 5,
          "atk": 1,
          "def": 1,
          "zone": 3,
          "actions": 3,
          "ability": "Double Tir de Nénucorde",
          "effect": "Choisit jusqu'à 2 cibles à portée 3. Les ennemis subissent 1 dégât. Chaque cible peut être tirée d'1 case vers Glibouille ou repoussée d'1 case. Les alliés peuvent être déplacés sans subir de dégât.",
          "brouhaha": "",
          "tags": [
            "glibouille-nenucorde",
            "hameconneuse",
            "gripplie",
            "controle-terrain",
            "repositionnement"
          ],
          "image": "./mockup-assets/heros-transparent/Glibouille Nénucorde - Level 2.png",
          "match_score": 1
        },
        {
          "level": 3,
          "name": "Glibouille Nénucorde - La Harponneuse de Comptoir",
          "title": "La Harponneuse de Comptoir",
          "role": "Hameçonneuse",
          "pv": 6,
          "atk": 2,
          "def": 1,
          "zone": 3,
          "actions": 3,
          "ability": "Râteau de Marécage",
          "effect": "Choisit une ligne de 3 cases à portée 3. Les ennemis dans la ligne subissent 1 dégât. Glibouille choisit ensuite : toutes les cibles sont tirées d'1 case vers le centre de la ligne ou repoussées d'1 case vers l'extérieur.",
          "brouhaha": "+1",
          "tags": [
            "glibouille-nenucorde",
            "hameconneuse",
            "gripplie",
            "controle-terrain",
            "ligne",
            "repositionnement"
          ],
          "image": "./mockup-assets/heros-transparent/Glibouille Nénucorde - Level 3.png",
          "match_score": 1
        },
        {
          "level": 4,
          "name": "Glibouille Nénucorde - La Grande Crapaudine du Dernier Plouf",
          "title": "La Grande Crapaudine du Dernier Plouf",
          "role": "Hameçonneuse",
          "pv": 7,
          "atk": 2,
          "def": 2,
          "zone": 3,
          "actions": 3,
          "ability": "Grand Plouf des Hameçons",
          "effect": "Choisit une zone de 3 cases à portée 3. Les ennemis subissent 2 dégâts. Glibouille peut ensuite déplacer chaque cible d'1 case, soit vers le centre de la zone, soit à l'opposé. Les alliés peuvent être déplacés sans subir de dégât.",
          "brouhaha": "+1",
          "tags": [
            "glibouille-nenucorde",
            "hameconneuse",
            "gripplie",
            "controle-terrain",
            "zone",
            "repositionnement"
          ],
          "image": "./mockup-assets/heros-transparent/Glibouille Nénucorde - Level 4.png",
          "match_score": 1
        }
      ]
    },
    {
      "id": "test-magdalena-coquinelle",
      "name": "Magdalena Coquinelle",
      "image": "./mockup-assets/heros-transparent/Magdalena Coquinelle - Level 1.png",
      "levels": [
        {
          "level": 1,
          "name": "Magdalena Coquinelle - Pécheresse Repentie",
          "title": "Pécheresse Repentie",
          "role": "Clerc soutien",
          "pv": 7,
          "atk": 2,
          "def": 2,
          "zone": 3,
          "actions": 3,
          "ability": "Petite Taffe",
          "effect": "Soigne 2 PV à un allié, portée 3",
          "brouhaha": "",
          "tags": [
            "magdalena-coquinelle",
            "clerc-soutien"
          ],
          "image": "./mockup-assets/heros-transparent/Magdalena Coquinelle - Level 1.png",
          "match_score": 1
        },
        {
          "level": 2,
          "name": "Magdalena Coquinelle - Consolatrice des Ratés",
          "title": "Consolatrice des Ratés",
          "role": "Clerc soutien",
          "pv": 8,
          "atk": 2,
          "def": 2,
          "zone": 3,
          "actions": 3,
          "ability": "Bouffée Sacrée",
          "effect": "Soigne +1 PV et +1 DEF pendant 2 tours, portée 3",
          "brouhaha": "",
          "tags": [
            "magdalena-coquinelle",
            "clerc-soutien"
          ],
          "image": "./mockup-assets/heros-transparent/Magdalena Coquinelle - Level 2.png",
          "match_score": 1
        },
        {
          "level": 3,
          "name": "Magdalena Coquinelle - Miraculée du Comptoir",
          "title": "Miraculée du Comptoir",
          "role": "Clerc soutien",
          "pv": 9,
          "atk": 2,
          "def": 3,
          "zone": 3,
          "actions": 3,
          "ability": "Nuage Miraculeux",
          "effect": "Soigne +2 PV à tous les alliés mais leurs faits perdre 1 action au tour suivant",
          "brouhaha": "",
          "tags": [
            "magdalena-coquinelle",
            "clerc-soutien"
          ],
          "image": "./mockup-assets/heros-transparent/Magdalena Coquinelle - Level 3.png",
          "match_score": 1
        },
        {
          "level": 4,
          "name": "Magdalena Coquinelle - Abbesse du Lupanar",
          "title": "Abbesse du Lupanar",
          "role": "Clerc soutien",
          "pv": 10,
          "atk": 4,
          "def": 4,
          "zone": 3,
          "actions": 3,
          "ability": "Fumée Divine",
          "effect": "Soigne +4 PV et +1 ATK à un allié pendant 1 tour, mais bloque ces déplacements pendant 1 tour (et lui donne les yeux rouges)",
          "brouhaha": "",
          "tags": [
            "magdalena-coquinelle",
            "clerc-soutien"
          ],
          "image": "./mockup-assets/heros-transparent/Magdalena Coquinelle - Level 4.png",
          "match_score": 1
        }
      ]
    },
    {
      "id": "test-mandaline-cataparebaffe",
      "name": "Mandaline Cataparebaffe",
      "image": "./mockup-assets/heros-transparent/Mandaline Cataparebaffe - Level 1.png",
      "levels": [
        {
          "level": 1,
          "name": "Mandaline Cataparebaffe - La P’tite Torgnole",
          "title": "La P’tite Torgnole",
          "role": "Tank",
          "pv": 11,
          "atk": 1,
          "def": 4,
          "zone": 1,
          "actions": 3,
          "ability": "Claque-Bouclier de Caniveau",
          "effect": "Inflige 1 dégât et pousse la cible d’1 case. Si la cible percute un mur ou un objet, elle perd 1 action au prochain tour.",
          "brouhaha": "",
          "tags": [
            "mandaline-cataparebaffe",
            "tank",
            "diablotine"
          ],
          "image": "./mockup-assets/heros-transparent/Mandaline Cataparebaffe - Level 1.png",
          "match_score": 1
        },
        {
          "level": 2,
          "name": "Mandaline Cataparebaffe - La Muraille à Cornes",
          "title": "La Muraille à Cornes",
          "role": "Tank",
          "pv": 13,
          "atk": 2,
          "def": 4,
          "zone": 1,
          "actions": 3,
          "ability": "Porte dans les Dents",
          "effect": "Charge de 2 cases en ligne droite. Les cibles touchées subissent 1 dégât et sont repoussées d’1 case.",
          "brouhaha": "",
          "tags": [
            "mandaline-cataparebaffe",
            "tank",
            "diablotine"
          ],
          "image": "./mockup-assets/heros-transparent/Mandaline Cataparebaffe - Level 2.png",
          "match_score": 1
        },
        {
          "level": 3,
          "name": "Mandaline Cataparebaffe - La Cognepareuse",
          "title": "La Cognepareuse",
          "role": "Tank",
          "pv": 15,
          "atk": 2,
          "def": 5,
          "zone": 1,
          "actions": 3,
          "ability": "Parade à Mandales",
          "effect": "Jusqu’au prochain tour, Mandaline gagne +2 DEF. Les créatures adjacentes qui l’attaquent subissent 1 dégât.",
          "brouhaha": "+1",
          "tags": [
            "mandaline-cataparebaffe",
            "tank",
            "diablotine"
          ],
          "image": "./mockup-assets/heros-transparent/Mandaline Cataparebaffe - Level 3.png",
          "match_score": 1
        },
        {
          "level": 4,
          "name": "Mandaline Cataparebaffe - L’Infernale Tankardière",
          "title": "L’Infernale Tankardière",
          "role": "Tank",
          "pv": 18,
          "atk": 2,
          "def": 5,
          "zone": 1,
          "actions": 3,
          "ability": "Mur de Cataparebaffes",
          "effect": "Repousse toutes les créatures adjacentes de 2 cases. Les cibles qui heurtent un obstacle subissent 2 dégâts supplémentaires.",
          "brouhaha": "+1",
          "tags": [
            "mandaline-cataparebaffe",
            "tank",
            "diablotine"
          ],
          "image": "./mockup-assets/heros-transparent/Mandaline Cataparebaffe - Level 4.png",
          "match_score": 1
        }
      ]
    },
    {
      "id": "test-mycelia-sporeventail",
      "name": "Mycélia Sporeventail",
      "image": "./mockup-assets/heros-transparent/Mycélia Sporeventail - Level 1.png",
      "levels": [
        {
          "level": 1,
          "name": "Mycélia Sporeventail - La Recrue Rincée",
          "title": "La Recrue Rincée",
          "role": "Sporicienne",
          "pv": 4,
          "atk": 1,
          "def": 1,
          "zone": 3,
          "actions": 3,
          "ability": "Spore de Fond de Chope",
          "effect": "Inflige 1 dégât à une cible ennemie et l'empoisonne : elle subit 1 dégât au début de son prochain tour.",
          "brouhaha": "",
          "tags": [
            "mycelia-sporeventail",
            "sporicienne",
            "mycelienne",
            "support",
            "poison"
          ],
          "image": "./mockup-assets/heros-transparent/Mycélia Sporeventail - Level 1.png",
          "match_score": 1
        },
        {
          "level": 2,
          "name": "Mycélia Sporeventail - La Parasoline de Comptoir",
          "title": "La Parasoline de Comptoir",
          "role": "Sporicienne",
          "pv": 5,
          "atk": 1,
          "def": 1,
          "zone": 3,
          "actions": 3,
          "ability": "Pollen de Rattrapage",
          "effect": "Si c'est un ennemi, elle subit 1 dégât et est empoisonnée pour 1 dégât au début de son prochain tour. Si c'est un allié, il récupère 2 PV.",
          "brouhaha": "",
          "tags": [
            "mycelia-sporeventail",
            "sporicienne",
            "mycelienne",
            "support",
            "poison",
            "soin"
          ],
          "image": "./mockup-assets/heros-transparent/Mycélia Sporeventail - Level 2.png",
          "match_score": 1
        },
        {
          "level": 3,
          "name": "Mycélia Sporeventail - La Consolideuse de Mousse",
          "title": "La Consolideuse de Mousse",
          "role": "Sporicienne",
          "pv": 6,
          "atk": 2,
          "def": 1,
          "zone": 3,
          "actions": 3,
          "ability": "Nuage de Spores Tièdes",
          "effect": "Choisit une zone de 4 cases à portée 3. Les ennemis dans la zone sont empoisonnés et subissent 1 dégât au début de leur prochain tour. Les alliés dans la zone récupèrent 2 PV.",
          "brouhaha": "+1",
          "tags": [
            "mycelia-sporeventail",
            "sporicienne",
            "mycelienne",
            "support",
            "poison",
            "soin",
            "zone"
          ],
          "image": "./mockup-assets/heros-transparent/Mycélia Sporeventail - Level 3.png",
          "match_score": 1
        },
        {
          "level": 4,
          "name": "Mycélia Sporeventail - La Marquise de la Chope Moussue",
          "title": "La Marquise de la Chope Moussue",
          "role": "Sporicienne",
          "pv": 7,
          "atk": 2,
          "def": 2,
          "zone": 3,
          "actions": 3,
          "ability": "Marquisat du Moisi Royal",
          "effect": "Choisit une zone de 9 cases à portée 3. Les ennemis dans la zone sont empoisonnés : ils subissent 2 dégâts au début de leur prochain tour. Les alliés dans la zone récupèrent 3 PV.",
          "brouhaha": "+1",
          "tags": [
            "mycelia-sporeventail",
            "sporicienne",
            "mycelienne",
            "support",
            "poison",
            "soin",
            "zone"
          ],
          "image": "./mockup-assets/heros-transparent/Mycélia Sporeventail - Level 4.png",
          "match_score": 1
        }
      ]
    }
  ],
  "unmatched": {
    "creatures": [],
    "heroes": []
  }
};
