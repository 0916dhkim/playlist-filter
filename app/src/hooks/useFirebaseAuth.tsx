import { useEffect, useState } from "react";

import type { User } from "firebase/auth";
import { onAuthStateChanged } from "../firebase";

const getInitialUser = () =>
  new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged((user) => {
      resolve(user);
      unsubscribe();
    });
  });

const initialUser = await getInitialUser();

export default function useFirebaseAuth(): User | null {
  const [user, setUser] = useState<User | null>(initialUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return user;
}
