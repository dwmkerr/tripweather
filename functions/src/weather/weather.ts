import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import { PirateWeatherResponse, WeatherUnits } from "./PirateWeatherTypes";
import { parameters } from "../parameters";

export interface WeatherRequest {
  latitude: number;
  longitude: number;
  date: string; // ISO8601
  units: WeatherUnits; // e.g. ca/us/uk/si
}

export interface WeatherResponse {
  date: string; // ISO8601
  weather: PirateWeatherResponse;
}

export const weather = onCall<WeatherRequest, Promise<WeatherResponse>>(
  { cors: ["localhost:3000"] },
  async (req): Promise<WeatherResponse> => {
    //  Get the dates we are requesting weather for.

    try {
      const apiKey = parameters.pirateWeatherApiKey.value();
      const longitude = req.data.latitude;
      const latitude = req.data.latitude;
      const date = new Date(req.data.date).toISOString();
      const units = req.data.units;
      const uriPath = `https://api.pirateweather.net/forecast/${apiKey}/${longitude},${latitude},${date}`;
      const uriOptions = `?units=${units}`;
      const uri = uriPath + uriOptions;
      //  For reference, full api spec is:
      //    https://api.pirateweather.net/forecast/[apikey]/[latitude],[longitude],[time]?exclude=[excluded]&units=[unit]&extend=[hourly]&tz=[precise]
      //  See:
      //    https://docs.pirateweather.net/en/latest/API/

      logger.debug("Calling weather api:", uri);
      const result = await fetch(uri);
      const data = await result.json();

      //  Check for errors first.
      if (data["error"]) {
        const { error, message } = data;
        logger.error(
          "an error occurred calling pirateweather: ",
          error,
          message,
        );
        throw new HttpsError("internal", `weather error: ${error}`);
      }

      //  Get the data as a weather response and return to the caller.
      const weatherResponse = data as PirateWeatherResponse;
      logger.debug(
        `Summary: ${weatherResponse.currently.summary} (${weatherResponse.currently.icon})`,
      );

      return {
        date: req.data.date,
        weather: weatherResponse,
      };
    } catch (err) {
      console.error(err);
      throw new HttpsError("internal", `weather error: ${err}`);
    }
  },
);
