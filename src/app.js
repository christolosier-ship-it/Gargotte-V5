
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
import { makeZip, readZip, toBytes, fromBytes } from "./utils/zip.js";

import {
  initDatabase,
  loadAllData,
  loadUiState,
  saveUiState,
  getById,
  putOne,
  putMany,
  deleteOne,
  deleteWhere,
  clearStore,
  appendLog,
  getLogs,
  transaction,
  DB_NAME,
  DB_VERSION,
  STORE_DEFS
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
  interactables: "Objets interactifs",
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
  interactables: "Objets interactifs",
  brouhaha_effects: "Brouhaha",
  media_assets: "Médias"
};

const ENTITY_SHEET_ALIASES = {
  interactables: ["Objets"]
};

function entitySheetNames(type) {
  return [...new Set([
    ENTITY_SHEETS[type] || getLabel(type),
    ...(ENTITY_SHEET_ALIASES[type] || [])
  ].filter(Boolean))];
}

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
    { name: "difficulty", label: "Difficulté", type: "number", min: 1, max: 6, step: 1 },
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

const WORKSHOP_TYPES = ["creatures","dungeons","heroes","npcs","quests","loot_items","interactables","brouhaha_effects"];

const WORKSHOP_SECTIONS = {
  creatures: [
    { title: "Identité", fields: ["name","dungeon_id","category","socle","tags","image_path"] },
    { title: "Gameplay", fields: ["menace","pv","atk","def","zone","actions"] },
    { title: "Compétence", fields: ["special_attack_name","special_attack_noise"] },
    { title: "Comportement", fields: ["ai_behavior","ai_target_priority"] },
    { title: "Butin", fields: ["loot_lines"] },
    { title: "Lore", fields: ["lore"] }
  ],
  dungeons: [
    { title: "Identité", fields: ["name","tags","image_path"] },
    { title: "Description", fields: ["description"] },
    { title: "Progression", fields: ["floor_budgets","boss_name"] }
  ],
  heroes: [
    { title: "Identité", fields: ["hero_base_name","level","name","role","title","tags","image_path"] },
    { title: "Gameplay", fields: ["pv","atk","def","zone","actions"] },
    { title: "Compétence", fields: ["ability_text","effect_text","brouhaha"] }
  ],
  npcs: [
    { title: "Identité", fields: ["name","race","role","tags","image_path"] },
    { title: "Ton", fields: ["tone"] },
    { title: "Lore", fields: ["lore"] }
  ],
  quests: [
    { title: "Identité", fields: ["name","dungeon_id","npc_id","difficulty","tags","image_path"] },
    { title: "Description", fields: ["description"] },
    { title: "Objectif", fields: ["objective"] },
    { title: "Récompense", fields: ["reward"] }
  ],
  loot_items: [
    { title: "Identité", fields: ["name","creature_id","type","tags","image_path"] },
    { title: "Effet & valeur", fields: ["effect","gold_value"] }
  ],
  interactables: [
    { title: "Identité", fields: ["name","dungeon_id","type","tags","image_path"] },
    { title: "Usage à la table", fields: ["hp","actions_allowed","effect"] }
  ],
  brouhaha_effects: [
    { title: "Référence", fields: ["level","dungeon_id"] },
    { title: "Effet", fields: ["effect_text"] }
  ]
};

const WORKSHOP_REQUIRED_FIELDS = {
  dungeons: ["name"],
  creatures: ["name"],
  heroes: ["hero_base_name","level"],
  npcs: ["name"],
  quests: ["name"],
  loot_items: ["name"],
  interactables: ["name"],
  brouhaha_effects: ["level","effect_text"]
};

const IMPORT_TYPES = ENTITY_ORDER.filter(type => type !== "media_assets");
const APP_VERSION = "5.5.5";
const PWA_CACHE_NAME = "gargottex-v6-polish-cards-v1";
const PWA_OFFLINE_CORE = ["./index.html","./styles.css","./manifest.webmanifest","./seed-data.js","./src/app.js","./src/utils/common.js","./src/utils/zip.js","./src/utils/xlsx.js","./src/storage/idb.js"];

const HOME_TAGLINE = "Ici, même les habitués ne savent plus pourquoi ils sont venus.";
const BERTHOLD_ADVICES = [
  "« Un aventurier sobre, c’est souvent un aventurier qui n’a plus d’argent. »",
  "« Quand une porte de donjon est déjà ouverte, demande-toi surtout qui l’a ouverte. »",
  "« On reconnaît un bon plan au moment précis où quelqu’un propose de l’expliquer avec une carte. »",
  "« Ne commande jamais “la même chose que lui” avant d’avoir vérifié combien de bras il possède. »",
  "« Le courage, c’est entrer dans le donjon. La sagesse, c’est garder quelqu’un dehors avec les chevaux. »",
  "« Si le magicien dit “normalement”, éloigne-toi. »",
  "« Tout coffre contient un trésor. Parfois, le trésor est une leçon sur les pièges. »",
  "« Une épée enchantée reste une épée. Évite donc de la lécher. »",
  "« Dans la vie, il faut savoir choisir ses batailles. Et surtout choisir celles où les autres se battent. »",
  "« Qui boit seul paie seul. C’est contre nature. »",
  "« Un dragon endormi vaut mieux que deux dragons réveillés. Je sais que ça paraît évident, mais vous seriez surpris. »",
  "« Il n’existe pas de petite dette. Il existe seulement des créanciers mal informés. »",
  "« Si quelque chose brille dans une grotte, ce n’est pas forcément de l’or. Et si ça cligne des yeux, cours. »",
  "« La diplomatie consiste à offrir une bière à quelqu’un avant de lui expliquer pourquoi sa maison brûle. »",
  "« Celui qui dit “j’ai une idée” devrait automatiquement payer la prochaine tournée. »",
  "« Le destin frappe toujours deux fois. La deuxième, c’est généralement parce que t’as demandé qui était là. »",
  "« Un bon aventurier prépare son équipement. Un grand aventurier prépare son excuse. »",
  "« Quand le tavernier essuie deux fois le même verre, c’est qu’il écoute votre conversation. »",
  "« Les gobelins ont mauvaise réputation. Pourtant, j’ai connu des humains bien pires. Ils étaient percepteurs. »",
  "« L’or ne fait pas le bonheur. Mais il règle l’addition, ce qui évite beaucoup de malheur. »",
  "« Le problème avec les prophéties, c’est qu’elles manquent toujours d’un paragraphe sur les frais annexes. »",
  "« Une quête gratuite coûte toujours quelque chose. »",
  "« Si un vieux sage vit seul au sommet d’une montagne, c’est peut-être simplement parce que personne ne le supporte. »",
  "« Ne fais jamais confiance à un escalier de donjon impeccable. Personne ne nettoie un escalier de donjon. »",
  "« Quand quelqu’un murmure “ça pourrait marcher”, regarde immédiatement où se trouve la sortie. »",
  "« Une bonne bière doit avoir trois qualités : être fraîche, être pleine et être à quelqu’un d’autre. »",
  "« On peut tout résoudre avec une hache. C’est rarement la meilleure solution, mais techniquement, on peut. »",
  "« Si ton plan nécessite quatre héros, trois chevaux et une chèvre, commence par surveiller la chèvre. »",
  "« Dans toute compagnie d’aventuriers, il y en a toujours un qui touche l’objet maudit. Si tu ne sais pas qui c’est, c’est probablement toi. »",
  "« N’insulte jamais un nain sur sa taille. Insulte plutôt sa bière. Tu souffriras moins longtemps. »",
  "« Quand une elfe te dit qu’elle se souvient de ton grand-père, ne demande pas dans quelles circonstances. »",
  "« Une potion sans étiquette est soit extrêmement précieuse, soit extrêmement drôle. »",
  "« Le premier mensonge d’un aventurier commence toujours par : “On en a pour cinq minutes.” »",
  "« Ce qui se passe dans la cave reste dans la cave. Surtout depuis qu’on a condamné la porte. »",
  "« Si le monstre possède un nom, c’est mauvais signe. Si son nom possède un titre, c’est pire. »",
  "« Mourir riche reste mourir. Dépensez chez Berthold. »",
  "« Un paladin sans certitudes est un homme agréable. Je n’en ai jamais rencontré. »",
  "« À force de chercher la lumière au bout du tunnel, certains finissent par réveiller ce qui dormait dedans. »",
  "« Celui qui garde une potion “pour plus tard” meurt généralement avec une très belle collection de potions. »",
  "« Dans le doute, commande une deuxième pinte. Le problème sera toujours là, mais il aura de meilleurs contours. »",
  "« Une armure légendaire ne protège pas contre les décisions stupides. J’ai vérifié. Plusieurs fois. »",
  "« Il y a trois sortes de champignons : ceux qu’on mange, ceux qui te tuent et ceux qui commencent à te parler. Évite surtout les bavards. »",
  "« Si le barde commence une chanson sur vos exploits avant votre départ, changez de quête. »",
  "« Un vrai héros ne regarde jamais les explosions. Un vrai héros intelligent évite surtout d’être près de l’explosion. »",
  "« Les morts-vivants ont au moins une qualité : ils reviennent toujours régler leurs comptes. »",
  "« Si tu entends des chants dans une forêt enchantée, bouche-toi les oreilles. Si tu entends de l’accordéon, cours encore plus vite. »",
  "« Ne demande jamais au cuisinier ce qu’il y a dans le ragoût. S’il le savait, il l’aurait mis sur l’ardoise. »",
  "« Un aventurier entre dans ma taverne avec cent pièces d’or. Il en ressort avec une quête, une gueule de bois et six pièces d’or. Ça s’appelle l’économie locale. »",
  "« Tout problème possède une solution. Certains problèmes possèdent également des dents. »",
  "« Souviens-toi, gamin : quand tout semble perdu, que le donjon s’effondre et que le dragon te poursuit… l’important, c’est d’avoir payé Berthold avant de partir. »"
];
let bertholdAdviceIndex = Math.floor(Math.random() * BERTHOLD_ADVICES.length);
let backupBusy = false;
let rembgEnginePromise = null;
const REMBG_RUNTIME_URL = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.0/dist/ort.min.js";
const REMBG_RUNTIME_BASE = "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.23.0/dist/";
const REMBG_LIBRARY_URL = "https://cdn.jsdelivr.net/npm/@bunnio/rembg-web@1.0.2/dist/index.umd.min.js";
const REMBG_MODEL = {
  key: "isnet-general-use",
  label: "ISNet General Use",
  sizeLabel: "178,6 Mo",
  url: "https://huggingface.co/tomjackson2023/rembg/resolve/main/isnet-general-use.onnx",
  sha256: "60920e99c45464f2ba57bee2ad08c919a52bbf852739e96947fbb4358c0d964a"
};
let searchDebounceTimer = null;
let bestiaryScrollSaveTimer = null;
let restoringBestiaryScroll = false;
let codexFamilyScrollSaveTimer = null;
let restoringCodexFamilyScroll = false;
let overlayFocusReturn = null;

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
  importRuntime: { preview: null, lastResult: null },
  diagnostic: null,
  mediaRembg: { assetId: "", busy: false, progress: 0, message: "", error: "", candidate: null },
  serviceWorkerRegistration: null,
  pwaInstallPrompt: null,
  workshop: {
    dirty: false,
    dirtyFields: new Set(),
    draft: null,
    draftFile: null,
    isNew: false,
    pending: null,
    deleteTarget: null,
    editorOpen: false,
    status: "clean"
  },
  ui: {
    view: "home",
    codexType: "creatures",
    codexSelectedId: "",
    codexDetailOpen: false,
    codexReturnStack: [],
    codexContext: null,
    codexFamilies: {
      dungeons: { mode: "gallery", search: "", scrollTop: 0, selectedId: "" },
      heroes: { mode: "gallery", search: "", scrollTop: 0, selectedBase: "", levelByBase: {} },
      npcs: { mode: "gallery", search: "", scrollTop: 0, selectedId: "" },
      quests: { mode: "list", search: "", scrollTop: 0, selectedId: "", dungeonId: "" },
      loot_items: { mode: "gallery", search: "", scrollTop: 0, selectedId: "" },
      interactables: { mode: "list", search: "", scrollTop: 0, selectedId: "", dungeonId: "" },
      brouhaha_effects: { mode: "cards", search: "", scrollTop: 0, selectedId: "", dungeonId: "" }
    },
    bestiary: { mode: "", search: "", dungeonId: "", category: "", menace: "", tags: [], sort: "name", direction: "asc", scrollTop: 0, selectedId: "", contextReturn: null },
    session: { active: false, dungeonId: "", floorIndex: 0, mode: "normal", encounter: null, brouhaha: { level: 0, current: null, history: [] }, questId: "", startedAt: "", updatedAt: "" },
    workshopType: "creatures",
    workshopSelectedId: "",
    codexCreatureDungeonId: "",
    codexHeroLevel: "",
    codexQuestDungeonId: "",
    workshopCreatureDungeonId: "",
    workshopQuestDungeonId: "",
    generator: { dungeonId: "", floorIndex: 0, boss: false, miniBoss: false, result: null },
    brouhaha: { dungeonId: "", level: 0, history: [], drawn: [] },
    questsResult: null,
    questDungeonId: "",
    import: { type: "creatures", fileName: "" },
    media: { filterType: "gallery", filterEntity: "", fileQueueName: "", scope: "all", search: "", selectedId: "", linkType: "gallery", linkEntityId: "" },
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
    codexDetailOpen: false,
    codexReturnStack: [],
    codexContext: null,
    codexFamilies: {
      dungeons: { mode: "gallery", search: "", scrollTop: 0, selectedId: "" },
      heroes: { mode: "gallery", search: "", scrollTop: 0, selectedBase: "", levelByBase: {} },
      npcs: { mode: "gallery", search: "", scrollTop: 0, selectedId: "" },
      quests: { mode: "list", search: "", scrollTop: 0, selectedId: "", dungeonId: "" },
      loot_items: { mode: "gallery", search: "", scrollTop: 0, selectedId: "" },
      interactables: { mode: "list", search: "", scrollTop: 0, selectedId: "", dungeonId: "" },
      brouhaha_effects: { mode: "cards", search: "", scrollTop: 0, selectedId: "", dungeonId: "" }
    },
    bestiary: { mode: "", search: "", dungeonId: "", category: "", menace: "", tags: [], sort: "name", direction: "asc", scrollTop: 0, selectedId: "", contextReturn: null },
    session: { active: false, dungeonId: "", floorIndex: 0, mode: "normal", encounter: null, brouhaha: { level: 0, current: null, history: [] }, questId: "", startedAt: "", updatedAt: "" },
    workshopType: "creatures",
    workshopSelectedId: "",
    codexCreatureDungeonId: "",
    codexHeroLevel: "",
    codexQuestDungeonId: "",
    workshopCreatureDungeonId: "",
    workshopQuestDungeonId: "",
    generator: { dungeonId: "", floorIndex: 0, boss: false, miniBoss: false, result: null },
    brouhaha: { dungeonId: "", level: 0, history: [], drawn: [] },
    questsResult: null,
    questDungeonId: "",
    import: { type: "creatures", fileName: "" },
    media: { filterType: "gallery", filterEntity: "", fileQueueName: "", scope: "all", search: "", selectedId: "", linkType: "gallery", linkEntityId: "" },
    journalOpen: false,
    globalSearch: ""
  };
}

function defaultSessionContext(dungeonId = "") {
  return {
    active: false,
    dungeonId: String(dungeonId || ""),
    floorIndex: 0,
    mode: "normal",
    encounter: null,
    brouhaha: { level: 0, current: null, history: [] },
    questId: "",
    startedAt: "",
    updatedAt: ""
  };
}

function legacyEncounterToSession(result) {
  if (!result || result.error) return null;
  const occurrences = (result.creatures || []).map((creature, index) => ({
    id: `legacy_${String(creature?.id || "creature")}_${index}`,
    creatureId: String(creature?.id || ""),
    name: String(creature?.name || "Créature"),
    eliminated: false,
    lootRolled: false,
    loot: null
  }));
  const killed = result.local?.killedCreatures || {};
  const lastLoot = result.local?.lastLoot || {};
  for (const creatureId of Object.keys(killed)) {
    if (!killed[creatureId]) continue;
    const occurrence = occurrences.find(row => row.creatureId === creatureId && !row.eliminated);
    if (!occurrence) continue;
    occurrence.eliminated = true;
    occurrence.lootRolled = true;
    occurrence.loot = lastLoot[creatureId] || { type: "none", text: "Tirage antérieur non détaillé." };
  }
  return {
    id: `legacy_${String(result.dungeon_id || "session")}_${Number(result.floor || 0)}`,
    dungeonId: String(result.dungeon_id || ""),
    floorIndex: Math.max(0, Number(result.floor || 0)),
    budget: Number(result.budget || 0),
    used: Number(result.used || 0),
    mode: result.boss ? "boss" : result.miniBoss ? "mini_boss" : "normal",
    creatureOccurrences: occurrences,
    interactableRefs: (result.interactables || []).map(item => ({
      interactableId: String(item?.id || ""),
      name: String(item?.name || "Objet interactif")
    })),
    generatedAt: nowISO()
  };
}

function migrateLegacySession(savedUi) {
  const result = savedUi?.generator?.result && !savedUi.generator.result.error ? savedUi.generator.result : null;
  const bhHistory = Array.isArray(savedUi?.brouhaha?.history) ? savedUi.brouhaha.history : [];
  const bhDrawn = Array.isArray(savedUi?.brouhaha?.drawn) ? savedUi.brouhaha.drawn : [];
  const quest = savedUi?.questsResult && typeof savedUi.questsResult === "object" ? savedUi.questsResult : null;
  const active = Boolean(result || bhHistory.length || bhDrawn.length || quest);
  const firstDungeonId = state.data.dungeons?.[0]?.id || "";
  const dungeonId = String(
    result?.dungeon_id ||
    quest?.dungeon_id ||
    savedUi?.questDungeonId ||
    savedUi?.brouhaha?.dungeonId ||
    savedUi?.generator?.dungeonId ||
    firstDungeonId
  );
  const context = defaultSessionContext(dungeonId);
  context.active = active;
  context.floorIndex = Math.max(0, Number(result?.floor ?? savedUi?.generator?.floorIndex ?? 0));
  context.mode = result?.boss || savedUi?.generator?.boss ? "boss" : result?.miniBoss || savedUi?.generator?.miniBoss ? "mini_boss" : "normal";
  context.encounter = legacyEncounterToSession(result);
  context.brouhaha.level = clamp(Number(savedUi?.brouhaha?.level || 0), 0, 12);
  context.brouhaha.history = bhHistory.slice(0, 20).map(row => ({
    level: clamp(Number(row?.level || 0), 0, 12),
    text: String(row?.text || ""),
    at: row?.at || nowISO(),
    effectIds: []
  }));
  const currentLegacy = bhDrawn[0] || context.brouhaha.history[0] || null;
  context.brouhaha.current = currentLegacy ? {
    level: clamp(Number(currentLegacy.level || 0), 0, 12),
    text: String(currentLegacy.text || ""),
    at: currentLegacy.at || nowISO(),
    effectIds: []
  } : null;
  context.questId = String(quest?.id || "");
  context.startedAt = active ? nowISO() : "";
  context.updatedAt = active ? nowISO() : "";
  return context;
}

function sessionFromSavedUi(savedUi) {
  if (!savedUi?.session || typeof savedUi.session !== "object") return migrateLegacySession(savedUi || {});
  const defaults = defaultSessionContext(savedUi.session.dungeonId || "");
  return {
    ...defaults,
    ...savedUi.session,
    brouhaha: {
      ...defaults.brouhaha,
      ...(savedUi.session.brouhaha || {}),
      history: Array.isArray(savedUi.session.brouhaha?.history) ? savedUi.session.brouhaha.history : []
    }
  };
}

function ensureSessionContext() {
  const current = state.ui.session && typeof state.ui.session === "object" ? state.ui.session : defaultSessionContext();
  const defaults = defaultSessionContext(current.dungeonId || "");
  const session = {
    ...defaults,
    ...current,
    brouhaha: {
      ...defaults.brouhaha,
      ...(current.brouhaha || {}),
      history: Array.isArray(current.brouhaha?.history) ? current.brouhaha.history.slice(0, 20) : []
    }
  };
  session.active = session.active === true;
  session.dungeonId = String(session.dungeonId || "");
  session.mode = ["normal", "mini_boss", "boss"].includes(session.mode) ? session.mode : "normal";
  session.floorIndex = Math.max(0, Number(session.floorIndex || 0));
  session.brouhaha.level = clamp(Number(session.brouhaha.level || 0), 0, 12);
  session.brouhaha.current = session.brouhaha.current && typeof session.brouhaha.current === "object" ? session.brouhaha.current : null;
  session.questId = String(session.questId || "");
  session.encounter = session.encounter && typeof session.encounter === "object" ? session.encounter : null;

  const firstDungeonId = state.data.dungeons?.[0]?.id || "";
  if (!findById("dungeons", session.dungeonId)) {
    if (session.active) {
      const reset = defaultSessionContext(firstDungeonId);
      state.ui.session = reset;
      return reset;
    }
    session.dungeonId = firstDungeonId;
  }

  const floors = sessionFloorBudgets(session);
  session.floorIndex = floors.length ? clamp(session.floorIndex, 0, floors.length - 1) : 0;
  state.ui.session = session;
  return session;
}

function sessionDungeon(session = ensureSessionContext()) {
  return findById("dungeons", session?.dungeonId) || null;
}

function sessionFloorBudgets(session = ensureSessionContext()) {
  const dungeon = findById("dungeons", session?.dungeonId);
  return dungeon ? dungeonFloorBudgets(dungeon) : [];
}

function sessionBudget(session = ensureSessionContext()) {
  const budgets = sessionFloorBudgets(session);
  const raw = budgets[session.floorIndex];
  if (raw === null || raw === undefined || raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function sessionModeLabel(mode) {
  return mode === "boss" ? "Boss" : mode === "mini_boss" ? "Mini-boss" : "Normal";
}

function sessionHasTemporaryData(session = ensureSessionContext()) {
  return Boolean(
    session.encounter ||
    session.questId ||
    session.brouhaha.current ||
    session.brouhaha.history.length ||
    Number(session.brouhaha.level || 0) > 0
  );
}

function clearLegacySessionUi() {
  state.ui.generator.result = null;
  state.ui.brouhaha.level = 0;
  state.ui.brouhaha.history = [];
  state.ui.brouhaha.drawn = [];
  state.ui.questsResult = null;
}

function startSession(dungeonId = "") {
  const selected = findById("dungeons", dungeonId) || state.data.dungeons?.[0] || null;
  if (!selected) return false;
  const session = defaultSessionContext(selected.id);
  session.active = true;
  session.startedAt = nowISO();
  session.updatedAt = session.startedAt;
  state.ui.session = session;
  clearLegacySessionUi();
  return true;
}

function endSessionWithConfirmation() {
  const session = ensureSessionContext();
  if (!session.active) return true;
  if (!confirm("Terminer la partie ? La rencontre, le Brouhaha de session, son historique et la quête tirée seront effacés. Le Codex et les médias resteront intacts.")) return false;
  state.ui.session = defaultSessionContext();
  clearLegacySessionUi();
  return true;
}

function changeSessionDungeon(nextDungeonId) {
  const session = ensureSessionContext();
  const next = findById("dungeons", nextDungeonId);
  if (!next || String(next.id) === String(session.dungeonId)) return Boolean(next);
  if (session.active && sessionHasTemporaryData(session)) {
    const ok = confirm("Changer de Donjon ? La rencontre, le Brouhaha de session et la quête tirée seront réinitialisés. Les données du Codex ne seront pas modifiées.");
    if (!ok) return false;
  }
  if (!session.active) {
    session.dungeonId = String(next.id);
    session.floorIndex = 0;
    session.updatedAt = nowISO();
    return true;
  }
  const startedAt = session.startedAt || nowISO();
  const fresh = defaultSessionContext(next.id);
  fresh.active = true;
  fresh.startedAt = startedAt;
  fresh.updatedAt = nowISO();
  state.ui.session = fresh;
  clearLegacySessionUi();
  return true;
}

function changeSessionFloor(nextFloorIndex) {
  const session = ensureSessionContext();
  const budgets = sessionFloorBudgets(session);
  const next = budgets.length ? clamp(Number(nextFloorIndex || 0), 0, budgets.length - 1) : 0;
  if (next === session.floorIndex) return true;
  if (session.encounter) {
    const ok = confirm("Changer d'étage ? La rencontre actuelle sera supprimée. Le Brouhaha et la quête de session seront conservés.");
    if (!ok) return false;
    session.encounter = null;
  }
  session.floorIndex = next;
  session.updatedAt = nowISO();
  return true;
}

function sessionEncounterCreatureGroups(encounter) {
  const groups = new Map();
  for (const occurrence of encounter?.creatureOccurrences || []) {
    const key = String(occurrence.creatureId || "");
    if (!groups.has(key)) groups.set(key, {
      creatureId: key,
      name: occurrence.name || "Créature",
      creature: findById("creatures", key),
      total: 0,
      remaining: 0,
      occurrences: []
    });
    const group = groups.get(key);
    group.total += 1;
    if (!occurrence.eliminated) group.remaining += 1;
    group.occurrences.push(occurrence);
  }
  return [...groups.values()];
}

function sessionEncounterLootRows(encounter) {
  return (encounter?.creatureOccurrences || [])
    .filter(row => row.eliminated && row.lootRolled)
    .map(row => ({ ...row, creature: findById("creatures", row.creatureId) }));
}

function buildEncounterInteractables(dungeon, budget) {
  const pool = (state.data.interactables || []).filter(item => entityBelongsToDungeon(item, dungeon));
  if (!pool.length) return [];
  const target = clamp(Math.floor(Number(budget || 0) / 3), 1, 6);
  return shuffle(pool).slice(0, Math.min(pool.length, target));
}

function generateSessionEncounter(session = ensureSessionContext()) {
  if (!session.active) return { error: "Aucune partie active." };
  const dungeon = sessionDungeon(session);
  if (!dungeon) return { error: "Donjon actif indisponible." };
  const budget = sessionBudget(session);
  if (budget === null || budget <= 0) return { error: "Budget absent ou invalide pour cet étage." };

  const pool = (state.data.creatures || []).filter(item => entityBelongsToDungeon(item, dungeon));
  const normalPool = pool.filter(item => {
    const key = creatureCategoryMeta(item.category).key;
    return key !== "boss" && key !== "mini_boss" && Number(item.menace) > 0;
  });
  const bossPool = pool.filter(item => creatureCategoryMeta(item.category).key === "boss" && Number(item.menace) > 0);
  const miniPool = pool.filter(item => creatureCategoryMeta(item.category).key === "mini_boss" && Number(item.menace) > 0);

  const selected = [];
  let remaining = budget;
  if (session.mode === "boss" || session.mode === "mini_boss") {
    const specialPool = session.mode === "boss" ? bossPool : miniPool;
    if (!specialPool.length) return { error: session.mode === "boss" ? "Aucun Boss fiable dans ce Donjon." : "Aucun Mini-boss fiable dans ce Donjon." };
    const fits = specialPool.filter(item => Number(item.menace) <= remaining);
    if (!fits.length) return { error: `Aucun ${sessionModeLabel(session.mode)} ne rentre dans le budget de cet étage.` };
    const special = shuffle(fits)[0];
    selected.push(special);
    remaining -= Number(special.menace);
  }

  if (remaining > 0) {
    const combo = exactBudgetCombo(normalPool, remaining);
    if (!combo) return { error: "Impossible de composer une rencontre exacte avec le budget et les Créatures disponibles." };
    selected.push(...combo);
  }
  if (!selected.length) return { error: "Aucune Créature candidate pour cette configuration." };

  const occurrences = selected.map(creature => ({
    id: uid("occ"),
    creatureId: String(creature.id || ""),
    name: String(creature.name || "Créature"),
    eliminated: false,
    lootRolled: false,
    loot: null
  }));
  const interactables = buildEncounterInteractables(dungeon, budget);
  return {
    id: uid("encounter"),
    dungeonId: String(dungeon.id || ""),
    floorIndex: session.floorIndex,
    budget,
    used: selected.reduce((sum, creature) => sum + Number(creature.menace || 0), 0),
    mode: session.mode,
    creatureOccurrences: occurrences,
    interactableRefs: interactables.map(item => ({
      interactableId: String(item.id || ""),
      name: String(item.name || "Objet interactif")
    })),
    generatedAt: nowISO()
  };
}

function eliminateSessionOccurrence(creatureId) {
  const session = ensureSessionContext();
  const encounter = session.encounter;
  if (!encounter) return false;
  const occurrence = (encounter.creatureOccurrences || []).find(row => String(row.creatureId) === String(creatureId) && !row.eliminated);
  if (!occurrence) return false;
  const creature = findById("creatures", creatureId);
  occurrence.eliminated = true;
  if (!occurrence.lootRolled) {
    occurrence.loot = rollCreatureLoot(creature);
    occurrence.lootRolled = true;
  }
  session.updatedAt = nowISO();
  return true;
}

function drawSessionBrouhaha() {
  const session = ensureSessionContext();
  if (!session.active) return null;
  const dungeon = sessionDungeon(session);
  const level = clamp(Number(session.brouhaha.level || 0), 0, 12);
  const pool = (state.data.brouhaha_effects || []).filter(effect => {
    if (Number(effect.level) !== level) return false;
    const universal = !String(effect.dungeon_id || "").trim() && !String(effect.dungeon_name || "").trim();
    return universal || (dungeon && entityBelongsToDungeon(effect, dungeon));
  });
  if (!pool.length) return null;
  const count = level >= 10 ? 2 : 1;
  const picks = shuffle(pool).slice(0, count);
  const current = {
    level,
    text: picks.map(effect => String(effect.effect_text || "").trim()).filter(Boolean).join(" / "),
    effectIds: picks.map(effect => String(effect.id || "")).filter(Boolean),
    at: nowISO()
  };
  session.brouhaha.current = current;
  session.brouhaha.history.unshift({ ...current });
  session.brouhaha.history = session.brouhaha.history.slice(0, 20);
  session.updatedAt = nowISO();
  return current;
}

function sessionQuestCandidates(session = ensureSessionContext()) {
  const dungeon = sessionDungeon(session);
  if (!dungeon) return [];
  return (state.data.quests || []).filter(quest => entityBelongsToDungeon(quest, dungeon));
}

function drawSessionQuest() {
  const session = ensureSessionContext();
  const candidates = sessionQuestCandidates(session);
  if (!candidates.length) return null;
  const alternatives = candidates.length > 1 ? candidates.filter(quest => String(quest.id) !== String(session.questId)) : candidates;
  const picked = shuffle(alternatives.length ? alternatives : candidates)[0];
  session.questId = String(picked.id || "");
  session.updatedAt = nowISO();
  return picked;
}

function renderSessionStartCard(contextLabel = "Partie") {
  const session = ensureSessionContext();
  const dungeons = state.data.dungeons || [];
  return `<section class="session-start-card panel">
    <div>
      <span class="eyebrow">Session locale</span>
      <h2>${escapeHtml(contextLabel)} · aucune partie active</h2>
    </div>
    <div class="session-start-actions">
      <label><span>Donjon</span><select data-action="session-start-dungeon" ${dungeons.length ? "" : "disabled"}>
        ${dungeons.map(dungeon => `<option value="${escapeHtml(String(dungeon.id || ""))}" ${String(dungeon.id) === String(session.dungeonId) ? "selected" : ""}>${escapeHtml(dungeon.name || "Donjon")}</option>`).join("")}
      </select></label>
      <button class="primary" type="button" data-action="session-start" ${dungeons.length ? "" : "disabled"}>Démarrer la partie</button>
      ${dungeons.length ? "" : `<span class="empty small">Aucun Donjon disponible dans le Codex.</span>`}
    </div>
  </section>`;
}

function renderSessionToolHeader(activeTool) {
  const session = ensureSessionContext();
  if (!session.active) return "";
  const dungeon = sessionDungeon(session);
  const budget = sessionBudget(session);
  return `<section class="session-tool-header">
    <div class="session-tool-identity">
      <span>Partie en cours</span>
      <strong>${escapeHtml(dungeon?.name || "Donjon indisponible")}</strong>
      <small>Étage ${session.floorIndex + 1}${budget === null ? "" : ` · budget ${escapeHtml(String(budget))}`}</small>
    </div>
    <nav aria-label="Outils de partie">
      <button class="${activeTool === "generator" ? "active" : ""}" type="button" data-action="set-view" data-view="generator">Générateur</button>
      <button class="${activeTool === "brouhaha" ? "active" : ""}" type="button" data-action="set-view" data-view="brouhaha">Brouhaha</button>
      <button class="${activeTool === "quests" ? "active" : ""}" type="button" data-action="set-view" data-view="quests">Quête</button>
    </nav>
    <div class="session-tool-actions">
      ${dungeon ? `<button class="ghost" type="button" data-action="jump-codex" data-type="dungeons" data-id="${escapeHtml(String(dungeon.id || ""))}">Donjon dans le Codex</button>` : ""}
      <button class="danger" type="button" data-action="session-end">Terminer la partie</button>
    </div>
  </section>`;
}

function storeList() {
  return [...ENTITY_ORDER];
}

function getLabel(type) {
  return ENTITY_LABELS[type] || type;
}

const CREATURE_CATEGORY_META = {
  basique: { label: "Basique", sigil: "Sigil_Basique.webp" },
  tactique: { label: "Tactique", sigil: "Sigil_Tactique.webp" },
  speciale: { label: "Spéciale", sigil: "Sigil_Speciale.webp" },
  brute: { label: "Brute", sigil: "Sigil_Brute.webp" },
  mini_boss: { label: "Mini-boss", sigil: "Sigil_MiniBoss.webp" },
  boss: { label: "Boss", sigil: "Sigil_Boss.webp" }
};

function defaultCodexFamiliesUi() {
  return {
    dungeons: { mode: "gallery", search: "", scrollTop: 0, selectedId: "" },
    heroes: { mode: "gallery", search: "", scrollTop: 0, selectedBase: "", levelByBase: {} },
    npcs: { mode: "gallery", search: "", scrollTop: 0, selectedId: "" },
    quests: { mode: "list", search: "", scrollTop: 0, selectedId: "", dungeonId: "" },
    loot_items: { mode: "gallery", search: "", scrollTop: 0, selectedId: "" },
    interactables: { mode: "list", search: "", scrollTop: 0, selectedId: "", dungeonId: "" },
    brouhaha_effects: { mode: "cards", search: "", scrollTop: 0, selectedId: "", dungeonId: "" }
  };
}

function ensureCodexFamilyUi() {
  const defaults = defaultCodexFamiliesUi();
  const current = state.ui.codexFamilies && typeof state.ui.codexFamilies === "object" ? state.ui.codexFamilies : {};
  state.ui.codexFamilies = {
    dungeons: { ...defaults.dungeons, ...(current.dungeons || {}) },
    heroes: { ...defaults.heroes, ...(current.heroes || {}) },
    npcs: { ...defaults.npcs, ...(current.npcs || {}) },
    quests: { ...defaults.quests, ...(current.quests || {}) },
    loot_items: { ...defaults.loot_items, ...(current.loot_items || {}) },
    interactables: { ...defaults.interactables, ...(current.interactables || {}) },
    brouhaha_effects: { ...defaults.brouhaha_effects, ...(current.brouhaha_effects || {}) }
  };
  const allowedModes = {
    dungeons: ["gallery", "list"],
    heroes: ["gallery", "list"],
    npcs: ["gallery", "list"],
    quests: ["list", "cards"],
    loot_items: ["gallery", "list"],
    interactables: ["list", "gallery"],
    brouhaha_effects: ["cards", "list"]
  };
  for (const type of Object.keys(allowedModes)) {
    if (!allowedModes[type].includes(state.ui.codexFamilies[type].mode)) {
      state.ui.codexFamilies[type].mode = defaults[type].mode;
    }
    state.ui.codexFamilies[type].search = String(state.ui.codexFamilies[type].search || "");
    state.ui.codexFamilies[type].scrollTop = Math.max(0, Number(state.ui.codexFamilies[type].scrollTop || 0));
    if (Object.prototype.hasOwnProperty.call(defaults[type], "dungeonId")) {
      state.ui.codexFamilies[type].dungeonId = String(state.ui.codexFamilies[type].dungeonId || "");
    }
  }
  const levels = state.ui.codexFamilies.heroes.levelByBase;
  state.ui.codexFamilies.heroes.levelByBase = levels && typeof levels === "object" && !Array.isArray(levels) ? levels : {};
}

function heroBaseKey(hero) {
  const base = String(hero?.hero_base_name || "").trim();
  return base ? `base:${base}` : `id:${String(hero?.id || "")}`;
}

function buildHeroGroups() {
  const groups = new Map();
  for (const hero of state.data.heroes || []) {
    const key = heroBaseKey(hero);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        baseName: String(hero.hero_base_name || hero.name || "Héros sans nom").trim() || "Héros sans nom",
        levels: []
      });
    }
    groups.get(key).levels.push(hero);
  }
  return [...groups.values()]
    .map(group => ({
      ...group,
      levels: group.levels.slice().sort((a, b) => {
        const level = Number(a.level ?? 0) - Number(b.level ?? 0);
        return level || String(a.id || "").localeCompare(String(b.id || ""), "fr", { sensitivity: "base" });
      })
    }))
    .sort((a, b) => a.baseName.localeCompare(b.baseName, "fr", { sensitivity: "base" }));
}

function heroGroupByKey(key) {
  return buildHeroGroups().find(group => group.key === key) || null;
}

function selectedHeroLevel(group) {
  if (!group?.levels?.length) return null;
  ensureCodexFamilyUi();
  const remembered = Number(state.ui.codexFamilies.heroes.levelByBase[group.key]);
  if (Number.isFinite(remembered)) {
    const match = group.levels.find(item => Number(item.level) === remembered);
    if (match) return match;
  }
  return group.levels[0];
}

function rememberHeroLevel(group, level) {
  ensureCodexFamilyUi();
  if (!group) return;
  state.ui.codexFamilies.heroes.levelByBase[group.key] = Number(level);
}

function getHeroCollection() {
  ensureCodexFamilyUi();
  const q = normalizeBestiaryText(state.ui.codexFamilies.heroes.search);
  let groups = buildHeroGroups();
  if (q) {
    groups = groups.filter(group => normalizeBestiaryText(group.levels.flatMap(level => [
      group.baseName,
      level.name,
      level.role,
      level.title,
      level.ability_text,
      level.effect_text,
      ...tagsToArray(level.tags)
    ]).filter(Boolean).join(" ")).includes(q));
  }
  return groups;
}

function getDungeonCollection() {
  ensureCodexFamilyUi();
  const q = normalizeBestiaryText(state.ui.codexFamilies.dungeons.search);
  let items = [...(state.data.dungeons || [])];
  if (q) {
    items = items.filter(item => normalizeBestiaryText([
      item.name,
      item.description,
      item.boss_name,
      ...tagsToArray(item.tags)
    ].filter(Boolean).join(" ")).includes(q));
  }
  return items.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "fr", { sensitivity: "base" }));
}

