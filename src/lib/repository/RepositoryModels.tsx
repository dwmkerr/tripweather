import { TripLocation } from "../Location";

export interface FavoriteLocationModel {
  id: string;
  userId: string;
  label: string;
  originalSearch: {
    address: string;
    magicKey: string;
    gps: string;
  };
  location: {
    address: string;
    longitude: number;
    latitude: number;
  };
}

export function findFavoriteLocationFromTripLocation(
  location: TripLocation,
  favoriteLocations: FavoriteLocationModel[],
) {
  //  We have a match if the location was an address and it matches or it
  //  was a GPS and it matches.
  return favoriteLocations.find((fl) =>
    fl.originalSearch.gps !== ""
      ? fl.originalSearch.gps === location.originalSearch.gps
      : fl.originalSearch.address === location.originalSearch.address,
  );
}

export function findTripLocationFromFavoriteLocation(
  favoriteLocation: FavoriteLocationModel,
  locations: TripLocation[],
) {
  //  We have a match if the location was an address and it matches or it
  //  was a GPS and it matches.
  return locations.find((location) =>
    location.originalSearch.gps !== ""
      ? location.originalSearch.gps === favoriteLocation.originalSearch.gps
      : location.originalSearch.address ===
        favoriteLocation.originalSearch.address,
  );
}
