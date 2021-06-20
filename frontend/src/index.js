import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Route, Link, Switch } from 'react-router-dom';

import App from './App.js';
import client, { ApolloProvider } from './hooks/appolloClient.js'

import './index.css';

ReactDOM.render(
    <ApolloProvider client={client}>
        <HashRouter>
            <Route path="/" component={App}>
            </Route>
        </HashRouter>
    <App />
</ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();