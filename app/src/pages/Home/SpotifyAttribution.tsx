import spotifyLogoGreen from "../../assets/SpotifyLogoRgbGreen.png";
import { sprinkles } from "../../sprinkles.css";
export default function SpotifyAttribution() {
  return (
    <div>
      <img
        src={spotifyLogoGreen}
        className={sprinkles({
          display: "block",
          maxHeight: "8",
          width: "auto",
          height: "auto",
        })}
      />
    </div>
  );
}
