import { faCheck, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Budget } from "@prisma/client";
import { useRouter } from "next/router";

type Props = {
  budgets: Budget[];
};

export default function BudgetList({ budgets }: Props) {
  const router = useRouter();
  const goToBudgetDetailPage = (id: string) => () =>
    router.push(`/budgets/${id}`);
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      <table className="table w-full table-compact">
        <thead>
          <tr>
            <th className="sticky top-0 z-0">Name</th>
            <th className="sticky top-0 z-0">amount</th>
            <th className="sticky top-0 z-0">Gross budget</th>
            <th className="sticky top-0 z-0">Match every labels</th>
            <th className="sticky top-0 z-0">including labels</th>
            <th className="sticky top-0 z-0">excluding labels</th>
            <th className="sticky top-0 z-0" />
          </tr>
        </thead>
        <tbody className="overflow-y-auto">
          {budgets.map((budget) => (
            <tr
              onClick={goToBudgetDetailPage(budget.id)}
              key={budget.id}
              className="cursor-pointer hover:bg-primary-focus"
            >
              <td>{budget.name}</td>
              <td>{budget.amount.toFixed(2)}€</td>
              <td className="text-center">
                {budget.isGrossBudget && (
                  <div className="w-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                  </div>
                )}
              </td>
              <td className="text-center">
                {budget.matchAllLabels && (
                  <div className="w-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faCheck} className="w-4 h-4" />
                  </div>
                )}
              </td>
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
