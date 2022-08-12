import {
  User,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged as onAuthStateChangedOriginal,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";

import { initializeApp } from "firebase/app";
import invariant from "tiny-invariant";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const registerUser = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChangedOriginal(auth, callback);
};

export const getIdToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  invariant(token, "User is not signed in");
  return token;
};

export const useFirebaseAuthState = () => {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return !!user;
};

const initialUser = await new Promise<User | null>((resolve) => {
  const unsubscribe = onAuthStateChanged((user) => {
    resolve(user);
    unsubscribe();
  });
});
