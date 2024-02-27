import { Fragment } from "react";
import { Typography } from "@mui/joy";
import {
  PirateWeatherDataDaily,
  WeatherUnits,
} from "../../../functions/src/weather/PirateWeatherTypes";
import { formatTemperature } from "../../lib/FormatWeather";

export interface WeatherSummaryProps {
  weather: PirateWeatherDataDaily;
  units: WeatherUnits;
}

export default function WeatherSummary({
  weather,
  units,
}: WeatherSummaryProps) {
  //  Format the temperatures.
  const temperatureLow = formatTemperature(
    weather.apparentTemperatureLow,
    units,
    1,
  );
  const temperatureHigh = formatTemperature(
    weather.apparentTemperatureHigh,
    units,
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
