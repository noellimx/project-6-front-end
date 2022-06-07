/// <reference path="../../../types/svg.d.ts" />

import * as React from "react";

import _StdButton from "../../../Buttons/_StdButton";
import DistrictSelector from "./DistrictSelector";
import StackOptions from "./StackOptions";
import SelectableMenuedOutlets from "./SelectableMenuedOutlets";
import MenuSelection from "./MenuSelection";

import "leaflet/dist/leaflet.css";

import haversineOffset from "haversine-offset";

import {
  DistrictSelectionOnChangeFn,
  SelectableMenu,
  SelectableMenuItem,
  Client,
  Coordinate,
  MenuedOutlets,
  MenuedOutlet,
  Outlet,
  TheState,
  Transition_DispatchUserOrder,
  OrderFlow,
} from "../../../../utils/my-types";

import { Grid } from "@mui/material";
import { useSelector } from "react-redux";

interface SelectOutletDescriptionProps {
  outlet: Outlet;
}
const SelectOutletDescription: React.FC<SelectOutletDescriptionProps> = ({
  outlet,
}) => {
  return <>{outlet.name}</>;
};

interface DispatchUserProps {
  client: Client;
}

// local/serverless state
enum DispatchSequence {
  ORDERING,
  // server state
  STACKING,
  AWAITING_PRODUCTION,
  AWAITING_COLLECTION,
  DISPATCHING,
  COMPLETED,
}

const initState = () => DispatchSequence.ORDERING;

type StringToCoordinate = (_: string) => Coordinate;
const stringToCoordinate: StringToCoordinate = (latlng) => JSON.parse(latlng);

const resetSltbMOs: () => MenuedOutlets = () => [];
const resetSltMO: () => MenuedOutlet = () => null;
const resetSltbMenu: () => SelectableMenu = () => [];
const resetWindow: () => number = () => 0;
const resetEndLocation: () => Coordinate = () => null;
const resetRadius: () => number = () => 0;
const resetCurrentLocation: () => Coordinate = () => {
  console.log(`[resetCurrentLocation]`);
  return null;
};

type BinaryOperation = (_: number, __: number) => number;

