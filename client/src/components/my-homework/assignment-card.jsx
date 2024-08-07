import React, { useState, useEffect } from "react";
import {
  PendingStatus,
  SubmittedStatus,
} from "../../components/my-homework/status";

function AssignmentCard({
  coursename,
  module,
  sublesson,
  title,
  answer,
  link,
  status,
  onSubmit,
}) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [currentAnswer, setCurrentAnswer] = useState(answer);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLinkClick = () => {
    window.open(`/user/subscribe/coursedetail/${link}`, "_blank");
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setIsSubmitting(true);
    try {
      await onSubmit(currentAnswer); // Call the onSubmit prop function
      setCurrentStatus("submitted");
    } catch (error) {
      console.error("Error submitting answer", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (status === "Submitted") {
      setCurrentStatus("submitted");
    } else if (status !== "Submitted") {
      setCurrentStatus("pending");
    }
  }, [status]);

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="flex justify-center items-center mb-10 w-[1120px] ">
        <div className="bg-blue-50 border border-gray-300 rounded-lg p-4 md:px-14 md:py-10 shadow-md w-[343px] md:w-screen md:mx-4">
          <div className="flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center mb-4 w-full">
            <div className="flex flex-col mb-4 md:mb-0">
              <h2 className="text-Body1 font-semibold text-black w-[240px] md:w-fit">
                Course: {coursename}
              </h2>
              <p className="text-Gray-700 text-sm my-2 w-full">
                {module}: {sublesson}
              </p>
            </div>
            <div className="flex justify-center items-center md:flex-col md:justify-end md:items-end md:mb-[2rem]">
              {currentStatus === "submitted" ? (
                <SubmittedStatus />
              ) : (
                <PendingStatus />
              )}
            </div>
          </div>
          <div className="bg-white p-4 border border-Gray-400 rounded-lg">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              {title}
            </label>
            <form onSubmit={handleSubmit} className="md:flex md:flex-row gap-6">
              <textarea
                className={`bg-white resize-none w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  currentStatus === "submitted" &&
                  "text-gray-600 text-opacity-70 border-none"
                }`}
                type="text"
                rows="4"
                placeholder="Answer..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                disabled={currentStatus === "submitted"} // Keep this for read-only state
              ></textarea>
              <div className="flex flex-col justify-between items-center">
                {currentStatus !== "submitted" && (
                  <button
                    type="submit"
                    className="bg-Blue-500 text-white py-4 w-full rounded-lg hover:bg-Blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 md:w-[137px]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                )}
                <button
                  type="button"
                  className="text-Blue-500 font-semibold flex justify-center w-[130px] mt-8 hover:underline p-1 rounded-xl"
                  onClick={handleLinkClick}
                >
                  Open in course
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentCard;
