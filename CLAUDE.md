# CLAUDE.md — UPC2 Sales Dashboard

อ่านไฟล์นี้ทุกครั้งก่อนเริ่มทำงาน เพื่อเข้าใจ context ของโปรเจกต์

---

## โปรเจกต์คืออะไร

Dashboard แสดงผล MTD Sales Achievement สำหรับทีม UPC2 ของ LG Chem
- เป็น React JSX ไฟล์เดียว ใช้ Babel Standalone (ไม่มี Node.js / npm)
- มี PIN login แยกตาม Area
- Deploy บน GitHub Pages เพื่อให้ทีมเข้าได้ทุกที่

---

## โครงสร้างไฟล์

```
Sale Dashboard/
├── UPC2_Dashboard_v8_publish.jsx   ← Dashboard UI ★ SOURCE OF TRUTH — แก้โค้ด UI ที่นี่ที่เดียว
├── data.json                        ← ข้อมูลยอดขาย (อัพเดตทุกวัน)
├── update.py                        ← script อัพเดต data.json + sync JSX → index.html
├── index.html                       ← GENERATED — ห้ามแก้ส่วน JSX ตรงๆ (update.py เขียนทับ)
├── serve.py                         ← Python local server (ใช้ preview)
├── DEPLOY.md                        ← คู่มือ deploy GitHub Pages
└── CLAUDE.md                        ← ไฟล์นี้
```

**⚠️ กฎสำคัญ:** โค้ด UI แก้ที่ `UPC2_Dashboard_v8_publish.jsx` เท่านั้น แล้วรัน `python3 update.py`
— script จะ inline JSX เข้า `index.html` ให้อัตโนมัติ (ส่วน `<script type="text/babel">`)
ห้ามแก้ JSX ใน index.html ตรงๆ เพราะจะถูกเขียนทับ และเคยเกิด bug จากสองไฟล์ไม่ตรงกันมาแล้ว
(หลัง commit ต้อง `git add index.html` คู่กับ `.jsx` เสมอ)

### Local Preview Server
- ไฟล์ serve.py จริงอยู่ที่ `/tmp/upc2_dashboard/serve.py` (sandbox ของ preview tool)
- ก่อน start preview ต้อง copy ไฟล์ไปที่ `/tmp/upc2_dashboard/` ก่อนเสมอ
- launch.json อยู่ที่ `.claude/launch.json` ชื่อ server: "UPC2 Dashboard" port: 3000

---

## PIN Login

| Area | PIN  | ดูข้อมูล |
|------|------|----------|
| PU4  | 4401 | เฉพาะ PU4 |
| PU5  | 5502 | เฉพาะ PU5 |
| PU6  | 6603 | เฉพาะ PU6 |
| DU3  | 3304 | เฉพาะ DU3 |
| DU4  | 4405 | เฉพาะ DU4 |
| MGR  | 9999 | เห็นทุก Area |

---

## แบรนด์สินค้า

| แบรนด์   | กลุ่ม       | สี (dashboard) |
|----------|-------------|----------------|
| ESPOGEN  | EPO Family  | #3b82f6 (น้ำเงิน) |
| EPOTIV   | EPO Family  | #8b5cf6 (ม่วง) |
| EUVAX    | —           | #10b981 (เขียว) |
| ZEMIGLO  | ZEMI Family | #ef4444 (แดง) |
| ZEMIMET  | ZEMI Family | #f97316 (ส้ม) |
| ZEMIDAPA | ZEMI Family | #ec4899 (ชมพู) |

**สำคัญ:** ZEMI Family = ZEMIGLO + ZEMIMET + ZEMIDAPA (ครบทั้ง 3 ตัวเสมอ)

---

## Target ปัจจุบัน (Q2 2026 / ไตรมาส 2 พ.ศ. 2569)

### เดือนเมษายน (04) — ปัจจุบัน

| Area | ESPOGEN   | EPOTIV    | EUVAX     | ZEMIGLO   | ZEMIMET | ZEMIDAPA |
|------|-----------|-----------|-----------|-----------|---------|----------|
| PU4  | 1,351,000 | 374,500   | 39,165    | 461,250   | 4,875   | 48,000   |
| PU5  | 2,394,000 | 1,523,900 | 38,024    | 354,000   | 5,250   | 32,000   |
| PU6  | 1,183,000 | 339,500   | 16,956.38 | 253,500   | 4,875   | 20,000   |
| DU3  | —         | —         | —         | 2,096,250 | 71,250  | 60,000   |
| DU4  | —         | —         | —         | 1,845,000 | 26,250  | 60,000   |

