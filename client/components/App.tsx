import * as React from "react";

import { useSelector } from "react-redux";

import { TheState, AuthenticationStatus, Client } from "../utils/my-types";
import LoggedIn from "./pages/LoggedIn";
import NotLoggedIn from "./pages/NotLoggedIn";
import { Grid } from "@mui/material";

import MyNavbar from "./Navbar";
import * as TVW from "react-tradingview-widget";
import Oldchat from "./OldChat";

type MockWebSocket = {
  send: (_: string) => void;
  onconnect: (fn: OnConnectionCallback) => void;
};

type OnConnectionCallback = () => void;

const newMockWS = (address): MockWebSocket => {
  console.log(`[MOCK] NOT CONNECT TO ADDRESS : ${address}`);

  const onConnectionFnList: OnConnectionCallback[] = [];

  let isConnected = false;

  const TIME_TO_CONNECT_FAKE_MS = 500;

  setTimeout(() => {

    console.log(`[MOCK] websocket established`)
    isConnected = true;
    for (const cb of onConnectionFnList) {
      cb();
    }
  }, TIME_TO_CONNECT_FAKE_MS);

  return {
    send: async (data: string) => {
      if (isConnected) {
        console.log(
          `[MOCK] data to be sent : ${data} <NO DATA IS ACTUALLY SENT`
        );
      } else {
        new Error(
          `Although this is a mock, a mock connection should be established before sending data`
        );
      }
    },

    onconnect: (cb) => {
      onConnectionFnList.push(cb);
    },
  };
};


interface AppProps {}

const TradingViewWidget = TVW.default;

const App: React.FC<AppProps> = () => {
  const [ticker, setTicker] = React.useState<string>("NASDAQ:AAPL");

  const [socket, setSocket] = React.useState<WebSocket | MockWebSocket | null>(
    null
  );

  React.useEffect(() => {
    const _socket = newMockWS("mockhost:65336");
    _socket.onconnect(() => {
      setSocket(_socket);
    })
  }, []);

  return (
    <>
      <MyNavbar setTicker={setTicker} />
      <TradingViewWidget
        symbol={ticker}
        theme="Dark"
        hide_side_toolbar={false}
        allow_symbol_change={false}
      />
      <Oldchat token={""} ticker={ticker} socket={socket} />
    </>
  );
};

export default App;
