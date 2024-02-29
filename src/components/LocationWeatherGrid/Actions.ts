import { TripLocation } from "../../lib/Location";

export type DeleteLocationFunc = (location: TripLocation) => Promise<void>;
