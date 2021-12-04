import classnames from "classnames";
import {
  budgetUsagePercentage,
  BudgetWithUsage,
} from "../../domain/budgetUsage";

type Props = {
  budgets: BudgetWithUsage[];
};
export default function BudgetOverviewWidget({ budgets }: Props) {
  return (
    <div className="rounded-2xl col-span-full grid gap-0 grid-cols-12 stat min-h-16 ">
      <span className="col-span-full pb-4 stat-title">Budget Overview</span>
      {budgets.map((budget) => (
        <div
          key={budget.id}
          className="col-span-6 sm:col-span-4 pb-4 border-base-200"
        >
          <div className="stat-title">{budget.name}</div>
          <div className={classnames("stat-value text-md")}>
            {budgetUsagePercentage(budget, true).toFixed(2)}%
          </div>
        </div>
      ))}
    </div>
  );
}
