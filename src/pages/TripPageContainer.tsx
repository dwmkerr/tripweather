import { useEffect, useRef, useState } from "react";

import { Repository } from "../lib/repository/Repository";
import { useSettingsContext } from "../contexts/SettingsContextProvider";
import { CircularProgress, Stack } from "@mui/joy";
import TripPage from "./TripPage";
import useUserEffect from "../lib/UserEffect";
import { startUpdateWeather } from "../lib/weather/HydrateDatesWeather";
import {
  DateWeather,
  LocationDateWeather,
  TripModel,
} from "../lib/repository/TripModels";

interface TripIdentifier {
  id: string;
  isDraft: boolean;
}

export default function TripPageContainer() {
  const repository = Repository.getInstance();
  const { settings } = useSettingsContext();
  const [currentTripIdentifier, setCurrentTripIdentifier] =
    useState<TripIdentifier | null>(null);
  const [currentTrip, setCurrentTrip] = useState<TripModel | null>(null);

  //  The weather data, updated when the current trip changes.
  const [weatherData, setWeatherData] = useState<LocationDateWeather>(
    new Map<string, DateWeather>(),
  );

  //  Watch for the current user. Keep a ref of whether startup has be run.
  const startupHasRunRef = useRef(false);
  const [user] = useUserEffect(repository);

  //  On load, create the current trip draft. If we later see the user is logged
  //  in from the user effect, we'll load the current trip instead.
  useEffect(() => {
    const startup = async () => {
      //  Create or load the current trip, then set the trip identifier. After
      //  this is set another effect will watch it for changes.
      const trip = await repository.trips.createOrLoadCurrentTrip(
        user,
        window.localStorage,
      );
      setCurrentTripIdentifier({ id: trip.id, isDraft: trip.isDraft });
    };
    if (startupHasRunRef.current === false) {
      //  Only run the 'startup' logic once.
      startup();
      startupHasRunRef.current = true;
    }
  }, [user]);

  //  When the current trip identifier changes, watch the trip for changes.
  useEffect(() => {
    if (currentTripIdentifier === null) {
      return;
    }

    //  Subscribe to changes in the current trip.
    const unsubscribe = repository.trips.subscribeToChanges(
      currentTripIdentifier.id,
      currentTripIdentifier.isDraft,
      (trip) => {
        setCurrentTrip(trip);
        console.log(
          `tripweather: trip updated with ${trip.locations.length} locations`,
        );

        //  Fetch weather data for the updated trip.
        const fetchWeatherData = async () => {
          const result = startUpdateWeather(
            trip.locations,
            trip.startDate.toDate(),
            trip.endDate.toDate(),
          );
          setWeatherData(result);
        };
        fetchWeatherData();
      },
    );

    return () => {
      //  Clean up the subscription when the component unmounts or when
      //  currentTripIdentifier changes.
      unsubscribe();
    };
  }, [currentTripIdentifier]);

  const onTripChanged = async (
    trip: Partial<TripModel>,
  ): Promise<TripModel> => {
    if (!currentTrip) {
      throw new Error("current trip is null");
    }
    await repository.trips.update(currentTrip, trip);
    return { ...currentTrip, ...trip };
  };

  return currentTrip === null ? (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <CircularProgress />
    </Stack>
  ) : (
    <TripPage
      trip={currentTrip}
      weather={weatherData}
      onTripChanged={onTripChanged}
      units={settings.units}
      startDate={currentTrip.startDate.toDate()}
      endDate={currentTrip.endDate.toDate()}
    />
  );
}
