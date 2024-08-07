import AssignmentListTable from "../../components/admin/assignmentlist-table";
import NavbarAssignmentList from "../../components/admin/navbar/navbar-assignmentlist";
import Sidebar from "../../components/admin/sidebar";
import { Outlet } from "react-router-dom";

function AssignmentListAdmin() {
  return (
    <div className="h-screen flex flex-row bg-gray-100 sticky top-0">
      <Sidebar />
      <div className="flex-1">
        <div></div>
        <div>{<Outlet />}</div>
        <main>
          <AssignmentListTable />
        </main>
      </div>
    </div>
  );
}

export default AssignmentListAdmin;
