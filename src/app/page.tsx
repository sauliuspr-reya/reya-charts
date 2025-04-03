'use client';

import { useState, useEffect } from 'react';
import TradingViewChart from '@/components/TradingViewChart';
import SymbolSelector from '@/components/SymbolSelector';
import TimeframeSelector from '@/components/TimeframeSelector';
import NetworkSelector from '@/components/NetworkSelector';
import ApiPathSelector from '@/components/ApiPathSelector';
import type { NetworkType } from '@/components/NetworkSelector';

export default function Home() {
  // We'll set BTCUSDMARK as default since it's likely to be market ID 2
  const [symbol, setSymbol] = useState('BTCUSDMARK');
  const [resolution, setResolution] = useState('1');
  const [network, setNetwork] = useState<NetworkType>('testnet');
  const [apiPath, setApiPath] = useState('/api/trading/candles');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Only render the component on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until the component is mounted on the client
  if (!mounted) {
    return (
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Reya Trading View</h1>
        <div className="bg-secondary/10 p-4 rounded-lg mb-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reya Trading View</h1>
      
      <div className="bg-secondary/10 p-4 rounded-lg mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <SymbolSelector 
            currentSymbol={symbol} 
            onSymbolChange={setSymbol} 
            network={network}
          />
          <TimeframeSelector 
            currentResolution={resolution} 
            onResolutionChange={(newResolution) => {
              setResolution(newResolution);
              // Force refresh chart data when resolution changes
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 100);
            }} 
          />
          <NetworkSelector
            currentNetwork={network}
            onNetworkChange={(newNetwork) => {
              setNetwork(newNetwork);
              // If switching to testnet, suggest using the candles API
              if (newNetwork === 'testnet') {
                console.log('Switched to testnet, suggesting candles API');
              }
              // Force refresh chart data when network changes
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}
          />
          <ApiPathSelector 
            currentPath={apiPath}
            onPathChange={(path) => {
              console.log('API path changed:', path);
              setApiPath(path);
              
              // If we're setting up for candles API, suggest switching to testnet
              if (path === '/api/trading/candles' && network !== 'testnet') {
                console.log('Switching to testnet for candles API');
                setNetwork('testnet');
              }
              
              // Force refresh chart data when path changes
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}
          />
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2">
          <TradingViewChart 
            symbol={symbol} 
            resolution={resolution} 
            network={network}
            setIsLoading={setIsLoading} 
          />
          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
