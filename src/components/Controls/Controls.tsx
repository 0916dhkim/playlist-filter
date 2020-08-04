import React, { useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationDispatch, SignedInState } from "../../store";
import RangeInput from "../RangeInput/RangeInput";


export  default function() {
  const tempoRange = useSelector((state: SignedInState) => state.tempoRange);
  const danceabilityRange = useSelector((state: SignedInState) => state.danceabilityRange);
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
      <RangeInput
        label="Tempo (BPM)"
        lowerLimit={minTrackTempo}
        upperLimit={maxTrackTempo}
        step={1}
        minValue={tempoRange[0]}
        maxValue={tempoRange[1]}
        setMinValue={x => dispatch({ type: "SET_MIN_TEMPO", value: x })}
        setMaxValue={x => dispatch({ type: "SET_MAX_TEMPO", value: x })}
      />
      <RangeInput
        label="Danceability"
        lowerLimit={0}
        upperLimit={1}
        step={0.01}
        minValue={danceabilityRange[0]}
        maxValue={danceabilityRange[1]}
        setMinValue={x => dispatch({ type: "SET_MIN_DANCEABILITY", value: x })}
        setMaxValue={x => dispatch({ type: "SET_MAX_DANCEABILITY", value: x })}
      />
    </div>
  );
}
