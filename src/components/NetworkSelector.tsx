'use client';

import { useState } from 'react';

export type NetworkType = 'mainnet' | 'cronos' | 'testnet';

interface NetworkSelectorProps {
  currentNetwork: NetworkType;
  onNetworkChange: (network: NetworkType) => void;
}

const NetworkSelector = ({ currentNetwork, onNetworkChange }: NetworkSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const networks = [
    { id: 'mainnet', name: 'Mainnet' },
    { id: 'cronos', name: 'Cronos' },
    { id: 'testnet', name: 'Testnet' },
  ];

  return (
    <div className="relative">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Network</label>
        <button
          type="button"
          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-left flex justify-between items-center w-full md:w-48"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{networks.find(n => n.id === currentNetwork)?.name || currentNetwork}</span>
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
          {networks.map((network) => (
            <button
              key={network.id}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                currentNetwork === network.id ? 'bg-gray-100 dark:bg-gray-600' : ''
              }`}
              onClick={() => {
                onNetworkChange(network.id as NetworkType);
                setIsOpen(false);
              }}
            >
              {network.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkSelector;
