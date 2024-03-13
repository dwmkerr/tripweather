import { GridRenderCellParams } from "@mui/x-data-grid";
import { DateWeather, WeatherStatus } from "../../lib/repository/TripModels";
import WeatherIcon from "../WeatherIcon/WeatherIcon";
import { CircularProgress, Stack, Typography } from "@mui/joy";
import { useSettingsContext } from "../../contexts/SettingsContextProvider";
import WeatherSummary from "./WeatherSummary";
import { LocationRow } from "./LocationRow";
import { Fragment, ReactNode } from "react";

export interface WeatherCellProps {
  dateWeather: DateWeather;
}

export function WeatherCell({ dateWeather }: WeatherCellProps) {
  const { settings } = useSettingsContext();
  const weather = dateWeather.weather;
  switch (dateWeather.weatherStatus) {
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
              <WeatherSummary weather={weather} units={settings.units} />
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
      return <Typography color="danger">Unknown Weather Status</Typography>;
  }
}

export default function renderWeatherCell(
  params: GridRenderCellParams<LocationRow, DateWeather>,
): ReactNode {
  const dateWeather = params.value;
  //  The dataweather is undefined while it is being hydrated, once it is
  //  hydrated it is given the loading value. Until that happens, we can safely
  //  return an empty cell.
  if (dateWeather === undefined) {
    return <></>;
  }

  return <WeatherCell dateWeather={dateWeather} />;
}
