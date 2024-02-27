import { Fragment } from "react";
import { Typography } from "@mui/joy";
import { useSettingsContext } from "../../contexts/SettingsContextProvider";
import { PirateWeatherDataDaily } from "../../../functions/src/weather/PirateWeatherTypes";
import { formatTemperature } from "../../lib/FormatWeather";

export interface WeatherSummaryProps {
  weather: PirateWeatherDataDaily;
}

export default function WeatherSummary({ weather }: WeatherSummaryProps) {
  const { settings } = useSettingsContext();

  //  Format the temperatures.
  const temperatureLow = formatTemperature(
    weather.apparentTemperatureLow,
    settings.units,
    1,
  );
  const temperatureHigh = formatTemperature(
    weather.apparentTemperatureHigh,
    settings.units,
    1,
  );

  return (
    <Fragment>
      <Typography level="body-sm" fontWeight="bold">
        {weather.summary}
      </Typography>
      <Typography level="body-xs">
        {temperatureLow} - {temperatureHigh}
      </Typography>
    </Fragment>
  );
}
