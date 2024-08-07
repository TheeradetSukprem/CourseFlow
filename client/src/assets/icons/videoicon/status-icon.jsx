// Icon Components
export const NotPlayingIcon = () => (
  <svg width="16.25" height="16.25" viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="11"
      stroke="#4caf50"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

export const PlayingIcon = () => (
  <svg
    width="16.25"
    height="16.25"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="11"
      stroke="#2FAC8E"
      strokeWidth="2"
      fill="none"
    />
    <path d="M12 1a11 11 0 0 0 0 22z" fill="#2FAC8E" />
  </svg>
);

export const FinishedIcon = () => (
  <svg
    width="16.25"
    height="16.25"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="11"
      stroke="#2FAC8E"
      strokeWidth="2"
      fill="#2FAC8E"
    />
    <path d="M12 1 a 11 11 0 0 0 0 22 a 11 11 0 0 1 0 -22" fill="#2FAC8E" />
    <svg
      x="3"
      y="3"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.5"
        stroke="white"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  </svg>
);
