import { Candidate } from "../../functions/src/arcgis";
import { PirateWeatherIcon } from "../../functions/src/weather/PirateWeatherTypes";

export enum AddressSearchStatus {
  NotStarted,
  InProgress,
  Complete,
}
export enum WeatherStatus {
  Loading,
  Loaded,
  Stale,
}
export interface TripLocation {
  id: string;
  originalSearch: {
    address: string;
    magicKey: string;
  };
  addressSearchStatus: AddressSearchStatus;
  candidate?: Candidate;
  weatherStatus: WeatherStatus;
  weather?: {
    summary: string;
    icon: PirateWeatherIcon;
  };
}
