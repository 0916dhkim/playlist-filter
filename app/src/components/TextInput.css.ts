import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../theme.css";

const base = style({
  background: "none",
  color: vars.palette.zinc800,
  borderWidth: "1px",
  borderColor: vars.palette.zinc400,
  borderStyle: "solid",
  padding: vars.spacing.md,
  borderRadius: vars.border.radius.sm,
  fontSize: vars.text.h6,
  ":focus": {
    outlineWidth: "0.125rem",
    outlineColor: vars.palette.green900,
    outlineStyle: "solid",
  },
  "@media": {
    "(prefers-color-scheme: dark)": {
      color: vars.palette.zinc100,
    },
  },
});

export const variant = styleVariants({
  default: [base],
  borderless: [
    base,
    {
      padding: 0,
      borderRadius: 0,
      border: "none",
    },
  ],
});
