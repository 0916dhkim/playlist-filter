import { ReactElement } from "react";
import { button } from "./ConnectSpotifyButton.css";
import { signUserOut } from "../firebase";



export default function LogoutSpotifyButton(): ReactElement {
    const logout = async () => {
        try {
            await signUserOut()
        } catch (error) {
        console.error("Logout Error: ",error);
        }
    };
    
  return (
    <button
      data-testid="logout-spotify-button"
      className={button}
      onClick={logout}
    >
     Logout
    </button>
  );
}
