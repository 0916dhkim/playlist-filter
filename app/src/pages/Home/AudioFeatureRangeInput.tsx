import { RangeInputMolecule } from "../../state/formState";
import { ReactElement } from "react";
import { useAtom } from "jotai";

type AudioFeatureRangeInputProps = {
  molecule: RangeInputMolecule;
};

export default function AudioFeatureRangeInput({
  molecule: { name, minAtom, maxAtom },
}: AudioFeatureRangeInputProps): ReactElement | null {
  const [min, setMin] = useAtom(minAtom);
  const [max, setMax] = useAtom(maxAtom);
  return (
    <div>
      <h1>{name}</h1>
      <input value={min} onChange={(e) => setMin(e.target.value)} />
      <input value={max} onChange={(e) => setMax(e.target.value)} />
    </div>
  );
}
