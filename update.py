#!/usr/bin/env python3
"""
UPC2 Dashboard — Daily Data Updater
=====================================
วิธีใช้:
  python3 update.py                          # หา SD0002*.xlsx ล่าสุดใน ~/Downloads อัตโนมัติ
  python3 update.py /path/to/SD0002_file.xlsx  # ระบุไฟล์เอง

ผลลัพธ์: เขียน data.json ในโฟลเดอร์นี้
"""

import sys, os, json, glob, re
from datetime import datetime

try:
    import openpyxl
except ImportError:
    print("❌  กรุณาติดตั้ง openpyxl ก่อน:  pip3 install openpyxl")
    sys.exit(1)

THAI_MONTHS = ['','ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.',
               'ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.']

# ── Target & Achievement workbook (authoritative monthly ACTUAL) ────────────
# Prior-month actuals for the quarter and full-year cards are read from sheet
# "Data Input" of this workbook on every run, so nothing has to be typed in by
# hand at the start of each month. It also contains customers that the daily
# SD0002 export leaves out (e.g. KT Medical Service, Dr.Somchit).
TARGET_YEAR     = 2026
TARGET_WORKBOOK = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..",
                               "01 Sale Update", "Achievement",
                               "Target and Achievement UPC2 Team 2026.xlsx")
AREAS        = ["PU4","PU5","PU6","DU3","DU4"]
PU_AREAS     = ["PU4","PU5","PU6"]
DU_AREAS     = ["DU3","DU4"]
YEAR_MONTHS  = [f"{m:02d}" for m in range(1, 13)]
PRODUCT_NAME = {"Epotiv":"EPOTIV","Espogen":"ESPOGEN","Euvax-B":"EUVAX",
                "Zemiglo":"ZEMIGLO","Zemimet":"ZEMIMET","Zemidapa":"ZEMIDAPA"}

