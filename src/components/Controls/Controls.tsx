import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationDispatch, SignedInState } from "../../store";
import RangeInput from "../RangeInput/RangeInput";
import style from "./Controls.module.scss";


export  default function() {
  const range = useSelector((state: SignedInState) => state.audioFeatureRange);
  const tracks = useSelector((state: SignedInState) => state.tracks);
  const dispatch = useDispatch<ApplicationDispatch>();

  const [minTrackTempo, maxTrackTempo] = useMemo(
    () => tracks.map(track => track.tempo).reduce((a, b) => [Math.min(a[0], Math.floor(b)), Math.max(a[1], Math.ceil(b))], [Infinity, -Infinity]),
    [tracks]
  );

  return (
    <div>
      <h3>Controls</h3>
      <div className={style.container}>
        <RangeInput
          label="Tempo (BPM)"
          lowerLimit={minTrackTempo}
          upperLimit={maxTrackTempo}
          step={1}
          minValue={range.tempo[0]}
          maxValue={range.tempo[1]}
          setMinValue={x => dispatch({ type: "SET_AUDIO_FEATURE_MIN", feature: "tempo", value: x })}
          setMaxValue={x => dispatch({ type: "SET_AUDIO_FEATURE_MAX", feature: "tempo", value: x })}
        />
        <RangeInput
          label="Danceability"
          lowerLimit={0}
          upperLimit={1}
          step={0.01}
          minValue={range.danceability[0]}
          maxValue={range.danceability[1]}
          setMinValue={x => dispatch({ type: "SET_AUDIO_FEATURE_MIN", feature: "danceability", value: x })}
          setMaxValue={x => dispatch({ type: "SET_AUDIO_FEATURE_MAX", feature: "danceability", value: x })}
        />
      </div>
    </div>
  );
}
