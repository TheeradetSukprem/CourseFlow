import React, { useState, useEffect } from "react";

function AddAssignmentForm() {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [subLessons, setSubLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState("");
  const [selectedSubLesson, setSelectedSubLesson] = useState("");
  const [assignmentDetail, setAssignmentDetail] = useState("");
  const [assignmentDuration, setAssignmentDuration] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // ดึงข้อมูลคอร์สจากระบบ
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    // ใช้ API หรือวิธีการดึงข้อมูลจากระบบ
    const fetchedCourses = ["Course 1", "Course 2", "Course 3"]; // ตัวอย่างข้อมูล
    setCourses(fetchedCourses);
  };

  const fetchLessons = async (course) => {
    // ใช้ API หรือวิธีการดึงข้อมูลจากระบบ
    const fetchedLessons = ["Lesson 1", "Lesson 2", "Lesson 3"]; // ตัวอย่างข้อมูล
    setLessons(fetchedLessons);
  };

  const fetchSubLessons = async (lesson) => {
    // ใช้ API หรือวิธีการดึงข้อมูลจากระบบ
    const fetchedSubLessons = ["Sub-lesson 1", "Sub-lesson 2", "Sub-lesson 3"]; // ตัวอย่างข้อมูล
    setSubLessons(fetchedSubLessons);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !selectedCourse ||
      !selectedLesson ||
      !selectedSubLesson ||
      !assignmentDetail ||
      !assignmentDuration
    ) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    // บันทึกข้อมูล
    const assignmentData = {
      course: selectedCourse,
      lesson: selectedLesson,
      subLesson: selectedSubLesson,
      detail: assignmentDetail,
      duration: assignmentDuration,
    };

    console.log("Assignment Data:", assignmentData);
    // ส่งข้อมูลไปยังระบบ
    setErrorMessage("");
  };

  return (
    <div className="bg-gray-100 w-full h-full flex items-center justify-center">
      <form
        action=""
        className="w-[1120px] h-[634px] my-10 mx-10 rounded-2xl border-2 bg-white text-black"
        onSubmit={handleSubmit}
      >
        <div
          id="input1"
          className="w-[440px] h-[76px] mt-10 ml-[100px] flex flex-col"
        >
          <label
            htmlFor="courseSelect"
            className="text-black text-base font-normal"
            style={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px" }}
          >
            Course
          </label>
          <div className="relative mt-1">
            <select
              className="block appearance-none w-full border text-muted-foreground py-2 px-[20px] pr-8 rounded-lg cursor-pointer"
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                fetchLessons(e.target.value);
              }}
              value={selectedCourse}
            >
              <option value="">Placeholder</option>
              {courses.map((course, index) => (
                <option key={index} value={course}>
                  {course}
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
              style={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px" }}
            >
              Lesson
            </label>
            <div className="relative mt-1">
              <select
                className="block appearance-none w-full border text-muted-foreground py-2 px-[20px] pr-8 rounded-lg cursor-pointer"
                onChange={(e) => {
                  setSelectedLesson(e.target.value);
                  fetchSubLessons(e.target.value);
                }}
                value={selectedLesson}
              >
                <option value="">Placeholder</option>
                {lessons.map((lesson, index) => (
                  <option key={index} value={lesson}>
                    {lesson}
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
              style={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px" }}
            >
              Sub-lesson
            </label>
            <div className="relative mt-1">
              <select
                className="block appearance-none w-full border text-muted-foreground py-2 px-[20px] pr-8 rounded-lg cursor-pointer"
                onChange={(e) => setSelectedSubLesson(e.target.value)}
                value={selectedSubLesson}
              >
                <option value="">Placeholder</option>
                {subLessons.map((subLesson, index) => (
                  <option key={index} value={subLesson}>
                    {subLesson}
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
        <div className="w-[920px] border-[1px] border-gray-400 mt-10 ml-[100px]">
          {" "}
        </div>

        <section id="assignment-detail" className="ml-[100px] ">
          <h1 className="font-semibold text-xl mt-10">Assignment detail</h1>
          <div className="mt-10">
            <p className="font-normal text-base">Assignment *</p>
            <input
              type="text"
              className="w-[920px] h-12 border-[1px] rounded-lg"
              onChange={(e) => setAssignmentDetail(e.target.value)}
              value={assignmentDetail}
              placeholder=" พิมพ์ไรหน่อยไหมสู"
            />
          </div>
          <div className="mt-10">
            <label
              htmlFor="durationSelect"
              className="text-black text-base font-normal"
              style={{ fontSize: "16px", fontWeight: 600, lineHeight: "24px" }}
            >
              Sub-Duration of assignment (day)
            </label>
            <div className="relative mt-1">
              <select
                className="block appearance-none w-[920px] border text-muted-foreground py-2 px-[20px] pr-8 rounded-lg cursor-pointer"
                onChange={(e) => setAssignmentDuration(e.target.value)}
                value={assignmentDuration}
              >
                <option value="">Placeholder</option>
                <option value="2">2 days</option>
                <option value="3">3 days</option>
                <option value="5">5 days</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-28 flex items-center px-2 text-muted-foreground">
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
        </section>
      </form>
    </div>
  );
}

export default AddAssignmentForm;