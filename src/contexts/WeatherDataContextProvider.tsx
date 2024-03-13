import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  DateWeather,
  LocationDateWeather,
  TripModel,
} from "../lib/repository/TripModels";
import { startUpdateWeather } from "../lib/weather/HydrateDatesWeather";

interface WeatherDataContextValue {
  currentTrip: TripModel | null;
  setCurrentTrip: (trip: TripModel | null) => void;
  locationDateWeather: LocationDateWeather;
  setLocationDateWeather: (weather: LocationDateWeather) => void;
}

const WeatherDataContext = createContext<WeatherDataContextValue | null>(null);

export const WeatherDataContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [currentTrip, setCurrentTrip] = useState<TripModel | null>(null);
  const [locationDateWeather, setLocationDateWeather] =
    useState<LocationDateWeather>(new Map<string, DateWeather>());

  //  When the current trip changes, update our location data weather.
  useEffect(() => {
    if (currentTrip === null) {
      return;
    }
    const ldw = startUpdateWeather(
      currentTrip.locations,
      currentTrip.startDate.toDate(),
      currentTrip.endDate.toDate(),
    );
    console.log("tripweather: wdc: setting loading states...");
    setLocationDateWeather(ldw);
  }, [currentTrip]);

  const value: WeatherDataContextValue = {
    currentTrip,
    setCurrentTrip,
    locationDateWeather,
    setLocationDateWeather,
  };

  return (
    <WeatherDataContext.Provider value={value}>
      {children}
    </WeatherDataContext.Provider>
  );
};

export const useWeatherDataContext = () => {
  const context = useContext(WeatherDataContext);
  if (!context) {
    throw new Error(
      "useWeatherDataContext must be used within a WeatherDataContextProvider",
    );
  }
  return context;
};
