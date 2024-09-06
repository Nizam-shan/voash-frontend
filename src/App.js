import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import TaskBoard from "./components/TaskBoard/taskBoard";
import ResponsiveAppBar from "./navbar";
import LoginPage from "./components/usersigin-sgnup/login";
import SignUpPage from "./components/usersigin-sgnup/signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  console.log("🚀 ~ AppContent ~ token:", token);
  // const showNavbar = !["/login", "/signup"].includes(location.pathname);
  useEffect(() => {
    if (!token || token === undefined) {
      if (location.pathname === "/signup") return;
      localStorage.clear();
      navigate("/");
    }
    // else {
    //   navigate("/task");
    // }
    // eslint-disable-next-line
  }, [token, navigate]);

  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={true}
        draggable
        pauseOnHover
        theme="light"
      />
      <ResponsiveAppBar />
      <Routes>
        <Route path="/task" element={<TaskBoard />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
