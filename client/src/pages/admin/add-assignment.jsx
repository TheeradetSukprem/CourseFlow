import React from "react";
import Sidebar from "../../components/admin/sidebar";
import AddAssignmentForm from "../../components/admin/form/add-assignmentform";

function Addassignment() {
  return (
    <>
   <div className="flex flex-row bg-gray-100 h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1">
        <div>
        </div>
          <div>
            <AddAssignmentForm/>
          </div>
      </div>
    </div>
    </>
  );
}

export default Addassignment;