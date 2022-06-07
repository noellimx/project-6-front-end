const ACCESS_TOKEN_KEY_NAME = "access-token";
/**
 * The client is responsible for proper handling of tokens and minimizing attack surface.
 */

export const getAccessToken = () => {
  // window.localStorage.setItem(ACCESS_TOKEN_KEY_NAME, "this-is-the-access-token");

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY_NAME);

  return accessToken;
};

export const storeAccessToken = (token: string) => {
  window.localStorage.setItem(ACCESS_TOKEN_KEY_NAME, token);

  return getAccessToken();
};
