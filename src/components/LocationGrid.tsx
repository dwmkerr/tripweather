import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import moment from "moment";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { DateWeather, TripLocation, WeatherStatus } from "../lib/Location";
import WeatherIcon from "./WeatherIcon/WeatherIcon";
import { CircularProgress, Stack, Typography } from "@mui/joy";
import {
  useSettingsContext,
  Settings,
} from "../contexts/SettingsContextProvider";
import { getMidnightDates } from "../lib/Time";
import { PirateWeatherDataDaily } from "../../functions/src/weather/PirateWeatherTypes";

const WeatherSummary = ({ weather }: { weather: PirateWeatherDataDaily }) => (
  <Fragment>
    <Typography level="body-sm" fontWeight="bold">
      {weather.summary}
    </Typography>
    <Typography level="body-xs">
      {weather.apparentTemperatureLow}° - {weather.apparentTemperatureHigh}°{" "}
    </Typography>
  </Fragment>
);

const renderWeatherCell = (
  params: GridRenderCellParams<LocationRow>,
): ReactNode => {
  const value = params.value as DateWeather;
  const weather = value.weather;
  switch (value.weatherStatus) {
    case WeatherStatus.Loading:
      return (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ marginLeft: "auto", marginRight: "auto" }}
        >
          <CircularProgress size="sm" />
        </Stack>
      );
    case WeatherStatus.Loaded:
      return (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ marginLeft: "auto", marginRight: "auto" }}
        >
          {weather && (
            <Fragment>
              <WeatherSummary weather={weather} />
              <WeatherIcon weather={weather.icon} size={48} />
            </Fragment>
          )}
        </Stack>
      );
    case WeatherStatus.Error:
      return (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ marginLeft: "auto", marginRight: "auto" }}
        >
          Error
        </Stack>
      );
    case WeatherStatus.Stale:
      return (
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ marginLeft: "auto", marginRight: "auto" }}
        >
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

  console.log(
    "tripweather: mapping dates",
    dates.map((d) => d.toISOString()),
  );
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
      rowHeight={96}
      pageSizeOptions={[5]}
    />
  );
}
