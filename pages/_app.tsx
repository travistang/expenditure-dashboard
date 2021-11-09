import "reflect-metadata";

import type { AppProps } from "next/app";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import React from "react";
import Head from "next/head";
import NavigationPanel from "../components/NavigationPanel";

import "../styles/globals.css";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});
function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
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
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
      </div>
    </ApolloProvider>
  );
}
export default App;
