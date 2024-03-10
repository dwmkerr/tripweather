import { Fragment, useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";

import { TripLocation, WeatherStatus } from "../lib/repository/TripModels";
import { Repository } from "../lib/repository/Repository";
import LocationGrid from "../components/LocationWeatherGrid/LocationWeatherGrid";
import SearchBar from "../components/SearchBar/SearchBar";
import { getMidnightDates } from "../lib/Time";
import { useAlertContext } from "../components/AlertContext";
import { TripWeatherError } from "../lib/Errors";
import Footer from "../components/Footer";
import {
  FavoriteLocationModel,
  findFavoriteLocationFromTripLocation,
  findTripLocationFromFavoriteLocation,
} from "../lib/repository/RepositoryModels";
import useUserEffect from "../lib/UserEffect";
import { TripModel } from "../lib/repository/TripModels";
import { hydrateDatesWeather } from "../lib/weather/HydrateDatesWeather";
import { WeatherUnits } from "../../functions/src/weather/PirateWeatherTypes";

export interface TripPageProps {
  trip: TripModel;
  startDate: Date;
  onStartDateChange: (startDate: Date) => void;
  endDate: Date;
  onEndDateChange: (endDate: Date) => void;
  units: WeatherUnits;
}

export default function TripPage({
  trip,
  units,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: TripPageProps) {
  const repository = Repository.getInstance();
  const { setAlertFromError } = useAlertContext();

  const [locations, setLocations] = useState<TripLocation[]>(trip.locations);
  const [favoriteLocations, setFavoriteLocations] = useState<
    FavoriteLocationModel[]
  >([]);
  const [unselectedFavoriteLocations, setUnselectedFavoriteLocations] =
    useState<FavoriteLocationModel[]>([]);

  //  On load, wait for the user and watch for changes.
  const [user] = useUserEffect(repository);

  //  Helper function to update a single location.
  const updateLocation = (location: TripLocation) => {
    setLocations((previousLocations) => {
      return previousLocations.map((pl) =>
        pl.id === location.id ? location : pl,
      );
    });
  };

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

  //  When our current trip locations or favourite locations change, create the
  //  set of unselected favorites that the search bar can add.
  useEffect(() => {
    const filteredLocations = favoriteLocations.filter(
      (fl) => findTripLocationFromFavoriteLocation(fl, locations) === undefined,
    );
    setUnselectedFavoriteLocations(filteredLocations);
  }, [locations, favoriteLocations]);

  useEffect(() => {
    //  If the units have changed, we should mark everything as loading.
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

    //  Hydrate the weather values. This is async but the 'updateLocationState'
    //  function we pass in will update our state.
    hydrateDatesWeather(
      repository,
      locations,
      startDate,
      endDate,
      units,
      updateLocation,
    );
  }, [units]);

  const onSelectLocation = async (location: TripLocation) => {
    const dates = getMidnightDates(startDate, endDate);
    const newLocations = [...locations, location].map((l) => {
      if (l.id !== location.id) {
        return l;
      }
      return {
        ...l,
        datesWeather: dates.map((date) => ({
          date,
          weatherStatus: WeatherStatus.Loading,
          updated: null,
        })),
      };
    });

    //  Update location with the (initially empty) weather.
    setLocations(newLocations);
    await hydrateDatesWeather(
      repository,
      newLocations,
      startDate,
      endDate,
      units,
      updateLocation,
    );
  };

  const onDeleteLocation = async (location: TripLocation) => {
    setLocations((locations) => locations.filter((l) => l.id !== location.id));
  };

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
            startDate={startDate}
            onStartDateChange={onStartDateChange}
            endDate={endDate}
            onEndDateChange={onEndDateChange}
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
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <Footer />
      </Box>
    </Fragment>
  );
}
