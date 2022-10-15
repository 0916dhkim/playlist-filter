import ConnectSpotifyButton from "../components/ConnectSpotifyButton";
import { getProfile } from "../api/queries";
import { useEffect } from "react";
import { useFirebaseAuthState } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

/**
 * A page for prompting users to connect their Spotify account if not connected already.
 */
export default function Unconnected() {
  const { data: profile } = useQuery(...getProfile());
  const hasAuth = useFirebaseAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hasAuth) {
      navigate("/signin");
    }
  }, [hasAuth]);

  useEffect(() => {
    if (profile?.isConnectedToSpotify) {
      navigate("/");
    }
  }, [profile]);

  return <ConnectSpotifyButton />;
}
