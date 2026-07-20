extends Node

const Data = preload("res://game/GameData.gd")
const BoardScript = preload("res://game/Board.gd")
const HudScript = preload("res://game/Hud.gd")
const W := 10
const H := 7
const EXIT := Vector2i(9, 3)

var game_state := "start"
var floor_index := 0
var round_index := 1
var brouhaha := 0
var gold := 0
var heroes: Array = []
var enemies: Array = []
var objects: Array = []
var hazards: Array = []
var selected_hero := -1
var action_mode := "normal"
var combat_engaged := false
var floor_cleared := false
var turn_non_move_action := false
var spawn_cursor := 0
var smoke_turns := 0
var message_log: Array[String] = []
var busy := false
var board: BastognacBoard
var hud: BastognacHud

func _ready() -> void:
	board = BoardScript.new()
	board.controller = self
	board.cell_tapped.connect(handle_cell)
	add_child(board)
	hud = HudScript.new()
	add_child(hud)
	hud.start_requested.connect(start_game)
	hud.ability_requested.connect(use_ability)
	hud.end_turn_requested.connect(end_hero_turn)
	hud.next_floor_requested.connect(try_next_floor)
	hud.restart_requested.connect(show_start)
	show_start()

func show_start() -> void:
	game_state = "start"
	busy = false
	heroes.clear()
	enemies.clear()
	objects.clear()
	hazards.clear()
	message_log.clear()
	hud.show_start()
	board.refresh()

func start_game(hero_count: int) -> void:
	game_state = "playing"
	floor_index = 0
	round_index = 1
	brouhaha = 0
	gold = 0
	spawn_cursor = 0
	heroes.clear()
	for i in range(hero_count):
		var hero: Dictionary = Data.HEROES[i].duplicate(true)
		hero.merge({"hp":hero["max_hp"],"pos":Data.HERO_STARTS[i],"actions_left":3,"ability_used":false,"temp_atk":0,"temp_def":0,"free_move":0,"splash":false,"alive":true})
		heroes.append(hero)
	hud.show_game()
	load_floor(0)

func load_floor(index: int) -> void:
	floor_index = index
	round_index = 1
	selected_hero = first_alive_hero()
	action_mode = "normal"
	combat_engaged = false
	floor_cleared = false
	turn_non_move_action = false
	smoke_turns = 0
	enemies.clear()
	objects.clear()
	hazards.clear()
	for i in range(heroes.size()):
		if heroes[i]["alive"]:
			heroes[i]["pos"] = Data.HERO_STARTS[i]
			reset_hero_turn(heroes[i])
	for name in Data.FLOOR_ENEMIES[index]:
		spawn_enemy(name, next_enemy_start(), false)
	for item in Data.FLOOR_OBJECTS[index]:
		spawn_object(item["name"], item["pos"])
	add_log("Étage %d : menace %d. Le château tousse derrière la porte." % [index + 1, Data.FLOOR_BUDGETS[index]])
	refresh()

func handle_cell(cell: Vector2i) -> void:
	if game_state != "playing" or busy:
		return
	var hero_index := hero_at(cell)
	if action_mode == "heal":
		try_heal(hero_index)
		return
	if hero_index >= 0:
		selected_hero = hero_index
		refresh()
		return
	if selected_hero < 0:
		return
	var enemy_index := enemy_at(cell)
	if enemy_index >= 0:
		try_attack(enemy_index)
		return
	var object_index := object_at(cell)
	if object_index >= 0:
		try_object(object_index)
		return
	try_move(cell)

func try_move(cell: Vector2i) -> void:
	var hero: Dictionary = heroes[selected_hero]
	if hero["actions_left"] <= 0 or not is_cell_free(cell, false) or manhattan(hero["pos"], cell) != 1:
		return
	if hero["free_move"] > 0:
		hero["free_move"] -= 1
	else:
		hero["actions_left"] -= 1
	hero["pos"] = cell
	reveal_mimics(cell)
	if cell == EXIT and floor_cleared:
		try_next_floor()
		return
	maybe_auto_end()
	refresh()

