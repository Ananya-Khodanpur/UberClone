import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CaptainLogout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const logoutCaptain = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/logout`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Logout failed:", error.message);
      } finally {
        localStorage.removeItem("token");
        navigate("/captain-login");
      }
    };

    logoutCaptain();
  }, [navigate, token]);

  return <div>Logging out...</div>;
};

export default CaptainLogout;
