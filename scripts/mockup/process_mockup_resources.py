#!/usr/bin/env python3
"""Gargottex frozen V6 mockup resource audit.

This utility no longer performs image cutout generation.
It only:
- preserves and audits existing transparent PNG derivatives;
- verifies their source hashes when the matching original exists;
- extracts the Gargottex XLSX with Python standard-library XLSX parsing;
- rebuilds the compact creature/hero catalog for the archived HTML mockup.

No source image or transparent derivative is written.
"""

from __future__ import annotations

import hashlib
import json
import re
import unicodedata
import zipfile
from difflib import SequenceMatcher
from pathlib import Path
from xml.etree import ElementTree as ET

from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "docs" / "mockup-assets"
CREATURE_SOURCE = ASSETS / "creatures"
HERO_SOURCE = ASSETS / "heros"
CREATURE_OUT = ASSETS / "creatures-transparent"
HERO_OUT = ASSETS / "heros-transparent"
STAT_DIR = ASSETS / "stat-export"
GENERATED = ASSETS / "generated-data"
AUDIT_PATH = GENERATED / "cutout-audit.json"
SELECTION_PATH = GENERATED / "gargottex-selection.json"
CATALOG_PATH = GENERATED / "mockup-catalog.json"

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}


def normalize_text(value: object) -> str:
    s = unicodedata.normalize("NFKD", str(value or ""))
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.casefold()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return " ".join(s.split())


def slug(value: str) -> str:
    return normalize_text(value).replace(" ", "-")


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def hero_base_name(path: Path) -> str:
    return re.sub(r"\s*-\s*level\s*\d+\s*$", "", path.stem, flags=re.I).strip()


def hero_level_from_name(path: Path) -> int | None:
    m = re.search(r"\blevel\s*(\d+)\b", path.stem, flags=re.I)
    return int(m.group(1)) if m else None


def source_entities() -> dict[str, list[str]]:
    creatures = sorted(p.stem for p in CREATURE_SOURCE.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS)
    heroes = sorted({hero_base_name(p) for p in HERO_SOURCE.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS})
    return {"creatures": creatures, "heroes": heroes}


def alpha_audit(path: Path) -> dict[str, object]:
    with Image.open(path) as im:
        rgba = im.convert("RGBA")
        alpha = rgba.getchannel("A")
        hist = alpha.histogram()
        total = max(1, rgba.width * rgba.height)
        transparent = sum(hist[:16])
        soft = sum(hist[16:240])
        opaque = sum(hist[240:])
        bbox = alpha.getbbox()
        return {
            "file": str(path.relative_to(ROOT)).replace("\\", "/"),
            "width": rgba.width,
            "height": rgba.height,
            "transparent_ratio": round(transparent / total, 5),
            "soft_edge_ratio": round(soft / total, 5),
            "opaque_ratio": round(opaque / total, 5),
            "alpha_bbox": list(bbox) if bbox else None,
        }


def audit_existing_folder(source: Path, target: Path) -> list[dict[str, object]]:
    audit: list[dict[str, object]] = []
    sources = sorted(p for p in source.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS)
    for index, src in enumerate(sources, 1):
        dst = target / f"{src.stem}.png"
        source_rel = str(src.relative_to(ROOT)).replace("\\", "/")
        if not dst.exists():
            print(f"::warning::Missing frozen transparent derivative for {source_rel}")
            continue
        print(f"[audit {index:02d}/{len(sources):02d}] {dst.name}")
        row = alpha_audit(dst)
        row.update({
            "source": source_rel,
            "source_sha256": sha256(src),
            "provenance": "frozen-v6-derivative",
        })
        audit.append(row)
    return audit

NS_MAIN = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
NS_REL = {"r": "http://schemas.openxmlformats.org/package/2006/relationships"}


def col_letters(ref: str) -> str:
    m = re.match(r"([A-Z]+)", ref or "")
    return m.group(1) if m else ref


def read_shared_strings(zf: zipfile.ZipFile) -> list[str]:
    if "xl/sharedStrings.xml" not in zf.namelist():
        return []
    root = ET.fromstring(zf.read("xl/sharedStrings.xml"))
    out: list[str] = []
    for si in root.findall("m:si", NS_MAIN):
        out.append("".join(t.text or "" for t in si.findall(".//m:t", NS_MAIN)))
    return out