func try_attack(enemy_index: int) -> void:
	var hero: Dictionary = heroes[selected_hero]
	var enemy: Dictionary = enemies[enemy_index]
	var reach: int = maxi(1, int(hero["range"]) - (1 if smoke_turns > 0 else 0))
	if hero["actions_left"] <= 0 or manhattan(hero["pos"], enemy["pos"]) > reach:
		return
	if reach > 1 and not line_clear(hero["pos"], enemy["pos"], true):
		add_log("Le mobilier bouche la ligne de vue avec beaucoup de professionnalisme.")
		return
	if enemy["hidden"]:
		enemy["hidden"] = false
		add_log("Le coffre révèle des dents : Mimique Raté !")
	if not combat_engaged:
		combat_engaged = true
		add_noise(1)
	hero["actions_left"] -= 1
	turn_non_move_action = true
	var damage := maxi(1, int(hero["atk"]) + int(hero["temp_atk"]) - int(enemy["def"]))
	damage_enemy(enemy_index, damage, hero["name"])
	if hero["splash"]:
		hero["splash"] = false
		for i in range(enemies.size()):
			if i != enemy_index and manhattan(enemies[i]["pos"], enemy["pos"]) == 1:
				damage_enemy(i, 1, "Éclaboussure de gnôle")
				break
	cleanup_enemies()
	check_floor_clear()
	maybe_auto_end()
	refresh()

func try_object(index: int) -> void:
	var hero: Dictionary = heroes[selected_hero]
	var object: Dictionary = objects[index]
	if hero["actions_left"] <= 0 or manhattan(hero["pos"], object["pos"]) != 1:
		return
	if object.get("pushable", false):
		var direction: Vector2i = object["pos"] - hero["pos"]
		var destination: Vector2i = object["pos"] + direction
		if is_cell_free(destination, false):
			object["pos"] = destination
			hero["actions_left"] -= 1
			turn_non_move_action = true
			add_log("%s pousse une table qui n'avait rien demandé." % hero["name"])
			maybe_auto_end()
			refresh()
			return
	hero["actions_left"] -= 1
	turn_non_move_action = true
	object["hp"] -= maxi(1, int(hero["atk"]) + int(hero["temp_atk"]) - 1)
	if object["hp"] <= 0:
		break_object(index)
	maybe_auto_end()
	refresh()

func break_object(index: int) -> void:
	var object: Dictionary = objects[index]
	var pos: Vector2i = object["pos"]
	add_log("%s rend l'âme dans un bruit excessif." % object["name"])
	if object.get("explosive", false):
		explosion(pos, 2, 1)
		add_noise(2)
	elif object["name"] == "Pilier":
		explosion(pos, 1, 1)
		add_noise(2)
	elif object["name"] == "Table":
		add_hazard(pos, "difficult", 3)
		add_noise(1)
	elif object["name"] == "Grille":
		add_noise(1)
	objects.remove_at(index)

func use_ability() -> void:
	if selected_hero < 0 or busy:
		return
	var hero: Dictionary = heroes[selected_hero]
	if hero["actions_left"] <= 0 or hero["ability_used"]:
		return
	match hero["id"]:
		"brunhilda":
			spend_ability(hero)
			hero["temp_def"] += 2
			for i in range(enemies.size()):
				if manhattan(enemies[i]["pos"], hero["pos"]) == 1:
					push_enemy(i, hero["pos"])
			add_log("Brünhilda devient une cloison porteuse à base de bière.")
		"aelion":
			spend_ability(hero)
			hero["temp_atk"] += 1
			hero["free_move"] += 1
			add_log("Aelion prend une petite rasade strictement tactique.")
		"magdalena":
			action_mode = "heal"
			add_log("Petite Taffe : touchez un héros à portée 3.")
			refresh()
			return
		"grompif":
			spend_ability(hero)
			hero["temp_atk"] += 1
			hero["splash"] = true
			add_log("Grompif débouche une théorie arcanique à 48 degrés.")
	maybe_auto_end()
	refresh()

