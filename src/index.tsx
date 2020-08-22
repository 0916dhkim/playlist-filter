import './index.scss';

import * as serviceWorker from './serviceWorker';

import App from './App';
import { Provider } from "react-redux";
import React from 'react';
import ReactDOM from 'react-dom';
import { StylesProvider } from "@material-ui/core";
import { store } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <StylesProvider injectFirst>
        <App />
      </StylesProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
