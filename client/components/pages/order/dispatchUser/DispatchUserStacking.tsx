/// <reference path="../../../types/svg.d.ts" />

import * as React from "react";

import _StdButton from "../../../Buttons/_StdButton";

import "leaflet/dist/leaflet.css";

import { Client, TheState, Collection } from "../../../../utils/my-types";
import { useSelector } from "react-redux";
import Countdown from "react-countdown";

import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { outletIcon, endLocationIcon, currentLocationIcon } from "../Iconz";

import BoundSetter from "./BoundSetter";
import { Grid } from "@mui/material";
interface CollectionStackProps {
  client: Client;
}

const StackProps: React.FC<CollectionStackProps> = () => {
  const collection = useSelector<TheState, Collection>(
    (state) => state.collection
  );

  return collection ? (
    <>
      {collection.orders && collection.orders.length > 0 ? (
        <>
          <>You have some orders in the collection</>
          <Countdown
            date={new Date(collection.config.stackingTil)}
            renderer={({ hours, minutes, seconds, completed }) => {
              if (completed) {
                // Render a completed state
                return <>gooh</>;
              } else {
                // Render a countdown
                return (
                  <span>
                    {hours}:{minutes}:{seconds}
                  </span>
                );
              }
            }}
          />

          <>
            <MapContainer
              style={{ zIndex: 0, width: "100%", height: "200px" }}
              center={collection.config.stackEndLocation}
              zoom={13}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='<img src="https://www.onemap.gov.sg/docs/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
                url="http://maps-c.onemap.sg/v3/Grey/{z}/{x}/{y}.png"
              />
              <Marker
                position={collection.config.stackEndLocation}
                icon={outletIcon}
              ></Marker>
              <Marker
                position={collection.config.stackEndLocation}
                icon={endLocationIcon}
              ></Marker>
              {collection.config.stackEndLocation && (
                <Marker
                  position={collection.config.stackEndLocation}
                  icon={currentLocationIcon}
                ></Marker>
              )}

              <BoundSetter
                stackEndLocation={collection.config.stackEndLocation}
                currentLocation={collection.config.stackEndLocation}
                outletLocation={collection.config.stackEndLocation}
              />

              <Circle
                center={collection.config.stackEndLocation}
                radius={collection.config.stackRadius}
              />
            </MapContainer>

            {collection.orders.map((order) => {
              return (
                <Grid
                  key={`${order.username}| {order.isCollected} | {order.order}`}
                >
                  <>
                    <Grid>
                      {`${order.username}| ${order.isCollected} | ${order.order}`}
                    </Grid>

                    <Grid>{order.dropOffPoint}</Grid>
                  </>
                </Grid>
              );
            })}
          </>
        </>
      ) : (
        <>Collection found but is empty.</>
      )}
    </>
  ) : (
    <>Yikes. No collection found</>
  );
};

export default StackProps;
