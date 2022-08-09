import { useEffect } from "react";

const connectSpotify = async () => {
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    throw new Error(error);
  }
  if (code == null) {
    throw new Error("Callback page is requested without code");
  }

  await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/connect-spotify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code }),
  });
};

export default function OAuthCallback() {
  useEffect(() => {
    connectSpotify();
  }, []);
  return (
    <div>
      <h1>OAuthCallback</h1>
    </div>
  );
}
