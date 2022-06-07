/// <reference path="../../components/types/png.d.ts" />

import * as React from "react";

import { TextField } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import _StdButton from "../Buttons/_StdButton";
import { Client, TheState } from "../../utils/my-types";
import { useSelector } from "react-redux";

import logoPng from "../../static/logo.png";

export const LogoBox = () => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    component="img"
    sx={{
      height: "auto",
      width: 0.5,
    }}
    alt="The house from the offer."
    src={logoPng}
  />
);

interface NotLoggedInProps {
  client: Client;
}

const NotLoggedIn: React.FC<NotLoggedInProps> = ({ client }) => {
  const [inputUsername, setInputUsername] = React.useState<string>("");
  const [inputPassword, setInputPassword] = React.useState<string>("");

  const authenticationMessage = useSelector(
    (state: TheState) => state.authenticationMessage
  );
  return (
    <>
      <Grid
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <LogoBox />

        <Grid>
          <Grid display="flex" alignItems="center" justifyContent="center">
            <TextField
              sx={{ py: 0, input: { color: "black" } }}
              label="username"
              value={inputUsername}
              variant="standard"
              onChange={(event) => {
                setInputUsername((_) => {
                  return (event.target as HTMLInputElement).value;
                });
              }}
            />
          </Grid>
          <Grid
            id="text-field-password"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <TextField
              label="password"
              type="password"
              value={inputPassword}
              autoComplete="current-password"
              variant="standard"
              onChange={(event) => {
                setInputPassword((_) => {
                  return (event.target as HTMLInputElement).value;
                });
              }}
            />
          </Grid>

          <Grid
            sx={{
              mt: 2,
            }}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <_StdButton
              text={"Login"}
              onClickFn={() => {
                client.authentication.login(inputUsername, inputPassword);
              }}
            ></_StdButton>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default NotLoggedIn;
