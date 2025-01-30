import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          "& ::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "& ::-webkit-scrollbar-track": {
            backgroundColor: "#fff !important",
            boxShadow: `inset 0 0 5px #fff !important`,
            borderRadius: "10px",
          },
          "& ::-webkit-scrollbar-thumb": {
            backgroundColor: "#0071FF",
            borderRadius: "10px",
          },
          "& ::-webkit-scrollbar-thumb:hover": {},
          ".MuiTooltip-arrow ": {
            fontSize: "20px !important",
          },
          ".custom-modal": {
            ".MuiDialog-paperWidthSm": {
              maxWidth: "552px",
              borderRadius: "10px",
              backgroundColor: "#1F1F1F",
            },
            ".common-wrapper": {
              padding: "0 !important",
              // padding:removeEventListener;

              "&__title": {
                borderBottom: "0",
                marginBottom: "0",
              },

              ".MuiButton-root": {
                backgroundColor: "#0086ff",
                borderRadius: "15px",
                color: "#ffffff",
              },
            },

            "&__content": {
              padding: "38px",
            },
          },
          ".locked-tooltip": {
            textAlign: "center",
            padding: "10px",

            h4: {
              margin: "10px 0 0",
              lineHeight: "16px",
              fontSize: "16px",
            },
            p: {
              margin: "5px 0",
              fontSize: "13px",
              lineHeight: "16px",
            },
          },
          ".commn-icon": {
            svg: {
              width: "15px",
              height: "15px",

              path: {
                fill: "#fff",
              },
            },
          },

          /* Hide scrollbar for Chrome, Safari and Opera */
          "::-webkit-scrollbar": {
            display: "none",
          },
          "body::-webkit-scrollbar": {
            display: "none",
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 767,
      md: 999,
      lg: 1239,
      xl: 1440,
      xxl: 1680,
    },
  },
  typography: {
    fontSize: 11,
    fontFamily: '"DM Sans", sans-serif',
    fontWeightRegular: "normal",
    h1: {
      fontSize: 29,
      fontWeight: 700,
    },
    h2: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: 500,
    },
    h3: {
      fontSize: 20,
      lineHeight: "36px",
      fontWeight: 600,
      letterSpacing: 0.5,
    },
    h4: {
      fontSize: 24,
      fontWeight: 700,
      lineHeight: "40px",
    },
    h5: {
      fontSize: 18,
      fontWeight: 500,
    },
    h6: {
      fontSize: 16,
      fontWeight: 300,
      lineHeight: "20px",
      letterSpacing: 0.5,
    },
    subtitle1: {
      fontSize: 14,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: 13,
      fontWeight: 400,
    },
    body1: {
      fontSize: 16,
      lineHeight: "26px",
      // letterSpacing: -0.25,
    },
    body2: {
      fontSize: 14,
      lineHeight: "24px",
    },
    body3: {
      fontSize: 12,
      lineHeight: "18px",
    },

    a: {
      fontWeight: 700,
      fontSize: "16px",
    },
    caption: {
      fontSize: 10,
    },
    button: {
      fontWeight: "700",
      fontSize: 14,
      lineHeight: 1.6,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
  },
  palette: {
    primary: { main: "#191919", dark: "#000" },
    secondary: { main: "#152A59", dark: "#1F1F1F" },
    blue: {
      main: "#0086ff",
      dark: "#2F4880",
      newBlue: "#0071FF",
      lightBlue: "rgba(0,113,255, 0.2)",
    },
    gray: { light: "#9999B3", main: "#E8E8E8", dark: "#3F3F44" },
    green: { main: "#24FF00" },
    orange: { main: "#FF9900" },
    text: { primary: "#FFFFFF", secondary: "#fff" },
    divider: "#000000",
  },
});

export default theme;
