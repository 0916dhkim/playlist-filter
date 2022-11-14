import { ReactElement } from "react";
import { getPlaylists } from "../../api/queries";
import { sprinkles } from "../../sprinkles.css";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

type PlaylistsProps = {
  onSelect: (playlistId: string) => void;
};

export default function Playlists({ onSelect }: PlaylistsProps): ReactElement {
  const navigate = useNavigate();
  const result = useQuery(...getPlaylists(), {
    retry: false,
    onError: () => {
      navigate("/signin");
    },
  });

  return (
    <div
      className={sprinkles({
        display: "flex",
        flexDirection: "column",
        gap: "lg",
      })}
    >
      {result.data
        ? result.data.map((playlist) => (
            <span key={playlist.id} onClick={() => onSelect(playlist.id)}>
              {playlist.name}
            </span>
          ))
        : null}
    </div>
  );
}