func spend_ability(hero: Dictionary) -> void:
	hero["actions_left"] -= 1
	hero["ability_used"] = true
	turn_non_move_action = true

func try_heal(target_index: int) -> void:
	if target_index < 0:
		action_mode = "normal"
		refresh()
		return
	var caster: Dictionary = heroes[selected_hero]
	var target: Dictionary = heroes[target_index]
	if manhattan(caster["pos"], target["pos"]) > 3:
		return
	spend_ability(caster)
	target["hp"] = mini(target["max_hp"], target["hp"] + 2)
	action_mode = "normal"
	add_log("Magdalena soigne %s de 2 PV avec une taffe peu homologuée." % target["name"])
	maybe_auto_end()
	refresh()

func end_hero_turn() -> void:
	if busy or game_state != "playing":
		return
	busy = true
	if not turn_non_move_action:
		brouhaha = maxi(0, brouhaha - 2)
		add_log("Tour calme : le donjon perd 2 Brouhaha.")
	await get_tree().create_timer(0.1).timeout
	run_enemy_turn()
	if game_state == "playing":
		start_new_round()
	busy = false
	refresh()

func run_enemy_turn() -> void:
	add_log("Les habitants du château prennent leur tour de service.")
	var count := enemies.size()
	for i in range(count):
		if i < enemies.size():
			act_enemy(i)
		if all_heroes_dead():
			show_defeat()
			return
	cleanup_enemies()
	apply_hazards()
	cleanup_enemies()
	check_floor_clear()
	if all_heroes_dead():
		show_defeat()

func act_enemy(index: int) -> void:
	var enemy: Dictionary = enemies[index]
	if enemy["hidden"]:
		var near := nearest_hero(enemy["pos"])
		if near < 0 or manhattan(enemy["pos"], heroes[near]["pos"]) > 1:
			return
		enemy["hidden"] = false
	if enemy["name"] == "Cloche Possédée":
		add_noise(1)
		move_enemy(index, heroes[nearest_hero(enemy["pos"])]["pos"], true)
		return
	if enemy["name"] == "Cuisinier Zombie" and heal_enemy(index):
		return
	if enemy["name"] == "Poule Démoniaque":
		lay_egg(index)
		return
	if enemy["name"] == "Gobelin Bricoleur" and throw_object(index):
		return
	if enemy["name"] == "Baron Pas-Très-Terrifiant" and enemy["hp"] <= 8 and not enemy["boss_summoned"]:
		enemy["boss_summoned"] = true
		spawn_enemy("Gobelin Bricoleur", free_spawn(), true)
		spawn_enemy("Squelette Maladroit", free_spawn(), true)
		add_noise(1)
		add_log("Le Baron appelle des renforts d'une voix raisonnablement inquiète.")
	var target := choose_target(index)
	if target < 0:
		return
	for _action in range(maxi(1, int(enemy["actions"]))):
		if can_attack(index, target):
			enemy_attack(index, target)
			if enemy["name"] == "Balai Hanté":
				push_hero(target, enemy["pos"])
			return
		move_enemy(index, heroes[target]["pos"], false)

func choose_target(index: int) -> int:
	if enemies[index]["name"] == "Squelette Tire-au-Pif":
		return farthest_visible_hero(enemies[index]["pos"])
	if enemies[index]["name"] == "Garde Possédé":
		return weakest_hero()
	return nearest_hero(enemies[index]["pos"])

func can_attack(enemy_index: int, hero_index: int) -> bool:
	var enemy: Dictionary = enemies[enemy_index]
	if manhattan(enemy["pos"], heroes[hero_index]["pos"]) > int(enemy["range"]):
		return false
	return int(enemy["range"]) <= 1 or line_clear(enemy["pos"], heroes[hero_index]["pos"], false)