const resetReadOnly: () => boolean = () => false;
const DispatchUser: React.FC<DispatchUserProps> = ({ client }) => {
  console.log(`[FC DispatchUser]`);
  const state = useSelector<TheState, Transition_DispatchUserOrder>(
    (_state) => {
      const orderSequence = _state.orderSequence;
      if (orderSequence.kind === OrderFlow.DISPATCH_USER_ORDER) {
        return orderSequence.transition;
      }
      throw new Error("[FC DispatchUser] Should not mount here.");
    }
  );

  const [awaiting, setAwaiting] =
    React.useState(
      false
    ); /** set to true if next state is dependent on server response */

  const [selectableMenuedOutlets, setSelectableMenuedOutlets] =
    React.useState<MenuedOutlets>(resetSltbMOs());
  const [selectedMenuedOutlet, setSelectedMenuedOutlet] =
    React.useState<MenuedOutlet>(resetSltMO());
  const [selectableMenu, setSelectableMenu] = React.useState<SelectableMenu>(
    resetSltbMenu()
  );
  const [stackWindow, setStackWindow] = React.useState<number>(resetWindow());
  const [stackEndLocation, setEndLocation] = React.useState<Coordinate>(
    resetEndLocation()
  );
  const [stackRadius, setStackRadius] = React.useState<number>(resetRadius());

  const [currentLocation, setCurrentLocation] = React.useState<Coordinate>(
    resetCurrentLocation()
  );

  const [districtCoordinate, setDistrictCoordinate] =
    React.useState<Coordinate>(null);

  const [isReadOnlyOrder, setIsReadOnlyOrder] = React.useState<boolean>(
    resetReadOnly()
  );

  const toggleReadOnlyOrder = () => setIsReadOnlyOrder((prev) => !prev);

  React.useEffect(() => {
    console.log(`[effect] selectable menu is dependent on received menu`);

    if (!!selectedMenuedOutlet) {
      const _selectableMenu = selectedMenuedOutlet.menu.map((mi) => ({
        ...mi,
        qty: 0,
      }));

      setSelectableMenu(() => _selectableMenu);

      const { lat, lng } = haversineOffset(
        {
          latitude: selectedMenuedOutlet.outlet.lat,
          longitude: selectedMenuedOutlet.outlet.lng,
        },
        { x: -150, y: -150 }
      );

      setCurrentLocation(() => {
        console.log(`[Dispatch useEffect setCurrentLocation]`);

        return [lat, lng];
      });
    } else {
      console.log(`[selectedMenuedOutlet] changed to null`);
      setSelectableMenu(() => resetSltbMenu());
      setCurrentLocation(() => resetCurrentLocation());
      setIsReadOnlyOrder(() => resetReadOnly());
    }
  }, [selectedMenuedOutlet]);

  React.useEffect(() => {
    console.log(`[effect] selectable menu is dependent on received menu`);
    if (stackWindow === 0) {
      setEndLocation(() => resetEndLocation());
      setStackRadius(() => resetRadius());
    } else {
      setStackRadius(() => 50);
    }
  }, [stackWindow]);

  const districtOnChangeFn: DistrictSelectionOnChangeFn = (event) => {
    console.log(`[districtOnChangeFn]`);
    const coordinateString = event.target.value;
    const coordinate = stringToCoordinate(coordinateString);
    setSelectableMenuedOutlets(() => resetSltbMOs());
    setSelectedMenuedOutlet(() => resetSltMO());
    setStackWindow(() => resetWindow());

    setDistrictCoordinate(() => coordinate);

    client.location.whichOutletsWithMenuNearHere(
      coordinate,
      (outletsWithMenu: MenuedOutlets) => {
        setSelectableMenuedOutlets(() => outletsWithMenu);
      }
    );
  };

  const changeSelectedOutlet = (mo: MenuedOutlet) => {
    setSelectedMenuedOutlet(() => mo);
  };

  const saveOrderAndCreateStackAndAddOrderToStack = async () => {
    setAwaiting(() => true);

    const order = selectableMenu
      ? selectableMenu?.filter((item) => item.qty > 0)
      : [];

    const stackOptions = {
      stackWindow,
      stackEndLocation,
      stackRadius,
      selectedMenuedOutlet,
    };

    console.log(
      `[stubbing send] ${JSON.stringify(order)} ${JSON.stringify(stackOptions)}`
    );

    client.order.saveOrderAndCreateStackAndAddOrderToStack({
      stackOptions,
      order,
    });
  };

  const add: BinaryOperation = (a: number, diff: number) => a + diff;
  const minus: BinaryOperation = (a: number, diff: number) => a - diff;

  const itemQtyChange = (
    qty: number,
    mi: SelectableMenuItem,
    opFn: BinaryOperation
  ) => {
    setSelectableMenu((list) => {
      return list.map((item) => {
        if (mi.description === item.description) {
          return {
            ...item,
            qty: opFn(item.qty, qty),
          };
        } else {
          return { ...item };
        }
      });
    });
  };
  const itemQtyIncFn = (qty: number, mi: SelectableMenuItem) => {
    itemQtyChange(qty, mi, add);
  };
  const itemQtyDecFn = (qty: number, mi: SelectableMenuItem) => {
    itemQtyChange(qty, mi, minus);
  };
  console.log(`[FC DispatchUser] before returning state: ${state}`);

  return (
    <>
      {state === Transition_DispatchUserOrder.ORDERING ? (
        !awaiting && (
          <>
            <DistrictSelector
              value={districtCoordinate}
              onChangeFn={districtOnChangeFn}
            ></DistrictSelector>
            {!districtCoordinate && (
              <>Choose a district! Nearby outlets will be shown. </>
            )}
            {/**  */}
            {!selectedMenuedOutlet ? (
              <SelectableMenuedOutlets
                selectableMenuedOutlets={selectableMenuedOutlets}
                onClick={changeSelectedOutlet}
              />
            ) : (
              <>
                <Grid
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  sx={{
                    flexDirection: "column",
                    mt: 1,
                    height: "auto",
                  }}
                >
                  <Grid
                    sx={{
                      width: "100%",
                      mt: 1,
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                      justifyContent: "center",
                      color: "text.primary",
                    }}
                  >
                    <Grid display="flex">
                      <> {selectedMenuedOutlet.outlet.name}</>
                    </Grid>

                    <Grid display="flex">
                      <>
                        {" "}
                        {selectedMenuedOutlet.outlet.buildingNumber} |{" "}
                        {selectedMenuedOutlet.outlet.streetName} |{" "}
                        {selectedMenuedOutlet.outlet.postalCode}
                      </>
                    </Grid>
                  </Grid>
                  <MenuSelection
                    isReadOnlyOrder={isReadOnlyOrder}
                    toggleReadOnly={toggleReadOnlyOrder}
                    onClickInc={itemQtyIncFn}
                    onClickDec={itemQtyDecFn}
                    selectableMenu={selectableMenu}
                  />
                </Grid>

                <Grid
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-start"
                  sx={{
                    flexDirection: "column",
                    mt: 1,
                    height: "auto",
                  }}
                >
                  <StackOptions
                    stackWindow={stackWindow}
                    stackEndLocation={stackEndLocation}
                    stackRadius={stackRadius}
                    onSwitchUp={() => setStackWindow(() => 1)}
                    onSwitchDown={() => setStackWindow(() => 0)}
                    incWindow={() => setStackWindow((prev) => prev + 1)}
                    decWindow={() => setStackWindow((prev) => prev - 1)}
                    updateEndLocation={(newC) => {
                      console.log(`new end location ${JSON.stringify(newC)}`);
                      setEndLocation(() => newC);
                    }}
                    client={client}
                    selectedMenuedOutlet={selectedMenuedOutlet}
                    currentLocation={currentLocation}
                    outletLocation={[
                      selectedMenuedOutlet.outlet.lat,
                      selectedMenuedOutlet.outlet.lng,
                    ]}
                    radiusChange={(n) => setStackRadius((_) => n)}
                    awaiting={awaiting}
                    saveOrderAndCreateStackAndAddOrderToStackFn={
                      saveOrderAndCreateStackAndAddOrderToStack
                    }
                  ></StackOptions>
                </Grid>
              </>
            )}
            <></>
          </>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default DispatchUser;
