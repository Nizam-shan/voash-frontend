import React from "react";
import { Box, Button, TextField } from "@mui/material";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import { LoginService } from "../services/userServices";
import { useNavigate } from "react-router-dom";

import { auth, provider } from "../TaskBoard/firebase";
import { signInWithPopup } from "firebase/auth";

const LoginPage = () => {
  const initialValues = { email: "", password: "" };
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    LoginService(values)
      .then((res) => {
        const data = res.data;
        console.log("🚀 ~ .then ~ data:", data);

        if (data.status_code === 200) {
          localStorage.setItem("access_token", data?.data?.userDetails?.token);
          localStorage.setItem(
            "profile_image",
            data?.data?.userDetails?.user.profile_image
          );

          navigate("/task");
          toast.success(data?.message || "Login sucessfull");
        }
      })
      .catch((err) => {
        console.log("🚀 ~ handleSubmit ~ err:", err);
        toast.error(
          err?.response?.data?.message ||
            "Some error occurred. Please try again"
        );
      });
    setSubmitting(false);
  };

  const handleClick = (res) => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const data = res;

        if (data.user) {
          localStorage.setItem("access_token", data.user.accessToken);
          navigate("/task");
          toast.success(data?.message || "Login sucessfull");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h1 style={{ color: "#227cf2" }}>Login Page</h1>
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: "20px",
          border: "3px solid #227cf2",
          borderRadius: "10px",
          display: "flex",

          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleChange, values, touched, errors }) => (
            <Form>
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={values.email}
                onChange={handleChange}
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
              />
              <TextField
                margin="dense"
                name="password"
                label="Password"
                type="password"
                fullWidth
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              <Button
                type="submit"
                color="primary"
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                sx={{ textTransform: "none", mt: 2 }}
              >
                Login
              </Button>
              <p>
                Don't have an account ?{" "}
                <span
                  style={{ color: "#227cf2", cursor: "pointer" }}
                  onClick={() => navigate("/signup")}
                >
                  Signup
                </span>
              </p>
            </Form>
          )}
        </Formik>
        <Box>
          <Button
            sx={{ textTransform: "none" }}
            variant="contained"
            onClick={handleClick}
          >
            Login with <span style={{ fontWeight: "bold" }}> &nbsp;Google</span>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
