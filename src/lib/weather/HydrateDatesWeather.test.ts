import { Timestamp } from "firebase/firestore";
import {
  LocationDateWeather,
  TripLocation,
  WeatherStatus,
  ldwKey,
} from "../repository/TripModels";
import { filterLocations } from "./HydrateDatesWeather";
import { getMidnightTimestamps } from "../Time";

describe("HydrateDatesWeather", () => {
  describe("filterLocations", () => {
    const mockWeatherData: LocationDateWeather = new Map();
    // Mocking weather data for testing purposes
    const mockLocation1: TripLocation = {
      id: "1",
      label: "Peaks",
      location: {
        address: "Peak District National Park",
        longitude: 1,
        latitude: 2,
      },
      originalSearch: {
        address: "Peak District",
        magicKey: "123",
        gps: "123",
      },
    };
    const mockLocation2 = {
      id: "2",
      label: "Lakes",
      location: {
        address: "Lake District National Park",
        longitude: 2,
        latitude: 3,
      },
      originalSearch: {
        address: "Lake District",
        magicKey: "123",
        gps: "1,2",
      },
    };
    const mockLocation3 = {
      id: "3",
      label: "Dales",
      location: {
        address: "Yorkshire Dales",
        longitude: 2,
        latitude: 3,
      },
      originalSearch: {
        address: "Dales",
        magicKey: "123",
        gps: "1,2",
      },
    };

    beforeEach(() => {
      //  Clearing the mock weather data before each test.
      mockWeatherData.clear();
    });

    test("should keep locations with no weather data provided", () => {
      const filteredLocations = filterLocations(
        mockWeatherData,
        [mockLocation1, mockLocation2, mockLocation3],
        new Date("2024-03-15"),
        new Date("2024-03-17"),
      );
      expect(filteredLocations).toEqual([
        mockLocation1,
        mockLocation2,
        mockLocation3,
      ]);
    });

    test("should filter out locations with weather data for all dates", () => {
      //  Add weather data for all dates for the first location.
      const date1 = Timestamp.fromDate(new Date("2024-03-15"));
      const date2 = Timestamp.fromDate(new Date("2024-03-16"));
      const date3 = Timestamp.fromDate(new Date("2024-03-17"));
      const updated = Timestamp.fromDate(new Date("2024-03-14"));
      mockWeatherData.set(ldwKey(mockLocation1.location, date1), {
        date: date1,
        updated,
        weatherStatus: WeatherStatus.Loaded,
      });
      mockWeatherData.set(ldwKey(mockLocation1.location, date2), {
        date: date2,
        updated,
        weatherStatus: WeatherStatus.Loaded,
      });
      mockWeatherData.set(ldwKey(mockLocation1.location, date3), {
        date: date3,
        updated,
        weatherStatus: WeatherStatus.Loaded,
      });

      const filteredLocations = filterLocations(
        mockWeatherData,
        [mockLocation1, mockLocation2, mockLocation3],
        new Date("2024-03-15"),
        new Date("2024-03-17"),
      );
      expect(filteredLocations).toEqual([mockLocation2, mockLocation3]);
    });

    test("should filter out locations with weather data for some dates", () => {
      //  Add weather data for some dates for the second location.
      const date1 = Timestamp.fromDate(new Date("2024-03-15"));
      const date2 = Timestamp.fromDate(new Date("2024-03-16"));

      const updated = Timestamp.fromDate(new Date("2024-03-14"));
      mockWeatherData.set(ldwKey(mockLocation2.location, date1), {
        date: date1,
        updated,
        weatherStatus: WeatherStatus.Loaded,
      });
      mockWeatherData.set(ldwKey(mockLocation2.location, date2), {
        date: date2,
        updated,
        weatherStatus: WeatherStatus.Loaded,
      });

      const filteredLocations = filterLocations(
        mockWeatherData,
        [mockLocation1, mockLocation2, mockLocation3],
        new Date("2024-03-15"),
        new Date("2024-03-16"),
      );
      expect(filteredLocations).toEqual([mockLocation1, mockLocation3]);
    });

    test("should not filter out locations with weather data for part of the date range", () => {
      //  Add weather data for one date only for the second location.
      const date1 = Timestamp.fromDate(new Date("2024-03-15"));

      const updated = Timestamp.fromDate(new Date("2024-03-14"));
      mockWeatherData.set(ldwKey(mockLocation2.location, date1), {
        date: date1,
        updated,
        weatherStatus: WeatherStatus.Loaded,
      });

      const filteredLocations = filterLocations(
        mockWeatherData,
        [mockLocation1, mockLocation2, mockLocation3],
        new Date("2024-03-15"),
        new Date("2024-03-16"),
      );
      expect(filteredLocations).toEqual([
        mockLocation1,
        mockLocation2,
        mockLocation3,
      ]);
    });
  });
});
