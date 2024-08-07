import NavbarAddCourse from "../../components/admin/navbar/navbar-addcourse";
import Sidebar from "../../components/admin/sidebar";
import { Outlet } from "react-router-dom";
import AddCourseForm from "../../components/admin/form/addcourseform";
import AddCourseSubLessonTable from "../../components/admin/editcourse-sublesson";

function AddCourseAdmin() {
  return (
    <div className=" h-[2320px] flex flex-col bg-gray-100">
      <div className="flex flex-1">
        <Sidebar />
        <div className=" flex flex-col w-full">
          <main className="flex-1">
            <Outlet />
            <AddCourseForm />
          </main>
        </div>
        <div className="">{<Outlet />}</div>
        <main className=""></main>
      </div>
    </div>
  );
}

export default AddCourseAdmin;
