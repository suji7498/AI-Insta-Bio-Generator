import React, { useState, useEffect } from 'react';
import { GroundingSource } from '../types';

interface BioDisplayProps {
  bios: string[];
  sources: GroundingSource[];
}

const BioDisplay: React.FC<BioDisplayProps> = ({ bios, sources }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (bio: string, index: number) => {
    navigator.clipboard.writeText(bio);
    setCopiedIndex(index);
  };

  useEffect(() => {
    if (copiedIndex !== null) {
      const timer = setTimeout(() => setCopiedIndex(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedIndex]);

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Here are your new bios!</h3>
      {bios.map((bio, index) => (
        <div key={index} className="bg-white/90 p-4 rounded-lg shadow-md flex items-center justify-between transition-transform duration-300 hover:scale-102 hover:shadow-lg">
          <p className="text-gray-700 flex-grow mr-4 break-words">{bio}</p>
          <button
            onClick={() => handleCopy(bio, index)}
            className="flex-shrink-0 bg-purple-200 text-purple-800 font-semibold px-3 py-1 rounded-md hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            aria-label={`Copy bio ${index + 1}`}
          >
            {copiedIndex === index ? 'Copied!' : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
            )}
          </button>
        </div>
      ))}
       {sources && sources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-300">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Sources of Inspiration:</h4>
            <ul className="space-y-1">
                {sources.map((source, index) => (
                    source.web && source.web.uri && (
                        <li key={index} className="text-xs text-gray-500 truncate">
                            <a 
                                href={source.web.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-purple-600 hover:underline inline-flex items-center"
                                title={source.web.title}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                {source.web.title || new URL(source.web.uri).hostname}
                            </a>
                        </li>
                    )
                ))}
            </ul>
        </div>
      )}
    </div>
  );
};

export default BioDisplay;
