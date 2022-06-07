/** Imports [Data] */

import { configureStore, Store } from "@reduxjs/toolkit";

import io from "./connection/connection";
import newClient from "./orda";
import pipeSink from "./state/pipe-sink";

/** Imports [UI] */
import * as React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import App from "./components/App";
import theme from "./components/theme";
import { Provider } from "react-redux";
import { TheState } from "./utils/my-types";

/**
 * <----- Main ------>
 *
 * Initialize
 * 1) state
 * 2) state modifiers
 * 3) external data events handler
 */

// State Uplink To Server

// TODO: Complete type definition
const store: Store<TheState> = configureStore({
  reducer: pipeSink,
  preloadedState: { ping: 0 },
});

const client = newClient(io, store);

client.general.doYouAcknowledge(console.log);

// UI Injection
const rootHTMLElement: HTMLElement = document.createElement("div");
document.body.appendChild(rootHTMLElement);

const rootReactComponent = (
  <>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App client={client} />
      </ThemeProvider>
    </Provider>
  </>
);

const PAINT = (htmlEle: HTMLElement, rEle: JSX.Element) => {
  createRoot(htmlEle).render(rEle);
};

PAINT(rootHTMLElement, rootReactComponent);
