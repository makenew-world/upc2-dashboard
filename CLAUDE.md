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

### การ์ดสะสม: ไตรมาส และ Total Year (logic เดียวกัน)
- **ยอด** = เดือนที่จบแล้ว (`janFebAct`) + MTD เดือนปัจจุบันจาก SD0002
- **เดือนที่จบแล้ว** อ่านจากไฟล์ Target (sheet "Data Input" ตาราง ACTUAL) **อัตโนมัติทุกครั้งที่รัน update.py**
  - ไตรมาส: เดือนก่อนหน้าในไตรมาสเดียวกัน (เดือนแรกของไตรมาส = 0)
  - ทั้งปี: ม.ค. → เดือนก่อนหน้า
- **เป้า** = ผลรวม `MONTHLY_TARGETS` ทุกเดือนในช่วงนั้น (ไตรมาส 3 เดือน / ทั้งปี 12 เดือน — ไม่ prorate)
- MGR: EPO = PU4–6, ZEMI = ทุก area, TOTAL = PU รวมทุกแบรนด์ + DU เฉพาะ ZEMI (ตรงกับสูตรเป้า)
- ตรวจแล้ว 4 ต.ค. 2569: ACTUAL ม.ค.–ก.ย. ในไฟล์ Target รวม 138,617,860 = ไฟล์ Bill Control (138,617,862)

### คำเตือนที่ update.py จะพิมพ์ (ห้ามมองข้าม)
- `⚠️⚠️⚠️ ไฟล์ Target ยังไม่ได้กรอก ACTUAL เดือน …` → ผู้ใช้ต้องกรอก actual เดือนที่จบแล้วในไฟล์ Target ก่อน ไม่งั้นยอดสะสมขาดเดือนนั้น
- `⚠️ target ใน update.py ไม่ตรงกับไฟล์ Target …` → มีคนแก้ target ใน Excel แต่ยังไม่ได้ copy มาใส่ `MONTHLY_TARGETS`
- `⚠️⚠️⚠️ ข้อมูลเป็นปี … แต่ target เป็นปี 2026` → ขึ้นปีใหม่แล้ว ต้องอัพเดต `TARGET_YEAR`, `TARGET_WORKBOOK`, `MONTHLY_TARGETS`
- `⚠️ ไม่พบไฟล์ Target / อ่านไฟล์ Target ไม่ได้ → ใช้ยอดสำรอง…` → เปิดไฟล์ไม่ได้ (Drive ยังไม่ sync / เปิดค้างใน Excel)
  ใช้สำเนาล่าสุดใน `actuals_cache.json` แทนและอัพเดตต่อได้ — ปกติไม่มีปัญหา แต่ถ้าเป็นต้นเดือนที่เพิ่งกรอก ACTUAL
  เดือนที่จบ สำเนาอาจยังไม่มีเดือนนั้น (จะเตือน `⚠️⚠️⚠️ ยังไม่ได้กรอก ACTUAL`) → ให้รันใหม่ตอนเปิดไฟล์ได้
- `❌ … และยังไม่มียอดสำรอง` → หยุด ไม่เขียน data.json (เกิดได้ครั้งเดียวคือเครื่องใหม่ที่ไม่เคยอ่านไฟล์สำเร็จ)

### actuals_cache.json (สำเนาสำรอง)
- update.py เขียนทุกครั้งที่อ่านไฟล์ Target สำเร็จและตัวเลขเปลี่ยน (เก็บ ACTUAL + TARGET + เดือนที่กรอกแล้ว)
- อยู่ใน `.gitignore` — ใช้ในเครื่องนี้อย่างเดียว ไม่ขึ้น GitHub (repo เป็น public)

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

## ⚠️ ข้อจำกัดของไฟล์ SD0002 รายวัน: บางลูกค้าไม่ถูกรวมในรายงาน

(แก้ไข 30 ก.ย. 2569 — ข้อสรุปเดิมที่ว่า "ยอดวันสุดท้ายของเดือนหลุด" **ไม่ถูกต้อง**)

