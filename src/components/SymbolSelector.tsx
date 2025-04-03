'use client';

import { useState } from 'react';

interface SymbolSelectorProps {
  currentSymbol: string;
  onSymbolChange: (symbol: string) => void;
}

const SymbolSelector = ({ currentSymbol, onSymbolChange }: SymbolSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Common Reya trading pairs
  const symbols = [
    { id: 'BERAUSDMARK', name: 'BERA/USD MARK' },
    { id: 'BTCUSDMARK', name: 'BTC/USD MARK' },
    { id: 'ETHUSDMARK', name: 'ETH/USD MARK' },
    { id: 'SOLUSDMARK', name: 'SOL/USD MARK' },
    { id: 'AVAXUSDMARK', name: 'AVAX/USD MARK' },
  ];

  return (
    <div className="relative">
      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Symbol</label>
        <button
          type="button"
          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-4 py-2 text-left flex justify-between items-center w-full md:w-48"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{symbols.find(s => s.id === currentSymbol)?.name || currentSymbol}</span>
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
          {symbols.map((symbol) => (
            <button
              key={symbol.id}
              className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                currentSymbol === symbol.id ? 'bg-gray-100 dark:bg-gray-600' : ''
              }`}
              onClick={() => {
                onSymbolChange(symbol.id);
                setIsOpen(false);
              }}
            >
              {symbol.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SymbolSelector;
