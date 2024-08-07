import Uploadvideo from "../../../assets/image/Uploadvideo.png";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import drag1 from "../../../assets/icons/admin/drag1.png";
import NavbarEditSubLesson from "../../admin/navbar/navbar-editsublesson";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import supabase from "../../../utils/supabaseClient";
import ConfirmationModal from "../../../components/admin/modal/delete-course-confirmation";

function EditSubLessonFrom() {
  const [lessons, setLessons] = useState([]);
  const [subLessons, setSubLessons] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  // console.log(subLessons);
  // console.log(videoPreviewUrls);
  const getLesson = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4000/admin/lesson/${params.lessonId}`
      );
      setLessons(result.data.data[0]);
    } catch (error) {
      console.error("Error getLesson", error);
    }
  };
  const getVideoSublesson = (result) => {
    const resultVideo = result.map((v) => v.videofile);
    setVideoFiles(resultVideo);
    setVideoPreviewUrls(resultVideo);
  };
  const getSublesson = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4000/admin/sublesson/${params.lessonId}`
      );
      getVideoSublesson(result.data.data);
      setSubLessons(result.data.data);
    } catch (error) {
      console.error("Error getSublesson", error);
    }
  };

  ///modal
  const deleteLesson = async () => {
    await axios.delete(`http://localhost:4000/admin/lesson/${params.lessonId}`);
    navigate("/admin/courselist");
    handleCloseModal();
  };
  const deleteSublesson = async (sublessonid) => {
    console.log(sublessonid);
    try {
      await axios.delete(
        `http://localhost:4000/admin/sublesson/${sublessonid}`
      );
      getSublesson();
    } catch (error) {
      console.log("Error deleteSublesson", error);
    }
  };
  const handleOpenModal = (sublessonid) => {
    setSelectedCourseId(sublessonid);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCourseId(null);
  };
  const handleConfirmDelete = () => {
    if (selectedCourseId) {
      deleteLesson(selectedCourseId);
    }
  };

  const postSublesson = async () => {
    try {
      const sublesson = await axios.post(
        `http://localhost:4000/admin/sublesson/${params.lessonId}`
      );
      setSubLessons([...subLessons, sublesson.data.data]);
      setVideoFiles([...videoFiles, ""]);
      setVideoPreviewUrls([...videoPreviewUrls, ""]);
    } catch (error) {
      console.log("Error reservedSublesson", error);
    }
  };

  const putsublessonDrag = async (newSublesson) => {
    const editSublesson = newSublesson;
    try {
      await axios.put(
        `http://localhost:4000/admin/sublessondrag/${params.lessonId}`,
        [editSublesson]
      );
    } catch (error) {
      console.log("Error putSublessonDrag", error);
    }
  };

  useEffect(() => {
    getLesson();
    getSublesson();
  }, []);

  ///Drag and Drop
  const dragItem = useRef(0);
  const draggedOverItem = useRef(0);
  const handleSort = () => {
    const itemClone = [...subLessons];
    const temp = itemClone[dragItem.current];
    const temp2 = itemClone[draggedOverItem.current];
    itemClone[dragItem.current] = itemClone[draggedOverItem.current];
    itemClone[draggedOverItem.current] = temp;

    console.log(itemClone);
    console.log(temp);
    console.log(temp2);

    const videoClone = [...videoFiles];
    const tempvideoClone = videoClone[dragItem.current];
    videoClone[dragItem.current] = videoClone[draggedOverItem.current];
    videoClone[draggedOverItem.current] = tempvideoClone;

    const videoPreviewClone = [...videoPreviewUrls];
    const tempVideoPreviewClone = videoPreviewClone[dragItem.current];
    videoPreviewClone[dragItem.current] =
      videoPreviewClone[draggedOverItem.current];
    videoPreviewClone[draggedOverItem.current] = tempVideoPreviewClone;
    setSubLessons(itemClone);
    putsublessonDrag(itemClone);
    setVideoFiles(videoClone);
    setVideoPreviewUrls(videoPreviewClone);
  };

  ///VDO
  const onSubmit = async (data) => {
    try {
      // Upload videos and get URLs
      const videoUrls = await Promise.all(
        videoFiles.map((file, index) => uploadVideoFile(file, index))
      );
      // Send data to backend
      const editLesson = lessons;
      const editSublesson = subLessons;
      // console.log(editLesson);
      console.log(editSublesson);
      try {
        await axios.put(
          `http://localhost:4000/admin/sublesson/${params.lessonId}`,
          [editLesson, editSublesson, videoUrls]
        );
      } catch (error) {
        console.log("Error putLessonAndSublesson", error);
      }
      alert("Add Lesson and SubLesson Successfully");
      navigate("/admin/courselist");
    } catch (error) {
      console.error(
        "There was an error adding the lesson and sublesson:",
        error
      );
    }
  };
  async function uploadVideoFile(file) {
    try {
      if (!file) {
        throw new Error("You must select a video to upload.");
      }
      if (typeof file === "string") {
        return file;
      }
      console.log(typeof file);
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `course/lesson/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("course")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      const {
        data: { publicUrl },
        error: urlError,
      } = supabase.storage.from("course").getPublicUrl(filePath);

      if (urlError) {
        throw urlError;
      }

      return publicUrl;
    } catch (error) {
      console.log(error);
      alert(error.message);
      throw error;
    }
  }

  const handleVideoFileChange = (e, index) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }
    // Validate file size (max 20 MB)
    const maxSizeInBytes = 20 * 1024 * 1024; // 20 MB in bytes
    if (selectedFile.size > maxSizeInBytes) {
      alert("File size should not exceed 20 MB");
      return;
    }
    const newVideoFiles = [...videoFiles];
    const newVideoPreviewUrls = [...videoPreviewUrls];
    newVideoFiles[index] = selectedFile;
    setVideoFiles(newVideoFiles);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      newVideoPreviewUrls[index] = fileReader.result;
      setVideoPreviewUrls(newVideoPreviewUrls);
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const deleteVideoFile = (index) => {
    // Remove the file and preview URL
    setVideoFiles(videoFiles.toSpliced(index, 1, ""));
    setVideoPreviewUrls(videoPreviewUrls.toSpliced(index, 1, ""));
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <button onClick={onSubmit}>
        <NavbarEditSubLesson text="Edit" />
      </button>
      <div
        className={`mt-[50px] mx-8 w-[1120px] h-fit bg-white rounded-[16px] border-[1px] mb-[80px]`}
      >
        <div className=" mx-8 p-8">
          <form onSubmit={onSubmit}>
            <div>
              <div className="mx-[40px] w-[920px] h-[76px]">
                <label className="w-full h-[24px] text-black text-[16px]">
                  Lesson name *
                </label>
                <input
                  className="w-full h-[48px] bg-white text-black border-[1px] rounded-[8px] pl-[20px]"
                  placeholder="Place Holder"
                  value={lessons.modulename}
                  onChange={(event) => {
                    setLessons({ ...lessons, modulename: event.target.value });
                  }}
                />
              </div>
              <div className="mx-[40px]">
                <hr className="my-8 border-1 " />
              </div>
              <div className="mx-[40px] text-[20px] font-[600] text-[#646D89]">
                Sub-Lesson
              </div>
            </div>
            {subLessons
              .map((item, index) => {
                return (
                  <article
                    key={index}
                    className="relative mt-[30px] mx-[40px] w-[920px] h-[340px] bg-Gray-100 flex justify-center items-center rounded-[16px] border-[1px]"
                    draggable
                    onDragStart={() => (dragItem.current = index)}
                    onDragEnter={() => (draggedOverItem.current = index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <div className="w-[888px] h-[292px] flex gap-[24px]">
                      <div className="w-[26px] h-[76px] text-[#C8CCDB]">
                        <img src={drag1} alt="drag icon" />
                      </div>
                      <div className="w-[747px] flex flex-col justify-center gap-[23px]">
                        <div className="flex flex-col gap-[4px]">
                          <label className="text-Body2 font-Body2 text-[#08090D]">
                            Sub-Lesson name *
                          </label>
                          <input
                            id="sub-lesson-name"
                            type="text"
                            className="w-[530px] h-[48px] bg-white text-black border-[1px] border-[#D6D9E4] rounded-[8px] pl-[20px] placeholder:text-black"
                            value={item.sublessonname}
                            onChange={(e) => {
                              // const newSublesson = [...subLessons]
                              setSubLessons([
                                ...subLessons.toSpliced(index, 1, {
                                  ...subLessons[index],
                                  sublessonname: e.target.value,
                                }),
                              ]);
                            }}
                          />
                        </div>
                        <div className="flex flex-col gap-[8px]">
                          <h1 className="font-[400] text-[16px] text-[#07090D]">
                            Video *
                          </h1>
                          {item.videofile || videoPreviewUrls[index] ? (
                            <label className="cursor-pointer w-[160px] h-[160px] rounded-[8px] bg-Gray-200 flex items-center justify-center">
                              <video
                                src={item.videofile || videoPreviewUrls[index]}
                                alt="upload"
                                className="absolute m-auto rounded-md"
                                style={{
                                  maxWidth: "240px",
                                  maxHeight: "240px",
                                  objectFit: "cover",
                                }}
                                controls
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  deleteVideoFile(index);
                                  // Also remove the sub-lesson
                                }}
                                className="absolute"
                              >
                                <XMarkIcon className="size-5 text-white bg-purple-700 rounded-full absolute bottom-[3.5rem] left-[6.5rem]" />
                              </button>
                            </label>
                          ) : (
                            <label
                              className="cursor-pointer w-[160px] h-[160px] rounded-[8px] bg-Gray-200 flex items-center justify-center"
                              id="drop"
                            >
                              <img src={Uploadvideo} alt="upload" />
                              <input
                                type="file"
                                name="videofile"
                                className="hidden"
                                accept="video/mp4"
                                id="input"
                                onChange={(e) =>
                                  handleVideoFileChange(e, index)
                                }
                              />
                            </label>
                          )}
                        </div>
                      </div>
                      <div className="w-[67px] h-[32px] text-center text-[16px] font-[700] text-Blue-500 cursor-pointer">
                        {subLessons.length > 1 ? (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              deleteVideoFile(index);
                              deleteSublesson(item.sublessonid);
                            }}
                          >
                            Delete
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              alert("Cannot delete sub-lesson");
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

            <button
              className="mx-[40px] mt-[32px] border-[1px] border-Orange-500 shadow-md bg-white text-Orange-500 rounded-[12px] w-[208px] h-[60px] text-[16px] font-[700]"
              type="button"
              onClick={() => {
                postSublesson();
              }}
            >
              + Add Sub-Lesson
            </button>
          </form>
        </div>
      </div>
      <button onClick={handleOpenModal} className="mb-[80px] w-[1120px] mx-8">
        <h1 className="text-Blue-500 text-[16px] font-[700] text-end cursor-pointer">
          Delete lesson
        </h1>
      </button>
      <ConfirmationModal
        text="Are you sure you want to delete this lesson?"
        textname="Yes, I want to delete this lesson"
        open={openModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default EditSubLessonFrom;