เทียบกับไฟล์ `Y2026 SD0002 Bill Control List-RENAL-UPC_2.xlsx` (sheet `Data` — ไฟล์ที่ผู้ใช้ยืนยันว่าถูกต้องที่สุด)
ส่วนต่างทั้งหมดเป็นแถวของ **2 ลูกค้า** ที่ไม่มีในไฟล์ SD0002 รายวันเลย (ไม่เกี่ยวกับวันที่ในเดือน):
- `KT MEDICAL SERVICE PUBLIC CO.` (รหัส 170211664, ESPOGEN, PU4/PU5, กลุ่ม SPECIALIST CLINIC)
- `DR.SOMCHIT TREETIPSATID` (รหัส 170030297, ZEMIGLO, DU3, กลุ่ม POLYCLINICS)

รวมที่หายไป: ก.ค. 139,300 + ส.ค. 18,760 + ก.ย.(ถึง 29) 86,940 (ก.ค.+ส.ค. = 158,060 = ที่เคยเข้าใจผิดว่าเป็นยอดสิ้นเดือน)
ไฟล์ที่ถูกต้องเองก็จบที่ 30 ก.ค. / 28 ส.ค. เหมือนกัน → **ไม่มีหลักฐานว่าวันสิ้นเดือนหลุด**

ผลกระทบ: ต่ำกว่าจริงเล็กน้อย (Q3 TOTAL 101.8% vs 102.0%) — ไม่พลิกผลใดๆ
**วิธีตรวจ/แก้:** ถ้าต้องการยอดที่ถูกต้อง 100% ให้ใช้ไฟล์ `Y2026 SD0002 Bill Control List-RENAL-UPC_2.xlsx`
(ใช้คอลัมน์ `Net Sales Amount - Borrow Amount` = index 42, Borrow Amount = index 41 ต่างจาก SD0002 รายวันที่ Borrow = index 40)
หรือถามผู้ใช้ว่าทำไม 2 ลูกค้านี้ถึงไม่อยู่ในรายงานรายวัน (อาจเป็นตัวกรองของรายงาน "By Area x3A")

**เพิ่มยอดด้วยมือแล้ว (30 ก.ย. 2569):** ต่อ 3 แถว ก.ย. ของ 2 ลูกค้านี้เข้า `data.json` โดยตรง
(09-07 PU4 ESPOGEN 50,400 / 09-07 PU5 ESPOGEN 33,600 / 09-11 DU3 ZEMIGLO 2,940) — ยังไม่ได้แก้ `update.py`
⚠️ `python3 update.py` สร้าง data.json ใหม่จาก SD0002 รายวันทุกครั้ง → **3 แถวนี้จะหายทุกครั้งที่รัน** จนกว่าจะแก้ update.py
ก.ค.+ส.ค. ไม่กระทบ เพราะ `QUARTER_PREV_ACT["09"]` มาจากไฟล์ Target ซึ่งรวม 2 ลูกค้านี้อยู่แล้ว

---

## วิธีอัพเดต Target (ต้นเดือน / ต้นไตรมาส)

**ตอนนี้ JSX ไม่ต้องแก้แล้ว** — label เดือน/ไตรมาสทั้งหมดดึงจาก data.json อัตโนมัติ
(เดือนจาก `mtdLabel`, ไตรมาสจาก `quarterLabel`/`quarterPeriod`) ทุกอย่างอยู่ใน `update.py`

### ต้นเดือน — ไม่ต้องแก้โค้ดแล้ว
`QUARTER_PREV_ACT` (ที่เคยต้องพิมพ์มือทุกต้นเดือน และเคยลืม 2 ครั้ง) **ถูกลบออกแล้ว** — ยอดเดือนที่จบแล้ว
อ่านจากไฟล์ Target อัตโนมัติ สิ่งเดียวที่ต้องทำคือ **ผู้ใช้กรอก ACTUAL เดือนที่จบแล้วในไฟล์ Target**
(ถ้ายังไม่กรอก update.py จะเตือน `⚠️⚠️⚠️`)

### เมื่อ target เปลี่ยน / ขึ้นปีใหม่
- target ทั้ง 12 เดือนของ 2569 อยู่ใน `MONTHLY_TARGETS` ครบแล้ว (ใส่ Q1 + Q4 เมื่อ 4 ต.ค. 2569)
- ถ้าผู้ใช้แก้ target ใน Excel → update.py จะเตือนว่าไม่ตรง → copy ค่าจากไฟล์มาใส่ `MONTHLY_TARGETS`
  (สร้างจากไฟล์ด้วย script อย่าพิมพ์มือ; ให้ผู้ใช้ยืนยันก่อนแก้ target ทุกครั้ง)
