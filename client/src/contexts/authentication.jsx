import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  //========Log in
  const login = async ({ email, password }) => {
    try {
      const result = await axios.post(
        "https://project-courseflow-server.vercel.app/users/login",
        { email, password } // Pass email and password as object
      );

      const token = result.data.token;
      localStorage.setItem("token", token);
      const userDataFromToken = jwtDecode(token);
      localStorage.setItem("userData", JSON.stringify(userDataFromToken));
      setState({ loading: false, user: userDataFromToken, error: null });
      navigate("/");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "An error occurred";
      setState({ loading: false, error: errorMsg });
      throw new Error(errorMsg); // Throw error to be caught by the component
    }
  };

  //========Login For Admin
  const adminLogin = async ({ email, password }) => {
    try {
      const result = await axios.post(
        "https://project-courseflow-server.vercel.app/admin/login",
        { email, password } // Pass email and password as object
      );

      const token = result.data.token;
      const userDataFromToken = jwtDecode(token);

      if (userDataFromToken.role !== "Admin") {
        throw new Error("Unauthorized access. Admins only.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("userData", JSON.stringify(userDataFromToken));
      setState({ loading: false, user: userDataFromToken, error: null });
      navigate("/admin/courselist");
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setState({ loading: false, error: errorMsg });
      throw new Error(errorMsg); // Throw error to be caught by the component
    }
  };

  //===========Register
  const register = async (data) => {
    await axios.post(
      "https://project-courseflow-server.vercel.app/users/register",
      data
    );
    navigate("/login");
  };

  //==============Logout
  const logout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    setState({ ...state, user: null, error: null });
    navigate("/");
  };

  //=========Access value of userId from storage
  const UserIdFromLocalStorage = Number(
    localStorage.getItem("userData")?.split(",")[0]?.split(":")[1]
  );

  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        adminLogin,
        logout,
        register,
        UserIdFromLocalStorage,
        isAuthenticated,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// this is a hook that consume AuthContext
const useAuth = () => React.useContext(AuthContext);

export { AuthProvider, useAuth };
