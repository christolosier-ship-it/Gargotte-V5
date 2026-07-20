extends Node2D
class_name BastognacBoard

signal cell_tapped(cell: Vector2i)

const W := 10
const H := 7
const CELL := 72.0
const ORIGIN := Vector2(52, 132)
const RECT := Rect2(ORIGIN, Vector2(W * CELL, H * CELL))
const EXIT := Vector2i(9, 3)
const GOLD := Color("e7b85c")
const CREAM := Color("f5e7c8")
const RED := Color("d45f57")
const GREEN := Color("7fbd76")

var controller

func _unhandled_input(event: InputEvent) -> void:
	if controller == null or controller.game_state != "playing" or controller.busy:
		return
	var point := Vector2(-1, -1)
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		point = event.position
	elif event is InputEventScreenTouch and event.pressed:
		point = event.position
	if RECT.has_point(point):
		var local := point - ORIGIN
		cell_tapped.emit(Vector2i(int(floor(local.x / CELL)), int(floor(local.y / CELL))))

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, Vector2(1280, 720)), Color("17100d"))
	if controller == null or controller.game_state == "start":
		_draw_start_decor()
		return
	if controller.game_state != "playing":
		return
	_draw_grid()
	_draw_hazards()
	_draw_exit()
	_draw_objects()
	_draw_enemies()
	_draw_heroes()
	_draw_selection()

func refresh() -> void:
	queue_redraw()

func _draw_start_decor() -> void:
	for i in range(18):
		var x := 40.0 + float((i * 73) % 1200)
		var y := 35.0 + float((i * 113) % 650)
		draw_circle(Vector2(x, y), 3.0 + float(i % 4), Color(0.85, 0.62, 0.25, 0.22))

func _draw_grid() -> void:
	for y in range(H):
		for x in range(W):
			var cell := Vector2i(x, y)
			var color := Color("352820") if (x + y) % 2 == 0 else Color("2b211b")
			draw_rect(_cell_rect(cell, 2), color, true)
			draw_rect(_cell_rect(cell, 2), Color("5c493c"), false, 1.5)
	if controller.smoke_turns > 0:
		draw_rect(RECT, Color(0.45, 0.48, 0.50, 0.16), true)

func _draw_exit() -> void:
	var rect := _cell_rect(EXIT, 9)
	var color := GOLD if controller.floor_cleared else Color("72543a")
	draw_rect(rect, Color(0.28, 0.18, 0.08, 1), true)
	draw_rect(rect, color, false, 4)
	for i in range(3):
		var y := rect.position.y + 15 + i * 14
		draw_line(Vector2(rect.position.x + 12, y), Vector2(rect.end.x - 12, y), color, 4)

func _draw_hazards() -> void:
	for hazard in controller.hazards:
		var rect := _cell_rect(hazard["pos"], 7)
		match hazard["kind"]:
			"fire":
				draw_circle(rect.get_center(), 22, Color(0.95, 0.32, 0.08, 0.58))
				draw_circle(rect.get_center() + Vector2(0, 6), 12, Color(1, 0.75, 0.12, 0.7))
			"egg":
				draw_circle(rect.get_center(), 19, Color(0.58, 0.08, 0.12, 0.82))
				draw_circle(rect.get_center() + Vector2(-4, -5), 5, Color(1, 0.62, 0.18, 0.85))
			"difficult":
				draw_rect(rect, Color(0.42, 0.30, 0.22, 0.68), true)

func _draw_objects() -> void:
	for object in controller.objects:
		var rect := _cell_rect(object["pos"], 12)
		var color: Color = object["color"]
		match object["name"]:
			"Baril":
				draw_circle(rect.get_center(), 22, color)
				draw_circle(rect.get_center(), 22, Color("c89452"), false, 4)
			"Table":
				draw_rect(rect, color, true)
				draw_rect(rect, Color("b08158"), false, 4)
			"Pilier":
				draw_circle(rect.get_center(), 22, color)
				draw_circle(rect.get_center(), 14, Color("b0aaa0"), false, 4)
			"Grille":
				for i in range(4):
					var x := rect.position.x + 8 + i * 12
					draw_line(Vector2(x, rect.position.y), Vector2(x, rect.end.y), color, 5)
			"Torche":
				draw_line(rect.get_center() + Vector2(0, 20), rect.get_center() + Vector2(0, -5), Color("6e4b2e"), 6)
				draw_circle(rect.get_center() + Vector2(0, -14), 12, Color("f09a27"))
		_health(rect.position + Vector2(0, rect.size.y - 3), rect.size.x, object["hp"], object["max_hp"], Color("b88d62"))

