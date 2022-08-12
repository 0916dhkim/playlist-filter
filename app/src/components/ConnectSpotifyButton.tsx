import { ReactElement } from "react";
import { getSpotifyLoginUrl } from "../firebase";
import { redirect } from "../browser";

const handleSpotify = async () => {
  const url = await getSpotifyLoginUrl();
  redirect(url);
};

export default function ConnectSpotifyButton(): ReactElement {
  return (
    <button data-testid="connect-spotify-button" onClick={handleSpotify}>
      Connect Spotify
    </button>
  );
}
