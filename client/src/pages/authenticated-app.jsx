import { Routes, Route } from "react-router-dom";

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

function AuthenticatedApp() {
  return (
    <div className="App">
      <Routes>
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
        <Route path="/user/my_course/" element={<UserMycourse />} />
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
      </Routes>
    </div>
  );
}

export default AuthenticatedApp;
