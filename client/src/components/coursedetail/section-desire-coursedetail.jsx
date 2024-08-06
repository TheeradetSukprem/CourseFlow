import arrow_back from "../../assets/icons/coursedetail/arrow_back.png";
import arrow_drop from "../../assets/icons/coursedetail/arrow_drop.png";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/authentication";
import axios from "axios";
import ModalCoursedetail from "../../components/coursedetail/modacoursedetaill.desktop";

function SectionDesireCourseDetail() {
  const navigate = useNavigate();
  const userId = useAuth();
  const params = useParams();
  const [coursedetail, setCoursedetail] = useState([]);
  const [modules, setModules] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [expandedModuleId, setExpandedModuleId] = useState(null); // State to track expanded module
  const [subscribedCourses, setSubscribedCourses] = useState([]); // State to track subscribed courses // State to track expanded module

  useEffect(() => {
    const getCourses = async () => {
      const result = await axios.get(
        `http://localhost:4000/courses/${params.Id}`
      );
      setCoursedetail(result.data.data);
    };
    const getModules = async () => {
      const result = await axios.get(
        `http://localhost:4000/courses/modules/${params.Id}`
      );
      setModules(result.data.data);
    };
    const subscribedCourses = async () => {
      const result = await axios.get(
        `http://localhost:4000/courses/user/${userId.UserIdFromLocalStorage}/subscribed`
      );
      console.log(result);
      setSubscribedCourses(result.data);
    };
    getCourses();
    getModules();
    subscribedCourses();
  }, []);

  const deleteDesireCourse = async () => {
    await axios.delete(`http://localhost:4000/courses/desire/${params.Id}`);
    navigate("/user/desire");
  };
  const handleRemoveDesire = (event) => {
    event.preventDefault();
    deleteDesireCourse();
  };

  const postSubscribe = async () => {
    await axios.post(
      `http://localhost:4000/courses/${userId.UserIdFromLocalStorage}/${params.Id}/subscribe`
    ),
      {};
    handleCloseModal();
    navigate(`/user/subscribe/coursedetail/${params.Id}`);
  };

  ///modal
  const handleConfirmSubscribe = () => {
    const subscribedCourseIds = subscribedCourses.map(
      (course) => course.courseid
    );
    const uniqueSubscribedCourseIds = [...new Set(subscribedCourseIds)];

    if (uniqueSubscribedCourseIds.includes(Number(params.Id))) {
      alert("You have already subscribed to this course.");
    } else {
      postSubscribe();
    }
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCourseId(null);
  };
  const handleOpenModal = (id) => {
    setSelectedCourseId(id);
    setOpenModal(true);
  };

  const toggleModuleDetails = (moduleId) => {
    setExpandedModuleId((prevModuleId) =>
      prevModuleId === moduleId ? null : moduleId
    );
  };

  const handleBackClick = () => {
    navigate("/user/desire");
  };

  // Sort modules by moduleid and generate sequential numbers
  const sortedModules = [...modules].sort((a, b) => a.moduleid - b.moduleid);

  const truncateText = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) {
      return text;
    }
    const truncated = words.slice(0, wordLimit).join(" ");
    return truncated + "...";
  };

  return (
    <div>
      <section
        className={`h-fit flex flex-row pt-[16px] pl-[16px] pr-[16px] xl:pl-[144px]`}
      >
        <div>
          <header className="w-[100%] h-[261.5px] md:h-[450px] xl:h-[500px] flex justify-center xl:justify-start xl:w-[739px]">
            <div className="flex flex-col">
              <button
                onClick={handleBackClick}
                className="w-[79px] h-[32px] flex items-center gap-[8px] pl-[4px] pr-[4px]"
              >
                <img
                  className="w-[16px] h-[16px]"
                  src={arrow_back}
                  alt="Back"
                ></img>
                <div className="w-[39px] h-[24px] text-[16px] font-[700] text-Blue-500">
                  Back
                </div>
              </button>
              <figure className="h-[213.5px] mt-[10px] flex flex-row gap-[24px]">
                {coursedetail.length > 0 && (
                  <img
                    className="w-[343px] h-[213.5px] md:w-[450px] md:h-[320px] xl:w-[739px] xl:h-[460px] rounded-[8px]"
                    src={coursedetail[0].imagefile}
                    alt="Course Detail"
                  ></img>
                )}
              </figure>
            </div>
          </header>
          <article>
            <div className="w-[100%] h-fit mb-[15px] mt-[15px] xl:w-[739px] md:mt-[10px] xl:mt-[70px] xl:mb-[70px]">
              <h1 className="text-black text-Headline3 font-Headline3 mb-[25px] xl:text-Headline2 xl:font-Headline2">
                Course Detail
              </h1>
              {coursedetail.length > 0 && (
                <p className="text-Gray-700 text-Body3 font-Body3 xl:text-Body2 xl:font-Body2">
                  {coursedetail[0].description}
                </p>
              )}
            </div>
          </article>
          <article>
            <div className="h-[924px] sm:mt-[30px] xl:mt-[70px] xl:w-[739px] mb-[40px]">
              <h1 className="text-black text-Headline3 font-Headline3 xl:text-Headline2 xl:font-Headline2 xl:mb-[20px]">
                Module Samples
              </h1>
              <div>
                <article>
                  <div className="h-[924px] mt-[15px] xl:w-[739px]">
                    <div>
                      {sortedModules
                        .filter(
                          (module, index, self) =>
                            self.findIndex(
                              (mod) => mod.moduleid === module.moduleid
                            ) === index
                        )
                        .map((module, index) => (
                          <aside key={module.moduleid}>
                            <div className="h-fit">
                              <div className="border-b-[1px] border-b-Gray-400 h-[62px] flex items-center justify-between">
                                <div>
                                  <span className="mr-[20px] text-Gray-700 text-Body1 font-Body1 xl:text-Headline3 xl:font-Headline3">
                                    {String(index + 1).padStart(2, "0")}
                                  </span>
                                  <span className="text-black text-Body1 font-Body1 xl:text-Headline3 xl:font-Headline3">
                                    {module.modulename}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    toggleModuleDetails(module.moduleid)
                                  }
                                >
                                  <img
                                    className="w-[24px] h-[24px]"
                                    src={arrow_drop}
                                    alt="Toggle"
                                  ></img>
                                </button>
                              </div>
                              <div
                                className={`${
                                  expandedModuleId === module.moduleid
                                    ? "block"
                                    : "hidden"
                                } text-Gray-700 text-Body2 font-Body2 mt-[20px] pl-[40px] pb-[20px]`}
                              >
                                <div>
                                  {modules
                                    .filter(
                                      (mod) => mod.moduleid === expandedModuleId
                                    )
                                    .map((mod, idx) => (
                                      <li key={idx}>{mod.sublessonname}</li>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </aside>
                        ))}
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </article>
        </div>
        <div>
          <aside
            className={`shadow-lg xl:w-[375px] xl:h-[449px] xl:block hidden sticky top-[105px] ml-[24px] mt-[40px]`}
          >
            <div className="flex flex-col w-[309px] h-[95%] gap-[10px] mt-[11px] ml-[33px]">
              <h1 className="w-[309px] h-[21px] text-Orange-500 text-[14px] font-[400]">
                Course
              </h1>
              <div className="w-[309px] h-[86px] mt-[10px]">
                <div>
                  <div className="mb-[1px]">
                    <span className="text-black text-Headline3 font-Headline3">
                    {coursedetail.length > 0 && coursedetail[0].coursename}
                    </span>
                  </div>
                  <p className="text-Body2 font-Body2 text-Gray-700">
                  {coursedetail.length > 0 &&
                      truncateText(coursedetail[0].description, 6)}
                  </p>
                </div>
              </div>
              <div className="text-Gray-700 text-Headline3 font-Headline3 mb-[30px] mt-[10px]">
                THB {coursedetail.length > 0 && coursedetail[0].price}.00
              </div>
              <div className="border-solid border-t-[1px] border-Gray-400 flex flex-col justify-end gap-[16px] h-[176px] w-[309px]">
                <button
                  onClick={handleRemoveDesire}
                  className="border-solid border-[1px] border-Orange-500 text-Orange-500 rounded-[12px] text-[16px] font-[700] text-center w-[309px] h-[60px]"
                >
                  Remove from Desire Course
                </button>
                <button
                  onClick={handleOpenModal}
                  className="border-solid border-[1px] border-Blue-500 bg-Blue-500 rounded-[12px] text-[16px] font-[700] text-white text-center w-[309px] h-[60px]"
                >
                  Subscribe This Course
                </button>
              </div>
            </div>
          </aside>
          <ModalCoursedetail
            open={openModal}
            onClose={handleCloseModal}
            onConfirm={handleConfirmSubscribe}
          />
        </div>
      </section>
    </div>
  );
}

export default SectionDesireCourseDetail;
