import type { NextPage } from "next";
import Dashboard from "../components/Dashboard";

const Main: NextPage = () => {
  return (
    <div className="h-full overflow-y-auto">
      <Dashboard />
    </div>
  );
};

export default Main;
