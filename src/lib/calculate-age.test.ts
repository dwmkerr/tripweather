import { calculateAge } from "./calculate-age";

describe("calculateAge", () => {
  test("can calculate age", () => {
    expect(calculateAge(new Date("2021-12-01"), new Date("2023-01-01"))).toBe(
      "-1 year",
    );
    expect(calculateAge(new Date("2022-12-01"), new Date("2023-01-01"))).toBe(
      "-1 month",
    );
    expect(calculateAge(new Date("2023-01-01"), new Date("2023-01-01"))).toBe(
      "0 months",
    );
    expect(calculateAge(new Date("2023-06-01"), new Date("2023-01-01"))).toBe(
      "4 months",
    );
    expect(calculateAge(new Date("2024-02-11"), new Date("2022-08-15"))).toBe(
      "1 year",
    );
  });
});
