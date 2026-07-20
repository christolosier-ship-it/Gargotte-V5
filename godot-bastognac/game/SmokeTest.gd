extends SceneTree

const Data = preload("res://game/GameData.gd")

func _init() -> void:
	assert(Data.HEROES.size() == 4, "Quatre héros jouables sont attendus.")
	assert(Data.FLOOR_BUDGETS == [3, 5, 7, 9, 11], "Budgets de menace invalides.")
	assert(Data.FLOOR_ENEMIES.size() == 5, "Bastognac doit comporter cinq étages.")
	for floor_enemies in Data.FLOOR_ENEMIES:
		for enemy_name in floor_enemies:
			assert(Data.CREATURES.has(enemy_name), "Créature inconnue : %s" % enemy_name)
	for hero in Data.HEROES:
		assert(hero["max_hp"] > 0)
		assert(hero["atk"] >= 0)
		assert(hero["def"] >= 0)
	print("SMOKE TEST OK — Bastognac est cohérent et vaguement propre.")
	quit(0)