def workbook_sheets(zf: zipfile.ZipFile) -> list[tuple[str, str]]:
    wb = ET.fromstring(zf.read("xl/workbook.xml"))
    rels = ET.fromstring(zf.read("xl/_rels/workbook.xml.rels"))
    targets = {r.attrib["Id"]: r.attrib["Target"] for r in rels.findall("r:Relationship", NS_REL)}
    sheets: list[tuple[str, str]] = []
    rel_key = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
    for s in wb.findall("m:sheets/m:sheet", NS_MAIN):
        target = targets.get(s.attrib.get(rel_key), "")
        if not target.startswith("/"):
            target = "xl/" + target.lstrip("/")
        else:
            target = target.lstrip("/")
        sheets.append((s.attrib.get("name", "Sheet"), target))
    return sheets


def cell_value(cell: ET.Element, shared: list[str]) -> object:
    t = cell.attrib.get("t")
    if t == "inlineStr":
        return "".join(x.text or "" for x in cell.findall(".//m:t", NS_MAIN))
    v = cell.find("m:v", NS_MAIN)
    if v is None:
        return ""
    raw = v.text or ""
    if t == "s":
        try:
            return shared[int(raw)]
        except Exception:
            return raw
    if t == "b":
        return raw == "1"
    if t in {"str", "e"}:
        return raw
    try:
        num = float(raw)
        return int(num) if num.is_integer() else num
    except Exception:
        return raw


def read_workbook_tables(path: Path) -> dict[str, list[dict[str, object]]]:
    tables: dict[str, list[dict[str, object]]] = {}
    with zipfile.ZipFile(path) as zf:
        shared = read_shared_strings(zf)
        for sheet_name, sheet_path in workbook_sheets(zf):
            if sheet_path not in zf.namelist():
                continue
            root = ET.fromstring(zf.read(sheet_path))
            raw_rows: list[dict[str, object]] = []
            for row in root.findall(".//m:sheetData/m:row", NS_MAIN):
                cells: dict[str, object] = {}
                for c in row.findall("m:c", NS_MAIN):
                    value = cell_value(c, shared)
                    if value not in ("", None):
                        cells[col_letters(c.attrib.get("r", ""))] = value
                if cells:
                    raw_rows.append(cells)
            if not raw_rows:
                tables[sheet_name] = []
                continue
            header = {col: str(value) for col, value in raw_rows[0].items()}
            rows: list[dict[str, object]] = []
            for cells in raw_rows[1:]:
                row = {header[col]: value for col, value in cells.items() if col in header}
                if row:
                    rows.append(row)
            tables[sheet_name] = rows
    return tables


def name_score(source: str, candidate: str) -> float:
    a, b = normalize_text(source), normalize_text(candidate)
    if not a or not b:
        return 0.0
    if a == b:
        return 1.0
    if a in b or b in a:
        return 0.94
    sa, sb = set(a.split()), set(b.split())
    jaccard = len(sa & sb) / max(1, len(sa | sb))
    seq = SequenceMatcher(None, a, b).ratio()
    return max(seq, jaccard * 0.96)


def media_candidates(source_name: str, media_rows: list[dict[str, object]]) -> set[str]:
    target = normalize_text(source_name)
    paths: set[str] = set()
    for row in media_rows:
        label = normalize_text(row.get("label") or row.get("file_name") or "")
        entity_id = normalize_text(row.get("entity_id") or "")
        if target and (target in label or label in target or target.replace(" ", "-") in entity_id.replace(" ", "-")):
            if row.get("path"):
                paths.add(str(row["path"]))
    return paths


def best_creature_row(source_name: str, rows: list[dict[str, object]], media_rows: list[dict[str, object]]) -> tuple[dict[str, object] | None, float, str]:
    source_paths = media_candidates(source_name, media_rows)
    for row in rows:
        if row.get("image_path") and str(row["image_path"]) in source_paths:
            return row, 1.0, "media-path"
    scored = sorted(((name_score(source_name, str(r.get("name", ""))), r) for r in rows), key=lambda x: x[0], reverse=True)
    if scored and scored[0][0] >= 0.62:
        return scored[0][1], round(scored[0][0], 4), "name"
    return None, scored[0][0] if scored else 0.0, "unmatched"


