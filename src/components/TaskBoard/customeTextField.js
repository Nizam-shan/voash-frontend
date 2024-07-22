import React from "react";

import { TextField } from "@mui/material";

const CustomTextField = (props) => {
  return (
    <>
      <div style={{ padding: "5px" }}>
        <TextField label="Outlined" variant="outlined" fullWidth {...props} />
      </div>
    </>
  );
};

export default CustomTextField;
