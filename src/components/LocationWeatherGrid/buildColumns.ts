import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import moment from "moment";
import { TripLocation, ldwKey } from "../../lib/repository/TripModels";
import { getMidnightDates } from "../../lib/Time";
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
import { Timestamp } from "firebase/firestore";
import { WeatherUnits } from "../../../functions/src/weather/PirateWeatherTypes";

export function buildColumns(
  units: WeatherUnits,
  startDate: Date,
  endDate: Date,
  onDeleteLocation: DeleteLocationFunc,
  onAddFavoriteLocation: AddFavoriteLocationFunc,
  onRemoveFavoriteLocation: RemoveFavoriteLocationFunc,
  onRenameLocationLabel?: RenameLocationLabelFunc,
) {
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

  const dates = getMidnightDates(startDate, endDate);

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
        return params.row.weather.get(
          ldwKey(params.row.location.location, units, Timestamp.fromDate(date)),
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
}
