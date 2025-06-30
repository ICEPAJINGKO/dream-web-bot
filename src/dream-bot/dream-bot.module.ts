import { Module } from '@nestjs/common';
import { DreamBotController } from './dream-bot.controller';
import { DreamBotService } from './dream-bot.service';

@Module({
  controllers: [DreamBotController],
  providers: [DreamBotService],
  exports: [DreamBotService],
})
export class DreamBotModule {}
