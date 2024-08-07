import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  LinearProgress,
  Typography,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { linearProgressClasses } from "@mui/material/LinearProgress";
import Navbarnonuser from "../homepage/navbar-user";
import GeneralFooter from "../homepage/footer";
import {
  NotPlayingIcon,
  PlayingIcon,
  FinishedIcon,
} from "../../assets/icons/videoicon/status-icon";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserLearningPage = () => {
  // State and Hooks
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
    },
  }));

  const { courseid } = useParams();
  const [openSections, setOpenSections] = useState({});
  const [videoStates, setVideoStates] = useState({});
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [sidebarData, setSidebarData] = useState({});
  const [selectedSublesson, setSelectedSublesson] = useState(null);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [watchedVideos, setWatchedVideos] = useState(new Set());
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentModuleName, setCurrentModuleName] = useState("");
  const [currentSubmoduleName, setCurrentSubmoduleName] = useState("");
  const [hoveredSublessonId, setHoveredSublessonId] = useState(null);
  const [assignmentStatus, setAssignmentStatus] = useState("");
  const [assignment, setAssignment] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [submissionStatuses, setSubmissionStatuses] = useState({});
  const [overallSubmissionStatus, setOverallSubmissionStatus] =
    useState("Pending");
  const [submissionAnswer, setSubmissionAnswer] = useState("");
  const [submissionDetails, setSubmissionDetails] = useState({});

  const navigate = useNavigate();

  const handleMouseEnter = (sublessonId) => {
    setHoveredSublessonId(sublessonId);
  };

  const handleMouseLeave = () => {
    setHoveredSublessonId(null);
  };

  const videoRef = useRef(null);

  // Event Handlers
  const handleToggle = (section) => {
    setOpenSections((prevOpenSections) => ({
      ...prevOpenSections,
      [section]: !prevOpenSections[section],
    }));
  };

  const handlePlay = () => {
    setIsVideoPlaying(true);
    setVideoStates((prevState) => ({
      ...prevState,
      [selectedSublesson]: { isPlaying: true, isEnded: false },
    }));
  };

  const handleEnded = () => {
    setIsVideoPlaying(false);
    setIsVideoEnded(true);
    setProgress(100);

    setVideoStates((prevState) => ({
      ...prevState,
      [selectedSublesson]: { isPlaying: false, isEnded: true },
    }));

    setWatchedVideos((prevWatchedVideos) => {
      const newWatchedVideos = new Set(prevWatchedVideos);
      newWatchedVideos.add(selectedVideoUrl);
      return newWatchedVideos;
    });

    const { nextSublessonId, nextVideoUrl } = getNextVideoDetails();
    if (nextVideoUrl) {
      setSelectedSublesson(nextSublessonId);
      setSelectedVideoUrl(nextVideoUrl);

      // Optionally, reset progress to 0 and start playing the next video
      setProgress(0);
      setIsVideoPlaying(true);
    }
  };

  const handlePreviousLesson = () => {
    const { previousSublessonId, previousVideoUrl } = getPreviousVideoDetails();
    if (previousSublessonId && previousVideoUrl) {
      setSelectedSublesson(previousSublessonId);
      setSelectedVideoUrl(previousVideoUrl);
      setIsVideoPlaying(true);
    }
  };

  const handleNextLesson = () => {
    const { nextSublessonId, nextVideoUrl } = getNextVideoDetails();
    if (nextSublessonId && nextVideoUrl) {
      setSelectedSublesson(nextSublessonId);
      setSelectedVideoUrl(nextVideoUrl);
      setIsVideoPlaying(true);
    }
  };

  // useEffect Hooks
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateProgress = () => {
      if (videoElement.duration > 0) {
        const progress =
          (videoElement.currentTime / videoElement.duration) * 100;
        // Realtime Update with video time
        // setProgress(progress);
      }
    };

    videoElement.addEventListener("play", handlePlay);
    videoElement.addEventListener("ended", handleEnded);
    videoElement.addEventListener("timeupdate", updateProgress);

    return () => {
      videoElement.removeEventListener("play", handlePlay);
      videoElement.removeEventListener("ended", handleEnded);
      videoElement.removeEventListener("timeupdate", updateProgress);
    };
  }, [selectedVideoUrl]);

  useEffect(() => {
    if (sidebarData.modules) {
      const allVideos = sidebarData.modules.flatMap((module) =>
        module.sublessons.flatMap((sublesson) =>
          sublesson.videofile ? [sublesson.videofile] : []
        )
      );
      setTotalVideos(allVideos.length);
    }
  }, [sidebarData]);

  useEffect(() => {
    if (totalVideos > 0) {
      setProgress((watchedVideos.size / totalVideos) * 100);
    }
  }, [watchedVideos, totalVideos]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/users/courseinfo/${courseid}`
        );
        const data = response.data;
        setSidebarData(data);
        console.log(data);

        // Set the first sublesson as selected by default
        const firstSublesson = data.modules?.[0]?.sublessons?.[0];
        if (firstSublesson) {
          setSelectedSublesson(firstSublesson.sublessonid);
          setSelectedVideoUrl(firstSublesson.videofile);
        }

        // Initialize open sections state
        const initialOpenSections = {};
        data.modules.forEach((module) => {
          initialOpenSections[module.moduleid] = false;
        });
        setOpenSections(initialOpenSections);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchData();
  }, [courseid]);

  useEffect(() => {
    if (selectedSublesson) {
      const module = sidebarData.modules.find((mod) =>
        mod.sublessons.find((sub) => sub.sublessonid === selectedSublesson)
      );

      if (module) {
        const sublesson = module.sublessons.find(
          (sub) => sub.sublessonid === selectedSublesson
        );

        if (sublesson) {
          setCurrentModuleName(module.modulename);
          setCurrentSubmoduleName(sublesson.sublessonname);

          // Assume each sublesson has only one video file
          if (sublesson.videofile) {
            setSelectedVideoUrl(sublesson.videofile);
          } else {
            setSelectedVideoUrl("");
          }

          // Update the openSections to expand the current module
          setOpenSections((prevOpenSections) => ({
            ...prevOpenSections,
            [module.moduleid]: true,
          }));
        }
      }
    }
  }, [selectedSublesson, sidebarData]);

  // Fetch Assignment
  // useEffect(() => {
  //   const fetchAssignmentData = async (assignmentid) => {
  //     try {
  //       console.log(`Fetching assignment data for ID: ${assignmentid}`);
  //       const response = await axios.get(
  //         `http://localhost:4000/users/assignment/${assignmentid}`
  //       );
  //       const assignmentData = response.data;

  //       if (Array.isArray(assignmentData) && assignmentData.length > 0) {
  //         console.log("Assignment data fetched:", assignmentData);
  //         setAssignment(assignmentData[0]);
  //       } else {
  //         console.log("No assignment data found.");
  //         setAssignment(null);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching assignment data:", error);
  //       setAssignment(null); // Handle the error by clearing assignment
  //     }
  //   };

  //   const findSelectedSublessonData = () => {
  //     if (selectedSublesson && sidebarData) {
  //       const selectedModule = sidebarData.modules.find((module) =>
  //         module.sublessons.some(
  //           (sublesson) => sublesson.sublessonid === selectedSublesson
  //         )
  //       );

  //       if (selectedModule) {
  //         const selectedSublessonData = selectedModule.sublessons.find(
  //           (sublesson) => sublesson.sublessonid === selectedSublesson
  //         );

  //         if (selectedSublessonData) {
  //           console.log("Selected Sublesson Data:", selectedSublessonData);
  //           setSelectedVideoUrl(selectedSublessonData.videofile);
  //           setCurrentModuleName(selectedModule.modulename);
  //           setCurrentSubmoduleName(selectedSublessonData.sublessonname);

  //           if (selectedSublessonData.assignmentid) {
  //             fetchAssignmentData(selectedSublessonData.assignmentid);
  //           } else {
  //             setAssignment(null);
  //           }
  //         } else {
  //           console.log("No matching sublesson data found.");
  //           setAssignment(null);
  //         }
  //       } else {
  //         console.log("No matching module found.");
  //         setAssignment(null);
  //       }
  //     }
  //   };

  //   findSelectedSublessonData();
  // }, [selectedSublesson, sidebarData]);

  // Helper Functions
  const getNextVideoDetails = () => {
    let nextSublessonId = null;
    let nextVideoUrl = null;

    if (selectedSublesson && sidebarData.modules) {
      let foundCurrentSublesson = false;

      for (let i = 0; i < sidebarData.modules.length; i++) {
        const module = sidebarData.modules[i];
        for (let j = 0; j < module.sublessons.length; j++) {
          const sublesson = module.sublessons[j];
          if (foundCurrentSublesson) {
            // Found current sublesson, now set the next video
            if (sublesson.videofile) {
              nextSublessonId = sublesson.sublessonid;
              nextVideoUrl = sublesson.videofile;
              return { nextSublessonId, nextVideoUrl };
            }
          } else if (sublesson.sublessonid === selectedSublesson) {
            // Found current sublesson
            foundCurrentSublesson = true;
          }
        }

        // If we are at the end of the module and there are more modules
        if (foundCurrentSublesson && i < sidebarData.modules.length - 1) {
          const nextModule = sidebarData.modules[i + 1];
          if (nextModule.sublessons.length > 0) {
            const firstSublesson = nextModule.sublessons[0];
            if (firstSublesson.videofile) {
              nextSublessonId = firstSublesson.sublessonid;
              nextVideoUrl = firstSublesson.videofile;
              return { nextSublessonId, nextVideoUrl };
            }
          }
          break; // Stop if we found the next video in the next module
        }
      }
    }

    return { nextSublessonId, nextVideoUrl };
  };

  const getPreviousVideoDetails = () => {
    let previousSublessonId = null;
    let previousVideoUrl = null;

    if (selectedSublesson && sidebarData.modules) {
      for (let i = 0; i < sidebarData.modules.length; i++) {
        const module = sidebarData.modules[i];
        for (let j = 0; j < module.sublessons.length; j++) {
          const sublesson = module.sublessons[j];
          if (sublesson.sublessonid === selectedSublesson) {
            if (j > 0) {
              // Previous sublesson in the current module
              const previousSublesson = module.sublessons[j - 1];
              if (previousSublesson.videofile) {
                previousSublessonId = previousSublesson.sublessonid;
                previousVideoUrl = previousSublesson.videofile;
              }
            } else if (i > 0) {
              // Last sublesson of the previous module
              const previousModule = sidebarData.modules[i - 1];
              if (previousModule.sublessons.length > 0) {
                const lastSublesson =
                  previousModule.sublessons[
                    previousModule.sublessons.length - 1
                  ];
                previousSublessonId = lastSublesson.sublessonid;
                if (lastSublesson.videofile) {
                  previousVideoUrl = lastSublesson.videofile;
                }
              }
            }
            break;
          }
        }
        if (previousSublessonId) break;
      }
    }

    return { previousSublessonId, previousVideoUrl };
  };

  const handleSubmoduleClick = (submoduleid, moduleid) => {
    setSelectedSublesson(submoduleid);
    // Ensure the module containing the submodule is expanded
    setOpenSections((prevOpenSections) => ({
      ...prevOpenSections,
      [moduleid]: true,
    }));
  };

  const handleSendAssignmentClick = async () => {
    // if (assignment) {
    //   try {
    //     await axios.post(`http://localhost:4000/users/submit-assignment`, {
    //       assignmentId: assignment.assignmentid,
    //       userAnswer: userAnswer,
    //     });
    //     alert("Assignment submitted successfully!");
    //   } catch (error) {
    //     console.error("Error submitting assignment:", error);
    //   }
    // }
    setAssignmentStatus("Submitted");
  };

  const getVideoIcon = (submoduleid) => {
    const state = videoStates[submoduleid] || {
      isPlaying: false,
      isEnded: false,
    };
    if (state.isEnded) return <FinishedIcon />;
    if (state.isPlaying) return <PlayingIcon />;
    return <NotPlayingIcon />;
  };

  const getPaddedModuleId = (module, modules) => {
    const courseModules = modules.filter((m) => m.courseId === module.courseId);
    const index = courseModules.findIndex(
      (m) => m.moduleid === module.moduleid
    );
    return (index + 1).toString().padStart(2, "0");
  };

  // Render Methods
  const { coursename, coursedescription, modules } = sidebarData;

  const selectedSubmoduleData = sidebarData.modules
    ?.flatMap((module) => module.sublessons)
    .find((sublesson) => sublesson.sublessonid === selectedSublesson);

  // Fetch Profile
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      let userDataFromToken = null; // Initialize userDataFromToken

      if (token) {
        userDataFromToken = jwtDecode(token);
        setProfile(userDataFromToken);
      }

      // console.log("token " + token);
      console.log("userDataFromToken ", userDataFromToken); // Fix the variable name and log properly
    };

    fetchProfile();
  }, []);

  // Fetch Submission
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      fetchUserSubmissions(decodedToken.userid);
    }
  }, []);

  const fetchUserSubmissions = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/submissions/user/${userId}`
      );

      if (response.status === 200) {
        const data = response.data;
        const statuses = {};
        const details = {};

        if (Array.isArray(data) && data.length > 0) {
          let hasSubmitted = false;

          data.forEach((submission) => {
            statuses[submission.assignmentid] = submission.status;
            details[submission.assignmentid] = submission;
            if (submission.status === "Submitted") {
              hasSubmitted = true;
            }
          });

          setSubmissionStatuses(statuses);
          setSubmissionDetails(details);
          setOverallSubmissionStatus(hasSubmitted ? "Submitted" : "Pending");
        } else {
          console.log("No data or data is not an array.");
        }
      }
    } catch (error) {
      console.error("Error fetching user submissions:", error);
    }
  };

  const fetchAssignmentData = async (assignmentid) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/users/assignment/${assignmentid}`
      );
      const assignmentData = response.data;

      if (Array.isArray(assignmentData) && assignmentData.length > 0) {
        setAssignment(assignmentData[0]);
      } else {
        setAssignment(null);
      }
    } catch (error) {
      console.error("Error fetching assignment data:", error);
      setAssignment(null); // Handle the error by clearing assignment
    }
  };

  const findSelectedSublessonData = () => {
    if (selectedSublesson && sidebarData) {
      const selectedModule = sidebarData.modules.find((module) =>
        module.sublessons.some(
          (sublesson) => sublesson.sublessonid === selectedSublesson
        )
      );

      if (selectedModule) {
        const selectedSublessonData = selectedModule.sublessons.find(
          (sublesson) => sublesson.sublessonid === selectedSublesson
        );

        if (selectedSublessonData) {
          setSelectedVideoUrl(selectedSublessonData.videofile);
          setCurrentModuleName(selectedModule.modulename);
          setCurrentSubmoduleName(selectedSublessonData.sublessonname);

          if (selectedSublessonData.assignmentid) {
            fetchAssignmentData(selectedSublessonData.assignmentid);
          } else {
            setAssignment(null);
          }
        } else {
          setAssignment(null);
        }
      } else {
        setAssignment(null);
      }
    }
  };

  useEffect(() => {
    findSelectedSublessonData();
  }, [selectedSublesson, sidebarData]);

  useEffect(() => {
    console.log("This is submission statuses", submissionStatuses);
    console.log("This is assignment data", assignment);
  }, [submissionStatuses, assignment]);

  // UI Handlers
  const handleSubmission = async () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.userid;

    const currentStatus = submissionStatuses[assignment.assignmentid];
    const currentAnswer = submissionDetails[assignment.assignmentid]?.answer;

    if (currentStatus === "Submitted" && currentAnswer) {
      alert("You already submitted this assignment.");
      return;
    }

    if (userAnswer.length < 20) {
      alert("Please type at least 20 characters before submitting.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4000/submissions/user/${userId}/assignment/${assignment.assignmentid}/submit`,
        {
          answer: userAnswer,
        }
      );

      if (response.status === 201) {
        setSubmissionStatuses((prevStatuses) => ({
          ...prevStatuses,
          [assignment.assignmentid]: "Submitted",
        }));

        setSubmissionDetails((prevDetails) => ({
          ...prevDetails,
          [assignment.assignmentid]: {
            ...prevDetails[assignment.assignmentid],
            answer: userAnswer,
            status: "Submitted",
          },
        }));

        setUserAnswer(""); // Clear the userAnswer input after submission
        alert("Assignment submitted successfully.");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  return (
    <>
      <Navbarnonuser />
      <div className="flex flex-col md:flex-row mx-4 lg:mx-20 xl:mx-40 mt-[128px] md:mt-[188px] min-h-screen">
        {/* Sidebar */}
        <div className="md:w-1/4 bg-white text-black shadow-md p-4 font-sans h-[100vh] sm:h-[calc(50vh)] md:h-[calc(123vh-211px)] lg:h-[calc(134vh-168px)] overflow-y-auto scrollbar-hide">
          <div className="mb-6">
            <h2 className="text-sm font-bold text-orange-500">Course</h2>
            <h3 className="text-2xl font-bold mt-4">{coursename}</h3>
            <p className="text-gray-600 text-base mt-2">{coursedescription}</p>
            <div className="mt-4">
              <span className="text-sm text-gray-600">
                {progress.toFixed(0)}% Complete
              </span>
              <div className="flex items-center">
                <BorderLinearProgress
                  variant="determinate"
                  value={progress}
                  className="w-full mr-2"
                />
              </div>
            </div>
          </div>

          <List component="nav">
            {Array.isArray(modules) &&
              modules.map((module) => (
                <div key={module.moduleid}>
                  <ListItem
                    button
                    onClick={() => handleToggle(module.moduleid)}
                    style={{
                      borderBottom: "1px solid #D6D9E4",
                    }}
                  >
                    <ListItemText
                      disableTypography
                      primary={
                        <span>
                          <span
                            style={{
                              color: "#646D89",
                              position: "absolute",
                              left: "0",
                            }}
                          >
                            {getPaddedModuleId(module, modules)}
                          </span>{" "}
                          {module.modulename}
                        </span>
                      }
                      className="text-base font-sans px-6 py-6"
                    />
                    {openSections[module.moduleid] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItem>
                  <Collapse
                    in={openSections[module.moduleid]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {module.sublessons.map((sublesson, index) => {
                        const isCurrentSublesson =
                          selectedSublesson === sublesson.sublessonid;
                        const isFirstSublesson = index === 0;
                        const isLastSublesson = module.sublessons.length - 1;
                        const isHovered =
                          hoveredSublessonId === sublesson.sublessonid;

                        return (
                          <ListItem
                            button
                            key={sublesson.sublessonid}
                            onClick={() =>
                              handleSubmoduleClick(
                                sublesson.sublessonid,
                                module.moduleid
                              )
                            }
                            onMouseEnter={() =>
                              handleMouseEnter(sublesson.sublessonid)
                            }
                            onMouseLeave={handleMouseLeave}
                            style={{
                              backgroundColor: isCurrentSublesson
                                ? "#F6F7FC"
                                : isHovered
                                ? "#F6F7FC"
                                : "transparent",
                              borderRadius: "8px",
                              marginTop: isFirstSublesson ? "24px" : "0",
                              transition: "background-color 0.3s",
                            }}
                          >
                            <ListItemIcon>
                              {getVideoIcon(sublesson.sublessonid)}
                            </ListItemIcon>
                            <ListItemText
                              disableTypography
                              primary={sublesson.sublessonname}
                              style={{
                                color: "#646D89",
                                fontFamily: "Inter",
                              }}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                </div>
              ))}
          </List>
        </div>

        {/* Video content */}
        <div className="flex-1 p-4 lg:p-6 text-black">
          <h1 className="text-2xl font-bold mb-4">
            {selectedSubmoduleData
              ? selectedSubmoduleData.sublessonname
              : coursename}
          </h1>
          <div className="mb-4 flex justify-center">
            {selectedVideoUrl && (
              <video
                ref={videoRef}
                autoPlay
                width="739"
                height="460"
                src={selectedVideoUrl}
                title="Course Video"
                controls
                muted
                className="rounded-lg shadow-md w-full max-w-full"
              ></video>
            )}
          </div>
          {/* Assignment Section */}
          {assignment && (
            <div
              className="bg-[#E5ECF8] border border-gray-300 rounded-lg p-4 lg:p-6 shadow-md"
              key={assignment.assignmentid}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Assignment</h2>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    submissionStatuses[assignment.assignmentid] === "Submitted"
                      ? "bg-green-200 text-green-800"
                      : submissionStatuses[assignment.assignmentid] ===
                        "Pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {submissionStatuses[assignment.assignmentid] ||
                    "No status available"}
                </span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  {assignment.title}
                </label>
                <textarea
                  className={`w-full px-3 py-2 text-[#646D89] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    submissionDetails[assignment.assignmentid]?.answer
                      ? "bg-[#E5ECF8] focus:ring-0"
                      : "bg-white"
                  }`}
                  rows="3"
                  placeholder="Answer..."
                  value={
                    submissionDetails[assignment.assignmentid]?.answer ||
                    userAnswer
                  }
                  onChange={(e) =>
                    !submissionDetails[assignment.assignmentid]?.answer &&
                    setUserAnswer(e.target.value)
                  }
                  readOnly={
                    !!submissionDetails[assignment.assignmentid]?.answer
                  }
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  className="bg-[#2F5FAC] text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  onClick={handleSubmission}
                >
                  Send Assignment
                </button>
                <span className="text-gray-500 text-sm">
                  {/* Assign within 2 days */}
                </span>
              </div>
            </div>
          )}
          {/* Assignment Section */}
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-white py-4 flex justify-between items-center border-t border-gray-300 mt-6 md:mt-0">
        <button
          className="text-blue-600 font-bold ml-4 md:ml-16 my-2 md:my-9"
          onClick={handlePreviousLesson}
        >
          Previous Lesson
        </button>
        <button
          className="bg-[#2F5FAC] mr-4 md:mr-14 my-2 md:my-5 text-white font-bold py-2 px-4 rounded-lg"
          onClick={() =>
            progress === 100
              ? (alert("Complete lesson"), navigate("/"))
              : handleNextLesson()
          }
        >
          {progress === 100 ? "Complete Lesson" : "Next Lesson"}
        </button>
      </footer>
      {/* General Footer */}
      <GeneralFooter />
    </>
  );
};

export default UserLearningPage;
