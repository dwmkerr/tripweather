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
import WeatherIcon from "./WeatherIcon/WeatherIcon";
import { Fragment } from "react";

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
          {location.weather && (
            <Fragment>
              <WeatherIcon weather={location.weather.icon} size={32} />
              <Typography level="body-xs">
                {location.weather.summary}
              </Typography>
            </Fragment>
          )}
        </Stack>
      </ListItemContent>
    </ListItem>
  );
}
