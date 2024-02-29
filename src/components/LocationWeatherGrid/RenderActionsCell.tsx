import { GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Typography } from "@mui/joy";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { TripLocation } from "../../lib/Location";
import { LocationRow } from "./LocationRow";
import { ReactNode, useState } from "react";
import { DeleteLocationFunc } from "./Actions";

export interface WeatherCellProps {
  location: TripLocation;
  onDeleteLocation: DeleteLocationFunc;
}

export function ActionsCell({ location, onDeleteLocation }: WeatherCellProps) {
  const [deleting, setDeleting] = useState(false);

  const deleteLocation = async (location: TripLocation) => {
    setDeleting(true);
    await onDeleteLocation(location);
    setDeleting(false);
  };

  return (
    <Button
      size="md"
      variant="outlined"
      color="danger"
      loading={deleting}
      startDecorator={<DeleteOutlineIcon />}
      onClick={() => deleteLocation(location)}
    >
      Delete
    </Button>
  );
}

export default function renderActionsCell(
  params: GridRenderCellParams<LocationRow, TripLocation>,
  onDeleteLocation: DeleteLocationFunc,
): ReactNode {
  const location = params.value;
  if (location === undefined) {
    return <Typography color="danger">Undefined Cell Value</Typography>;
  }
  return (
    <ActionsCell location={location} onDeleteLocation={onDeleteLocation} />
  );
}
