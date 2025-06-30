import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class StartBotDto {
    @ApiPropertyOptional({
        description: 'จำนวนรอบการทำงาน (Number of cycles to run)',
        example: 10,
        default: 10,
        minimum: 1,
        maximum: 100,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'จำนวนรอบต้องเป็นจำนวนเต็ม (Cycles must be an integer)' })
    @Min(1, {
        message: 'จำนวนรอบต้องมากกว่า 0 (Cycles must be greater than 0)',
    })
    @Max(100, {
        message: 'จำนวนรอบต้องไม่เกิน 100 (Cycles must not exceed 100)',
    })
    cycles?: number = 10;

    @ApiPropertyOptional({
        description: 'จำนวนผู้ใช้พร้อมกัน (Number of concurrent users)',
        example: 1,
        default: 1,
        minimum: 1,
        maximum: 20,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({
        message: 'จำนวนผู้ใช้ต้องเป็นจำนวนเต็ม (Users must be an integer)',
    })
    @Min(1, {
        message: 'จำนวนผู้ใช้ต้องมากกว่า 0 (Users must be greater than 0)',
    })
    @Max(20, {
        message: 'จำนวนผู้ใช้ต้องไม่เกิน 20 (Users must not exceed 20)',
    })
    users?: number = 1;
}

export class BotStatusDto {
    @ApiProperty({
        description: 'สถานะการทำงานของบอท (Bot running status)',
        example: true,
    })
    @IsBoolean()
    isRunning: boolean;

    @ApiPropertyOptional({
        description: 'รอบปัจจุบันที่กำลังทำงาน (Current cycle number)',
        example: 5,
    })
    @IsOptional()
    @IsInt()
    currentCycle?: number;

    @ApiPropertyOptional({
        description: 'จำนวนรอบทั้งหมด (Total number of cycles)',
        example: 10,
    })
    @IsOptional()
    @IsInt()
    totalCycles?: number;

    @ApiPropertyOptional({
        description: 'จำนวนผู้ใช้ที่ยังคงใช้งานอยู่ (Number of active users)',
        example: 3,
    })
    @IsOptional()
    @IsInt()
    activeUsers?: number;

    @ApiPropertyOptional({
        description: 'จำนวนผู้ใช้ทั้งหมด (Total number of users)',
        example: 5,
    })
    @IsOptional()
    @IsInt()
    totalUsers?: number;
}

export class BotResponseDto {
    @ApiProperty({
        description: 'สถานะความสำเร็จของการทำงาน (Operation success status)',
        example: true,
    })
    @IsBoolean()
    success: boolean;

    @ApiProperty({
        description: 'ข้อความตอบกลับ (Response message)',
        example: 'บอทเริ่มทำงานเรียบร้อยแล้ว',
    })
    @IsString()
    message: string;

    @ApiPropertyOptional({
        description: 'ข้อมูลเพิ่มเติม (Additional data)',
        example: { cycles: 10, users: 5 },
    })
    @IsOptional()
    data?: Record<string, unknown>;

    @ApiPropertyOptional({
        description: 'ข้อความแสดงความผิดพลาด (Error message)',
        example: 'เกิดข้อผิดพลาดในการเริ่มต้นบอท',
    })
    @IsOptional()
    @IsString()
    error?: string;
}
