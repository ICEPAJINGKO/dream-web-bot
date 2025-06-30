# Dream Web Bot

🤖 **Bot สำหรับไต่หน้าเว็บ Dream2Number.com อย่างอัตโนมัติ**

Built with NestJS and Puppeteer

## 🌟 คุณสมบัติ

- ✅ กรอกข้อมูลความฝันแบบสุ่มในช่อง textarea
- ✅ กดปุ่ม "ตีเลข" และรอให้เว็บคำนวณเสร็จ
- ✅ กดปุ่ม "กลับไปกรอกความฝันอื่น" เพื่อเริ่มรอบใหม่
- ✅ สามารถกำหนดจำนวนรอบที่ต้องการได้
- ✅ **รองรับหลาย users ทำงานพร้อมกัน (Multi-User Support)**
- ✅ มี REST API สำหรับควบคุม bot
- ✅ มี logging system สำหรับติดตาม

## 🚀 การติดตั้งและใช้งาน

### ติดตั้ง dependencies

```bash
npm install
```

### Code Formatting & Linting

```bash
# ก่อนการพัฒนา - แก้ไข formatting และ linting issues
npm run code:fix

# ตรวจสอบ code quality
npm run code:check
```

📋 **สำหรับ team members**: ดู [FORMATTING_GUIDE.md](./FORMATTING_GUIDE.md) สำหรับรายละเอียดการตั้งค่า

### เริ่มต้น server

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

Server จะรันที่ `http://localhost:3000`

## 📡 API Endpoints

| Method | Endpoint              | Description                                |
| ------ | --------------------- | ------------------------------------------ |
| `POST` | `/dream-bot/start`    | เริ่มต้น bot ด้วยจำนวนรอบและผู้ใช้ที่กำหนด |
| `POST` | `/dream-bot/stop`     | หยุดการทำงานของ bot                        |
| `GET`  | `/dream-bot/status`   | ตรวจสอบสถานะการทำงาน                       |
| `POST` | `/dream-bot/run-once` | รัน bot แค่ 1 รอบ ด้วย 1 user              |

### ตัวอย่างการใช้งาน

```bash
# เริ่ม bot ด้วย 5 รอบ และ 1 user (default)
curl -X POST http://localhost:3000/dream-bot/start \
  -H "Content-Type: application/json" \
  -d '{"cycles": 5}'

# เริ่ม bot ด้วย 3 รอบ และ 2 users พร้อมกัน
curl -X POST http://localhost:3000/dream-bot/start \
  -H "Content-Type: application/json" \
  -d '{"cycles": 3, "users": 2}'

# ตรวจสอบสถานะ (จะแสดงข้อมูล multi-user)
curl http://localhost:3000/dream-bot/status

# หยุด bot (จะปิดทุก browser)
curl -X POST http://localhost:3000/dream-bot/stop

# รัน bot แค่ครั้งเดียว
curl -X POST http://localhost:3000/dream-bot/run-once
```

## 🔧 Request Body Parameters

### POST `/dream-bot/start`

```json
{
    "cycles": 10, // จำนวนรอบที่ต้องการรัน (default: 10)
    "users": 1 // จำนวน users ที่จะรันพร้อมกัน (default: 1)
}
```

### Response Format

```json
{
    "success": true,
    "message": "Dream Bot started for 3 cycles with 2 users",
    "data": {
        "cycles": 3,
        "users": 2
    }
}
```

## 📊 Status Response

```json
{
    "isRunning": true,
    "currentCycle": 2,
    "totalCycles": 3,
    "activeUsers": 2,
    "totalUsers": 2
}
```

## 🏗️ โครงสร้างโปรเจ็กต์

```
src/
├── app.module.ts           # Main application module
├── dream-bot/             # Dream Bot Module
│   ├── dream-bot.controller.ts  # API endpoints
│   ├── dream-bot.service.ts     # Bot logic
│   ├── dream-bot.module.ts      # NestJS module
│   └── README.md               # Module documentation
└── ...
```

## 🛠️ การพัฒนา

### Built with

- **NestJS** - Progressive Node.js framework
- **Puppeteer** - Headless Chrome automation
- **TypeScript** - Type-safe JavaScript
      <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
      [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
