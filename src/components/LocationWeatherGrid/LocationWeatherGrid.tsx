import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  LocationDateWeather,
  TripLocation,
} from "../../lib/repository/TripModels";
import { Stack, Typography } from "@mui/joy";
import { useSettingsContext } from "../../contexts/SettingsContextProvider";
import { LocationRow } from "./LocationRow";
import {
  AddFavoriteLocationFunc,
  DeleteLocationFunc,
  RemoveFavoriteLocationFunc,
  RenameLocationLabelFunc,
} from "./Actions";
import {
  FavoriteLocationModel,
  findFavoriteLocationFromTripLocation,
} from "../../lib/repository/RepositoryModels";
import { buildColumns } from "./buildColumns";

export interface LocationGridProps {
  locations: TripLocation[];
  weatherData: LocationDateWeather;
  startDate: Date;
  endDate: Date;
  favoriteLocations: FavoriteLocationModel[];
  onDeleteLocation: DeleteLocationFunc;
  onAddFavoriteLocation: AddFavoriteLocationFunc;
  onRemoveFavoriteLocation: RemoveFavoriteLocationFunc;
  onRenameLocationLabel?: RenameLocationLabelFunc;
}

export default function LocationGrid({
  locations,
  weatherData,
  startDate,
  endDate,
  favoriteLocations,
  onDeleteLocation,
  onAddFavoriteLocation,
  onRemoveFavoriteLocation,
  onRenameLocationLabel,
}: LocationGridProps) {
  const { settings } = useSettingsContext();
  const [locationRows, setLocationRows] = useState<LocationRow[]>([]);
  const [columnDefinitions, setColumnDefinitions] = useState<
    GridColDef<LocationRow>[]
  >(
    buildColumns(
      startDate,
      endDate,
      onDeleteLocation,
      onAddFavoriteLocation,
      onRemoveFavoriteLocation,
      onRenameLocationLabel,
    ),
  );

  //  Build the location rows from the locations, favourite locations and
  //  weather data.
  useEffect(() => {
    const locationRows = locations.map((location): LocationRow => {
      return {
        location,
        id: location.id,
        title: location.originalSearch.address,
        address: location.location.address,
        weather: weatherData,
        isFavorite:
          findFavoriteLocationFromTripLocation(location, favoriteLocations) !==
          undefined,
      };
    });
    setLocationRows(locationRows);
  }, [locations, favoriteLocations, weatherData]);

  //  When the settings change, build the columns.
  useEffect(() => {
    setColumnDefinitions(columnDefinitions);
  }, [settings]);

  if (locations.length === 0) {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ height: "100%" }}
      >
        <Typography level="body-md">
          Search for a location and date range to see weather for you trip!
        </Typography>
      </Stack>
    );
  }

  return (
    <DataGrid
      rows={locationRows}
      columns={columnDefinitions}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      getRowHeight={() => "auto"}
    />
  );
}
