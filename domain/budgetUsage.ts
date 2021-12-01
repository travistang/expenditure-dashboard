import { Budget } from "@prisma/client";

export type BudgetWithUsage = Budget & { usage: number };
export const grossBudgetUsage = (budgets: BudgetWithUsage[]): number => {
  return budgets
    .filter((budget) => budget.isGrossBudget)
    .reduce((sum, budget) => sum + budget.usage, 0);
};
export const grossBudgetLimit = (budgets: BudgetWithUsage[]): number => {
  return budgets
    .filter((budget) => budget.isGrossBudget)
    .reduce((sum, budget) => sum + budget.amount, 0);
};

export const budgetUsagePercentage = (
  budget: BudgetWithUsage,
  timesHundred = false
): number => {
  const ratio = budget.amount / (budget.usage || 1);
  return timesHundred ? ratio * 100 : ratio;
};
