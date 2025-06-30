import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBody,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import { DreamBotService } from './dream-bot.service';
import { BotResponseDto, BotStatusDto, StartBotDto } from './dto';

@ApiTags('dream-bot')
@Controller('dream-bot')
export class DreamBotController {
    private readonly logger = new Logger(DreamBotController.name);

    constructor(private readonly dreamBotService: DreamBotService) {}

    @Post('start')
    @ApiOperation({
        summary: 'เริ่มการทำงานของบอท (Start Bot)',
        description:
            'เริ่มต้นการทำงานของ Dream Web Bot ด้วยจำนวนรอบและผู้ใช้ที่กำหนด\n\nStart Dream Web Bot with specified cycles and users',
    })
    @ApiBody({
        type: StartBotDto,
        description: 'การตั้งค่าการทำงานของบอท (Bot configuration)',
        examples: {
            เริ่มต้นพื้นฐาน: {
                summary: 'เริ่มต้นพื้นฐาน (Basic start)',
                description: 'เริ่มบอทด้วยการตั้งค่าพื้นฐาน',
                value: {
                    cycles: 10,
                    users: 1,
                },
            },
            หลายผู้ใช้: {
                summary: 'หลายผู้ใช้ (Multiple users)',
                description: 'เริ่มบอทด้วยผู้ใช้หลายคนพร้อมกัน',
                value: {
                    cycles: 20,
                    users: 5,
                },
            },
        },
    })
    @ApiOkResponse({
        description: 'บอทเริ่มทำงานเรียบร้อยแล้ว (Bot started successfully)',
        type: BotResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'ข้อมูลที่ส่งมาไม่ถูกต้อง (Invalid input data)',
    })
    @ApiInternalServerErrorResponse({
        description: 'เกิดข้อผิดพลาดภายในระบบ (Internal server error)',
    })
    async startBot(@Body() startBotDto: StartBotDto): Promise<BotResponseDto> {
        return await this.dreamBotService.handleStartBot(startBotDto);
    }

    @Post('stop')
    @ApiOperation({
        summary: 'หยุดการทำงานของบอท (Stop Bot)',
        description:
            'หยุดการทำงานของ Dream Web Bot และปิด browser ทั้งหมด\n\nStop Dream Web Bot and close all browsers',
    })
    @ApiOkResponse({
        description: 'บอทหยุดทำงานเรียบร้อยแล้ว (Bot stopped successfully)',
        type: BotResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'เกิดข้อผิดพลาดในการหยุดบอท (Error stopping bot)',
    })
    async stopBot(): Promise<BotResponseDto> {
        return await this.dreamBotService.handleStopBot();
    }

    @Get('status')
    @ApiOperation({
        summary: 'ตรวจสอบสถานะบอท (Check Bot Status)',
        description:
            'ตรวจสอบสถานะปัจจุบันของ Dream Web Bot รวมถึงจำนวนรอบและผู้ใช้\n\nCheck current status of Dream Web Bot including cycles and users',
    })
    @ApiOkResponse({
        description: 'ข้อมูลสถานะของบอท (Bot status information)',
        type: BotStatusDto,
    })
    getStatus(): BotStatusDto {
        return this.dreamBotService.getStatus();
    }

    @Post('run-once')
    @ApiOperation({
        summary: 'รันบอทครั้งเดียว (Run Bot Once)',
        description:
            'รัน Dream Web Bot เพียงครั้งเดียวด้วยผู้ใช้หนึ่งคนและหนึ่งรอบ (สำหรับทดสอบ)\n\nRun Dream Web Bot once with single user and single cycle (for testing)',
    })
    @ApiOkResponse({
        description:
            'บอททำงานเสร็จสิ้นเรียบร้อยแล้ว (Bot completed successfully)',
        type: BotResponseDto,
    })
    @ApiInternalServerErrorResponse({
        description: 'เกิดข้อผิดพลาดในการรันบอท (Error running bot)',
    })
    async runOnce(): Promise<BotResponseDto> {
        return await this.dreamBotService.handleRunOnce();
    }
}
