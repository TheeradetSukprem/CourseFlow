import React from "react";
import SubButton from "../button/sub-button";
import CancelButton from "../button/cancel-button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function NavbarAddAssignment() {
  return (
    <div className="w-full">
      <nav className="w-full h-[92px] bg-white border-gray-400 border-l-0 border-[1px] flex justify-between items-center">
        <span className="text-black font-medium text-2xl pl-10">
          Add Assignment
        </span>
        <div className="flex gap-4 pr-10">
          <Link to="/admin/assignmentlist">
            <CancelButton text="Cancel" />
          </Link>
          <SubButton text="Create" />
        </div>
      </nav>
    </div>
  );
}

export default NavbarAddAssignment;
