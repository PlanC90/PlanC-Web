import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useMarketData } from './MarketDataContext'; // MarketDataContext'ten genel coin listesini almak için

// Define the structure for a fixed portfolio coin with a predefined amount
interface FixedPortfolioCoin {
  symbol: string;
  amount: number; // Predefined amount for calculation
}

// Define the structure for the coin data enriched with market info and calculated values
interface EnrichedPortfolioCoin {
  id: string; // Added id for potential future use
  symbol: string;
  name: string;
  amount: number;
  price_usd: number;
  value_usd: number; // amount * price_usd
  percent_of_total: number; // (value_usd / total_value) * 100
  percent_change_1h: number | null;
  percent_change_7d: number | null; // Added 7d change
  percent_change_30d: number | null; // Added 30d change
  percent_change_1y: number | null; // Added 1y change
  // Add other relevant fields from CoinPaprika if needed
}

interface PortfolioContextType {
  portfolioCoins: EnrichedPortfolioCoin[];
  totalPortfolioValue: number; // Keep total value in context for calculations, but remove from display
  portfolioPerformance1h: number; // 1h change based on the fixed portfolio
  portfolioPerformance7d: number; // Added 7d performance
  portfolioPerformance30d: number; // Added 30d performance
  portfolioPerformance1y: number; // Added 1y performance
  bestPerformer: EnrichedPortfolioCoin | null;
  loading: boolean;
  error: string | null;
}

