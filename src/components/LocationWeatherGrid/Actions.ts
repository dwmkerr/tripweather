import { TripLocation } from "../../lib/Location";

export type DeleteLocationFunc = (location: TripLocation) => Promise<void>;

export type AddFavoriteLocationFunc = (location: TripLocation) => Promise<void>;

export type CheckFavoriteLocationFunc = (
  checked: boolean,
  location: TripLocation,
) => Promise<void>;

export type RemoveFavoriteLocationFunc = (
  location: TripLocation,
) => Promise<void>;

export type RenameLocationLabelFunc = (
  location: TripLocation,
  label: string,
) => Promise<void>;
