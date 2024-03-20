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
  getDoc,
} from "firebase/firestore";

import { Auth, Unsubscribe, User } from "firebase/auth";
import { TripWeatherError } from "../Errors";
import { TripModel } from "./TripModels";
import { WeatherUnits } from "../../../functions/src/weather/PirateWeatherTypes";

const DraftTripIdKey = "draftTripId";

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
    //  Our timestamps are just data objects at the moment, so recreate the
    //  actual timestamp objects.
    return {
      ...data,
    };
  },
};

export class TripsCollection {
  private db: Firestore;
  private auth: Auth;

  private tripsCollection: CollectionReference<TripModel, TripModel>;
  private draftTripsCollection: CollectionReference<TripModel, TripModel>;
  currentTrip: TripModel | null;

  constructor(db: Firestore, auth: Auth) {
    this.db = db;
    this.auth = auth;
    this.tripsCollection = collection(this.db, "trips").withConverter(
      tripConverter,
    );
    this.draftTripsCollection = collection(this.db, "drafttrips").withConverter(
      tripConverter,
    );
    this.currentTrip = null;
  }

  async createOrLoadCurrentTrip(
    user: User | null,
    units: WeatherUnits,
    localStorage: Storage,
  ): Promise<TripModel> {
    //  On startup we will:
    //  If the user is logged in:
    //  [ ] try and load their current trip
    //  [ ] create a new draft trip otherwise
    //  If the user is not logged in
    //  [ ] check local storage for a draft trip and load it
    //  [ ] create a new draft trip otherwise store it in the draft trips collection and store the id in local storage
    //    const today = new Date();
    if (!user) {
      const draftTripId = localStorage.getItem(DraftTripIdKey);
      if (draftTripId === null) {
        console.log(
          `tripweather: startup: found no draft trip id - creating new draft`,
        );
        const newDraftTrip = this.newDraftTrip("New Draft Trip", units);
        await setDoc(
          doc(this.draftTripsCollection, newDraftTrip.id),
          newDraftTrip,
        );
        localStorage.setItem(DraftTripIdKey, newDraftTrip.id);
        this.currentTrip = newDraftTrip;
        return newDraftTrip;
      } else {
        console.log(
          `tripweather: startup: found draft trip id: ${draftTripId}`,
        );
        const tripReference = await getDoc(
          doc(this.draftTripsCollection, draftTripId),
        );
        const trip = tripReference.data();
        console.log(
          `tripweather: startup: found draft trip with id: ${draftTripId}`,
        );
        if (!trip) {
          console.log(
            `tripweather: startup: failed to find draft trip with id: ${draftTripId} - creating new draft trip`,
          );
          const newDraftTrip = this.newDraftTrip("New Draft Trip", units);
          await setDoc(
            doc(this.draftTripsCollection, newDraftTrip.id),
            newDraftTrip,
          );
          localStorage.setItem(DraftTripIdKey, newDraftTrip.id);
          this.currentTrip = newDraftTrip;
          return newDraftTrip;
        } else {
          console.log(
            `tripweather: startup: loaded draft trip with id: ${draftTripId}`,
          );
          this.currentTrip = trip;
          return trip;
        }
      }
    } else {
      return this.newDraftTrip("TODO", units);
    }
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
    isDraft: boolean,
    onChange: (trip: TripModel) => void,
  ): Unsubscribe {
    return onSnapshot(
      doc(isDraft ? this.draftTripsCollection : this.tripsCollection, id),
      (doc) => {
        const trip = doc.data();
        if (trip) {
          onChange(trip);
        }
      },
    );
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

  async update(trip: TripModel, fields: Partial<TripModel>): Promise<void> {
    const docRef = doc(
      trip.isDraft ? this.draftTripsCollection : this.tripsCollection,
      trip.id,
    );
    await updateDoc(docRef, fields);
  }

  newDraftTrip(name: string, units: WeatherUnits): TripModel {
    const newDocumentReference = doc(this.tripsCollection);
    const now = new Date();
    const nowTimestamp = Timestamp.fromDate(now);
    const startDate = new Date(now.setDate(now.getDate() - 2));
    const endDate = new Date(now.setDate(now.getDate() + 5));

    const trip: TripModel = {
      id: newDocumentReference.id,
      ownerId: this.auth.currentUser?.uid || "",
      name,
      startDate: Timestamp.fromDate(startDate),
      endDate: Timestamp.fromDate(endDate),
      isDraft: true,
      isCurrent: true,
      dateCreated: nowTimestamp,
      dateUpdated: nowTimestamp,
      locations: [],
      units,
    };

    return trip;
  }
}