def hero_display_base(row: dict[str, object]) -> str:
    name = str(row.get("name") or "")
    if " - " in name:
        return name.split(" - ", 1)[0].strip()
    base = str(row.get("hero_base_name") or "")
    return base.replace("-", " ").strip()


def best_hero_row(source_base: str, level: int, rows: list[dict[str, object]]) -> tuple[dict[str, object] | None, float]:
    level_rows = [r for r in rows if int(r.get("level") or 0) == level]
    scored = sorted(((name_score(source_base, hero_display_base(r)), r) for r in level_rows), key=lambda x: x[0], reverse=True)
    if scored and scored[0][0] >= 0.62:
        return scored[0][1], round(scored[0][0], 4)
    return None, scored[0][0] if scored else 0.0


def split_attack(value: object) -> tuple[str, str]:
    text = str(value or "").strip()
    for sep in (" — ", " – "):
        if sep in text:
            a, b = text.split(sep, 1)
            return a.strip(), b.strip()
    return text or "Compétence à renseigner", ""


def parse_loot(value: object) -> list[str]:
    rows: list[str] = []
    for line in str(value or "").splitlines():
        bits = [x.strip() for x in line.split("|")]
        if bits and bits[0]:
            suffix = ""
            if len(bits) >= 4 and bits[3] not in {"", "0"}:
                suffix = f" · {bits[3]} or"
            rows.append(bits[0] + suffix)
    return rows


def parse_tags(value: object) -> list[str]:
    return [x.strip() for x in re.split(r"[,;]", str(value or "")) if x.strip()]


def build_catalog(tables: dict[str, list[dict[str, object]]]) -> dict[str, object]:
    creature_rows = tables.get("Créatures", [])
    hero_rows = tables.get("Héros", [])
    media_rows = tables.get("Médias", [])

    creatures: list[dict[str, object]] = []
    creature_unmatched: list[dict[str, object]] = []
    for src in sorted(p for p in CREATURE_SOURCE.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS):
        row, score, method = best_creature_row(src.stem, creature_rows, media_rows)
        image = str((CREATURE_OUT / f"{src.stem}.png").relative_to(ROOT)).replace("\\", "/")
        if not row:
            creature_unmatched.append({"source": src.stem, "best_score": round(score, 4)})
            continue
        ability, copy = split_attack(row.get("special_attack_name"))
        ai = str(row.get("ai_behavior") or "").strip()
        priority = str(row.get("ai_target_priority") or "").strip()
        if priority:
            ai = (ai + " " if ai else "") + f"Priorité : {priority}."
        base = re.sub(r"[^0-9.]", "", str(row.get("socle") or "")) or "32"
        creatures.append({
            "id": "test-" + slug(str(row.get("name") or src.stem)),
            "name": row.get("name") or src.stem,
            "cat": row.get("category") or "basique",
            "dungeon": row.get("dungeon_name") or "Donjon à renseigner",
            "threat": row.get("menace") or 1,
            "base": base,
            "pv": row.get("pv") or 0,
            "atk": row.get("atk") or 0,
            "def": row.get("def") or 0,
            "range": row.get("zone") or 0,
            "actions": row.get("actions") or 0,
            "ability": ability,
            "copy": copy,
            "noise": row.get("special_attack_noise") or 0,
            "ai": ai,
            "loot": parse_loot(row.get("loot")),
            "lore": row.get("lore") or "",
            "tags": parse_tags(row.get("tags")),
            "displayImg": "./" + image.replace("docs/", ""),
            "sourceImg": "./" + str(src.relative_to(ROOT)).replace("\\", "/").replace("docs/", ""),
            "match": {"method": method, "score": score},
        })

    hero_groups: dict[str, list[Path]] = {}
    for src in sorted(p for p in HERO_SOURCE.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS):
        hero_groups.setdefault(hero_base_name(src), []).append(src)

    heroes: list[dict[str, object]] = []
    hero_unmatched: list[dict[str, object]] = []
    for source_base, images in sorted(hero_groups.items()):
        levels: list[dict[str, object]] = []
        for src in sorted(images, key=lambda p: hero_level_from_name(p) or 999):
            level_num = hero_level_from_name(src)
            if level_num is None:
                hero_unmatched.append({"source": src.name, "reason": "missing level in filename"})
                continue
            row, score = best_hero_row(source_base, level_num, hero_rows)
            if not row:
                hero_unmatched.append({"source": src.name, "level": level_num, "best_score": round(score, 4)})
                continue
            image = str((HERO_OUT / f"{src.stem}.png").relative_to(ROOT)).replace("\\", "/")
            levels.append({
                "level": level_num,
                "name": row.get("name") or f"{source_base} - Level {level_num}",
                "title": row.get("title") or f"Niveau {level_num}",
                "role": row.get("role") or "",
                "pv": row.get("pv") or 0,
                "atk": row.get("atk") or 0,
                "def": row.get("def") or 0,
                "zone": row.get("zone") or 0,
                "actions": row.get("actions") or 0,
                "ability": row.get("ability_text") or "-",
                "effect": row.get("effect_text") or "",
                "brouhaha": row.get("brouhaha") or "",
                "tags": parse_tags(row.get("tags")),
                "image": "./" + image.replace("docs/", ""),
                "match_score": score,
            })
        if levels:
            levels.sort(key=lambda x: int(x["level"]))
            first_row, _ = best_hero_row(source_base, int(levels[0]["level"]), hero_rows)
            display_name = hero_display_base(first_row or {}) or source_base
            heroes.append({
                "id": "test-" + slug(source_base),
                "name": display_name,
                "image": levels[0]["image"],
                "levels": levels,
            })

    xlsx = next(iter(sorted(STAT_DIR.glob("*.xlsx"))))
    return {
        "source": str(xlsx.relative_to(ROOT)).replace("\\", "/"),
        "creatures": creatures,
        "heroes": heroes,
        "unmatched": {"creatures": creature_unmatched, "heroes": hero_unmatched},
    }


