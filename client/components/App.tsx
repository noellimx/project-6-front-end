import * as React from "react";

import { useSelector } from "react-redux";

import { TheState, AuthenticationStatus, Client } from "../utils/my-types";
import LoggedIn from "./pages/LoggedIn";
import NotLoggedIn from "./pages/NotLoggedIn";
import { Grid } from "@mui/material";

import MyNavbar from "./Navbar";
import * as TVW from "react-tradingview-widget";

interface AppProps {}

const TradingViewWidget = TVW.default;

const App: React.FC<AppProps> = () => {
  const [ticker, setTicker] = React.useState<string>("NASDAQ:AAPL");

  return (
    <>
      <MyNavbar setTicker={setTicker} />
      <TradingViewWidget
        symbol={ticker}
        theme="Dark"
        hide_side_toolbar={false}
        allow_symbol_change={false}
      />
    </>
  );
};

export default App;
