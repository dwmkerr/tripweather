import { useState } from "react";
import IconButton from "@mui/joy/IconButton";
import ArrowForward from "@mui/icons-material/ArrowForward";

import { TripLocation } from "../../lib/Location";
import { useAlertContext } from "../AlertContext";
import { Repository } from "../../lib/repository/Repository";
import { Input, Stack } from "@mui/joy";
import { TripWeatherError } from "../../lib/Errors";

export interface GPSSearchInputProps {
  onSelectLocation: (location: TripLocation) => void;
}

export default function GPSSearchInput({
  onSelectLocation,
}: GPSSearchInputProps) {
  const repository = Repository.getInstance();

  const { setAlertFromError } = useAlertContext();
  const [coordinates, setCoordinates] = useState<string>("");
  const [searching, setSearching] = useState<boolean>(false);

  const buildLabel = (coordinates: string) => {
    const [latitudeStr, longitudeStr] = coordinates.split(",");
    const latitude = Number.parseFloat(latitudeStr).toFixed(3) + "...";
    const longitude = Number.parseFloat(longitudeStr).toFixed(3) + "...";
    return latitude + ", " + longitude;
  };

  const selectCoordinates = async (coordinates: string) => {
    setSearching(true);

    try {
      //  Note that google maps uses lat/long so that's what we'll assume the
      //  data entry is is in the same format.
      const [latitudeStr, longitudeStr] = coordinates.split(",");
      const latitude = Number.parseFloat(latitudeStr);
      const longitude = Number.parseFloat(longitudeStr);
      const result = await repository.functions.reverseGeocode({
        longitude,
        latitude,
      });
      const { candidate } = result.data;
      const location: TripLocation = {
        id: crypto.randomUUID(),
        label: buildLabel(coordinates),
        originalSearch: {
          address: "",
          magicKey: "",
          gps: coordinates,
        },
        location: {
          address: candidate.address,
          latitude: candidate.location.x,
          longitude: candidate.location.y,
        },
        datesWeather: [],
      };
      onSelectLocation(location);
    } catch (err) {
      setAlertFromError(TripWeatherError.fromError("GPS Search Error", err));
    } finally {
      setSearching(false);
    }
  };

  return (
    <Stack direction="row" spacing={1}>
      <Input
        size="lg"
        sx={{ flex: "auto" }}
        placeholder="Latitude, Longitude, e.g. 54.318, -2.792"
        disabled={searching}
        value={coordinates}
        onChange={(event) => setCoordinates(event.target.value)}
      />
      <IconButton
        size="lg"
        variant="solid"
        color="primary"
        onClick={() => selectCoordinates(coordinates)}
        loading={searching}
      >
        <ArrowForward />
      </IconButton>
    </Stack>
  );
}
