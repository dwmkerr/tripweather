import {
  CoordinateRexComplete,
  CoordinateRexPartial,
} from "./CoordinatesMaskedInput";

//  Some coordinate strings as fixtures.
const validPartialCoordinates = [
  "37",
  "-37.745",
  "37.745052",
  "-37.745052101, ",
  "37.74505210183 , -119",
  "-37.74505210183 , 119",
  "37.74505210183, 119.",
  "-37.74505210183359, -119.593",
  "37.74505210183359, -119.59357116788196",
];
const validCompleteCoordinates = [
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
  "37.74505210183 -, -119",
  "-37.74505210183 , LL119",
  "37.74505210183, 119..",
  "-37.74505210183359, --119.593",
  "37.74505210183359, --119.59357116788196 8",
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
});
