import { sprinkles } from "../sprinkles.css";
import { style } from "@vanilla-extract/css";
import { vars } from "../theme.css";

export const button = style([
  sprinkles({
    background: "green400",
    padding: "sm",
    border: "none",
    borderRadius: "full",
    fontSize: "h5",
    fontWeight: "bold",
  }),
  {
    cursor: "pointer",
    ":hover": {
      background: vars.palette.green500,
    },
  },
]);
