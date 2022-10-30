import ConnectSpotifyButton from "../components/ConnectSpotifyButton";
import LogoutSpotifyButton from "../components/LogoutSpotifyButton";
import { getProfile } from "../api/queries";
import { sprinkles } from "../sprinkles.css";
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

  return (
    <div
      className={sprinkles({
        minHeight: "screen",
        paddingX: "xxl",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "lg",
      })}
    >
      <h3>Welcome to Spotify Filter!</h3>
      <p>Let's connect your Spotify account to get started.</p>
      <ConnectSpotifyButton />
      <LogoutSpotifyButton />
    </div>
  );
}
