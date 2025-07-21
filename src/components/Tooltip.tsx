import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  tooltip: string;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, tooltip, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span className="relative inline-block">
      <span
        className={`cursor-help border-b border-dotted border-current ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {text}
      </span>
      {isVisible && (
        <div className="absolute bottom-full left-0 mb-2 z-50">
          <div className="bg-gray-900 text-green-300 text-sm rounded-lg p-3 shadow-lg border border-green-500/30 w-96 whitespace-normal">
            <div className="font-bold text-yellow-400 mb-1">{text}</div>
            <div>{tooltip}</div>
            {/* Arrow */}
            <div className="absolute top-full left-6">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
};