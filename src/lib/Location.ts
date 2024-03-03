import { PirateWeatherDataDaily } from "../../functions/src/weather/PirateWeatherTypes";

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
  weather?: PirateWeatherDataDaily;
}

export interface TripLocation {
  id: string;
  label: string;
  originalSearch: {
    address: string;
    magicKey: string;
    gps: string;
  };
  location: {
    address: string;
    longitude: number;
    latitude: number;
  };
  datesWeather: DateWeather[];
}
