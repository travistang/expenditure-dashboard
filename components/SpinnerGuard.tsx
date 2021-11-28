import classnames from "classnames";
import LoadingSpinnerCover from "./LoadingSpinnerCover";

type Props = {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
};
export default function SpinnerGuard({ className, loading, children }: Props) {
  if (loading) {
    return (
      <div className={classnames("relative", className)}>
        <LoadingSpinnerCover />
      </div>
    );
  }
  return <>{children}</>;
}
