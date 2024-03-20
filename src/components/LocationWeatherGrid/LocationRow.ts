import { WeatherUnits } from "../../../functions/src/weather/PirateWeatherTypes";
import {
  LocationDateWeather,
  TripLocation,
} from "../../lib/repository/TripModels";

export interface LocationRow {
  location: TripLocation;
  id: string;
  title: string;
  address: string;
  weather: LocationDateWeather;
  units: WeatherUnits;
  isFavorite: boolean;
}
