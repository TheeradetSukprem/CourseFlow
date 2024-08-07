import React from "react";

export const PendingStatus = () => (
  <p className="bg-yellow-100 text-yellow-800 text-sm font-medium px-2 my-3 py-1 rounded md:my-2">
    Pending
  </p>
);

export const SubmittedStatus = () => (
  <p className="bg-green-100 text-green-800 text-sm font-medium px-2 my-3 py-1 rounded md:my-2">
    Submitted
  </p>
);

export const InprogressStatus = () => (
  <p className="bg-blue-100 text-blue-800 text-sm font-medium px-2 my-3 py-1 rounded md:my-2">
    Inprogress
  </p>
);

export const OverdueStatus = () => (
  <p className="bg-pink-100 text-pink-800 text-sm font-medium px-2 my-3 py-1 rounded md:my-2">
    Overdue
  </p>
);
