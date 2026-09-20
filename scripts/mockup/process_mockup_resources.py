#!/usr/bin/env python3
"""Gargottex mockup resource pipeline.

1. Preserve source images.
2. Generate transparent PNG derivatives with rembg IS-Net / DIS
   (model: isnet-general-use), as documented in docs/mockup-assets/README.md.
3. Audit alpha coverage.
4. Extract rows from the Gargottex XLSX that mention one of the selected
   creature/hero names, using only Python's standard library for XLSX parsing.

This script is deliberately scoped to mockup assets.
"""

from __future__ import annotations

import io
import json
import re
import unicodedata
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

from PIL import Image
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "docs" / "mockup-assets"
CREATURE_SOURCE = ASSETS / "creatures"
HERO_SOURCE = ASSETS / "heros"
CREATURE_OUT = ASSETS / "creatures-transparent"
HERO_OUT = ASSETS / "heros-transparent"
STAT_DIR = ASSETS / "stat-export"
GENERATED = ASSETS / "generated-data"
AUDIT_PATH = GENERATED / "cutout-audit.json"
DATA_PATH = GENERATED / "gargottex-selection.json"

IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}


def normalize_text(value: object) -> str:
    s = unicodedata.normalize("NFKD", str(value or ""))
    s = "".join(ch for ch in s if not unicodedata.combining(ch))
    s = s.casefold()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return " ".join(s.split())


def hero_base_name(path: Path) -> str:
    return re.sub(r"\s*-\s*level\s*\d+\s*$", "", path.stem, flags=re.I).strip()


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


def process_folder(source: Path, target: Path, session) -> list[dict[str, object]]:
    target.mkdir(parents=True, exist_ok=True)
    audit: list[dict[str, object]] = []
    sources = sorted(p for p in source.iterdir() if p.is_file() and p.suffix.lower() in IMAGE_EXTS)
    for index, src in enumerate(sources, 1):
        dst = target / f"{src.stem}.png"
        print(f"[cutout {index:02d}/{len(sources):02d}] {src.name}")
        output = remove(
            src.read_bytes(),
            session=session,
            alpha_matting=False,
            post_process_mask=True,
        )
        with Image.open(io.BytesIO(output)) as im:
            im.convert("RGBA").save(dst, "PNG", optimize=True)
        row = alpha_audit(dst)
        row["source"] = str(src.relative_to(ROOT)).replace("\\", "/")
        row["model"] = "isnet-general-use"
        audit.append(row)
    return audit


NS_MAIN = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
NS_REL = {"r": "http://schemas.openxmlformats.org/package/2006/relationships"}
NS_DOC_REL = {"r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}


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
    for s in wb.findall("m:sheets/m:sheet", NS_MAIN):
        rid = s.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id")
        target = targets.get(rid, "")
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


def parse_xlsx(path: Path) -> dict[str, object]:
    entities = source_entities()
    match_terms = [(kind, name, normalize_text(name)) for kind, names in entities.items() for name in names]
    result: dict[str, object] = {
        "source": str(path.relative_to(ROOT)).replace("\\", "/"),
        "entities": entities,
        "matches": {},
        "sheet_context": {},
    }

    with zipfile.ZipFile(path) as zf:
        shared = read_shared_strings(zf)
        for sheet_name, sheet_path in workbook_sheets(zf):
            if sheet_path not in zf.namelist():
                continue
            root = ET.fromstring(zf.read(sheet_path))
            rows: list[dict[str, object]] = []
            for row in root.findall(".//m:sheetData/m:row", NS_MAIN):
                cells: dict[str, object] = {}
                for c in row.findall("m:c", NS_MAIN):
                    value = cell_value(c, shared)
                    if value not in ("", None):
                        cells[col_letters(c.attrib.get("r", ""))] = value
                if cells:
                    rows.append({"row": int(row.attrib.get("r", "0") or 0), "cells": cells})

            # Keep a small header/context sample for interpretation in the mockup pass.
            result["sheet_context"][sheet_name] = rows[:8]

            for kind, entity_name, term in match_terms:
                if not term:
                    continue
                found = []
                for r in rows:
                    hay = normalize_text(" ".join(str(v) for v in r["cells"].values()))
                    # Exact-normalized containment is intentionally conservative.
                    if term in hay or hay in term:
                        found.append({"sheet": sheet_name, **r})
                if found:
                    result["matches"].setdefault(kind, {})[entity_name] = found

    return result


def main() -> None:
    GENERATED.mkdir(parents=True, exist_ok=True)
    CREATURE_OUT.mkdir(parents=True, exist_ok=True)
    HERO_OUT.mkdir(parents=True, exist_ok=True)

    print("Loading IS-Net / DIS session: isnet-general-use")
    session = new_session("isnet-general-use")

    audit = {
        "workflow": "rembg / IS-Net DIS",
        "model": "isnet-general-use",
        "originals_preserved": True,
        "creatures": process_folder(CREATURE_SOURCE, CREATURE_OUT, session),
        "heroes": process_folder(HERO_SOURCE, HERO_OUT, session),
    }
    AUDIT_PATH.write_text(json.dumps(audit, ensure_ascii=False, indent=2), encoding="utf-8")

    xlsx_files = sorted(STAT_DIR.glob("*.xlsx"))
    if not xlsx_files:
        raise SystemExit("No XLSX found in docs/mockup-assets/stat-export")
    selection = parse_xlsx(xlsx_files[0])
    DATA_PATH.write_text(json.dumps(selection, ensure_ascii=False, indent=2), encoding="utf-8")

    transparent_count = sum(
        1
        for group in ("creatures", "heroes")
        for row in audit[group]
        if row["transparent_ratio"] > 0.01
    )
    total = len(audit["creatures"]) + len(audit["heroes"])
    print(f"Generated {total} transparent derivatives; {transparent_count}/{total} contain >1% fully transparent pixels.")
    if transparent_count != total:
        print("::warning::Some outputs have little transparency. Review cutout-audit.json before production use.")


if __name__ == "__main__":
    main()
