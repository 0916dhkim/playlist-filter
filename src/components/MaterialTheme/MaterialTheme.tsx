import React, { ReactElement, ReactNode } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { green, orange } from "@material-ui/core/colors"

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: green[500]
    },
    secondary: {
      main: orange[500]
    }
  },
  transitions: {
    duration: {
      shortest: 0,
      shorter: 0,
      short: 0,
      standard: 0,
      complex: 0,
      enteringScreen: 0,
      leavingScreen: 0
    }
  }
});

export function MaterialThemeProvider(props: { children: ReactNode }): ReactElement {
  return (
    <ThemeProvider theme={theme}>
      {props.children}
    </ThemeProvider>
  );
}
