import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
export const app = initializeApp({
  apiKey: "AIzaSyAKyIIfYr2Gx1JyLAmYhb0g66PYX9mz9c8",
  authDomain: "nextchatfirebase.firebaseapp.com",
  projectId: "nextchatfirebase",
  storageBucket: "nextchatfirebase.firebasestorage.app",
  messagingSenderId: "651068465170",
  appId: "1:651068465170:web:98df27b305369cb04d38cb",
  measurementId: "G-0ZJ9LQMCKW",
});

export const auth = getAuth(app);
