import { Timestamp } from "firebase/firestore";
import { PirateWeatherDataDaily } from "../../../functions/src/weather/PirateWeatherTypes";
import moment from "moment";

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

export interface Location {
  address: string;
  longitude: number;
  latitude: number;
}

export interface DateWeather {
  date: Timestamp;
  weatherStatus: WeatherStatus;
  weather?: PirateWeatherDataDaily;
  updated: Timestamp | null;
}

//  Key is location/date (<address><longitude><latitude><date-eg-2024-02-02>)
export type LocationDateWeather = Map<string, DateWeather>;

export function ldwKey(location: Location, date: Timestamp) {
  const addressPart = `${location.address}${location.longitude}${location.latitude}`;
  const datePart = moment(date.toDate()).toISOString().substring(0, 10);
  const key = addressPart + datePart;
  return key;
}

export interface TripLocation {
  id: string;
  label: string;
  originalSearch: {
    address: string;
    magicKey: string;
    gps: string;
  };
  location: Location;
}
