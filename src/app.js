
import {
  uid,
  nowISO,
  slugify,
  escapeHtml,
  clamp,
  tagsToArray,
  tagsToText,
  parseFloorBudgets,
  buildCsv,
  parseCsv,
  safeFilename,
  fitSize
} from "./utils/common.js";

import {
  buildXlsxBlob,
  buildXlsxWorkbookBlob,
  readXlsxFile
} from "./utils/xlsx.js";

import {
  initDatabase,
  loadAllData,
  loadUiState,
  saveUiState,
  putOne,
  putMany,
  deleteOne,
  deleteWhere,
  clearStore,
  appendLog,
  getLogs,
  transaction
} from "./storage/idb.js";

const ENTITY_ORDER = [
  "dungeons",
  "creatures",
  "heroes",
  "npcs",
  "quests",
  "loot_items",
  "interactables",
  "brouhaha_effects",
  "media_assets"
];

const ENTITY_LABELS = {
  dungeons: "Donjons",
  creatures: "Créatures",
  heroes: "Héros",
  npcs: "PNJ",
  quests: "Quêtes",
  loot_items: "Loot",
  interactables: "Objets",
  brouhaha_effects: "Brouhaha",
  media_assets: "Médias"
};

const ENTITY_SHEETS = {
  dungeons: "Donjons",
  creatures: "Créatures",
  heroes: "Héros",
  npcs: "PNJ",
  quests: "Quêtes",
  loot_items: "Loot",
  interactables: "Objets",
  brouhaha_effects: "Brouhaha",
  media_assets: "Médias"
};

const TEMPLATE_HEADERS = {
  dungeons: ["name", "description", "floor_budgets", "boss_name", "tags", "image_path"],
  creatures: ["name", "dungeon_name", "category", "menace", "pv", "atk", "def", "zone", "actions", "special_attack_name", "special_attack_noise", "ai_behavior", "ai_target_priority", "lore", "socle", "tags", "image_path", "loot"],
  heroes: ["hero_base_name", "level", "name", "role", "title", "pv", "atk", "def", "zone", "actions", "ability_text", "effect_text", "brouhaha", "tags", "image_path"],
  npcs: ["name", "race", "tone", "role", "lore", "tags", "image_path"],
  quests: ["name", "description", "objective", "reward", "difficulty", "npc_name", "dungeon_name", "tags", "image_path"],
  loot_items: ["creature_name", "name", "type", "effect", "gold_value", "tags", "image_path"],
  interactables: ["name", "dungeon_name", "type", "hp", "actions_allowed", "effect", "image_path", "tags"],
  brouhaha_effects: ["level", "dungeon_name", "effect_text"],
  media_assets: ["id", "label", "file_name", "path", "mime_type", "entity_type", "entity_id"]
};

const CREATURE_CATEGORY_OPTIONS = [
  { value: "basique", label: "Basique" },
  { value: "tactique", label: "Tactique" },
  { value: "speciale", label: "Spéciale" },
  { value: "brute", label: "Brute" },
  { value: "mini_boss", label: "Mini-Boss" },
  { value: "boss", label: "Boss" }
];

const FORM_FIELDS = {
  dungeons: [
    { name: "name", label: "Nom", type: "text" },
    { name: "description", label: "Description", type: "textarea", rows: 5 },
    { name: "floor_budgets", label: "Budgets d'étages", type: "text", placeholder: "3;5;7;9;11" },
    { name: "boss_name", label: "Boss final", type: "text" },
    { name: "tags", label: "Tags", type: "text", placeholder: "tag1, tag2" },
    { name: "image_path", label: "Image", type: "image" }
  ],
  creatures: [
    { name: "name", label: "Nom", type: "text" },
    { name: "dungeon_id", label: "Donjon", type: "select", options: "dungeons" },
    {
      name: "category",
      label: "Catégorie",
      type: "select",
      options: CREATURE_CATEGORY_OPTIONS
    },
    { name: "menace", label: "Menace", type: "number", min: 1, step: 1 },
    { name: "pv", label: "PV", type: "number", step: 1 },
    { name: "atk", label: "ATK", type: "number", step: 1 },
    { name: "def", label: "DEF", type: "number", step: 1 },
    { name: "zone", label: "Zone", type: "number", min: 1, step: 1 },
    { name: "actions", label: "Actions", type: "number", min: 1, step: 1 },
    { name: "special_attack_name", label: "Nom coup spécial", type: "text" },
    { name: "special_attack_noise", label: "Bruit coup spécial", type: "number", min: 0, step: 1 },
    { name: "ai_behavior", label: "IA (texte)", type: "textarea", rows: 4 },
    { name: "ai_target_priority", label: "Cible IA", type: "text" },
    { name: "lore", label: "Lore", type: "textarea", rows: 4 },
    { name: "socle", label: "Socle", type: "text" },
    { name: "tags", label: "Tags", type: "text", placeholder: "tag1, tag2" },
    { name: "image_path", label: "Image", type: "image" },
    { name: "loot_lines", label: "Loot (nom|type|effet|or)", type: "textarea", rows: 5, placeholder: "Sac de vis rouillées|Vendable|Objet utile|1" }
  ],
  heroes: [
    { name: "hero_base_name", label: "Nom de base", type: "text" },
    { name: "level", label: "Niveau", type: "number", min: 1, max: 4, step: 1 },
    { name: "name", label: "Nom complet", type: "text" },
    { name: "role", label: "Rôle", type: "text" },
    { name: "title", label: "Titre", type: "text" },
    { name: "pv", label: "PV", type: "number", step: 1 },
    { name: "atk", label: "ATK", type: "number", step: 1 },
    { name: "def", label: "DEF", type: "number", step: 1 },
    { name: "zone", label: "Portée", type: "number", min: 1, step: 1 },
    { name: "actions", label: "Actions", type: "number", min: 1, step: 1 },
    { name: "ability_text", label: "Compétence", type: "text" },
    { name: "effect_text", label: "Effet", type: "textarea", rows: 4 },
    { name: "brouhaha", label: "Brouhaha", type: "text" },
    { name: "tags", label: "Tags", type: "text", placeholder: "tag1, tag2" },
    { name: "image_path", label: "Image", type: "image" }
  ],
  npcs: [
    { name: "name", label: "Nom", type: "text" },
    { name: "race", label: "Race", type: "text" },
    { name: "tone", label: "Ton", type: "text" },
    { name: "role", label: "Rôle", type: "text" },
    { name: "lore", label: "Lore", type: "textarea", rows: 5 },
    { name: "tags", label: "Tags", type: "text", placeholder: "tag1, tag2" },
    { name: "image_path", label: "Image", type: "image" }
  ],
  quests: [
    { name: "name", label: "Nom", type: "text" },
    { name: "dungeon_id", label: "Donjon", type: "select", options: "dungeons" },
    { name: "npc_id", label: "PNJ (optionnel)", type: "select", options: "npcs", allowEmpty: true },
    { name: "difficulty", label: "Difficulté", type: "number", min: 1, max: 5, step: 1 },
    { name: "description", label: "Description", type: "textarea", rows: 4 },
    { name: "objective", label: "Objectif", type: "textarea", rows: 4 },
    { name: "reward", label: "Récompense", type: "text" },
    { name: "tags", label: "Tags", type: "text", placeholder: "tag1, tag2" },
    { name: "image_path", label: "Image", type: "image" }
  ],
  loot_items: [
    { name: "creature_id", label: "Créature liée", type: "select", options: "creatures", allowEmpty: true },
    { name: "name", label: "Nom", type: "text" },
    { name: "type", label: "Type", type: "text" },
    { name: "effect", label: "Effet", type: "text" },
    { name: "gold_value", label: "Or", type: "number", min: 0, step: 1 },
    { name: "tags", label: "Tags", type: "text", placeholder: "tag1, tag2" },
    { name: "image_path", label: "Image", type: "image" }
  ],
  interactables: [
    { name: "name", label: "Nom", type: "text" },
    { name: "dungeon_id", label: "Donjon", type: "select", options: "dungeons" },
    { name: "type", label: "Type", type: "text" },
    { name: "hp", label: "PV", type: "number", min: 0, step: 1 },
    { name: "actions_allowed", label: "Actions autorisées", type: "text", placeholder: "ouvrir, fermer, casser" },
    { name: "effect", label: "Effet", type: "textarea", rows: 4 },
    { name: "tags", label: "Tags", type: "text", placeholder: "tag1, tag2" },
    { name: "image_path", label: "Image", type: "image" }
  ],
  brouhaha_effects: [
    { name: "level", label: "Niveau", type: "number", min: 0, max: 12, step: 1 },
    { name: "dungeon_id", label: "Donjon (universel si vide)", type: "select", options: "dungeons", allowEmpty: true },
    { name: "effect_text", label: "Texte d'effet", type: "textarea", rows: 5 }
  ],
  media_assets: [
    { name: "label", label: "Label", type: "text" },
    { name: "file_name", label: "Nom de fichier", type: "text" },
    { name: "path", label: "Chemin", type: "text" },
    { name: "mime_type", label: "MIME", type: "text" },
    { name: "entity_type", label: "Type d'entité", type: "select", options: "mediaEntityTypes", allowEmpty: true },
    { name: "entity_id", label: "ID d'entité", type: "text" },
    { name: "image_path", label: "Image", type: "image" }
  ]
};

const IMPORT_TYPES = ENTITY_ORDER.slice();
const APP_VERSION = "5.3.0";

const ENTITY_DOWNLOAD_FILES = {
  dungeons: "dungeons.xlsx",
  creatures: "creatures.xlsx",
  heroes: "heroes.xlsx",
  npcs: "npcs.xlsx",
  quests: "quests.xlsx",
  loot_items: "loot.xlsx",
  interactables: "interactables.xlsx",
  brouhaha_effects: "brouhaha.xlsx",
  media_assets: "media_assets.xlsx"
};

const app = typeof document !== "undefined" ? document.getElementById("app") : null;

const state = {
  ready: false,
  data: {},
  index: {},
  imageViewer: null,
  ui: {
    view: "home",
    codexType: "creatures",
    codexSelectedId: "",
    workshopType: "creatures",
    workshopSelectedId: "",
    codexCreatureDungeonId: "",
    codexHeroLevel: "",
    workshopCreatureDungeonId: "",
    generator: { dungeonId: "", floorIndex: 0, boss: false, miniBoss: false, result: null },
    brouhaha: { dungeonId: "", level: 0, history: [], drawn: [] },
    questsResult: null,
    questDungeonId: "",
    import: { type: "creatures", fileName: "", preview: null },
    media: { filterType: "gallery", filterEntity: "", fileQueueName: "" },
    journalOpen: false,
    globalSearch: ""
  },
  toasts: [],
  logs: [],
  mediaUrlCache: new Map(),
  mediaUrlReverse: new Map()
};

function defaultBlankUi() {
  return {
    view: "home",
    codexType: "creatures",
    codexSelectedId: "",
    workshopType: "creatures",
    workshopSelectedId: "",
    codexCreatureDungeonId: "",
    codexHeroLevel: "",
    workshopCreatureDungeonId: "",
    generator: { dungeonId: "", floorIndex: 0, boss: false, miniBoss: false, result: null },
    brouhaha: { dungeonId: "", level: 0, history: [], drawn: [] },
    questsResult: null,
    questDungeonId: "",
    import: { type: "creatures", fileName: "", preview: null },
    media: { filterType: "gallery", filterEntity: "", fileQueueName: "" },
    journalOpen: false,
    globalSearch: ""
  };
}

function storeList() {
  return [...ENTITY_ORDER];
}

function getLabel(type) {
  return ENTITY_LABELS[type] || type;
}

function findById(type, id) {
  return (state.data[type] || []).find(item => item.id === id) || null;
}

function findByName(type, name) {
  const target = String(name ?? "").trim().toLowerCase();
  if (!target) return null;
  return (state.data[type] || []).find(item => String(item.name ?? item.title ?? item.hero_base_name ?? "").trim().toLowerCase() === target) || null;
}

function ensureUiDefaults() {
  if (!state.data.dungeons?.length) return;
  if (!state.ui.generator.dungeonId) state.ui.generator.dungeonId = state.data.dungeons[0].id;
  if (!state.ui.brouhaha.dungeonId) state.ui.brouhaha.dungeonId = state.data.dungeons[0].id;
  if (!state.ui.questDungeonId) state.ui.questDungeonId = state.data.dungeons[0].id;
  if (!state.ui.codexSelectedId) {
    const first = (state.data[state.ui.codexType] || [])[0];
    if (first) state.ui.codexSelectedId = first.id;
  }
  if (!state.ui.workshopSelectedId) {
    const first = (state.data[state.ui.workshopType] || [])[0];
    if (first) state.ui.workshopSelectedId = first.id;
  }
}

function ensureSelectionExists() {
  if (!state.data[state.ui.codexType]?.some(x => x.id === state.ui.codexSelectedId)) {
    const first = (state.data[state.ui.codexType] || [])[0];
    state.ui.codexSelectedId = first ? first.id : "";
  }
  if (!state.data[state.ui.workshopType]?.some(x => x.id === state.ui.workshopSelectedId)) {
    const first = (state.data[state.ui.workshopType] || [])[0];
    state.ui.workshopSelectedId = first ? first.id : "";
  }
  if (!state.data.dungeons?.some(x => x.id === state.ui.generator.dungeonId)) {
    state.ui.generator.dungeonId = state.data.dungeons?.[0]?.id || "";
  }
  if (!state.data.dungeons?.some(x => x.id === state.ui.brouhaha.dungeonId)) {
    state.ui.brouhaha.dungeonId = state.data.dungeons?.[0]?.id || "";
  }
  if (!state.data.dungeons?.some(x => x.id === state.ui.questDungeonId)) {
    state.ui.questDungeonId = state.data.dungeons?.[0]?.id || "";
  }
}

function rebuildIndexes() {
  const idx = {};
  for (const type of ENTITY_ORDER) {
    idx[type] = {
      byId: new Map(),
      bySlug: new Map(),
      byName: new Map()
    };
    for (const item of state.data[type] || []) {
      idx[type].byId.set(item.id, item);
      if (item.slug) idx[type].bySlug.set(item.slug, item);
      const nm = String(item.name ?? item.title ?? item.hero_base_name ?? "").trim().toLowerCase();
      if (nm) idx[type].byName.set(nm, item);
    }
  }
  state.index = idx;
}