func _draw_heroes() -> void:
	for i in range(controller.heroes.size()):
		var hero: Dictionary = controller.heroes[i]
		if not hero["alive"]:
			continue
		var center := _cell_rect(hero["pos"]).get_center()
		draw_circle(center + Vector2(3, 5), 25, Color(0, 0, 0, 0.42))
		draw_circle(center, 25, hero["color"])
		draw_circle(center, 25, CREAM, false, 3)
		draw_string(ThemeDB.fallback_font, center + Vector2(-10, 8), _hero_initial(hero["name"]), HORIZONTAL_ALIGNMENT_CENTER, 20, 22, Color("20140f"))
		var rect := _cell_rect(hero["pos"], 8)
		_health(rect.position + Vector2(0, rect.size.y - 2), rect.size.x, hero["hp"], hero["max_hp"], GREEN)
		for action in range(hero["actions_left"]):
			draw_circle(rect.position + Vector2(8 + action * 10, 8), 3.5, GOLD)

func _draw_enemies() -> void:
	for enemy in controller.enemies:
		var rect := _cell_rect(enemy["pos"], 8)
		var center := rect.get_center()
		if enemy["hidden"]:
			draw_rect(Rect2(center - Vector2(20, 16), Vector2(40, 32)), Color("7b4b2e"), true)
			draw_rect(Rect2(center - Vector2(20, 16), Vector2(40, 32)), Color("d2a157"), false, 3)
		else:
			draw_circle(center + Vector2(3, 5), 23, Color(0, 0, 0, 0.42))
			draw_circle(center, 23, enemy["color"])
			var border := RED if enemy["category"] in ["boss", "mini_boss", "brute"] else Color("e1d2b5")
			draw_circle(center, 23, border, false, 3)
			draw_string(ThemeDB.fallback_font, center + Vector2(-9, 7), _enemy_initial(enemy["name"]), HORIZONTAL_ALIGNMENT_CENTER, 18, 19, Color("20140f"))
		_health(rect.position + Vector2(0, rect.size.y - 2), rect.size.x, enemy["hp"], enemy["max_hp"], RED)

func _draw_selection() -> void:
	if controller.selected_hero < 0:
		return
	var hero: Dictionary = controller.heroes[controller.selected_hero]
	if not hero["alive"]:
		return
	draw_circle(_cell_rect(hero["pos"]).get_center(), 31, GOLD, false, 4)
	for pos in controller.neighbor_cells(hero["pos"]):
		if controller.inside_board(pos) and controller.is_cell_free(pos, false):
			draw_rect(_cell_rect(pos, 8), Color(0.45, 0.72, 0.55, 0.14), true)

func _cell_rect(cell: Vector2i, inset := 0.0) -> Rect2:
	return Rect2(ORIGIN + Vector2(cell) * CELL + Vector2(inset, inset), Vector2(CELL - inset * 2.0, CELL - inset * 2.0))

func _health(origin: Vector2, width: float, hp: int, max_hp: int, color: Color) -> void:
	draw_rect(Rect2(origin, Vector2(width, 6)), Color("321a18"), true)
	draw_rect(Rect2(origin, Vector2(width * clampf(float(hp) / float(max_hp), 0.0, 1.0), 6)), color, true)

func _hero_initial(name: String) -> String:
	if name.begins_with("Brünhilda"): return "B"
	if name.begins_with("Aelion"): return "A"
	if name.begins_with("Magdalena"): return "M"
	return "G"

func _enemy_initial(name: String) -> String:
	var result := ""
	for word in name.split(" "):
		if word.length() > 2:
			result += word.left(1)
		if result.length() >= 2:
			break
	return result
