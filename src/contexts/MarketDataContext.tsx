import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Define interfaces for data from both APIs
interface CoinGeckoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  ath_date: string | null;
  atl: number | null;
  atl_change_percentage: number | null;
  atl_date: string | null;
  roi: any; // Can be null or an object
  last_updated: string;
  // Add 1h and 7d change fields if available from CoinGecko's /coins/markets endpoint
  // Note: CoinGecko /coins/markets endpoint provides price_change_percentage_1h_in_currency, etc.
  price_change_percentage_1h_in_currency?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
}

interface CoinPaprikaCoin {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  price_usd: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  volume_24h_usd: number;
  market_cap_usd: number;
}

// Mapped structure for components (combining relevant fields)
interface MappedCoin {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  price: number;
  percent_change_1h: number | null;
  percent_change_24h: number | null;
  percent_change_7d: number | null;
  volume_24h: number;
  market_cap: number;
  image?: string; // Available from CoinGecko
}

interface MarketStats {
  marketCap: string;
  volume24h: string;
  btcDominance: string;
}

interface MarketDataContextType {
  coins: MappedCoin[];
  loading: boolean;
  error: string | null;
  risingCoins: number;
  fallingCoins: number;
  unchangedCoins: number;
  marketSentiment: 'rise' | 'fall' | 'neutral';
  marketStats: MarketStats;
  lastUpdated: Date | null;
  refreshData: () => Promise<void>;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};

export const MarketDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<MappedCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [marketStats, setMarketStats] = useState<MarketStats>({
    marketCap: '0',
    volume24h: '0',
    btcDominance: '0',
  });

  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    let dataFetched = false;

    // --- Attempt to fetch from CoinGecko first ---
    try {
      console.log('Attempting to fetch data from CoinGecko...');
      // Fetch top 100 coins by market cap from CoinGecko
      const response = await axios.get<CoinGeckoCoin[]>(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
            price_change_percentage: '1h,24h,7d' // Request 1h, 24h, 7d changes
          }
        }
      );

      const mappedCoins: MappedCoin[] = response.data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(), // Standardize symbol to uppercase
        name: coin.name,
        rank: coin.market_cap_rank,
        price: coin.current_price,
        percent_change_1h: coin.price_change_percentage_1h_in_currency,
        percent_change_24h: coin.price_change_percentage_24h,
        percent_change_7d: coin.price_change_percentage_7d_in_currency,
        volume_24h: coin.total_volume,
        market_cap: coin.market_cap,
        image: coin.image,
      }));

      setCoins(mappedCoins);

      // CoinGecko provides global data separately, but we can calculate from top 100 for consistency
      const totalMarketCap = mappedCoins.reduce((sum, coin) => sum + coin.market_cap, 0);
      const totalVolume = mappedCoins.reduce((sum, coin) => sum + coin.volume_24h, 0);
      const btcCoin = mappedCoins.find(coin => coin.symbol === 'BTC');
      const btcDominance = btcCoin ? ((btcCoin.market_cap / totalMarketCap) * 100).toFixed(2) : '0';

      setMarketStats({
        marketCap: formatCurrency(totalMarketCap),
        volume24h: formatCurrency(totalVolume),
        btcDominance: `${btcDominance}%`,
      });

      setLastUpdated(new Date());
      dataFetched = true;
      console.log('Successfully fetched data from CoinGecko.');

    } catch (coingeckoError) {
      console.error('Error fetching market data from CoinGecko:', coingeckoError);
      setError('Failed to fetch market data from CoinGecko. Attempting fallback...');

      // --- Fallback to CoinPaprika ---
      try {
        console.log('Attempting to fetch data from CoinPaprika (fallback)...');
        const response = await axios.get<CoinPaprikaCoin[]>('https://api.coinpaprika.com/v1/tickers');

        const top100Coins: CoinPaprikaCoin[] = response.data.slice(0, 100);

        const mappedCoins: MappedCoin[] = top100Coins.map(coin => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(), // Standardize symbol to uppercase
            name: coin.name,
            rank: coin.rank,
            price: coin.price_usd,
            percent_change_1h: coin.percent_change_1h,
            percent_change_24h: coin.percent_change_24h,
            percent_change_7d: coin.percent_change_7d,
            volume_24h: coin.volume_24h_usd,
            market_cap: coin.market_cap_usd,
            // image is not available in this endpoint
            image: undefined, // Explicitly set undefined if not available
        }));

        setCoins(mappedCoins);

        // Calculate market stats using CoinPaprika data
        const totalMarketCap = mappedCoins.reduce((sum, coin) => sum + coin.market_cap, 0);
        const totalVolume = mappedCoins.reduce((sum, coin) => sum + coin.volume_24h, 0);
        const btcCoin = mappedCoins.find(coin => coin.symbol === 'BTC');
        const btcDominance = btcCoin ? ((btcCoin.market_cap / totalMarketCap) * 100).toFixed(2) : '0';

        setMarketStats({
          marketCap: formatCurrency(totalMarketCap),
          volume24h: formatCurrency(totalVolume),
          btcDominance: `${btcDominance}%`,
        });

        setLastUpdated(new Date());
        dataFetched = true;
        setError(null); // Clear error if fallback succeeds
        console.log('Successfully fetched data from CoinPaprika (fallback).');

      } catch (coinpaprikaError) {
        console.error('Error fetching market data from CoinPaprika fallback:', coinpaprikaError);
        setError('Failed to fetch market data from both CoinGecko and CoinPaprika. Please try again later.');
        setCoins([]); // Clear coins if both fail
        setMarketStats({ marketCap: '0', volume24h: '0', btcDominance: '0' });
        setLastUpdated(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined || isNaN(value)) {
        return '$0'; // Handle potential NaN or null values
    }
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  useEffect(() => {
    fetchMarketData();

    // Refresh data every 1 minute (60 seconds)
    // Be mindful of API rate limits, especially with free tiers.
    const interval = setInterval(fetchMarketData, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Derived values - Using 24h change
  // Ensure we handle potential null/undefined values for percent_change_24h
  const risingCoins = coins.filter(coin => coin.percent_change_24h !== null && coin.percent_change_24h !== undefined && coin.percent_change_24h > 0).length;
  const fallingCoins = coins.filter(coin => coin.percent_change_24h !== null && coin.percent_change_24h !== undefined && coin.percent_change_24h < 0).length;
  const unchangedCoins = coins.filter(coin => coin.percent_change_24h === null || coin.percent_change_24h === undefined || coin.percent_change_24h === 0).length;
  // Market sentiment based on 24h change for top 100
  const marketSentiment = risingCoins > fallingCoins ? 'rise' : (fallingCoins > risingCoins ? 'fall' : 'neutral');


  const refreshData = async () => {
    await fetchMarketData();
  };

  const value = {
    coins,
    loading,
    error,
    risingCoins,
    fallingCoins,
    unchangedCoins,
    marketSentiment,
    marketStats,
    lastUpdated,
    refreshData,
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
};
