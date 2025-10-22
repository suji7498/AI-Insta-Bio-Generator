
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-4">
      <div className="inline-block bg-white/30 backdrop-blur-lg rounded-full px-8 py-4 shadow-lg">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
          AI Instagram Bio Generator
        </h1>
      </div>
    </header>
  );
};

export default Header;
