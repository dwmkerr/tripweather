import { useEffect, useState } from "react";
import Box from "@mui/joy/Box";

import { TripLocation } from "../../lib/repository/TripModels";
import SearchModeToggleGroup, { SearchMode } from "./SearchModeToggleGroup";
import AddressSearchInput from "./AddressSearchInput";
import DateRangeInput from "./DateRangeInput";
import GPSSearchInput from "./GPSSearchInput";
import { FavoriteLocationModel } from "../../lib/repository/RepositoryModels";
import FavoriteLocationInput from "./FavoriteLocationInput";
import useUserEffect from "../../lib/UserEffect";
import { Repository } from "../../lib/repository/Repository";
import { AlertDisplayMode, AlertType, useAlertContext } from "../AlertContext";

export interface SearchBarProps {
  onSelectLocation: (location: TripLocation) => void;
  favoriteLocations: FavoriteLocationModel[];
  startDate: Date;
  onStartDateChange: (startDate: Date) => void;
  endDate: Date;
  onEndDateChange: (endDate: Date) => void;
}

export default function SearchBar({
  onSelectLocation,
  favoriteLocations,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: SearchBarProps) {
  const repository = Repository.getInstance();
  const { setAlertInfo } = useAlertContext();

  const [searchMode, setSearchMode] = useState<SearchMode>(SearchMode.Address);

  //  On load, wait for the user and watch for changes.
  const [user] = useUserEffect(repository);

  //  If the user logs out, switch off the favorite search mode.
  useEffect(() => {
    if (user === null) {
      setSearchMode(SearchMode.Address);
    }
  }, [user]);

  //  Safe-set search mode will only change to 'favorite' if the user is logged
  //  in.
  const safeSetSearchMode = (newSearchMode: SearchMode) => {
    //  If the search mode is favorites and the user is not logged in, warn them
    //  and ask them to sign in. If they don't sign in, revert the state back to
    //  the previous search mode.
    if (newSearchMode === SearchMode.Favorite && !user) {
      setAlertInfo({
        title: "Sign in for Favorites",
        type: AlertType.Warning,
        displayMode: AlertDisplayMode.Modal,
        message: "You must be signed in to see your favorite locations.",
        actions: [
          {
            title: "Sign In",
            onClick: async () => {
              //  Only if the user signs in do we proceed to set the search mode
              //  to favorites.
              const user = await repository.signInWithGoogle();
              setSearchMode(user !== null ? SearchMode.Favorite : searchMode);
            },
          },
        ],
      });
    } else {
      setSearchMode(newSearchMode);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        my: 2,
        alignSelf: "stretch",
        flexBasis: "80%",
      }}
    >
      <SearchModeToggleGroup
        searchMode={searchMode}
        onChange={safeSetSearchMode}
      />
      {searchMode === SearchMode.Address && (
        <AddressSearchInput
          onSelectLocation={onSelectLocation}
          debounceTimeout={500}
        />
      )}
      {searchMode === SearchMode.GPS && (
        <GPSSearchInput onSelectLocation={onSelectLocation} />
      )}
      {searchMode === SearchMode.Favorite && (
        <FavoriteLocationInput
          favoriteLocations={favoriteLocations}
          onSelectLocation={onSelectLocation}
        />
      )}
      <DateRangeInput
        startDate={startDate}
        onStartDateChange={onStartDateChange}
        endDate={endDate}
        onEndDateChange={onEndDateChange}
      />
    </Box>
  );
}
