import { ReactElement } from "react";
import { useAtomValue } from "jotai";

import { RangeInputMolecule } from "../../../state/rangeInput";
import MinMaxSlider from "../../../components/MinMaxSlider";
import { sprinkles } from "../../../sprinkles.css";

type AudioFeatureRangeInputProps = {
  molecule: RangeInputMolecule;
};

export default function AudioFeatureRangeInput({
  molecule: { name, minInputAtom, maxInputAtom, min, max, errorAtom },
}: AudioFeatureRangeInputProps): ReactElement | null {
  const error = useAtomValue(errorAtom);

  return (
    <div>
      <h6>{name}</h6>
      <MinMaxSlider
        sliderMin={min}
        sliderMax={max}
        minInputAtom={minInputAtom}
        maxInputAtom={maxInputAtom}
      />
      {error ? <p className={sprinkles({ color: "red500" })}>{error}</p> : null}
    </div>
  );
}
