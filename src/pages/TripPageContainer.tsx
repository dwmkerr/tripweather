import { useEffect, useState } from "react";

import { Repository } from "../lib/repository/Repository";
import { useSettingsContext } from "../contexts/SettingsContextProvider";
import { TripModel } from "../lib/repository/TripModels";
import { CircularProgress, Stack } from "@mui/joy";
import TripPage from "./TripPage";

export default function TripPageContainer() {
  const repository = Repository.getInstance();
  const { settings } = useSettingsContext();
  const [currentTrip, setCurrentTrip] = useState<TripModel | null>(null);

  //  On load, create the current trip draft. If we later see the user is logged
  //  in from the user effect, we'll load the current trip instead.
  useEffect(() => {
    const createDraftTrip = async () => {
      const trip = await repository.trips.createCurrentTripDraft(
        "New Trip",
        settings.startDate,
        settings.endDate,
      );
      setCurrentTrip(trip);
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
