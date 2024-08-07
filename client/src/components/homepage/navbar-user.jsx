import React, { useEffect, useState } from "react";
import { Link, useNavigate ,useParams } from "react-router-dom";
import logo from "/src/assets/icons/logo.png";
import Profile from "/src/assets/images/sm/profile/profile.png";
import iconProfile from "/src/assets/icons/icon-profile.png";
import iconMyCourse from "/src/assets/icons/icon-mycourse.png";
import iconDesire from "/src/assets/icons/icon-desire.png";
import iconHomework from "/src/assets/icons/icon-homework.png";
import iconLogout from "/src/assets/icons/icon-logout.png";
import Usercourse from "../../pages/authorized/user-course";
import { useAuth } from "../../contexts/authentication";
import axios from "axios";

function NavbarUser() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({});


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const { logout } = useAuth();
  const userId = useAuth();

  const getUserData = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4000/profiles/${userId.UserIdFromLocalStorage}`
      );
      setUserData(result.data);
    } catch (error) {
      console.error("Error Fetching", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleNavigate = () => {
    navigate("/courselist");
    window.scrollTo(0, 0);
  };

  return (
    <div className="navbar z-40  sticky top-0 bg-white">
      <section
        className="navbar items-center sm:w-auto sm:h-[56px] sm:flex sm:flex-row sm:justify-between md:w-full md:h-[88px] md:flex md:flex-row md:justify-between xl:w-full xl:h-[88px] xl:flex xl:flex-row xl:justify-between"
        style={{ boxShadow: "4px 4px 24px 0px rgba(0, 0, 0, 0.08)" }}
      >
        <Link to="/userhomepage">
          <img
            src={logo}
            alt="Logo"
            className="sm:pl-[16px] md:pl-[100px] xl:pl-[160px]"
          />
        </Link>

        <div className="menu flex items-center sm:mr-[16px] md:mr-[160px] xl:mr-[160px]">
          <Link to="/courselistuser">
            <h1 className="sm:font-bold sm:text-sm sm:mx-[16px] sm:my-[16px] xl:font-bold xl:text-base sm:text-black cursor-pointer">
              Our Courses
            </h1>
          </Link>

          <div className="relative ml-4">
            <div
              className="flex items-center cursor-pointer object-cover"
              onClick={toggleMenu}
            >
              {userData.profilepicture ? (
                <img
                  src={userData.profilepicture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <svg
                  fill="#929090"
                  height="30px"
                  width="30px"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="-174.08 -174.08 860.16 860.16"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  enableBackground="new 0 0 512 512"
                  stroke="#929090"
                >
                  <g
                    id="SVGRepo_bgCarrier"
                    strokeWidth="0"
                    transform="translate(0,0), scale(1)"
                  >
                    <rect
                      x="-174.08"
                      y="-174.08"
                      width="860.16"
                      height="860.16"
                      rx="430.08"
                      fill="#f5f5f5"
                      strokeWidth="0"
                    ></rect>
                  </g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <g>
                          {" "}
                          <path d="m256,59.2c-47.6,0-86.3,36.7-86.3,81.8 0,45.1 38.7,81.8 86.3,81.8 47.6,0 86.2-36.7 86.2-81.8 0-45.1-38.6-81.8-86.2-81.8zm0,204.4c-70.1,0-127.1-55-127.1-122.5 0-67.6 57-122.5 127.1-122.5 70.1,0 127.1,55 127.1,122.5 0,67.5-57,122.5-127.1,122.5z"></path>{" "}
                          <path d="m53.9,452.8h404.3c-9.9-65.8-51.7-123-111.8-152.5l-72.9,119.7c-8.8,14.4-26.4,14.1-34.9,0l-72.9-119.7c-60.1,29.5-101.9,86.7-111.8,152.5h-7.10543e-15zm426.7,40.7h-449.2c-17.7,0-20.6-15.7-20.4-21.3 4.2-96.3 65.2-181.4 155.3-216.8 9.2-3.6 19.8-0.1 24.9,8.4l64.8,106.4 64.7-106.3c5.2-8.5 15.7-12 24.9-8.4 90.1,35.3 151.1,120.4 155.3,216.8 0.3,5.5-2.6,21.2-20.3,21.2z"></path>{" "}
                        </g>{" "}
                      </g>{" "}
                    </g>{" "}
                  </g>
                </svg>
              )}
              <span className="hidden md:block mx-2 text-sm text-gray-700 md:font-normal xl:text-base xl:font-normal">
                {userData.fullname}
              </span>
              <svg
                className={`h-5 w-5 ml-1 text-black ${
                  isOpen ? "transform rotate-180" : ""
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            {isOpen && (
              <div className="absolute bg-white z-50 shadow-2xl rounded-lg sm:w-[198px] sm:h-auto sm:mt-5 md:left-[85px] sm:right-0 sm:mr-[-18px] md:mt-0 xl:left-24 xl:mt-0">
                <div className="py-1 text-sm font-medium">
                  <Link
                    to="/user/profile"
                    className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex-row"
                    role="menuitem"
                  >
                    <img src={iconProfile} alt="" className="pr-[12px]" />
                    Profile
                  </Link>
                  <Link
                    to="/user/my_course"
                    className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex-row"
                    role="menuitem"
                  >
                    <img src={iconMyCourse} alt="" className="pr-[12px]" />
                    My Courses
                  </Link>
                  <Link
                    to="/user/homework"
                    className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex-row"
                    role="menuitem"
                  >
                    <img src={iconHomework} alt="" className="pr-[12px]" />
                    My Homework
                  </Link>
                  <Link
                    to="/user/desire"
                    className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex-row"
                    role="menuitem"
                  >
                    <img src={iconDesire} alt="" className="pr-[12px]" />
                    My Desire Courses
                  </Link>
                  <div
                    onClick={() => logout()}
                    className="flex px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex-row border-t-2 cursor-pointer"
                    role="menuitem"
                    style={{
                      boxShadow: "4px 4px 24px 0px rgba(0, 0, 0, 0.08)",
                    }}
                  >
                    <img src={iconLogout} alt="" className="pr-[12px]" />
                    Log out
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default NavbarUser;
