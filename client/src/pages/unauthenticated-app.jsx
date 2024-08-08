import { Routes, Route } from "react-router-dom";
import Login from "./non-authorized/loginpage";
import Coursedetail from "./non-authorized/coursedetail";
import HomePage from "./non-authorized/homepage";
import Register from "./non-authorized/registerpage";
import Course from "./non-authorized/course";
import NotFoundPage from "./notfoundpage";
import LoginAdmin from "./admin/login-admin";

function UnauthenticatedApp() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courselist" element={<Course />} />
        <Route path="/coursedetail/:Id" element={<Coursedetail />} />

        <Route path="/login/admin" element={<LoginAdmin />} />

        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default UnauthenticatedApp;
