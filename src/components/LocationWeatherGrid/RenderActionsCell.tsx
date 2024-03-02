import { GridRenderCellParams } from "@mui/x-data-grid";
import { Button, Stack, Typography } from "@mui/joy";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { TripLocation } from "../../lib/Location";
import { LocationRow } from "./LocationRow";
import { ReactNode, useState } from "react";
import { CheckFavoriteLocationFunc, DeleteLocationFunc } from "./Actions";

export interface ActionsCellProps {
  location: TripLocation;
  onDeleteLocation: DeleteLocationFunc;
  isFavorite: boolean;
  onCheckFavorite: (checked: boolean) => Promise<void>;
}

export function ActionsCell({
  location,
  onDeleteLocation,
  isFavorite,
  onCheckFavorite,
}: ActionsCellProps) {
  const [deleting, setDeleting] = useState(false);
  const [favoriting, setFavoriting] = useState(false);

  const deleteLocation = async (location: TripLocation) => {
    setDeleting(true);
    await onDeleteLocation(location);
    setDeleting(false);
  };

  const checkFavorite = async (check: boolean) => {
    setFavoriting(true);
    await onCheckFavorite(check);
    setFavoriting(false);
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
      <Button
        size="md"
        variant="outlined"
        color="primary"
        loading={favoriting}
        startDecorator={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        onClick={() => checkFavorite(!isFavorite)}
      >
        Favorite
      </Button>
    </Stack>
  );
}

export default function renderActionsCell(
  params: GridRenderCellParams<LocationRow, TripLocation>,
  onDeleteLocation: DeleteLocationFunc,
  isFavorite: boolean,
  onCheckFavorite: CheckFavoriteLocationFunc,
): ReactNode {
  const location = params.value;
  if (location === undefined) {
    return <Typography color="danger">Undefined Cell Value</Typography>;
  }
  return (
    <ActionsCell
      location={location}
      onDeleteLocation={onDeleteLocation}
      isFavorite={isFavorite}
      onCheckFavorite={async (checked: boolean) =>
        await onCheckFavorite(checked, location)
      }
    />
  );
}
