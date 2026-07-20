extends CanvasLayer
class_name BastognacHud

signal start_requested(hero_count: int)
signal ability_requested
signal end_turn_requested
signal next_floor_requested
signal restart_requested

const GOLD := Color("e7b85c")
const CREAM := Color("f5e7c8")

var start_panel: Panel
var hero_spin: SpinBox
var floor_label: Label
var noise_label: Label
var selected_label: Label
var status_label: Label
var log_label: Label
var ability_button: Button
var end_button: Button
var next_button: Button
var help_panel: Panel
var result_overlay: ColorRect
var result_title: Label
var result_text: Label

func _ready() -> void:
	_build_ui()
	show_start()

func _build_ui() -> void:
	start_panel = Panel.new()
	start_panel.position = Vector2(340, 120)
	start_panel.size = Vector2(600, 470)
	_style_panel(start_panel, Color("251a15"), GOLD, 3, 24)
	add_child(start_panel)
	var title := _label("GARGOTTE & VA-NU-PIEDS", 34, GOLD, true)
	title.position = Vector2(35, 34)
	title.size = Vector2(530, 55)
	start_panel.add_child(title)
	var subtitle := _label("Le Château de Bastognac", 27, CREAM, true)
	subtitle.position = Vector2(35, 92)
	subtitle.size = Vector2(530, 45)
	start_panel.add_child(subtitle)
	var pitch := _label("Dungeon crawler de plateau coopératif, déterministe et légèrement mal rangé.\nNettoyez cinq étages et expliquez au Baron qu'il n'est pas terrifiant.", 19, Color("d8c8ad"), true)
	pitch.position = Vector2(45, 150)
	pitch.size = Vector2(510, 90)
	pitch.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	start_panel.add_child(pitch)
	var count_label := _label("Nombre de héros", 20, CREAM, false)
	count_label.position = Vector2(115, 275)
	count_label.size = Vector2(220, 40)
	start_panel.add_child(count_label)
	hero_spin = SpinBox.new()
	hero_spin.min_value = 1
	hero_spin.max_value = 4
	hero_spin.step = 1
	hero_spin.value = 4
	hero_spin.position = Vector2(350, 270)
	hero_spin.size = Vector2(115, 48)
	hero_spin.add_theme_font_size_override("font_size", 22)
	start_panel.add_child(hero_spin)
	var start_button := _button("ENTRER EN SLIP", Vector2(145, 350), Vector2(310, 66))
	start_button.pressed.connect(func(): start_requested.emit(int(hero_spin.value)))
	start_panel.add_child(start_button)
	floor_label = _label("", 23, GOLD, false)
	floor_label.position = Vector2(830, 28)
	floor_label.size = Vector2(360, 38)
	add_child(floor_label)
	noise_label = _label("", 20, CREAM, false)
	noise_label.position = Vector2(830, 70)
	noise_label.size = Vector2(410, 38)
	add_child(noise_label)
	selected_label = _label("", 20, CREAM, false)
	selected_label.position = Vector2(815, 128)
	selected_label.size = Vector2(430, 132)
	selected_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	add_child(selected_label)
	status_label = _label("", 18, Color("d8c8ad"), false)
	status_label.position = Vector2(815, 270)
	status_label.size = Vector2(430, 70)
	status_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	add_child(status_label)
	ability_button = _button("COMPÉTENCE", Vector2(825, 352), Vector2(390, 62))
	ability_button.pressed.connect(func(): ability_requested.emit())
	add_child(ability_button)
	end_button = _button("FIN DU TOUR", Vector2(825, 424), Vector2(390, 62))
	end_button.pressed.connect(func(): end_turn_requested.emit())
	add_child(end_button)
	next_button = _button("PRENDRE L'ESCALIER", Vector2(825, 496), Vector2(390, 62))
	next_button.pressed.connect(func(): next_floor_requested.emit())
	add_child(next_button)
	log_label = _label("", 16, Color("d8c8ad"), false)
	log_label.position = Vector2(815, 568)
	log_label.size = Vector2(430, 104)
	log_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	add_child(log_label)
	var restart := _button("↻", Vector2(1128, 24), Vector2(54, 48))
	restart.pressed.connect(func(): restart_requested.emit())
	add_child(restart)
	var help := _button("?", Vector2(1190, 24), Vector2(54, 48))
	help.pressed.connect(_show_help)
	add_child(help)
	help_panel = Panel.new()
	help_panel.position = Vector2(215, 65)
	help_panel.size = Vector2(850, 590)
	_style_panel(help_panel, Color("211713"), GOLD, 3, 22)
	add_child(help_panel)
	var help_text := _label("COMMENT JOUER\n\n• Touchez un héros, puis une case adjacente pour le déplacer.\n• Touchez une créature à portée pour l'attaquer. Dégâts = ATK − DEF, minimum 1.\n• Chaque héros possède 3 actions et une compétence par tour.\n• Touchez un décor adjacent pour le pousser ou le frapper. Les barils explosent.\n• Le premier engagement ajoute +1 Brouhaha. Impair = catastrophe, pair = renforts.\n• Un tour composé uniquement de déplacements réduit le Brouhaha de 2.\n• Nettoyez la salle puis rejoignez l'escalier doré.\n\nAucun dé : événements, apparitions et décisions ennemies sont déterministes.", 19, CREAM, false)
	help_text.position = Vector2(35, 28)
	help_text.size = Vector2(780, 485)
	help_text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	help_panel.add_child(help_text)
	var close := _button("FERMER LE GRIMOIRE", Vector2(255, 520), Vector2(340, 50))
	close.pressed.connect(func(): help_panel.visible = false)
	help_panel.add_child(close)
	result_overlay = ColorRect.new()
	result_overlay.color = Color(0.04, 0.025, 0.02, 0.94)
	result_overlay.size = Vector2(1280, 720)
	add_child(result_overlay)
	result_title = _label("", 42, GOLD, true)
	result_title.position = Vector2(220, 170)
	result_title.size = Vector2(840, 70)
	result_overlay.add_child(result_title)
	result_text = _label("", 23, CREAM, true)
	result_text.position = Vector2(260, 270)
	result_text.size = Vector2(760, 170)
	result_text.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	result_overlay.add_child(result_text)
	var back := _button("RETOUR À LA CHOPE", Vector2(440, 485), Vector2(400, 66))
	back.pressed.connect(func(): restart_requested.emit())
	result_overlay.add_child(back)

