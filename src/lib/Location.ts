import { PirateWeatherData } from "../../functions/src/weather/PirateWeatherTypes";

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
  weather?: PirateWeatherData;
}

export interface TripLocation {
  id: string;
  originalSearch: {
    address: string;
    magicKey: string;
  };
  location: {
    address: string;
    longitude: number;
    latitude: number;
  };
  datesWeather: DateWeather[];
}
