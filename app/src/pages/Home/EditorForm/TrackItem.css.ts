import { style } from "@vanilla-extract/css";
import { sprinkles } from "../../../sprinkles.css";
import { vars } from "../../../theme.css";

export const container = style([
  sprinkles({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "md",
    padding: "sm",
    borderRadius: "sm",
  }),
  {
    selectors: {
      "&:hover": {
        background: vars.palette.zinc200,
      },
      ".dark &:hover": {
        background: vars.palette.zinc700,
      },
    },
  },
]);

export const nameAndArtists = style([
  sprinkles({
    display: "flex",
    flexDirection: "column",
    gap: "xs",
  }),
  {
    flexGrow: 1,
  },
]);

export const thumbnail = style({
  height: "3rem",
});

export const link = style({
  fontWeight: "normal",
  ":hover": {
    textDecoration: "underline",
  },
});

export const albumName = style([
  link,
  {
    textAlign: "right",
  },
]);
