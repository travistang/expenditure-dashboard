import { gql } from "@apollo/client";

export const EXPENDITURE_OF_MONTH = gql`
  query expenditureRecordOfTheMonth(
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    expenditureRecords(where: { date: { gte: $startDate, lte: $endDate } }) {
      id
      date
      recordedAt
      description
      labels
      amount
    }
  }
`;

export const CREATE_EXPENDITURE_RECORD = gql`
  mutation ($data: ExpenditureRecordCreateInput!) {
    createExpenditureRecord(data: $data) {
      id
    }
  }
`;

export const UPDATE_EXPENDITURE_RECORD = gql`
  mutation (
    $data: ExpenditureRecordUpdateInput!
    $where: ExpenditureRecordWhereUniqueInput!
  ) {
    updateExpenditureRecord(data: $data, where: $where) {
      id
    }
  }
`;

export const DELETE_EXPENDITURE_RECORD = gql`
  mutation ($where: ExpenditureRecordWhereUniqueInput!) {
    deleteExpenditureRecord(where: $where) {
      id
    }
  }
`;
