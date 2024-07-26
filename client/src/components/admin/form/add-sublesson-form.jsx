import { useForm, useFieldArray, Controller } from "react-hook-form";
import Uploadvideo from "../../../assets/image/Uploadvideo.png";
import NavbarAddSubLesson from "../navbar/navbar-addsublesson";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import drag1 from "../../../assets/icons/admin/drag1.png";
import { useState } from "react";
import supabase from "../../../utils/supabaseClient";
import { v4 as uuidv4 } from "uuid";

function AddSubLessonFrom() {
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState([]);
  const { control, handleSubmit, register, reset, getValues } = useForm({
    defaultValues: {
      lessonName: "",
      subLessons: [{ name: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "subLessons",
  });

  const params = useParams();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    
    try {
      // Upload videos and get URLs
      const videoUrls = await Promise.all(
        videoFiles.map((file) => uploadVideoFile(file))
      );
      // Add video URLs to each sub-lesson
      data.subLessons = data.subLessons.map((subLesson, index) => ({
        ...subLesson,
        videoUrl: videoUrls[index],
      }));
      console.log(data);
      // Prepare data to send
      const videoData = {
        videofile: videoUrls,
      };
      // console.log(videoUrls);
      // console.log(videoData);
      // Send data to backend
      await axios.post(
        `http://localhost:4000/admin/${params.courseId}/lesson`,
        {
          modulename: data.lessonName,
          sublessonname: data.subLessons.map((subLesson) => subLesson.name),
          videos: data.subLessons.map((video)=> video.videoUrl),
        }
      );

      alert("Add Lesson and SubLesson Successfully");
      navigate("/admin/courselist");
      reset("");
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
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `course/lesson/${fileName}`;
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

  const handleVideoFileChange = (e, index) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      return;
    }

    const newVideoFiles = [...videoFiles];
    newVideoFiles[index] = selectedFile;
    setVideoFiles(newVideoFiles);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const newVideoPreviewUrls = [...videoPreviewUrls];
      newVideoPreviewUrls[index] = fileReader.result;
      setVideoPreviewUrls(newVideoPreviewUrls);
    };
    fileReader.readAsDataURL(selectedFile);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <nav>
        <NavbarAddSubLesson
          handleSubmit={handleSubmit(onSubmit)}
          text="Create"
        />
      </nav>
      <div className="mt-[50px] mx-8 w-[1120px] h-fit bg-white rounded-[16px] border-[1px] mb-[100px]">
        <div className="mx-8 p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="mx-[40px] w-[920px] h-[76px]">
                <label className="w-full h-[24px] text-black text-[16px]">
                  Lesson name *
                </label>
                <input
                  className="w-full h-[48px] bg-white text-black border-[1px] rounded-[8px] pl-[20px]"
                  placeholder="Place Holder"
                  {...register("lessonName")}
                />
              </div>
              <div className="mx-[40px]">
                <hr className="my-8 border-1 " />
              </div>
              <div className="mx-[40px] text-[20px] font-[600] text-[#646D89]">
                Sub-Lesson
              </div>
            </div>
            {fields.map((field, index) => (
              <aside
                key={field.id}
                className="mt-[30px] mx-[40px] w-[920px] h-[340px] bg-Gray-100 flex justify-center items-center rounded-[16px] border-[1px]"
              >
                <div className="w-[888px] h-[292px] flex gap-[24px]">
                  <div className="w-[26px] h-[76px] text-[#C8CCDB]">
                    <img src={drag1} alt="drag icon" />
                  </div>
                  <div className="w-[747px] flex flex-col justify-center gap-[23px]">
                    <div className="flex flex-col gap-[4px]">
                      <label
                        htmlFor={`sub-lesson-name-${field.id}`}
                        className="text-Body2 font-Body2 text-[#08090D]"
                      >
                        Sub-Lesson name *
                      </label>
                      <Controller
                        render={({ field }) => (
                          <input
                            className="w-[530px] h-[48px] bg-white text-black border-[1px] border-[#D6D9E4] rounded-[8px] pl-[20px] placeholder:text-black"
                            {...field}
                          />
                        )}
                        name={`subLessons.${index}.name`}
                        control={control}
                      />
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <h1 className="font-[400] text-[16px] text-[#07090D]">
                        Video *
                      </h1>
                      <label className="cursor-pointer w-[160px] h-[160px] rounded-[8px] bg-Gray-200 flex items-center justify-center">
                        <img src={Uploadvideo} alt="upload video icon" />
                        <input
                          type="file"
                          name={`videofile-${index}`}
                          className="hidden"
                          accept="video/mp4"
                          id={`input-${index}`}
                          onChange={(e) => handleVideoFileChange(e, index)}
                        />
                        {videoPreviewUrls[index] && (
                          <video
                            src={videoPreviewUrls[index]}
                            alt="Preview"
                            className="absolute m-auto rounded-md"
                            style={{
                              maxWidth: "240px",
                              maxHeight: "240px",
                              objectFit: "cover",
                            }}
                            controls
                          />
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="w-[67px] h-[32px] text-center text-[16px] font-[700] text-Gray-500">
                    {index > 0 ? (
                      <button type="button" onClick={() => remove(index)}>
                        Delete
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          alert("Cannot delete the only sub-lesson")
                        }
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </aside>
            ))}
            <button
              className="mx-[40px] mt-[32px] border-[1px] border-Orange-500 shadow-md bg-white text-Orange-500 rounded-[12px] w-[208px] h-[60px] text-[16px] font-[700]"
              type="button"
              onClick={() => append({ name: "" })}
            >
              + Add Sub-Lesson
            </button>
            {/* <button
              className="mx-[40px] mt-[32px] border-[1px] border-Blue-500 shadow-md bg-white text-Blue-500 rounded-[12px] w-[208px] h-[60px] text-[16px] font-[700]"
              type="submit"
            >
              Submit
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSubLessonFrom;
