import axios, { CancelToken } from "axios";
import { useEffect } from "react";

/**
 * Create an axios cancel token that cancels upon unmount.
 */
export function useCancelToken(): CancelToken {
  const source = axios.CancelToken.source();

  // Cancel upon unmount.
  useEffect(() => {
    return () => source.cancel();
  }, [source]);

  return source.token;
}
