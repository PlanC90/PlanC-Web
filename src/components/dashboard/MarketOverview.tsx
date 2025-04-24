import React from 'react';
import { useMarketData } from '../../contexts/MarketDataContext';
import { TrendingUp, TrendingDown, BarChart2, RefreshCw, Activity } from 'lucide-react'; // Activity icon eklendi

const MarketOverview: React.FC = () => {
  const {
    loading,
    error,
    risingCoins,
    fallingCoins,
    unchangedCoins,
    marketSentiment,
    marketStats,
    lastUpdated,
    refreshData
  } = useMarketData();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading && !lastUpdated) {
    return (
      <div id="market-overview" className="w-full glass-card rounded-lg p-6 animate-pulse"> {/* Added id="market-overview" */}
        <div className="h-8 bg-slate-700 rounded w-1/2 mb-4"></div>
        <div className="h-24 bg-slate-700 rounded mb-4"></div>
        <div className="flex gap-4">
          <div className="h-20 bg-slate-700 rounded flex-1"></div>
          <div className="h-20 bg-slate-700 rounded flex-1"></div>
          <div className="h-20 bg-slate-700 rounded flex-1"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="market-overview" className="w-full glass-card rounded-lg p-6 border border-red-500"> {/* Added id="market-overview" */}
        <div className="text-red-500 font-medium mb-2">Error loading market data</div>
        <p className="text-gray-300 mb-4">{error}</p>
        <button
          onClick={() => refreshData()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div id="market-overview" className="w-full glass-card rounded-lg p-6"> {/* Added id="market-overview" */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Market Overview</h2>
        <div className="flex items-center">
          {lastUpdated && (
            <span className="text-gray-400 text-sm mr-3">
              Updated: {formatTime(lastUpdated)}
            </span>
          )}
          <button
            onClick={() => refreshData()}
            className="text-gray-400 hover:text-white transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Market Sentiment Indicator */}
      <div className={`mb-8 p-4 rounded-lg ${
        marketSentiment === 'rise' ? 'bg-green-900/30' : 'bg-red-900/30'
      }`}>
        <div className="flex items-center gap-3">
          {marketSentiment === 'rise' ? (
            <TrendingUp size={32} className="text-green-400" />
          ) : (
            <TrendingDown size={32} className="text-red-400" />
          )}
          <div>
            <h3 className={`text-2xl font-bold ${
              marketSentiment === 'rise' ? 'text-green-400' : 'text-red-400'
            }`}>
              Market Will {marketSentiment === 'rise' ? 'Rise ✅' : 'Fall 🚨'}
            </h3>
            <p className="text-gray-300 text-sm">1-Hour analysis for the top 100 cryptocurrencies</p>
          </div>
        </div>

        {/* Rising, Falling, Unchanged Counts - Order is fixed here */}
        <div className="grid grid-cols-3 gap-6 mt-6">
          <div className="text-center">
            <div className="text-green-400 text-2xl font-bold">{risingCoins}</div>
            <div className="text-gray-400 text-sm">Rising</div>
          </div>
          <div className="text-center">
            <div className="text-red-400 text-2xl font-bold">{fallingCoins}</div>
            <div className="text-gray-400 text-sm">Falling</div>
          </div>
          <div className="text-center">
            <div className="text-gray-300 text-2xl font-bold">{unchangedCoins}</div>
            <div className="text-gray-400 text-sm">Unchanged</div>
          </div>
        </div>
      </div>

      {/* Market Stats - Order is fixed here */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MarketStat
          icon={<BarChart2 size={20} className="text-blue-400" />}
          title="Market Cap"
          value={marketStats.marketCap}
        />
        <MarketStat
          icon={<BarChart2 size={20} className="text-purple-400" />}
          title="Volume 24H"
          value={marketStats.volume24h}
        />
        <MarketStat
          icon={<BarChart2 size={20} className="text-yellow-400" />}
          title="BTC Dominance"
          value={marketStats.btcDominance}
        />
      </div>
    </div>
  );
};

interface MarketStatProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const MarketStat: React.FC<MarketStatProps> = ({ icon, title, value }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-4 flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <div className="text-white text-xl font-semibold">{value}</div>
      </div>
    </div>
  );
};

export default MarketOverview;
