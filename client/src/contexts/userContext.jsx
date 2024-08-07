// import axios from "axios";
// import React, { createContext, useState, useEffect } from "react";
// import { Link } from "react-router-dom";

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const fetchUser = async () => {
//         try {
//           const response = await axios.get(
//             `https://project-courseflow-server.vercel.app/users/profile`
//           );
//           setUser(response.data);
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       };
//       fetchUser();
//     }
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     Link.push("/");
//   };

//   return (
//     <UserContext.Provider value={{ user, setUser, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };
