#!/usr/bin/env python3
"""Create one Gargottex transparent derivative without touching its source."""
from __future__ import annotations
import argparse, hashlib, io, json
from pathlib import Path
from PIL import Image
from rembg import new_session, remove
MODEL="isnet-general-use"
def sha256(path:Path)->str:
    h=hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda:fh.read(1024*1024),b""): h.update(chunk)
    return h.hexdigest()
def audit(path:Path)->dict[str,object]:
    with Image.open(path) as im:
        rgba=im.convert("RGBA"); alpha=rgba.getchannel("A"); hist=alpha.histogram(); total=max(1,rgba.width*rgba.height)
        transparent=sum(hist[:16]); soft=sum(hist[16:240]); opaque=sum(hist[240:]); bbox=alpha.getbbox()
        return {"width":rgba.width,"height":rgba.height,"transparent_ratio":round(transparent/total,5),"soft_edge_ratio":round(soft/total,5),"opaque_ratio":round(opaque/total,5),"alpha_bbox":list(bbox) if bbox else None,"pass":bool(bbox and transparent/total>0.01)}
def main()->None:
    p=argparse.ArgumentParser();p.add_argument("source",type=Path);p.add_argument("output",type=Path);p.add_argument("--audit",type=Path,default=None);a=p.parse_args()
    source=a.source.resolve();output=a.output.resolve()
    if source==output: raise SystemExit("Refusing to overwrite the original.")
    if output.suffix.lower()!=".png": raise SystemExit("The derivative output must be .png")
    before=sha256(source);session=new_session(MODEL);result=remove(source.read_bytes(),session=session,alpha_matting=False,post_process_mask=True)
    output.parent.mkdir(parents=True,exist_ok=True)
    with Image.open(io.BytesIO(result)) as im: im.convert("RGBA").save(output,"PNG",optimize=True)
    after=sha256(source)
    if before!=after:
        output.unlink(missing_ok=True);raise SystemExit("STOP: source hash changed during processing.")
    report={"workflow":"rembg / IS-Net DIS","model":MODEL,"source":str(source),"source_sha256":before,"output":str(output),"originals_preserved":True,**audit(output)}
    audit_path=a.audit or output.with_suffix(".audit.json");audit_path.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8");print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=="__main__": main()
