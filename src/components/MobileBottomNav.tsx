import React from 'react';
import { Link } from 'react-router-dom';
import { Home, DollarSign, BarChart2, Send } from 'lucide-react'; // Activity yerine Send ikonu eklendi

const MobileBottomNav: React.FC = () => {
  // Function to handle smooth scroll to Market Overview section (No longer used for Telegram link)
  // const scrollToMarketOverview = (event: React.MouseEvent<HTMLAnchorElement>) => {
  //   const marketOverviewSection = document.getElementById('market-overview');
  //   if (marketOverviewSection) {
  //     marketOverviewSection.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  // Function to handle smooth scroll to Portfolio section
  const scrollToPortfolio = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default link behavior if it's just a hash link on the same page
    // event.preventDefault(); // Uncomment if you only want scrolling and no route change

    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
    // No need to close a menu here as it's a fixed bottom nav
  };

  // Function to handle smooth scroll to Charts section
  const scrollToCharts = (event: React.MouseEvent<HTMLAnchorElement>) => {
     // Prevent default link behavior if it's just a hash link on the same page
     // event.preventDefault(); // Uncomment if you only want scrolling and no route change

     const chartsSection = document.getElementById('price-charts'); // Use the ID we will add to PriceCharts
     if (chartsSection) {
       chartsSection.scrollIntoView({ behavior: 'smooth' });
     }
     // No need to close a menu here
  };


  // Function to handle smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // No need to close a menu here
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-slate-900 glass-card border-t border-slate-700 z-50">
      <div className="flex justify-around items-center h-16">
        {/* Home Link */}
        <Link
          to="/"
          className="flex flex-col items-center justify-center text-gray-300 hover:text-blue-500 transition-colors"
          onClick={scrollToTop} // Scroll to top on Home click
        >
          <Home size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        {/* Telegram Group Link */}
        <a
          href="https://t.me/PlancSpace" // Telegram link
          target="_blank" // Open in new tab
          rel="noopener noreferrer" // Security best practice for target="_blank"
          className="flex flex-col items-center justify-center text-gray-300 hover:text-blue-500 transition-colors"
          // onClick={scrollToMarketOverview} // No longer needed for external link
        >
          <Send size={20} /> {/* Telegram için Send ikonu */}
          <span className="text-xs mt-1">Telegram</span> {/* Metin "Telegram" olarak değiştirildi */}
        </a>

        {/* My Portfolio Link */}
        <Link
          to="/#portfolio" // Link to the portfolio section ID
          className="flex flex-col items-center justify-center text-gray-300 hover:text-blue-500 transition-colors"
          onClick={scrollToPortfolio} // Scroll to portfolio section
        >
          <DollarSign size={20} />
          <span className="text-xs mt-1">Portfolio</span>
        </Link>

        {/* Price Charts Link */}
        <Link
          to="/#price-charts" // Link to the charts section ID
          className="flex flex-col items-center justify-center text-gray-300 hover:text-blue-500 transition-colors"
          onClick={scrollToCharts} // Scroll to charts section
        >
          <BarChart2 size={20} />
          <span className="text-xs mt-1">Charts</span>
        </Link>

        {/* Add other links like PlanC Coin AI, AirDrop, MemeX if desired,
            but typically bottom nav is for main sections.
            External links might be better in a different mobile menu or footer.
        */}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
