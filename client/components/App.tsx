import * as React from "react";

import { useSelector } from "react-redux";

import { TheState, AuthenticationStatus, Client } from "../utils/my-types";
import LoggedIn from "./pages/LoggedIn";
import NotLoggedIn from "./pages/NotLoggedIn";
import { Grid } from "@mui/material";

import MyNavbar from "./Navbar";
import * as TVW from "react-tradingview-widget";
import Oldchat from "./OldChat";
import Signin from "./Signin";
import Rss from "./Rss";

import config from "../config";

type MockWebSocket = {
  send: (_: string) => void;
  onopen: (fn: onopenionCallback) => void;
};

const foo = (): void => {}; // return void
const bar = (): null => null; // return null
const baz = (): undefined => undefined; // return defined

type onopenionCallback = () => void;

type SendMessageToTickerRoom = (
  s: WebSocket | MockWebSocket,
  data: { roomId: string; token: string; message: string }
) => Promise<void>;

export const sendMessageToTickerRoom: SendMessageToTickerRoom = async (
  socket,
  { token, message, roomId }
) => {

  console.log(`[sendMessageToTickerRoom] ` , {token, message,roomId})
  const event = "send-to-ticker-room";
  const data = { token, message, roomId, event };
  socket.send(JSON.stringify(data));
};

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

const getToken = () => {
  return getCookie("Token") || "";
};

const newMockWS = (address): MockWebSocket => {
  console.log(`[MOCK] NOT CONNECT TO ADDRESS : ${address}`);

  let onopen = () => {};

  let isConnected = false;

  const TIME_TO_CONNECT_FAKE_MS = 500;

  setTimeout(() => {
    console.log(`[MOCK] websocket established`);
    isConnected = true;
    onopen();
  }, TIME_TO_CONNECT_FAKE_MS);

  const send = async (data: string) => {
    if (isConnected) {
      console.log(`[MOCK] data to be sent : ${data} <NO DATA IS ACTUALLY SENT`);
    } else {
      new Error(
        `Although this is a mock, a mock connection should be established before sending data`
      );
    }
  };

  return {
    send,

    onopen,
  };
};

const A_DEFINITELY_INSECURE_TOKEN = "";
interface AppProps {}

const TradingViewWidget = TVW.default;

const App: React.FC<AppProps> = () => {
  const [ticker, setTicker] = React.useState<string>("NASDAQ:AAPL");

  const [socket, setSocket] = React.useState<WebSocket | MockWebSocket | null>(
    null
  );

  const [token, setToken] = React.useState<string>(getToken());

  React.useEffect(() => {
    const _socket =
      config.env === "production"
        ? new WebSocket("wss://" + config.wsserver)
        : newMockWS("wss://mockhost:65336");
    // const _socket = config.env === "production" ? new WebSocket(config.wsserver) : config.env === "test" ?  newMockWS("mockhost:65336") : null);

    if (_socket === null) {
      throw new Error(
        `Socket inialization does not support environment ${config.env}`
      );
    } else {
      _socket.onopen = () => {
        setSocket(_socket);
      };
    }

    return () => {};
  }, []);

  return (
    <>
      {token === "" ? (
        <Signin />
      ) : (
        <>
          <MyNavbar setTicker={setTicker} />
          <TradingViewWidget
            symbol={ticker}
            theme="Dark"
            hide_side_toolbar={false}
            allow_symbol_change={false}
          />
          <Oldchat token={token} ticker={ticker} socket={socket} /> <Rss />
        </>
      )}
    </>
  );
};

export default App;
