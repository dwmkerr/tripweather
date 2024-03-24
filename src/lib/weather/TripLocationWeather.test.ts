import moment from "moment";
import { updateLocationWeatherDates } from "./TripLocationWeather";
import { TripLocation, WeatherStatus } from "../repository/TripModels";
import { Timestamp } from "firebase/firestore";

describe("TripLocationWeather", () => {
  describe("updateLocationWeatherDates", () => {
    test("can set the weather dates on a location, filtering extra dates and adding missing ones and sorting the result", () => {
      //  Helper to build a date.
      const getDate = (iso: string) => Timestamp.fromDate(moment(iso).toDate());

      const location: TripLocation = {
        id: "1",
        label: "Yosemite",
        originalSearch: {
          address: "Yosemite Valley",
          magicKey: "123",
          gps: "",
        },
        location: {
          address: "Yosemite Valley",
          longitude: 37.74712208944367,
          latitude: -119.59391902077097,
        },
        datesWeather: [
          {
            date: getDate("2024-06-12"),
            weatherStatus: WeatherStatus.Loaded,
            weather: undefined,
            updated: null,
          },
          {
            date: getDate("2024-06-13"),
            weatherStatus: WeatherStatus.Loaded,
            weather: undefined,
            updated: null,
          },
        ],
      };

      //  Now enrich the location with the specified dates.
      const updatedLocation = updateLocationWeatherDates(location, false, [
        getDate("2024-06-10"),
        getDate("2024-06-11"),
        getDate("2024-06-12"),
      ]);

      //  We should have removed the supurflous date (the 13th), preserved
      //  the data for the 12th, and added new 'loading' placeholders for the
      //  10th and 11th.
      expect(updatedLocation.datesWeather).toEqual([
        {
          date: getDate("2024-06-10"),
          weatherStatus: WeatherStatus.Loading,
          weather: undefined,
          updated: null,
        },
        {
          date: getDate("2024-06-11"),
          weatherStatus: WeatherStatus.Loading,
          weather: undefined,
          updated: null,
        },
        {
          date: getDate("2024-06-12"),
          weatherStatus: WeatherStatus.Loaded, // i.e. unchanged
          weather: undefined,
          updated: null,
        },
      ]);
    });

    test("can set the weather dates on a location, keeping extra dates and adding missing ones and sorting the result", () => {
      //  Helper to build a date.
      const getDate = (iso: string) => Timestamp.fromDate(moment(iso).toDate());

      const location: TripLocation = {
        id: "1",
        label: "Yosemite",
        originalSearch: {
          address: "Yosemite Valley",
          magicKey: "123",
          gps: "",
        },
        location: {
          address: "Yosemite Valley",
          longitude: 37.74712208944367,
          latitude: -119.59391902077097,
        },
        datesWeather: [
          {
            date: getDate("2024-06-13"),
            weatherStatus: WeatherStatus.Loaded,
            weather: undefined,
            updated: null,
          },
        ],
      };

      //  Now enrich the location with the specified dates. Keep existing dates.
      const updatedLocation = updateLocationWeatherDates(location, true, [
        getDate("2024-06-11"),
        getDate("2024-06-12"),
      ]);

      //  We should have kept the supurflous date (the 13th), preserved
      //  the data for the 13th, and added new 'loading' placeholders for the
      //  11th and 12th.
      expect(updatedLocation.datesWeather).toEqual([
        {
          date: getDate("2024-06-11"),
          weatherStatus: WeatherStatus.Loading,
          updated: null,
        },
        {
          date: getDate("2024-06-12"),
          weatherStatus: WeatherStatus.Loading,
          updated: null,
        },
        {
          date: getDate("2024-06-13"),
          weatherStatus: WeatherStatus.Loaded, // i.e. unchanged
          weather: undefined,
          updated: null,
        },
      ]);
    });
  });
});
