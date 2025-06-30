import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { BotResponseDto, BotStatusDto, StartBotDto } from './dto';

interface UserSession {
    browser: puppeteer.Browser;
    page: puppeteer.Page;
    userId: number;
    currentCycle: number;
    isActive: boolean;
}

@Injectable()
export class DreamBotService {
    private readonly logger = new Logger(DreamBotService.name);
    private userSessions: UserSession[] = [];
    private isRunning = false;
    private totalCycles = 0;
    private totalUsers = 0;

    async initialize(users: number = 1): Promise<void> {
        try {
            this.logger.log(`Initializing Dream Bot for ${users} users...`);
            this.totalUsers = users;

            // สร้าง browser และ page สำหรับแต่ละ user
            for (let i = 0; i < users; i++) {
                const browser = await puppeteer.launch({
                    headless: false, // เปิด browser ให้เห็น
                    defaultViewport: { width: 400, height: 400 },
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--disable-gpu',
                    ],
                });

                const page = await browser.newPage();
                await page.setUserAgent(
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                );

                this.userSessions.push({
                    browser,
                    page,
                    userId: i + 1,
                    currentCycle: 0,
                    isActive: true,
                });

                this.logger.log(`User ${i + 1} browser initialized`);
            }

            this.logger.log(
                `Dream Bot initialized successfully for ${users} users`,
            );
        } catch (error) {
            this.logger.error('Failed to initialize Dream Bot:', error);
            await this.cleanup();
            throw error;
        }
    }

    async startBot(cycles: number = 10, users: number = 1): Promise<void> {
        if (this.isRunning) {
            this.logger.warn('Bot is already running');
            return;
        }

        this.isRunning = true;
        this.totalCycles = cycles;
        this.logger.log(
            `Starting Dream Bot for ${cycles} cycles with ${users} users`,
        );

        try {
            // รัน bot แต่ละ user พร้อมกัน
            const userPromises = this.userSessions.map((session) =>
                this.runUserCycles(session, cycles),
            );

            await Promise.all(userPromises);
            this.logger.log('All users completed their cycles');
        } catch (error) {
            this.logger.error('Bot encountered an error:', error);
        } finally {
            this.isRunning = false;
            this.resetUserSessions();
            this.logger.log('Bot stopped');
        }
    }

    private async runUserCycles(
        session: UserSession,
        cycles: number,
    ): Promise<void> {
        this.logger.log(`Starting User ${session.userId} cycles`);

        for (let i = 1; i <= cycles; i++) {
            if (!this.isRunning || !session.isActive) {
                break;
            }

            session.currentCycle = i;
            this.logger.log(
                `User ${session.userId}: Starting cycle ${i}/${cycles}`,
            );

            try {
                await this.runSingleCycle(session);
                // รอสักครู่ระหว่างรอบ
                await this.sleep(2000);
            } catch (error) {
                this.logger.error(
                    `User ${session.userId} cycle ${i} error:`,
                    error,
                );
                // หากเกิด error ให้หยุด user นี้
                session.isActive = false;
                break;
            }
        }

        this.logger.log(`User ${session.userId} completed all cycles`);
    }

    private resetUserSessions(): void {
        this.userSessions.forEach((session) => {
            session.currentCycle = 0;
            session.isActive = true;
        });
    }

    async handleStartBot(startBotDto: StartBotDto): Promise<BotResponseDto> {
        try {
            const cycles = startBotDto.cycles || 10;
            const users = startBotDto.users || 1;
            this.logger.log(
                `Starting Dream Bot with ${cycles} cycles for ${users} users`,
            );

            // Initialize the bot first
            await this.initialize(users);

            // Start the bot (this will run in background)
            void this.startBot(cycles, users);

            return {
                success: true,
                message: `Dream Bot started for ${cycles} cycles with ${users} users`,
                data: { cycles, users },
            };
        } catch (error: unknown) {
            this.logger.error('Failed to start Dream Bot:', error);
            return {
                success: false,
                message: 'Failed to start Dream Bot',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async handleStopBot(): Promise<BotResponseDto> {
        try {
            await this.stopBot();
            return {
                success: true,
                message: 'Dream Bot stopped successfully',
            };
        } catch (error: unknown) {
            this.logger.error('Failed to stop Dream Bot:', error);
            return {
                success: false,
                message: 'Failed to stop Dream Bot',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async handleRunOnce(): Promise<BotResponseDto> {
        try {
            this.logger.log('Running Dream Bot once');

            // Initialize the bot first with 1 user
            await this.initialize(1);

            // Run single cycle with 1 user
            await this.startBot(1, 1);

            return {
                success: true,
                message: 'Dream Bot completed one cycle successfully',
            };
        } catch (error: unknown) {
            this.logger.error('Failed to run Dream Bot once:', error);
            return {
                success: false,
                message: 'Failed to run Dream Bot',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    async stopBot(): Promise<void> {
        this.isRunning = false;
        await this.cleanup();
        this.logger.log('All browsers closed');
    }

    private async cleanup(): Promise<void> {
        const closePromises = this.userSessions.map(async (session) => {
            try {
                if (session.browser) {
                    await session.browser.close();
                    this.logger.log(`User ${session.userId} browser closed`);
                }
            } catch (error) {
                this.logger.error(
                    `Error closing browser for user ${session.userId}:`,
                    error,
                );
            }
        });

        await Promise.all(closePromises);
        this.userSessions = [];
        this.totalUsers = 0;
    }

    private async runSingleCycle(session: UserSession): Promise<void> {
        try {
            // เข้าสู่หน้าเว็บ
            await session.page.goto('https://dream2number.com', {
                waitUntil: 'networkidle2',
            });
            this.logger.log(
                `User ${session.userId}: Navigated to Dream2Number website`,
            );

            // รอให้หน้าโหลดเสร็จ
            await session.page.waitForSelector('textarea', { timeout: 10000 });

            // สร้างข้อความสุ่มสำหรับกรอกในช่อง textarea
            const randomDreamText = this.generateRandomDreamText();

            // กรอกข้อมูลในช่อง textarea
            await session.page.click('textarea');
            await session.page.evaluate(() => {
                const textarea = document.querySelector(
                    'textarea',
                ) as HTMLTextAreaElement;
                if (textarea) textarea.value = '';
            });
            await session.page.type('textarea', randomDreamText, { delay: 50 });
            this.logger.log(
                `User ${session.userId}: Entered dream text: ${randomDreamText}`,
            );

            // รอสักครู่แล้วกดปุ่ม "ตีเลข"
            await this.sleep(200);

            // หาและกดปุ่ม "ตีเลข"
            const submitButton = await session.page.$('button');
            if (submitButton) {
                const buttonText = await session.page.evaluate(
                    (el) => el.textContent,
                    submitButton,
                );
                if (buttonText && buttonText.includes('ตีเลข')) {
                    await submitButton.click();
                    this.logger.log(
                        `User ${session.userId}: Clicked "ตีเลข" button`,
                    );
                }
            }

            // รอให้เว็บคำนวณเสร็จ (รอจนกว่าจะเห็นผลลัพธ์)
            await this.waitForCalculationComplete(session);

            // หาและกดปุ่ม "กลับไปกรอกความฝันอื่น"
            await this.clickBackButton(session);
        } catch (error) {
            this.logger.error(
                `User ${session.userId}: Error in single cycle:`,
                error,
            );
            throw error;
        }
    }

    private async waitForCalculationComplete(
        session: UserSession,
    ): Promise<void> {
        try {
            this.logger.log(
                `User ${session.userId}: Waiting for calculation to complete...`,
            );

            // รอให้ผลลัพธ์ปรากฏ หรือรอจนกว่าจะเห็นปุ่ม "กลับไปกรอกความฝันอื่น"
            await session.page.waitForFunction(
                () => {
                    // ตรวจหาปุ่มกลับ (ทั้ง button และ a tag)
                    const backButton = Array.from(
                        document.querySelectorAll('button, a'),
                    ).find(
                        (btn) =>
                            btn.textContent?.includes('กลับ') ||
                            btn.textContent?.includes('อื่น'),
                    );

                    return backButton !== undefined;
                },
                { timeout: 60000 },
            );

            this.logger.log(`User ${session.userId}: Calculation completed`);
            await this.sleep(200); // รอให้แน่ใจว่าหน้าโหลดเสร็จสมบูรณ์
        } catch (error) {
            this.logger.error(
                `User ${session.userId}: Timeout waiting for calculation:`,
                error,
            );
            // ลองรีเฟรชหน้าถ้าเกิดปัญหา
            await session.page.reload({ waitUntil: 'networkidle2' });
        }
    }

    private async clickBackButton(session: UserSession): Promise<void> {
        try {
            // หาปุ่ม "กลับไปกรอกความฝันอื่น" (ทั้ง button และ a tag)
            const backButtonClicked = await session.page.evaluate(() => {
                // ลองหา a tag ที่มี href="/" และมีข้อความ "กลับไปกรอกความฝันอื่น"
                const backLinkByHref = document.querySelector('a[href="/"]');
                if (
                    backLinkByHref &&
                    backLinkByHref.textContent?.includes('กลับ')
                ) {
                    (backLinkByHref as HTMLElement).click();
                    return true;
                }

                // ลองหาแบบทั่วไป
                const backButton = Array.from(
                    document.querySelectorAll('button, a'),
                ).find(
                    (btn) =>
                        btn.textContent?.includes('กลับ') ||
                        btn.textContent?.includes('อื่น'),
                );

                if (backButton) {
                    (backButton as HTMLElement).click();
                    return true;
                }
                return false;
            });

            if (backButtonClicked) {
                this.logger.log(`User ${session.userId}: Clicked back button`);

                // รอให้กลับไปหน้าแรก
                await session.page.waitForSelector('textarea', {
                    timeout: 10000,
                });
                await this.sleep(200);
            } else {
                this.logger.warn(
                    `User ${session.userId}: Back button not found, refreshing page`,
                );
                await session.page.reload({ waitUntil: 'networkidle2' });
            }
        } catch (error) {
            this.logger.error(
                `User ${session.userId}: Error clicking back button:`,
                error,
            );
            // ถ้าไม่เจอปุ่มกลับ ให้รีเฟรชหน้า
            await session.page.reload({ waitUntil: 'networkidle2' });
        }
    }

    private generateRandomDreamText(): string {
        const dreamTexts = [
            'ฝันเห็นงู',
            'ฝันเห็นปลา',
            'ฝันเห็นช้าง',
            'ฝันเห็นนก',
            'ฝันเห็นแมว',
            'ฝันเห็นหมา',
            'ฝันเห็นเสือ',
            'ฝันเห็นมด',
            'ฝันเห็นผึ้ง',
            'ฝันเห็นกบ',
            'ฝันเห็นเต่า',
            'ฝันเห็นลิง',
            'ฝันเห็นหนู',
            'ฝันเห็นควาย',
            'ฝันเห็นไก่',
            'ฝันเห็นเป็ด',
            'ฝันเห็นกิ้งก่า',
            'ฝันเห็นแมงมุม',
            'ฝันเห็นปู',
            'ฝันเห็นกบ',
            'ฝันเห็นน้ำ',
            'ฝันเห็นไฟ',
            'ฝันเห็นฝน',
            'ฝันเห็นแสงแดด',
            'ฝันเห็นพระจันทร์',
            'ฝันเห็นดาว',
            'ฝันเห็นฟ้าร้อง',
            'ฝันเห็นลม',
            'ฝันเห็นดิน',
            'ฝันเห็นทราย',
        ];

        const randomIndex = Math.floor(Math.random() * dreamTexts.length);
        return dreamTexts[randomIndex] + ' ' + this.getRandomDigitString(20);
    }

    private getRandomDigitString(length: number): string {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    getStatus(): BotStatusDto {
        const activeUsers = this.userSessions.filter(
            (session) => session.isActive,
        ).length;
        const currentCycle =
            this.userSessions.length > 0
                ? Math.max(
                      ...this.userSessions.map(
                          (session) => session.currentCycle,
                      ),
                  )
                : 0;

        return {
            isRunning: this.isRunning,
            currentCycle: currentCycle > 0 ? currentCycle : undefined,
            totalCycles: this.totalCycles > 0 ? this.totalCycles : undefined,
            activeUsers: this.totalUsers > 0 ? activeUsers : undefined,
            totalUsers: this.totalUsers > 0 ? this.totalUsers : undefined,
        };
    }
}
