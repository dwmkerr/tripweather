import { useEffect, useState } from "react";
import IconButton from "@mui/joy/IconButton";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Autocomplete from "@mui/joy/Autocomplete";

import { TripLocation } from "../../lib/repository/TripModels";
import { Stack } from "@mui/joy";
import { FavoriteLocationModel } from "../../lib/repository/RepositoryModels";

export interface FavoriteLocationProps {
  favoriteLocations: FavoriteLocationModel[];
  onSelectLocation: (location: TripLocation) => void;
}

export default function FavoriteLocationInput({
  favoriteLocations,
  onSelectLocation,
}: FavoriteLocationProps) {
  const [selectedFavorite, setSelectedFavorite] =
    useState<FavoriteLocationModel | null>(null);
  const [enableAdd, setEnableAdd] = useState<boolean>(false);

  //  When a favorite is selected, enable the 'add' button.
  useEffect(() => {
    setEnableAdd(selectedFavorite !== null);
  }, [selectedFavorite]);

  const selectLocation = async (
    favoriteLocation: FavoriteLocationModel | null,
  ) => {
    if (!favoriteLocation) {
      return;
    }

    //  Add a new trip location, and then start the search for it's candidate
    //  addresses.
    const location: TripLocation = {
      id: crypto.randomUUID(),
      label: favoriteLocation.label,
      originalSearch: favoriteLocation.originalSearch,
      location: favoriteLocation.location,
      datesWeather: [],
    };
    onSelectLocation(location);
    setSelectedFavorite(null);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        selectLocation(selectedFavorite);
      }}
    >
      <Stack direction="row" spacing={1}>
        <Autocomplete
          options={favoriteLocations}
          value={selectedFavorite}
          onChange={(e, favorite) => setSelectedFavorite(favorite)}
        />
        <IconButton
          size="lg"
          variant="solid"
          color="primary"
          type="submit"
          disabled={!enableAdd}
          onClick={() => selectLocation(selectedFavorite)}
        >
          <ArrowForward />
        </IconButton>
      </Stack>
    </form>
  );
}