func enemy_attack(enemy_index: int, hero_index: int) -> void:
	var enemy: Dictionary = enemies[enemy_index]
	var bonus := goblin_bonus(enemy_index)
	var damage := maxi(1, int(enemy["atk"]) + bonus - int(heroes[hero_index]["def"]) - int(heroes[hero_index]["temp_def"]))
	damage_hero(hero_index, damage, enemy["name"])

func heal_enemy(cook: int) -> bool:
	var best := -1
	var missing := 0
	for i in range(enemies.size()):
		if i != cook and manhattan(enemies[cook]["pos"], enemies[i]["pos"]) <= 2:
			var value: int = enemies[i]["max_hp"] - enemies[i]["hp"]
			if value > missing:
				best = i
				missing = value
	if best >= 0:
		enemies[best]["hp"] = mini(enemies[best]["max_hp"], enemies[best]["hp"] + 1)
		add_log("Le Cuisinier Zombie rend 1 PV à %s." % enemies[best]["name"])
		return true
	return false

func lay_egg(index: int) -> void:
	var target := nearest_hero(enemies[index]["pos"])
	if target < 0:
		return
	for pos in neighbor_cells(heroes[target]["pos"]):
		if is_cell_free(pos, false):
			add_hazard(pos, "egg", 3)
			add_log("La Poule Démoniaque pond un problème ovale.")
			return

func throw_object(index: int) -> bool:
	for i in range(objects.size()):
		if manhattan(objects[i]["pos"], enemies[index]["pos"]) == 1:
			var target := nearest_hero(enemies[index]["pos"])
			damage_hero(target, 1, "Décor lancé par Gobelin Bricoleur")
			objects.remove_at(i)
			add_noise(1)
			return true
	return false

func start_new_round() -> void:
	round_index += 1
	turn_non_move_action = false
	for hero in heroes:
		if hero["alive"]:
			reset_hero_turn(hero)
	for i in range(hazards.size() - 1, -1, -1):
		hazards[i]["turns"] -= 1
		if hazards[i]["turns"] <= 0:
			hazards.remove_at(i)
	smoke_turns = maxi(0, smoke_turns - 1)
	selected_hero = first_alive_hero()
	add_log("Tour %d. Les héros récupèrent 3 actions." % round_index)

func reset_hero_turn(hero: Dictionary) -> void:
	hero["actions_left"] = 3
	hero["ability_used"] = false
	hero["temp_atk"] = 0
	hero["temp_def"] = 0
	hero["free_move"] = 0
	hero["splash"] = false

func add_noise(amount: int) -> void:
	for _step in range(amount):
		if brouhaha >= 12:
			return
		brouhaha += 1
		if brouhaha % 2 == 0:
			spawn_from_brouhaha(brouhaha)
		else:
			odd_event(brouhaha)

func odd_event(level: int) -> void:
	match level:
		1: rolling_barrel()
		3: add_hazard(find_free(Vector2i(5, round_index % H), false), "difficult", 3)
		5: add_hazard(find_free(Vector2i(6, (round_index + 2) % H), false), "fire", 3)
		7: shockwave()
		9: smoke_turns = 2
		11:
			rolling_barrel()
			add_hazard(find_free(Vector2i(6, 3), false), "fire", 3)
	add_log("Brouhaha %d : le décor prend une décision regrettable." % level)

func spawn_from_brouhaha(level: int) -> void:
	var categories: Array[String]
	var count := 1
	match level:
		2, 4: categories = ["basique"]
		6: categories = ["basique"]; count = 2
		8: categories = ["basique", "tactique"]; count = 2
		10: categories = ["tactique"]; count = 3
		12: categories = ["speciale", "brute", "basique"]; count = 2
	for i in range(count):
		var wanted := categories[mini(i, categories.size() - 1)]
		spawn_enemy(next_spawn(wanted), free_spawn(), true)
	floor_cleared = false

