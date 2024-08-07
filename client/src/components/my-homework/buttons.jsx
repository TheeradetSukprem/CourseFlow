// import React, { useState } from "react";

// const Buttons = () => {
//   const [active, setActive] = useState("b1");

//   const handleButtonClick = (buttonId) => {
//     setActive(buttonId);
//   };

//   return (
//     <div className="flex justify-center items-center lg:pb-[2rem] bg-red-100">
//       <button
//         className={`w-20 transition-colors duration-300 ease-in-out ${
//           active === "b1"
//             ? "text-gray-900 border-b-2 border-gray-800"
//             : "text-gray-400"
//         }`}
//         onClick={() => handleButtonClick("b1")}
//       >
//         All
//       </button>
//       <button
//         className={`w-28 transition-colors duration-300 ease-in-out ${
//           active === "b2"
//             ? "text-gray-900 border-b-2 border-gray-800"
//             : "text-gray-400"
//         }`}
//         onClick={() => handleButtonClick("b2")}
//       >
//         Pending
//       </button>
//       <button
//         className={`w-28 transition-colors duration-300 ease-in-out ${
//           active === "b3"
//             ? "text-gray-900 border-b-2 border-gray-800"
//             : "text-gray-400"
//         }`}
//         onClick={() => handleButtonClick("b3")}
//       >
//         Submitted
//       </button>
//     </div>
//   );
// };

// export default Buttons;
