import React, { useState } from 'react';
import { useMarketData } from '../../contexts/MarketDataContext';
import { usePortfolio } from '../../contexts/PortfolioContext';
import { TrendingUp, TrendingDown, Plus, Search } from 'lucide-react';

const CoinTable: React.FC = () => {
  const { coins, loading } = useMarketData();
  const { addCoin } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState({ field: 'rank', direction: 'asc' });
  const [selectedCoin, setSelectedCoin] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');

  // Filter coins based on search query
  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort coins based on sort criteria
  const sortedCoins = [...filteredCoins].sort((a, b) => {
    let aValue = a[sortBy.field as keyof typeof a];
    let bValue = b[sortBy.field as keyof typeof b];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortBy.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortBy.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleAddToPortfolio = () => {
    if (selectedCoin && amount && parseFloat(amount) > 0) {
      const coin = coins.find(c => c.id === selectedCoin);
      if (coin) {
        addCoin({
          id: coin.id,
          symbol: coin.symbol,
          amount: parseFloat(amount)
        });
        setSelectedCoin(null);
        setAmount('');
      }
    }
  };

  const formatPercent = (value: number | undefined | null) => {
    if (typeof value !== 'number') return 'N/A';
    return value > 0 ? `+${value.toFixed(2)}%` : `${value.toFixed(2)}%`;
  };

  if (loading && coins.length === 0) {
    return (
      <div className="w-full glass-card rounded-lg p-6 animate-pulse">
        <div className="h-10 bg-slate-700 rounded w-full mb-6"></div>
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full glass-card rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-xl font-bold text-white">Top Cryptocurrencies</h2>
        <div className="relative flex-1 md:max-w-xs">
          <input
            type="text"
            placeholder="Search coins..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-700">
          <thead className="bg-slate-800">
            <tr>
              <TableHeader field="rank" label="#" currentSort={sortBy} onSort={handleSort} />
              <TableHeader field="name" label="Name" currentSort={sortBy} onSort={handleSort} />
              <TableHeader field="price_usd" label="Price" currentSort={sortBy} onSort={handleSort} />
              <TableHeader field="percent_change_1h" label="1h %" currentSort={sortBy} onSort={handleSort} />
              <TableHeader field="percent_change_24h" label="24h %" currentSort={sortBy} onSort={handleSort} />
              <TableHeader field="market_cap_usd" label="Market Cap" currentSort={sortBy} onSort={handleSort} />
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Add
              </th>
            </tr>
          </thead>
          <tbody className="bg-slate-900 divide-y divide-slate-800">
            {sortedCoins.slice(0, 20).map((coin) => (
              <tr key={coin.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {coin.rank}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{coin.name}</div>
                      <div className="text-sm text-gray-400">{coin.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  {coin.price_usd != null ? (
                    `$${coin.price_usd < 1 ? coin.price_usd.toFixed(6) : coin.price_usd.toFixed(2)}`
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    typeof coin.percent_change_1h === 'number' && coin.percent_change_1h > 0 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {typeof coin.percent_change_1h === 'number' && coin.percent_change_1h > 0 ? (
                      <TrendingUp size={12} className="mr-1" />
                    ) : (
                      <TrendingDown size={12} className="mr-1" />
                    )}
                    {formatPercent(coin.percent_change_1h)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    typeof coin.percent_change_24h === 'number' && coin.percent_change_24h > 0 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {typeof coin.percent_change_24h === 'number' && coin.percent_change_24h > 0 ? (
                      <TrendingUp size={12} className="mr-1" />
                    ) : (
                      <TrendingDown size={12} className="mr-1" />
                    )}
                    {formatPercent(coin.percent_change_24h)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  ${(coin.market_cap_usd / 1e9).toFixed(2)}B
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {selectedCoin === coin.id ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-20 px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-white"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                      />
                      <button
                        onClick={handleAddToPortfolio}
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      >
                        Add
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedCoin(coin.id)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface TableHeaderProps {
  field: string;
  label: string;
  currentSort: { field: string; direction: string };
  onSort: (field: string) => void;
}

const TableHeader: React.FC<TableHeaderProps> = ({ field, label, currentSort, onSort }) => {
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {label}
        {currentSort.field === field && (
          <span className="ml-1">
            {currentSort.direction === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
};

export default CoinTable;
