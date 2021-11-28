import React from "react";
import { faArrowLeft, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Budget, ExpenditureRecord } from "@prisma/client";
import withWidgetShell from "./WidgetShell";

type Props = {
  budget?: Budget;
  records?: ExpenditureRecord[];
};
function BudgetSummary({ budget }: Props) {
  return (
    <>
      <span className="stat-title">Budget Information</span>
      <div className="flex flex-col w-min">
        <div className="flex items-end gap-2">
          <h2 className="text-4xl">{budget.name}</h2>
          <button type="button" className="btn btn-circle btn-ghost btn-sm p-2">
            <FontAwesomeIcon icon={faPen} className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center border-base-100">
        <span className="text-6xl font-bold">{budget.amount}€</span>
      </div>
      <div className="flex gap-2">
        {budget.includedLabels?.length > 0 && (
          <div className="flex flex-1 flex-col gap-1">
            <span className="font-bold text-sm py-2">Including labels</span>
            <div className="flex gap-2 flex-wrap">
              {budget.includedLabels.map((label) => (
                <span key={label} className="badge badge-primary">
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
        {budget.excludedLabels?.length > 0 && (
          <div className="flex flex-1 flex-col gap-1">
            <span className="font-bold text-sm py-2">Excluding labels</span>
            <div className="flex gap-2 flex-wrap">
              {budget.excludedLabels.map((label) => (
                <span key={label} className="badge badge-error">
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default withWidgetShell(BudgetSummary);
