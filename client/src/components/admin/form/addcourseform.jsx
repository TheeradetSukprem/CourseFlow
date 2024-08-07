import { useState, useEffect, useRef } from "react";
import upload from "../../../assets/image/upload.png";
import pdf from "../../../assets/image/pdf.png";
import AddCourseSubLessonTable from "../addcourse-sublesson";
import axios from "axios";
import NavbarAddCourse from "../navbar/navbar-addcourse"; // Adjust the import path as needed
import supabase from "../../../utils/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { useNavigate, Link } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/solid";
import PendingSvg from "../../shared/pending-svg";
import {
  validateFile,
  MAX_IMAGE_SIZE_MB,
  MAX_VIDEO_SIZE_MB,
  IMAGE_FORMATS,
  VIDEO_FORMATS,
} from "../../../utils/fileValidations";

function AddCourseFrom() {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [pdfFile, setPdfFileUpload] = useState(" ");
  const [pdfFileName, setPdfFileName] = useState(""); // New state for PDF file name
  const [previewUrl, setPreviewUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [courses, setCourses] = useState(" ");
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFileState] = useState("");
  const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
  const [createForm, setCreateForm] = useState({
    coursename: " ",
    price: " ",
    description: " ",
    coursesummary: " ",
    courselearningtime: " ",
    videofile: " ",
    imagefile: " ",
    pdfFile: " ",
  });

  const formRef = useRef(null);

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    const result = await axios.get("http://localhost:4000/courses");
    setCourses(result.data.courses);
  };

  const updateCreateFormField = (e) => {
    const { name, value } = e.target;

    setCreateForm({
      ...createForm,
      [name]: value,
    });
  };

  //validate
  const validateForm = () => {
    const {
      coursename,
      price,
      courselearningtime,
      coursesummary,
      description,
      videofile,
      imagefile,
    } = createForm;

    if (!coursename.trim()) {
      alert("Course name is required");
      return false;
    }
    if (!price.trim()) {
      alert("Price is required");
      return false;
    }
    if (!courselearningtime.trim()) {
      alert("Total learning time is required");
      return false;
    }
    if (!coursesummary.trim()) {
      alert("Course summary is required");
      return false;
    }
    if (!description.trim()) {
      alert("Course detail is required");
      return false;
    }

    // Additional checks for specific formats can be added here (e.g., number for price)

    return true;
  };

  const createCourse = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Stop execution if form is not valid
    }
    let collectCourseid;
    setLoading(true); // Start the spinner
    try {
      // Check if required files are present
      if (!file || !videoFile) {
        alert("Please upload require file.");
        setLoading(false);
        return; // Stop execution if any file is missing
      }

      // Upload the image before submitting the form
      const imageUrl = await UploadPreviewImage(file);
      const pdfFileUrl = await UploadPDF(pdfFile);
      const videoUrl = await uploadVideoFile(videoFile);

      const formData = {
        ...createForm,
        imagefile: imageUrl,
        pdffile: pdfFileUrl,
        videofile: videoUrl,
      };

      const res = await axios.post("http://localhost:4000/courses", formData);
      const { courseid } = res.data.data[0];
      console.log(res.data.data[0]); //log data
      collectCourseid = courseid;

      setCreateForm({
        coursename: "",
        price: "",
        description: "",
        coursesummary: "",
        courselearningtime: "",
        videofile: "",
        imagefile: "",
        pdffile: "",
      });

      console.log(setCreateForm);
      alert("Course added successfully");

      // Navigate to the edit course page
      //navigate(`/admin/editcourse/${courseid}`);
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setLoading(false); // Stop the spinner
    }
    return collectCourseid || null;
  };

  const deletecourse = async (_id) => {
    const res = await axios.delete(`http://localhost:4000/courses/${_id}`);
    console.log(res);

    const newCourses = [...courses].filter((course) => {
      return course._id !== _id;
    });
    setCourses(newCourses);
  };

  const handleCreateCourseClick = () => {
    let collectCourseid;
    if (formRef.current) {
      collectCourseid = formRef.current.requestSubmit(); // Trigger form submission
      console.log(collectCourseid);
    }
    return collectCourseid || null;
  };

  // Replace any non-alphanumeric characters in the course name with underscores
  const sanitizeFileName = (name) => {
    return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  };

  async function UploadPreviewImage(file) {
    try {
      validateFile(file, IMAGE_FORMATS, MAX_IMAGE_SIZE_MB);

      const fileExt = file.name.split(".").pop();
      const sanitizedCourseName = sanitizeFileName(
        createForm.coursename.trim()
      );
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

  //uplaod pdf file
  async function UploadPDF(pdfFile) {
    try {
      if (!pdfFile) {
        throw new Error("You must select a PDF file to upload.");
      }

      const originalFileName = pdfFile.name; // Use the original file name
      const sanitizedFileName = sanitizeFileName(createForm.coursename.trim());
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

  const handlePdfFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }

    setPdfFileUpload(selectedFile);
    setPdfFileName(selectedFile.name); // Set the PDF file name

    // Upload PDF file and set URL
    try {
      console.log("Uploaded PDF URL:", pdfUrl);
    } catch (error) {
      console.error("PDF Upload Error:", error);
    }

    setPdfFileUpload(selectedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPdfUrl(fileReader.result);
    };
    fileReader.readAsDataURL(selectedFile);

    // Logging file details
    console.log("Selected File:", selectedFile);
    console.log("File Type:", selectedFile.type);
    console.log("File Size:", selectedFile.size);
  };

  async function uploadVideoFile(file) {
    try {
      validateFile(file, VIDEO_FORMATS, MAX_VIDEO_SIZE_MB);

      const fileExt = file.name.split(".").pop();
      const sanitizedCourseName = sanitizeFileName(
        createForm.coursename.trim()
      );
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
  const deletePreviewImage = () => {
    setCreateForm({ ...createForm, imagefile: "" });
    setPreviewUrl("");
  };

  // Delete PDF file
  const deletePdfFile = () => {
    setCreateForm({ ...createForm, pdffile: "" });
    setPdfUrl(null);
  };

  // Delete video file
  const deleteVideoFile = () => {
    setCreateForm({ ...createForm, videofile: "" });
    setVideoPreviewUrl("");
  };

  return (
    <div>
      {/* Loading Section */}
      {loading && <PendingSvg text="Creating Course..." />}
      <NavbarAddCourse createCourse={createCourse} />
      <div className="mt-8 mx-8 w-[1120px] bg-white rounded-md border-2">
        <div className="mx-8 p-8">
          <form ref={formRef} onSubmit={createCourse}>
            {/* Form fields */}
            <div className="w-[920px] h-[76px]">
              <label className="w-full h-[24px] text-black">
                Course name *
              </label>
              <input
                className="w-full h-[48px] bg-white text-black border-2 rounded-md pl-2"
                placeholder="Course name"
                value={createForm.coursename}
                name="coursename"
                type="text"
                onChange={updateCreateFormField}
              />
            </div>
            <div className="w-[920px] h-[76px] flex flex-row gap-8 mt-8 ">
              <div className="w-[420px] h-[76px] ">
                <label className="w-full h-[24px] text-black gap-4">
                  Price *
                </label>
                <input
                  className="w-full h-[48px] bg-white text-black border-2 rounded-md pl-2"
                  placeholder="Price"
                  value={createForm.price}
                  name="price"
                  type="text"
                  onChange={updateCreateFormField}
                />
              </div>
              <div>
                <label className="w-full h-[24px] text-black gap-4 ">
                  Total learning time *
                </label>
                <input
                  className="w-full h-[48px] bg-white text-black border-2 rounded-md pl-2"
                  placeholder="Total learning time"
                  value={createForm.courselearningtime}
                  name="courselearningtime"
                  type="text"
                  onChange={updateCreateFormField}
                />
              </div>
            </div>
            <div className="w-[920px] h-[100px] gap-8 mt-8">
              <label className="w-full h-[24px] text-black">
                Course summary *
              </label>
              <input
                className="w-full h-[72px] bg-white text-black border-2 rounded-md pl-2"
                placeholder="Course summary "
                value={createForm.coursesummary}
                name="coursesummary"
                type="text"
                onChange={updateCreateFormField}
              />
            </div>

            <div className="w-[920px] h-[220px] gap-8 mt-8">
              <label className="w-full h-[24px] text-black">
                Course detail *
              </label>
              <textarea
                className="w-full h-[192px] bg-white text-black border-2 rounded-md resize-none p-2"
                placeholder="Course detail"
                value={createForm.description}
                name="description"
                onChange={updateCreateFormField}
              />
            </div>

            <div className="my-10 gap-8 relative">
              <label className="w-full h-[24px] text-black">
                Cover image *
              </label>
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
            </div>

            <div className="my-10 gap-8 relative">
              <label className="w-full h-[24px] text-black">
                Video Trailer *
              </label>
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
            </div>
            <div className="my-10 gap-8 relative">
              <label className="w-full h-[24px] text-black">
                Attach File (Optional)
              </label>
              <label
                className="w-[190px] h-[192px] px-4 bg-slate-200 rounded-md appearance-none cursor-pointer hover:border-slate-20 focus:outline-none flex items-center justify-center"
                id="drop"
              >
                {pdfUrl ? (
                  <Link to={pdfUrl} target="_blank">
                    <img src={pdf} alt="pdf" />
                  </Link>
                ) : (
                  <span>
                    <img src={upload} alt="upload" />
                  </span>
                )}
                <input
                  type="file"
                  name="pdffile"
                  className="hidden"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  id="pdfInput"
                  onChange={handlePdfFileChange}
                />
                {pdfUrl && (
                  <>
                    <div className="mt-4 text-blue-400">
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      ></a>
                    </div>
                    <button type="button" onClick={deletePdfFile} className="">
                      <XMarkIcon className="size-5 text-white bg-purple-700 rounded-full absolute top-7 left-[10rem]" />
                    </button>
                  </>
                )}
              </label>
            </div>
          </form>
        </div>
      </div>
      <AddCourseSubLessonTable createCourse={createCourse} />
    </div>
  );
}

export default AddCourseFrom;
