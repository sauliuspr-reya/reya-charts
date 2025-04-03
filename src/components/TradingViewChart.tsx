'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import axios from 'axios';

interface TradingViewChartProps {
  symbol: string;
  resolution: string;
  setIsLoading: (loading: boolean) => void;
}

interface CandlestickData {
  time: number;
  open: number;
  high: number;
  close: number;
  low: number;
}

const TradingViewChart = ({ symbol, resolution, setIsLoading }: TradingViewChartProps) => {
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
  }, [symbol, resolution]);

  const fetchChartData = async () => {
    if (!seriesRef.current) return;
    
    setIsLoading(true);
    
    try {
      // Calculate time range (last 7 days)
      const to = Math.floor(Date.now() / 1000);
      const from = to - 7 * 24 * 60 * 60; // 7 days in seconds
      
      const response = await axios.get(
        `https://api.reya.xyz/api/tradingview/history?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`
      );
      
      if (response.data && response.data.s === 'ok') {
        const { t, o, h, l, c } = response.data;
        
        const formattedData: CandlestickData[] = t.map((time: number, index: number) => ({
          time,
          open: o[index],
          high: h[index],
          low: l[index],
          close: c[index],
        }));
        
        seriesRef.current.setData(formattedData);
        
        if (chartRef.current && formattedData.length > 0) {
          chartRef.current.timeScale().fitContent();
        }
      } else {
        console.error('Failed to fetch chart data:', response.data);
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
