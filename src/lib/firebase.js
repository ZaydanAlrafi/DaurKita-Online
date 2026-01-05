import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD57YOshpYdkrXss7YM_H-rHvRYuY2oJEI",
  authDomain: "daurkita-online.firebaseapp.com",
  projectId: "daurkita-online",
  storageBucket: "daurkita-online.firebasestorage.app",
  messagingSenderId: "789286520394",
  appId: "1:789286520394:web:80e4f5421414d8b4afc8b3"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
export const auth = getAuth(app);