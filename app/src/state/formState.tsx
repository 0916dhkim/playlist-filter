import {
  ALL_AUDIO_FEATURES,
  AudioFeature,
  AudioFeatureRanges,
  PlaylistFilter,
} from "../api/types";
import { PrimitiveAtom, atom } from "jotai";

// TODO: Rename to range.
type InputProps = {
  [F in AudioFeature]?: {
    feature: AudioFeature;
    minAtom: PrimitiveAtom<string>;
    maxAtom: PrimitiveAtom<string>;
  };
};

export type FormState =
  | {
      stage: "uninitialized";
    }
  | {
      stage: "editing";
      inputProps: InputProps;
    }
  | {
      stage: "exporting";
      inputProps: InputProps;
      playlistName: PrimitiveAtom<string>;
    };

function initialInputProps(audioFeatureRanges: AudioFeatureRanges) {
  const inputProps: InputProps = {};
  for (const feature of ALL_AUDIO_FEATURES) {
    const range = audioFeatureRanges[feature];
    if (range) {
      inputProps[feature] = {
        feature,
        minAtom: atom(range.min.toString()),
        maxAtom: atom(range.max.toString()),
      };
    }
  }
  return inputProps;
}

export function makeFormAtoms() {
  const baseAtom = atom<FormState>({ stage: "uninitialized" });
  return {
    formAtom: atom((get) => get(baseAtom)),
    initializeFormAtom: atom(
      null,
      (get, set, audioFeatureRanges: AudioFeatureRanges) => {
        const prev = get(baseAtom);
        if (prev.stage === "uninitialized") {
          set(baseAtom, {
            stage: "editing",
            inputProps: initialInputProps(audioFeatureRanges),
          });
        }
      }
    ),
    finishEditingAtom: atom(null, (get, set) => {
      const prev = get(baseAtom);
      if (prev.stage === "editing") {
        set(baseAtom, {
          stage: "exporting",
          inputProps: prev.inputProps,
          playlistName: atom(""),
        });
      }
    }),
    exportVariablesAtom: atom((get) => {
      const formState = get(baseAtom);
      if (formState.stage !== "exporting") return null;
      const filter: PlaylistFilter = {};
      for (const feature of ALL_AUDIO_FEATURES) {
        const inputState = formState.inputProps[feature];
        if (inputState) {
          filter[feature] = {
            min: Number(get(inputState.minAtom)),
            max: Number(get(inputState.maxAtom)),
          };
        }
      }
      return {
        playlistName: get(formState.playlistName),
        filter,
      };
    }),
  };
}