# ── Targets per month (key = "MM") ─────────────────────────────────────────
MONTHLY_TARGETS = {
    # ── Q1 2026 (Jan–Mar) — from Target workbook (needed for the full-year target) ──
    "01": {
        "PU4": {"ESPOGEN":1158000,"EPOTIV":321000,"EUVAX":33570,"ZEMIGLO":430500,"ZEMIMET":4550,"ZEMIDAPA":48000},
        "PU5": {"ESPOGEN":2052000,"EPOTIV":1306200,"EUVAX":32592,"ZEMIGLO":330400,"ZEMIMET":4900,"ZEMIDAPA":32000},
        "PU6": {"ESPOGEN":1014000,"EPOTIV":291000,"EUVAX":14534.04,"ZEMIGLO":236600,"ZEMIMET":4550,"ZEMIDAPA":20000},
        "DU3": {"ZEMIGLO":1956500,"ZEMIMET":66500,"ZEMIDAPA":60000},
        "DU4": {"ZEMIGLO":1722000,"ZEMIMET":24500,"ZEMIDAPA":60000},
    },
    "02": {
        "PU4": {"ESPOGEN":1544000,"EPOTIV":428000,"EUVAX":44760,"ZEMIGLO":461250,"ZEMIMET":4875,"ZEMIDAPA":48000},
        "PU5": {"ESPOGEN":2736000,"EPOTIV":1741600,"EUVAX":43456,"ZEMIGLO":354000,"ZEMIMET":5250,"ZEMIDAPA":32000},
        "PU6": {"ESPOGEN":1352000,"EPOTIV":388000,"EUVAX":19378.72,"ZEMIGLO":253500,"ZEMIMET":4875,"ZEMIDAPA":20000},
        "DU3": {"ZEMIGLO":2096250,"ZEMIMET":71250,"ZEMIDAPA":60000},
        "DU4": {"ZEMIGLO":1845000,"ZEMIMET":26250,"ZEMIDAPA":60000},
    },
    "03": {
        "PU4": {"ESPOGEN":1737000,"EPOTIV":481500,"EUVAX":50355,"ZEMIGLO":553500,"ZEMIMET":5850,"ZEMIDAPA":60000},
        "PU5": {"ESPOGEN":3078000,"EPOTIV":1959300,"EUVAX":48888,"ZEMIGLO":424800,"ZEMIMET":6300,"ZEMIDAPA":40000},
        "PU6": {"ESPOGEN":1521000,"EPOTIV":436500,"EUVAX":21801.06,"ZEMIGLO":304200,"ZEMIMET":5850,"ZEMIDAPA":25000},
        "DU3": {"ZEMIGLO":2515500,"ZEMIMET":85500,"ZEMIDAPA":75000},
        "DU4": {"ZEMIGLO":2214000,"ZEMIMET":31500,"ZEMIDAPA":75000},
    },
    "04": {
        "PU4": {"ESPOGEN":1351000,"EPOTIV":374500,"EUVAX":39165,"ZEMIGLO":461250,"ZEMIMET":4875,"ZEMIDAPA":48000},
        "PU5": {"ESPOGEN":2394000,"EPOTIV":1523900,"EUVAX":38024,"ZEMIGLO":354000,"ZEMIMET":5250,"ZEMIDAPA":32000},
        "PU6": {"ESPOGEN":1183000,"EPOTIV":339500,"EUVAX":16956.38,"ZEMIGLO":253500,"ZEMIMET":4875,"ZEMIDAPA":20000},
        "DU3": {"ZEMIGLO":2096250,"ZEMIMET":71250,"ZEMIDAPA":60000},
        "DU4": {"ZEMIGLO":1845000,"ZEMIMET":26250,"ZEMIDAPA":60000},
    },
    "05": {
        "PU4": {"ESPOGEN":1737000,"EPOTIV":481500,"EUVAX":50355,"ZEMIGLO":522750,"ZEMIMET":5525,"ZEMIDAPA":60000},
        "PU5": {"ESPOGEN":3078000,"EPOTIV":1959300,"EUVAX":48888,"ZEMIGLO":401200,"ZEMIMET":5950,"ZEMIDAPA":40000},
        "PU6": {"ESPOGEN":1521000,"EPOTIV":436500,"EUVAX":21801.06,"ZEMIGLO":287300,"ZEMIMET":5525,"ZEMIDAPA":25000},
        "DU3": {"ZEMIGLO":2375750,"ZEMIMET":80750,"ZEMIDAPA":75000},
        "DU4": {"ZEMIGLO":2091000,"ZEMIMET":29750,"ZEMIDAPA":75000},
    },
    "06": {
        "PU4": {"ESPOGEN":1737000,"EPOTIV":481500,"EUVAX":50355,"ZEMIGLO":553500,"ZEMIMET":5850,"ZEMIDAPA":72000},
        "PU5": {"ESPOGEN":3078000,"EPOTIV":1959300,"EUVAX":48888,"ZEMIGLO":424800,"ZEMIMET":6300,"ZEMIDAPA":48000},
        "PU6": {"ESPOGEN":1521000,"EPOTIV":436500,"EUVAX":21801.06,"ZEMIGLO":304200,"ZEMIMET":5850,"ZEMIDAPA":30000},
        "DU3": {"ZEMIGLO":2515500,"ZEMIMET":85500,"ZEMIDAPA":90000},
        "DU4": {"ZEMIGLO":2214000,"ZEMIMET":31500,"ZEMIDAPA":90000},
    },
    # ── Q3 2026 (Jul–Sep) — from "target Q3.csv" ────────────────────────────
    "07": {
        "PU4": {"ESPOGEN":1544000,"EPOTIV":428000,"EUVAX":44760,"ZEMIGLO":430500,"ZEMIMET":4550,"ZEMIDAPA":72000},
        "PU5": {"ESPOGEN":2736000,"EPOTIV":1741600,"EUVAX":43456,"ZEMIGLO":330400,"ZEMIMET":4900,"ZEMIDAPA":48000},
        "PU6": {"ESPOGEN":1352000,"EPOTIV":388000,"EUVAX":19379,"ZEMIGLO":236600,"ZEMIMET":4550,"ZEMIDAPA":30000},
        "DU3": {"ZEMIGLO":1956500,"ZEMIMET":66500,"ZEMIDAPA":90000},
        "DU4": {"ZEMIGLO":1722000,"ZEMIMET":24500,"ZEMIDAPA":90000},
    },
    "08": {
        "PU4": {"ESPOGEN":1737000,"EPOTIV":481500,"EUVAX":50355,"ZEMIGLO":553500,"ZEMIMET":5850,"ZEMIDAPA":120000},
        "PU5": {"ESPOGEN":3078000,"EPOTIV":1959300,"EUVAX":48888,"ZEMIGLO":424800,"ZEMIMET":6300,"ZEMIDAPA":80000},
        "PU6": {"ESPOGEN":1521000,"EPOTIV":436500,"EUVAX":21801,"ZEMIGLO":304200,"ZEMIMET":5850,"ZEMIDAPA":50000},
        "DU3": {"ZEMIGLO":2515500,"ZEMIMET":85500,"ZEMIDAPA":150000},
        "DU4": {"ZEMIGLO":2214000,"ZEMIMET":31500,"ZEMIDAPA":150000},
    },
    "09": {   # Sep: EPOTIV/ESPOGEN ปรับใหม่ 10 ก.ย. 2569 จากไฟล์ Target (01 Sale Update/Achievement)
        "PU4": {"ESPOGEN":1728893.41638346,"EPOTIV":49835.48945869,"EUVAX":44760,"ZEMIGLO":584250,"ZEMIMET":6175,"ZEMIDAPA":168000},
        "PU5": {"ESPOGEN":3407676.4165966,"EPOTIV":202788.52439547,"EUVAX":43456,"ZEMIGLO":448400,"ZEMIMET":6650,"ZEMIDAPA":112000},
        "PU6": {"ESPOGEN":1575196.8257451,"EPOTIV":45177.96707938,"EUVAX":19379,"ZEMIGLO":321100,"ZEMIMET":6175,"ZEMIDAPA":70000},
        "DU3": {"ZEMIGLO":2655250,"ZEMIMET":90250,"ZEMIDAPA":210000},
        "DU4": {"ZEMIGLO":2337000,"ZEMIMET":33250,"ZEMIDAPA":210000},
    },
    # ── Q4 2026 (Oct–Dec) — from Target workbook, updated 4 ต.ค. 2569 ──────────
    "10": {
        "PU4": {"ESPOGEN":1914827.67850868,"EPOTIV":103335.48945869,"EUVAX":50355,"ZEMIGLO":492000,"ZEMIMET":5200,"ZEMIDAPA":144000},
        "PU5": {"ESPOGEN":3737155.78264233,"EPOTIV":420488.52439547,"EUVAX":48888,"ZEMIGLO":377600,"ZEMIMET":5600,"ZEMIDAPA":96000},
        "PU6": {"ESPOGEN":1738009.72884957,"EPOTIV":93677.96707938,"EUVAX":21801.06,"ZEMIGLO":270400,"ZEMIMET":5200,"ZEMIDAPA":60000},
        "DU3": {"ZEMIGLO":2236000,"ZEMIMET":76000,"ZEMIDAPA":180000},
        "DU4": {"ZEMIGLO":1968000,"ZEMIMET":28000,"ZEMIDAPA":180000},
    },
    "11": {
        "PU4": {"ESPOGEN":1914827.67850868,"EPOTIV":103335.48945869,"EUVAX":50355,"ZEMIGLO":553500,"ZEMIMET":5850,"ZEMIDAPA":180000},
        "PU5": {"ESPOGEN":3737155.78264233,"EPOTIV":420488.52439547,"EUVAX":48888,"ZEMIGLO":424800,"ZEMIMET":6300,"ZEMIDAPA":120000},
        "PU6": {"ESPOGEN":1738009.72884957,"EPOTIV":93677.96707938,"EUVAX":21801.06,"ZEMIGLO":304200,"ZEMIMET":5850,"ZEMIDAPA":75000},
        "DU3": {"ZEMIGLO":2515500,"ZEMIMET":85500,"ZEMIDAPA":225000},
        "DU4": {"ZEMIGLO":2214000,"ZEMIMET":31500,"ZEMIDAPA":225000},
    },
    "12": {
        "PU4": {"ESPOGEN":1914827.67850868,"EPOTIV":103335.48945869,"EUVAX":50355,"ZEMIGLO":553500,"ZEMIMET":5850,"ZEMIDAPA":180000},
        "PU5": {"ESPOGEN":3737155.78264233,"EPOTIV":420488.52439547,"EUVAX":48888,"ZEMIGLO":424800,"ZEMIMET":6300,"ZEMIDAPA":120000},
        "PU6": {"ESPOGEN":1738009.72884957,"EPOTIV":93677.96707938,"EUVAX":21801.06,"ZEMIGLO":304200,"ZEMIMET":5850,"ZEMIDAPA":75000},
        "DU3": {"ZEMIGLO":2515500,"ZEMIMET":85500,"ZEMIDAPA":225000},
        "DU4": {"ZEMIGLO":2214000,"ZEMIMET":31500,"ZEMIDAPA":225000},
    },
}

