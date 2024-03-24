import moment from "moment";
import {
  DateWeather,
  TripLocation,
  WeatherStatus,
} from "../repository/TripModels";
import { Timestamp } from "firebase/firestore";

export function updateLocationWeatherDates(
  location: TripLocation,
  keepExtraDates: boolean,
  dates: Timestamp[],
): TripLocation {
  const datesWeatherFiltered = keepExtraDates
    ? location.datesWeather
    : location.datesWeather.filter((dw) => {
        return dates.find((d) => moment(d).isSame(moment(dw.date), "date"));
      });

  //  Add any missing days.
  const datesWeatherMissing: DateWeather[] = dates
    .filter((d) => {
      return datesWeatherFiltered.find(
        (ld) => !moment(d).isSame(moment(ld.date), "date"),
      );
    })
    .map((date) => ({
      date: date,
      weatherStatus: WeatherStatus.Loading,
      updated: null,
    }));

  //  Join and sort the arrays.
  const updatedDatesWeather = [...datesWeatherFiltered, ...datesWeatherMissing];
  const sortedDatesWeather = updatedDatesWeather.sort(
    (lhs, rhs) => lhs.date.toDate().getDate() - rhs.date.toDate().getDate(),
  );

  //  Finally, return a new location with the updated dates.
  return {
    ...location,
    datesWeather: sortedDatesWeather,
  };
}
