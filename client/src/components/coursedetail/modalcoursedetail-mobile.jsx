import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/authentication";
import React, { useState, useEffect } from "react";
import CustomSnackbar from "../shared/custom-snackbar";

function ModalCoursedetailmobile() {
  const navigate = useNavigate();
  const params = useParams();
  const userId = useAuth();
  const [courses, setCourses] = useState([]);
  const [subscribedCourses, setSubscribedCourses] = useState([]);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [open, setOpen] = useState(false);
 
  useEffect(() => {
    const getCourses = async () => {
      const result = await axios.get(
        `https://project-courseflow-server.vercel.app/courses/list/${params.Id}`
      );
      setCourses(result.data.data[0]);
    };
    const subscribedCourses = async () => {
      const result = await axios.get(
        `https://project-courseflow-server.vercel.app/courses/user/${userId.UserIdFromLocalStorage}/subscribed`
      );
      setSubscribedCourses(result.data);
    };
    getCourses();
    subscribedCourses();
  }, []);

  const postSubscribe = async () => {
    await axios.post(
      `https://project-courseflow-server.vercel.app/courses/${userId.UserIdFromLocalStorage}/${params.Id}/subscribe`
    ),
      {};
    navigate(`/user/subscribe/coursedetail/${params.Id}`);
  };
  const handlePostSubscribe = () => {
    const subscribedCourseIds = subscribedCourses.map(
      (course) => course.courseid
    );
    const uniqueSubscribedCourseIds = [...new Set(subscribedCourseIds)];
    if (uniqueSubscribedCourseIds.includes(Number(params.Id))) {
      setAlert({
        message: "You have already subscribed to this course.",
        severity: "error",
      });
      setOpen(true);
    } else {
      postSubscribe();
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-center h-screen bg-[rgba(0,0,0,0.5)]">
        <div className="border-solid border-2 bg-white sm:h-[304px] sm:w-[343px] rounded-[16px] xl:w-[528px] xl:h-[212px]">
          <div className="flex items-center justify-between pl-[16px] pr-[16px] sm:h-[56px] border-solid border-b-[1px] border-[#E4E6ED] xl:pl-[24px] xl:pr-[24px]">
            <h1 className="text-Body1 font-Body1 text-black">Confirmation</h1>
            <div className="text-xl text-Gray-700">
              <button
                onClick={() => {
                  navigate(`/user/coursedetail/${params.Id}`);
                }}
              >
                x
              </button>
            </div>
          </div>
          <div className="sm:w-[343px] sm:h-[248px] pl-[16px] pr-[16px] xl:w-[528px] xl:pl-[24px] xl:pr-[24px]">
            <h1 className="text-Body2 font-Body2 text-[#646D89] pt-[24px] pb-[24px]">
              Do you sure to subscribe {courses.coursename} Course?
            </h1>
            <div className="border-solid border-1 sm:w-[311px] sm:h-[128px] flex flex-col gap-[16px] xl:w-[528px] xl:flex-row">
              <button
                onClick={() => {
                  navigate(`/user/coursedetail/${params.Id}`);
                }}
                className="sm:w-[311px] sm:h-[56px] rounded-[12px] shadow-md border-solid border-[1px] border-Orange-500 text-Orange-500 xl:text-[16px] xl:font-[700] xl:w-[142px] xl:h-[60px]"
              >
                No, I don't
              </button>
              <button
                onClick={handlePostSubscribe}
                className="sm:w-[311px] sm:h-[56px] rounded-[12px] shadow-md border-solid border-[1px] bg-Blue-500 text-white xl:text-[16px] xl:font-[700] xl:w-[250px] xl:h-[60px]"
              >
                Yes, I want to subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
      <CustomSnackbar
        open={open}
        handleClose={handleClose}
        alert={alert}
      />
    </div>
  );
}

export default ModalCoursedetailmobile;
