import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/src/assets/icons/logo.png";

function Navbarnonuser() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/courselist");
    window.scrollTo(0, 0);
  };

  return (
    <>
      <div className="navbar sticky top-0 z-50 bg-white">
        <section
          style={{ boxShadow: "2px 2px 12px 0px rgba(64, 50, 133, 0.12)" }}
          className="navbar items-center sm:w-auto sm:h-[56px] sm:flex sm:flex-row sm:justify-between md:w-full md:h-[88px] md:flex md:flex-row md:justify-between xl:w-full xl:h-[88px] xl:flex xl:flex-row xl:justify-between "
        >
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              className="sm:pl-[16px] md:p-[100px] xl:p-[160px]"
            />
          </Link>
          <div className="menu sm:flex sm:flex-row sm:mr-[16px] md:w-[291px] md:h-[88px] md:flex md:flex-row md:items-center md:justify-center md:mr-[160px] md:gap-[32px] xl:w-[291px] xl:h-[88px] xl:flex xl:flex-row xl:items-center xl:justify-center xl:mr-[160px] xl:gap-[32px]">
            <h1
              onClick={handleNavigate}
              className="sm:font-bold sm:text-sm sm:mx-[16px] sm:my-[16px] xl:font-bold xl:text-base sm:text-black cursor-pointer"
            >
              Our Courses
            </h1>
            <Link
              to="/login"
              className="bg-Blue-500 cursor-pointer sm:my-[8px] sm:rounded-xl md:py-[18px] xl:py-[18px]"
            >
              <button className=" justify-center align-middle sm:pt-1 md:pt-0 xl:p-0">
                <span className="text-white sm:my-[8px] sm:mx-[16px] md:font-bold md:text-center md:text-base md:px-[16px] xl:font-bold xl:text-center xl:text-base xl:px-[16px]">
                  Log in
                </span>
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export default Navbarnonuser;
