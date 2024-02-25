import { PirateWeatherIcon } from "../../../functions/src/weather/PirateWeatherTypes";

import iconClearDay from "./icons/clear-day.svg";
import iconClearNight from "./icons/clear-night.svg";
import iconCloudy from "./icons/cloudy.svg";
import iconFog from "./icons/fog.svg";
import iconPartlyCloudyDay from "./icons/partly-cloudy-day.svg";
import iconPartlyCloudyNight from "./icons/partly-cloudy-night.svg";
import iconRain from "./icons/rain.svg";
import iconSleet from "./icons/sleet.svg";
import iconSnow from "./icons/snow.svg";
import iconWind from "./icons/wind.svg";
import iconUnknown from "./icons/unknown.svg";

export interface WeatherIconProps {
  weather: PirateWeatherIcon;
  size: number;
}

export default function WeatherIcon({ weather, size }: WeatherIconProps) {
  const imageSource = (weather: PirateWeatherIcon) => {
    switch (weather) {
      case "clear-day":
        return iconClearDay;
      case "clear-night":
        return iconClearNight;
      case "cloudy":
        return iconCloudy;
      case "fog":
        return iconFog;
      case "partly-cloudy-day":
        return iconPartlyCloudyDay;
      case "partly-cloudy-night":
        return iconPartlyCloudyNight;
      case "rain":
        return iconRain;
      case "sleet":
        return iconSleet;
      case "snow":
        return iconSnow;
      case "wind":
        return iconWind;
      case "unknown":
      default:
        return iconUnknown;
    }
  };
  return (
    <img
      src={imageSource(weather)}
      alt={`Icon for weather ${weather}`}
      width={size}
      height={size}
    />
  );
}
