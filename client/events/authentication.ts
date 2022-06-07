import {
  UpLinkSub,
  ChannelReceive,
  UserPassSubmitFn,
  AuthenticationTrigger,
  AuthenticationStatus,
} from "../utils/my-types";
import { getAccessToken, storeAccessToken } from "../operations/authentication";
import {
  authenticationStatusInjector,
  authenticationMessageInjector,
} from "../state/authentication";

interface LoginRequestReceive {
  accessToken: string;
  msg: string;
}

const uplinkAuthentication: UpLinkSub<AuthenticationTrigger> = (io, store) => {
  console.log("[uplinkAuthentication] attaching");

  const isValidToken = (chanRcv: ChannelReceive<boolean>) => {
    const token = getAccessToken();
    console.log(`[isValidToken] sending token -> ${token}`);
    io.emit("is-token-valid", token, (response: boolean) => {
      console.log(`[is-token-valid] := ${response}`);
      chanRcv(response);
    });
  };

  const updateValidToken = () => {
    isValidToken(() => {});
  };

  const presentToken = (n = 5) => {
    if (n == 0) {
      console.error(
        "Server not responding regularly to authentication protocol."
      );
      return;
    }
    isValidToken((is) => {
      if (is === true) {
        store.dispatch(authenticationStatusInjector(AuthenticationStatus.TRUE));
      } else if (is === false) {
        store.dispatch(
          authenticationStatusInjector(AuthenticationStatus.FALSE)
        );
      } else {
        setTimeout(
          () => {
            store.dispatch(
              authenticationStatusInjector(AuthenticationStatus.UNCERTAIN)
            );
            presentToken(n - 1);
          },

          1000
        );
      }
    });
  };

  const login: UserPassSubmitFn = (username, password) => {
    io.emit(
      "login-request",
      { username, password },
      (authResponse: LoginRequestReceive) => {
        console.log(
          `[clientAuth requestLogin] Obtained token ${JSON.stringify(
            authResponse
          )}`
        );
        const { accessToken, msg } = authResponse;
        const currentToken = storeAccessToken(accessToken);
        console.log(`[clientAuth] stored token := ${currentToken}`);
        store.dispatch(authenticationMessageInjector(msg));

        presentToken(1);
      }
    );

    return null;
  };

  return {
    updateValidToken,
    presentToken,
    login,
  };
};

export default uplinkAuthentication;