function rebuildRelations() {
  const dungeonsById = state.index.dungeons?.byId || new Map();
  const creaturesById = state.index.creatures?.byId || new Map();
  const npcsById = state.index.npcs?.byId || new Map();

  for (const dungeon of state.data.dungeons || []) {
    dungeon.image_path = dungeon.image_path || "";
  }

  for (const creature of state.data.creatures || []) {
    const dungeon = dungeonsById.get(creature.dungeon_id);
    creature.dungeon_name = dungeon?.name || creature.dungeon_name || "";
    creature.dungeon_slug = dungeon?.slug || creature.dungeon_slug || "";
    creature.loot_items = [];
  }

  for (const loot of state.data.loot_items || []) {
    const creature = creaturesById.get(loot.creature_id);
    loot.creature_name = creature?.name || loot.creature_name || "";
    if (creature) {
      if (!Array.isArray(creature.loot_items)) creature.loot_items = [];
      creature.loot_items.push(loot);
    }
  }

  for (const hero of state.data.heroes || []) {
    hero.tags = Array.isArray(hero.tags) ? hero.tags : tagsToArray(hero.tags);
  }

  for (const npc of state.data.npcs || []) {
    npc.tags = Array.isArray(npc.tags) ? npc.tags : tagsToArray(npc.tags);
  }

  for (const quest of state.data.quests || []) {
    const dungeon = dungeonsById.get(quest.dungeon_id);
    const npc = npcsById.get(quest.npc_id);
    quest.dungeon_name = dungeon?.name || quest.dungeon_name || "";
    quest.npc_name = npc?.name || quest.npc_name || "";
  }

  for (const eff of state.data.brouhaha_effects || []) {
    const dungeon = dungeonsById.get(eff.dungeon_id);
    eff.dungeon_name = dungeon?.name || eff.dungeon_name || "";
  }
}

function rebuildMediaCache() {
  for (const url of state.mediaUrlReverse.values()) {
    try { URL.revokeObjectURL(url); } catch (_) {}
  }
  state.mediaUrlCache.clear();
  state.mediaUrlReverse.clear();

  for (const asset of state.data.media_assets || []) {
    if (asset.thumb_blob) {
      const url = URL.createObjectURL(asset.thumb_blob);
      state.mediaUrlCache.set(`${asset.id}:thumb`, url);
      state.mediaUrlReverse.set(`${asset.id}:thumb`, url);
    }
    if (asset.blob) {
      const url = URL.createObjectURL(asset.blob);
      state.mediaUrlCache.set(`${asset.id}:full`, url);
      state.mediaUrlReverse.set(`${asset.id}:full`, url);
    }
  }
}

function mediaUrlForAsset(asset, thumb = false) {
  if (!asset) return "";
  const key = `${asset.id}:${thumb ? "thumb" : "full"}`;
  const cached = state.mediaUrlCache.get(key);
  if (cached) return cached;
  if (thumb && asset.thumb_path) return asset.thumb_path;
  if (!thumb && asset.path) return asset.path;
  if (asset.path) return asset.path;
  return "";
}

function imageUrlForEntity(entity) {
  if (!entity?.image_path) return "";
  const asset = (state.data.media_assets || []).find(m => m.path === entity.image_path || m.thumb_path === entity.image_path);
  return mediaUrlForAsset(asset, false) || entity.image_path || "";
}

function thumbUrlForAsset(asset) {
  return mediaUrlForAsset(asset, true) || mediaUrlForAsset(asset, false) || asset.path || "";
}

function hydrateState(rawData) {
  state.data = rawData;
  rebuildIndexes();
  rebuildRelations();
  rebuildMediaCache();
  ensureUiDefaults();
  ensureSelectionExists();
}

function getSearchIndexText(type, item) {
  const base = [
    item.name,
    item.title,
    item.hero_base_name,
    item.role,
    item.race,
    item.dungeon_name,
    item.npc_name,
    item.category,
    item.tags?.join(", "),
    item.lore,
    item.description,
    item.objective,
    item.reward,
    item.effect,
    item.ai_behavior,
    item.ai_target_priority,
    item.special_attack_name,
    item.brouhaha,
    item.path,
    item.label
  ];
  return base.filter(Boolean).join(" ").toLowerCase();
}

function getFilteredList(type, scope = "search") {
  const q = state.ui.globalSearch.trim().toLowerCase();
  let list = state.data[type] || [];

  if (q) {
    list = list.filter(item => getSearchIndexText(type, item).includes(q));
  }

  if (scope === "codex" || scope === "atelier") {
    if (type === "creatures") {
      const dungeonId = scope === "codex" ? state.ui.codexCreatureDungeonId : state.ui.workshopCreatureDungeonId;
      if (dungeonId) list = list.filter(item => item.dungeon_id === dungeonId);
    }
    if (type === "heroes" && scope === "codex") {
      const level = state.ui.codexHeroLevel;
      if (level !== "" && level !== null && level !== undefined) {
        list = list.filter(item => Number(item.level) === Number(level));
      }
    }
  }

  return list;
}

function getCurrentSelection(type, view) {
  const id = view === "codex" ? state.ui.codexSelectedId : state.ui.workshopSelectedId;
  return findById(type, id);
}

function sheetHeaders(type) {
  return TEMPLATE_HEADERS[type];
}

function formatExportRow(type, entity) {
  switch (type) {
    case "dungeons":
      return {
        name: entity.name || "",
        description: entity.description || "",
        floor_budgets: (entity.floor_budgets || []).join(";"),
        boss_name: entity.boss_name || "",
        tags: tagsToText(entity.tags),
        image_path: entity.image_path || ""
      };
    case "creatures":
      return {
        name: entity.name || "",
        dungeon_name: entity.dungeon_name || "",
        category: entity.category || "",
        menace: Number(entity.menace || 0),
        pv: Number(entity.pv || 0),
        atk: Number(entity.atk || 0),
        def: Number(entity.def || 0),
        zone: Number(entity.zone || 1),
        actions: Number(entity.actions || 2),
        special_attack_name: entity.special_attack_name || "",
        special_attack_noise: Number(entity.special_attack_noise || 0),
        ai_behavior: entity.ai_behavior || "",
        ai_target_priority: entity.ai_target_priority || "",
        lore: entity.lore || "",
        socle: entity.socle || "",
        tags: tagsToText(entity.tags),
        image_path: entity.image_path || "",
        loot: (entity.loot_items || []).map(l => `${l.name}|${l.type}|${l.effect || ""}|${l.gold_value || 0}`).join("\n")
      };
    case "heroes":
      return {
        hero_base_name: entity.hero_base_name || "",
        level: Number(entity.level || 1),
        name: entity.name || "",
        role: entity.role || "",
        title: entity.title || "",
        pv: Number(entity.pv || 0),
        atk: Number(entity.atk || 0),
        def: Number(entity.def || 0),
        zone: Number(entity.zone || 1),
        actions: Number(entity.actions || 3),
        ability_text: entity.ability_text || "",
        effect_text: entity.effect_text || "",
        brouhaha: entity.brouhaha || "",
        tags: tagsToText(entity.tags),
        image_path: entity.image_path || ""
      };
    case "npcs":
      return {
        name: entity.name || "",
        race: entity.race || "",
        tone: entity.tone || "",
        role: entity.role || "",
        lore: entity.lore || "",
        tags: tagsToText(entity.tags),
        image_path: entity.image_path || ""
      };
    case "quests":
      return {
        name: entity.name || "",
        description: entity.description || "",
        objective: entity.objective || "",
        reward: entity.reward || "",
        difficulty: Number(entity.difficulty || 1),
        npc_name: entity.npc_name || "",
        dungeon_name: entity.dungeon_name || "",
        tags: tagsToText(entity.tags),
        image_path: entity.image_path || ""
      };
    case "loot_items":
      return {
        creature_name: entity.creature_name || "",
        name: entity.name || "",
        type: entity.type || "",
        effect: entity.effect || "",
        gold_value: Number(entity.gold_value || 0),
        tags: tagsToText(entity.tags),
        image_path: entity.image_path || ""
      };
    case "interactables":
      return {
        name: entity.name || "",
        dungeon_name: entity.dungeon_name || "",
        type: entity.type || "",
        hp: Number(entity.hp || 0),
        actions_allowed: entity.actions_allowed || "",
        effect: entity.effect || "",
        image_path: entity.image_path || "",
        tags: tagsToText(entity.tags)
      };
    case "brouhaha_effects":
      return {
        level: Number(entity.level || 0),
        dungeon_name: entity.dungeon_name || "",
        effect_text: entity.effect_text || ""
      };
    case "media_assets":
      return {
        id: entity.id || "",
        label: entity.label || "",
        file_name: entity.file_name || "",
        path: entity.path || "",
        mime_type: entity.mime_type || "",
        entity_type: entity.entity_type || "",
        entity_id: entity.entity_id || ""
      };
    default:
      return {};
  }
}

function entityConflictKey(type, row) {
  switch (type) {
    case "dungeons":
      return slugify(row.name || "");
    case "creatures":
      return `${slugify(row.dungeon_name || "")}__${slugify(row.name || "")}`;
    case "heroes":
      return `${slugify(row.hero_base_name || row.name || "")}__${Number(row.level || 1)}`;
    case "npcs":
      return slugify(row.name || "");
    case "quests":
      return `${slugify(row.dungeon_name || "")}__${slugify(row.name || "")}`;
    case "loot_items":
      return `${slugify(row.creature_name || "")}__${slugify(row.name || "")}`;
    case "interactables":
      return `${slugify(row.dungeon_name || "")}__${slugify(row.name || "")}`;
    case "brouhaha_effects":
      return `${Number(row.level || 0)}__${slugify(row.dungeon_name || "universel")}__${slugify(row.effect_text || "")}`;
    case "media_assets":
      return row.id || row.path || slugify(row.file_name || row.label || "");
    default:
      return slugify(row.name || row.title || "");
  }
}

function buildConflictKeyFromEntity(type, entity) {
  return entityConflictKey(type, formatExportRow(type, entity));
}

function normalizeCreatureCategory(value) {
  const cleaned = String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  const allowed = new Set(CREATURE_CATEGORY_OPTIONS.map(opt => opt.value));
  if (allowed.has(cleaned)) return cleaned;
  if (cleaned === "mini-boss" || cleaned === "mini_bosses") return "mini_boss";
  if (cleaned === "special" || cleaned === "speciale") return "speciale";
  return "basique";
}

function openImageViewer(src, alt = "") {
  if (!src) return;
  state.imageViewer = { src, alt };
  render();
}

function closeImageViewer() {
  state.imageViewer = null;
  render();
}

function renderImageViewer() {
  if (!state.imageViewer?.src) return "";
  const { src, alt } = state.imageViewer;
  return `
    <div class="image-viewer-overlay" data-action="close-image-viewer">
      <div class="image-viewer-panel" role="dialog" aria-modal="true" aria-label="${escapeHtml(alt || "Image agrandie")}">
        <button class="ghost image-viewer-close" type="button" data-action="close-image-viewer">✕</button>
        <img src="${escapeHtml(src)}" alt="${escapeHtml(alt || "")}">
      </div>
    </div>
  `;
}

function blankEntity(type) {
  switch (type) {
    case "dungeons":
      return {
        id: uid("dungeon"),
        name: "",
        slug: "",
        description: "",
        floor_budgets: [3, 5, 7, 9, 11],
        base_floor_count: 5,
        boss_name: "",
        tags: [],
        image_path: ""
      };
    case "interactables":
      return {
        id: uid("interactable"),
        dungeon_id: state.data.dungeons?.[0]?.id || "",
        dungeon_name: state.data.dungeons?.[0]?.name || "",
        name: "",
        slug: "",
        type: "",
        hp: 1,
        actions_allowed: "",
        effect: "",
        tags: [],
        image_path: ""
      };
    case "creatures":
      return {
        id: uid("creature"),
        name: "",
        slug: "",
        dungeon_id: state.data.dungeons?.[0]?.id || "",
        dungeon_name: state.data.dungeons?.[0]?.name || "",
        dungeon_slug: state.data.dungeons?.[0]?.slug || "",
        category: "basique",
        menace: 1,
        pv: 1,
        atk: 1,
        def: 0,
        zone: 1,
        actions: 2,
        special_attack_name: "",
        special_attack_noise: 0,
        ai_behavior: "",
        ai_target_priority: "",
        lore: "",
        socle: "32mm",
        tags: [],
        image_path: "",
        loot_items: []
      };
    case "heroes":
      return {
        id: uid("hero"),
        hero_base_name: "",
        level: 1,
        name: "",
        role: "",
        title: "",
        pv: 1,
        atk: 1,
        def: 0,
        zone: 1,
        actions: 3,
        ability_text: "",
        effect_text: "",
        brouhaha: "",
        tags: [],
        image_path: ""
      };
    case "npcs":
      return {
        id: uid("npc"),
        name: "",
        slug: "",
        race: "",
        tone: "",
        role: "",
        lore: "",
        tags: [],
        image_path: ""
      };
    case "quests":
      return {
        id: uid("quest"),
        name: "",
        slug: "",
        description: "",
        objective: "",
        reward: "",
        difficulty: 1,
        npc_id: "",
        npc_name: "",
        dungeon_id: state.data.dungeons?.[0]?.id || "",
        dungeon_name: state.data.dungeons?.[0]?.name || "",
        tags: [],
        image_path: ""
      };
    case "loot_items":
      return {
        id: uid("loot"),
        creature_id: state.data.creatures?.[0]?.id || "",
        creature_name: state.data.creatures?.[0]?.name || "",
        name: "",
        type: "",
        effect: "",
        gold_value: 0,
        tags: [],
        image_path: ""
      };
    case "brouhaha_effects":
      return {
        id: uid("brouhaha"),
        level: state.ui.brouhaha.level || 0,
        dungeon_id: "",
        dungeon_name: "",
        effect_text: ""
      };
    case "media_assets":
      return {
        id: uid("media"),
        label: "",
        file_name: "",
        path: "",
        mime_type: "image/*",
        entity_type: "gallery",
        entity_id: "",
        image_path: "",
        blob: null,
        thumb_blob: null,
        width: 0,
        height: 0
      };
    default:
      return { id: uid(type), name: "" };
  }
}

