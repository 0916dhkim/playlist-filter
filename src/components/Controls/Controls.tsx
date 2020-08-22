import { Button, ButtonGroup } from "@material-ui/core";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ApplicationDispatch } from "../../store";
import { AudioFeatureKey } from "../../spotify_types";
import { PersonalPageState } from "../../state";
import RangeInput from "../RangeInput/RangeInput";
import { filterTracks } from "../../filterTracks";
import style from "./Controls.module.scss";

type NormalizedRangeInputProps = {
  feature: AudioFeatureKey
  range: [number, number],
  dispatch: ApplicationDispatch
};

/**
 * RangeInput Component for Audio Features with Range 0 to 1.
 */
function NormalizedRangeInput({ feature, range, dispatch }: NormalizedRangeInputProps) {
  const label = useMemo(() => {
    const ret = feature.replace("_", " ");
    return ret[0].toUpperCase() + ret.slice(1);
  }, [feature]);
  return (
    <RangeInput
      label={label}
      lowerLimit={0}
      upperLimit={1}
      step={0.01}
      minValue={range[0]}
      maxValue={range[1]}
      setMinValue={x => dispatch({ type: "SET_AUDIO_FEATURE_MIN", feature, value: x })}
      setMaxValue={x => dispatch({ type: "SET_AUDIO_FEATURE_MAX", feature, value: x })}
    />
  );
}

const NORMALIZED_FEATURES_TO_CONTROL: ReadonlyArray<AudioFeatureKey> = [
  "acousticness",
  "danceability",
  "energy",
  "instrumentalness",
  "liveness",
  "speechiness",
  "valence"
];

function Controls() {
  const range = useSelector((state: PersonalPageState) => state.audioFeatureRange);
  const tracks = useSelector((state: PersonalPageState) => state.tracks);
  const dispatch = useDispatch<ApplicationDispatch>();

  const [minTrackTempo, maxTrackTempo] = useMemo(
    () => tracks.map(track => track.tempo).reduce((a, b) => [Math.min(a[0], Math.floor(b)), Math.max(a[1], Math.ceil(b))], [Infinity, -Infinity]),
    [tracks]
  );

  function handleExport() {
    dispatch({
      type: "GO_TO_EXPORT_PAGE",
      tracks: filterTracks(tracks, range).map(t => ({...t, type: "track"}))
    });
  }

  return (
    <div>
      <div className={style.grid}>
        <RangeInput
          label="Tempo (BPM)"
          lowerLimit={minTrackTempo}
          upperLimit={maxTrackTempo}
          step={1}
          minValue={range.tempo[0]}
          maxValue={Math.min(range.tempo[1], maxTrackTempo)}
          setMinValue={x => dispatch({ type: "SET_AUDIO_FEATURE_MIN", feature: "tempo", value: x })}
          setMaxValue={x => dispatch({ type: "SET_AUDIO_FEATURE_MAX", feature: "tempo", value: x })}
        />
        {NORMALIZED_FEATURES_TO_CONTROL.map(feature => (
          <NormalizedRangeInput
            key={feature}
            feature={feature}
            dispatch={dispatch}
            range={range[feature]}
          />
        ))}
      </div>
      <ButtonGroup
        className={style.buttongroup}
        variant={"contained"}
        color={"primary"}
      >
        <Button
          onClick={() => dispatch({ type: "RESET_AUDIO_FEATURE_RANGE" })}
        >
          Reset Filters
        </Button>
        <Button
          onClick={handleExport}
        >
          Export Tracks
        </Button>
      </ButtonGroup>
    </div>
  );
}

export default Controls;
