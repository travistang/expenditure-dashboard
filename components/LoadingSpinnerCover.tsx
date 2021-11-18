import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import classnames from "classnames";

type Props = {
  className?: string;
  dimBackground?: boolean;
};
export default function LoadingSpinnerCover({
  dimBackground,
  className,
}: Props) {
  return (
    <div
      className={classnames(
        "absolute inset-0 flex items-center justify-center text-primary z-30",
        dimBackground && "bg-base-300 bg-opacity-50",
        className
      )}
    >
      <FontAwesomeIcon
        icon={faSpinner}
        className="animate-spin w-8 h-8 text-primary"
      />
    </div>
  );
}
