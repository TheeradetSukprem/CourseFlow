import SubButton from "../button/sub-button";
import CancelButton from "../button/cancel-button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function NavbarAddCourse({ createCourse }) {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <nav className="order-b-2 py-2 border-gray-300 bg-white text-base text-slate-800 flex flex-row justify-center items-center">
        <span className="flex-1 ml-8 text-xl font-semibold">
          Add Course
        </span>
        <div className="flex flex-col md:flex-row items-center space-x-2 mr-[5rem] ">
          <Link to="/admin/courselist">
            <CancelButton text="Cancel" />
          </Link>
          <SubButton
            text="Create"
            onClick={async (e) => {
              await createCourse(e);
              navigate(`/admin/courselist`);
            }}
          />
        </div>
      </nav>
    </div>
  );
}

export default NavbarAddCourse;
