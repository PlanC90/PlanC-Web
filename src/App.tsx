import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import { MarketDataProvider } from './contexts/MarketDataContext';
import { PortfolioProvider } from './contexts/PortfolioContext';

function App() {
  return (
    <MarketDataProvider>
      <PortfolioProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </PortfolioProvider>
    </MarketDataProvider>
  );
}

export default App;
