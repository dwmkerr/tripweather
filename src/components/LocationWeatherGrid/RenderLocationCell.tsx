import { GridRenderCellParams } from "@mui/x-data-grid";
import { CircularProgress, IconButton, Stack, Typography } from "@mui/joy";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { TripLocation } from "../../lib/Location";
import { LocationRow } from "./LocationRow";
import { ReactNode, useState } from "react";
import { CheckFavoriteLocationFunc, RenameLocationLabelFunc } from "./Actions";

export interface LocationCellProps {
  location: TripLocation;
  onRenameLocationLabel: RenameLocationLabelFunc;
  isFavorite: boolean;
  onCheckFavorite: (checked: boolean) => Promise<void>;
}

export function LocationCell({
  location,
  onRenameLocationLabel,
  isFavorite,
  onCheckFavorite,
}: LocationCellProps) {
  const [renaming, setRenaming] = useState(false);
  const [label, setLabel] = useState(location.label);
  const [favoriting, setFavoriting] = useState(false);

  //  TODO: work to do here.
  const renameLocation = async (location: TripLocation, label: string) => {
    setRenaming(true);
    setLabel(label);
    await onRenameLocationLabel(location, label);
    setRenaming(false);
  };

  const checkFavorite = async (check: boolean) => {
    setFavoriting(true);
    await onCheckFavorite(check);
    setFavoriting(false);
  };

  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <IconButton
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        size="md"
        variant="plain"
        color={isFavorite ? "danger" : "neutral"}
        loading={favoriting}
        onClick={() => checkFavorite(!isFavorite)}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        spacing={1}
        padding={1}
      >
        {renaming && <CircularProgress />}
        <Typography level="body-sm" fontWeight="bold">
          {label}
        </Typography>
        <Typography level="body-xs">{location.location.address}</Typography>
      </Stack>
    </Stack>
  );
}

export default function renderLocationCell(
  params: GridRenderCellParams<LocationRow, TripLocation>,
  onRenameLocationLabel: RenameLocationLabelFunc,
  isFavorite: boolean,
  onCheckFavorite: CheckFavoriteLocationFunc,
): ReactNode {
  const location = params.value;
  if (location === undefined) {
    return <Typography color="danger">Undefined Cell Value</Typography>;
  }
  return (
    <LocationCell
      location={location}
      onRenameLocationLabel={onRenameLocationLabel}
      isFavorite={isFavorite}
      onCheckFavorite={async (checked: boolean) =>
        await onCheckFavorite(checked, location)
      }
    />
  );
}
