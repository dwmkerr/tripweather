import { useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";

import {
  AddressSearchStatus,
  DateWeather,
  TripLocation,
  WeatherStatus,
} from "../lib/Location";
import { Suggestion } from "../../functions/src/arcgis";
import { Repository } from "../lib/Repository";
import LocationGrid from "../components/LocationGrid";
import SearchBar from "../components/SearchBar";

export default function TripPage() {
  const repository = Repository.getInstance();

  useState<Suggestion | null>(null);
  const [locations, setLocations] = useState<TripLocation[]>([]);
  const onSelectLocation = async (location: TripLocation) => {
    setLocations([...locations, location]);

    //  Hydrate the address.
    const result = await repository.functions.findAddress({
      singleLineAddress: location.originalSearch.address,
      magicKey: location.originalSearch.magicKey,
    });

    //  Hydate the weather.
    const latitude = result.data.candidates[0].location.x;
    const longitude = result.data.candidates[0].location.x;

    const getWeatherCalls = location.datesWeather.map(
      async ({ date }): Promise<DateWeather> => {
        try {
          const weatherResponse = await repository.functions.weather({
            latitude,
            longitude,
            date,
          });
          return {
            weatherStatus: WeatherStatus.Loaded,
            date: weatherResponse.data.date,
            weather: weatherResponse.data.weather,
          };
        } catch (error) {
          console.error(
            `Error getting weather for ${latitude},${longitude} on ${date}`,
            error,
          );
          return {
            date,
            weatherStatus: WeatherStatus.Error,
            weather: undefined,
          };
        }
      },
    );
    const datesWeather = await Promise.all(getWeatherCalls);

    //  Update the location with the address and weather.
    setLocations((previousLocations) => {
      return previousLocations.map((l) => {
        if (l.id !== location.id) {
          return l;
        }
        return {
          ...l,
          addressSearchStatus: AddressSearchStatus.Complete,
          candidate: result.data.candidates[0],
          weatherStatus: WeatherStatus.Loaded,
          datesWeather,
        };
      });
    });
  };

  return (
    <Grid
      spacing={2}
      sx={{
        flexGrow: 1,
        maxWidth: 1024,
        marginLeft: "auto",
        marginRight: "auto",
        paddingTop: 2,
      }}
    >
      <Grid xs={12}>
        <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
          Start by searching for a location or adding a GPS coordinate, then add
          as many other locations to compare as you like!
        </Typography>
      </Grid>
      <Grid xs={12}>
        <SearchBar onSelectLocation={onSelectLocation} />
      </Grid>
      <Box sx={{ height: 400, width: "100%" }}>
        <LocationGrid locations={locations} />
      </Box>
    </Grid>
  );
}