# ── Quarter → months mapping ───────────────────────────────────────────────
QUARTERS = {
    "Q1": ["01","02","03"],
    "Q2": ["04","05","06"],
    "Q3": ["07","08","09"],
    "Q4": ["10","11","12"],
}

def quarter_of(month_str):
    """Return (quarter_name, [months]) for a given 'MM'."""
    for q, months in QUARTERS.items():
        if month_str in months:
            return q, months
    return None, []

# ── Scheme definitions per month ───────────────────────────────────────────
def build_scheme_def(tgt):
    """Build SCHEME_DEF from a monthly target dict."""
    def epo(a):  return (tgt[a].get("ESPOGEN",0) + tgt[a].get("EPOTIV",0))
    def zemi(a): return (tgt[a].get("ZEMIGLO",0) + tgt[a].get("ZEMIMET",0) + tgt[a].get("ZEMIDAPA",0))
    def total(a):return sum(tgt[a].values())
    defs = {}
    for a in ["PU4","PU5","PU6"]:
        defs[a] = [
            {"name":"EPO Family","brands":["ESPOGEN","EPOTIV"],"tgt":epo(a)},
            {"name":"ZEMI Family","brands":["ZEMIGLO","ZEMIMET","ZEMIDAPA"],"tgt":zemi(a)},
            {"name":"TOTAL","brands":None,"tgt":total(a)},
        ]
    for a in ["DU3","DU4"]:
        defs[a] = [
            {"name":"ZEMI Family","brands":["ZEMIGLO","ZEMIMET","ZEMIDAPA"],"tgt":zemi(a)},
            {"name":"Zemidapa","brands":["ZEMIDAPA"],"tgt":tgt[a].get("ZEMIDAPA",0)},
        ]
    defs["MGR"] = [
        {"name":"EPO Family","brands":["ESPOGEN","EPOTIV"],"tgt":sum(epo(a) for a in ["PU4","PU5","PU6"])},
        {"name":"ZEMI Family","brands":["ZEMIGLO","ZEMIMET","ZEMIDAPA"],"tgt":sum(zemi(a) for a in ["PU4","PU5","PU6","DU3","DU4"])},
        {"name":"TOTAL","brands":None,"tgt":sum(total(a) for a in ["PU4","PU5","PU6"]) + sum(zemi(a) for a in ["DU3","DU4"])},
    ]
    return defs

