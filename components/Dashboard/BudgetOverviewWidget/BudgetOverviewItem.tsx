import React from "react";
import classnames from "classnames";
import {
  budgetUsagePercentage,
  BudgetWithUsage,
} from "../../../domain/budgetUsage";

type Props = {
  budget: BudgetWithUsage;
};
export default function BudgetOverviewItem({ budget }: Props) {
  const usage = budgetUsagePercentage(budget, true);
  const overBudget = usage >= 100;
  return (
    <div
      key={budget.id}
      className={classnames("col-span-6 sm:col-span-4 border-base-200")}
    >
      <div className="stat-title">{budget.name}</div>
      <div
        className={classnames(
          "stat-value text-md",
          overBudget && "font-bold text-error"
        )}
      >
        {usage.toFixed(2)}%
      </div>
    </div>
  );
}
