import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  CollectionReference,
  WithFieldValue,
  QueryDocumentSnapshot,
  SnapshotOptions,
  setDoc,
  deleteDoc,
  query,
  updateDoc,
  Firestore,
} from "firebase/firestore";

import { FavoriteLocationModel } from "./RepositoryModels";
import { Auth, Unsubscribe } from "firebase/auth";
import { TripWeatherError } from "../Errors";

const favoriteLocationsConverter = {
  toFirestore(
    favoriteLocation: WithFieldValue<FavoriteLocationModel>,
  ): FavoriteLocationModel {
    const location = favoriteLocation as FavoriteLocationModel;
    return {
      ...location,
    } as FavoriteLocationModel;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): FavoriteLocationModel {
    const data = snapshot.data(options) as FavoriteLocationModel;
    return {
      ...data,
    };
  },
};

export class FavoriteLocationsCollection {
  private db: Firestore;
  private auth: Auth;

  private favoriteLocationsCollection: CollectionReference<
    FavoriteLocationModel,
    FavoriteLocationModel
  >;

  constructor(db: Firestore, auth: Auth) {
    this.db = db;
    this.auth = auth;
    this.favoriteLocationsCollection = collection(
      this.db,
      "favorites",
    ).withConverter(favoriteLocationsConverter);
  }

  async load(): Promise<FavoriteLocationModel[]> {
    const querySnapshot = await getDocs(this.favoriteLocationsCollection);
    const locations = querySnapshot.docs.map((doc) => doc.data());
    return locations;
  }

  subscribe(
    onFavoriteLocations: (favoriteLocations: FavoriteLocationModel[]) => void,
  ): Unsubscribe {
    const q = query(this.favoriteLocationsCollection);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const locations = querySnapshot.docs.map((doc) => doc.data());
      onFavoriteLocations(locations);
    });
    return unsubscribe;
  }

  subscribeToChanges(
    id: string,
    onChange: (lifeEvent: FavoriteLocationModel) => void,
  ): Unsubscribe {
    return onSnapshot(doc(this.favoriteLocationsCollection, id), (doc) => {
      const location = doc.data();
      if (location) {
        onChange(location);
      }
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.favoriteLocationsCollection, id);
    await deleteDoc(docRef);
  }

  async create(
    favoriteLocationWithoutId: Omit<FavoriteLocationModel, "id" | "userId">,
  ): Promise<FavoriteLocationModel> {
    if (this.auth.currentUser === null) {
      throw new TripWeatherError(
        "User Error",
        "User must be logged in to save a favorite location",
      );
    }

    const newDocumentReference = doc(this.favoriteLocationsCollection);
    const favoriteLocation: FavoriteLocationModel = {
      ...favoriteLocationWithoutId,
      id: newDocumentReference.id,
      userId: this.auth.currentUser.uid,
    };

    //  Store in firebase and we're done.
    await setDoc(newDocumentReference, favoriteLocation);
    return favoriteLocation;
  }

  async save(favoriteLocation: FavoriteLocationModel): Promise<void> {
    await setDoc(
      doc(this.favoriteLocationsCollection, favoriteLocation.id),
      favoriteLocation,
    );
  }

  async update(
    id: string,
    fields: Partial<FavoriteLocationModel>,
  ): Promise<void> {
    const docRef = doc(this.favoriteLocationsCollection, id);
    await updateDoc(docRef, fields);
  }
}
