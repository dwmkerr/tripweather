import { initializeApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBl0MbWCaH9hPkayQHh_ZBbly2eSYT8is",
  authDomain: "dwmkerr-tripweather.firebaseapp.com",
  projectId: "dwmkerr-tripweather",
  storageBucket: "dwmkerr-tripweather.appspot.com",
  messagingSenderId: "249803627566",
  appId: "1:249803627566:web:ab8bee6d1bc1f6a42093bf",
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);
connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export { functions };
