import { defineBoolean, defineSecret } from "firebase-functions/params";

export interface ParametersValues {
  arcgisClientId: string;
  arcgisClientSecret: string;
  pirateWeatherApiKey: string;
  offline: boolean;
}

export const parameters = {
  arcgisClientId: defineSecret("ARCGIS_CLIENT_ID"),
  arcgisClientSecret: defineSecret("ARCGIS_CLIENT_SECRET"),
  pirateWeatherApiKey: defineSecret("PIRATE_WEATHER_API_KEY"),
  offline: defineBoolean("OFFLINE", { default: false }),
};

export function getParameterValues(): ParametersValues {
  const values: ParametersValues = {
    arcgisClientId: parameters.arcgisClientId.value(),
    arcgisClientSecret: parameters.arcgisClientSecret.value(),
    pirateWeatherApiKey: parameters.pirateWeatherApiKey.value(),
    offline: parameters.offline.value(),
  };
  return values;
}
