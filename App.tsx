import React, { useState } from 'react';
import { UserData, GroundingSource } from './types';
import { generateBio } from './services/geminiService';
import Header from './components/Header';
import BioGeneratorForm from './components/BioGeneratorForm';
import BioDisplay from './components/BioDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import Footer from './components/Footer';

const MAX_GENERATIONS = 4;

const App: React.FC = () => {
  const [bios, setBios] = useState<string[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generationCount, setGenerationCount] = useState<number>(0);
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);

  const handleGenerationRequest = async (userData: UserData, isInitial: boolean) => {
    const currentCount = isInitial ? 0 : generationCount;
    if (currentCount >= MAX_GENERATIONS) {
      setError("You have reached the maximum number of generations for this prompt.");
      return;
    }

    if (isInitial) {
      setCurrentUserData(userData);
      setBios([]);
      setSources([]);
      setError(null);
    }

    setIsLoading(true);
    setError(null);

    try {
      const { bios: generatedBios, sources: groundingSources } = await generateBio(userData);
      setBios(generatedBios);
      setSources(groundingSources);
      setGenerationCount(currentCount + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate bio. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitialSubmit = (userData: UserData) => {
    handleGenerationRequest(userData, true);
  };
  
  const handleRegenerate = () => {
      if (currentUserData) {
          handleGenerationRequest(currentUserData, false);
      }
  };

  const generationsLeft = MAX_GENERATIONS - generationCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400 text-gray-800 flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mx-auto flex flex-col flex-grow">
        <Header />
        <main className="flex-grow bg-white/50 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-10 my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              {generationCount === 0 ? (
                <>
                  <h2 className="text-3xl font-bold mb-2 text-gray-900">Craft Your Perfect Bio</h2>
                  <p className="text-gray-700 mb-6">Tell us a bit about yourself, and our AI will create a stunning Instagram bio that captures your essence.</p>
                  <BioGeneratorForm onSubmit={handleInitialSubmit} isLoading={isLoading} />
                </>
              ) : (
                <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-2 text-gray-900">Want a fresh batch?</h2>
                    <p className="text-gray-700 mb-6">Click the button to generate a new set of bios based on your interests.</p>
                    <button
                        onClick={handleRegenerate}
                        disabled={isLoading || generationsLeft <= 0}
                        className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    >
                       {isLoading ? 'Generating...' : '🚀 Regenerate Bios'}
                    </button>
                    <p className="text-sm text-gray-600 mt-4">
                        {generationsLeft > 0 
                            ? `You have ${generationsLeft} ${generationsLeft === 1 ? 'generation' : 'generations'} left.`
                            : "You've reached the generation limit for this prompt."}
                    </p>
                </div>
              )}
            </div>
            <div className="bg-white/70 rounded-2xl p-6 shadow-inner min-h-[300px] flex flex-col justify-center">
              {isLoading && <LoadingSpinner />}
              {error && <div className="text-center text-red-600 font-medium">{error}</div>}
              {!isLoading && !error && bios.length > 0 && <BioDisplay bios={bios} sources={sources} />}
              {!isLoading && !error && bios.length === 0 && (
                <div className="text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Your generated bios will appear here!
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;