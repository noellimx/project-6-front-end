import * as React from "react";

import { useSelector } from "react-redux";

import { TheState, AuthenticationStatus, Client } from "../utils/my-types";
import LoggedIn from "./pages/LoggedIn";
import NotLoggedIn from "./pages/NotLoggedIn";
import { Grid } from "@mui/material";

interface AppProps {
  client: Client;
}

const App: React.FC<AppProps> = ({ client }) => {
  const countOfPing = useSelector((state: TheState) => state.ping);
  const authenticationStatus = useSelector<TheState, AuthenticationStatus>(
    (state) => state.authenticationStatus
  );

  React.useEffect(() => {
    client.authentication.presentToken();
  }, []);

  return (
    <>
      <Grid
        sx={{ flexDirection: "column" }}
        alignItems="center"
        justifyContent="center"
      >
        {authenticationStatus === AuthenticationStatus.UNCERTAIN ? (
          <div>Uncertain User</div>
        ) : authenticationStatus === AuthenticationStatus.FALSE ? (
          <Grid>
            <NotLoggedIn client={client} />
          </Grid>
        ) : authenticationStatus === AuthenticationStatus.TRUE ? (
          <Grid>
            <LoggedIn client={client} />
          </Grid>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
};

export default App;
