import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

import { PirateWeatherIcon, PirateWeatherResponse } from "./PirateWeatherTypes";
import { parameters } from "../parameters";

export interface WeatherRequest {
  latitude: number;
  longitude: number;
}

export interface WeatherResponse {
  summary: string;
  icon: PirateWeatherIcon;
}
export const weather = onCall<WeatherRequest, Promise<WeatherResponse>>(
  { cors: ["localhost:3000"] },
  async (req): Promise<WeatherResponse> => {
    try {
      const apiKey = parameters.pirateWeatherApiKey.value();
      const latitude = req.data.latitude;
      const longitude = req.data.latitude;
      const uri = `https://api.pirateweather.net/forecast/${apiKey}/${latitude},${longitude}`;
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
        summary: weatherResponse.currently.summary,
        icon: weatherResponse.currently.icon,
      };
    } catch (err) {
      console.error(err);
      throw new HttpsError("internal", `weather error: ${err}`);
    }
  },
);
