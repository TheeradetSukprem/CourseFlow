import SubButton from "../button/sub-button";
import CancelButton from "../button/cancel-button";
import { useNavigate, useParams } from "react-router-dom";
import vector from "../../../assets/icons/vector.png";
import axios from "axios";
import { useState, useEffect } from "react";
function NavbarEditSubLesson({ text, handleSubmit }) {
  const navigate = useNavigate();
  const params = useParams();
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState([]);
  const getLesson = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4000/admin/lesson/${params.lessonId}`
      );
      setLessons(result.data.data[0]);
    } catch (error) {
      console.error("Error getLesson", error);
    }
  };
  const getCourse = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4000/courses/${params.courseId}`
      );
      setCourse(result.data.data[0]);
    } catch (error) {
      console.error("Error getLesson", error);
    }
  };
  useEffect(() => {
    getLesson();
    getCourse();
  }, []);

  return (
    <div className="w-full ">
      <nav className="border-b-2 border-gray-300 bg-white flex flex-row justify-between p-4 pr-[32px]">
        <div className="flex flex-row items-center gap-[20px] pl-[40px]">
          <img className="w-[24px] h-[24px]" src={vector}></img>
          <div className="flex flex-col">
            <div className="flex flex-row gap-[8px]">
              <h1 className="text-Body3 font-Body3 text-Gray-600">Course</h1>
              <h1 className="text-Body3 font-Body3 text-black">
                ‘{course.coursename}’
              </h1>
              <h1 className="text-Body3 font-Body3 text-black ml-[-8px]">
                {lessons.modulename}
              </h1>
            </div>
            <div className="flex flex-row gap-2">
              <h1 className="text-Headline3 font-Headline3 text-Gray-600">
                Lesson
              </h1>
              <h1 className="text-[24px] font [400] text-black">
                ‘{lessons.modulename}’
              </h1>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-[16px]">
          <CancelButton
            text="Cancel"
            onClick={() => {
              navigate("/admin/addcourse");
            }}
          />
          <SubButton onClick={handleSubmit} text={text} />
        </div>
      </nav>
    </div>
  );
}

export default NavbarEditSubLesson;
