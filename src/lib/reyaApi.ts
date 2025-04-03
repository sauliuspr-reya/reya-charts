import axios from 'axios';
import type { NetworkType } from '@/components/NetworkSelector';

// Base URLs for different networks
const API_BASE_URLS = {
  mainnet: 'https://api.reya.xyz',
  cronos: 'https://api-cronos.reya.xyz',
  testnet: 'https://api-candles.reya-cronos.network'
};

// Custom API endpoint for testing feature branches
let customApiEndpoint: string | null = null;

// Custom API path for testing new endpoints
let customApiPath: string | null = null;

// Set custom API endpoint
export const setCustomApiEndpoint = (endpoint: string | null) => {
  customApiEndpoint = endpoint;
};

// Set custom API path
export const setCustomApiPath = (path: string | null) => {
  customApiPath = path;
};

// Create a configurable API client
export const createReyaApiClient = (network: NetworkType) => {
  // Use custom API endpoint if provided, otherwise use the default for the network
  const baseURL = customApiEndpoint || API_BASE_URLS[network];
  
  return {
    // Get TradingView chart data
    getTradingViewData: async (symbol: string, resolution: string, from: number, to: number) => {
      try {
        // Use custom API path if provided, otherwise use the default path
        const apiPath = customApiPath || '/api/trading/candles';
        
        // Handle different API formats
        if (apiPath === '/api/trading/candles') {
          // Format for candles API: /api/trading/candles/SYMBOL/RESOLUTION?from=FROM&to=TO
          console.log(`Making candles API request to: ${baseURL}${apiPath}/${symbol}/${resolution}?from=${from}&to=${to}`);
          const response = await axios.get(`${baseURL}${apiPath}/${symbol}/${resolution}`, {
            params: {
              from,
              to
            }
          });
          console.log('Candles API response status:', response.status);
          console.log('Candles API response data type:', typeof response.data);
          console.log('Candles API response data sample:', JSON.stringify(response.data).slice(0, 200));
          return response.data;
        } else {
          // Default format for TradingView API
          console.log(`Making TradingView API request to: ${baseURL}${apiPath}`);
          const response = await axios.get(`${baseURL}${apiPath}`, {
            params: {
              symbol,
              resolution,
              from,
              to
            }
          });
          console.log('TradingView API response status:', response.status);
          console.log('TradingView API response data type:', typeof response.data);
          return response.data;
        }
      } catch (error) {
        console.error('Error fetching TradingView data:', error);
        throw error;
      }
    },
    
    // Get available symbols
    getAvailableSymbols: async () => {
      try {
        // Always use the symbols endpoint regardless of custom path setting
        const response = await axios.get(`${baseURL}/api/tradingview/symbols`);
        return response.data;
      } catch (error) {
        console.error('Error fetching available symbols:', error);
        return [];
      }
    },
    
    // Get base URL
    getBaseUrl: () => baseURL
  };
};

// Export the base URLs for direct access if needed
export { API_BASE_URLS };

// Get the current API endpoint
export const getCurrentApiEndpoint = (network: NetworkType) => {
  return customApiEndpoint || API_BASE_URLS[network];
};

// Get the current API path
export const getCurrentApiPath = () => {
  return customApiPath || '/api/trading/candles';
};
