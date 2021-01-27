// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  // gql,
  ApolloProvider,
} from "@apollo/client";
import { ExchangeRates } from "./Rates";
import ReactDOM from "react-dom";
import "./index.css";
// import App from "./App";

// import reportWebVitals from "./reportWebVitals";

const client = new ApolloClient({
  // uri: "https://2k3ng5u364.execute-api.us-east-1.amazonaws.com/dev/graphql",
  //comment
  uri: "/.netlify/functions/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <ExchangeRates />
      </div>
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
