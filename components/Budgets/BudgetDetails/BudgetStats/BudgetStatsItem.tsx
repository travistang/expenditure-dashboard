type Props = {
  label: string;
  value: number;
  isMoney?: boolean;
};
export default function BudgetStatsItem({ label, value, isMoney }: Props) {
  const displayValue = isMoney ? value.toFixed(2) : value;
  return (
    <div className="p-2 flex flex-col">
      <span className="text-xs font-bold uppercase">{label}</span>
      <span className="text-xl font-bold">
        {displayValue}
        {isMoney && "€"}
      </span>
    </div>
  );
}
