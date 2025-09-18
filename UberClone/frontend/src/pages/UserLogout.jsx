import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserLogout = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/logout`,
          {}, // empty body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error("Logout failed:", error.message);
      } finally {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    logout();
  }, [navigate, token]);

  return <div>Logging out...</div>;
};

export default UserLogout;