function importRowToEntity(type, row, existing) {
  const item = existing ? structuredClone(existing) : blankEntity(type);

  switch (type) {
    case "dungeons":
      item.name = String(row.name || existing?.name || "").trim();
      item.slug = slugify(item.name);
      item.description = String(row.description || existing?.description || "").trim();
      item.floor_budgets = Array.isArray(row.floor_budgets)
        ? row.floor_budgets
        : parseFloorBudgets(row.floor_budgets || existing?.floor_budgets || "3;5;7;9;11");
      item.base_floor_count = Number(existing?.base_floor_count || 5);
      item.boss_name = String(row.boss_name || existing?.boss_name || "").trim();
      item.tags = tagsToArray(row.tags);
      item.image_path = String(row.image_path || existing?.image_path || "").trim();
      break;
    case "interactables":
      item.name = String(row.name || existing?.name || "").trim();
      item.slug = slugify(item.name);
      item.dungeon_name = String(row.dungeon_name || existing?.dungeon_name || "").trim();
      item.dungeon_id = findByName("dungeons", item.dungeon_name)?.id || existing?.dungeon_id || item.dungeon_id || "";
      item.type = String(row.type || existing?.type || "").trim();
      item.hp = clamp(row.hp ?? existing?.hp ?? 1, 0, 9999);
      item.actions_allowed = String(row.actions_allowed || existing?.actions_allowed || "").trim();
      item.effect = String(row.effect || existing?.effect || "").trim();
      item.tags = tagsToArray(row.tags);
      item.image_path = String(row.image_path || existing?.image_path || "").trim();
      break;
    case "creatures":
      item.name = String(row.name || existing?.name || "").trim();
      item.slug = slugify(item.name);
      item.dungeon_name = String(row.dungeon_name || existing?.dungeon_name || "").trim();
      item.dungeon_id = findByName("dungeons", item.dungeon_name)?.id || existing?.dungeon_id || item.dungeon_id || "";
      item.dungeon_slug = slugify(item.dungeon_name);
      item.category = normalizeCreatureCategory(row.category || existing?.category || "basique");
      item.menace = clamp(row.menace ?? existing?.menace ?? 1, 1, 9999);
      item.pv = clamp(row.pv ?? existing?.pv ?? 0, 0, 9999);
      item.atk = clamp(row.atk ?? existing?.atk ?? 0, 0, 9999);
      item.def = clamp(row.def ?? existing?.def ?? 0, 0, 9999);
      item.zone = clamp(row.zone ?? existing?.zone ?? 1, 1, 9999);
      item.actions = clamp(row.actions ?? existing?.actions ?? 2, 1, 9999);
      item.special_attack_name = String(row.special_attack_name || existing?.special_attack_name || "").trim();
      item.special_attack_noise = clamp(row.special_attack_noise ?? existing?.special_attack_noise ?? 0, 0, 9999);
      item.ai_behavior = String(row.ai_behavior || existing?.ai_behavior || "").trim();
      item.ai_target_priority = String(row.ai_target_priority || existing?.ai_target_priority || "").trim();
      item.lore = String(row.lore || existing?.lore || "").trim();
      item.socle = String(row.socle || existing?.socle || "").trim() || "32mm";
      item.tags = tagsToArray(row.tags);
      item.image_path = String(row.image_path || existing?.image_path || "").trim();
      item.loot_items = parseLootLines(row.loot || row.loot_lines || "", item.id);
      break;
    case "heroes":
      item.hero_base_name = String(row.hero_base_name || existing?.hero_base_name || "").trim();
      item.level = clamp(row.level ?? existing?.level ?? 1, 1, 4);
      item.name = String(row.name || existing?.name || "").trim() || `${item.hero_base_name} - Niv ${item.level}`;
      item.role = String(row.role || existing?.role || "").trim();
      item.title = String(row.title || existing?.title || "").trim();
      item.pv = clamp(row.pv ?? existing?.pv ?? 0, 0, 9999);
      item.atk = clamp(row.atk ?? existing?.atk ?? 0, 0, 9999);
      item.def = clamp(row.def ?? existing?.def ?? 0, 0, 9999);
      item.zone = clamp(row.zone ?? existing?.zone ?? 1, 1, 9999);
      item.actions = clamp(row.actions ?? existing?.actions ?? 3, 1, 9999);
      item.ability_text = String(row.ability_text || existing?.ability_text || "").trim();
      item.effect_text = String(row.effect_text || existing?.effect_text || "").trim();
      item.brouhaha = String(row.brouhaha || existing?.brouhaha || "").trim();
      item.tags = tagsToArray(row.tags);
      item.image_path = String(row.image_path || existing?.image_path || "").trim();
      break;
    case "npcs":
      item.name = String(row.name || existing?.name || "").trim();
      item.slug = slugify(item.name);
      item.race = String(row.race || existing?.race || "").trim();
      item.tone = String(row.tone || existing?.tone || "").trim();
      item.role = String(row.role || existing?.role || "").trim();
      item.lore = String(row.lore || existing?.lore || "").trim();
      item.tags = tagsToArray(row.tags);
      item.image_path = String(row.image_path || existing?.image_path || "").trim();
      break;
    case "quests":
      item.name = String(row.name || existing?.name || "test").trim() || "test";
      item.slug = slugify(item.name);
      item.description = String(row.description || existing?.description || "").trim();
      item.objective = String(row.objective || existing?.objective || "").trim();
      item.reward = String(row.reward || existing?.reward || "").trim();
      item.difficulty = clamp(row.difficulty ?? existing?.difficulty ?? 1, 1, 5);
      item.dungeon_name = String(row.dungeon_name || existing?.dungeon_name || "").trim();
      item.dungeon_id = findByName("dungeons", item.dungeon_name)?.id || existing?.dungeon_id || item.dungeon_id || "";
      item.npc_name = String(row.npc_name || existing?.npc_name || "").trim();
      item.npc_id = findByName("npcs", item.npc_name)?.id || existing?.npc_id || "";
      item.tags = tagsToArray(row.tags);
      item.image_path = String(row.image_path || existing?.image_path || "").trim();
      break;
    case "loot_items":
      item.creature_name = String(row.creature_name || existing?.creature_name || "").trim();
      item.creature_id = findByName("creatures", item.creature_name)?.id || existing?.creature_id || item.creature_id || "";
      item.name = String(row.name || existing?.name || "").trim();
      item.slug = slugify(item.name);
      item.type = String(row.type || existing?.type || "").trim();
      item.effect = String(row.effect || existing?.effect || "").trim();
      item.gold_value = clamp(row.gold_value ?? existing?.gold_value ?? 0, 0, 9999);
      item.tags = tagsToArray(row.tags);
      item.image_path = String(row.image_path || existing?.image_path || "").trim();
      break;
    case "brouhaha_effects":
      item.level = clamp(row.level ?? existing?.level ?? 0, 0, 12);
      item.dungeon_name = String(row.dungeon_name || existing?.dungeon_name || "").trim();
      item.dungeon_id = item.dungeon_name ? (findByName("dungeons", item.dungeon_name)?.id || existing?.dungeon_id || "") : "";
      item.effect_text = String(row.effect_text || existing?.effect_text || "").trim();
      break;
    case "media_assets":
      item.id = String(row.id || existing?.id || uid("media"));
      item.label = String(row.label || existing?.label || "").trim();
      item.file_name = String(row.file_name || existing?.file_name || "").trim();
      item.path = String(row.path || existing?.path || "").trim();
      item.mime_type = String(row.mime_type || existing?.mime_type || "image/*").trim();
      item.entity_type = String(row.entity_type || existing?.entity_type || "gallery").trim() || "gallery";
      item.entity_id = String(row.entity_id || existing?.entity_id || "").trim();
      item.image_path = item.path;
      break;
  }

  if (!item.created_at) item.created_at = nowISO();
  item.updated_at = nowISO();
  return item;
}

function parseLootLines(text, creatureId, creatureName = "") {
  const lines = String(text || "").split(/\n+/).map(l => l.trim()).filter(Boolean);
  return lines.map(line => {
    const parts = line.split("|").map(p => p.trim());
    return {
      id: uid("loot"),
      creature_id: creatureId,
      creature_name: creatureName || findById("creatures", creatureId)?.name || "",
      name: parts[0] || "",
      type: parts[1] || "",
      effect: parts[2] || "",
      gold_value: clamp(parts[3] || 0, 0, 9999),
      tags: ["loot"],
      image_path: "",
      created_at: nowISO(),
      updated_at: nowISO()
    };
  });
}

function getLootTextForCreature(creature) {
  return (creature?.loot_items || []).map(l => [l.name, l.type, l.effect || "", l.gold_value || 0].join("|")).join("\n");
}

function normalizeTemplateRow(type, row) {
  switch (type) {
    case "dungeons":
      return {
        name: row.name || "",
        description: row.description || "",
        floor_budgets: row.floor_budgets || "",
        boss_name: row.boss_name || "",
        tags: row.tags || "",
        image_path: row.image_path || ""
      };
    case "creatures":
      return {
        name: row.name || "",
        dungeon_name: row.dungeon_name || "",
        category: row.category || "",
        menace: row.menace || 0,
        pv: row.pv || 0,
        atk: row.atk || 0,
        def: row.def || 0,
        zone: row.zone || 1,
        actions: row.actions || 2,
        special_attack_name: row.special_attack_name || "",
        special_attack_noise: row.special_attack_noise || 0,
        ai_behavior: row.ai_behavior || "",
        ai_target_priority: row.ai_target_priority || "",
        lore: row.lore || "",
        socle: row.socle || "",
        tags: row.tags || "",
        image_path: row.image_path || "",
        loot: row.loot || ""
      };
    case "heroes":
      return {
        hero_base_name: row.hero_base_name || "",
        level: row.level || 1,
        name: row.name || "",
        role: row.role || "",
        title: row.title || "",
        pv: row.pv || 0,
        atk: row.atk || 0,
        def: row.def || 0,
        zone: row.zone || 1,
        actions: row.actions || 3,
        ability_text: row.ability_text || "",
        effect_text: row.effect_text || "",
        brouhaha: row.brouhaha || "",
        tags: row.tags || "",
        image_path: row.image_path || ""
      };
    case "npcs":
      return {
        name: row.name || "",
        race: row.race || "",
        tone: row.tone || "",
        role: row.role || "",
        lore: row.lore || "",
        tags: row.tags || "",
        image_path: row.image_path || ""
      };
    case "quests":
      return {
        name: row.name || "",
        description: row.description || "",
        objective: row.objective || "",
        reward: row.reward || "",
        difficulty: row.difficulty || 1,
        npc_name: row.npc_name || "",
        dungeon_name: row.dungeon_name || "",
        tags: row.tags || "",
        image_path: row.image_path || ""
      };
    case "loot_items":
      return {
        creature_name: row.creature_name || "",
        name: row.name || "",
        type: row.type || "",
        effect: row.effect || "",
        gold_value: row.gold_value || 0,
        tags: row.tags || "",
        image_path: row.image_path || ""
      };
    case "interactables":
      return {
        name: row.name || "",
        dungeon_name: row.dungeon_name || "",
        type: row.type || "",
        hp: row.hp || 1,
        actions_allowed: row.actions_allowed || "",
        effect: row.effect || "",
        tags: row.tags || "",
        image_path: row.image_path || ""
      };
    case "brouhaha_effects":
      return {
        level: row.level || 0,
        dungeon_name: row.dungeon_name || "",
        effect_text: row.effect_text || ""
      };
    case "media_assets":
      return {
        id: row.id || "",
        label: row.label || "",
        file_name: row.file_name || "",
        path: row.path || "",
        mime_type: row.mime_type || "",
        entity_type: row.entity_type || "",
        entity_id: row.entity_id || ""
      };
    default:
      return row;
  }
}

function toTemplateRows(type, list) {
  return list.map(entity => formatExportRow(type, entity));
}

function renderShell(content) {
  return `
  <div class="shell">
    <header class="topbar">
      <button class="brand" data-action="go-home" title="Accueil">
        <img src="assets/images/logo-192.png" alt="Gargottex">
        <div>
          <div class="brand-title">Gargottex V5.3</div>
          <div class="brand-subtitle">offline-first, local et têtu</div>
        </div>
      </button>
      <div class="topbar-right">
        <div class="search-wrap">
          <input class="search" data-action="search" placeholder="Recherche globale..." value="${escapeHtml(state.ui.globalSearch)}">
          ${state.ui.globalSearch ? renderSearchResults() : ""}
        </div>
        <button class="ghost" data-action="toggle-journal">🧯 Journal</button>
      </div>
    </header>

    <nav class="mainnav">
      ${navButton("home", "🍺 Accueil")}
      ${navButton("codex", "📚 Codex")}
      ${navButton("generator", "🎲 Générateur")}
      ${navButton("brouhaha", "🔥 Brouhaha")}
      ${navButton("quests", "📜 Quêtes")}
      ${navButton("atelier", "🛠️ Atelier")}
      ${navButton("media", "🖼️ Médias")}
      ${navButton("import", "⬇️ Import/Export")}
    </nav>

    <main class="page">${content}</main>

    <aside class="toast-stack">
      ${state.toasts.map(t => `<div class="toast ${t.tone}">${escapeHtml(t.message)}</div>`).join("")}
    </aside>

    ${renderImageViewer()}
    ${state.ui.journalOpen ? renderJournalDrawer() : ""}
  </div>`;
}

function navButton(view, label) {
  const active = state.ui.view === view ? "active" : "";
  return `<button class="navbtn ${active}" data-action="set-view" data-view="${view}">${label}</button>`;
}

function renderSearchResults() {
  const q = state.ui.globalSearch.trim().toLowerCase();
  if (!q) return "";
  const chips = [];
  for (const type of ENTITY_ORDER) {
    for (const item of getFilteredList(type).slice(0, 5)) {
      chips.push(`<button class="result-chip" data-action="jump-codex" data-type="${type}" data-id="${item.id}">${getLabel(type)} · ${escapeHtml(item.name || item.title || item.hero_base_name || item.label || "")}</button>`);
    }
  }
  return `<div class="search-results">${chips.length ? chips.join("") : `<div class="muted">Aucun résultat.</div>`}</div>`;
}

