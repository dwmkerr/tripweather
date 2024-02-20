import { checkCsvContents, importCsv, exportCsv } from "./LifelineCsv";

describe("LifelineCsv", () => {
  describe("checkCsvContents", () => {
    test("can check a CSV file for columns and rows", async () => {
      const csv = `Year,Month,Day,Age,Category,Title,Notes,Minor,,,,,,,,,,,,,,,,,,,,,
1985,1,,,,"Belfast",,,,,,,,,,,,,,,,,,,,,,,
1987,2,,,,Colchester,,,,,,,,,,,,,,,,,,,,,,,
`;
      const { columns, rowCount } = await checkCsvContents(csv);
      expect(columns).toEqual([
        "Year",
        "Month",
        "Day",
        "Age",
        "Category",
        "Title",
        "Notes",
        "Minor",
      ]);
      expect(rowCount).toEqual(2);
    });
  });

  describe("importCsv", () => {
    const defaultOptions = {
      columnMappings: {
        title: "Title",
        category: "Category",
        year: "Year",
        month: "Month",
        day: "Day",
        notes: "Notes",
        minor: "Minor",
      },
    };

    test("can import a basic CSV file", async () => {
      const csv = `Year,Month,Day,Age,Category,Title,Notes,Minor,,,,,,,,,,,,,,,,,,,,,
1985,1,,,😶Life,"Belfast",,,,,,,,,,,,,,,,,,,,,,,
1987,2,,,😶Life,Colchester,,,,,,,,,,,,,,,,,,,,,,,
`;
      const { warnings, lifeEvents } = await importCsv(csv, defaultOptions);
      expect(warnings).toMatchObject([]);
      expect(lifeEvents).toMatchObject([
        {
          year: 1985,
          month: 1,
          title: "Belfast",
          category: {
            emoji: "😶",
            name: "Life",
          },
          notes: "",
          minor: false,
        },
        {
          year: 1987,
          month: 2,
          title: "Colchester",
          category: {
            emoji: "😶",
            name: "Life",
          },
          notes: "",
          minor: false,
        },
      ]);
    });
    test("can ignore empty CSV lines", async () => {
      const csv = `Year,Month,Day,Age,Category,Title,Notes,Minor,,,,,,,,,,,,,,,,,,,,,
1985,1,,,,"Belfast",,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,
1987,2,,,,Colchester,,,,,,,,,,,,,,,,,,,,,,,
`;
      const { warnings, lifeEvents } = await importCsv(csv, defaultOptions);
      expect(warnings).toMatchObject([
        {
          title: "Skipped Empty Lines",
          message: "Skipped empty line(s): 2, 3",
        },
      ]);
      expect(lifeEvents).toMatchObject([
        {
          year: 1985,
          month: 1,
          title: "Belfast",
          notes: "",
          minor: false,
        },
        {
          year: 1987,
          month: 2,
          title: "Colchester",
          notes: "",
          minor: false,
        },
      ]);
    });
  });

  describe("exportCsv", () => {
    const defaultOptions = {
      columnMappings: {
        title: "Title",
        category: "Category",
        year: "Year",
        month: "Month",
        day: "Day",
        notes: "Notes",
        minor: "Minor",
      },
    };

    test("can export a basic CSV file", async () => {
      const events = [
        {
          year: 1985,
          month: 1,
          day: null,
          title: "Belfast",
          category: {
            emoji: "😶",
            name: "Life",
          },
          notes: null,
          minor: false,
        },
        {
          year: 1987,
          month: 2,
          day: null,
          title: "Colchester",
          category: {
            emoji: "😶",
            name: "Life",
          },
          notes: null,
          minor: true,
        },
      ];

      const csv = await exportCsv(events, defaultOptions);
      const expectedCsv = `Title,Category,Year,Month,Day,Notes,Minor
Belfast,😶 Life,1985,1,,,false
Colchester,😶 Life,1987,2,,,true
`;
      expect(csv).toEqual(expectedCsv);
    });
  });
});
