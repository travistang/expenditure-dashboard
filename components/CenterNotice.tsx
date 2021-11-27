import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";

type Props = {
  className?: string;
  title: string;
  subtitle?: string;
  icon?: IconDefinition;
};
export default function CenterNotice({
  className,
  title,
  subtitle,
  icon,
}: Props) {
  return (
    <div
      className={classnames(
        "flex flex-col absolute inset-0 items-center justify-center",
        className
      )}
    >
      {icon && <FontAwesomeIcon icon={icon} className="w-16 h-16" />}
      <span className="text-3xl font-bold">{title}</span>
      {subtitle && (
        <span className="text-sm font-bold uppercase">{subtitle}</span>
      )}
    </div>
  );
}