# ── Cumulative scheme over a period (quarter or full year) ───────────────────
def build_period_scheme(months, prev_act_by_area=None):
    """Build a cumulative scheme. months = list of 'MM' in the period
    (a quarter, or all 12 months for the full year).
    prev_act_by_area = {area: {scheme_name: actual}} for months of the period
    already finished (stored as janFebAct; the dashboard adds the current MTD)."""
    prev_act_by_area = prev_act_by_area or {}

    def q_total(area, brands_or_none):
        total = 0
        for mm in months:
            t = MONTHLY_TARGETS.get(mm, {}).get(area, {})
            if brands_or_none is None:
                total += sum(t.values())
            else:
                total += sum(t.get(b,0) for b in brands_or_none)
        return total

    defs = {}
    for a in ["PU4","PU5","PU6"]:
        prev = prev_act_by_area.get(a, {})
        defs[a] = [
            {"name":"EPO Family","brands":["ESPOGEN","EPOTIV"],"tgt":q_total(a,["ESPOGEN","EPOTIV"]),"janFebAct":prev.get("EPO Family",0)},
            {"name":"ZEMI Family","brands":["ZEMIGLO","ZEMIMET","ZEMIDAPA"],"tgt":q_total(a,["ZEMIGLO","ZEMIMET","ZEMIDAPA"]),"janFebAct":prev.get("ZEMI Family",0)},
            {"name":"TOTAL","brands":None,"tgt":q_total(a,None),"janFebAct":prev.get("TOTAL",0)},
        ]
    for a in ["DU3","DU4"]:
        prev = prev_act_by_area.get(a, {})
        defs[a] = [
            {"name":"ZEMI Family","brands":["ZEMIGLO","ZEMIMET","ZEMIDAPA"],"tgt":q_total(a,["ZEMIGLO","ZEMIMET","ZEMIDAPA"]),"janFebAct":prev.get("ZEMI Family",0)},
            {"name":"Zemidapa","brands":["ZEMIDAPA"],"tgt":q_total(a,["ZEMIDAPA"]),"janFebAct":prev.get("Zemidapa",0)},
        ]
    # MGR
    prev = prev_act_by_area.get("MGR", {})
    pu_areas = ["PU4","PU5","PU6"]
    all_areas = ["PU4","PU5","PU6","DU3","DU4"]
    defs["MGR"] = [
        {"name":"EPO Family","brands":["ESPOGEN","EPOTIV"],"tgt":sum(q_total(a,["ESPOGEN","EPOTIV"]) for a in pu_areas),"janFebAct":prev.get("EPO Family",0)},
        {"name":"ZEMI Family","brands":["ZEMIGLO","ZEMIMET","ZEMIDAPA"],"tgt":sum(q_total(a,["ZEMIGLO","ZEMIMET","ZEMIDAPA"]) for a in all_areas),"janFebAct":prev.get("ZEMI Family",0)},
        {"name":"TOTAL","brands":None,"tgt":sum(q_total(a,None) for a in pu_areas)+sum(q_total(a,["ZEMIGLO","ZEMIMET","ZEMIDAPA"]) for a in ["DU3","DU4"]),"janFebAct":prev.get("TOTAL",0)},
    ]
    return defs

