# UPC2 Dashboard — วิธี Deploy & อัพเดตข้อมูล

## 🏗️ สถาปัตยกรรมใหม่

```
UPC2_Dashboard_v8_publish.jsx   ← UI (แก้เดือนละครั้ง หรือน้อยกว่า)
data.json                        ← ข้อมูลยอดขาย (อัพเดตทุกวัน ด้วย update.py)
update.py                        ← script สำหรับอัพเดต data.json
```

---

## 📅 วิธีอัพเดตข้อมูลประจำวัน (ไม่ต้องใช้ Claude เลย!)

1. Download ไฟล์ SD0002 จากระบบ → บันทึกลง `~/Downloads/`
2. เปิด Terminal แล้วรัน:

```bash
cd "/Users/supasawat/Library/CloudStorage/GoogleDrive-supasawat.lg@gmail.com/My Drive/LG Chem/Sale Dashboard"
python3 update.py
```

3. Push ขึ้น GitHub:

```bash
git add data.json
git commit -m "data: $(date '+%d %b %Y')"
git push
```

ทีมทุกคนเห็น dashboard อัพเดตใน ~1 นาที ✅

---

## 🚀 ตั้งค่า GitHub Pages (ครั้งแรกครั้งเดียว)

### ขั้นที่ 1 — สร้าง GitHub Repository

1. ไปที่ https://github.com/new
2. ตั้งชื่อ repo เช่น `upc2-dashboard`
3. เลือก **Private** (เพราะมีข้อมูลยอดขาย)
4. กด **Create repository**

### ขั้นที่ 2 — Push ไฟล์ขึ้น GitHub

เปิด Terminal แล้วรันทีละบรรทัด:

```bash
cd "/Users/supasawat/Library/CloudStorage/GoogleDrive-supasawat.lg@gmail.com/My Drive/LG Chem/Sale Dashboard"

git init
git add UPC2_Dashboard_v8_publish.jsx data.json index.html
git commit -m "initial: UPC2 dashboard"

git remote add origin https://github.com/YOUR_USERNAME/upc2-dashboard.git
git branch -M main
git push -u origin main
```

> แทน `YOUR_USERNAME` ด้วย GitHub username ของคุณ

### ขั้นที่ 3 — เปิด GitHub Pages

1. ไปที่ repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / folder: **/ (root)**
4. กด **Save**

ภายใน 2-3 นาที dashboard จะขึ้นที่:
```
https://YOUR_USERNAME.github.io/upc2-dashboard/
```

แชร์ URL นี้ให้ทีมได้เลย — มี PIN login อยู่แล้ว 🔐

---

## 📁 ไฟล์ที่ต้อง push (ไฟล์ที่เหลือไม่จำเป็น)

| ไฟล์ | อัพเดตบ่อยแค่ไหน |
|---|---|
| `UPC2_Dashboard_v8_publish.jsx` | ต้นเดือน (เปลี่ยน target) หรือแก้ UI |
| `data.json` | **ทุกวัน** (รัน update.py) |
| `index.html` | แทบไม่เคย |

---

## ⚡ สรุป Token ที่ใช้

| งาน | เดิม | ใหม่ |
|---|---|---|
| อัพเดตข้อมูลทุกวัน | ~3,000 tokens | **0 tokens** (รัน update.py เอง) |
| เปลี่ยน target ต้นเดือน | ~2,000 tokens | ~500 tokens (แก้แค่ตัวเลข) |
| แก้ UI / เพิ่ม feature | ~5,000 tokens | ~5,000 tokens (เท่าเดิม) |
