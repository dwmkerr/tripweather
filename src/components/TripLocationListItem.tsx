import {
  CircularProgress,
  ListItem,
  ListItemContent,
  ListItemDecorator,
  Stack,
  Typography,
} from "@mui/joy";
import PlaceIcon from "@mui/icons-material/Place";
import { AddressSearchStatus, TripLocation } from "../lib/Location";

export interface TripLocationListItemProps {
  location: TripLocation;
}

export default function TripLocationListItem({
  location,
}: TripLocationListItemProps) {
  return (
    <ListItem key={location.id}>
      <ListItemDecorator>
        <PlaceIcon />
      </ListItemDecorator>
      <ListItemContent>
        <Stack direction="column" spacing={2}>
          <Typography>{location.originalSearch.address}</Typography>
          {location.addressSearchStatus !== AddressSearchStatus.Complete && (
            <Stack direction="row" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Stack>
          )}
          {location.candidate !== undefined && (
            <Typography level="body-sm">
              Latitude: {location.candidate?.location.x}, Longitude:{" "}
              {location.candidate?.location.y}
            </Typography>
          )}
        </Stack>
      </ListItemContent>
    </ListItem>
  );
}
