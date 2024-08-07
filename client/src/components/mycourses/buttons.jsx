import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Buttons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");

  useEffect(() => {
    switch (location.pathname) {
      case "/user/my_course":
        setActive("b1");
        break;
      case "/user/my_course/inprogress":
        setActive("b2");
        break;
      case "/user/my_course/completed":
        setActive("b3");
        break;
      default:
        setActive("");
        break;
    }
  }, [location.pathname]);

  const handleButtonClick = (buttonId, path) => {
    setActive(buttonId);
    navigate(path);
  };

  return (
    <div className="flex lg:pl-[4rem] lg:pb-[2rem]">
      <button
        className={`w-28 transition-colors duration-300 ease-in-out ${
          active === "b1"
            ? "text-gray-900 border-b-2 border-gray-800"
            : "text-gray-400"
        }`}
        onClick={() => handleButtonClick("b1", "/user/my_course")}
      >
        All courses
      </button>
      <button
        className={`w-28 transition-colors duration-300 ease-in-out ${
          active === "b2"
            ? "text-gray-900 border-b-2 border-gray-800"
            : "text-gray-400"
        }`}
        onClick={() => handleButtonClick("b2", "/user/my_course/inprogress")}
      >
        In progress
      </button>
      <button
        className={`w-28 transition-colors duration-300 ease-in-out ${
          active === "b3"
            ? "text-gray-900 border-b-2 border-gray-800"
            : "text-gray-400"
        }`}
        onClick={() => handleButtonClick("b3", "/user/my_course/completed")}
      >
        Completed
      </button>
    </div>
  );
};

export default Buttons;
