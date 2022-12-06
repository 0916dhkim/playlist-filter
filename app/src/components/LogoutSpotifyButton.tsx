import Button from "./Button";
import { ReactElement } from "react";
import { signOut } from "../api/mutations";
import { sprinkles } from "../sprinkles.css";
import { useNavigate } from "react-router-dom";

export default function LogoutSpotifyButton(): ReactElement {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  return (
    <Button
      variant="primary"
      className={sprinkles({
        width: "full",
        maxWidth: { mobile: "sm", tablet: "md" },
      })}
      onClick={logout}
    >
      Logout
    </Button>
  );
}
