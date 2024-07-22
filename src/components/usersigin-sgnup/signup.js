import React from "react";
import { Box, Button, TextField } from "@mui/material";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import { RegisterService } from "../services/userServices";
import { useNavigate } from "react-router-dom";

import { auth, provider } from "../TaskBoard/firebase";
import { signInWithPopup } from "firebase/auth";

const SignUpPage = () => {
  const initialValues = {
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    profile_image: null,
    // confirm_password: "",
  };
  const navigate = useNavigate();
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string(),
    confirm_password: Yup.string()
      .required("Confirm passsword is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    profile_image: Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("🚀 ~ handleSubmit ~ values:", values);
    setSubmitting(true);
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("first_name", values.first_name);
    formData.append("last_name", values.last_name);
    formData.append("password", values.password);
    if (values.profile_image) {
      formData.append("profile_image", values.profile_image);
    }

    RegisterService(values)
      .then((res) => {
        const data = res.data;
        console.log("🚀 ~ .then ~ data:", data);

        if (data.status_code === 201) {
          navigate("/");
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
      <h1 style={{ color: "#227cf2" }}>SignUp</h1>
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
          {({
            isSubmitting,
            setFieldValue,
            handleChange,
            values,
            touched,
            errors,
          }) => (
            <Form>
              <TextField
                margin="dense"
                name="first_name"
                label="First Name"
                type="text"
                fullWidth
                value={values.first_name}
                onChange={handleChange}
                error={touched.first_name && Boolean(errors.first_name)}
                helperText={touched.first_name && Boolean(errors.first_name)}
              />
              <TextField
                margin="dense"
                name="last_name"
                label="Last Name"
                type="text"
                fullWidth
                value={values.last_name}
                onChange={handleChange}
                error={touched.last_name && Boolean(errors.last_name)}
                helperText={touched.last_name && Boolean(errors.last_name)}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && Boolean(errors.email)}
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
                helperText={touched.password && Boolean(errors.password)}
              />
              <TextField
                margin="dense"
                name="confirm_password"
                label="Confirm Password"
                type="password"
                fullWidth
                value={values.confirm_password}
                onChange={handleChange}
                error={
                  touched.confirm_password && Boolean(errors.confirm_password)
                }
                helperText={
                  touched.confirm_password && Boolean(errors.confirm_password)
                }
              />
              <div
                style={{
                  border: "2px solid gray",
                  padding: "13px",
                  marginTop: "5px",
                }}
              >
                <input
                  name="profile_image"
                  fullWidth
                  type="file"
                  // value={values.profile_image}
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue(
                      "profile_image",
                      event.currentTarget.files[0]
                    );
                  }}
                />
              </div>

              <Button
                type="submit"
                color="primary"
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                sx={{ textTransform: "none", mt: 2 }}
              >
                Signup
              </Button>
              <p>
                Already have an account ?{" "}
                <span
                  style={{ color: "#227cf2", cursor: "pointer" }}
                  onClick={() => navigate("/")}
                >
                  Login
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

export default SignUpPage;
