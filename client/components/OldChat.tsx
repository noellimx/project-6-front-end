import * as React from 'react';
import { useState, useEffect } from 'react';
import * as ScrollToBottom from 'react-scroll-to-bottom';
import './App.css';
import { Col, Row } from 'react-bootstrap';
import { MAny } from '../utils/my-types';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';

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

type JwtDecode = {
  username: string;
};

const ChatHeader = ({ ticker }) => {
  return (
    <div className="chat-header">
      <p>Live Chat {`${ticker}`}</p>
    </div>
  );
};

const ChatBody: React.FC<{ messageList: Message[] }> = ({ messageList }) => {
  return (
    <div className="chat-body">
      <ScrollToBottom.default className={'message-container'}>
        {messageList.map((messageContent: Message) => {
          return (
            <div className="message" key={`${messageContent.time}`}>
              <div>
                <Row className="message-content">
                  <Col className="col-8">
                    <Row>
                      <p className="message-username" id="author">
                        {messageContent.author}
                      </p>
                    </Row>
                    <Row>
                      <p className="message-content">
                        {messageContent.message}
                      </p>
                    </Row>
                  </Col>
                  <Col className="col-4 message-time-col align-self-end">
                    <Row>
                      <p className="message-time" id="time">
                        {moment(messageContent.time).format('LT')}
                      </p>
                    </Row>
                  </Col>
                </Row>
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
  message: string,
  username: string
) => {
  const time = moment();

  //send message to socket
  const data = {
    event: 'send-to-ticker-room',
    token,
    message,
    roomId,
    time,
    username,
  };
  socket.send(JSON.stringify(data));

  //todo, add chat to DB
};

const ChatFooter = ({ socket, ticker, token }) => {
  const roomId = ticker;

  const [textField, setTextField] = useState<string>('');

  const sendThisMessage = () => {
    console.log(`[sendThisMessage]`);
    const decodedJwt: JwtDecode = jwt_decode(token);
    const name = decodedJwt.username;
    console.log('getting username from sendThisMessage', name);
    sendMessage(socket, roomId, token, textField, name);
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
        onKeyPress={async (event) => event.key === 'Enter' && sendThisMessage()}
      />
      <button onClick={sendThisMessage}>&#9658;</button>
    </div>
  );
};

const Chat: React.FC<ChatProps> = ({ socket, ticker, token }) => {
  const [messageList, setMessageList] = useState<Message[]>([]);

  console.log(`Chat`);

  useEffect(() => {
    const data = { event: 'subsribe-to-ticker-room', token, roomId: ticker };
    console.log('sending to socket with event subsribe-to-ticker', data);
    socket.send(JSON.stringify(data));

    setMessageList([]);
    axios.get(`https://localhost:8080/history/${ticker}`).then((res) => {
      console.log('axios get chat all history');
      const result = res.data;
      const allMessage = result.map((x) => {
        const email = x.Username.split("@")
        const myMessage = {
          author: email[0],
          message: x.Message,
          time: x.Time,
        };
        return myMessage;
      });
      setMessageList(allMessage);
    });
  }, [ticker]);

  useEffect(() => {
    console.log('Chat use effect []');
    console.log(socket);

    const broadcastReceiver = async (event: MessageEvent) => {
      console.log(event);

      try {
        console.log(`[Socket Message Received]`);
        //converting blob to string, then string to obj
        const data = await event.data;
        console.log('this is data', data);
        console.log('this is data type', typeof data);
        const blob = await data.text();
        console.log("this is blob", blob)
        const obj = JSON.parse(blob);
        console.log('this is data.message', obj.Message);
        console.log(obj.Message.Message)
        console.log(obj.Event)

        const messages = obj.Message.Message;

        const name = obj.Message.Username;
        const time = obj.Message.Time;
        const email = name.split("@")

        // console.log("this is data", data)
        // var myobj = JSON.parse(data)
        // console.log("converted to object", myobj.message)
        // console.log(`[Socket Message Received]`);
        // console.log("this is the messaage rec", data)
        // const messages = myobj.message
        // const decodedJwt:JwtDecode = jwt_decode(myobj.token);
        // const name = decodedJwt.username
        // const time = myobj.time

        //using obj instand of event
        if (obj.Event === 'send-to-ticker-room') {
          console.log('broadcasting to specific room');
          try {
            const message = {
              author: email[0],
              message: messages,
              time: time,
            };
            setMessageList((list) => {
              return [...list, message];
            });
          } catch (err) {
            console.log(`Chat UseEffect`);
            console.log(err);
          }
        }
      } catch (err) {
        console.log('error in broadcasting try catch', err);
      }
    };

    socket && socket.addEventListener('message', broadcastReceiver);

    return () => {
      socket && socket.removeEventListener('message', broadcastReceiver);
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <ChatHeader ticker={ticker} />
      <ChatBody messageList={messageList} />
      <ChatFooter socket={socket} ticker={ticker} token={token} />
    </div>
  );
};

export default Chat;
