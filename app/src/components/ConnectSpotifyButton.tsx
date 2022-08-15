import { ReactElement } from "react";
import { button } from "./ConnectSpotifyButton.css";
import { getSpotifyLoginUrl } from "../firebase";
import { redirect } from "../browser";

const handleSpotify = async () => {
  const url = await getSpotifyLoginUrl();
  redirect(url);
};

export default function ConnectSpotifyButton(): ReactElement {
  return (
    <button
      data-testid="connect-spotify-button"
      className={button}
      onClick={handleSpotify}
    >
      Connect Spotify
    </button>
  );
}
