import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

const httpLink = new HttpLink({
  uri: "http://localhost:8000/graphql", // Your GraphQL server URL
});

const authLink = setContext((_, { headers }) => {
  // Retrieve the token from localStorage or any other secure storage

  // Return the headers to the context, including the authorization token
  return {
    headers: {
      ...headers,
      authorization: `Bearer graphqlpractice`,
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  // uri:"http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
