import { ButtonGroup, Button, Container, Stack } from "@mui/material";
import * as React from "react";

import { TrulyImpure } from "../../../../utils/my-types";

import { SelectableMenu, SelectableMenuItem } from "../../../../utils/my-types";

import { Box, Grid } from "@mui/material";

interface SelectableMenuItemProps {
  mi: SelectableMenuItem;
  onClickInc: (_: number, __: SelectableMenuItem) => void;
  onClickDec: (_: number, __: SelectableMenuItem) => void;
  isReadOnly: boolean;
}

const SelectableMenuItem: React.FC<SelectableMenuItemProps> = ({
  mi,
  isReadOnly,
  onClickInc,
  onClickDec,
}) => {
  const { description, price, qty } = mi;

  return (
    <>
      <Grid
        key={`${description}-${price}-item-menu`}
        sx={{
          mt: 1,
          width: "95%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Grid
          sx={{
            width: "95%",
            display: "flex",
            mr: "auto",
            flexDirection: "column",
            textAlign: "left",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {[description, `@ ${price}`].map((d) => {
            return (
              <Grid
                sx={{
                  width: "100%",
                  display: "flex",
                  mr: "auto",
                  flexDirection: "column",
                  textAlign: "left",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                {d}
              </Grid>
            );
          })}
        </Grid>
        {isReadOnly ? (
          <>{qty}</>
        ) : (
          <ButtonGroup sx={{ ml: "auto" }}>
            <Button
              sx={{ border: 0, color: qty > 0 ? "" : "black" }}
              onClick={
                qty > 0
                  ? () => {
                      onClickDec(1, mi);
                    }
                  : () => {}
              }
            >
              -
            </Button>

            <Button sx={{ border: 0 }}>{qty}</Button>
            <Button
              sx={{ border: 0 }}
              onClick={() => {
                onClickInc(1, mi);
              }}
            >
              +
            </Button>
          </ButtonGroup>
        )}
      </Grid>
    </>
  );
};

interface SelectableMenuProps {
  selectableMenu: SelectableMenu;
  onClickInc: (_: number, __: SelectableMenuItem) => void;
  onClickDec: (_: number, __: SelectableMenuItem) => void;
  isReadOnlyOrder: boolean;
  toggleReadOnly: TrulyImpure;
}

const MenuSelection: React.FC<SelectableMenuProps> = ({
  selectableMenu,
  onClickDec,
  onClickInc,
  isReadOnlyOrder,
  toggleReadOnly,
}) => {
  return (
    <>
      <Grid
        sx={{
          mt: 1,
          p1: 1,
          borderTop: 1,
          justifyContent: "flex-start",
          flexDirection: "column",
          alignItems: "center",
          display: "flex",
          borderColor: "text.primary",
        }}
      >
        {selectableMenu &&
          selectableMenu.map((mi) => (
            <SelectableMenuItem
              isReadOnly={isReadOnlyOrder}
              key={`${mi.description}-${mi.price}`}
              mi={mi}
              onClickInc={onClickInc}
              onClickDec={onClickDec}
            />
          ))}

        {isReadOnlyOrder ? (
          <Button
            sx={{ bgcolor: "background.main", color: "black" }}
            onClick={toggleReadOnly}
          >
            Unfreeze Menu
          </Button>
        ) : (
          <Button
            sx={{ color: "background.default", bgcolor: "white" }}
            onClick={toggleReadOnly}
          >
            Freeze Menu
          </Button>
        )}
      </Grid>
    </>
  );
};
export default MenuSelection;
