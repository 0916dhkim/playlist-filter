import { MouseEventHandler, ReactElement } from "react";
import { getProfile, getSpotifyLoginUrl } from "../api/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Button from "../components/Button";
import { redirect } from "../browser";
import { sprinkles } from "../sprinkles.css";
import { useNavigate } from "react-router-dom";

export default function SignIn(): ReactElement {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useQuery(...getProfile(), {
    onSuccess: () => {
      navigate("/");
    },
  });

  const handleSignIn: MouseEventHandler = async () => {
    const url = await queryClient.fetchQuery(...getSpotifyLoginUrl());
    redirect(url);
  };

  return (
    <div
      className={sprinkles({
        boxSizing: "border-box",
        minHeight: "screen",
        display: "flex",
        flexDirection: "column",
        gap: "lg",
        paddingY: "xxxl",
        paddingX: "xxl",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <h2>
        <i>🖭</i> Playlist Filter <i>🎶</i>
      </h2>
      <Button
        variant="primary"
        className={sprinkles({
          width: "full",
          maxWidth: { mobile: "xs", tablet: "md" },
        })}
        onClick={handleSignIn}
      >
        Sign in with Spotify
      </Button>
    </div>
  );
}
