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
  Timestamp,
} from "firebase/firestore";

import { Auth, Unsubscribe } from "firebase/auth";
import { TripWeatherError } from "../Errors";
import { TripModel } from "./TripModels";

const tripConverter = {
  toFirestore(trip: WithFieldValue<TripModel>): TripModel {
    const tripModel = trip as TripModel;
    return {
      ...tripModel,
    };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): TripModel {
    const data = snapshot.data(options) as TripModel;
    return {
      ...data,
    };
  },
};

export class TripsCollection {
  private db: Firestore;
  private auth: Auth;

  private tripsCollection: CollectionReference<TripModel, TripModel>;
  private currentTrip: TripModel | null;

  constructor(db: Firestore, auth: Auth) {
    this.db = db;
    this.auth = auth;
    this.tripsCollection = collection(this.db, "trips").withConverter(
      tripConverter,
    );
    this.currentTrip = null;
  }

  async load(): Promise<TripModel[]> {
    const querySnapshot = await getDocs(this.tripsCollection);
    const trips = querySnapshot.docs.map((doc) => doc.data());
    return trips;
  }

  subscribe(onTrips: (trips: TripModel[]) => void): Unsubscribe {
    const q = query(this.tripsCollection);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const trips = querySnapshot.docs.map((doc) => doc.data());
      onTrips(trips);
    });
    return unsubscribe;
  }

  subscribeToChanges(
    id: string,
    onChange: (trip: TripModel) => void,
  ): Unsubscribe {
    return onSnapshot(doc(this.tripsCollection, id), (doc) => {
      const trip = doc.data();
      if (trip) {
        onChange(trip);
      }
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.tripsCollection, id);
    await deleteDoc(docRef);
  }

  async create(
    tripWithoutId: Omit<TripModel, "id" | "userId">,
  ): Promise<TripModel> {
    if (this.auth.currentUser === null) {
      throw new TripWeatherError(
        "User Error",
        "User must be logged in to save a trip location",
      );
    }

    const newDocumentReference = doc(this.tripsCollection);
    const trip: TripModel = {
      ...tripWithoutId,
      id: newDocumentReference.id,
      ownerId: this.auth.currentUser.uid,
    };

    //  Store in firebase and we're done.
    await setDoc(newDocumentReference, trip);
    return trip;
  }

  async save(trip: TripModel): Promise<void> {
    await setDoc(doc(this.tripsCollection, trip.id), trip);
  }

  async update(id: string, fields: Partial<TripModel>): Promise<void> {
    const docRef = doc(this.tripsCollection, id);
    await updateDoc(docRef, fields);
  }

  async createCurrentTripDraft(
    name: string,
    startDate: Date,
    endDate: Date,
  ): Promise<TripModel> {
    const newDocumentReference = doc(this.tripsCollection);
    const now = Timestamp.fromDate(new Date());
    const trip: TripModel = {
      id: newDocumentReference.id,
      ownerId: this.auth.currentUser?.uid || "",
      name,
      startDate: Timestamp.fromDate(startDate),
      endDate: Timestamp.fromDate(endDate),
      isDraft: true,
      isCurrent: true,
      dateCreated: now,
      dateUpdated: now,
      locations: [],
    };

    //  Store in firebase and we're done.
    //  TODO: we cannot call 'setDoc' as we're offline.
    // await setDoc(newDocumentReference, trip);

    return trip;
  }
}
