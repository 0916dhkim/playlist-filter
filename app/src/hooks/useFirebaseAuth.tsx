import { useEffect, useState } from "react";

import type { User } from "firebase/auth";
import { onAuthStateChanged } from "../firebase";

export default function useFirebaseAuth(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return user;
}
