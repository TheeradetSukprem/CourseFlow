import othercourselesson1 from "../../assets/icons/coursedetail/othercourselesson1.png";
import othercourselesson2 from "../../assets/icons/coursedetail/othercourselesson2.png";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SectionDesireCourses() {
  const navigate = useNavigate();
  const [desireCourse, setDesireCourse] = useState([]);
  
  const getDesirecourse = async () => {
    const result = await axios.get(`http://localhost:4000/courses/desire`);
    console.log(result)
    setDesireCourse(result.data);
  };

  useEffect(() => {
    getDesirecourse();
  }, []);

  return (
    <div className="text-black w-full">
      <div className="flex flex-col items-center xl:mt-[20px] xl:mb-[52px]">
        <h1 className="flex flex-col items-center justify-center w-full h-[118px] text-Headline3 font-Headline3 xl:text-Headline2 xl:font-Headline2">
          Desired Courses
        </h1>
      </div>
      <main className="flex flex-col items-center">
        <section className="flex flex-row items-center justify-center gap-[32px] sm:mb-[50px] xl:flex-row xl:w-[1440px] flex-wrap p-[16px] ">
          {desireCourse.map((item, index) => {
            return (
              <article
                  key={index}
                  className="shadow-md rounded-[8px] flex flex-col justify-between mb-10 xl:h-[475px]"
                >
                  <button
                    onClick={() => {
                      navigate(`/user/desire/coursedetail/${item.courseid}`);
                    }}
                  >
                    <img
                      className="w-[343px] h-[240px] rounded-t-[8px]"
                      src={item.imagefile}
                    ></img>
                  </button>
                  <div className="flex flex-col pl-[16px] mt-[15px] mb-[10px] sm:w-[343px] xl:mt-[20px]">
                    <h1 className="text-Body4 font-Body4 text-Orange-500 xl:text-Body3 xl:font-Body3 xl:mb-[10px]">
                      Course
                    </h1>
                    <h1 className="text-Body1 font-Body1 text-black xl:text-Headline3 xl:font-Headline3">
                      {item.coursename}
                    </h1>
                    <p className="text-Body3 font-Body3 text-Gray-700 xl:text-Body2 xl:font-Body2 xl:mt-[10px]">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex flex-row border-t-[1px] border-t-Gray-500 h-[53px] p-[16px] mt-[30px]">
                    <div className="flex w-[88px] gap-2">
                      <img
                        className="w-[20px] h-[20px]"
                        src={othercourselesson1}
                      ></img>
                      <h1 className="text-Body3 font-Body3 text-Gray-700">
                        {item.coursesummary} Lesson
                      </h1>
                    </div>
                    <div className="flex ml-[20px] w-[88px] gap-2">
                      <img
                        className="w-[20px] h-[20px]"
                        src={othercourselesson2}
                      ></img>
                      <h1 className="text-Body3 font-Body3 text-Gray-700">
                        {item.courselearningtime} Hours
                      </h1>
                    </div>
                  </div>
                </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export default SectionDesireCourses;