def build_selection(tables: dict[str, list[dict[str, object]]]) -> dict[str, object]:
    entities = source_entities()
    match_terms = [(kind, name, normalize_text(name)) for kind, names in entities.items() for name in names]
    result: dict[str, object] = {"entities": entities, "matches": {}, "sheet_context": {}}
    for sheet_name, rows in tables.items():
        result["sheet_context"][sheet_name] = rows[:7]
        for kind, entity_name, term in match_terms:
            found = []
            for i, row in enumerate(rows, start=2):
                hay = normalize_text(" ".join(str(v) for v in row.values()))
                if term and (term in hay or hay in term):
                    found.append({"sheet": sheet_name, "row": i, "cells": row})
            if found:
                result["matches"].setdefault(kind, {})[entity_name] = found
    return result


def main() -> None:
    GENERATED.mkdir(parents=True, exist_ok=True)

    audit = {
        "workflow": "existing transparent derivatives audit",
        "originals_preserved": True,
        "creatures": audit_existing_folder(CREATURE_SOURCE, CREATURE_OUT),
        "heroes": audit_existing_folder(HERO_SOURCE, HERO_OUT),
    }
    AUDIT_PATH.write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")

    xlsx_files = sorted(STAT_DIR.glob("*.xlsx"))
    if not xlsx_files:
        raise SystemExit("No XLSX found in docs/mockup-assets/stat-export")
    tables = read_workbook_tables(xlsx_files[0])
    selection = build_selection(tables)
    selection["source"] = str(xlsx_files[0].relative_to(ROOT)).replace("\\", "/")
    SELECTION_PATH.write_text(json.dumps(selection, ensure_ascii=False, indent=2), encoding="utf-8")

    catalog = build_catalog(tables)
    CATALOG_PATH.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")

    all_rows = audit["creatures"] + audit["heroes"]
    transparent_count = sum(1 for row in all_rows if row["transparent_ratio"] > 0.01)
    print(f"Frozen transparent derivatives: {transparent_count}/{len(all_rows)} pass the >1% transparent-pixel sanity check.")
    print(f"Catalog: {len(catalog['creatures'])} creatures, {len(catalog['heroes'])} heroes.")
    if catalog["unmatched"]["creatures"] or catalog["unmatched"]["heroes"]:
        print("::warning::Some source images could not be matched confidently to the XLSX. See mockup-catalog.json.")

if __name__ == "__main__":
    main()
