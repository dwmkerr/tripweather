import { Candidate } from "../../functions/src/arcgis";
import { PirateWeatherIcon } from "../../functions/src/weather/PirateWeatherTypes";

export enum AddressSearchStatus {
  NotStarted,
  InProgress,
  Complete,
}
export interface TripLocation {
  id: string;
  originalSearch: {
    address: string;
    magicKey: string;
  };
  addressSearchStatus: AddressSearchStatus;
  candidate?: Candidate;
  weather?: {
    summary: string;
    icon: PirateWeatherIcon;
  };
}
