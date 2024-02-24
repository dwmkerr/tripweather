export interface PirateWeatherData {
  time: number; // 1674318840;
  summary: string; // "Clear"
  icon: PirateWeatherIcon; // "clear-day"
  nearestStormDistance: number; // 0
  nearestStormBearing: number; // 0
  precipIntensity: number; // 0.0
  precipProbability: number; // 0.0
  precipIntensityError: number; // 0.0
  precipType: string; // "none"
  temperature: number; // -4.59
  apparentTemperature: number; // -7.82
  dewPoint: number; // -6.21
  humidity: number; // 0.88
  pressure: number; // 1014.3
  windSpeed: number; // 7.20
  windGust: number; // 14.18
  windBearing: number; // 255.53
  cloudCover: number; // 0.14
  uvIndex: number; // 2.38
  visibility: number; // 14.7
  ozone: number; // 402.
}

export type PirateWeatherIcon =
  | "clear-day"
  | "clear-night"
  | "rain"
  | "snow"
  | "sleet"
  | "wind"
  | "fog"
  | "cloudy"
  | "partly-cloudy-day"
  | "partly-cloudy-night";

export interface PirateWeatherAlert {
  title: string; // "Wind Advisory issued January 24 at 9:25AM CST until January 24 at 6:00PM CST by NWS Corpus Christi TX"
  regions: string[]; // ["Live Oak", " Bee", " Goliad", " Victoria", " Jim Wells", " Inland Kleberg", " Inland Nueces", " Inland San Patricio", " Coastal Aransas", " Inland Refugio", " Inland Calhoun", " Coastal Kleberg", " Coastal Nueces", " Coastal San Patricio", " Aransas Islands", " Coastal Refugio", " Coastal Calhoun", " Kleberg Islands", " Nueces Islands", " Calhoun Islands"]
  severity: string; // "Moderate"
  time: number; // 1674573900
  expires: number; // 1674604800
  description: string; // "* WHAT...Southwest winds 25 to 30 mph with gusts up to 40 mph.  * WHERE...Portions of South Texas.  * WHEN...Until 6 PM CST this evening.  * IMPACTS...Gusty winds could blow around unsecured objects. Tree limbs could be blown down and a few power outages may result."
  uri: string; // "https://api.weather.gov/alerts/urn:oid:2.49.0.1.840.0.492c55233ef16d7a98a3337298c828b0f358ea34.001.1
}

export interface PirateWeatherSourceTimes {
  "hrrr_0-18": string; // "2023-01-21 14:00:00"
  hrrr_subh: string; // "2023-01-21 14:00:00"
  "hrrr_18-48": string; // "2023-01-21 12:00:00"
  gfs: string; // "2023-01-21 06:00:00"
  gefs: string; // "2023-01-21 06:00:00
}

export interface PirateWeatherResponse {
  latitude: number; // 45.42
  longitude: number; // -75.69,
  timezone: string; // "America/Toronto",
  offset: number; // -5.0,
  elevation: number; // 69,
  currently: PirateWeatherData;
  minutely: {
    summary: string; // "Clear"
    icon: PirateWeatherIcon; // "clear"
    data: PirateWeatherData[];
  };
  hourly: {
    summary: string; // "Cloudy"
    icon: PirateWeatherIcon; // "cloudy"
    data: PirateWeatherData[];
  };
  daily: {
    summary: string; // "Snow"
    icon: PirateWeatherIcon; // "cloudy"
    data: PirateWeatherData[];
  };
  alerts: PirateWeatherAlert[];
  flags: {
    sources: string[]; // [ "ETOPO1", "gfs", "gefs", "hrrrsubh", "hrrr" ]
  };
  sourceTimes: PirateWeatherSourceTimes;
  "nearest-station": number; // 0
  units: string; // "ca"
  version: string; // "V1.5.5"
}
