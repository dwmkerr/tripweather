import { Timestamp } from "firebase/firestore";
import { PirateWeatherDataDaily } from "../../../functions/src/weather/PirateWeatherTypes";

export interface TripModel {
  id: string;
  ownerId: string;
  isDraft: boolean; // if true, trip is not saved to server
  isCurrent: boolean; // if true, the current trip we're working on
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  dateCreated: Timestamp;
  dateUpdated: Timestamp;
  locations: TripLocation[];
}

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
  updated: Date | null;
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
