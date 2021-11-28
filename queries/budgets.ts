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
export const GET_RECORDS_UNDER_BUDGET = gql`
  query records(
    $startDate: DateTime!
    $endDate: DateTime!
    $includedLabels: [String!]!
    $excludedLabels: [String!]!
  ) {
    expenditureRecords(
      where: {
        AND: [
          { date: { gte: $startDate, lte: $endDate } }
          { labels: { hasSome: $includedLabels } }
          { NOT: [{ labels: { hasSome: $excludedLabels } }] }
        ]
      }
    ) {
      id
      description
      date
      labels
      amount
    }
  }
`;
export const GET_BUDGET_BY_ID = gql`
  query budgetList($id: String!) {
    budget(where: { id: $id }) {
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

export const UPDATE_BUDGET = gql`
  mutation ($data: BudgetUpdateInput!, $where: BudgetWhereUniqueInput!) {
    updateBudget(data: $data, where: $where) {
      id
    }
  }
`;
