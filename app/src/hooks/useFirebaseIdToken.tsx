import { useEffect, useState } from "react";

import { onAuthStateChanged } from "../firebase";

const getInitialToken = () =>
  new Promise<string | undefined>((resolve) => {
    const unsubscribe = onAuthStateChanged((user) => {
      resolve(user?.getIdToken());
      unsubscribe();
    });
  });

const initialIdToken = await getInitialToken();

export default function useFirebaseIdToken(): string | undefined {
  const [idToken, setIdToken] = useState<string | undefined>(initialIdToken);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((user) => {
      user?.getIdToken().then((token) => setIdToken(token));
    });
    return unsubscribe;
  }, []);

  return idToken;
}