# ── Read the Target & Achievement workbook ───────────────────────────────────
# Every successful read is also saved here, so a day when the workbook can't
# be opened (Drive not synced, file locked) still updates using the last copy.
ACTUALS_CACHE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "actuals_cache.json")

def load_target_workbook(path=TARGET_WORKBOOK):
    """-> (actual, target, filled_months, source_label).
    actual / target = {"MM": {area: {BRAND: value}}}.
    filled_months = months whose ACTUAL column has at least one value entered.
    Reads the workbook; on success refreshes ACTUALS_CACHE, on failure falls
    back to ACTUALS_CACHE (and stops only if there is no cache either)."""
    try:
        actual, target, filled = _read_workbook(path)
    except RuntimeError as e:
        if not os.path.exists(ACTUALS_CACHE):
            print(f"❌  {e}")
            print("    และยังไม่มียอดสำรอง — ตรวจว่า Google Drive sync แล้ว / ปิดไฟล์ใน Excel แล้วลองใหม่")
            sys.exit(1)
        with open(ACTUALS_CACHE, encoding="utf-8") as f:
            cache = json.load(f)
        filled = set(cache["filled"])
        last = THAI_MONTHS[int(max(filled))] if filled else "-"
        print(f"⚠️   {e}")
        print(f"    → ใช้ยอดสำรองที่บันทึกไว้เมื่อ {cache['saved_at']} (มี ACTUAL ถึงเดือน {last}) อัพเดตต่อได้ตามปกติ")
        return cache["actual"], cache["target"], filled, f"ยอดสำรอง ({cache['saved_at']})"

    cache = {"actual": actual, "target": target, "filled": sorted(filled)}
    old = None
    if os.path.exists(ACTUALS_CACHE):
        with open(ACTUALS_CACHE, encoding="utf-8") as f:
            old = json.load(f)
    if old is None or {k: old.get(k) for k in cache} != cache:   # rewrite only when the numbers changed
        cache["saved_at"] = datetime.now().strftime("%Y-%m-%d %H:%M")
        with open(ACTUALS_CACHE, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, separators=(",", ":"))
    return actual, target, filled, "ไฟล์ Target"

