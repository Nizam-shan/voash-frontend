import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CustomTextField from "./customeTextField";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { addTask, editTask } from "../services/crudServices";
import { toast } from "react-toastify";

export const AddForm = ({
  open,
  setOpen,
  formData,
  setFormData,
  isEditMode,
  view,
  addNewTask,
  setEditMode,
  setView,
}) => {
  console.log("🚀 ~ view:", view);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    descriptions: Yup.string().required("Description is required"),
  });

  const initialValues = {
    title: formData?.title ? formData.title : "",
    descriptions: formData?.descriptions ? formData.descriptions : "",
  };

  const handleSubmit = async (values, { isSubmitting }) => {
    if (isEditMode) {
      await editTask(values, formData._id)
        .then((res) => {
          console.log("🚀 ~ .then ~ res:", res);
          addNewTask(res.data?.data);
          setOpen(false);
          toast.success(res.data?.message);
        })
        .catch((error) => {
          console.log("🚀 ~ awaiteditTask ~ error:", error);
          toast.error(error.response.data.message || "Some error occured");
        });
    } else {
      await addTask(values)
        .then((res) => {
          addNewTask(res.data?.data);
          setOpen(false);
          toast.success(res.data?.message);
          setFormData({
            title: "",
            descriptions: "",
          });
        })
        .catch((error) => {
          toast.error(
            error?.response?.data?.message ||
              "Some error occurred. Please try again"
          );
        });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setView(false);
    setEditMode(false);
  };

  return (
    <>
      <div>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">Add Task</DialogTitle>
          <DialogContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, handleChange, values, touched, errors }) => (
                <Form>
                  <CustomTextField
                    label="Title"
                    name="title"
                    value={values.title}
                    required
                    disabled={view}
                    onChange={handleChange}
                    error={touched.title && Boolean(errors.title)}
                    helperText={touched.title && Boolean(errors.title)}
                  />
                  <CustomTextField
                    label="Description"
                    name="descriptions"
                    value={values.descriptions}
                    required
                    disabled={view}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    error={touched.descriptions && errors.descriptions}
                    helperText={touched.descriptions && errors.descriptions}
                  />
                  <DialogActions>
                    <Button autoFocus variant="outined" onClick={handleClose}>
                      Close
                    </Button>
                    {view ? (
                      ""
                    ) : (
                      <Button
                        variant="contained"
                        autoFocus
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isEditMode ? "Edit" : "Create"}
                      </Button>
                    )}
                  </DialogActions>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};
