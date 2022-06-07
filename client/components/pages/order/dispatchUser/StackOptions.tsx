/// <reference path="../../../types/svg.d.ts" />

import * as React from "react";

import _StdButton from "../../../Buttons/_StdButton";

import EndLocation from "./EndLocation";
import {
  MapContainer,
  TileLayer,
  Popup,
  Marker,
  useMap,
  Circle,
  Pane,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { Grid, Slider } from "@mui/material";

import {
  TrulyImpure,
  Client,
  Coordinate,
  MenuedOutlet,
} from "../../../../utils/my-types";

import { Switch, Box, ButtonGroup, Button } from "@mui/material";

import * as L from "leaflet";

import { outletIcon, endLocationIcon, currentLocationIcon } from "../Iconz";

import BoundSetter from "./BoundSetter";

interface StackOptionsProps {
  stackWindow: number;
  stackEndLocation: Coordinate;
  stackRadius: number;
  onSwitchUp: TrulyImpure;
  onSwitchDown: TrulyImpure;
  incWindow: TrulyImpure;
  decWindow: TrulyImpure;
  updateEndLocation: (_: Coordinate) => void;
  client: Client;
  selectedMenuedOutlet: MenuedOutlet;
  currentLocation: Coordinate;
  outletLocation: Coordinate;
  radiusChange: (_: number) => void;
  awaiting: boolean;
  saveOrderAndCreateStackAndAddOrderToStackFn: TrulyImpure;
}

const StackOptions: React.FC<StackOptionsProps> = ({
  stackWindow,
  stackEndLocation,
  stackRadius,
  onSwitchUp = () => {},
  onSwitchDown = () => {},
  decWindow = () => {},
  incWindow = () => {},
  updateEndLocation,
  client,
  selectedMenuedOutlet,
  currentLocation,
  outletLocation,
  radiusChange = (_) => {},
  awaiting,
  saveOrderAndCreateStackAndAddOrderToStackFn,
}) => {
  console.log(`[FC StackOptions] `);
  console.log(`[awaiting] ${awaiting}`);
  const isWindow = stackWindow > 0;

  return awaiting === true ? (
    <></>
  ) : (
    <>
      {/* Stack Master Control */}
      {
        <Grid
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "90%",
          }}
        >
          <Grid>New Stack</Grid>
          <Grid>
            <Switch
              checked={isWindow}
              onClick={isWindow ? onSwitchDown : onSwitchUp}
            />
          </Grid>
        </Grid>
      }{" "}
      {/* Stack Settings */}
      {isWindow ? (
        <Grid
          sx={{
            flexDirection: "column",
            alignSelf: "center",
            justifySelf: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            width: "90%",
          }}
        >
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              width: "90%",
            }}
          >
            How long should the stack remain open (in minutes)?
            <ButtonGroup sx={{ mt: 1 }}>
              <Button
                onClick={() => {
                  decWindow();
                }}
                disabled={stackWindow <= 1}
              >
                -
              </Button>{" "}
              <Button>{stackWindow}</Button>{" "}
              <Button
                onClick={() => {
                  incWindow();
                }}
              >
                +
              </Button>
            </ButtonGroup>{" "}
          </Grid>
          <EndLocation
            client={client}
            updateEndLocation={updateEndLocation}
          ></EndLocation>
          {stackEndLocation && (
            <>
              <MapContainer
                style={{ zIndex: 0, width: "100%", height: "200px" }}
                center={[
                  selectedMenuedOutlet.outlet.lat,
                  selectedMenuedOutlet.outlet.lng,
                ]}
                zoom={13}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='<img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
                  url="http://maps-c.onemap.sg/v3/Grey/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    selectedMenuedOutlet.outlet.lat,
                    selectedMenuedOutlet.outlet.lng,
                  ]}
                  icon={outletIcon}
                ></Marker>
                <Marker
                  position={stackEndLocation}
                  icon={endLocationIcon}
                ></Marker>
                {currentLocation && (
                  <Marker
                    position={currentLocation}
                    icon={currentLocationIcon}
                  ></Marker>
                )}

                <BoundSetter
                  stackEndLocation={stackEndLocation}
                  currentLocation={currentLocation}
                  outletLocation={outletLocation}
                />

                {stackRadius > 0 && (
                  <Pane name="cyan-rectangle">
                    <Circle center={stackEndLocation} radius={stackRadius} />
                  </Pane>
                )}
              </MapContainer>
              {stackRadius > 0 && (
                <>
                  <Slider
                    id="slider-radius-end-location"
                    value={stackRadius}
                    onChange={(evt, newValue) => {
                      evt.stopPropagation();
                      if (typeof newValue === "number") {
                        radiusChange(newValue);
                      }
                    }}
                    min={20}
                    max={200}
                    aria-label="Default"
                    valueLabelDisplay="auto"
                  />
                  <div>{stackRadius}</div>
                </>
              )}

              {/* Stack Submission */}
              <_StdButton
                onClickFn={saveOrderAndCreateStackAndAddOrderToStackFn}
                text={"Save Order and Create Stack"}
              />
            </>
          )}
        </Grid>
      ) : (
        <></>
      )}
    </>
  );
};

export default StackOptions;
