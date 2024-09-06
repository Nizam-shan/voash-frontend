import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";

import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";

import AdbIcon from "@mui/icons-material/Adb";
import { useNavigate } from "react-router-dom";

function ResponsiveAppBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <AdbIcon sx={{ display: "flex", mr: 1 }} />

          <Box sx={{ flexGrow: 0, display: "flex" }}>
            <IconButton sx={{ p: 0 }}>
              <Avatar
                alt="Remy Sharp"
                src={`${process.env.REACT_APP_API}${localStorage.getItem(
                  "profile_image"
                )}`}
              />
            </IconButton>

            {token && window.location.pathname !== "/" ? (
              <Button
                sx={{ background: "red", color: "white", ml: 1 }}
                onClick={logout}
              >
                {" "}
                Logout
              </Button>
            ) : (
              <div>
                <Button
                  sx={{
                    background: "white",
                    ml: 1,
                    "&:hover": {
                      background: "white",
                    },
                  }}
                  onClick={() => navigate("/")}
                >
                  Login
                </Button>
                <Button
                  sx={{ color: "white", ml: 1 }}
                  onClick={() => navigate("/signup")}
                >
                  {" "}
                  Signup
                </Button>
              </div>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
