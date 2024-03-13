import { Timestamp } from "firebase/firestore";

export function setMidnight(date: Date): Date {
  date.setHours(0, 0, 0, 0);
  return date;
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
