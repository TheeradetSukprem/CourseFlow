import React from 'react'

const FadeIn = ({ children }) => {
    return (
      <div className="fade-in">
        <style>
          {`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
  
            .fade-in {
              animation: fadeIn 1s ease-in-out;
              
            }
          `}
        </style>
        {children}
      </div>
    );
  };
  
  export default FadeIn;
