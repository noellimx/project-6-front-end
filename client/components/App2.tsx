import * as React from "react";

import OldChat from "./OldChat";

type ComponentProps = {};

/**
 * The chat component for current ticker. We will need a connection to the server.
 */
const Component: React.FC<ComponentProps> = () => {
  return (
    <div>
      <h3>Live Chat Session</h3>
      <></>

      <OldChat token={""} ticker={"fleas"} socket={null} />
    </div>
  );
};

export default Component;
