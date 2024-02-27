import {WeatherUnits} from "../../functions/src/weather/PirateWeatherTypes";

export interface Settings {
  startDate: Date;
  endDate: Date;
  units: WeatherUnits;
}
