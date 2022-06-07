import * as React from "react";

import { FormControl, InputLabel, MenuItem, Select, Box } from "@mui/material";
import {
  CoordinateToString,
  DistrictSelectionOnChangeFn,
  Coordinate,
} from "../../../../utils/my-types";

import { ds } from "../../../../orda";
type Location = {
  lat: number;
  lng: number;
};

interface DistrictLocation extends Location {
  alias: string;
}

const coordinateToString: CoordinateToString = ([lat, lng]) =>
  JSON.stringify([lat, lng]);

interface DistrictSelectorProps {
  onChangeFn: DistrictSelectionOnChangeFn;
  value: Coordinate;
}

const DistrictSelector: React.FC<DistrictSelectorProps> = ({
  onChangeFn = (_, __) => {},
  value,
}) => {
  return (
    <>
      <Box
        sx={{ mt: "30%" }}
        display={"flex"}
        alignItems="center"
        justifyContent="center"
        width={"100%"}
      >
        <FormControl
          sx={{ width: "90%", display: "flex", justifyContent: "center" }}
        >
          <InputLabel id="demo-simple-select-label">Location</InputLabel>

          <Select
            onChange={onChangeFn}
            value={!!value ? coordinateToString(value) : ""}
          >
            {ds.map(({ d: { lat, lng, alias } }) => {
              const value = coordinateToString([lat, lng]);
              return (
                <MenuItem key={alias} value={value}>
                  {alias}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Box>
    </>
  );
};
export default DistrictSelector;
