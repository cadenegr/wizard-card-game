'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createDeck, shuffleDeck, Card } from '@/lib/cards';
import CardComponent from '@/components/Card';
import GameTable from '@/components/GameTable';

export default function GamePage() {
  const [deck, setDeck] = useState<Card[]>(() => shuffleDeck(createDeck()));
  const [dealtCards, setDealtCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const dealNextCard = () => {
    if (currentCardIndex < deck.length) {
      const newCard = deck[currentCardIndex];
      setDealtCards(prev => [...prev, newCard]);
      setCurrentCardIndex(prev => prev + 1);
    }
  };

  const resetDeck = () => {
    const newDeck = shuffleDeck(createDeck());
    setDeck(newDeck);
    setDealtCards([]);
    setCurrentCardIndex(0);
  };

  const remainingCards = deck.length - currentCardIndex;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-8">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-serif font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-300">
            ✨ WIZARD ✨
          </h1>
          <p className="text-xl text-amber-200">Game Table</p>
          
          {/* Back to Home Button */}
          <div className="mt-4">
            <Link 
              href="/" 
              className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Stone Game Table */}
        <GameTable className="max-w-6xl mx-auto mb-8 mt-20">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
            
            {/* Deck Stack */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-serif text-amber-200 mb-4">Deck</h3>
              <div className="relative">
                {/* Stack effect - multiple card backs */}
                {remainingCards > 0 && (
                  <>
                    <CardComponent 
                      card={deck[0]} 
                      isRevealed={false} 
                      className="absolute top-1 left-1 opacity-30" 
                    />
                    <CardComponent 
                      card={deck[0]} 
                      isRevealed={false} 
                      className="absolute top-0.5 left-0.5 opacity-60" 
                    />
                    <CardComponent 
                      card={deck[0]} 
                      isRevealed={false} 
                      className="relative" 
                    />
                  </>
                )}
                {remainingCards === 0 && (
                  <div className="w-24 h-36 border-2 border-dashed border-stone-400 rounded-lg flex items-center justify-center">
                    <span className="text-stone-300 text-xs">Empty</span>
                  </div>
                )}
              </div>
              <p className="mt-2 text-stone-300 text-sm">
                {remainingCards} cards remaining
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-4">
              <button
                onClick={dealNextCard}
                disabled={remainingCards === 0}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 disabled:from-gray-600 disabled:to-gray-700 text-black font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {remainingCards > 0 ? '🎴 Deal Next Card' : 'Deck Empty'}
              </button>
              
              <button
                onClick={resetDeck}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🔄 Shuffle & Reset
              </button>
            </div>

            {/* Dealt Cards */}
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-serif text-amber-200 mb-4">Dealt Cards</h3>
              <div className="relative min-h-[144px] min-w-[96px]">
                {dealtCards.map((card, index) => (
                  <CardComponent
                    key={`${card.id}-${index}`}
                    card={card}
                    isRevealed={true}
                    className={`absolute transition-all duration-300 ${
                      index === dealtCards.length - 1 
                        ? 'top-0 left-0 z-10' 
                        : `top-${Math.min(index, 3)} left-${Math.min(index, 3)} opacity-${Math.max(30, 90 - index * 20)}`
                    }`}
                  />
                ))}
                {dealtCards.length === 0 && (
                  <div className="w-24 h-36 border-2 border-dashed border-amber-400/50 rounded-lg flex items-center justify-center">
                    <span className="text-amber-300 text-xs">No cards</span>
                  </div>
                )}
              </div>
              <p className="mt-2 text-stone-300 text-sm">
                {dealtCards.length} cards dealt
              </p>
            </div>
          </div>
        </GameTable>

        {/* Stats */}
        <div className="mt-12 bg-black/40 backdrop-blur-sm border border-purple-600/30 rounded-xl p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-serif text-gold-300 mb-4 text-center">Deck Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-blue-400 text-lg font-bold">
                {deck.filter(c => c.suit === 'blue').length - dealtCards.filter(c => c.suit === 'blue').length}
              </div>
              <div className="text-blue-300 text-sm">Blue Cards</div>
            </div>
            <div>
              <div className="text-red-400 text-lg font-bold">
                {deck.filter(c => c.suit === 'red').length - dealtCards.filter(c => c.suit === 'red').length}
              </div>
              <div className="text-red-300 text-sm">Red Cards</div>
            </div>
            <div>
              <div className="text-yellow-400 text-lg font-bold">
                {deck.filter(c => c.suit === 'yellow').length - dealtCards.filter(c => c.suit === 'yellow').length}
              </div>
              <div className="text-yellow-300 text-sm">Yellow Cards</div>
            </div>
            <div>
              <div className="text-green-400 text-lg font-bold">
                {deck.filter(c => c.suit === 'green').length - dealtCards.filter(c => c.suit === 'green').length}
              </div>
              <div className="text-green-300 text-sm">Green Cards</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}