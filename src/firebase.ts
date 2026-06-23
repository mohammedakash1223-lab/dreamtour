import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA3SM99CIzL81Achn_w6mELr2Rub5BcVkI",
  authDomain: "dreamtour-27d9e.firebaseapp.com",
  databaseURL: "https://dreamtour-27d9e-default-rtdb.firebaseio.com",
  projectId: "dreamtour-27d9e",
  storageBucket: "dreamtour-27d9e.firebasestorage.app",
  messagingSenderId: "158026962769",
  appId: "1:158026962769:web:4803d3e978d1560ac3a570",
  measurementId: "G-QL3NBG4BJD"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
