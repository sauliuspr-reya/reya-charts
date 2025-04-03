'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { createReyaApiClient } from '@/lib/reyaApi';
import type { NetworkType } from '@/components/NetworkSelector';

interface TradingViewChartProps {
  symbol: string;
  resolution: string;
  network: NetworkType;
  setIsLoading: (loading: boolean) => void;
}

interface CandlestickData {
  time: number | string;
  open: number;
  high: number;
  close: number;
  low: number;
}

const TradingViewChart = ({ symbol, resolution, network, setIsLoading }: TradingViewChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous chart if it exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    // Create new chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1E1E30' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    // Handle window resize
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Fetch data
    fetchChartData();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol, resolution, network]);

  const fetchChartData = async () => {
    if (!seriesRef.current) return;
    
    setIsLoading(true);
    
    try {
      // Calculate time range based on resolution
      const to = Math.floor(Date.now() / 1000);
      let from = to;
      
      // Adjust time range based on resolution
      switch (resolution) {
        case '1':
          // 1 minute - fetch 1 day of data
          from = to - 24 * 60 * 60;
          break;
        case '5':
          // 5 minutes - fetch 5 days of data
          from = to - 5 * 24 * 60 * 60;
          break;
        case '15':
          // 15 minutes - fetch 7 days of data
          from = to - 7 * 24 * 60 * 60;
          break;
        case '30':
          // 30 minutes - fetch 14 days of data
          from = to - 14 * 24 * 60 * 60;
          break;
        case '60':
          // 1 hour - fetch 30 days of data
          from = to - 30 * 24 * 60 * 60;
          break;
        case '240':
          // 4 hours - fetch 60 days of data
          from = to - 60 * 24 * 60 * 60;
          break;
        case '1D':
          // 1 day - fetch 180 days of data
          from = to - 180 * 24 * 60 * 60;
          break;
        case '1W':
          // 1 week - fetch 365 days of data
          from = to - 365 * 24 * 60 * 60;
          break;
        default:
          // Default to 30 days
          from = to - 30 * 24 * 60 * 60;
      }
      
      console.log(`Fetching data for resolution ${resolution} from ${new Date(from * 1000).toLocaleDateString()} to ${new Date(to * 1000).toLocaleDateString()}`);
      
      // Use the network-aware API client
      const reyaApi = createReyaApiClient(network);
      const data = await reyaApi.getTradingViewData(symbol, resolution, from, to);
      
      // Log the data to see its structure
      console.log('API Response:', data);
      console.log('API Response Type:', typeof data);
      if (data) {
        console.log('Is Array:', Array.isArray(data));
        console.log('Keys:', Object.keys(data));
        if (typeof data === 'object' && data !== null) {
          console.log('Sample Data:', JSON.stringify(data).slice(0, 200));
        }
      }
      
      let formattedData: CandlestickData[] = [];
      
      // Handle different API response formats
      if (data && data.s === 'ok') {
        // Default TradingView API format
        const { t, o, h, l, c } = data;
        
        formattedData = t.map((time: number, index: number) => ({
          time,
          open: o[index],
          high: h[index],
          low: l[index],
          close: c[index],
        }));
      } else if (data && Array.isArray(data)) {
        // Candles API format - array of candle objects
        formattedData = data.map((candle: any) => {
          // Convert timestamp to proper format for lightweight-charts
          let timeValue = candle.timestamp || candle.time;
          
          // Format the time value based on resolution
          if (typeof timeValue === 'string') {
            // If it's already a string (like ISO date), use it directly
            // or convert to appropriate format if needed
            if (timeValue.includes('T')) {
              // ISO format - convert to Unix timestamp in seconds
              timeValue = Math.floor(new Date(timeValue).getTime() / 1000);
            }
          } else if (typeof timeValue === 'number') {
            // If timestamp is in milliseconds (very large number), convert to seconds
            if (timeValue > 2000000000) {
              timeValue = Math.floor(timeValue / 1000);
            }
          }
          
          // Convert numeric values to ensure they're numbers
          return {
            time: timeValue,
            open: typeof candle.open === 'string' ? parseFloat(candle.open) : candle.open,
            high: typeof candle.high === 'string' ? parseFloat(candle.high) : candle.high,
            low: typeof candle.low === 'string' ? parseFloat(candle.low) : candle.low,
            close: typeof candle.close === 'string' ? parseFloat(candle.close) : candle.close,
          };
        });
        
        // Sort by time ascending if needed
        formattedData.sort((a, b) => {
          const timeA = typeof a.time === 'number' ? a.time : 0;
          const timeB = typeof b.time === 'number' ? b.time : 0;
          return timeA - timeB;
        });
        
        console.log('Formatted candles data:', formattedData.slice(0, 3));
      } else if (data && typeof data === 'object') {
        // Check if it's the TradingView format without the 's' property
        if (data.t && data.o && data.h && data.l && data.c &&
            Array.isArray(data.t) && Array.isArray(data.o) && 
            Array.isArray(data.h) && Array.isArray(data.l) && 
            Array.isArray(data.c)) {
          
          console.log('Found TradingView format data without s property');
          const { t, o, h, l, c } = data;
          
          formattedData = t.map((time: number, index: number) => ({
            time,
            open: o[index],
            high: h[index],
            low: l[index],
            close: c[index],
          }));
        } else if (data.candles && Array.isArray(data.candles)) {
          formattedData = data.candles.map((candle: any) => {
            let timeValue = candle.timestamp || candle.time;
            if (timeValue > 2000000000) {
              timeValue = Math.floor(timeValue / 1000);
            }
            
            return {
              time: timeValue,
              open: parseFloat(candle.open),
              high: parseFloat(candle.high),
              low: parseFloat(candle.low),
              close: parseFloat(candle.close),
            };
          });
          
          formattedData.sort((a, b) => {
            const timeA = typeof a.time === 'number' ? a.time : 0;
            const timeB = typeof b.time === 'number' ? b.time : 0;
            return timeA - timeB;
          });
        } else {
          console.error('Unknown object data format:', data);
        }
      } else {
        console.error('Unknown data format:', data);
      }
      
      if (formattedData.length > 0) {
        console.log('Setting chart data with', formattedData.length, 'candles');
        console.log('First few candles:', formattedData.slice(0, 3));
        
        try {
          seriesRef.current.setData(formattedData);
          
          if (chartRef.current) {
            chartRef.current.timeScale().fitContent();
          }
        } catch (error) {
          console.error('Error setting chart data:', error);
        }
      } else {
        console.error('Failed to fetch chart data:', data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chart-container" ref={chartContainerRef}></div>
  );
};

export default TradingViewChart;
