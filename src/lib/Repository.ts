import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  Firestore,
} from "firebase/firestore";

import {
  HttpsCallable,
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import {
  FindAddressFromSuggestionRequest,
  FindAddressFromSuggestionResponse,
  SuggestRequest,
  SuggestResponse,
} from "../../functions/src/suggest";

// const lifeEventConverter = {
//   toFirestore(lifeEvent: WithFieldValue<LifeEvent>): SerializableLifeEvent {
//     return toSerializableObject(lifeEvent as LifeEvent);
//   },
//   fromFirestore(
//     snapshot: QueryDocumentSnapshot,
//     options: SnapshotOptions,
//   ): LifeEvent {
//     const data = snapshot.data(options) as SerializableLifeEvent;
//     return fromSerializableObject(data);
//   },
// };
// const userSettingsConverter = {
//   toFirestore(
//     userSettings: WithFieldValue<UserSettings>,
//   ): SerializableUserSettings {
//     const settings = userSettings as UserSettings;
//     return {
//       ...settings,
//       dateOfBirth:
//         settings.dateOfBirth && Timestamp.fromDate(settings.dateOfBirth),
//     } as SerializableUserSettings;
//   },
//   fromFirestore(
//     snapshot: QueryDocumentSnapshot,
//     options: SnapshotOptions,
//   ): UserSettings {
//     const data = snapshot.data(options) as SerializableUserSettings;
//     return {
//       ...data,
//       dateOfBirth: data.dateOfBirth?.toDate(),
//     };
//   },
// };
// const feedbackConverter = {
//   toFirestore(feedback: WithFieldValue<Feedback>): Feedback {
//     const feedbackData = feedback as Feedback;
//     return {
//       ...feedbackData,
//     } as Feedback;
//   },
//   fromFirestore(
//     snapshot: QueryDocumentSnapshot,
//     options: SnapshotOptions,
//   ): Feedback {
//     const data = snapshot.data(options) as Feedback;
//     return {
//       ...data,
//     };
//   },
// };

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBl0MbWCaH9hPkayQHh_ZBbly2eSYT8is",
  authDomain: "dwmkerr-tripweather.firebaseapp.com",
  projectId: "dwmkerr-tripweather",
  storageBucket: "dwmkerr-tripweather.appspot.com",
  messagingSenderId: "249803627566",
  appId: "1:249803627566:web:ab8bee6d1bc1f6a42093bf",
};

interface Functions {
  suggest: HttpsCallable<SuggestRequest, SuggestResponse>;
  findAddress: HttpsCallable<
    FindAddressFromSuggestionRequest,
    FindAddressFromSuggestionResponse
  >;
}

export class Repository {
  private static instance: Repository;
  public app: FirebaseApp;
  public auth: Auth;
  public db: Firestore;
  // private lifeEventsCollection: CollectionReference<
  //   LifeEvent,
  //   SerializableLifeEvent
  // >;
  // private userSettingsCollection: CollectionReference<
  //   UserSettings,
  //   SerializableUserSettings
  // >;
  // private feedbackCollection: CollectionReference<Feedback, Feedback>;
  //
  public functions: Functions;

  private constructor(emulator: boolean) {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.db = getFirestore();
    const functions = getFunctions(this.app);
    if (emulator) {
      connectFirestoreEmulator(this.db, "127.0.0.1", 8080);
      connectFunctionsEmulator(functions, "127.0.0.1", 5001);
    }

    this.functions = {
      suggest: httpsCallable<SuggestRequest, SuggestResponse>(
        functions,
        "arcGisSuggest",
      ),
      findAddress: httpsCallable<
        FindAddressFromSuggestionRequest,
        FindAddressFromSuggestionResponse
      >(functions, "findAddressFromSuggestion"),
    };

    // this.lifeEventsCollection = collection(this.db, "lifeevents").withConverter(
    //   lifeEventConverter,
    // );
    // this.userSettingsCollection = collection(
    //   this.db,
    //   "userSettings",
    // ).withConverter(userSettingsConverter);
    // this.feedbackCollection = collection(this.db, "feedback").withConverter(
    //   feedbackConverter,
    // );
  }

  public static getInstance(): Repository {
    if (!Repository.instance) {
      Repository.instance = new Repository(true);
    }

    return Repository.instance;
  }

