import { BudgetWithUsage } from "../../../domain/budgetUsage";
import BudgetOverviewItem from "./BudgetOverviewItem";

type Props = {
  budgets: BudgetWithUsage[];
};
export default function BudgetOverviewWidget({ budgets }: Props) {
  return (
    <div className="flex-shrink-0 rounded-2xl col-span-full grid gap-2 grid-cols-12 stat min-h-16">
      <span className="col-span-full pb-4 stat-title">Budget Overview</span>
      {budgets.map((budget) => (
        <BudgetOverviewItem key={budget.id} budget={budget} />
      ))}
    </div>
  );
}
