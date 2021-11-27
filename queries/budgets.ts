import { gql } from "@apollo/client";

export const BUDGET_LIST_QUERY = gql`
  query budgetList(
    $where: BudgetWhereInput
    $orderBy: [BudgetOrderByInput!]
    $take: Int
    $skip: Int
  ) {
    budgets(where: $where, orderBy: $orderBy, take: $take, skip: $skip) {
      id
      includedLabels
      excludedLabels
      amount
      name
    }
  }
`;

export const CREATE_BUDGET = gql`
  mutation ($data: BudgetCreateInput!) {
    createBudget(data: $data) {
      id
    }
  }
`;
