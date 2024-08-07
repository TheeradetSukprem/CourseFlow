import { BookOpenIcon, ClockIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useNavigate } from "react-router-dom";

function CourseCard(props) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/user/subscribe/coursedetail/${props.courseid}`);
  };

  return (
    <>
      <div className="z-0 cursor-pointer" onClick={handleCardClick}>
        <div className="flex flex-col gap-7 shadow-xl rounded-xl transition-transform transform hover:scale-105 hover:shadow-2xl">
          <div className="bg-white pb-3 rounded-lg w-[357px]">
            <div className="text-black font-medium">
              <img
                className="object-cover w-[357px] h-[240px] border rounded-t-lg"
                src={props.photo}
                alt={props.coursename}
              />
              <p className="text-yellow-500 text-Body4 pt-3 px-4">Course</p>
              <p className="text-[20px] px-4">{props.coursename}</p>
              <p className="text-Gray-700 text-Body3 pt-2 pb-5 px-4 max-w-[330px]">
                {props.description}
              </p>
            </div>
            <div className="text-Gray-700 text-Body3 pt-4 px-4 border-t border-Gray-400 flex gap-2">
              <BookOpenIcon className="h-5 w-5 text-Blue-400" />
              {`${props.coursesummary} Lesson`}
              <ClockIcon className="h-5 w-5 text-Blue-400" />
              <span>{`${props.courselearningtime} Hours`}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseCard;
