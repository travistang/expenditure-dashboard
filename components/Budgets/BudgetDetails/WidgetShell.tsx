import React from "react";
import classnames from "classnames";
import SpinnerGuard from "../../SpinnerGuard";
import LoadingSpinnerCover from "../../LoadingSpinnerCover";

export default function withWidgetShell<T>(Component: React.FC<T>) {
  const shellClassName = "relative stat flex flex-col rounded-2xl";
  return function WidgetShell({
    loading,
    className,
    ...props
  }: T & { loading: boolean; className?: string }) {
    return (
      <div className={classnames(shellClassName, className)}>
        {loading ? (
          <LoadingSpinnerCover />
        ) : (
          <Component {...(props as unknown as T)} />
        )}
      </div>
    );
  };
}
