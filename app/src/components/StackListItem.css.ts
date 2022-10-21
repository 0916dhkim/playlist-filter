import { sprinkles } from "../sprinkles.css";
import { style } from "@vanilla-extract/css";
import { vars } from "../theme.css";

export const item = style([
  sprinkles({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "sm",
  }),
  {
    padding: vars.spacing.md,
    borderBottomWidth: "thin",
    borderBottomStyle: "solid",
    borderBottomColor: vars.palette.zinc400,
    ":last-child": {
      borderBottom: "none",
    },
  },
]);
