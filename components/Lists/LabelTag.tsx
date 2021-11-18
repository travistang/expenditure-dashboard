import React from "react";
import classnames from "classnames";

import { FilterValueReducerAction } from "../../utils/lists";
import { hasPhraseMatches } from "../../utils/strings";

type Props = {
  dispatchFilter: React.Dispatch<FilterValueReducerAction>;
  label: string;
  searchString: string;
};

export default function LabelTag({
  dispatchFilter,
  label,
  searchString,
}: Props) {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        dispatchFilter({
          type: "toggleLabel",
          payload: { search: label },
        });
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
