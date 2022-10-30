import Button from "./Button";
import { ReactElement } from "react";
import { signUserOut } from "../firebase";
import { sprinkles } from "../sprinkles.css";

export default function LogoutSpotifyButton(): ReactElement {
  const logout = async () => {
    try {
      await signUserOut();
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  return (
    <Button
      variant="primary"
      className={sprinkles({ minWidth: { mobile: "1/2", tablet: "1/4" } })}
      onClick={logout}
    >
      Logout
    </Button>
  );
}
