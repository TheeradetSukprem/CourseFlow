import React, { useState, useEffect } from "react";
import NavbarUser from "../../components/homepage/navbar-user";
import GeneralFooter from "../../components/homepage/footer";
// import Buttons from "../../components/my-homework/buttons";
import AssignmentCard from "../../components/my-homework/assignment-card";
import axios from "axios";
import { useAuth } from "../../contexts/authentication";
import { useParams } from "react-router-dom";
import emptyFolder from "../../assets/image/empty-folder.png";
import Background from "../../components/user-profile/background";

function UserMyHomework() {
  const [submissions, setSubmissions] = useState([]);
  const [filter, setFilter] = useState("all");

  const userId = useAuth();
  const assignmentId = useParams();

  //=========Get submissions all status
  const getAllSubmissions = async () => {
    try {
      const result = await axios.get(
        `http://localhost:4000/submissions/user/${userId.UserIdFromLocalStorage}`
      );
      console.log("Data", result.data);
      setSubmissions(result.data);
    } catch (error) {
      console.error("Error Fetching", error);
    }
  };

  //=========Put new submit
  const handleSubmit = async (assignmentId, newAnswer) => {
    try {
      await axios.put(
        `http://localhost:4000/submissions/user/${userId.UserIdFromLocalStorage}/assignment/${assignmentId}/submit`,
        { answer: newAnswer }
      );
      getAllSubmissions();
    } catch (error) {
      console.error("Error submitting answer", error);
    }
  };

  useEffect(() => {
    getAllSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((item) => {
    if (filter === "all") return true;
    return item.status === filter;
  });

  return (
    <>
      <div className="sticky top-0 bg-white">
        <NavbarUser />
      </div>

      {/* Header */}
      <div className="mt-[5rem] mb-4 z-20 flex flex-col justify-center items-center">
        <p className="text-black text-Headline3 mb-9 font-medium bg-white p-2 md:text-Headline2">
          My Assignment
        </p>
        <div className="flex justify-center items-center w-[50rem] mb-4">
          {/* FilterButtons */}
          <button
            className={`w-12 transition-colors duration-300 ease-in-out ${
              filter === "all"
                ? "text-gray-900 border-b-2 border-gray-800"
                : "text-gray-400"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`w-20 transition-colors duration-300 ease-in-out mx-4 ${
              filter === "Pending"
                ? "text-gray-900 border-b-2 border-gray-800"
                : "text-gray-400"
            }`}
            onClick={() => setFilter("Pending")}
          >
            Pending
          </button>
          <button
            className={`w-20 transition-colors duration-300 ease-in-out ${
              filter === "Submitted"
                ? "text-gray-900 border-b-2 border-gray-800"
                : "text-gray-400"
            }`}
            onClick={() => setFilter("Submitted")}
          >
            Submitted
          </button>
        </div>
      </div>

      {/* Answer Box */}
      {filteredSubmissions.length > 0 ? (
        <div className="mt-12">
          {filteredSubmissions.map((item) => (
            <AssignmentCard
              key={item.assignmentid}
              coursename={item.coursename}
              module={item.modulename}
              sublesson={item.sublessonname}
              title={item.title}
              answer={item.answer}
              link={item.courseid}
              status={item.status}
              onSubmit={(newAnswer) =>
                handleSubmit(item.assignmentid, newAnswer)
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center w-[343px] h-auto">
            <img src={emptyFolder} alt="No courses available" />
            <p className="text-black text-2xl">This page is empty.</p>
          </div>
        </div>
      )}

      <div className="mt-20">
        <GeneralFooter />
      </div>
      <Background />
    </>
  );
}

export default UserMyHomework;
