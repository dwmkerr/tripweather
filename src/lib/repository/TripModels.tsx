import { TripLocation } from "../Location";

export interface TripModel {
  id: string;
  ownerId: string;
  isDraft: boolean; // if true, trip is not saved to server
  isCurrent: boolean; // if true, the current trip we're working on
  name: string;
  startDate: Date;
  endDate: Date;
  dateCreated: Date;
  dateUpdated: Date;
  locations: TripLocation[];
}
