'use client';

import { useState, useEffect } from 'react';
import { setCustomApiEndpoint, getCurrentApiEndpoint, setCustomApiPath, getCurrentApiPath } from '@/lib/reyaApi';
import type { NetworkType } from '@/components/NetworkSelector';

interface CustomApiEndpointProps {
  network: NetworkType;
  onEndpointChange?: (endpoint: string | null, path: string | null) => void;
}

const CustomApiEndpoint = ({ network, onEndpointChange }: CustomApiEndpointProps) => {
  const [customEndpoint, setCustomEndpoint] = useState<string>('');
  const [customPath, setCustomPath] = useState<string>('/api/candles');
  const [isCustomEndpointActive, setIsCustomEndpointActive] = useState<boolean>(false);
  const [isCustomPathActive, setIsCustomPathActive] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<string>('');

  // Update placeholder and initialize values only on the client side
  useEffect(() => {
    // Set placeholder based on network
    setPlaceholder(`Custom API endpoint (default: ${getCurrentApiEndpoint(network)})`);
    
    // Initialize custom path with the current API path
    setCustomPath(getCurrentApiPath());
    
    // Check if there are already active custom settings
    if (getCurrentApiEndpoint(network) !== null) {
      setCustomEndpoint(getCurrentApiEndpoint(network) || '');
      setIsCustomEndpointActive(true);
    }
    
    if (getCurrentApiPath() !== null) {
      setCustomPath(getCurrentApiPath() || '/api/candles');
      setIsCustomPathActive(true);
    }
  }, [network]);

  // Handle toggling custom endpoint
  const handleToggleCustomEndpoint = () => {
    if (isCustomEndpointActive) {
      // Disable custom endpoint
      setCustomApiEndpoint(null);
      setIsCustomEndpointActive(false);
      if (onEndpointChange) onEndpointChange(null, isCustomPathActive ? customPath : null);
    } else if (customEndpoint.trim()) {
      // Enable custom endpoint
      setCustomApiEndpoint(customEndpoint.trim());
      setIsCustomEndpointActive(true);
      if (onEndpointChange) onEndpointChange(customEndpoint.trim(), isCustomPathActive ? customPath : null);
    }
  };
  
  // Handle toggling custom path
  const handleToggleCustomPath = () => {
    if (isCustomPathActive) {
      // Disable custom path
      setCustomApiPath(null);
      setIsCustomPathActive(false);
      if (onEndpointChange) onEndpointChange(isCustomEndpointActive ? customEndpoint : null, null);
    } else if (customPath.trim()) {
      // Enable custom path
      setCustomApiPath(customPath.trim());
      setIsCustomPathActive(true);
      if (onEndpointChange) onEndpointChange(isCustomEndpointActive ? customEndpoint : null, customPath.trim());
    }
  };

  // Handle endpoint input change
  const handleEndpointInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomEndpoint(e.target.value);
  };
  
  // Handle path input change
  const handlePathInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomPath(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Apply endpoint changes if there's a value
    if (customEndpoint.trim()) {
      setCustomApiEndpoint(customEndpoint.trim());
      setIsCustomEndpointActive(true);
    }
    
    // Apply path changes if there's a value
    if (customPath.trim()) {
      setCustomApiPath(customPath.trim());
      setIsCustomPathActive(true);
    }
    
    // Notify parent component of changes
    if (onEndpointChange) {
      onEndpointChange(
        isCustomEndpointActive ? customEndpoint.trim() : null,
        isCustomPathActive ? customPath.trim() : null
      );
    }
  };

  // Quick setup for testnet with api-candles endpoint
  const setupTestnetApiCandles = () => {
    // Set network to testnet in parent component
    if (network !== 'testnet' && onEndpointChange) {
      // This will trigger the parent component to change the network
      onEndpointChange(null, '/api/candles');
    }
    
    // Set the custom path to /api/candles
    setCustomPath('/api/candles');
    setCustomApiPath('/api/candles');
    setIsCustomPathActive(true);
    
    // Disable custom endpoint if active
    if (isCustomEndpointActive) {
      setCustomApiEndpoint(null);
      setIsCustomEndpointActive(false);
    }
  };

  return (
    <div className="mb-4 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-medium text-white mb-2">API Configuration</h3>
      
      {/* Quick Setup Section */}
      <div className="mb-4 pb-4 border-b border-gray-700">
        <h4 className="text-md font-medium text-white mb-2">Quick Setup</h4>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={setupTestnetApiCandles}
            className={`px-3 py-2 rounded-md ${network === 'testnet' && isCustomPathActive && customPath === '/api/candles' ? 'bg-green-600' : 'bg-blue-600'} text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            Testnet with /api/candles
          </button>
        </div>
        {network === 'testnet' && isCustomPathActive && customPath === '/api/candles' && (
          <div className="mt-2 text-green-400 text-sm">
            Using Testnet with /api/candles endpoint
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Endpoint Configuration */}
        <div className="border-b border-gray-700 pb-3">
          <h4 className="text-md font-medium text-white mb-2">Endpoint URL</h4>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={customEndpoint}
              onChange={handleEndpointInputChange}
              placeholder={placeholder}
              className="flex-grow px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isCustomEndpointActive}
                  onChange={handleToggleCustomEndpoint}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full ${isCustomEndpointActive ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isCustomEndpointActive ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="ml-3 text-white text-sm">
                {isCustomEndpointActive ? 'Using custom endpoint' : 'Using default endpoint'}
              </div>
            </label>
          </div>
          {isCustomEndpointActive && (
            <div className="text-green-400 text-sm mt-1">
              Active endpoint: {customEndpoint}
            </div>
          )}
        </div>
        
        {/* API Path Configuration */}
        <div className="pb-3">
          <h4 className="text-md font-medium text-white mb-2">API Path</h4>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={customPath}
              onChange={handlePathInputChange}
              placeholder="Custom API path (e.g., /api/candles)"
              className="flex-grow px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isCustomPathActive}
                  onChange={handleToggleCustomPath}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full ${isCustomPathActive ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isCustomPathActive ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="ml-3 text-white text-sm">
                {isCustomPathActive ? 'Using custom API path' : 'Using default API path'}
              </div>
            </label>
          </div>
          {isCustomPathActive && (
            <div className="text-green-400 text-sm mt-1">
              Active API path: {customPath}
            </div>
          )}
        </div>
        
        {/* Apply Button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Apply Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomApiEndpoint;
