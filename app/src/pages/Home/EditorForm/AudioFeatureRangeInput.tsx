import { ReactElement } from "react";
import {  useAtomValue } from "jotai";

import { RangeInputMolecule } from "../../../state/rangeInput";
import MinMaxSlider from "../../../components/MinMaxSlider";
import { sprinkles } from "../../../sprinkles.css";

type AudioFeatureRangeInputProps = {
  molecule: RangeInputMolecule;
};

export default function AudioFeatureRangeInput({
  molecule: { name, minAtom, maxAtom,sliderMinAtom,sliderMaxAtom, errorAtom },
}: AudioFeatureRangeInputProps): ReactElement | null {
  const sliderMin = useAtomValue(sliderMinAtom)
  const sliderMax = useAtomValue(sliderMaxAtom)
  const error = useAtomValue(errorAtom);
  
  return (
    <div>
      <h6>{name}</h6>
      <MinMaxSlider sliderMin={sliderMin} sliderMax={sliderMax} minAtom={minAtom} maxAtom={maxAtom} />
      {error ? <p className={sprinkles({ color: "red500" })}>{error}</p> : null}
    </div>
  );
}
