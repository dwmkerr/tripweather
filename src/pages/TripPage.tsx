import { Fragment, useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";

import { TripLocation, WeatherStatus } from "../lib/Location";
import { Repository } from "../lib/repository/Repository";
import LocationGrid from "../components/LocationWeatherGrid/LocationWeatherGrid";
import SearchBar from "../components/SearchBar/SearchBar";
import { useSettingsContext } from "../contexts/SettingsContextProvider";
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

export default function TripPage() {
  const repository = Repository.getInstance();
  const { settings } = useSettingsContext();
  const { setAlertFromError } = useAlertContext();

  const [currentTrip, setCurrentTrip] = useState<TripModel | null>(null);
  const [startDate, setStartDate] = useState<Date>(settings.startDate);
  const [endDate, setEndDate] = useState<Date>(settings.endDate);
  const [locations, setLocations] = useState<TripLocation[]>([]);
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

  //  On load, create the current trip draft. If we later see the user is logged
  //  in from the user effect, we'll load the current trip instead.
  useEffect(() => {
    const createDraftTrip = async () => {
      // const trip = await repository.trips.createCurrentTripDraft(
      //   "New Trip",
      //   startDate,
      //   endDate,
      // );
      setCurrentTrip(null); //trip);
    };
    createDraftTrip();
  }, []);

  //  Watch for changes when we set a new current trip.
  useEffect(() => {
    //  Don't watch null trips.
    if (!currentTrip?.id) {
      return;
    }
    return repository.trips.subscribeToChanges(currentTrip.id, (trip) =>
      setCurrentTrip(trip),
    );
  }, [currentTrip]);

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

    //  Hydrate the weather values. This is async but the 'updateLocationState'
    //  function we pass in will update our state.
    hydrateDatesWeather(
      repository,
      locations,
      settings.startDate,
      settings.endDate,
      settings.units,
      updateLocation,
    );
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
    await hydrateDatesWeather(
      repository,
      newLocations,
      settings.startDate,
      settings.endDate,
      settings.units,
      updateLocation,
    );
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
