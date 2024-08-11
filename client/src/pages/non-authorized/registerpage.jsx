import * as React from "react";
import axios from "axios";
import { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/en-gb";
import { useAuth } from "../../contexts/authentication";
import NavbarNonUser from "../../components/homepage/navbar-nonuser";
import { Link, useNavigate } from "react-router-dom";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.locale("en-gb");

function Register() {
  const [fullname, setFullname] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [educationalbackground, setEducation] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();

  // Error Message
  const [errorMessage, setErrorMessage] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [ageFormatError, setAgeFormatError] = useState("");
  const [ageInvalidError, setAgeInvalidError] = useState("");
  const [ageMinimumError, setAgeMinimumError] = useState("");
  const [educationError, setEducationError] = useState("");
  const [emailFormatError, setEmailFormatError] = useState("");
  const [emailExistError, setEmailExistError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Success message and countdown timer
  const [successMessage, setSuccessMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(5); // Initialize the countdown to 5 seconds

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Start submitting
    setIsSubmitting(true);

    // Reset error message
    setErrorMessage("");
    setFullnameError("");
    setAgeFormatError("");
    setAgeInvalidError("");
    setAgeMinimumError("");
    setEducationError("");
    setEmailFormatError("");
    setEmailExistError("");
    setPasswordError("");
    setSuccessMessage("");
    // register(data);

    // All required field validation
    // if (
    //   !fullname ||
    //   !selectedDate ||
    //   !educationalbackground ||
    //   !email ||
    //   !password
    // ) {
    //   return setErrorMessage("All fields are required.");
    // }

    // Fullname condition
    const nameRegex = /^[A-Za-z'-]+(?:\s[A-Za-z'-]+)*$/;

    if (!fullname.trim()) {
      setFullnameError(`Name is required.`);
      setIsSubmitting(false);
      return;
    } else if (!nameRegex.test(fullname)) {
      setFullnameError(`Special characters and numbers are not allowed.`);
      setIsSubmitting(false);
      return;
    }

    // Age condition
    const dateOfBirth = new Date(selectedDate);
    const currentDate = new Date();
    const minimumAge = new Date(
      currentDate.getFullYear() - 6,
      currentDate.getMonth(),
      currentDate.getDate()
    );

    if (isNaN(dateOfBirth)) {
      setAgeFormatError(`Invalid date format for age.`);
      setIsSubmitting(false);
      return;
    }

    if (dateOfBirth > currentDate) {
      setAgeInvalidError(`Please provide a valid date of birth.`);
      setIsSubmitting(false);
      return;
    }
    if (dateOfBirth > minimumAge) {
      setAgeMinimumError(`You must be at least 6 years old to register.`);
      setIsSubmitting(false);
      return;
    }

    // Educational condition
    if (!educationalbackground.trim()) {
      setEducationError(`Educational Background is required.`);
      setIsSubmitting(false);
      return;
    }

    // Email condition
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailFormatError(`Invalid email format`);
      setIsSubmitting(false);
      return;
    }

    // Password condition
    if (!password.trim()) {
      setPasswordError(`Password is required.`);
      setIsSubmitting(false);
      return;
    }

    if (password.length < 12) {
      setPasswordError(`Password must be longer than 12 characters.`);
      setIsSubmitting(false);
      return;
    }

    const values = {
      fullname,
      age: selectedDate.format("YYYY-MM-DD"),
      educationalbackground,
      email: email.toLowerCase(),
      password,
      role,
    };

    try {
      const response = await axios.post(
        `https://project-courseflow-server.vercel.app/users/register`,
        values
      );

      // If the request is successful
      if (response.status === 201) {
        setModalVisible(true);
        const countdownInterval = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
              clearInterval(countdownInterval);
              setModalVisible(false);
              navigate("/login");
            }
            return prevCountdown - 1;
          });
        }, 1000); // Decrease countdown every second
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;

        // General error message
        setErrorMessage(message);

        // Specific error messages
        if (message.includes("fullname")) {
          setFullnameError(message);
        } else if (message.includes("age")) {
          setAgeInvalidError(message);
        } else if (message.includes("educationalbackground")) {
          setEducationError(message);
        } else if (message.includes("email")) {
          setEmailExistError(message);
        } else if (message.includes("password")) {
          setPasswordError(message);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavbarNonUser />
      {/* Background */}
      <div className="-z-10">
        <div className="absolute top-[12rem] right-0 md:top-2 -z-10">
          <svg
            className="md:w-[133px] md:h-[500px]"
            width="33"
            height="117"
            viewBox="0 0 33 117"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3045 70.9206C24.1349 86.0908 30.8336 105.717 33 117V0C26.7558 0.22123 13.1561 7.58784 5.78469 20.0057C-4.34628 37.0721 -0.326584 57.1684 11.3045 70.9206Z"
              fill="#2F5FAC"
            />
          </svg>
        </div>
        <div className="absolute left-0 bottom-[5rem] n md:left-[-2rem] -z-10 ">
          <svg
            className="md:w-[100px] md:h-[400px]"
            width="29"
            height="108"
            viewBox="0 0 29 108"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M28.5414 56.8344C28.5414 25.3123 9.1873 5.91866 -0.489746 0.162109V107.552C9.1873 103.78 28.5414 88.3565 28.5414 56.8344Z"
              fill="#FBAA1C"
            />
          </svg>
        </div>
        <div className="absolute -z-10 top-[21.5rem] right-[1.5rem] md:top-[470px] md:right-10">
          <svg
            className="md:w-[50px] md:h-auto stroke-[3px] md:stroke-[0.5px]"
            width="11"
            height="9"
            viewBox="0 0 11 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.00977 4.5C9.00977 6.0121 7.59533 7.5 5.50977 7.5C3.4242 7.5 2.00977 6.0121 2.00977 4.5C2.00977 2.9879 3.4242 1.5 5.50977 1.5C7.59533 1.5 9.00977 2.9879 9.00977 4.5Z"
              stroke="#F47E20"
            />
          </svg>
        </div>
        <div className="absolute -z-10 left-[-15px] top-[13.5rem]  md:left-[4rem] md:top-[8rem] ">
          <svg
            className="w-[29px] h-[29px]"
            width="74"
            height="74"
            viewBox="0 0 74 74"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="36.7032"
              cy="36.7032"
              r="36.5"
              transform="rotate(-75 36.7032 36.7032)"
              fill="#C6D6EF"
            />
          </svg>
        </div>
        <div className="absolute -z-10 -top-[10rem] md:top-[15rem] md:left-[10rem]">
          <svg
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.843 1.99998L8.83754 20.6805"
              stroke="#2FAC61"
              stroke-width="3"
              stroke-linecap="round"
            />
            <path
              d="M1.99986 8.83751L20.6804 13.8429"
              stroke="#2FAC61"
              stroke-width="3"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>
      {/* Background */}
      <section className="flex flex-col justify-start mt-5 flex-1 items-center pb-40 max-[375px]:w-[80%] z-40">
        <div className="bg-none p-2 rounded-lg  w-full max-w-md">
          <h2 className="text-2xl font-semibold text-blue-800 mb-6">
            Register to start learning!
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter Name and Lastname"
                className="bg-white text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={fullname}
                onChange={(e) => {
                  setFullname(e.target.value);
                }}
              />
              {fullnameError && <p className="text-red-500">{fullnameError}</p>}
            </div>
            <div className="mb-4">
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="bg-white rounded-lg"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        "& .MuiOutlinedInput-root": {
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#C8CCDB",
                          },
                        },
                        "& .MuiInputBase-input": {
                          padding: "8px 14px",
                          color: "#555",
                          background: "#FFFFFF",
                          borderRadius: "0.5rem",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
              {ageFormatError && (
                <p className="text-red-500">{ageFormatError}</p>
              )}
              {ageInvalidError && (
                <p className="text-red-500">{ageInvalidError}</p>
              )}
              {ageMinimumError && (
                <p className="text-red-500">{ageMinimumError}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="education"
                className="block text-sm font-medium text-gray-700"
              >
                Educational Background
              </label>
              <input
                type="text"
                id="education"
                name="education"
                placeholder="Enter Educational Background"
                className="bg-white text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={educationalbackground}
                onChange={(e) => {
                  setEducation(e.target.value);
                }}
              />
              {educationError && (
                <p className="text-red-500">{educationError}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter Email"
                className="bg-white text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailFormatError && (
                <p className="text-red-500">{emailFormatError}</p>
              )}
              {emailExistError && (
                <p className="text-red-500">{emailExistError}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter password"
                className="bg-white text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              {passwordError && <p className="text-red-500">{passwordError}</p>}
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 mb-3 rounded-md shadow-sm hover:bg-blue-400 focus:outline-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center my-2">
                    <span className="dot-flashing"></span>
                    <span className="dot-flashing"></span>
                    <span className="dot-flashing"></span>
                  </span>
                ) : (
                  "Register"
                )}
              </button>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              {successMessage && (
                <p className="mb-4 text-sm text-green-600">{successMessage}</p>
              )}
            </div>
          </form>
          <p className="pt-6 text-black">
            Already have an account?
            <Link
              to="/login"
              target="_blank"
              className="font-semibold text-Blue-500 pl-3 hover:text-orange-500 hover:underline"
            >
              Log in
            </Link>
          </p>
          {modalVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center relative">
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="w-12 h-12 text-green-500 mb-4"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <h3 className="text-2xl font-semibold text-black">Success</h3>
                  <p className="text-gray-600 mt-2">
                    Check your email for a booking confirmation. We’ll see you
                    soon!
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    The window will disappear in {countdown} seconds...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Register;
