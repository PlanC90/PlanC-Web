import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react'; // ChevronDown will no longer be needed for the dropdown

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Function to handle smooth scroll to Portfolio section
  const scrollToPortfolio = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default link behavior if needed, though Link with # should work
    // event.preventDefault();
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  // Function to handle smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900 shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={scrollToTop}> {/* Add onClick for logo */}
            <span className="text-3xl font-bold tracking-tighter text-white font-syncopate">
              <span className="text-blue-500">PLAN</span>
              <span className="text-white">C</span>
              <span className="text-xs ml-1 text-blue-400">SPACE</span>
            </span>
          </Link>

          {/* Desktop Navigation - All items side-by-side */}
          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" onClick={scrollToTop}>Home</NavLink> {/* Add onClick for Home */}
            <NavLink to="/#portfolio" onClick={scrollToPortfolio}>My Portfolio</NavLink>
            {/* Links previously under 'Tools' dropdown, now directly in nav */}
            <ExternalNavLink href="https://planccoin.netlify.app/">PlanC Coin AI</ExternalNavLink>
            {/* AirDrop and Telegram Group links removed */}
            <ExternalNavLink href="https://memextoken.org">MemeX</ExternalNavLink>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-card">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/" onClick={scrollToTop}>Home</MobileNavLink> {/* Add onClick for Home */}
            <MobileNavLink to="/#portfolio" onClick={scrollToPortfolio}>My Portfolio</MobileNavLink>
            {/* Links previously under 'Tools' dropdown, now directly in mobile nav */}
            <MobileExternalNavLink href="https://planccoin.netlify.app/" onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>PlanC Coin AI</MobileExternalNavLink> {/* Use scrollToTop here */}
            {/* AirDrop and Telegram Group links removed */}
            <MobileExternalNavLink href="https://memextoken.org" onClick={() => { scrollToTop(); setIsMenuOpen(false); }}>MemeX</MobileExternalNavLink> {/* Use scrollToTop here */}
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void; // Add onClick to props
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, className, onClick }) => ( // Accept onClick
  <Link
    to={to}
    className={`text-gray-300 hover:text-white font-medium transition-colors ${className || ''}`}
    onClick={onClick} // Pass onClick to Link
  >
    {children}
  </Link>
);

interface ExternalNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void; // Add onClick to props
}

// Component for external links opening in a new tab
const ExternalNavLink: React.FC<ExternalNavLinkProps> = ({ href, children, className, onClick }) => ( // Accept onClick
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer" // Security best practice
    className={`text-gray-300 hover:text-white font-medium transition-colors ${className || ''}`}
    onClick={onClick} // Pass onClick to a
  >
    {children}
  </a>
);


interface MobileNavLinkProps extends NavLinkProps {
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void; // Ensure onClick is defined
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, children, onClick, className }) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 ${className || ''}`}
    onClick={onClick} // Pass onClick to Link
  >
    {children}
  </Link>
);

interface MobileExternalNavLinkProps extends ExternalNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void; // Ensure onClick is defined
}

// Component for external links in mobile menu opening in a new tab
const MobileExternalNavLink: React.FC<MobileExternalNavLinkProps> = ({ href, children, onClick, className }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer" // Security best practice
    className={`block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-800 ${className || ''}`}
    onClick={onClick} // Pass onClick to a
  >
    {children}
  </a>
);


export default Header;
