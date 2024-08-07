// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { styled } from "@mui/material/styles";
// import {
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
//   LinearProgress,
//   Typography,
// } from "@mui/material";
// import ExpandLess from "@mui/icons-material/ExpandLess";
// import ExpandMore from "@mui/icons-material/ExpandMore";
// import { linearProgressClasses } from "@mui/material/LinearProgress";
// import Navbarnonuser from "../homepage/navbar-user";
// import GeneralFooter from "../homepage/footer";
// import {
//   NotPlayingIcon,
//   PlayingIcon,
//   FinishedIcon,
// } from "../../assets/icons/videoicon/status-icon";
// import axios from "axios";

// // Sidebar Component
// const Sidebar = () => {
//   // State and Hooks
//   const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
//     height: 10,
//     borderRadius: 5,
//     [`&.${linearProgressClasses.colorPrimary}`]: {
//       backgroundColor:
//         theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
//     },
//     [`& .${linearProgressClasses.bar}`]: {
//       borderRadius: 5,
//       backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
//     },
//   }));

//   const { courseid } = useParams();
//   const [openSections, setOpenSections] = useState({});
//   const [videoStates, setVideoStates] = useState({});
//   const [isVideoPlaying, setIsVideoPlaying] = useState(false);
//   const [isVideoEnded, setIsVideoEnded] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [sidebarData, setSidebarData] = useState({});
//   const [selectedSublesson, setSelectedSublesson] = useState(null);
//   const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
//   const [watchedVideos, setWatchedVideos] = useState(new Set());
//   const [totalVideos, setTotalVideos] = useState(0);
//   const [currentModuleName, setCurrentModuleName] = useState("");
//   const [currentSubmoduleName, setCurrentSubmoduleName] = useState("");
//   const [hoveredSublessonId, setHoveredSublessonId] = useState(null);

//   const navigate = useNavigate();

//   const handleMouseEnter = (sublessonId) => {
//     setHoveredSublessonId(sublessonId);
//   };

//   const handleMouseLeave = () => {
//     setHoveredSublessonId(null);
//   };

//   const videoRef = useRef(null);

//   // Event Handlers
//   const handleToggle = (section) => {
//     setOpenSections((prevOpenSections) => ({
//       ...prevOpenSections,
//       [section]: !prevOpenSections[section],
//     }));
//   };

//   const handlePlay = () => {
//     setIsVideoPlaying(true);
//     setVideoStates((prevState) => ({
//       ...prevState,
//       [selectedSublesson]: { isPlaying: true, isEnded: false },
//     }));
//   };

//   const handleEnded = () => {
//     setIsVideoPlaying(false);
//     setIsVideoEnded(true);
//     setProgress(100);

//     setVideoStates((prevState) => ({
//       ...prevState,
//       [selectedSublesson]: { isPlaying: false, isEnded: true },
//     }));

//     setWatchedVideos((prevWatchedVideos) => {
//       const newWatchedVideos = new Set(prevWatchedVideos);
//       newWatchedVideos.add(selectedVideoUrl);
//       return newWatchedVideos;
//     });

//     const { nextSublessonId, nextVideoUrl } = getNextVideoDetails();
//     if (nextVideoUrl) {
//       setSelectedSublesson(nextSublessonId);
//       setSelectedVideoUrl(nextVideoUrl);

//       // Optionally, reset progress to 0 and start playing the next video
//       setProgress(0);
//       setIsVideoPlaying(true);
//     }
//   };

//   const handlePreviousLesson = () => {
//     const { previousSublessonId, previousVideoUrl } = getPreviousVideoDetails();
//     if (previousSublessonId && previousVideoUrl) {
//       setSelectedSublesson(previousSublessonId);
//       setSelectedVideoUrl(previousVideoUrl);
//       setIsVideoPlaying(true);
//     }
//   };

//   const handleNextLesson = () => {
//     const { nextSublessonId, nextVideoUrl } = getNextVideoDetails();
//     if (nextSublessonId && nextVideoUrl) {
//       setSelectedSublesson(nextSublessonId);
//       setSelectedVideoUrl(nextVideoUrl);
//       setIsVideoPlaying(true);
//     }
//   };

//   // useEffect Hooks
//   useEffect(() => {
//     const videoElement = videoRef.current;
//     if (!videoElement) return;

//     const updateProgress = () => {
//       if (videoElement.duration > 0) {
//         const progress =
//           (videoElement.currentTime / videoElement.duration) * 100;
//         // Realtime Update with video time
//         // setProgress(progress);
//       }
//     };

