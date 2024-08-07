import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import edit from "../../assets/image/edit.png";
import bin from "../../assets/image/Bin.png";
import NavbarAssignmentList from "./navbar/navbar-assignmentlist";
import ConfirmationModal from "./modal/delete-course-confirmation";

function AssignmentListTable() {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const formatToBangkokTime = (isoTime) => {
    const date = new Date(isoTime);
    const bangkokTime = new Date(
      date.toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const formattedTime = bangkokTime.toLocaleString("en-GB", options);

    const [datePart, timePart] = formattedTime.split(" ");
    const [day, month, year] = datePart.split("/");
    const [hour, minute] = timePart.split(":");

    return `${day}/${month}/${year.replace(",", "")} ${hour}:${minute}`;
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("http://localhost:4000/admin/assignments");
      console.log(res);
      setAssignments(res.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const deleteAssignment = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/admin/assignments/${id}`);
      fetchAssignments();
      setOpenModal(false);
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleOpenModal = (id) => {
    setSelectedAssignmentId(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAssignmentId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAssignmentId) {
      deleteAssignment(selectedAssignmentId);
    }
  };

  return (
    <div>
      <NavbarAssignmentList search={search} onSearchChange={setSearch} />
      <div className="m-10 ">
        <table className="text-slate-600 text-sm rounded-xl w-full">
          <thead className="w-[100px] h-[41px] bg-Gray-400 ">
            <tr className="font-thin ">
              <th className="w-[200px] text-left pl-10 rounded-tl-lg">
                Assignment detail
              </th>
              <th className="w-[200px] text-left">Course</th>
              <th className="w-[200px] text-left">Lesson</th>
              <th className="w-[200px] text-left">Sub-lesson</th>
              <th className="w-[200px] text-left">Created date</th>
              <th className="w-[120px] text-center rounded-tr-lg">Actions</th>
            </tr>
          </thead>
        </table>
        <div className="overflow-y-scroll max-h-[700px]">
          <table className="text-black text-sm rounded-xl w-full">
            <tbody>
              {assignments
                .filter((item) => {
                  if (search.trim() === "") {
                    return true;
                  }
                  const searchText = search.toLowerCase();
                  return (
                    (item.detail &&
                      item.detail.toLowerCase().includes(searchText)) ||
                    (item.title &&
                      item.title.toLowerCase().includes(searchText)) ||
                    (item.modulename &&
                      item.modulename.toLowerCase().includes(searchText)) ||
                    (item.sublessonname &&
                      item.sublessonname.toLowerCase().includes(searchText))
                  );
                })
                .map((item, index) => (
                  <tr
                    key={`${item.assignmentid}-${index}`}
                    className="bg-white border-b border-Gray-400 w-[1120px] h-[88px]"
                  >
                    <td className="w-[200px] text-left pl-10">
                      {truncateText(item.title, 20)}
                    </td>
                    <td className="w-[200px] text-left">
                      {truncateText(item.coursename, 20)}
                    </td>
                    <td className="w-[200px] text-left">
                      {truncateText(item.modulename, 20)}
                    </td>
                    <td className="w-[200px] text-left">
                      {truncateText(item.sublessonname, 20)}
                    </td>
                    <td className="w-[200px] text-left">
                      {formatToBangkokTime(item.createddate)}
                    </td>
                    <td className="w-[120px] text-center">
                      <button
                        onClick={() => handleOpenModal(item.assignmentid)}
                      >
                        <img src={bin} alt="delete" className="pl-8" />
                      </button>
                      <button>
                        <Link
                          to={`/admin/editaddassignment/${item.assignmentid}`}
                        >
                          <img src={edit} alt="edit" className="pl-4" />
                        </Link>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmationModal
        text="Are you sure you want to delete this assignment?"
        textname="Yes, I want to delete"
        open={openModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default AssignmentListTable;
