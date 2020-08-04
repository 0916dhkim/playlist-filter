import React from "react";
import style from "./RangeInput.module.scss";

type RangeInputProps = {
  label: string,
  lowerLimit: number,
  upperLimit: number,
  step: number,
  minValue: number,
  maxValue: number
  setMinValue: (value: number) => void,
  setMaxValue: (value: number) => void
};

function RangeInput({
  label,
  lowerLimit,
  upperLimit,
  step,
  minValue,
  maxValue,
  setMinValue,
  setMaxValue
}: RangeInputProps) {
  return (
    <fieldset className={style.fieldset}>
      <legend>{label}</legend>
      <div className={style.group}>
        <div>Min ({minValue})</div>
        <input
          type="range"
          min={lowerLimit}
          max={upperLimit}
          step={step}
          value={minValue}
          onChange={e => {
            let parsed = parseFloat(e.target.value);
            if (Number.isNaN(parsed)) {
              parsed = 0;
            }
            setMinValue(parsed);
          }}/>
        <div>Max ({maxValue})</div>
        <input
          type="range"
          min={lowerLimit}
          max={upperLimit}
          step={step}
          value={maxValue}
          onChange={e => {
            let parsed = parseFloat(e.target.value);
            if (Number.isNaN(parsed)) {
              parsed = 0;
            }
            setMaxValue(parsed);
          }}/>
      </div>
    </fieldset>
  );
}

export default RangeInput;
