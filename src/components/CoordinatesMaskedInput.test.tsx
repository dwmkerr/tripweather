import {
  CoordinateRexComplete,
  CoordinateRexPartial,
  extractCoordinates,
} from "./CoordinatesMaskedInput";

//  Some coordinate strings as fixtures.
const validPartialCoordinates = [
  "-",
  "-1",
  "-1.",
  "-37",
  "37",
  "-37.745",
  "37.745052",
  "-37, ",
  "1.53,2.",
  "37.74505210183 , -119",
  "-37.74505210183 , 119",
  "37.74505210183, 119.",
  "-37.74505210183359, -119.593",
  "37.74505210183359, -119.59357116788196",
];
const invalidPartialCoordinates = [
  "3L",
  "--37.745",
  "37..745052",
  "-37.745052101,, ",
  "  37.74505210183 , -119",
  "37 -, -119",
  "-37.74505210183 , LL119",
  "37.74505210183, 119..",
  "-37.74505210183359, --119.593",
  "37.74505210183359, --119.59357116788196 8",
];
const validCompleteCoordinates = [
  "37.74505210183 , -119",
  "-37.74505210183 , 119",
  "37.74505210183, 119.",
  "-37.74505210183359, -119.593",
  "37.74505210183359, -119.59357116788196",
  "37, -119.59357116788196",
  "1.2,2",
];
const invalidCompleteCoordinates = [
  "3L",
  "--37.745",
  "37..745052",
  "-37.745052101,, ",
  "  37.74505210183 -, -119",
  "-37.74505210183 , LL119",
  "37.74505210183, 119..",
  "37",
  "-37.745",
  "37.745052",
  "-37.745052101, ",
  "-37.74505210183359, --119.593",
  "37.74505210183359, --119.59357116788196 8",
];

describe("CoordinatesMaskedInput", () => {
  describe("CoordinateRexPartial", () => {
    test("correctly passes valid partial coordinates", () => {
      validPartialCoordinates.forEach((valid) => {
        expect(valid).toMatch(CoordinateRexPartial);
      });
    });
    test("correctly fails invalid partial coordinates", () => {
      invalidPartialCoordinates.forEach((valid) => {
        expect(valid).not.toMatch(CoordinateRexPartial);
      });
    });
  });
  describe("CoordinateRexComplete", () => {
    test("correctly passes valid complete coordinates", () => {
      validCompleteCoordinates.forEach((valid) => {
        expect(valid).toMatch(CoordinateRexComplete);
      });
    });
    test("correctly fails invalid complete coordinates", () => {
      invalidCompleteCoordinates.forEach((valid) => {
        expect(valid).not.toMatch(CoordinateRexComplete);
      });
    });
  });

  describe("extractCoordinates", () => {
    test("correctly fails to extract latitude and longitude from invalid coordinates", () => {
      expect(() => extractCoordinates(validPartialCoordinates[0])).toThrowError(
        "coordinate string '-' is not valid",
      );
      expect(() =>
        extractCoordinates(invalidCompleteCoordinates[5]),
      ).toThrowError(
        "coordinate string '-37.74505210183 , LL119' is not valid",
      );
    });
    test("correctly extracts latitude and longtitude from valid complete coordinates", () => {
      expect(extractCoordinates(validCompleteCoordinates[0])).toEqual({
        latitude: 37.74505210183,
        longitude: -119,
      });
      expect(extractCoordinates(validCompleteCoordinates[1])).toEqual({
        latitude: -37.74505210183,
        longitude: 119,
      });
      expect(extractCoordinates(validCompleteCoordinates[2])).toEqual({
        latitude: 37.74505210183,
        longitude: 119,
      });
      expect(extractCoordinates(validCompleteCoordinates[3])).toEqual({
        latitude: -37.74505210183359,
        longitude: -119.593,
      });
      expect(extractCoordinates(validCompleteCoordinates[4])).toEqual({
        latitude: 37.74505210183359,
        longitude: -119.59357116788196,
      });
    });
  });
});
