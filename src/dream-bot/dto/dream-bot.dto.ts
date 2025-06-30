export class StartBotDto {
    cycles?: number = 10;
}

export class BotStatusDto {
    isRunning: boolean;
    currentCycle?: number;
    totalCycles?: number;
}

export class BotResponseDto {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}
