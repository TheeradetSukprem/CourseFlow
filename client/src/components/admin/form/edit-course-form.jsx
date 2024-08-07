import { useState, useEffect } from "react";
import upload from "../../../assets/image/upload.png";
import pdf from "../../../assets/image/pdf.png";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import EditCourseSubLessonTable from "../editcourse-sublesson";
import NavbarEditCourse from "../navbar/navbar-editcourse";
import supabase from "../../../utils/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import PendingSvg from "../../shared/pending-svg";
import {
  validateFile,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE_MB,
  IMAGE_FORMATS,
  VIDEO_FORMATS,
} from "../../../utils/fileValidations";

function EditCourseForm() {
  const [file, setFile] = useState("");
  const [pdfFile, setPdfFileUpload] = useState("");
  const [pdfFileName, setPdfFileName] = useState(""); // New state for PDF file name
  const [previewUrl, setPreviewUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [videoFile, setVideoFileState] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const { id } = useParams();
  const [inputData, setInputData] = useState({
    coursename: "",
    price: "",
    description: "",
    coursesummary: "",
    courselearningtime: "",
    videofile: "",
    imagefile: "",
    pdffile: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:4000/courses/list/${id}`)
      .then((res) => {
        // console.log("Response received:", res.data.data[0]);
        // console.log(id);
        setInputData(res.data.data[0]);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Start the spinner
    try {
      // Check if required files are present
      // if (!videoUrl || !imageUrl) {
      //   alert("Please upload require file.");
      //   setLoading(false);
      //   return; // Stop execution if any file is missing
      // }

      let imageUrl = inputData.imagefile;
      let videoUrl = inputData.videofile;
      let pdfUrl = inputData.pdffile;

      if (file) {
        imageUrl = await UploadPreviewImage(file);
      }

      if (videoFile) {
        videoUrl = await uploadVideoFile(videoFile);
      }

      if (pdfFile) {
        pdfUrl = await UploadPDF(pdfFile);
      }

      const updatedData = {
        ...inputData,
        imagefile: imageUrl,
        videofile: videoUrl,
        pdffile: pdfUrl,
        updateddate: new Date().toISOString(),
      };

      console.log("Updated data being sent to backend:", updatedData);

      console.log("Update data", updatedData);
      await axios.put(`http://localhost:4000/courses/${id}`, updatedData);
      setLoading(false);
      alert("Data Updated Successfully!");
      navigate("/admin/courselist");
    } catch (error) {
      console.error("Error updating data:", error);
      setLoading(false);
    }
  };

  /*const [imagefile, setImgFile] = useState('')
  const [videofile,setVideoFile] = useState('')
  const [pdffile, setPdfFile] = useState('')*/

  const sanitizeFileName = (name) => {
    return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  };

  async function UploadPreviewImage(file) {
    try {
      validateFile(file, IMAGE_FORMATS, MAX_IMAGE_SIZE_MB);
      const fileExt = file.name.split(".").pop();
      const sanitizedCourseName = sanitizeFileName(inputData.coursename.trim());
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `course/${sanitizedCourseName}/cover_img/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("course")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      const { error: urlError } = supabase.storage
        .from("course")
        .getPublicUrl(filePath);

      if (urlError) {
        throw urlError;
      }

      const profileUrl = supabase.storage.from("course").getPublicUrl(filePath)
        .data.publicUrl;

      return profileUrl;
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }
    setFile(selectedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);

    // Logging file details
    console.log("Selected File:", selectedFile);
    console.log("File Type:", selectedFile.type);
    console.log("File Size:", selectedFile.size);
  };

  const handlePdfFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }

    setPdfFileUpload(selectedFile);
    setPdfFileName(selectedFile.name); // Set the PDF file name
  };

  //uplaod pdf file
  async function UploadPDF(pdfFile) {
    try {
      if (!pdfFile) {
        throw new Error("You must select a PDF file to upload.");
      }

      const originalFileName = pdfFile.name; // Use the original file name
      const sanitizedFileName = sanitizeFileName(inputData.coursename.trim());
      const filePath = `course/${sanitizedFileName}/pdf_files/${originalFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("course")
        .upload(filePath, pdfFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data, error: urlError } = await supabase.storage
        .from("course")
        .getPublicUrl(filePath);

      if (urlError) {
        throw urlError;
      }

      const pdfUrl = data.publicUrl;
      return pdfUrl;
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }

  async function uploadVideoFile(file) {
    try {
      validateFile(file, VIDEO_FORMATS, MAX_VIDEO_SIZE_MB);
      const fileExt = file.name.split(".").pop();
      const sanitizedCourseName = sanitizeFileName(inputData.coursename.trim());
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `course/${sanitizedCourseName}/preview_video/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("course")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      const { error: urlError } = supabase.storage
        .from("course")
        .getPublicUrl(filePath);

      if (urlError) {
        throw urlError;
      }

      const videoUrl = supabase.storage.from("course").getPublicUrl(filePath)
        .data.publicUrl;

      return videoUrl;
    } catch (error) {
      alert(error.message);
      throw error;
    }
  }
  //Video preview
  const handleVideoFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }
    setVideoFileState(selectedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setVideoPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);

    // Logging file details
    console.log("Selected File:", selectedFile);
    console.log("File Type:", selectedFile.type);
    console.log("File Size:", selectedFile.size);
  };

  // Delete preview image
  const deletePreviewImage = async () => {
    const filePath = inputData.imagefile.replace(CDNURL, "");
    await deleteFileFromSupabase(filePath);
    setInputData({ ...inputData, imagefile: "" });
    setPreviewUrl("");
  };

  // Delete PDF file
  const deletePdfFile = async () => {
    const filePath = inputData.pdffile.replace(CDNURL, "");
    await deleteFileFromSupabase(filePath);
    setInputData({ ...inputData, pdffile: "" });
    setPdfUrl(null);
  };

  // Delete video file
  const deleteVideoFile = async () => {
    const filePath = inputData.videofile.replace(CDNURL, "");
    await deleteFileFromSupabase(filePath);
    setInputData({ ...inputData, videofile: "" });
    setVideoPreviewUrl("");
  };

  const CDNURL =
    "https://igdllimavmpalwpkphmh.supabase.co/storage/v1/object/public/course/course/";

  async function deleteFileFromSupabase(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from("course")
        .remove([filePath]);

      const updatedData = {
        ...inputData,
        imagefile: "",
        videoFile: "",
        pdffile: "",
      };

      await axios.put(`http://localhost:4000/courses/${id}`, updatedData);

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file.");
    }
  }

  return (
    <div>
      {/* Loading Section */}
      {loading && <PendingSvg text="Editing Course..." />}
      <NavbarEditCourse handleSubmit={handleSubmit} text={"Edit"} />
      <div className="mt-8 mx-8 w-[1120px] bg-white rounded-md border-2 ">
        <div className="mx-8 p-8">
          <form>
            <div className="w-[920px] h-[76px]">
              <label className="w-full h-[24px] text-black ">
                Course name *
              </label>
              <input
                className="w-full h-[48px] bg-white text-black border-2 rounded-md pl-2"
                placeholder="Course Name"
                name="coursename"
                type="text"
                value={inputData.coursename}
                onChange={(e) =>
                  setInputData({ ...inputData, coursename: e.target.value })
                }
              />
            </div>
            <div className="w-[920px] h-[76px] flex flex-row gap-8 mt-8">
              <div className="w-[420px] h-[76px]">
                <label className="w-full h-[24px] text-black">Price *</label>
                <input
                  className="w-full h-[48px] bg-white text-black border-2 rounded-md pl-2"
                  placeholder="Price"
                  name="price"
                  type="text"
                  value={inputData.price}
                  onChange={(e) =>
                    setInputData({ ...inputData, price: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="w-full h-[24px] text-black">
                  Total learning time *
                </label>
                <input
                  className="w-full h-[48px] bg-white text-black border-2 rounded-md pl-2"
                  placeholder="Learning Time"
                  name="courselearningtime"
                  type="text"
                  value={inputData.courselearningtime}
                  onChange={(e) =>
                    setInputData({
                      ...inputData,
                      courselearningtime: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="w-[920px] h-[100px] gap-8 mt-8">
              <label className="w-full h-[24px] text-black">
                Course summary *
              </label>
              <input
                className="w-full h-[72px] bg-white text-black border-2 rounded-md pl-2"
                placeholder="Course Summary"
                name="coursesummary"
                type="text"
                value={inputData.coursesummary}
                onChange={(e) =>
                  setInputData({ ...inputData, coursesummary: e.target.value })
                }
              />
            </div>
            <div className="w-[920px] h-[220px] gap-8 mt-8">
              <label className="w-full h-[24px] text-black">
                Course detail *
              </label>
              <textarea
                className="w-full h-[192px] bg-white text-black border-2 rounded-md pl-2"
                placeholder="Course Detail"
                name="description"
                value={inputData.description}
                onChange={(e) =>
                  setInputData({ ...inputData, description: e.target.value })
                }
              />
            </div>
            <div className="my-10 gap-8 ">
              <label className="w-full h-[24px] text-black">
                Cover image *
              </label>
              {inputData.imagefile ? (
                <label
                  className="w-[240PX] h-[240PX] px-4 bg-slate-200 rounded-md appearance-none cursor-pointer hover:border-slate-20 focus:outline-none flex items-center justify-center"
                  id="drop"
                >
                  <span>
                    <img
                      src={inputData.imagefile}
                      alt="cover image"
                      className="max-w-[240px] max-h-[240px] object-cover"
                    />
                  </span>
                  <button
                    type="button"
                    onClick={deletePreviewImage}
                    className="absolute"
                  >
                    <XMarkIcon className="size-5 text-white bg-purple-700 rounded-full absolute bottom-[5.8rem] left-[6rem]" />
                  </button>
                </label>
              ) : (
                <label
                  className="w-[240PX] h-[240PX] px-4 bg-slate-200 rounded-md appearance-none cursor-pointer hover:border-slate-20 focus:outline-none flex items-center justify-center"
                  id="drop"
                >
                  {previewUrl ? (
                    <label className="w-[240PX] h-[240PX] px-4 bg-slate-200 rounded-md appearance-none cursor-pointer hover:border-slate-20 focus:outline-none flex items-center justify-center">
                      <img
                        src={previewUrl}
                        alt="cover image"
                        className="max-w-[240px] max-h-[240px] object-cover"
                      />

                      <button
                        type="button"
                        onClick={deletePreviewImage}
                        className="absolute"
                      >
                        <XMarkIcon className="size-5 text-white bg-purple-700 rounded-full absolute bottom-[5.8rem] left-[6rem]" />
                      </button>
                    </label>
                  ) : (
                    <label
                      className="w-[240PX] h-[240PX] px-4 bg-slate-200 rounded-md appearance-none cursor-pointer hover:border-slate-20 focus:outline-none flex items-center justify-center"
                      id="drop"
                    >
                      <img src={upload} alt="upload" />
                      <input
                        type="file"
                        name="imagefile"
                        className="hidden"
                        accept="image/png,image/jpeg"
                        id="input"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </label>
              )}
            </div>
            <div className="my-10 gap-8 ">
              <label className="w-full h-[24px] text-black">
                Video Trailer *
              </label>
              {inputData.videofile ? (
                <label
                  className="w-[240PX] h-[240PX] px-4 bg-slate-200 rounded-md appearance-none cursor-pointer hover:border-slate-20 focus:outline-none flex items-center justify-center"
                  id="drop"
                >
                  <span>
                    <video
                      src={inputData.videofile}
                      alt="upload"
                      className="max-w-[240px] max-h-[240px] object-cover"
                      controls
                    />
                  </span>
                  <button
                    type="button"
                    onClick={deleteVideoFile}
                    className="absolute"
                  >
                    <XMarkIcon className="size-5 text-white bg-purple-700 rounded-full absolute bottom-[5.8rem] left-[6rem]" />
                  </button>
                </label>
              ) : (
                <label
                  className="w-[240PX] h-[240PX] px-4 bg-slate-200 rounded-md appearance-none cursor-pointer hover:border-slate-20 focus:outline-none flex items-center justify-center"
                  id="drop"
                >
                  {videoPreviewUrl ? (
                    <label className="w-[240PX] h-[240PX] px-4 bg-slate-200 rounded-md appearance-none cursor-pointer hover:border-slate-20 focus:outline-none flex items-center justify-center">
                      <video
                        src={videoPreviewUrl}
                        alt="upload"
                        className="max-w-[240px] max-h-[240px] object-cover"
                        controls
                      />

                      <button
                        type="button"
                        onClick={deleteVideoFile}
                        className="absolute"
                      >
                        <XMarkIcon className="size-5 text-white bg-purple-700 rounded-full absolute bottom-[5.8rem] left-[6rem]" />
                      </button>
                    </label>
                  ) : (
                    <label
                      className="w-[240PX] h-[240PX] px-4 bg-slate-200 rounded-md appearance-none cursor-pointer hover:border-slate-20 focus:outline-none flex items-center justify-center"
                      id="drop"
                    >
                      <img src={upload} alt="upload" />
                      <input
                        type="file"
                        name="videofile"
                        className="hidden"
                        accept="video/mp4"
                        id="input"
                        onChange={handleVideoFileChange}
                      />
                    </label>
                  )}
                </label>
              )}
            </div>

            <div className="my-10 gap-8 relative">
              <label className="w-full h-[24px] text-black">
                Attach File (Optional)
              </label>
              {inputData.pdffile || pdfFile ? (
                <label
                  className="w-[240PX] h-[240PX] px-4 bg-slate-200 rounded-md appearance-none cursor-pointer hover:border-slate-20 focus:outline-none flex items-center justify-center"
                  id="drop"
                >
                  <Link to={inputData.pdffile} target="_blank">
                    <img src={pdf} alt="pdf" />
                  </Link>

                  <button
                    type="button"
                    onClick={deletePdfFile}
                    className="absolute"
                  >
                    <XMarkIcon className="size-5 text-white bg-purple-700 rounded-full absolute bottom-[5.8rem] left-[6rem]" />
                  </button>
                </label>
              ) : (
                <label
                  className="w-[240PX] h-[240PX] px-4 bg-slate-200 rounded-md appearance-none cursor-pointer hover:border-slate-20 focus:outline-none flex items-center justify-center"
                  id="drop"
                >
                  <span>
                    <img src={upload} alt="upload" />
                    <input
                      type="file"
                      name="pdffile"
                      className="hidden"
                      accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      id="pdfInput"
                      onChange={handlePdfFileChange}
                    />
                  </span>
                </label>
              )}
            </div>
          </form>
        </div>
      </div>
      <EditCourseSubLessonTable courseId={id} />
    </div>
  );
}

export default EditCourseForm;
