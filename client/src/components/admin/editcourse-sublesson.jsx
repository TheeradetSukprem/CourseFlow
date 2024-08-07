import React, { useState, useEffect } from "react";
import axios from "axios";
import bin from "../../assets/image/Bin.png";
import edit from "../../assets/image/edit.png";
import drag from "../../assets/image/drag.png";
import { Link, useParams, useNavigate } from "react-router-dom";

function EditCourseSubLessonTable({ createCourse }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [subLesson, setSublesson] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const param = useParams();

  
  useEffect(() => {
      fetchSubLesson();
  }, []);

  const fetchSubLesson = async () => {
    console.log(param.id)
    try {
      const res = await axios.get(`http://localhost:4000/admin/sublessonlist/${param.id}`);
      setSublesson(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  //Delete lesson
  const deleteLesson = async (id,index) => {
    try {
      await axios.delete(`http://localhost:4000/admin/lesson/${id}`);
      setSublesson(subLesson.toSpliced(index,1))
    } catch (error) {
      console.error("Error deleting lesson:", error);
      console.log(error);
    }
  };

  //Delete course//
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    console.log(param.id);
    try {
      const res = await axios.get(`http://localhost:4000/courses/list/${param.id}`);
      setCourses(res.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const deleteCourse = async () => {
    console.log(param.id)
    try {
      await axios.delete(`http://localhost:4000/courses/${param.id}`);
      console.log("Course deleted successfully");
      navigate("/admin/courselist")
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const onDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (dropIndex) => {
    const updatedSubLesson = [...subLesson];
    const [draggedItem] = updatedSubLesson.splice(draggedItemIndex, 1);
    updatedSubLesson.splice(dropIndex, 0, draggedItem);
    setSublesson(updatedSubLesson);
    setDraggedItemIndex(null);
    console.log(updatedSubLesson)
    try{ await axios.put(`http://localhost:4000/admin/moduleorderlist/${param.id}`,updatedSubLesson)

    }catch {

    }fetchSubLesson()
  };

  const handleAddLessonClick = async (e) => {
    const courseid = await createCourse(e);
    console.log(courseid);
    navigate(`/admin/editcourse/${courseid}`);
  };

  return (
    <div className="m-10 w-[1120px] text-black">
      <div className="flex justify-between">
        <div className="text-lg justify-center">Lesson</div>
        <div className="justify-center">
          <button
            onClick={()=>navigate(`/admin/${param.id}/addsublesson`)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition w-[171px] h-[60px]"
          >
            +Add lesson
          </button>
        </div>
      </div>
      <div className="mt-10 w-[1120px] h-[41px]">
        <table className="table">
          <thead>
            <tr className="w-[1120px] h-[41px] bg-slate-200">
              <th className="w-[56px]"></th>
              <th className="w-[56px]"></th>
              <th className="w-[500px] text-left">Lesson name</th>
              <th className="w-[396px] text-left">Sub-lesson</th>
              <th className="w-[120px] text-left">Actions</th>
            </tr>
          </thead>
        </table>
        <div className="overflow-y-scroll max-h-[400px]">
          <table className="text-black text-sm rounded-xl w-full">
            <tbody>
              {subLesson.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-2"
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={onDragOver}
                  onDrop={() => onDrop(index)}
                >
                  <td className="w-[56px] h-[88px]"><img src={drag} alt="drag" /></td>
                  <td className="w-[56px]">{index + 1}</td>
                  <td className="w-[500px]">{item.modulename}</td>
                  <td className="w-[396px]">{item.count_sublesson}</td>
                  <td>
                    <button onClick={()=>deleteLesson(item.moduleid,index)}>
                      <img src={bin} alt="delete" />
                    </button>
                    
                    <button>
                      <Link to={`/admin/${param.id}/${item.moduleid}/editsublesson`}>
                        <img src={edit} alt="edit" />
                      </Link>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-12 flex flex-row justify-end"><button onClick={deleteCourse} className="text-blue-900 text-sm">Delete Course</button></div>
      </div>
    </div>
  );
}

export default EditCourseSubLessonTable;