function renderHome() {
  const counts = Object.fromEntries(ENTITY_ORDER.map(type => [type, (state.data[type] || []).length]));
  const currentDungeon = findById("dungeons", state.ui.generator.dungeonId) || state.data.dungeons?.[0] || null;
  const gallery = (state.data.media_assets || []).slice(0, 8);

  return renderShell(`
    <section class="hero-card">
      <div class="hero-text">
        <span class="eyebrow">Fantasy cartoon absurde</span>
        <h1>Le codex tavernier de Gargottex</h1>
        <p>Un registre local, rapide et sans cloud, pour gérer donjons, créatures, loot, héros, PNJ, quêtes, Brouhaha et médias.</p>
        <div class="hero-actions">
          <button class="primary" data-action="set-view" data-view="generator">🎲 Générer</button>
          <button class="secondary" data-action="set-view" data-view="brouhaha">🔥 Brouhaha</button>
          <button class="secondary" data-action="set-view" data-view="atelier">🛠️ Atelier</button>
        </div>
      </div>
      <div class="hero-visual">
        <img class="logo-glow" src="assets/images/logo-512.png" alt="Logo Gargottex">
        <div class="hero-quote">
          <strong>Berthold dit :</strong>
          <p>« Si ça déborde, c'est que le chaudron a encore gagné. »</p>
        </div>
      </div>
    </section>

    <section class="stats-row">
      ${statCard("Donjons", counts.dungeons, "🏰")}
      ${statCard("Créatures", counts.creatures, "👹")}
      ${statCard("Héros", counts.heroes, "🛡️")}
      ${statCard("PNJ", counts.npcs, "🍺")}
      ${statCard("Quêtes", counts.quests, "📜")}
      ${statCard("Images", counts.media_assets, "🖼️")}
    </section>

    <section class="quick-grid">
      <button class="big-card" data-action="set-view" data-view="codex">
        <span>📚</span><strong>Codex</strong><small>Lecture seule et fiches du bestiaire</small>
      </button>
      <button class="big-card" data-action="set-view" data-view="quests">
        <span>📜</span><strong>Quêtes</strong><small>Bibliothèque et tirage</small>
      </button>
      <button class="big-card" data-action="set-view" data-view="media">
        <span>🖼️</span><strong>Médias</strong><small>Images locales et uploads</small>
      </button>
      <button class="big-card" data-action="set-view" data-view="import">
        <span>⬇️</span><strong>Import / Export</strong><small>XLSX et CSV basés sur tes templates</small>
      </button>
    </section>

    <section class="panel">
      <div class="panel-title">
        <h2>Donjon actif</h2>
        <button class="ghost" data-action="set-view" data-view="generator">Ouvrir</button>
      </div>
      <div class="session-summary">
        <div><strong>${escapeHtml(currentDungeon?.name || "Aucun")}</strong><br><span class="muted">${escapeHtml(currentDungeon?.description || "")}</span></div>
        <div><strong>Budget étage 1</strong><br>${escapeHtml(String(currentDungeon?.floor_budgets?.[0] ?? "3"))}</div>
        <div><strong>Créatures liées</strong><br>${(state.data.creatures || []).filter(c => c.dungeon_id === currentDungeon?.id).length}</div>
      </div>
    </section>

    <section class="panel">
      <div class="panel-title">
        <h2>Galerie</h2>
        <button class="ghost" data-action="set-view" data-view="media">Tout voir</button>
      </div>
      <div class="gallery">
        ${gallery.map(asset => renderMediaAssetCard(asset, false)).join("") || `<div class="empty">Aucune image.</div>`}
      </div>
    </section>
  `);
}

function statCard(label, value, icon) {
  return `<div class="stat-card"><div class="stat-icon">${icon}</div><div><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div></div>`;
}

function renderCodex() {
  const type = state.ui.codexType;
  const items = getFilteredList(type, "codex");
  const selected = items.find(item => item.id === state.ui.codexSelectedId) || items[0] || null;

  return renderShell(`
    <section class="panel">
      <div class="panel-title">
        <h2>Codex</h2>
        <div class="segmented wrap">
          ${ENTITY_ORDER.map(t => `<button class="tab ${t === type ? "active" : ""}" data-action="set-codex-type" data-type="${t}">${getLabel(t)}</button>`).join("")}
        </div>
      </div>

      <div class="panel-subtitle">
        <span>${items.length} entrée(s)</span>
        ${type === "creatures" ? renderCreatureDungeonFilter(state.ui.codexCreatureDungeonId, "codex-creature-dungeon-filter") : ""}
        ${type === "heroes" ? renderHeroLevelFilter(state.ui.codexHeroLevel, "codex-hero-level-filter") : ""}
      </div>

      <div class="two-col encounter-columns">
        <div class="list-column">
          <div class="card-list">
            ${items.map(item => renderCodexCard(type, item, selected?.id === item.id)).join("") || `<div class="empty">Aucune donnée.</div>`}
          </div>
        </div>
        <div class="detail-column">
          ${selected ? renderCodexDetail(type, selected) : `<div class="empty">Sélectionnez une fiche.</div>`}
        </div>
      </div>
    </section>
  `);
}

