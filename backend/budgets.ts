import { Currency, PrismaClient } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import { Arg, Ctx, FieldResolver, Float, Resolver, Root } from "type-graphql";
import { total } from "../domain/expenditureStatistics";
import { Budget, ExpenditureRecord } from "../prisma/generated/type-graphql";

@Resolver((of) => Budget)
export class CustomBudgetResolver {
  @FieldResolver((returns) => [ExpenditureRecord])
  async records(
    @Root() budget: Budget,
    @Ctx() { prisma }: { prisma: PrismaClient },
    @Arg("date", { nullable: true }) date?: Date
  ): Promise<ExpenditureRecord[]> {
    const usingDate = date ?? new Date();
    const startDate = startOfMonth(usingDate);
    const endDate = endOfMonth(usingDate);
    const records = await prisma.expenditureRecord.findMany({
      where: {
        AND: [
          { date: { gte: startDate, lte: endDate } },
          {
            labels: {
              [budget.matchAllLabels ? "hasEvery" : "hasSome"]:
                budget.includedLabels,
            },
          },
          { NOT: [{ labels: { hasSome: budget.excludedLabels } }] },
        ],
      },
    });
    return records;
  }
  @FieldResolver((returns) => Float)
  async usage(
    @Root() budget: Budget,
    @Ctx() { prisma }: { prisma: PrismaClient },
    @Arg("date", { nullable: true }) date?: Date
  ): Promise<number | null> {
    const recordsUnderLabel = await this.records(budget, { prisma }, date);
    return total(
      recordsUnderLabel.map((record) => ({
        ...record,
        currency: record.currency ?? ("EUR" as Currency),
        exchangeRate: record.exchangeRate ?? 1,
      }))
    );
  }
}
