// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD28R4Bqn8fxygXfOgFgUVWfst3Yg511po",
  authDomain: "yapster-d60ee.firebaseapp.com",
  projectId: "yapster-d60ee",
  storageBucket: "yapster-d60ee.appspot.com",
  messagingSenderId: "175338596069",
  appId: "1:175338596069:web:dc41c40983e43ebe2a560c",
  measurementId: "G-88N232T5SN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
