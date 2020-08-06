import React from "react";
import { useSelector } from "react-redux";
import { ExportPageState } from "../../state";

export function ExportPage() {
  const tracks = useSelector((state: ExportPageState) => state.tracks);
  return (
    <div>
      Export Page
      {tracks.map(track => (
        <div key={track.id}>
          {track.uri}
        </div>
      ))}
    </div>
  );
}
