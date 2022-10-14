import { useAtom, useAtomValue } from "jotai";

import { RangeInputMolecule } from "../../../state/rangeInput";
import { ReactElement } from "react";

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
      <h1>{name}</h1>
      <input value={min} onChange={(e) => setMin(e.target.value)} />
      <input value={max} onChange={(e) => setMax(e.target.value)} />
      {error ? <p>{error}</p> : null}
    </div>
  );
}
