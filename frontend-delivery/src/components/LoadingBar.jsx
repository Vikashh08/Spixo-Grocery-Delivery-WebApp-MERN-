import React from 'react';

const LoadingBar = ({ progress }) => {
  if (progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[9999] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 transition-all duration-300 ease-out shadow-[0_0_10px_#3b82f6]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default LoadingBar;
