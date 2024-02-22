import { Candidate } from "../../functions/src/suggest";

export enum AddressSearchStatus {
  NotStarted,
  InProgress,
  Complete,
}
export interface TripLocation {
  id: string;
  originalSearch: {
    address: string;
    magicKey: string;
  };
  addressSearchStatus: AddressSearchStatus;
  candidate?: Candidate;
}
