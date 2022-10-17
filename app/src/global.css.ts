import { globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css";

globalStyle("html", {
  background: vars.palette.slate100,
  color: vars.palette.slate900,
  fontFamily: vars.font.brand,

  "@media": {
    "(prefers-color-scheme: dark)": {
      background: vars.palette.zinc800,
      color: vars.palette.zinc100,
    },
  },
});

globalStyle("a", {
  color: "inherit",
  fontWeight: "bold",
});

globalStyle("input[type=email], input[type=password]", {
  background: vars.palette.slate200,
  color: vars.palette.black,
  padding: vars.spacing.sm,
  border: "none",
  borderRadius: vars.border.radius.sm,
  fontSize: vars.text.h6,
  "@media": {
    "(prefers-color-scheme: dark)": {
      background: vars.palette.slate700,
      color: vars.palette.zinc100,
    },
  },
});
