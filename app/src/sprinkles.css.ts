import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

import { vars } from "./theme.css";

const length = {
  auto: "auto",
  "0": "0",
  "1/4": "25%",
  "1/2": "50%",
  "3/4": "75%",
  full: "100%",
} as const;

const width = {
  ...length,
  screen: "100vw",
} as const;

const height = {
  ...length,
  screen: "100vh",
} as const;

const responsiveProperties = defineProperties({
  conditions: {
    mobile: {},
    tablet: { "@media": "screen and (min-width: 768px)" },
    desktop: { "@media": "screen and (min-width: 1024px)" },
  },
  defaultCondition: "mobile",
  properties: {
    display: ["none", "flex", "block", "inline"],
    flexDirection: ["row", "column"],
    justifyContent: [
      "stretch",
      "flex-start",
      "center",
      "flex-end",
      "space-around",
      "space-between",
    ],
    alignItems: ["stretch", "flex-start", "center", "flex-end"],
    width,
    minWidth: width,
    maxWidth: width,
    height,
    minHeight: height,
    maxHeight: height,
    paddingTop: vars.spacing,
    paddingBottom: vars.spacing,
    paddingLeft: vars.spacing,
    paddingRight: vars.spacing,
    marginTop: vars.spacing,
    marginBottom: vars.spacing,
    marginLeft: vars.spacing,
    marginRight: vars.spacing,
    gap: vars.spacing,
    fontWeight: ["normal", "bold"],
    fontSize: vars.text,
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
    margin: ["marginTop", "marginBottom", "marginLeft", "marginRight"],
    marginX: ["marginLeft", "marginRight"],
    marginY: ["marginTop", "marginBottom"],
    placeItems: ["justifyContent", "alignItems"],
  },
});

const colorProperties = defineProperties({
  conditions: {
    lightMode: {},
    darkMode: {
      selector: ".dark &",
    },
  },
  defaultCondition: "lightMode",
  properties: {
    color: vars.palette,
    background: vars.palette,
  },
});

const unresponsiveProperties = defineProperties({
  properties: {
    boxSizing: ["border-box"],
    border: ["none"],
    borderRadius: vars.border.radius,
  },
});

export const sprinkles = createSprinkles(
  responsiveProperties,
  unresponsiveProperties,
  colorProperties
);

export type Sprinkles = Parameters<typeof sprinkles>[0];
