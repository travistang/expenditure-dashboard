import {
  faPen,
  faPlus,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { Budget } from "@prisma/client";

export enum BudgetUsageLevel {
  NORMAL,
  WARNING,
  OVER_BUDGET,
}

export type Colors = {
  background: string;
  text: string;
};

export type BudgetModalAssetTypes = {
  cta: string;
  ctaIcon: IconDefinition;
  header: string;
};
export enum BudgetModalMode {
  CREATING_BUDGET,
  UPDATING_BUDGET,
}
export type FormValueType = Omit<Budget, "id"> & { id?: string };

export const BudgetModalMap: Record<BudgetModalMode, BudgetModalAssetTypes> = {
  [BudgetModalMode.CREATING_BUDGET]: {
    cta: "Add Budget",
    ctaIcon: faPlus,
    header: "Create a new budget",
  },
  [BudgetModalMode.UPDATING_BUDGET]: {
    cta: "Update Budget",
    ctaIcon: faPen,
    header: "Update budget",
  },
};
export const getBudgetUsageLevel = (percentage: number): BudgetUsageLevel => {
  if (percentage < 0.75) return BudgetUsageLevel.NORMAL;
  if (percentage < 1) return BudgetUsageLevel.WARNING;
  return BudgetUsageLevel.OVER_BUDGET;
};

export const BudgetUsageColor: Record<BudgetUsageLevel, Colors> = {
  [BudgetUsageLevel.NORMAL]: {
    background: "bg-primary",
    text: "text-primary",
  },
  [BudgetUsageLevel.WARNING]: {
    background: "bg-warning",
    text: "text-warning",
  },
  [BudgetUsageLevel.OVER_BUDGET]: {
    background: "bg-error",
    text: "text-error",
  },
};

export const DEFAULT_FORM_VALUE: FormValueType = {
  amount: 0,
  name: "",
  includedLabels: [],
  excludedLabels: [],
};
