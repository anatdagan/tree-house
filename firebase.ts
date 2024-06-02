// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBxg5kA1rsJl0Ri_XH8h5TJAcpRlkQZnO0",
  authDomain: "treehouse-chat-app.firebaseapp.com",
  projectId: "treehouse-chat-app",
  storageBucket: "treehouse-chat-app.appspot.com",
  messagingSenderId: "1023200743461",
  appId: "1:1023200743461:web:7146c066723e694cabefcc",
  measurementId: "G-XJ6F1KNG72",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);
export { auth, app, functions };
