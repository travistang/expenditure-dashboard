import React from "react";
import classnames from "classnames";

import { hasPhraseMatches } from "../../utils/strings";

type Props = {
  onClick: () => void;
  label: string;
  searchString: string;
};

export default function LabelTag({ onClick, label, searchString }: Props) {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={classnames(
        "badge",
        hasPhraseMatches(searchString, label) && "badge-primary"
      )}
      key={label}
    >
      {label}
    </span>
  );
}
