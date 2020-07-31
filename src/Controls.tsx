import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationDispatch, SignedInState } from "./store";

export  default function() {
  const tempoRange = useSelector((state: SignedInState) => state.tempoRange);
  const tracks = useSelector((state: SignedInState) => state.tracks);
  const dispatch = useDispatch<ApplicationDispatch>();

  /**
   * Minimum tempo amongst tracks.
   */
  const minTrackTempo = useMemo(
    () => Math.floor(tracks.map(track => track.tempo).reduce((a, b) => Math.min(a, b), Infinity)),
    [tracks]
  );

  /**
   * Maximum tempo amongst tracks.
   */
  const maxTrackTempo = useMemo(
    () => Math.ceil(tracks.map(track => track.tempo).reduce((a, b) => Math.max(a, b), 0)),
    [tracks]
  );

  // Reset controls when tracks are updated.
  useEffect(() => {
    dispatch({ type: "SET_MIN_TEMPO", value: minTrackTempo });
    dispatch({ type: "SET_MAX_TEMPO", value: maxTrackTempo });
  }, [minTrackTempo, maxTrackTempo, dispatch])

  return (
    <div>
      <h3>Controls</h3>
      <span>Min Tempo</span>
      <input type="range" min={minTrackTempo} max={maxTrackTempo} step={1} value={tempoRange[0]} onChange={(e) => {
        let parsed = parseFloat(e.target.value);
        if (Number.isNaN(parsed)) {
          parsed = 0;
        }
        dispatch({
          type: "SET_MIN_TEMPO",
          value: parsed
        });
      }} />
      <span>{tempoRange[0]}</span>
      <br />
      <span>Max Tempo</span>
      <input type="range" min={minTrackTempo} max={maxTrackTempo} step={1} value={tempoRange[1]} onChange={(e) => {
        let parsed = parseFloat(e.target.value);
        if (Number.isNaN(parsed)) {
          parsed = 0;
        }
        dispatch({
          type: "SET_MAX_TEMPO",
          value: parsed
        });
      }} />
      <span>{tempoRange[1]}</span>
    </div>
  );
}