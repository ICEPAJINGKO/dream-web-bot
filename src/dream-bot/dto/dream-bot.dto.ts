export class StartBotDto {
    cycles?: number = 10;
    users?: number = 1;
}

export class BotStatusDto {
    isRunning: boolean;
    currentCycle?: number;
    totalCycles?: number;
    activeUsers?: number;
    totalUsers?: number;
}

export class BotResponseDto {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
}
