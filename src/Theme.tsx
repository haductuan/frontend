import React from "react";

import {
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@mui/material";
// import { useAppContext } from "./context/app-context";
import { useMemo } from "react";

const round = (value: number): number => Math.round(value * 1e5) / 1e5;
const pxToRem = (size: number): string => `${size / 16}rem`;

declare module "@mui/material/styles" {
  interface BreakpointOverrides {
    xsm: true;
    xxl: true;
  }

  interface TypographyVariants {
    small: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    small?: React.CSSProperties;
  }
}

declare module "@mui/material/styles/createPalette" {
  interface TypeText {
    primaryA75: string;
  }

  interface TypeBackground {
    default: string;
    paper: string;
    primary: string;
    secondary: string;
    paperA75: string;
    header: string;
    sideBar: string;
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    h1: true;
    h2: true;
    h3: true;
    h4: true;
    h5: true;
    h6: true;
    subtitle1: true;
    subtitle2: false;
    caption: false;
    body1: true;
    body2: true;
    small: true;
    button: true;
  }
}

const buildVariant = (
  fontWeight: number,
  size: number,
  lineHeight: number,
  letterSpacing?: number
) => ({
  fontWeight,
  fontSize: pxToRem(size),
  lineHeight: `${round(lineHeight / size)}`,
  ...(letterSpacing !== undefined
    ? { letterSpacing: `${round(letterSpacing / size)}em` }
    : {}),
});

export default function Themes(props: any) {
  const theme = useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          typography: {
            fontFamily: "Segoe UI, 'Fira Sans', sans-serif",
            h1: {
              ...buildVariant(700, 38, 44, 0),
            },
            h2: buildVariant(400, 38, 44, 0),
            h3: buildVariant(700, 20, 32.4, 0),
            h4: buildVariant(600, 18, 32.4, 0),
            h5: buildVariant(700, 16, 32.4, 0),
            subtitle1: {
              color: "#FFFFFC",
              opacity: 0.75,
            },
            body1: {
              ...buildVariant(500, 16, 32.4, 0),
            },
            body2: buildVariant(400, 14, 18, 0),
            small: buildVariant(400, 14, 18, 0),
            button: {
              ...buildVariant(500, 14, 19, 0),
              textTransform: "none",
            },
            h6: {
              ...buildVariant(600, 14, 18, 0),
            },
          },
          breakpoints: {
            keys: ["xs", "xsm", "sm", "md", "lg", "xl", "xxl"],
            values: {
              xs: 0,
              xsm: 540,
              sm: 760,
              md: 960,
              lg: 1280,
              xl: 1440,
              xxl: 1800,
            },
          },
          palette: {
            background: {
              paper: "#f5f5f5",
              default: "#FFFFFF",
              header: "#B36643",
            },
            primary: {
              main: "#000000",
              light: "#00D6F2",
              contrastText: "#FFFFFC",
            },
            secondary: {
              main: "#646A71",
              light: "#C5F9DA",
              contrastText: "#F7A088",
            },
            text: {
              primary: "#000000",
              secondary: "#000000",
            },
          },
          components: {
            MuiButton: {
              styleOverrides: {
                root: {
                  textTransform: "none",
                  borderRadius: 4,
                  minWidth: "80px",
                },
                outlined: {
                  borderColor: "#114898",
                  color: "#114898",
                  fontWeight: 600,
                  minHeight: "36px",
                  minWidth: "80px",
                },
                contained: {
                  backgroundColor: "#FFC251",
                  color: "#000000",
                  fontWeight: 600,
                  minHeight: "36px",
                  minWidth: "80px",
                },
                text: {
                  backgroundColor: "#F7A088",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  minHeight: "36px",
                },
                containedSecondary: {
                  backgroundColor: "#FFC251",
                  color: "#000000",
                  fontWeight: 600,
                  minHeight: "36px",
                  minWidth: "80px",
                  "&:hover": {
                    backgroundColor: " #de8a73",
                  },
                },
                outlinedSecondary: {
                  minHeight: "36px",
                  border: "1px solid #F7A088",
                  color: "#F7A088",
                  minWidth: "80px",
                  "&:hover": {
                    border: "1px solid #de8a73",
                  },
                },
              },
              defaultProps: {
                disableRipple: true,
              },
            },
            MuiPaper: {
              styleOverrides: {
                rounded: {
                  borderRadius: 3,
                },
                root: {
                  boxShadow: "0px 2px 8px #0000001F",
                },
              },
            },
            MuiTextField: {
              styleOverrides: {
                root: {
                  "& .MuiInputBase-root": {
                    borderRadius: "10px",
                  },
                },
              },
            },
            MuiTab: {
              defaultProps: {
                disableRipple: true,
              },
            },
          },
          zIndex: {
            snackbar: 10000,
          },
        })
      ),
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
}
