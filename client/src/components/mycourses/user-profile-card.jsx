import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authentication";
import axios from "axios";
import { Link } from "react-router-dom";

function UserProfileCard() {
  const [userData, setUserData] = useState({});
  const [countCourseStatus, setCountCourseStatus] = useState({});

  const userId = useAuth();

  //===============Get course count
  const getCountCourseStatus = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4000/courses/user/${userId.UserIdFromLocalStorage}/count/`
      );
      // Assuming the response is an array with a single object
      const data = result.data[0] || {}; // Handle the case where result.data might be empty
      setCountCourseStatus(data);
    } catch (error) {
      console.error("Error Fetching", error);
    }
  };

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
    getUserData(), getCountCourseStatus();
  }, []);

  return (
    <div className="shadow-xl w-full h-[8rem] bg-white flex flex-col justify-center items-center pb-3  bottom-0 lg:left-[16rem] lg:top-0 lg:w-[357px] lg:h-[389px] lg:rounded-xl">
      <Link to="/user/profile">
        <div className="flex gap-3 pr-[110px] mr-8 lg:flex-col lg:justify-center lg:items-center lg:pr-0 lg:mr-0 lg:mb-5">
          {userData.profilepicture ? (
            <img
              className="object-cover w-[40px] h-[40px] border rounded-full m-4 lg:w-[120px] lg:h-[120px] lg:m-0"
              src={userData.profilepicture}
              alt="avatar"
            />
          ) : (
            <svg
              className="w-[40px] h-[40px] border rounded-full m-4 lg:w-[120px] lg:h-[120px] lg:m-0"
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
                <g>
                  <g>
                    <g>
                      <path d="m256,59.2c-47.6,0-86.3,36.7-86.3,81.8 0,45.1 38.7,81.8 86.3,81.8 47.6,0 86.2-36.7 86.2-81.8 0-45.1-38.6-81.8-86.2-81.8zm0,204.4c-70.1,0-127.1-55-127.1-122.5 0-67.6 57-122.5 127.1-122.5 70.1,0 127.1,55 127.1,122.5 0,67.5-57,122.5-127.1,122.5z"></path>
                      <path d="m53.9,452.8h404.3c-9.9-65.8-51.7-123-111.8-152.5l-72.9,119.7c-8.8,14.4-26.4,14.1-34.9,0l-72.9-119.7c-60.1,29.5-101.9,86.7-111.8,152.5h-7.10543e-15zm426.7,40.7h-449.2c-17.7,0-20.6-15.7-20.4-21.3 4.2-96.3 65.2-181.4 155.3-216.8 9.2-3.6 19.8-0.1 24.9,8.4l64.8,106.4 64.7-106.3c5.2-8.5 15.7-12 24.9-8.4 90.1,35.3 151.1,120.4 155.3,216.8 0.3,5.5-2.6,21.2-20.3,21.2z"></path>
                    </g>
                  </g>
                </g>
              </g>
            </svg>
          )}
          <span className="text-Body1 mt-6 text-Blue-500 lg:text-Body1 lg:font-semibold lg:mt-1">
            {userData.fullname}
          </span>
        </div>
      </Link>

      <div className="flex gap-3 justyfy-center items-center">
        <div className="bg-Gray-300 text-Gray-800 px-4 py-2 rounded-lg text-Body4 lg:h-[134px] lg:w-[143px] lg:text-Body2 relative ">
          Course Inprogress
          <span className="font-semibold text-Body1 ml-2 lg:ml-0 lg:absolute lg:bottom-4 lg:left-4">
            {countCourseStatus.inprogress_count}
          </span>
        </div>
        <div className="bg-Gray-300 text-Gray-800 px-4 py-2 rounded-lg text-Body4 lg:h-[134px] lg:w-[143px] lg:text-Body2 relative">
          Course Completed
          <span className="font-semibold text-Body1 ml-2  lg:ml-0 lg:absolute lg:bottom-4 lg:left-4">
            {countCourseStatus.completed_count}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserProfileCard;
