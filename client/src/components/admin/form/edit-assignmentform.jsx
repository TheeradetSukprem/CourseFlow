import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import CancelButton from "../button/cancel-button";
import SubButton from "../button/sub-button";
import ConfirmationModal from "../modal/delete-course-confirmation";
import arrowback from "../../../assets/image/arrowback.png";
import PendingSvg from "../../shared/pending-svg";
import CustomSnackbar from "../../shared/custom-snackbar";
import LoadingPageSvg from "../../shared/loading-page.jsx";

function EditAssignmentForm() {
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState({});
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [subLessons, setSubLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedSubLesson, setSelectedSubLesson] = useState("");
  const [assignmentDetail, setAssignmentDetail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [alert, setAlert] = useState({ message: "", severity: "" }); 
  const [open, setOpen] = useState(false); 

  const { id } = useParams();

  const fetchAssignment = async () => {
    setLoading(true);
    try {
      const result = await axios.get(
        `https://project-courseflow-server.vercel.app/admin/assignments/${id}`
      );
      const assignmentData = result.data.data;
      setAssignment(assignmentData);
      setSelectedCourse(assignmentData.courseid);
      setSelectedLesson(assignmentData.moduleid);
      setSelectedSubLesson(assignmentData.sublessonid);
      setAssignmentDetail(assignmentData.title);
    } catch (error) {
      console.error("Error fetching assignment:", error);
      setErrorMessage("Failed to fetch assignment details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const result = await axios.get(
        `https://project-courseflow-server.vercel.app/courses`
      );
      setCourses(result.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchLessons = async () => {
    try {
      const result = await axios.get(
        `https://project-courseflow-server.vercel.app/admin/lesson`
      );
      console.log(result);
      setLessons(result.data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const fetchSubLessons = async (moduleid) => {
    try {
      const result = await axios.get(
        `https://project-courseflow-server.vercel.app/admin/sublesson`,
        {
          params: { moduleid },
        }
      );
      setSubLessons(result.data);
    } catch (error) {
      console.error("Error fetching sublessons:", error);
    }
  };

  useEffect(() => {
    if (selectedLesson) {
      fetchSubLessons(selectedLesson);
    } else {
      setSubLessons([]);
    }
  }, [selectedLesson]);

  useEffect(() => {
    fetchCourses();
    fetchLessons();
    fetchAssignment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const updatedAssignment = {
            course: selectedCourse,
            lesson: selectedLesson,
            sub_lesson: selectedSubLesson,
            title: assignmentDetail,
        };

        console.log("Payload:", updatedAssignment);

        const response = await axios.put(
            `https://project-courseflow-server.vercel.app/admin/assignments/${id}`,
            updatedAssignment
        );

        if (response.status === 200) {
            setAlert({ message: "Edit Assignments successfully", severity: "success" });
            setOpen(true);
            setTimeout(() => {
                navigate("/admin/assignmentlist");
            }, 3000);
        } else {
            setErrorMessage("Unexpected response status");
            setAlert({ message: "Error editing assignment", severity: "error" });
            setOpen(true);
        }
    } catch (error) {
        console.error("Error updating assignment:", error);
        setErrorMessage("Failed to update assignment.");
        setAlert({ message: "Error updating assignment", severity: "error" });
        setOpen(true);
    } finally {
        setLoading(false);
    }
};

  const filteredLessons = lessons.filter(
    (lesson) => lesson.courseid === parseInt(selectedCourse)
  );
  const filterSubLessons = subLessons.filter(
    (subLesson) => subLesson.moduleid === parseInt(selectedLesson)
  );

  const deleteAssignment = async (id) => {
    try {
      await axios.delete(
        `https://project-courseflow-server.vercel.app/admin/assignments/${id}`
      );
      setAlert({
        message: "Assignment deleted successfully!",
        severity: "success",
      });
      setOpen(true);
      setTimeout(() => {
        navigate("/admin/assignmentlist");
      }, 3000);
      setOpenModal(false);
    } catch (error) {
      console.error("Error deleting assignment:", error);
      setAlert({
        message: "Failed to delete assignment. Please try again.",
        severity: "error",
      });
      setOpen(true);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmDelete = () => {
    if (id) {
      deleteAssignment(id);
    }
  };

  return (
    <>
     {loading && <PendingSvg text="Edit Assignment..." />}
      <div className="w-full">
        <nav className="order-b-2 py-2 border-gray-300 bg-white text-base text-slate-800 flex flex-row justify-center items-center">
          <div className="flex items-center space-x-2 ml-8 mb-2 md:mb-0 flex-1 ">
            <span className="flex items-center">
              <Link to="/admin/assignmentlist">
                <img src={arrowback} className="inline-block mr-2" />
              </Link>
              Edit Assignment:
            </span>
            <p className="mb-0 font-bold">{assignmentDetail}</p>
          </div>
          <div className="flex gap-4 pr-10 mr-[5rem]">
            <Link to="/admin/assignmentlist">
              <CancelButton text="Cancel" />
            </Link>
            <SubButton text="Update" onClick={handleSubmit} />
          </div>
        </nav>

        <form
          className="w-[1120px] h-[634px] my-10 mx-10 rounded-2xl border-2 bg-white text-black"
          onSubmit={handleSubmit}
        >
          <div className="w-[440px] h-[76px] mt-10 ml-[100px] flex flex-col">
            <label
              htmlFor="courseSelect"
              className="text-black text-base font-normal"
              style={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px" }}
            >
              Course
            </label>
            <div className="relative mt-1">
              <select
                id="courseSelect"
                className="block appearance-none w-full border text-muted-foreground py-2 px-[20px] pr-8 rounded-lg cursor-pointer"
                onChange={(e) => {
                  setSelectedCourse(e.target.value);
                  setSelectedLesson("");
                  setSelectedSubLesson("");
                }}
                value={selectedCourse}
              >
                <option value="">Select Course Name</option>
                {courses.map((course) => (
                  <option key={course.courseid} value={course.courseid}>
                    {course.coursename}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-muted-foreground">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="w-[920px] flex flex-row gap-10 mt-10 ml-[100px]">
            <div className="w-[440px]">
              <label
                htmlFor="lessonSelect"
                className="text-black text-base font-normal"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "24px",
                }}
              >
                Lesson
              </label>
              <div className="relative mt-1">
                <select
                  id="lessonSelect"
                  className="block appearance-none w-full border text-muted-foreground py-2 px-[20px] pr-8 rounded-lg cursor-pointer"
                  onChange={(e) => setSelectedLesson(e.target.value)}
                  value={selectedLesson}
                >
                  <option value="">Select Lesson</option>
                  {filteredLessons.map((lesson) => (
                    <option key={lesson.moduleid} value={lesson.moduleid}>
                      {lesson.modulename}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-muted-foreground">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="w-[440px]">
              <label
                htmlFor="subLessonSelect"
                className="text-black text-base font-normal"
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  lineHeight: "24px",
                }}
              >
                Sub-Lesson
              </label>
              <div className="relative mt-1">
                <select
                  id="subLessonSelect"
                  className="block appearance-none w-full border text-muted-foreground py-2 px-[20px] pr-8 rounded-lg cursor-pointer"
                  onChange={(e) => setSelectedSubLesson(e.target.value)}
                  value={selectedSubLesson}
                >
                  <option value="">Select Sub-Lesson</option>
                  {filterSubLessons.map((subLesson) => (
                    <option
                      key={subLesson.sublessonid}
                      value={subLesson.sublessonid}
                    >
                      {subLesson.sublessonname}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-muted-foreground">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[920px] border-[1px] border-gray-400 mt-10 ml-[100px]" />

          <section id="assignment-detail" className="ml-[100px] ">
            <h1 className="font-semibold text-xl mt-10">Assignment Detail</h1>
            <div className="mt-10">
              <p className="font-normal text-base">Assignment *</p>
              <input
                type="text"
                className="w-[920px] h-12 border-[1px] rounded-lg pl-3"
                onChange={(e) => setAssignmentDetail(e.target.value)}
                value={assignmentDetail}
                placeholder="Enter assignment detail"
              />
            </div>
          </section>
        </form>
        <div className="rounded-2xl px-2 py-1 ml-[1010px]">
          <button
            className="text-blue-500 font-bold text-base"
            onClick={handleOpenModal}
          >
            Delete Assignment
          </button>
        </div>
        <ConfirmationModal
          text="Are you sure you want to delete this assignment ?"
          textname="Yes, I want to delete"
          open={openModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      </div>
      <CustomSnackbar open={open} alert={alert} onClose={() => setOpen(false)} />
    </>
  );
}

export default EditAssignmentForm;
