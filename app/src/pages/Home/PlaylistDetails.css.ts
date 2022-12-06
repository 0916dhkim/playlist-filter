import { sprinkles } from "../../sprinkles.css";
import { style } from "@vanilla-extract/css";
import { grid, vars } from "../../theme.css";

export const container = sprinkles({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "lg",
});

export const thumbnail = style({
  width: grid(64),
});

export const thumbnailPlaceholder = style({
  width: grid(64),
  height: grid(64),
  background: vars.palette.zinc600,
});