### เดือนพฤษภาคม (05)

| Area | ESPOGEN   | EPOTIV    | EUVAX     | ZEMIGLO   | ZEMIMET | ZEMIDAPA |
|------|-----------|-----------|-----------|-----------|---------|----------|
| PU4  | 1,737,000 | 481,500   | 50,355    | 522,750   | 5,525   | 60,000   |
| PU5  | 3,078,000 | 1,959,300 | 48,888    | 401,200   | 5,950   | 40,000   |
| PU6  | 1,521,000 | 436,500   | 21,801.06 | 287,300   | 5,525   | 25,000   |
| DU3  | —         | —         | —         | 2,375,750 | 80,750  | 75,000   |
| DU4  | —         | —         | —         | 2,091,000 | 29,750  | 75,000   |

### เดือนมิถุนายน (06)

| Area | ESPOGEN   | EPOTIV    | EUVAX     | ZEMIGLO   | ZEMIMET | ZEMIDAPA |
|------|-----------|-----------|-----------|-----------|---------|----------|
| PU4  | 1,737,000 | 481,500   | 50,355    | 553,500   | 5,850   | 72,000   |
| PU5  | 3,078,000 | 1,959,300 | 48,888    | 424,800   | 6,300   | 48,000   |
| PU6  | 1,521,000 | 436,500   | 21,801.06 | 304,200   | 5,850   | 30,000   |
| DU3  | —         | —         | —         | 2,515,500 | 85,500  | 90,000   |
| DU4  | —         | —         | —         | 2,214,000 | 31,500  | 90,000   |

Target มาจาก Excel: `Target and Achievement UPC2 Team 2026.xlsx` → sheet "Data Input" → section "TARGET INPUT 2026"

---

## Incentive Scheme

- **EPO Family** = ESPOGEN + EPOTIV
- **ZEMI Family** = ZEMIGLO + ZEMIMET + ZEMIDAPA (ต้องครบ 3 ตัว!)
- **TOTAL** = ทุกแบรนด์รวมกัน

Q2 Scheme = Apr + May + Jun รวมกัน (janFebAct = ยอดสะสมก่อนเดือนปัจจุบันใน Q2)

---

## วิธีอัพเดตข้อมูล (ทุกวัน)

```bash
# 1. วาง SD0002*.xlsx ไว้ใน ~/Downloads
# 2. รัน:
python3 update.py

# 3. Push ขึ้น GitHub:
git add data.json && git commit -m "data: DD Mon" && git push
```

---

## วิธีอัพเดต Target (ต้นเดือน / ต้นไตรมาส)

**ตอนนี้ JSX ไม่ต้องแก้แล้ว** — label เดือน/ไตรมาสทั้งหมดดึงจาก data.json อัตโนมัติ
(เดือนจาก `mtdLabel`, ไตรมาสจาก `quarterLabel`/`quarterPeriod`) ทุกอย่างอยู่ใน `update.py`

### ต้นเดือน (ระหว่างไตรมาส เช่น ขึ้น ส.ค. หรือ ก.ย.)
แก้ `update.py` → `QUARTER_PREV_ACT` เท่านั้น:
- เพิ่ม key เดือนใหม่ = ยอด **actual สะสม** ของเดือนก่อนๆ ในไตรมาสเดียวกัน
  (เช่น ขึ้น ส.ค. → ใส่ `"08"` = ยอด actual ก.ค.; ขึ้น ก.ย. → ใส่ `"09"` = ก.ค.+ส.ค.)
- ดูยอด actual สะสมได้จาก data.json วันสุดท้ายของเดือนก่อน หรือ git log
- แต่ละ area ใส่ `{"EPO Family":…, "ZEMI Family":…, "Zemidapa":…, "TOTAL":…}` + `MGR` = ผลรวม
- เดือนแรกของไตรมาส (04/07/10) = `{}` (ไม่มี actual ก่อนหน้า)

### ต้นไตรมาสใหม่ (เช่น ขึ้น Q4 = ต.ค.)
1. เพิ่ม target 3 เดือนใหม่ใน `MONTHLY_TARGETS` (เช่น `"10"`,`"11"`,`"12"`) จากไฟล์ target CSV
2. เพิ่ม key เดือนแรกของไตรมาส `"10": {}` ใน `QUARTER_PREV_ACT`
3. `QUARTERS` dict มี Q1–Q4 ครบแล้ว — ระบบ detect ไตรมาสเองจากวันที่ในไฟล์ Excel

