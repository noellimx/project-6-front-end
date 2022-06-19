import * as React from "react";

type ChatProps = {
  ticker: string;
  ws: WebSocket;
  token: string;
};

/**
 * The chat component for current ticker. We will need a connection to the server.
 */
const Chat: React.FC<ChatProps> = () => {
  return (
    <div>
      <h3>Live Chat Session</h3>
      <></>
    </div>
  );
};

export default Chat;
