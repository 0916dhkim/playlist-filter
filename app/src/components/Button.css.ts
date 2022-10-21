import { style, styleVariants } from "@vanilla-extract/css";

import { sprinkles } from "../sprinkles.css";
import { vars } from "../theme.css";

const base = style([
  sprinkles({
    padding: "sm",
    border: "none",
    borderRadius: "full",
    fontSize: "h5",
    fontWeight: "bold",
  }),
  {
    background: vars.palette.slate400,
    ":hover": {
      cursor: "pointer",
      background: vars.palette.slate600,
    },
  },
]);

export const variant = styleVariants({
  default: [base],
  primary: [
    base,
    {
      background: vars.palette.green400,
      ":hover": {
        background: vars.palette.green600,
      },
    },
  ],
});
