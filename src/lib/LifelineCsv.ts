import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { LifeEvent, ecFromString, ecToString } from "./LifeEvent";

type ImportedLifeEvent = Omit<LifeEvent, "id" | "userId">;

type ImportWarning = {
  title: string;
  message: string;
  line?: number;
};

type ImportResults = {
  lifeEvents: ImportedLifeEvent[];
  warnings: ImportWarning[];
};

function isEmptyRecord(record: Record<string, string>): boolean {
  const anyValue = Object.keys(record).find((key) => !!record[key]);
  return anyValue === undefined;
}

export type CheckCsvResults = {
  columns: string[];
  rowCount: number;
};

export async function checkCsvContents(csv: string): Promise<CheckCsvResults> {
  const records = parse(csv) as string[][];
  return {
    columns: records[0].filter((column) => column !== ""),
    rowCount: records.length - 1,
  };
}

export type ImportCsvOptions = {
  columnMappings: {
    title: string;
    category: string;
    year: string;
    month: string;
    day: string;
    notes: string;
    minor: string;
  };
};

export async function importCsv(
  csv: string,
  options: ImportCsvOptions,
): Promise<ImportResults> {
  const warnings: ImportWarning[] = [];
  const emptyLineNumbers: number[] = [];
  const requireString = (
    record: Record<string, string>,
    colName: string,
    line: number,
  ) => {
    const val = record[colName];
    if (val === undefined) {
      warnings.push({
        title: "CSV Error",
        message: `Missing field ${colName} on line ${line + 1}`,
        line,
      });
      return undefined;
    }
    return val;
  };
  const records = parse(csv, {
    columns: true,
  }) as Record<string, string>[];
  const results = records.map((record, line): ImportedLifeEvent | undefined => {
    //  Skip completely empty lines that are commonly exported at the end of the
    //  rows in excel.
    if (isEmptyRecord(record)) {
      emptyLineNumbers.push(line + 1);
      return undefined;
    }

    //  If we are missing the year, skip and warn.
    const yearStr = requireString(record, options.columnMappings.year, line);
    if (yearStr === undefined) {
      return undefined;
    }
    const title = record?.[options.columnMappings.title];
    const category = record?.[options.columnMappings.category];
    const eventCategory = ecFromString(category);
    const year = Number.parseInt(yearStr);
    const month = record?.[options.columnMappings.month];
    const day = record?.[options.columnMappings.day];
    const notes = record?.[options.columnMappings.notes];
    const minor = record?.[options.columnMappings.minor];

    return {
      year,
      month: month ? Number.parseInt(month) : null,
      day: day ? Number.parseInt(day) : null,
      category: eventCategory,
      title,
      notes,
      minor: minor === "true",
    };
  });

  //  Filter out the undefined rows which we couldn't parse.
  const lifeEvents = results.filter(
    (record): record is ImportedLifeEvent => !!record,
  );

  //  If there were skipped lines, warn.
  if (emptyLineNumbers.length > 0) {
    warnings.push({
      title: "Skipped Empty Lines",
      message: `Skipped empty line(s): ${emptyLineNumbers.join(", ")}`,
    });
  }
  return {
    lifeEvents,
    warnings,
  };
}

export async function exportCsv(
  events: Omit<LifeEvent, "id" | "userId">[],
  options: ImportCsvOptions,
): Promise<string> {
  const columnsRow = [
    options.columnMappings.title,
    options.columnMappings.category,
    options.columnMappings.year,
    options.columnMappings.month,
    options.columnMappings.day,
    options.columnMappings.notes,
    options.columnMappings.minor,
  ];
  const rows = events.map((event) => [
    event.title,
    ecToString(event.category),
    event.year,
    event.month,
    event.day,
    event.notes,
    event.minor ? "true" : "false",
  ]);

  const csv = stringify([columnsRow, ...rows]);

  return csv;
}