function familyCollectionInitialId(type) {
  ensureCodexFamilyUi();
  if (type === "dungeons") {
    const selected = state.ui.codexFamilies.dungeons.selectedId;
    if (selected && findById("dungeons", selected)) return selected;
    return getDungeonCollection()[0]?.id || state.data.dungeons?.[0]?.id || "";
  }
  if (type === "heroes") {
    const groups = buildHeroGroups();
    const selectedKey = state.ui.codexFamilies.heroes.selectedBase;
    const group = groups.find(item => item.key === selectedKey) || groups[0] || null;
    const level = selectedHeroLevel(group);
    return level?.id || "";
  }
  if (["npcs", "quests", "loot_items", "interactables", "brouhaha_effects"].includes(type)) {
    const selected = state.ui.codexFamilies[type]?.selectedId;
    if (selected && findById(type, selected)) return selected;
  }
  return (state.data[type] || [])[0]?.id || "";
}

function pathUrl(path) {
  const clean = String(path || "").trim();
  if (!clean) return "";
  const asset = (state.data.media_assets || []).find(media => media.path === clean || media.thumb_path === clean);
  return mediaUrlForAsset(asset, false) || clean;
}

function transparentDerivativeUrlForEntity(entity, type = "heroes") {
  if (!entity) return "";
  for (const field of ["transparent_image_path", "image_transparent_path", "cutout_path", "image_cutout_path", "rembg_path"]) {
    const candidate = pathUrl(entity[field]);
    if (candidate) return candidate;
  }
  const entityAssets = (state.data.media_assets || []).filter(asset => {
    const entityType = relationStore(asset.entity_type);
    return entityType === type && String(asset.entity_id || "") === String(entity.id || "");
  });
  const approved = entityAssets.find(asset =>
    asset.transparent_blob &&
    asset.transparent_review_status === "approved" &&
    asset.transparent_audit?.pass === true
  );
  if (approved) return mediaTransparentUrlForAsset(approved) || mediaUrlForAsset(approved, false);
  const legacy = entityAssets.find(asset => {
    const marker = normalizeBestiaryText([asset.variant, asset.purpose, asset.role, asset.derivative_type, asset.processing].filter(Boolean).join(" "));
    return asset.is_transparent === true || asset.is_cutout === true ||
      marker.includes("transparent") || marker.includes("cutout") || marker.includes("rembg");
  });
  return legacy ? mediaUrlForAsset(legacy, false) : imageUrlForEntity(entity);
}

const DUNGEON_ACCENT_PALETTE = ["#76907E","#657F9A","#A56E45","#9B5D73","#B8893F","#7F667E","#6F7F54","#8B7051"];

function dungeonAccent(item) {
  for (const value of [item?.accent, item?.accent_color, item?.color]) {
    const candidate = String(value || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(candidate) || /^#[0-9a-f]{3}$/i.test(candidate)) return candidate;
  }
  const identity = String(item?.name || item?.id || "").toLocaleLowerCase("fr");
  const themed = [
    [/sobri/, "#657F9A"],
    [/forêt|foret/, "#76907E"],
    [/ruche/, "#B8893F"],
    [/céleste|celeste/, "#A78D56"],
    [/cabaret/, "#9B5D73"],
    [/bastion|gueulard/, "#9A654A"],
    [/bastognac/, "#A56E45"],
    [/zombi/, "#7F667E"],
    [/marécage|marecage/, "#6F7F54"]
  ].find(([pattern]) => pattern.test(identity));
  if (themed) return themed[1];
  let hash = 0;
  for (let index = 0; index < identity.length; index += 1) hash = ((hash << 5) - hash + identity.charCodeAt(index)) | 0;
  return DUNGEON_ACCENT_PALETTE[Math.abs(hash) % DUNGEON_ACCENT_PALETTE.length] || "#8A5E31";
}

const dungeonCinematicSeen = new Set();

function ensureDungeonCinematicLayer() {
  let layer = document.getElementById("gargotte-cinematic");
  if (layer) return layer;
  layer = document.createElement("div");
  layer.id = "gargotte-cinematic";
  layer.className = "gargotte-cinematic";
  layer.setAttribute("role", "dialog");
  layer.setAttribute("aria-modal", "true");
  layer.setAttribute("aria-live", "polite");
  document.body.append(layer);
  return layer;
}

function hideDungeonCinematic() {
  const layer = document.getElementById("gargotte-cinematic");
  if (!layer) return;
  layer.classList.remove("show");
  document.body.classList.remove("cinematic-open");
  clearTimeout(showDungeonCinematic.timer);
}

function queueDungeonCinematic(dungeon) {
  if (!dungeon) return;
  const key = String(dungeon.id || dungeon.name || "");
  if (!key || dungeonCinematicSeen.has(key)) return;
  dungeonCinematicSeen.add(key);
  setTimeout(() => showDungeonCinematic(dungeon), 90);
}

function queueHeroDetailReveal() {
  requestAnimationFrame(() => {
    const sheet = document.querySelector(".hero-sheet-v6");
    if (!sheet || window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;
    sheet.classList.remove("hero-sheet-enter-v6");
    void sheet.offsetWidth;
    sheet.classList.add("hero-sheet-enter-v6");
    sheet.addEventListener("animationend", () => sheet.classList.remove("hero-sheet-enter-v6"), { once: true });
  });
}

function showDungeonCinematic(dungeon) {
  if (!dungeon) return;
  const layer = ensureDungeonCinematicLayer();
  const image = imageUrlForEntity(dungeon);
  const accent = dungeonAccent(dungeon);
  const title = String(dungeon.name || "Découverte");
  const copy = String(dungeon.atmosphere || dungeon.description || "");
  const safeImage = String(image || "").replace(/"/g, "%22");
  clearTimeout(showDungeonCinematic.timer);
  layer.dataset.kind = "discovery";
  layer.setAttribute("aria-label", `Nouveau lieu : ${title}`);
  layer.style.setProperty("--cinematic-bg", image ? `url("${safeImage}")` : "none");
  layer.style.setProperty("--cinematic-accent", accent);
  layer.innerHTML = `
    <div class="cinematic-backdrop"></div>
    <div class="cinematic-curtain left"></div>
    <div class="cinematic-curtain right"></div>
    <div class="cinematic-card">
      <img class="cinematic-emblem" src="${V6_ICON_PATH}Icone_Gameplay_DONJON.webp" alt="">
      <div class="cinematic-eyebrow">NOUVEAU LIEU</div>
      <div class="cinematic-title">${escapeHtml(title)}</div>
      ${copy ? `<p>${escapeHtml(copy)}</p>` : ""}
      <div class="cinematic-sparks" aria-hidden="true">${Array.from({ length: 9 }, (_, index) => `<i style="--i:${index}"></i>`).join("")}</div>
      <button class="primary cinematic-skip" type="button">Continuer</button>
    </div>`;
  layer.onclick = event => {
    if (event.target === layer || event.target.closest(".cinematic-skip")) hideDungeonCinematic();
  };
  layer.onkeydown = event => {
    if (event.key === "Escape") {
      event.preventDefault();
      hideDungeonCinematic();
    }
  };
  document.body.classList.add("cinematic-open");
  requestAnimationFrame(() => {
    layer.classList.add("show");
    requestAnimationFrame(() => layer.querySelector(".cinematic-skip")?.focus({ preventScroll: true }));
  });
  showDungeonCinematic.timer = setTimeout(hideDungeonCinematic, 2500);
}
function dungeonFloorBudgets(item) {
  const raw = item?.floor_budgets;
  let budgets = [];
  if (Array.isArray(raw)) budgets = raw.slice();
  else if (raw !== null && raw !== undefined && String(raw).trim()) budgets = parseFloorBudgets(raw);
  const explicitCount = Number(item?.base_floor_count);
  const count = Math.max(budgets.length, Number.isFinite(explicitCount) && explicitCount > 0 ? Math.floor(explicitCount) : 0);
  return Array.from({ length: count }, (_, index) => budgets[index] ?? null);
}

function entityBelongsToDungeon(entity, dungeon) {
  if (!entity || !dungeon) return false;
  if (entity.dungeon_id) return String(entity.dungeon_id) === String(dungeon.id);
  const stored = normalizeBestiaryText(entity.dungeon_name);
  const target = normalizeBestiaryText(dungeon.name);
  if (!stored || stored !== target) return false;
  const matches = (state.data.dungeons || []).filter(item => normalizeBestiaryText(item.name) === target);
  return matches.length === 1;
}

function dungeonLinkedEntities(dungeon) {
  return {
    creatures: (state.data.creatures || []).filter(item => entityBelongsToDungeon(item, dungeon)),
    quests: (state.data.quests || []).filter(item => entityBelongsToDungeon(item, dungeon)),
    interactables: (state.data.interactables || []).filter(item => entityBelongsToDungeon(item, dungeon)),
    brouhaha_effects: (state.data.brouhaha_effects || []).filter(item => entityBelongsToDungeon(item, dungeon))
  };
}

function resolveDungeonBoss(dungeon) {
  const linked = dungeonLinkedEntities(dungeon).creatures;
  const explicitName = String(dungeon?.boss_name || "").trim();
  if (explicitName) {
    const matches = linked.filter(item => normalizeBestiaryText(item.name) === normalizeBestiaryText(explicitName));
    return { name: explicitName, entity: matches.length === 1 ? matches[0] : null, reliable: matches.length === 1 };
  }
  const bosses = linked.filter(item => creatureCategoryMeta(item.category).key === "boss");
  if (bosses.length === 1) return { name: String(bosses[0].name || "Boss"), entity: bosses[0], reliable: true };
  return { name: "", entity: null, reliable: false };
}

function abilityIsPresent(value) {
  const text = String(value || "").trim();
  return Boolean(text && text !== "-" && text !== "—");
}

function formatBrouhahaStamp(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/^[+-]/.test(text)) return text;
  const n = Number(text);
  if (Number.isFinite(n)) return n >= 0 ? `+${n}` : String(n);
  return text;
}

const QUEST_DIFFICULTY_META = [
  { level: 1, key: "basique", label: "Très facile" },
  { level: 2, key: "tactique", label: "Facile" },
  { level: 3, key: "speciale", label: "Normale" },
  { level: 4, key: "brute", label: "Difficile" },
  { level: 5, key: "mini_boss", label: "Très difficile" },
  { level: 6, key: "boss", label: "Extrême" }
];

const LOOT_RARITY_META = [
  { level: 1, key: "basique", label: "Mauvais" },
  { level: 2, key: "tactique", label: "Commun" },
  { level: 3, key: "speciale", label: "Inhabituel" },
  { level: 4, key: "brute", label: "Rare" },
  { level: 5, key: "mini_boss", label: "Épique" },
  { level: 6, key: "boss", label: "Légendaire" }
];

function semanticTierMeta(value, levels) {
  if (value === null || value === undefined || String(value).trim() === "") return null;
  const raw = String(value).trim();
  const numeric = Number(raw);
  if (Number.isInteger(numeric)) {
    const match = levels.find(entry => entry.level === numeric);
    if (match) return { ...match, raw, known: true };
  }
  const normalized = normalizeBestiaryText(raw);
  const match = levels.find(entry => normalizeBestiaryText(entry.label) === normalized);
  return match ? { ...match, raw, known: true } : { key: "unknown", label: raw, raw, known: false };
}

function questDifficultyMeta(value) {
  return semanticTierMeta(value, QUEST_DIFFICULTY_META);
}

function lootRarityMeta(item) {
  for (const field of ["rarity", "rarity_label", "rarete"]) {
    if (item?.[field] !== null && item?.[field] !== undefined && String(item[field]).trim() !== "") {
      return semanticTierMeta(item[field], LOOT_RARITY_META);
    }
  }
  return null;
}

function resolveQuestNpc(item) {
  if (!item) return null;
  const direct = item.npc_id ? findById("npcs", item.npc_id) : null;
  if (direct) return direct;
  const target = normalizeBestiaryText(item.npc_name);
  if (!target) return null;
  const matches = (state.data.npcs || []).filter(npc => normalizeBestiaryText(npc.name) === target);
  return matches.length === 1 ? matches[0] : null;
}

function resolveQuestDungeon(item) {
  if (!item) return null;
  const direct = item.dungeon_id ? findById("dungeons", item.dungeon_id) : null;
  if (direct) return direct;
  const target = normalizeBestiaryText(item.dungeon_name);
  if (!target) return null;
  const matches = (state.data.dungeons || []).filter(dungeon => normalizeBestiaryText(dungeon.name) === target);
  return matches.length === 1 ? matches[0] : null;
}

function questsForNpc(npc) {
  if (!npc) return [];
  const npcId = String(npc.id || "");
  const npcName = normalizeBestiaryText(npc.name);
  const sameNameCount = (state.data.npcs || []).filter(item => normalizeBestiaryText(item.name) === npcName).length;
  return (state.data.quests || []).filter(quest => {
    if (quest.npc_id) return String(quest.npc_id) === npcId;
    return sameNameCount === 1 && npcName && normalizeBestiaryText(quest.npc_name) === npcName;
  });
}

function resolveLootCreature(item) {
  if (!item) return null;
  const direct = item.creature_id ? findById("creatures", item.creature_id) : null;
  if (direct) return direct;
  const target = normalizeBestiaryText(item.creature_name);
  if (!target) return null;
  const matches = (state.data.creatures || []).filter(creature => normalizeBestiaryText(creature.name) === target);
  return matches.length === 1 ? matches[0] : null;
}

function lootProvenance(item) {
  const creature = resolveLootCreature(item);
  if (!creature) return { creature: null, dungeon: null };
  return { creature, dungeon: resolveCreatureDungeon(creature) };
}

function getSimpleFamilyCollection(type) {
  ensureCodexFamilyUi();
  const ui = state.ui.codexFamilies[type];
  const q = normalizeBestiaryText(ui.search);
  let items = [...(state.data[type] || [])];
  if (ui.dungeonId && ["quests", "interactables", "brouhaha_effects"].includes(type)) {
    const dungeon = findById("dungeons", ui.dungeonId);
    items = dungeon ? items.filter(item => entityBelongsToDungeon(item, dungeon)) : [];
  }
  if (q) {
    items = items.filter(item => {
      let parts = [];
      if (type === "npcs") {
        parts = [item.name, item.race, item.role, item.tone, item.lore, ...tagsToArray(item.tags)];
      } else if (type === "quests") {
        parts = [item.name, item.description, item.objective, item.reward, item.npc_name, item.dungeon_name, questDifficultyMeta(item.difficulty)?.label, ...tagsToArray(item.tags)];
      } else if (type === "loot_items") {
        const rarity = lootRarityMeta(item);
        parts = [item.name, item.type, item.effect, item.creature_name, rarity?.label, ...tagsToArray(item.tags)];
      } else if (type === "interactables") {
        parts = [item.name, item.dungeon_name, item.type, item.hp, item.actions_allowed, item.effect, ...tagsToArray(item.tags)];
      } else if (type === "brouhaha_effects") {
        const scope = brouhahaScope(item);
        parts = [brouhahaReferenceLabel(item), item.level, scope.label, item.effect_text];
      }
      return normalizeBestiaryText(parts.filter(value => value !== null && value !== undefined && value !== "").join(" ")).includes(q);
    });
  }
  if (type === "brouhaha_effects") {
    return items.sort((a, b) => {
      const an = Number(a.level), bn = Number(b.level);
      const aFinite = Number.isFinite(an), bFinite = Number.isFinite(bn);
      if (aFinite && bFinite && an !== bn) return an - bn;
      if (aFinite !== bFinite) return aFinite ? -1 : 1;
      return brouhahaReferenceLabel(a).localeCompare(brouhahaReferenceLabel(b), "fr", { sensitivity: "base" });
    });
  }
  return items.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "fr", { sensitivity: "base" }));
}

function familyModeOptions(type) {
  if (type === "quests") return [
    { value: "list", label: "Liste", icon: "list" },
    { value: "cards", label: "Cartes", icon: "grid" }
  ];
  if (type === "brouhaha_effects") return [
    { value: "cards", label: "Cartes", icon: "grid" },
    { value: "list", label: "Liste", icon: "list" }
  ];
  return [
    { value: "gallery", label: "Galerie", icon: "grid" },
    { value: "list", label: "Liste", icon: "list" }
  ];
}

function resolveEntityDungeon(item) {
  if (!item) return null;
  const direct = item.dungeon_id ? findById("dungeons", item.dungeon_id) : null;
  if (direct) return direct;
  const target = normalizeBestiaryText(item.dungeon_name);
  if (!target) return null;
  const matches = (state.data.dungeons || []).filter(dungeon => normalizeBestiaryText(dungeon.name) === target);
  return matches.length === 1 ? matches[0] : null;
}

function interactableActions(item) {
  const raw = item?.actions_allowed;
  if (Array.isArray(raw)) return raw.map(value => String(value).trim()).filter(Boolean);
  const text = String(raw || "").trim();
  if (!text) return [];
  const parts = text.split(/[;,|]+/).map(value => value.trim()).filter(Boolean);
  return parts.length ? parts : [text];
}

function brouhahaReferenceLabel(item) {
  const explicit = String(item?.name || item?.label || item?.title || "").trim();
  if (explicit) return explicit;
  const level = item?.level === null || item?.level === undefined || item?.level === "" ? "—" : String(item.level);
  return `Effet niveau ${level}`;
}

function brouhahaScope(item) {
  const dungeon = resolveEntityDungeon(item);
  if (dungeon) return { label: dungeon.name || "Donjon", dungeon, universal: false, unresolved: false };
  const declared = String(item?.dungeon_name || "").trim();
  if (declared) return { label: declared, dungeon: null, universal: false, unresolved: true };
  if (item?.dungeon_id) return { label: "Donjon indisponible", dungeon: null, universal: false, unresolved: true };
  return { label: "Universel", dungeon: null, universal: true, unresolved: false };
}

function brouhahaIntensityClass(level) {
  const n = Number(level);
  if (!Number.isFinite(n)) return "unknown";
  if (n >= 10) return "critical";
  if (n >= 7) return "hot";
  if (n >= 4) return "loud";
  return "low";
}

function defaultBestiaryUi() {
  return { mode: "", search: "", dungeonId: "", category: "", menace: "", tags: [], sort: "name", direction: "asc", scrollTop: 0, selectedId: "", contextReturn: null };
}

function ensureBestiaryUi() {
  state.ui.bestiary = { ...defaultBestiaryUi(), ...(state.ui.bestiary || {}) };
  state.ui.bestiary.tags = Array.isArray(state.ui.bestiary.tags) ? state.ui.bestiary.tags.filter(Boolean) : [];
  state.ui.bestiary.contextReturn = state.ui.bestiary.contextReturn && typeof state.ui.bestiary.contextReturn === "object"
    ? state.ui.bestiary.contextReturn
    : null;
  if (!["gallery", "list", ""].includes(state.ui.bestiary.mode)) state.ui.bestiary.mode = "";
  if (!["name", "menace", "dungeon"].includes(state.ui.bestiary.sort)) state.ui.bestiary.sort = "name";
  if (!["asc", "desc"].includes(state.ui.bestiary.direction)) state.ui.bestiary.direction = "asc";
}

function snapshotBestiaryContext() {
  ensureBestiaryUi();
  const b = state.ui.bestiary;
  return {
    mode: b.mode,
    search: b.search,
    dungeonId: b.dungeonId,
    category: b.category,
    menace: b.menace,
    tags: [...b.tags],
    sort: b.sort,
    direction: b.direction,
    scrollTop: Math.max(0, Number(b.scrollTop || 0)),
    selectedId: b.selectedId
  };
}

function ensureCodexReturnStack() {
  state.ui.codexReturnStack = Array.isArray(state.ui.codexReturnStack)
    ? state.ui.codexReturnStack.filter(entry => entry && typeof entry === "object").slice(-12)
    : [];
  return state.ui.codexReturnStack;
}

function cloneCodexUiValue(value) {
  if (value === null || value === undefined) return value;
  try { return JSON.parse(JSON.stringify(value)); } catch (_) { return value; }
}

function ensureCodexContext() {
  const value = state.ui.codexContext;
  if (!value || typeof value !== "object" || value.kind !== "dungeon-see-all") {
    state.ui.codexContext = null;
    return null;
  }
  if (!value.sourceId || !value.targetType || !value.previousTargetState) {
    state.ui.codexContext = null;
    return null;
  }
  return value;
}

function snapshotCodexTargetState(type) {
  if (type === "creatures") {
    ensureBestiaryUi();
    return { kind: "bestiary", value: cloneCodexUiValue(state.ui.bestiary) };
  }
  ensureCodexFamilyUi();
  return { kind: "family", value: cloneCodexUiValue(state.ui.codexFamilies[type] || {}) };
}

function restoreCodexContextTarget(context) {
  if (!context?.previousTargetState) return;
  const snapshot = context.previousTargetState;
  if (context.targetType === "creatures" && snapshot.kind === "bestiary") {
    const previous = snapshot.value || {};
    state.ui.bestiary = {
      ...defaultBestiaryUi(),
      ...previous,
      tags: Array.isArray(previous.tags) ? [...previous.tags] : [],
      contextReturn: previous.contextReturn && typeof previous.contextReturn === "object"
        ? cloneCodexUiValue(previous.contextReturn)
        : null
    };
    state.ui.codexCreatureDungeonId = state.ui.bestiary.dungeonId || "";
    return;
  }
  if (snapshot.kind === "family" && state.ui.codexFamilies?.[context.targetType]) {
    const defaults = defaultCodexFamiliesUi()[context.targetType] || {};
    state.ui.codexFamilies[context.targetType] = { ...defaults, ...(snapshot.value || {}) };
  }
}

function clearCodexContext(restoreTarget = true) {
  const context = ensureCodexContext();
  if (!context) return null;
  if (restoreTarget) restoreCodexContextTarget(context);
  state.ui.codexContext = null;
  return context;
}

function openDungeonCollectionContext(targetType, dungeon, sourceScrollTop = 0) {
  const allowed = ["creatures", "quests", "interactables", "brouhaha_effects"];
  if (!allowed.includes(targetType) || !dungeon) return false;
  clearCodexContext(true);

  const linked = dungeonLinkedEntities(dungeon)[targetType] || [];
  const previousTargetState = snapshotCodexTargetState(targetType);
  state.ui.codexContext = {
    kind: "dungeon-see-all",
    sourceType: "dungeons",
    sourceId: String(dungeon.id || ""),
    sourceLabel: String(dungeon.name || "Donjon"),
    sourceScrollTop: Math.max(0, Number(sourceScrollTop || 0)),
    targetType,
    dungeonId: String(dungeon.id || ""),
    previousTargetState
  };

  const firstId = String(linked[0]?.id || "");
  if (targetType === "creatures") {
    ensureBestiaryUi();
    state.ui.bestiary.search = "";
    state.ui.bestiary.dungeonId = String(dungeon.id || "");
    state.ui.bestiary.category = "";
    state.ui.bestiary.menace = "";
    state.ui.bestiary.tags = [];
    state.ui.bestiary.scrollTop = 0;
    state.ui.bestiary.selectedId = firstId;
    state.ui.bestiary.contextReturn = null;
    state.ui.codexCreatureDungeonId = String(dungeon.id || "");
  } else {
    ensureCodexFamilyUi();
    const ui = state.ui.codexFamilies[targetType];
    ui.search = "";
    ui.scrollTop = 0;
    ui.selectedId = firstId;
    ui.dungeonId = String(dungeon.id || "");
  }

  state.ui.codexType = targetType;
  state.ui.codexSelectedId = firstId;
  state.ui.codexDetailOpen = false;
  state.ui.codexReturnStack = [];
  state.ui.globalSearch = "";
  return true;
}

function renderCodexContextReturn() {
  const context = ensureCodexContext();
  if (!context) return "";
  return `<div class="codex-context-return" role="status">
    <div><span>Collection préfiltrée</span><strong>${escapeHtml(getLabel(context.targetType))} · ${escapeHtml(context.sourceLabel || "Donjon")}</strong></div>
    <button class="ghost" type="button" data-action="codex-context-back">${shellIcon("back")}<span>Retour à ${escapeHtml(context.sourceLabel || "Donjon")}</span></button>
  </div>`;
}

function creatureTags(item) {
  return tagsToArray(item?.tags).filter(Boolean);
}

function creatureCategoryMeta(value) {
  const raw = String(value ?? "").trim();
  const cleaned = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const aliases = { special: "speciale", mini_bosses: "mini_boss", miniboss: "mini_boss" };
  const key = aliases[cleaned] || cleaned;
  if (CREATURE_CATEGORY_META[key]) return { key, ...CREATURE_CATEGORY_META[key], known: true };
  return {
    key: "unknown",
    label: raw || "Catégorie non renseignée",
    sigil: "Sigil_Basique.webp",
    known: false
  };
}

function normalizeBestiaryText(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function bestiaryTagOptions() {
  return [...new Set((state.data.creatures || []).flatMap(creatureTags))]
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b), "fr", { sensitivity: "base" }));
}

function bestiaryMenaceOptions() {
  return [...new Set((state.data.creatures || []).map(item => Number(item.menace ?? 0)).filter(Number.isFinite))]
    .sort((a, b) => a - b);
}

function bestiaryHasActiveFilters() {
  ensureBestiaryUi();
  const b = state.ui.bestiary;
  return Boolean(b.search || b.dungeonId || b.category || b.menace !== "" || b.tags.length);
}

function getBestiaryCreatures() {
  ensureBestiaryUi();
  const b = state.ui.bestiary;
  const q = normalizeBestiaryText(b.search);
  const dungeon = b.dungeonId ? findById("dungeons", b.dungeonId) : null;
  const selectedTags = b.tags.map(normalizeBestiaryText);
  let list = [...(state.data.creatures || [])];

  if (q) {
    list = list.filter(item => {
      const meta = creatureCategoryMeta(item.category);
      const haystack = normalizeBestiaryText([
        item.name,
        item.dungeon_name,
        meta.label,
        item.special_attack_name,
        item.ai_behavior,
        ...creatureTags(item)
      ].filter(Boolean).join(" "));
      return haystack.includes(q);
    });
  }

  if (b.dungeonId) {
    const dungeonName = normalizeBestiaryText(dungeon?.name);
    list = list.filter(item =>
      String(item.dungeon_id || "") === String(b.dungeonId) ||
      (dungeonName && normalizeBestiaryText(item.dungeon_name) === dungeonName)
    );
  }

  if (b.category) {
    list = list.filter(item => creatureCategoryMeta(item.category).key === b.category);
  }

  if (b.menace !== "") {
    list = list.filter(item => String(Number(item.menace ?? 0)) === String(b.menace));
  }

  if (selectedTags.length) {
    list = list.filter(item => {
      const tags = creatureTags(item).map(normalizeBestiaryText);
      return selectedTags.every(tag => tags.includes(tag));
    });
  }

  const direction = b.direction === "desc" ? -1 : 1;
  list.sort((a, bItem) => {
    let cmp = 0;
    if (b.sort === "menace") {
      cmp = Number(a.menace ?? 0) - Number(bItem.menace ?? 0);
    } else if (b.sort === "dungeon") {
      cmp = String(a.dungeon_name || "").localeCompare(String(bItem.dungeon_name || ""), "fr", { sensitivity: "base" });
    } else {
      cmp = String(a.name || "").localeCompare(String(bItem.name || ""), "fr", { sensitivity: "base" });
    }
    if (!cmp) cmp = String(a.name || "").localeCompare(String(bItem.name || ""), "fr", { sensitivity: "base" });
    return cmp * direction;
  });

  return list;
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
  ensureBestiaryUi();
  ensureCodexFamilyUi();
  ensureCodexReturnStack();
  ensureCodexContext();
  ensureSessionContext();
  if (!state.ui.bestiary.mode) {
    state.ui.bestiary.mode = typeof window !== "undefined" && window.matchMedia?.("(max-width: 767px)").matches ? "list" : "gallery";
  }
  if (!state.ui.bestiary.dungeonId && state.ui.codexCreatureDungeonId) {
    state.ui.bestiary.dungeonId = state.ui.codexCreatureDungeonId;
  }
  if (!state.ui.bestiary.selectedId) {
    state.ui.bestiary.selectedId = state.ui.codexSelectedId || state.data.creatures?.[0]?.id || "";
  }
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
  ensureBestiaryUi();
  ensureCodexFamilyUi();
  if (!state.data.dungeons?.some(item => String(item.id) === String(state.ui.codexFamilies.dungeons.selectedId))) {
    state.ui.codexFamilies.dungeons.selectedId = state.data.dungeons?.[0]?.id || "";
  }
  for (const type of ["npcs", "quests", "loot_items", "interactables", "brouhaha_effects"]) {
    if (!(state.data[type] || []).some(item => String(item.id) === String(state.ui.codexFamilies[type].selectedId))) {
      state.ui.codexFamilies[type].selectedId = state.data[type]?.[0]?.id || "";
    }
  }
  const heroGroups = buildHeroGroups();
  if (!heroGroups.some(group => group.key === state.ui.codexFamilies.heroes.selectedBase)) {
    state.ui.codexFamilies.heroes.selectedBase = heroGroups[0]?.key || "";
  }
  if (!state.data.creatures?.some(x => x.id === state.ui.bestiary.selectedId)) {
    state.ui.bestiary.selectedId = state.data.creatures?.[0]?.id || "";
  }
  if (state.ui.codexType === "creatures" && state.ui.bestiary.selectedId) {
    state.ui.codexSelectedId = state.ui.bestiary.selectedId;
  }
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
    const variants = [["original", asset.blob],["preview", asset.preview_blob],["thumb", asset.thumb_blob],["transparent", asset.transparent_blob]];
    for (const [kind, blob] of variants) {
      if (!blob) continue;
      const url = URL.createObjectURL(blob);
      state.mediaUrlCache.set(`${asset.id}:${kind}`, url);
      state.mediaUrlReverse.set(`${asset.id}:${kind}`, url);
    }
  }
}

function mediaOriginalUrlForAsset(asset) {
  if (!asset) return "";
  return state.mediaUrlCache.get(`${asset.id}:original`) || asset.path || "";
}

function mediaTransparentUrlForAsset(asset) {
  if (!asset) return "";
  return state.mediaUrlCache.get(`${asset.id}:transparent`) || asset.transparent_path || "";
}

function mediaUrlForAsset(asset, variant = false) {
  if (!asset) return "";
  const kind = variant === true ? "thumb" : variant === false ? "preview" : String(variant || "preview");
  if (kind === "original") return mediaOriginalUrlForAsset(asset);
  if (kind === "transparent") return mediaTransparentUrlForAsset(asset);
  if (kind === "thumb") return state.mediaUrlCache.get(`${asset.id}:thumb`) || asset.thumb_path || state.mediaUrlCache.get(`${asset.id}:preview`) || asset.preview_path || mediaOriginalUrlForAsset(asset);
  return state.mediaUrlCache.get(`${asset.id}:preview`) || asset.preview_path || mediaOriginalUrlForAsset(asset);
}

function imageUrlForEntity(entity) {
  if (!entity?.image_path) return "";
  const asset = (state.data.media_assets || []).find(m =>
    m.path === entity.image_path || m.preview_path === entity.image_path || m.thumb_path === entity.image_path || m.transparent_path === entity.image_path
  );
  if (asset?.transparent_blob && asset.transparent_review_status === "approved" && asset.transparent_audit?.pass === true) {
    return mediaTransparentUrlForAsset(asset) || mediaUrlForAsset(asset, false);
  }
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
  return globalSearchIndexText(type, item);
}

