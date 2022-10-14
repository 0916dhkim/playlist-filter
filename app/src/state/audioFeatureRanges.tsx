import {
  ALL_AUDIO_FEATURES,
  AudioFeature,
  AudioFeatureRanges,
} from "../api/types";

import { RangeInputMolecule } from "./rangeInput";

export type AudioFeatureRangesMolecule = {
  [F in AudioFeature]?: RangeInputMolecule;
};

export function AudioFeatureRangesMolecule(
  audioFeatureRanges: AudioFeatureRanges
) {
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
