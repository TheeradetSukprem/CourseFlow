import React from "react";
import { Modal } from "@mui/material";

const ModalCoursedetail = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex items-center justify-center h-screen bg-[rgba(0,0,0,0.5)]">
        <div className="border-solid border-2 bg-white sm:h-[304px] sm:w-[343px] rounded-[16px] xl:w-[528px] xl:h-[212px]">
          <div className="flex items-center justify-between pl-[16px] pr-[16px] sm:h-[56px] border-solid border-b-[1px] border-[#E4E6ED] xl:pl-[24px] xl:pr-[24px]">
            <h1 className="text-Body1 font-Body1 text-black">Confirmation</h1>
            <div className="text-xl text-Gray-700">
              <button onClick={onClose}>x</button>
            </div>
          </div>
          <div className="sm:w-[343px] sm:h-[248px] pl-[16px] pr-[16px] xl:w-[528px] xl:pl-[24px] xl:pr-[24px]">
            <h1 className="text-Body2 font-Body2 text-[#646D89] pt-[24px] pb-[24px]">
              Do you sure to subscribe Service Design Essentials Course?
            </h1>
            <div className="border-solid border-1 sm:w-[311px] sm:h-[128px] flex flex-col gap-[16px] xl:w-[528px] xl:flex-row">
              <button
                onClick={onClose}
                className="sm:w-[311px] sm:h-[56px] rounded-[12px] shadow-md border-solid border-[1px] border-Orange-500 text-Orange-500 xl:text-[16px] xl:font-[700] xl:w-[142px] xl:h-[60px]"
              >
                No, I don't
              </button>
              <button
                onClick={onConfirm}
                className="sm:w-[311px] sm:h-[56px] rounded-[12px] shadow-md border-solid border-[1px] bg-Blue-500 text-white xl:text-[16px] xl:font-[700] xl:w-[250px] xl:h-[60px]"
              >
                Yes, I want to subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCoursedetail;
