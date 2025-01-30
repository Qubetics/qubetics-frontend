import "./TextArea.scss";
import { TextField } from "@mui/material";

const TextArea = ({ rows = 4, ...props }) => {
  return (
    <TextField
      {...props}
      multiline={true}
      rows={rows}
      className="customized-text-field"
      InputLabelProps={{
        shrink: true,
      }}
      FormHelperTextProps={{
        error: props.error,
      }}
      inputProps={{
        maxLength: props.maxlength,
      }}
    />
  );
};

export default TextArea;
