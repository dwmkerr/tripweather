import { GridRenderCellParams } from "@mui/x-data-grid";
import { CircularProgress, Stack, Typography } from "@mui/joy";

import { TripLocation } from "../../lib/Location";
import { LocationRow } from "./LocationRow";
import { ReactNode, useState } from "react";
import { RenameLocationLabelFunc } from "./Actions";

export interface LocationCellProps {
  location: TripLocation;
  onRenameLocationLabel: RenameLocationLabelFunc;
}

export function LocationCell({
  location,
  onRenameLocationLabel,
}: LocationCellProps) {
  const [renaming, setRenaming] = useState(false);
  const [label, setLabel] = useState(location.label);

  //  TODO: work to do here.
  const renameLocation = async (location: TripLocation, label: string) => {
    setRenaming(true);
    setLabel(label);
    await onRenameLocationLabel(location, label);
    setRenaming(false);
  };

  return (
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
  );
}

export default function renderLocationCell(
  params: GridRenderCellParams<LocationRow, TripLocation>,
  onRenameLocationLabel: RenameLocationLabelFunc,
): ReactNode {
  const location = params.value;
  if (location === undefined) {
    return <Typography color="danger">Undefined Cell Value</Typography>;
  }
  return (
    <LocationCell
      location={location}
      onRenameLocationLabel={onRenameLocationLabel}
    />
  );
}
