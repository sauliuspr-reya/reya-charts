'use client';

import { useState, useEffect } from 'react';
import TradingViewChart from '../components/TradingViewChart';
import SymbolSelector from '../components/SymbolSelector';
import TimeframeSelector from '../components/TimeframeSelector';

export default function Home() {
  const [symbol, setSymbol] = useState('BERAUSDMARK');
  const [resolution, setResolution] = useState('1');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reya Trading View</h1>
      
      <div className="bg-secondary/10 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <SymbolSelector 
            currentSymbol={symbol} 
            onSymbolChange={setSymbol} 
          />
          <TimeframeSelector 
            currentResolution={resolution} 
            onResolutionChange={setResolution} 
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
          <TradingViewChart 
            symbol={symbol} 
            resolution={resolution} 
            setIsLoading={setIsLoading} 
          />
          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Market Overview</h2>
          <p className="text-gray-600 dark:text-gray-300">
            View real-time market data from Reya for {symbol} on {resolution} timeframe.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Trading Information</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Analyze market trends and make informed trading decisions with our advanced charting tools.
          </p>
        </div>
      </div>
    </div>
  );
}
