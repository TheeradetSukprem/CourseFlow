import React from "react";

function PendingSvg({ text }) {
  return (
    <div className="spinner-container">
      <style>
        {`
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      .spin {
        transform-origin: center;
        animation: spin 2s linear infinite;
      }
      .spinner-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.8);
        z-index: 1000;
      }
    `}
      </style>
      <svg
        viewBox="0 0 800 800"
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
      >
        <circle
          className="spin"
          cx="400"
          cy="400"
          fill="none"
          r="220"
          strokeWidth="50"
          stroke="#595959"
          strokeDasharray="683 1400"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-black">{text}</p>
    </div>
  );
}

export default PendingSvg;
