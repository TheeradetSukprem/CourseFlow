import { useNavigate } from "react-router-dom";
import Button from "../button/button";

function NavbarAssignmentList() {
  const navigate = useNavigate();

  const handleAddCourseClick = () => {
    navigate("");
  };

  return (
    <div className="w-full ">
      <nav className="border-b-2 border-gray-300 md:p-4 bg-white text-base text-slate-800 flex flex-col md:flex-row md:justify-between items-center">
        <span className="mb-2 md:mb-0 flex-1 ml-8 ">Assignment</span>
        <div className="flex flex-col md:flex-row items-center">
          <input
            type="text"
            id="search"
            placeholder="Search..."
            className="w-full md:w-[320px] h-[40px] p-3 md:mr-4 mb-2 md:mb-0 text-sm rounded-md border border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
          />
          <Button text="+ Add Assignment" />
        </div>
      </nav>
    </div>
  );
}

export default NavbarAssignmentList;