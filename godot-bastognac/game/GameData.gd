class_name GameData
extends RefCounted

const HEROES := [
	{"id":"brunhilda","name":"Brünhilda la Torgnole","title":"Mur en slip","role":"Tank","max_hp":12,"atk":3,"def":4,"range":1,"ability":"Ivresse Héroïque","ability_text":"+2 DEF ce tour et repousse les ennemis adjacents.","color":Color("d67b50")},
	{"id":"aelion","name":"Aelion Trois-Gorgées","title":"Snob déshydraté","role":"Assassin","max_hp":6,"atk":3,"def":1,"range":1,"ability":"Petite Rasade","ability_text":"+1 ATK ce tour et 1 déplacement gratuit.","color":Color("8cc5c7")},
	{"id":"magdalena","name":"Magdalena Coquinelle","title":"Pécheresse repentie","role":"Clerc soutien","max_hp":7,"atk":2,"def":2,"range":3,"ability":"Petite Taffe","ability_text":"Soigne 2 PV à un allié à portée 3.","color":Color("c49ac9")},
	{"id":"grompif","name":"Grompif Arcabidon","title":"Apprenti Distillomage","role":"Mage distance","max_hp":5,"atk":4,"def":1,"range":4,"ability":"Jet de Gnôle","ability_text":"+1 ATK ce tour. L'attaque éclabousse une case adjacente.","color":Color("d7b568")}
]

const CREATURES := {
	"Gobelin Bricoleur":{"category":"basique","menace":1,"max_hp":2,"atk":1,"def":0,"range":1,"actions":2,"color":Color("7fa34d")},
	"Gobelin Lance-Tout":{"category":"basique","menace":1,"max_hp":2,"atk":1,"def":0,"range":3,"actions":2,"color":Color("9bae55")},
	"Squelette Maladroit":{"category":"basique","menace":1,"max_hp":3,"atk":2,"def":1,"range":1,"actions":2,"color":Color("d8d0bd")},
	"Squelette Tire-au-Pif":{"category":"basique","menace":1,"max_hp":2,"atk":2,"def":0,"range":4,"actions":2,"color":Color("cfc7b3")},
	"Squelette Porte-Placard":{"category":"basique","menace":1,"max_hp":5,"atk":1,"def":2,"range":1,"actions":1,"color":Color("b8a68f")},
	"Balai Hanté":{"category":"basique","menace":1,"max_hp":2,"atk":0,"def":1,"range":1,"actions":2,"color":Color("a77b52")},
	"Gobelin Chef":{"category":"tactique","menace":2,"max_hp":6,"atk":2,"def":3,"range":1,"actions":3,"color":Color("637f37")},
	"Cuisinier Zombie":{"category":"tactique","menace":2,"max_hp":5,"atk":1,"def":3,"range":1,"actions":2,"color":Color("7b8f73")},
	"Cloche Possédée":{"category":"tactique","menace":2,"max_hp":3,"atk":0,"def":1,"range":1,"actions":1,"color":Color("d2a747")},
	"Fantôme Bureaucrate":{"category":"tactique","menace":2,"max_hp":8,"atk":1,"def":6,"range":1,"actions":2,"color":Color("9ec6d6")},
	"Garde Possédé":{"category":"tactique","menace":2,"max_hp":6,"atk":3,"def":2,"range":1,"actions":2,"color":Color("6e7692")},
	"Poule Démoniaque":{"category":"speciale","menace":3,"max_hp":3,"atk":0,"def":1,"range":3,"actions":2,"color":Color("d9534f")},
	"Mimique Raté":{"category":"speciale","menace":3,"max_hp":4,"atk":3,"def":1,"range":1,"actions":2,"color":Color("8c5b3c")},
	"Ogre Maladroit":{"category":"brute","menace":4,"max_hp":14,"atk":4,"def":3,"range":1,"actions":1,"color":Color("8b6a4f")},
	"Chevalier Sans Cheval":{"category":"mini_boss","menace":4,"max_hp":10,"atk":4,"def":5,"range":1,"actions":2,"color":Color("7f8791")},
	"Baron Pas-Très-Terrifiant":{"category":"boss","menace":5,"max_hp":16,"atk":3,"def":4,"range":2,"actions":2,"color":Color("7e3e56")}
}

