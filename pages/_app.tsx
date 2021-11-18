import "reflect-metadata";

import type { AppProps } from "next/app";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import React from "react";
import Head from "next/head";
import NavigationPanel from "../components/NavigationPanel";

import "../styles/globals.css";
import ConfirmationModalContextProvider from "../contexts/ConfirmationModalContext";
import ConfirmationModal from "../components/ConfirmationModal";

const client = new ApolloClient({
  uri: "/graphql",
  cache: new InMemoryCache(),
});
function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>Expenditure Dashboard</title>
        <meta
          name="description"
          content="A dashboard that visualize expenditures you made"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmationModalContextProvider>
        <div className="fixed inset-0 flex flex-col sm:flex-row gap-2 p-4 items-stretch bg-base-200">
          <ConfirmationModal />
          <NavigationPanel />
          <main className="flex-1 overflow-hidden">
            <Component {...pageProps} />
          </main>
        </div>
      </ConfirmationModalContextProvider>
    </ApolloProvider>
  );
}
export default App;
