import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import clock from "/src/assets/icons/icon-clock.png";
import book from "/src/assets/icons/icon-homework.png";
import bgSm from "/src/assets/icons/bgcourse/assetsSM.png";
import bgXl from "/src/assets/icons/bgcourse/assetsXl.png";
import NavbarUser from "../homepage/navbar-user";
import Section4 from "../homepage/section4";
import Footer from "../homepage/footer.jsx";
import vector1 from "/src/assets/images/sm/section4/vector1.png";
import vector2 from "/src/assets/images/sm/section4/vector2.png";
import Ellipse1 from "/src/assets/icons/section4/xl/Ellipse1.png";
import Ellipse2 from "/src/assets/icons/section4/xl/Ellipse2.png";

function CourselistUser() {
  const [searchCourse, setSearchCourse] = useState("");
  const [course, setCourse] = useState([]);
  const navigate = useNavigate();

  const getCourseData = async () => {
    try {
      const result = await axios.get(`http://localhost:4000/courses`);
      console.log(result);
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

  const handleNavigate = () => {
    navigate("/courselistuser");
    window.scrollTo(0, 0); 
  };

  const gradientStyle = {
    background: "linear-gradient(270.94deg, #5697FF 7.78%, #2558DD 73.86%)",
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
      <NavbarUser className=" sticky top-0"/>
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
            className="bg-white sm:border sm:rounded-lg sm:px-4 sm:w-[343px] sm:h-12 text-black xl:w-[357px]"
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
            to={`/user/coursedetail/${course.courseid}`}
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

      <div
        className="sm:w-full sm:h-[500px] sm:flex sm:justify-center md:w-full md:h-[500px] xl:w-full xl:h-[500px]"
        style={gradientStyle}
      >
        <div className="sm:w-[343px] sm:h-[375px] sm:flex sm:justify-center md:w-full md:h-[500px] md:justify-start xl:w-full xl:h-[500px] xl:justify-start">
          <img
            src={Ellipse1}
            alt=""
            className="absolute sm:hidden md:block md:ml-[450px] md:mt-[403px] xl:block xl:ml-[567px] xl:mt-[403px]"
          />
          <img
            src={Ellipse2}
            alt=""
            className="absolute sm:hidden md:block md:right-0 md:mr-[51px] md:mt-[158px] xl:block xl:right-0 xl:mr-[51px] xl:mt-[158px]"
          />
          <div className="sm:mt-16 sm:w-[343px] sm:h-[114px] sm:flex sm:flex-col sm:text-center sm:mx-[16px] md:pl-[161px] md:pt-[125px] md:w-[453px] md:h-[149px] xl:pl-[161px] xl:pt-[125px] xl:w-[453px] xl:h-[149px]">
            <h1 className="sm:text-white sm:font-medium sm:text-2xl md:font-medium md:text-4xl md:w-[453px] xl:font-medium xl:text-4xl xl:w-[453px]">
              Want to start learning?
            </h1>
            <button
              onClick={handleNavigate}
              className="cursor-pointer sm:mt-[24px] sm:text-orange-500 sm:bg-white sm:mx-[51px] sm:py-[18px] sm:rounded-xl sm:border-orange-500 sm:border-[1px] sm:font-bold sm:text-4 md:w-[241px] md:h-[60px] xl:w-[241px] xl:h-[60px]"
            >
              <span className="mt-6">Check out our courses</span>
            </button>
          </div>
        </div>
        <img
          src={vector1}
          alt=""
          className="absolute sm:pt-[190px] md:hidden xl:hidden"
        />
        <img
          src={vector2}
          alt=""
          className="sm:hidden md:block md:w-[500px] md:h-[350px] md:mr-[159px] md:mt-[153px] xl:block xl:w-[592px] xl:h-[448.59px] xl:mr-[159px] xl:mt-[53px]"
        />
      </div>
      <Footer/>
    </>
  );
}

export default CourselistUser;
