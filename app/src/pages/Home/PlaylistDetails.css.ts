import { calc } from "@vanilla-extract/css-utils";
import { sprinkles } from "../../sprinkles.css";
import { style } from "@vanilla-extract/css";
import { vars } from "../../theme.css";

export const container = sprinkles({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "lg",
});

export const thumbnail = style({
  width: calc.multiply(64, vars.grid),
});

export const thumbnailPlaceholder = style({
  width: calc.multiply(64, vars.grid),
  height: calc.multiply(64, vars.grid),
  background: vars.palette.zinc600,
});
