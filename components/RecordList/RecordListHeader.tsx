import classnames from "classnames";
type Props = {
  compact?: boolean;
  className?: string;
};
export default function RecordListHeader({ compact, className }: Props) {
  return (
    <thead>
      <tr>
        <th className={classnames("sticky z-0", className)}>Date</th>
        <th className={classnames("sticky z-0", className)}>Description</th>
        {!compact && (
          <th className={classnames("sticky z-0", className)}>Labels</th>
        )}
        <th className={classnames("sticky z-0", className)}>Expenditure</th>
        {!compact && <th className={classnames("sticky z-0", className)} />}
      </tr>
    </thead>
  );
}
