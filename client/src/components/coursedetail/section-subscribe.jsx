import arrow_back from "../../assets/icons/coursedetail/arrow_back.png";
import attachfile from "../../assets/icons/coursedetail/attachfile.png";
import arrow_drop from "../../assets/icons/coursedetail/arrow_drop.png";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/authentication";

function UserSectionSubscribe() {
  const navigate = useNavigate();
  const userId = useAuth();
  const params = useParams();
  const [coursedetail, setCoursedetail] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [expandedModuleId, setExpandedModuleId] = useState(null); // State to track expanded module

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
    getCourses();
    getModules();
  }, []);

  const toggleModuleDetails = (moduleId) => {
    setExpandedModuleId((prevModuleId) =>
      prevModuleId === moduleId ? null : moduleId
    );
  };

  const handleBackClick = () => {
    // navigate(`/users/startlearning/${params.Id}`);
    navigate(`/user/my_course`);
  };

  // Sort modules by moduleid and generate sequential numbers
  const sortedModules = [...modules].sort((a, b) => a.moduleid - b.moduleid);
  const [courseDetail] = coursedetail;

  return (
    <div>
      <section className="h-fit flex flex-row pt-[16px] pl-[16px] pr-[16px] xl:pl-[144px]">
        <div>
          <header className="w-[100%] h-[261.5px] md:h-[450px] xl:h-[500px] flex justify-center xl:justify-start xl:w-[739px]">
            <div className="flex flex-col">
              <button
                onClick={handleBackClick}
                className="w-[79px] h-[32px] flex items-center gap-[8px] pl-[4px] pr-[4px]"
              >
                <img className="w-[16px] h-[16px]" src={arrow_back}></img>
                <div className="w-[39px] h-[24px] text-[16px] font-[700] text-Blue-500">
                  Back
                </div>
              </button>
              <figure className="h-[213.5px] mt-[10px] flex flex-row gap-[24px]">
                {courseDetail && (
                  <img
                    className="w-[343px] h-[213.5px] md:w-[450px] md:h-[320px] xl:w-[739px] xl:h-[460px] rounded-[8px]"
                    src={courseDetail.imagefile}
                    alt="Course Detail"
                  ></img>
                )}
              </figure>
            </div>
          </header>
          <article>
            <div className="w-[100%] h-fit mb-[15px] mt-[15px] xl:w-[739px] md:mt-[10px] xl:mt-[70px] xl:mb-[70px]">
              <h1 className="text-black text-Headline3 font-Headline3 mb-[5px] xl:text-Headline2 xl:font-Headline2">
                Course Detail
              </h1>
              <p className="text-Gray-700 text-Body3 font-Body3 xl:text-Body2 xl:font-Body2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Elementum aenean fermentum, velit vel, scelerisque morbi
                accumsan. Nec, tellus leo id leo id felis egestas. Quam sit
                lorem quis vitae ut mus imperdiet. Volutpat placerat dignissim
                dolor faucibus elit ornare fringilla. Vivamus amet risus
                ullamcorper auctor nibh. Maecenas morbi nec vestibulum ac tempus
                vehicula.
              </p>
              <br />
              <p className="text-Gray-700 text-Body3 font-Body3 xl:text-Body2 xl:font-Body2">
                Vel, sit magna nisl cras non cursus. Sed sed sit ullamcorper
                neque. Dictum sapien amet, dictumst maecenas. Mattis nulla
                tellus ut neque euismod cras amet, volutpat purus. Semper purus
                viverra turpis in tempus ac nunc. Morbi ullamcorper sed elit
                enim turpis. Scelerisque rhoncus morbi pulvinar donec at sed
                fermentum. Duis non urna lacus, sit amet. Accumsan orci
                elementum nisl tellus sit quis. Integer turpis lectus eu blandit
                sit. At at cras viverra odio neque nisl consectetur. Arcu
                senectus aliquet vulputate urna, ornare. Mi sem tellus elementum
                at commodo blandit nunc. Viverra elit adipiscing ut dui, tellus
                viverra nec.
              </p>
              <br />
              <br />
              <p className="text-Gray-700 text-Body3 font-Body3 xl:text-Body2 xl:font-Body2">
                Lectus pharetra eget curabitur lobortis gravida gravida eget ut.
                Nullam velit morbi quam a at. Sed eu orci, sociis nulla at sit.
                Nunc quam integer metus vitae elementum pulvinar mattis nulla
                molestie. Quis eget vestibulum, faucibus malesuada eu. Et lectus
                molestie egestas faucibus auctor auctor.
              </p>
            </div>
          </article>
          <article>
            <div className="flex flex-col justify-between w-[100%] sm:w-[343px] sm:h-[128px]">
              <h1 className="text-Headline3 font-Headline3 text-black">
                Attach File
              </h1>
              <div className="bg-Blue-100 rounded-[8px] w-[100%] sm:w-[343px] sm:h-[82px] flex items-center gap-[16px] pl-[16px]">
                <img className="w-[50px] h-[50px]" src={attachfile}></img>
                <div className="w-[144px] h-[46px]">
                  <h1 className="text-Body2 font-Body2 text-black">
                    Service Design.pdf
                  </h1>
                  <h1 className="text-Body4 font-Body4 text-Blue-400">68 mb</h1>
                </div>
              </div>
            </div>
          </article>
          <article>
            <div className="h-[924px] mt-[70px] xl:w-[739px]">
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
        <aside className="bg-white shadow-lg xl:w-[357px] xl:h-[373px] xl:block hidden sticky top-[58px] ml-[24px] mt-[40px] pl-[24px] pt-[32px]">
          <div className="flex flex-col justify-between w-[309px] h-[309px]">
            <h1 className="w-[309px] h-[21px] text-Orange-500 text-[14px] font-[400] ">
              Course
            </h1>
            <div className="w-[309px] h-[86px] mt-[10px]">
              <div>
                <div className="mb-[1px]">
                  <span className="text-black text-Headline3 font-Headline3">
                    {courseDetail?.coursename}
                  </span>
                </div>
                <p className="text-Body2 font-Body2 text-Gray-700">
                  {courseDetail?.description}
                </p>
              </div>
            </div>
            <div className="text-Gray-700 text-Headline3 font-Headline3 mb-[30px] mt-[10px]">
              THB {courseDetail?.price}.00
            </div>
            <div className="border-solid border-t-[1px] border-Gray-400 flex flex-col justify-end h-[100px] w-[309px] ">
              <button
                onClick={() => {
                  navigate(`/users/startlearning/${params.Id}`);
                }}
                className="border-solid border-[1px] border-Blue-500 bg-Blue-500 rounded-[12px] text-[16px] font-[700] text-white text-center w-[309px] h-[60px]"
              >
                Start Learning
              </button>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default UserSectionSubscribe;
