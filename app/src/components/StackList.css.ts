import { style } from "@vanilla-extract/css";
import { vars } from "../theme.css";

export const container = style({
  borderWidth: "thin",
  borderStyle: "solid",
  borderColor: vars.palette.zinc400,
  borderRadius: vars.border.radius.sm,
});
