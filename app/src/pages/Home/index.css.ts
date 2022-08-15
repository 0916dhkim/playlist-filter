import { style } from "@vanilla-extract/css";

export const twoColumns = style({
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  minHeight: "100vh",
});
