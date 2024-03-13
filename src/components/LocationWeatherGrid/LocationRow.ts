import { DateWeather, LocationDateWeather, TripLocation } from "../../lib/repository/TripModels";

export interface LocationRow {
  location: TripLocation;
  id: string;
  title: string;
  address: string;
  weather: LocationDateWeather;
  isFavorite: boolean;
}
