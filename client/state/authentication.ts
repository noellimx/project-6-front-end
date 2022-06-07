import { PayloadAction, AuthenticationStatus } from "../utils/my-types";

enum AuthenticationStatusCommand {
  UPDATE = "auth:validity:status:update",
}

export type AuthenticationStatusInjection = PayloadAction<AuthenticationStatus>;

type AuthenticationStatusInjector = (
  _: AuthenticationStatus
) => AuthenticationStatusInjection;
export const authenticationStatusInjector: AuthenticationStatusInjector = (
  status
) => ({
  type: AuthenticationStatusCommand.UPDATE,
  payload: status,
});

const initAuthStatus = () => AuthenticationStatus.UNCERTAIN;

type AuthenticationPipe = (
  _: AuthenticationStatus,
  __: AuthenticationStatusInjection
) => AuthenticationStatus;
export const authenticationStatusPipe: AuthenticationPipe = (
  status = initAuthStatus(),
  injection
) => {
  const { type, payload } = injection;
  if (type === AuthenticationStatusCommand.UPDATE) {
    return payload;
  } else {
    return status;
  }
};

enum AuthenticationMessageCommand {
  UPDATE = "auth:validity:msg:update",
}

export type AuthenticationMessageInjection = PayloadAction<string>;

type AuthenticationMessageInjector = (
  _: string
) => AuthenticationMessageInjection;
export const authenticationMessageInjector: AuthenticationMessageInjector = (
  message
) => ({
  type: AuthenticationMessageCommand.UPDATE,
  payload: message,
});

const initAuthMsg = () => "";

type AuthenticationMessagePipe = (
  _: string,
  __: AuthenticationMessageInjection
) => string;
export const authenticationMessagePipe: AuthenticationMessagePipe = (
  status = initAuthMsg(),
  injection
) => {
  const { type, payload } = injection;
  if (type === AuthenticationMessageCommand.UPDATE) {
    return payload;
  } else {
    return status;
  }
};
