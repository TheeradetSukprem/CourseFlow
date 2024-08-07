import CourseListTable from "../../components/admin/courselist-table";
import NavbarCourseList from "../../components/admin/navbar/navbar-courselist";
import Sidebar from "../../components/admin/sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function CourseListAdmin() {
  return (
    <div className="h-screen flex flex-row bg-gray-100 sticky top-0">
      <Sidebar />
      <div className="flex-1">
        <div>{<Outlet />}</div>
        <main>
          <CourseListTable />
        </main>
      </div>
    </div>
  );
}

export default CourseListAdmin;
