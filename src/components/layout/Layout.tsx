import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Seo from '../seo/Seo';
import ScrollToTopButton from '../ScrollToTopButton';
import MobileBottomNav from '../MobileBottomNav'; // Import the new component

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Seo />
      <Header />
      {/* Removed container mx-auto px-4 from main to allow banner to be full width */}
      <main className="flex-1 py-6">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
      <MobileBottomNav /> {/* Add the mobile bottom navigation here */}
    </div>
  );
};

export default Layout;
