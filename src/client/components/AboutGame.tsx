import React from 'react';
import { TopNavigation } from './TopNavigation';

interface AboutGameProps {
  onClose: () => void;
}

export const AboutGame: React.FC<AboutGameProps> = ({ onClose }) => {
  // Dummy handlers for navigation
  const handleAboutGame = () => {
    // Already on about page, do nothing
  };

  const handleMyScore = () => {
    // In a real implementation, this would navigate to the score page
    console.log('My score clicked from about page');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden p-6">
      {/* Top Navigation */}
      <TopNavigation
        onAboutGame={handleAboutGame}
        onMyScore={handleMyScore}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-xl transition-colors duration-200"
      >
        ✖️
      </button>

      {/* Content */}
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">About Surprise Snoo</h1>
        
        <div className="text-6xl mb-6">🎮</div>

        <div className="space-y-6 text-left">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">🎯 What is this game?</h2>
            <p className="text-gray-600">
              Surprise Snoo is a fun, fast-paced clicking game where you interact with Reddit's mascot, Snoo! 
              Choose to either love or irritate Snoo and see how they react with animated emotions and surprise gifts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">🕹️ How to play</h2>
            <ul className="text-gray-600 space-y-1">
              <li>• Click "Love Snoo" ❤️ to make Snoo happy</li>
              <li>• Click "Irritate Snoo" 😤 to annoy Snoo</li>
              <li>• You have 10 seconds to click as much as you want</li>
              <li>• Watch Snoo's animated reactions in real-time</li>
              <li>• See what surprise gift Snoo gives you at the end!</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">📋 Rules</h2>
            <ul className="text-gray-600 space-y-1">
              <li>• Once you click a button, the other gets disabled</li>
              <li>• Click speed affects the feedback messages</li>
              <li>• Snoo might surprise you with quirky behavior!</li>
              <li>• Results depend on your final click counts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">🎁 Surprises</h2>
            <p className="text-gray-600">
              Snoo can give you different gifts and messages based on your choices:
            </p>
            <ul className="text-gray-600 space-y-1 mt-2">
              <li>• Love: Chocolate, cookies, or ice cream 🍫🍪🍦</li>
              <li>• Irritate: Trash, punches, or rotten fruit 🗑️👊🍎</li>
              <li>• Quirky: Camels, sheep, or llamas 🐪🐑🦙</li>
            </ul>
          </section>
        </div>

        <button
          onClick={onClose}
          className="mt-8 px-8 py-3 bg-orange-500 text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-colors duration-200"
        >
          Got it! Let's play! 🎮
        </button>
      </div>
    </div>
  );
};