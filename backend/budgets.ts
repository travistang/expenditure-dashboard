import { PrismaClient } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import { Arg, Ctx, FieldResolver, Float, Resolver, Root } from "type-graphql";
import { total } from "../domain/expenditureStatistics";
import { Budget } from "../prisma/generated/type-graphql";

@Resolver((of) => Budget)
export class CustomBudgetResolver {
  @FieldResolver((returns) => Float)
  async usage(
    @Root() budget: Budget,
    @Ctx() { prisma }: { prisma: PrismaClient },
    @Arg("date", { nullable: true }) date?: Date
  ): Promise<number | null> {
    const usingDate = date ?? new Date();
    const startDate = startOfMonth(usingDate);
    const endDate = endOfMonth(usingDate);
    const records = await prisma.expenditureRecord.findMany({
      where: {
        AND: [
          { date: { gte: startDate, lte: endDate } },
          { labels: { hasSome: budget.includedLabels } },
          { NOT: [{ labels: { hasSome: budget.excludedLabels } }] },
        ],
      },
    });
    return total(records);
  }
}
