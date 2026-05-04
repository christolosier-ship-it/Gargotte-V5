
export function uid(prefix = "id") {
  if (globalThis.crypto?.randomUUID) return `${prefix}_${crypto.randomUUID()}`;
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function nowISO() {
  return new Date().toISOString();
}

export function slugify(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

export function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function clamp(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

export function deepClone(value) {
  return value == null ? value : structuredClone(value);
}

export function tagsToArray(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(v => String(v).trim()).filter(Boolean);
  return String(tags)
    .split(/[,;|]/)
    .map(v => v.trim())
    .filter(Boolean);
}

export function tagsToText(tags) {
  return Array.isArray(tags) ? tags.join(", ") : String(tags ?? "");
}

export function parseFloorBudgets(text) {
  return String(text ?? "")
    .split(/[,;|]/)
    .map(v => Number.parseInt(String(v).trim(), 10))
    .filter(v => Number.isFinite(v) && v > 0);
}

export function csvEscape(value) {
  const s = value == null ? "" : String(value);
  return /[",;\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildCsv(headers, rows) {
  const out = [headers.join(";")];
  for (const row of rows) {
    out.push(headers.map(h => csvEscape(row[h])).join(";"));
  }
  return out.join("\n");
}

export function parseCsv(text) {
  const rows = [];
  let cur = "";
  let row = [];
  let inQuotes = false;

  const push = () => { row.push(cur); cur = ""; };
  const end = () => { rows.push(row); row = []; };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ';' || ch === ',') push();
      else if (ch === "\n") { push(); end(); }
      else if (ch === "\r") {}
      else cur += ch;
    }
  }

  if (cur.length || row.length) {
    push();
    end();
  }
  if (!rows.length) return [];

  const headers = rows.shift().map(v => String(v ?? "").trim());
  return rows.filter(r => r.some(v => String(v ?? "").trim())).map(r => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = r[i] ?? "");
    return obj;
  });
}

export function fitSize(width, height, maxSize) {
  if (!width || !height) return { width: maxSize, height: maxSize };
  const ratio = Math.min(maxSize / width, maxSize / height, 1);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio))
  };
}

export function fileBaseName(filename) {
  return String(filename ?? "").replace(/\.[^.]+$/, "");
}

export function safeFilename(filename) {
  return slugify(fileBaseName(filename)) || "image";
}

export function uniqueBy(arr, keyFn) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const key = keyFn(item);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}
