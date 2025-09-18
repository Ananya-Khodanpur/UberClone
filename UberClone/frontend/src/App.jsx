import React from "react";
import { Route, Routes } from "react-router-dom";
import Start from "./pages/Start";
import UserLogin from "./pages/UserLogin";
import UserSignup from "./pages/UserSignup";
import CaptainLogin from "./pages/CaptainLogin";
import CaptainSignup from "./pages/CaptainSignup";
import Home from "./pages/Home";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import UserLogout from "./pages/UserLogout";
import CaptainHome from "./pages/CaptainHome";
import CaptainProtectedWrapper from "./pages/CaptainProtectWrapper";
import CaptainLogout from "./pages/CaptainLogout";
import RideStarted from "./pages/RideStarted";
import CaptainRiding from "./pages/CaptainRiding";
import { ToastContainer } from "react-toastify";
import "./index.css"; // Ensure your main CSS file includes Tailwind

const App = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center">
      <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg shadow-xl md:shadow-2xl bg-white md:my-10">
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/captain-login" element={<CaptainLogin />} />
          <Route path="/captain-signup" element={<CaptainSignup />} />
          <Route path="/riding" element={<RideStarted />} />
          <Route
            path="/captain-home"
            element={
              <CaptainProtectedWrapper>
                <CaptainHome />
              </CaptainProtectedWrapper>
            }
          />
          <Route
            path="/home"
            element={
              <UserProtectedWrapper>
                <Home />
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/user-logout"
            element={
              <UserProtectedWrapper>
                <UserLogout />
              </UserProtectedWrapper>
            }
          />
          <Route path="/captain-riding" element={<CaptainRiding />} />
          <Route
            path="/captain-logout"
            element={
              <CaptainProtectedWrapper>
                <CaptainLogout />
              </CaptainProtectedWrapper>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </div>
  );
};

export default App;