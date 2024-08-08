import { Routes, Route, Navigate } from "react-router-dom";
import Userhomepage from "./authorized/user-homepage";
import Usercourse from "./authorized/user-course";
import UserMycourse from "./authorized/user-mycourse";
import Modal from "../components/coursedetail/modalcoursedetail-mobile";
import SubscribeCourse from "./authorized/user-subscribe";
import UserDesireCoursedetail from "./authorized/user-desirecoursedetail";
import StartLearning from "./authorized/user-courselearning";
import UserCoursedetail from "./authorized/user-coursedetail";
import UserProfile from "./authorized/user-profile";
import UserDesireCourses from "./authorized/user-desirecourse";
import Course from "../components/course/courselist";
import CourselistUser from "../components/course/courselist-user";
import UserMycourseCompleted from "./authorized/user-mycourse-completed";
import UserMycourseInprogress from "./authorized/user-mycourse-inprogress";
import UserMyHomework from "./authorized/user-myhomework";
import CourseListAdmin from "./admin/courselist";
import AddCourseAdmin from "./admin/addcourse-admin";
import EditCourse from "./admin/editcourse";
import AddSubLesson from "./admin/add-sublesson";
import EditSubLesson from "./admin/edit-sublesson";
import AddAssignment from "./admin/add-assignment";
import AssignmentListAdmin from "./admin/assignmentlist";
import EditAssignmentdetail from "./admin/editassignmentdetail";

function AuthenticatedApp() {
  // Retrieve userData from localStorage
  const userDataString = localStorage.getItem("userData");

  // Determine role based on userData in localStorage
  const role = userDataString ? JSON.parse(userDataString).role : null;

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Userhomepage />} />
        <Route path="/courselist" element={<Course />} />
        <Route path="/courselistuser" element={<CourselistUser />} />
        <Route path="/user/coursedetail/:Id" element={<UserCoursedetail />} />
        <Route
          path="/user/subscribe/coursedetail/:Id"
          element={<SubscribeCourse />}
        />
        <Route
          path="/user/desire/coursedetail/:Id"
          element={<UserDesireCoursedetail />}
        />
        <Route path="/user/desire" element={<UserDesireCourses />} />
        <Route
          path="/users/startlearning/:courseid"
          element={<StartLearning />}
        />
        <Route path="/modal/:Id" element={<Modal />} />
        <Route path="/userhomepage" element={<Userhomepage />} />
        <Route path="/usercourse" element={<Usercourse />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/my_course" element={<UserMycourse />} />
        <Route
          path="/user/my_course/inprogress"
          element={<UserMycourseInprogress />}
        />
        <Route
          path="/user/my_course/completed"
          element={<UserMycourseCompleted />}
        />
        <Route path="/user/homework" element={<UserMyHomework />} />
        <Route path="*" element={<Userhomepage />} />

        {/* Admin Routes - Only if authenticated and role is Admin */}
        {role === "Admin" && (
          <>
            <Route path="/admin/courselist" element={<CourseListAdmin />} />
            <Route path="/admin/addcourse" element={<AddCourseAdmin />} />
            <Route path="/admin/editcourse/:id" element={<EditCourse />} />
            <Route
              path="/admin/:courseId/addsublesson"
              element={<AddSubLesson />}
            />
            <Route
              path="/admin/:courseId/:lessonId/editsublesson"
              element={<EditSubLesson />}
            />
            <Route path="/admin/addassignment" element={<AddAssignment />} />
            <Route
              path="/admin/editassignment/:id"
              element={<EditAssignmentdetail />}
            />
            <Route
              path="/admin/assignmentlist"
              element={<AssignmentListAdmin />}
            />
          </>
        )}
      </Routes>
    </div>
  );
}

export default AuthenticatedApp;
