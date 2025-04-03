# Reya Trading App with TradingView Charts

A simple trading application built with Next.js that integrates with Reya API to display TradingView charts for various trading pairs.

## Features

- Real-time TradingView charts using Reya API
- Multiple trading pairs selection
- Timeframe selection (1m, 5m, 15m, 30m, 1h, 4h, 1d, 1w)
- Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Technologies Used

- Next.js - React framework
- Reya API - Trading data provider
- Lightweight Charts - TradingView charts library
- Tailwind CSS - Utility-first CSS framework
- TypeScript - Type-safe JavaScript

## API Reference

The application uses the Reya API to fetch trading data. Example API call:

```
https://api.reya.xyz/api/tradingview/history?symbol=BERAUSDMARK&resolution=1&from=1742132000&to=1742832900
```

Parameters:
- `symbol`: Trading pair (e.g., BERAUSDMARK)
- `resolution`: Timeframe (e.g., 1 for 1 minute)
- `from`: Start timestamp in seconds
- `to`: End timestamp in seconds

## License

MIT
