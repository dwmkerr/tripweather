import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { NavLink } from "react-router-dom";

import HomeRounded from "@mui/icons-material/HomeRounded";
import LanguageIcon from "@mui/icons-material/Language";

export default function NavigationMenu() {
  return (
    <List
      role="menubar"
      orientation="horizontal"
      sx={{
        "--List-radius": "8px",
        "--List-padding": "4px",
        "--ListItem-gap": "0px",
      }}
    >
      <ListItem role="none">
        <NavLink
          to={""}
          style={({ isActive }) => {
            return {
              textDecoration: isActive ? "none" : "none",
            };
          }}
        >
          {({ isActive }) => (
            <ListItemButton role="menuitem" selected={isActive}>
              <ListItemDecorator>
                <HomeRounded />
              </ListItemDecorator>
              Welcome
            </ListItemButton>
          )}
        </NavLink>
      </ListItem>
      <ListItem role="none">
        <NavLink
          to={"trip"}
          style={({ isActive }) => {
            return {
              textDecoration: isActive ? "none" : "none",
            };
          }}
        >
          {({ isActive }) => (
            <ListItemButton role="menuitem" selected={isActive}>
              <ListItemDecorator>
                <LanguageIcon />
              </ListItemDecorator>
              Trip
            </ListItemButton>
          )}
        </NavLink>
      </ListItem>
    </List>
  );
}
