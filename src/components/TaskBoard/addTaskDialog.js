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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const initialValues = {
    title: formData?.title ? formData.title : "",
    descriptions: formData?.descriptions ? formData.descriptions : "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required").trim(),
    descriptions: Yup.string().required("Description is required").trim(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    if (isEditMode) {
      await editTask(values, formData._id)
        .then((res) => {
          addNewTask(res.data?.data);
          setOpen(false);
          toast.success(res.data?.message);
        })
        .catch((error) => {
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
    setSubmitting(false);
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
          fullWidth
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title" sx={{ fontWeight: "bold" }}>
            {view ? "Task Details" : isEditMode ? "Edit Task" : "Add Task"}
          </DialogTitle>
          <DialogContent sx={{ padding: 2 }}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                isSubmitting,
                handleChange,
                values,
                touched,
                errors,
                handleBlur,
              }) => (
                <Form>
                  <CustomTextField
                    label="Title"
                    name="title"
                    value={values.title}
                    required
                    disabled={view}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={touched.title && errors.title}
                    helperText={touched.title && errors.title}
                  />
                  <CustomTextField
                    label="Description"
                    name="descriptions"
                    value={values.descriptions}
                    required
                    onBlur={handleBlur}
                    disabled={view}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    error={touched.descriptions && errors.descriptions}
                    helperText={touched.descriptions && errors.descriptions}
                  />
                  {view || isEditMode ? (
                    <div>
                      <span style={{ padding: "5px", marginTop: "5px" }}>
                        Created At:{" "}
                      </span>
                      {formData?.createdAt}
                    </div>
                  ) : (
                    ""
                  )}
                  <DialogActions sx={{ mt: 30 }}>
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
