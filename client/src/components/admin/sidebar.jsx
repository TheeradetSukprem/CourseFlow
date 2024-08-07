import React from "react";
import { Link, useNavigate } from "react-router-dom";
import course from "../../assets/image/course.png";
import assingment from "../../assets/image/assignment.png";
import logout from "../../assets/image/logout.png";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    console.log("Current token:", token);
    localStorage.removeItem("token");
    const tokenAfterRemoval = localStorage.getItem("token");
    console.log("Token after removal:", tokenAfterRemoval);
    console.log("Navigating to /login/admin");
    navigate("/login/admin");
  };

  return (
    <div>
      <div className="h-full flex flex-row overflow-hidden justify-start border-r-2 border-gray-300">
        <div className=" bg-white ">
          <div>
            <h1 className=" py-2 px-8 md:text-3xl lg:text-3xl font-bold bg-gradient-to-l from-blue-700 to-blue-200 bg-clip-text text-transparent flex items-center justify-center">
              CourseFlow
            </h1>
            <h2 className="text-slate-500 font-small text-base md:text-sm lg:text-sm xl:text-sm flex items-center justify-center">
              Admin Panel Control
            </h2>
          </div>
          <div className="mt-20 h-[540px] flex flex-col items-start justify-start">
            <Link to="/admin/courselist">
              <button className="w-[240px]  h-[56px] pl-8 flex items-center font-small text-base md:text-sm lg:text-sm xl:text-sm text-left text-slate-500 hover:bg-gray-200">
                <img src={course} alt="Course Icon" className="w-6 h-6 mr-4" />
                Course
              </button>
            </Link>
            <Link to="/admin/assignmentlist">
              <button className="w-[240px] h-[56px] pl-8 flex items-center font-small text-base md:text-sm lg:text-sm xl:text-sm text-left text-slate-500 hover:bg-gray-200">
                <img
                  src={assingment}
                  alt="Assignment Icon"
                  className="w-6 h-6 mr-4"
                />
                Assignment
              </button>
            </Link>
            <div className="mt-[300px]">
              <button
                onClick={handleLogout}
                className="w-[240px] h-[56px] pl-8 flex items-center font-small text-base md:text-sm lg:text-sm xl:text-sm text-left text-slate-500 hover:bg-gray-200"
              >
                <img src={logout} alt="Logout Icon" className="w-6 h-6 mr-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
