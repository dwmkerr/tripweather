import { getMidnightDates } from "./Time"; // Import the function you want to test

describe("getMidnightDates", () => {
  it("returns an array of Date objects with midnight time for each day between the provided start and end dates", () => {
    const startDate = new Date("2024-02-24");
    const endDate = new Date("2024-02-26");

    const expectedMidnightDates = [
      new Date("2024-02-24T00:00:00.000Z"),
      new Date("2024-02-25T00:00:00.000Z"),
      new Date("2024-02-26T00:00:00.000Z"),
    ];

    const resultMidnightDates = getMidnightDates(startDate, endDate);

    expect(resultMidnightDates).toEqual(expectedMidnightDates);
  });

  it("handles same start and end dates correctly", () => {
    const startDate = new Date("2024-02-24");
    const endDate = new Date("2024-02-24");

    const expectedMidnightDates = [new Date("2024-02-24T00:00:00.000Z")];

    const resultMidnightDates = getMidnightDates(startDate, endDate);

    expect(resultMidnightDates).toEqual(expectedMidnightDates);
  });
});
