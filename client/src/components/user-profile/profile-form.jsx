import React, { useState, useEffect } from "react";

import axios from "axios";
import { useAuth } from "../../contexts/authentication";
import supabase from "../../utils/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import LoadingCircle from "./loading-circle";

function ProfileForm() {
  const [userData, setUserData] = useState({});
  const { UserIdFromLocalStorage } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    educationalBackground: "",
    email: "",
    avatarUrl: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    educationalBackground: "",
  });

  const currentYear = new Date().getFullYear();
  const maxDate = `${currentYear}-12-31`;
  const CDNURL =
    "https://igdllimavmpalwpkphmh.supabase.co/storage/v1/object/public/avatars/";

  const getUserData = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4000/profiles/${UserIdFromLocalStorage}`
      );
      const dateOfBirth = result.data.age;
      // Format the date as yyyy-mm-dd if necessary
      const formattedDateOfBirth = new Date(dateOfBirth)
        .toISOString()
        .split("T")[0];
      setUserData(result.data);
      setFormData((prevData) => ({
        ...prevData,
        name: result.data.fullname,
        age: formattedDateOfBirth || "", // Use formatted date
        educationalBackground: result.data.educationalbackground || "",
        email: result.data.email || "",
        avatarUrl: result.data.profilepicture || "",
      }));
      setAvatarUrl(result.data.profilepicture || "");
    } catch (error) {
      console.error("Error Fetching", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];

      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File size exceeds 1MB. Please select a smaller file.");
        setUploading(false);
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${UserIdFromLocalStorage}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const profileUrl = supabase.storage.from("avatars").getPublicUrl(filePath)
        .data.publicUrl;
      console.log(profileUrl);
      setAvatarUrl(profileUrl);

      setFormData((prevData) => ({ ...prevData, avatarUrl: profileUrl }));
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  async function deleteAvatar() {
    try {
      const filePath = avatarUrl.replace(CDNURL, "");
      const { error } = await supabase.storage
        .from("avatars")
        .remove([filePath]);

      if (error) {
        throw error;
      }

      setAvatarUrl("");
      setFormData((prevData) => ({ ...prevData, avatarUrl: "" }));

      const updatedProfile = {
        ...userData,
        profilepicture: "",
      };

      await axios.put(
        `http://localhost:4000/profiles/${UserIdFromLocalStorage}/update`,
        updatedProfile
      );

      alert("Avatar deleted successfully");
    } catch (error) {
      console.error("Error deleting avatar", error);
      alert("Error deleting avatar");
    }
  }

  const validateAge = (age) => {
    const birthDate = new Date(age);
    const today = new Date();
    const sixYearsAgo = new Date(today.setFullYear(today.getFullYear() - 6));

    if (birthDate > sixYearsAgo) {
      return "You must be at least 6 years old.";
    }
    return "";
  };

  const validateField = (text, value) => {
    let error = "";
    if (text === "name") {
      if (!value) {
        error = "Name cannot be empty.";
      } else {
        // Allow letters, spaces, and Unicode characters for name
        const regex = /^[\p{L}\p{M}\s]+$/u;
        if (!regex.test(value)) {
          error = "Special character is not accept.";
        }
      }
    } else if (text === "educationalBackground") {
      if (!value) {
        error = "Educational background cannot be empty.";
      } else {
        // Allow letters, spaces, Unicode characters, periods, and commas for educational background
        const regex = /^[\p{L}\s.,-]+$/u;
        if (!regex.test(value)) {
          error = "Special character is not accept.";
        }
      }
    } else if (text === "age") {
      error = validateAge(value); // Validate age here
    }
    setErrors((prevErrors) => ({ ...prevErrors, [text]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") {
      const formattedDate = new Date(value).toISOString().split("T")[0]; // Format date to yyyy-mm-dd
      setFormData((prevData) => ({ ...prevData, [name]: formattedDate }));
      validateField(name, formattedDate); // Validate age when it changes
    } else {
      validateField(name, value);
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.name || errors.educationalBackground || errors.age) {
      alert("Please correct the errors before submitting.");
      return;
    }

    try {
      // Extract the date part from formData.dateOfBirth and set time to 17:00:00.000Z
      const date = new Date(formData.age);
      date.setUTCHours(17, 0, 0, 0); // Set time to 17:00:00.000Z

      // Convert dateOfBirth to ISO 8601 format
      const formattedDateOfBirth = date.toISOString();
      console.log("Formatted Date of Birth:", formattedDateOfBirth); // Debug log

      const updatedProfile = {
        fullname: formData.name,
        age: formattedDateOfBirth, // Use ISO 8601 format
        educationalbackground: formData.educationalBackground,
        email: formData.email,
        profilepicture: formData.avatarUrl,
      };
      console.log(updatedProfile);

      await axios.put(
        `http://localhost:4000/profiles/${UserIdFromLocalStorage}/update`,
        updatedProfile
      );

      alert("Profile updated successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile", error);
      alert("Error updating profile");
    }
  };
  return (
    <>
      <form
        className="flex flex-col md:flex-row justify-center items-center md:gap-[3rem] mb-[1rem]"
        onSubmit={handleSubmit}
      >
        <div className="py-8">
          {avatarUrl ? (
            <div className="relative">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-[343px] h-[343px] object-cover rounded-lg"
              />
              <button
                type="button"
                className="absolute top-2 right-2"
                onClick={deleteAvatar}
              >
                <XMarkIcon className="size-6 text-white bg-purple-700 rounded-full" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-lg">
              <div>
                <label
                  className="w-[343px] h-[343px] bg-Gray-600 cursor-pointer rounded-lg object-cover absolute"
                  htmlFor="single"
                >
                  {uploading ? (
                    <LoadingCircle />
                  ) : (
                    <div className="flex justify-center pt-40 text-xl">
                      Upload Picture
                    </div>
                  )}
                </label>
                <input
                  className="w-[343px] h-[343px] border border-black rounded-lg "
                  style={{
                    visibility: "",
                    position: "",
                  }}
                  type="file"
                  id="single"
                  accept="image/*"
                  onChange={uploadAvatar}
                  disabled={uploading}
                />
              </div>
            </div>
          )}
        </div>
        <div className="w-[343px] h-[343px] text-black flex flex-col gap-5">
          <div className="container md:font-medium">
            <label>
              Name
              <p>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-Blue-400 outline-2 block w-full p-3"
                  placeholder={"Name"}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </p>
            </label>
          </div>

          <div className="container md:font-medium">
            <label>
              Date of Birth
              <p>
                <input
                  id="age"
                  name="age"
                  type="date"
                  value={formData.age}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-Blue-400 outline-2 block w-full p-3"
                  placeholder="Date of Birth"
                  format="true"
                  max={maxDate} // Add this line
                  required
                />
                {errors.age && (
                  <p className="text-red-500 text-sm">{errors.age}</p>
                )}
              </p>
            </label>
          </div>
          <div className="container md:font-medium">
            <label>
              Educational Background
              <p>
                <input
                  id="educationalBackground"
                  type="text"
                  name="educationalBackground"
                  value={formData.educationalBackground}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-Blue-400 outline-2 block w-full p-3"
                  placeholder="School"
                  required
                />
                {errors.educationalBackground && (
                  <p className="text-red-500 text-sm">
                    {errors.educationalBackground}
                  </p>
                )}
              </p>
            </label>
          </div>
          <div className="container md:font-medium">
            <label>
              Email
              <p>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-Blue-400 outline-2 block w-full p-3"
                  placeholder="Enter Email"
                  required
                />
              </p>
            </label>
          </div>
          <button
            type="submit"
            className="text-white bg-Blue-500 font-medium rounded-xl text-sm w-full md:w-auto px-4 py-4 text-center hover:bg-Blue-400 duration-75 md:mt-3"
          >
            Update Profile
          </button>
        </div>
      </form>
    </>
  );
}

export default ProfileForm;