function renderCodexCard(type, item, active) {
  const title = item.name || item.title || item.hero_base_name || item.label || "";
  const subtitle = codexSubtitle(type, item);
  const image = codexImageFor(type, item);
  return `
    <button class="codex-card ${active ? "active" : ""}" data-action="select-codex" data-type="${type}" data-id="${item.id}">
      <div class="card-img" data-action="open-image" data-src="${escapeHtml(image || "")}" data-alt="${escapeHtml(title || "")}">
        ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title || "")}" loading="lazy">` : `<div class="placeholder">${escapeHtml((title || "?").slice(0,2).toUpperCase())}</div>`}
      </div>
      <div class="card-body">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(subtitle)}</span>
        <em>${escapeHtml(codexBadge(type, item))}</em>
      </div>
    </button>
  `;
}

function codexSubtitle(type, item) {
  switch (type) {
    case "creatures": return `${escapeHtml(item.dungeon_name || "")} · ${item.category || ""}`;
    case "heroes": return `${escapeHtml(item.role || "")} · niv ${item.level || 1}`;
    case "npcs": return `${escapeHtml(item.race || "")} · ${escapeHtml(item.role || "")}`;
    case "quests": return `${escapeHtml(item.dungeon_name || "")} · ${escapeHtml(item.npc_name || "PNJ facultatif")}`;
    case "dungeons": return `${escapeHtml((item.floor_budgets || []).join(" · "))}`;
    case "loot_items": return `${escapeHtml(item.creature_name || "")} · ${item.gold_value || 0} or`;
    case "interactables": return `${escapeHtml(item.dungeon_name || "")} · ${escapeHtml(item.type || "")}`;
    case "brouhaha_effects": return `Niv ${item.level ?? 0}`;
    case "media_assets": return `${escapeHtml(item.entity_type || "gallery")} · ${escapeHtml(item.path || "")}`;
    default: return "";
  }
}

function codexBadge(type, item) {
  switch (type) {
    case "creatures": return `⚔️ ${item.menace || 0}`;
    case "heroes": return `Niv ${item.level || 1}`;
    case "quests": return "⭐".repeat(clamp(item.difficulty || 1, 1, 5));
    case "dungeons": return "Donjon";
    case "loot_items": return item.type || "Loot";
    case "interactables": return item.type || "Objet";
    case "brouhaha_effects": return `Effet niveau ${item.level ?? 0}`;
    case "media_assets": return item.mime_type || "Media";
    default: return "";
  }
}

function codexImageFor(type, item) {
  if (type === "media_assets") return thumbUrlForAsset(item);
  return imageUrlForEntity(item);
}

function renderCreatureDungeonFilter(selectedId, action) {
  return `
    <label class="inline-filter">
      <span>Donjon</span>
      <select data-action="${action}">
        <option value="">Tous</option>
        ${state.data.dungeons.map(d => `<option value="${d.id}" ${String(selectedId || "") === String(d.id) ? "selected" : ""}>${escapeHtml(d.name)}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderHeroLevelFilter(selectedLevel, action) {
  return `
    <label class="inline-filter">
      <span>Niveau</span>
      <select data-action="${action}">
        <option value="">Tous</option>
        ${[1, 2, 3, 4].map(level => `<option value="${level}" ${String(selectedLevel || "") === String(level) ? "selected" : ""}>Niv ${level}</option>`).join("")}
      </select>
    </label>
  `;
}

function renderCodexDetail(type, item) {
  switch (type) {
    case "creatures": return renderCreatureDetail(item, true);
    case "heroes": return renderHeroDetail(item, true);
    case "npcs": return renderNpcDetail(item, true);
    case "quests": return renderQuestDetail(item, true);
    case "dungeons": return renderDungeonDetail(item, true);
    case "loot_items": return renderLootDetail(item, true);
    case "interactables": return renderInteractableDetail(item, true);
    case "brouhaha_effects": return renderBrouhahaEffectDetail(item, true);
    case "media_assets": return renderMediaAssetDetail(item, true);
    default: return `<div class="empty">Aucune fiche.</div>`;
  }
}

function renderDungeonDetail(item, readOnly = false) {
  const creatureCount = (state.data.creatures || []).filter(c => c.dungeon_id === item.id).length;
  const questCount = (state.data.quests || []).filter(q => q.dungeon_id === item.id).length;
  return `
    <div class="detail-card">
      <div class="detail-head">
        <div>
          <span class="badge">Donjon</span>
          <h3>${escapeHtml(item.name)}</h3>
          <div class="muted">${escapeHtml(item.slug || "")}</div>
        </div>
      </div>
      <div class="detail-image" data-action="open-image" data-src="${escapeHtml(item.image_path || "")}" data-alt="${escapeHtml(item.name || "")}">
        ${item.image_path ? `<img src="${escapeHtml(item.image_path)}" alt="${escapeHtml(item.name || "")}" loading="lazy">` : `<div class="placeholder large">🏰</div>`}
      </div>
      <p><strong>Description :</strong> ${escapeHtml(item.description || "—")}</p>
      <p><strong>Budgets :</strong> ${escapeHtml((item.floor_budgets || []).join(" · "))}</p>
      <p><strong>Créatures liées :</strong> ${creatureCount}</p>
      <p><strong>Quêtes liées :</strong> ${questCount}</p>
      <p><strong>Tags :</strong> ${escapeHtml(tagsToText(item.tags))}</p>
    </div>
  `;
}

function renderCreatureDetail(item) {
  const lootItems = item.loot_items || [];
  return `
    <div class="detail-card">
      <div class="detail-head">
        <div>
          <span class="badge">${escapeHtml(item.category || "")}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <div class="muted">${escapeHtml(item.dungeon_name || "")}</div>
        </div>
      </div>
      <div class="detail-image" data-action="open-image" data-src="${escapeHtml(imageUrlForEntity(item) || "")}" data-alt="${escapeHtml(item.name || "")}">
        ${item.image_path ? `<img src="${escapeHtml(imageUrlForEntity(item))}" alt="${escapeHtml(item.name || "")}" loading="lazy">` : `<div class="placeholder large">👹</div>`}
      </div>
      <div class="stat-grid">
        <div><strong>PV</strong><span>${item.pv || 0}</span></div>
        <div><strong>ATK</strong><span>${item.atk || 0}</span></div>
        <div><strong>DEF</strong><span>${item.def || 0}</span></div>
        <div><strong>Zone</strong><span>${item.zone || 1}</span></div>
        <div><strong>Actions</strong><span>${item.actions || 2}</span></div>
        <div><strong>Menace</strong><span>${item.menace || 0}</span></div>
      </div>
      <p><strong>Compétence :</strong> ${escapeHtml(item.special_attack_name || "—")}</p>
      <p><strong>IA :</strong> ${escapeHtml(item.ai_behavior || "—")}</p>
      <p><strong>Cible :</strong> ${escapeHtml(item.ai_target_priority || "—")}</p>
      <p><strong>Lore :</strong> ${escapeHtml(item.lore || "—")}</p>
      <p><strong>Tags :</strong> ${escapeHtml(tagsToText(item.tags))}</p>
      <div class="subpanel">
        <h4>Loot</h4>
        ${renderLootList(lootItems)}
      </div>
    </div>
  `;
}

function renderLootList(list) {
  if (!list.length) return `<div class="empty small">Aucun loot.</div>`;
  return `<div class="loot-list">${list.map(l => `<div class="loot-chip"><strong>${escapeHtml(l.name)}</strong><span>${escapeHtml(l.type || "")}${l.effect ? ` · ${escapeHtml(l.effect)}` : ""}</span><em>${l.gold_value || 0} or</em></div>`).join("")}</div>`;
}

function renderHeroDetail(item) {
  const siblings = (state.data.heroes || []).filter(h => h.hero_base_name === item.hero_base_name).sort((a,b) => Number(a.level) - Number(b.level));
  const abilities = siblings.filter(h => h.ability_text).map(h => ({ level: h.level, ability_text: h.ability_text, effect_text: h.effect_text }));
  return `
    <div class="detail-card">
      <div class="detail-head">
        <div>
          <span class="badge">Niveau ${item.level}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <div class="muted">${escapeHtml(item.role || "")}</div>
        </div>
      </div>
      <div class="detail-image" data-action="open-image" data-src="${escapeHtml(imageUrlForEntity(item) || "")}" data-alt="${escapeHtml(item.name || "")}">
        ${item.image_path ? `<img src="${escapeHtml(imageUrlForEntity(item))}" alt="${escapeHtml(item.name || "")}" loading="lazy">` : `<div class="placeholder large">🛡️</div>`}
      </div>
      <div class="stat-grid">
        <div><strong>PV</strong><span>${item.pv || 0}</span></div>
        <div><strong>ATK</strong><span>${item.atk || 0}</span></div>
        <div><strong>DEF</strong><span>${item.def || 0}</span></div>
        <div><strong>Portée</strong><span>${item.zone || 1}</span></div>
        <div><strong>Actions</strong><span>${item.actions || 3}</span></div>
        <div><strong>Brouhaha</strong><span>${escapeHtml(item.brouhaha || "")}</span></div>
      </div>
      <p><strong>Titre :</strong> ${escapeHtml(item.title || "—")}</p>
      <p><strong>Compétence :</strong> ${escapeHtml(item.ability_text || "—")}</p>
      <p><strong>Effet :</strong> ${escapeHtml(item.effect_text || "—")}</p>
      <p><strong>Tags :</strong> ${escapeHtml(tagsToText(item.tags))}</p>
      <div class="subpanel">
        <h4>Compétences cumulées</h4>
        <div class="ability-list">
          ${abilities.length ? abilities.map(a => `<div class="ability"><strong>Niv ${a.level}</strong><span>${escapeHtml(a.ability_text)}</span><small>${escapeHtml(a.effect_text || "")}</small></div>`).join("") : `<div class="empty small">Aucune compétence.</div>`}
        </div>
      </div>
    </div>
  `;
}

function renderNpcDetail(item) {
  return `
    <div class="detail-card">
      <div class="detail-head">
        <div>
          <span class="badge">${escapeHtml(item.race || "")}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <div class="muted">${escapeHtml(item.role || "")}</div>
        </div>
      </div>
      <div class="detail-image" data-action="open-image" data-src="${escapeHtml(imageUrlForEntity(item) || "")}" data-alt="${escapeHtml(item.name || "")}">
        ${item.image_path ? `<img src="${escapeHtml(imageUrlForEntity(item))}" alt="${escapeHtml(item.name || "")}" loading="lazy">` : `<div class="placeholder large">🍺</div>`}
      </div>
      <p><strong>Ton :</strong> ${escapeHtml(item.tone || "—")}</p>
      <p><strong>Lore :</strong> ${escapeHtml(item.lore || "—")}</p>
      <p><strong>Tags :</strong> ${escapeHtml(tagsToText(item.tags))}</p>
    </div>
  `;
}

function renderQuestDetail(item) {
  return `
    <div class="detail-card">
      <div class="detail-head">
        <div>
          <span class="badge">${"⭐".repeat(clamp(item.difficulty || 1, 1, 5))}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <div class="muted">${escapeHtml(item.dungeon_name || "")} · ${escapeHtml(item.npc_name || "PNJ facultatif")}</div>
        </div>
      </div>
      <div class="detail-image" data-action="open-image" data-src="${escapeHtml(imageUrlForEntity(item) || "")}" data-alt="${escapeHtml(item.name || "")}">
        ${item.image_path ? `<img src="${escapeHtml(imageUrlForEntity(item))}" alt="${escapeHtml(item.name || "")}" loading="lazy">` : `<div class="placeholder large">📜</div>`}
      </div>
      <p><strong>Description :</strong> ${escapeHtml(item.description || "—")}</p>
      <p><strong>Objectif :</strong> ${escapeHtml(item.objective || "—")}</p>
      <p><strong>Récompense :</strong> ${escapeHtml(item.reward || "—")}</p>
      <p><strong>Tags :</strong> ${escapeHtml(tagsToText(item.tags))}</p>
    </div>
  `;
}

function renderLootDetail(item) {
  const creature = findById("creatures", item.creature_id);
  return `
    <div class="detail-card">
      <div class="detail-head">
        <div>
          <span class="badge">Loot</span>
          <h3>${escapeHtml(item.name)}</h3>
          <div class="muted">${escapeHtml(creature?.name || item.creature_name || "")}</div>
        </div>
      </div>
      <div class="detail-image" data-action="open-image" data-src="${escapeHtml(imageUrlForEntity(item) || "")}" data-alt="${escapeHtml(item.name || "")}">
        ${item.image_path ? `<img src="${escapeHtml(imageUrlForEntity(item))}" alt="${escapeHtml(item.name || "")}" loading="lazy">` : `<div class="placeholder large">🪙</div>`}
      </div>
      <p><strong>Type :</strong> ${escapeHtml(item.type || "—")}</p>
      <p><strong>Effet :</strong> ${escapeHtml(item.effect || "—")}</p>
      <p><strong>Valeur :</strong> ${item.gold_value || 0} or</p>
    </div>
  `;
}

function renderInteractableDetail(item) {
  return `
    <div class="detail-card">
      <div class="detail-head">
        <div>
          <span class="badge">Objet</span>
          <h3>${escapeHtml(item.name || "")}</h3>
          <div class="muted">${escapeHtml(item.dungeon_name || "")}</div>
        </div>
      </div>
      <div class="detail-image" data-action="open-image" data-src="${escapeHtml(imageUrlForEntity(item) || "")}" data-alt="${escapeHtml(item.name || "")}">
        ${item.image_path ? `<img src="${escapeHtml(imageUrlForEntity(item))}" alt="${escapeHtml(item.name || "")}" loading="lazy">` : `<div class="placeholder large">🧱</div>`}
      </div>
      <div class="stat-grid">
        <div><strong>Type</strong><span>${escapeHtml(item.type || "—")}</span></div>
        <div><strong>PV</strong><span>${item.hp || 0}</span></div>
        <div><strong>Actions</strong><span>${escapeHtml(item.actions_allowed || "—")}</span></div>
      </div>
      <p><strong>Effet :</strong> ${escapeHtml(item.effect || "—")}</p>
      <p><strong>Tags :</strong> ${escapeHtml(tagsToText(item.tags))}</p>
    </div>
  `;
}

function renderBrouhahaEffectDetail(item) {
  return `
    <div class="detail-card">
      <div class="detail-head">
        <div>
          <span class="badge">Brouhaha</span>
          <h3>Niveau ${item.level ?? 0}</h3>
          <div class="muted">${escapeHtml(item.dungeon_name || "Universel")}</div>
        </div>
      </div>
      <p><strong>Effet :</strong> ${escapeHtml(item.effect_text || "—")}</p>
    </div>
  `;
}

function renderMediaAssetCard(asset, active = false) {
  const img = thumbUrlForAsset(asset);
  return `
    <figure class="gallery-item ${active ? "active" : ""}">
      ${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(asset.label || asset.file_name || "")}" loading="lazy">` : `<div class="placeholder large">🖼️</div>`}
      <figcaption>${escapeHtml(asset.label || asset.file_name || asset.path || asset.id)}</figcaption>
    </figure>
  `;
}

function renderMediaAssetDetail(asset) {
  const preview = mediaUrlForAsset(asset, false) || asset.path || "";
  return `
    <div class="detail-card">
      <div class="detail-head">
        <div>
          <span class="badge">${escapeHtml(asset.entity_type || "gallery")}</span>
          <h3>${escapeHtml(asset.label || asset.file_name || asset.id)}</h3>
          <div class="muted">${escapeHtml(asset.path || "")}</div>
        </div>
      </div>
      <div class="detail-image" data-action="open-image" data-src="${escapeHtml(preview || "")}" data-alt="${escapeHtml(asset.label || asset.file_name || asset.id)}">
        ${preview ? `<img src="${escapeHtml(preview)}" alt="${escapeHtml(asset.label || asset.file_name || asset.id)}" loading="lazy">` : `<div class="placeholder large">🖼️</div>`}
      </div>
      <p><strong>Nom de fichier :</strong> ${escapeHtml(asset.file_name || "—")}</p>
      <p><strong>Type MIME :</strong> ${escapeHtml(asset.mime_type || "—")}</p>
      <p><strong>Entité :</strong> ${escapeHtml(asset.entity_type || "gallery")} · ${escapeHtml(asset.entity_id || "—")}</p>
    </div>
  `;
}

function renderGenerator() {
  const dungeon = findById("dungeons", state.ui.generator.dungeonId) || state.data.dungeons?.[0] || null;
  const floorBudgets = dungeon?.floor_budgets || [3, 5, 7, 9, 11];
  const floorIndex = clamp(state.ui.generator.floorIndex || 0, 0, Math.max(0, floorBudgets.length - 1));
  const budget = floorBudgets[floorIndex] || 0;
  const result = state.ui.generator.result;

  return renderShell(`
    <section class="panel">
      <div class="panel-title">
        <h2>Générateur</h2>
        <div class="muted">Boss / mini-boss uniquement si cochés. Budget strictement respecté.</div>
      </div>

      <div class="generator-controls">
        <label>
          <span>Donjon</span>
          <select data-action="generator-set-dungeon">
            ${state.data.dungeons.map(d => `<option value="${d.id}" ${d.id === dungeon?.id ? "selected" : ""}>${escapeHtml(d.name)}</option>`).join("")}
          </select>
        </label>
        <label>
          <span>Étage</span>
          <select data-action="generator-set-floor">
            ${floorBudgets.map((b, idx) => `<option value="${idx}" ${idx === floorIndex ? "selected" : ""}>Étage ${idx + 1} · budget ${b}</option>`).join("")}
          </select>
        </label>
        <label class="toggle">
          <input type="checkbox" data-action="generator-set-boss" ${state.ui.generator.boss ? "checked" : ""}>
          <span>Boss</span>
        </label>
        <label class="toggle">
          <input type="checkbox" data-action="generator-set-miniboss" ${state.ui.generator.miniBoss ? "checked" : ""}>
          <span>Mini-boss</span>
        </label>
      </div>

      <button class="primary giant" data-action="generate-encounter">🎲 GÉNÉRER</button>

      <div class="generator-compact">Budget ${budget} | Mode ${state.ui.generator.boss ? "Boss" : state.ui.generator.miniBoss ? "Mini-boss" : "Normal"}</div>

      <div class="panel">
        <h3>Résultat</h3>
        ${result ? renderEncounterResult(result) : `<div class="empty">Lance un tirage.</div>`}
      </div>
    </section>
  `);
}

function renderEncounterResult(result) {
  if (result.error) return `<div class="empty">${escapeHtml(result.error)}</div>`;
  const counts = new Map();
  for (const creature of result.creatures) {
    const entry = counts.get(creature.id) || { creature, count: 0 };
    entry.count++;
    counts.set(creature.id, entry);
  }
  return `
    <div class="result-card">
      <div class="result-head">
        <div>
          <span class="badge">Budget ${result.used}/${result.budget}</span>
          <h3>${escapeHtml(result.dungeon_name)} · Étage ${Number(result.floor) + 1}</h3>
        </div>
      </div>
      <div class="two-col encounter-columns">
        <div class="mini-list encounter-list">
        <h4>Créatures</h4>
        ${Array.from(counts.values()).map(entry => {
          const img = imageUrlForEntity(entry.creature);
          const isKilled = !!result.local?.killedCreatures?.[entry.creature.id];
          return `<div class="encounter-row">
            <div class="encounter-thumb">${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(entry.creature.name)}" loading="lazy">` : `<div class="placeholder">👹</div>`}</div>
            <div class="encounter-body ${isKilled ? "is-killed" : ""}">
              <strong>${entry.count}× ${escapeHtml(entry.creature.name)}</strong>
              <span>${entry.creature.menace || 0} menace</span>
              <button class="ghost tiny" data-action="encounter-open-creature" data-id="${entry.creature.id}">Détails</button>
            </div>
          </div>`;
        }).join("")}
        </div>
        <div class="mini-list encounter-list">
          <h4>Objets interactifs</h4>
          ${(result.interactables || []).map(obj => {
            const img = imageUrlForEntity(obj);
            return `<div class="encounter-row">
              <div class="encounter-thumb">${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(obj.name)}" loading="lazy">` : `<div class="placeholder">🧱</div>`}</div>
              <div class="encounter-body">
                <strong>${escapeHtml(obj.name || "Objet")}</strong>
                <button class="ghost tiny" data-action="encounter-open-object" data-id="${obj.id}">Détails</button>
              </div>
            </div>`;
          }).join("") || `<div class="empty small">Aucun objet interactif.</div>`}
        </div>
      </div>
      ${(result.local?.panelType && result.local?.panelId) ? renderEncounterMiniPanel(result) : ""}
    </div>
  `;
}

function renderEncounterMiniPanel(result) {
  if (result.local.panelType === "creature") {
    const creature = (result.creatures || []).find(c => c.id === result.local.panelId);
    if (!creature) return "";
    const img = imageUrlForEntity(creature);
    const lootResult = result.local.lastLoot?.[creature.id];
    const lootText = lootResult ? (lootResult.type === "none" ? lootResult.text : `Loot: ${lootResult.text}`) : "Aucun tirage.";
    return `<div class="subpanel">
      <h4>Mini fiche créature</h4>
      <div class="encounter-row">
        <div class="encounter-thumb">${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(creature.name)}">` : `<div class="placeholder">👹</div>`}</div>
        <div class="encounter-body">
          <strong>${escapeHtml(creature.name)}</strong>
          <span>PV ${Number(creature.pv || 0)} · ATK ${Number(creature.atk || 0)} · DEF ${Number(creature.def || 0)}</span>
          <span>${escapeHtml((creature.actions || creature.ai_behavior || "—"))}</span>
          <button class="danger tiny" data-action="encounter-kill-creature" data-id="${creature.id}">Kill</button>
          <span>${escapeHtml(lootText)}</span>
        </div>
      </div>
    </div>`;
  }
  const obj = (result.interactables || []).find(x => x.id === result.local.panelId);
  if (!obj) return "";
  const img = imageUrlForEntity(obj);
  const effectLine = result.local.lastEffect?.[obj.id] || "Aucun effet tiré.";
  const hasEffect = String(obj.effect || "").trim().length > 0;
  return `<div class="subpanel">
    <h4>Mini fiche objet</h4>
    <div class="encounter-row">
      <div class="encounter-thumb">${img ? `<img src="${escapeHtml(img)}" alt="${escapeHtml(obj.name)}">` : `<div class="placeholder">🧱</div>`}</div>
      <div class="encounter-body">
        <strong>${escapeHtml(obj.name || "Objet")}</strong>
        <span>Type ${escapeHtml(obj.type || "—")} · PV ${Number(obj.hp || 0)}</span>
        <span>${escapeHtml(obj.actions_allowed || "—")}</span>
        ${hasEffect ? `<button class="primary tiny" data-action="encounter-roll-effect" data-id="${obj.id}">Effet</button>` : ""}
        <span>${escapeHtml(effectLine)}</span>
      </div>
    </div>
  </div>`;
}

function renderBrouhaha() {
  const dungeon = findById("dungeons", state.ui.brouhaha.dungeonId) || state.data.dungeons?.[0] || null;
  const level = clamp(state.ui.brouhaha.level || 0, 0, 12);
  const history = state.ui.brouhaha.history || [];

  return renderShell(`
    <section class="panel">
      <div class="panel-title">
        <h2>Brouhaha</h2>
        <div class="muted">Niveaux exacts. 10+ = 2 effets.</div>
      </div>

      <div class="generator-controls">
        <label>
          <span>Donjon</span>
          <select data-action="brouhaha-set-dungeon">
            ${state.data.dungeons.map(d => `<option value="${d.id}" ${d.id === dungeon?.id ? "selected" : ""}>${escapeHtml(d.name)}</option>`).join("")}
          </select>
        </label>
      </div>

      <div class="brouhaha-stage ${level >= 10 ? "hot" : ""}">
        <button class="brouhaha-step" data-action="brouhaha-minus">−1</button>
        <div class="brouhaha-core">
          <div class="brouhaha-label">Brouhaha actuel</div>
          <div class="brouhaha-level">${level}</div>
          <div class="brouhaha-scale">0 → 12</div>
        </div>
        <button class="brouhaha-step" data-action="brouhaha-plus">+1</button>
      </div>

      <button class="primary giant" data-action="brouhaha-draw">🎲 Tirer un effet</button>

      <div class="panel">
        <div class="panel-title compact"><h3>Historique</h3></div>
        <div class="effect-stack">
          ${history.slice(0, 8).map(h => `<div class="effect-card ${h.level >= 10 ? "double" : ""}"><strong>Niv ${h.level}</strong><span>${escapeHtml(h.text)}</span></div>`).join("") || `<div class="empty">Aucun effet.</div>`}
        </div>
      </div>
    </section>
  `);
}

function renderQuests() {
  const dungeon = findById("dungeons", state.ui.questDungeonId) || state.data.dungeons?.[0] || null;
  const quests = (state.data.quests || []).filter(q => q.dungeon_id === dungeon?.id);
  const drawn = state.ui.import.preview?.drawnQuest || null;

  return renderShell(`
    <section class="panel">
      <div class="panel-title">
        <h2>Quêtes</h2>
        <div class="muted">Bibliothèque de quêtes, tirage et édition uniquement dans l'atelier.</div>
      </div>

      <div class="generator-controls">
        <label>
          <span>Donjon</span>
          <select data-action="quests-set-dungeon">
            ${state.data.dungeons.map(d => `<option value="${d.id}" ${d.id === dungeon?.id ? "selected" : ""}>${escapeHtml(d.name)}</option>`).join("")}
          </select>
        </label>
        <button class="primary" data-action="quests-draw">🎲 Tirage</button>
      </div>

      <div class="panel split">
        <div>
          <h3>Résultat</h3>
          ${state.ui.questsResult ? renderQuestDetail(state.ui.questsResult) : `<div class="empty">Aucune quête tirée.</div>`}
        </div>
        <div>
          <div class="panel-title compact"><h3>Quêtes enregistrées</h3></div>
          <div class="card-list">
            ${quests.map(q => renderCodexCard("quests", q, false)).join("") || `<div class="empty">Aucune quête pour ce donjon.</div>`}
          </div>
        </div>
      </div>
    </section>
  `);
}

function renderAtelier() {
  const type = state.ui.workshopType;
  const items = getFilteredList(type, "atelier");
  const selected = items.find(item => item.id === state.ui.workshopSelectedId) || items[0] || null;

  return renderShell(`
    <section class="panel">
      <div class="panel-title">
        <h2>Atelier</h2>
        <div class="muted">La seule zone d'édition des données métier.</div>
      </div>

      <div class="segmented wrap">
        ${["dungeons","creatures","heroes","npcs","quests","loot_items","interactables","brouhaha_effects"].map(t => `<button class="tab ${t === type ? "active" : ""}" data-action="set-workshop-type" data-type="${t}">${getLabel(t)}</button>`).join("")}
      </div>

      <div class="panel-subtitle">
        <span>${items.length} entrée(s)</span>
        ${type === "creatures" ? renderCreatureDungeonFilter(state.ui.workshopCreatureDungeonId, "atelier-creature-dungeon-filter") : ""}
      </div>

      <div class="two-col workshop">
        <div class="list-column">
          <div class="card-list">
            ${items.map(item => renderWorkshopCard(type, item, selected?.id === item.id)).join("") || `<div class="empty">Aucune donnée.</div>`}
          </div>
        </div>
        <div class="detail-column">
          ${selected ? renderWorkshopEditor(type, selected) : `<div class="empty">Sélectionnez une fiche.</div>`}
        </div>
      </div>
    </section>
  `);
}

function renderWorkshopCard(type, item, active) {
  const title = item.name || item.title || item.hero_base_name || item.label || "";
  const subtitle = codexSubtitle(type, item);
  const image = type === "media_assets" ? thumbUrlForAsset(item) : codexImageFor(type, item);
  return `
    <button class="codex-card ${active ? "active" : ""}" data-action="select-workshop" data-type="${type}" data-id="${item.id}">
      <div class="card-img">${image ? `<img src="${escapeHtml(image)}" alt="">` : `<div class="placeholder">${escapeHtml((title || "?").slice(0,2).toUpperCase())}</div>`}</div>
      <div class="card-body">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(subtitle)}</span>
        <em>${escapeHtml(codexBadge(type, item))}</em>
      </div>
    </button>
  `;
}

function renderWorkshopEditor(type, item) {
  const fields = FORM_FIELDS[type] || [];
  return `
    <form class="edit-form" data-form="${type}" data-id="${item.id}">
      <input type="hidden" name="id" value="${escapeHtml(item.id)}">
      <div class="form-grid">
        ${fields.map(field => renderField(field, item)).join("")}
      </div>
      <div class="form-actions">
        <button class="primary" type="submit">💾 Enregistrer</button>
        <button class="danger" type="button" data-action="delete-item" data-type="${type}" data-id="${item.id}">🗑️ Supprimer</button>
      </div>
    </form>
  `;
}

function renderField(field, item) {
  if (field.type === "select") {
    let options = [];
    if (field.options === "mediaEntityTypes") {
      options = ["gallery", "creatures", "heroes", "npcs", "quests", "dungeons", "loot_items"];
    } else if (Array.isArray(field.options)) {
      options = field.options;
    } else {
      options = state.data[field.options] || [];
    }
    const currentValue = item[field.name] ?? "";
    return `
      <label class="${field.type === "textarea" ? "wide" : ""}">
        <span>${escapeHtml(field.label)}</span>
        <select name="${field.name}">
          ${field.allowEmpty ? `<option value="">—</option>` : ""}
          ${options.map(opt => {
            const isStatic = typeof opt === "string" || (opt && typeof opt === "object" && "value" in opt);
            const val = field.options === "mediaEntityTypes"
              ? opt
              : isStatic
                ? (typeof opt === "string" ? opt : opt.value)
                : opt.id;
            const label = field.options === "mediaEntityTypes"
              ? opt
              : isStatic
                ? (typeof opt === "string" ? opt : opt.label || opt.value)
                : (opt.name || opt.title || opt.hero_base_name || "");
            const selected = String(val) === String(currentValue) ? "selected" : "";
            return `<option value="${escapeHtml(val)}" ${selected}>${escapeHtml(label)}</option>`;
          }).join("")}
        </select>
      </label>
    `;
  }

  if (field.type === "textarea") {
    const value = field.name === "loot_lines" ? getLootTextForCreature(item) : (item[field.name] ?? "");
    return `
      <label class="wide">
        <span>${escapeHtml(field.label)}</span>
        <textarea name="${field.name}" rows="${field.rows || 4}" placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(value)}</textarea>
      </label>
    `;
  }

  if (field.type === "image") {
    const preview = item.image_path ? imageUrlForEntity(item) : "";
    return `
      <label class="wide">
        <span>${escapeHtml(field.label)}</span>
        <input name="image_file" type="file" accept="image/*">
        <input name="image_path" value="${escapeHtml(item.image_path || "")}" placeholder="assets/images/...">
        ${preview ? `<div class="field-preview"><img src="${escapeHtml(preview)}" alt=""></div>` : `<small class="muted">Chemin relatif enregistré dans le JSON. Le fichier est stocké localement dans IndexedDB.</small>`}
      </label>
    `;
  }

  const type = field.type === "number" ? "number" : "text";
  const value = item[field.name] ?? "";
  const attrs = [
    `name="${field.name}"`,
    `type="${type}"`,
    field.min != null ? `min="${field.min}"` : "",
    field.max != null ? `max="${field.max}"` : "",
    field.step != null ? `step="${field.step}"` : "",
    field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : ""
  ].filter(Boolean).join(" ");
  return `
    <label>
      <span>${escapeHtml(field.label)}</span>
      <input ${attrs} value="${escapeHtml(value)}">
    </label>
  `;
}

function renderMedia() {
  const filterType = state.ui.media.filterType || "gallery";
  const assets = filterType === "gallery"
    ? state.data.media_assets || []
    : (state.data.media_assets || []).filter(a => a.entity_type === filterType);

  return renderShell(`
    <section class="panel">
      <div class="panel-title">
        <h2>Médias</h2>
        <div class="muted">Images locales, miniatures, stockage en IndexedDB. Les images ne passent pas par XLSX.</div>
      </div>

      <div class="media-toolbar">
        <label>
          <span>Type</span>
          <select data-action="media-filter-type">
            <option value="gallery" ${filterType === "gallery" ? "selected" : ""}>Galerie</option>
            <option value="dungeons" ${filterType === "dungeons" ? "selected" : ""}>Donjons</option>
            <option value="creatures" ${filterType === "creatures" ? "selected" : ""}>Créatures</option>
            <option value="heroes" ${filterType === "heroes" ? "selected" : ""}>Héros</option>
            <option value="npcs" ${filterType === "npcs" ? "selected" : ""}>PNJ</option>
            <option value="quests" ${filterType === "quests" ? "selected" : ""}>Quêtes</option>
            <option value="loot_items" ${filterType === "loot_items" ? "selected" : ""}>Loot</option>
          </select>
        </label>
        ${filterType === "gallery" ? `<div class="muted">Aucune entité liée pour la galerie générale.</div>` : `<label>
          <span>Entité liée</span>
          <select data-action="media-filter-entity">
            <option value="">—</option>
            ${(state.data[filterType] || []).map(it => `<option value="${escapeHtml(it.id)}" ${state.ui.media.filterEntity === it.id ? "selected" : ""}>${escapeHtml(it.name || it.title || it.hero_base_name || it.label || "")}</option>`).join("")}
          </select>
        </label>`}
        <input type="file" accept="image/*" multiple data-action="media-upload">
        <button class="ghost" data-action="media-refresh">Rafraîchir</button>
      </div>

      <div class="gallery">
        ${assets.map(asset => renderMediaAssetCard(asset, false)).join("") || `<div class="empty">Aucune image.</div>`}
      </div>
    </section>
  `);
}

function renderImportExport() {
  return renderShell(`
    <section class="panel">
      <div class="panel-title">
        <h2>Import / Export</h2>
        <div class="muted">CSV et XLSX uniquement, basés sur tes templates. Si doublon, la ligne est remplacée.</div>
      </div>

      <div class="import-grid">
        <label>
          <span>Type</span>
          <select data-action="import-type">
            ${IMPORT_TYPES.map(t => `<option value="${t}" ${t === state.ui.import.type ? "selected" : ""}>${getLabel(t)}</option>`).join("")}
          </select>
        </label>
        <label class="wide">
          <span>Fichier</span>
          <input type="file" accept=".xlsx,.csv" data-action="import-file">
        </label>
      </div>

      <div class="panel-title compact">
        <h3>Export</h3>
      </div>
      <div class="export-buttons">
        ${ENTITY_ORDER.map(t => `<button class="secondary" data-action="export-entity" data-type="${t}">Exporter ${getLabel(t)}</button>`).join("")}
        <button class="primary" data-action="export-all">Exporter tout</button>
        <button class="primary" data-action="export-backup">Exporter backup complet (JSON + images)</button>
      </div>

      <div class="panel-title compact">
        <h3>Import backup complet</h3>
      </div>
      <div class="import-grid">
        <label class="wide">
          <span>Fichier backup JSON</span>
          <input type="file" accept=".json" data-action="import-backup-file">
        </label>
      </div>

      <div class="panel">
        <div class="panel-title compact">
          <h3>Prévisualisation</h3>
        </div>
        ${state.ui.import.preview ? renderImportPreview(state.ui.import.preview) : `<div class="empty">Charge un fichier pour voir un aperçu.</div>`}
      </div>
    </section>
  `);
}

function renderImportPreview(preview) {
  return `
    <div class="preview-box">
      <div class="preview-summary">
        <div><strong>${escapeHtml(preview.fileName || "")}</strong></div>
        <div>${preview.rows.length} ligne(s) · ${preview.conflicts.length} conflit(s)</div>
      </div>
      <div class="preview-table">
        ${preview.rows.slice(0, 20).map(r => `<div class="preview-row ${r.status}"><span>${escapeHtml(r.label)}</span><small>${escapeHtml(r.status)}</small></div>`).join("")}
      </div>
      <div class="form-actions">
        <button class="primary" data-action="import-apply">Importer</button>
        <button class="secondary" data-action="import-clear">Effacer</button>
      </div>
    </div>
  `;
}

function renderJournalDrawer() {
  return `
    <div class="drawer-overlay">
      <div class="drawer journal">
        <div class="panel-title">
          <h2>Journal d'erreurs</h2>
          <button class="ghost" data-action="toggle-journal">✕</button>
        </div>
        <div class="history-list">
          ${state.logs.length ? state.logs.map(log => `<div class="history-row ${escapeHtml(log.level)}"><strong>${escapeHtml(log.level)}</strong><span>${escapeHtml(log.message)}</span><small>${escapeHtml(log.created_at)}</small></div>`).join("") : `<div class="empty">Aucun journal.</div>`}
        </div>
      </div>
    </div>
  `;
}

function renderPage() {
  switch (state.ui.view) {
    case "home": return renderHome();
    case "codex": return renderCodex();
    case "generator": return renderGenerator();
    case "brouhaha": return renderBrouhaha();
    case "quests": return renderQuests();
    case "atelier": return renderAtelier();
    case "media": return renderMedia();
    case "import": return renderImportExport();
    default: return renderHome();
  }
}

function render() {
  app.innerHTML = renderPage();
}

function toast(message, tone = "info") {
  const id = uid("toast");
  state.toasts.unshift({ id, message, tone });
  state.toasts = state.toasts.slice(0, 5);
  render();
  setTimeout(() => {
    state.toasts = state.toasts.filter(t => t.id !== id);
    render();
  }, 3200);
}

function normalizeConflictPreview(type, rows) {
  const existing = state.data[type] || [];
  const results = rows.map(row => {
    const key = entityConflictKey(type, row);
    const conflict = existing.find(item => buildConflictKeyFromEntity(type, item) === key);
    return {
      label: row.name || row.title || row.hero_base_name || row.label || row.file_name || row.id || "",
      status: conflict ? "conflit" : "nouveau",
      row,
      conflictId: conflict?.id || ""
    };
  });
  return {
    fileName: state.ui.import.fileName || "",
    type,
    rows: results,
    conflicts: results.filter(r => r.status === "conflit")
  };
}

async function applyImportPreview() {
  const preview = state.ui.import.preview;
  if (!preview) return;
  const type = preview.type;
  const rows = preview.rows.map(r => r.row);
  const existing = (state.data[type] || []).slice();
  const importedIds = new Set();

  for (const row of rows) {
    const key = entityConflictKey(type, row);
    const idx = existing.findIndex(item => buildConflictKeyFromEntity(type, item) === key);
    const oldEntity = idx >= 0 ? existing[idx] : null;
    const entity = importRowToEntity(type, row, oldEntity);
    importedIds.add(entity.id);
    if (idx >= 0) existing[idx] = entity;
    else existing.push(entity);
  }

  await putMany(type, existing);

  if (type === "creatures") {
    const affectedCreatureIds = new Set(
      existing
        .filter(c => rows.some(r => buildConflictKeyFromEntity("creatures", c) === entityConflictKey("creatures", r)))
        .map(c => c.id)
    );

    await deleteWhere("loot_items", l => affectedCreatureIds.has(l.creature_id));

    const replacementLoot = [];
    for (const row of rows) {
      const key = entityConflictKey("creatures", row);
      const creature = existing.find(c => buildConflictKeyFromEntity("creatures", c) === key);
      if (!creature) continue;

      const lootLines = String(row.loot || row.loot_lines || "").trim();
      const parsed = parseLootLines(lootLines, creature.id, creature.name || "");
      creature.loot_items = parsed;

      replacementLoot.push(...parsed.map(l => ({
        ...l,
        creature_id: creature.id,
        creature_name: creature.name || l.creature_name || ""
      })));
    }

    if (replacementLoot.length) {
      await putMany("loot_items", replacementLoot);
    }
  }

  state.ui.import.preview = null;
  await refreshData();
  toast(`📥 Import terminé (${getLabel(type)})`, "success");
}

async function refreshData() {
  const raw = await loadAllData();
  hydrateState(raw);
  state.logs = await getLogs(100);
  await saveUiState(state.ui);
  render();
}

function newEntity(type) {
  const item = blankEntity(type);
  if (type === "creatures") {
    item.dungeon_id = state.data.dungeons?.[0]?.id || "";
    item.dungeon_name = state.data.dungeons?.[0]?.name || "";
    item.dungeon_slug = state.data.dungeons?.[0]?.slug || "";
  }
  if (type === "quests") {
    item.dungeon_id = state.data.dungeons?.[0]?.id || "";
    item.dungeon_name = state.data.dungeons?.[0]?.name || "";
  }
  if (type === "loot_items") {
    item.creature_id = state.data.creatures?.[0]?.id || "";
    item.creature_name = state.data.creatures?.[0]?.name || "";
  }
  return item;
}

async function makeThumbnail(file, maxSize = 512, quality = 0.8) {
  const blobData = await fileToOptimizedBlob(file, maxSize, quality);
  return blobData;
}

async function fileToOptimizedBlob(file, maxSize = 1600, quality = 0.84) {
  const fileUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(fileUrl);
    const width = img.naturalWidth || img.width;
    const height = img.naturalHeight || img.height;
    const size = fitSize(width, height, maxSize);
    const canvas = document.createElement("canvas");
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, size.width, size.height);
    const blob = await canvasToBlob(canvas, "image/webp", quality) || await canvasToBlob(canvas, file.type || "image/png", quality);
    return { blob: blob || file, width: size.width, height: size.height };
  } finally {
    try { URL.revokeObjectURL(fileUrl); } catch (_) {}
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise(resolve => {
    canvas.toBlob(blob => resolve(blob), type, quality);
  });
}

function resolveTargetEntityFromMediaForm() {
  const type = state.ui.media.filterType || "gallery";
  const id = state.ui.media.filterEntity || "";
  return { type, id };
}

async function storeMediaFile(file, entityType = "gallery", entityId = "") {
  const safe = safeFilename(file.name);
  const unique = `${safe}_${uid("img").split("_").pop()}`;
  const main = await fileToOptimizedBlob(file, 1600, 0.84);
  const thumb = await fileToOptimizedBlob(file, 512, 0.78);
  const path = `assets/images/${entityType}/${unique}.webp`;
  const thumbPath = `assets/images/${entityType}/thumbs/${unique}.webp`;

  const media = {
    id: uid("media"),
    label: file.name,
    file_name: file.name,
    path,
    thumb_path: thumbPath,
    mime_type: "image/webp",
    entity_type: entityType,
    entity_id: entityId || "",
    blob: main.blob,
    thumb_blob: thumb.blob,
    width: main.width,
    height: main.height,
    created_at: nowISO(),
    updated_at: nowISO()
  };
  await putOne("media_assets", media);
  return media;
}

async function saveMediaForEntity(type, entity, file) {
  if (!file) return entity;
  const media = await storeMediaFile(file, type, entity.id);
  entity.image_path = media.path;
  return entity;
}

async function saveEntityFromForm(type, form) {
  const existing = findById(type, form.dataset.id) || blankEntity(type);
  const values = Object.fromEntries(new FormData(form).entries());
  let entity = structuredClone(existing);

  entity = importRowToEntity(type, values, entity);

  if (type === "creatures") {
    entity.dungeon_name = findById("dungeons", entity.dungeon_id)?.name || entity.dungeon_name || "";
    entity.dungeon_slug = findById("dungeons", entity.dungeon_id)?.slug || entity.dungeon_slug || "";
  }
  if (type === "quests") {
    entity.dungeon_name = findById("dungeons", entity.dungeon_id)?.name || entity.dungeon_name || "";
    entity.npc_name = findById("npcs", entity.npc_id)?.name || entity.npc_name || "";
  }
  if (type === "loot_items") {
    entity.creature_name = findById("creatures", entity.creature_id)?.name || entity.creature_name || "";
  }
  if (type === "brouhaha_effects") {
    entity.dungeon_name = findById("dungeons", entity.dungeon_id)?.name || "";
  }

  const fileInput = form.querySelector('input[name="image_file"]');
  const file = fileInput?.files?.[0];
  if (file) {
    entity = await saveMediaForEntity(type, entity, file);
  }

  entity.updated_at = nowISO();
  if (!entity.created_at) entity.created_at = nowISO();

  if (type === "creatures") {
    const lootLines = String(values.loot_lines || "").trim();
    const parsedLoot = parseLootLines(lootLines, entity.id, entity.name || "");
    entity.loot_items = parsedLoot;

    // Sauver la créature d'abord
    await putOne("creatures", entity);

    // Supprimer uniquement le loot de cette créature
    await deleteWhere("loot_items", l => l.creature_id === entity.id);

    // Réinsérer le loot propre
    if (parsedLoot.length) {
      await putMany("loot_items", parsedLoot.map(l => ({
        ...l,
        creature_id: entity.id,
        creature_name: entity.name || l.creature_name || ""
      })));
    }
  } else if (type === "media_assets") {
    await putOne(type, entity);
  } else {
    await putOne(type, entity);
  }

  await refreshData();
  if (type === "dungeons") state.ui.generator.dungeonId = entity.id;
  if (type === "dungeons") state.ui.brouhaha.dungeonId = entity.id;
  if (type === "quests") state.ui.questDungeonId = entity.dungeon_id || state.ui.questDungeonId;
  if (type === "creatures") state.ui.codexSelectedId = entity.id;
  state.ui.workshopSelectedId = entity.id;
  await saveUiState(state.ui);
  toast("💾 Fiche enregistrée", "success");
}

async function deleteEntityWithConfirm(type, id) {
  const label = getLabel(type);
  if (!confirm(`Supprimer cette fiche ${label} ?`)) return;

  if (type === "creatures") {
    await deleteWhere("loot_items", l => l.creature_id === id);
  }
  if (type === "dungeons") {
    const creatureIds = (state.data.creatures || [])
      .filter(c => c.dungeon_id === id)
      .map(c => c.id);

    await deleteWhere("loot_items", l => creatureIds.includes(l.creature_id));
    await deleteWhere("creatures", c => c.dungeon_id === id);
    await deleteWhere("quests", q => q.dungeon_id === id);
    await deleteWhere("brouhaha_effects", b => b.dungeon_id === id);
  }

  await deleteOne(type, id);
  await refreshData();

  if (state.ui.codexSelectedId === id) state.ui.codexSelectedId = state.data[type]?.[0]?.id || "";
  if (state.ui.workshopSelectedId === id) state.ui.workshopSelectedId = state.data[type]?.[0]?.id || "";
  await saveUiState(state.ui);
  toast("🗑️ Fiche supprimée", "info");
}

function generateEncounter(dungeonId, floorIndex, bossChecked, miniBossChecked) {
  const dungeon = findById("dungeons", dungeonId);
  if (!dungeon) return { error: "Aucun donjon sélectionné." };

  const budget = Number(dungeon.floor_budgets?.[floorIndex] ?? dungeon.floor_budgets?.[0] ?? 3);
  const pool = (state.data.creatures || []).filter(c => c.dungeon_id === dungeon.id);
  const normalPool = pool.filter(c => c.category !== "boss" && c.category !== "mini_boss");
  const bossPool = pool.filter(c => c.category === "boss");
  const miniPool = pool.filter(c => c.category === "mini_boss");

  const selected = [];
  let remaining = budget;

  if (bossChecked || miniBossChecked) {
    const categoryPool = bossChecked ? bossPool : miniPool;
    if (!categoryPool.length) return { error: bossChecked ? "Aucun boss disponible pour ce donjon." : "Aucun mini-boss disponible pour ce donjon." };
    const fits = categoryPool.filter(c => c.menace <= remaining);
    if (!fits.length) return { error: "Le boss sélectionné ne rentre pas dans le budget de l'étage." };
    const pick = shuffle(fits)[0];
    selected.push(pick);
    remaining -= pick.menace;
  }

  const combo = exactBudgetCombo(normalPool, remaining);
  if (!combo) return { error: "Impossible de composer un groupe exact avec le budget disponible." };
  selected.push(...combo);

  return {
    dungeon_id: dungeon.id,
    dungeon_name: dungeon.name,
    floor: floorIndex,
    budget,
    used: selected.reduce((sum, c) => sum + Number(c.menace || 0), 0),
    creatures: selected,
    interactables: buildEncounterInteractables(dungeon.id, budget),
    local: { panelType: "", panelId: "", killedCreatures: {}, lastLoot: {}, lastEffect: {} },
    boss: !!bossChecked,
    miniBoss: !!miniBossChecked
  };
}

function rollCreatureLoot(creature) {
  const jokes = ["Rien… même pas une chaussette.", "Le monstre avait déjà tout vendu.", "Poches vides, ego intact."];
  const loots = (creature?.loot_items || []).filter(Boolean);
  const r = Math.random();
  if (!loots.length || r < 0.8) return { type: "none", text: jokes[Math.floor(Math.random() * jokes.length)] };
  if (loots.length === 1 || r < 0.9) return { type: "loot", text: `${loots[0].name || "Loot 1"}` };
  return { type: "loot", text: `${(loots[1] || loots[0]).name || "Loot 2"}` };
}

function rollInteractableEffect(obj, dungeonId) {
  const raw = String(obj?.effect || "").trim();
  if (!raw) return "";
  const rules = raw.split(/[\\/;\n|]/).map(x => x.trim()).filter(Boolean);
  const byType = {
    porte: ["ouvrir", "fermer"],
    tonneau: ["casser", "exploser"],
    statue: ["casser", "tomber sur case voisine"],
    pilier: ["casser", "éboulement"]
  };
  const typeKey = String(obj.type || "").trim().toLowerCase();
  const registry = byType[typeKey] || [];
  const dungeonBoost = dungeonId ? [`${dungeonId}: ${rules[0] || registry[0] || raw}`] : [];
  const pool = [...rules, ...registry, ...dungeonBoost].filter(Boolean);
  return pool[Math.floor(Math.random() * pool.length)] || raw;
}

function buildEncounterInteractables(dungeonId, budget) {
  const pool = (state.data.interactables || []).filter(i => i.dungeon_id === dungeonId);
  const target = clamp(Math.floor(Number(budget || 0) / 3), 1, 6);
  return shuffle(pool).slice(0, Math.min(pool.length, target));
}

function exactBudgetCombo(pool, remaining) {
  if (remaining === 0) return [];
  const memo = new Map();

  function dfs(rem) {
    if (rem === 0) return [];
    if (rem < 0) return null;
    if (memo.has(rem)) return memo.get(rem);
    const candidates = shuffle(pool.filter(c => Number(c.menace || 0) <= rem));
    for (const creature of candidates) {
      const tail = dfs(rem - Number(creature.menace || 0));
      if (tail) {
        const result = [creature, ...tail];
        memo.set(rem, result);
        return result;
      }
    }
    memo.set(rem, null);
    return null;
  }

  return dfs(remaining);
}

function drawBrouhaha(level, dungeonId) {
  const count = level >= 10 ? 2 : 1;
  const pool = (state.data.brouhaha_effects || []).filter(e => Number(e.level) === Number(level) && (!e.dungeon_id || e.dungeon_id === dungeonId));
  if (!pool.length) return [];

  const choices = shuffle(pool);
  return choices.slice(0, count).map(e => e.effect_text);
}

function shuffle(arr) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

async function handleMediaUpload(files) {
  const entityType = state.ui.media.filterType || "gallery";
  const entityId = state.ui.media.filterEntity || "";
  for (const file of files) {
    const media = await storeMediaFile(file, entityType, entityId);
    if (entityType !== "gallery" && entityId) {
      const list = state.data[entityType] || [];
      const entity = list.find(x => x.id === entityId);
      if (entity) {
        entity.image_path = media.path;
        await putOne(entityType, entity);
      }
    }
  }
  await refreshData();
  toast("🖼️ Image(s) ajoutée(s)", "success");
}

async function exportEntityFile(type) {
  const rows = toTemplateRows(type, state.data[type] || []);
  const headers = sheetHeaders(type);
  const blob = buildXlsxBlob(ENTITY_SHEETS[type] || getLabel(type), headers, rows);
  downloadBlob(blob, ENTITY_DOWNLOAD_FILES[type] || `${type}.xlsx`);
}

async function exportAllFile() {
  const sheets = ENTITY_ORDER.map(type => ({
    sheetName: ENTITY_SHEETS[type] || getLabel(type),
    headers: sheetHeaders(type),
    rows: toTemplateRows(type, state.data[type] || [])
  }));
  const blob = buildXlsxWorkbookBlob(sheets);
  downloadBlob(blob, `gargottex_export_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

async function blobToBase64(blob) {
  if (!blob) return "";
  const buffer = await blob.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBlob(base64, mime = "application/octet-stream") {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

async function exportFullBackupFile() {
  const snapshot = {};
  for (const type of ENTITY_ORDER) {
    if (type === "media_assets") continue;
    snapshot[type] = toTemplateRows(type, state.data[type] || []);
  }
  const mediaAssets = await Promise.all((state.data.media_assets || []).map(async (asset) => ({
    id: asset.id,
    label: asset.label || "",
    file_name: asset.file_name || "",
    path: asset.path || "",
    thumb_path: asset.thumb_path || "",
    mime_type: asset.mime_type || "image/webp",
    entity_type: asset.entity_type || "gallery",
    entity_id: asset.entity_id || "",
    width: Number(asset.width || 0),
    height: Number(asset.height || 0),
    created_at: asset.created_at || "",
    updated_at: asset.updated_at || "",
    blob_base64: await blobToBase64(asset.blob),
    thumb_blob_base64: await blobToBase64(asset.thumb_blob)
  })));

  const payload = {
    format: "gargottex-backup",
    version: 1,
    exported_at: nowISO(),
    app_version: APP_VERSION,
    counts: Object.fromEntries(ENTITY_ORDER.map(type => [type, (state.data[type] || []).length])),
    data: snapshot,
    media_assets: mediaAssets
  };
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  downloadBlob(blob, `gargottex_backup_${new Date().toISOString().slice(0, 10)}.json`);
}

async function importFullBackupFile(file) {
  const raw = await file.text();
  const payload = JSON.parse(raw);
  if (payload?.format !== "gargottex-backup") throw new Error("Format backup invalide.");

  for (const type of ENTITY_ORDER) {
    if (type === "media_assets") continue;
    const rows = Array.isArray(payload?.data?.[type]) ? payload.data[type] : [];
    const current = state.data[type] || [];
    const existingMap = new Map(current.map(item => [buildConflictKeyFromEntity(type, item), item]));
    const entities = rows.map(row => {
      const key = entityConflictKey(type, row || {});
      const existing = existingMap.get(key);
      return importRowToEntity(type, row || {}, existing);
    });
    await clearStore(type);
    if (entities.length) await putMany(type, entities);
  }

  await clearStore("media_assets");
  const medias = Array.isArray(payload.media_assets) ? payload.media_assets : [];
  if (medias.length) {
    await putMany("media_assets", medias.map(m => ({
      id: m.id || uid("media"),
      label: m.label || m.file_name || "",
      file_name: m.file_name || "",
      path: m.path || "",
      thumb_path: m.thumb_path || "",
      mime_type: m.mime_type || "image/webp",
      entity_type: m.entity_type || "gallery",
      entity_id: m.entity_id || "",
      width: Number(m.width || 0),
      height: Number(m.height || 0),
      created_at: m.created_at || nowISO(),
      updated_at: nowISO(),
      blob: m.blob_base64 ? base64ToBlob(m.blob_base64, m.mime_type || "image/webp") : null,
      thumb_blob: m.thumb_blob_base64 ? base64ToBlob(m.thumb_blob_base64, m.mime_type || "image/webp") : null,
      image_path: m.path || ""
    })));
  }
  await refreshData();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}

async function parseImportFile(file, type) {
  const ext = file.name.split(".").pop().toLowerCase();
  let rows = [];
  if (ext === "xlsx") {
    const parsed = await readXlsxFile(file);
    const wanted = ENTITY_SHEETS[type] || getLabel(type);
    const sheet = (parsed.sheets || []).find(s => String(s.sheetName || "").trim().toLowerCase() === String(wanted).trim().toLowerCase()) || parsed;
    rows = (sheet.rows || []).map(row => normalizeTemplateRow(type, row));
  } else if (ext === "csv") {
    rows = parseCsv(await file.text()).map(normalizeTemplateRow.bind(null, type));
  } else {
    throw new Error("Format non supporté.");
  }
  const preview = normalizeConflictPreview(type, rows);
  preview.rows = preview.rows.map(r => ({ ...r, label: r.label || displayImportLabel(type, r.row) }));
  return preview;
}

function displayImportLabel(type, row) {
  return row.name || row.title || row.hero_base_name || row.label || row.file_name || row.id || "";
}

function copyWithDefaults(type, row, existing) {
  return importRowToEntity(type, row, existing);
}

function renderMediaListForType(type) {
  if (type === "gallery") return state.data.media_assets || [];
  return (state.data.media_assets || []).filter(a => a.entity_type === type);
}

async function setView(view) {
  state.ui.view = view;
  if (view === "atelier") {
    state.ui.workshopType = state.ui.workshopType || "creatures";
  }
  await saveUiState(state.ui);
  render();
}

function setToastAndRender(message, tone = "info") {
  toast(message, tone);
}

function bindEvents() {
  app.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    try {
      switch (action) {
        case "go-home":
        case "set-view":
          state.ui.view = btn.dataset.view || "home";
          await saveUiState(state.ui);
          render();
          return;
        case "toggle-journal":
          state.ui.journalOpen = !state.ui.journalOpen;
          await saveUiState(state.ui);
          render();
          return;
        case "open-image":
          openImageViewer(btn.dataset.src, btn.dataset.alt || "");
          return;
        case "close-image-viewer":
          if (btn.classList.contains("image-viewer-close") || ev.target === btn) {
            closeImageViewer();
          }
          return;
        case "set-codex-type":
          state.ui.codexType = btn.dataset.type;
          state.ui.codexSelectedId = (state.data[state.ui.codexType] || [])[0]?.id || "";
          await saveUiState(state.ui);
          render();
          return;
        case "select-codex":
          state.ui.codexType = btn.dataset.type;
          state.ui.codexSelectedId = btn.dataset.id;
          await saveUiState(state.ui);
          render();
          return;
        case "jump-codex":
          state.ui.view = "codex";
          state.ui.codexType = btn.dataset.type;
          state.ui.codexSelectedId = btn.dataset.id;
          await saveUiState(state.ui);
          render();
          return;
        case "set-workshop-type":
          state.ui.workshopType = btn.dataset.type;
          state.ui.workshopSelectedId = (state.data[state.ui.workshopType] || [])[0]?.id || "";
          await saveUiState(state.ui);
          render();
          return;
        case "select-workshop":
          state.ui.workshopType = btn.dataset.type;
          state.ui.workshopSelectedId = btn.dataset.id;
          await saveUiState(state.ui);
          render();
          return;
        case "new-item": {
          const type = btn.dataset.type;
          const item = newEntity(type);
          await putOne(type, item);
          await refreshData();
          state.ui.workshopType = type;
          state.ui.workshopSelectedId = item.id;
          await saveUiState(state.ui);
          toast(`＋ Nouvelle fiche ${getLabel(type)}`, "success");
          return;
        }
        case "delete-item":
          await deleteEntityWithConfirm(btn.dataset.type, btn.dataset.id);
          return;
        case "generate-encounter": {
          const result = generateEncounter(state.ui.generator.dungeonId, state.ui.generator.floorIndex, state.ui.generator.boss, state.ui.generator.miniBoss);
          state.ui.generator.result = result;
          if (!result.error) {
            const line = `${result.dungeon_name} étage ${Number(result.floor) + 1} : ${result.creatures.map(c => c.name).join(", ")}`;
            state.ui.import.preview = state.ui.import.preview ? { ...state.ui.import.preview, lastGenerator: line } : state.ui.import.preview;
          }
          await saveUiState(state.ui);
          render();
          if (result.error) toast(result.error, "error");
          else toast("🎲 Salle générée", "success");
          return;
        }
        case "encounter-open-creature":
          if (state.ui.generator.result && !state.ui.generator.result.error) {
            state.ui.generator.result.local.panelType = "creature";
            state.ui.generator.result.local.panelId = btn.dataset.id;
            await saveUiState(state.ui);
            render();
          }
          return;
        case "encounter-open-object":
          if (state.ui.generator.result && !state.ui.generator.result.error) {
            state.ui.generator.result.local.panelType = "object";
            state.ui.generator.result.local.panelId = btn.dataset.id;
            await saveUiState(state.ui);
            render();
          }
          return;
        case "encounter-kill-creature":
          if (state.ui.generator.result && !state.ui.generator.result.error) {
            const id = btn.dataset.id;
            const creature = (state.ui.generator.result.creatures || []).find(c => c.id === id);
            if (creature) {
              state.ui.generator.result.local.killedCreatures[id] = true;
              state.ui.generator.result.local.lastLoot[id] = rollCreatureLoot(creature);
            }
            await saveUiState(state.ui);
            render();
          }
          return;
        case "encounter-roll-effect":
          if (state.ui.generator.result && !state.ui.generator.result.error) {
            const id = btn.dataset.id;
            const obj = (state.ui.generator.result.interactables || []).find(x => x.id === id);
            if (obj) {
              state.ui.generator.result.local.lastEffect[id] = rollInteractableEffect(obj, state.ui.generator.result.dungeon_id);
            }
            await saveUiState(state.ui);
            render();
          }
          return;
        case "brouhaha-plus":
          state.ui.brouhaha.level = clamp((state.ui.brouhaha.level || 0) + 1, 0, 12);
          await saveUiState(state.ui);
          render();
          return;
        case "brouhaha-minus":
          state.ui.brouhaha.level = clamp((state.ui.brouhaha.level || 0) - 1, 0, 12);
          await saveUiState(state.ui);
          render();
          return;
        case "brouhaha-draw": {
          const level = clamp(state.ui.brouhaha.level || 0, 0, 12);
          const drew = drawBrouhaha(level, state.ui.brouhaha.dungeonId);
          if (!drew.length) {
            toast("Aucun effet pour ce niveau.", "warn");
            return;
          }
          const text = drew.join(" / ");
          state.ui.brouhaha.drawn.unshift({ level, text, at: nowISO() });
          state.ui.brouhaha.history.unshift({ level, text, at: nowISO() });
          state.ui.brouhaha.history = state.ui.brouhaha.history.slice(0, 20);
          await saveUiState(state.ui);
          toast("🔥 Brouhaha tiré", "success");
          render();
          return;
        }
        case "quests-draw": {
          const dungeon = findById("dungeons", state.ui.questDungeonId) || state.data.dungeons?.[0] || null;
          const quests = (state.data.quests || []).filter(q => q.dungeon_id === dungeon?.id);
          if (!quests.length) {
            toast("Aucune quête pour ce donjon.", "warn");
            return;
          }
          const pick = shuffle(quests)[0];
          state.ui.questsResult = pick;
          await saveUiState(state.ui);
          toast(`📜 ${pick.name}`, "success");
          render();
          return;
        }
        case "media-refresh":
          await refreshData();
          return;
        case "export-entity":
          await exportEntityFile(btn.dataset.type);
          return;
        case "export-all":
          await exportAllFile();
          return;
        case "export-backup":
          await exportFullBackupFile();
          toast("🧳 Backup complet exporté", "success");
          return;
        case "import-clear":
          state.ui.import.preview = null;
          await saveUiState(state.ui);
          render();
          return;
        case "import-apply":
          await applyImportPreview();
          return;
        default:
          return;
      }
    } catch (err) {
      await reportError(err, `click:${action}`);
    }
  });

  app.addEventListener("change", async (ev) => {
    const el = ev.target;
    if (!(el instanceof HTMLElement)) return;
    const action = el.dataset.action;
    try {
      switch (action) {
        case "generator-set-dungeon":
          state.ui.generator.dungeonId = el.value;
          state.ui.generator.result = null;
          await saveUiState(state.ui);
          render();
          return;
        case "codex-creature-dungeon-filter":
          state.ui.codexCreatureDungeonId = el.value;
          state.ui.codexSelectedId = "";
          await saveUiState(state.ui);
          render();
          return;
        case "codex-hero-level-filter":
          state.ui.codexHeroLevel = el.value;
          state.ui.codexSelectedId = "";
          await saveUiState(state.ui);
          render();
          return;
        case "atelier-creature-dungeon-filter":
          state.ui.workshopCreatureDungeonId = el.value;
          state.ui.workshopSelectedId = "";
          await saveUiState(state.ui);
          render();
          return;
        case "generator-set-floor":
          state.ui.generator.floorIndex = clamp(Number(el.value), 0, 99);
          state.ui.generator.result = null;
          await saveUiState(state.ui);
          render();
          return;
        case "generator-set-boss":
          state.ui.generator.boss = el.checked;
          if (el.checked) state.ui.generator.miniBoss = false;
          await saveUiState(state.ui);
          render();
          return;
        case "generator-set-miniboss":
          state.ui.generator.miniBoss = el.checked;
          if (el.checked) state.ui.generator.boss = false;
          await saveUiState(state.ui);
          render();
          return;
        case "brouhaha-set-dungeon":
          state.ui.brouhaha.dungeonId = el.value;
          await saveUiState(state.ui);
          render();
          return;
        case "quests-set-dungeon":
          state.ui.questDungeonId = el.value;
          state.ui.questsResult = null;
          await saveUiState(state.ui);
          render();
          return;
        case "search":
          state.ui.globalSearch = el.value;
          await saveUiState(state.ui);
          render();
          return;
        case "import-type":
          state.ui.import.type = el.value;
          await saveUiState(state.ui);
          render();
          return;
        case "media-filter-type":
          state.ui.media.filterType = el.value;
          state.ui.media.filterEntity = "";
          await saveUiState(state.ui);
          render();
          return;
        case "media-filter-entity":
          state.ui.media.filterEntity = el.value;
          await saveUiState(state.ui);
          render();
          return;
        case "media-upload": {
          const files = Array.from(el.files || []);
          if (!files.length) return;
          await handleMediaUpload(files);
          el.value = "";
          return;
        }
        case "import-file": {
          const file = el.files?.[0];
          if (!file) return;
          const type = state.ui.import.type || "creatures";
          state.ui.import.fileName = file.name;
          state.ui.import.preview = await parseImportFile(file, type);
          await saveUiState(state.ui);
          render();
          toast("📥 Fichier analysé", "success");
          return;
        }
        case "import-backup-file": {
          const file = el.files?.[0];
          if (!file) return;
          await importFullBackupFile(file);
          await saveUiState(state.ui);
          render();
          toast("♻️ Backup complet importé", "success");
          el.value = "";
          return;
        }
      }
    } catch (err) {
      await reportError(err, `change:${action}`);
    }
  });

  app.addEventListener("input", async (ev) => {
    const el = ev.target;
    if (!(el instanceof HTMLElement)) return;
    if (el.dataset.action === "search") {
      state.ui.globalSearch = el.value;
      await saveUiState(state.ui);
      render();
      return;
    }
  });

  app.addEventListener("submit", async (ev) => {
    const form = ev.target;
    if (!(form instanceof HTMLFormElement)) return;
    ev.preventDefault();
    const type = form.dataset.form;
    if (!type) return;
    try {
      await saveEntityFromForm(type, form);
    } catch (err) {
      await reportError(err, `submit:${type}`);
    }
  });
}

async function saveEntityFromFormWrapper(type, form) {
  return saveEntityFromForm(type, form);
}

async function reportError(err, context = "") {
  console.error(err);
  const message = err?.message || String(err);
  const details = `${context}${context ? " • " : ""}${err?.stack || ""}`.trim();
  const log = await appendLog({
    level: "error",
    message,
    details,
    created_at: nowISO()
  });
  state.logs = [log, ...state.logs].slice(0, 100);
  toast(`⚠️ ${message}`, "error");
  await saveUiState(state.ui);
  render();
}

function wireGlobalErrors() {
  window.addEventListener("error", ev => {
    reportError(ev.error || new Error(ev.message || "Erreur inconnue"), "window.error");
  });
  window.addEventListener("unhandledrejection", ev => {
    reportError(ev.reason instanceof Error ? ev.reason : new Error(String(ev.reason || "Rejet de promesse non géré")), "unhandledrejection");
  });
}

async function bootstrap() {
  await initDatabase(globalThis.GARGOTTEX_SEED || {});
  const data = await loadAllData();
  hydrateState(data);

  const savedUi = await loadUiState();
  if (savedUi) {
    state.ui = {
      ...defaultBlankUi(),
      ...savedUi,
      generator: { ...defaultBlankUi().generator, ...(savedUi.generator || {}) },
      brouhaha: { ...defaultBlankUi().brouhaha, ...(savedUi.brouhaha || {}) },
      import: { ...defaultBlankUi().import, ...(savedUi.import || {}) },
      media: { ...defaultBlankUi().media, ...(savedUi.media || {}) }
    };
  } else {
    state.ui = defaultBlankUi();
    ensureUiDefaults();
  }
  ensureUiDefaults();
  ensureSelectionExists();
  await saveUiState(state.ui);

  state.logs = await getLogs(100);
  state.ready = true;
  wireGlobalErrors();
  bindEvents();
  render();

if ("serviceWorker" in navigator) {

  const reg = await navigator.serviceWorker.register("./service-worker.js");

  // force Safari à vérifier les updates
  setInterval(() => {
    reg.update().catch(() => {});
  }, 15000);

  // nouveau service worker détecté
  if (reg.waiting) {
    reg.waiting.postMessage({ type: "SKIP_WAITING" });
  }

  // quand le nouveau SW prend le contrôle
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });

}

  if (navigator.storage?.persist) {
    navigator.storage.persist().catch(() => {});
  }
}

if (typeof document !== "undefined" && app) {
  bootstrap();
}
