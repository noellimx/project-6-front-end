import * as React from "react";

import {} from "../../../../utils/my-types";

import { Card, CardContent, Typography } from "@mui/material";

import { MenuedOutlets, MenuedOutlet } from "../../../../utils/my-types";

interface SelectableMenusProps {
  selectableMenuedOutlets: MenuedOutlets;
  onClick: (_: MenuedOutlet) => void;
}

interface SelectableMenuProps {
  mo: MenuedOutlet;
  onClick: (_: MenuedOutlet) => void;
}

const SelectableMenu: React.FC<SelectableMenuProps> = ({ mo, onClick }) => {
  const { outlet, menu } = mo;

  return (
    <Card onClick={() => onClick(mo)}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {outlet.name}
        </Typography>
        <Typography variant="h5" component="div"></Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary"></Typography>
        <Typography variant="body2"></Typography>
      </CardContent>
    </Card>
  );
};

const SelectableMenuedOutlets: React.FC<SelectableMenusProps> = ({
  selectableMenuedOutlets,
  onClick,
}) => {
  return (
    <>
      {selectableMenuedOutlets.map((mo) => (
        <SelectableMenu
          key={`${mo.outlet.name}-${mo.outlet.postalCode}`}
          mo={mo}
          onClick={onClick}
        />
      ))}
    </>
  );
};
export default SelectableMenuedOutlets;
