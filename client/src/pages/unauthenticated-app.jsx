import { Routes, Route } from "react-router-dom";
import Login from "./non-authorized/loginpage";
import Coursedetail from "./non-authorized/coursedetail";
import HomePage from "./non-authorized/homepage";
import Register from "./non-authorized/registerpage";
import Course from "./non-authorized/course";
import NotFoundPage from "./notfoundpage";
import LoginAdmin from "./admin/login-admin";
import CourseListAdmin from "./admin/courselist";
import AddCourseAdmin from "./admin/addcourse-admin";
import EditCourse from "./admin/editcourse";
import AddSubLesson from "./admin/add-sublesson";
import EditSubLesson from "./admin/edit-sublesson";
import AddAssignment from "./admin/add-assignment";
import AssignmentListAdmin from "./admin/assignmentlist";
import EditAssignmentdetail from "./admin/editassignmentdetail";

function UnauthenticatedApp() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courselist" element={<Course />} />
        <Route path="/coursedetail/:Id" element={<Coursedetail />} />

        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route path="/admin/courselist" element={<CourseListAdmin />} />
        <Route path="/admin/addcourse" element={<AddCourseAdmin />} />
        <Route path="/admin/editcourse/:id" element={<EditCourse />} />
        <Route path="/admin/:courseId/addsublesson" element={<AddSubLesson />} />
        <Route path="/admin/:courseId/:lessonId/editsublesson" element={<EditSubLesson />} />
        <Route path="/admin/addassignment" element={<AddAssignment/>}/>
        <Route path="/admin/editaddassignment/:id" element={<EditAssignmentdetail/>}/>
        <Route path="/admin/assignmentlist" element={<AssignmentListAdmin />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

export default UnauthenticatedApp;
