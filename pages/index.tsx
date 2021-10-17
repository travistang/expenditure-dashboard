import "reflect-metadata";
import type { NextPage } from "next";
import Head from "next/head";

import NavigationPanel from "../components/NavigationPanel";

const Home: NextPage = () => {
  return (
    <div className="fixed inset-0 flex gap-2 p-4 items-stretch bg-base-200">
      <Head>
        <title>Expenditure Dashboard</title>
        <meta
          name="description"
          content="A dashboard that visualize expenditures you made"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavigationPanel />
      <main className="flex-1">content</main>
    </div>
  );
};

export default Home;