const OBJECTS := {
	"Baril":{"max_hp":6,"solid":true,"explosive":true,"color":Color("8b5a2b")},
	"Table":{"max_hp":6,"solid":true,"pushable":true,"color":Color("6f4c32")},
	"Pilier":{"max_hp":12,"solid":true,"color":Color("8f8a82")},
	"Grille":{"max_hp":9,"solid":true,"color":Color("6e747b")},
	"Torche":{"max_hp":2,"solid":false,"torch":true,"color":Color("f0a12c")}
}

const FLOOR_BUDGETS := [3,5,7,9,11]
const FLOOR_ENEMIES := [
	["Gobelin Bricoleur","Gobelin Lance-Tout","Squelette Maladroit"],
	["Squelette Porte-Placard","Cloche Possédée","Gobelin Lance-Tout","Squelette Maladroit"],
	["Gobelin Chef","Gobelin Bricoleur","Gobelin Lance-Tout","Garde Possédé","Squelette Maladroit"],
	["Chevalier Sans Cheval","Cuisinier Zombie","Cloche Possédée","Squelette Maladroit"],
	["Baron Pas-Très-Terrifiant","Chevalier Sans Cheval","Garde Possédé"]
]
const FLOOR_OBJECTS := [
	[{"name":"Baril","pos":Vector2i(4,2)},{"name":"Table","pos":Vector2i(5,4)},{"name":"Torche","pos":Vector2i(6,1)},{"name":"Pilier","pos":Vector2i(7,5)}],
	[{"name":"Table","pos":Vector2i(4,1)},{"name":"Grille","pos":Vector2i(6,3)},{"name":"Baril","pos":Vector2i(5,5)},{"name":"Torche","pos":Vector2i(8,1)}],
	[{"name":"Pilier","pos":Vector2i(4,2)},{"name":"Pilier","pos":Vector2i(4,4)},{"name":"Baril","pos":Vector2i(6,3)},{"name":"Table","pos":Vector2i(7,5)}],
	[{"name":"Table","pos":Vector2i(3,3)},{"name":"Baril","pos":Vector2i(5,1)},{"name":"Baril","pos":Vector2i(5,5)},{"name":"Grille","pos":Vector2i(7,3)}],
	[{"name":"Pilier","pos":Vector2i(4,1)},{"name":"Pilier","pos":Vector2i(4,5)},{"name":"Baril","pos":Vector2i(6,2)},{"name":"Baril","pos":Vector2i(6,4)},{"name":"Table","pos":Vector2i(7,3)}]
]
const HERO_STARTS := [Vector2i(0,2),Vector2i(0,4),Vector2i(1,1),Vector2i(1,5)]
const ENEMY_STARTS := [Vector2i(8,1),Vector2i(8,5),Vector2i(9,3),Vector2i(7,2),Vector2i(7,4),Vector2i(9,0)]
const SPAWN_POINTS := [Vector2i(9,0),Vector2i(9,6),Vector2i(8,3),Vector2i(7,0),Vector2i(7,6)]
const BROUHAHA_ODD_EVENTS := ["Un tonneau prend son indépendance.","Une table se couche pour protester.","Une torche éternue une case de feu.","Une statue imaginaire pivote très fort.","Un nuage de fumée avale les lignes de vue.","Le donjon déclenche deux catastrophes pour le prix d'une."]
const SPAWN_CYCLE := ["Gobelin Bricoleur","Squelette Maladroit","Gobelin Lance-Tout","Balai Hanté","Squelette Tire-au-Pif","Garde Possédé","Cloche Possédée","Mimique Raté","Cuisinier Zombie","Poule Démoniaque"]
