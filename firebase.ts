// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { getVertexAI } from "firebase/vertexai-preview";
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";
import {
  FirebaseStorage,
  connectStorageEmulator,
  getStorage,
} from "firebase/storage";

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | undefined;
  }
}
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

if (import.meta.env.DEV) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

let appCheck;

// Initialize the Vertex AI service
const vertexAI = getVertexAI(app);
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;
if (import.meta.env.DEV) {
  auth = getAuth(app);
  connectAuthEmulator(auth, "http://localhost:9099");
  db = getFirestore();
  connectFirestoreEmulator(db, "localhost", 8080);
  storage = getStorage();
  storage.app.options.storageBucket = "localhost:9199";
  connectStorageEmulator(storage, "localhost", 9199);
  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(
      import.meta.env.VITE_RECAPTCHA_SITE_KEY
    ),
    isTokenAutoRefreshEnabled: true,
  });
} else {
  auth = getAuth(app);
  db = getFirestore();

  appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(
      import.meta.env.VITE_RECAPTCHA_SITE_KEY
    ),
    isTokenAutoRefreshEnabled: true,
  });
}
export { auth, app, db, appCheck, vertexAI, analytics };
