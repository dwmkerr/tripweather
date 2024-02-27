import { formatTemperature } from "./FormatWeather";

describe("FormatWeather", () => {
  describe("formatTemperature", () => {
    test("can format temperature in each unit", () => {
      expect(formatTemperature(34.2223, "ca")).toEqual("34.2223˚C");
      expect(formatTemperature(20.1, "uk", 2)).toEqual("20.10˚C");
      expect(formatTemperature(16.4, "si", 0)).toEqual("16˚C");
      expect(formatTemperature(90.3, "us", 1)).toEqual("90.3˚F");
    });
  });
});
