import { useEffect, useRef, useState } from "react";

import { Repository } from "../lib/repository/Repository";
import { useSettingsContext } from "../contexts/SettingsContextProvider";
import { TripModel } from "../lib/repository/TripModels";
import { CircularProgress, Stack } from "@mui/joy";
import TripPage from "./TripPage";
import useUserEffect from "../lib/UserEffect";
import { User } from "firebase/auth";

async function startup(
  repository: Repository,
  user: User | null,
): Promise<TripModel> {
  //  On startup we will:
  //  If the user is logged in:
  //  [ ] try and load their current trip
  //  [ ] create a new draft trip otherwise
  //  If the user is not logged in
  //  [ ] check local storage for a draft trip and load it
  //  [ ] create a new draft trip otherwise store it in the draft trips collection and store the id in local storage

  const today = new Date();
  const startDate = new Date(today.setDate(today.getDate() - 2));
  const endDate = new Date(today.setDate(today.getDate() + 5));

  if (user) {
    console.log("tripweather: todo load user current trip");
    const trip = await repository.trips.createCurrentTripDraft(
      "New Trip",
      startDate,
      endDate,
    );
    return trip;
  } else {
    console.log("tripweather: startup: creating current trip draft...");
    const trip = await repository.trips.createCurrentTripDraft(
      "New Trip",
      startDate,
      endDate,
    );
    return trip;
  }
}

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
    //  Only run the 'startup' logic once.
    if (startupHasRunRef.current === false) {
      startup(repository, user).then(setCurrentTrip);
      startupHasRunRef.current = true;
    }
  }, [user]);

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
      units={settings.units}
      startDate={currentTrip.startDate.toDate()}
      endDate={currentTrip.endDate.toDate()}
      onStartDateChange={() => undefined /*TODO*/}
      onEndDateChange={() => undefined /*TODO*/}
    />
  );
}
