import uplinkGeneral from "./events/general";
import uplinkAuthentication from "./events/authentication";
import uplinkOrder from "./events/order";
import {
  UpLink,
  Coordinate,
  Outlet,
  MenuedOutlets,
  Menu,
  Location,
  Address,
  Collection,
  CandidateCollection,
} from "./utils/my-types";
import { Store } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import axios from "axios";

const outlet_001: Outlet = {
  lat: 1.3198983747743869,
  lng: 103.8440153554115,
  postalCode: "307683",
  streetName: "Thomson Road",
  buildingNumber: 238,
  name: "Old Chang Kee @ Novena Square",
};
const menuOfOutlet_001: Menu = [
  { description: "Curry'O", price: 1.2 },
  { description: "Spring'O", price: 1.3 },
  { description: "Carrot K8", price: 3 },
  { description: "Gyoza", price: 22 },
  { description: "Squid Head", price: 2.2 },
  { description: "Cheese Balls", price: 2.2 },
];

const outlet_002: Outlet = {
  lat: 1.3177859704941652,
  lng: 103.84346936993025,
  postalCode: "307591",
  streetName: "Thomson Road",
  buildingNumber: 101,
  name: "Wee Name Kee @ Novena Square",
};

const menuOfOutlet_002: Menu = [
  { description: "Chicken Thigh", price: 4 },
  { description: "Chicken Breast", price: 5 },
  { description: "Ginger Rice", price: 3 },
  { description: "Soup", price: 2.2 },
  { description: "Roast Set", price: 7 },
  { description: "Steam Set", price: 7 },
];

const outlet_003: Outlet = {
  lat: 1.3340447886785993,
  lng: 103.84981812022932,
  postalCode: "310177",
  streetName: "Toa Payoh Central",
  buildingNumber: 177,
  name: "Toa Payoh Lucky Pisang Raja",
};

const menuOfOutlet_003: Menu = [
  { description: "Tapioca", price: 1.2 },
  { description: "Potato", price: 1.3 },
  { description: "Pisang", price: 1.2 },
  { description: "Chempedek", price: 1.4 },
  { description: "Yam", price: 1.7 },
  { description: "Niangao", price: 1 },
];

const outlet_004: Outlet = {
  lat: 1.3325614730158255,
  lng: 103.84852914538807,
  postalCode: "310490",
  streetName: "Lorong 6 Toa Payoh",
  buildingNumber: 490,
  name: "Ya Kun Family Cafe",
};

const menuOfOutlet_004: Menu = [
  { description: "Coffee", price: 3 },
  { description: "Tea", price: 22 },
  { description: "Or", price: 2.2 },
  { description: "Me", price: 2.2 },
  { description: "Set 1", price: 1.2 },
  { description: "Set 2", price: 1.3 },
];

const dl2 = { lat: 1.29027, lng: 103.851959, alias: "Toa Payoh" };
const dl1 = {
  lat: 1.3204021738781062,
  lng: 103.84353385476177,
  alias: "Novena",
};

const mo1 = { outlet: outlet_001, menu: menuOfOutlet_001 };
const mo2 = { outlet: outlet_002, menu: menuOfOutlet_002 };
const mo3 = { outlet: outlet_003, menu: menuOfOutlet_003 };
const mo4 = { outlet: outlet_004, menu: menuOfOutlet_004 };

type GetOutletWithMenus = (_: Coordinate) => MenuedOutlets;

const d1 = { d: dl1, outlets: [mo1, mo2] };
const d2 = { d: dl2, outlets: [mo3, mo4] };

export const ds = [d1, d2];

const getOutletsWithMenus: GetOutletWithMenus = (coord) => {
  const [lat, lng] = coord;
  for (const d of ds) {
    if (lat === d.d.lat || d.d.lng === lng) {
      return d.outlets;
    }
  }
  return [];
};

interface OneMapApiResult {
  ADDRESS: string;
  BLK_NO: string;
  BUILDING: string;
  LATITUDE: string;
  LONGITUDE: string;
  POSTAL: string;
  ROAD_NAME: string;
  SEARCHVAL: string;
}

const apiResultToLocation = (result: OneMapApiResult) => {
  const { LATITUDE: _lat, LONGITUDE: _lng } = result;
  const [lat, lng] = [Number(_lat), Number(_lng)];
  const {
    BLK_NO: _buildingNumber,
    POSTAL: postalCode,
    ROAD_NAME: streetName,
  } = result;

  const buildingNumber = Number(_buildingNumber);
  const name = result.SEARCHVAL || result.ADDRESS || "";

  const coordinates: Coordinate = [lat, lng];
  const address: Address = {
    buildingNumber,
    streetName,
    postalCode,
    name,
  };

  return {
    coordinates,
    address,
  };
};

const locationEvents = (io: Socket, store: Store) => {
  const whichOutletsWithMenuNearHere = (
    coordinate: Coordinate,
    fn: (mO: MenuedOutlets) => void
  ) => {
    const recvData: MenuedOutlets = getOutletsWithMenus(coordinate);
    console.log(
      `[whichOutletsWithMenuNearHere STUB] coordinate -> ${JSON.stringify(
        coordinate
      )}`
    );

    fn(recvData);
  };

  const searchBySearchVal: (_: string) => Promise<Location[]> = async (
    searchVal
  ) => {
    const result = await axios.get(
      `https://developers.onemap.sg/commonapi/search?searchVal=${searchVal}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
    );

    const results = result.data.results;

    const locations: Location[] = results.map(apiResultToLocation);
    return locations.filter((location) => {
      const { address } = location;
      const { buildingNumber, streetName, postalCode } = address;

      return buildingNumber && streetName && postalCode;
    });
  };

  const whichCandidateCollection: (
    _: Coordinate,
    __: (_: CandidateCollection[]) => void
  ) => void = (loc, fn) => {
    io.emit("which-candidate-collection", loc, (cs: CandidateCollection[]) => {
      console.log(`[which-candidate-collection] :=`);
      console.log(cs);
      fn(cs);
    });
  };

  return {
    whichOutletsWithMenuNearHere,
    searchBySearchVal,
    whichCandidateCollection,
  };
};

const newClient: UpLink = (io, store) => {
  const general = uplinkGeneral(io, store);
  const authentication = uplinkAuthentication(io, store);
  const order = uplinkOrder(io, store);
  const location = locationEvents(io, store);

  return {
    general,
    authentication,
    order,
    location,
  };
};

export default newClient;
