import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { ToastContainer, toast } from "react-toastify";

const UserSignup = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function timeout(delay) {
    return new Promise((res) => setTimeout(res, delay));
  }

  const notify = () =>
    toast.success(`Registered, Redirecting to Login`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      className: "w-5/6 mt-6 text-center",
    });

  const navigate = useNavigate();
  const { user, setUser } = React.useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Form validation
    if (!firstname.trim() || !lastname.trim() || !email.trim() || !password.trim()) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    const newUser = {
      fullname: {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
      },
      email: email.trim().toLowerCase(),
      password: password,
    };

    console.log("Registering user:", newUser);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );

      console.log("Registration successful:", response);

      // Clear form fields
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");

      if (response.status === 201) {
        const data = response.data;
        setUserData(data.user);
        setUser(data.user);
        
        notify();
        await timeout(5000);
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      
      if (error.response) {
  if (error.response.data.errors) {
    // Show first validation error
    setError(error.response.data.errors[0].msg);
  } else {
    setError(error.response.data.message || 'Server error');
  }


}
 else if (error.request) {
        setError("Network error: Unable to connect to server");
      } else {
        setError(`Registration failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen">
      <div>
        <div className="ml-7 py-7">
          <Link to="/">
            <img
              className="w-16"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/1200px-Uber_logo_2018.svg.png"
              alt="logo"
            />
          </Link>
        </div>

        <div className="px-6 pt-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler}>
            <h3 className="text-base mb-2 font-semibold">
              What should we call you?
            </h3>
            <div className="flex gap-3 mb-5">
              <input
                value={firstname}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#ededed] rounded-lg px-4 py-2 border text-lg placeholder:text-base font-semibold placeholder:ml-2 w-1/2"
                required
                type="text"
                placeholder="First name"
                disabled={isLoading}
              />
              <input
                value={lastname}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#ededed] rounded-lg px-4 py-2 border text-lg placeholder:text-base font-semibold placeholder:ml-2 w-1/2"
                required
                type="text"
                placeholder="Last name"
                disabled={isLoading}
              />
            </div>

            <h3 className="text-base mb-2 font-semibold">What's your email</h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#ededed] mb-5 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base font-semibold placeholder:ml-2"
              required
              type="email"
              placeholder="your_email@here.com"
              disabled={isLoading}
            />

            <h3 className="text-base mb-2 font-semibold">Enter Password</h3>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#ededed] mb-5 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base font-semibold placeholder:ml-2"
              type="password"
              required
              placeholder="yourPassword"
              disabled={isLoading}
            />

            <button 
              type="submit"
              disabled={isLoading}
              className={`${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black hover:bg-gray-800'
              } text-white font-semibold mb-5 rounded-lg px-4 py-3 border w-full text-lg mt-2 transition-colors`}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-center">
              Already a user?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login here.
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="flex justify-center items-center p-4 bg-gray-100">
        <p className="text-center text-[11px] text-gray-600">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy. Your information is safe with us and will not be shared
          without your consent.
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserSignup;