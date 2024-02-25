import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { ReactNode, useEffect, useState } from "react";
import { DateWeather, TripLocation, WeatherStatus } from "../lib/Location";
import WeatherIcon from "./WeatherIcon/WeatherIcon";
import { Stack, Typography } from "@mui/joy";
import { CircularProgress } from "@mui/material";
import {
  useSettingsContext,
  Settings,
} from "../contexts/SettingsContextProvider";
import { getMidnightDates } from "../lib/Time";

const renderWeatherCell = (
  params: GridRenderCellParams<LocationRow>,
): ReactNode => {
  console.log(params);
  const value = params.value as DateWeather;
  const weather = value.weather;
  switch (value.weatherStatus) {
    case WeatherStatus.Loading:
      return (
        <Stack direction="column" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      );
    case WeatherStatus.Loaded:
      return (
        <Stack direction="column" justifyContent="center" alignItems="center">
          <WeatherIcon
            weather={weather?.currently.icon || "unknown"}
            size={32}
          />
          <Typography level="body-xs">{weather?.currently.summary}</Typography>
        </Stack>
      );
    case WeatherStatus.Error:
      return (
        <Stack direction="column" justifyContent="center" alignItems="center">
          Error
        </Stack>
      );
    case WeatherStatus.Stale:
      return (
        <Stack direction="column" justifyContent="center" alignItems="center">
          Stale
        </Stack>
      );
    default:
      return undefined;
  }
};

const buildColumns = (settings: Settings) => {
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

  const dateColumns = dates.map((date) => {
    return {
      field: `date${date.toISOString()}`,
      headerName: date.toISOString(),
      width: 80,
      valueGetter: (params: GridValueGetterParams<LocationRow>) => {
        return params.row.datesWeather.find(
          (dw) => dw.date.getDate() === date.getDate(),
        );
      },
      renderCell: renderWeatherCell,
    };
  });

  return [...initialColumns, ...dateColumns];
};

export interface LocationRow {
  id: string;
  title: string;
  address: string;
  datesWeather: DateWeather[];
}

export interface LocationGridProps {
  locations: TripLocation[];
}

export default function LocationGrid({ locations }: LocationGridProps) {
  const { settings } = useSettingsContext();
  const [locationRows, setLocationRows] = useState<LocationRow[]>([]);
  const [columnDefinitions, setColumnDefinitions] = useState<
    GridColDef<LocationRow>[]
  >(buildColumns(settings));
  useEffect(() => {
    const locationRows = locations.map((location): LocationRow => {
      return {
        id: location.id,
        title: location.originalSearch.address,
        address: location.location.address,
        datesWeather: location.datesWeather,
      };
    });
    setLocationRows(locationRows);
  }, [locations]);

  //  When the settings change, build the columns.
  useEffect(() => {
    setColumnDefinitions(buildColumns(settings));
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
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
}
