import arrow_back from "../../assets/icons/coursedetail/arrow_back.png";
import attachfile from "../../assets/icons/coursedetail/attachfile.png";
import arrow_drop from "../../assets/icons/coursedetail/arrow_drop.png";
import { useNavigate, useParams, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import PendingSvg from "../shared/pending-svg";

function UserSectionSubscribe() {
  const navigate = useNavigate();
  const params = useParams();
  const [coursedetail, setCoursedetail] = useState([]);
  const [modules, setModules] = useState([]);
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  const [pdfFile, setPdfFile] = useState([]);
  const [pdfFileSizeMB, setPdfFileSizeMB] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true); // Start the spinner
      try {
        const result = await axios.get(
          `https://project-courseflow-server.vercel.app/courses/${params.Id}`
        );
        setCoursedetail(result.data.data);
      } finally {
        setLoading(false); // Stop the spinner
      }
    };
    const getModules = async () => {
      const result = await axios.get(
        `https://project-courseflow-server.vercel.app/courses/modules/${params.Id}`
      );
      setModules(result.data.data);
    };
    const getPdffile = async () => {
      const result = await axios.get(
        `https://project-courseflow-server.vercel.app/courses/list/${params.Id}`
      );
      setPdfFile(result.data.data[0]);

      // Fetch the file size using a HEAD request
      const fileUrl = result.data.data[0].pdffile;
      try {
        const response = await axios.head(fileUrl);
        const contentLength = response.headers["content-length"];
        if (contentLength) {
          const fileSizeInMB = (contentLength / (1024 * 1024)).toFixed(2);
          setPdfFileSizeMB(fileSizeInMB);
        } else {
          setPdfFileSizeMB("Size unknown");
        }
      } catch (error) {
        console.error("Error fetching file size:", error);
        setPdfFileSizeMB("Error fetching size");
      }
    };
    getCourses();
    getModules();
    getPdffile();
  }, []);

  const toggleModuleDetails = (moduleId) => {
    setExpandedModuleId((prevModuleId) =>
      prevModuleId === moduleId ? null : moduleId
    );
  };
  const handleBackClick = () => {
    navigate(`/user/my_course`);
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
      {/* Loading Section */}
      {loading && <PendingSvg text="Loading..." />}
      <section className="h-fit flex flex-row pt-[16px] pl-[16px] pr-[16px] xl:pl-[144px]">
        <div>
          <header className="w-[100%] h-[261.5px] md:h-[450px] xl:h-[500px] flex justify-center xl:justify-start xl:w-[739px] xl:mb-[100px] sm:mb-[70px] md:mb-[0px]">
            <div className="flex flex-col ">
              <button
                onClick={handleBackClick}
                className="w-[79px] h-[32px] flex items-center gap-[8px] pl-[4px] pr-[4px] mt-[50px]"
              >
                <img className="w-[16px] h-[16px]" src={arrow_back}></img>
                <div className="w-[39px] h-[24px] text-[16px] font-[700] text-Blue-500">
                  Back
                </div>
              </button>
              <label className="flex flex-row gap-[24px] ">
                {coursedetail.length > 0 && (
                  <video
                    className="xl:w-[739px]  sm:w-[343px] sm:h-[215px] md:w-[450px] xl:h-[500px] md:h-[320px] rounded-[8px]"
                    src={coursedetail[0].videofile}
                    alt="Course Detail"
                    controls
                  ></video>
                )}
              </label>
            </div>
          </header>
          <article>
            <div className="w-[100%] h-fit xl:w-[739px] mb-[70px]">
              <h1 className="text-black text-Headline3 font-Headline3 mb-[5px] xl:text-Headline2 xl:font-Headline2">
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
            <div className="flex flex-col justify-between w-[100%] sm:w-[343px] sm:h-[128px]">
              <h1 className="text-Headline3 font-Headline3 text-black">
                Attach File
              </h1>
              <div className="bg-Blue-100 rounded-[8px] w-[100%] sm:w-[343px] sm:h-[82px] flex items-center gap-[16px] pl-[16px]">
                <Link to={pdfFile.pdffile} target="_blank">
                  <img src={attachfile} alt="pdf" />
                </Link>
                <div className="w-[144px] h-[46px]">
                  <h1 className="text-Body2 font-Body2 text-black w-[260px]">
                    {pdfFile.coursename}.pdf
                  </h1>
                  {pdfFileSizeMB && (
                    <h1 className="text-Body4 font-Body4 text-Blue-400">
                      {pdfFileSizeMB} MB
                    </h1>
                  )}
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
                    {coursedetail.length > 0 && coursedetail[0].coursename}
                  </span>
                </div>
                <p className="text-Body2 font-Body2 text-Gray-700">
                  {coursedetail.length > 0 &&
                    truncateText(coursedetail[0].description, 4)}
                </p>
              </div>
            </div>
            <div className="text-Gray-700 text-Headline3 font-Headline3 mb-[30px] mt-[10px]">
              THB {coursedetail.length > 0 && coursedetail[0].price}.00
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
