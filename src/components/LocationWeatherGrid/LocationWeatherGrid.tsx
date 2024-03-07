import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import { TripLocation } from "../../lib/Location";
import { Stack, Typography } from "@mui/joy";
import { useSettingsContext } from "../../contexts/SettingsContextProvider";
import { getMidnightDates } from "../../lib/Time";
import { Settings } from "../../lib/Settings";
import { LocationRow } from "./LocationRow";
import renderWeatherCell from "./RenderWeatherCell";
import renderActionsCell from "./RenderActionsCell";
import {
  AddFavoriteLocationFunc,
  CheckFavoriteLocationFunc,
  DeleteLocationFunc,
  RemoveFavoriteLocationFunc,
  RenameLocationLabelFunc,
} from "./Actions";
import renderLocationCell from "./RenderLocationCell";
import {
  FavoriteLocationModel,
  findFavoriteLocationFromTripLocation,
} from "../../lib/repository/RepositoryModels";

const buildColumns = (
  settings: Settings,
  onDeleteLocation: DeleteLocationFunc,
  onAddFavoriteLocation: AddFavoriteLocationFunc,
  onRemoveFavoriteLocation: RemoveFavoriteLocationFunc,
  onRenameLocationLabel?: RenameLocationLabelFunc,
) => {
  const addressColumn: GridColDef<LocationRow> = {
    field: "title",
    headerName: "Location",
    width: 150,
    valueGetter: (params: GridValueGetterParams<LocationRow>) =>
      params.row.location,
    renderCell: (params: GridRenderCellParams<LocationRow, TripLocation>) =>
      renderLocationCell(
        params,
        params.row.isFavorite,
        checkFavorite,
        onRenameLocationLabel,
      ),
  };

  const dates = getMidnightDates(settings.startDate, settings.endDate);

  const formatDateHeader = (date: Date) => {
    return moment(date).calendar(null, {
      sameDay: "[Today]",
      nextDay: "[Tomorrow]",
      nextWeek: "dddd",
      lastDay: "[Yesterday]",
      lastWeek: "[Last] dddd",
      sameElse: "DD/MM/YYYY",
    });
  };

  const dateColumns = dates.map((date): GridColDef<LocationRow> => {
    return {
      field: `date${date.toISOString()}`,
      headerName: formatDateHeader(date),
      width: 160,
      align: "center",
      headerAlign: "center",
      valueGetter: (params: GridValueGetterParams<LocationRow>) => {
        return params.row.datesWeather.find(
          (dw) => dw.date.getDate() === date.getDate(),
        );
      },
      renderCell: renderWeatherCell,
    };
  });

  const checkFavorite: CheckFavoriteLocationFunc = async (
    checked: boolean,
    location: TripLocation,
  ) => {
    if (checked) {
      await onAddFavoriteLocation(location);
    } else {
      await onRemoveFavoriteLocation(location);
    }
  };

  const actionColumn: GridColDef<LocationRow> = {
    field: "id",
    headerName: "Actions",
    width: 150,
    editable: false,
    valueGetter: (params: GridValueGetterParams<LocationRow>) =>
      params.row.location,
    renderCell: (params: GridRenderCellParams<LocationRow, TripLocation>) =>
      renderActionsCell(params, onDeleteLocation),
  };

  return [addressColumn, ...dateColumns, actionColumn];
};

export interface LocationGridProps {
  locations: TripLocation[];
  favoriteLocations: FavoriteLocationModel[];
  onDeleteLocation: DeleteLocationFunc;
  onAddFavoriteLocation: AddFavoriteLocationFunc;
  onRemoveFavoriteLocation: RemoveFavoriteLocationFunc;
  onRenameLocationLabel?: RenameLocationLabelFunc;
}

export default function LocationGrid({
  locations,
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
      settings,
      onDeleteLocation,
      onAddFavoriteLocation,
      onRemoveFavoriteLocation,
      onRenameLocationLabel,
    ),
  );
  useEffect(() => {
    const locationRows = locations.map((location): LocationRow => {
      return {
        location,
        id: location.id,
        title: location.originalSearch.address,
        address: location.location.address,
        datesWeather: location.datesWeather,
        isFavorite:
          findFavoriteLocationFromTripLocation(location, favoriteLocations) !==
          undefined,
      };
    });
    setLocationRows(locationRows);
  }, [locations, favoriteLocations]);

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
