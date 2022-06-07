import * as React from "react";

import _StdButton from "../../../Buttons/_StdButton";

import "leaflet/dist/leaflet.css";
import { useMap } from "react-leaflet";

import { Coordinate } from "../../../../utils/my-types";

import * as L from "leaflet";

interface BoundSetterProps {
  currentLocation: Coordinate;
  stackEndLocation: Coordinate;
  outletLocation: Coordinate;
}
const BoundSetter: React.FC<BoundSetterProps> = ({
  outletLocation,
  currentLocation,
  stackEndLocation,
}) => {
  const map = useMap();

  React.useEffect(() => {
    console.log(`[Boundsetter useeffect`);
    const coords = [currentLocation, stackEndLocation, outletLocation]
      .filter((c) => !!c)
      .map((c) => L.marker(c));

    if (coords.length > 1) {
      map.fitBounds(L.featureGroup(coords).getBounds());
      console.log(`zoom level ${map.getZoom()}`);
    } else {
      map.setView(coords[0].getLatLng(), 15);
    }
  }, [
    currentLocation[0],
    currentLocation[1],
    stackEndLocation[0],
    stackEndLocation[1],
    outletLocation[0],
    outletLocation[1],
  ]);

  return <></>;
};

export default BoundSetter;
