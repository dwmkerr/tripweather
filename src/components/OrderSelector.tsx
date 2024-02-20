import * as React from "react";
import MenuButton from "@mui/joy/MenuButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import Dropdown from "@mui/joy/Dropdown";
import { OrderByDirection } from "firebase/firestore";

export interface OrderSelectorProps {
  sortDirection: OrderByDirection;
  onSetSortDirection: (orderByDirection: OrderByDirection) => void;
}

export default function OrderSelector(props: OrderSelectorProps) {
  return (
    <Dropdown>
      <MenuButton
        variant="plain"
        color="primary"
        endDecorator={<ArrowDropDown />}
        sx={{ whiteSpace: "nowrap" }}
      >
        Sort
      </MenuButton>
      <Menu sx={{ minWidth: 120 }}>
        <MenuItem
          selected={props.sortDirection === "asc"}
          onClick={() => props.onSetSortDirection("asc")}
        >
          Ascending
        </MenuItem>
        <MenuItem
          selected={props.sortDirection === "desc"}
          onClick={() => props.onSetSortDirection("desc")}
        >
          Descending
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
