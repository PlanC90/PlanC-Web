import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

// Define sort state type
interface SortState {
  field: 'name' | 'price_usd' | 'percent_change_1h' | 'percent_change_24h' | 'percent_change_7d' | 'percent_change_30d' | 'percent_change_1y' | 'fixedRatioDisplay' | null; // Added fixedRatioDisplay to sortable fields
  direction: 'asc' | 'desc';
}

const PortfolioTracker: React.FC = () => {
  const {
    portfolioCoins,
    portfolioPerformance1h,
    portfolioPerformance24h, // Consume the new 24h performance
    portfolioPerformance7d,
    portfolioPerformance30d,
    portfolioPerformance1y,
    bestPerformer1h, // Use the new name
    bestPerformer24h, // Consume the new 24h best performer
    loading,
    error
  } = usePortfolio();

  // State for sorting
  const [sortState, setSortState] = useState<SortState>({ field: 'price_usd', direction: 'asc' });


  // Helper function to render performance metric
  const renderPerformance = (label: string, performance: number) => {
    // Ensure performance is a number before rendering
    if (typeof performance !== 'number') {
      return (
        <div className="bg-slate-800/50 rounded-lg p-4">
          <h3 className="text-gray-400 text-sm mb-1">{label}</h3>
          <div className="text-gray-300 text-sm">N/A</div>
        </div>
      );
    }

    const isPositive = performance >= 0;
    const textColor = isPositive ? 'text-green-400' : 'text-red-400';
    const Icon = isPositive ? TrendingUp : TrendingDown;

    return (
      <div className="bg-slate-800/50 rounded-lg p-4">
        <h3 className="text-gray-400 text-sm mb-1">{label}</h3>
        <div className={`text-2xl font-bold flex items-center ${textColor}`}>
          <Icon size={20} className="mr-1" />
          {(isPositive ? '+' : '') + performance.toFixed(2) + '%'}
        </div>
      </div>
    );
  };

  // Helper function to render individual coin percentage change
  const renderCoinChange = (change: number | null) => {
    if (change === null || typeof change !== 'number') {
      return <span className="text-gray-400">N/A</span>;
    }
    const isPositive = change >= 0;
    const textColor = isPositive ? 'text-green-400' : 'text-red-400';
    const Icon = isPositive ? TrendingUp : TrendingDown;

    return (
      <span className={`flex items-center ${textColor}`}>
        <Icon size={14} className="mr-1" />
        {(isPositive ? '+' : '') + change.toFixed(2)}%
      </span>
    );
  };

  // Helper function to format large numbers for volume
  const formatVolume = (volume: number | null): string => {
    if (volume === null || typeof volume !== 'number') {
      return 'N/A';
    }
    // Simple formatting for millions/billions
    if (volume >= 1e9) {
      return '$' + (volume / 1e9).toFixed(2) + 'B';
    }
    if (volume >= 1e6) {
      return '$' + (volume / 1e6).toFixed(2) + 'M';
    }
    return '$' + volume.toFixed(2);
  };

  // Helper function to format price
  const formatPrice = (price: number | null): string => {
    if (price === null || typeof price !== 'number') {
      return 'N/A';
    }
    // Always use toFixed(6) for more precision as requested
    return '$' + price.toFixed(6);
  };


  // Handle sorting logic
  const handleSort = (field: SortState['field']) => {
    setSortState(prev => {
      if (prev.field === field) {
        // If clicking the same header, toggle direction
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        // If clicking a new header, set field and default to ascending
        return { field, direction: 'asc' };
      }
    });
  };

  // Sort the portfolio coins based on the current sort state and filter out HTX
  const sortedPortfolioCoins = useMemo(() => {
    if (!portfolioCoins || portfolioCoins.length === 0) {
      return []; // Return empty array if no data
    }

    // Filter out the coin with symbol "HTX"
    const filteredCoins = portfolioCoins.filter(coin => coin.symbol !== 'HTX');

    if (!sortState.field) {
      return filteredCoins; // Return filtered if no sort field selected
    }

    const sortableCoins = [...filteredCoins];

    sortableCoins.sort((a, b) => {
      const field = sortState.field!; // We know field is not null here
      // Use type assertion to access the correct field name
      let aValue: any = (a as any)[field];
      let bValue: any = (b as any)[field];

      // Handle null/undefined values for numeric fields
      if (typeof aValue !== 'number' && aValue !== null) aValue = String(aValue).toLowerCase();
      if (typeof bValue !== 'number' && bValue !== null) bValue = String(bValue).toLowerCase();

      // Custom comparison for nulls (treat null as smaller)
      if (aValue === null && bValue !== null) return sortState.direction === 'asc' ? -1 : 1;
      if (aValue !== null && bValue === null) return sortState.direction === 'asc' ? 1 : -1;
      if (aValue === null && bValue === null) return 0;


      if (aValue < bValue) {
        return sortState.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortState.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sortableCoins;
  }, [portfolioCoins, sortState]); // Re-sort when portfolioCoins or sortState changes


  return (
    <div id="portfolio" className="w-full glass-card rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Wallet size={24} className="text-blue-400 mr-2" />
        PlanC Portfolio
      </h2>

      {/* Adjusted grid layout to accommodate 6 items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {renderPerformance("1h Performance", portfolioPerformance1h)}
        {renderPerformance("24h Performance", portfolioPerformance24h)} {/* Added 24h Performance box */}
        {renderPerformance("7d Performance", portfolioPerformance7d)}
        {renderPerformance("30d Performance", portfolioPerformance30d)}
        {renderPerformance("1y Performance", portfolioPerformance1y)}

        {/* Best Performer (1h) Box */}
        {bestPerformer1h ? (
          <div className="bg-slate-800/50 rounded-lg p-4"> {/* Removed col-span classes */}
            <h3 className="text-gray-400 text-sm mb-1">Best Performer (1h)</h3>
            <div className="flex items-center">
              <div className="text-white font-bold">{bestPerformer1h.name} ({bestPerformer1h.symbol})</div>
              {bestPerformer1h.percent_change_1h !== null && typeof bestPerformer1h.percent_change_1h === 'number' && (
                 <div className={`ml-2 flex items-center ${bestPerformer1h.percent_change_1h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                   {bestPerformer1h.percent_change_1h >= 0 ? (
                     <TrendingUp size={16} className="mr-1" />
                   ) : (
                     <TrendingDown size={16} className="mr-1" />
                   )}
                   {bestPerformer1h.percent_change_1h >= 0 ? '+' : ''}{bestPerformer1h.percent_change_1h.toFixed(2)}%
                 </div>
              )}
            </div>
            {/* Display the current price of the best performer */}
            <div className="text-sm text-gray-400 mt-1">
              Price: {formatPrice(bestPerformer1h.price_usd)}
            </div>
             {/* Add 24h Volume */}
            <div className="text-sm text-gray-400 mt-1">
              24h Volume: {formatVolume(bestPerformer1h.volume_24h)}
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-lg p-4"> {/* Removed col-span classes */}
            <h3 className="text-gray-400 text-sm mb-1">Best Performer (1h)</h3>
            <div className="text-gray-300 text-sm">No data to determine best performer.</div>
          </div>
        )}

         {/* Best Performer (24h) Box - NEW */}
        {bestPerformer24h ? (
          <div className="bg-slate-800/50 rounded-lg p-4"> {/* Removed col-span classes */}
            <h3 className="text-gray-400 text-sm mb-1">Best Performer (24h)</h3>
            <div className="flex items-center">
              <div className="text-white font-bold">{bestPerformer24h.name} ({bestPerformer24h.symbol})</div>
              {bestPerformer24h.percent_change_24h !== null && typeof bestPerformer24h.percent_change_24h === 'number' && (
                 <div className={`ml-2 flex items-center ${bestPerformer24h.percent_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                   {bestPerformer24h.percent_change_24h >= 0 ? (
                     <TrendingUp size={16} className="mr-1" />
                   ) : (
                     <TrendingDown size={16} className="mr-1" />
                   )}
                   {bestPerformer24h.percent_change_24h >= 0 ? '+' : ''}{bestPerformer24h.percent_change_24h.toFixed(2)}%
                 </div>
              )}
            </div>
            {/* Display the current price of the best performer */}
            <div className="text-sm text-gray-400 mt-1">
              Price: {formatPrice(bestPerformer24h.price_usd)}
            </div>
             {/* Add 24h Volume */}
            <div className="text-sm text-gray-400 mt-1">
              24h Volume: {formatVolume(bestPerformer24h.volume_24h)}
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 rounded-lg p-4"> {/* Removed col-span classes */}
            <h3 className="text-gray-400 text-sm mb-1">Best Performer (24h)</h3>
            <div className="text-gray-300 text-sm">No data to determine best performer.</div>
          </div>
        )}
      </div>

      <div>
        {/* Updated header with link */}
        <h3 className="text-lg font-medium text-white mb-4 flex items-center">
          Coin Basket
          <a
            href="https://planc.space/basket/basket.php"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 text-blue-400 hover:underline text-sm font-normal"
          >
            Click for detailed data!
          </a>
        </h3>
        {loading ? (
          <div className="text-center py-6 text-gray-400">Loading portfolio data...</div>
        ) : error ? (
           <div className="text-center py-6 text-red-400">{error}</div>
        ) : !Array.isArray(sortedPortfolioCoins) || sortedPortfolioCoins.length === 0 ? ( // Use sortedPortfolioCoins here
          <div className="text-center py-6 text-gray-400">
            No portfolio coins defined or data not found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700">
              <thead className="bg-slate-800">
                <tr>
                  {/* Coin Header - Sortable by name */}
                  <SortableTableHeader
                    field="name"
                    label="Coin"
                    currentSort={sortState}
                    onSort={handleSort}
                    className="text-left" // Keep text-left for coin name column
                  />
                  {/* Investment % Header - Sortable by fixedRatioDisplay */}
                  <SortableTableHeader
                    field="fixedRatioDisplay"
                    label="Investment %"
                    currentSort={sortState}
                    onSort={handleSort}
                    className="text-center" // Center this header
                  />
                   {/* Price Header - Sortable by price_usd */}
                   <SortableTableHeader
                    field="price_usd"
                    label="Price"
                    currentSort={sortState}
                    onSort={handleSort}
                    className="text-center" // Center this header
                  />
                  {/* Percentage Change Headers - Sortable by respective fields */}
                  <SortableTableHeader
                    field="percent_change_1h"
                    label="1h %"
                    currentSort={sortState}
                    onSort={handleSort}
                    className="text-center" // Center this header
                  />
                   {/* 24h Change Header - Sortable by percent_change_24h */}
                   <SortableTableHeader
                    field="percent_change_24h"
                    label="24h %"
                    currentSort={sortState}
                    onSort={handleSort}
                    className="text-center" // Center this header
                  />
                  <SortableTableHeader
                    field="percent_change_7d"
                    label="7d %"
                    currentSort={sortState}
                    onSort={handleSort}
                    className="text-center" // Center this header
                  />
                  <SortableTableHeader
                    field="percent_change_30d"
                    label="30d %"
                    currentSort={sortState}
                    onSort={handleSort}
                    className="text-center" // Center this header
                  />
                  <SortableTableHeader
                    field="percent_change_1y"
                    label="1y %"
                    currentSort={sortState}
                    onSort={handleSort}
                    className="text-center" // Center this header
                  />
                </tr>
              </thead>
              <tbody className="bg-slate-900 divide-y divide-slate-800">
                {sortedPortfolioCoins.map((portfolioCoin) => (
                    <tr key={portfolioCoin.symbol} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-white">{portfolioCoin.name}</div>
                            <div className="text-sm text-gray-400">{portfolioCoin.symbol}</div>
                          </div>
                        </div>
                      </td>
                      {/* Investment % Data Cell - Displaying portfolioCoin.fixedRatioDisplay */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center"> {/* Centered cell content */}
                        {portfolioCoin.fixedRatioDisplay.toFixed(2)}% {/* Display the fixed ratio */}
                      </td>
                       {/* Price Data Cell - Displaying portfolioCoin.price_usd */}
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-center"> {/* Centered cell content */}
                        {formatPrice(portfolioCoin.price_usd)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center"> {/* Centered cell content */}
                        {renderCoinChange(portfolioCoin.percent_change_1h)}
                      </td>
                       {/* 24h Change Data Cell - Displaying portfolioCoin.percent_change_24h */}
                       <td className="px-6 py-4 whitespace-nowrap text-sm text-center"> {/* Centered cell content */}
                        {renderCoinChange(portfolioCoin.percent_change_24h)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center"> {/* Centered cell content */}
                        {renderCoinChange(portfolioCoin.percent_change_7d)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center"> {/* Centered cell content */}
                        {renderCoinChange(portfolioCoin.percent_change_30d)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center"> {/* Centered cell content */}
                        {renderCoinChange(portfolioCoin.percent_change_1y)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Sortable Table Header component
interface SortableTableHeaderProps {
  field: SortState['field'];
  label: string;
  currentSort: SortState;
  onSort: (field: SortState['field']) => void;
  className?: string; // Optional class for text alignment
}

const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({ field, label, currentSort, onSort, className }) => {
  const isCurrentField = currentSort.field === field;

  return (
    <th
      className={`px-6 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors ${className}`}
      onClick={() => onSort(field)}
    >
      <div className={`flex items-center ${className === 'text-center' ? 'justify-center' : ''}`}> {/* Center content if className is text-center */}
        {label}
        {isCurrentField && (
          <span className="ml-1">
            {currentSort.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
};


export default PortfolioTracker;
