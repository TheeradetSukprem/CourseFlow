// src/components/CustomSnackbar.jsx
import React from "react";
import { Snackbar, Alert } from "@mui/material";

const CustomSnackbar = ({ open, handleClose, alert }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={alert.severity}
        variant={alert.variant} // Use variant from alert object
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
