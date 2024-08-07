import SubButton from "../button/sub-button";
import CancelButton from "../button/cancel-button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function NavbarAddCourse({ createCourse }) {
  const navigate = useNavigate()
  return (
    <div className="w-full">
      <nav className="border-b-2 border-gray-300 md:p-4 bg-white text-base text-slate-800 flex flex-col md:flex-row md:justify-between items-center">
        <span className="mb-2 md:mb-0 flex-1 ml-8">Add Course</span>
        <div className="flex flex-col md:flex-row items-center space-x-2">
          <Link to="/admin/courselist">
            <CancelButton text="Cancel" />
          </Link>
          <SubButton text="Create"  onClick={async(e) => {
              await createCourse(e)
              navigate(`/admin/courselist`)}} />
        </div>
      </nav>
    </div>
  );
}

export default NavbarAddCourse;
