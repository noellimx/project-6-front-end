/// <reference path="../../types/svg.d.ts" />

import * as L from "leaflet";

import SVGhomeFlag from "../../../static/icons/house-flag-solid-green.svg";
import SVGhomeFlagBlue from "../../../static/icons/house-flag-solid-blue.svg";
import SVGUserSolid from "../../../static/icons/user-solid.svg";

export const outletIcon = L.icon({
  iconUrl: SVGhomeFlag,
  iconSize: [10, 10],
});

export const endLocationIcon = L.icon({
  iconUrl: SVGhomeFlagBlue,
  iconSize: [10, 10],
});

export const currentLocationIcon = L.icon({
  iconUrl: SVGUserSolid,
  iconSize: [10, 10],
});
