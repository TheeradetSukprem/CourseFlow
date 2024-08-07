import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import NavbarCourseList from "./navbar/navbar-courselist";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import ConfirmationModal from "../../components/admin/modal/delete-course-confirmation";

function CourseListTable() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const formatToBangkokTime = (isoTime) => {
    const date = new Date(isoTime);
    const bangkokTime = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const formattedTime = bangkokTime.toLocaleString("en-GB", options);

    const [datePart, timePart] = formattedTime.split(" ");
    const [day, month, year] = datePart.split("/");
    const [hour, minute] = timePart.split(":");

    return `${day}/${month}/${year.replace(",", "")} ${hour}:${minute}`;
  };

  useEffect(() => {
    fetchCourses();
    console.log(courses);
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:4000/courses");
      setCourses(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/courses/${id}`);
      setCourses(courses.filter((course) => course.courseid !== id));
      handleCloseModal(); // Close the modal after successful deletion
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleOpenModal = (id) => {
    setSelectedCourseId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCourseId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedCourseId) {
      deleteCourse(selectedCourseId);
    }
  };

  return (
    <div>
      <NavbarCourseList search={search} onSearchChange={setSearch} />
      <div className="m-10">
        <table className="text-black text-sm w-full">
          <thead className="w-[100px] h-[41px] bg-Gray-400 ">
            <tr className="font-thin ">
              <th className="text-left w-[48px] rounded-tl-lg"></th>
              <th className="text-left w-[96px]">Image</th>
              <th className="text-left w-[268px]">Course name</th>
              <th className="text-left w-[105px]">Lesson</th>
              <th className="text-left w-[105px]">Price</th>
              <th className="text-left w-[188px]">Created date</th>
              <th className="text-left w-[190px]">Updated Date</th>
              <th className="text-left rounded-tr-lg w-[120px]">Actions</th>
            </tr>
          </thead>
        </table>
        <div className="overflow-y-scroll max-h-[550px]">
          <table className="text-black text-sm rounded-xl w-full">
            <tbody>
              {courses
                .filter((item) => {
                  return search.trim() === ""
                    ? true
                    : item.coursename
                        .toLowerCase()
                        .includes(search.toLowerCase());
                })
                .map((item) => (
                  <tr
                    key={item.courseid}
                    className="bg-white border-b border-Gray-400 w-[1120px] h-[88px]"
                  >
                    <td className="w-[48px] text-center">{item.courseid}</td>
                    <td className="w-[96px]">
                      <img
                        src={item.imagefile}
                        alt="image"
                        style={{ width: "64px", height: "47px" }}
                      />
                    </td>
                    <td className="w-[268px] text-left">{item.coursename}</td>
                    <td className="w-[105px] text-left">
                      {item.coursesummary} Lessons
                    </td>
                    <td className="w-[105px] text-left">
                      {item.price.toFixed(2)}
                    </td>
                    <td className="w-[188px] text-left">
                      {formatToBangkokTime(item.createddate)}
                    </td>
                    <td className="w-[190px] text-left">
                      {formatToBangkokTime(item.updateddate)}
                    </td>
                    <td className="w-[120px] mt-8">
                      <button onClick={() => handleOpenModal(item.courseid)}>
                        <TrashIcon className="w-6 text-Blue-300 hover:text-Blue-700  text-left ml-4" />
                      </button>
                      <button>
                        <Link to={`/admin/editcourse/${item.courseid}`}>
                          <PencilSquareIcon className="w-6 text-Blue-300 hover:text-Blue-700 ml-4" />
                        </Link>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        text="Are you sure you want to delete this course"
        textname="Yes, I want to delete"
        open={openModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default CourseListTable;
