import { DateWeather, TripLocation } from "../../lib/Location";

export interface LocationRow {
  location: TripLocation;
  id: string;
  title: string;
  address: string;
  datesWeather: DateWeather[];
  isFavorite: boolean;
}
