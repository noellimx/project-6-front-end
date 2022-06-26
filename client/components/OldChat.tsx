import * as React from "react";
import { useState, useEffect } from "react";
import * as ScrollToBottom from "react-scroll-to-bottom";
import "./App.css";

import { MAny } from "../utils/my-types";

import { sendMessageToTickerRoom } from "./App";
type ChatProps = {
  socket: MAny | WebSocket;
  ticker: string;
  token: string;
};

type Message = {
  author: string;
  message: string;
  time: string;
};

const ChatHeader = () => {
  return (
    <div className="chat-header">
      <p>Live Chat</p>
    </div>
  );
};

const ChatBody: React.FC<{ messageList: Message[] }> = ({ messageList }) => {
  return (
    <div className="chat-body">
      <ScrollToBottom.default className={"message-container"}>
        {messageList.map((messageContent: Message) => {
          return (
            <div className="message">
              <div>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
              </div>
              <div className="message-meta">
                <p id="time">{messageContent.time}</p>
                <p id="author">{messageContent.author}</p>
              </div>
            </div>
          );
        })}
      </ScrollToBottom.default>
    </div>
  );
};

const sendMessage = async (
  socket: WebSocket,
  roomId: string,
  token: string,
  message: string
) => {
  const data = { token, message, roomId };
  sendMessageToTickerRoom(socket, data);
};

const ChatFooter = ({ socket, ticker, token }) => {
  const roomId = ticker;

  const [textField, setTextField] = useState<string>("");

  const sendThisMessage = () => {
    console.log(`[sendThisMessage]`)
    sendMessage(socket, roomId, token, textField)


  };
  return (
    <div className="chat-footer">
      <input
        type="text"
        value={textField}
        placeholder="Send a message..."
        onChange={(event) => {
          setTextField(event.target.value);
        }}
        onKeyPress={async (event) => event.key === "Enter" && sendThisMessage()}
      />
      <button onClick={sendThisMessage}>&#9658;</button>
    </div>
  );
};

const Chat: React.FC<ChatProps> = ({ socket, ticker, token }) => {
  const [messageList, setMessageList] = useState<Message[]>([]);

  useEffect(() => {
    socket &&
      socket.on("receive_message", (data: MAny) => {
        setMessageList((list: MAny) => [...list, data]);
      });

    return;
  }, []);

  return (
    <div className="chat-window">
      <ChatHeader />
      <ChatBody messageList={messageList} />
      <ChatFooter socket={socket} ticker={ticker} token={token} />
    </div>
  );
};

export default Chat;
