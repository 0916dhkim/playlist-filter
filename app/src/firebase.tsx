import {
  DEV,
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from "./env";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  User,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged as onAuthStateChangedOriginal,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { initializeApp } from "firebase/app";
import invariant from "tiny-invariant";
import z from "zod";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
if (DEV) {
  connectAuthEmulator(auth, "http://localhost:9099");
}

export const registerUser = async (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signIn = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUserOut = () => {
  return signOut(auth);
};

export const guestSignIn = async () => {
  return signInAnonymously(auth);
};

export const getSpotifyLoginUrl = async () => {
  const idToken = await getIdToken();
  const response = await fetch("/api/spotify-login-url", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  const { url } = z
    .object({
      url: z.string(),
    })
    .parse(await response.json());

  return url;
};

export const connectSpotify = async (code: string) => {
  const token = await getIdToken();
  await fetch("/api/connect-spotify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
  return;
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChangedOriginal(auth, callback);
};

export const getIdToken = async () => {
  const token = await auth.currentUser?.getIdToken();
  invariant(token, "User is not signed in");
  return token;
};

const FirebaseAuthStateContext = createContext<User | null>(null);
type FirebaseAuthStateProviderProps = {
  children: ReactNode;
};
export function FirebaseAuthStateProvider({
  children,
}: FirebaseAuthStateProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <FirebaseAuthStateContext.Provider value={user}>
      {children}
    </FirebaseAuthStateContext.Provider>
  );
}

export const useFirebaseAuthState = () => {
  const user = useContext(FirebaseAuthStateContext);
  return !!user;
};

const initialUser = await new Promise<User | null>((resolve) => {
  const unsubscribe = onAuthStateChanged((user) => {
    resolve(user);
    unsubscribe();
  });
});
