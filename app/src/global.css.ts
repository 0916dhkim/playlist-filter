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

globalStyle("h1", {
  fontSize: vars.text.h1,
  fontWeight: "bolder",
});

globalStyle("h2", {
  fontSize: vars.text.h2,
  fontWeight: "bold",
});

globalStyle("h3", {
  fontSize: vars.text.h3,
  fontWeight: "bold",
});

globalStyle("h4", {
  fontSize: vars.text.h4,
  fontWeight: "bold",
});

globalStyle("h5", {
  fontSize: vars.text.h5,
  fontWeight: "bold",
});

globalStyle("h6", {
  fontSize: vars.text.h6,
  fontWeight: "bold",
});

globalStyle("p", {
  fontSize: vars.text.p,
});
