import { GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Stack, Typography } from "@mui/joy";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { TripLocation } from "../../lib/repository/TripModels";
import { LocationRow } from "./LocationRow";
import { ReactNode, useState } from "react";
import { DeleteLocationFunc } from "./Actions";

export interface ActionsCellProps {
  location: TripLocation;
  onDeleteLocation: DeleteLocationFunc;
}

export function ActionsCell({ location, onDeleteLocation }: ActionsCellProps) {
  const [deleting, setDeleting] = useState(false);

  const deleteLocation = async (location: TripLocation) => {
    setDeleting(true);
    await onDeleteLocation(location);
    setDeleting(false);
  };

  return (
    <Stack direction="row" spacing={1}>
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
    </Stack>
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
