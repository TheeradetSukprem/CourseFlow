import SubButton from "../button/sub-button";
import CancelButton from "../button/cancel-button";
import { useNavigate, useParams } from "react-router-dom";
import vector from "../../../assets/icons/vector.png";
import axios from "axios";
import { useState, useEffect } from "react";

function NavbarAddSubLesson({ text, handleSubmit }) {
  const navigate = useNavigate();
  const params = useParams();
  const [course, setCourse] = useState([]);
  const getCourse = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4000/courses/list/${params.courseId}`
      );
      setCourse(result.data.data[0]);
    } catch (error) {
      console.error("Error getLesson", error);
    }
  };
  useEffect(() => {
    getCourse();
  }, []);
  return (
    <div>
      <nav className="w-full h-[92px] bg-white border-gray-300 border-b-2 border-[1px] flex justify-between items-center p-4 pr-[32px]">
        <div className="flex flex-row items-center gap-[20px] pl-[40px]">
          <img className="w-[24px] h-[24px]" src={vector}></img>
          <div className="flex flex-col">
            <div className="flex flex-row gap-[8px]">
              <h1 className="text-Body3 font-Body3 text-Gray-600">Course</h1>
              <p className="text-Body3 font-Body3 text-black">
                ‘{course.coursename}’
              </p>
            </div>
            <h1 className="text-Headline3 font-Headline3 text-black">
              Add Lesson
            </h1>
          </div>
        </div>
        <div className="flex flex-row items-center gap-[16px]">
          <CancelButton
            onClick={() => {
              navigate("/admin/courselist");
            }}
            text="Cancel"
          />
          <SubButton onClick={handleSubmit} text={text} />
        </div>
      </nav>
    </div>
  );
}

export default NavbarAddSubLesson;
