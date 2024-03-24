import { useEffect, useRef, useState } from "react";

import { Repository } from "../lib/repository/Repository";
import { useSettingsContext } from "../contexts/SettingsContextProvider";
import { TripModel } from "../lib/repository/TripModels";
import { CircularProgress, Stack } from "@mui/joy";
import TripPage from "./TripPage";
import useUserEffect from "../lib/UserEffect";

export default function TripPageContainer() {
  const repository = Repository.getInstance();
  const { settings } = useSettingsContext();
  const [currentTrip, setCurrentTrip] = useState<TripModel | null>(null);

  //  Watch for the current user. Keep a ref of whether startup has be run.
  const startupHasRunRef = useRef(false);
  const [user] = useUserEffect(repository);

  //  TODO load the draft if it exists.
  //  On load, create the current trip draft. If we later see the user is logged
  //  in from the user effect, we'll load the current trip instead.
  useEffect(() => {
    const startup = async () => {
      //  Only run the 'startup' logic once.
      const trip = await repository.trips.createOrLoadCurrentTrip(
        user,
        window.localStorage,
      );
      setCurrentTrip(trip);
    };
    if (startupHasRunRef.current === false) {
      startup();
      startupHasRunRef.current = true;
    }
  }, [user]);

  //  Watch for changes when we set a new current trip.
  useEffect(() => {
    //  Don't watch null trips.
    if (!currentTrip?.id) {
      return;
    }
    return repository.trips.subscribeToChanges(
      currentTrip.id,
      currentTrip.isDraft,
      (trip) => setCurrentTrip(trip),
    );
  }, [currentTrip]);

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
      onTripChanged={onTripChanged}
      units={settings.units}
      startDate={currentTrip.startDate.toDate()}
      endDate={currentTrip.endDate.toDate()}
    />
  );
}
