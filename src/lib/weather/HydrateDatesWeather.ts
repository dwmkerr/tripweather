import {
  DateWeather,
  LocationDateWeather,
  TripLocation,
  WeatherStatus,
  ldwKey,
} from "../repository/TripModels";
import { getMidnightDates, getMidnightTimestamps } from "../Time";
import { WeatherResponse } from "../../../functions/src/weather/weather";
import { TripWeatherError } from "../Errors";
import { Repository } from "../repository/Repository";
import { WeatherUnits } from "../../../functions/src/weather/PirateWeatherTypes";
import { Timestamp } from "firebase/firestore";
import moment from "moment";

function isSameDay(lhs: moment.Moment, rhs: moment.Moment): boolean {
  return lhs.isSame(rhs, "date");
}

export function filterLocations(
  weatherData: LocationDateWeather,
  locations: TripLocation[],
  startDate: Date,
  endDate: Date,
): TripLocation[] {
  //  Get the date range we're gathering data for.
  const dates = getMidnightTimestamps(startDate, endDate);

  //  Remove any locations that we already have weather data for.
  return locations.filter((location) => {
    //  For us to remove this location from the list, we must have weather data
    //  for every date requested.
    const keys = dates.map((date) => ldwKey(location.location, date));
    const hasWeatherData = keys.every(
      (key) =>
        weatherData.has(key) &&
        weatherData.get(key)?.weatherStatus == WeatherStatus.Loaded,
    );
    return !hasWeatherData;
  });
}

//  Get weather data, or if missing show an alert.
export async function getWeather(
  repository: Repository,
  longitude: number,
  latitude: number,
  startDate: Date,
  units: WeatherUnits,
): Promise<WeatherResponse | null> {
  try {
    return (
      await repository.functions.weather({
        longitude: longitude,
        latitude: latitude,
        date: startDate.toISOString(),
        units: units,
      })
    ).data;
    //  Errors are always of type 'any' so disable the warning.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error(
      `Error getting weather for ${longitude},${latitude} on ${startDate}`,
      err,
    );
    return null;
  }
}

//  Set the 'loading' status to each LDW value which needs to be loaded.
export function startUpdateWeather(
  locations: TripLocation[],
  startDate: Date,
  endDate: Date,
): LocationDateWeather {
  const dates = getMidnightTimestamps(startDate, endDate);
  const ldw = locations.reduce((ldw: LocationDateWeather, location) => {
    //  Set each location/date value to 'loading'.
    const ldWeathers = dates.map((timestamp) => {
      const key = ldwKey(location.location, timestamp);
      return {
        key,
        dateWeather: {
          date: timestamp,
          weatherStatus: WeatherStatus.Loading,
          weather: undefined,
          updated: null,
        },
      };
    });
    ldWeathers.forEach(({ key, dateWeather }) => ldw.set(key, dateWeather));
    return ldw;
  }, new Map<string, DateWeather>());

  return ldw;
}

export async function updateWeather(
  repository: Repository,
  locations: TripLocation[],
  startDate: Date,
  endDate: Date,
  units: WeatherUnits,
): Promise<{
  locationDateWeather: LocationDateWeather;
  errors: TripWeatherError[];
}> {
  //  Get our date range. We currently will only use the start date as the
  //  weather API will always return 7 days of data.
  const dates = getMidnightDates(startDate, endDate);
  const errors: TripWeatherError[] = [];
  const locationDateWeather = new Map<string, DateWeather>();

  //  Get the weather for each location and date.
  const apiCalls = locations.map(async (location) => {
    //  Try and get the weather. If we couldn't then we'll set the error
    //  state for each of the weather values.
    const weatherResponseOrNull = await getWeather(
      repository,
      location.location.longitude,
      location.location.latitude,
      startDate,
      units,
    );
    return {
      location,
      weatherResponseOrNull,
    };
  });
  const locationsWeather = await Promise.all(apiCalls);

  //  Now that we have the weather for each location, load the data into the
  //  location date weather.
  locationsWeather.forEach(({ location, weatherResponseOrNull }) => {
    //  If the weather is null, we have shown an error alert.
    //  Now just set the state of any weather dates in the location that
    //  have not been loaded to 'error' and return it.
    if (weatherResponseOrNull === null) {
      //  Set the error state for each locationdate.
      dates.forEach((date) => {
        const key = ldwKey(location.location, Timestamp.fromDate(date));
        locationDateWeather.set(key, {
          date: Timestamp.fromDate(date),
          weatherStatus: WeatherStatus.Error,
          weather: undefined,
          updated: Timestamp.now(),
        });
      });
      return;
    }

    //  We're now sure we've got valid weather data. Go through each
    //  WeatherData for the location and enrich it.
    const weather = weatherResponseOrNull.weather;
    dates.forEach((date) => {
      const key = ldwKey(location.location, Timestamp.fromDate(date));

      //  Find the weather data for the given date.
      const weatherData = weather.daily.data.find((daily) =>
        isSameDay(moment.unix(daily.time), moment(date)),
      );

      //  If we don't have the data, push an error and set error weather.
      if (!weatherData) {
        errors.push(
          new TripWeatherError(
            "Unable to map Weather Data",
            `Cannot find requested weather data for date ${date}`,
          ),
        );
        locationDateWeather.set(key, {
          date: Timestamp.fromDate(date),
          weatherStatus: WeatherStatus.Error,
          weather: undefined,
          updated: Timestamp.now(),
        });
      } else {
        locationDateWeather.set(key, {
          date: Timestamp.fromDate(date),
          weatherStatus: WeatherStatus.Loaded,
          weather: weatherData,
          updated: Timestamp.now(),
        });
      }
    });
  });

  return { locationDateWeather, errors };
}
