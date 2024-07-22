import React from "react";
import { Box } from "@mui/material";
import { GoogleLogin } from "react-google-login";

export const GoogleLoginButton = () => {
  console.log("toke", process.env.REACT_CLIENT_ID);
  const onSuccess = (res) => {
    console.log("dd", res.profileObj);
  };
  const onFailure = (res) => {
    console.log(res);
  };
  return (
    <>
      <Box>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID} // Use environment variable
          buttonText="Login with Google" // Correct prop name
          onSuccess={onSuccess}
          onFailure={onFailure}
          isSignedIn={true}
          cookiePolicy={"single_host_origin"}
        />
      </Box>
    </>
  );
};
