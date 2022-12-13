import { Atom, useAtomValue } from "jotai";

import { AudioFeatureRanges } from "../../../api/types";
import { ReactElement } from "react";
import { getTracks } from "../../../api/queries";
import { list } from "./Tracks.css";
import { useQuery } from "@tanstack/react-query";
import TrackItem from "./TrackItem";

type TracksProps = {
  playlistId: string;
  audioFeatureRangesAtom: Atom<AudioFeatureRanges>;
};

export default function Tracks({
  playlistId,
  audioFeatureRangesAtom,
}: TracksProps): ReactElement {
  const audioFeatureRanges = useAtomValue(audioFeatureRangesAtom);
  const result = useQuery(...getTracks(playlistId, audioFeatureRanges));
  return (
    <div className={list}>
      {result.data
        ? result.data.tracks.map((track, index) => (
            <TrackItem key={`${index}-${track.id}`} track={track} />
          ))
        : null}
    </div>
  );
}
