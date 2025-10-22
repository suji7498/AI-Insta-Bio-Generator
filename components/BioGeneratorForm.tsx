
import React, { useState } from 'react';
import { UserData } from '../types';
import { GENDER_OPTIONS } from '../constants';

interface BioGeneratorFormProps {
  onSubmit: (data: UserData) => void;
  isLoading: boolean;
}

const BioGeneratorForm: React.FC<BioGeneratorFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState(GENDER_OPTIONS[0]);
  const [interests, setInterests] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !interests.trim()) {
      alert('Please fill out your name and interests.');
      return;
    }
    onSubmit({ name, gender, interests });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-800 mb-1">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Alex Rider"
          className="w-full px-4 py-2 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
          required
        />
      </div>
      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-800 mb-1">
          Gender
        </label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full px-4 py-2 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
        >
          {GENDER_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-gray-800 mb-1">
          Your Interests & Hobbies
        </label>
        <textarea
          id="interests"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          placeholder="e.g., travel, photography, coding, coffee enthusiast"
          rows={3}
          className="w-full px-4 py-2 bg-white/80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
      >
        {isLoading ? 'Generating...' : '✨ Generate Bio'}
      </button>
    </form>
  );
};

export default BioGeneratorForm;
