import { DateWeather, TripLocation } from "../../lib/Location";

export interface LocationRow {
  id: string;
  title: string;
  address: string;
  datesWeather: DateWeather[];
  location: TripLocation;
}
