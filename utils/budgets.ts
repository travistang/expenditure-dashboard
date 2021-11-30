import { FormikErrors } from "formik";
import { FormValueType } from "../constants/budgets";
import {
  BudgetCreateInput,
  BudgetUpdateInput,
} from "../prisma/generated/type-graphql";

export const validateForm = (
  pendingBudget: FormValueType
): FormikErrors<FormValueType> => {
  const { amount, name, includedLabels, excludedLabels } = pendingBudget;
  const errors: FormikErrors<FormValueType> = {};
  if (amount <= 0) {
    errors.amount = "Invalid amount";
  }
  if (!name) {
    errors.name = "Invalid budget name";
  }
  const allLabels = [...includedLabels, ...excludedLabels];
  if (allLabels.length === 0) {
    const errorMessage = "At least one of the labels have to be provided";
    errors.includedLabels = errorMessage;
    errors.excludedLabels = errorMessage;
  }
  if ([...new Set(allLabels)].length < allLabels.length) {
    const errorMessage = "Some inputs are repeated";
    errors.includedLabels = errorMessage;
    errors.excludedLabels = errorMessage;
  }
  return errors;
};

export const getCreateBudgetVariables = (
  values: FormValueType
): { data: BudgetCreateInput } => {
  return {
    data: {
      ...values,
      includedLabels: { set: values.includedLabels },
      excludedLabels: { set: values.excludedLabels },
    },
  };
};

export const getUpdateBudgetVariables = (
  values: FormValueType,
  id: string
): { data: BudgetUpdateInput; where: { id: string } } => {
  return {
    where: { id },
    data: {
      name: { set: values.name },
      amount: { set: values.amount },
      isGrossBudget: { set: values.isGrossBudget },
      matchAllLabels: { set: values.matchAllLabels },
      includedLabels: { set: values.includedLabels },
      excludedLabels: { set: values.excludedLabels },
    },
  };
};
