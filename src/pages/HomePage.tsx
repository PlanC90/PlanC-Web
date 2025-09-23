import React from 'react';
import MarketOverview from '../components/dashboard/MarketOverview';
import PortfolioTracker from '../components/dashboard/PortfolioTracker';
import PriceCharts from '../components/dashboard/PriceCharts';
import ServicesAndReferences from '../components/dashboard/ServicesAndReferences'; // Import the new component

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
        style={{ backgroundImage: "url('https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div> {/* Overlay */}
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-syncopate">
            <span className="text-blue-500">PLAN</span>
            <span className="text-white">C</span>
            <span className="text-sm ml-2 text-blue-400">SPACE</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Crypto united movement community. Strength comes from unity.
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

      {/* PlanC Coin AI Section - NEW with Background */}
      <section
        id="coin-ai"
        className="relative py-16 px-4 text-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://hackernoon.imgix.net/images/0x7a042d5263f77878d321eb50af23fd9e2d7ee188-71a335z.png')" }}
      >
        {/* Overlay for faded effect */}
        <div className="absolute inset-0 bg-gray-900 opacity-80"></div> {/* Adjust opacity for desired fade */}
        <div className="relative z-10 container mx-auto"> {/* Ensure content is above overlay */}
          <h2 className="text-4xl font-bold mb-6 font-syncopate">PlanC Coin AI</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Unlock insights with AI. Query any coin and get intelligent analysis powered by PlanC AI.
          </p>
          <a
            href="https://coinai.planc.space/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 inline-block"
          >
            Explore Coin AI
          </a>
        </div>
      </section>

      {/* Portfolio Tracker Section */}
      <section id="portfolio" className="py-16 px-4 container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 font-syncopate">PlanC Portfolio</h2>
        <PortfolioTracker />
      </section>

      {/* Services and References Section */}
      <section id="services-references" className="py-16 px-4 container mx-auto">
        <ServicesAndReferences />
      </section>

      {/* Add more sections as needed */}
    </div>
  );
};

export default HomePage;
