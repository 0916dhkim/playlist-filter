import { Paper, Slider } from "@material-ui/core";

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
  const marks = [
    {
      value: lowerLimit,
      label: lowerLimit
    },
    {
      value: upperLimit,
      label: upperLimit
    }
  ];
  return (
    <Paper className={style.container}>
      <h4>{label}</h4>
      <Slider 
        min={lowerLimit}
        max={upperLimit}
        step={step}
        marks={marks}
        value={[minValue, maxValue]}
        valueLabelDisplay={'auto'}
        onChange={(_, value) => {
          // Do nothing is value is not a tuple.
          if (typeof value === 'number') {
            return;
          }
          const [min, max] = value;
          setMinValue(min);
          setMaxValue(max);
        }}
      />
    </Paper>
  );
}

export default RangeInput;