func show_start() -> void:
	start_panel.visible = true
	help_panel.visible = false
	result_overlay.visible = false
	_set_game_ui(false)

func show_game() -> void:
	start_panel.visible = false
	help_panel.visible = false
	result_overlay.visible = false
	_set_game_ui(true)

func show_result(title: String, text: String) -> void:
	_set_game_ui(false)
	result_title.text = title
	result_text.text = text
	result_overlay.visible = true

func update_game(game) -> void:
	floor_label.text = "ÉTAGE %d / 5  •  TOUR %d  •  OR %d" % [game.floor_index + 1, game.round_index, game.gold]
	noise_label.text = "BROUHAHA  %s  %d / 12" % [_noise_bar(game.brouhaha), game.brouhaha]
	if game.selected_hero >= 0:
		var hero: Dictionary = game.heroes[game.selected_hero]
		selected_label.text = "%s\n%s • %d/%d PV\nATK %d  DEF %d  PORTÉE %d  ACTIONS %d" % [hero["name"], hero["title"], hero["hp"], hero["max_hp"], int(hero["atk"]) + int(hero["temp_atk"]), int(hero["def"]) + int(hero["temp_def"]), hero["range"], hero["actions_left"]]
		ability_button.text = str(hero["ability"]).to_upper() + (" ✓" if hero["ability_used"] else "")
		ability_button.disabled = hero["ability_used"] or hero["actions_left"] <= 0
	else:
		selected_label.text = "Sélectionnez un héros."
		ability_button.disabled = true
	status_label.text = "Escalier : %s\nFumée : %s" % ["OUVERT" if game.floor_cleared else "VERROUILLÉ", "%d tour(s)" % game.smoke_turns if game.smoke_turns > 0 else "non"]
	next_button.disabled = not game.floor_cleared
	var begin := maxi(0, game.message_log.size() - 4)
	log_label.text = "\n".join(game.message_log.slice(begin, game.message_log.size()))

func _show_help() -> void:
	help_panel.visible = true

func _set_game_ui(value: bool) -> void:
	for node in [floor_label, noise_label, selected_label, status_label, log_label, ability_button, end_button, next_button]:
		node.visible = value

func _noise_bar(value: int) -> String:
	var text := ""
	for i in range(12):
		text += "●" if i < value else "○"
	return text

func _label(text: String, size: int, color: Color, centered: bool) -> Label:
	var label := Label.new()
	label.text = text
	label.add_theme_font_size_override("font_size", size)
	label.add_theme_color_override("font_color", color)
	if centered:
		label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	return label

func _button(text: String, position_value: Vector2, size_value: Vector2) -> Button:
	var button := Button.new()
	button.text = text
	button.position = position_value
	button.size = size_value
	button.add_theme_font_size_override("font_size", 20)
	var normal := StyleBoxFlat.new()
	normal.bg_color = Color("3a2921")
	normal.border_color = Color("8b6848")
	normal.set_border_width_all(2)
	normal.set_corner_radius_all(12)
	var hover := normal.duplicate()
	hover.bg_color = Color("5a3d2f")
	var pressed := normal.duplicate()
	pressed.bg_color = Color("7a5036")
	button.add_theme_stylebox_override("normal", normal)
	button.add_theme_stylebox_override("hover", hover)
	button.add_theme_stylebox_override("pressed", pressed)
	button.add_theme_color_override("font_color", CREAM)
	return button

func _style_panel(panel: Panel, fill: Color, border: Color, width: int, radius: int) -> void:
	var box := StyleBoxFlat.new()
	box.bg_color = fill
	box.border_color = border
	box.set_border_width_all(width)
	box.set_corner_radius_all(radius)
	panel.add_theme_stylebox_override("panel", box)
