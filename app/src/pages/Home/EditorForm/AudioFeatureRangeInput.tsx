import { useAtom, useAtomValue } from "jotai";

import { RangeInputMolecule } from "../../../state/rangeInput";
import { ReactElement } from "react";
import TextInput from "../../../components/TextInput";
import { sprinkles } from "../../../sprinkles.css";

type AudioFeatureRangeInputProps = {
  molecule: RangeInputMolecule;
};

export default function AudioFeatureRangeInput({
  molecule: { name, minAtom, maxAtom, errorAtom },
}: AudioFeatureRangeInputProps): ReactElement | null {
  const [min, setMin] = useAtom(minAtom);
  const [max, setMax] = useAtom(maxAtom);
  const error = useAtomValue(errorAtom);
  return (
    <div>
      <h6>{name}</h6>
      <TextInput value={min} onChange={(e) => setMin(e.target.value)} />
      <TextInput value={max} onChange={(e) => setMax(e.target.value)} />
      {error ? <p className={sprinkles({ color: "red500" })}>{error}</p> : null}
    </div>
  );
}