def _read_workbook(path):
    """Parse sheet 'Data Input' -> (actual, target, filled). Raises RuntimeError."""
    if not os.path.exists(path):
        raise RuntimeError(f"ไม่พบไฟล์ Target: {os.path.normpath(path)}")
    try:
        wb   = openpyxl.load_workbook(path, data_only=True, read_only=True)
        rows = list(wb["Data Input"].iter_rows(values_only=True))
    except Exception as e:
        raise RuntimeError(f"อ่านไฟล์ Target ไม่ได้ ({e})")

    actual, target, filled = {}, {}, set()
    section = "actual"                       # ACTUAL block comes first, then TARGET INPUT
    for r in rows:
        if not r:
            continue
        if isinstance(r[0], str) and r[0].strip().startswith("TARGET INPUT"):
            section = "target"
        area, product = str(r[0] or "").strip(), str(r[1] or "").strip()
        if area not in AREAS or product not in PRODUCT_NAME:
            continue
        dst = actual if section == "actual" else target
        for m in range(12):
            mm, v = f"{m+1:02d}", r[2 + m]
            dst.setdefault(mm, {}).setdefault(area, {})[PRODUCT_NAME[product]] = float(v or 0)
            if section == "actual" and v is not None:
                filled.add(mm)
    if not actual or not target:
        raise RuntimeError("โครงสร้าง sheet 'Data Input' ในไฟล์ Target เปลี่ยนไป — หาตาราง ACTUAL/TARGET ไม่เจอ")
    return actual, target, filled

def sum_prev_actuals(actual, months):
    """Cumulative actual over `months`, keyed by scheme name (same shape the
    period scheme expects). MGR mirrors the target formulas: EPO = PU areas,
    ZEMI = all areas, TOTAL = PU totals + DU ZEMI."""
    EPO, ZEMI = ["ESPOGEN","EPOTIV"], ["ZEMIGLO","ZEMIMET","ZEMIDAPA"]
    out = {}
    for a in AREAS:
        def s(brands=None):
            return round(sum(v for mm in months for b, v in actual.get(mm, {}).get(a, {}).items()
                             if brands is None or b in brands), 2)
        out[a] = {"EPO Family": s(EPO), "ZEMI Family": s(ZEMI),
                  "Zemidapa": s(["ZEMIDAPA"]), "TOTAL": s()}
    out["MGR"] = {
        "EPO Family":  sum(out[a]["EPO Family"] for a in PU_AREAS),
        "ZEMI Family": sum(out[a]["ZEMI Family"] for a in AREAS),
        "Zemidapa":    0,
        "TOTAL":       sum(out[a]["TOTAL"] for a in PU_AREAS) + sum(out[a]["ZEMI Family"] for a in DU_AREAS),
    }
    return out

def check_targets_match(wb_target, tol=1.0):
    """Warn when MONTHLY_TARGETS has drifted from the workbook's TARGET table
    (e.g. targets were revised in Excel but not copied into this file)."""
    diffs = []
    for mm, areas in MONTHLY_TARGETS.items():
        for a, brands in areas.items():
            wb_brands = wb_target.get(mm, {}).get(a, {})
            for b in set(brands) | {k for k, v in wb_brands.items() if v}:
                mine, theirs = brands.get(b, 0), wb_brands.get(b, 0)
                if abs(mine - theirs) > tol:
                    diffs.append(f"      {THAI_MONTHS[int(mm)]} {a} {b}: update.py {mine:,.0f}  ไฟล์ Target {theirs:,.0f}")
    if diffs:
        print(f"⚠️   target ใน update.py ไม่ตรงกับไฟล์ Target {len(diffs)} จุด (dashboard ยังใช้ค่าใน update.py):")
        for line in diffs[:10]:
            print(line)
        if len(diffs) > 10:
            print(f"      ... และอีก {len(diffs) - 10} จุด")

# ── Sync JSX into index.html (single source of truth) ──────────────────────
def sync_index_html(out_dir):
    """Inline UPC2_Dashboard_v8_publish.jsx into index.html between the
    text/babel <script> markers. Prevents the two copies drifting apart
    (root cause of the July blank-page bug)."""
    jsx_path  = os.path.join(out_dir, "UPC2_Dashboard_v8_publish.jsx")
    html_path = os.path.join(out_dir, "index.html")
    if not (os.path.exists(jsx_path) and os.path.exists(html_path)):
        return False
    with open(jsx_path, encoding="utf-8") as f:  jsx  = f.read().rstrip("\n")
    with open(html_path, encoding="utf-8") as f: html = f.read()
    start_marker = '<script type="text/babel" data-presets="react">'
    i = html.find(start_marker)
    if i == -1:
        print("⚠️   ไม่พบ babel script marker ใน index.html — ข้ามการ sync")
        return False
    j = html.find("</script>", i)
    if j == -1:
        return False
    new_html = html[:i+len(start_marker)] + "\n" + jsx + "\n  " + html[j:]
    if new_html != html:
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(new_html)
        return True
    return False

