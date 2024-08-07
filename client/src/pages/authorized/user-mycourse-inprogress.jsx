import React, { useEffect, useState } from "react";
import Buttons from "../../components/mycourses/buttons";
import CourseCard from "../../components/mycourses/course-card";
import UserProfileCard from "../../components/mycourses/user-profile-card";
import NavbarUser from "../../components/homepage/navbar-user";
import Footer from "../../components/homepage/footer";
import axios from "axios";
import { useAuth } from "../../contexts/authentication";
import emptyFolder from "../../assets/image/empty-folder.png";

function UserMycourseInprogress() {
  const userId = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  //=============Get user inprogress courses
  const getInprogressCourses = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4000/courses/user/${userId.UserIdFromLocalStorage}/inprogress`
      );
      console.log(result.data);
      setCourses(result.data);
    } catch (error) {
      console.error("Error Fetching", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getInprogressCourses();
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <nav className="sticky top-0 bg-white z-10 lg:block">
        <NavbarUser />
      </nav>

      {/* User profile card for lg up */}
      <div className="lg:flex">
        <div className="hidden lg:block lg:sticky lg:top-[22rem] lg:left-[15rem] lg:self-start lg:w-[200px]">
          <UserProfileCard />
        </div>

        <div className="flex-grow">
          <div className="mt-[5rem] mb-4 lg:mb-0 lg:ml-[-4rem] z-20 flex flex-col justify-center items-center">
            <p className="text-black text-Headline2 mb-9 font-medium bg-white p-2">
              My Courses
            </p>
            <Buttons />
          </div>

          <div className="mx-auto py-2 lg:ml-[27rem]">
            {courses.length > 0 ? (
              <div className="flex flex-wrap gap-4 lg:max-w-[740px] justify-center lg:justify-start">
                {courses.map((course) => (
                  <CourseCard
                    key={course.courseid}
                    courseid={course.courseid}
                    photo={course.imagefile}
                    coursename={course.coursename}
                    description={course.description}
                    coursesummary={course.coursesummary}
                    courselearningtime={course.courselearningtime}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center w-[343px] h-auto md:ml-[13rem] lg:md:ml-[3rem]">
                <img src={emptyFolder} alt="No courses available" />
                <p className="text-black text-2xl">This page is empty.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User profile card for sm */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-10 bg-white">
        <UserProfileCard />
      </div>

      <div className="lg:mb-[0rem] mb-[8rem] mt-[8rem]">
        <Footer />
      </div>

      {/* SVG section for bg */}
      <div className="absolute top-[13rem] right-[5rem] md:top-[8rem] ">
        <svg
          width="32"
          height="30"
          viewBox="0 0 32 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.35814 5.90994L29.1499 1.97744L19.6597 26.28L3.35814 5.90994Z"
            stroke="#FBAA1C"
            strokeWidth="3"
          />
        </svg>
      </div>
      <div className="absolute top-[9rem] left-[5rem]">
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="5.5" cy="5.5" r="4" stroke="#2F5FAC" strokeWidth="3" />
        </svg>
      </div>
      <div className="absolute top-[12rem] left-[-0.8rem] md:left-8">
        <svg
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="13.1741" cy="13.1741" r="13.1741" fill="#C6DCFF" />
        </svg>
      </div>
      <div className="absolute top-[-10rem] md:right-0 md:top-[12rem] ">
        <svg
          width="53"
          height="74"
          viewBox="0 0 53 74"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="37" cy="37" r="37" fill="#C6DCFF" />
        </svg>
      </div>
      <div className="absolute top-[-10rem] md:left-[23rem] md:top-[12rem] -z-10">
        <svg
          width="23"
          height="23"
          viewBox="0 0 23 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.843 1.99998L8.83754 20.6805"
            stroke="#2FAC61"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M2.00035 8.83751L20.6809 13.8429"
            stroke="#2FAC61"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {/* SVG section for bg */}
    </>
  );
}

export default UserMycourseInprogress;
