import React, { useState, useEffect, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { useMarketData } from '../../contexts/MarketDataContext';
import { usePortfolio } from '../../contexts/PortfolioContext'; // PortfolioContext'i import et
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { format, subDays, getUnixTime } from 'date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// CryptoCompare API Key (Replace with environment variable in production)
const CRYPTOCOMPARE_API_KEY = '8e4a5f43d08ea0ae029f8d6e3dbc95783966b3972d8b1513fdf0db13141af4a7';

const PriceCharts: React.FC = () => {
  const { coins, loading: marketLoading } = useMarketData();
  const { portfolioCoins, loading: portfolioLoading } = usePortfolio(); // PortfolioContext'ten coinleri al
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState('BTC');
  const [timeframe, setTimeframe] = useState('24h'); // '24h', '7d', '30d'

  const [chartPrices, setChartPrices] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);

  // Combine market coins (top 10) and portfolio coins for the dropdown
  const coinOptions = useMemo(() => {
    const combinedCoins = [...coins.slice(0, 10), ...portfolioCoins]; // İlk 10 market coini ve portföy coinlerini birleştir

    // Sembole göre benzersiz hale getir
    const uniqueCoins = combinedCoins.reduce((acc, current) => {
      const x = acc.find(item => item.symbol === current.symbol);
      if (!x) {
        return acc.concat([current]);
      }
      return acc;
    }, [] as typeof combinedCoins); // Tip güvenliği için boş diziye tip ataması

    // Alfabetik sıraya göre sırala (isteğe bağlı)
    uniqueCoins.sort((a, b) => a.symbol.localeCompare(b.symbol));

    return uniqueCoins;
  }, [coins, portfolioCoins]); // coins veya portfolioCoins değiştiğinde yeniden hesapla

  // selectedCoinSymbol veya coinOptions değiştiğinde sembolü güncelle
  useEffect(() => {
    if (coinOptions.length > 0) {
      const coinExists = coinOptions.some(c => c.symbol === selectedCoinSymbol);
      if (!coinExists) {
        // Eğer seçili sembol artık listede yoksa, listedeki ilk coine dön
        setSelectedCoinSymbol(coinOptions[0].symbol);
      }
    } else {
        // Eğer coinOptions boşsa, sembolü sıfırla
        setSelectedCoinSymbol('');
    }
  }, [coinOptions, selectedCoinSymbol]);


  // Coin sembolü veya zaman dilimi değiştiğinde veriyi çek
  useEffect(() => {
    if (!selectedCoinSymbol) {
        setChartLoading(false); // Sembol yoksa yüklemeyi bitir
        setChartPrices([]);
        setChartLabels([]);
        setChartError('Please select a coin.');
        return; // Sembol yoksa çekme
    }

    const fetchHistoricalData = async () => {
      setChartLoading(true);
      setChartError(null);
      setChartPrices([]);
      setChartLabels([]);

      // --- Fetch from CryptoCompare ---
      if (!CRYPTOCOMPARE_API_KEY) {
          setChartError('CryptoCompare API key is not provided.');
          setChartLoading(false);
          return;
      }

      try {
          console.log(`Attempting to fetch chart data from CryptoCompare for ${selectedCoinSymbol} (${timeframe})...`);

          let endpoint = '';
          let limit = 0;
          let aggregate = 1; // Default aggregate
          let ccDateFormat = 'HH:mm';

          switch (timeframe) {
              case '24h':
                  endpoint = '/data/v2/histohour';
                  limit = 24; // 24 hours
                  ccDateFormat = 'HH:mm';
                  break;
              case '7d':
                  endpoint = '/data/v2/histoday';
                  limit = 7; // 7 days
                  ccDateFormat = 'MMM d';
                  break;
              case '30d':
                  endpoint = '/data/v2/histoday';
                  limit = 30; // 30 days
                  ccDateFormat = 'MMM d';
                  break;
              default:
                  endpoint = '/data/v2/histohour';
                  limit = 24;
                  ccDateFormat = 'HH:mm';
          }

          // CryptoCompare limit parameter is the number of data points *before* the current time.
          // To get data *up to* the current time, we use the `toTs` parameter.
          // We fetch `limit` points ending now.
          const nowTimestamp = getUnixTime(new Date());

          const response = await axios.get(
              `https://min-api.cryptocompare.com${endpoint}`,
              {
                  params: {
                      fsym: selectedCoinSymbol,
                      tsym: 'USD',
                      limit: limit -1, // limit is number of data points *before* toTs
                      aggregate: aggregate,
                      toTs: nowTimestamp,
                      api_key: CRYPTOCOMPARE_API_KEY
                  }
              }
          );

          console.log('CryptoCompare API Response:', response); // Log the full response

          // Check for success response and data presence
          if (response.data.Response === 'Success' && response.data.Data && response.data.Data.Data && response.data.Data.Data.length > 0) {
              const priceData = response.data.Data.Data; // CryptoCompare structure

              const labels = priceData.map((item: any) => {
                  const date = new Date(item.time * 1000); // Timestamp is in seconds
                  return format(date, ccDateFormat);
              });
              const prices = priceData.map((item: any) => item.close); // Use 'close' price

              setChartLabels(labels);
              setChartPrices(prices);
              setChartError(null); // Clear error if successful
              console.log(`Successfully fetched ${priceData.length} data points from CryptoCompare for ${selectedCoinSymbol}.`);
          } else {
              // Handle cases where API returns success but no data or an error message
              const errorMessage = response.data.Message || 'No historical data available from CryptoCompare for this period.';
              console.warn(`CryptoCompare returned no data or an error for ${selectedCoinSymbol} (${timeframe}):`, errorMessage, 'Response Data:', response.data);
              setChartError(`Failed to fetch chart data: ${errorMessage}`);
              setChartPrices([]); // Clear data on failure
              setChartLabels([]);
          }

      } catch (cryptocompareError: any) { // Use 'any' for error type to access response properties
          console.error(
            'Error fetching chart data from CryptoCompare:',
            cryptocompareError.response?.status, // Log status code if available
            cryptocompareError.response?.data,   // Log response data if available
            cryptocompareError.message           // Log error message
          );
          setChartError('Failed to fetch chart data from CryptoCompare. Please try again later.');
          setChartPrices([]); // Clear data on failure
          setChartLabels([]);
      } finally {
          setChartLoading(false);
      }
    };

    fetchHistoricalData();

    // No interval refresh for historical data to avoid hitting rate limits quickly.
    // Data is fetched only when selectedCoinSymbol or timeframe changes.

  }, [selectedCoinSymbol, timeframe]); // Dependencies

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: `${selectedCoinSymbol} Price`,
        data: chartPrices,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        pointRadius: 0,
        pointHitRadius: 10,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `Price: $${context.raw.toFixed(2)}`;
          }
        }
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: timeframe === '24h' ? 6 : 10, // More ticks for longer periods
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
          callback: function(value: any) {
            return '$' + value.toFixed(2);
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  const isLoading = marketLoading || portfolioLoading || chartLoading;

  return (
    <div id="price-charts" className="w-full glass-card rounded-lg p-6"> {/* Added id="price-charts" */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white">Price Charts</h2>

        <div className="flex flex-wrap gap-2">
          <select
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus-visible:ring-blue-500"
            value={selectedCoinSymbol}
            onChange={(e) => setSelectedCoinSymbol(e.target.value)}
            disabled={isLoading || coinOptions.length === 0} // Yüklenirken veya coin yoksa disabled yap
          >
            {isLoading && coinOptions.length === 0 ? (
              <option value="">Loading Coins...</option>
            ) : coinOptions.length > 0 ? (
              coinOptions.map((coin) => (
                <option key={coin.symbol} value={coin.symbol}> {/* Use symbol as key */}
                  {coin.name} ({coin.symbol})
                </option>
              ))
            ) : (
                <option value="">No coins available</option>
            )}
          </select>

          <div className="bg-slate-800 border border-slate-700 rounded-lg flex text-sm overflow-hidden">
            <button
              className={`px-3 py-2 ${
                timeframe === '24h' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700'
              }`}
              onClick={() => setTimeframe('24h')}
              disabled={chartLoading}
            >
              24H
            </button>
            <button
              className={`px-3 py-2 ${
                timeframe === '7d' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700'
              }`}
              onClick={() => setTimeframe('7d')}
              disabled={chartLoading}
            >
              7D
            </button>
            <button
              className={`px-3 py-2 ${
                timeframe === '30d' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-slate-700'
              }`}
              onClick={() => setTimeframe('30d')}
              disabled={chartLoading}
            >
              30D
            </button>
          </div>
        </div>
      </div>

      <div className="h-80 flex items-center justify-center">
        {chartLoading ? (
          <div className="text-white text-lg">Loading Chart Data...</div>
        ) : chartError ? (
          <div className="text-red-500 text-lg text-center">{chartError}</div>
        ) : chartPrices.length > 0 ? (
          <Line data={chartData} options={chartOptions as any} />
        ) : (
           <div className="text-gray-400 text-lg">No chart data available for this period.</div>
        )}
      </div>
    </div>
  );
};

export default PriceCharts;