// Define the fixed list of coins and their predefined amounts
// These amounts are placeholders and can be adjusted.
const FIXED_PORTFOLIO_COINS: FixedPortfolioCoin[] = [
  { symbol: 'SHIB', amount: 1000000 },
  { symbol: 'HOT', amount: 50000 },
  { symbol: 'CSPR', amount: 1000 },
  { symbol: 'BONE', amount: 500 },
  { symbol: 'BAD', amount: 100000 },
  { symbol: 'BLOK', amount: 50000 },
  { symbol: 'XEP', amount: 100000 },
  { symbol: 'OMAX', amount: 500000 },
  { symbol: 'AREA', amount: 10000 },
  // Note: The symbol 'S' from the image is too generic and not found on CoinPaprika.
  // It has been excluded from this fixed list.
  // Removed XOR, OMC, LOVELY, and KNINE as requested
  { symbol: 'S', amount: 1000 }, // Assuming an amount, adjust as needed
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolioCoins, setPortfolioCoins] = useState<EnrichedPortfolioCoin[]>([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [portfolioPerformance1h, setPortfolioPerformance1h] = useState(0);
  const [portfolioPerformance7d, setPortfolioPerformance7d] = useState(0); // State for 7d performance
  const [portfolioPerformance30d, setPortfolioPerformance30d] = useState(0); // State for 30d performance
  const [portfolioPerformance1y, setPortfolioPerformance1y] = useState(0); // State for 1y performance
  const [bestPerformer, setBestPerformer] = useState<EnrichedPortfolioCoin | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data for the fixed portfolio coins from CoinPaprika
  useEffect(() => {
    const fetchPortfolioData = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log('Fetching portfolio data from CoinPaprika...');
        // Fetch all tickers from CoinPaprika
        const response = await axios.get('https://api.coinpaprika.com/v1/tickers');

        if (response.data && Array.isArray(response.data)) {
          const allCoinPaprikaTickers = response.data;

          // Filter and enrich the fixed portfolio coins with CoinPaprika data
          const enrichedCoins: EnrichedPortfolioCoin[] = [];
          let currentTotalValue = 0;
          let totalHourlyChangeValue = 0;
          let total7dChangeValue = 0; // Accumulator for 7d value change
          let total30dChangeValue = 0; // Accumulator for 30d value change
          let total1yChangeValue = 0; // Accumulator for 1y value change


          FIXED_PORTFOLIO_COINS.forEach(fixedCoin => {
            const paprikaCoin = allCoinPaprikaTickers.find(
              (c: any) => c.symbol.toUpperCase() === fixedCoin.symbol.toUpperCase()
            );

            if (paprikaCoin && paprikaCoin.quotes && paprikaCoin.quotes.USD) { // Check if quotes and USD exist
              // Add robust checks for data validity and access via quotes.USD
              const priceUsd = typeof paprikaCoin.quotes.USD.price === 'number' ? paprikaCoin.quotes.USD.price : 0;
              const percentChange1h = typeof paprikaCoin.quotes.USD.percent_change_1h === 'number' ? paprikaCoin.quotes.USD.percent_change_1h : null;
              const percentChange7d = typeof paprikaCoin.quotes.USD.percent_change_7d === 'number' ? paprikaCoin.quotes.USD.percent_change_7d : null; // Get 7d change
              const percentChange30d = typeof paprikaCoin.quotes.USD.percent_change_30d === 'number' ? paprikaCoin.quotes.USD.percent_change_30d : null; // Get 30d change
              const percentChange1y = typeof paprikaCoin.quotes.USD.percent_change_1y === 'number' ? paprikaCoin.quotes.USD.percent_change_1y : null; // Get 1y change
              const coinName = paprikaCoin.name || fixedCoin.symbol; // Use symbol as fallback for name

              const valueUsd = fixedCoin.amount * priceUsd;
              currentTotalValue += valueUsd;

              // Calculate the value change in the last hour, 7d, 30d, 1y
              const hourlyChangeValue = valueUsd * (percentChange1h !== null ? percentChange1h / 100 : 0);
              totalHourlyChangeValue += hourlyChangeValue;

              const d7ChangeValue = valueUsd * (percentChange7d !== null ? percentChange7d / 100 : 0);
              total7dChangeValue += d7ChangeValue;

              const d30ChangeValue = valueUsd * (percentChange30d !== null ? percentChange30d / 100 : 0);
              total30dChangeValue += d30ChangeValue;

              const y1ChangeValue = valueUsd * (percentChange1y !== null ? percentChange1y / 100 : 0);
              total1yChangeValue += y1ChangeValue;


              enrichedCoins.push({
                id: paprikaCoin.id, // Include id
                symbol: fixedCoin.symbol.toUpperCase(), // Use fixedCoin symbol for consistency
                name: coinName,
                amount: fixedCoin.amount,
                price_usd: priceUsd,
                value_usd: valueUsd,
                percent_of_total: 0, // Will calculate after total value is known
                percent_change_1h: percentChange1h,
                percent_change_7d: percentChange7d, // Add 7d change
                percent_change_30d: percentChange30d, // Add 30d change
                percent_change_1y: percentChange1y, // Add 1y change
              });
            } else {
              console.warn(`CoinPaprika data not found or incomplete for symbol: ${fixedCoin.symbol}`);
              // Add coin with 0 values if not found or data is incomplete
               enrichedCoins.push({
                id: fixedCoin.symbol.toLowerCase(), // Use symbol as a fallback id
                symbol: fixedCoin.symbol.toUpperCase(),
                name: fixedCoin.symbol, // Use symbol as name if not found
                amount: fixedCoin.amount,
                price_usd: 0,
                value_usd: 0,
                percent_of_total: 0,
                percent_change_1h: null,
                percent_change_7d: null, // Set to null if data not found
                percent_change_30d: null, // Set to null if data not found
                percent_change_1y: null, // Set to null if data not found
              });
            }
          });

          // Calculate percentages after total value is known
          // Ensure enrichedCoins is an array before mapping
          const finalEnrichedCoins = Array.isArray(enrichedCoins) ? enrichedCoins.map(coin => ({
            ...coin,
            percent_of_total: currentTotalValue > 0 ? (coin.value_usd / currentTotalValue) * 100 : 0,
          })) : []; // Fallback to empty array if enrichedCoins is not an array

          // Calculate total portfolio performance percentages
          const finalPortfolioPerformance1h = currentTotalValue > 0 ? (totalHourlyChangeValue / currentTotalValue) * 100 : 0;
          const finalPortfolioPerformance7d = currentTotalValue > 0 ? (total7dChangeValue / currentTotalValue) * 100 : 0; // Calculate 7d performance
          const finalPortfolioPerformance30d = currentTotalValue > 0 ? (total30dChangeValue / currentTotalValue) * 100 : 0; // Calculate 30d performance
          const finalPortfolioPerformance1y = currentTotalValue > 0 ? (total1yChangeValue / currentTotalValue) * 100 : 0; // Calculate 1y performance


          // Find best performer based on 1h change among the fixed coins
          let best = null;
          let highestChange = -Infinity;

          // Ensure finalEnrichedCoins is an array before iterating
          if (Array.isArray(finalEnrichedCoins)) {
            finalEnrichedCoins.forEach(coin => {
              // Add type check for percent_change_1h before comparison
              if (coin.percent_change_1h !== null && typeof coin.percent_change_1h === 'number' && coin.percent_change_1h > highestChange) {
                highestChange = coin.percent_change_1h;
                best = coin;
              }
            });
          }


          setPortfolioCoins(finalEnrichedCoins);
          setTotalPortfolioValue(currentTotalValue);
          setPortfolioPerformance1h(finalPortfolioPerformance1h);
          setPortfolioPerformance7d(finalPortfolioPerformance7d); // Set 7d performance state
          setPortfolioPerformance30d(finalPortfolioPerformance30d); // Set 30d performance state
          setPortfolioPerformance1y(finalPortfolioPerformance1y); // Set 1y performance state
          setBestPerformer(best);
          console.log('Portfolio data fetched and processed.');

        } else {
           setError('Invalid data format from CoinPaprika.');
           setPortfolioCoins([]);
           setTotalPortfolioValue(0);
           setPortfolioPerformance1h(0);
           setPortfolioPerformance7d(0); // Reset 7d performance
           setPortfolioPerformance30d(0); // Reset 30d performance
           setPortfolioPerformance1y(0); // Reset 1y performance
           setBestPerformer(null);
           console.error('Invalid data format from CoinPaprika:', response.data);
        }

      } catch (e) {
        console.error('Error fetching portfolio data from CoinPaprika:', e);
        setError('Failed to fetch portfolio data from CoinPaprika.');
        setPortfolioCoins([]);
        setTotalPortfolioValue(0);
        setPortfolioPerformance1h(0);
        setPortfolioPerformance7d(0); // Reset 7d performance
        setPortfolioPerformance30d(0); // Reset 30d performance
        setPortfolioPerformance1y(0); // Reset 1y performance
        setBestPerformer(null);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data initially and then refresh periodically (e.g., every 5 minutes)
    fetchPortfolioData();
    const interval = setInterval(fetchPortfolioData, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const value = {
    portfolioCoins,
    totalPortfolioValue, // Still provide total value in context for potential future use/calculations
    portfolioPerformance1h,
    portfolioPerformance7d, // Provide 7d performance
    portfolioPerformance30d, // Provide 30d performance
    portfolioPerformance1y, // Provide 1y performance
    bestPerformer,
    loading,
    error,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};
