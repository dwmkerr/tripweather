import { FirebaseApp, initializeApp } from "firebase/app";
import {
  Auth,
  GoogleAuthProvider,
  User,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
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
  ReverseGeocodeRequest,
  ReverseGeocodeResponse,
} from "../../../functions/src/location/LocationTypes";
import {
  WeatherRequest,
  WeatherResponse,
} from "../../../functions/src/weather/weather";
import { TripWeatherError } from "../Errors";
import { FavoriteLocationsCollection } from "./FavoritesCollection";

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
  reverseGeocode: HttpsCallable<ReverseGeocodeRequest, ReverseGeocodeResponse>;
  weather: HttpsCallable<WeatherRequest, WeatherResponse>;
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
  public favoriteLocations: FavoriteLocationsCollection;

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
      reverseGeocode: httpsCallable<
        ReverseGeocodeRequest,
        ReverseGeocodeResponse
      >(functions, "reverseGeocode"),

      weather: httpsCallable<WeatherRequest, WeatherResponse>(
        functions,
        "weather",
      ),
    };

    this.favoriteLocations = new FavoriteLocationsCollection(
      this.db,
      this.auth,
    );
  }

  public static getInstance(): Repository {
    if (!Repository.instance) {
      const useEmulator = process.env.TRIPWEATHER_USE_EMULATOR === "1";
      console.log(
        useEmulator
          ? "tripweather: using emulator"
          : "tripweather: using cloud",
      );
      Repository.instance = new Repository(useEmulator);
    }

    return Repository.instance;
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
}
