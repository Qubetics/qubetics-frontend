import { TextField, styled } from "@mui/material";

export const CustomizedTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
  label: {
    width: "100%",
    position: "static",
    color: `${theme.palette.text.primary} !important`,
    ...theme.typography.label,
    transform: "none !important",
    marginBottom: "12px",
  },
  ".MuiOutlinedInput-notchedOutline": {
    border: `0 !important`,

    top: "0px",
    padding: "0px",

    fieldset: {
      display: "none",
    },
    legend: {
      display: "none",
    },
  },
  ".MuiOutlinedInput-input": {
    borderRadius: "10px",
    padding: "15px 14px",
    height: "auto",
    color: "#fff",
    backgroundColor: "#080808",
    overflow: "hidden",
    border: 0,
    textOverflow: "ellipsis",

    "[type=number]": {
      "-moz-appearance": "textfield",
    },

    "&::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: "0",
    },
    "&::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: "0",
    },

    "&.Mui-disabled": {
      "-webkit-text-fill-color": "#fff !important",
    },
  },
  ".MuiOutlinedInput-input::placeholder": {
    fontSize: "16px",
    color: "#fff",
    opacity: 0.5,
    fontWeight: 400,
  },
  ".MuiFormHelperText-root": {
    marginTop: "10px",
    marginLeft: "0px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
    opacity: 0.6,
    [theme.breakpoints.down(767)]: {
      fontSize: "12px",
      lineHeight: "15px",
    },
  },
}));
