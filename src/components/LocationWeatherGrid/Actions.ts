import { TripLocation } from "../../lib/Location";

export type DeleteLocationFunc = (location: TripLocation) => Promise<void>;
export type RenameLocationLabelFunc = (
  location: TripLocation,
  label: string,
) => Promise<void>;