func next_spawn(category: String) -> String:
	for offset in range(Data.SPAWN_CYCLE.size()):
		var idx := (spawn_cursor + offset) % Data.SPAWN_CYCLE.size()
		var name: String = Data.SPAWN_CYCLE[idx]
		if Data.CREATURES[name]["category"] == category or (category == "brute" and Data.CREATURES[name]["category"] == "speciale"):
			spawn_cursor = (idx + 1) % Data.SPAWN_CYCLE.size()
			return name
	return "Gobelin Bricoleur"

func rolling_barrel() -> void:
	var row := (round_index + floor_index) % H
	for x in range(W - 1, -1, -1):
		var pos := Vector2i(x, row)
		var h := hero_at(pos)
		var e := enemy_at(pos)
		if h >= 0:
			damage_hero(h, 1, "Tonneau autonome")
			break
		if e >= 0:
			damage_enemy(e, 1, "Tonneau autonome")
			break
	add_hazard(Vector2i(5, row), "difficult", 2)

func shockwave() -> void:
	var center := Vector2i(5, 3)
	for i in range(heroes.size()):
		if heroes[i]["alive"] and manhattan(heroes[i]["pos"], center) <= 3:
			push_hero(i, center)
	for i in range(enemies.size()):
		if manhattan(enemies[i]["pos"], center) <= 3:
			push_enemy(i, center)

func explosion(center: Vector2i, radius: int, amount: int) -> void:
	for i in range(heroes.size()):
		if heroes[i]["alive"] and manhattan(heroes[i]["pos"], center) <= radius:
			damage_hero(i, amount, "Explosion de baril")
	for i in range(enemies.size()):
		if manhattan(enemies[i]["pos"], center) <= radius:
			damage_enemy(i, amount, "Explosion de baril")
	add_hazard(center, "fire", 2)

func apply_hazards() -> void:
	for hazard in hazards:
		if hazard["kind"] in ["fire", "egg"]:
			var h := hero_at(hazard["pos"])
			var e := enemy_at(hazard["pos"])
			if h >= 0: damage_hero(h, 1, "Sol peu recommandable")
			if e >= 0: damage_enemy(e, 1, "Sol peu recommandable")

func damage_enemy(index: int, amount: int, source: String) -> void:
	if index < 0 or index >= enemies.size(): return
	enemies[index]["hp"] -= amount
	add_log("%s inflige %d à %s." % [source, amount, enemies[index]["name"]])
	if enemies[index]["hp"] <= 0:
		gold += menace_gold(enemies[index]["category"])
		enemies[index]["dead"] = true
		add_log("%s s'effondre et abandonne un peu d'or et beaucoup de dignité." % enemies[index]["name"])

func damage_hero(index: int, amount: int, source: String) -> void:
	if index < 0 or not heroes[index]["alive"]: return
	heroes[index]["hp"] -= amount
	add_log("%s inflige %d à %s." % [source, amount, heroes[index]["name"]])
	if heroes[index]["hp"] <= 0:
		heroes[index]["hp"] = 0
		heroes[index]["alive"] = false
		add_log("%s tombe. Son slip reste techniquement héroïque." % heroes[index]["name"])
		selected_hero = first_alive_hero()

func cleanup_enemies() -> void:
	for i in range(enemies.size() - 1, -1, -1):
		if enemies[i].get("dead", false): enemies.remove_at(i)

func spawn_enemy(name: String, pos: Vector2i, noisy: bool) -> void:
	var enemy: Dictionary = Data.CREATURES[name].duplicate(true)
	enemy.merge({"name":name,"hp":enemy["max_hp"],"pos":pos,"hidden":name == "Mimique Raté","boss_summoned":false,"dead":false})
	enemies.append(enemy)
	if noisy: add_log("Brouhaha : %s surgit avec le timing d'une armoire." % name)

func spawn_object(name: String, pos: Vector2i) -> void:
	var object: Dictionary = Data.OBJECTS[name].duplicate(true)
	object.merge({"name":name,"hp":object["max_hp"],"pos":pos})
	objects.append(object)

