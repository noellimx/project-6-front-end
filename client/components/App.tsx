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
type MockWebSocket = {
  send: (_: string) => void;
  onconnect: (fn: OnConnectionCallback) => void;
};

type OnConnectionCallback = () => void;

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const getToken =  () => {
  return getCookie("Token") || ""
}

const newMockWS = (address): MockWebSocket => {
  console.log(`[MOCK] NOT CONNECT TO ADDRESS : ${address}`);

  const onConnectionFnList: OnConnectionCallback[] = [];

  let isConnected = false;

  const TIME_TO_CONNECT_FAKE_MS = 500;

  setTimeout(() => {
    console.log(`[MOCK] websocket established`);
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
    const _socket = newMockWS("mockhost:65336");
    _socket.onconnect(() => {
      setSocket(_socket);
    });
  }, []);

  return (
    <>
      {token === "" ? (
        <Signin />
      ) : (
        <>
        
          <MyNavbar setTicker={setTicker} />
          <div className="div-container">
          
          <TradingViewWidget
            symbol={ticker}
            theme="Dark"
            hide_side_toolbar={false}
            allow_symbol_change={false}
            />
            
          
              <Oldchat token={token} ticker={ticker} socket={socket}/> 
          
          <div className ="div-element2">
          <Rss/>    
          </div>
          </div>  
        </>
      )}
    </>
  );
};

export default App;
