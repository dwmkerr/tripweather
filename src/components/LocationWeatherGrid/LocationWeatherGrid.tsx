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
import { DeleteLocationFunc } from "./Actions";

const buildColumns = (
  settings: Settings,
  deleteLocation: DeleteLocationFunc,
) => {
  const initialColumns: GridColDef<LocationRow>[] = [
    {
      field: "title",
      headerName: "Location",
      width: 150,
      editable: true,
    },
    {
      field: "address",
      headerName: "Address",
      width: 150,
      editable: true,
    },
  ];

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

  const actionColumn: GridColDef<LocationRow> = {
    field: "id",
    headerName: "Actions",
    width: 150,
    editable: false,
    valueGetter: (params: GridValueGetterParams<LocationRow>) =>
      params.row.location,
    renderCell: (params: GridRenderCellParams<LocationRow, TripLocation>) =>
      renderActionsCell(params, deleteLocation),
  };

  return [...initialColumns, ...dateColumns, actionColumn];
};

export interface LocationGridProps {
  locations: TripLocation[];
  onDeleteLocation: DeleteLocationFunc;
}

export default function LocationGrid({
  locations,
  onDeleteLocation,
}: LocationGridProps) {
  const { settings } = useSettingsContext();
  const [locationRows, setLocationRows] = useState<LocationRow[]>([]);
  const [columnDefinitions, setColumnDefinitions] = useState<
    GridColDef<LocationRow>[]
  >(buildColumns(settings, onDeleteLocation));
  useEffect(() => {
    const locationRows = locations.map((location): LocationRow => {
      return {
        id: location.id,
        title: location.originalSearch.address,
        address: location.location.address,
        datesWeather: location.datesWeather,
        location,
      };
    });
    setLocationRows(locationRows);
  }, [locations]);

  //  When the settings change, build the columns.
  useEffect(() => {
    setColumnDefinitions(buildColumns(settings, onDeleteLocation));
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
      rowHeight={96}
      pageSizeOptions={[5]}
    />
  );
}