- ขึ้นปี 2570: เปลี่ยน `TARGET_YEAR`, `TARGET_WORKBOOK` (ชื่อไฟล์ปีใหม่) และ `MONTHLY_TARGETS` ทั้ง 12 เดือน
  (`MONTHLY_TARGETS` ใช้ key แค่ "MM" ไม่มีปี — ถ้าไม่แก้ ม.ค. 2570 จะใช้เป้า ม.ค. 2569)

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

### Target and Achievement UPC2 Team 2026.xlsx  ★ แหล่งอ้างอิงหลักของ target/actual
**path จริงที่ใช้:** `LG Chem/01 Sale Update/Achievement/Target and Achievement UPC2 Team 2026.xlsx`
(ไฟล์ชื่อเดียวกันในโฟลเดอร์ Sale Dashboard **เก่า/ไม่อัพเดต** — actual มีแค่ถึง มี.ค. อย่าใช้)

- Sheet "Data Input" แถว 5–28 = **ACTUAL** รายเดือน, แถว 40–63 = **TARGET** รายเดือน
  (คอลัมน์ C=Jan … N=Dec ตรงกับเดือน)
- ยอด actual ในไฟล์นี้ **ครบกว่า data.json** เพราะ SD0002 รายวันไม่มี 2 ลูกค้า (ดูหัวข้อข้อจำกัดด้านบน)
  → update.py อ่าน ACTUAL จากไฟล์นี้ตรงๆ (`load_target_workbook()` — หาตารางจาก
  ข้อความ "TARGET INPUT" ไม่ผูกกับเลขแถว)
- Sheet "Ref. Target": อ้างอิง

---

## สถานะปัจจุบัน

- **เดือน:** ตุลาคม 2569 (Q4 เริ่มแล้ว)
- **Dashboard version:** v8 (publish)
- **GitHub Pages:** deploy แล้ว → https://makenew-world.github.io/upc2-dashboard/
- **target:** ครบทั้ง 12 เดือนของ 2569 (Q4 ใส่แล้ว 4 ต.ค. 2569 จากไฟล์ Target)
- **ยอดสะสม:** ไตรมาส + Total Year อ่าน ACTUAL เดือนที่จบแล้วจากไฟล์ Target อัตโนมัติ (ไม่มี `QUARTER_PREV_ACT` แล้ว)
- **ข้อมูลล่าสุดที่ deploy (4 ต.ค. 2569):** ยังเป็น 29 ก.ย. (Q3) — ยังไม่มี SD0002 ของ ต.ค.
- **ต้นเดือน พ.ย.:** ผู้ใช้ต้องกรอก ACTUAL ต.ค. ในไฟล์ Target (ไม่งั้น update.py เตือน และ Q4/ทั้งปีจะขาด ต.ค.)

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
| Sep | Fix: ลืมใส่ `QUARTER_PREV_ACT["09"]` ตอนขึ้นเดือน ก.ย. — Q3 Scheme เคยนับแค่ยอด ก.ย. ไม่รวม ก.ค.+ส.ค. |
| Sep | ปรับ target ก.ย. ของ EPOTIV/ESPOGEN (PU4/PU5/PU6) ตามไฟล์ Target ใหม่ — เป้า EPO Family ลด 1,180,031 |
| Sep | เปลี่ยน `QUARTER_PREV_ACT["09"]` ไปใช้ actual ก.ค.+ส.ค. จากไฟล์ Target (ครบกว่า data.json +158,060) |
| Oct | ใส่ target Q4 (ต.ค.–ธ.ค.) + Q1 (ม.ค.–มี.ค. ใช้คิดเป้าทั้งปี) จากไฟล์ Target |
| Oct | เพิ่มการ์ด **Total Year Achievement** ใต้การ์ดไตรมาส (`yearScheme`/`yearLabel`/`yearPrevPeriod` ใน data.json) |
| Oct | ลบ `QUARTER_PREV_ACT` — ยอดเดือนที่จบแล้วอ่านจากไฟล์ Target อัตโนมัติ + เตือนเมื่อ ACTUAL ไม่ได้กรอก / target ไม่ตรงไฟล์ |
