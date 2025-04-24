import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo: React.FC = () => {
  return (
    <Helmet>
      <title>PlanC Space - Cryptocurrency Investment Platform</title>
      <meta name="description" content="PlanC Space - Cryptocurrency investment platform with real-time market data, portfolio tracking, and investment insights." />
      <meta name="keywords" content="planc, planc space, kripto topluluğu, cryptocurrency, bitcoin, crypto investment" />
      <meta property="og:title" content="PlanC Space - Cryptocurrency Investment Platform" />
      <meta property="og:description" content="Get real-time cryptocurrency market data, track your portfolio, and make informed investment decisions with PlanC Space." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://planc.space" />
      
      {/* Schema.org structured data for rich results */}
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "PlanC Space",
            "url": "https://planc.space",
            "description": "Cryptocurrency investment platform with real-time market data, portfolio tracking, and investment insights.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://planc.space/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          }
        `}
      </script>
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://planc.space" />
    </Helmet>
  );
};

export default Seo;