# ── Find Excel file ─────────────────────────────────────────────────────────
def find_excel():
    if len(sys.argv) > 1:
        path = sys.argv[1]
        if not os.path.exists(path):
            print(f"❌  ไม่พบไฟล์: {path}")
            sys.exit(1)
        return path
    pattern = os.path.expanduser("~/Downloads/SD0002*.xlsx")
    files = sorted(glob.glob(pattern), key=os.path.getmtime, reverse=True)
    if not files:
        print("❌  ไม่พบ SD0002*.xlsx ใน ~/Downloads")
        print("    กรุณาระบุ path:  python3 update.py /path/to/file.xlsx")
        sys.exit(1)
    print(f"📂  ใช้ไฟล์: {os.path.basename(files[0])}")
    return files[0]

# ── Parse Excel ─────────────────────────────────────────────────────────────
def parse_excel(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    if "Raw Data" not in wb.sheetnames:
        print("❌  ไม่พบ sheet 'Raw Data' ในไฟล์")
        sys.exit(1)
    ws = wb["Raw Data"]
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        print("❌  Raw Data ว่างเปล่า")
        sys.exit(1)

    entries = []
    latest_date = None
    detected_month = None

    for row in rows[1:]:
        billing_date = row[1]
        if not isinstance(billing_date, datetime):
            continue
        area     = row[2]
        customer = (row[4] or "").replace('"', '\\"')
        brand    = row[5]
        qty      = int(row[8] or 0)
        amount   = float(row[10] or 0)
        borrow   = float(row[40] or 0)
        value    = amount - borrow
        if value == 0:
            continue
        if not area or not brand:
            continue

        date_str = billing_date.strftime("%m-%d")
        v_fmt = int(value) if value == int(value) else round(value, 2)
        entries.append({"d": date_str, "a": area, "c": customer, "b": brand, "q": qty, "v": v_fmt})

        if latest_date is None or billing_date > latest_date:
            latest_date = billing_date
        if detected_month is None:
            detected_month = billing_date.strftime("%m")

    entries.sort(key=lambda x: x["d"])
    return entries, latest_date, detected_month

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    print("🚀  UPC2 Dashboard — Daily Updater")
    print("─" * 40)

    excel_path = find_excel()
    entries, latest_date, month_str = parse_excel(excel_path)

    if not entries:
        print("⚠️   ไม่มีข้อมูลใน Raw Data (ทุกแถวมียอด 0)")
        sys.exit(1)

    # Labels
    thai_year  = latest_date.year + 543
    mtd_label  = f"{THAI_MONTHS[latest_date.month]} {thai_year}"
    data_date  = f"{latest_date.day} {THAI_MONTHS[latest_date.month]} {thai_year}"

    # Targets
    tgt = MONTHLY_TARGETS.get(month_str)
    if not tgt:
        print(f"⚠️   ไม่มี target สำหรับเดือน {month_str} — กรุณาเพิ่มใน MONTHLY_TARGETS ใน update.py")
        tgt = {}

    scheme_def = build_scheme_def(tgt) if tgt else {}

    # Prior-month actuals come from the Target workbook (authoritative, and it
    # includes customers the daily SD0002 leaves out). The current month is
    # always the live MTD from SD0002, added on top by the dashboard.
    wb_actual, wb_target, filled_months, actual_source = load_target_workbook()
    check_targets_match(wb_target)

    # Determine current quarter from the detected month
    quarter_name, quarter_months = quarter_of(month_str)
    if quarter_name:
        quarter_label  = quarter_name
        quarter_period = f"{THAI_MONTHS[int(quarter_months[0])]}–{THAI_MONTHS[int(quarter_months[-1])]}"
    else:
        quarter_label, quarter_period, quarter_months = "", "", []

    same_year = latest_date.year == TARGET_YEAR
    if not same_year:
        print(f"⚠️⚠️⚠️  ข้อมูลเป็นปี {latest_date.year} แต่ target/ไฟล์ Target เป็นปี {TARGET_YEAR}")
        print("    ต้องอัพเดต MONTHLY_TARGETS, TARGET_YEAR และ TARGET_WORKBOOK สำหรับปีใหม่ — ยังไม่แสดงยอดสะสมไตรมาส/ทั้งปี")
    prior_year_months    = [mm for mm in YEAR_MONTHS if mm < month_str] if same_year else []
    prior_quarter_months = [mm for mm in quarter_months if mm < month_str] if same_year else []

    # Safety net: a finished month with no ACTUAL typed into the workbook would
    # silently drop out of the cumulative numbers — say so loudly instead.
    missing = [mm for mm in prior_year_months if mm not in filled_months]
    if missing:
        names = ", ".join(THAI_MONTHS[int(mm)] for mm in missing)
        print(f"⚠️⚠️⚠️  ไฟล์ Target ยังไม่ได้กรอก ACTUAL เดือน {names} — ยอดสะสมไตรมาส/ทั้งปีจะขาดเดือนนี้")
    missing_tgt = [mm for mm in YEAR_MONTHS if mm not in MONTHLY_TARGETS]
    if same_year and missing_tgt:
        names = ", ".join(THAI_MONTHS[int(mm)] for mm in missing_tgt)
        print(f"⚠️   ไม่มี target เดือน {names} ใน MONTHLY_TARGETS — เป้าทั้งปีจะต่ำกว่าจริง")

    quarter_scheme = (build_period_scheme(quarter_months, sum_prev_actuals(wb_actual, prior_quarter_months))
                      if quarter_months and same_year else {})
    year_scheme    = (build_period_scheme(YEAR_MONTHS, sum_prev_actuals(wb_actual, prior_year_months))
                      if same_year else {})
    year_label       = str(thai_year)
    year_prev_period = (f"{THAI_MONTHS[1]}–{THAI_MONTHS[int(prior_year_months[-1])]}"
                        if len(prior_year_months) > 1 else
                        THAI_MONTHS[1] if prior_year_months else "")

    # Build output
    data = {
        "dataDate":      data_date,
        "mtdLabel":      mtd_label,
        "raw":           entries,
        "tgt":           tgt,
        "schemeDef":     scheme_def,
        "quarterScheme": quarter_scheme,
        "quarterLabel":  quarter_label,   # e.g. "Q3"
        "quarterPeriod": quarter_period,  # e.g. "ก.ค.–ก.ย."
        "yearScheme":     year_scheme,
        "yearLabel":      year_label,        # e.g. "2569"
        "yearPrevPeriod": year_prev_period,  # months already summed from the workbook, e.g. "ม.ค.–ก.ย."
    }

    # Write data.json next to this script
    out_dir  = os.path.dirname(os.path.abspath(__file__))
    if sync_index_html(out_dir):
        print("🔧  ซิงค์ JSX → index.html แล้ว (โค้ดมีการแก้ไข)")
    out_path = os.path.join(out_dir, "data.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))

    # Also copy to /tmp/upc2_dashboard/ for local preview
    tmp_dir = "/tmp/upc2_dashboard"
    if os.path.isdir(tmp_dir):
        import shutil
        shutil.copy(out_path, os.path.join(tmp_dir, "data.json"))
        shutil.copy(os.path.join(out_dir, "UPC2_Dashboard_v8_publish.jsx"),
                    os.path.join(tmp_dir, "UPC2_Dashboard_v8_publish.jsx"))
        shutil.copy(os.path.join(out_dir, "index.html"),
                    os.path.join(tmp_dir, "index.html"))
        print(f"🔄  ซิงค์ไปยัง /tmp/upc2_dashboard/ แล้ว")

    print(f"\n✅  สำเร็จ!")
    print(f"   📅  วันที่ล่าสุด : {data_date}")
    print(f"   📊  เดือน        : {mtd_label}")
    if quarter_label:
        print(f"   📈  ไตรมาส       : {quarter_label} ({quarter_period})")
    if year_scheme:
        src = f"สะสม {year_prev_period} จาก{actual_source} + {mtd_label} จาก SD0002" if year_prev_period else f"{mtd_label} จาก SD0002"
        print(f"   📆  ทั้งปี        : {year_label} ({src})")
    print(f"   📋  จำนวนรายการ  : {len(entries)} รายการ")
    print(f"   💾  บันทึกไปที่  : {out_path}")
    print(f"\n   ถ้าใช้ GitHub Pages: git add data.json && git commit -m 'data: {data_date}' && git push")

if __name__ == "__main__":
    main()