func try_next_floor() -> void:
	if not floor_cleared: return
	var at_exit := false
	for hero in heroes:
		if hero["alive"] and hero["pos"] == EXIT: at_exit = true
	if not at_exit:
		add_log("Un héros doit atteindre l'escalier doré.")
		return
	if floor_index == 4: show_victory()
	else: load_floor(floor_index + 1)

func check_floor_clear() -> void:
	if enemies.is_empty() and not floor_cleared:
		floor_cleared = true
		combat_engaged = false
		add_log("Salle nettoyée. L'escalier doré s'ouvre avec un soupir syndical.")

func maybe_auto_end() -> void:
	for hero in heroes:
		if hero["alive"] and hero["actions_left"] > 0: return
	end_hero_turn.call_deferred()

func show_victory() -> void:
	game_state = "victory"
	hud.show_result("BASTOGNAC EST NETTOYÉ", "Le Baron Pas-Très-Terrifiant est vaincu.\nButin : %d pièces d'or.\n\nBerthold vous réserve une table vaguement propre." % gold)
	board.refresh()

func show_defeat() -> void:
	game_state = "defeat"
	hud.show_result("RETOUR EN CIVIÈRE", "Tous les héros sont tombés.\nLe mobilier est satisfait et le Baron prétend qu'il avait tout prévu.")
	board.refresh()

func refresh() -> void:
	if game_state == "start": return
	hud.update_game(self)
	board.refresh()

func add_log(text: String) -> void:
	message_log.append(text)
	if message_log.size() > 40: message_log.pop_front()

func menace_gold(category: String) -> int:
	match category:
		"basique": return 1
		"tactique": return 2
		"speciale": return 3
		"brute", "mini_boss": return 4
		"boss": return 8
	return 1

func goblin_bonus(index: int) -> int:
	if not str(enemies[index]["name"]).begins_with("Gobelin"): return 0
	for enemy in enemies:
		if enemy["name"] == "Gobelin Chef" and manhattan(enemy["pos"], enemies[index]["pos"]) <= 3: return 1
	return 0

func reveal_mimics(pos: Vector2i) -> void:
	for enemy in enemies:
		if enemy["hidden"] and manhattan(enemy["pos"], pos) <= 1:
			enemy["hidden"] = false
			add_log("Le Mimique Raté révèle ses dents avec trois secondes de retard.")

func add_hazard(pos: Vector2i, kind: String, turns: int) -> void:
	for hazard in hazards:
		if hazard["pos"] == pos and hazard["kind"] == kind:
			hazard["turns"] = maxi(hazard["turns"], turns)
			return
	hazards.append({"pos":pos,"kind":kind,"turns":turns})

func move_enemy(index: int, target: Vector2i, away: bool) -> void:
	var ghost := enemies[index]["name"] == "Fantôme Bureaucrate"
	var best: Vector2i = enemies[index]["pos"]
	var best_distance := manhattan(best, target)
	for pos in neighbor_cells(best):
		if not is_cell_free(pos, ghost): continue
		var distance := manhattan(pos, target)
		if (away and distance > best_distance) or (not away and distance < best_distance):
			best = pos
			best_distance = distance
	enemies[index]["pos"] = best

func push_hero(index: int, source: Vector2i) -> void:
	var direction := cardinal_direction(heroes[index]["pos"] - source)
	var target: Vector2i = heroes[index]["pos"] + direction
	if is_cell_free(target, false): heroes[index]["pos"] = target

func push_enemy(index: int, source: Vector2i) -> void:
	var direction := cardinal_direction(enemies[index]["pos"] - source)
	var target: Vector2i = enemies[index]["pos"] + direction
	if is_cell_free(target, false): enemies[index]["pos"] = target

func cardinal_direction(value: Vector2i) -> Vector2i:
	if absi(value.x) >= absi(value.y): return Vector2i(signi(value.x), 0)
	return Vector2i(0, signi(value.y))

func nearest_hero(from_pos: Vector2i) -> int:
	var best := -1
	var distance := 999
	for i in range(heroes.size()):
		if heroes[i]["alive"] and manhattan(from_pos, heroes[i]["pos"]) < distance:
			best = i
			distance = manhattan(from_pos, heroes[i]["pos"])
	return best

