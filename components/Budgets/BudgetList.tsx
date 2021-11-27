import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Budget } from "@prisma/client";

type Props = {
  budgets: Budget[];
};

export default function BudgetList({ budgets }: Props) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <table className="table w-full table-compact">
        <thead>
          <tr>
            <th className="sticky top-0 z-0">Name</th>
            <th className="sticky top-0 z-0">amount</th>
            <th className="sticky top-0 z-0">including labels</th>
            <th className="sticky top-0 z-0">excluding labels</th>
            <th className="sticky top-0 z-0" />
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {budgets.map((budget) => (
            <tr
              onClick={console.log}
              key={budget.id}
              className="cursor-pointer hover:bg-primary-focus"
            >
              <td>{budget.name}</td>
              <td>{budget.amount.toFixed(2)}€</td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {Array.from(budget.includedLabels)
                    .sort()
                    .map((label) => (
                      <span key={label} className="badge badge-primary">
                        {label}
                      </span>
                    ))}
                </div>
              </td>
              <td>
                <div className="flex flex-wrap gap-1">
                  {Array.from(budget.excludedLabels)
                    .sort()
                    .map((label) => (
                      <span key={label} className="badge badge-error">
                        {label}
                      </span>
                    ))}
                </div>
              </td>

              <td>
                <FontAwesomeIcon icon={faEllipsisV} className="w-2 h-4" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
