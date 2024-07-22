import axios from "axios";

export const LoginService = async (data) =>
  await axios.post(`${process.env.REACT_APP_API}/auth/login`, data);

export const RegisterService = async (data) =>
  await axios.post(`${process.env.REACT_APP_API}/auth/register`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
