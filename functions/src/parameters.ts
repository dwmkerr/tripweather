import { defineSecret } from "firebase-functions/params";

export const parameters = {
  arcgisClientId: defineSecret("ARCGIS_CLIENT_ID"),
  arcgisClientSecret: defineSecret("ARCGIS_CLIENT_SECRET"),
  pirateWeatherApiKey: defineSecret("PIRATE_WEATHER_API_KEY"),
};
