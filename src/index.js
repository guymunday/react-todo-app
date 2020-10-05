import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
// data
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";

const client = new ApolloClient({
  uri: "https://frank-lemming-54.hasura.app/v1/graphql",
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <main style={{ minHeight: "100vh" }} className="bg-purple">
      <App />
    </main>
  </ApolloProvider>,
  document.getElementById("root")
);
