import React from 'react'
import Sidebar from '../../components/admin/sidebar'
import EditAssignmentForm from '../../components/admin/form/edit-assignmentform'

function EditAssignmentdetail() {
  return (
    <>
   <div className="flex flex-row bg-gray-100 h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1">
        <div>
        </div>
          <div>
            <EditAssignmentForm/>
          </div>
      </div>
    </div>
    </>
  )
}

export default EditAssignmentdetail
