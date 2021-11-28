export enum BudgetUsageLevel {
  NORMAL,
  WARNING,
  OVER_BUDGET,
}

export type Colors = {
  background: string;
  text: string;
};

export const getBudgetUsageLevel = (percentage: number): BudgetUsageLevel => {
  if (percentage < 0.75) return BudgetUsageLevel.NORMAL;
  if (percentage < 1) return BudgetUsageLevel.WARNING;
  return BudgetUsageLevel.OVER_BUDGET;
};

export const BudgetUsageColor: Record<BudgetUsageLevel, Colors> = {
  [BudgetUsageLevel.NORMAL]: {
    background: "bg-primary",
    text: "text-primary",
  },
  [BudgetUsageLevel.WARNING]: {
    background: "bg-warning",
    text: "text-warning",
  },
  [BudgetUsageLevel.OVER_BUDGET]: {
    background: "bg-error",
    text: "text-error",
  },
};
