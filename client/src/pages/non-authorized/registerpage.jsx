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
import { Link } from "react-router-dom";

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

  const { register } = useAuth();

  // Error Message
  const [errorMessage, setErrorMessage] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [ageFormatError, setAgeFormatError] = useState("");
  const [ageInvalidError, setAgeInvalidError] = useState("");
  const [ageMinimumError, setAgeMinimumError] = useState("");
  const [emailFormatError, setEmailFormatError] = useState("");
  const [emailExistError, setEmailExistError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Success message
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error message
    setErrorMessage("");
    setFullnameError("");
    setAgeFormatError("");
    setAgeInvalidError("");
    setAgeMinimumError("");
    setEmailFormatError("");
    setEmailExistError("");
    setPasswordError("");
    setSuccessMessage("");
    // register(data);

    // All required field validation
    if (
      !fullname ||
      !selectedDate ||
      !educationalbackground ||
      !email ||
      !password
    ) {
      return setErrorMessage("All fields are required.");
    }
    /*
    // Fullname condition
    const nameRegex = /^[A-Za-z'-]+(?:\s[A-Za-z'-]+)*$/;
    if (!nameRegex.test(fullname)) {
      return setFullnameError(
        `Special characters and numbers are not allowed.`
      );
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
      return setAgeFormatError(`Invalid date format for age.`);
    }

    if (dateOfBirth > currentDate) {
      return setAgeInvalidError(`Please provide a valid date of birth.`);
    }
    if (dateOfBirth > minimumAge) {
      return setAgeMinimumError(
        `You must be at least 6 years old to register.`
      );
    }

    // Email condition
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setEmailFormatError(`Invalid email format`);
    }

    // Password condition
    if (password.length < 12) {
      return setPasswordError(`Password must be longer than 12 characters.`);
    }
*/
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
        setSuccessMessage(`Registration successful!`);
        setErrorMessage("");
      }
      // console.log(response.data);
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
          setEducationErrorMessage(message);
        } else if (message.includes("email")) {
          setEmailExistError(message);
        } else if (message.includes("password")) {
          setPasswordError(message);
        }
      }
    }
  };

  return (
    <>
      {/* <section>
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0">
                  <a href="#" className="text-blue-600 text-xl font-bold">
                    Course<span className="text-blue-900">Flow</span>
                  </a>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center space-x-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <a
                  href="#"
                  className="text-gray-900 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Our Courses
                </a>
                <a
                  href="#"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Log in
                </a>
              </div>
            </div>
          </div>
        </nav>
      </section> */}
      {/* Nav bar รอเอาของแก๊งมาใส่ */}
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
                className="w-full bg-Blue-500 text-white py-2 px-4 mb-3 rounded-md shadow-sm hover:bg-Blue-400"
              >
                Register
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
        </div>
      </section>
    </>
  );
}

export default Register;
