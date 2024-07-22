import axios from "axios";

export const addTask = async (data) =>
  await axios.post(`${process.env.REACT_APP_API}/add_task`, data, {
    headers: { Authorization: localStorage.getItem("access_token") },
  });

export const getAllTask = async () =>
  await axios.get(`${process.env.REACT_APP_API}/all_task`, {
    headers: { Authorization: localStorage.getItem("access_token") },
  });

export const editTask = async (data, id) =>
  await axios.put(`${process.env.REACT_APP_API}/update_task/${id}`, data, {
    headers: { Authorization: localStorage.getItem("access_token") },
  });

export const deleteTask = async (id) =>
  await axios.delete(`${process.env.REACT_APP_API}/delete_task/${id}`, {
    headers: { Authorization: localStorage.getItem("access_token") },
  });

export const updateTaskStatus = async (id, status) => {
  return await axios.put(
    `${process.env.REACT_APP_API}/update_task_status/${id}`,
    { status }
  );
};
