import React, { useEffect, useState } from "react";
import classnames from "classnames";
import { useRouter } from "next/router";
import { useLazyQuery, useQuery } from "@apollo/client";
import { Budget } from "@prisma/client";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { endOfMonth, format, startOfMonth } from "date-fns";

import * as ExpenditureStatisticsDomain from "../../domain/expenditureStatistics";

import { ExpenditureRecord } from "../../prisma/generated/type-graphql";
import {
  GET_BUDGET_BY_ID,
  GET_RECORDS_UNDER_BUDGET,
} from "../../queries/budgets";
import BudgetSummary from "../../components/Budgets/BudgetDetails/BudgetSummary";
import LoadingSpinnerCover from "../../components/LoadingSpinnerCover";
import BudgetStats from "../../components/Budgets/BudgetDetails/BudgetStats";
import AccumulatedChart from "../../components/Budgets/BudgetDetails/AccumulatedChart";
import InputBase from "../../components/Form/Input";
import { BudgetUsageColor, getBudgetUsageLevel } from "../../constants/budgets";
import BudgetRecordsList from "../../components/Budgets/BudgetDetails/BudgetRecordsList";
import LabelDistribution from "../../components/Budgets/BudgetDetails/LabelDistribution";
import BudgetModal from "../../components/Budgets/BudgetModal";

type BudgetResponse = {
  budget: Budget;
};

type RecordsResponse = {
  expenditureRecords: ExpenditureRecord[];
};
export default function BudgetDetailPage() {
  const { query, push } = useRouter();

  const [searchDate, setSearchDate] = useState(new Date());
  const fromDate = startOfMonth(searchDate);
  const toDate = endOfMonth(searchDate);

  const [updatingBudget, setUpdatingBudget] = useState(false);

  const {
    data,
    loading,
    refetch: refetchBudget,
  } = useQuery<BudgetResponse>(GET_BUDGET_BY_ID, {
    variables: { id: query.id },
  });
  const [
    fetchRecords,
    { data: recordsData, loading: loadingRecords, refetch: refetchRecords },
  ] = useLazyQuery<RecordsResponse>(GET_RECORDS_UNDER_BUDGET);

  const records = recordsData?.expenditureRecords ?? [];

  const budgetSum = ExpenditureStatisticsDomain.total(
    recordsData?.expenditureRecords ?? []
  );
  const percentage = budgetSum / data?.budget.amount ?? 0;
  const budgetUsageStatus = getBudgetUsageLevel(percentage);
  const backgroundColor = BudgetUsageColor[budgetUsageStatus].background;

  const onUpdateBudget = () => {
    setUpdatingBudget(false);
    refetchBudget();
  };

  useEffect(() => {
    if (data?.budget) {
      fetchRecords({
        variables: {
          startDate: fromDate,
          endDate: toDate,
          includedLabels: data.budget.includedLabels,
          excludedLabels: data.budget.excludedLabels,
        },
      });
    }
  }, [data, searchDate]);

  return (
    <div className="relative auto-rows-min grid grid-cols-12 h-full gap-4 w-full overflow-y-auto">
      {loading && <LoadingSpinnerCover />}
      {updatingBudget && (
        <BudgetModal
          initialValue={data?.budget}
          onClose={() => setUpdatingBudget(false)}
          onMutate={onUpdateBudget}
        />
      )}
      <div className="sticky top-0 col-span-full grid grid-cols-12 items-end pb-2 z-10 bg-base-200">
        <button
          type="button"
          onClick={() => push("/budgets")}
          className="z-20 btn btn-ghost w-min h-min col-span-3 flex gap-1 px-1 flex-nowrap whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          Return to list
        </button>
        <InputBase
          name="date"
          label=""
          type="month"
          className="col-end-13 col-span-5 md:col-start-10 mr-2"
          value={format(searchDate, "yyyy-MM")}
          onChange={(e) => setSearchDate(new Date(e.target.value))}
        />
      </div>
      <BudgetSummary
        onEdit={() => setUpdatingBudget(true)}
        className="col-start-1 col-span-full md:col-end-6 justify-between"
        loading={loading}
        budget={data?.budget}
        records={records}
      />
      <BudgetStats
        className={classnames(
          "col-span-full col-end-13 md:col-start-6",
          !(loading && loadingRecords) && backgroundColor
        )}
        loading={loading || loadingRecords}
        budgetAmount={data?.budget?.amount ?? 0}
        sum={budgetSum}
        records={records}
      />
      <AccumulatedChart
        className="col-span-full h-96"
        budgetAmount={data?.budget?.amount ?? 0}
        loading={loading || loadingRecords}
        fromDate={fromDate}
        toDate={toDate}
        records={records}
      />
      <BudgetRecordsList
        className="col-span-full md:col-span-6 max-h-72"
        loading={loading || loadingRecords}
        records={records}
        refetch={refetchRecords}
      />
      <LabelDistribution
        className="col-span-full md:col-span-6 max-h-72"
        loading={loading || loadingRecords}
        records={records}
        includedBudgetLabels={data?.budget.includedLabels ?? []}
      />
    </div>
  );
}
