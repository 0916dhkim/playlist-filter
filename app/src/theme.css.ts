import "./reset.css";
import colors from "tailwindcss/colors";
import { createGlobalTheme, globalStyle } from "@vanilla-extract/css";

export const px = (value: string | number) => `${value}px`;
export const rem = (value: string | number) => `${value}rem`;
export const grid = (value: number) => rem(value / 4);

const tailwindPalette = {
  white: colors.white,
  black: colors.black,
  slate50: colors.slate[50],
  slate100: colors.slate[100],
  slate200: colors.slate[200],
  slate300: colors.slate[300],
  slate400: colors.slate[400],
  slate500: colors.slate[500],
  slate600: colors.slate[600],
  slate700: colors.slate[700],
  slate800: colors.slate[800],
  slate900: colors.slate[900],
  zinc50: colors.zinc[50],
  zinc100: colors.zinc[100],
  zinc200: colors.zinc[200],
  zinc300: colors.zinc[300],
  zinc400: colors.zinc[400],
  zinc500: colors.zinc[500],
  zinc600: colors.zinc[600],
  zinc700: colors.zinc[700],
  zinc800: colors.zinc[800],
  zinc900: colors.zinc[900],
  red50: colors.red[50],
  red100: colors.red[100],
  red200: colors.red[200],
  red300: colors.red[300],
  red400: colors.red[400],
  red500: colors.red[500],
  red600: colors.red[600],
  red700: colors.red[700],
  red800: colors.red[800],
  red900: colors.red[900],
  green50: colors.green[50],
  green100: colors.green[100],
  green200: colors.green[200],
  green300: colors.green[300],
  green400: colors.green[400],
  green500: colors.green[500],
  green600: colors.green[600],
  green700: colors.green[700],
  green800: colors.green[800],
  green900: colors.green[900],
  yellow50: colors.yellow[50],
  yellow100: colors.yellow[100],
  yellow200: colors.yellow[200],
  yellow300: colors.yellow[300],
  yellow400: colors.yellow[400],
  yellow500: colors.yellow[500],
  yellow600: colors.yellow[600],
  yellow700: colors.yellow[700],
  yellow800: colors.yellow[800],
  yellow900: colors.yellow[900],
  blue50: colors.blue[50],
  blue100: colors.blue[100],
  blue200: colors.blue[200],
  blue300: colors.blue[300],
  blue400: colors.blue[400],
  blue500: colors.blue[500],
  blue600: colors.blue[600],
  blue700: colors.blue[700],
  blue800: colors.blue[800],
  blue900: colors.blue[900],
};

export const vars = createGlobalTheme(":root", {
  font: {
    brand: "Inter, sans-serif",
  },
  text: {
    p: rem(1),
    h1: rem(4),
    h2: rem(2.5),
    h3: rem(2),
    h4: rem(1.5),
    h5: rem(1.25),
    h6: rem(1),
  },
  spacing: {
    none: "0",
    xs: grid(1),
    sm: grid(2),
    md: grid(3),
    lg: grid(5),
    xl: grid(8),
    xxl: grid(12),
    xxxl: grid(24),
  },
  palette: tailwindPalette,
  border: {
    radius: {
      none: px(0),
      sm: grid(2),
      md: grid(4),
      lg: grid(7),
      full: px(9999),
      circle: "50%",
    },
  },
});

globalStyle("html", {
  background: vars.palette.slate100,
  color: vars.palette.slate900,
  fontFamily: vars.font.brand,
});

globalStyle(".dark", {
  background: vars.palette.zinc800,
  color: vars.palette.zinc100,
});

globalStyle("a", {
  color: "inherit",
  fontWeight: "bold",
  textDecoration: "none",
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
