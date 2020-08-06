import { Session, refresh } from "../auth";
import { useSelector, useDispatch } from "react-redux";
import { ApplicationState } from "../state";
import { ApplicationDispatch } from "../store";
import { useMemo } from "react";

/**
 * React hook to produce a promise of refreshed session based on current session.
 */
export function useRefreshedSession(): Promise<Session> {
  const session = useSelector((state: ApplicationState) => state.session);
  const dispatch = useDispatch<ApplicationDispatch>();

  // Memoize promise of current session.
  const currentSessionPromise = useMemo(async () => {
    if (!session) {
      throw new Error("No session to refresh.");
    }
    return session;
  }, [session]);

  // Refresh session if less than 1 minute until expiry.
  if (session && session.accessTokenExpiry - Date.now() < 60 * 1000) {
    return refresh(session.refreshToken).then(refreshedSession => {
      dispatch({
        type: "SIGN_IN",
        value: refreshedSession
      });
      return refreshedSession;
    });
  }

  return currentSessionPromise;
}