function getFilteredList(type, scope = "search") {
  if (type === "creatures" && scope === "codex") return getBestiaryCreatures();
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
    if (type === "quests") {
      const dungeonId = scope === "codex" ? state.ui.codexQuestDungeonId : state.ui.workshopQuestDungeonId;
      if (dungeonId) list = list.filter(item => item.dungeon_id === dungeonId);
    }
  }

  if (type === "creatures" && (scope === "codex" || scope === "atelier")) {
    const categoryOrder = { basique: 1, tactique: 2, speciale: 3, brute: 4, mini_boss: 5, boss: 6 };
    list = [...list].sort((a, b) => {
      const d = String(a.dungeon_name || "").localeCompare(String(b.dungeon_name || ""), "fr", { sensitivity: "base" });
      if (d) return d;
      const ca = categoryOrder[String(a.category || "").toLowerCase()] ?? 99;
      const cb = categoryOrder[String(b.category || "").toLowerCase()] ?? 99;
      if (ca !== cb) return ca - cb;
      return String(a.name || "").localeCompare(String(b.name || ""), "fr", { sensitivity: "base" });
    });
  }
  if (type === "heroes" && (scope === "codex" || scope === "atelier")) {
    list = [...list].sort((a, b) => {
      const n = String(a.hero_base_name || a.name || "").localeCompare(String(b.hero_base_name || b.name || ""), "fr", { sensitivity: "base" });
      if (n) return n;
      return Number(a.level || 0) - Number(b.level || 0);
    });
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
      <div class="image-viewer-panel" role="dialog" aria-modal="true" aria-label="${escapeHtml(alt || "Image agrandie")}" tabindex="-1">
        <button class="ghost image-viewer-close" type="button" data-action="close-image-viewer" aria-label="Fermer l’image agrandie">✕</button>
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
      item.difficulty = clamp(row.difficulty ?? existing?.difficulty ?? 1, 1, 6);
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


const V6_ICON_PATH = "assets/ui-v6/icons/";

function shellIcon(name, className = "") {
  // Navigation shell: Lucide icons only.
  const icons = {
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    book: '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V5a2 2 0 0 1 2-2h5a3 3 0 0 1 3 3v15a3 3 0 0 0-3-3Z"/><path d="M21 18a1 1 0 0 0 1-1V5a2 2 0 0 0-2-2h-5a3 3 0 0 0-3 3v15a3 3 0 0 1 3-3Z"/>',
    game: '<rect width="12" height="12" x="2" y="10" rx="2"/><path d="m14.92 14.92 4.5-4.5a2.12 2.12 0 0 0 0-3l-2.34-2.34a2.12 2.12 0 0 0-3 0L9.58 9.58"/><path d="m6 14 .01 0"/><path d="m10 18 .01 0"/><path d="m17 7 .01 0"/><path d="m14 10 .01 0"/>',
    waveform: '<path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>',
    scroll: '<path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h8a3 3 0 0 0 3-3v-1H7v1a3 3 0 0 1-6 0V5a2 2 0 0 1 2-2h1"/>',
    tool: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
    transfer: '<path d="m8 3-4 4 4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>',
    journal: '<path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9.5 8h5"/><path d="M9.5 12H16"/><path d="M9.5 16H14"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    grid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    list: '<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
    more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    wifi: '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>'
  };
  return '<svg class="ui-icon '+className+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+(icons[name] || icons.more)+'</svg>';
}
function shellEmblem(file, className = "nav-emblem") {
  return '<img class="'+className+'" src="'+V6_ICON_PATH+file+'" alt="" aria-hidden="true">';
}
function navButton(view,label,iconHtml){
  const active=state.ui.view===view?"active":"";
  return '<button class="navbtn '+active+'" data-action="set-view" data-view="'+view+'" '+(active?'aria-current="page"':'')+'>'+iconHtml+'<span class="nav-label">'+label+'</span></button>';
}
function mobileNavButton(view,label,iconHtml){
  const active=state.ui.view===view?"active":"";
  return '<button class="mobile-nav-item '+active+'" data-action="set-view" data-view="'+view+'" '+(active?'aria-current="page"':'')+'>'+iconHtml+'<span>'+label+'</span></button>';
}
function renderShell(content){
  const gameActive=["generator","brouhaha"].includes(state.ui.view);
  const moreActive=["atelier","media","import"].includes(state.ui.view);
  return [
    '<div class="v6-app">',
      '<aside class="v6-sidebar" aria-label="Navigation principale">',
        '<button class="brand v6-brand" data-action="go-home" data-view="home" title="Accueil Gargottex"><img src="assets/images/logo-512.png" alt=""><div class="brand-copy"><b>Gargottex</b><span>Codex & outils de partie</span></div></button>',
        '<div class="nav-title">Principal</div><nav class="v6-nav">',
          navButton("home","Accueil",shellIcon("home")),
          navButton("codex","Codex",shellIcon("book")),
          navButton("generator","Générateur",shellIcon("game")),
          navButton("brouhaha","Brouhaha",shellIcon("waveform")),
          navButton("quests","Quêtes",shellIcon("scroll")),
        '</nav><div class="nav-title">Administration</div><nav class="v6-nav">',
          navButton("atelier","Atelier",shellIcon("tool")),
          navButton("media","Médias",shellIcon("image")),
          navButton("import","Import / Export",shellIcon("transfer")),
        '</nav><div class="side-foot"><span class="local-dot"></span><span class="nav-label">Local-first · hors ligne</span></div>',
      '</aside>',
      '<div class="shell"><header class="topbar">',
        '<button class="mobile-brand" data-action="go-home" data-view="home" aria-label="Accueil Gargottex"><img src="assets/images/logo-192.png" alt=""></button>',
        '<div class="search-wrap" role="search"><span class="search-leading">'+shellIcon("search")+'</span><input class="search" data-action="search" type="search" role="searchbox" aria-label="Recherche globale" autocomplete="off" placeholder="Rechercher dans le Codex…" value="'+escapeHtml(state.ui.globalSearch)+'">'+(state.ui.globalSearch?renderSearchResults():"")+'</div>',
        '<div class="topbar-right"><span class="offline-badge" title="Données locales disponibles">'+shellIcon("wifi")+'<span>Local</span></span><button class="ghost topbar-action" data-action="toggle-journal" aria-label="Ouvrir le journal">'+shellIcon("journal")+'<span>Journal</span></button></div>',
      '</header><main class="page v6-main" id="main-content">'+content+'</main>',
      '<aside class="toast-stack" aria-live="polite" aria-atomic="true">'+state.toasts.map(t=>'<div class="toast '+t.tone+'">'+escapeHtml(t.message)+'</div>').join("")+'</aside>',
      renderImageViewer(), state.ui.journalOpen?renderJournalDrawer():"",
      '<nav class="mobile-bottom" aria-label="Navigation téléphone">',
        mobileNavButton("home","Accueil",shellIcon("home")),
        mobileNavButton("codex","Codex",shellIcon("book")),
        '<details class="mobile-nav-group '+(gameActive?"active":"")+'"><summary>'+shellIcon("game")+'<span>Jeu</span></summary><div class="mobile-nav-popover" role="menu"><button data-action="set-view" data-view="generator" role="menuitem">'+shellIcon("game")+'<span>Générateur</span></button><button data-action="set-view" data-view="brouhaha" role="menuitem">'+shellIcon("waveform")+'<span>Brouhaha</span></button></div></details>',
        mobileNavButton("quests","Quêtes",shellIcon("scroll")),
        '<details class="mobile-nav-group '+(moreActive?"active":"")+'"><summary>'+shellIcon("more")+'<span>Plus</span></summary><div class="mobile-nav-popover mobile-nav-popover-right" role="menu"><button data-action="set-view" data-view="atelier" role="menuitem">'+shellIcon("tool")+'<span>Atelier</span></button><button data-action="set-view" data-view="media" role="menuitem">'+shellIcon("image")+'<span>Médias</span></button><button data-action="set-view" data-view="import" role="menuitem">'+shellIcon("transfer")+'<span>Import / Export</span></button><button data-action="toggle-journal" role="menuitem">'+shellIcon("journal")+'<span>Journal</span></button></div></details>',
      '</nav></div></div>'
  ].join("");
}

const CODEX_GLOBAL_SEARCH_TYPES = [
  "creatures",
  "dungeons",
  "heroes",
  "npcs",
  "quests",
  "loot_items",
  "interactables",
  "brouhaha_effects"
];

function globalSearchIndexText(type, item) {
  if (!item) return "";
  let parts = [];
  if (type === "creatures") {
    const category = creatureCategoryMeta(item.category);
    parts = [
      item.name, item.dungeon_name, category.label, item.menace, item.pv, item.atk, item.def,
      item.zone, item.actions, item.special_attack_name, item.ai_behavior, item.ai_target_priority,
      item.lore, item.socle, ...tagsToArray(item.tags)
    ];
  } else if (type === "dungeons") {
    parts = [item.name, item.description, item.boss_name, ...tagsToArray(item.tags)];
  } else if (type === "heroes") {
    parts = [
      item.hero_base_name, item.name, item.level, `N${item.level ?? ""}`, item.role, item.title,
      item.ability_text, item.effect_text, item.brouhaha, ...tagsToArray(item.tags)
    ];
  } else if (type === "npcs") {
    parts = [item.name, item.race, item.role, item.tone, item.lore, ...tagsToArray(item.tags)];
  } else if (type === "quests") {
    parts = [
      item.name, item.description, item.objective, item.reward, item.npc_name, item.dungeon_name,
      questDifficultyMeta(item.difficulty)?.label, item.difficulty, ...tagsToArray(item.tags)
    ];
  } else if (type === "loot_items") {
    parts = [
      item.name, item.type, item.effect, item.gold_value, item.creature_name,
      lootRarityMeta(item)?.label, ...tagsToArray(item.tags)
    ];
  } else if (type === "interactables") {
    parts = [item.name, item.dungeon_name, item.type, item.hp, item.actions_allowed, item.effect, ...tagsToArray(item.tags)];
  } else if (type === "brouhaha_effects") {
    const scope = brouhahaScope(item);
    parts = [brouhahaReferenceLabel(item), item.level, scope.label, item.effect_text];
  } else {
    parts = [
      item.name, item.title, item.hero_base_name, item.label, item.file_name, item.path,
      item.description, item.effect, item.effect_text, item.lore, ...tagsToArray(item.tags)
    ];
  }
  return normalizeBestiaryText(parts.filter(value => value !== null && value !== undefined && value !== "").join(" "));
}

function globalSearchResultIcon(type, item) {
  if (type === "creatures") return creatureCategoryMeta(item.category).sigil;
  const icons = {
    dungeons: "Icone_Gameplay_DONJON.webp",
    heroes: "Icone_Entite_HEROS.webp",
    npcs: "Icone_Entite_PNJ.webp",
    quests: "Icone_Entite_QUETE.webp",
    loot_items: "Icone_Gameplay_BUTIN.webp",
    interactables: "Icone_Entite_OBJET_INTERACTIF.webp",
    brouhaha_effects: "Icone_Entite_OBJET_BROUHAHA.webp"
  };
  return icons[type] || "Sigil_Basique.webp";
}

function globalSearchResultMeta(type, item) {
  if (type === "creatures") {
    const category = creatureCategoryMeta(item.category);
    return [category.label, item.dungeon_name, item.menace !== null && item.menace !== undefined ? `Menace ${item.menace}` : ""].filter(Boolean).join(" · ");
  }
  if (type === "dungeons") return item.boss_name ? `Boss · ${item.boss_name}` : "Donjon";
  if (type === "heroes") return [item.level !== null && item.level !== undefined ? `N${item.level}` : "", item.role, item.title].filter(Boolean).join(" · ");
  if (type === "npcs") return [item.race, item.role].filter(Boolean).join(" · ");
  if (type === "quests") return [questDifficultyMeta(item.difficulty)?.label, item.npc_name, item.dungeon_name].filter(Boolean).join(" · ");
  if (type === "loot_items") return [lootRarityMeta(item)?.label, item.type, item.creature_name].filter(Boolean).join(" · ");
  if (type === "interactables") return [item.type, item.dungeon_name].filter(Boolean).join(" · ");
  if (type === "brouhaha_effects") {
    const scope = brouhahaScope(item);
    return [item.level !== null && item.level !== undefined ? `Niveau ${item.level}` : "Niveau non renseigné", scope.label].join(" · ");
  }
  return "";
}

function buildGlobalSearchResults(query) {
  const q = normalizeBestiaryText(query);
  if (!q) return [];
  const results = [];

  for (const type of CODEX_GLOBAL_SEARCH_TYPES) {
    if (type === "heroes") {
      for (const group of buildHeroGroups()) {
        const matching = group.levels.filter(level =>
          globalSearchIndexText("heroes", level).includes(q) ||
          normalizeBestiaryText(group.baseName).includes(q)
        );
        if (!matching.length) continue;
        const remembered = Number(state.ui.codexFamilies?.heroes?.levelByBase?.[group.key]);
        const target = matching.find(level => Number(level.level) === remembered) || matching[0];
        results.push({
          type,
          id: String(target.id || ""),
          title: group.baseName,
          meta: globalSearchResultMeta(type, target),
          icon: globalSearchResultIcon(type, target)
        });
      }
      continue;
    }

    for (const item of state.data[type] || []) {
      if (!globalSearchIndexText(type, item).includes(q)) continue;
      results.push({
        type,
        id: String(item.id || ""),
        title: codexEntityTitle(type, item),
        meta: globalSearchResultMeta(type, item),
        icon: globalSearchResultIcon(type, item)
      });
    }
  }

  return results.sort((a, b) => {
    const typeOrder = CODEX_GLOBAL_SEARCH_TYPES.indexOf(a.type) - CODEX_GLOBAL_SEARCH_TYPES.indexOf(b.type);
    if (typeOrder) return typeOrder;
    return String(a.title || "").localeCompare(String(b.title || ""), "fr", { sensitivity: "base" });
  });
}

function renderSearchResults() {
  const results = buildGlobalSearchResults(state.ui.globalSearch);
  if (!state.ui.globalSearch.trim()) return "";
  if (!results.length) return `<div class="search-results global-codex-results" id="global-codex-search-results"><div class="global-search-empty">Aucun résultat dans le Codex local.</div></div>`;

  const sections = CODEX_GLOBAL_SEARCH_TYPES.map(type => {
    const rows = results.filter(result => result.type === type);
    if (!rows.length) return "";
    return `<section class="global-search-group">
      <header><strong>${escapeHtml(getLabel(type))}</strong><span>${rows.length}</span></header>
      <div>
        ${rows.map(result => `
          <button class="global-search-result" type="button" data-action="jump-codex" data-type="${escapeHtml(result.type)}" data-id="${escapeHtml(result.id)}">
            <img src="${V6_ICON_PATH}${escapeHtml(result.icon)}" alt="" aria-hidden="true">
            <span><b>${escapeHtml(result.title || getLabel(type))}</b><small>${escapeHtml(result.meta || getLabel(type))}</small></span>
            <em>${escapeHtml(getLabel(type))}</em>
          </button>
        `).join("")}
      </div>
    </section>`;
  }).join("");

  return `<div class="search-results global-codex-results" id="global-codex-search-results" role="region" aria-label="Résultats de recherche Codex">
    <div class="global-search-summary"><strong>${results.length}</strong><span>résultat${results.length > 1 ? "s" : ""} local${results.length > 1 ? "aux" : ""}</span></div>
    ${sections}
  </div>`;
}

function renderHome() {
  const session = ensureSessionContext();
  const dungeon = sessionDungeon(session);
  const budgets = sessionFloorBudgets(session);
  const budget = sessionBudget(session);
  const encounter = session.encounter;
  const groups = sessionEncounterCreatureGroups(encounter);
  const totalOccurrences = groups.reduce((sum, group) => sum + group.total, 0);
  const remainingOccurrences = groups.reduce((sum, group) => sum + group.remaining, 0);
  const quest = findById("quests", session.questId);
  const currentBrouhaha = session.brouhaha.current;
  const bertholdAdvice = BERTHOLD_ADVICES[bertholdAdviceIndex] || BERTHOLD_ADVICES[0];
  const dungeonImage = dungeon ? imageUrlForEntity(dungeon) : "";
  const heroImage = dungeonImage || "assets/images/logo-source.jpeg";

  const editorialHead = `
    <header class="home-editorial-head">
      <h1>Gargottex V6</h1>
    </header>
  `;

  const bertholdNote = `
    <aside class="home-berthold-note" aria-label="Le conseil de Berthold">
      <span>Le conseil de Berthold</span>
      <strong>${escapeHtml(bertholdAdvice)}</strong>
      <small>Berthold · La Chope qui colle</small>
    </aside>
  `;

  if (!session.active) {
    return renderShell(`
      <section class="session-home-v6 no-session home-polish-v6">
        ${editorialHead}
        <div class="home-polish-grid">
          <article class="home-hero-v6 home-hero-counter">
            <img class="home-hero-backdrop" src="assets/images/logo-source.jpeg" alt="" aria-hidden="true">
            <div class="home-hero-shade" aria-hidden="true"></div>
            <div class="home-hero-copy">
              <h2>${escapeHtml(HOME_TAGLINE)}</h2>
              <div class="home-hero-actions">
                <button class="primary" type="button" data-action="set-view" data-view="codex">Ouvrir le Codex</button>
                <button class="ghost" type="button" data-action="set-view" data-view="generator">Préparer la partie</button>
              </div>
            </div>
            ${bertholdNote}
          </article>

          <aside class="home-side-v6">
            ${renderSessionStartCard("Accueil")}
            <section class="home-local-card panel">
              <span class="eyebrow">État local</span>
              <div><i aria-hidden="true"></i><strong>Disponible hors ligne</strong></div>
              <p>Le Codex et les outils essentiels restent accessibles sans connexion. Les données de partie restent d’abord ici.</p>
            </section>
          </aside>
        </div>

        <div class="session-home-shortcuts home-quick-links">
          <button type="button" data-action="set-view" data-view="codex"><img src="${V6_ICON_PATH}Sigil_Basique.webp" alt=""><span><b>Explorer le Codex</b><small>Bestiaire, Donjons, Héros et références</small></span></button>
          <button type="button" data-action="set-view" data-view="generator"><img src="${V6_ICON_PATH}Icone_Gameplay_ACTION.webp" alt=""><span><b>Générateur</b><small>Préparer la prochaine rencontre</small></span></button>
          <button type="button" data-action="set-view" data-view="brouhaha"><img src="${V6_ICON_PATH}Icone_Entite_OBJET_BROUHAHA.webp" alt=""><span><b>Brouhaha</b><small>Niveau, effet et historique</small></span></button>
          <button type="button" data-action="set-view" data-view="quests"><img src="${V6_ICON_PATH}Icone_Entite_QUETE.webp" alt=""><span><b>Quête de session</b><small>Tirage court lié au Donjon</small></span></button>
        </div>
      </section>
    `);
  }

  return renderShell(`
    <section class="session-home-v6 active-session home-polish-v6">
      ${editorialHead}
      <div class="home-polish-grid active">
        <article class="home-hero-v6 home-hero-dungeon">
          <img class="home-hero-backdrop" src="${escapeHtml(heroImage)}" alt="" aria-hidden="true">
          <div class="home-hero-shade" aria-hidden="true"></div>
          <div class="home-hero-copy">
            <span class="eyebrow">Partie en cours</span>
            <h2>${escapeHtml(dungeon?.name || "Donjon indisponible")}</h2>
            <p>Étage ${session.floorIndex + 1}${budget === null ? "" : ` · budget ${escapeHtml(String(budget))}`} · mode ${escapeHtml(sessionModeLabel(session.mode))}</p>
            <div class="home-hero-actions">
              <button class="primary" type="button" data-action="set-view" data-view="generator">Reprendre la rencontre</button>
              ${dungeon ? `<button class="ghost" type="button" data-action="jump-codex" data-type="dungeons" data-id="${escapeHtml(String(dungeon.id || ""))}">Voir le Donjon</button>` : ""}
            </div>
          </div>
          ${bertholdNote}
        </article>

        <aside class="home-side-v6">
          <section class="home-session-board panel">
            <span class="eyebrow">Plateau de table</span>
            <h2>${escapeHtml(dungeon?.name || "Partie en cours")}</h2>
            <p class="home-session-meta">Étage ${session.floorIndex + 1}${budget === null ? "" : ` · Budget ${escapeHtml(String(budget))}`} · ${escapeHtml(sessionModeLabel(session.mode))}</p>

            <div class="session-dashboard-v6 home-session-objects">
              <button class="session-dashboard-card encounter home-session-object" type="button" data-action="set-view" data-view="generator">
                <img src="${V6_ICON_PATH}Icone_Gameplay_MENACE.webp" alt="" aria-hidden="true">
                <span><b>Rencontre</b><small>${encounter ? (remainingOccurrences ? `${remainingOccurrences} occurrence(s) restante(s)` : "Rencontre terminée") : "Aucune rencontre active"}</small></span>
              </button>
              <button class="session-dashboard-card noise home-session-object" type="button" data-action="set-view" data-view="brouhaha">
                <img src="${V6_ICON_PATH}Icone_Entite_OBJET_BROUHAHA.webp" alt="" aria-hidden="true">
                <span><b>Brouhaha ${escapeHtml(String(session.brouhaha.level))} / 12</b><small>${currentBrouhaha ? escapeHtml(currentBrouhaha.text) : "Aucun effet courant"}</small></span>
              </button>
              <button class="session-dashboard-card quest home-session-object" type="button" data-action="set-view" data-view="quests">
                <img src="${V6_ICON_PATH}Icone_Entite_QUETE.webp" alt="" aria-hidden="true">
                <span><b>Quête ${quest ? "active" : "de session"}</b><small>${escapeHtml(quest?.name || "Aucune quête tirée")}</small></span>
              </button>
            </div>

            <div class="session-safe-controls home-session-safe-controls">
              <label><span>Donjon actif</span><select data-action="session-set-dungeon">
                ${(state.data.dungeons || []).map(item => `<option value="${escapeHtml(String(item.id || ""))}" ${String(item.id) === String(session.dungeonId) ? "selected" : ""}>${escapeHtml(item.name || "Donjon")}</option>`).join("")}
              </select></label>
              <label><span>Étage</span><select data-action="session-set-floor" ${budgets.length ? "" : "disabled"}>
                ${budgets.map((value,index)=>`<option value="${index}" ${index===session.floorIndex?"selected":""}>Étage ${index+1}${value === null ? "" : ` · budget ${escapeHtml(String(value))}`}</option>`).join("")}
              </select></label>
            </div>

            <button class="danger home-session-end" type="button" data-action="session-end">Terminer la partie</button>
          </section>

          <section class="home-local-card panel">
            <span class="eyebrow">État local</span>
            <div><i aria-hidden="true"></i><strong>Disponible hors ligne</strong></div>
            <p>La session et le Codex restent pilotés localement, sans interrompre la table si le réseau disparaît.</p>
          </section>
        </aside>
      </div>

      <div class="session-home-shortcuts home-quick-links">
        <button type="button" data-action="set-view" data-view="codex"><img src="${V6_ICON_PATH}Sigil_Basique.webp" alt=""><span><b>Explorer le Codex</b><small>Retrouver une règle ou une référence</small></span></button>
        <button type="button" data-action="set-view" data-view="generator"><img src="${V6_ICON_PATH}Icone_Gameplay_ACTION.webp" alt=""><span><b>Générateur</b><small>Composer la prochaine salle</small></span></button>
        <button type="button" data-action="set-view" data-view="brouhaha"><img src="${V6_ICON_PATH}Icone_Entite_OBJET_BROUHAHA.webp" alt=""><span><b>Brouhaha</b><small>Niveau et effets de session</small></span></button>
        <button type="button" data-action="set-view" data-view="quests"><img src="${V6_ICON_PATH}Icone_Entite_QUETE.webp" alt=""><span><b>Quête de session</b><small>Tirage rapide du Donjon</small></span></button>
      </div>
    </section>
  `);
}
function statCard(label, value, icon) {
  return `<div class="stat-card"><div class="stat-icon">${icon}</div><div><div class="stat-value">${value}</div><div class="stat-label">${label}</div></div></div>`;
}

function renderCodexTabs(type) {
  return `<div class="segmented wrap codex-family-tabs">
    ${ENTITY_ORDER.map(t => `<button class="tab ${t === type ? "active" : ""}" data-action="set-codex-type" data-type="${t}">${getLabel(t)}</button>`).join("")}
  </div>`;
}

function renderCreatureCategoryChip(item) {
  const meta = creatureCategoryMeta(item.category);
  return `<span class="bestiary-category-chip ${meta.key}"><img src="${V6_ICON_PATH}${meta.sigil}" alt="" aria-hidden="true"><span>${escapeHtml(meta.label)}</span></span>`;
}

function renderBestiaryGalleryCard(item) {
  const meta = creatureCategoryMeta(item.category);
  const image = imageUrlForEntity(item);
  const selected = String(state.ui.bestiary.selectedId || "") === String(item.id || "");
  return `
    <button class="bestiary-gallery-card ${meta.key} ${selected ? "selected" : ""}" data-action="select-codex" data-type="creatures" data-id="${escapeHtml(String(item.id || ""))}" aria-label="Ouvrir ${escapeHtml(item.name || "Créature")}" style="--dungeon-accent:${safeCreatureAccent(item)}">
      <div class="bestiary-gallery-media">
        ${image ? `<img src="${escapeHtml(image)}" alt="Illustration de ${escapeHtml(item.name || "la créature")}" loading="lazy">` : `<div class="bestiary-media-fallback"><img src="${V6_ICON_PATH}${meta.sigil}" alt=""><span>Visuel indisponible</span></div>`}
        <img class="bestiary-card-sigil" src="${V6_ICON_PATH}${meta.sigil}" alt="" aria-hidden="true">
      </div>
      <div class="bestiary-gallery-copy">
        <h3>${escapeHtml(item.name || "Créature sans nom")}</h3>
        <div class="bestiary-dungeon-line"><img src="${V6_ICON_PATH}Icone_Gameplay_DONJON.webp" alt="" aria-hidden="true"><span>${escapeHtml(item.dungeon_name || "Donjon non renseigné")}</span></div>
        <div class="bestiary-card-meta">
          ${renderCreatureCategoryChip(item)}
          <span class="bestiary-menace-chip"><img src="${V6_ICON_PATH}Icone_Gameplay_MENACE.webp" alt="" aria-hidden="true">Menace ${escapeHtml(String(item.menace ?? "—"))}</span>
        </div>
      </div>
    </button>`;
}

function renderBestiaryListRow(item) {
  const meta = creatureCategoryMeta(item.category);
  const image = imageUrlForEntity(item);
  const selected = String(state.ui.bestiary.selectedId || "") === String(item.id || "");
  const stat = (icon, value, label) => `<span class="bestiary-mini-stat"><img src="${V6_ICON_PATH}${icon}" alt="" aria-hidden="true"><b>${escapeHtml(String(value ?? "—"))}</b><small>${label}</small></span>`;
  return `
    <button class="bestiary-list-row ${meta.key} ${selected ? "selected" : ""}" data-action="select-codex" data-type="creatures" data-id="${escapeHtml(String(item.id || ""))}" style="--dungeon-accent:${safeCreatureAccent(item)}">
      <div class="bestiary-list-thumb">
        ${image ? `<img src="${escapeHtml(image)}" alt="Illustration de ${escapeHtml(item.name || "la créature")}" loading="lazy">` : `<div class="bestiary-media-fallback compact"><img src="${V6_ICON_PATH}${meta.sigil}" alt=""></div>`}
      </div>
      <div class="bestiary-list-identity">
        <h3>${escapeHtml(item.name || "Créature sans nom")}</h3>
        <div class="bestiary-dungeon-line"><img src="${V6_ICON_PATH}Icone_Gameplay_DONJON.webp" alt="" aria-hidden="true"><span>${escapeHtml(item.dungeon_name || "Donjon non renseigné")}</span></div>
        ${renderCreatureCategoryChip(item)}
      </div>
      <div class="bestiary-list-stats">
        ${stat("Icone_Gameplay_PV.webp", item.pv, "PV")}
        ${stat("Icone_Gameplay_ATK.webp", item.atk, "ATK")}
        ${stat("Icone_Gameplay_DEF.webp", item.def, "DEF")}
        ${stat("Icone_Gameplay_MENACE.webp", item.menace, "Menace")}
      </div>
    </button>`;
}

function renderBestiaryTagFilter() {
  const selected = state.ui.bestiary.tags;
  const options = bestiaryTagOptions();
  return `
    <details class="bestiary-tags-filter">
      <summary>Tags${selected.length ? ` · ${selected.length}` : ""}</summary>
      <div class="bestiary-tags-menu">
        ${options.length ? options.map(tag => `<label><input type="checkbox" data-action="bestiary-tag" value="${escapeHtml(tag)}" ${selected.includes(tag) ? "checked" : ""}><span>${escapeHtml(tag)}</span></label>`).join("") : `<span class="muted small">Aucun tag disponible.</span>`}
      </div>
    </details>`;
}

const RELATION_STORE_ALIASES = {
  creature: "creatures", creatures: "creatures",
  dungeon: "dungeons", dungeons: "dungeons", donjon: "dungeons", donjons: "dungeons",
  hero: "heroes", heroes: "heroes", heros: "heroes",
  npc: "npcs", npcs: "npcs", pnj: "npcs",
  quest: "quests", quests: "quests", quete: "quests", quetes: "quests",
  loot: "loot_items", loot_item: "loot_items", loot_items: "loot_items",
  interactable: "interactables", interactables: "interactables", objet: "interactables", objets: "interactables",
  brouhaha: "brouhaha_effects", brouhaha_effect: "brouhaha_effects", brouhaha_effects: "brouhaha_effects",
  media: "media_assets", medias: "media_assets", media_asset: "media_assets", media_assets: "media_assets"
};

function relationStore(value) {
  return RELATION_STORE_ALIASES[normalizeBestiaryText(value).replace(/[^a-z0-9]+/g, "_")] || "";
}

function relationIds(value) {
  if (Array.isArray(value)) return value.flatMap(relationIds);
  if (value === null || value === undefined || value === "") return [];
  if (typeof value === "string") return value.split(/[;,\n]+/).map(v => v.trim()).filter(Boolean);
  if (typeof value === "number") return [String(value)];
  return [];
}

function explicitRelationRefs(item) {
  const refs = [];
  const push = (type, id, source = "explicit") => {
    const store = relationStore(type);
    const cleanId = String(id ?? "").trim();
    if (!store || !cleanId) return;
    refs.push({ type: store, id: cleanId, source });
  };

  const mapping = item?.related_entity_ids;
  if (mapping && typeof mapping === "object" && !Array.isArray(mapping)) {
    for (const [type, ids] of Object.entries(mapping)) {
      for (const id of relationIds(ids)) push(type, id, "related_entity_ids");
    }
  }

  const keyed = {
    related_creature_ids: "creatures",
    related_dungeon_ids: "dungeons",
    related_hero_ids: "heroes",
    related_npc_ids: "npcs",
    related_quest_ids: "quests",
    related_loot_ids: "loot_items",
    related_interactable_ids: "interactables",
    related_media_ids: "media_assets"
  };
  for (const [field, type] of Object.entries(keyed)) {
    for (const id of relationIds(item?.[field])) push(type, id, field);
  }

  for (const field of ["related_entities", "relations", "links"]) {
    const list = Array.isArray(item?.[field]) ? item[field] : [];
    for (const rel of list) {
      if (!rel || typeof rel !== "object") continue;
      const rawType = rel.entity_type || rel.target_type || rel.entityType || rel.targetType || rel.type;
      const rawId = rel.target_id || rel.entity_id || rel.targetId || rel.entityId ||
        (relationStore(rawType) ? rel.id : "");
      push(rawType, rawId, field);
    }
  }

  const seen = new Set();
  return refs.filter(ref => {
    const key = `${ref.type}:${ref.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function resolveCreatureDungeon(item) {
  if (!item) return null;
  const direct = item.dungeon_id ? findById("dungeons", item.dungeon_id) : null;
  if (direct) return direct;
  const target = normalizeBestiaryText(item.dungeon_name);
  if (!target) return null;
  const matches = (state.data.dungeons || []).filter(d => normalizeBestiaryText(d.name) === target);
  return matches.length === 1 ? matches[0] : null;
}

function creatureSameDungeon(item) {
  const dungeon = resolveCreatureDungeon(item);
  if (!dungeon) return [];
  return (state.data.creatures || [])
    .filter(other => String(other.id || "") !== String(item.id || ""))
    .filter(other => String(resolveCreatureDungeon(other)?.id || "") === String(dungeon.id))
    .sort((a, b) => {
      const order = { basique: 1, tactique: 2, speciale: 3, brute: 4, mini_boss: 5, boss: 6, unknown: 9 };
      const ca = order[creatureCategoryMeta(a.category).key] ?? 9;
      const cb = order[creatureCategoryMeta(b.category).key] ?? 9;
      if (ca !== cb) return ca - cb;
      return String(a.name || "").localeCompare(String(b.name || ""), "fr", { sensitivity: "base" });
    });
}

function phaseOrderValue(item, fallback) {
  for (const field of ["phase_index", "phase_number", "phase_order", "phase"]) {
    const n = Number(item?.[field]);
    if (Number.isFinite(n) && String(item?.[field] ?? "").trim() !== "") return n;
  }
  return fallback;
}

function phaseExplicitLabel(item) {
  for (const field of ["phase_number", "phase_index", "phase_order", "phase"]) {
    const raw = item?.[field];
    if (raw !== null && raw !== undefined && String(raw).trim() !== "") return `Phase ${escapeHtml(String(raw))}`;
  }
  return "Phase liée";
}

function validBossPhaseGroup(ids) {
  const unique = [...new Set(ids.map(id => String(id || "").trim()).filter(Boolean))];
  if (unique.length < 2) return [];
  const rows = unique.map(id => findById("creatures", id));
  if (rows.some(row => !row || creatureCategoryMeta(row.category).key !== "boss")) return [];
  const index = new Map((state.data.creatures || []).map((row, i) => [String(row.id || ""), i]));
  return rows.sort((a, b) => phaseOrderValue(a, index.get(String(a.id)) ?? 9999) - phaseOrderValue(b, index.get(String(b.id)) ?? 9999));
}

function getBossPhaseGroup(item) {
  if (!item || creatureCategoryMeta(item.category).key !== "boss") return [];
  const creatures = state.data.creatures || [];
  const itemId = String(item.id || "");
  if (!itemId) return [];

  const listFields = ["phase_ids", "boss_phase_ids"];
  const owners = creatures.filter(candidate =>
    creatureCategoryMeta(candidate.category).key === "boss" &&
    listFields.some(field => {
      const ids = relationIds(candidate?.[field]).map(String);
      return ids.length > 0 && (String(candidate.id || "") === itemId || ids.includes(itemId));
    })
  );
  if (owners.length === 1) {
    const owner = owners[0];
    const ids = [owner.id, ...listFields.flatMap(field => relationIds(owner?.[field]))];
    const group = validBossPhaseGroup(ids);
    if (group.length >= 2) return group;
  } else if (owners.length > 1) {
    return [];
  }

  for (const field of ["phase_group_id", "boss_phase_group_id", "boss_group_id"]) {
    const value = String(item?.[field] ?? "").trim();
    if (!value) continue;
    const ids = creatures
      .filter(candidate =>
        creatureCategoryMeta(candidate.category).key === "boss" &&
        String(candidate?.[field] ?? "").trim() === value
      )
      .map(candidate => candidate.id);
    const group = validBossPhaseGroup(ids);
    if (group.length >= 2) return group;
  }

  for (const field of ["phase_of_id", "parent_boss_id", "boss_parent_id"]) {
    const directRoot = String(item?.[field] ?? "").trim();
    const roots = directRoot
      ? [directRoot]
      : creatures
          .filter(candidate => String(candidate?.[field] ?? "").trim() === itemId)
          .map(() => itemId);
    const uniqueRoots = [...new Set(roots.filter(Boolean))];
    if (uniqueRoots.length !== 1) continue;
    const root = uniqueRoots[0];
    const ids = creatures
      .filter(candidate => String(candidate.id || "") === root || String(candidate?.[field] ?? "").trim() === root)
      .map(candidate => candidate.id);
    const group = validBossPhaseGroup(ids);
    if (group.length >= 2) return group;
  }

  const readPhaseRefs = candidate => {
    const refs = [];
    for (const field of ["relations", "related_entities", "links"]) {
      for (const rel of Array.isArray(candidate?.[field]) ? candidate[field] : []) {
        if (!rel || typeof rel !== "object") continue;
        const rawEntityType = rel.entity_type || rel.target_type || rel.entityType || rel.targetType || "";
        const kind = normalizeBestiaryText(rel.relation_type || rel.kind || rel.role || rel.relationship || (!relationStore(rel.type) ? rel.type : ""));
        if (!kind.includes("phase")) continue;
        const type = relationStore(rawEntityType || "creatures");
        const id = rel.target_id || rel.entity_id || rel.targetId || rel.entityId || rel.id;
        if (type === "creatures" && id) refs.push(String(id));
      }
    }
    return [...new Set(refs)];
  };

  const phaseRefs = readPhaseRefs(item);
  if (phaseRefs.length) {
    const group = validBossPhaseGroup([itemId, ...phaseRefs]);
    if (group.length >= 2) return group;
  }

  const reverseOwners = creatures.filter(candidate =>
    String(candidate.id || "") !== itemId &&
    creatureCategoryMeta(candidate.category).key === "boss" &&
    readPhaseRefs(candidate).includes(itemId)
  );
  if (reverseOwners.length === 1) {
    const owner = reverseOwners[0];
    const group = validBossPhaseGroup([owner.id, ...readPhaseRefs(owner)]);
    if (group.length >= 2) return group;
  } else if (reverseOwners.length > 1) {
    return [];
  }

  return [];
}

function getCreatureRelations(item) {
  const sameDungeon = creatureSameDungeon(item);
  const explicitRefs = explicitRelationRefs(item).filter(ref => !(ref.type === "creatures" && String(ref.id) === String(item.id || "")));
  const resolved = [];
  const broken = [];
  for (const ref of explicitRefs) {
    const target = findById(ref.type, ref.id);
    if (target) resolved.push({ ...ref, target });
    else broken.push(ref);
  }

  const media = (state.data.media_assets || []).filter(asset => {
    const type = relationStore(asset.entity_type);
    return type === "creatures" && String(asset.entity_id || "") === String(item.id || "");
  });

  const phaseGroup = getBossPhaseGroup(item);
  const phaseIds = new Set(phaseGroup.map(row => String(row.id || "")));
  return {
    dungeon: resolveCreatureDungeon(item),
    sameDungeon: sameDungeon.filter(row => !phaseIds.has(String(row.id || ""))),
    explicit: resolved.filter(ref => !(ref.type === "creatures" && phaseIds.has(String(ref.id)))),
    broken,
    media,
    phaseGroup
  };
}

function codexEntityTitle(type, item) {
  if (!item) return getLabel(type);
  if (type === "brouhaha_effects") return brouhahaReferenceLabel(item);
  return String(item.name || item.title || item.hero_base_name || item.label || item.file_name || item.id || getLabel(type));
}

function renderCodexReturnBar() {
  const stack = ensureCodexReturnStack();
  const previous = stack[stack.length - 1];
  if (previous) {
    return `<div class="codex-return-bar"><button class="ghost" type="button" data-action="codex-related-back">${shellIcon("back")}<span>Retour à ${escapeHtml(previous.label || getLabel(previous.type))}</span></button></div>`;
  }
  return renderCodexContextReturn();
}

function renderSafeRelationMedia(image, alt, fallbackText = "Visuel indisponible") {
  if (!image) return `<span class="relation-media-fallback">${escapeHtml(fallbackText)}</span>`;
  return `<img src="${escapeHtml(image)}" alt="${escapeHtml(alt || "")}" loading="lazy" data-safe-media><span class="relation-media-fallback" hidden>${escapeHtml(fallbackText)}</span>`;
}

function renderCreatureRelationCard(type, target, extra = "") {
  const title = codexEntityTitle(type, target);
  const image = codexImageFor(type, target);
  let meta = getLabel(type);
  if (type === "creatures") {
    const cat = creatureCategoryMeta(target.category);
    meta = `${cat.label} · Menace ${target.menace ?? "—"}`;
  } else if (type === "loot_items") {
    meta = target.type || "Loot";
  } else if (type === "media_assets") {
    meta = target.mime_type || "Média";
  }
  return `
    <button class="creature-related-card" type="button" data-action="open-related" data-type="${escapeHtml(type)}" data-id="${escapeHtml(String(target.id || ""))}">
      <span class="creature-related-thumb">${renderSafeRelationMedia(image, title)}</span>
      <span class="creature-related-copy">
        <strong>${escapeHtml(title)}</strong>
        <small>${escapeHtml(meta)}</small>
        ${extra ? `<em>${escapeHtml(extra)}</em>` : ""}
      </span>
    </button>`;
}

function renderBossPhaseStack(item, phaseGroup) {
  if (!Array.isArray(phaseGroup) || phaseGroup.length < 2) return "";
  const phone = typeof window !== "undefined" && window.matchMedia?.("(max-width: 767px)").matches;
  return `
    <section class="creature-phase-stack" aria-label="Phases du Boss">
      <div class="creature-related-heading">
        <div><span class="eyebrow">Relation explicite</span><h2>Phases du Boss</h2></div>
        <span>${phaseGroup.length} phases liées</span>
      </div>
      <div class="creature-phase-list">
        ${phaseGroup.map(phase => {
          const current = String(phase.id || "") === String(item.id || "");
          const image = imageUrlForEntity(phase);
          return `
            <details class="creature-phase-card ${current ? "current" : ""}" ${phone ? "" : "open"}>
              <summary>
                <span class="creature-phase-thumb">${renderSafeRelationMedia(image, phase.name || "Phase", "Image absente")}</span>
                <span class="creature-phase-title"><strong>${escapeHtml(phase.name || "Boss sans nom")}</strong><small>${phaseExplicitLabel(phase)} · Menace ${escapeHtml(String(phase.menace ?? "—"))}</small></span>
                <span class="creature-phase-state">${current ? "Actuelle" : "Ouvrir"}</span>
              </summary>
              <div class="creature-phase-body">
                <div><b>${escapeHtml(String(phase.pv ?? "—"))}</b><span>PV</span></div>
                <div><b>${escapeHtml(String(phase.atk ?? "—"))}</b><span>ATK</span></div>
                <div><b>${escapeHtml(String(phase.def ?? "—"))}</b><span>DEF</span></div>
                <div><b>${escapeHtml(String(phase.zone ?? "—"))}</b><span>Zone</span></div>
                <div><b>${escapeHtml(String(phase.actions ?? "—"))}</b><span>Actions</span></div>
                ${current ? `<span class="muted small">Fiche actuelle</span>` : `<button class="ghost" type="button" data-action="open-related" data-type="creatures" data-id="${escapeHtml(String(phase.id || ""))}">Voir la phase</button>`}
              </div>
            </details>`;
        }).join("")}
      </div>
    </section>`;
}

function renderCreatureRelations(item, relations) {
  const same = relations.sameDungeon;
  const explicit = relations.explicit.filter(ref => ref.type !== "media_assets");
  const hasContent = same.length || explicit.length || relations.broken.length || relations.phaseGroup.length >= 2;
  if (!hasContent) return "";

  return `
    <section class="creature-relations-v6">
      <div class="creature-related-heading">
        <div><span class="eyebrow">Données fiables</span><h2>Entités liées</h2></div>
      </div>

      ${same.length ? `
        <div class="creature-related-group">
          <div class="creature-related-subhead">
            <strong>Même Donjon</strong>
            ${relations.dungeon ? `<button class="ghost" type="button" data-action="bestiary-see-dungeon" data-id="${escapeHtml(String(relations.dungeon.id || ""))}">Voir tout</button>` : ""}
          </div>
          <div class="creature-related-rail">${same.map(target => renderCreatureRelationCard("creatures", target, target.dungeon_name || "")).join("")}</div>
        </div>
      ` : ""}

      ${explicit.length ? `
        <div class="creature-related-group">
          <div class="creature-related-subhead"><strong>Relations explicites</strong></div>
          <div class="creature-related-rail">${explicit.map(ref => renderCreatureRelationCard(ref.type, ref.target)).join("")}</div>
        </div>
      ` : ""}

      ${relations.broken.length ? `
        <div class="creature-broken-relations" role="status">
          ${relations.broken.length} relation${relations.broken.length > 1 ? "s" : ""} explicite${relations.broken.length > 1 ? "s" : ""} indisponible${relations.broken.length > 1 ? "s" : ""}. Aucun rapprochement automatique n’a été tenté.
        </div>
      ` : ""}

      ${renderBossPhaseStack(item, relations.phaseGroup)}
    </section>`;
}

function renderBestiaryMasterRailItem(item) {
  const meta = creatureCategoryMeta(item.category);
  const image = imageUrlForEntity(item);
  const selected = String(state.ui.bestiary.selectedId || "") === String(item.id || "");
  return `
    <button class="bestiary-master-item ${meta.key} ${selected ? "selected" : ""}" data-action="select-codex" data-type="creatures" data-id="${escapeHtml(String(item.id || ""))}">
      <span class="bestiary-master-thumb">
        ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : `<img class="fallback-sigil" src="${V6_ICON_PATH}${meta.sigil}" alt="">`}
      </span>
      <span class="bestiary-master-copy">
        <strong>${escapeHtml(item.name || "Créature sans nom")}</strong>
        <small>${escapeHtml(item.dungeon_name || "Donjon non renseigné")}</small>
        <span class="bestiary-master-meta"><img src="${V6_ICON_PATH}${meta.sigil}" alt="" aria-hidden="true">${escapeHtml(meta.label)} · Menace ${escapeHtml(String(item.menace ?? "—"))}</span>
      </span>
    </button>`;
}

function renderBestiaryCollection() {
  ensureBestiaryUi();
  const b = state.ui.bestiary;
  const items = getBestiaryCreatures();
  const total = (state.data.creatures || []).length;
  const menaceOptions = bestiaryMenaceOptions();
  const selected = findById("creatures", b.selectedId || state.ui.codexSelectedId);

  if (state.ui.codexDetailOpen) {
    return renderShell(`
      <section class="bestiary-v6 bestiary-detail-page">
        ${renderCodexReturnBar()}
        <div class="bestiary-detail-top">
          <button class="ghost codex-back creature-detail-back" data-action="codex-back" type="button">${shellIcon("back")}<span>Retour au Bestiaire</span></button>
          ${renderCodexTabs("creatures")}
        </div>
        <div class="bestiary-master-detail">
          <aside class="panel bestiary-master-rail" aria-label="Collection Bestiaire">
            <div class="bestiary-master-head">
              <button class="ghost" data-action="codex-back" type="button">${shellIcon("back")}<span>Bestiaire</span></button>
              <span>${items.length}</span>
            </div>
            <div class="bestiary-master-list">
              ${items.length ? items.map(renderBestiaryMasterRailItem).join("") : `<div class="empty small">Aucun résultat dans le contexte actuel.</div>`}
            </div>
          </aside>
          <div class="bestiary-detail-column">
            ${selected ? renderCreatureDetail(selected, true) : `<div class="panel empty">Cette créature n’est plus disponible.</div>`}
          </div>
        </div>
      </section>`);
  }

  return renderShell(`
    <section class="bestiary-v6">
      ${renderCodexReturnBar()}
      <div class="panel bestiary-collection-panel">
        <div class="bestiary-heading">
          <div>
            <h2>Bestiaire</h2>
          </div>
          <div class="bestiary-counter" aria-live="polite"><strong>${items.length}</strong><span>sur ${total}</span></div>
        </div>

        ${renderCodexTabs("creatures")}

        ${b.contextReturn ? `
          <div class="bestiary-context-return">
            <span>Collection ouverte depuis une relation.</span>
            <button class="ghost" type="button" data-action="bestiary-restore-context">${shellIcon("back")}<span>Restaurer le contexte précédent</span></button>
          </div>
        ` : ""}

        <div class="bestiary-toolbar">
          <label class="bestiary-search-field">
            ${shellIcon("search")}
            <input class="field" data-action="bestiary-search" aria-label="Rechercher une créature" value="${escapeHtml(b.search)}" placeholder="Rechercher une créature…">
          </label>

          <div class="bestiary-filter-grid">
            <label><span>Donjon</span><select class="field" data-action="bestiary-dungeon">
              <option value="">Tous les donjons</option>
              ${(state.data.dungeons || []).map(d => `<option value="${escapeHtml(String(d.id || ""))}" ${String(b.dungeonId) === String(d.id) ? "selected" : ""}>${escapeHtml(d.name || "Donjon")}</option>`).join("")}
            </select></label>
            <label><span>Catégorie</span><select class="field" data-action="bestiary-category">
              <option value="">Toutes catégories</option>
              ${Object.entries(CREATURE_CATEGORY_META).map(([key,meta]) => `<option value="${key}" ${b.category === key ? "selected" : ""}>${meta.label}</option>`).join("")}
            </select></label>
            <label><span>Menace</span><select class="field" data-action="bestiary-menace">
              <option value="">Toutes</option>
              ${menaceOptions.map(value => `<option value="${value}" ${String(b.menace) === String(value) ? "selected" : ""}>Menace ${value}</option>`).join("")}
            </select></label>
            ${renderBestiaryTagFilter()}
            <label><span>Trier par</span><select class="field" data-action="bestiary-sort">
              <option value="name" ${b.sort === "name" ? "selected" : ""}>Nom</option>
              <option value="menace" ${b.sort === "menace" ? "selected" : ""}>Menace</option>
              <option value="dungeon" ${b.sort === "dungeon" ? "selected" : ""}>Donjon</option>
            </select></label>
            <button class="ghost bestiary-direction" data-action="bestiary-toggle-direction" type="button" aria-label="Inverser le sens du tri" title="Inverser le sens du tri">${b.direction === "asc" ? "↑ Asc." : "↓ Desc."}</button>
          </div>

          <div class="bestiary-toolbar-foot">
            <div class="view-switch segmented" aria-label="Mode d’affichage">
              <button class="${b.mode === "gallery" ? "active" : ""}" data-action="bestiary-mode" data-mode="gallery" aria-pressed="${b.mode === "gallery"}">${shellIcon("grid")}<span>Galerie</span></button>
              <button class="${b.mode === "list" ? "active" : ""}" data-action="bestiary-mode" data-mode="list" aria-pressed="${b.mode === "list"}">${shellIcon("list")}<span>Liste</span></button>
            </div>
            ${bestiaryHasActiveFilters() ? `<button class="ghost bestiary-reset" data-action="bestiary-reset" type="button">Réinitialiser les filtres</button>` : ""}
            <span class="bestiary-result-label">${items.length} résultat${items.length > 1 ? "s" : ""}</span>
          </div>
        </div>

        <div class="bestiary-results ${b.mode}" data-bestiary-results>
          ${items.length
            ? (b.mode === "gallery"
              ? `<div class="bestiary-gallery-grid">${items.map(renderBestiaryGalleryCard).join("")}</div>`
              : `<div class="bestiary-list">${items.map(renderBestiaryListRow).join("")}</div>`)
            : `<div class="empty bestiary-empty"><strong>Aucune créature ne correspond.</strong><span>Modifiez la recherche ou réinitialisez les filtres.</span></div>`}
        </div>
      </div>
    </section>`);
}

function renderFamilyToolbar(type, count) {
  ensureCodexFamilyUi();
  const ui = state.ui.codexFamilies[type];
  const labels = { dungeons: "donjons", heroes: "héros", npcs: "PNJ", quests: "quêtes", loot_items: "loot" };
  const label = labels[type] || getLabel(type).toLowerCase();
  const modes = familyModeOptions(type);
  return `
    <div class="codex-family-toolbar">
      <label class="codex-family-search">
        ${shellIcon("search")}
        <input class="field" data-action="family-search" data-type="${type}" aria-label="Rechercher dans ${label}" value="${escapeHtml(ui.search)}" placeholder="Rechercher dans ${label}…">
      </label>
      <div class="segmented" aria-label="Mode d’affichage">
        ${modes.map(mode => `<button class="${ui.mode === mode.value ? "active" : ""}" type="button" data-action="family-mode" data-type="${type}" data-mode="${mode.value}" aria-pressed="${ui.mode === mode.value}">${shellIcon(mode.icon)}<span>${mode.label}</span></button>`).join("")}
      </div>
      ${ui.dungeonId ? `<span class="codex-family-filter">${shellIcon("filter")}<span>Donjon · ${escapeHtml(findById("dungeons", ui.dungeonId)?.name || "indisponible")}</span></span>` : ""}
      <span class="codex-family-count">${count} entrée${count > 1 ? "s" : ""}</span>
    </div>`;
}

function renderDungeonCollectionCard(item, mode = "gallery", active = false) {
  const image = imageUrlForEntity(item);
  const floors = dungeonFloorBudgets(item);
  const boss = resolveDungeonBoss(item);
  return `
    <button class="dungeon-collection-card ${mode} ${active ? "active" : ""}" type="button" data-action="select-family-codex" data-type="dungeons" data-id="${escapeHtml(String(item.id || ""))}" style="--dungeon-accent:${dungeonAccent(item)}">
      <span class="dungeon-collection-media">
        ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy" data-safe-media><span class="relation-media-fallback" hidden>Couverture indisponible</span>` : `<span class="dungeon-cover-fallback"><img src="${V6_ICON_PATH}Icone_Gameplay_DONJON.webp" alt=""></span>`}
      </span>
      <span class="dungeon-collection-copy">
        <small>Donjon · ${floors.length ? `${floors.length} étage${floors.length > 1 ? "s" : ""}` : "progression non renseignée"}</small>
        <strong>${escapeHtml(item.name || "Donjon sans nom")}</strong>
        ${boss.name ? `<em>Boss · ${escapeHtml(boss.name)}</em>` : ""}
      </span>
    </button>`;
}

function renderDungeonRailItem(item, active = false) {
  return renderDungeonCollectionCard(item, "list", active);
}

function renderDungeonFloors(item) {
  const floors = dungeonFloorBudgets(item);
  if (!floors.length) return `<div class="empty small">Progression des étages non renseignée.</div>`;
  return `
    <div class="dungeon-floor-track" aria-label="Progression des étages">
      ${floors.map((budget, index) => `
        <div class="dungeon-floor-stop">
          <span>Étage</span>
          <b>${index + 1}</b>
          <small>Budget ${budget === null || budget === undefined || budget === "" ? "—" : escapeHtml(String(budget))}</small>
        </div>
      `).join("")}
    </div>`;
}

function dungeonPreviewTitle(type, item) {
  if (type === "brouhaha_effects") return `Niveau ${item.level ?? "—"}`;
  return String(item.name || item.title || item.label || "Entrée");
}

function renderDungeonPreview(type, items, label, icon, dungeon) {
  const preview = items.slice(0, 3);
  return `
    <section class="dungeon-linked-preview">
      <header>
        <div><img src="${V6_ICON_PATH}${icon}" alt="" aria-hidden="true"><strong>${label}</strong></div>
        <div class="dungeon-linked-meta"><span>${items.length}</span>${items.length && dungeon ? `<button class="ghost" type="button" data-action="dungeon-see-all" data-type="${type}" data-dungeon-id="${escapeHtml(String(dungeon.id || ""))}">Voir tout</button>` : ""}</div>
      </header>
      <div class="dungeon-linked-items">
        ${preview.length ? preview.map(item => {
          const image = imageUrlForEntity(item);
          const title = dungeonPreviewTitle(type, item);
          return `
            <button class="${image ? "has-media" : ""}" type="button" data-action="open-related" data-type="${type}" data-id="${escapeHtml(String(item.id || ""))}">
              ${image ? `<span class="dungeon-linked-thumb">${renderSafeRelationMedia(image, title, "Visuel indisponible")}</span>` : ""}
              <b>${escapeHtml(title)}</b>
            </button>`;
        }).join("") : `<span class="muted small">Aucune entrée liée.</span>`}
      </div>
    </section>`;
}
function renderDungeonDetailV6(item) {
  if (!item) return `<div class="panel empty">Donjon indisponible.</div>`;
  const image = imageUrlForEntity(item);
  const accent = dungeonAccent(item);
  const floors = dungeonFloorBudgets(item);
  const linked = dungeonLinkedEntities(item);
  const boss = resolveDungeonBoss(item);
  const tags = tagsToArray(item.tags).filter(Boolean);
  const name = String(item.name || "").trim() || "Donjon sans nom";
  return `
    <article class="dungeon-sheet-v6" style="--dungeon-accent:${accent}">
      <section class="dungeon-cover-v6">
        ${image ? `
          <img src="${escapeHtml(image)}" alt="Couverture de ${escapeHtml(name)}" data-safe-media>
          <span class="relation-media-fallback dungeon-cover-error" hidden>Couverture indisponible</span>
          <button class="ghost dungeon-cover-fullscreen" type="button" data-action="open-image" data-src="${escapeHtml(image)}" data-alt="${escapeHtml(name)}">${shellIcon("image")}<span>Plein écran</span></button>
        ` : `
          <div class="dungeon-cover-fallback large"><img src="${V6_ICON_PATH}Icone_Gameplay_DONJON.webp" alt=""><span>Couverture non renseignée</span></div>
        `}
        <div class="dungeon-cover-copy-v6">
          <h1>${escapeHtml(name)}</h1>
        </div>
      </section>

      <div class="dungeon-hub-v6">
        ${item.description ? `
          <section class="dungeon-description-v6">
            <div class="dungeon-section-head"><div><h2>Description</h2></div></div>
            <p>${escapeHtml(item.description)}</p>
          </section>
        ` : ""}

        <section class="dungeon-progression-v6">
          <div class="dungeon-section-head"><div><h2>Étages & budgets</h2></div><span>${floors.length || "—"}</span></div>
          ${renderDungeonFloors(item)}
        </section>

        <section class="dungeon-boss-v6">
          <div class="dungeon-section-head"><div><h2>${escapeHtml(boss.name || "Non renseigné")}</h2></div><img src="${V6_ICON_PATH}Sigil_Boss.webp" alt="" aria-hidden="true"></div>
          ${boss.entity ? `
            <button class="dungeon-boss-card" type="button" data-action="open-related" data-type="creatures" data-id="${escapeHtml(String(boss.entity.id || ""))}">
              <span>${renderSafeRelationMedia(imageUrlForEntity(boss.entity), boss.entity.name || boss.name, "Illustration absente")}</span>
              <strong>${escapeHtml(boss.entity.name || boss.name)}</strong>
              <small>Menace ${escapeHtml(String(boss.entity.menace ?? "—"))}</small>
            </button>
          ` : boss.name ? `<div class="dungeon-boss-unresolved">Nom stocké dans le Donjon, sans relation Créature non ambiguë.</div>` : `<div class="empty small">Aucun Boss final fiable dans les données.</div>`}
        </section>

        <section class="dungeon-linked-v6">
          <div class="dungeon-section-head"><div><h2>Dans ce Donjon</h2></div></div>
          <div class="dungeon-linked-grid">
            ${renderDungeonPreview("creatures", linked.creatures, "Créatures", "Sigil_Basique.webp", item)}
            ${renderDungeonPreview("quests", linked.quests, "Quêtes", "Icone_Entite_QUETE.webp", item)}
            ${renderDungeonPreview("interactables", linked.interactables, "Objets interactifs", "Icone_Entite_OBJET_INTERACTIF.webp", item)}
            ${renderDungeonPreview("brouhaha_effects", linked.brouhaha_effects, "Brouhaha", "Icone_Entite_OBJET_BROUHAHA.webp", item)}
          </div>
        </section>

        ${tags.length ? `<div class="dungeon-tags-v6">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      </div>
    </article>`;
}
function renderDungeonCodex() {
  ensureCodexFamilyUi();
  const ui = state.ui.codexFamilies.dungeons;
  const items = getDungeonCollection();
  let selected = findById("dungeons", ui.selectedId || state.ui.codexSelectedId);
  if (!selected && items.length) selected = items[0];

  if (state.ui.codexDetailOpen) {
    return renderShell(`
      <section class="codex-family-v6 dungeon-codex-v6">
        ${renderCodexReturnBar()}
        <div class="codex-family-detail-top">
          <button class="ghost codex-family-back" type="button" data-action="codex-family-back" data-type="dungeons">${shellIcon("back")}<span>Retour aux Donjons</span></button>
          ${renderCodexTabs("dungeons")}
        </div>
        <div class="codex-family-master-detail">
          <aside class="panel codex-family-master-rail">
            <div class="codex-family-master-head"><strong>Donjons</strong><span>${items.length}</span></div>
            <div class="codex-family-master-list">${items.map(item => renderDungeonRailItem(item, String(item.id) === String(selected?.id))).join("") || `<div class="empty small">Aucun Donjon.</div>`}</div>
          </aside>
          <div class="codex-family-detail-host">${selected ? renderDungeonDetailV6(selected) : `<div class="panel empty">Donjon indisponible.</div>`}</div>
        </div>
      </section>`);
  }

  return renderShell(`
    <section class="codex-family-v6 dungeon-codex-v6">
      ${renderCodexReturnBar()}
      <div class="panel codex-family-collection-panel">
        <div class="codex-family-heading"><div><h2>Donjons</h2></div></div>
        ${renderCodexTabs("dungeons")}
        ${renderFamilyToolbar("dungeons", items.length)}
        <div class="codex-family-results ${ui.mode}">
          ${items.length ? items.map(item => renderDungeonCollectionCard(item, ui.mode, String(item.id) === String(ui.selectedId))).join("") : `<div class="empty">Aucun Donjon ne correspond.</div>`}
        </div>
      </div>
    </section>`);
}

function renderHeroCollectionCard(group, mode = "gallery", active = false) {
  const level = selectedHeroLevel(group);
  const image = transparentDerivativeUrlForEntity(level, "heroes");
  const role = String(level?.role || group.levels.find(item => item.role)?.role || "").trim();
  return `
    <button class="hero-collection-card ${mode} ${active ? "active" : ""}" type="button" data-action="select-family-codex" data-type="heroes" data-base="${escapeHtml(group.key)}">
      <span class="hero-collection-media">
        ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy" data-safe-media><span class="relation-media-fallback" hidden>Illustration indisponible</span>` : `<span class="hero-media-fallback"><img src="${V6_ICON_PATH}Icone_Entite_HEROS.webp" alt=""></span>`}
      </span>
      <span class="hero-collection-copy">
        <small>Héros · ${group.levels.length} niveau${group.levels.length > 1 ? "x" : ""}</small>
        <strong>${escapeHtml(group.baseName)}</strong>
        ${role ? `<em>${escapeHtml(role)}</em>` : ""}
        ${level ? `<span>N${escapeHtml(String(level.level ?? "—"))} consulté</span>` : ""}
      </span>
    </button>`;
}

function renderHeroStat(icon, label, value) {
  const display = value === null || value === undefined || value === "" ? "—" : String(value);
  return `<div class="hero-stat-v6"><img src="${V6_ICON_PATH}${icon}" alt="" aria-hidden="true"><b>${escapeHtml(display)}</b><span>${label}</span></div>`;
}

function renderHeroDetailV6(group) {
  if (!group?.levels?.length) return `<div class="panel empty">Héros indisponible.</div>`;
  const current = selectedHeroLevel(group) || group.levels[0];
  const image = transparentDerivativeUrlForEntity(current, "heroes");
  const acquired = group.levels.filter(level => Number(level.level ?? 0) <= Number(current.level ?? 0) && abilityIsPresent(level.ability_text));
  const availableLevels = [...new Set([1,2,3,4,...group.levels.map(level => Number(level.level)).filter(Number.isFinite)])].sort((a,b)=>a-b);
  const tags = tagsToArray(current.tags).filter(Boolean);
  return `
    <article class="hero-sheet-v6">
      <aside class="hero-identity-v6">
        <div class="hero-portrait-v6 level-${escapeHtml(String(current.level ?? 1))}">
          ${image ? `
            <img src="${escapeHtml(image)}" alt="Illustration niveau ${escapeHtml(String(current.level ?? "—"))} de ${escapeHtml(group.baseName)}" data-safe-media>
            <span class="relation-media-fallback" hidden>Illustration indisponible</span>
            <button class="ghost hero-fullscreen" type="button" data-action="open-image" data-src="${escapeHtml(image)}" data-alt="${escapeHtml(group.baseName)}">${shellIcon("image")}<span>Plein écran</span></button>
          ` : `<div class="hero-media-fallback large"><img src="${V6_ICON_PATH}Icone_Entite_HEROS.webp" alt=""><span>Illustration non renseignée</span></div>`}
        </div>
        <div class="hero-nameplate-v6">
          <div class="eyebrow"><img src="${V6_ICON_PATH}Icone_Entite_HEROS.webp" alt="" aria-hidden="true">Héros</div>
          <h1>${escapeHtml(group.baseName)}</h1>
          ${current.role ? `<span>${escapeHtml(current.role)}</span>` : ""}
        </div>
        <div class="hero-level-selector-v6" aria-label="Niveaux du héros">
          ${availableLevels.map(levelNumber => {
            const available = group.levels.some(item => Number(item.level) === levelNumber);
            return `<button type="button" data-action="hero-level" data-base="${escapeHtml(group.key)}" data-level="${levelNumber}" class="${Number(current.level) === levelNumber ? "active" : ""}" ${available ? "" : "disabled"} aria-pressed="${Number(current.level) === levelNumber}">N${levelNumber}</button>`;
          }).join("")}
        </div>
      </aside>

      <section class="hero-playbook-v6">
        <header class="hero-level-head-v6">
          <div class="eyebrow">Niveau ${escapeHtml(String(current.level ?? "—"))}</div>
          <h2>${escapeHtml(current.title || current.name || group.baseName)}</h2>
          ${current.role ? `<span>${escapeHtml(current.role)}</span>` : ""}
        </header>

        <div class="hero-stats-v6">
          ${renderHeroStat("Icone_Gameplay_PV.webp", "PV", current.pv)}
          ${renderHeroStat("Icone_Gameplay_ATK.webp", "ATK", current.atk)}
          ${renderHeroStat("Icone_Gameplay_DEF.webp", "DEF", current.def)}
          ${renderHeroStat("Icone_Gameplay_ZONE.webp", "Zone", current.zone)}
          ${renderHeroStat("Icone_Gameplay_ACTION.webp", "Actions", current.actions)}
        </div>

        <section class="hero-skills-v6">
          <div class="hero-section-head"><span class="eyebrow">Compétences acquises</span><strong>${acquired.length}</strong></div>
          ${acquired.length ? acquired.map(skill => {
            const stamp = formatBrouhahaStamp(skill.brouhaha);
            return `
              <article class="hero-skill-v6 ${Number(skill.level) === Number(current.level) ? "current" : ""}">
                <header>
                  <div><img src="${V6_ICON_PATH}Icone_Gameplay_COMPETENCE.webp" alt="" aria-hidden="true"><span>Compétence · N${escapeHtml(String(skill.level ?? "—"))}</span></div>
                  ${stamp ? `<b class="hero-brouhaha-stamp">Brouhaha ${escapeHtml(stamp)}</b>` : ""}
                </header>
                <h3>${escapeHtml(skill.ability_text)}</h3>
                ${skill.effect_text ? `<p>${escapeHtml(skill.effect_text)}</p>` : ""}
              </article>`;
          }).join("") : `<div class="empty small">Aucune compétence renseignée jusqu’à ce niveau.</div>`}
        </section>

        ${tags.length ? `<div class="hero-tags-v6">${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      </section>
    </article>`;
}

function renderHeroCodex() {
  ensureCodexFamilyUi();
  const ui = state.ui.codexFamilies.heroes;
  const groups = getHeroCollection();
  let selected = heroGroupByKey(ui.selectedBase);
  if (!selected && groups.length) selected = groups[0];
  const selectedLevel = selectedHeroLevel(selected);

  if (state.ui.codexDetailOpen) {
    return renderShell(`
      <section class="codex-family-v6 hero-codex-v6">
        ${renderCodexReturnBar()}
        <div class="codex-family-detail-top">
          <button class="ghost codex-family-back" type="button" data-action="codex-family-back" data-type="heroes">${shellIcon("back")}<span>Retour aux Héros</span></button>
          ${renderCodexTabs("heroes")}
        </div>
        <div class="codex-family-master-detail">
          <aside class="panel codex-family-master-rail">
            <div class="codex-family-master-head"><strong>Héros</strong><span>${groups.length}</span></div>
            <div class="codex-family-master-list">${groups.map(group => renderHeroCollectionCard(group, "list", group.key === selected?.key)).join("") || `<div class="empty small">Aucun Héros.</div>`}</div>
          </aside>
          <div class="codex-family-detail-host">${selected ? renderHeroDetailV6(selected) : `<div class="panel empty">Héros indisponible.</div>`}</div>
        </div>
      </section>`);
  }

  return renderShell(`
    <section class="codex-family-v6 hero-codex-v6">
      ${renderCodexReturnBar()}
      <div class="panel codex-family-collection-panel">
        <div class="codex-family-heading"><div><h2>Héros</h2></div></div>
        ${renderCodexTabs("heroes")}
        ${renderFamilyToolbar("heroes", groups.length)}
        <div class="codex-family-results ${ui.mode}">
          ${groups.length ? groups.map(group => renderHeroCollectionCard(group, ui.mode, group.key === ui.selectedBase)).join("") : `<div class="empty">Aucun Héros ne correspond.</div>`}
        </div>
      </div>
    </section>`);
}

function renderNpcCollectionCard(item, mode = "gallery", active = false) {
  const image = imageUrlForEntity(item);
  return `
    <button class="npc-collection-card ${mode} ${active ? "active" : ""}" type="button" data-action="select-family-codex" data-type="npcs" data-id="${escapeHtml(String(item.id || ""))}">
      <span class="npc-collection-media">
        ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy" data-safe-media><span class="relation-media-fallback" hidden>Portrait indisponible</span>` : `<span class="npc-media-fallback"><img src="${V6_ICON_PATH}Icone_Entite_PNJ.webp" alt=""></span>`}
      </span>
      <span class="npc-collection-copy">
        <small>PNJ${item.race ? ` · ${escapeHtml(item.race)}` : ""}</small>
        <strong>${escapeHtml(item.name || "PNJ sans nom")}</strong>
        ${item.role ? `<em>${escapeHtml(item.role)}</em>` : ""}
      </span>
    </button>`;
}

function renderNpcDetailV6(item) {
  if (!item) return `<div class="panel empty">PNJ indisponible.</div>`;
  const image = imageUrlForEntity(item);
  const quests = questsForNpc(item);
  const tags = tagsToArray(item.tags).filter(Boolean);
  const name = String(item.name || "").trim() || "PNJ sans nom";
  return `
    <article class="npc-sheet-v6">
      <section class="npc-portrait-v6">
        ${image ? `
          <img src="${escapeHtml(image)}" alt="Portrait de ${escapeHtml(name)}" data-safe-media>
          <span class="relation-media-fallback" hidden>Portrait indisponible</span>
          <button class="ghost npc-fullscreen" type="button" data-action="open-image" data-src="${escapeHtml(image)}" data-alt="${escapeHtml(name)}">${shellIcon("image")}<span>Plein écran</span></button>
        ` : `<div class="npc-media-fallback large"><img src="${V6_ICON_PATH}Icone_Entite_PNJ.webp" alt=""><span>Portrait non renseigné</span></div>`}
      </section>
      <section class="npc-dossier-v6">
        <header class="npc-identity-v6">
          <div class="eyebrow"><img src="${V6_ICON_PATH}Icone_Entite_PNJ.webp" alt="" aria-hidden="true">PNJ</div>
          <h1>${escapeHtml(name)}</h1>
        </header>
        <div class="npc-facts-v6">
          ${item.race ? `<div><span>Race</span><b>${escapeHtml(item.race)}</b></div>` : ""}
          ${item.role ? `<div><span>Rôle</span><b>${escapeHtml(item.role)}</b></div>` : ""}
          ${item.tone ? `<div><span>Ton</span><b>${escapeHtml(item.tone)}</b></div>` : ""}
        </div>
        ${item.lore ? `
          <section class="npc-lore-v6">
            <div class="eyebrow"><img src="${V6_ICON_PATH}Icone_Gameplay_LORE.webp" alt="" aria-hidden="true">Lore</div>
            <p>${escapeHtml(item.lore)}</p>
          </section>
        ` : ""}
        <section class="npc-quests-v6">
          <div class="npc-section-head"><div><img src="${V6_ICON_PATH}Icone_Entite_QUETE.webp" alt="" aria-hidden="true"><strong>Quêtes associées</strong></div><span>${quests.length}</span></div>
          <div class="npc-quest-links">
            ${quests.length ? quests.map(quest => `<button type="button" data-action="open-related" data-type="quests" data-id="${escapeHtml(String(quest.id || ""))}"><b>${escapeHtml(quest.name || "Quête")}</b><small>${escapeHtml(questDifficultyMeta(quest.difficulty)?.label || "Difficulté non renseignée")}</small></button>`).join("") : `<span class="muted small">Aucune Quête reliée de façon fiable.</span>`}
          </div>
        </section>
        ${tags.length ? `<div class="npc-tags-v6">${tags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      </section>
    </article>`;
}

function renderQuestDifficultyBadge(item) {
  const meta = questDifficultyMeta(item?.difficulty);
  if (!meta) return "";
  return `<span class="semantic-tier difficulty ${meta.key} ${meta.known ? "" : "unknown"}"><i></i><span>Difficulté</span><b>${escapeHtml(meta.label)}</b></span>`;
}

function renderQuestCollectionCard(item, mode = "list", active = false) {
  const npc = resolveQuestNpc(item);
  const dungeon = resolveQuestDungeon(item);
  return `
    <button class="quest-codex-card ${mode} ${active ? "active" : ""}" type="button" data-action="select-family-codex" data-type="quests" data-id="${escapeHtml(String(item.id || ""))}">
      <span class="quest-card-emblem"><img src="${V6_ICON_PATH}Icone_Entite_QUETE.webp" alt=""></span>
      <span class="quest-card-copy">
        <strong>${escapeHtml(item.name || "Quête sans titre")}</strong>
        ${renderQuestDifficultyBadge(item)}
        <small>${escapeHtml([npc?.name || item.npc_name, dungeon?.name || item.dungeon_name].filter(Boolean).join(" · "))}</small>
        ${item.objective ? `<em>${escapeHtml(item.objective)}</em>` : ""}
      </span>
    </button>`;
}

function renderQuestDetailV6(item) {
  if (!item) return `<div class="panel empty">Quête indisponible.</div>`;
  const npc = resolveQuestNpc(item);
  const dungeon = resolveQuestDungeon(item);
  const image = imageUrlForEntity(item);
  const tags = tagsToArray(item.tags).filter(Boolean);
  const name = String(item.name || "").trim() || "Quête sans titre";
  return `
    <article class="quest-sheet-v6">
      ${image ? `
        <button class="quest-media-v6" type="button" data-action="open-image" data-src="${escapeHtml(image)}" data-alt="${escapeHtml(name)}">
          <img src="${escapeHtml(image)}" alt="Illustration de ${escapeHtml(name)}" data-safe-media>
          <span class="relation-media-fallback" hidden>Illustration indisponible</span>
        </button>
      ` : ""}
      <div class="quest-contract-v6">
        <header class="quest-contract-head">
          <div class="quest-contract-mark"><img src="${V6_ICON_PATH}Icone_Entite_QUETE.webp" alt="" aria-hidden="true"></div>
          <div>
            <div class="eyebrow">Quête Codex</div>
            <h1>${escapeHtml(name)}</h1>
          </div>
          ${renderQuestDifficultyBadge(item)}
        </header>
        <div class="quest-parties-v6">
          ${item.npc_name || npc ? `
            <div><img src="${V6_ICON_PATH}Icone_Entite_PNJ.webp" alt="" aria-hidden="true"><span>Commanditaire</span>
              ${npc ? `<button type="button" data-action="open-related" data-type="npcs" data-id="${escapeHtml(String(npc.id || ""))}">${escapeHtml(npc.name)}</button>` : `<b>${escapeHtml(item.npc_name || "Non renseigné")}</b>`}
            </div>
          ` : ""}
          ${item.dungeon_name || dungeon ? `
            <div><img src="${V6_ICON_PATH}Icone_Gameplay_DONJON.webp" alt="" aria-hidden="true"><span>Donjon</span>
              ${dungeon ? `<button type="button" data-action="open-related" data-type="dungeons" data-id="${escapeHtml(String(dungeon.id || ""))}">${escapeHtml(dungeon.name)}</button>` : `<b>${escapeHtml(item.dungeon_name || "Non renseigné")}</b>`}
            </div>
          ` : ""}
        </div>
        ${item.description ? `<section class="quest-description-v6"><span>Description</span><p>${escapeHtml(item.description)}</p></section>` : ""}
        ${item.objective ? `<section class="quest-objective-v6"><span>Objectif</span><strong>${escapeHtml(item.objective)}</strong></section>` : `<section class="quest-objective-v6 empty-objective"><span>Objectif</span><strong>Non renseigné</strong></section>`}
        ${item.reward ? `<section class="quest-reward-v6"><img src="${V6_ICON_PATH}Icone_Gameplay_BUTIN.webp" alt="" aria-hidden="true"><div><span>Récompense</span><strong>${escapeHtml(item.reward)}</strong></div></section>` : ""}
        ${tags.length ? `<div class="quest-tags-v6">${tags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      </div>
    </article>`;
}

function renderLootRarityBadge(item) {
  const meta = lootRarityMeta(item);
  if (!meta) return "";
  return `<span class="semantic-tier rarity ${meta.key} ${meta.known ? "" : "unknown"}"><i></i><span>Rareté</span><b>${escapeHtml(meta.label)}</b></span>`;
}

function renderLootCollectionCard(item, mode = "gallery", active = false) {
  const image = imageUrlForEntity(item);
  const source = resolveLootCreature(item);
  return `
    <button class="loot-codex-card ${mode} ${active ? "active" : ""}" type="button" data-action="select-family-codex" data-type="loot_items" data-id="${escapeHtml(String(item.id || ""))}">
      <span class="loot-card-media">
        ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy" data-safe-media><span class="relation-media-fallback" hidden>Illustration indisponible</span>` : `<span class="loot-media-fallback"><img src="${V6_ICON_PATH}Icone_Gameplay_BUTIN.webp" alt=""></span>`}
      </span>
      <span class="loot-card-copy">
        <strong>${escapeHtml(item.name || "Loot sans nom")}</strong>
        ${renderLootRarityBadge(item)}
        ${item.type ? `<small>${escapeHtml(item.type)}</small>` : ""}
        ${source || item.creature_name ? `<em>Source · ${escapeHtml(source?.name || item.creature_name)}</em>` : ""}
      </span>
    </button>`;
}

function renderLootDetailV6(item) {
  if (!item) return `<div class="panel empty">Loot indisponible.</div>`;
  const image = imageUrlForEntity(item);
  const provenance = lootProvenance(item);
  const tags = tagsToArray(item.tags).filter(Boolean);
  const goldPresent = item.gold_value !== null && item.gold_value !== undefined && String(item.gold_value).trim() !== "";
  const name = String(item.name || "").trim() || "Loot sans nom";
  return `
    <article class="loot-sheet-v6">
      <section class="loot-stage-v6">
        ${image ? `
          <img src="${escapeHtml(image)}" alt="Illustration de ${escapeHtml(name)}" data-safe-media>
          <span class="relation-media-fallback" hidden>Illustration indisponible</span>
          <button class="ghost loot-fullscreen" type="button" data-action="open-image" data-src="${escapeHtml(image)}" data-alt="${escapeHtml(name)}">${shellIcon("image")}<span>Plein écran</span></button>
        ` : `<div class="loot-media-fallback large"><img src="${V6_ICON_PATH}Icone_Gameplay_BUTIN.webp" alt=""><span>Illustration non renseignée</span></div>`}
        ${goldPresent ? `<div class="loot-value-v6"><b>${escapeHtml(String(item.gold_value))}</b><span>or</span></div>` : ""}
      </section>
      <section class="loot-ledger-v6">
        <header>
          <div class="eyebrow"><img src="${V6_ICON_PATH}Icone_Gameplay_BUTIN.webp" alt="" aria-hidden="true">Loot</div>
          ${renderLootRarityBadge(item)}
          <h1>${escapeHtml(name)}</h1>
          ${item.type ? `<span class="loot-type-v6">${escapeHtml(item.type)}</span>` : ""}
        </header>
        ${item.effect ? `<section class="loot-effect-v6"><span>Effet</span><strong>${escapeHtml(item.effect)}</strong></section>` : ""}
        ${goldPresent ? `<section class="loot-fact-v6"><span>Valeur</span><b>${escapeHtml(String(item.gold_value))} or</b></section>` : ""}
        ${provenance.creature ? `
          <section class="loot-source-v6">
            <span>Source</span>
            <button type="button" data-action="open-related" data-type="creatures" data-id="${escapeHtml(String(provenance.creature.id || ""))}">${escapeHtml(provenance.creature.name || item.creature_name || "Créature")}</button>
          </section>
        ` : item.creature_name ? `<section class="loot-source-v6 unresolved"><span>Source déclarée</span><b>${escapeHtml(item.creature_name)}</b></section>` : ""}
        ${provenance.dungeon ? `
          <section class="loot-provenance-v6">
            <img src="${V6_ICON_PATH}Icone_Gameplay_DONJON.webp" alt="" aria-hidden="true"><div><span>Provenance</span><button type="button" data-action="open-related" data-type="dungeons" data-id="${escapeHtml(String(provenance.dungeon.id || ""))}">${escapeHtml(provenance.dungeon.name || "Donjon")}</button></div>
          </section>
        ` : ""}
        ${tags.length ? `<div class="loot-tags-v6">${tags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      </section>
    </article>`;
}

function renderInteractableCollectionCard(item, mode = "list", active = false) {
  const image = imageUrlForEntity(item);
  const dungeon = resolveEntityDungeon(item);
  const hpPresent = item.hp !== null && item.hp !== undefined && String(item.hp).trim() !== "";
  return `
    <button class="interactable-codex-card ${mode} ${active ? "active" : ""}" type="button" data-action="select-family-codex" data-type="interactables" data-id="${escapeHtml(String(item.id || ""))}">
      <span class="interactable-card-media">
        ${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy" data-safe-media><span class="relation-media-fallback" hidden>Illustration indisponible</span>` : `<span class="interactable-media-fallback"><img src="${V6_ICON_PATH}Icone_Entite_OBJET_INTERACTIF.webp" alt=""></span>`}
      </span>
      <span class="interactable-card-copy">
        <small>Objet interactif${item.type ? ` · ${escapeHtml(item.type)}` : ""}</small>
        <strong>${escapeHtml(item.name || "Objet sans nom")}</strong>
        ${dungeon || item.dungeon_name ? `<em>${escapeHtml(dungeon?.name || item.dungeon_name)}</em>` : ""}
        ${hpPresent ? `<span>PV ${escapeHtml(String(item.hp))}</span>` : ""}
      </span>
    </button>`;
}

function renderInteractableDetailV6(item) {
  if (!item) return `<div class="panel empty">Objet interactif indisponible.</div>`;
  const image = imageUrlForEntity(item);
  const dungeon = resolveEntityDungeon(item);
  const actions = interactableActions(item);
  const hpPresent = item.hp !== null && item.hp !== undefined && String(item.hp).trim() !== "";
  const tags = tagsToArray(item.tags).filter(Boolean);
  const name = String(item.name || "").trim() || "Objet sans nom";
  return `
    <article class="interactable-sheet-v6">
      <section class="interactable-blueprint-v6">
        <div class="interactable-grid-lines" aria-hidden="true"></div>
        ${image ? `
          <img src="${escapeHtml(image)}" alt="Illustration de ${escapeHtml(name)}" data-safe-media>
          <span class="relation-media-fallback" hidden>Illustration indisponible</span>
          <button class="ghost interactable-fullscreen" type="button" data-action="open-image" data-src="${escapeHtml(image)}" data-alt="${escapeHtml(name)}">${shellIcon("image")}<span>Plein écran</span></button>
        ` : `<div class="interactable-media-fallback large"><img src="${V6_ICON_PATH}Icone_Entite_OBJET_INTERACTIF.webp" alt=""><span>Illustration non renseignée</span></div>`}
        <span class="interactable-blueprint-label">Objet interactif</span>
      </section>
      <section class="interactable-data-v6">
        <header>
          <div class="eyebrow"><img src="${V6_ICON_PATH}Icone_Entite_OBJET_INTERACTIF.webp" alt="" aria-hidden="true">Objet interactif</div>
          <h1>${escapeHtml(name)}</h1>
          ${item.type ? `<span class="interactable-type-v6">${escapeHtml(item.type)}</span>` : ""}
        </header>
        <div class="interactable-facts-v6">
          ${dungeon || item.dungeon_name ? `
            <div><img src="${V6_ICON_PATH}Icone_Gameplay_DONJON.webp" alt="" aria-hidden="true"><span>Donjon</span>
              ${dungeon ? `<button type="button" data-action="open-related" data-type="dungeons" data-id="${escapeHtml(String(dungeon.id || ""))}">${escapeHtml(dungeon.name || "Donjon")}</button>` : `<b>${escapeHtml(item.dungeon_name || "Donjon indisponible")}</b>`}
            </div>
          ` : ""}
          ${hpPresent ? `<div><img src="${V6_ICON_PATH}Icone_Gameplay_PV.webp" alt="" aria-hidden="true"><span>PV</span><b>${escapeHtml(String(item.hp))}</b></div>` : ""}
        </div>
        <section class="interactable-actions-v6">
          <div class="interactable-section-label"><img src="${V6_ICON_PATH}Icone_Gameplay_ACTION.webp" alt="" aria-hidden="true"><span>Actions autorisées</span></div>
          ${actions.length ? `<div>${actions.map(action=>`<b>${escapeHtml(action)}</b>`).join("")}</div>` : `<div class="empty small">Aucune action renseignée.</div>`}
        </section>
        ${item.effect ? `
          <section class="interactable-effect-v6">
            <span>Effet</span>
            <p>${escapeHtml(item.effect)}</p>
          </section>
        ` : ""}
        ${tags.length ? `<div class="interactable-tags-v6">${tags.map(tag=>`<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      </section>
    </article>`;
}

function renderBrouhahaCollectionCard(item, mode = "cards", active = false) {
  const scope = brouhahaScope(item);
  const level = item.level === null || item.level === undefined || item.level === "" ? "—" : String(item.level);
  const intensity = brouhahaIntensityClass(item.level);
  return `
    <button class="brouhaha-ref-card ${mode} ${intensity} ${active ? "active" : ""}" type="button" data-action="select-family-codex" data-type="brouhaha_effects" data-id="${escapeHtml(String(item.id || ""))}">
      <span class="brouhaha-ref-level"><small>Niveau</small><b>${escapeHtml(level)}</b></span>
      <span class="brouhaha-ref-copy">
        <strong>${escapeHtml(brouhahaReferenceLabel(item))}</strong>
        <small>${escapeHtml(scope.label)}</small>
        ${item.effect_text ? `<em>${escapeHtml(item.effect_text)}</em>` : ""}
      </span>
      <span class="brouhaha-ref-mark"><img src="${V6_ICON_PATH}Icone_Entite_OBJET_BROUHAHA.webp" alt=""></span>
    </button>`;
}

function renderNoiseWave() {
  return `<div class="brouhaha-noise-wave" aria-hidden="true">${Array.from({length:7},()=>"<i></i>").join("")}</div>`;
}

function renderBrouhahaReferenceDetailV6(item) {
  if (!item) return `<div class="panel empty">Effet Brouhaha indisponible.</div>`;
  const scope = brouhahaScope(item);
  const image = imageUrlForEntity(item);
  const level = item.level === null || item.level === undefined || item.level === "" ? "—" : String(item.level);
  const intensity = brouhahaIntensityClass(item.level);
  const title = brouhahaReferenceLabel(item);
  return `
    <article class="brouhaha-reference-sheet-v6 ${intensity}">
      <section class="brouhaha-reference-visual">
        ${image ? `<img src="${escapeHtml(image)}" alt="" data-safe-media><span class="relation-media-fallback" hidden>Illustration indisponible</span>` : `<div class="brouhaha-ref-emblem"><img src="${V6_ICON_PATH}Icone_Entite_OBJET_BROUHAHA.webp" alt=""></div>`}
        <div class="brouhaha-reference-number" aria-hidden="true">${escapeHtml(level)}</div>
        ${renderNoiseWave()}
      </section>
      <section class="brouhaha-reference-copy">
        <header>
          <div class="eyebrow"><img src="${V6_ICON_PATH}Icone_Entite_OBJET_BROUHAHA.webp" alt="" aria-hidden="true">Brouhaha · Référentiel Codex</div>
          <div class="brouhaha-level-text">Niveau <b>${escapeHtml(level)}</b></div>
          <h1>${escapeHtml(title)}</h1>
        </header>
        <section class="brouhaha-scope-v6">
          <img src="${V6_ICON_PATH}Icone_Gameplay_DONJON.webp" alt="" aria-hidden="true">
          <div><span>Portée du référentiel</span>
          ${scope.dungeon ? `<button type="button" data-action="open-related" data-type="dungeons" data-id="${escapeHtml(String(scope.dungeon.id || ""))}">${escapeHtml(scope.label)}</button>` : `<b>${escapeHtml(scope.label)}</b>`}
          ${scope.unresolved ? `<small>Donjon déclaré, relation non résolue.</small>` : ""}
          </div>
        </section>
        <section class="brouhaha-reference-effect">
          <span>Effet de référence</span>
          <p>${escapeHtml(item.effect_text || "Effet non renseigné.")}</p>
        </section>
        <div class="brouhaha-reference-note" role="note">Référence Codex uniquement. Cet écran ne modifie ni le niveau courant, ni le tirage, ni l’historique Brouhaha de session.</div>
      </section>
    </article>`;
}

function renderSimpleFamilyMasterItem(type, item, active = false) {
  if (type === "npcs") return renderNpcCollectionCard(item, "list", active);
  if (type === "quests") return renderQuestCollectionCard(item, "list", active);
  if (type === "loot_items") return renderLootCollectionCard(item, "list", active);
  if (type === "interactables") return renderInteractableCollectionCard(item, "list", active);
  return renderBrouhahaCollectionCard(item, "list", active);
}

function renderSimpleFamilyDetail(type, item) {
  if (type === "npcs") return renderNpcDetailV6(item);
  if (type === "quests") return renderQuestDetailV6(item);
  if (type === "loot_items") return renderLootDetailV6(item);
  if (type === "interactables") return renderInteractableDetailV6(item);
  return renderBrouhahaReferenceDetailV6(item);
}

function renderSimpleFamilyCodex(type) {
  ensureCodexFamilyUi();
  const meta = {
    npcs: { label: "PNJ", singular: "PNJ" },
    quests: { label: "Quêtes", singular: "Quête" },
    loot_items: { label: "Loot", singular: "Loot" },
    interactables: { label: "Objets interactifs", singular: "Objet interactif" },
    brouhaha_effects: { label: "Brouhaha", singular: "Effet Brouhaha" }
  }[type];
  const ui = state.ui.codexFamilies[type];
  const items = getSimpleFamilyCollection(type);
  let selected = findById(type, ui.selectedId || state.ui.codexSelectedId);
  if (!selected && items.length) selected = items[0];

  if (state.ui.codexDetailOpen) {
    return renderShell(`
      <section class="codex-family-v6 ${type}-codex-v6">
        ${renderCodexReturnBar()}
        <div class="codex-family-detail-top">
          <button class="ghost codex-family-back" type="button" data-action="codex-family-back" data-type="${type}">${shellIcon("back")}<span>${type === "brouhaha_effects" ? "Retour au Brouhaha" : `Retour aux ${meta.label}`}</span></button>
          ${renderCodexTabs(type)}
        </div>
        <div class="codex-family-master-detail">
          <aside class="panel codex-family-master-rail">
            <div class="codex-family-master-head"><strong>${meta.label}</strong><span>${items.length}</span></div>
            <div class="codex-family-master-list">${items.map(item=>renderSimpleFamilyMasterItem(type,item,String(item.id)===String(selected?.id))).join("") || `<div class="empty small">Aucune entrée.</div>`}</div>
          </aside>
          <div class="codex-family-detail-host">${selected ? renderSimpleFamilyDetail(type,selected) : `<div class="panel empty">Entrée indisponible.</div>`}</div>
        </div>
      </section>`);
  }

  const cards = items.map(item => {
    const active = String(item.id) === String(ui.selectedId);
    if (type === "npcs") return renderNpcCollectionCard(item, ui.mode, active);
    if (type === "quests") return renderQuestCollectionCard(item, ui.mode, active);
    if (type === "loot_items") return renderLootCollectionCard(item, ui.mode, active);
    if (type === "interactables") return renderInteractableCollectionCard(item, ui.mode, active);
    return renderBrouhahaCollectionCard(item, ui.mode, active);
  }).join("");

  return renderShell(`
    <section class="codex-family-v6 ${type}-codex-v6">
      ${renderCodexReturnBar()}
      <div class="panel codex-family-collection-panel">
        <div class="codex-family-heading"><div><h2>${meta.label}</h2></div></div>
        ${renderCodexTabs(type)}
        ${renderFamilyToolbar(type,items.length)}
        <div class="codex-family-results ${ui.mode} ${type}">
          ${cards || `<div class="empty">Aucune entrée ne correspond.</div>`}
        </div>
      </div>
    </section>`);
}

function renderCodex() {
  const type = state.ui.codexType;
  if (type === "creatures") return renderBestiaryCollection();
  if (type === "dungeons") return renderDungeonCodex();
  if (type === "heroes") return renderHeroCodex();
  if (["npcs", "quests", "loot_items", "interactables", "brouhaha_effects"].includes(type)) return renderSimpleFamilyCodex(type);

  const items = getFilteredList(type, "codex");
  const selected = findById(type, state.ui.codexSelectedId) || items[0] || null;

  return renderShell(`
    <section class="panel">
      ${renderCodexReturnBar()}
      <div class="panel-title">
        <h2>Codex</h2>
        ${renderCodexTabs(type)}
      </div>

      <div class="panel-subtitle">
        <span>${items.length} entrée(s)</span>
        ${type === "heroes" ? renderHeroLevelFilter(state.ui.codexHeroLevel, "codex-hero-level-filter") : ""}
        ${type === "quests" ? renderQuestDungeonFilter(state.ui.codexQuestDungeonId, "codex-quest-dungeon-filter") : ""}
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

function renderQuestDungeonFilter(selectedId, action) {
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

function renderDungeonDetail(item) {
  return renderDungeonDetailV6(item);
}

function creatureCategoryCssColor(key) {
  const vars = {
    basique: "var(--game-basic)",
    tactique: "var(--game-tactical)",
    speciale: "var(--game-special)",
    brute: "var(--game-brute)",
    mini_boss: "var(--game-mini)",
    boss: "var(--game-boss)"
  };
  return vars[key] || "var(--color-border-strong)";
}

function safeCreatureAccent(item) {
  const dungeon = findById("dungeons", item?.dungeon_id) || findByName("dungeons", item?.dungeon_name || "");
  return dungeonAccent(dungeon || { id: item?.dungeon_id, name: item?.dungeon_name });
}
function formatCreatureSocle(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  return /mm\b/i.test(text) ? text : `${text} mm`;
}

function renderCreatureStat(icon, label, value) {
  const display = value === null || value === undefined || value === "" ? "—" : String(value);
  return `
    <div class="creature-stat-v6">
      <img src="${V6_ICON_PATH}${icon}" alt="" aria-hidden="true">
      <b>${escapeHtml(display)}</b>
      <span>${label}</span>
    </div>`;
}

function renderCreatureDetail(item) {
  if (!item) return `<div class="panel empty">Créature indisponible.</div>`;

  const image = imageUrlForEntity(item);
  const categoryRaw = String(item.category || "").trim();
  const category = categoryRaw ? creatureCategoryMeta(categoryRaw) : null;
  const accent = safeCreatureAccent(item);
  const tags = creatureTags(item);
  const lootItems = Array.isArray(item.loot_items) ? item.loot_items.filter(Boolean) : [];
  const abilityName = String(item.special_attack_name || "").trim();
  const abilityNoise = Number(item.special_attack_noise || 0);
  const behavior = String(item.ai_behavior || "").trim();
  const target = String(item.ai_target_priority || "").trim();
  const lore = String(item.lore || "").trim();
  const dungeonName = String(item.dungeon_name || "").trim();
  const socle = formatCreatureSocle(item.socle);
  const menacePresent = item.menace !== null && item.menace !== undefined && item.menace !== "";
  const name = String(item.name || "").trim() || "Créature sans nom";
  const relations = getCreatureRelations(item);
  const dungeonTarget = relations.dungeon;
  const behaviorPanel = behavior || target ? `
          <section class="creature-functional-section">
            <h2><img src="${V6_ICON_PATH}Icone_Gameplay_COMPORTEMENT.webp" alt="" aria-hidden="true">Comportement</h2>
            ${behavior ? `<p>${escapeHtml(behavior)}</p>` : ""}
            ${target ? `<dl><dt>Priorité de cible</dt><dd>${escapeHtml(target)}</dd></dl>` : ""}
          </section>
        ` : "";
  const lootPanel = lootItems.length ? `
          <section class="creature-functional-section creature-loot-v6">
            <h2><img src="${V6_ICON_PATH}Icone_Gameplay_BUTIN.webp" alt="" aria-hidden="true">Butin</h2>
            <div class="creature-loot-list">
              ${lootItems.map(loot => {
                const linked = loot?.id ? findById("loot_items", loot.id) : null;
                const body = `
                  <strong>${escapeHtml(loot?.name || "Butin")}</strong>
                  ${loot?.type ? `<span>${escapeHtml(loot.type)}</span>` : ""}
                  ${loot?.effect ? `<p>${escapeHtml(loot.effect)}</p>` : ""}
                  ${loot?.gold_value !== null && loot?.gold_value !== undefined && loot?.gold_value !== "" ? `<small>${escapeHtml(String(loot.gold_value))} or</small>` : ""}
                `;
                return linked
                  ? `<button class="creature-loot-item linked" type="button" data-action="open-related" data-type="loot_items" data-id="${escapeHtml(String(linked.id || ""))}">${body}</button>`
                  : `<article class="creature-loot-item">${body}</article>`;
              }).join("")}
            </div>
          </section>
        ` : "";
  const lorePanel = lore ? `
    <section class="creature-lore-v6">
      <h2><img src="${V6_ICON_PATH}Icone_Gameplay_LORE.webp" alt="" aria-hidden="true">Lore</h2>
      <p>${escapeHtml(lore)}</p>
    </section>
  ` : "";
  const tagsPanel = tags.length ? `
    <section class="creature-tags-v6" aria-label="Tags">
      ${tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join("")}
    </section>
  ` : "";


  return `
    <article class="creature-sheet-v6 ${category?.key || "uncategorized"}" style="--creature-cat:${creatureCategoryCssColor(category?.key)};--dungeon-accent:${accent}">
      <div class="creature-left-v6">
        <section class="creature-art-v6" aria-label="Illustration">
        <div class="creature-art-frame" aria-hidden="true"></div>
        <div class="creature-plinth" aria-hidden="true"></div>
        ${image ? `
          <button class="ghost creature-fullscreen" type="button" data-action="open-image" data-src="${escapeHtml(image)}" data-alt="${escapeHtml(name)}" aria-label="Ouvrir l’image de ${escapeHtml(name)} en plein écran">${shellIcon("image")}<span>Plein écran</span></button>
          <div class="creature-figure">
            <img src="${escapeHtml(image)}" alt="Illustration de ${escapeHtml(name)}" data-safe-media>
            <div class="creature-media-error" hidden>${category ? `<img src="${V6_ICON_PATH}${category.sigil}" alt="" aria-hidden="true">` : ""}<span>Image illisible ou absente</span></div>
          </div>
        ` : `
          <div class="creature-figure creature-figure-missing">
            ${category ? `<img src="${V6_ICON_PATH}${category.sigil}" alt="" aria-hidden="true">` : ""}
            <span>Image indisponible</span>
          </div>
        `}
        </section>
      </div>

      <section class="creature-detail-v6">
        <header class="creature-identity-v6">
          <div class="creature-identity-copy">
            ${dungeonName ? (dungeonTarget
              ? `<button class="creature-dungeon-v6 creature-dungeon-link" type="button" data-action="open-related" data-type="dungeons" data-id="${escapeHtml(String(dungeonTarget.id || ""))}"><img src="${V6_ICON_PATH}Icone_Gameplay_DONJON.webp" alt="" aria-hidden="true"><span>${escapeHtml(dungeonName)}</span></button>`
              : `<div class="creature-dungeon-v6"><img src="${V6_ICON_PATH}Icone_Gameplay_DONJON.webp" alt="" aria-hidden="true"><span>${escapeHtml(dungeonName)}</span></div>`) : ""}
            <h1>${escapeHtml(name)}</h1>
            <div class="creature-identity-chips">
              ${category ? `<span class="creature-category-v6 ${category.known ? "" : "unknown"}"><img src="${V6_ICON_PATH}${category.sigil}" alt="" aria-hidden="true">${escapeHtml(category.label)}</span>` : ""}
              ${menacePresent ? `<span class="creature-meta-chip"><img src="${V6_ICON_PATH}Icone_Gameplay_MENACE.webp" alt="" aria-hidden="true">Menace ${escapeHtml(String(item.menace))}</span>` : ""}
              ${socle ? `<span class="creature-meta-chip"><img src="${V6_ICON_PATH}Icone_Gameplay_SOCLE.webp" alt="" aria-hidden="true">Socle ${escapeHtml(socle)}</span>` : ""}
            </div>
          </div>
          ${category ? `<div class="creature-sigil-v6 ${category.known ? "" : "unknown"}"><img src="${V6_ICON_PATH}${category.sigil}" alt="${category.known ? `Sigil ${escapeHtml(category.label)}` : "Sigil de secours"}"></div>` : ""}
        </header>

        <div class="creature-stats-v6" aria-label="Statistiques">
          ${renderCreatureStat("Icone_Gameplay_PV.webp", "PV", item.pv)}
          ${renderCreatureStat("Icone_Gameplay_ATK.webp", "ATK", item.atk)}
          ${renderCreatureStat("Icone_Gameplay_DEF.webp", "DEF", item.def)}
          ${renderCreatureStat("Icone_Gameplay_ZONE.webp", "Portée / Zone", item.zone)}
          ${renderCreatureStat("Icone_Gameplay_ACTION.webp", "Actions", item.actions)}
        </div>

        ${abilityName ? `
          <section class="creature-ability-v6">
            <div class="creature-section-kicker"><img src="${V6_ICON_PATH}Icone_Gameplay_COMPETENCE.webp" alt="" aria-hidden="true"><span>Compétence</span></div>
            <h2>${escapeHtml(abilityName)}</h2>
            ${abilityNoise ? `<div class="creature-ability-meta">Brouhaha ${abilityNoise > 0 ? "+" : ""}${escapeHtml(String(abilityNoise))}</div>` : ""}
          </section>
        ` : ""}

      </section>

      ${behaviorPanel || lootPanel || lorePanel || tagsPanel ? `
        <div class="creature-wide-sections-v6">
          ${behaviorPanel}
          ${lootPanel}
          ${lorePanel}
          ${tagsPanel}
        </div>
      ` : ""}

      ${renderCreatureRelations(item, relations)}
    </article>
  `;
}

function renderLootList(list) {
  if (!list.length) return `<div class="empty small">Aucun loot.</div>`;
  return `<div class="loot-list">${list.map(l => `<div class="loot-chip"><strong>${escapeHtml(l.name)}</strong><span>${escapeHtml(l.type || "")}${l.effect ? ` · ${escapeHtml(l.effect)}` : ""}</span><em>${l.gold_value || 0} or</em></div>`).join("")}</div>`;
}

function renderHeroDetail(item) {
  const group = heroGroupByKey(heroBaseKey(item));
  return renderHeroDetailV6(group || { key: heroBaseKey(item), baseName: item?.hero_base_name || item?.name || "Héros sans nom", levels: item ? [item] : [] });
}

function renderNpcDetail(item) {
  return renderNpcDetailV6(item);
}

function renderQuestDetail(item) {
  return renderQuestDetailV6(item);
}

function renderLootDetail(item) {
  return renderLootDetailV6(item);
}

function renderInteractableDetail(item) {
  return renderInteractableDetailV6(item);
}

function renderBrouhahaEffectDetail(item) {
  return renderBrouhahaReferenceDetailV6(item);
}

function renderMediaAssetDetail(asset) {
  if (!asset) return `<div class="panel empty">Sélectionne un média.</div>`;
  const original = mediaOriginalUrlForAsset(asset);
  const preview = mediaUrlForAsset(asset, "preview");
  const thumb = mediaUrlForAsset(asset, "thumb");
  const transparent = mediaTransparentUrlForAsset(asset);
  const attachment = mediaAttachment(asset);
  const derivative = mediaDerivativeState(asset);
  const audit = asset.transparent_audit || null;
  const rembg = String(state.mediaRembg?.assetId || "") === String(asset.id || "") ? state.mediaRembg : null;
  const candidate = rembg?.candidate || null;
  const ui = state.ui.media || {};
  const linkType = ui.selectedId === asset.id ? (ui.linkType || asset.entity_type || "gallery") : (asset.entity_type || "gallery");
  const linkEntityId = ui.selectedId === asset.id ? (ui.linkEntityId || asset.entity_id || "") : (asset.entity_id || "");
  const linkTypes = ["gallery","dungeons","creatures","heroes","npcs","quests","loot_items","interactables","brouhaha_effects"];
  const entityOptions = linkType === "gallery" ? [] : (state.data[linkType] || []);
  const originalSize = asset.original_size || asset.blob?.size || 0;
  return `<section class="media-detail-v6 panel">
    <button class="ghost media-back-library" type="button" data-action="media-back-library">${shellIcon("back")}<span>Bibliothèque</span></button>
    <header class="media-detail-head-v6">
      <div><span class="eyebrow">Média local</span><h2>${escapeHtml(asset.label || asset.file_name || asset.id || "Média")}</h2><p>${escapeHtml(asset.file_name || "Nom de fichier non renseigné")}</p></div>
      <div class="media-detail-state"><span class="local">Local</span><span class="${derivative.tone}">${escapeHtml(derivative.label)}</span></div>
    </header>
    <div class="media-variant-grid">
      ${renderMediaVariant("Original", original, "original", `${asset.mime_type || "type inconnu"} · ${mediaBytes(originalSize)}`)}
      ${renderMediaVariant("Thumbnail", thumb, "thumb", asset.thumb_blob ? "Dérivé local" : "Fallback original")}
      ${renderMediaVariant("Aperçu", preview, "preview", asset.preview_blob ? "WebP local" : "Fallback original")}
      ${renderMediaVariant("Dérivé transparent", transparent, "transparent", asset.transparent_blob ? "PNG RGBA" : "À générer")}
    </div>
    <div class="media-detail-columns">
      <section class="media-detail-box">
        <span class="eyebrow">Rattachement</span>
        <h3>${attachment ? `${escapeHtml(getLabel(attachment.type))} · ${escapeHtml(mediaEntityTitle(attachment.type, attachment.entity))}` : "Sans rattachement fiable"}</h3>
        <label><span>Famille</span><select data-action="media-link-type">
          ${linkTypes.map(type => `<option value="${type}" ${type === linkType ? "selected" : ""}>${type === "gallery" ? "Sans rattachement" : escapeHtml(getLabel(type))}</option>`).join("")}
        </select></label>
        <label><span>Entité</span><select data-action="media-link-entity" ${linkType === "gallery" ? "disabled" : ""}>
          <option value="">—</option>
          ${entityOptions.map(entity => `<option value="${escapeHtml(String(entity.id || ""))}" ${String(entity.id) === String(linkEntityId) ? "selected" : ""}>${escapeHtml(mediaEntityTitle(linkType, entity))}</option>`).join("")}
        </select></label>
        <button class="secondary" type="button" data-action="media-attach" data-id="${escapeHtml(String(asset.id || ""))}">Enregistrer le rattachement</button>
      </section>
      <section class="media-detail-box rembg-box">
        <span class="eyebrow">Détourage figurine</span><h3>ISNet General Use</h3>
        <p>Modèle de production validé : <strong>rembg · IS-Net / DIS · isnet-general-use</strong>. Le traitement fabrique d'abord un aperçu temporaire. <strong>Rien n'est écrit dans Gargottex avant ta validation visuelle.</strong></p>

        <div class="media-rembg-actions">
          <button class="primary" type="button" data-action="media-rembg-run" data-id="${escapeHtml(String(asset.id || ""))}" ${asset.blob && !rembg?.busy ? "" : "disabled"}>${rembg?.busy ? "Détourage ISNet…" : "Détourer avec ISNet"}</button>
          <button class="ghost" type="button" data-action="media-download-original" data-id="${escapeHtml(String(asset.id || ""))}" ${asset.blob ? "" : "disabled"}>Télécharger l'original</button>
          <label class="secondary ${asset.blob ? "" : "disabled"}">Importer un PNG externe<input type="file" accept="image/png,.png" data-action="media-derivative-upload" data-id="${escapeHtml(String(asset.id || ""))}" ${asset.blob ? "" : "disabled"} hidden></label>
        </div>
        <small class="media-rembg-proof">ISNet pèse environ 178,6 Mo. <code>rembg-web</code> conserve le modèle dans son IndexedDB <code>rembg-models</code> après téléchargement lorsque le stockage navigateur le permet ; les traitements suivants peuvent alors fonctionner hors ligne. La session ONNX est libérée après chaque traitement pour limiter la mémoire iPad.</small>

        ${rembg?.busy ? `
          <div class="media-rembg-status" aria-live="polite">
            <progress max="100" value="${Math.max(0, Math.min(100, Number(rembg.progress || 0)))}"></progress>
            <strong data-rembg-message>${escapeHtml(rembg.message || "Préparation du détourage…")}</strong>
            <small>Le premier chargement peut être long. Ne quitte pas la fiche pendant l'inférence.</small>
          </div>
        ` : ""}

        ${rembg?.error ? `
          <div class="media-rembg-error" role="alert">
            <strong>Détourage non terminé</strong><span>${escapeHtml(rembg.error)}</span>
            <button class="ghost" type="button" data-action="media-rembg-discard">Fermer</button>
          </div>
        ` : ""}

        ${candidate?.url && candidate?.blob ? `
          <article class="media-rembg-candidate">
            <header>
              <div><span class="eyebrow">Aperçu temporaire · validation humaine requise</span><strong>ISNet · ${Math.max(0, Number(candidate.durationMs || 0) / 1000).toFixed(1)} s</strong></div>
              <span class="${candidate.audit?.pass ? "ok" : "warn"}">${candidate.audit?.pass ? "Audit alpha OK" : "Audit à corriger"}</span>
            </header>
            <div class="media-rembg-preview checker"><img src="${escapeHtml(candidate.url)}" alt="Aperçu détouré temporaire de ${escapeHtml(asset.label || asset.file_name || "ce média")}"></div>
            <div class="media-alpha-audit ${candidate.audit?.pass ? "pass" : "fail"}">
              <div><span>Alpha réel</span><b>${candidate.audit?.has_alpha_channel ? "Oui" : "Non"}</b></div>
              <div><span>Transparent</span><b>${Number(candidate.audit?.transparent_ratio || 0).toFixed(3)}</b></div>
              <div><span>Bords doux</span><b>${Number(candidate.audit?.soft_edge_ratio || 0).toFixed(3)}</b></div>
              <div><span>Dimensions</span><b>${candidate.audit?.width || "?"}×${candidate.audit?.height || "?"}</b></div>
            </div>
            <div class="media-human-review">
              <strong>Contrôle visuel</strong>
              <span>Vérifie les cheveux, cornes, fils, zones blanches, brume, socle et éventuels halos. Le bouton vert est l'unique action qui intègre ce dérivé à IndexedDB.</span>
            </div>
            <div class="media-rembg-candidate-actions">
              <button class="primary" type="button" data-action="media-rembg-approve-candidate" data-id="${escapeHtml(String(asset.id || ""))}" ${candidate.audit?.pass ? "" : "disabled"}>Valider et enregistrer</button>
              <button class="ghost" type="button" data-action="media-rembg-discard">Rejeter / recommencer</button>
              <button class="secondary" type="button" data-action="media-rembg-download-candidate">Télécharger le PNG</button>
            </div>
          </article>
        ` : ""}

        ${asset.blob ? "" : `<small class="media-warning">Ce média historique ne possède pas de Blob original local. Aucun dérivé ne peut être validé ici sans source vérifiable.</small>`}
        ${audit ? `<div class="media-alpha-audit ${audit.pass ? "pass" : "fail"}">
          <div><span>Alpha réel</span><b>${audit.has_alpha_channel ? "Oui" : "Non"}</b></div>
          <div><span>Transparent</span><b>${Number(audit.transparent_ratio || 0).toFixed(3)}</b></div>
          <div><span>Bords doux</span><b>${Number(audit.soft_edge_ratio || 0).toFixed(3)}</b></div>
          <div><span>Dimensions</span><b>${audit.width || "?"}×${audit.height || "?"}</b></div>
          <div class="wide"><span>BBox alpha</span><b>${audit.alpha_bbox ? audit.alpha_bbox.join(" · ") : "Aucune"}</b></div>
        </div>` : `<div class="media-workflow-note">Original immutable → ISNet en mémoire → audit alpha → validation humaine → écriture du dérivé approuvé.</div>`}
        ${asset.transparent_blob ? `<div class="media-review-actions">
          ${asset.transparent_review_status === "approved"
            ? `<span class="media-approved-state">Dérivé validé et actif dans le Codex</span>`
            : `<button class="primary" type="button" data-action="media-derivative-approve" data-id="${escapeHtml(String(asset.id || ""))}" ${audit?.pass ? "" : "disabled"}>Valider visuellement</button>`}
          <button class="ghost" type="button" data-action="media-derivative-reject" data-id="${escapeHtml(String(asset.id || ""))}">À corriger</button>
          <button class="danger ghost" type="button" data-action="media-derivative-remove" data-id="${escapeHtml(String(asset.id || ""))}">Retirer le dérivé</button>
        </div>` : ""}
      </section>
    </div>
    <footer class="media-original-proof">
      <span>Original</span><strong>${asset.original_sha256 ? `SHA-256 ${escapeHtml(String(asset.original_sha256).slice(0,16))}…` : "Empreinte calculée lors du prochain traitement rembg"}</strong>
      <small>${asset.transparent_source_sha256 && asset.original_sha256 === asset.transparent_source_sha256 ? "Source vérifiée inchangée pendant la création du dérivé." : "Aucun détourage n'écrase le Blob original."}</small>
    </footer>
  </section>`;
}

function renderGenerator() {
  const session = ensureSessionContext();
  if (!session.active) return renderShell(`<section class="session-tool-page">${renderSessionStartCard("Générateur")}</section>`);

  const dungeon = sessionDungeon(session);
  const budgets = sessionFloorBudgets(session);
  const budget = sessionBudget(session);
  const result = session.encounter;
  return renderShell(`
    <section class="session-tool-page generator-v6 ${result ? "has-result" : ""}">
      ${renderSessionToolHeader("generator")}
      <section class="generator-config-v6 panel">
        <div class="generator-config-title"><div><span class="eyebrow">Configuration</span><h2>Générateur de rencontre</h2></div>${result ? `<span>Configuration compacte · rencontre active</span>` : ""}</div>
        <div class="generator-order-v6">
          <label><span>1 · Donjon</span><select data-action="session-set-dungeon">
            ${(state.data.dungeons || []).map(item => `<option value="${escapeHtml(String(item.id || ""))}" ${String(item.id) === String(session.dungeonId) ? "selected" : ""}>${escapeHtml(item.name || "Donjon")}</option>`).join("")}
          </select></label>
          <label><span>2 · Étage</span><select data-action="session-set-floor" ${budgets.length ? "" : "disabled"}>
            ${budgets.map((value,index)=>`<option value="${index}" ${index===session.floorIndex?"selected":""}>Étage ${index+1}${value === null ? "" : ` · budget ${escapeHtml(String(value))}`}</option>`).join("")}
          </select></label>
          <div class="generator-mode-v6"><span>3 · Mode</span><div class="segmented" role="group" aria-label="Mode de rencontre">
            ${[
              ["normal","Normal"],["mini_boss","Mini-boss"],["boss","Boss"]
            ].map(([value,label])=>`<button type="button" data-action="session-set-mode" data-mode="${value}" class="${session.mode===value?"active":""}" aria-pressed="${session.mode===value?"true":"false"}">${label}</button>`).join("")}
          </div></div>
          <div class="generator-budget-v6"><span>4 · Budget</span><b>${budget === null ? "Non renseigné" : escapeHtml(String(budget))}</b><small>${budget === null ? "Ajoute un budget à cet étage dans le Codex." : "issu du Donjon actif"}</small></div>
          <button class="primary generator-roll-v6" type="button" data-action="generate-session-encounter" ${budget === null || budget <= 0 ? "disabled" : ""}>5 · ${result ? "Régénérer" : "Générer"}</button>
        </div>
      </section>
      <section class="generator-result-v6">
        ${result ? renderEncounterResult(result) : `<div class="panel empty">Configure la salle puis génère une rencontre.</div>`}
      </section>
    </section>
  `);
}

function renderEncounterResult(encounter) {
  if (!encounter) return `<div class="panel empty">Aucune rencontre.</div>`;
  const groups = sessionEncounterCreatureGroups(encounter);
  const activeGroups = groups.filter(group => group.remaining > 0);
  const lootRows = sessionEncounterLootRows(encounter);
  const interactables = (encounter.interactableRefs || []).map(ref => ({
    ref,
    item: findById("interactables", ref.interactableId)
  }));
  const total = groups.reduce((sum,group)=>sum+group.total,0);
  const remaining = groups.reduce((sum,group)=>sum+group.remaining,0);
  return `
    <article class="session-encounter-v6 panel">
      <header class="session-encounter-head">
        <div><span class="eyebrow">${escapeHtml(sessionModeLabel(encounter.mode))}</span><h2>Rencontre · étage ${Number(encounter.floorIndex)+1}</h2><p>Budget ${escapeHtml(String(encounter.used))}/${escapeHtml(String(encounter.budget))}</p></div>
        <div class="encounter-remaining-v6"><b>${remaining}</b><span>sur ${total}<br>à éliminer</span></div>
      </header>

      <section class="encounter-creatures-v6">
        <div class="session-section-title"><h3>Créatures</h3><span>${remaining ? "Élimination occurrence par occurrence" : "Rencontre terminée"}</span></div>
        ${activeGroups.length ? activeGroups.map(group => {
          const creature = group.creature;
          const hasCategory = Boolean(creature && String(creature.category || "").trim());
          const category = hasCategory ? creatureCategoryMeta(creature.category) : null;
          const image = creature ? imageUrlForEntity(creature) : "";
          const sigil = category?.sigil || "Icone_Gameplay_ACTION.webp";
          const categoryLabel = category?.label || (creature ? "Catégorie non renseignée" : "Relation Codex indisponible");
          return `<div class="encounter-creature-v6 ${category?.key || "unknown"}">
            <div class="encounter-creature-media">${image ? `<img src="${escapeHtml(image)}" alt="" loading="lazy">` : `<img src="${V6_ICON_PATH}${sigil}" alt="">`}</div>
            <div class="encounter-creature-main">
              <div class="encounter-creature-name"><span><img src="${V6_ICON_PATH}${sigil}" alt="">${escapeHtml(categoryLabel)}</span><h4>${escapeHtml(creature?.name || group.name || "Créature indisponible")}</h4></div>
              ${creature ? `<div class="encounter-stat-strip">
                <span><img src="${V6_ICON_PATH}Icone_Gameplay_PV.webp" alt=""><b>${escapeHtml(String(creature.pv ?? "—"))}</b><small>PV</small></span>
                <span><img src="${V6_ICON_PATH}Icone_Gameplay_ATK.webp" alt=""><b>${escapeHtml(String(creature.atk ?? "—"))}</b><small>ATK</small></span>
                <span><img src="${V6_ICON_PATH}Icone_Gameplay_DEF.webp" alt=""><b>${escapeHtml(String(creature.def ?? "—"))}</b><small>DEF</small></span>
                <span><img src="${V6_ICON_PATH}Icone_Gameplay_ACTION.webp" alt=""><b>${escapeHtml(String(creature.actions ?? "—"))}</b><small>Action</small></span>
                <span><img src="${V6_ICON_PATH}Icone_Gameplay_MENACE.webp" alt=""><b>${escapeHtml(String(creature.menace ?? "—"))}</b><small>Menace</small></span>
              </div>` : `<div class="muted small">La fiche Codex liée n'est plus disponible.</div>`}
              ${creature?.special_attack_name ? `<div class="encounter-ability-v6"><img src="${V6_ICON_PATH}Icone_Gameplay_COMPETENCE.webp" alt=""><span>${escapeHtml(creature.special_attack_name)}</span></div>` : ""}
            </div>
            <div class="encounter-creature-actions">
              <div class="encounter-quantity-v6"><b>${group.remaining}</b><span>restante${group.remaining>1?"s":""}</span></div>
              ${creature ? `<button class="ghost" type="button" data-action="jump-codex" data-type="creatures" data-id="${escapeHtml(String(creature.id || ""))}">Fiche</button>` : ""}
              <button class="danger" type="button" data-action="session-eliminate-creature" data-id="${escapeHtml(group.creatureId)}">Éliminer</button>
            </div>
          </div>`;
        }).join("") : `<div class="encounter-complete-v6"><b>Rencontre terminée</b><span>Toutes les occurrences ont été éliminées. Aucun suivi de PV individuel n'est conservé.</span></div>`}
      </section>

      <section class="encounter-objects-v6">
        <div class="session-section-title"><h3>Objets interactifs</h3><span>${interactables.length}</span></div>
        <div class="encounter-object-grid">
          ${interactables.length ? interactables.map(({ref,item})=>`<article class="encounter-object-v6">
            <div><img src="${V6_ICON_PATH}Icone_Entite_OBJET_INTERACTIF.webp" alt=""><span>${escapeHtml(item?.type || "Objet interactif")}</span></div>
            <h4>${escapeHtml(item?.name || ref.name || "Objet indisponible")}</h4>
            ${item?.hp !== null && item?.hp !== undefined && String(item.hp).trim() !== "" ? `<p><b>PV ${escapeHtml(String(item.hp))}</b></p>` : ""}
            ${item?.actions_allowed ? `<p><span>Actions</span> ${escapeHtml(String(item.actions_allowed))}</p>` : ""}
            ${item?.effect ? `<p><span>Effet</span> ${escapeHtml(String(item.effect))}</p>` : ""}
            ${item ? `<button class="ghost" type="button" data-action="jump-codex" data-type="interactables" data-id="${escapeHtml(String(item.id || ""))}">Fiche</button>` : ""}
          </article>`).join("") : `<div class="empty small">Aucun Objet interactif lié à cette génération.</div>`}
        </div>
      </section>

      ${lootRows.length ? `<section class="session-loot-v6">
        <div class="session-section-title"><h3>Loot des occurrences éliminées</h3><span>${lootRows.length}</span></div>
        <div>${lootRows.map((row,index)=>`<div class="session-loot-row"><img src="${V6_ICON_PATH}Icone_Gameplay_BUTIN.webp" alt=""><span><b>${escapeHtml(row.creature?.name || row.name || "Créature")}</b><small>Occurrence ${index+1}</small></span><strong>${escapeHtml(row.loot?.text || "Aucun Loot")}</strong></div>`).join("")}</div>
      </section>` : ""}
    </article>
  `;
}

function renderEncounterMiniPanel() {
  return "";
}

function renderBrouhaha() {
  const session = ensureSessionContext();
  if (!session.active) return renderShell(`<section class="session-tool-page">${renderSessionStartCard("Brouhaha")}</section>`);
  const level = clamp(Number(session.brouhaha.level || 0), 0, 12);
  const current = session.brouhaha.current;
  const history = session.brouhaha.history || [];
  const intensity = level >= 10 ? "critical" : level >= 7 ? "hot" : level >= 4 ? "rising" : "calm";
  return renderShell(`
    <section class="session-tool-page brouhaha-session-v6">
      ${renderSessionToolHeader("brouhaha")}
      <section class="brouhaha-session-stage ${intensity}">
        <div class="brouhaha-fractures" aria-hidden="true"></div>
        <div class="brouhaha-session-side left">
          <button type="button" data-action="session-brouhaha-minus" aria-label="Baisser le Brouhaha de 1">−1</button>
        </div>
        <div class="brouhaha-session-core">
          <span>Brouhaha</span>
          <strong>${level}</strong>
          <small>0 — 12</small>
          <div class="brouhaha-pressure" aria-hidden="true">${Array.from({length:12},(_,i)=>`<i class="${i<level?"on":""}"></i>`).join("")}</div>
        </div>
        <div class="brouhaha-session-side right">
          <button type="button" data-action="session-brouhaha-plus" aria-label="Augmenter le Brouhaha de 1">+1</button>
        </div>
        <button class="brouhaha-draw-v6" type="button" data-action="session-brouhaha-draw">Tirer un effet</button>
      </section>

      <section class="brouhaha-current-v6 panel">
        <div class="session-section-title"><h2>Effet courant</h2><span>${current ? `Niveau ${current.level}` : "Aucun tirage"}</span></div>
        ${current ? `<div class="brouhaha-current-ticket"><img src="${V6_ICON_PATH}Icone_Entite_OBJET_BROUHAHA.webp" alt=""><p>${escapeHtml(current.text || "Effet sans texte.")}</p></div>` : `<div class="empty">Changer le niveau ne tire aucun effet. Utilise « Tirer un effet » quand tu le souhaites.</div>`}
      </section>

      <section class="brouhaha-history-v6 panel">
        <div class="session-section-title"><h2>Historique</h2><button class="ghost" type="button" data-action="session-brouhaha-reset" ${history.length || current || level ? "" : "disabled"}>Réinitialiser</button></div>
        <div class="brouhaha-history-list">
          ${history.length ? history.map((entry,index)=>`<div class="brouhaha-history-row"><b>${entry.level}</b><span>${escapeHtml(entry.text || "Effet sans texte.")}</span><small>${index===0?"courant":""}</small></div>`).join("") : `<div class="empty small">Aucun effet tiré pendant cette partie.</div>`}
        </div>
      </section>
    </section>
  `);
}

function renderQuests() {
  const session = ensureSessionContext();
  if (!session.active) return renderShell(`<section class="session-tool-page">${renderSessionStartCard("Quêtes")}</section>`);
  const candidates = sessionQuestCandidates(session);
  const quest = findById("quests", session.questId);
  const npc = quest ? resolveQuestNpc(quest) : null;
  const difficulty = quest ? questDifficultyMeta(quest.difficulty) : null;
  return renderShell(`
    <section class="session-tool-page session-quest-v6">
      ${renderSessionToolHeader("quests")}
      <section class="session-quest-card panel">
        <div class="session-section-title"><div><span class="eyebrow">Quête de session</span><h2>${quest ? escapeHtml(quest.name || "Quête sans nom") : "Aucune quête tirée"}</h2></div><span>${candidates.length} disponible${candidates.length>1?"s":""}</span></div>
        ${quest ? `
          <div class="session-quest-meta">
            ${difficulty ? `<span class="semantic-tier ${escapeHtml(difficulty.key)}">${escapeHtml(difficulty.label)}</span>` : ""}
            <span><b>Commanditaire</b> ${escapeHtml(npc?.name || quest.npc_name || "Non renseigné")}</span>
          </div>
          ${quest.description ? `<p class="session-quest-description">${escapeHtml(quest.description)}</p>` : ""}
          <div class="session-quest-objective"><span>Objectif</span><strong>${escapeHtml(quest.objective || "Non renseigné")}</strong></div>
          <div class="session-quest-reward"><img src="${V6_ICON_PATH}Icone_Gameplay_BUTIN.webp" alt=""><div><span>Récompense</span><strong>${escapeHtml(quest.reward || "Non renseignée")}</strong></div></div>
          <div class="session-quest-actions">
            <button class="primary" type="button" data-action="session-quest-reroll" ${candidates.length ? "" : "disabled"}>Tirer à nouveau</button>
            <button class="ghost" type="button" data-action="jump-codex" data-type="quests" data-id="${escapeHtml(String(quest.id || ""))}">Ouvrir dans le Codex</button>
          </div>
        ` : `
          <div class="empty">${candidates.length ? "Aucune quête temporaire. Le tirage n'altère pas la Quête du Codex." : "Aucune Quête fiable n'est liée au Donjon actif."}</div>
          <div class="session-quest-actions"><button class="primary" type="button" data-action="session-quest-reroll" ${candidates.length ? "" : "disabled"}>Tirer une quête</button></div>
        `}
      </section>
    </section>
  `);
}

function workshopFamilyIcon(type) {
  const icons = {
    creatures: "Sigil_Basique.webp",
    dungeons: "Icone_Gameplay_DONJON.webp",
    heroes: "Icone_Entite_HEROS.webp",
    npcs: "Icone_Entite_PNJ.webp",
    quests: "Icone_Entite_QUETE.webp",
    loot_items: "Icone_Gameplay_BUTIN.webp",
    interactables: "Icone_Entite_OBJET_INTERACTIF.webp",
    brouhaha_effects: "Icone_Entite_OBJET_BROUHAHA.webp"
  };
  return icons[type] || "Sigil_Basique.webp";
}

function workshopResetRuntime(status = "clean") {
  state.workshop.dirty = false;
  state.workshop.dirtyFields = new Set();
  state.workshop.draft = null;
  state.workshop.draftFile = null;
  state.workshop.isNew = false;
  state.workshop.pending = null;
  state.workshop.deleteTarget = null;
  state.workshop.status = status;
}

function workshopSelectedStoredItem(type = state.ui.workshopType) {
  const id = String(state.ui.workshopSelectedId || "");
  return id ? findById(type, id) : null;
}

function workshopSelectedItem(type = state.ui.workshopType) {
  const id = String(state.ui.workshopSelectedId || "");
  if (state.workshop.draft && String(state.workshop.draft.id || "") === id && state.workshop.draft.__workshopType === type) {
    return state.workshop.draft;
  }
  return workshopSelectedStoredItem(type);
}

function createWorkshopDraft(type) {
  const draft = { id: uid(type === "brouhaha_effects" ? "brouhaha" : type.replace(/_items$|_effects$/,"")), __workshopType: type, __workshopNew: true };
  for (const field of FORM_FIELDS[type] || []) {
    if (field.name === "loot_lines") continue;
    draft[field.name] = "";
  }
  return draft;
}

function workshopRequiredField(type, fieldName) {
  return (WORKSHOP_REQUIRED_FIELDS[type] || []).includes(fieldName);
}

function workshopStatusLabel() {
  if (state.workshop.status === "saving") return "Enregistrement local…";
  if (state.workshop.status === "saved") return "Enregistré localement";
  if (state.workshop.status === "error") return "Erreur locale";
  if (state.workshop.dirty) return "Modifications non enregistrées";
  return "Aucune modification";
}

function syncWorkshopDirtyIndicators() {
  const status = app.querySelector("[data-workshop-status]");
  if (status) {
    status.textContent = workshopStatusLabel();
    status.dataset.state = state.workshop.dirty ? "dirty" : state.workshop.status;
  }
  const save = app.querySelector("[data-workshop-save]");
  if (save) save.disabled = !state.workshop.dirty && !state.workshop.isNew;
  const root = app.querySelector(".workshop-v6");
  if (root) root.classList.toggle("is-dirty", state.workshop.dirty);
}

function captureWorkshopControl(control) {
  const form = control?.closest?.('form[data-workshop-form="true"]');
  if (!form || state.ui.view !== "atelier") return false;
  const type = form.dataset.form;
  const id = form.dataset.id;
  if (!type || !id || !control.name) return false;

  if (!state.workshop.draft || String(state.workshop.draft.id || "") !== String(id) || state.workshop.draft.__workshopType !== type) {
    const current = findById(type, id);
    if (!current && !state.workshop.isNew) return false;
    state.workshop.draft = current ? structuredClone(current) : createWorkshopDraft(type);
    state.workshop.draft.__workshopType = type;
    if (state.workshop.isNew) state.workshop.draft.__workshopNew = true;
  }

  if (control.name === "image_file") {
    state.workshop.draftFile = control.files?.[0] || state.workshop.draftFile || null;
    state.workshop.dirtyFields.add("image_path");
  } else {
    state.workshop.draft[control.name] = control.value;
    state.workshop.dirtyFields.add(control.name);
  }
  state.workshop.dirty = true;
  state.workshop.status = "dirty";
  syncWorkshopDirtyIndicators();
  return true;
}

function workshopRelationSummary(type, item) {
  if (!item) return [];
  const id = String(item.id || "");
  const rows = [];
  const add = (label, count) => { if (count > 0) rows.push({ label, count }); };
  if (type === "dungeons") {
    add("Créatures liées", (state.data.creatures || []).filter(row => String(row.dungeon_id || "") === id).length);
    add("Quêtes liées", (state.data.quests || []).filter(row => String(row.dungeon_id || "") === id).length);
    add("Objets interactifs liés", (state.data.interactables || []).filter(row => String(row.dungeon_id || "") === id).length);
    add("Effets Brouhaha liés", (state.data.brouhaha_effects || []).filter(row => String(row.dungeon_id || "") === id).length);
  } else if (type === "creatures") {
    add("Loot lié", (state.data.loot_items || []).filter(row => String(row.creature_id || "") === id).length);
  } else if (type === "npcs") {
    add("Quêtes commanditées", (state.data.quests || []).filter(row => String(row.npc_id || "") === id).length);
  }
  add("Médias liés", (state.data.media_assets || []).filter(row => String(row.entity_type || "") === type && String(row.entity_id || "") === id).length);
  return rows;
}

function renderWorkshopGuardModal() {
  if (!state.workshop.pending) return "";
  return `<div class="workshop-modal-backdrop" role="presentation">
    <section class="workshop-modal" role="dialog" aria-modal="true" aria-labelledby="workshop-unsaved-title" tabindex="-1">
      <span class="eyebrow">Atelier</span>
      <h2 id="workshop-unsaved-title">Modifications non enregistrées</h2>
      <p>Cette fiche contient des changements qui n'ont pas encore été écrits dans IndexedDB.</p>
      <div class="workshop-modal-actions">
        <button class="ghost" type="button" data-action="workshop-guard-stay">Rester</button>
        <button class="danger ghost" type="button" data-action="workshop-guard-discard">Quitter sans enregistrer</button>
        <button class="primary" type="button" data-action="workshop-guard-save">Enregistrer</button>
      </div>
    </section>
  </div>`;
}

function renderWorkshopDeleteModal() {
  const target = state.workshop.deleteTarget;
  if (!target) return "";
  const item = findById(target.type, target.id);
  if (!item) return "";
  const title = item.name || item.title || item.hero_base_name || item.label || item.id;
  const relations = workshopRelationSummary(target.type, item);
  return `<div class="workshop-modal-backdrop danger-layer" role="presentation">
    <section class="workshop-modal danger-modal" role="dialog" aria-modal="true" aria-labelledby="workshop-delete-title" tabindex="-1">
      <span class="eyebrow">Zone Danger</span>
      <h2 id="workshop-delete-title">Supprimer « ${escapeHtml(title)} » ?</h2>
      <p>Seule cette entité sera supprimée. Les enregistrements liés et les médias ne seront pas supprimés automatiquement.</p>
      ${relations.length ? `<div class="workshop-delete-relations">${relations.map(row => `<span><b>${row.count}</b> ${escapeHtml(row.label)}</span>`).join("")}</div>` : `<div class="muted small">Aucune relation par ID connue dans les données chargées.</div>`}
      ${state.workshop.dirty ? `<p class="workshop-delete-dirty">Les modifications non enregistrées de cette fiche seront également abandonnées.</p>` : ""}
      <div class="workshop-modal-actions">
        <button class="ghost" type="button" data-action="workshop-delete-cancel">Annuler</button>
        <button class="danger" type="button" data-action="workshop-delete-confirm" data-type="${escapeHtml(target.type)}" data-id="${escapeHtml(target.id)}">Supprimer définitivement</button>
      </div>
    </section>
  </div>`;
}

function workshopSectionFields(type, names) {
  const fields = FORM_FIELDS[type] || [];
  return names.map(name => fields.find(field => field.name === name)).filter(Boolean);
}

function renderWorkshopSection(type, section, item) {
  const fields = workshopSectionFields(type, section.fields);
  if (!fields.length) return "";
  return `<fieldset class="workshop-form-section">
    <legend>${escapeHtml(section.title)}</legend>
    <div class="form-grid">${fields.map(field => renderField(field, item, type)).join("")}</div>
  </fieldset>`;
}

function workshopFieldPatchValue(field, raw) {
  if (field.name === "tags") return tagsToArray(raw);
  if (field.name === "floor_budgets") return String(raw || "").trim() ? parseFloorBudgets(raw) : [];
  if (field.type === "number") {
    if (String(raw ?? "").trim() === "") return null;
    let value = Number(raw);
    if (!Number.isFinite(value)) return null;
    if (field.min != null) value = Math.max(Number(field.min), value);
    if (field.max != null) value = Math.min(Number(field.max), value);
    return value;
  }
  return String(raw ?? "").trim();
}

function applyWorkshopDerivedFields(type, entity, changedFields) {
  const changed = name => changedFields.has(name);
  if (["dungeons","creatures","npcs","quests","loot_items","interactables"].includes(type) && changed("name")) {
    entity.slug = slugify(entity.name || "");
  }
  if (type === "creatures" && changed("dungeon_id")) {
    const dungeon = findById("dungeons", entity.dungeon_id);
    entity.dungeon_name = dungeon?.name || "";
    entity.dungeon_slug = dungeon?.slug || "";
  }
  if (type === "quests") {
    if (changed("dungeon_id")) entity.dungeon_name = findById("dungeons", entity.dungeon_id)?.name || "";
    if (changed("npc_id")) entity.npc_name = findById("npcs", entity.npc_id)?.name || "";
  }
  if (type === "loot_items" && changed("creature_id")) {
    entity.creature_name = findById("creatures", entity.creature_id)?.name || "";
  }
  if (type === "interactables" && changed("dungeon_id")) {
    entity.dungeon_name = findById("dungeons", entity.dungeon_id)?.name || "";
  }
  if (type === "brouhaha_effects" && changed("dungeon_id")) {
    entity.dungeon_name = entity.dungeon_id ? (findById("dungeons", entity.dungeon_id)?.name || "") : "";
  }
}

function validateWorkshopForm(type, form) {
  if (!form.reportValidity()) return false;
  for (const name of WORKSHOP_REQUIRED_FIELDS[type] || []) {
    const control = form.elements.namedItem(name);
    const value = control && "value" in control ? String(control.value || "").trim() : "";
    if (!value && name !== "level") {
      control?.focus?.();
      toast(`Le champ « ${FORM_FIELDS[type]?.find(field => field.name === name)?.label || name} » est obligatoire.`, "warn");
      return false;
    }
  }
  return true;
}

function renderWorkshopStatus() {
  const stateName = state.workshop.dirty ? "dirty" : state.workshop.status;
  return `<span class="workshop-save-state" data-workshop-status data-state="${escapeHtml(stateName)}" role="status" aria-live="polite">${escapeHtml(workshopStatusLabel())}</span>`;
}

async function reloadWorkshopDataWithoutRender() {
  const raw = await loadAllData();
  hydrateState(raw);
  state.logs = await getLogs(100);
}

async function saveEntityFromWorkshopForm(type, form, options = {}) {
  const renderAfter = options.renderAfter !== false;
  const toastAfter = options.toastAfter !== false;
  const id = String(form.dataset.id || "");
  const isNew = state.workshop.isNew && String(state.ui.workshopSelectedId || "") === id;
  if (!validateWorkshopForm(type, form)) return null;

  const existing = await getById(type, id);
  if (!isNew && !existing) throw new Error("L'enregistrement à modifier n'existe plus dans IndexedDB.");
  if (isNew && existing) throw new Error("Un enregistrement portant déjà cet identifiant existe. Aucun écrasement n'a été effectué.");
  if (!isNew && !state.workshop.dirty) {
    if (toastAfter) toast("Aucune modification à enregistrer.", "info");
    return existing;
  }

  state.workshop.status = "saving";
  syncWorkshopDirtyIndicators();

  const entity = existing ? structuredClone(existing) : { id };
  const values = new FormData(form);
  const fields = (FORM_FIELDS[type] || []).filter(field => field.name !== "loot_lines");
  const changedFields = isNew
    ? new Set(fields.map(field => field.name))
    : new Set([...state.workshop.dirtyFields].filter(name => name !== "image_file"));

  for (const field of fields) {
    if (!changedFields.has(field.name)) continue;
    entity[field.name] = workshopFieldPatchValue(field, values.get(field.name));
  }

  applyWorkshopDerivedFields(type, entity, changedFields);

  const fileInput = form.querySelector('input[name="image_file"]');
  const file = fileInput?.files?.[0] || state.workshop.draftFile || null;
  if (file) {
    await saveMediaForEntity(type, entity, file);
    changedFields.add("image_path");
  }

  entity.updated_at = nowISO();
  if (!entity.created_at) entity.created_at = nowISO();
  await putOne(type, entity);

  await reloadWorkshopDataWithoutRender();
  state.ui.workshopType = type;
  state.ui.workshopSelectedId = entity.id;
  workshopResetRuntime("saved");
  state.workshop.editorOpen = true;
  await saveUiState(state.ui);

  if (toastAfter) toast("Enregistré localement", "success");
  else if (renderAfter) render();
  return entity;
}

async function deleteWorkshopEntity(type, id) {
  const existing = await getById(type, id);
  if (!existing) {
    state.workshop.deleteTarget = null;
    toast("Cette fiche n'existe plus.", "warn");
    return false;
  }
  await deleteOne(type, id);
  await reloadWorkshopDataWithoutRender();
  workshopResetRuntime("clean");
  state.ui.workshopType = type;
  state.ui.workshopSelectedId = state.data[type]?.[0]?.id || "";
  state.workshop.editorOpen = false;
  if (state.ui.codexSelectedId === id) state.ui.codexSelectedId = state.data[type]?.[0]?.id || "";
  await saveUiState(state.ui);
  toast("Entité supprimée. Les relations et médias liés ont été conservés.", "info");
  return true;
}

async function performWorkshopNavigation(pending) {
  if (!pending) return;
  workshopResetRuntime("clean");

  if (pending.kind === "view") {
    clearCodexContext(true);
    state.ui.view = pending.view || "home";
    state.ui.codexReturnStack = [];
    if (state.ui.view === "codex") state.ui.codexDetailOpen = false;
  } else if (pending.kind === "jump-codex") {
    clearCodexContext(true);
    state.ui.codexReturnStack = [];
    state.ui.globalSearch = "";
    state.ui.view = "codex";
    state.ui.codexType = pending.type;
    state.ui.codexSelectedId = pending.id;
    if (pending.type === "creatures") {
      ensureBestiaryUi();
      state.ui.bestiary.selectedId = pending.id;
    } else if (pending.type === "dungeons") {
      ensureCodexFamilyUi();
      state.ui.codexFamilies.dungeons.selectedId = pending.id;
    } else if (pending.type === "heroes") {
      ensureCodexFamilyUi();
      const hero = findById("heroes", pending.id);
      const group = hero ? heroGroupByKey(heroBaseKey(hero)) : null;
      if (group) {
        state.ui.codexFamilies.heroes.selectedBase = group.key;
        rememberHeroLevel(group, hero.level);
      }
    } else if (["npcs","quests","loot_items","interactables","brouhaha_effects"].includes(pending.type)) {
      ensureCodexFamilyUi();
      state.ui.codexFamilies[pending.type].selectedId = pending.id;
    }
    state.ui.codexDetailOpen = true;
  } else if (pending.kind === "type") {
    state.ui.workshopType = pending.type;
    state.ui.workshopSelectedId = state.data[pending.type]?.[0]?.id || "";
    state.workshop.editorOpen = false;
  } else if (pending.kind === "select") {
    state.ui.workshopType = pending.type;
    state.ui.workshopSelectedId = pending.id;
    state.workshop.editorOpen = true;
  } else if (pending.kind === "new") {
    const draft = createWorkshopDraft(pending.type);
    state.ui.workshopType = pending.type;
    state.ui.workshopSelectedId = draft.id;
    state.workshop.draft = draft;
    state.workshop.isNew = true;
    state.workshop.dirty = true;
    state.workshop.dirtyFields = new Set();
    state.workshop.status = "dirty";
    state.workshop.editorOpen = true;
  } else if (pending.kind === "discard-new") {
    state.ui.workshopSelectedId = state.data[state.ui.workshopType]?.[0]?.id || "";
    state.workshop.editorOpen = false;
  }

  await saveUiState(state.ui);
  render();
}

async function requestWorkshopNavigation(pending) {
  if (state.workshop.dirty) {
    state.workshop.pending = pending;
    render();
    return false;
  }
  await performWorkshopNavigation(pending);
  return true;
}

function wireWorkshopUnloadGuard() {
  window.addEventListener("beforeunload", event => {
    if (!state.workshop.dirty) return;
    event.preventDefault();
    event.returnValue = "";
  });
}

function renderAtelier() {
  const type = WORKSHOP_TYPES.includes(state.ui.workshopType) ? state.ui.workshopType : "creatures";
  state.ui.workshopType = type;
  const items = getFilteredList(type, "atelier");
  let selected = workshopSelectedItem(type);
  if (!selected && items.length) {
    selected = items[0];
    state.ui.workshopSelectedId = selected.id;
  }
  const isDraft = Boolean(state.workshop.isNew && selected && String(selected.id) === String(state.ui.workshopSelectedId));
  const listItems = isDraft ? [selected, ...items.filter(item => item.id !== selected.id)] : items;
  const editorOpen = state.workshop.editorOpen || isDraft;

  return renderShell(`
    <section class="workshop-v6 ${editorOpen ? "editor-open" : ""} ${state.workshop.dirty ? "is-dirty" : ""}">
      <header class="workshop-head-v6">
        <div><span class="eyebrow">Administration locale</span><h1>Atelier</h1><p>Le Codex consulte. L'Atelier crée, modifie et supprime uniquement après action explicite.</p></div>
        ${renderWorkshopStatus()}
      </header>

      <nav class="workshop-family-menu" aria-label="Familles éditables">
        ${WORKSHOP_TYPES.map(family => `<button type="button" class="${family === type ? "active" : ""}" data-action="set-workshop-type" data-type="${family}">
          <img src="${V6_ICON_PATH}${workshopFamilyIcon(family)}" alt="">
          <span>${escapeHtml(getLabel(family))}</span>
        </button>`).join("")}
      </nav>

      <div class="workshop-toolbar-v6">
        <div><strong>${escapeHtml(getLabel(type))}</strong><span>${items.length} fiche${items.length > 1 ? "s" : ""}</span></div>
        <button class="primary" type="button" data-action="new-item" data-type="${type}">＋ Nouveau</button>
        ${type === "creatures" ? renderCreatureDungeonFilter(state.ui.workshopCreatureDungeonId, "atelier-creature-dungeon-filter") : ""}
        ${type === "quests" ? renderQuestDungeonFilter(state.ui.workshopQuestDungeonId, "atelier-quest-dungeon-filter") : ""}
      </div>

      <div class="workshop-layout-v6">
        <aside class="workshop-list-pane panel">
          <div class="workshop-list-title"><strong>Liste</strong><span>Sélectionne une fiche à modifier</span></div>
          <div class="workshop-list-v6">
            ${listItems.map(item => renderWorkshopCard(type, item, String(item.id) === String(selected?.id), isDraft && String(item.id) === String(selected?.id))).join("") || `<div class="empty">Aucune fiche dans cette famille.</div>`}
          </div>
        </aside>

        <main class="workshop-editor-pane">
          <button class="ghost workshop-back-list" type="button" data-action="workshop-back-list">${shellIcon("back")}<span>Retour à la liste</span></button>
          ${selected ? renderWorkshopEditor(type, selected, isDraft) : `<div class="panel empty">Sélectionne une fiche ou utilise « Nouveau ».</div>`}
        </main>
      </div>

      ${renderWorkshopGuardModal()}
      ${renderWorkshopDeleteModal()}
    </section>
  `);
}

function renderWorkshopCard(type, item, active, draft = false) {
  const title = item.name || item.title || item.hero_base_name || item.label || (draft ? "Nouveau brouillon" : item.id || "Sans nom");
  const subtitle = draft ? "Non enregistré" : codexSubtitle(type, item);
  const image = codexImageFor(type, item);
  return `
    <button class="workshop-list-card ${active ? "active" : ""} ${draft ? "draft" : ""}" type="button" data-action="select-workshop" data-type="${type}" data-id="${escapeHtml(String(item.id || ""))}">
      <div class="workshop-list-thumb">${image ? `<img src="${escapeHtml(image)}" alt="">` : `<img src="${V6_ICON_PATH}${workshopFamilyIcon(type)}" alt="">`}</div>
      <span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(subtitle || getLabel(type))}</small></span>
      ${draft ? `<em>Brouillon</em>` : ""}
    </button>
  `;
}

function renderWorkshopEditor(type, item, isDraft = false) {
  const sections = WORKSHOP_SECTIONS[type] || [{ title: "Fiche", fields: (FORM_FIELDS[type] || []).map(field => field.name) }];
  const relations = isDraft ? [] : workshopRelationSummary(type, item);
  const title = item.name || item.title || item.hero_base_name || item.label || (isDraft ? "Nouveau brouillon" : item.id || "Fiche");
  return `
    <form class="edit-form workshop-edit-form" data-form="${type}" data-id="${escapeHtml(String(item.id || ""))}" data-workshop-form="true" novalidate>
      <header class="workshop-editor-head panel">
        <div><span class="eyebrow">${isDraft ? "Nouveau brouillon" : "Fiche d'édition"}</span><h2>${escapeHtml(title)}</h2><small>ID · ${escapeHtml(String(item.id || ""))}</small></div>
        ${renderWorkshopStatus()}
      </header>

      <div class="workshop-sections-v6">
        ${sections.map(section => renderWorkshopSection(type, section, item)).join("")}
      </div>

      <section class="workshop-danger-zone">
        <div><span>Zone Danger</span><strong>${isDraft ? "Abandonner ce brouillon" : "Supprimer cette entité"}</strong>
          <small>${isDraft ? "Aucune donnée métier n'a encore été créée." : (relations.length ? relations.map(row => `${row.count} ${row.label.toLowerCase()}`).join(" · ") : "Aucune relation par ID connue.")}</small>
        </div>
        ${isDraft
          ? `<button class="danger ghost" type="button" data-action="workshop-discard-new">Abandonner le brouillon</button>`
          : `<button class="danger ghost" type="button" data-action="delete-item" data-type="${type}" data-id="${escapeHtml(String(item.id || ""))}">Supprimer…</button>`}
      </section>

      <div class="workshop-savebar">
        <div>${renderWorkshopStatus()}</div>
        <button class="primary" type="submit" data-workshop-save ${!state.workshop.dirty && !isDraft ? "disabled" : ""}>Enregistrer</button>
      </div>
    </form>
  `;
}

function renderField(field, item, type = state.ui.workshopType) {
  const currentValue = item?.[field.name] ?? "";
  const required = workshopRequiredField(type, field.name) ? "required" : "";

  if (field.name === "loot_lines" && type === "creatures") {
    const value = getLootTextForCreature(item);
    return `
      <label class="wide workshop-readonly-field">
        <span>Butin lié</span>
        <textarea rows="${field.rows || 5}" disabled>${escapeHtml(value || "Aucun Loot lié.")}</textarea>
        <small>Lecture seule ici pour préserver les IDs et propriétés des Loots existants. Modifie-les dans la famille Loot.</small>
        <button class="ghost" type="button" data-action="set-workshop-type" data-type="loot_items">Ouvrir Loot dans l'Atelier</button>
      </label>
    `;
  }

  if (field.type === "select") {
    let options = [];
    if (field.options === "mediaEntityTypes") {
      options = ["gallery", "creatures", "heroes", "npcs", "quests", "dungeons", "loot_items"];
    } else if (Array.isArray(field.options)) {
      options = field.options;
    } else {
      options = state.data[field.options] || [];
    }
    const optionData = options.map(opt => {
      const isStatic = typeof opt === "string" || (opt && typeof opt === "object" && "value" in opt);
      const value = field.options === "mediaEntityTypes"
        ? opt
        : isStatic
          ? (typeof opt === "string" ? opt : opt.value)
          : opt.id;
      const label = field.options === "mediaEntityTypes"
        ? opt
        : isStatic
          ? (typeof opt === "string" ? opt : opt.label || opt.value)
          : (opt.name || opt.title || opt.hero_base_name || opt.id || "");
      return { value: String(value ?? ""), label: String(label ?? "") };
    });
    const current = String(currentValue ?? "");
    const known = optionData.some(opt => opt.value === current);
    return `
      <label>
        <span>${escapeHtml(field.label)}</span>
        <select name="${field.name}" ${required}>
          ${field.allowEmpty || !current ? `<option value="">—</option>` : ""}
          ${current && !known ? `<option value="${escapeHtml(current)}" selected>Valeur actuelle indisponible · ${escapeHtml(current)}</option>` : ""}
          ${optionData.map(opt => `<option value="${escapeHtml(opt.value)}" ${opt.value === current ? "selected" : ""}>${escapeHtml(opt.label)}</option>`).join("")}
        </select>
      </label>
    `;
  }

  if (field.type === "textarea") {
    return `
      <label class="wide">
        <span>${escapeHtml(field.label)}</span>
        <textarea name="${field.name}" rows="${field.rows || 4}" placeholder="${escapeHtml(field.placeholder || "")}" ${required}>${escapeHtml(currentValue)}</textarea>
      </label>
    `;
  }

  if (field.type === "image") {
    const preview = item?.image_path ? imageUrlForEntity(item) : "";
    return `
      <label class="wide workshop-image-field">
        <span>${escapeHtml(field.label)}</span>
        <div class="workshop-image-row">
          ${preview ? `<div class="field-preview"><img src="${escapeHtml(preview)}" alt=""></div>` : `<div class="field-preview placeholder"><img src="${V6_ICON_PATH}${workshopFamilyIcon(type)}" alt=""></div>`}
          <div>
            <input name="image_file" type="file" accept="image/*">
            <label class="workshop-path-label"><span>Chemin enregistré</span><input name="image_path" value="${escapeHtml(currentValue)}" placeholder="assets/images/..."></label>
            <small>L'image n'est écrite qu'au clic Enregistrer. L'original média existant n'est jamais remplacé automatiquement.</small>
          </div>
        </div>
      </label>
    `;
  }

  const inputType = field.type === "number" ? "number" : "text";
  const attrs = [
    `name="${field.name}"`,
    `type="${inputType}"`,
    required,
    field.min != null ? `min="${field.min}"` : "",
    field.max != null ? `max="${field.max}"` : "",
    field.step != null ? `step="${field.step}"` : "",
    field.placeholder ? `placeholder="${escapeHtml(field.placeholder)}"` : ""
  ].filter(Boolean).join(" ");
  return `
    <label>
      <span>${escapeHtml(field.label)}</span>
      <input ${attrs} value="${escapeHtml(currentValue)}">
    </label>
  `;
}

function mediaAttachment(asset) {
  const type = relationStore(asset?.entity_type);
  const id = String(asset?.entity_id || "");
  if (!type || !id || !state.data[type]) return null;
  const entity = findById(type, id);
  return entity ? { type, entity } : null;
}

function mediaIsLinked(asset) { return Boolean(mediaAttachment(asset)); }

function mediaEntityTitle(type, entity) { return entity?.name || entity?.title || entity?.hero_base_name || entity?.label || entity?.id || getLabel(type); }

function mediaBytes(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n < 1024) return `${n} o`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} Ko`;
  return `${(n / (1024 * 1024)).toFixed(1)} Mo`;
}

function mediaDerivativeState(asset) {
  if (!asset?.transparent_blob) return { key: "none", label: "Aucun dérivé", tone: "muted" };
  if (asset.transparent_review_status === "approved" && asset.transparent_audit?.pass === true) return { key: "approved", label: "Dérivé validé", tone: "ok" };
  if (asset.transparent_review_status === "needs_fix" || asset.transparent_audit?.pass === false) return { key: "needs_fix", label: "Dérivé à corriger", tone: "err" };
  return { key: "pending", label: "Contrôle visuel requis", tone: "warn" };
}

function mediaFilteredAssets() {
  const ui = state.ui.media || {};
  const scope = ["all","linked","orphan"].includes(ui.scope) ? ui.scope : "all";
  const query = normalizeBestiaryText(ui.search || "");
  return [...(state.data.media_assets || [])].filter(asset => {
    const linked = mediaIsLinked(asset);
    if (scope === "linked" && !linked) return false;
    if (scope === "orphan" && linked) return false;
    if (!query) return true;
    const attachment = mediaAttachment(asset);
    const hay = normalizeBestiaryText([
      asset.label, asset.file_name, asset.path, asset.mime_type, asset.entity_type, asset.entity_id,
      attachment ? mediaEntityTitle(attachment.type, attachment.entity) : "",
      asset.transparent_review_status, asset.transparent_model, asset.transparent_processing
    ].filter(Boolean).join(" "));
    return hay.includes(query);
  }).sort((a,b) => String(a.label || a.file_name || a.id).localeCompare(String(b.label || b.file_name || b.id), "fr", { sensitivity: "base" }));
}

function renderMediaAssetCard(asset, active = false) {
  const preview = thumbUrlForAsset(asset);
  const attachment = mediaAttachment(asset);
  const derivative = mediaDerivativeState(asset);
  return `
    <button class="media-card-v6 ${active ? "active" : ""}" type="button" data-action="media-select" data-id="${escapeHtml(String(asset.id || ""))}">
      <div class="media-card-visual">${preview ? `<img src="${escapeHtml(preview)}" alt="" loading="lazy">` : `<div class="media-empty-visual">Aperçu indisponible</div>`}</div>
      <div class="media-card-copy-v6">
        <div class="media-card-kicker"><span class="media-local-dot"></span><span>Original local</span></div>
        <strong>${escapeHtml(asset.label || asset.file_name || asset.id || "Média")}</strong>
        <small>${attachment ? `${escapeHtml(getLabel(attachment.type))} · ${escapeHtml(mediaEntityTitle(attachment.type, attachment.entity))}` : "Orphelin · sans rattachement"}</small>
        <div class="media-card-state ${derivative.tone}"><i></i><span>${escapeHtml(derivative.label)}</span></div>
      </div>
    </button>`;
}

function renderMediaVariant(label, url, kind, meta = "") {
  return `<article class="media-variant-card ${kind}">
    <header><strong>${escapeHtml(label)}</strong>${meta ? `<span>${escapeHtml(meta)}</span>` : ""}</header>
    <div class="media-variant-preview ${kind === "transparent" ? "checker" : ""}">
      ${url ? `<img src="${escapeHtml(url)}" alt="${escapeHtml(label)}" loading="lazy">` : `<span>Non disponible</span>`}
    </div>
  </article>`;
}

function renderMedia() {
  const assets = mediaFilteredAssets();
  const selected = assets.find(asset => String(asset.id) === String(state.ui.media.selectedId || "")) ||
    (state.ui.media.selectedId ? findById("media_assets", state.ui.media.selectedId) : null) || assets[0] || null;
  const scope = ["all","linked","orphan"].includes(state.ui.media.scope) ? state.ui.media.scope : "all";
  return renderShell(`
    <section class="media-library-v6 ${selected && state.ui.media.selectedId ? "detail-open" : ""}">
      <header class="media-library-head">
        <div><span class="eyebrow">Administration locale</span><h1>Médias</h1><p>Originaux, miniatures, aperçus et dérivés transparents restent distincts.</p></div>
        <label class="primary media-add-button">Ajouter<input type="file" accept="image/*" multiple data-action="media-upload" hidden></label>
      </header>
      <div class="media-toolbar-v6">
        <label class="media-search-v6"><span>Recherche</span><input type="search" data-action="media-search" value="${escapeHtml(state.ui.media.search || "")}" placeholder="Rechercher un média…"></label>
        <div class="segmented" role="group" aria-label="Filtre de bibliothèque">
          ${[["all","Tous"],["linked","Liés"],["orphan","Orphelins"]].map(([value,label]) => `<button type="button" data-action="media-scope" data-scope="${value}" class="${scope === value ? "active" : ""}" aria-pressed="${scope === value ? "true" : "false"}">${label}</button>`).join("")}
        </div>
        <span class="media-count-v6">${assets.length} média${assets.length > 1 ? "s" : ""}</span>
      </div>
      <div class="media-library-layout">
        <section class="media-grid-v6">${assets.map(asset => renderMediaAssetCard(asset, selected && String(asset.id) === String(selected.id))).join("") || `<div class="panel empty">Aucun média pour ce filtre.</div>`}</section>
        <aside class="media-detail-pane-v6">${selected ? renderMediaAssetDetail(selected) : `<div class="panel empty">Sélectionne un média.</div>`}</aside>
      </div>
    </section>`);
}

async function idbStoreCount(storeName){return transaction([storeName],"readonly",({[storeName]:store})=>new Promise((resolve,reject)=>{const req=store.count();req.onsuccess=()=>resolve(Number(req.result||0));req.onerror=()=>reject(req.error||new Error(`Count ${storeName} failed`));}));}

async function collectLocalDiagnostic(){
  const counts={};for(const def of STORE_DEFS){try{counts[def.name]=await idbStoreCount(def.name);}catch(_){counts[def.name]=null;}}
  const reg="serviceWorker"in navigator?(state.serviceWorkerRegistration||await navigator.serviceWorker.getRegistration()):null,names="caches"in globalThis?await caches.keys():[],cachePresent=names.includes(PWA_CACHE_NAME),cachedCore={};
  if(cachePresent){const cache=await caches.open(PWA_CACHE_NAME);for(const path of PWA_OFFLINE_CORE)cachedCore[path]=Boolean(await cache.match(path,{ignoreSearch:true}));}else for(const path of PWA_OFFLINE_CORE)cachedCore[path]=false;
  let storage=null,persisted=null;try{storage=await navigator.storage?.estimate?.();persisted=await navigator.storage?.persisted?.();}catch(_){}
  const lastError=(state.logs||[]).find(log=>String(log.level||"").toLowerCase()==="error")||null,standalone=Boolean(window.matchMedia?.("(display-mode: standalone)").matches||navigator.standalone===true),swState=!reg?"absent":reg.waiting?"mise à jour prête":reg.installing?"installation":reg.active?.state||"enregistré";
  return{generated_at:nowISO(),app_version:APP_VERSION,indexeddb:{name:DB_NAME,version:DB_VERSION,stores:STORE_DEFS.map(d=>d.name),counts},pwa:{manifest:true,display_mode:standalone?"standalone":"browser",install_prompt_available:Boolean(state.pwaInstallPrompt),service_worker_supported:"serviceWorker"in navigator,service_worker_state:swState,controller:Boolean(navigator.serviceWorker?.controller),cache_name:PWA_CACHE_NAME,cache_present:cachePresent,cached_core:cachedCore,offline_core_ready:PWA_OFFLINE_CORE.every(path=>cachedCore[path]===true),online:navigator.onLine},storage:storage?{usage:storage.usage||0,quota:storage.quota||0,persisted}:null,last_error:lastError?{message:lastError.message||"",created_at:lastError.created_at||"",level:lastError.level||"error"}:null};
}

function diagnosticText(diag){return JSON.stringify(diag,null,2);}

async function refreshDiagnostic(renderAfter=true){state.diagnostic=await collectLocalDiagnostic();if(renderAfter)render();return state.diagnostic;}

async function copyDiagnostic(){const textValue=diagnosticText(state.diagnostic||await collectLocalDiagnostic());if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(textValue);return;}const area=document.createElement("textarea");area.value=textValue;document.body.appendChild(area);area.select();document.execCommand("copy");area.remove();}

async function exportDiagnosticFile(){const d=state.diagnostic||await collectLocalDiagnostic();downloadBlob(new Blob([diagnosticText(d)],{type:"application/json"}),`gargottex_diagnostic_${new Date().toISOString().slice(0,10)}.json`);}

async function clearLocalLogsOnly(){await clearStore("logs");state.logs=[];await refreshDiagnostic(false);render();}

async function requestPwaUpdate(){if(!("serviceWorker"in navigator))throw new Error("Service Worker non supporté.");const reg=state.serviceWorkerRegistration||await navigator.serviceWorker.getRegistration();if(!reg)throw new Error("Service Worker non enregistré.");await reg.update();if(reg.waiting)reg.waiting.postMessage({type:"SKIP_WAITING"});state.serviceWorkerRegistration=reg;await refreshDiagnostic();}

async function promptPwaInstall(){const prompt=state.pwaInstallPrompt;if(!prompt){toast("Installation : utilise le menu du navigateur / Partager → Ajouter à l’écran d’accueil si aucun prompt n’est proposé.","info");return;}await prompt.prompt();await prompt.userChoice;state.pwaInstallPrompt=null;await refreshDiagnostic();}

function wirePwaInstallPrompt(){window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();state.pwaInstallPrompt=event;if(state.ui?.view==="import")refreshDiagnostic().catch(()=>{});});window.addEventListener("appinstalled",()=>{state.pwaInstallPrompt=null;if(state.ui?.view==="import")refreshDiagnostic().catch(()=>{});});}

function renderDiagnosticPanel(){
  const d=state.diagnostic;if(!d)return`<section class="diagnostic-v6 panel"><div class="panel-title compact"><h3>Diagnostic local</h3></div><div class="empty">Diagnostic en cours…</div></section>`;
  const countRows=STORE_DEFS.map(def=>`<div><span>${escapeHtml(def.name)}</span><b>${d.indexeddb.counts[def.name]??"?"}</b></div>`).join(""),coreReady=Object.values(d.pwa.cached_core||{}).filter(Boolean).length;
  return`<section class="diagnostic-v6 panel"><header class="diagnostic-head-v6"><div><span class="eyebrow">État local</span><h3>Diagnostic</h3></div><span class="${d.pwa.offline_core_ready?"ok":"warn"}">${d.pwa.offline_core_ready?"Cache offline prêt":"Cache offline incomplet"}</span></header><div class="diagnostic-metrics-v6"><div><span>Version PWA</span><b>${escapeHtml(d.app_version)}</b></div><div><span>IndexedDB</span><b>v${d.indexeddb.version}</b><small>${escapeHtml(d.indexeddb.name)}</small></div><div><span>Service Worker</span><b>${escapeHtml(d.pwa.service_worker_state)}</b><small>${d.pwa.controller?"contrôle la page":"sans contrôleur"}</small></div><div><span>Cache V6</span><b>${coreReady}/${PWA_OFFLINE_CORE.length}</b><small>${escapeHtml(d.pwa.cache_name)}</small></div></div><div class="diagnostic-columns-v6"><div class="diagnostic-box"><strong>Stores & compteurs</strong><div class="diagnostic-store-grid">${countRows}</div></div><div class="diagnostic-box"><strong>PWA / offline</strong><p>Affichage : ${escapeHtml(d.pwa.display_mode)} · réseau : ${d.pwa.online?"en ligne":"hors ligne"}</p><p>Installation : ${d.pwa.display_mode==="standalone"?"installée":d.pwa.install_prompt_available?"prompt disponible":"via navigateur"}</p><p>Réouverture offline : ${d.pwa.offline_core_ready?"assets cœur disponibles en cache":"à revalider après mise à jour du cache"}</p>${d.storage?`<p>Stockage : ${mediaBytes(d.storage.usage)} / ${mediaBytes(d.storage.quota)}${d.storage.persisted===true?" · persistant":""}</p>`:""}</div><div class="diagnostic-box wide"><strong>Dernière erreur locale</strong>${d.last_error?`<p>${escapeHtml(d.last_error.message)}</p><small>${escapeHtml(d.last_error.created_at)}</small>`:`<p>Aucune erreur dans le journal chargé.</p>`}</div></div><div class="diagnostic-actions-v6"><button class="secondary" type="button" data-action="diagnostic-refresh">Actualiser</button><button class="secondary" type="button" data-action="diagnostic-copy">Copier diagnostic</button><button class="secondary" type="button" data-action="diagnostic-export">Exporter diagnostic</button><button class="secondary" type="button" data-action="pwa-install">Installer la PWA</button><button class="secondary" type="button" data-action="pwa-update">Vérifier la mise à jour</button><button class="danger ghost" type="button" data-action="diagnostic-clear-logs">Vider uniquement les logs</button></div></section>`;
}

function renderImportExport(){
  const preview=state.importRuntime.preview,last=state.importRuntime.lastResult;
  return renderShell(`<section class="admin-io-v6"><header class="admin-io-head"><div><span class="eyebrow">Administration locale</span><h1>Import / Export</h1><p>Prévisualiser, confirmer, sauvegarder. Aucun backend distant.</p></div></header><section class="panel import-v6"><div class="panel-title"><h2>Import structuré</h2><div class="muted">JSON et XLSX utilisent deux entrées distinctes. Les médias binaires ne s'importent pas par ce formulaire.</div></div><label class="import-family-select"><span>Famille</span><select data-action="import-type">${IMPORT_TYPES.map(t=>`<option value="${t}" ${t===state.ui.import.type?"selected":""}>${escapeHtml(getLabel(t))}</option>`).join("")}</select></label><div class="import-format-grid"><label class="import-format-card"><span class="eyebrow">JSON</span><strong>Importer JSON</strong><small>Tableau, objet <code>rows</code> ou export structuré Gargottex.</small><input type="file" accept=".json,application/json" data-action="import-json-file"></label><label class="import-format-card"><span class="eyebrow">XLSX</span><strong>Importer XLSX</strong><small>La feuille correspondant à la famille sélectionnée est utilisée.</small><input type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" data-action="import-xlsx-file"></label></div>${preview?renderImportPreview(preview):`<div class="import-preview-empty">Charge un JSON ou XLSX : le preview est calculé en mémoire, sans write métier.</div>`}${last?`<div class="import-final-report"><strong>Dernier bilan</strong><span>${last.written} écriture(s) · ${last.created} création(s) · ${last.updated} mise(s) à jour · ${last.excluded} exclue(s)</span><small>${escapeHtml(last.fileName)} · ${escapeHtml(String(last.format).toUpperCase())}</small></div>`:""}</section><section class="panel export-v6"><div class="panel-title"><h2>Export</h2><div class="muted">Les exports XLSX/JSON structurés <strong>ne contiennent aucun Blob média</strong>. Le backup ZIP est le format de sécurité avec binaires.</div></div><div class="export-safety-grid"><article><span>XLSX existants</span><strong>Données structurées</strong><p>Format historique conservé. Aucun Blob.</p><div class="export-buttons">${ENTITY_ORDER.map(t=>`<button class="secondary" data-action="export-entity" data-type="${t}">Exporter ${escapeHtml(getLabel(t))}</button>`).join("")}<button class="primary" data-action="export-all">Exporter tout XLSX</button></div></article><article><span>JSON</span><strong>Snapshot structuré</strong><p>Préserve les propriétés sérialisables et les métadonnées médias. Aucun Blob.</p><button class="primary" data-action="export-structured-json">Exporter JSON structuré</button></article><article class="backup-card-v6"><span>Sauvegarde de sécurité</span><strong>Backup ZIP complet</strong><p>Contient XLSX, JSON structuré, métadonnées et Blobs média disponibles : originaux, thumbnails, aperçus et dérivés transparents. Le ZIP est relu et vérifié avant téléchargement.</p><button class="primary" data-action="export-backup">Exporter et vérifier le backup ZIP</button></article></div><div class="backup-restore-note">La restauration ZIP destructive historique est désactivée. Toute restauration métier passe par un import avec preview et confirmation.</div></section>${renderDiagnosticPanel()}</section>`);
}

function renderImportPreview(preview){
  const s=preview.summary;
  return`<section class="import-preview-v6" aria-live="polite" aria-atomic="false"><header><div><span class="eyebrow">Preview obligatoire</span><h3>${escapeHtml(preview.fileName||"Fichier")}</h3><p>${escapeHtml(String(preview.format||"").toUpperCase())} · ${escapeHtml(getLabel(preview.type))}</p></div><span class="import-no-write">Aucune donnée métier écrite</span></header>
  <div class="metric-grid import-metrics-v6"><div class="metric"><span>Total</span><b>${s.total}</b></div><div class="metric ok"><span>Valides</span><b>${s.valid}</b></div><div class="metric warn"><span>Warnings</span><b>${s.warningRows}</b><small>${s.warnings} message(s)</small></div><div class="metric err"><span>Erreurs</span><b>${s.errorRows}</b><small>${s.errors} bloquante(s)</small></div></div>
  <div class="import-effect-plan"><strong>Effet prévu</strong><span>${s.create} création(s) · ${s.update} mise(s) à jour · ${s.exclude} exclue(s)</span></div>
  <div class="import-plan-table">${preview.rows.slice(0,60).map(row=>`<article class="import-plan-row ${row.effect}"><span class="import-row-index">#${row.index}</span><div><strong>${escapeHtml(row.label)}</strong>${row.warnings.map(m=>`<small class="warning">⚠ ${escapeHtml(m)}</small>`).join("")}${row.errors.map(m=>`<small class="error">✕ ${escapeHtml(m)}</small>`).join("")}</div><span class="import-effect-badge">${row.effect==="create"?"Créer":row.effect==="update"?"Mettre à jour":"Exclure"}</span></article>`).join("")}</div>
  ${preview.rows.length>60?`<p class="muted small">${preview.rows.length-60} ligne(s) supplémentaires non affichées, incluses dans les métriques.</p>`:""}<div class="form-actions"><button class="primary" type="button" data-action="import-apply" ${s.valid?"":"disabled"}>Confirmer ${s.valid} écriture(s)</button><button class="secondary" type="button" data-action="import-clear">Annuler le preview</button></div></section>`;
}

function renderJournalDrawer() {
  return `
    <div class="drawer-overlay">
      <div class="drawer journal" role="dialog" aria-modal="true" aria-labelledby="journal-title" tabindex="-1">
        <div class="panel-title">
          <h2 id="journal-title">Journal d'erreurs</h2>
          <button class="ghost" type="button" data-action="toggle-journal" aria-label="Fermer le journal">✕</button>
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

function restoreBestiaryScrollAfterRender() {
  if (state.ui.view !== "codex" || state.ui.codexType !== "creatures" || state.ui.codexDetailOpen) return;
  ensureBestiaryUi();
  const top = Math.max(0, Number(state.ui.bestiary.scrollTop || 0));
  restoringBestiaryScroll = true;
  requestAnimationFrame(() => {
    window.scrollTo({ top, left: 0, behavior: "auto" });
    requestAnimationFrame(() => { restoringBestiaryScroll = false; });
  });
}

function wireBestiaryScrollTracking() {
  window.addEventListener("scroll", () => {
    if (restoringBestiaryScroll || state.ui.view !== "codex" || state.ui.codexType !== "creatures" || state.ui.codexDetailOpen) return;
    ensureBestiaryUi();
    state.ui.bestiary.scrollTop = Math.max(0, window.scrollY || 0);
    if (bestiaryScrollSaveTimer) clearTimeout(bestiaryScrollSaveTimer);
    bestiaryScrollSaveTimer = setTimeout(() => saveUiState(state.ui).catch(() => {}), 180);
  }, { passive: true });
}

function restoreCodexFamilyScrollAfterRender() {
  if (state.ui.view !== "codex" || state.ui.codexDetailOpen || !["dungeons", "heroes", "npcs", "quests", "loot_items", "interactables", "brouhaha_effects"].includes(state.ui.codexType)) return;
  ensureCodexFamilyUi();
  const top = Math.max(0, Number(state.ui.codexFamilies[state.ui.codexType].scrollTop || 0));
  restoringCodexFamilyScroll = true;
  requestAnimationFrame(() => {
    window.scrollTo({ top, left: 0, behavior: "auto" });
    requestAnimationFrame(() => { restoringCodexFamilyScroll = false; });
  });
}

function wireCodexFamilyScrollTracking() {
  window.addEventListener("scroll", () => {
    const type = state.ui.codexType;
    if (restoringCodexFamilyScroll || state.ui.view !== "codex" || state.ui.codexDetailOpen || !["dungeons", "heroes", "npcs", "quests", "loot_items", "interactables", "brouhaha_effects"].includes(type)) return;
    ensureCodexFamilyUi();
    state.ui.codexFamilies[type].scrollTop = Math.max(0, window.scrollY || 0);
    if (codexFamilyScrollSaveTimer) clearTimeout(codexFamilyScrollSaveTimer);
    codexFamilyScrollSaveTimer = setTimeout(() => saveUiState(state.ui).catch(() => {}), 180);
  }, { passive: true });
}

function wireCreatureMediaFallbacks() {
  app.addEventListener("error", ev => {
    const img = ev.target;
    if (!(img instanceof HTMLImageElement) || !img.matches("[data-safe-media]")) return;
    img.hidden = true;
    const fallback = img.nextElementSibling;
    if (fallback instanceof HTMLElement && fallback.classList.contains("relation-media-fallback")) {
      fallback.hidden = false;
    }
    const art = img.closest(".creature-art-v6");
    if (art) {
      art.classList.add("media-error");
      const error = art.querySelector(".creature-media-error");
      if (error instanceof HTMLElement) error.hidden = false;
    }
  }, true);
}

const OVERLAY_FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusDescriptor(element) {
  if (!(element instanceof HTMLElement) || !app.contains(element)) return null;
  const dataset = {};
  for (const key of ["action","view","type","id","base","level","src"]) {
    if (element.dataset?.[key]) dataset[key] = element.dataset[key];
  }
  return {
    tag: element.tagName.toLowerCase(),
    dataset,
    name: element.getAttribute("name") || "",
    ariaLabel: element.getAttribute("aria-label") || ""
  };
}

function findFocusDescriptor(descriptor) {
  if (!descriptor) return null;
  const candidates = Array.from(app.querySelectorAll(descriptor.tag || "button"));
  return candidates.find(element => {
    if (!(element instanceof HTMLElement) || element.offsetParent === null) return false;
    if (descriptor.name && element.getAttribute("name") !== descriptor.name) return false;
    if (descriptor.ariaLabel && element.getAttribute("aria-label") !== descriptor.ariaLabel) return false;
    return Object.entries(descriptor.dataset || {}).every(([key,value]) => element.dataset?.[key] === value);
  }) || null;
}

function focusDialog(dialog) {
  if (!(dialog instanceof HTMLElement)) return;
  const focusable = Array.from(dialog.querySelectorAll(OVERLAY_FOCUSABLE)).filter(element => element instanceof HTMLElement && element.offsetParent !== null);
  (focusable[0] || dialog).focus({ preventScroll: true });
}

function closeActiveOverlay(dialog) {
  if (!(dialog instanceof HTMLElement)) return false;
  const selector = dialog.classList.contains("danger-modal")
    ? '[data-action="workshop-delete-cancel"]'
    : dialog.classList.contains("workshop-modal")
      ? '[data-action="workshop-guard-stay"]'
      : dialog.classList.contains("image-viewer-panel")
        ? '[data-action="close-image-viewer"]'
        : dialog.classList.contains("journal")
          ? '[data-action="toggle-journal"]'
          : "";
  const control = selector ? dialog.querySelector(selector) : null;
  if (control instanceof HTMLElement) {
    control.click();
    return true;
  }
  return false;
}

function wireOverlayKeyboard() {
  document.addEventListener("keydown", event => {
    const dialog = app.querySelector('[role="dialog"][aria-modal="true"]');
    if (!(dialog instanceof HTMLElement)) return;
    if (event.key === "Escape") {
      if (closeActiveOverlay(dialog)) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(dialog.querySelectorAll(OVERLAY_FOCUSABLE)).filter(element => element instanceof HTMLElement && element.offsetParent !== null);
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus({ preventScroll: true });
      return;
    }
    const first = focusable[0], last = focusable[focusable.length - 1], active = document.activeElement;
    if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function render() {
  const previousDialog = app.querySelector('[role="dialog"][aria-modal="true"]');
  const hadDialog = previousDialog instanceof HTMLElement;
  const focusBefore = hadDialog ? null : focusDescriptor(document.activeElement);
  app.innerHTML = renderPage();
  restoreBestiaryScrollAfterRender();
  restoreCodexFamilyScrollAfterRender();

  const nextDialog = app.querySelector('[role="dialog"][aria-modal="true"]');
  const hasDialog = nextDialog instanceof HTMLElement;
  if (hasDialog && !hadDialog) {
    overlayFocusReturn = focusBefore;
    requestAnimationFrame(() => focusDialog(nextDialog));
  } else if (!hasDialog && hadDialog) {
    const descriptor = overlayFocusReturn;
    overlayFocusReturn = null;
    requestAnimationFrame(() => findFocusDescriptor(descriptor)?.focus({ preventScroll: true }));
  }
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

function uniqueEntityByName(type,name){
  const target=normalizeBestiaryText(name||"");if(!target)return{entity:null,count:0};
  const matches=(state.data[type]||[]).filter(item=>normalizeBestiaryText(item.name||item.title||item.hero_base_name||"")===target);
  return{entity:matches.length===1?matches[0]:null,count:matches.length};
}

function importLabel(type,row){return displayImportLabel(type,row)||row.name||row.hero_base_name||row.effect_text||row.id||"Ligne sans libellé";}

function validateImportRow(type,row){
  const errors=[],warnings=[],text=v=>String(v??"").trim(),number=v=>Number(v);
  const rel=(store,value,label,optional=false)=>{const name=text(value);if(!name){if(!optional)warnings.push(`${label} non renseigné : relation laissée vide.`);return;}const m=uniqueEntityByName(store,name);if(m.count===0)warnings.push(`${label} « ${name} » introuvable : relation ID non résolue.`);if(m.count>1)warnings.push(`${label} « ${name} » ambigu : relation ID conservée/vide.`);};
  switch(type){
    case"dungeons":if(!text(row.name))errors.push("Nom obligatoire.");break;
    case"creatures":{
      if(!text(row.name))errors.push("Nom obligatoire.");rel("dungeons",row.dungeon_name,"Donjon");
      if(text(row.category)){const raw=normalizeBestiaryText(row.category).replace(/ /g,"_");if(!new Set(["basique","tactique","speciale","brute","mini_boss","boss"]).has(raw))errors.push(`Catégorie inconnue : ${row.category}.`);}
      if(text(row.loot))warnings.push("La colonne Loot enrichit la fiche Créature mais ne remplace jamais la famille Loot.");break;
    }
    case"heroes":if(!text(row.hero_base_name))errors.push("Nom de base obligatoire.");if(!Number.isInteger(number(row.level))||number(row.level)<1||number(row.level)>4)errors.push("Niveau Héros attendu entre 1 et 4.");if(!text(row.name))warnings.push("Nom complet absent : le nom pourra être dérivé du nom de base et du niveau.");break;
    case"npcs":if(!text(row.name))errors.push("Nom obligatoire.");break;
    case"quests":if(!text(row.name))errors.push("Nom obligatoire.");rel("dungeons",row.dungeon_name,"Donjon",true);rel("npcs",row.npc_name,"PNJ",true);if(text(row.difficulty)&&(!Number.isFinite(number(row.difficulty))||number(row.difficulty)<1||number(row.difficulty)>6))errors.push("Difficulté attendue entre 1 et 6.");break;
    case"loot_items":if(!text(row.name))errors.push("Nom obligatoire.");rel("creatures",row.creature_name,"Créature",true);break;
    case"interactables":if(!text(row.name))errors.push("Nom obligatoire.");rel("dungeons",row.dungeon_name,"Donjon",true);break;
    case"brouhaha_effects":if(!Number.isInteger(number(row.level))||number(row.level)<0||number(row.level)>12)errors.push("Niveau Brouhaha attendu entre 0 et 12.");if(!text(row.effect_text))errors.push("Effet obligatoire.");rel("dungeons",row.dungeon_name,"Donjon",true);break;
    default:errors.push("Famille non importable par UI-5C.");
  }
  return{errors,warnings};
}

function extractJsonImportRows(payload,type){
  if(Array.isArray(payload))return{rows:payload,structured:false};
  if(!payload||typeof payload!=="object")throw new Error("JSON invalide : tableau ou objet attendu.");
  if(Array.isArray(payload.rows))return{rows:payload.rows,structured:false};
  if(Array.isArray(payload[type]))return{rows:payload[type],structured:true};
  if(Array.isArray(payload.data?.[type]))return{rows:payload.data[type],structured:true};
  throw new Error(`Le JSON ne contient aucune collection « ${type} » exploitable.`);
}

function buildImportPreview(type,rows,meta={}){
  const existing=state.data[type]||[],normalized=rows.map(raw=>({raw:raw&&typeof raw==="object"?structuredClone(raw):{},row:normalizeTemplateRow(type,raw&&typeof raw==="object"?raw:{})})),counts=new Map();
  for(const item of normalized){const key=entityConflictKey(type,item.row);if(key)counts.set(key,(counts.get(key)||0)+1);}
  const results=normalized.map((item,index)=>{const key=entityConflictKey(type,item.row),conflict=key?existing.find(entity=>buildConflictKeyFromEntity(type,entity)===key):null,v=validateImportRow(type,item.row);if(!key)v.errors.push("Clé de rapprochement vide.");if(key&&counts.get(key)>1)v.errors.push("Doublon dans le fichier : effet ambigu.");const valid=v.errors.length===0;return{index:index+1,label:importLabel(type,item.row),row:item.row,raw:item.raw,conflictId:conflict?.id||"",errors:v.errors,warnings:v.warnings,valid,effect:valid?(conflict?"update":"create"):"exclude"};});
  const summary={total:results.length,valid:results.filter(r=>r.valid).length,warningRows:results.filter(r=>r.warnings.length).length,warnings:results.reduce((n,r)=>n+r.warnings.length,0),errorRows:results.filter(r=>r.errors.length).length,errors:results.reduce((n,r)=>n+r.errors.length,0),create:results.filter(r=>r.effect==="create").length,update:results.filter(r=>r.effect==="update").length,exclude:results.filter(r=>r.effect==="exclude").length};
  return{type,format:meta.format||"",fileName:meta.fileName||"",structuredJson:meta.structuredJson===true,createdAt:nowISO(),rows:results,summary};
}

function mergeStructuredJsonExtras(entity,raw,enabled){
  if(!enabled||!raw||typeof raw!=="object")return entity;const forbidden=new Set(["blob","thumb_blob","preview_blob","transparent_blob"]);
  for(const[key,value]of Object.entries(raw)){if(forbidden.has(key)||key==="id"||value instanceof Blob)continue;entity[key]=structuredClone(value);}return entity;
}

function applySafeImportRelations(type,entity,row,existing){
  const resolve=(store,name,oldId="")=>{const r=uniqueEntityByName(store,name);return r.entity?.id||oldId||"";};
  if(type==="creatures"){entity.dungeon_id=resolve("dungeons",row.dungeon_name,existing?.dungeon_id);const d=findById("dungeons",entity.dungeon_id);entity.dungeon_name=String(row.dungeon_name||existing?.dungeon_name||"").trim();entity.dungeon_slug=d?.slug||existing?.dungeon_slug||"";}
  else if(type==="quests"){entity.dungeon_id=resolve("dungeons",row.dungeon_name,existing?.dungeon_id);entity.npc_id=resolve("npcs",row.npc_name,existing?.npc_id);}
  else if(type==="loot_items")entity.creature_id=resolve("creatures",row.creature_name,existing?.creature_id);
  else if(type==="interactables")entity.dungeon_id=resolve("dungeons",row.dungeon_name,existing?.dungeon_id);
  else if(type==="brouhaha_effects")entity.dungeon_id=String(row.dungeon_name||"").trim()?resolve("dungeons",row.dungeon_name,existing?.dungeon_id):"";
  return entity;
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

async function applyImportPreview(){
  const preview=state.importRuntime.preview;if(!preview)return;const validRows=preview.rows.filter(r=>r.valid);if(!validRows.length)throw new Error("Aucune ligne valide à importer.");
  const type=preview.type,entities=[];let created=0,updated=0;
  for(const plan of validRows){const existing=plan.conflictId?await getById(type,plan.conflictId):null;let entity=importRowToEntity(type,plan.row,existing);entity=mergeStructuredJsonExtras(entity,plan.raw,preview.structuredJson);entity=applySafeImportRelations(type,entity,plan.row,existing);entities.push(entity);existing?updated++:created++;}
  await putMany(type,entities);
  state.importRuntime.lastResult={at:nowISO(),type,format:preview.format,fileName:preview.fileName,total:preview.summary.total,written:entities.length,created,updated,excluded:preview.summary.exclude,warnings:preview.summary.warnings,errors:preview.summary.errors};
  state.importRuntime.preview=null;await refreshData();toast(`Import terminé : ${entities.length} écriture(s), ${preview.summary.exclude} exclue(s).`,"success");
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

async function sha256Blob(blob) {
  if (!blob?.arrayBuffer || !globalThis.crypto?.subtle) return "";
  const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
  return [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, "0")).join("");
}

function emptyMediaRembgState(assetId = "") {
  return { assetId: String(assetId || ""), busy: false, progress: 0, message: "", error: "", candidate: null };
}

function resetMediaRembg() {
  const current = state.mediaRembg;
  if (current?.candidate?.url) URL.revokeObjectURL(current.candidate.url);
  state.mediaRembg = emptyMediaRembgState();
}

function clearMediaRembgCandidate() {
  const current = state.mediaRembg;
  if (current?.candidate?.url) URL.revokeObjectURL(current.candidate.url);
  if (current) {
    current.candidate = null;
    current.error = "";
    current.progress = 0;
    current.message = "";
  }
}

function updateMediaRembgProgress(assetId, progress = 0, message = "") {
  const current = state.mediaRembg;
  if (!current || String(current.assetId) !== String(assetId) || !current.busy) return;
  current.progress = Math.max(0, Math.min(100, Number(progress) || 0));
  current.message = String(message || "");
  const box = app?.querySelector(".media-rembg-status");
  const bar = box?.querySelector("progress");
  const label = box?.querySelector("[data-rembg-message]");
  if (bar) bar.value = current.progress;
  if (label) label.textContent = current.message || "Préparation du détourage…";
}

function loadExternalScriptOnce(src, readyCheck) {
  if (readyCheck()) return Promise.resolve();
  const existing = [...document.scripts].find(script => script.src === src);
  if (existing) {
    return new Promise((resolve, reject) => {
      if (readyCheck()) return resolve();
      existing.addEventListener("load", () => readyCheck() ? resolve() : reject(new Error("Moteur chargé mais API indisponible.")), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Échec du chargement externe : ${src}`)), { once: true });
    });
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.addEventListener("load", () => readyCheck() ? resolve() : reject(new Error("Moteur chargé mais API indisponible.")), { once: true });
    script.addEventListener("error", () => reject(new Error(`Échec du chargement externe : ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

async function ensureMediaRembgEngine() {
  if (globalThis.__GARGOTTEX_REMBG__?.remove) return globalThis.__GARGOTTEX_REMBG__;
  if (rembgEnginePromise) return rembgEnginePromise;
  rembgEnginePromise = (async () => {
    await loadExternalScriptOnce(REMBG_RUNTIME_URL, () => Boolean(globalThis.ort?.InferenceSession));
    if (globalThis.ort?.env?.wasm) {
      globalThis.ort.env.wasm.wasmPaths = REMBG_RUNTIME_BASE;
      globalThis.ort.env.wasm.numThreads = 1;
    }
    await loadExternalScriptOnce(REMBG_LIBRARY_URL, () => Boolean(globalThis.RembgWeb?.remove && globalThis.RembgWeb?.newSession));
    const api = globalThis.RembgWeb;
    api.rembgConfig?.setCustomModelPath?.(REMBG_MODEL.key, REMBG_MODEL.url);
    api.rembgConfig?.enableWebNN?.(false);
    api.rembgConfig?.enableWebGPU?.(false);
    const session = await api.newSession(REMBG_MODEL.key);
    return {
      async remove(blob, onProgress) {
        return api.remove(blob, {
          session,
          postProcessMask: true,
          onProgress(info) {
            const labels = {
              downloading: "Chargement ISNet General Use…",
              processing: "Détourage ISNet en cours…",
              postprocessing: "Création du PNG transparent…",
              complete: "Détourage terminé."
            };
            onProgress?.(Number(info?.progress || 0), labels[info?.step] || String(info?.message || ""));
          }
        });
      },
      async dispose() {
        try { await api.disposeAllSessions?.(); } finally { rembgEnginePromise = null; }
      }
    };
  })().catch(err => {
    rembgEnginePromise = null;
    throw err;
  });
  return rembgEnginePromise;
}

async function runMediaRembg(assetId) {
  const existing = await getById("media_assets", assetId);
  if (!existing) throw new Error("Média introuvable.");
  if (!existing.blob) throw new Error("Original Blob local absent : impossible de lancer le détourage.");

  if (String(state.mediaRembg?.assetId || "") !== String(assetId)) resetMediaRembg();
  if (!state.mediaRembg?.assetId) state.mediaRembg = emptyMediaRembgState(assetId);
  if (state.mediaRembg.busy) throw new Error("Un détourage ISNet est déjà en cours.");

  clearMediaRembgCandidate();
  const beforeHash = await sha256Blob(existing.blob);
  state.mediaRembg.assetId = String(assetId);
  state.mediaRembg.busy = true;
  state.mediaRembg.progress = 1;
  state.mediaRembg.message = "Préparation d’ISNet General Use…";
  state.mediaRembg.error = "";
  render();

  const started = performance.now();
  let engine = null;
  try {
    engine = await ensureMediaRembgEngine();
    const output = await engine.remove(existing.blob, (progress, message) => updateMediaRembgProgress(assetId, progress, message));
    const persisted = await getById("media_assets", assetId);
    const afterHash = await sha256Blob(persisted?.blob);
    if (!afterHash || afterHash !== beforeHash) throw new Error("STOP sécurité : l'original a changé pendant le détourage.");
    const audit = await auditTransparentPng(output);
    const url = URL.createObjectURL(output);
    const durationMs = Math.round(performance.now() - started);
    state.mediaRembg.candidate = {
      blob: output,
      url,
      audit,
      durationMs,
      originalSha256: beforeHash,
      model: REMBG_MODEL.key
    };
    state.mediaRembg.busy = false;
    state.mediaRembg.progress = 100;
    state.mediaRembg.message = "";
    render();
    return { audit, durationMs };
  } catch (err) {
    state.mediaRembg.busy = false;
    state.mediaRembg.progress = 0;
    state.mediaRembg.message = "";
    state.mediaRembg.error = err?.message || String(err);
    render();
    throw err;
  } finally {
    try { await engine?.dispose?.(); } catch (_) {}
  }
}

async function approveMediaRembgCandidate(assetId) {
  const current = state.mediaRembg;
  const candidate = current?.candidate;
  if (!candidate || String(current.assetId || "") !== String(assetId)) throw new Error("Aucun détourage temporaire à valider.");
  if (candidate.audit?.pass !== true) throw new Error("L'audit alpha doit être valide avant l'enregistrement.");

  const existing = await getById("media_assets", assetId);
  if (!existing?.blob) throw new Error("Original Blob local absent.");
  const currentHash = await sha256Blob(existing.blob);
  if (!currentHash || currentHash !== candidate.originalSha256) throw new Error("STOP sécurité : l'original a changé depuis la génération de l'aperçu.");

  const audit = await saveTransparentDerivative(assetId, candidate.blob, {
    reviewStatus: "approved",
    reviewedAt: nowISO(),
    model: REMBG_MODEL.key,
    processing: "rembg-web / IS-Net DIS"
  });
  resetMediaRembg();
  render();
  return audit;
}

async function auditTransparentPng(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const signature = [137,80,78,71,13,10,26,10];
  const png = bytes.length > 26 && signature.every((value,index) => bytes[index] === value);
  if (!png) throw new Error("Le dérivé doit être un PNG.");
  const colorType = bytes[25];
  let hasTrns = false;
  for (let i = 8; i + 12 <= bytes.length;) {
    const length = ((bytes[i] << 24) >>> 0) + (bytes[i+1] << 16) + (bytes[i+2] << 8) + bytes[i+3];
    const type = String.fromCharCode(bytes[i+4],bytes[i+5],bytes[i+6],bytes[i+7]);
    if (type === "tRNS") hasTrns = true;
    i += 12 + length;
    if (type === "IEND") break;
  }
  const hasAlphaChannel = colorType === 4 || colorType === 6 || hasTrns;
  const url = URL.createObjectURL(new Blob([buffer], { type: "image/png" }));
  try {
    const img = await loadImage(url);
    const width = img.naturalWidth || img.width, height = img.naturalHeight || img.height;
    const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Canvas indisponible pour l'audit alpha.");
    ctx.clearRect(0,0,width,height); ctx.drawImage(img,0,0,width,height);
    const data = ctx.getImageData(0,0,width,height).data, total = Math.max(1,width*height);
    let transparent=0,soft=0,opaque=0,minX=width,minY=height,maxX=-1,maxY=-1;
    for(let p=0,idx=0;p<total;p++,idx+=4){
      const alpha=data[idx+3];
      if(alpha<16) transparent++; else if(alpha<240) soft++; else opaque++;
      if(alpha>0){const x=p%width,y=Math.floor(p/width);if(x<minX)minX=x;if(y<minY)minY=y;if(x>maxX)maxX=x;if(y>maxY)maxY=y;}
    }
    const transparentRatio=transparent/total,softRatio=soft/total,opaqueRatio=opaque/total,bbox=maxX>=0?[minX,minY,maxX+1,maxY+1]:null;
    return {pass:Boolean(hasAlphaChannel&&bbox&&transparentRatio>0.01),decodable:true,png:true,has_alpha_channel:hasAlphaChannel,color_type:colorType,width,height,transparent_ratio:Number(transparentRatio.toFixed(5)),soft_edge_ratio:Number(softRatio.toFixed(5)),opaque_ratio:Number(opaqueRatio.toFixed(5)),alpha_bbox:bbox};
  } finally { URL.revokeObjectURL(url); }
}

async function storeMediaFile(file, entityType = "gallery", entityId = "") {
  const originalBuffer = await file.arrayBuffer();
  const originalBlob = new Blob([originalBuffer], { type: file.type || "application/octet-stream" });
  const safe = safeFilename(file.name || "image");
  const unique = `${safe}_${uid("img").split("_").pop()}`;
  const preview = await fileToOptimizedBlob(file, 1600, 0.84);
  const thumb = await fileToOptimizedBlob(file, 512, 0.78);
  const path = `local-media/${entityType}/${unique}`;
  const media = {
    id: uid("media"), label: file.name || safe, file_name: file.name || safe, path,
    preview_path:`local-media/${entityType}/previews/${unique}.webp`,
    thumb_path:`local-media/${entityType}/thumbs/${unique}.webp`,
    mime_type:file.type || "application/octet-stream", entity_type:entityType || "gallery", entity_id:entityId || "",
    blob:originalBlob, preview_blob:preview.blob, thumb_blob:thumb.blob,
    width:preview.width,height:preview.height,original_size:originalBlob.size,original_sha256:await sha256Blob(originalBlob),
    media_schema:"v6-local-original-preview-derivative",created_at:nowISO(),updated_at:nowISO()
  };
  await putOne("media_assets", media); return media;
}

async function saveMediaForEntity(type, entity, file) {
  if (!file) return entity;
  const media = await storeMediaFile(file, type, entity.id);
  entity.image_path = media.path;
  return entity;
}

async function saveEntityFromForm(type, form, options = {}) {
  return saveEntityFromWorkshopForm(type, form, options);
}

async function deleteEntityWithConfirm(type, id) {
  state.workshop.deleteTarget = { type, id };
  render();
}

function generateEncounter(dungeonId, floorIndex, bossChecked, miniBossChecked) {
  const session = ensureSessionContext();
  session.dungeonId = String(dungeonId || session.dungeonId || "");
  session.floorIndex = Math.max(0, Number(floorIndex || 0));
  session.mode = bossChecked ? "boss" : miniBossChecked ? "mini_boss" : "normal";
  return generateSessionEncounter(session);
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
  const dungeon = findById("dungeons", dungeonId);
  const pool = (state.data.brouhaha_effects || []).filter(effect => {
    if (Number(effect.level) !== Number(level)) return false;
    const universal = !String(effect.dungeon_id || "").trim() && !String(effect.dungeon_name || "").trim();
    return universal || (dungeon && entityBelongsToDungeon(effect, dungeon));
  });
  const count = Number(level) >= 10 ? 2 : 1;
  return shuffle(pool).slice(0, count).map(effect => effect.effect_text).filter(Boolean);
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
  for (const file of files) await storeMediaFile(file, "gallery", "");
  await refreshData();
  const latest = (state.data.media_assets || []).slice().sort((a,b)=>String(b.created_at||"").localeCompare(String(a.created_at||"")))[0];
  if (latest) { state.ui.media.selectedId=latest.id; state.ui.media.linkType=latest.entity_type||"gallery"; state.ui.media.linkEntityId=latest.entity_id||""; await saveUiState(state.ui); }
  toast("Média ajouté localement. Original conservé.", "success");
}

async function saveTransparentDerivative(assetId, file, options = {}) {
  const existing = await getById("media_assets", assetId);
  if (!existing) throw new Error("Média introuvable.");
  if (!existing.blob) throw new Error("Original Blob local absent : impossible de valider la source.");
  const beforeHash = await sha256Blob(existing.blob);
  const audit = await auditTransparentPng(file);
  const wantsApproved = options.reviewStatus === "approved";
  if (wantsApproved && audit.pass !== true) throw new Error("L'audit alpha doit être valide avant approbation visuelle.");

  const derivativeBuffer = await file.arrayBuffer();
  const entityType = relationStore(existing.entity_type) || "gallery";
  const safe = safeFilename((existing.file_name || existing.label || existing.id || "media").replace(/\.[^.]+$/,""));
  const next = structuredClone(existing);
  next.transparent_blob = new Blob([derivativeBuffer], { type:"image/png" });
  next.transparent_path = `local-media/${entityType}/transparent/${safe}_${existing.id}.png`;
  next.transparent_mime_type = "image/png";
  next.transparent_width = audit.width;
  next.transparent_height = audit.height;
  next.transparent_audit = audit;
  next.transparent_review_status = wantsApproved ? "approved" : (audit.pass ? "pending" : "needs_fix");
  next.transparent_model = options.model || "isnet-general-use";
  next.transparent_processing = options.processing || "rembg / IS-Net DIS";
  next.transparent_source_sha256 = beforeHash;
  if (!next.original_sha256) next.original_sha256 = beforeHash;
  next.transparent_created_at = nowISO();
  if (wantsApproved) next.transparent_reviewed_at = options.reviewedAt || nowISO();
  else delete next.transparent_reviewed_at;
  next.updated_at = nowISO();

  await putOne("media_assets", next);
  const persisted = await getById("media_assets", assetId);
  const afterHash = await sha256Blob(persisted?.blob);
  if (!afterHash || afterHash !== beforeHash) throw new Error("STOP sécurité : empreinte de l'original modifiée après écriture du dérivé.");

  await refreshData();
  state.ui.media.selectedId = assetId;
  await saveUiState(state.ui);
  return audit;
}

async function setTransparentDerivativeReview(assetId, status) {
  const existing=await getById("media_assets",assetId);
  if(!existing?.transparent_blob) return false;
  if(status==="approved"&&existing.transparent_audit?.pass!==true) throw new Error("L'audit alpha doit être valide avant approbation visuelle.");
  const next=structuredClone(existing); next.transparent_review_status=status==="approved"?"approved":"needs_fix"; next.transparent_reviewed_at=nowISO(); next.updated_at=nowISO();
  await putOne("media_assets",next); await refreshData(); state.ui.media.selectedId=assetId; await saveUiState(state.ui); return true;
}

async function removeTransparentDerivative(assetId) {
  const existing=await getById("media_assets",assetId); if(!existing) return false;
  const originalHash=existing.blob?await sha256Blob(existing.blob):"";
  const next=structuredClone(existing);
  for(const key of ["transparent_blob","transparent_path","transparent_mime_type","transparent_width","transparent_height","transparent_audit","transparent_review_status","transparent_model","transparent_processing","transparent_source_sha256","transparent_created_at","transparent_reviewed_at"]) delete next[key];
  next.updated_at=nowISO(); await putOne("media_assets",next);
  const persisted=await getById("media_assets",assetId);
  if(originalHash&&await sha256Blob(persisted?.blob)!==originalHash) throw new Error("STOP sécurité : l'original a changé pendant le retrait du dérivé.");
  await refreshData(); state.ui.media.selectedId=assetId; await saveUiState(state.ui); return true;
}

async function attachMediaAsset(assetId, type, entityId) {
  const existing=await getById("media_assets",assetId); if(!existing) throw new Error("Média introuvable.");
  const next=structuredClone(existing);
  if(type==="gallery"){next.entity_type="gallery";next.entity_id="";}
  else {const target=findById(type,entityId);if(!target)throw new Error("Entité de rattachement introuvable.");next.entity_type=type;next.entity_id=String(target.id);}
  next.updated_at=nowISO(); await putOne("media_assets",next); await refreshData();
  state.ui.media.selectedId=assetId;state.ui.media.linkType=next.entity_type;state.ui.media.linkEntityId=next.entity_id;await saveUiState(state.ui);
}

function structuredEntityForExport(entity){const copy=structuredClone(entity);for(const key of["blob","thumb_blob","preview_blob","transparent_blob"])delete copy[key];return copy;}

async function exportStructuredJsonFile(){const data={};for(const type of ENTITY_ORDER)data[type]=(state.data[type]||[]).map(structuredEntityForExport);const payload={format:"gargottex-structured-json",version:1,exported_at:nowISO(),app_version:APP_VERSION,contains_media_blobs:false,note:"Données structurées et métadonnées médias uniquement. Les Blobs sont exclus. Utiliser le backup ZIP pour les binaires.",data};downloadBlob(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),`gargottex_structured_${new Date().toISOString().slice(0,10)}.json`);}

function mediaBlobExtension(blob,fallbackMime="application/octet-stream"){const type=String(blob?.type||fallbackMime||"").toLowerCase();if(type.includes("png"))return"png";if(type.includes("jpeg")||type.includes("jpg"))return"jpg";if(type.includes("webp"))return"webp";if(type.includes("gif"))return"gif";return"bin";}

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

async function exportFullBackupFile(){
  if(backupBusy)throw new Error("Un export backup est déjà en cours.");backupBusy=true;
  try{
    const sheets=ENTITY_ORDER.map(type=>({sheetName:ENTITY_SHEETS[type]||getLabel(type),headers:sheetHeaders(type),rows:toTemplateRows(type,state.data[type]||[])})),wb=buildXlsxWorkbookBlob(sheets),wbBytes=new Uint8Array(await wb.arrayBuffer()),structured={};
    for(const type of ENTITY_ORDER)structured[type]=(state.data[type]||[]).map(structuredEntityForExport);
    const mediaAssets=state.data.media_assets||[],files=[],mediaManifest=[];
    for(const asset of mediaAssets){
      const meta=structuredEntityForExport(asset),variants={},specs=[["original","blob",asset.mime_type||asset.blob?.type],["thumbnail","thumb_blob",asset.thumb_blob?.type||"image/webp"],["preview","preview_blob",asset.preview_blob?.type||"image/webp"],["transparent","transparent_blob",asset.transparent_blob?.type||"image/png"]];
      for(const[label,key,mime]of specs){const blob=asset[key];if(!blob)continue;const ext=mediaBlobExtension(blob,mime),filename=`media/${label}/${asset.id}.${ext}`,digest=await sha256Blob(blob);files.push({name:filename,data:new Uint8Array(await blob.arrayBuffer())});variants[label]={file:filename,size:blob.size,type:blob.type||mime||"",sha256:digest};}
      mediaManifest.push({metadata:meta,variants});if(mediaManifest.length%10===0)await new Promise(r=>setTimeout(r,0));
    }
    const manifest={format:"gargottex-backup-zip",version:2,exported_at:nowISO(),app_version:APP_VERSION,db_name:DB_NAME,db_version:DB_VERSION,contains_media_blobs:true,structured_exports_contain_media_blobs:false,store_counts:Object.fromEntries(ENTITY_ORDER.map(type=>[type,(state.data[type]||[]).length])),media_count:mediaAssets.length,media_binary_count:mediaManifest.reduce((n,row)=>n+Object.keys(row.variants).length,0)};
    files.unshift({name:"manifest.json",data:toBytes(JSON.stringify(manifest,null,2))},{name:"data/export_all.xlsx",data:wbBytes},{name:"data/structured.json",data:toBytes(JSON.stringify({format:"gargottex-structured-json",version:1,exported_at:manifest.exported_at,app_version:APP_VERSION,contains_media_blobs:false,data:structured},null,2))},{name:"data/media_assets.json",data:toBytes(JSON.stringify(mediaManifest,null,2))});
    const zipBytes=makeZip(files),verify=await readZip(zipBytes.buffer.slice(zipBytes.byteOffset,zipBytes.byteOffset+zipBytes.byteLength)),vm=JSON.parse(fromBytes(verify["manifest.json"]||toBytes("{}"))),vs=JSON.parse(fromBytes(verify["data/structured.json"]||toBytes("{}"))),vmedia=JSON.parse(fromBytes(verify["data/media_assets.json"]||toBytes("[]")));
    if(vm.format!=="gargottex-backup-zip"||vm.version!==2)throw new Error("Vérification backup échouée : manifest.");
    if(vs.format!=="gargottex-structured-json"||!vs.data)throw new Error("Vérification backup échouée : structured.json.");
    if(!Array.isArray(vmedia)||vmedia.length!==mediaAssets.length)throw new Error("Vérification backup échouée : index médias.");
    for(const row of vmedia){
      for(const variant of Object.values(row.variants||{})){
        const bytes=verify[variant.file];
        if(!bytes)throw new Error(`Vérification backup échouée : ${variant.file} manquant.`);
        const digest=await sha256Blob(new Blob([bytes],{type:variant.type||"application/octet-stream"}));
        if(variant.sha256&&digest!==variant.sha256)throw new Error(`Vérification backup échouée : empreinte invalide pour ${variant.file}.`);
      }
    }
    downloadBlob(new Blob([zipBytes],{type:"application/zip"}),`gargottex_backup_${new Date().toISOString().slice(0,10)}.zip`);
    return{verified:true,mediaCount:mediaAssets.length,binaryCount:vm.media_binary_count,stores:vm.store_counts};
  }finally{backupBusy=false;}
}

async function importFullBackupFile(){throw new Error("La restauration ZIP destructive historique est désactivée dans UI-5C. Utilise l'import JSON/XLSX avec preview, ou conserve le ZIP comme sauvegarde de sécurité.");}

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

async function parseImportFile(file,type,expectedFormat=""){
  const ext=String(file.name.split(".").pop()||"").toLowerCase();let rows=[],format="",structuredJson=false;
  if(ext==="xlsx"){if(expectedFormat&&expectedFormat!=="xlsx")throw new Error("Sélectionne un fichier XLSX.");const parsed=await readXlsxFile(file),wanted=entitySheetNames(type).map(name=>String(name).trim().toLowerCase()),sheet=(parsed.sheets||[]).find(s=>wanted.includes(String(s.sheetName||"").trim().toLowerCase()))||parsed;rows=sheet.rows||[];format="xlsx";}
  else if(ext==="json"){if(expectedFormat&&expectedFormat!=="json")throw new Error("Sélectionne un fichier JSON.");const payload=JSON.parse(await file.text()),ex=extractJsonImportRows(payload,type);rows=ex.rows;structuredJson=ex.structured;format="json";}
  else throw new Error("UI-5C accepte JSON ou XLSX dans leurs zones dédiées.");
  return buildImportPreview(type,rows,{format,fileName:file.name,structuredJson});
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
      if (state.ui.view === "atelier" && state.workshop.dirty) {
        if ((action === "go-home" || action === "set-view") && (btn.dataset.view || "home") !== "atelier") {
          state.workshop.pending = { kind: "view", view: btn.dataset.view || "home" };
          render();
          return;
        }
        if (action === "jump-codex") {
          state.workshop.pending = { kind: "jump-codex", type: btn.dataset.type, id: btn.dataset.id };
          render();
          return;
        }
      }
      switch (action) {
        case "go-home":
        case "set-view": {
          const nextView = btn.dataset.view || "home";
          clearCodexContext(true);
          state.ui.view = nextView;
          state.ui.codexReturnStack = [];
          if (nextView === "codex") state.ui.codexDetailOpen = false;
          await saveUiState(state.ui);
          render();
          return;
        }
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
          clearCodexContext(true);
          state.ui.codexReturnStack = [];
          state.ui.codexType = btn.dataset.type;
          ensureBestiaryUi();
          ensureCodexFamilyUi();
          state.ui.codexSelectedId = state.ui.codexType === "creatures"
            ? (state.ui.bestiary.selectedId || state.data.creatures?.[0]?.id || "")
            : familyCollectionInitialId(state.ui.codexType);
          state.ui.codexDetailOpen = false;
          await saveUiState(state.ui);
          render();
          return;
        case "family-mode": {
          const type = btn.dataset.type;
          if (!["dungeons", "heroes", "npcs", "quests", "loot_items", "interactables", "brouhaha_effects"].includes(type)) return;
          ensureCodexFamilyUi();
          const allowed = familyModeOptions(type).map(mode => mode.value);
          state.ui.codexFamilies[type].mode = allowed.includes(btn.dataset.mode) ? btn.dataset.mode : defaultCodexFamiliesUi()[type].mode;
          state.ui.codexFamilies[type].scrollTop = 0;
          await saveUiState(state.ui);
          render();
          return;
        }
        case "select-family-codex": {
          const type = btn.dataset.type;
          if (!["dungeons", "heroes", "npcs", "quests", "loot_items", "interactables", "brouhaha_effects"].includes(type)) return;
          ensureCodexFamilyUi();
          state.ui.codexReturnStack = [];
          state.ui.codexType = type;
          state.ui.codexFamilies[type].scrollTop = Math.max(0, window.scrollY || 0);
          let dungeonForCinematic = null;
          if (type === "dungeons") {
            const id = String(btn.dataset.id || "");
            const dungeon = findById("dungeons", id);
            if (!dungeon) return;
            dungeonForCinematic = dungeon;
            state.ui.codexFamilies.dungeons.selectedId = id;
            state.ui.codexSelectedId = id;
          } else if (type === "heroes") {
            const group = heroGroupByKey(btn.dataset.base);
            if (!group) return;
            state.ui.codexFamilies.heroes.selectedBase = group.key;
            const level = selectedHeroLevel(group);
            state.ui.codexSelectedId = level?.id || "";
          } else {
            const id = String(btn.dataset.id || "");
            if (!findById(type, id)) return;
            state.ui.codexFamilies[type].selectedId = id;
            state.ui.codexSelectedId = id;
          }
          state.ui.codexDetailOpen = true;
          await saveUiState(state.ui);
          render();
          const comfortable = window.matchMedia?.("(min-width: 1480px)").matches;
          if (!comfortable) requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: type === "heroes" ? "smooth" : "auto" }));
          queueDungeonCinematic(dungeonForCinematic);
          if (type === "heroes") queueHeroDetailReveal();
          return;
        }
        case "codex-family-back": {
          const type = btn.dataset.type;
          if (!["dungeons", "heroes", "npcs", "quests", "loot_items", "interactables", "brouhaha_effects"].includes(type)) return;
          state.ui.codexReturnStack = [];
          state.ui.codexDetailOpen = false;
          await saveUiState(state.ui);
          render();
          return;
        }
        case "hero-level": {
          ensureCodexFamilyUi();
          const group = heroGroupByKey(btn.dataset.base);
          const levelNumber = Number(btn.dataset.level);
          const level = group?.levels?.find(item => Number(item.level) === levelNumber);
          if (!group || !level) return;
          state.ui.codexFamilies.heroes.selectedBase = group.key;
          rememberHeroLevel(group, levelNumber);
          state.ui.codexSelectedId = level.id;
          await saveUiState(state.ui);
          render();
          return;
        }
        case "select-codex": {
          const wasDetailOpen = state.ui.codexDetailOpen;
          state.ui.codexReturnStack = [];
          state.ui.codexType = btn.dataset.type;
          state.ui.codexSelectedId = btn.dataset.id;
          if (btn.dataset.type === "creatures") {
            ensureBestiaryUi();
            state.ui.bestiary.selectedId = btn.dataset.id;
            if (!wasDetailOpen) state.ui.bestiary.scrollTop = Math.max(0, window.scrollY || 0);
          }
          state.ui.codexDetailOpen = true;
          await saveUiState(state.ui);
          render();
          const desktopMasterDetail = btn.dataset.type === "creatures" && window.matchMedia?.("(min-width: 1480px)").matches;
          if (btn.dataset.type === "creatures" && !desktopMasterDetail) {
            requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
          }
          return;
        }
        case "codex-back":
          state.ui.codexReturnStack = [];
          state.ui.codexDetailOpen = false;
          await saveUiState(state.ui);
          render();
          return;
        case "codex-related-back": {
          const stack = ensureCodexReturnStack();
          const previous = stack.pop();
          if (!previous) return;
          state.ui.codexType = previous.type;
          state.ui.codexSelectedId = previous.id;
          state.ui.codexDetailOpen = previous.detailOpen !== false;
          if (previous.type === "creatures") {
            ensureBestiaryUi();
            state.ui.bestiary.selectedId = previous.id;
          } else if (previous.type === "dungeons") {
            ensureCodexFamilyUi();
            state.ui.codexFamilies.dungeons.selectedId = previous.id;
          } else if (previous.type === "heroes") {
            ensureCodexFamilyUi();
            const hero = findById("heroes", previous.id);
            const group = hero ? heroGroupByKey(heroBaseKey(hero)) : null;
            if (group) {
              state.ui.codexFamilies.heroes.selectedBase = group.key;
              rememberHeroLevel(group, hero.level);
            }
          } else if (["npcs", "quests", "loot_items", "interactables", "brouhaha_effects"].includes(previous.type)) {
            ensureCodexFamilyUi();
            state.ui.codexFamilies[previous.type].selectedId = previous.id;
          }
          await saveUiState(state.ui);
          render();
          requestAnimationFrame(() => window.scrollTo({ top: Math.max(0, Number(previous.scrollTop || 0)), left: 0, behavior: "auto" }));
          return;
        }
        case "dungeon-see-all": {
          const dungeonId = String(btn.dataset.dungeonId || "");
          const targetType = relationStore(btn.dataset.type);
          const dungeon = findById("dungeons", dungeonId);
          if (!dungeon || !["creatures", "quests", "interactables", "brouhaha_effects"].includes(targetType)) {
            toast("Collection liée indisponible.", "warn");
            return;
          }
          openDungeonCollectionContext(targetType, dungeon, window.scrollY || 0);
          await saveUiState(state.ui);
          render();
          requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
          return;
        }
        case "codex-context-back": {
          const context = ensureCodexContext();
          if (!context) return;
          const sourceScrollTop = Math.max(0, Number(context.sourceScrollTop || 0));
          restoreCodexContextTarget(context);
          state.ui.codexContext = null;
          state.ui.codexType = "dungeons";
          state.ui.codexSelectedId = context.sourceId;
          state.ui.codexDetailOpen = true;
          state.ui.codexReturnStack = [];
          state.ui.globalSearch = "";
          ensureCodexFamilyUi();
          state.ui.codexFamilies.dungeons.selectedId = context.sourceId;
          await saveUiState(state.ui);
          render();
          requestAnimationFrame(() => window.scrollTo({ top: sourceScrollTop, left: 0, behavior: "auto" }));
          return;
        }
        case "open-related": {
          const targetType = relationStore(btn.dataset.type);
          const targetId = String(btn.dataset.id || "");
          const target = targetType ? findById(targetType, targetId) : null;
          if (!target) {
            toast("Relation indisponible.", "warn");
            return;
          }
          const currentType = state.ui.codexType;
          const currentId = state.ui.codexSelectedId;
          const current = findById(currentType, currentId);
          const stack = ensureCodexReturnStack();
          stack.push({
            type: currentType,
            id: currentId,
            detailOpen: state.ui.codexDetailOpen,
            label: codexEntityTitle(currentType, current),
            scrollTop: Math.max(0, window.scrollY || 0)
          });
          state.ui.codexReturnStack = stack.slice(-12);
          state.ui.codexType = targetType;
          state.ui.codexSelectedId = targetId;
          state.ui.codexDetailOpen = true;
          if (targetType === "creatures") {
            ensureBestiaryUi();
            state.ui.bestiary.selectedId = targetId;
          } else if (targetType === "dungeons") {
            ensureCodexFamilyUi();
            state.ui.codexFamilies.dungeons.selectedId = targetId;
          } else if (targetType === "heroes") {
            ensureCodexFamilyUi();
            const group = heroGroupByKey(heroBaseKey(target));
            if (group) {
              state.ui.codexFamilies.heroes.selectedBase = group.key;
              rememberHeroLevel(group, target.level);
            }
          } else if (["npcs", "quests", "loot_items", "interactables", "brouhaha_effects"].includes(targetType)) {
            ensureCodexFamilyUi();
            state.ui.codexFamilies[targetType].selectedId = targetId;
          }
          await saveUiState(state.ui);
          render();
          requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: targetType === "heroes" ? "smooth" : "auto" }));
          if (targetType === "dungeons") queueDungeonCinematic(target);
          if (targetType === "heroes") queueHeroDetailReveal();
          return;
        }
        case "bestiary-see-dungeon": {
          const dungeonId = String(btn.dataset.id || "");
          if (!findById("dungeons", dungeonId)) {
            toast("Donjon lié indisponible.", "warn");
            return;
          }
          ensureBestiaryUi();
          if (!state.ui.bestiary.contextReturn) state.ui.bestiary.contextReturn = snapshotBestiaryContext();
          state.ui.bestiary.search = "";
          state.ui.bestiary.dungeonId = dungeonId;
          state.ui.bestiary.category = "";
          state.ui.bestiary.menace = "";
          state.ui.bestiary.tags = [];
          state.ui.bestiary.scrollTop = 0;
          state.ui.codexCreatureDungeonId = dungeonId;
          state.ui.codexReturnStack = [];
          state.ui.codexDetailOpen = false;
          await saveUiState(state.ui);
          render();
          return;
        }
        case "bestiary-restore-context": {
          ensureBestiaryUi();
          const previous = state.ui.bestiary.contextReturn;
          if (!previous) return;
          state.ui.bestiary = { ...defaultBestiaryUi(), ...previous, tags: Array.isArray(previous.tags) ? [...previous.tags] : [], contextReturn: null };
          state.ui.codexCreatureDungeonId = state.ui.bestiary.dungeonId || "";
          state.ui.codexSelectedId = state.ui.bestiary.selectedId || state.ui.codexSelectedId;
          state.ui.codexDetailOpen = false;
          state.ui.codexReturnStack = [];
          await saveUiState(state.ui);
          render();
          return;
        }
        case "bestiary-mode":
          ensureBestiaryUi();
          state.ui.bestiary.mode = btn.dataset.mode === "list" ? "list" : "gallery";
          state.ui.bestiary.scrollTop = 0;
          await saveUiState(state.ui);
          render();
          return;
        case "bestiary-toggle-direction":
          ensureBestiaryUi();
          state.ui.bestiary.direction = state.ui.bestiary.direction === "asc" ? "desc" : "asc";
          state.ui.bestiary.scrollTop = 0;
          await saveUiState(state.ui);
          render();
          return;
        case "bestiary-reset":
          ensureBestiaryUi();
          state.ui.bestiary.contextReturn = null;
          state.ui.bestiary.search = "";
          state.ui.bestiary.dungeonId = "";
          state.ui.bestiary.category = "";
          state.ui.bestiary.menace = "";
          state.ui.bestiary.tags = [];
          state.ui.bestiary.scrollTop = 0;
          state.ui.codexCreatureDungeonId = "";
          await saveUiState(state.ui);
          render();
          return;
        case "jump-codex":
          clearCodexContext(true);
          state.ui.codexReturnStack = [];
          state.ui.globalSearch = "";
          state.ui.view = "codex";
          state.ui.codexType = btn.dataset.type;
          state.ui.codexSelectedId = btn.dataset.id;
          if (btn.dataset.type === "creatures") {
            ensureBestiaryUi();
            state.ui.bestiary.selectedId = btn.dataset.id;
          } else if (btn.dataset.type === "dungeons") {
            ensureCodexFamilyUi();
            state.ui.codexFamilies.dungeons.selectedId = btn.dataset.id;
          } else if (btn.dataset.type === "heroes") {
            ensureCodexFamilyUi();
            const hero = findById("heroes", btn.dataset.id);
            const group = hero ? heroGroupByKey(heroBaseKey(hero)) : null;
            if (group) {
              state.ui.codexFamilies.heroes.selectedBase = group.key;
              rememberHeroLevel(group, hero.level);
            }
          } else if (["npcs", "quests", "loot_items", "interactables", "brouhaha_effects"].includes(btn.dataset.type)) {
            ensureCodexFamilyUi();
            state.ui.codexFamilies[btn.dataset.type].selectedId = btn.dataset.id;
          }
          state.ui.codexDetailOpen = true;
          await saveUiState(state.ui);
          render();
          requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: btn.dataset.type === "heroes" ? "smooth" : "auto" }));
          if (btn.dataset.type === "dungeons") queueDungeonCinematic(findById("dungeons", btn.dataset.id));
          if (btn.dataset.type === "heroes") queueHeroDetailReveal();
          return;
        case "set-workshop-type": {
          const type = btn.dataset.type;
          if (!WORKSHOP_TYPES.includes(type)) return;
          if (type === state.ui.workshopType && !state.workshop.isNew) return;
          await requestWorkshopNavigation({ kind: "type", type });
          return;
        }
        case "select-workshop": {
          const type = btn.dataset.type;
          const id = btn.dataset.id;
          if (type === state.ui.workshopType && String(id) === String(state.ui.workshopSelectedId)) {
            state.workshop.editorOpen = true;
            render();
            return;
          }
          await requestWorkshopNavigation({ kind: "select", type, id });
          return;
        }
        case "new-item":
          await requestWorkshopNavigation({ kind: "new", type: btn.dataset.type });
          return;
        case "workshop-back-list":
          state.workshop.editorOpen = false;
          render();
          return;
        case "workshop-guard-stay":
          state.workshop.pending = null;
          render();
          return;
        case "workshop-guard-discard": {
          const pending = state.workshop.pending;
          state.workshop.pending = null;
          workshopResetRuntime("clean");
          await performWorkshopNavigation(pending);
          return;
        }
        case "workshop-guard-save": {
          const pending = state.workshop.pending;
          const form = app.querySelector('form[data-workshop-form="true"]');
          if (!form) return;
          const saved = await saveEntityFromWorkshopForm(form.dataset.form, form, { renderAfter: false, toastAfter: false });
          if (!saved) return;
          state.workshop.pending = null;
          await performWorkshopNavigation(pending);
          toast("Enregistré localement", "success");
          return;
        }
        case "workshop-discard-new":
          state.workshop.pending = { kind: "discard-new" };
          render();
          return;
        case "delete-item":
          await deleteEntityWithConfirm(btn.dataset.type, btn.dataset.id);
          return;
        case "workshop-delete-cancel":
          state.workshop.deleteTarget = null;
          render();
          return;
        case "workshop-delete-confirm":
          await deleteWorkshopEntity(btn.dataset.type, btn.dataset.id);
          return;
        case "session-start": {
          const session = ensureSessionContext();
          if (!startSession(session.dungeonId)) {
            toast("Aucun Donjon disponible pour démarrer.", "warn");
            return;
          }
          await saveUiState(state.ui);
          render();
          toast("Partie démarrée", "success");
          return;
        }
        case "session-end":
          if (!endSessionWithConfirmation()) return;
          state.ui.view = "home";
          await saveUiState(state.ui);
          render();
          toast("Partie terminée", "info");
          return;
        case "session-set-mode": {
          const session = ensureSessionContext();
          const mode = btn.dataset.mode;
          if (!["normal", "mini_boss", "boss"].includes(mode)) return;
          session.mode = mode;
          session.updatedAt = nowISO();
          await saveUiState(state.ui);
          render();
          return;
        }
        case "generate-session-encounter":
        case "generate-encounter": {
          const session = ensureSessionContext();
          const result = generateSessionEncounter(session);
          if (result.error) {
            toast(result.error, "error");
            return;
          }
          session.encounter = result;
          session.updatedAt = nowISO();
          await saveUiState(state.ui);
          render();
          toast("Rencontre générée", "success");
          return;
        }
        case "session-eliminate-creature": {
          const id = String(btn.dataset.id || "");
          if (!eliminateSessionOccurrence(id)) {
            toast("Aucune occurrence restante pour cette Créature.", "warn");
            return;
          }
          await saveUiState(state.ui);
          render();
          return;
        }
        case "session-brouhaha-plus": {
          const session = ensureSessionContext();
          session.brouhaha.level = clamp(Number(session.brouhaha.level || 0) + 1, 0, 12);
          session.updatedAt = nowISO();
          await saveUiState(state.ui);
          render();
          return;
        }
        case "session-brouhaha-minus": {
          const session = ensureSessionContext();
          session.brouhaha.level = clamp(Number(session.brouhaha.level || 0) - 1, 0, 12);
          session.updatedAt = nowISO();
          await saveUiState(state.ui);
          render();
          return;
        }
        case "session-brouhaha-draw": {
          const current = drawSessionBrouhaha();
          if (!current) {
            toast("Aucun effet de référence pour ce niveau et ce Donjon.", "warn");
            return;
          }
          await saveUiState(state.ui);
          render();
          toast("Effet Brouhaha tiré", "success");
          return;
        }
        case "session-brouhaha-reset": {
          const session = ensureSessionContext();
          session.brouhaha = { level: 0, current: null, history: [] };
          session.updatedAt = nowISO();
          await saveUiState(state.ui);
          render();
          return;
        }
        case "session-quest-reroll":
        case "quests-draw": {
          const quest = drawSessionQuest();
          if (!quest) {
            toast("Aucune Quête fiable pour le Donjon actif.", "warn");
            return;
          }
          await saveUiState(state.ui);
          render();
          toast(`Quête : ${quest.name || "tirée"}`, "success");
          return;
        }
        case "media-scope":
          resetMediaRembg();
          state.ui.media.scope = ["all","linked","orphan"].includes(btn.dataset.scope) ? btn.dataset.scope : "all";
          state.ui.media.selectedId = "";
          await saveUiState(state.ui); render(); return;
        case "media-select": {
          const asset = findById("media_assets", btn.dataset.id); if (!asset) return;
          resetMediaRembg();
          state.ui.media.selectedId=String(asset.id); state.ui.media.linkType=asset.entity_type||"gallery"; state.ui.media.linkEntityId=asset.entity_id||"";
          await saveUiState(state.ui); render(); return;
        }
        case "media-back-library":
          resetMediaRembg(); state.ui.media.selectedId=""; await saveUiState(state.ui); render(); return;
        case "media-attach":
          await attachMediaAsset(btn.dataset.id,state.ui.media.linkType||"gallery",state.ui.media.linkEntityId||""); toast("Rattachement média enregistré.","success"); return;
        case "media-rembg-run": {
          const result=await runMediaRembg(btn.dataset.id);
          toast(result.audit?.pass ? `ISNet terminé en ${(result.durationMs/1000).toFixed(1)} s. Valide visuellement avant enregistrement.` : "ISNet terminé, mais l'audit alpha bloque l'enregistrement.", result.audit?.pass ? "success" : "warn");
          return;
        }
        case "media-rembg-download-candidate": {
          const candidate=state.mediaRembg?.candidate;
          if(!candidate?.blob){toast("Aucun aperçu temporaire à télécharger.","warn");return;}
          downloadBlob(candidate.blob,`gargottex_isnet_${state.mediaRembg.assetId || "media"}.png`); return;
        }
        case "media-rembg-discard":
          clearMediaRembgCandidate(); render(); return;
        case "media-rembg-approve-candidate": {
          const audit=await approveMediaRembgCandidate(btn.dataset.id);
          toast(audit.pass ? "Détourage validé et enregistré. Le Codex peut maintenant l'utiliser." : "Dérivé non enregistré : audit insuffisant.", audit.pass ? "success" : "warn");
          return;
        }
        case "media-download-original": {
          const asset=await getById("media_assets",btn.dataset.id); if(!asset?.blob){toast("Original local indisponible.","warn");return;}
          downloadBlob(asset.blob,asset.file_name||"original"); return;
        }
        case "media-derivative-approve":
          await setTransparentDerivativeReview(btn.dataset.id,"approved"); toast("Dérivé transparent validé visuellement.","success"); return;
        case "media-derivative-reject":
          await setTransparentDerivativeReview(btn.dataset.id,"needs_fix"); toast("Dérivé marqué à corriger. L'original reste utilisé.","warn"); return;
        case "media-derivative-remove":
          if(!confirm("Retirer uniquement le dérivé transparent ? L'original et sa miniature seront conservés.")) return;
          await removeTransparentDerivative(btn.dataset.id); toast("Dérivé retiré. Original intact.","info"); return;
        case "media-refresh":
          await refreshData();
          return;
        case "export-entity":
          await exportEntityFile(btn.dataset.type);toast("XLSX structuré exporté. Aucun Blob média inclus.","info");return;
        case "export-all":
          await exportAllFile();toast("XLSX global exporté. Aucun Blob média inclus.","info");return;
        case "export-structured-json":
          await exportStructuredJsonFile();toast("JSON structuré exporté. Aucun Blob média inclus.","info");return;
        case "export-backup": {
          const check=await exportFullBackupFile();toast(`Backup ZIP vérifié : ${check.mediaCount} média(s), ${check.binaryCount} Blob(s).`,"success");return;
        }
        case "import-clear":
          state.importRuntime.preview=null;render();return;
        case "import-apply":
          await applyImportPreview();return;
        case "diagnostic-refresh":
          await refreshDiagnostic();return;
        case "diagnostic-copy":
          await copyDiagnostic();toast("Diagnostic copié.","success");return;
        case "diagnostic-export":
          await exportDiagnosticFile();return;
        case "diagnostic-clear-logs":
          if(!confirm("Vider uniquement le journal local ? Les données métier et médias resteront intacts."))return;await clearLocalLogsOnly();toast("Journal local vidé. Données métier intactes.","info");return;
        case "pwa-update":
          await requestPwaUpdate();toast("Vérification de mise à jour Service Worker effectuée.","success");return;
        case "pwa-install":
          await promptPwaInstall();return;
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
      if (state.ui.view === "atelier" && el.closest?.('form[data-workshop-form="true"]') && el.getAttribute("name")) {
        captureWorkshopControl(el);
        if (!action) return;
      }
      switch (action) {
        case "session-start-dungeon": {
          const session = ensureSessionContext();
          if (session.active) return;
          session.dungeonId = String(el.value || "");
          session.floorIndex = 0;
          await saveUiState(state.ui);
          return;
        }
        case "session-set-dungeon":
        case "generator-set-dungeon":
        case "brouhaha-set-dungeon":
        case "quests-set-dungeon":
          if (!changeSessionDungeon(el.value)) {
            render();
            return;
          }
          await saveUiState(state.ui);
          render();
          return;
        case "codex-creature-dungeon-filter":
          state.ui.codexCreatureDungeonId = el.value;
          state.ui.codexSelectedId = "";
          await saveUiState(state.ui);
          render();
          return;
        case "bestiary-dungeon":
          ensureBestiaryUi();
          state.ui.bestiary.dungeonId = el.value;
          state.ui.codexCreatureDungeonId = el.value;
          state.ui.bestiary.scrollTop = 0;
          await saveUiState(state.ui);
          render();
          return;
        case "bestiary-category":
          ensureBestiaryUi();
          state.ui.bestiary.category = el.value;
          state.ui.bestiary.scrollTop = 0;
          await saveUiState(state.ui);
          render();
          return;
        case "bestiary-menace":
          ensureBestiaryUi();
          state.ui.bestiary.menace = el.value;
          state.ui.bestiary.scrollTop = 0;
          await saveUiState(state.ui);
          render();
          return;
        case "bestiary-sort":
          ensureBestiaryUi();
          state.ui.bestiary.sort = ["name", "menace", "dungeon"].includes(el.value) ? el.value : "name";
          state.ui.bestiary.scrollTop = 0;
          await saveUiState(state.ui);
          render();
          return;
        case "bestiary-tag": {
          ensureBestiaryUi();
          const tag = el.value;
          const tags = new Set(state.ui.bestiary.tags);
          if (el.checked) tags.add(tag); else tags.delete(tag);
          state.ui.bestiary.tags = [...tags];
          state.ui.bestiary.scrollTop = 0;
          await saveUiState(state.ui);
          render();
          return;
        }
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
        case "codex-quest-dungeon-filter":
          state.ui.codexQuestDungeonId = el.value;
          state.ui.codexSelectedId = "";
          await saveUiState(state.ui);
          render();
          return;
        case "atelier-quest-dungeon-filter":
          state.ui.workshopQuestDungeonId = el.value;
          state.ui.workshopSelectedId = "";
          await saveUiState(state.ui);
          render();
          return;
        case "session-set-floor":
        case "generator-set-floor":
          if (!changeSessionFloor(el.value)) {
            render();
            return;
          }
          await saveUiState(state.ui);
          render();
          return;
        case "generator-set-boss": {
          const session = ensureSessionContext();
          session.mode = el.checked ? "boss" : "normal";
          session.updatedAt = nowISO();
          await saveUiState(state.ui);
          render();
          return;
        }
        case "generator-set-miniboss": {
          const session = ensureSessionContext();
          session.mode = el.checked ? "mini_boss" : "normal";
          session.updatedAt = nowISO();
          await saveUiState(state.ui);
          render();
          return;
        }
        case "import-type":
          state.ui.import.type=IMPORT_TYPES.includes(el.value)?el.value:"creatures";
          state.importRuntime.preview=null;
          state.importRuntime.lastResult=null;
          render();
          return;
        case "media-filter-type":
          state.ui.media.filterType = el.value;
          state.ui.media.filterEntity = "";
          await saveUiState(state.ui);
          render();
          return;
        case "media-link-type":
          state.ui.media.linkType=el.value||"gallery"; state.ui.media.linkEntityId=""; await saveUiState(state.ui); render(); return;
        case "media-link-entity":
          state.ui.media.linkEntityId=el.value||""; await saveUiState(state.ui); return;
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
        case "media-derivative-upload": {
          const file=el.files?.[0]; if(!file) return;
          const audit=await saveTransparentDerivative(el.dataset.id,file); el.value="";
          toast(audit.pass ? "Audit alpha valide. Contrôle visuel requis." : "Audit alpha insuffisant. Dérivé conservé à corriger.", audit.pass ? "success" : "warn");
          return;
        }
        case "import-json-file":
        case "import-xlsx-file": {
          const file=el.files?.[0];
          if(!file)return;
          const type=state.ui.import.type||"creatures";
          const format=action==="import-json-file"?"json":"xlsx";
          try{
            state.importRuntime.preview=await parseImportFile(file,type,format);
            state.importRuntime.lastResult=null;
            toast("Preview calculé en mémoire. Aucune écriture locale effectuée.","success");
          }catch(err){
            state.importRuntime.preview=null;
            state.importRuntime.lastResult=null;
            toast(`Import non analysé : ${err?.message||String(err)}`,"error");
          }finally{
            el.value="";
            render();
          }
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
    if (state.ui.view === "atelier" && el.closest?.('form[data-workshop-form="true"]') && el.getAttribute("name")) {
      captureWorkshopControl(el);
      return;
    }
    if (el.dataset.action === "media-search") {
      state.ui.media.search=el.value; state.ui.media.selectedId="";
      if(searchDebounceTimer)clearTimeout(searchDebounceTimer);
      searchDebounceTimer=setTimeout(async()=>{await saveUiState(state.ui);render();requestAnimationFrame(()=>{const input=app.querySelector('[data-action="media-search"]');if(input){input.focus({preventScroll:true});input.setSelectionRange?.(input.value.length,input.value.length);}})},140);
      return;
    }
    if (el.dataset.action === "search") {
      state.ui.globalSearch = el.value;
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(async () => {
        await saveUiState(state.ui);
        render();
        requestAnimationFrame(() => {
          const input = app.querySelector('[data-action="search"]');
          if (input) {
            input.focus({ preventScroll: true });
            const end = input.value.length;
            input.setSelectionRange?.(end, end);
          }
        });
      }, 160);
      return;
    }
    if (el.dataset.action === "family-search") {
      const type = el.dataset.type;
      if (!["dungeons", "heroes", "npcs", "quests", "loot_items", "interactables", "brouhaha_effects"].includes(type)) return;
      ensureCodexFamilyUi();
      state.ui.codexFamilies[type].search = el.value;
      state.ui.codexFamilies[type].scrollTop = 0;
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(async () => {
        await saveUiState(state.ui);
        render();
        requestAnimationFrame(() => {
          const input = app.querySelector(`[data-action="family-search"][data-type="${type}"]`);
          if (input) {
            input.focus({ preventScroll: true });
            const end = input.value.length;
            input.setSelectionRange?.(end, end);
          }
        });
      }, 140);
      return;
    }
    if (el.dataset.action === "bestiary-search") {
      ensureBestiaryUi();
      state.ui.bestiary.search = el.value;
      state.ui.bestiary.scrollTop = 0;
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(async () => {
        await saveUiState(state.ui);
        render();
        requestAnimationFrame(() => {
          const input = app.querySelector('[data-action="bestiary-search"]');
          if (input) {
            input.focus({ preventScroll: true });
            const end = input.value.length;
            input.setSelectionRange?.(end, end);
          }
        });
      }, 140);
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
      session: sessionFromSavedUi(savedUi),
      generator: { ...defaultBlankUi().generator, ...(savedUi.generator || {}) },
      brouhaha: { ...defaultBlankUi().brouhaha, ...(savedUi.brouhaha || {}) },
      import: { ...defaultBlankUi().import, ...(savedUi.import || {}) },
      media: { ...defaultBlankUi().media, ...(savedUi.media || {}) },
      codexContext: savedUi.codexContext && typeof savedUi.codexContext === "object" ? savedUi.codexContext : null,
      codexFamilies: {
        dungeons: { ...defaultBlankUi().codexFamilies.dungeons, ...(savedUi.codexFamilies?.dungeons || {}) },
        heroes: {
          ...defaultBlankUi().codexFamilies.heroes,
          ...(savedUi.codexFamilies?.heroes || {}),
          levelByBase: { ...defaultBlankUi().codexFamilies.heroes.levelByBase, ...(savedUi.codexFamilies?.heroes?.levelByBase || {}) }
        },
        npcs: { ...defaultBlankUi().codexFamilies.npcs, ...(savedUi.codexFamilies?.npcs || {}) },
        quests: { ...defaultBlankUi().codexFamilies.quests, ...(savedUi.codexFamilies?.quests || {}) },
        loot_items: { ...defaultBlankUi().codexFamilies.loot_items, ...(savedUi.codexFamilies?.loot_items || {}) },
        interactables: { ...defaultBlankUi().codexFamilies.interactables, ...(savedUi.codexFamilies?.interactables || {}) },
        brouhaha_effects: { ...defaultBlankUi().codexFamilies.brouhaha_effects, ...(savedUi.codexFamilies?.brouhaha_effects || {}) }
      },
      bestiary: { ...defaultBlankUi().bestiary, ...(savedUi.bestiary || {}) }
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
  wireWorkshopUnloadGuard();
  wirePwaInstallPrompt();
  wireOverlayKeyboard();
  bindEvents();
  wireBestiaryScrollTracking();
  wireCodexFamilyScrollTracking();
  wireCreatureMediaFallbacks();
  render();

if ("serviceWorker" in navigator) {
    const controlledBeforeRegistration = Boolean(navigator.serviceWorker.controller);
    const reg = await navigator.serviceWorker.register("./service-worker.js");
    state.serviceWorkerRegistration = reg;
    setInterval(() => { reg.update().catch(() => {}); }, 15 * 60 * 1000);
    if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing || !controlledBeforeRegistration) return;
      refreshing = true;
      window.location.reload();
    });
  }
  state.diagnostic = await collectLocalDiagnostic();
  render();

  if (navigator.storage?.persist) {
    navigator.storage.persist().catch(() => {});
  }
}

if (typeof document !== "undefined" && app) {
  bootstrap();
}
