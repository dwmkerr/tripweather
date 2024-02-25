import { PirateWeatherResponse } from "../../functions/src/weather/PirateWeatherTypes";

export enum AddressSearchStatus {
  NotStarted,
  InProgress,
  Complete,
}
export enum WeatherStatus {
  Loading,
  Loaded,
  Stale,
  Error,
}

export interface DateWeather {
  date: Date;
  weatherStatus: WeatherStatus;
  weather?: PirateWeatherResponse;
}

export interface TripLocation {
  id: string;
  originalSearch: {
    address: string;
    magicKey: string;
  };
  address: string;
  longitude: number;
  latitude: number;
  datesWeather: DateWeather[];
}
