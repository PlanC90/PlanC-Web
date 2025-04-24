import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-400 py-8">
      <div className="container mx-auto px-4">
        {/* Removed Resources and Subscribe sections */}

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm">
          {/* Legal Disclaimer Text */}
          <p className="mb-4">
            Disclaimer: The data presented on this site is sourced from third-party services.
            This information is for informational purposes only and does not constitute financial or investment advice.
            Always conduct your own research and consult with a qualified financial advisor before making investment decisions.
          </p>
          <p>&copy; {currentYear} PlanC Space. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
