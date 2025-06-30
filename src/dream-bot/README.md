# Dream Web Bot

Bot สำหรับไต่หน้าเว็บ Dream2Number โดยอัตโนมัติ

## คุณสมบัติ

- กรอกข้อมูลความฝันแบบสุ่มในช่อง textarea
- กดปุ่ม "ตีเลข" และรอให้เว็บคำนวณเสร็จ
- กดปุ่ม "กลับไปกรอกความฝันอื่น" เพื่อเริ่มรอบใหม่
- สามารถกำหนดจำนวนรอบที่ต้องการได้
- มี API endpoints สำหรับควบคุม bot

## การติดตั้ง

```bash
npm install
```

## การใช้งาน

### เริ่มต้น server

```bash
npm run start:dev
```

### API Endpoints

#### 1. เริ่มต้น Bot
```bash
POST http://localhost:3000/dream-bot/start
Content-Type: application/json

{
  "cycles": 10
}
```

#### 2. หยุด Bot
```bash
POST http://localhost:3000/dream-bot/stop
```

#### 3. ตรวจสอบสถานะ Bot
```bash
GET http://localhost:3000/dream-bot/status
```

#### 4. รัน Bot แค่ 1 รอบ
```bash
POST http://localhost:3000/dream-bot/run-once
```

## ตัวอย่างการใช้งาน

### 1. เริ่ม Bot ด้วย curl

```bash
# เริ่ม bot ด้วย 5 รอบ
curl -X POST http://localhost:3000/dream-bot/start \
  -H "Content-Type: application/json" \
  -d '{"cycles": 5}'

# ตรวจสอบสถานะ
curl http://localhost:3000/dream-bot/status

# หยุด bot
curl -X POST http://localhost:3000/dream-bot/stop
```

### 2. ใช้ Postman หรือ Insomnia
- ตั้งค่า base URL เป็น `http://localhost:3000`
- ใช้ endpoints ตามที่ระบุข้างต้น

## ข้อมูลเพิ่มเติม

- Bot จะเปิด browser ขึ้นมาให้ดู (headless: false)
- ข้อมูลความฝันที่กรอกจะเป็นแบบสุ่มจากรายการที่กำหนดไว้
- มีการรอระหว่างแต่ละรอบเพื่อป้องกันการโหลดเซิร์ฟเวอร์มากเกินไป
- หาก bot เจอปัญหา จะพยายามรีเฟรชหน้าเว็บและลองใหม่

## การพัฒนา

โครงสร้างไฟล์:
```
src/dream-bot/
├── dream-bot.controller.ts  # API endpoints
├── dream-bot.service.ts     # ตัวจัดการ bot หลัก
├── dream-bot.module.ts      # NestJS module
└── index.ts                 # exports
```

## การแก้ไขปัญหา

1. **Browser ไม่เปิด**: ตรวจสอบว่าติดตั้ง Puppeteer เรียบร้อยแล้ว
2. **หน้าเว็บโหลดช้า**: เพิ่มเวลา timeout ใน service
3. **Bot หยุดทำงาน**: ดู log ใน console เพื่อหาสาเหตุ
