import { useState } from "react";
import Box from "@mui/joy/Box";

import { TripLocation } from "../../lib/Location";
import { useSettingsContext } from "../../contexts/SettingsContextProvider";
import SearchModeToggleGroup, { SearchMode } from "./SearchModeToggleGroup";
import AddressSearchInput from "./AddressSearchInput";
import DateRangeInput from "./DateRangeInput";
import GPSSearchInput from "./GPSSearchInput";
import { FavoriteLocationModel } from "../../lib/repository/RepositoryModels";
import FavoriteLocationInput from "./FavoriteLocationInput";

export interface SearchBarProps {
  onSelectLocation: (location: TripLocation) => void;
  favoriteLocations: FavoriteLocationModel[];
}

export default function SearchBar({
  onSelectLocation,
  favoriteLocations,
}: SearchBarProps) {
  const { settings, setSettings } = useSettingsContext();
  const [searchMode, setSearchMode] = useState<SearchMode>(SearchMode.Address);

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        gap: 1,
        my: 2,
        alignSelf: "stretch",
        flexBasis: "80%",
      }}
    >
      <SearchModeToggleGroup searchMode={searchMode} onChange={setSearchMode} />
      {searchMode === SearchMode.Address && (
        <AddressSearchInput onSelectLocation={onSelectLocation} />
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
        startDate={settings.startDate}
        onStartDateChange={(startDate) => {
          setSettings({
            ...settings,
            startDate,
          });
        }}
        endDate={settings.endDate}
        onEndDateChange={(endDate) => {
          setSettings({
            ...settings,
            endDate,
          });
        }}
      />
    </Box>
  );
}
