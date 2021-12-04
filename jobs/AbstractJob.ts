import { PrismaClient } from "@prisma/client";
import logger from "../logger";

export type AbstractJobInitConfig = {
  interval: number;
  prisma: PrismaClient;
};

export default abstract class AbstractJob {
  interval: number;
  prisma: PrismaClient;
  timer: NodeJS.Timeout | null = null;

  constructor({ interval, prisma }: AbstractJobInitConfig) {
    this.interval = interval;
    this.prisma = prisma;
  }

  start(): void {
    if (!this.timer) {
      this.timer = setInterval(async () => {
        try {
          await this.run();
        } catch (e) {
          logger.error(`Error caught while running job: ${e.message}`);
        }
      }, this.interval);
    }
  }

  abstract run(): Promise<void>;

  get running(): boolean {
    return !!this.timer;
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
