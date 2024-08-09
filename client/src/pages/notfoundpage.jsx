import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <p className="text-2xl text-gray-800 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <img
          src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdno2Y25mN2l1anUycHBhb3IyMzNqb3BzNjdhZ3NsOTk3OXgwZ2FiayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xUK8V7suY7W9SE/giphy.webp"
          alt="man crying"
          className="ml-[7rem]"
        />
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-Blue-500 text-white rounded-sm hover:bg-Blue-300 transition-all duration-300 mt-10"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
