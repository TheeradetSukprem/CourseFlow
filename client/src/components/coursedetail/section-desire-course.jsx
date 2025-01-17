import othercourselesson1 from "../../assets/icons/coursedetail/othercourselesson1.png";
import othercourselesson2 from "../../assets/icons/coursedetail/othercourselesson2.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import emptyFolder from "../../assets/image/empty-folder.png";
import PendingSvg from "../shared/pending-svg";
import { useAuth } from "../../contexts/authentication";

function SectionDesireCourses() {
  const [desireCourse, setDesireCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = useAuth();

  console.log(desireCourse);

  const getDesirecourse = async () => {
    setLoading(true); // Start the spinner
    try {
      const result = await axios.get(
        `https://project-courseflow-server.vercel.app/courses/list/${userId.UserIdFromLocalStorage}/desire`
      );
      console.log(result);
      setDesireCourse(result.data);
    } finally {
      setLoading(false); // Stop the spinner
    }
  };
  useEffect(() => {
    getDesirecourse();
  }, []);

  return (
    <div className="text-black w-full">
      {/* Loading Section */}
      {loading && <PendingSvg text="Loading..." />}
      <div className="flex flex-col items-center xl:mt-[20px] xl:mb-[52px]">
        <h1 className="flex flex-col items-center justify-center w-full h-[118px] text-Headline3 font-Headline3 xl:text-Headline2 xl:font-Headline2">
          Desired Courses
        </h1>
      </div>
      <section className="flex items-center justify-center">
        {desireCourse.length > 0 ? (
          <div
            id="course"
            className=" mt-10 sm:w-full sm:h-auto sm:rounded-lg flex flex-wrap justify-center xl:w-[1119px] xl:flex xl:flex-wrap xl:justify-center xl:pb-[187px] xl:mx-auto "
          >
            {desireCourse.map((item, index) => (
              <Link
                to={`/user/desire/coursedetail/${item.courseid}`}
                key={index}
                className="sm:w-[343px] sm:flex sm:flex-col items-center mb-8 mx-4 xl:w-[30%] shadow-2xl xl:mt-[60px] rounded-xl xl:mb-5 transition-transform transform hover:scale-105 hover:shadow-2xl "
              >
                <img
                  src={item.imagefile}
                  className="w-[343px] h-[190px] sm:object-cover md:object-cover xl:object-cover rounded-lg "
                />
                <div className="sm:w-[343px] sm:h-[140px] sm:p-4 ">
                  <p className="sm:text-xs sm:font-medium text-Orange-500">
                    Course
                  </p>
                  <h1 className="sm:text-black sm:text-xl sm:font-normal">
                    {item.coursename}
                  </h1>
                  <p className="sm:text-black sm:text-sm font-normal">
                    {item.description.length > 85
                      ? item.description.substring(0, 85) + "..."
                      : item.description}
                  </p>
                </div>
                <div className="w-full sm:h-[53px] border-t-[1px] border-Gray-500 text-Gray-700 text-Body3 font-Body3  flex flex-row  p-4 gap-5 ">
                  <p className="flex flex-row gap-2">
                    <img src={othercourselesson1} alt="" className="w-[20px]" />
                    {item.coursesummary} Lessons
                  </p>
                  <p className="flex flex-row gap-2">
                    <img src={othercourselesson2} alt="" className="w-[20px]" />
                    {item.courselearningtime} Hours
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center w-[343px] h-auto md:ml-[13rem] lg:md:ml-[3rem]">
            <img src={emptyFolder} alt="No courses available" />
            <p className="text-black text-2xl">This page is empty.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default SectionDesireCourses;
