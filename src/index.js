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
    <main style={{ background: "purple", minHeight: "100vh" }}>
      <App />
    </main>
  </ApolloProvider>,
  document.getElementById("root")
);