  /*
  async load(): Promise<LifeEvent[]> {
    const querySnapshot = await getDocs(this.lifeEventsCollection);
    const puzzles = querySnapshot.docs.map((doc) => doc.data());
    return puzzles;
  }

  subscribeToLifeEvents(
    onLifeEvents: (lifeEvents: LifeEvent[]) => void,
    orderDirection: OrderByDirection,
  ): Unsubscribe {
    const q = query(
      this.lifeEventsCollection,
      orderBy("year", orderDirection),
      orderBy("month", orderDirection),
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lifeEvents = querySnapshot.docs.map((doc) => doc.data());
      onLifeEvents(lifeEvents);
    });
    return unsubscribe;
  }

  subscribeToChanges(
    id: string,
    onChange: (lifeEvent: LifeEvent) => void,
  ): Unsubscribe {
    return onSnapshot(doc(this.lifeEventsCollection, id), (doc) => {
      const lifeEvent = doc.data();
      if (lifeEvent) {
        onChange(lifeEvent);
      }
    });
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(this.lifeEventsCollection, id);
    await deleteDoc(docRef);
  }

  async create(
    lifeEventWithoutId: Omit<LifeEvent, "id" | "userId" | "date">,
  ): Promise<LifeEvent> {
    const uid = this.getUser()?.uid;
    if (!uid) {
      throw new TripWeatherError(
        "Create Event Error",
        "uid is null, cannot save to db",
      );
    }
    const newDocumentReference = doc(this.lifeEventsCollection);
    const lifeEvent: LifeEvent = {
      ...lifeEventWithoutId,
      id: newDocumentReference.id,
      userId: uid,
    };

    //  Store in firebase and we're done.
    await setDoc(newDocumentReference, lifeEvent);
    return lifeEvent;
  }

  async save(lifeEvent: LifeEvent): Promise<void> {
    await setDoc(doc(this.lifeEventsCollection, lifeEvent.id), lifeEvent);
  }

  async update(
    id: string,
    fields: Partial<SerializableLifeEvent>,
  ): Promise<void> {
    const docRef = doc(this.lifeEventsCollection, id);
    await updateDoc(docRef, fields);
  }

  async restore(
    restorableLifeEvents: Omit<LifeEvent, "id" | "userId">[],
    deleteExistingEvents: boolean,
  ): Promise<void> {
    //  If we don't have a user, we are going to have to fail.
    const uid = this.getUser()?.uid;
    if (!uid) {
      throw new TripWeatherError(
        "Restore Error",
        "Cannot restore events as the user is not logged in.",
      );
    }

    //  If we are deleting events, delete them all.
    if (deleteExistingEvents) {
      const querySnapshot = await getDocs(this.lifeEventsCollection);
      const deletePromises = querySnapshot.docs.map(async (doc) =>
        deleteDoc(doc.ref),
      );
      await Promise.all(deletePromises);
    }

    const promises = restorableLifeEvents.map(async (lifeEvent) => {
      const newDocumentReference = doc(this.lifeEventsCollection);

      //  Load the puzzles into the database, but always set the user id.
      return await setDoc(
        doc(this.lifeEventsCollection, newDocumentReference.id),
        {
          ...lifeEvent,
          userId: uid,
          id: newDocumentReference.id,
        },
      );
    });
    await Promise.all(promises);
  }

  async backup(): Promise<LifeEvent[]> {
    const lifeEvents = await this.load();
    return lifeEvents;
  }

  async getUserSettings(): Promise<UserSettings> {
    const uid = this.getUser()?.uid;
    if (!uid) {
      throw new TripWeatherError("Get Settings Error", "User is not logged in");
    }
    const docRef = doc(this.userSettingsCollection, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return {
        userId: uid,
        dateOfBirth: undefined,
        showAgeOnTimeline: false,
      };
    }
  }

  subscribeToUserSettings(
    onChange: (userSettings: UserSettings) => void,
  ): Unsubscribe {
    const uid = this.getUser()?.uid;
    if (!uid) {
      throw new TripWeatherError("Get Settings Error", "User is not logged in");
    }
    return onSnapshot(doc(this.userSettingsCollection, uid), (doc) => {
      const userSettings = doc.data();
      if (userSettings) {
        onChange(userSettings);
      } else {
        //  Return default settings.
        onChange({ userId: uid, showAgeOnTimeline: false });
      }
    });
  }

  async saveUserSettings(userSettings: UserSettings): Promise<void> {
    await setDoc(
      doc(this.userSettingsCollection, userSettings.userId),
      userSettings,
    );
  }

  async saveFeedback(feedback: Omit<Feedback, "userId">): Promise<void> {
    await addDoc(this.feedbackCollection, {
      ...feedback,
      userId: this.getUser()?.uid,
    });
  }

  getAuth(): Auth {
    return this.auth;
  }

  getUser(): User | null {
    return this.auth.currentUser;
  }

  async waitForUser(): Promise<User | null> {
    //  Wait for any cached credentials to be used to load the current user.
    await this.auth.authStateReady();
    return this.auth.currentUser;
  }

  async signInWithGoogle(): Promise<User | null> {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(this.auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      if (!token) {
        throw new Error("credential.token undefined on sign in");
      }
      return result.user;
    } catch (err) {
      throw TripWeatherError.fromError("Sign In Error", err);
    }
  }

  async signOut() {
    this.auth.signOut();
  }
  */
}
