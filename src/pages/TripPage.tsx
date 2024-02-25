import { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";

import { TripLocation, WeatherStatus } from "../lib/Location";
import { Suggestion } from "../../functions/src/arcgis";
import { Repository } from "../lib/Repository";
import LocationGrid from "../components/LocationGrid";
import SearchBar from "../components/SearchBar";
import { useSettingsContext } from "../contexts/SettingsContextProvider";
import { getMidnightDates } from "../lib/Time";
import { WeatherResponse } from "../../functions/src/weather/weather";

export default function TripPage() {
  const repository = Repository.getInstance();
  const { settings } = useSettingsContext();

  useState<Suggestion | null>(null);
  const [locations, setLocations] = useState<TripLocation[]>([]);

  useEffect(() => {
    const hydrateDatesWeather = async () => {
      const dates = getMidnightDates(settings.startDate, settings.endDate);
      const updateLocationDatesWeather = locations.map(async (location) => {
        return dates.map(async (date) => {
          let weatherResponse: WeatherResponse | undefined = undefined;
          try {
            weatherResponse = (
              await repository.functions.weather({
                latitude: location.latitude,
                longitude: location.longitude,
                date: date.toISOString(),
              })
            ).data;
          } catch (err) {
            console.error(
              `Error getting weather for ${location.latitude},${location.longitude} on ${date}`,
              err,
            );
          }

          let anyChanges = false;
          const newLocations = locations.map((l) => {
            if (l.id !== location.id) {
              return l;
            }
            //  Update the arrays of dates, filling in the weather for the
            //  date we've just loaded.
            const existingDate = location.datesWeather.find(
              (d) => d.date.getDate() === date.getDate(),
            );
            //  If there are no changes for a date, return the location.
            if (
              existingDate &&
              existingDate.weatherStatus !== WeatherStatus.Loading
            ) {
              return l;
            }

            if (existingDate) {
              existingDate.weatherStatus = weatherResponse
                ? WeatherStatus.Loaded
                : WeatherStatus.Error;
              existingDate.weather = weatherResponse?.weather;
            } else {
              location.datesWeather.push({
                date,
                weatherStatus: weatherResponse
                  ? WeatherStatus.Loaded
                  : WeatherStatus.Error,
                weather: weatherResponse?.weather,
              });
              //  We've changed the data.
            }
            anyChanges = true;
            return l;
          });

          if (anyChanges) {
            setLocations(newLocations);
          }
        });
      });

      await Promise.all(updateLocationDatesWeather.flat());
    };
    hydrateDatesWeather();
  }, [locations, settings]);

  const onSelectLocation = async (location: TripLocation) => {
    setLocations([...locations, location]);

    //  Update location with the (initially empty) weather.
    const dates = getMidnightDates(settings.startDate, settings.endDate);
    setLocations((previousLocations) => {
      return previousLocations.map((l) => {
        if (l.id !== location.id) {
          return l;
        }
        return {
          ...l,
          datesWeather: dates.map((date) => ({
            date,
            weatherStatus: WeatherStatus.Loading,
          })),
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
