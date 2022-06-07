import * as React from "react";

import { TrulyImpure } from "../types/types";

interface SubmitUrlButtonProps {
  onClickFn: TrulyImpure;
  shouldDisable: boolean;
}
const SubmitUrlButton: React.FC<SubmitUrlButtonProps> = ({
  onClickFn,
  shouldDisable,
}) => {
  console.log(`isDisabled ${shouldDisable}`);
  return (
    <button
      disabled={shouldDisable}
      style={{ backgroundColor: shouldDisable ? "black" : "green" }}
      onClick={onClickFn}
    >
      {" "}
      Submit{" "}
    </button>
  );
};

export default SubmitUrlButton;