//     videoElement.addEventListener("play", handlePlay);
//     videoElement.addEventListener("ended", handleEnded);
//     videoElement.addEventListener("timeupdate", updateProgress);

//     return () => {
//       videoElement.removeEventListener("play", handlePlay);
//       videoElement.removeEventListener("ended", handleEnded);
//       videoElement.removeEventListener("timeupdate", updateProgress);
//     };
//   }, [selectedVideoUrl]);

//   useEffect(() => {
//     if (sidebarData.modules) {
//       const allVideos = sidebarData.modules.flatMap((module) =>
//         module.sublessons.flatMap((sublesson) =>
//           sublesson.videofile ? [sublesson.videofile] : []
//         )
//       );
//       setTotalVideos(allVideos.length);
//     }
//   }, [sidebarData]);

//   useEffect(() => {
//     if (totalVideos > 0) {
//       setProgress((watchedVideos.size / totalVideos) * 100);
//     }
//   }, [watchedVideos, totalVideos]);

//   // Fetch data on component mount
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:4000/courseinfo/${courseid}`
//         );
//         const data = response.data;
//         setSidebarData(data);
//         console.log(data);

//         // Set the first sublesson as selected by default
//         const firstSublesson = data.modules?.[0]?.sublessons?.[0];
//         if (firstSublesson) {
//           setSelectedSublesson(firstSublesson.sublessonid);
//           setSelectedVideoUrl(firstSublesson.videofile);
//         }

//         // Initialize open sections state
//         const initialOpenSections = {};
//         data.modules.forEach((module) => {
//           initialOpenSections[module.moduleid] = false;
//         });
//         setOpenSections(initialOpenSections);
//       } catch (error) {
//         console.error("Error fetching course data:", error);
//       }
//     };

//     fetchData();
//   }, [courseid]);

//   useEffect(() => {
//     if (selectedSublesson) {
//       const module = sidebarData.modules.find((mod) =>
//         mod.sublessons.find((sub) => sub.sublessonid === selectedSublesson)
//       );

//       if (module) {
//         const sublesson = module.sublessons.find(
//           (sub) => sub.sublessonid === selectedSublesson
//         );

//         if (sublesson) {
//           setCurrentModuleName(module.modulename);
//           setCurrentSubmoduleName(sublesson.sublessonname);

//           // Assume each sublesson has only one video file
//           if (sublesson.videofile) {
//             setSelectedVideoUrl(sublesson.videofile);
//           } else {
//             setSelectedVideoUrl("");
//           }

//           // Update the openSections to expand the current module
//           setOpenSections((prevOpenSections) => ({
//             ...prevOpenSections,
//             [module.moduleid]: true,
//           }));
//         }
//       }
//     }
//   }, [selectedSublesson, sidebarData]);

//   // Helper Functions
//   const getNextVideoDetails = () => {
//     let nextSublessonId = null;
//     let nextVideoUrl = null;

//     if (selectedSublesson && sidebarData.modules) {
//       let foundCurrentSublesson = false;

//       for (let i = 0; i < sidebarData.modules.length; i++) {
//         const module = sidebarData.modules[i];
//         for (let j = 0; j < module.sublessons.length; j++) {
//           const sublesson = module.sublessons[j];
//           if (foundCurrentSublesson) {
//             // Found current sublesson, now set the next video
//             if (sublesson.videofile) {
//               nextSublessonId = sublesson.sublessonid;
//               nextVideoUrl = sublesson.videofile;
//               return { nextSublessonId, nextVideoUrl };
//             }
//           } else if (sublesson.sublessonid === selectedSublesson) {
//             // Found current sublesson
//             foundCurrentSublesson = true;
//           }
//         }

//         // If we are at the end of the module and there are more modules
//         if (foundCurrentSublesson && i < sidebarData.modules.length - 1) {
//           const nextModule = sidebarData.modules[i + 1];
//           if (nextModule.sublessons.length > 0) {
//             const firstSublesson = nextModule.sublessons[0];
//             if (firstSublesson.videofile) {
//               nextSublessonId = firstSublesson.sublessonid;
//               nextVideoUrl = firstSublesson.videofile;
//               return { nextSublessonId, nextVideoUrl };
//             }
//           }
//           break; // Stop if we found the next video in the next module
//         }
//       }
//     }

//     return { nextSublessonId, nextVideoUrl };
//   };

//   const getPreviousVideoDetails = () => {
//     let previousSublessonId = null;
//     let previousVideoUrl = null;

//     if (selectedSublesson && sidebarData.modules) {
//       for (let i = 0; i < sidebarData.modules.length; i++) {
//         const module = sidebarData.modules[i];
//         for (let j = 0; j < module.sublessons.length; j++) {
//           const sublesson = module.sublessons[j];
//           if (sublesson.sublessonid === selectedSublesson) {
//             if (j > 0) {
//               // Previous sublesson in the current module
//               const previousSublesson = module.sublessons[j - 1];
//               if (previousSublesson.videofile) {
//                 previousSublessonId = previousSublesson.sublessonid;
//                 previousVideoUrl = previousSublesson.videofile;
//               }
//             } else if (i > 0) {
//               // Last sublesson of the previous module
//               const previousModule = sidebarData.modules[i - 1];
//               if (previousModule.sublessons.length > 0) {
//                 const lastSublesson =
//                   previousModule.sublessons[
//                     previousModule.sublessons.length - 1
//                   ];
//                 previousSublessonId = lastSublesson.sublessonid;
//                 if (lastSublesson.videofile) {
//                   previousVideoUrl = lastSublesson.videofile;
//                 }
//               }
//             }
//             break;
//           }
//         }
//         if (previousSublessonId) break;
//       }
//     }

//     return { previousSublessonId, previousVideoUrl };
//   };

//   const handleSubmoduleClick = (submoduleid, moduleid) => {
//     setSelectedSublesson(submoduleid);
//     // Ensure the module containing the submodule is expanded
//     setOpenSections((prevOpenSections) => ({
//       ...prevOpenSections,
//       [moduleid]: true,
//     }));
//   };

//   const getVideoIcon = (submoduleid) => {
//     const state = videoStates[submoduleid] || {
//       isPlaying: false,
//       isEnded: false,
//     };
//     if (state.isEnded) return <FinishedIcon />;
//     if (state.isPlaying) return <PlayingIcon />;
//     return <NotPlayingIcon />;
//   };

//   const getPaddedModuleId = (module, modules) => {
//     const courseModules = modules.filter((m) => m.courseId === module.courseId);
//     const index = courseModules.findIndex(
//       (m) => m.moduleid === module.moduleid
//     );
//     return (index + 1).toString().padStart(2, "0");
//   };

//   // Render Methods
//   const { coursename, coursedescription, modules } = sidebarData;

//   const selectedSubmoduleData = sidebarData.modules
//     ?.flatMap((module) => module.sublessons)
//     .find((sublesson) => sublesson.sublessonid === selectedSublesson);

//   return (
//     <>
//       <Navbarnonuser />
//       <div className="flex flex-col md:flex-row mx-4 lg:mx-20 xl:mx-40 mt-[128px] md:mt-[188px] min-h-screen">
//         {/* Sidebar */}
//         <div className="md:w-1/4 bg-white text-black shadow-md p-4 font-sans h-[100vh] sm:h-[calc(50vh)] md:h-[calc(123vh-211px)] lg:h-[calc(134vh-168px)] overflow-y-auto scrollbar-hide">
//           <div className="mb-6">
//             <h2 className="text-sm font-bold text-orange-500">Course</h2>
//             <h3 className="text-2xl font-bold mt-4">{coursename}</h3>
//             <p className="text-gray-600 text-base mt-2">{coursedescription}</p>
//             <div className="mt-4">
//               <span className="text-sm text-gray-600">
//                 {progress.toFixed(0)}% Complete
//               </span>
//               <div className="flex items-center">
//                 <BorderLinearProgress
//                   variant="determinate"
//                   value={progress}
//                   className="w-full mr-2"
//                 />
//               </div>
//             </div>
//           </div>

//           <List component="nav">
//             {Array.isArray(modules) &&
//               modules.map((module) => (
//                 <div key={module.moduleid}>
//                   <ListItem
//                     button
//                     onClick={() => handleToggle(module.moduleid)}
//                     style={{
//                       borderBottom: "1px solid #D6D9E4",
//                     }}
//                   >
//                     <ListItemText
//                       disableTypography
//                       primary={
//                         <span>
//                           <span
//                             style={{
//                               color: "#646D89",
//                               position: "absolute",
//                               left: "0",
//                             }}
//                           >
//                             {getPaddedModuleId(module, modules)}
//                           </span>{" "}
//                           {module.modulename}
//                         </span>
//                       }
//                       className="text-base font-sans px-6 py-6"
//                     />
//                     {openSections[module.moduleid] ? (
//                       <ExpandLess />
//                     ) : (
//                       <ExpandMore />
//                     )}
//                   </ListItem>
//                   <Collapse
//                     in={openSections[module.moduleid]}
//                     timeout="auto"
//                     unmountOnExit
//                   >
//                     <List component="div" disablePadding>
//                       {module.sublessons.map((sublesson, index) => {
//                         const isCurrentSublesson =
//                           selectedSublesson === sublesson.sublessonid;
//                         const isFirstSublesson = index === 0;
//                         const isLastSublesson = module.sublessons.length - 1;
//                         const isHovered =
//                           hoveredSublessonId === sublesson.sublessonid;

//                         return (
//                           <ListItem
//                             button
//                             key={sublesson.sublessonid}
//                             onClick={() =>
//                               handleSubmoduleClick(
//                                 sublesson.sublessonid,
//                                 module.moduleid
//                               )
//                             }
//                             onMouseEnter={() =>
//                               handleMouseEnter(sublesson.sublessonid)
//                             }
//                             onMouseLeave={handleMouseLeave}
//                             style={{
//                               backgroundColor: isCurrentSublesson
//                                 ? "#F6F7FC"
//                                 : isHovered
//                                 ? "#F6F7FC"
//                                 : "transparent",
//                               borderRadius: "8px",
//                               marginTop: isFirstSublesson ? "24px" : "0",
//                               transition: "background-color 0.3s",
//                             }}
//                           >
//                             <ListItemIcon>
//                               {getVideoIcon(sublesson.sublessonid)}
//                             </ListItemIcon>
//                             <ListItemText
//                               disableTypography
//                               primary={sublesson.sublessonname}
//                               style={{
//                                 color: "#646D89",
//                                 fontFamily: "Inter",
//                               }}
//                             />
//                           </ListItem>
//                         );
//                       })}
//                     </List>
//                   </Collapse>
//                 </div>
//               ))}
//           </List>
//         </div>

//         {/* Video content */}
//         <div className="flex-1 p-4 lg:p-6 text-black">
//           <h1 className="text-2xl font-bold mb-4">
//             {selectedSubmoduleData
//               ? selectedSubmoduleData.sublessonname
//               : coursename}
//           </h1>
//           <div className="mb-4 flex justify-center">
//             {selectedVideoUrl && (
//               <video
//                 ref={videoRef}
//                 autoPlay
//                 width="739"
//                 height="460"
//                 src={selectedVideoUrl}
//                 title="Course Video"
//                 controls
//                 muted
//                 className="rounded-lg shadow-md w-full max-w-full"
//               ></video>
//             )}
//           </div>
//           {/* Assignment */}
//           {/* <div className="bg-blue-50 border border-gray-300 rounded-lg p-4 lg:p-6 shadow-md">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Assignment</h2>
//               <span className="bg-yellow-200 text-yellow-800 text-sm font-medium px-2 py-1 rounded">
//                 Pending
//               </span>
//             </div>
//             <div className="mb-4">
//               <label className="block text-gray-700 text-sm font-semibold mb-2">
//                 What are the 4 elements of service design?
//               </label>
//               <textarea
//                 className="bg-white w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
//                 rows="3"
//                 placeholder="Answer..."
//               ></textarea>
//             </div>
//             <div className="flex justify-between items-center">
//               <button className="bg-[#2F5FAC] text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
//                 Send Assignment
//               </button>
//               <span className="text-gray-500 text-sm">
//                 Assign within 2 days
//               </span>
//             </div>
//           </div> */}
//         </div>
//       </div>
//       {/* Footer */}
//       <footer className="bg-white py-4 flex justify-between items-center border-t border-gray-300 mt-6 md:mt-0">
//         <button
//           className="text-blue-600 font-bold ml-4 md:ml-16 my-2 md:my-9"
//           onClick={handlePreviousLesson}
//         >
//           Previous Lesson
//         </button>
//         <button
//           className="bg-[#2F5FAC] mr-4 md:mr-14 my-2 md:my-5 text-white font-bold py-2 px-4 rounded-lg"
//           onClick={() =>
//             progress === 100
//               ? (alert("Complete lesson"), navigate("/"))
//               : handleNextLesson()
//           }
//         >
//           {progress === 100 ? "Complete Lesson" : "Next Lesson"}
//         </button>
//       </footer>
//       {/* General Footer */}
//       <GeneralFooter />
//     </>
//   );
// };

// export default Sidebar;
