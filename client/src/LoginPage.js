import React, { useState, useContext } from "react";
import { AuthContext } from "./components/AuthContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [isLoading, setIsLoading] = useState(false); // State for loading
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setErrorMessage(""); // Clear previous error message
    setIsLoading(true); // Start loading
    try {
      const response = await fetch(
        "https://sched-origin-api.onrender.com/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful!", data);
        Cookies.set("authToken", data.token, { path: "/" });
        login(data); // Pass user data to login function
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Login failed!"); // Set error message from server response
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred during login. Please try again."); // Set generic error message
    } finally {
      setIsLoading(false); // End loading
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('images/vattenbild.jpeg')" }}
    >
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md mx-4 sm:mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {errorMessage && (
            <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
          )}
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3.5-3.5L12 4z"
                ></path>
              </svg>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
