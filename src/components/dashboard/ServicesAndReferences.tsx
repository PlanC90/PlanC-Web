import React from 'react';

const ServicesAndReferences: React.FC = () => {
  const services = [
    "Contract Writing",
    "Software Development",
    "Project Management Consulting",
    "Social Media Management",
    "Community Building Support",
    "Listing Services",
  ];

  const references = [
    {
      name: "Memex",
      imageUrl: "https://pbs.twimg.com/profile_images/1862867193412591616/4qGwnjJC_400x400.jpg",
      link: "https://memextoken.org",
    },
    {
      name: "Electraprotocol",
      imageUrl: "https://pbs.twimg.com/profile_images/1331917259191808000/E1UyOz3m_400x400.png",
      link: "https://t.co/DW6bb9avue",
    },
    // Add more references here as needed
  ];

  return (
    <div className="py-16 px-4 container mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12 font-syncopate">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center space-x-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl font-medium">{service}</p>
          </div>
        ))}
      </div>

      <h2 className="text-4xl font-bold text-center mb-12 font-syncopate">Our References</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {references.map((reference, index) => (
          <a
            key={index}
            href={reference.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center group"
          >
            <img
              src={reference.imageUrl}
              alt={reference.name}
              className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-blue-500 group-hover:border-blue-400 transition-colors duration-300"
            />
            <p className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">{reference.name}</p>
            <span className="text-sm text-gray-400 mt-1 group-hover:text-blue-300 transition-colors duration-300">Visit Website</span>
          </a>
        ))}
      </div>
      {references.length === 0 && (
        <div className="text-center text-lg text-gray-300 mt-8">
          <p>Our strong partnerships and successful projects speak for themselves. We are proud to have collaborated with various clients, delivering exceptional results and fostering long-term relationships.</p>
          <p className="mt-4">More details about our references are available upon request.</p>
        </div>
      )}
    </div>
  );
};

export default ServicesAndReferences;
