import { ExpenditureRecord } from "@prisma/client";

export type LabelStatistics = {
  label: string;
  count: number;
  total: number;
  records: ExpenditureRecord[];
};
export type LabelStatisticsMap = {
  [label: string]: LabelStatistics;
};

export type LabelStatisticsEntry = [string, LabelStatistics];
export enum ComputeLabelStatisticsLabelType {
  NO_FILTER,
  GENERAL_LABELS,
  SPECIFIC_LABELS,
}
export type ComputeLabelStatisticsOption = {
  labelType: ComputeLabelStatisticsLabelType;
};

export const not =
  (fn) =>
  (...args) =>
    !fn(...args);
export const recordHasLabel = (label: string) => (record: ExpenditureRecord) =>
  record.labels.includes(label);

const isGeneralLabel = (
  labels: string[],
  label: string,
  records: ExpenditureRecord[]
) => {
  for (const otherLabel of labels) {
    if (otherLabel === label) continue;
    const recordsWithOtherLabel = records.filter(recordHasLabel(otherLabel));
    if (recordsWithOtherLabel.every(recordHasLabel(label))) {
      return true;
    }
  }
  return false;
};
const isSpecificLabel = not(isGeneralLabel);

export const computeLabelStatistics = (
  expenditureRecords: ExpenditureRecord[],
  { labelType }: ComputeLabelStatisticsOption = {
    labelType: ComputeLabelStatisticsLabelType.NO_FILTER,
  }
): LabelStatisticsMap => {
  const statisticsMap: LabelStatisticsMap = expenditureRecords.reduce(
    (stat, record) => {
      return record.labels.reduce((statWithLabels, label) => {
        return {
          ...statWithLabels,
          [label]: {
            label,
            count: (statWithLabels[label]?.count ?? 0) + 1,
            total: (statWithLabels[label]?.total ?? 0) + record.amount,
            records: [...(statWithLabels[label]?.records ?? []), record],
          },
        };
      }, stat);
    },
    {}
  );

  if (labelType === ComputeLabelStatisticsLabelType.NO_FILTER) {
    return statisticsMap;
  }

  const distinctLabels = Object.keys(statisticsMap);
  const filterFn =
    labelType === ComputeLabelStatisticsLabelType.GENERAL_LABELS
      ? isGeneralLabel
      : isSpecificLabel;
  const filteredEntries = Object.entries(statisticsMap).filter(([label]) =>
    filterFn(distinctLabels, label, expenditureRecords)
  );
  return Object.fromEntries(filteredEntries);
};

export const labelStatisticsSortedByMostExpenditure = (
  labelStatistics: LabelStatisticsMap
): LabelStatisticsEntry[] =>
  Object.entries(labelStatistics).sort(
    ([, statA], [, statB]) => statB.total - statA.total
  );
export const labelStatisticsWithMostExpenditure = (
  labelStatistics: LabelStatisticsMap
): LabelStatisticsEntry | null =>
  labelStatisticsSortedByMostExpenditure(labelStatistics)[0] ?? null;
