import './index.scss';

import * as serviceWorker from './serviceWorker';

import { CssBaseline, StylesProvider } from "@material-ui/core";

import App from './App';
import { MaterialThemeProvider } from "./components/MaterialTheme/MaterialTheme";
import { Provider } from "react-redux";
import React from 'react';
import ReactDOM from 'react-dom';
import { store } from "./store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <StylesProvider injectFirst>
        <MaterialThemeProvider>
          <CssBaseline>
            <App />
          </CssBaseline>
        </MaterialThemeProvider>
      </StylesProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
