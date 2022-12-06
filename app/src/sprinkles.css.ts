import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

import { vars, rem, grid } from "./theme.css";

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
    width: {
      auto: "auto",
      "0": "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
      min: "min-content",
      max: "max-content",
      screen: "100vw",
    },
    minWidth: {
      "0": "0",
      full: "100%",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
    },
    maxWidth: {
      "0": "0",
      none: "none",
      full: "100%",
      xs: rem(20),
      sm: rem(24),
      md: rem(28),
      lg: rem(32),
      xl: rem(36),
      "2xl": rem(42),
    },
    height: {
      auto: "auto",
      "0": "0",
      "1/4": "25%",
      "1/2": "50%",
      "3/4": "75%",
      full: "100%",
      screen: "100vh",
    },
    minHeight: {
      "0": "0",
      full: "100%",
      screen: "100vh",
      min: "min-content",
      max: "max-content",
      fit: "fit-content",
    },
    maxHeight: {
      "0": "0",
      full: "100%",
      screen: "100vh",
      "1": grid(1),
      "2": grid(2),
      "3": grid(3),
      "4": grid(4),
      "5": grid(5),
      "6": grid(6),
      "7": grid(7),
      "8": grid(8),
    },
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
