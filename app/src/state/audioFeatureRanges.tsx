import {
  ALL_AUDIO_FEATURES,
  AudioFeature,
  AudioFeatureRanges,
} from "../api/types";
import { Atom, atom } from "jotai";

import { RangeInputMolecule } from "./rangeInput";

export type AudioFeatureRangesMolecule = {
  [F in AudioFeature]?: RangeInputMolecule;
} & {
  hasErrorAtom: Atom<boolean>;
  valueAtom: Atom<AudioFeatureRanges>;
};

export function AudioFeatureRangesMolecule(
  audioFeatureRanges: AudioFeatureRanges
) {
  const rangeInputMolecules: {
    [F in AudioFeature]?: RangeInputMolecule;
  } = {};
  for (const feature of ALL_AUDIO_FEATURES) {
    const range = audioFeatureRanges[feature];
    if (range) {
      rangeInputMolecules[feature] = RangeInputMolecule(
        feature,
        range.min,
        range.max
      );
    }
  }
  const hasErrorAtom = atom((get) => {
    for (const feature of ALL_AUDIO_FEATURES) {
      const rangeInputMolecule = rangeInputMolecules[feature];
      if (rangeInputMolecule) {
        const error = get(rangeInputMolecule.errorAtom);
        if (typeof error === "string") {
          return true;
        }
      }
    }
    return false;
  });
  const valueAtom = atom((get) => {
    const error = get(hasErrorAtom);
    if (error) {
      return {};
    }
    const ret: AudioFeatureRanges = {};
    for (const feature of ALL_AUDIO_FEATURES) {
      const rangeInputMolecule = rangeInputMolecules[feature];
      if (rangeInputMolecule) {
        ret[feature] = {
          min: Number(get(rangeInputMolecule.minAtom)),
          max: Number(get(rangeInputMolecule.maxAtom)),
        };
      }
    }
    return ret;
  });
  return { ...rangeInputMolecules, valueAtom, hasErrorAtom };
}
