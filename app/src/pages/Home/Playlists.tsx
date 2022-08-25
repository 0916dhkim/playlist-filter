import { ReactElement } from "react";
import { sprinkles } from "../../sprinkles.css";
import { usePlaylistsQuery } from "../../api/hooks";

type PlaylistsProps = {
  onSelect: (playlistId: string) => void;
};

export default function Playlists({ onSelect }: PlaylistsProps): ReactElement {
  const result = usePlaylistsQuery();
  return (
    <div
      className={sprinkles({
        display: "flex",
        flexDirection: "column",
        gap: "lg",
      })}
    >
      {result.data
        ? result.data.playlists.map((playlist) => (
            <span key={playlist.id} onClick={() => onSelect(playlist.id)}>
              {playlist.name}
            </span>
          ))
        : null}
    </div>
  );
}