func weakest_hero() -> int:
	var best := -1
	var hp := 999
	for i in range(heroes.size()):
		if heroes[i]["alive"] and heroes[i]["hp"] < hp:
			best = i
			hp = heroes[i]["hp"]
	return best

func farthest_visible_hero(from_pos: Vector2i) -> int:
	var best := nearest_hero(from_pos)
	var distance := -1
	for i in range(heroes.size()):
		var value := manhattan(from_pos, heroes[i]["pos"])
		if heroes[i]["alive"] and value <= 4 and value > distance and line_clear(from_pos, heroes[i]["pos"], false):
			best = i
			distance = value
	return best

func next_enemy_start() -> Vector2i:
	for pos in Data.ENEMY_STARTS:
		if is_cell_free(pos, true): return pos
	return find_free(Vector2i(9, 3), true)

func free_spawn() -> Vector2i:
	for pos in Data.SPAWN_POINTS:
		if is_cell_free(pos, false): return pos
	return find_free(Vector2i(9, 3), false)

func find_free(origin: Vector2i, ignore_objects: bool) -> Vector2i:
	if is_cell_free(origin, ignore_objects): return origin
	for radius in range(1, 12):
		for y in range(H):
			for x in range(W):
				var pos := Vector2i(x, y)
				if manhattan(pos, origin) == radius and is_cell_free(pos, ignore_objects): return pos
	return Vector2i.ZERO

func inside_board(cell: Vector2i) -> bool:
	return cell.x >= 0 and cell.x < W and cell.y >= 0 and cell.y < H

func is_cell_free(cell: Vector2i, ignore_objects: bool) -> bool:
	if not inside_board(cell) or hero_at(cell) >= 0 or enemy_at(cell) >= 0: return false
	if not ignore_objects:
		var index := object_at(cell)
		if index >= 0 and objects[index].get("solid", true): return false
	return true

func hero_at(cell: Vector2i) -> int:
	for i in range(heroes.size()):
		if heroes[i]["alive"] and heroes[i]["pos"] == cell: return i
	return -1

func enemy_at(cell: Vector2i) -> int:
	for i in range(enemies.size()):
		if not enemies[i].get("dead", false) and enemies[i]["pos"] == cell: return i
	return -1

func object_at(cell: Vector2i) -> int:
	for i in range(objects.size()):
		if objects[i]["pos"] == cell: return i
	return -1

func neighbor_cells(cell: Vector2i) -> Array[Vector2i]:
	return [cell + Vector2i.RIGHT, cell + Vector2i.DOWN, cell + Vector2i.LEFT, cell + Vector2i.UP]

func manhattan(a: Vector2i, b: Vector2i) -> int:
	return absi(a.x - b.x) + absi(a.y - b.y)

func first_alive_hero() -> int:
	for i in range(heroes.size()):
		if heroes[i]["alive"]: return i
	return -1

func all_heroes_dead() -> bool:
	return first_alive_hero() < 0

func line_clear(from_pos: Vector2i, to_pos: Vector2i, hero_shot: bool) -> bool:
	var x0 := from_pos.x
	var y0 := from_pos.y
	var dx := absi(to_pos.x - x0)
	var sx := 1 if x0 < to_pos.x else -1
	var dy := -absi(to_pos.y - y0)
	var sy := 1 if y0 < to_pos.y else -1
	var err := dx + dy
	while true:
		if x0 == to_pos.x and y0 == to_pos.y: return true
		var e2 := 2 * err
		if e2 >= dy: err += dy; x0 += sx
		if e2 <= dx: err += dx; y0 += sy
		var cell := Vector2i(x0, y0)
		if cell == to_pos: return true
		if object_at(cell) >= 0: return false
		if hero_shot and hero_at(cell) >= 0: return false
		if not hero_shot and enemy_at(cell) >= 0: return false

func signi(value: int) -> int:
	if value > 0: return 1
	if value < 0: return -1
	return 0