ดึง target จาก: `Target and Achievement UPC2 Team 2026.xlsx` (sheet "Data Input")
หรือไฟล์ CSV ที่ผู้ใช้ส่งมา (คอลัมน์ Jan–Sep = ตรงกับเดือน)

---

## ข้อมูล Excel

### SD0002 (ข้อมูลยอดขายรายวัน)
- Column B (index 1): Billing Date
- Column C (index 2): Sales Area
- Column E (index 4): Customer Name (EN)
- Column F (index 5): Brand Name
- Column I (index 8): Net Sales Qty
- Column K (index 10): Net Sales Amount
- Column AO (index 40): Borrow Amount
- **ยอดขาย = Net Sales Amount − Borrow Amount** (กรอง row ที่ value = 0 ออก)

### Target and Achievement UPC2 Team 2026.xlsx
- Sheet "Data Input": actual sales + target ทุกเดือน
- Sheet "Ref. Target": อ้างอิง

---

## สถานะปัจจุบัน

- **เดือน:** สิงหาคม 2569 (อยู่ใน Q3)
- **Dashboard version:** v8 (publish)
- **ข้อมูลล่าสุด:** 5 ส.ค. 2569 (50 รายการ)
- **GitHub Pages:** deploy แล้ว → https://makenew-world.github.io/upc2-dashboard/
- **Q3 (ก.ค.–ก.ย.):** target ใส่ครบ, `QUARTER_PREV_ACT["08"]` ใส่ยอดสะสม ก.ค. แล้ว (จาก data.json 30 ก.ค. 2569 = 225 รายการ)
- **หมายเหตุ:** ต้นเดือน ก.ย. อย่าลืมใส่ actual ก.ค.+ส.ค. ใน `QUARTER_PREV_ACT["09"]`
  (ดูยอดสะสมได้จาก data.json วันสุดท้ายของ ส.ค. หรือ `git show <commit>:data.json`)

---

## ประวัติการแก้ไขสำคัญ

| ครั้งที่ | สิ่งที่แก้ |
|---------|-----------|
| v8 → Apr | อัพเดต target เดือนเมษายน จาก Data Input tab |
| v8 → Apr | แก้ bug ZEMI Family scheme: ต้องรวม ZEMIDAPA ด้วย (ไม่ใช่แค่ ZEMIGLO+ZEMIMET) |
| v8 → Apr | เปลี่ยน Q1_SCHEME → Q2_SCHEME (เม.ย.–มิ.ย.) |
| v8 → Apr | Refactor: แยก data.json ออกจาก JSX เพื่อลด token การอัพเดตรายวัน |
| v8 → Apr | สร้าง update.py สำหรับอัพเดตข้อมูลโดยไม่ต้องใช้ Claude |
| Jun | Fix: pin `@babel/standalone@7.26.4` (classic runtime) แก้หน้าจอว่าง |
| Jun | Fix: label เดือนดึงจาก `mtdLabel` อัตโนมัติ (ไม่ต้องแก้มือทุกเดือน) |
| Jul/Q3 | เพิ่ม target Q3 (ก.ค.–ก.ย.) + refactor เป็น quarter-generic: `QUARTERS`, `build_quarter_scheme`, `QUARTER_PREV_ACT` |
| Jul/Q3 | data.json เปลี่ยน `q2Scheme` → `quarterScheme` + เพิ่ม `quarterLabel`/`quarterPeriod` (label ไตรมาส auto) |
| Jul | Fix crash กดขยาย Area ใน MGR view (โค้ดอ้าง `q2Scheme` ชื่อเก่า → ReferenceError หน้าขาว) |
| Jul | ยอด actual ใน Scheme cards แสดงตัวเลขเต็ม (`fmt`) แทนตัวย่อ M/K — target ยังย่อเหมือนเดิม |
| Jul | update.py sync JSX → index.html อัตโนมัติทุกครั้งที่รัน (single source of truth กันโค้ดสองไฟล์ไม่ตรงกัน) |
| Jul | เอาสัญลักษณ์ ฿ ออกทั้งหมด (ให้ copy ตัวเลขไปใช้ต่อง่าย) + เพิ่ม tabular-nums ให้ตัวเลขเรียงตรงกัน |
| Aug | Fix: ลืมใส่ `QUARTER_PREV_ACT["08"]` ตอนขึ้นเดือน ส.ค. — Q3 Scheme เคยนับแค่ยอด ส.ค. ไม่รวม ก.ค. |
