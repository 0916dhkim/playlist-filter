import type { NavigateFunction } from "react-router-dom";
import { signIn } from "../api/mutations";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const handleOAuthCallback = async (navigate: NavigateFunction) => {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    throw new Error(error);
  }
  if (code == null) {
    throw new Error("Callback page is requested without code");
  }

  await signIn(code);

  navigate("/");
};

export default function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    handleOAuthCallback(navigate);
  }, []);

  return (
    <div>
      <p>Connecting your Spotify account...</p>
    </div>
  );
}
