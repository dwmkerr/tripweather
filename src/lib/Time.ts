import { Timestamp } from "firebase/firestore";

export function setMidnight(date: Date): Date {
  const midnightDate = new Date(date);
  midnightDate.setHours(0, 0, 0, 0);
  return midnightDate;
}

export function getMidnightDates(startDate: Date, endDate: Date): Date[] {
  const midnightDates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    midnightDates.push(setMidnight(new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return midnightDates;
}

export function getMidnightTimestamps(startDate: Date, endDate: Date) {
  return getMidnightDates(startDate, endDate).map(Timestamp.fromDate);
}
