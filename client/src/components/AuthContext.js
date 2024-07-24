import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log("isAuthenticated", isAuthenticated);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  const login = (user) => {
    setIsAuthenticated(true);
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("authToken", user.token); // Store token in local storage
    console.log("Logged in as:", user.userId);
    if (user.role === "owner") {
      navigate("/owner");
    } else {
      navigate("/home");
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("authToken"); // Retrieve token from local storage
    if (storedUser && storedToken) {
      setIsAuthenticated(true);
      setUser(storedUser);
      Cookies.set("authToken", storedToken, { path: "/" }); // Set the token in cookies
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
