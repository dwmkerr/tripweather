import { WeatherUnits } from "../../functions/src/weather/PirateWeatherTypes";

export function formatTemperature(
  temperature: number,
  units: WeatherUnits,
  decimalPlaces?: number,
) {
  //  Set the precision of the temperature if required.
  const number =
    decimalPlaces !== undefined
      ? temperature.toFixed(decimalPlaces)
      : temperature;

  switch (units) {
    case "ca":
    case "uk":
    case "si":
    default:
      return `${number}˚C`;
    case "us":
      return `${number}˚F`;
  }
}
