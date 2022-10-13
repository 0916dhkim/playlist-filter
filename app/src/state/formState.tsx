import {
  ALL_AUDIO_FEATURES,
  AudioFeature,
  AudioFeatureRanges,
  PlaylistFilter,
} from "../api/types";
import { Atom, PrimitiveAtom, WritableAtom, atom } from "jotai";

export type RangeInputMolecule = {
  name: string;
  minAtom: PrimitiveAtom<string>;
  maxAtom: PrimitiveAtom<string>;
};

function RangeInputMolecule(
  name: string,
  min: number,
  max: number
): RangeInputMolecule {
  return {
    name,
    minAtom: atom(min.toString()),
    maxAtom: atom(max.toString()),
  };
}

type AudioFeatureRangesMolecule = {
  [F in AudioFeature]?: RangeInputMolecule;
};

export type FormState =
  | {
      stage: "uninitialized";
    }
  | {
      stage: "editing";
      audioFeatureRanges: AudioFeatureRangesMolecule;
    }
  | {
      stage: "exporting";
      audioFeatureRanges: AudioFeatureRangesMolecule;
      playlistName: PrimitiveAtom<string>;
    };

function AudioFeatureRangesMolecule(audioFeatureRanges: AudioFeatureRanges) {
  const audioFeatureRangesMolecule: AudioFeatureRangesMolecule = {};
  for (const feature of ALL_AUDIO_FEATURES) {
    const range = audioFeatureRanges[feature];
    if (range) {
      audioFeatureRangesMolecule[feature] = RangeInputMolecule(
        feature,
        range.min,
        range.max
      );
    }
  }
  return audioFeatureRangesMolecule;
}

export type FormMolecule = {
  formAtom: Atom<FormState>;
  initializeFormAtom: WritableAtom<null, AudioFeatureRanges, void>;
  finishEditingAtom: WritableAtom<null, unknown, void>;
  exportVariablesAtom: Atom<{
    playlistName: string;
    filter: PlaylistFilter;
  } | null>;
};

export function FormMolecule() {
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
            audioFeatureRanges: AudioFeatureRangesMolecule(audioFeatureRanges),
          });
        }
      }
    ),
    finishEditingAtom: atom(null, (get, set) => {
      const prev = get(baseAtom);
      if (prev.stage === "editing") {
        set(baseAtom, {
          stage: "exporting",
          audioFeatureRanges: prev.audioFeatureRanges,
          playlistName: atom(""),
        });
      }
    }),
    exportVariablesAtom: atom((get) => {
      const formState = get(baseAtom);
      if (formState.stage !== "exporting") return null;
      const filter: PlaylistFilter = {};
      for (const feature of ALL_AUDIO_FEATURES) {
        const rangeInputMolecule = formState.audioFeatureRanges[feature];
        if (rangeInputMolecule) {
          filter[feature] = {
            min: Number(get(rangeInputMolecule.minAtom)),
            max: Number(get(rangeInputMolecule.maxAtom)),
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
