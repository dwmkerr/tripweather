import moment from "moment";
import { TripLocation, WeatherStatus } from "../repository/TripModels";

export function updateLocationWeatherDates(
  location: TripLocation,
  keepExtraDates: boolean,
  dates: Date[],
): TripLocation {
  const datesWeatherFiltered = keepExtraDates
    ? location.datesWeather
    : location.datesWeather.filter((dw) => {
        return dates.find((d) => moment(d).isSame(moment(dw.date), "date"));
      });

  //  Add any missing days.
  const datesWeatherMissing = dates
    .filter((d) => {
      return datesWeatherFiltered.find(
        (ld) => !moment(d).isSame(moment(ld.date), "date"),
      );
    })
    .map((date) => ({
      date,
      weatherStatus: WeatherStatus.Loading,
      updated: null,
    }));

  //  Join and sort the arrays.
  const updatedDatesWeather = [...datesWeatherFiltered, ...datesWeatherMissing];
  const sortedDatesWeather = updatedDatesWeather.sort(
    (lhs, rhs) => lhs.date.getDate() - rhs.date.getDate(),
  );

  //  Finally, return a new location with the updated dates.
  return {
    ...location,
    datesWeather: sortedDatesWeather,
  };
}
