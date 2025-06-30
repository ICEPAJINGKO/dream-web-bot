import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DreamBotModule } from './dream-bot/dream-bot.module';

@Module({
  imports: [DreamBotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
