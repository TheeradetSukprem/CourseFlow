import React, { useState, useEffect } from "react";
import axios from "axios";
import bin from "../../assets/image/Bin.png";
import edit from "../../assets/image/edit.png";
import drag from "../../assets/image/drag.png";
import { Link, useParams, useNavigate } from "react-router-dom";

function AddCourseSubLessonTable({ createCourse }) {
  const navigate = useNavigate();
  const [subLesson, setSublesson] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const param = useParams();
  
  useEffect(() => {
    const savedOrder = localStorage.getItem('subLessonOrder');
    if (savedOrder) {
      setSublesson(JSON.parse(savedOrder));
    } else {
      fetchSubLesson();
    }
  }, []);

  const fetchSubLesson = async () => {
    try {
      const res = await axios.get("http://localhost:4000/admin/sublessonlist");
      setSublesson(res.data);
      localStorage.setItem('subLessonOrder', JSON.stringify(res.data));
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  /*const deleteLesson = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/admin/lesson/${id}`);
      const updatedSubLesson = subLesson.filter((lesson) => lesson.moduleid !== id);
      setSublesson(updatedSubLesson);
      localStorage.setItem('subLessonOrder', JSON.stringify(updatedSubLesson));
    } catch (error) {
      console.error("Error deleting lesson:", error);
      console.log(error);
    }
  };*/

  const onDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (dropIndex) => {
    const updatedSubLesson = [...subLesson];
    const [draggedItem] = updatedSubLesson.splice(draggedItemIndex, 1);
    updatedSubLesson.splice(dropIndex, 0, draggedItem);
    setSublesson(updatedSubLesson);
    setDraggedItemIndex(null);
    localStorage.setItem('subLessonOrder', JSON.stringify(updatedSubLesson));
  };

  const handleAddLessonClick = async (e) => {
    const courseid = await createCourse(e);
    console.log(courseid);
    if(typeof courseid === "number"){navigate(`/admin/editcourse/${courseid}`);}
  };

  return (
    <div className="m-10 w-[1120px] text-black">
      <div className="flex justify-between">
        <div className="text-lg justify-center">Lesson</div>
        <div className="justify-center">
          <button
            onClick={handleAddLessonClick}
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
        <div className="overflow-y-scroll max-h-[0px]">
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
                  <td className="w-[56px] h-[88px]">{/*<img src={drag} alt="drag" />*/}</td>
                  <td className="w-[56px]">{/*index + 1*/}</td>
                  <td className="w-[500px]">{/*item.modulename*/}</td>
                  <td className="w-[396px]">{/*item.count_sublesson*/}</td>
                  <td>
                    {/*<button onClick={() => deleteLesson(item.moduleid)}>
                      <img src={bin} alt="delete" />
                    </button>
                    <button>
                      <Link to={`/admin/${param.id}/${item.moduleid}/editsublesson`}>
                        <img src={edit} alt="edit" />
                      </Link>
                    </button>*/}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AddCourseSubLessonTable;
