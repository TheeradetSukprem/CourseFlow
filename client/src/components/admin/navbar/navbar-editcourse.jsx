import React, { useState, useEffect } from "react";
import SubButton from "../button/sub-button";
import CancelButton from "../button/cancel-button";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import arrowback from "../../../assets/image/arrowback.png";

function NavbarEditCourse({ text, handleSubmit }) {
  const { id } = useParams();

  const [courseData, setCourseData] = useState({
    coursename: "",
  });

  const getCourseData = async () => {
    try {
      const result = await axios.get(`http://localhost:4000/courses/list/${id}`);
      // console.log(result.data.data[0]);
      setCourseData(result.data.data[0]);
    } catch (error) {
      "Error fetching courses:", error;
    }
  };

  useEffect(() => {
    getCourseData();
  }, []);

  return (
    <div className="w-full">
      <nav className="border-b-2 border-gray-300 md:p-4 bg-white text-base text-slate-800 flex flex-col md:flex-row md:justify-between items-center">
        <div className="flex items-center space-x-2 ml-8 mb-2 md:mb-0 flex-1">
          <span className="flex items-center">
            <img
              src={arrowback}
              className="inline-block mr-2"
            />
            <span>Course</span>
          </span>
          <p className="mb-0 font-bold">‘{courseData.coursename}’</p>
        </div>
        <div className="flex flex-col md:flex-row items-center space-x-2">
          <Link to="/admin/courselist">
            <CancelButton text="Cancel" />
          </Link>
          <Link>
            <SubButton text={text} onClick={handleSubmit} />
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default NavbarEditCourse;
