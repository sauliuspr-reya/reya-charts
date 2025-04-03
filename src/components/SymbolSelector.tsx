'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { createReyaApiClient } from '@/lib/reyaApi';
import type { NetworkType } from './NetworkSelector';

interface SymbolSelectorProps {
  currentSymbol: string;
  onSymbolChange: (symbol: string) => void;
  network: NetworkType;
}

const SymbolSelector = ({ currentSymbol, onSymbolChange, network }: SymbolSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [symbols, setSymbols] = useState<{ id: string; name: string; marketId?: any }[]>([
    { id: 'BERAUSDMARK', name: 'BERA/USD MARK' },
    { id: 'BTCUSDMARK', name: 'BTC/USD MARK' },
    { id: 'ETHUSDMARK', name: 'ETH/USD MARK' },
    { id: 'SOLUSDMARK', name: 'SOL/USD MARK' },
    { id: 'AVAXUSDMARK', name: 'AVAX/USD MARK' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available markets from the API
  useEffect(() => {
    const fetchMarkets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const reyaApi = createReyaApiClient(network);
        const baseURL = reyaApi.getBaseUrl();
        
        // Try different possible API endpoints for markets
        let response;
        let endpoints = [
          '/api/markets',
          '/api/tradingview/symbols',
          '/api/trading/markets'
        ];
        
        let error = null;
        for (const endpoint of endpoints) {
          try {
            console.log(`Attempting to fetch markets from ${baseURL}${endpoint}`);
            response = await axios.get(`${baseURL}${endpoint}`);
            console.log(`Successfully fetched from ${endpoint}`);
            break; // Exit the loop if successful
          } catch (err: any) {
            console.log(`Failed to fetch from ${endpoint}:`, err.message || 'Unknown error');
            error = err;
          }
        }
        
        if (!response) {
          throw error || new Error('All market endpoints failed');
        }
        
        if (response.data && Array.isArray(response.data)) {
          // Log the first few items to understand the structure
          console.log('Sample market data:', response.data.slice(0, 3));
          
          // Format the markets data
          const marketsData = response.data.map((market: any) => {
            // Extract the symbol ID, prioritizing ticker or symbol fields
            const id = market.ticker || market.symbol || market.id || '';
            
            // For the display name, try to use a readable format
            let name = market.displayName || market.display_name || market.name || '';
            
            // Ensure name and id are strings
            const nameStr = String(name);
            const idStr = String(id);
            
            // Special handling for Reya markets with quoteToken field
            if (market.quoteToken) {
              // Format as OPUSDMARK for the API
              const formattedId = `${market.quoteToken}USDMARK`;
              // Get the market ID (numeric)
              const marketId = market.id || '';
              // Display as "2 - BTCUSDMARK" format
              name = `${marketId} - ${formattedId}`;
              // Update the id to match the expected format for the API
              return { id: formattedId, name, marketId };
            }
            // Check for base_currency and quote_currency fields
            else if (market.base_currency && market.quote_currency) {
              name = `${market.base_currency}/${market.quote_currency}`;
              // Add MARK suffix if it's a mark price
              if (idStr.includes('MARK') || idStr.toUpperCase().includes('MARK')) {
                name += ' MARK';
              }
            }
            // Check for base and quote fields
            else if (market.base && market.quote) {
              name = `${market.base}/${market.quote}`;
              // Add MARK suffix if it's a mark price
              if (idStr.includes('MARK') || idStr.toUpperCase().includes('MARK')) {
                name += ' MARK';
              }
            }
            // Format the name if it doesn't already have a slash
            else if (!nameStr.includes('/')) {
              // Try to format like BTC/USD
              if (idStr.includes('USD')) {
                const base = idStr.replace('USD', '').replace('MARK', '');
                name = `${base}/USD MARK`;
              } else {
                name = nameStr || idStr;
              }
            }
            
            return { id, name };
          });
          
          console.log(`Found ${marketsData.length} markets`);
          
          // Sort markets by ID (numeric)
          const sortedMarkets = marketsData.sort((a, b) => {
            // Extract numeric IDs if available
            const idA = a.marketId ? parseInt(String(a.marketId), 10) : 0;
            const idB = b.marketId ? parseInt(String(b.marketId), 10) : 0;
            
            // If both have numeric IDs, sort by them
            if (!isNaN(idA) && !isNaN(idB)) {
              return idA - idB;
            }
            
            // Fallback to alphabetical sorting by name
            return a.name.localeCompare(b.name);
          });
          
          setSymbols(sortedMarkets);
          
          // Find market with ID 2 and select it by default
          const market2 = sortedMarkets.find(market => {
            const marketId = market.marketId ? parseInt(String(market.marketId), 10) : 0;
            return marketId === 2;
          });
          
          if (market2 && market2.id !== currentSymbol) {
            console.log('Setting default market to ID 2:', market2.id);
            onSymbolChange(market2.id);
          }
        } else {
          console.log('Invalid markets data format:', response.data);
          // Keep the default symbols
        }
      } catch (error) {
        console.error('Error fetching markets:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          setError(`Failed to fetch markets: ${error.message}`);
        } else {
          setError('Failed to fetch markets');
        }
        
        // Log the network and API URL for debugging
        try {
          const reyaApi = createReyaApiClient(network);
          console.log('Current network:', network);
          console.log('Base URL:', reyaApi.getBaseUrl());
        } catch (e) {
          console.error('Error getting API info:', e);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarkets();
  }, [network]);

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
          {isLoading ? (
            <div className="px-4 py-2 text-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : error ? (
            <div className="px-4 py-2 text-red-500">{error}</div>
          ) : (
            symbols.map((symbol) => (
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SymbolSelector;
