import React, { useState } from 'react';

function ProgressBar({progress}) {
  return (
    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="bg-blue-500 h-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
      <p className="text-center mt-2">{progress}%</p>
    </div>
  );
}

export default ProgressBar;