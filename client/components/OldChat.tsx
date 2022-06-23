import * as React from 'react';
import { useState, useEffect } from 'react';
import * as ScrollToBottom from 'react-scroll-to-bottom';
import './App.css';
import {Col, Row } from 'react-bootstrap'
import { MAny } from '../utils/my-types';
import axios from 'axios';
import jwt_decode from 'jwt-decode'
import moment from 'moment';

// import { sendMessageToTickerRoom } from "./App";
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
  username: string
}



const ChatHeader = ({ ticker }) => {
  return (
    <div className="chat-header">
      <p>A Live Chat {`${ticker}`}</p>
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
                  <Col className='col-8'>
                  <Row>
                  <p className='message-username' id="author">{messageContent.author}</p>
                  </Row>
                  <Row>
                  <p className='message-content'>{messageContent.message}</p>
                  </Row>
                  </Col>
                  <Col className='col-4 message-time-col align-self-end'>
                 <Row><p className='message-time' id="time">{moment(messageContent.time).format('LT')}</p>
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
  message: string
) => {
  const time = moment();

  //send message to socket
  const data = { event: 'send-to-ticker-room', token, message, roomId, time };
  socket.send(JSON.stringify(data));

  //todo, add chat to DB
};

const ChatFooter = ({ socket, ticker, token, setMessageList }) => {


  const roomId = ticker;

  const [textField, setTextField] = useState<string>('');

  const sendThisMessage = () => {
    console.log(`[sendThisMessage]`);
    sendMessage(socket, roomId, token, textField);
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

  useEffect(()=>{
    setMessageList([])
    axios.get(`https://localhost:8080/history/${ticker}`).then((res)=>{
    console.log("axios get chat all history")
    const result = res.data
    const allMessage = result.map((x)=>{

      const myMessage ={author: x.Username, message: x.Message, time: x.Time}
      return myMessage
    })
  setMessageList(allMessage)
  })
  },[ticker])

  useEffect(() => {

    console.log('Chat use effect []');
    console.log(socket);
    const broadcastReceiver = async (event: MessageEvent) => {
      console.log(event)
      //converting blob to string, then string to obj
      const data = await event.data;
      const blob = await data.text()
      console.log(`[Socket Message Received]`);
      const obj = JSON.parse(blob);
      const messages = obj.message
      const decodedJwt:JwtDecode = jwt_decode(obj.token);
      const name = decodedJwt.username
      const time = obj.time
      console.log(time)

      //using obj instand of event
      if (obj.event === 'send-to-ticker-room') {
        console.log('broadcasting message');
        try {
          const message = {
            author: name,
            message: messages,
            time: time,}
          setMessageList((list) => {
            return [...list, message];
          });
        } catch (err) {
          console.log(`Chat UseEffect`);
          console.log(err);
        }
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
      <ChatFooter
        socket={socket}
        ticker={ticker}
        token={token}
        setMessageList={setMessageList}
      />
    </div>
  );
};

export default Chat;
