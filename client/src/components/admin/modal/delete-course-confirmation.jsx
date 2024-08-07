import React from "react";
import { Modal } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/solid";

const ConfirmationModal = ({ open, onClose, onConfirm, text, textname }) => {
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
              {text}
            </h1>
            <div className="border-solid border-1 w-[311px] h-[128px] flex flex-col gap-[16px] xl:w-[528px] xl:flex-row">
              <button
                onClick={onConfirm}
                className="w-[312px] h-[56px] rounded-[12px] border-solid border-[1px] hover:bg-Orange-500 hover:text-white duration-75 border-Orange-500 text-Orange-500 text-[16px] font-[700]"
              >
              {textname}
              </button>
              <button
                onClick={onClose}
                className="w-[147px] h-[56px] rounded-[12px] border-solid border-[1px] hover:bg-white hover:border-Blue-500 hover:text-Blue-500 duration-75 bg-Blue-500 text-white text-[16px] font-[700] "
              >
                No, Keep it
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;

{
  /* <Box
sx={{
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 528,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}}
>
<h1 className="text-Body2 font-Body2 text-[#646D89] pt-[24px] pb-[24px]">
  Do you sure to subscribe Service Design Essentials Course?
</h1>
<h1 className="text-black">
  Are you sure you want to delete this course?
</h1>
<Box sx={{ mt: 2 }}>
  <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
    Cancel
  </Button>
  <Button variant="contained" color="error" onClick={onConfirm}>
    Confirm
  </Button>
</Box>
</Box> */
}
