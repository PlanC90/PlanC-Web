import React from 'react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <section
      className="relative h-screen flex items-center justify-center text-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/843700/pexels-photo-843700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
    >
      {/* Overlay for better text readability and black theme */}
      <div className="absolute inset-0 bg-black opacity-70"></div>

      {/* Background elements for visual interest (kept for existing design) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 leading-tight font-syncopate">
          <span className="text-blue-500">PLAN</span>
          <span className="text-white">C</span>
          <span className="text-xl ml-2 text-blue-400">SPACE</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Crypto united movement community. Strength comes from unity.
        </p>
        <div className="flex flex-wrap justify-center items-center space-x-4"> {/* Changed to flex-wrap and added space-x-4 */}
          <a
            href="https://t.me/plancspace"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
          >
            Telegram Group
          </a>
          <Link
            to="/#portfolio"
            className="px-8 py-3 bg-slate-700 text-gray-200 font-semibold rounded-lg shadow-lg hover:bg-slate-600 transition-all duration-300 transform hover:scale-105"
          >
            Track Portfolio
          </Link>
          <a
            href="https://omax.fun/token/0x022A26D6B758CB5f94671E880BBC22A69582690B"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
          >
            Buy PlanC Token
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
