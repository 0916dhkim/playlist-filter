import { AudioFeature } from "../../api/types";
import { ReactElement } from "react";

type AudioFeatureRangeInputProps = {
  feature: AudioFeature;
  desiredMin: string;
  desiredMax: string;
  onChange?: (value: string, type: "min" | "max") => void;
};

export default function AudioFeatureRangeInput({
  feature,
  desiredMin,
  desiredMax,
  onChange,
}: AudioFeatureRangeInputProps): ReactElement | null {
  return (
    <div>
      <h1>{feature}</h1>
      <input
        value={desiredMin}
        onChange={(e) => onChange?.(e.target.value, "min")}
      />
      <input
        value={desiredMax}
        onChange={(e) => onChange?.(e.target.value, "max")}
      />
    </div>
  );
}
