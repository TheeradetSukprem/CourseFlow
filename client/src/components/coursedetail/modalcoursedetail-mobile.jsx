import modal_vector from "../../assets/icons/coursedetail/modal_vector.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/authentication";
import React, { useState, useEffect } from "react";

function Modal() {
  const navigate = useNavigate();
  const params = useParams();
  const userId = useAuth();
  const [subscribedCourses, setSubscribedCourses] = useState([]); // State to track subscribed courses // State to track expanded module
  
  useEffect(() => {
    const subscribedCourses = async () => {
      const result = await axios.get(
        `http://localhost:4000/courses/user/${userId.UserIdFromLocalStorage}/subscribed`
      );
      console.log(result);
      setSubscribedCourses(result.data);
    };
    subscribedCourses();
  }, []);
  
  const postSubscribe = async () => {
    await axios.post(`http://localhost:4000/courses/${userId.UserIdFromLocalStorage}/${params.Id}/subscribe`),
      {};
    navigate(`/user/subscribe/coursedetail/${params.Id}`);
  };

  const handlePostSubscribe = () => {
     const subscribedCourseIds = subscribedCourses.map(
      (course) => course.courseid
    );
    const uniqueSubscribedCourseIds = [...new Set(subscribedCourseIds)];

    if (uniqueSubscribedCourseIds.includes(Number(params.Id))) {
      alert("You have already subscribed to this course.");
    } else {
      postSubscribe();
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-[rgba(0,0,0,0.5)]">
        <div className="border-solid border-2 bg-white sm:h-[304px] sm:w-[343px] rounded-[16px] xl:w-[528px] xl:h-[212px]">
          <div className="flex items-center justify-between pl-[16px] pr-[16px] sm:h-[56px] border-solid border-b-[1px] border-[#E4E6ED] xl:pl-[24px] xl:pr-[24px]">
            <h1 className="text-Body1 font-Body1 text-black">Confirmation</h1>
            <button
              onClick={() => {
                navigate(`/user/coursedetail/${params.Id}`);
              }}
            >
              <img className="w-[9.94px] h-[9.7px]" src={modal_vector}></img>
            </button>
          </div>
          <div className="sm:w-[343px] sm:h-[248px] pl-[16px] pr-[16px] xl:w-[528px] xl:pl-[24px] xl:pr-[24px]">
            <h1 className="text-Body2 font-Body2 text-[#646D89] pt-[24px] pb-[24px]">
              Do you sure to subscribe Service Design Essentials Course?
            </h1>
            <div className="border-solid border-1 sm:w-[311px] sm:h-[128px] flex flex-col gap-[16px] xl:w-[528px] xl:flex-row">
              <button
                onClick={() => {
                  navigate(`/user/coursedetail/${params.Id}`);
                }}
                className="sm:w-[311px] sm:h-[56px] rounded-[12px] border-solid border-[1px] border-Orange-500 text-Orange-500 xl:text-[16px] xl:font-[700] xl:w-[142px] xl:h-[60px]"
              >
                No, I don't
              </button>
              <button
                onClick={handlePostSubscribe}
                className="sm:w-[311px] sm:h-[56px] rounded-[12px] border-solid border-[1px] bg-Blue-500 text-white xl:text-[16px] xl:font-[700] xl:w-[250px] xl:h-[60px]"
              >
                Yes, I want to subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
