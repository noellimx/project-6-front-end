import { AnyAction } from "redux";
import { Socket } from "socket.io-client";
import { Store } from "redux";
import { ReactNode } from "react";
import { SelectChangeEvent } from "@mui/material";

export type TrulyImpure = () => void;

export interface PayloadAction<P> extends AnyAction {
  payload: P;
}

export const enum AuthenticationStatus {
  UNCERTAIN,
  FALSE,
  TRUE,
}

export interface TheState {
  ping: number;
  authenticationStatus: AuthenticationStatus;
  authenticationMessage: string;
  orderSequence: OrderSequence;
  collection: Collection;
}

export type ChannelReceive<T> = (data: T) => void;
export type EventTrigger = {};
export type UpLinkSub<T> = (_: Socket, __: Store) => T;

export interface SioResponse {
  code: string;
  data: any;
}

export type UserPassSubmitFn = (username: string, password: string) => void;

export interface AuthenticationTrigger extends EventTrigger {
  updateValidToken: TrulyImpure;
  presentToken: TrulyImpure;
  login: UserPassSubmitFn;
}

export type StackOptionInterface = {
  stackWindow: number;
  stackEndLocation: Coordinate;
  stackRadius: number;
};

export type MsSinceEpoch = number;
export type CollectionConfig = {
  stackingTil: MsSinceEpoch;
  stackEndLocation: Coordinate;
  stackRadius: number;
  courier: string;
};

export interface CollectibleOrder {
  order: SelectableMenu;
  dropOffPoint: Coordinate;
  isCollected: boolean;
  username: string;
}

export interface Collection {
  config: CollectionConfig;
  orders: CollectibleOrder[];
}

export interface CandidateCollection {
  outletName: string;
  stackEndLocation: Coordinate;
  courier: string;
  stackRadius: number;
  stackingTil: number;
}
export type SaveOrderAndCreateStackAndAddOrderToStack = (_: {
  order: SelectableMenuItem[];
  stackOptions: StackOptionInterface;
}) => Promise<void>;
export interface OrderTrigger extends EventTrigger {
  transitToOrder_Ordering: TrulyImpure;
  transitToStackFinding_: TrulyImpure;
  saveOrderAndCreateStackAndAddOrderToStack: SaveOrderAndCreateStackAndAddOrderToStack;
}

export interface GeneralTrigger extends EventTrigger {
  acknowledge: TrulyImpure;
  doYouAcknowledge: (_: ChannelReceive<string>) => void;
}

export type Coordinate = [_: number, __: number];

export type Address = {
  postalCode: string;
  streetName: string;
  buildingNumber: number;
  name?: string;
};
export type Location = {
  coordinates: Coordinate;
  address: Address;
};

export interface LocationTrigger extends EventTrigger {
  whichCandidateCollection(
    _newloc: Coordinate,
    arg1: (collections: CandidateCollection[]) => void
  );
  whichOutletsWithMenuNearHere: (
    _: Coordinate,
    __: (_: MenuedOutlets) => void
  ) => void;

  searchBySearchVal: (_: string) => Promise<Location[]>;
}
export type CoordinateToString = (_: Coordinate) => string;
export type SomeEventTrigger = AuthenticationTrigger | GeneralTrigger;
export interface Client {
  general: GeneralTrigger;
  authentication: AuthenticationTrigger;
  order: OrderTrigger;
  location: LocationTrigger;
}
export type UpLink = (_: Socket, __: Store) => Client;

export const enum OrderFlow {
  NIL = "1",
  DISPATCH_USER_ORDER = "2",
  FIND_STACK = "3",
}

export interface OrderFlow_NIL {
  kind: OrderFlow.NIL;
  transition: Transition_Nil;
}

export interface OrderFlow_DispatchUserOrder {
  kind: OrderFlow.DISPATCH_USER_ORDER;
  transition: Transition_DispatchUserOrder;
}
export interface OrderFlow_FindStack {
  kind: OrderFlow.FIND_STACK;
  transition: Transition_FindingStack;
}

export const enum Transition_DispatchUserOrder {
  ORDERING,
  STACKING,
  ORDERED,
}

export const enum Transition_Nil {
  NOT_IMPLEMENTED = "transition-nil-not=implemented",
}
export const enum Transition_FindingStack {
  NOT_IMPLEMENTED = "transition-dispatch-finding-stack",
}

export type OrderSequence =
  | OrderFlow_NIL
  | OrderFlow_DispatchUserOrder
  | OrderFlow_FindStack;

export type MenuItem = {
  description: string;
  price: number;
};
export type Menu = MenuItem[];
export type Menus = Menu[];

export type Outlet = {
  lat: number;
  lng: number;
  postalCode: string;
  streetName: string;
  buildingNumber: number;
  name: string;
};

export type Outlets = Outlet[];

export type MenuedOutlet = {
  outlet: Outlet;
  menu: Menu;
};

export type MenuedOutlets = MenuedOutlet[];

export type DistrictSelectionOnChangeFn = (
  _: SelectChangeEvent<string>,
  __: ReactNode
) => void;

export interface SelectableMenuItem extends MenuItem {
  qty: number;
}

export type SelectableMenu = SelectableMenuItem[];

export type SelectableMenus = SelectableMenu[];
