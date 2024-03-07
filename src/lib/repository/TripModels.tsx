import { Timestamp } from "firebase/firestore";
import { TripLocation } from "../Location";

export interface TripModel {
  id: string;
  ownerId: string;
  isDraft: boolean; // if true, trip is not saved to server
  isCurrent: boolean; // if true, the current trip we're working on
  name: string;
  startDate: Timestamp;
  endDate: Timestamp;
  dateCreated: Timestamp;
  dateUpdated: Timestamp;
  locations: TripLocation[];
}
