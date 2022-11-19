import { createVar, style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { vars } from "../theme.css";

export const minPercent = createVar();
export const maxPercent = createVar();

export const container = style({
  margin: "2rem 0",
  display: "flex",
});

export const slider = style({
  position: "relative",
  width: "200px",
});

export const sliderTrack = style({
  position: "absolute",
  borderRadius: "3px",
  height: "5px",
  backgroundColor: vars.palette.slate200,
  width: "100%",
  zIndex: 1,
});

export const sliderRange = style({
  position: "absolute",
  borderRadius: "3px",
  height: "5px",
  backgroundColor: vars.palette.slate600,
  zIndex: 2,
  left: calc.multiply("1%", minPercent),
  width: calc.multiply("1%", calc.subtract(maxPercent, minPercent)),
});

export const sliderLeftValue = style({
  fontFamily: vars.font.brand,
  position: "absolute",
  left: 0,
  top: "1rem",
});

export const sliderRightValue = style({
  fontFamily: vars.font.brand,
  position: "absolute",
  right: 0,
  top: "1rem",
});

export const thumb = style({
  appearance: "none",
  pointerEvents: "none",
  position: "absolute",
  height: 0,
  width: "200px",
  outline: "none",

  "::-webkit-slider-thumb": {
    appearance: "none",
    backgroundColor: vars.palette.green500,
    border: "none",
    borderRadius: "50%",
    boxShadow: "0 0 1px 1px #ced4da",
    cursor: "pointer",
    height: "18px",
    width: "18px",
    marginTop: "4px",
    pointerEvents: "all",
    position: "relative",
  },
  "::-moz-range-thumb": {
    appearance: "none",
    backgroundColor: vars.palette.green500,
    border: "none",
    borderRadius: "50%",
    boxShadow: "0 0 1px 1px #ced4da",
    cursor: "pointer",
    height: "18px",
    width: "18px",
    marginTop: "4px",
    pointerEvents: "all",
    position: "relative",
  },
});

export const thumbLeft = style([
  thumb,
  {
    zIndex: 3,
  },
]);

export const thumbRight = style([
  thumb,
  {
    zIndex: 4,
  },
]);
