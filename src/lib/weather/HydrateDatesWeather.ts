import moment from "moment";
import { TripLocation, WeatherStatus } from "../repository/TripModels";
import { getMidnightDates } from "../Time";
import { updateLocationWeatherDates } from "./TripLocationWeather";
import { WeatherResponse } from "../../../functions/src/weather/weather";
import { TripWeatherError } from "../Errors";
import { Repository } from "../repository/Repository";
import { WeatherUnits } from "../../../functions/src/weather/PirateWeatherTypes";
import { Timestamp } from "firebase/firestore";

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

export async function hydrateDatesWeather(
  repository: Repository,
  locations: TripLocation[],
  startDate: Date,
  endDate: Date,
  units: WeatherUnits,
): Promise<{ locations: TripLocation[]; errors: TripWeatherError[] }> {
  //  Get our date range. We currently will only use the start date as the
  //  weather API will always return 7 days of data.
  const dates = getMidnightDates(startDate, endDate);
  const errors: TripWeatherError[] = [];

  //  Create a promise which updates each location.
  const updateEachLocation = locations.map(
    async (location): Promise<TripLocation> => {
      //  Take a location add any dates that are missing, and sort the dates.
      //  Will not remove data for existing valid dates.
      const locationWithWeatherDataPlaceholders = updateLocationWeatherDates(
        location,
        true, // keep any existing dates not in our range
        dates.map((date) => Timestamp.fromDate(date)),
      );

      //  Try and get the weather. If we couldn't then we'll set the error
      //  state for each of the weather values.
      const weatherResponseOrNull = await getWeather(
        repository,
        location.location.longitude,
        location.location.latitude,
        startDate,
        units,
      );

      //  If the weather is null, we have shown an error alert.
      //  Now just set the state of any weather dates in the location that
      //  have not been loaded to 'error' and return it.
      if (weatherResponseOrNull === null) {
        return {
          ...location,
          datesWeather: location.datesWeather.map((dw) =>
            dw.weatherStatus === WeatherStatus.Loaded
              ? {
                  ...dw,
                  weatherStatus: WeatherStatus.Error,
                }
              : dw,
          ),
        };
      }

      //  We're now sure we've got valid weather data. Go through each
      //  WeatherData for the location and enrich it.
      const weather = weatherResponseOrNull.weather;
      const updatedDateWeathers =
        locationWithWeatherDataPlaceholders.datesWeather.map((dw) => {
          const weatherData = weather.daily.data.find((daily) =>
            moment.unix(daily.time).isSame(moment(dw.date.toDate()), "date"),
          );
          if (!weatherData) {
            errors.push(
              new TripWeatherError(
                "Unable to map Weather Data",
                `Cannot find requested weather data for date ${dw.date}`,
              ),
            );
            return {
              ...dw,
              weatherStatus: WeatherStatus.Error,
            };
          }
          return {
            ...dw,
            weatherStatus: WeatherStatus.Loaded,
            weather: weatherData,
          };
        });

      //  Set the updated location.
      const updatedLocation = {
        ...location,
        datesWeather: updatedDateWeathers,
        updated: new Date(),
      };
      return updatedLocation;
    },
  );

  //  Await each location update and return the results.
  const updatedLocations = await Promise.all(updateEachLocation);
  return { locations: updatedLocations, errors };
}
