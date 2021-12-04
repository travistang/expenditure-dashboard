import { PrismaClient } from "@prisma/client";
import AbstractJob from "./AbstractJob";
import BudgetNotificationJob from "./BudgetNotificationJob";

const initializeJobs = (prisma: PrismaClient): AbstractJob[] => [
  new BudgetNotificationJob({
    interval: 60 * 1000 * 60,
    prisma,
    notificationLevel: 0.75,
  }),
];

export default initializeJobs;
