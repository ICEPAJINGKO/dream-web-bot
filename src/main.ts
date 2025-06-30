import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // เปิดใช้งาน validation pipe สำหรับตรวจสอบข้อมูลที่เข้ามา
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // ลบ properties ที่ไม่ได้กำหนดใน DTO
            forbidNonWhitelisted: true, // แสดง error หากมี properties ที่ไม่ได้กำหนด
            transform: true, // แปลงข้อมูลให้เป็นประเภทที่ถูกต้อง
            transformOptions: {
                enableImplicitConversion: true, // แปลงข้อมูลอัตโนมัติ
            },
        }),
    );

    // ตั้งค่า Swagger Documentation
    const config = new DocumentBuilder()
        .setTitle('Dream Web Bot API')
        .setDescription(
            'API สำหรับการควบคุม Dream Web Bot - บอทสำหรับแปลงความฝันเป็นตัวเลข\n\n' +
                'Dream Web Bot API - Bot for converting dreams to numbers\n\n' +
                'Features:\n' +
                '- รองรับการทำงานหลายผู้ใช้พร้อมกัน (Multi-user support)\n' +
                '- จัดการ popup และ alert อัตโนมัติ (Automatic popup/alert handling)\n' +
                '- ระบบ retry เมื่อเกิดข้อผิดพลาด (Error retry mechanism)\n' +
                '- ระบบ logging แบบละเอียด (Detailed logging system)',
        )
        .setVersion('1.0')
        .addTag('dream-bot', 'การควบคุมบอทแปลงความฝัน (Dream Bot Control)')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            displayRequestDuration: true,
        },
        customSiteTitle: 'Dream Web Bot API Documentation',
    });

    await app.listen(process.env.PORT ?? 3000);
    console.log(
        `🚀 Dream Web Bot API เริ่มทำงานที่ http://localhost:${process.env.PORT ?? 3000}`,
    );
    console.log(
        `📚 Swagger Documentation: http://localhost:${process.env.PORT ?? 3000}/api-docs`,
    );
}
void bootstrap();
