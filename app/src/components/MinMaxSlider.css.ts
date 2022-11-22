import { createVar, style } from "@vanilla-extract/css";
import { calc } from "@vanilla-extract/css-utils";
import { sprinkles } from "../sprinkles.css";
import { vars } from "../theme.css";

export const minPercent = createVar();
export const maxPercent = createVar();
const thumbDiameter = "0.75rem";

export const container = style([
  sprinkles({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
  }),
  {
    position: "relative",
    marginTop: calc.divide(thumbDiameter, 2),
    width: "200px",
  },
]);

export const slider = style({
  position: "relative",
  width: "100%",
});

export const sliderTrack = style([
  sprinkles({
    background: {
      lightMode: "slate200",
      darkMode: "slate600",
    },
  }),
  {
    position: "absolute",
    height: vars.spacing.xs,
    width: "100%",
    zIndex: 1,
  },
]);

export const sliderRange = style([
  sprinkles({
    background: "green500",
  }),
  {
    position: "absolute",
    height: vars.spacing.xs,
    zIndex: 2,
    left: calc.multiply("1%", minPercent),
    width: calc.multiply("1%", calc.subtract(maxPercent, minPercent)),
  },
]);

export const thumb = style([
  sprinkles({
    width: "full",
    height: "0",
    marginX: "none",
  }),
  {
    appearance: "none",
    pointerEvents: "none",
    position: "absolute",
    outline: "none",

    "::-webkit-slider-thumb": {
      appearance: "none",
      backgroundColor: vars.palette.green300,
      border: `1px solid ${vars.palette.green500}`,
      borderRadius: "50%",
      cursor: "pointer",
      height: thumbDiameter,
      width: thumbDiameter,
      pointerEvents: "all",
      position: "relative",
    },
    "::-moz-range-thumb": {
      appearance: "none",
      backgroundColor: vars.palette.green300,
      border: `1px solid ${vars.palette.green500}`,
      borderRadius: "50%",
      cursor: "pointer",
      height: thumbDiameter,
      width: thumbDiameter,
      pointerEvents: "all",
      position: "relative",
    },
  },
]);

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
