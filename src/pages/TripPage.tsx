import { Fragment, useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import moment from "moment";

import { TripLocation, WeatherStatus } from "../lib/Location";
import { Repository } from "../lib/repository/Repository";
import LocationGrid from "../components/LocationWeatherGrid/LocationWeatherGrid";
import SearchBar from "../components/SearchBar/SearchBar";
import { useSettingsContext } from "../contexts/SettingsContextProvider";
import { getMidnightDates } from "../lib/Time";
import { useAlertContext } from "../components/AlertContext";
import { TripWeatherError } from "../lib/Errors";
import { updateLocationWeatherDates } from "../lib/TripLocationWeather";
import Footer from "../components/Footer";
import {
  FavoriteLocationModel,
  findFavoriteLocationFromTripLocation,
  findTripLocationFromFavoriteLocation,
} from "../lib/repository/RepositoryModels";
import useUserEffect from "../lib/UserEffect";

export default function TripPage() {
  const repository = Repository.getInstance();
  const { settings } = useSettingsContext();
  const { setAlertFromError } = useAlertContext();

  const [locations, setLocations] = useState<TripLocation[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<
    FavoriteLocationModel[]
  >([]);
  const [unselectedFavoriteLocations, setUnselectedFavoriteLocations] =
    useState<FavoriteLocationModel[]>([]);

  //  On load, wait for the user and watch for changes.
  const [user] = useUserEffect(repository);

  //  On user, watch for changes to the favorite locations.
  useEffect(() => {
    //  Only watch for changes to favorites if we're logged in.
    //  If the user is logged out ensure we have no favorite locations (i.e.
    //  clear any we had).
    if (!user) {
      setFavoriteLocations([]);
      return;
    }
    return repository.favoriteLocations.subscribe((favoriteLocations) => {
      setFavoriteLocations(favoriteLocations);
    });
  }, [user]);

  //  When our trip locations or favourite locations change, create the set of
  //  unselected favorites that the search bar can add.
  useEffect(() => {
    const filteredLocations = favoriteLocations.filter(
      (fl) => findTripLocationFromFavoriteLocation(fl, locations) === undefined,
    );
    setUnselectedFavoriteLocations(filteredLocations);
  }, [locations, favoriteLocations]);

  //  Get weather data, or if missing show an alert.
  const getWeather = async (
    longitude: number,
    latitude: number,
    startDate: Date,
  ) => {
    try {
      return (
        await repository.functions.weather({
          longitude: longitude,
          latitude: latitude,
          date: startDate.toISOString(),
          units: settings.units,
        })
      ).data;
      //  Errors are always of type 'any' so disable the warning.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setAlertFromError(
        new TripWeatherError(
          "Error Getting Weather Data",
          `Error getting weather for ${longitude},${latitude} on ${startDate}`,
          err,
        ),
      );
      return null;
    }
  };

  //  TODO extract.
  const hydrateDatesWeather = async (locations: TripLocation[]) => {
    //  Get our date range. We currently will only use the start date as the
    //  weather API will always return 7 days of data.
    const dates = getMidnightDates(settings.startDate, settings.endDate);
    const startDate = dates[0];

    await Promise.all(
      locations.map(async (location) => {
        //  Take a location add any dates that are missing, and sort the dates.
        //  Will not remove data for existing valid dates.
        const locationWithWeatherDataPlaceholders = updateLocationWeatherDates(
          location,
          true, // keep any existing dates not in our range
          dates,
        );

        //  Try and get the weather. If we couldn't then we'll set the error
        //  state for each of the weather values.
        const weatherResponseOrNull = await getWeather(
          location.location.longitude,
          location.location.latitude,
          startDate,
        );

        //  If the weather response is null, we have shown an error alert.
        //  Now just set the state of any weather dates in the location that
        //  have not been loaded to 'error' and return it.
        if (weatherResponseOrNull === null) {
          return {
            ...location,
            datesWeather: location.datesWeather.map((dw) =>
              dw.weatherStatus === WeatherStatus.Loaded
                ? {
                    ...dw,
                    weatherStatus: WeatherStatus.Error,
                  }
                : dw,
            ),
          };
        }

        //  We're now sure we've got valid weather data. Go through each
        //  WeatherData for the location and enrich it.
        const weather = weatherResponseOrNull.weather;
        const updatedDateWeathers =
          locationWithWeatherDataPlaceholders.datesWeather.map((dw) => {
            const weatherData = weather.daily.data.find((daily) =>
              moment.unix(daily.time).isSame(moment(dw.date), "date"),
            );
            if (!weatherData) {
              setAlertFromError(
                new TripWeatherError(
                  "Unable to map Weather Data",
                  `Cannot find requested weather data for date ${dw.date}`,
                ),
              );
              return {
                ...dw,
                weatherStatus: WeatherStatus.Error,
              };
            }
            return {
              ...dw,
              weatherStatus: WeatherStatus.Loaded,
              weather: weatherData,
            };
          });

        //  Set the updated location.
        setLocations((previousLocations) => {
          return previousLocations.map((pl) =>
            pl.id === location.id
              ? {
                  ...location,
                  datesWeather: updatedDateWeathers,
                }
              : pl,
          );
        });
      }),
    );
  };

  useEffect(() => {
    //  If the settings/days have changed, we should mark everything as loading.
    setLocations(
      locations.map(
        (location): TripLocation => ({
          ...location,
          datesWeather: location.datesWeather.map((dw) => ({
            ...dw,
            weatherStatus: WeatherStatus.Loading,
          })),
        }),
      ),
    );

    //  Hydrate the weather values.
    hydrateDatesWeather(locations);
  }, [settings]);

  const onSelectLocation = async (location: TripLocation) => {
    const dates = getMidnightDates(settings.startDate, settings.endDate);
    const newLocations = [...locations, location].map((l) => {
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

    //  Update location with the (initially empty) weather.
    setLocations(newLocations);
    await hydrateDatesWeather(newLocations);
  };

  const onDeleteLocation = async (location: TripLocation) => {
    setLocations((locations) => locations.filter((l) => l.id !== location.id));
  };

  // TODO: maybe extract into user state provider.
  // const ensureLoggedIn = async (
  //   title: string,
  //   message: string,
  //   action: (user: User | null) => Promise<void>,
  // ) => {
  //   //  TODO bug same state issue as below - this is not using our user state.
  //   const user = repository.getUser();
  //   if (user) {
  //     return null;
  //   }
  //   setAlertInfo({
  //     title,
  //     type: AlertType.Warning,
  //     displayMode: AlertDisplayMode.Modal,
  //     message,
  //     actions: [
  //       {
  //         title: "Sign In",
  //         onClick: async () => {
  //           const user = await repository.signInWithGoogle();
  //           await action(user);
  //         },
  //       },
  //     ],
  //   });
  // };

  const onAddFavoriteLocation = async (location: TripLocation) => {
    //  TODO: until we fix the user state bug, don't ensure login.
    // await ensureLoggedIn(
    //   "Sign in for Favorites",
    //   "You must be signed in to save favorites",
    //   async (user) => {
    //     if (!user) {
    //       return;
    //     }
    //  Add a new favorite location to the colleciton.
    const favoriteLocation: Omit<FavoriteLocationModel, "id" | "userId"> = {
      label: location.label,
      originalSearch: location.originalSearch,
      location: location.location,
    };
    repository.favoriteLocations.create(favoriteLocation);
    //   },
    // );
  };

  //  TODO: bug - whether I use this function as-is, or use 'useCallback', the
  //  favoriteLocations array is empty, this seems to be a state management bug
  //  in my code. For now we instead load the favorite locations.
  const onRemoveFavoriteLocation = async (location: TripLocation) => {
    const favoriteLocations = await repository.favoriteLocations.load();
    const fl = findFavoriteLocationFromTripLocation(
      location,
      favoriteLocations,
    );
    if (fl === undefined) {
      setAlertFromError(
        new TripWeatherError(
          "Favorite Error",
          "Cannot find favorite for location",
        ),
      );
      return;
    }
    repository.favoriteLocations.delete(fl.id);
  };

  const onRenameLocationLabel = async (
    location: TripLocation,
    label: string,
  ) => {
    setLocations((locations) =>
      locations.map((l) =>
        l.id !== location.id ? location : { ...location, label },
      ),
    );
  };

  return (
    <Fragment>
      <Grid
        spacing={2}
        justifyContent="flex-start"
        sx={{
          maxWidth: 1024,
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: 2,
        }}
      >
        <Grid xs={12}>
          <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
            Start by searching for a location or adding a GPS coordinate, then
            add as many other locations to compare as you like!
          </Typography>
        </Grid>
        <Grid xs={12}>
          <SearchBar
            onSelectLocation={onSelectLocation}
            favoriteLocations={unselectedFavoriteLocations}
          />
        </Grid>
      </Grid>
      <Box sx={{ width: "100%", flexGrow: 1 }}>
        <LocationGrid
          locations={locations}
          favoriteLocations={favoriteLocations}
          onDeleteLocation={onDeleteLocation}
          onAddFavoriteLocation={onAddFavoriteLocation}
          onRemoveFavoriteLocation={onRemoveFavoriteLocation}
          onRenameLocationLabel={onRenameLocationLabel}
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <Footer />
      </Box>
    </Fragment>
  );
}
