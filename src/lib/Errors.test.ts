import { TripWeatherError } from "./Errors";

describe("Errors", () => {
  describe("fromError", () => {
    test("can build from a TripWeatherError", () => {
      const error = TripWeatherError.fromError(
        "new title",
        new TripWeatherError("title", "message"),
      );
      expect(error.title).toEqual("title");
      expect(error.message).toEqual("message");
    });

    test("can build from a Error", () => {
      const error = new Error("error message");
      const tripWeatherError = TripWeatherError.fromError("title", error);
      expect(tripWeatherError.title).toEqual("title");
      expect(tripWeatherError.message).toEqual("error message");
      expect(tripWeatherError.error).toEqual(error);
    });
  });
});
