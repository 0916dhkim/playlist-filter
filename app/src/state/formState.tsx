import { ALL_AUDIO_FEATURES, AudioFeatureRanges } from "../api/types";
import { Atom, PrimitiveAtom, WritableAtom, atom } from "jotai";

import { AudioFeatureRangesMolecule } from "./audioFeatureRanges";

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

export type FormMolecule = {
  formAtom: Atom<FormState>;
  initializeFormAtom: WritableAtom<null, AudioFeatureRanges, void>;
  canFinishEditingAtom: Atom<boolean>;
  finishEditingAtom: WritableAtom<null, unknown, void>;
  exportVariablesAtom: Atom<{
    playlistName: string;
    audioFeatureRanges: AudioFeatureRanges;
  } | null>;
};

export function FormMolecule() {
  const baseAtom = atom<FormState>({ stage: "uninitialized" });
  const canFinishEditingAtom = atom((get) => {
    const prev = get(baseAtom);
    if (prev.stage !== "editing") {
      return false;
    }
    for (const feature of ALL_AUDIO_FEATURES) {
      const rangeInputMolecule = prev.audioFeatureRanges[feature];
      if (rangeInputMolecule && get(rangeInputMolecule.errorAtom)) {
        return false;
      }
    }
    return true;
  });
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
    canFinishEditingAtom,
    finishEditingAtom: atom(null, (get, set) => {
      const prev = get(baseAtom);
      const canFinishEditing = get(canFinishEditingAtom);
      if (prev.stage === "editing" && canFinishEditing) {
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
      const audioFeatureRanges: AudioFeatureRanges = {};
      for (const feature of ALL_AUDIO_FEATURES) {
        const rangeInputMolecule = formState.audioFeatureRanges[feature];
        if (rangeInputMolecule) {
          audioFeatureRanges[feature] = {
            min: Number(get(rangeInputMolecule.minAtom)),
            max: Number(get(rangeInputMolecule.maxAtom)),
          };
        }
      }
      return {
        playlistName: get(formState.playlistName),
        audioFeatureRanges,
      };
    }),
  };
}
