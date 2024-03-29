import IconButton from "@mui/joy/IconButton";
import ToggleButtonGroup from "@mui/joy/ToggleButtonGroup";

import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import { Tooltip } from "@mui/joy";

export enum SearchMode {
  Address = "address",
  GPS = "gps",
  Favorite = "favorite",
}

export interface SearchModeToggleGroupProps {
  searchMode: SearchMode;
  onChange: (searchMode: SearchMode) => void;
}

export default function SearchModeToggleGroup(
  props: SearchModeToggleGroupProps,
) {
  return (
    <ToggleButtonGroup
      value={props.searchMode}
      onChange={(event, newValue) => {
        if (newValue !== null) {
          props.onChange(newValue);
        }
      }}
    >
      <Tooltip title="Address" variant="outlined">
        <IconButton value={SearchMode.Address}>
          <EditLocationAltIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="GPS Coordinate" variant="outlined">
        <IconButton value={SearchMode.GPS}>
          <GpsFixedIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Favorite" variant="outlined">
        <IconButton value={SearchMode.Favorite}>
          <FavoriteBorderIcon />
        </IconButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
}
