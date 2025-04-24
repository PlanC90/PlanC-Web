import React from 'react';
import MarketOverview from '../components/dashboard/MarketOverview';
import PortfolioTracker from '../components/dashboard/PortfolioTracker';
import PriceCharts from '../components/dashboard/PriceCharts';

const HomePage: React.FC = () => {
  // Function to handle smooth scroll to Market Overview section
  const scrollToMarketOverview = () => {
    const marketSection = document.getElementById('market-overview');
    if (marketSection) {
      marketSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Background Image */}
      <div
        className="relative h-screen bg-cover bg-center flex items-center justify-center text-center"
        style={{ backgroundImage: "url('https://planc.space/bitcoin.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div> {/* Overlay */}
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-syncopate">
            <span className="text-blue-500">PLAN</span>
            <span className="text-white">C</span>
            <span className="text-sm ml-2 text-blue-400">SPACE</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Your ultimate dashboard for tracking crypto market data and managing your portfolio.
          </p>
          <div className="flex justify-center space-x-4">
            {/* Updated "Explore Market" button */}
            <a
              href="https://t.me/PlancSpace"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Telegram Group
            </a>
            {/* "Track Portfolio" button - scrolls to portfolio section */}
            <button
              onClick={() => {
                const portfolioSection = document.getElementById('portfolio');
                if (portfolioSection) {
                  portfolioSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
              Track Portfolio
            </button>
          </div>
        </div>
      </div>

      {/* Market Overview Section */}
      <section id="market-overview" className="py-16 px-4 container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 font-syncopate">Market Overview</h2>
        <MarketOverview />
      </section>

      {/* Price Charts Section */}
      <section id="price-charts" className="py-16 px-4 container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 font-syncopate">Price Charts</h2>
        <PriceCharts />
      </section>

      {/* Portfolio Tracker Section */}
      <section id="portfolio" className="py-16 px-4 container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 font-syncopate">PlanC Portfolio</h2>
        <PortfolioTracker />
      </section>

      {/* Add more sections as needed */}
    </div>
  );
};

export default HomePage;
