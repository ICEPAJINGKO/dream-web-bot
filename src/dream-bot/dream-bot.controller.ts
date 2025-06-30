import { Controller, Post, Get, Body, Logger } from '@nestjs/common';
import { DreamBotService } from './dream-bot.service';
import { StartBotDto } from './dto';

@Controller('dream-bot')
export class DreamBotController {
    private readonly logger = new Logger(DreamBotController.name);

    constructor(private readonly dreamBotService: DreamBotService) {}

    @Post('start')
    async startBot(@Body() startBotDto: StartBotDto) {
        return await this.dreamBotService.handleStartBot(startBotDto);
    }

    @Post('stop')
    async stopBot() {
        return await this.dreamBotService.handleStopBot();
    }

    @Get('status')
    getStatus() {
        return this.dreamBotService.getStatus();
    }

    @Post('run-once')
    async runOnce() {
        return await this.dreamBotService.handleRunOnce();
    }
}
