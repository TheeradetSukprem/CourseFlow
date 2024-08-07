import { useNavigate } from "react-router-dom";
import Button from "../button/button";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

function NavbarAssignmentList({ search, onSearchChange }) {
  const navigate = useNavigate();

  const handleAddCourseClick = () => {
    navigate("");
  };

  return (
    <div className="w-full">
      <nav className="order-b-2 py-2 border-gray-300 bg-white text-base text-slate-800 flex flex-row justify-center items-center">
        <span className="flex-1 ml-8 text-xl font-semibold">Assignments</span>
        <div className="flex flex-row items-center justify-between mr-[5rem]">
          <div className="py-3 pl-2 flex gap-2 text-sm rounded-md border border-Gray-400 bg-white focus:ring-blue-500 focus:border-blue-500 mr-4">
          <MagnifyingGlassIcon className="w-6 text-Gray-800" />
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className=" bg-white"
          />
          </div>
          <Link to="/admin/addassignment">
            <Button text="+ Add Assignment" />
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default NavbarAssignmentList;
