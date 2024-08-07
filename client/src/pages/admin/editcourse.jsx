import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/sidebar";
import EditCourseFrom from "../../components/admin/form/edit-course-form";


function EditCourse() {
  return (
    <div className=" h-[2400px] flex flex-col bg-gray-100">
      <div className="flex flex-1">
        <Sidebar />
        <div className=" flex flex-col w-full">
          <main className="flex-1">
            <Outlet />
            <EditCourseFrom />
          </main>
          <div>
          </div>
        </div>
        <div className="">{<Outlet />}</div>
      </div>
    </div>
  );
}

export default EditCourse;
