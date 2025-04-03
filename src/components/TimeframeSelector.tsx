'use client';

import { useState } from 'react';

interface TimeframeSelectorProps {
  currentResolution: string;
  onResolutionChange: (resolution: string) => void;
}

const TimeframeSelector = ({ currentResolution, onResolutionChange }: TimeframeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Available timeframes
  const timeframes = [
    { value: '1', label: '1m' },
    { value: '5', label: '5m' },
    { value: '15', label: '15m' },
    { value: '30', label: '30m' },
    { value: '60', label: '1h' },
    { value: '240', label: '4h' },
    { value: 'D', label: '1d' },
    { value: 'W', label: '1w' },
  ];

  return (
    <div className="relative">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Timeframe</label>
        <button
          type="button"
          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-left flex justify-between items-center w-full md:w-48"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{timeframes.find(t => t.value === currentResolution)?.label || currentResolution}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full md:w-48 bg-white dark:bg-gray-700 shadow-lg rounded-md py-1 max-h-60 overflow-auto">
          {timeframes.map((timeframe) => (
            <button
              key={timeframe.value}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                currentResolution === timeframe.value ? 'bg-gray-100 dark:bg-gray-600' : ''
              }`}
              onClick={() => {
                onResolutionChange(timeframe.value);
                setIsOpen(false);
              }}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimeframeSelector;
