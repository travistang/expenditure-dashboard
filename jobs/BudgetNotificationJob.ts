import { Budget } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import TelegramService from "../backend/domain/TelegramService";
import TimedRecordService from "../backend/domain/TimedRecordService";
import logger from "../logger";
import { ExpenditureRecordWhereInput } from "../prisma/generated/type-graphql";
import { yyyyMMdd, yyyyMMddHHmmss } from "../utils/dates";
import AbstractJob, { AbstractJobInitConfig } from "./AbstractJob";

type BudgetNotificationJobConfig = AbstractJobInitConfig & {
  notificationLevel: number;
};

export default class BudgetNotificationJob extends AbstractJob {
  notificationLevel: number;
  timedRecords = new TimedRecordService();

  constructor(config: BudgetNotificationJobConfig) {
    super(config);
    logger.info("Starting Budget notification job");
    this.notificationLevel = config.notificationLevel;
    TelegramService.register(
      "/budget_status",
      async (args: { date?: string }) => {
        logger.info("Running /budget_status callback");
        const date = args.date ? new Date(args.date).getTime() : Date.now();
        const budgets = await this.prisma.budget.findMany({});
        TelegramService.asTyping();
        const budgetUsageMap = await Promise.all(
          budgets.map(async (budget) => {
            const usage = await this.computeBudgetUsage(budget, date);
            return `${budget.name}: ${(usage * 100).toFixed(2)}%`;
          })
        );
        TelegramService.sendMessage(
          `Your budget's status: \n ${budgetUsageMap.join("\n\n")}`
        );
      }
    );
  }

  async computeBudgetUsage(budget: Budget, date = Date.now()): Promise<number> {
    logger.info(`Computing budget "${budget.name}" on ${yyyyMMdd(date)}`);
    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);
    const recordQueryParams: ExpenditureRecordWhereInput = {
      AND: [
        {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        {
          labels: {
            [budget.matchAllLabels ? "hasEvery" : "hasSome"]:
              budget.includedLabels,
          },
        },
        {
          NOT: [
            {
              labels: { hasSome: budget.excludedLabels },
            },
          ],
        },
      ],
    };
    const recordsSum = await this.prisma.expenditureRecord.aggregate({
      where: recordQueryParams,
      _sum: {
        amount: true,
      },
    });
    const usage = recordsSum._sum.amount / budget.amount;
    return usage;
  }

  async run() {
    const now = Date.now();
    logger.info(`Running notification job at ${yyyyMMddHHmmss(now)}`);
    const budgets = await this.prisma.budget.findMany({});
    budgets.forEach(async (budget) => {
      const usage = await this.computeBudgetUsage(budget);
      if (
        usage >= this.notificationLevel &&
        this.timedRecords.inquire(budget.name, 60 * 24)
      ) {
        const message = `Budget "${
          budget.name
        }" has reached notification level (${
          this.notificationLevel * 100
        }%) (Usage is at ${(usage * 100).toFixed(2)}%).`;
        logger.info(`Sending message from notification job: ${message}`);
        TelegramService.sendMessage(message);
      }
    });
  }
}
