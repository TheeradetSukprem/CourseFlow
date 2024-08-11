import React, { useState, useEffect } from "react";
import arrow_drop from "../../assets/icons/coursedetail/arrow_drop.png";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/authentication";
import axios from "axios";
import CustomSnackbar from "../shared/custom-snackbar";

function StickybarCoursedetail() {
  const navigate = useNavigate();
  const params = useParams();
  const userId = useAuth();
  const [coursedetail, setCoursedetail] = useState([]);
  const [isCoursevisible, setIsCourseVisible] = useState(false);
  const [desireCourse, setDesireCourse] = useState([]);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [open, setOpen] = useState(false);

  const toggleCourse = () => {
    setIsCourseVisible(!isCoursevisible);
  };

  useEffect(() => {
    const getCourses = async () => {
      const result = await axios.get(
        `https://project-courseflow-server.vercel.app/courses/${params.Id}`
      );
      setCoursedetail(result.data.data);
    };
    const getDesirecourse = async () => {
      const result = await axios.get(
        `https://project-courseflow-server.vercel.app/courses/desire`
      );
      setDesireCourse(result.data);
    };
    getCourses();
    getDesirecourse();
  }, []);

  const postDesireCourse = async () => {
    await axios.post(
      `https://project-courseflow-server.vercel.app/courses/${userId.UserIdFromLocalStorage}/${params.Id}/desire`
    ),
      {};
    navigate(`/user/desire/coursedetail/${params.Id}`);
  };
  const handlePostDesire = (event) => {
    event.preventDefault();
    if (!userId.UserIdFromLocalStorage) {
      navigate("/login");
    }
    const desireCourseIds = desireCourse.map((course) => course.courseid);
    const uniqueDesireCourseIds = [...new Set(desireCourseIds)];
    if (uniqueDesireCourseIds.includes(Number(params.Id))) {
      setAlert({
        message: "You have already get in desire course.",
        severity: "error",
      });
      setOpen(true);
    } else {
      postDesireCourse();
    }
  };
  
  const truncateText = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    const truncated = words.slice(0, wordLimit).join(" ");
    return truncated + "...";
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <div>
      <footer className="bg-white flex items-center justify-center shadow-md h-fit sticky bottom-0 xl:hidden">
        <div className="flex flex-col items-center w-[100%] gap-[8px] p-[16px]">
          <div className="w-[343px] flex flex-col sm:w-[100%] justify-between gap-3 pb-[8px] pt-[8px]">
            <h1
              className={`${
                isCoursevisible ? "block" : "hidden"
              } text-[12px] font-[400] text-Orange-500`}
            >
              Course
            </h1>
            <div>
              <div>
                <div className="flex flex-row justify-between">
                  <div>
                    <span className="text-black text-Body2 font-Body2">
                      {coursedetail.length > 0 && coursedetail[0].coursename}
                    </span>
                  </div>
                  <button onClick={toggleCourse}>
                    <img className="w-[24px] h-[24px]" src={arrow_drop}></img>
                  </button>
                </div>

                <p
                  className={`${
                    isCoursevisible ? "block" : "hidden"
                  } pt-[8px] text-Gray-700 text-Body4 font-Body4`}
                >
                  {coursedetail.length > 0 &&
                    truncateText(coursedetail[0].description, 6)}
                </p>
              </div>
            </div>
            <div className="text-Gray-700 text-Body2 font-Body2">
              THB {coursedetail.length > 0 && coursedetail[0].price}.00
            </div>
            <div className="flex flex-row gap-[8px]">
              <button
                onClick={handlePostDesire}
                className="border-solid border-[1px] border-Orange-500 rounded-[12px] text-[12px] font-[700] text-Orange-500 sm:w-[180px] sm:h-[34px]"
              >
                Get in Desire course
              </button>
              <button
                onClick={() => {
                  navigate(`/modal/${params.Id}`);
                }}
                className="border-solid border-[1px] bg-Blue-500 rounded-[12px] text-[12px] font-[700] text-white sm:w-[155px] sm:h-[34px]"
              >
                Subscribe This Course
              </button>
            </div>
          </div>
        </div>
      </footer>
      <CustomSnackbar
        open={open}
        handleClose={handleClose}
        alert={alert}
      />
    </div>
  );
}

export default StickybarCoursedetail;
