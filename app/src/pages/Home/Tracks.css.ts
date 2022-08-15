import { style } from "@vanilla-extract/css";
import { vars } from "../../theme.css";

export const list = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: vars.spacing.lg,
});
