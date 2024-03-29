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
      rangeInputMolecules[feature] =
        feature === "durationMs"
          ? RangeInputMolecule(
              "duration (seconds)",
              range.min / 1000,
              range.max / 1000
            )
          : RangeInputMolecule(feature, range.min, range.max);
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
        ret[feature] =
          feature === "durationMs"
            ? {
                min: Number(get(rangeInputMolecule.minInputAtom) * 1000),
                max: Number(get(rangeInputMolecule.maxInputAtom) * 1000),
              }
            : {
                min: Number(get(rangeInputMolecule.minInputAtom)),
                max: Number(get(rangeInputMolecule.maxInputAtom)),
              };
      }
    }
    return ret;
  });
  return { ...rangeInputMolecules, valueAtom, hasErrorAtom };
}
