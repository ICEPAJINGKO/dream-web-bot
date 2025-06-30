import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { StartBotDto, BotStatusDto, BotResponseDto } from './dto';

@Injectable()
export class DreamBotService {
    private readonly logger = new Logger(DreamBotService.name);
    private browser: puppeteer.Browser;
    private page: puppeteer.Page;
    private isRunning = false;
    private currentCycle = 0;
    private totalCycles = 0;

    async initialize(): Promise<void> {
        try {
            this.logger.log('Initializing Dream Bot...');
            this.browser = await puppeteer.launch({
                headless: false, // เปิด browser ให้เห็น
                defaultViewport: { width: 1366, height: 768 },
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

            this.page = await this.browser.newPage();
            await this.page.setUserAgent(
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            );

            this.logger.log('Dream Bot initialized successfully');
        } catch (error) {
            this.logger.error('Failed to initialize Dream Bot:', error);
            throw error;
        }
    }

    async startBot(cycles: number = 10): Promise<void> {
        if (this.isRunning) {
            this.logger.warn('Bot is already running');
            return;
        }

        this.isRunning = true;
        this.totalCycles = cycles;
        this.currentCycle = 0;
        this.logger.log(`Starting Dream Bot for ${cycles} cycles`);

        try {
            for (let i = 1; i <= cycles; i++) {
                this.currentCycle = i;
                this.logger.log(`Starting cycle ${i}/${cycles}`);
                await this.runSingleCycle();

                // รอสักครู่ระหว่างรอบ
                await this.sleep(2000);
            }
        } catch (error) {
            this.logger.error('Bot encountered an error:', error);
        } finally {
            this.isRunning = false;
            this.currentCycle = 0;
            this.totalCycles = 0;
            this.logger.log('Bot stopped');
        }
    }

    async handleStartBot(startBotDto: StartBotDto): Promise<BotResponseDto> {
        try {
            const cycles = startBotDto.cycles || 10;
            this.logger.log(`Starting Dream Bot with ${cycles} cycles`);

            // Initialize the bot first
            await this.initialize();

            // Start the bot (this will run in background)
            void this.startBot(cycles);

            return {
                success: true,
                message: `Dream Bot started for ${cycles} cycles`,
                data: { cycles },
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

            // Initialize the bot first
            await this.initialize();

            // Run single cycle
            await this.startBot(1);

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
        if (this.browser) {
            await this.browser.close();
            this.logger.log('Browser closed');
        }
    }

    private async runSingleCycle(): Promise<void> {
        try {
            // เข้าสู่หน้าเว็บ
            await this.page.goto('https://dream2number.com', {
                waitUntil: 'networkidle2',
            });
            this.logger.log('Navigated to Dream2Number website');

            // รอให้หน้าโหลดเสร็จ
            await this.page.waitForSelector('textarea', { timeout: 10000 });

            // สร้างข้อความสุ่มสำหรับกรอกในช่อง textarea
            const randomDreamText = this.generateRandomDreamText();

            // กรอกข้อมูลในช่อง textarea
            await this.page.click('textarea');
            await this.page.evaluate(() => {
                const textarea = document.querySelector(
                    'textarea',
                ) as HTMLTextAreaElement;
                if (textarea) textarea.value = '';
            });
            await this.page.type('textarea', randomDreamText, { delay: 50 });
            this.logger.log(`Entered dream text: ${randomDreamText}`);

            // รอสักครู่แล้วกดปุ่ม "ตีเลข"
            await this.sleep(1000);

            // หาและกดปุ่ม "ตีเลข"
            const submitButton = await this.page.$('button');
            if (submitButton) {
                const buttonText = await this.page.evaluate(
                    (el) => el.textContent,
                    submitButton,
                );
                if (buttonText && buttonText.includes('ตีเลข')) {
                    await submitButton.click();
                    this.logger.log('Clicked "ตีเลข" button');
                }
            }

            // รอให้เว็บคำนวณเสร็จ (รอจนกว่าจะเห็นผลลัพธ์)
            await this.waitForCalculationComplete();

            // หาและกดปุ่ม "กลับไปกรอกความฝันอื่น"
            await this.clickBackButton();
        } catch (error) {
            this.logger.error('Error in single cycle:', error);
            throw error;
        }
    }

    private async waitForCalculationComplete(): Promise<void> {
        try {
            this.logger.log('Waiting for calculation to complete...');

            // รอให้ผลลัพธ์ปรากฏ หรือรอจนกว่าจะเห็นปุ่ม "กลับไปกรอกความฝันอื่น"
            await this.page.waitForFunction(
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

            this.logger.log('Calculation completed');
            await this.sleep(2000); // รอให้แน่ใจว่าหน้าโหลดเสร็จสมบูรณ์
        } catch (error) {
            this.logger.error('Timeout waiting for calculation:', error);
            // ลองรีเฟรชหน้าถ้าเกิดปัญหา
            await this.page.reload({ waitUntil: 'networkidle2' });
        }
    }

    private async clickBackButton(): Promise<void> {
        try {
            // หาปุ่ม "กลับไปกรอกความฝันอื่น" (ทั้ง button และ a tag)
            const backButtonClicked = await this.page.evaluate(() => {
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
                this.logger.log('Clicked back button');

                // รอให้กลับไปหน้าแรก
                await this.page.waitForSelector('textarea', { timeout: 10000 });
                await this.sleep(1000);
            } else {
                this.logger.warn('Back button not found, refreshing page');
                await this.page.reload({ waitUntil: 'networkidle2' });
            }
        } catch (error) {
            this.logger.error('Error clicking back button:', error);
            // ถ้าไม่เจอปุ่มกลับ ให้รีเฟรชหน้า
            await this.page.reload({ waitUntil: 'networkidle2' });
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
        return {
            isRunning: this.isRunning,
            currentCycle: this.currentCycle > 0 ? this.currentCycle : undefined,
            totalCycles: this.totalCycles > 0 ? this.totalCycles : undefined,
        };
    }
}
