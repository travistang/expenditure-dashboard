import React from "react";
import { faMoneyBill, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@apollo/client";
import { Budget } from "@prisma/client";

import { BUDGET_LIST_QUERY } from "../../queries/budgets";

import LoadingSpinnerCover from "../../components/LoadingSpinnerCover";
import CenterNotice from "../../components/CenterNotice";
import BudgetList from "../../components/Budgets/BudgetList";
import BudgetModal from "../../components/Budgets/BudgetModal";

type QueryResultType = {
  budgets: Budget[];
  aggregateBudgets: {
    _count: { _all: number };
    _sum: { amount: number };
    _avg: { amount: number };
    _min: { amount: number };
    _max: { amount: number };
  };
};

export default function BudgetsPage() {
  const [addingBudget, setIsAddingBudget] = React.useState(false);
  const { data, loading, refetch } = useQuery<QueryResultType>(
    BUDGET_LIST_QUERY,
    {
      variables: {},
    }
  );

  const noData = !loading && data?.budgets.length === 0;
  const onNewBudgetCreated = () => {
    refetch();
    setIsAddingBudget(false);
  };
  return (
    <div className="flex flex-col h-full gap-4 items-stretch">
      {addingBudget && (
        <BudgetModal
          onCreate={onNewBudgetCreated}
          onClose={() => setIsAddingBudget(false)}
        />
      )}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setIsAddingBudget(true)}
          type="button"
          className="btn btn-primary flex gap-1"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Create budget
        </button>
      </div>
      <div className="relative flex rounded-2xl flex-1 bg-base-100 overflow-y-auto p-4">
        {loading && <LoadingSpinnerCover dimBackground />}
        {noData ? (
          <CenterNotice
            title="No budgets found"
            icon={faMoneyBill}
            subtitle={`Click "Create budget" above to add a budget`}
          />
        ) : (
          <BudgetList budgets={data?.budgets ?? []} />
        )}
      </div>
    </div>
  );
}
