import * as React from "react";

import { TrulyImpure } from "../../utils/my-types";

import Button from "@mui/material/Button";

interface StdButtonProps {
  onClickFn: TrulyImpure;
  text: string;

  sx?: any;
}
const _StdButton: React.FC<StdButtonProps> = ({
  text,
  onClickFn = () => {},
  sx,
}) => {
  return (
    <Button sx={sx} variant="outlined" disableElevation onClick={onClickFn}>
      {text}
    </Button>
  );
};

export default _StdButton;
