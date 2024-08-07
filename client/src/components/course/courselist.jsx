import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import clock from "/src/assets/icons/icon-clock.png";
import book from "/src/assets/icons/icon-homework.png";
import bgSm from "/src/assets/icons/bgcourse/assetsSM.png";
import bgXl from "/src/assets/icons/bgcourse/assetsXl.png";
import NavbarUser from "../homepage/navbar-user";
import Navbarnonuser from "../homepage/navbar-nonuser";

function Course() {
  const [searchCourse, setSearchCourse] = useState("");
  const [course, setCourse] = useState([]);

  const getCourseData = async () => {
    try {
      const result = await axios.get(`http://localhost:4000/courses`);
      setCourse(result.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    getCourseData();
  }, []);

  const handleChange = (event) => {
    setSearchCourse(event.target.value);
  };

  const filteredCourses = useMemo(
    () =>
      course.filter(
        (course) =>
          course.coursename
            .toLowerCase()
            .includes(searchCourse.toLowerCase()) ||
          course.description.toLowerCase().includes(searchCourse.toLowerCase())
      ),
    [searchCourse, course]
  );

  return (
    <>
      <section
        id="search"
        className="sm:w-full sm:h-[198px] xl:flex xl:flex-col"
      >
        <img
          src={bgXl}
          alt=""
          className="z-0 absolute sm:hidden md:block md:w-auto md:mt-10 xl:w-full"
        />
        <img
          src={bgSm}
          alt=""
          className="z-0 absolute sm:w-full sm:h-[157px] sm:mt-10 md:hidden"
        />
        <h1 className="text-black sm:text-2xl sm:font-medium sm:text-center sm:pt-10 z-10">
          Our Courses
        </h1>
        <div className="sm:mt-8 sm:flex sm:justify-center z-20">
          <input
            type="text"
            className="sm:border sm:rounded-lg sm:px-4 sm:w-[343px] sm:h-12 text-black xl:w-[500px] "
            value={searchCourse}
            onChange={handleChange}
            placeholder="Search courses..."
          />
        </div>
      </section>

      <section
        id="course"
        className=" mt-10 sm:w-full sm:h-auto sm:rounded-lg flex flex-wrap justify-center xl:w-[1119px] xl:flex xl:flex-wrap xl:justify-center xl:pb-[187px] xl:mx-auto "
      >
        {filteredCourses.map((course) => (
          <Link
            key={course.courseid}
            to={`/coursedetail/${course.courseid}`}
            className="sm:w-[343px] sm:flex sm:flex-col items-center mb-8 mx-4 xl:w-[30%] shadow-2xl xl:mt-[60px] rounded-xl xl:mb-5 transition-transform transform hover:scale-105 hover:shadow-2xl "
          >
            <img
              src={course.imagefile}
              alt={course.coursename}
              className="w-[343px] h-[190px] sm:object-cover md:object-cover xl:object-cover rounded-lg "
            />
            <div className="sm:w-[343px] sm:h-[140px] sm:p-4 ">
              <p className="sm:text-xs sm:font-medium text-Orange-500">
                Course
              </p>
              <h1 className="sm:text-black sm:text-xl sm:font-normal">
                {course.coursename}
              </h1>
              <p className="sm:text-black sm:text-sm font-normal">
                {course.description}
              </p>
            </div>
            <div className="w-full sm:h-[53px] border-t-[1px] border-Gray-500 text-Gray-700 text-Body3 font-Body3  flex flex-row  p-4 gap-5 ">
              <p className="flex flex-row gap-2">
                <img src={book} alt="" className="w-[20px]" />
                {course.coursesummary} Lessons
              </p>
              <p className="flex flex-row gap-2">
                <img src={clock} alt="" className="w-[20px]" />
                {course.courselearningtime} Hours
              </p>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}

export default Course;
