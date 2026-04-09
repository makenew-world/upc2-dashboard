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
├── UPC2_Dashboard_v8_publish.jsx   ← Dashboard UI (แก้ต้นเดือน)
├── data.json                        ← ข้อมูลยอดขาย (อัพเดตทุกวัน)
├── update.py                        ← script อัพเดต data.json จาก Excel
├── index.html                       ← HTML wrapper สำหรับ deploy
├── serve.py                         ← Python local server (ใช้ preview)
├── DEPLOY.md                        ← คู่มือ deploy GitHub Pages
└── CLAUDE.md                        ← ไฟล์นี้
```

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

## วิธีอัพเดต Target (ต้นเดือน)

เมื่อขึ้นเดือนใหม่ ให้แก้ใน JSX และ update.py:

1. **JSX** (`UPC2_Dashboard_v8_publish.jsx`):
   - เปลี่ยนชื่อตัวแปร target เช่น `APR_TGT` → `MAY_TGT`
   - อัพเดต `SCHEME_DEF` (monthly scheme targets)
   - อัพเดต `Q2_SCHEME` — ใส่ `janFebAct` = ยอด actual เดือนก่อนๆ ใน Q2
   - อัพเดต label ใน UI: `(เป้า เม.ย.)` → `(เป้า พ.ค.)` เป็นต้น

2. **update.py** — `MONTHLY_TARGETS` dict มี target ทุกเดือนอยู่แล้ว ไม่ต้องแก้

3. ดึง target จาก Excel: `Target and Achievement UPC2 Team 2026.xlsx`
   → sheet "Data Input" → section "TARGET INPUT 2026" → คอลัมน์ของเดือนนั้น

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

- **เดือน:** เมษายน 2569 (April 2026)
- **Dashboard version:** v8 (publish)
- **ข้อมูลล่าสุด:** 3 เม.ย. 2569 (53 รายการ)
- **GitHub Pages:** ยังไม่ได้ deploy (ดู DEPLOY.md)
- **Q1 (ม.ค.–มี.ค.):** เสร็จสิ้นแล้ว กำลังอยู่ใน Q2

---

## ประวัติการแก้ไขสำคัญ

| ครั้งที่ | สิ่งที่แก้ |
|---------|-----------|
| v8 → Apr | อัพเดต target เดือนเมษายน จาก Data Input tab |
| v8 → Apr | แก้ bug ZEMI Family scheme: ต้องรวม ZEMIDAPA ด้วย (ไม่ใช่แค่ ZEMIGLO+ZEMIMET) |
| v8 → Apr | เปลี่ยน Q1_SCHEME → Q2_SCHEME (เม.ย.–มิ.ย.) |
| v8 → Apr | Refactor: แยก data.json ออกจาก JSX เพื่อลด token การอัพเดตรายวัน |
| v8 → Apr | สร้าง update.py สำหรับอัพเดตข้อมูลโดยไม่ต้องใช้ Claude |
