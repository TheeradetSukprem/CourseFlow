// export function FooterNavigation() {
//   return (
//     <footer className="bg-white py-4 flex justify-between items-center border-t border-gray-300 mt-6 md:mt-0">
//       <button
//         className="text-blue-600 font-bold ml-4 md:ml-16 my-2 md:my-9"
//         onClick={handlePreviousLesson}
//       >
//         Previous Lesson
//       </button>
//       <button
//         className="bg-[#2F5FAC] mr-4 md:mr-14 my-2 md:my-5 text-white font-bold py-2 px-4 rounded-lg"
//         onClick={() =>
//           progress === 100
//             ? (alert("Complete lesson"), navigate("/"))
//             : handleNextLesson()
//         }
//       >
//         {progress === 100 ? "Complete Lesson" : "Next Lesson"}
//       </button>
//     </footer>
//   );
// }
