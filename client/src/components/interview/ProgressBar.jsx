/**
 * components/interview/ProgressBar.jsx
 */

import React from 'react';

function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2 text-sm text-text-secondary font-medium">
        <span>Question {current} of {total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-surface-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary-600 to-secondary-500 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
