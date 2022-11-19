import * as classes from "./MinMaxSlider.css";

import { CSSProperties, ReactElement, useCallback } from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { assignInlineVars } from "@vanilla-extract/dynamic";

type MinMaxSliderProps = {
  sliderMin: number;
  sliderMax: number;
  minInputAtom: PrimitiveAtom<number>;
  maxInputAtom: PrimitiveAtom<number>;
};
export default function MinMaxSlider({
  sliderMin,
  sliderMax,
  minInputAtom,
  maxInputAtom,
}: MinMaxSliderProps): ReactElement {
  const [minVal, setMinVal] = useAtom(minInputAtom);
  const [maxVal, setMaxVal] = useAtom(maxInputAtom);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) =>
      Math.round(((value - sliderMin) / (sliderMax - sliderMin)) * 100),
    [sliderMin, sliderMax]
  );

  return (
    <div className={classes.container}>
      <input
        type="range"
        min={sliderMin}
        max={sliderMax}
        value={minVal}
        step={sliderMax - sliderMin == 1 ? 0.1 : 1}
        onChange={(event) => {
          const value = Math.min(Number(event.target.value), maxVal);
          setMinVal(value);
        }}
        className={classes.thumbLeft}
      />
      <input
        type="range"
        min={sliderMin}
        max={sliderMax}
        value={maxVal}
        step={sliderMax - sliderMin == 1 ? 0.1 : 1}
        onChange={(event) => {
          const value = Math.max(Number(event.target.value), minVal);
          setMaxVal(value);
        }}
        className={classes.thumbRight}
      />

      <div className={classes.slider}>
        <div className={classes.sliderTrack} />
        <div className={classes.sliderRange} />
        <div
          className={classes.sliderRange}
          style={assignInlineVars({
            [classes.minPercent]: getPercent(minVal).toString(),
            [classes.maxPercent]: getPercent(maxVal).toString(),
          })}
        />
        <div className={classes.sliderLeftValue}>{minVal}</div>
        <div className={classes.sliderRightValue}>{maxVal}</div>
      </div>
    </div>
  );
}
