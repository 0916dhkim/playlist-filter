import { PrimitiveAtom, useAtom } from "jotai";

import { AudioFeature } from "../../api/types";
import { ReactElement } from "react";

type AudioFeatureRangeInputProps = {
  feature: AudioFeature;
  minAtom: PrimitiveAtom<string>;
  maxAtom: PrimitiveAtom<string>;
};

export default function AudioFeatureRangeInput({
  feature,
  minAtom,
  maxAtom,
}: AudioFeatureRangeInputProps): ReactElement | null {
  const [min, setMin] = useAtom(minAtom);
  const [max, setMax] = useAtom(maxAtom);
  return (
    <div>
      <h1>{feature}</h1>
      <input value={min} onChange={(e) => setMin(e.target.value)} />
      <input value={max} onChange={(e) => setMax(e.target.value)} />
    </div>
  );
}
