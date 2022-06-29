import * as React from "react";

import MyNavbar from "./Navbar";
import * as TVW from "react-tradingview-widget";
import Chat from "./Chat";
import SignIn from "./SignIn";

import News from "./Newsloop";

import config from "../config";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";



type LikeButtonProps = {
  checked: boolean;
  onChangeFn: () => void;
}
const LikeButton:React.FC<LikeButtonProps> = ({checked,onChangeFn}) => {

  return (
    <div
      style={{
        margin: "auto",
        display: "block",
        width: "fit-content",
      }}
    >
      <FormControlLabel
        checked={checked}
        onChange={onChangeFn}
        control={
          <Checkbox
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            name="checkedH"
          />
        }
        label="Instagram Like Button"
      />
    </div>
  );
};

const wsServerAddressEndpoint = config.wsserver;

type MockWebSocket = {
  send: (_: string) => void;
  onopen: (fn: OnConnectionCallback) => void;
};

type OnConnectionCallback = () => void;

type SendMessageToTickerRoom = (
  s: WebSocket | MockWebSocket,
  data: { roomId: string; token: string; message: string }
) => Promise<void>;

export const sendMessageToTickerRoom: SendMessageToTickerRoom = async (
  socket,
  { token, message, roomId }
) => {
  console.log(`[sendMessageToTickerRoom] `, { token, message, roomId });
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
  return getCookie("gm-token") || "";
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

    onopen: (cb) => {},
  };
};

interface AppProps {}

const TradingViewWidget = TVW.default;

const App: React.FC<AppProps> = () => {
  const [ticker, setTicker] = React.useState<string>("NASDAQ:AAPL");
  const [socket, setSocket] = React.useState<WebSocket | MockWebSocket | null>(
    null
  );

  const [token, _] = React.useState<string>(getToken());

  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  console.log(token);
  React.useEffect(() => {
    const _socket = true
      ? new WebSocket(`wss://${wsServerAddressEndpoint}`)
      : newMockWS("mockhost:65336");
    _socket.onopen = () => {
      setSocket(_socket);
    };
  }, []);


  const toggle = () => {
    setIsChecked(t=>!t)
  }

  return (
    <>
      {token === "" ? (
        <SignIn />
      ) : (
        <>
          <MyNavbar setTicker={setTicker} />
          <div>
            <div>
              {" "}
              <LikeButton checked={isChecked} onChangeFn={toggle} />
            </div>
            <div>
              <div className="div-container">
                <TradingViewWidget
                  symbol={ticker}
                  theme="Dark"
                  hide_side_toolbar={false}
                  allow_symbol_change={false}
                  autosize
                />

                {socket && (
                  <Chat token={token} ticker={ticker} socket={socket} />
                )}
              </div>
              <div className="newsLoop">
                <News />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default App;
